import * as sha1 from 'sha1';
import { merge, Observable, ReplaySubject, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ImageFileOrUrl, ImageType } from '@app/core/model';

// https://cloudinary.com/documentation/upload_images#uploading_with_a_direct_call_to_the_rest_api
// https://cloudinary.com/documentation/image_upload_api_reference

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  protected httpRequestOptions = {
    headers: new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest',
    }),
    reportProgress: true
  };

  constructor(private http: HttpClient) {
  }

  upload(imageFileOrUrls: ImageFileOrUrl[]): [Subject<any>, Subject<any>] {
    const uploadProgress$ = new ReplaySubject<any>();
    const uploadComplete$ = new ReplaySubject<any>();

    // if (imageFileOrUrls.length === 0) {
    //   uploadComplete$.next([]);
    //   uploadProgress$.complete();
    //   uploadComplete$.complete();
    //   return [uploadProgress$, uploadComplete$];
    // }

    let uploaded = 0;
    const uploadedUrls = Array(imageFileOrUrls.length);
    imageFileOrUrls.forEach((img, idx) => {
      if (img.type === ImageType.url) {
        uploadedUrls[idx] = img.value as string;
      }
    });
    const uploadRequests =
      imageFileOrUrls.filter(img => img.type === ImageType.file).map(i => this.getUploadRequest(i));

    merge(...uploadRequests)
      .pipe(
        tap(e => {
          if (e.type === HttpEventType.UploadProgress) {
            uploadProgress$.next({ loaded: e.loaded, total: e.total });
          }
        }),
        tap(e => {
          if (e.type === HttpEventType.Response) {
            imageFileOrUrls.forEach((img, idx) => {
              if (img.type === ImageType.file) {
                const file = img.value as File;
                if (file.name.startsWith(e.body.original_filename) && file.size === e.body.bytes) {
                  uploadedUrls[idx] = e.body.eager[0].secure_url;
                }
              }
            });
          }
        })
      )
      .subscribe(
        e => {
          if (e.type === HttpEventType.Response &&
            ++uploaded === uploadRequests.length) {
            uploadComplete$.next(uploadedUrls);
            uploadProgress$.complete();
            uploadComplete$.complete();
          }
        },
        () => {
          uploadProgress$.complete();
          uploadComplete$.complete();
        }
      );

    return [uploadProgress$, uploadComplete$];
  }

  // https://cloudinary.com/documentation/upload_images#generating_authentication_signatures
  getUploadRequest(imageFile: ImageFileOrUrl): Observable<HttpEvent<any>> {
    const cloudinary = environment.cloudinary;
    const eager = `f_auto,q_auto,w_375,a_${imageFile.rotate},dpr_3.0,c_limit`;
    const eagerAsync = true;
    const timestamp = new Date().getTime();
    const signature = `eager=${eager}&eager_async=${eagerAsync}&folder=${cloudinary.folder}&timestamp=${timestamp}${cloudinary.apiSecret}`; // Sort all the parameters in alphabetical order.
    const fd = new FormData ();
    fd.set('api_key', cloudinary.apiKey);
    fd.set('eager', eager);
    fd.set('eager_async', `${eagerAsync}`);
    fd.set('file', imageFile.value);
    fd.set('folder', cloudinary.folder);
    fd.set('timestamp', `${timestamp}`);
    fd.set('signature', sha1(signature));
    const request = new HttpRequest('POST', cloudinary.url, fd, this.httpRequestOptions);
    return this.http.request(request);
  }

}
