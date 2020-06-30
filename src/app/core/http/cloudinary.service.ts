import * as sha1 from 'sha1';
import { merge, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { DraftImage } from '@app/core/model';

// https://cloudinary.com/documentation/upload_images#uploading_with_a_direct_call_to_the_rest_api
// https://cloudinary.com/documentation/image_upload_api_reference

export interface UploadProgress {
  loaded: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  constructor(private http: HttpClient) {
  }

  // https://cloudinary.com/documentation/upload_images#generating_authentication_signatures
  private getUploadRequest(image: DraftImage): Observable<HttpEvent<any>> {
    const httpRequestOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
      }),
      reportProgress: true
    };
    const cloudinary = environment.cloudinary;
    const folder = cloudinary.folder;
    const eager = `f_auto,q_auto,w_375,a_${image.rotate},dpr_2.0,c_limit`;
    const eagerAsync = false;
    const timestamp = Date.now();
    // Sort all the parameters in alphabetical order.
    const signature = `context=${image.context}&eager=${eager}&eager_async=${eagerAsync}&folder=${cloudinary.folder}&timestamp=${timestamp}${cloudinary.apiSecret}`;
    const fd = new FormData ();
    fd.set('api_key', cloudinary.apiKey);
    fd.set('context', image.context);
    fd.set('eager', eager);
    fd.set('eager_async', `${eagerAsync}`);
    fd.set('file', image.file);
    fd.set('folder', folder);
    fd.set('timestamp', `${timestamp}`);
    fd.set('signature', sha1(signature));
    const request = new HttpRequest('POST', `${cloudinary.url}/image/upload`, fd, httpRequestOptions);
    return this.http.request(request);
  }

  private getUpdateRequest() {

  }

  upload2(draftImages: DraftImage[]) {
    const upload$ = new Subject<string[]>();
    const uploadRequests = draftImages.length > 0 ?
      draftImages.filter(img => img.isFile).map(img => this.getUploadRequest(img)) :
      [ of(null).pipe(tap(() => upload$.complete())) ];

    merge(...uploadRequests).subscribe(e => {
      if (e.type === HttpEventType.Response) {
        draftImages = draftImages.map(img => {
          if (img.isFile &&
            img.file.name === `${e.body.original_filename}.${e.body.original_extension}` &&
            img.file.size === e.body.bytes) {
            img.isFile = false;
            img.src = e.body.eager[0].secure_url;
          }
          return img;
        });
        const uploadImages = draftImages.filter(img => !img.isFile).map(img => img.src);
        upload$.next(uploadImages);
        if (uploadImages.length === uploadRequests.length) {
          upload$.complete();
        }
      }
    });

    return upload$;
  }

  upload(draftImages: DraftImage[]): [Subject<UploadProgress>, Subject<string[]>] {
    const uploadProgress$ = new ReplaySubject<UploadProgress>();
    const uploadComplete$ = new ReplaySubject<string[]>();
    const uploadRequests = draftImages.length > 0 ?
      draftImages.filter(img => img.isFile).map(img => this.getUploadRequest(img)) :
      [ of(null) ];

    const completeAll = () => {
      uploadProgress$.complete();
      uploadComplete$.complete();
    };

    merge(...uploadRequests)
    .pipe(
      tap(e => {
        if (e.type === HttpEventType.UploadProgress) {
          uploadProgress$.next({ loaded: e.loaded, total: e.total });
        }
      }),
      tap(e => {
        if (e.type === HttpEventType.Response) {
          draftImages = draftImages.map(img => {
            if (img.isFile &&
                img.file.name === `${e.body.original_filename}.${e.body.original_extension}` &&
                img.file.size === e.body.bytes) {
              img.src = e.body.eager[0].secure_url;
            }
            return img;
          });
          uploadComplete$.next(
            draftImages.filter(img => img.src).map(img => img.src)
          );
        }
      })
    ).subscribe(e => {
      if (e.type === HttpEventType.Response && draftImages.every(img => img.src)) {
        completeAll();
      }
    }, () => {
      completeAll();
    }, () => {
      completeAll();
    });

    return [uploadProgress$, uploadComplete$];
  }

}
