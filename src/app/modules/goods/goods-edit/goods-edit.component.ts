import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { Component, HostBinding, OnInit } from '@angular/core';
import { HttpProgressEvent } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CloudinaryUploadService, GoodsService } from '@app/core/http';
import { Goods } from '@app/core/model';

@Component({
  selector: 'app-goods-edit, [app-goods-edit]',
  templateUrl: './goods-edit.component.html',
  styleUrls: ['./goods-edit.component.scss'],
})
export class GoodsEditComponent implements OnInit {
  @HostBinding('class.hidden-after') hiddenAfter = true;
  submitting = false;
  goods$: Observable<Goods>;
  uploadProgress: HttpProgressEvent;
  constructor(
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private goodsService: GoodsService,
    private cloudinaryUploadService: CloudinaryUploadService
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
    draftImages = draftImages.map(img => ({ ...img, context: `type=goods|id=${goods.id}`}));
    const [uploadProgress$, uploadComplete$] = this.cloudinaryUploadService.upload(draftImages);
    uploadProgress$.subscribe(e => this.uploadProgress = e); // { idx: 1, type: 1, loaded: 163840, total: 165310}
    uploadComplete$.subscribe(images => {
      goods = {
        ...goods,
        price: parseInt(goods.price.replace(/,/g, ''), 10),
        images
      };
      this.goodsService.update(goods.id, goods).then(
        () => this.router.navigate(['../../', goods.id], { replaceUrl: true, relativeTo: this.activatedRoute }),
        err => alert(err)
      );
    });
  }

  onClickHistoryBack() {
    this.location.back();
  }

}
