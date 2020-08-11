import { Pipe, PipeTransform } from '@angular/core';
import { GoodsCondition } from '@app/core/model';

@Pipe({
  name: 'goodsCondition'
})
export class GoodsConditionPipe implements PipeTransform {
  transform(condition: GoodsCondition | string): string {
    switch (condition) {
      case GoodsCondition.boxed:
        condition = '미개봉';
        break;
      case GoodsCondition.almostNew:
        condition = '민트급';
        break;
      case GoodsCondition.used:
        condition = '사용감있음';
        break;
    }
    return condition;
  }

}
