import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Goods, ImageFile, ImageFileOrUrl, ImageType, ImageUrl, UploadedImage } from '@app/core/model';
import { CloudinaryService, GoodsService } from '@app/core/http';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-goods-edit',
  templateUrl: './goods-edit.component.html',
  styleUrls: ['./goods-edit.component.scss']
})
export class GoodsEditComponent implements OnInit {
  submitting = false;
  goods$: Observable<Goods>;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private goodsService: GoodsService,
    private cloudinaryService: CloudinaryService
  ) {
    const goodsId = this.activatedRoute.snapshot.paramMap.get('goodsId');
    this.goods$ = this.goodsService.get(goodsId);
  }

  ngOnInit(): void {
  }

  onSubmit({goods, imageFileOrUrls}: {goods: Goods, imageFileOrUrls: ImageFileOrUrl[] }) {
    if (this.submitting) {
      return;
    }
    this.submitting = true;
    const imageFiles = imageFileOrUrls.filter(img => img.type === ImageType.file) as ImageFile[];
    const [uploadProgress$, uploadComplete$] = this.cloudinaryService.upload(imageFiles);
    (imageFiles.length > 0 ? uploadComplete$ : of([])).pipe(
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
      map(uploadedUrls => {
        return {
          ...goods,
          images: uploadedUrls,
          updated: GoodsService.serverTimestamp()
        } as Goods;
      }),
      switchMap(goods => this.goodsService.update(goods.id, goods))
    ).subscribe(
      (r) => {
        this.router.navigate(['goods', goods.id]);
      },
      err => alert(err)
    );
  }

}
