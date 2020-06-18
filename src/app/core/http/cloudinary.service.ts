import * as sha1 from 'sha1';
import { merge, Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ImageFile } from '@app/core/model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  // https://cloudinary.com/documentation/upload_images#uploading_with_a_direct_call_to_the_rest_api
  protected httpRequestOptions = {
    headers: new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest',
    }),
    reportProgress: true
  };

  constructor(private http: HttpClient) {
  }

  upload(imageFiles: ImageFile[]): Subject<any> {
    console.log(imageFiles);
    let uploaded = 0;
    const upload$ = new Subject<any>();
    merge(imageFiles.map((i, idx) => this.getUploadRequest(i.file, i.rotate, { order: i })))
      .pipe(
        tap((e: any) => {
          if (e.type === HttpEventType.UploadProgress) {
            console.log('upload-progress222', e.loaded, e.total, e);
            upload$.next(e);
            // this.uploadedProgress = Math.round(100 * e.loaded / e.total);
          } else if (e.type === HttpEventType.Response) {
            uploaded = uploaded + 1;
            console.log('upload-response', uploaded, e);
            upload$.next(e);
          }
        })
      )
    .subscribe(
      (r) => {
        if (uploaded === imageFiles.length) {
          // console.log('r', r, uploaded, imageFiles.length);
        }
      },
      (err) => console.log('err', err)
    );
    return upload$;
  }

  // https://cloudinary.com/documentation/upload_images#generating_authentication_signatures
  getUploadRequest(file: File, rotate = 0, context = {}): Observable<HttpEvent<any>> {
    const cloudinary = environment.cloudinary;
    const eager = `f_auto,q_auto,w_720,a_${rotate},dpr_2.0,c_limit`;
    const contextStr = JSON.stringify(context);
    const eagerAsync = true;
    const timestamp = new Date().getTime();
    const signature = `context=${contextStr}&eager=${eager}&eager_async=${eagerAsync}&folder=${cloudinary.folder}&timestamp=${timestamp}${cloudinary.apiSecret}`; // Sort all the parameters in alphabetical order.
    const fd = new FormData ();
    fd.set('api_key', cloudinary.apiKey);
    fd.set('eager', eager);
    fd.set('eager_async', `${eagerAsync}`);
    fd.set('file', file);
    fd.set('folder', cloudinary.folder);
    fd.set('context', contextStr);
    fd.set('timestamp', `${timestamp}`);
    fd.set('signature', sha1(signature));
    const request = new HttpRequest('POST', cloudinary.url, fd, this.httpRequestOptions);
    return this.http.request(request);
  }
}
