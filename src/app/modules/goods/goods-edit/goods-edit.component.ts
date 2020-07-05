import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CloudinaryService, GoodsService } from '@app/core/http';
import { Goods } from '@app/core/model';

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

  onSubmit({ goods, draftImages }) {
    if (this.submitting) {
      return;
    }
    this.submitting = true;
    const updateGoods: Goods = {
      ...goods,
      images: draftImages.filter(img => !img.isFile).map(img => img.src),
      processing: true
    };
    this.goodsService.update(goods.id, updateGoods).then(() => {
      draftImages = draftImages.map(img => ({ ...img, context: `type=goods|id=${goods.id}`}));
      const upload$ = this.cloudinaryService.upload(draftImages);
      upload$.subscribe(uploadedImages => {
        this.goodsService.updateImages(goods.id, uploadedImages);
      }, err => {
        alert(err);
      }, () => {
        this.goodsService.updateProcessed(goods.id);
      });
      this.router.navigate(['../../', goods.id], { replaceUrl: true, relativeTo: this.activatedRoute });
    });
  }

}
