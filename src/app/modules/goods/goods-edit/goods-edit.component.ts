import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CloudinaryService, CloudinaryUploadService, GoodsService } from '@app/core/http';
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
    private cloudinaryService: CloudinaryService,
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
    const [uploadProgress$, uploadComplete$] = this.cloudinaryUploadService.upload(draftImages);
    uploadProgress$.subscribe(p => console.log(p));
    uploadComplete$.subscribe(images => {
      goods = {...goods, images};
      this.goodsService.update(goods.id, goods).then(
        () => this.router.navigate(['../../', goods.id], { replaceUrl: true, relativeTo: this.activatedRoute }),
        err => alert(err)
      )
    });
  }

}
