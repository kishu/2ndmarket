import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectUrl'
})
export class ObjectUrlPipe implements PipeTransform {

  transform(value: File, ...args: any[]): string {
    return URL.createObjectURL(value);
  }

}
