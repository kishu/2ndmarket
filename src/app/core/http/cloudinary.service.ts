import * as sha1 from 'sha1';
import { merge, Observable, ReplaySubject, Subject, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ImageFile } from '@app/core/model';
import { tap } from 'rxjs/operators';

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

  upload(imageFiles: ImageFile[]): [Subject<any>, Subject<any>] {
    let uploaded = 0;

    const uploadedUrls = Array(imageFiles.length);
    const uploadProgress$ = new ReplaySubject<any>();
    const uploadComplete$ = new ReplaySubject<any>();

    const uploadRequests = imageFiles.map(img => this.getUploadRequest(img.file, img.rotate));

    merge(...uploadRequests)
      .pipe(
        tap(e => {
          if (e.type === HttpEventType.UploadProgress) {
            uploadProgress$.next({ loaded: e.loaded, total: e.total });
          }
        }),
        tap(e => {
          if (e.type === HttpEventType.Response) {
            const imageFileIdx = imageFiles.findIndex(img => {
              return img.file.name.startsWith(e.body.original_filename) &&
                 img.file.size === e.body.bytes;
            });
            if (imageFileIdx === -1) {
              throwError('no image file index');
            } else {
              uploadedUrls[imageFileIdx] = e.body.eager[0].secure_url;
            }
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
  getUploadRequest(file: File, rotate = 0): Observable<HttpEvent<any>> {
    const cloudinary = environment.cloudinary;
    const eager = `f_auto,q_auto,w_375,a_${rotate},dpr_3.0,c_limit`;
    const eagerAsync = true;
    const timestamp = new Date().getTime();
    const signature = `eager=${eager}&eager_async=${eagerAsync}&folder=${cloudinary.folder}&timestamp=${timestamp}${cloudinary.apiSecret}`; // Sort all the parameters in alphabetical order.
    const fd = new FormData ();
    fd.set('api_key', cloudinary.apiKey);
    fd.set('eager', eager);
    fd.set('eager_async', `${eagerAsync}`);
    fd.set('file', file);
    fd.set('folder', cloudinary.folder);
    fd.set('timestamp', `${timestamp}`);
    fd.set('signature', sha1(signature));
    const request = new HttpRequest('POST', cloudinary.url, fd, this.httpRequestOptions);
    return this.http.request(request);
  }

}
