import * as faker from 'faker';
faker.locale = 'ko';
import { forkJoin, Observable, of } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService, CloudinaryService, CloudinaryUploadService, GoodsService, ProfilesService } from '@app/core/http';
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
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private authService: AuthService,
    private goodsService: GoodsService,
    private profilesService: ProfilesService,
    private cloudinaryService: CloudinaryService,
    private cloudinaryUploadService: CloudinaryUploadService
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
        updated: GoodsService.serverTimestamp()
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
    const [uploadProgress$, uploadComplete$] = this.cloudinaryUploadService.upload(draftImages);
    // {type: 1, loaded: 163840, total: 165310}
    uploadProgress$.subscribe(p => console.log(p));
    uploadComplete$.subscribe(images => {
      goods = {...goods, images};
      console.log(goods);
      this.goodsService.add(goods).then(
        (newGoods) => this.router.navigate(['../../', newGoods.id], { replaceUrl: true, relativeTo: this.activatedRoute }),
        err => alert(err)
      )
    });
  }

}
