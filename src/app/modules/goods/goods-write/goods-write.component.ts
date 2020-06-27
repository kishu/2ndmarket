import * as faker from 'faker';
faker.locale = 'ko';
import { fill } from 'lodash-es';
import { forkJoin, Observable, of } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService, CloudinaryService, GoodsService, ProfilesService } from '@app/core/http';
import {
  Goods,
  GoodsCondition,
  GoodsPurchased,
  GoodsShipping,
  ImageFile,
  ImageFileOrUrl,
  ImageType,
  NewGoods
} from '@app/core/model';
import { fromPromise } from "rxjs/internal-compatibility";

@Component({
  selector: 'app-goods-write',
  templateUrl: './goods-write.component.html',
  styleUrls: ['./goods-write.component.scss']
})
export class GoodsWriteComponent implements OnInit {
  submitting = false;
  goods$: Observable<NewGoods>;
  uploadProgress: { loaded: number, total: number };
  constructor(
    private router: Router,
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
    const uploadedImageUrls = fill(Array(imageFileOrUrls.length), '');
    const imageFiles = imageFileOrUrls.filter(img => img.type === ImageType.file) as ImageFile[];
    fromPromise(this.goodsService.add(goods)).subscribe(goods => {
      const [, uploadComplete$] = this.cloudinaryService.upload(imageFiles);
      uploadComplete$.subscribe(uploaded => {
        const order = imageFileOrUrls.findIndex(img => {
          if (img.type === ImageType.file) {
            const file = img.value as File;
            return file.name.startsWith(uploaded.filename) && file.size === uploaded.size;
          }
        });
        uploadedImageUrls[order] = uploaded.url;
        this.goodsService.update(goods.id, { images: uploadedImageUrls });
      }, err => {
        alert(err);
      }, () => {
        this.router.navigate(['goods']);
      });
    });
  }

}
