import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectUrl'
})
export class ObjectUrlPipe implements PipeTransform {

  transform(value: File | string, ...args: any[]): string {
    if (typeof value === 'string') {
      return value;
    } else {
      return URL.createObjectURL(value);
    }
  }

}
