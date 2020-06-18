import { merge } from "rxjs";
import { map, switchMap, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { HttpEventType } from "@angular/common/http";
import { AuthService, CloudinaryService, GoodsService } from '@app/core/http';
import { Goods, ImageFile, ImageFileOrUrl, ImageType, NewGoods } from '@app/core/model';

@Component({
  selector: 'app-goods-write2',
  templateUrl: './goods-write2.component.html',
  styleUrls: ['./goods-write2.component.scss']
})
export class GoodsWrite2Component implements OnInit {

  uploadedProgress = 0;

  constructor(
    private authService: AuthService,
    private goodsService: GoodsService,
    private cloudinaryService: CloudinaryService
  ) { }

  ngOnInit(): void {
  }

  upload(images: ImageFileOrUrl[]) {
    const uploads$ = images
      .filter(i => i.type === ImageType.file)
      .map((i: ImageFile) => this.cloudinaryService.upload(i.file));

    merge(...uploads$)
      .pipe(
        tap((e: any) => {
          if (e.type === HttpEventType.UploadProgress) {
            console.log('upload-progress', e.loaded, e.total, e);
            //this.uploadedProgress = Math.round(100 * e.loaded / e.total);
          }
        }),
        tap((e: any) => {
          if (e.type === HttpEventType.Response) {
            console.log('response', e.body);
          }
        })
      )
      .subscribe(
        (r) => console.log('r', r),
        (err) => console.log('err', err)
      );
  }

  onSubmit({goods, images}: { goods: Partial<Goods>, images: ImageFileOrUrl[] }) {
    console.log('goods', goods);
    console.log('images', images);
    this.upload(images);

    return;
    this.authService.user$
      .pipe(
        map(u => ({
          ...goods,
          userId: u.id,
          favoritesCnt: 0,
          commentCnt: 0,
          created: GoodsService.serverTimestamp(),
          updated: GoodsService.serverTimestamp(),
        } as NewGoods)),
        switchMap(g => this.goodsService.add(g))
      )
      .subscribe(
        () => alert('ok'),
        (err) => alert(err)
      );
  }

}
