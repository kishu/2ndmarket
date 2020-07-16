import { forkJoin, Observable, of } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { HttpProgressEvent } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService, CloudinaryUploadService, GoodsService, ProfilesService } from '@app/core/http';
import { GoodsCondition, GoodsPurchased, GoodsShipping, NewGoods } from '@app/core/model';

@Component({
  selector: 'app-goods-write',
  templateUrl: './goods-write.component.html',
  styleUrls: ['./goods-write.component.scss']
})
export class GoodsWriteComponent implements OnInit {
  submitting = false;
  goods$: Observable<NewGoods>;
  uploadProgress: HttpProgressEvent;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private authService: AuthService,
    private goodsService: GoodsService,
    private profilesService: ProfilesService,
    private cloudinaryUploadService: CloudinaryUploadService
  ) {
    this.goods$ = forkJoin([
      this.authService.user$.pipe(first(), filter(u => !!u)),
      this.authService.profile$.pipe(first(), filter(p => !!p))
    ]).pipe(
      map(([u, p]) => ({
        userId: u.id,
        groupId: p.groupId,
        profileId: p.id,
        name: '',
        shared: false,
        purchased: '',
        condition: '',
        price: null,
        shipping: '',
        images: [],
        contact: '',
        memo: '',
        soldOut: false,
        favoritesCnt: 0,
        commentsCnt: 0,
        updatedCnt: 0,
        created: GoodsService.serverTimestamp(),
        updated: GoodsService.serverTimestamp()
      } as unknown as NewGoods)),
      switchMap(g => of(g))
    );
  }

  ngOnInit(): void {
  }

  onSubmit({ goods, draftImages }) {
    if (this.submitting) {
      return;
    }
    this.submitting = true;
    const createdId = this.goodsService.createId();
    draftImages = draftImages.map(img => ({ ...img, context: `type=goods|id=${createdId}`}));
    const [uploadProgress$, uploadComplete$] = this.cloudinaryUploadService.upload(draftImages);
    uploadProgress$.subscribe(e => this.uploadProgress = e); // {type: 1, loaded: 163840, total: 165310}
    uploadComplete$.subscribe(images => {
      goods = {...goods, images};
      this.goodsService.create(createdId, goods).then(
        () => this.router.navigate(['../../', createdId], { replaceUrl: true, relativeTo: this.activatedRoute }),
        err => alert(err)
      );
    });
  }

}
