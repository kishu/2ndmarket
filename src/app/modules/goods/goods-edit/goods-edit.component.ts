import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Goods, ImageFileOrUrl, ImageType, NewGoods } from '@app/core/model';
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
    const [, uploadComplete$] = this.cloudinaryService.upload(imageFileOrUrls);

    uploadComplete$
      .pipe(
        map(uploadedUrls => ({
          ...goods,
          images: uploadedUrls,
          updated: GoodsService.serverTimestamp()
        } as Goods)),
        switchMap(g => this.goodsService.update(g.id, g))
      )
      .subscribe(
        (r) => {
          this.router.navigate(['goods', goods.id]);
        },
        err => alert(err)
      );
  }

}
