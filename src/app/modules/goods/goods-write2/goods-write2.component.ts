import * as faker from 'faker';
import { Observable, of, zip } from 'rxjs';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AuthService, CloudinaryService, GoodsService, GroupsService } from '@app/core/http';
import { Goods, GoodsCondition, GoodsPurchased, GoodsShipping, ImageFileOrUrl, ImageType, NewGoods } from '@app/core/model';

@Component({
  selector: 'app-goods-write2',
  templateUrl: './goods-write2.component.html',
  styleUrls: ['./goods-write2.component.scss']
})
export class GoodsWrite2Component implements OnInit {
  submitting = false;
  goods$: Observable<NewGoods>;
  uploadProgress: { loaded: number, total: number };
  constructor(
    private router: Router,
    private authService: AuthService,
    private groupService: GroupsService,
    private goodsService: GoodsService,
    private cloudinaryService: CloudinaryService
  ) {
    this.goods$ = zip(this.authService.user$, this.authService.group$)
      .pipe(
        map(([u, g]) => ({
          userId: u.id,
          groupRef: this.groupService.getDocRef(g.id),
          name: faker.commerce.productName(),
          shared: false,
          purchased: GoodsPurchased.week,
          condition: GoodsCondition.almostNew,
          price: faker.commerce.price(),
          shipping: GoodsShipping.delivery,
          images: [],
          contact: faker.phone.phoneNumber(),
          memo: faker.lorem.paragraphs(),
          soldOut: false,
          favoriteUserIds: [],
          commentsCnt: 0,
          created: GoodsService.serverTimestamp(),
          updated: GoodsService.serverTimestamp()
        })),
        switchMap((g: NewGoods) => of(g))
      );
  }

  ngOnInit(): void {
  }

  onSubmit({goods, imageFileOrUrls}: {goods: Partial<Goods>, imageFileOrUrls: ImageFileOrUrl[] }) {
    if (this.submitting) {
      return;
    }

    this.submitting = true;
    const [uploadProgress$, uploadComplete$] = this.cloudinaryService.upload(imageFileOrUrls);

    uploadProgress$.subscribe(v => {
      this.uploadProgress = v;
    });

    uploadComplete$
      .pipe(
        map(imageUrls => ({
          ...goods,
          images: imageUrls,
        } as NewGoods)),
        switchMap(g => this.goodsService.add(g))
      )
      .subscribe(
        (r) => {
          this.router.navigate(['goods']);
        },
        err => alert(err)
      );
  }

}
