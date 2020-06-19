import { merge } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AuthService, CloudinaryService, GoodsService } from '@app/core/http';
import { UploadProgress } from "@app/core/http/cloudinary.service";
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

  onSubmit({goods, imageFileOrUrls}: {goods: Partial<Goods>, imageFileOrUrls: ImageFileOrUrl[] }) {
    console.log('goods', goods);
    console.log('imageFileOrUrls', imageFileOrUrls);
    const imageFiles = imageFileOrUrls.filter(i => i.type === ImageType.file) as ImageFile[];

    this.cloudinaryService.upload(imageFiles)
      .pipe(
        tap(e => {
          if (e.type === 'progress') {
            console.log('progress', e.data);
          } else if (e.type === 'complete') {
            console.log('complete', e.data);
          }
        })
      )
      .subscribe();

    return;
    // this.authService.user$
    //   .pipe(
    //     map(u => ({
    //       ...goods,
    //       userId: u.id,
    //       favoritesCnt: 0,
    //       commentCnt: 0,
    //       created: GoodsService.serverTimestamp(),
    //       updated: GoodsService.serverTimestamp(),
    //     } as NewGoods)),
    //     switchMap(g => this.goodsService.add(g))
    //   )
    //   .subscribe(
    //     () => alert('ok'),
    //     (err) => alert(err)
    //   );
  }

}
