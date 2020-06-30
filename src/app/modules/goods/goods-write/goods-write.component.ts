import * as faker from 'faker';
faker.locale = 'ko';
import { forkJoin, Observable, of } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService, CloudinaryService, GoodsService, ProfilesService } from '@app/core/http';
import { GoodsCondition, GoodsPurchased, GoodsShipping, NewGoods } from '@app/core/model';

@Component({
  selector: 'app-goods-write',
  templateUrl: './goods-write.component.html',
  styleUrls: ['./goods-write.component.scss']
})
export class GoodsWriteComponent implements OnInit {
  submitting = false;
  goods$: Observable<NewGoods>;
  constructor(
    private router: Router,
    private location: Location,
    private authService: AuthService,
    private goodsService: GoodsService,
    private profilesService: ProfilesService,
    private cloudinaryService: CloudinaryService
  ) {
    this.goods$ = forkJoin([
      this.authService.user$.pipe(first(), filter(u => !!u)),
      this.authService.profile$.pipe(first(), filter(p => !!p))
    ]).pipe(
      map(([u, p]) => ({
        userId: u.id,
        groupId: p.groupId,
        profileId: p.id,
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
        favoritesCnt: 0,
        commentsCnt: 0,
        activated: true,
        created: GoodsService.serverTimestamp(),
        updated: GoodsService.serverTimestamp(),
        processing: true
      })),
      switchMap((g: NewGoods) => of(g))
    );
  }

  ngOnInit(): void {
  }

  onSubmit({ goods, draftImages }) {
    if (this.submitting) {
      return;
    }
    this.submitting = true;
    this.goodsService.add(goods).then(addedGoods => {
      draftImages = draftImages.map(img => ({ ...img, context: `type=goods|id=${addedGoods.id}`}));
      this.router.navigate(['goods', addedGoods.id], { replaceUrl: true }).then(() => {
        const upload$ = this.cloudinaryService.upload(draftImages);
        upload$.subscribe(uploadedImages => {
          this.goodsService.updateImages(addedGoods.id, uploadedImages);
        }, err => {
          alert(err);
        }, () => {
          this.goodsService.updateProcessed(addedGoods.id);
        });
      });
    });
  }

}
