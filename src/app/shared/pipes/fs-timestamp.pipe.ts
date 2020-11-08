import firestore from 'firebase/firebase-firestore';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fsTimestamp'
})
export class FsTimestampPipe implements PipeTransform {
  transform(value: firestore.Timestamp, args?: any): Date {
    if (value) {
      return value.toDate();
    } else {
      return new Date();
    }
  }

}
