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
        condition = '거의 새 상품';
        break;
      case GoodsCondition.used:
        condition = '사용감 있음';
        break;
    }
    return condition;
  }

}
