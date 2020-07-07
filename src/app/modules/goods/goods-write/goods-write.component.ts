import * as faker from 'faker';
faker.locale = 'ko';
import { concat, forkJoin, merge, Observable, of, zip } from 'rxjs';
import { filter, first, map, mergeAll, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService, CloudinaryService, CloudinaryUploadService, GoodsService, ProfilesService } from '@app/core/http';
import { GoodsCondition, GoodsPurchased, GoodsShipping, NewGoods } from '@app/core/model';
import { HttpEventType } from "@angular/common/http";

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
        updated: GoodsService.serverTimestamp(),
        processing: true
      })),
      switchMap((g: NewGoods) => of(g))
    );
  }

  ngOnInit(): void {
  }

  onSubmit({ goods, draftImages }) {
    console.log('onSubmit');
    if (this.submitting) {
      return;
    }

    const [uploadProgress$, uploadComplete$] = this.cloudinaryUploadService.upload(draftImages);

    uploadProgress$.subscribe(p => console.log(p));
    uploadComplete$.subscribe(p => console.log(p));

    // this.submitting = true;
    // this.goodsService.add(goods).then((addedGoods) => {
    //   this.router.navigate(['../../', addedGoods.id], {
    //     replaceUrl: true,
    //     relativeTo: this.activatedRoute,
    //     state: {
    //       files: draftImages.map(img => img.file)
    //     }
    //   });
    // });
    // this.goodsService.add(goods).then(addedGoods => {
    //   draftImages = draftImages.map(img => ({ ...img, context: `type=goods|id=${addedGoods.id}`}));
    //   const upload$ = this.cloudinaryService.upload(draftImages);
    //   upload$.subscribe(uploadedImages => {
    //     this.goodsService.updateImages(addedGoods.id, uploadedImages);
    //   }, err => {
    //     alert(err);
    //   }, () => {
    //     this.goodsService.updateProcessed(addedGoods.id);
    //   });
    //   this.router.navigate(['../../', addedGoods.id], { replaceUrl: true, relativeTo: this.activatedRoute });
    // });
  }

}
