import * as sha1 from 'sha1';
import { parse } from 'url-parser';
import { forkJoin, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpProgressEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { DraftImage } from '@app/core/model';

// https://cloudinary.com/documentation/upload_images#uploading_with_a_direct_call_to_the_rest_api
// https://cloudinary.com/documentation/image_upload_api_reference

@Injectable({
  providedIn: 'root'
})
export class CloudinaryUploadService {

  constructor(private http: HttpClient) {
  }

  // https://cloudinary.com/documentation/upload_images#generating_authentication_signatures
  private request({ file, rotate, context }: Partial<DraftImage>): Observable<HttpEvent<any>> {
    const httpRequestOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
      }),
      reportProgress: true
    };
    const cloudinary = environment.cloudinary;
    const folder = cloudinary.folder;
    const eager = `f_auto,q_70,w_375,a_${rotate},dpr_2.0,c_limit`;
    const eagerAsync = true;
    const timestamp = Date.now();
    // Sort all the parameters in alphabetical order.
    const signature = `context=${context}&eager=${eager}&eager_async=${eagerAsync}&folder=${cloudinary.folder}&timestamp=${timestamp}${cloudinary.apiSecret}`;
    const formData = new FormData ();
    formData.set('api_key', cloudinary.apiKey);
    formData.set('context', context);
    formData.set('eager', eager);
    formData.set('eager_async', `${eagerAsync}`);
    formData.set('file', file);
    formData.set('folder', folder);
    formData.set('timestamp', `${timestamp}`);
    formData.set('signature', sha1(signature));
    return this.http.request(new HttpRequest(
      'POST',
      `${cloudinary.url}/image/upload`,
      formData,
      httpRequestOptions)
    );
  }

  private update({src, rotate}: Partial<DraftImage>) {
    // 'https://res.cloudinary.com/dhtyfa1la/image/upload/f_auto,q_auto,w_375,a_0,dpr_2.0,c_limit/v1594117721/dev/rprc40qi9n0vqkwe6jto.jpg'
    if (rotate > 0) {
      const origin = parse(src);
      const pathnames = origin.pathname.split('/');
      const options = pathnames[4]?.split(',');
      if (options[3]?.startsWith('a_')) {
        const originalRotate = parseInt(options[3].replace('a_', ''), 10);
        options[3] = `a_${(originalRotate + rotate) % 360}`;
        pathnames[4] = options.join(',');
      }
      src = `${origin.protocol}//${origin.host}${pathnames.join('/')}`;
    }
    return of(src);
  }

  upload(draftImages: DraftImage[]): [Subject<HttpProgressEvent>, Subject<string[]>] {
    const uploadProgress$ = new ReplaySubject<HttpProgressEvent>();
    const uploadComplete$ = new ReplaySubject<string[]>();
    forkJoin(
      draftImages.map(draft => {
        if (draft.isFile) {
          return this.request(draft).pipe(
            tap(e => {
              if (e.type === HttpEventType.UploadProgress) {
                uploadProgress$.next(e as HttpProgressEvent);
              }
            })
          );
        } else {
          return this.update(draft);
        }
      })
    ).subscribe( (responses: (HttpResponse<any> | string)[]) => {
      uploadComplete$.next(
        responses.map(res => {
          if (res instanceof HttpResponse) {
            return res.body.eager[0].secure_url;
          } else if (typeof res === 'string') {
            return res;
          } else {
            return null;
          }
        }).filter(src => src !== null)
      );
      uploadProgress$.complete();
      uploadComplete$.complete();
    }, err => {
      alert(err);
    });
    return [uploadProgress$, uploadComplete$];
  }

}

