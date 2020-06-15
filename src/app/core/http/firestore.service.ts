import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';

export interface QueryOptions {
  where?: [string, firestore.WhereFilterOp, any][];
  orderBy?: [string, firestore.OrderByDirection?][];
  limit?: number;
  startAt?: firestore.DocumentSnapshot;
  startAfter?: firestore.DocumentSnapshot;
  endAt?: firestore.DocumentSnapshot;
  endBefore?: firestore.DocumentSnapshot;
}

@Injectable({
  providedIn: 'root'
})
export abstract class FirestoreService<T> {
  protected collection: AngularFirestoreCollection<any>;

  protected constructor(
    protected afs: AngularFirestore,
    @Inject(String) protected path: string) {
    this.collection = afs.collection<any>(this.path);
  }

  public static serverTimestamp() {
    return firestore.FieldValue.serverTimestamp();
  }

  public create(id: string, doc: Partial<T>) {
    return this.collection.doc(id).set(doc);
  }

  public add(doc: Partial<T>) {
    return this.collection.add(doc);
  }

  public getDocRef(docId: string) {
    return this.afs.doc(`${this.path}/${docId}`).ref;
  }

  public get(docId: string): Observable<T> {
    return this.collection.doc(docId)
      .snapshotChanges()
      .pipe(
        map(a => {
          if (a.payload.exists) {
            const id = a.payload.id;
            const data = a.payload.data();
            // @ts-ignore
            return {id, ...data} as T;
          } else {
            return null;
          }
        })
      );
  }

  public getAll(orderBy: [string, firestore.OrderByDirection?][]) {
    return this.query({ orderBy });
  }

  public update(docId: string, doc: Partial<T>) {
    return this.collection.doc(docId).update(doc);
  }

  public delete(docId: string) {
    return this.collection.doc(docId).delete();
  }

  protected query(options: QueryOptions) {
    return this.afs.collection<T>(this.collection.ref, ref => {
      let query: firestore.CollectionReference | firestore.Query = ref;
      if (options.where) {
        options.where.forEach(w => {
          query = query.where(w[0], w[1], w[2]);
        });
      }
      if (options.orderBy) {
        options.orderBy.forEach(o => {
          if (o.length === 1) {
            query = query.orderBy(o[0]);
          } else {
            query = query.orderBy(o[0], o[1]);
          }
        });
      }
      if (options.limit) {
        query = query.limit(options.limit);
      }
      if (options.startAt) {
        query = query.startAt(options.startAt);
      }
      if (options.startAfter) {
        query = query.startAfter(options.startAfter);
      }
      if (options.endAt) {
        query = query.endAt(options.endAt);
      }
      if (options.endBefore) {
        query = query.endBefore(options.endBefore);
      }
      return query;
    }).snapshotChanges().pipe(
      map( actions => actions.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data();
        return { id, ...data };
      }))
    );
  }

}
