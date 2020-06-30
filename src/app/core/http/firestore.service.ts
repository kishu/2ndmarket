import { firestore } from 'firebase/app';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

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
  protected collection: AngularFirestoreCollection<Omit<T, 'id'>>;

  protected constructor(
    protected afs: AngularFirestore,
    @Inject(String) protected path: string) {
    this.collection = afs.collection(this.path);
  }

  public static serverTimestamp() {
    return firestore.FieldValue.serverTimestamp();
  }

  protected create(id: string, doc: unknown) {
    return this.collection.doc(id).set(doc);
  }

  protected add(doc: unknown) {
    return this.collection.add(doc as any);
  }

  public get(docId: string): Observable<T> {
    return this.collection.doc(docId)
      .snapshotChanges()
      .pipe(
        map(doc => {
          const id = doc.payload.id;
          const data = doc.payload.data() as object;
          return {id, ...data} as unknown as T;
        })
      );
  }

  public getAll(orderBy: [string, firestore.OrderByDirection?][]): Observable<T[]> {
    return this.query({ orderBy });
  }

  protected update(docId: string, doc: unknown) {
    return this.collection.doc(docId).update(doc);
  }

  public delete(docId: string) {
    return this.collection.doc(docId).delete();
  }

  protected query(options: QueryOptions): Observable<T[]> {
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
        return { id, ...data } as unknown as T;
      }))
    );
  }

}
