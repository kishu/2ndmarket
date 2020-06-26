import * as sha1 from 'sha1';
import { merge, Observable, ReplaySubject, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ImageFile, ImageFileOrUrl, UploadedImage } from '@app/core/model';

// https://cloudinary.com/documentation/upload_images#uploading_with_a_direct_call_to_the_rest_api
// https://cloudinary.com/documentation/image_upload_api_reference

export interface UploadProgress {
  loaded: number,
  total: number,
}

export type UploadComplete = UploadedImage;


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

  upload(folder: string, imageFiles: ImageFile[]): [Subject<UploadProgress>, Subject<UploadComplete>] {
    const uploadProgress$ = new ReplaySubject<UploadProgress>();
    const uploadComplete$ = new ReplaySubject<UploadComplete>();

    let uploadedCnt = 0;
    const uploadRequests = imageFiles.map(i => this.getUploadRequest(folder, i));

    merge(...uploadRequests)
      .pipe(
        tap(e => {
          if (e.type === HttpEventType.UploadProgress) {
            uploadProgress$.next({ loaded: e.loaded, total: e.total });
          }
        }),
        tap(e => {
          if (e.type === HttpEventType.Response) {
            uploadedCnt = uploadedCnt + 1;
            uploadComplete$.next({
              filename: e.body.original_filename,
              size: e.body.bytes,
              url: e.body.eager[0].secure_url
            });
          }
        })
      )
      .subscribe(
        e => {
          if (e.type === HttpEventType.Response && uploadRequests.length === uploadedCnt) {
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
  getUploadRequest(folder: string, imageFile: ImageFileOrUrl): Observable<HttpEvent<any>> {
    const cloudinary = environment.cloudinary;
    folder = `${cloudinary.folder}/${folder}`;
    const eager = `f_auto,q_auto,w_375,a_${imageFile.rotate},dpr_2.0,c_limit`;
    const eagerAsync = true;
    const timestamp = new Date().getTime();
    const signature = `eager=${eager}&eager_async=${eagerAsync}&folder=${folder}&timestamp=${timestamp}${cloudinary.apiSecret}`; // Sort all the parameters in alphabetical order.
    const fd = new FormData ();
    fd.set('api_key', cloudinary.apiKey);
    fd.set('eager', eager);
    fd.set('eager_async', `${eagerAsync}`);
    fd.set('file', imageFile.value);
    fd.set('folder', folder);
    fd.set('timestamp', `${timestamp}`);
    fd.set('signature', sha1(signature));
    const request = new HttpRequest('POST', cloudinary.url, fd, this.httpRequestOptions);
    return this.http.request(request);
  }

}
