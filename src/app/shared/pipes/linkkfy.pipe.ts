import { Pipe, PipeTransform } from '@angular/core';
import linkifyStr from 'linkifyjs/string';

@Pipe({
  name: 'linkkfy'
})
export class LinkkfyPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    return linkifyStr(value);
  }

}
