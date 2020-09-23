import { Pipe, PipeTransform } from '@angular/core';
import { GoodsPurchased } from '@app/core/model';

@Pipe({
  name: 'goodsPurchased'
})
export class GoodsPurchasedPipe implements PipeTransform {

  transform(purchased: GoodsPurchased | string): string {
    switch (purchased) {
      case GoodsPurchased.unknown:
        purchased = '모름';
        break;
      case GoodsPurchased.week:
        purchased = '일주일 이내';
        break;
      case GoodsPurchased.month:
        purchased = '한 달 이내';
        break;
      case GoodsPurchased.threeMonth:
        purchased = '3 개월 이내';
        break;
      case GoodsPurchased.year:
        purchased = '1 년 이내';
        break;
      case GoodsPurchased.longAgo:
        purchased = '오래전';
        break;
    }
    return purchased;
  }

}
