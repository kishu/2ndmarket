import { parse } from 'url-parser';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cloudinary'
})
export class CloudinaryPipe implements PipeTransform {

  transform(src: string, width?: number): unknown {
    // https://res.cloudinary.com/dhtyfa1la/image/upload/f_auto,q_auto,w_375,a_0,dpr_2.0,c_limit/v1594117721/dev/rprc40qi9n0vqkwe6jto.jpg
    // https://res.cloudinary.com/dhtyfa1la/image/upload/v1597140528/dev/myyy0q3iwtreqyhi1b1f.jpg
    if (!width) {
      return src;
    }

    const origin = parse(src);
    const pathnames = origin.pathname.split('/');
    const options = pathnames[4].split(',');
    const wIdx = options.findIndex(o => o.startsWith('w_'));
    if (wIdx > -1 ) {
      options[wIdx] = `w_${width}`;
    } else {
      options.push(`w_${width}`);
    }
    pathnames[4] = options.join(',');
    src = `${origin.protocol}//${origin.host}${pathnames.join('/')}`;

    return src;
  }

}
