import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

@Pipe({
  name: 'formatDistanceToNow'
})
export class FormatDistanceToNowPipe implements PipeTransform {
  constructor() {}

  transform(value: any, args?: any): any {
    if (value) {
      return formatDistanceToNow(value, { locale: ko });
    }
  }

}
