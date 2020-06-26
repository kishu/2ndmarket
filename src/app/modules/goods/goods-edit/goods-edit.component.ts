import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Goods, ImageFile, ImageFileOrUrl, ImageType } from '@app/core/model';
import { CloudinaryService, GoodsService } from '@app/core/http';
import { fromPromise } from "rxjs/internal-compatibility";

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

  onSubmit({goods, imageFileOrUrls}: {goods: Partial<Goods>, imageFileOrUrls: ImageFileOrUrl[] }) {
    if (this.submitting) {
      return;
    }
    this.submitting = true;
    goods = { ...goods, updated: GoodsService.serverTimestamp()} as any;
    const uploadedImageUrls = imageFileOrUrls.map(img => img.type === ImageType.url ? img.value as string : '');
    const imageFiles = imageFileOrUrls.filter(img => img.type === ImageType.file) as ImageFile[];
    fromPromise(this.goodsService.update(goods.id, goods)).subscribe(() => {
      const [, uploadComplete$] = this.cloudinaryService.upload(goods.id, imageFiles);
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
