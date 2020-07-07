import * as sha1 from 'sha1';
import { merge, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { DraftImage } from '@app/core/model';

// https://cloudinary.com/documentation/upload_images#uploading_with_a_direct_call_to_the_rest_api
// https://cloudinary.com/documentation/image_upload_api_reference

interface UploadProgress {
  loaded: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CloudinaryUploadService {

  constructor(private http: HttpClient) {
  }

  private hashDraft(draftImage: DraftImage) {
    if (draftImage.isFile) {
      const filename = draftImage.file.name.split('.').slice(0, -1).join('.');
      const size = draftImage.file.size;
      return sha1(`filename=${filename}&size=${size}`);
    } else {
      return sha1(`src=${draftImage.src}`);
    }
  }

  private hashResponse(body: any) {
    return sha1(`filename=${body.original_filename}&size=${body.bytes}`)
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
    const eager = `f_auto,q_auto,w_375,a_${rotate},dpr_2.0,c_limit`;
    const eagerAsync = true;
    const timestamp = Date.now();
    // Sort all the parameters in alphabetical order.
    const signature = `context=${context}&eager=${eager}&eager_async=${eagerAsync}&folder=${cloudinary.folder}&timestamp=${timestamp}${cloudinary.apiSecret}`;
    const fd = new FormData ();
    fd.set('api_key', cloudinary.apiKey);
    fd.set('context', context);
    fd.set('eager', eager);
    fd.set('eager_async', `${eagerAsync}`);
    fd.set('file', file);
    fd.set('folder', folder);
    fd.set('timestamp', `${timestamp}`);
    fd.set('signature', sha1(signature));
    const request = new HttpRequest('POST', `${cloudinary.url}/image/upload`, fd, httpRequestOptions);
    return this.http.request(request);
  }

  upload(draftImages: DraftImage[]): [Subject<UploadProgress>, Subject<string[]>] {
    const uploadProgress$ = new Subject<UploadProgress>();
    const uploadComplete$ = new Subject<string[]>();
    const draftImageMap = new Map<string, string>();
    draftImages.forEach(draft => {
      draftImageMap.set(
        this.hashDraft(draft),
        draft.isFile ? '' : draft.src
      );
    });
    draftImageMap.forEach(v => console.log(v));
    const t0 = performance.now();
    merge(
      draftImages.filter(draft => draft.isFile).map(draft => {
        console.log(draft.file.name)
        return this.request(draft);
      })
    ).subscribe( (e:any) => {
      if (e.type === HttpEventType.UploadProgress) {
        console.log('pipe', e)
        uploadProgress$.next(e);
      }
      if (e.type === HttpEventType.Response) {
        console.log('subscribe', e.body.original_filename);
        draftImageMap.set(this.hashResponse(e.body), e.body.eager[0].secure_url);
      }
    }, err => {
      alert(err);
    }, () => {
      const t1 = performance.now();
      console.log('compleate', (t1 - t0) + " milliseconds.");
      uploadComplete$.next(Array.from(draftImageMap.values()));
      uploadProgress$.complete();
      uploadComplete$.complete();
    });
    return [uploadProgress$, uploadComplete$];
  }


  /*
   *
   */
  //___upload___(draftImages: DraftImage[]) {
    // const upload$ = new Subject<string[]>();
    // const uploadRequests = draftImages.length > 0 ?
    //   draftImages.filter(img => img.isFile).map(img => this.upload(img)) :
    //   [ of(null).pipe(tap(() => upload$.complete())) ];
    //
    // merge(...uploadRequests).subscribe(e => {
    //   if (e.type === HttpEventType.Response) {
    //     draftImages = draftImages.map(img => {
    //       if (img.isFile &&
    //         img.file.name.startsWith(e.body.original_filename) &&
    //         img.file.size === e.body.bytes) {
    //         img.isFile = false;
    //         img.src = e.body.eager[0].secure_url;
    //       }
    //       return img;
    //     });
    //     const uploadImages = draftImages.filter(img => !img.isFile).map(img => {
    //       return img.src
    //     });
    //     upload$.next(uploadImages);
    //     if (uploadImages.length === uploadRequests.length) {
    //       upload$.complete();
    //     }
    //   }
    // });
    //
    // return upload$;
  //}

  /*
   * @deprecated
   */
  //__upload__(draftImages: DraftImage[]): [Subject<UploadProgress>, Subject<string[]>] {
    // const uploadProgress$ = new ReplaySubject<UploadProgress>();
    // const uploadComplete$ = new ReplaySubject<string[]>();
    // const uploadRequests = draftImages.length > 0 ?
    //   draftImages.filter(img => img.isFile).map(img => this.upload(img)) :
    //   [ of(null) ];
    //
    // const completeAll = () => {
    //   uploadProgress$.complete();
    //   uploadComplete$.complete();
    // };
    //
    // merge(...uploadRequests)
    //   .pipe(
    //     tap(e => {
    //       if (e.type === HttpEventType.UploadProgress) {
    //         uploadProgress$.next({ loaded: e.loaded, total: e.total });
    //       }
    //     }),
    //     tap(e => {
    //       if (e.type === HttpEventType.Response) {
    //         draftImages = draftImages.map(img => {
    //           if (img.isFile &&
    //             img.file.name === `${e.body.original_filename}.${e.body.original_extension}` &&
    //             img.file.size === e.body.bytes) {
    //             img.src = e.body.eager[0].secure_url;
    //           }
    //           return img;
    //         });
    //         uploadComplete$.next(
    //           draftImages.filter(img => img.src).map(img => img.src)
    //         );
    //       }
    //     })
    //   ).subscribe(e => {
    //   if (e.type === HttpEventType.Response && draftImages.every(img => img.src)) {
    //     completeAll();
    //   }
    // }, () => {
    //   completeAll();
    // }, () => {
    //   completeAll();
    // });
    //
    // return [uploadProgress$, uploadComplete$];
  //}

}

