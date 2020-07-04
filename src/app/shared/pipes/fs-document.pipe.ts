import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pipe, PipeTransform } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Pipe({
  name: 'fsDocument'
})
export class FsDocumentPipe implements PipeTransform {
  constructor(private afs: AngularFirestore) { }
  transform(id: string, ...args: unknown[]): Observable<any> {
    const collection = args[0];
    return this.afs.doc(`${collection}/${id}`).get().pipe(
      map(ref => ({ id: ref.id, ...ref.data() }))
    );
  }

}
