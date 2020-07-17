import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { firestore } from 'firebase/app';
import { Inject, Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

export interface QueryOptions {
  where?: [string, firestore.WhereFilterOp, any][];
  orderBy?: [string, firestore.OrderByDirection?][];
  limit?: number;
  startAt?: any;
  startAfter?: any;
  endAt?: any;
  endBefore?: any;
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

  public createId() {
    return this.afs.createId();
  }

  protected getDocRef(id: string) {
    return this.collection.doc(id).ref;
  }

  protected create(id: string, doc: unknown) {
    return this.collection.doc(id).set(doc);
  }

  protected add(doc: unknown) {
    return this.collection.add(doc as any);
  }

  public get(docId: string): Observable<T> {
    return this.afs.doc<T>(`${this.path}/${docId}`)
      .get()
      .pipe(
        map(d => ({ id: d.id, ...d.data() } as unknown as T))
      );
  }

  public snapshotChanges(docId: string): Observable<T | undefined> {
    return this.afs.doc<T>(`${this.path}/${docId}`)
      .snapshotChanges()
      .pipe(
        map(action => {
          if (action.payload.exists) {
            return ({ id: action.payload.id, ...action.payload.data() });
          } else {
            return undefined;
          }
        })
      );
  }

  public valueChanges(docId: string): Observable<T | undefined> {
    return this.afs.doc<T>(`${this.path}/${docId}`)
      .valueChanges()
      .pipe(
        map(change => {
          if (change) {
            return ({ id: docId, ...change });
          } else {
            return change;
          }
        })
      );
  }

  protected update(docId: string, doc: unknown) {
    return this.collection.doc(docId).update(doc);
  }

  public delete(docId: string) {
    return this.collection.doc(docId).delete();
  }

  protected snapshotChangesQuery(options: QueryOptions): Observable<T[]> {
    // @ts-ignore
    return this.query(options).snapshotChanges().pipe(
      // map(actions => actions.filter(a => !a.payload.doc.metadata.fromCache)),
      // filter(actions => actions.length > 0),
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as T;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  protected valueChangesQuery(options: QueryOptions): Observable<T[]> {
    // @ts-ignore
    return this.query(options).valueChanges({ idField: 'id' });
  }

  protected getQuery(options: QueryOptions): Observable<T[]> {
    return this.query(options).get().pipe(
      map(qs => qs.docs.map(doc => ({ id: doc.id, ...doc.data()} as unknown as T)))
    );
  }

  protected query(options: QueryOptions): AngularFirestoreCollection {
    return this.afs.collection(this.path, ref => {
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
    });
  }

}
