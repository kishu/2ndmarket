import * as faker from 'faker';
import { Observable, of, forkJoin } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService, CloudinaryService, GoodsService, GroupsService } from '@app/core/http';
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
    private groupService: GroupsService,
    private goodsService: GoodsService,
    private cloudinaryService: CloudinaryService
  ) {
    this.goods$ = forkJoin(this.authService.user$.pipe(first(), filter(u => !!u)), this.authService.group$.pipe(first()))
      .pipe(
        filter(([u, g]) => !!u && !!g),
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
    const imageFiles = imageFileOrUrls.filter(img => img.type === ImageType.file) as ImageFile[];
    const [uploadProgress$, uploadComplete$] = this.cloudinaryService.upload(imageFiles);
    uploadComplete$
      .pipe(
        map(uploadedImages => {
          return imageFileOrUrls.map(img => {
            if (img.type === ImageType.url) {
              return img.value;
            } else {
              const targetImage = uploadedImages.find(u => {
                const imgFile = img.value as File;
                return imgFile.name.startsWith(u.filename) && imgFile.size === u.size;
              });
              return targetImage.url;
            }
          });
        }),
        map(uploadedUrls => ({
          ...goods,
          images: uploadedUrls,
        } as NewGoods)),
        switchMap(goods => this.goodsService.add(goods))
      )
      .subscribe(
        (r) => {
          this.router.navigate(['goods']);
        },
        err => alert(err)
      );
  }

}
