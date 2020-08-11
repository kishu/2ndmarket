import { Pipe, PipeTransform } from '@angular/core';
import { GoodsPurchased } from '@app/core/model';

@Pipe({
  name: 'goodsPurchased'
})
export class GoodsPurchasedPipe implements PipeTransform {

  transform(purchased: GoodsPurchased | string): string {
    switch (purchased) {
      case GoodsPurchased.unknown:
        purchased = '구매시기모름';
        break;
      case GoodsPurchased.week:
        purchased = '일주일미만사용';
        break;
      case GoodsPurchased.month:
        purchased = '한달미만사용';
        break;
      case GoodsPurchased.threeMonth:
        purchased = '3개월사용';
        break;
      case GoodsPurchased.year:
        purchased = '1년사용';
        break;
      case GoodsPurchased.longAgo:
        purchased = '언제샀는지기억도안남';
        break;
    }
    return purchased;
  }

}
