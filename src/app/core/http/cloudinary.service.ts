import * as sha1 from 'sha1';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from '@environments/environment';

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

  upload(file: File, rotate = 0, context = ''): Observable<HttpEvent<any>> {
    const cloudinary = environment.cloudinary;
    // https://cloudinary.com/documentation/upload_images#generating_authentication_signatures
    const eager = `f_auto,q_auto,w_720,a_${rotate},dpr_2.0,c_limit`;
    const eagerAsync = true;
    const timestamp = new Date().getTime();
    // Sort all the parameters in alphabetical order.
    const signature = `context=${context}&eager=${eager}&eager_async=${eagerAsync}&folder=${cloudinary.folder}&timestamp=${timestamp}${cloudinary.apiSecret}`;
    const fd = new FormData();
    fd.set('api_key', cloudinary.apiKey);
    fd.set('eager', eager);
    fd.set('eager_async', `${eagerAsync}`);
    fd.set('file', file);
    fd.set('folder', cloudinary.folder);
    fd.set('context', context);
    fd.set('timestamp', `${timestamp}`);
    fd.set('signature', sha1(signature));
    const request = new HttpRequest('POST', cloudinary.url, fd, this.httpRequestOptions);
    return this.http.request(request);
  }
}
