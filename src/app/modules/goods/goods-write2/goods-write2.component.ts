import { Router } from "@angular/router";
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AuthService, CloudinaryService, GoodsService, GroupsService } from '@app/core/http';
import { Goods, ImageFile, ImageFileOrUrl, ImageType, NewGoods } from '@app/core/model';

@Component({
  selector: 'app-goods-write2',
  templateUrl: './goods-write2.component.html',
  styleUrls: ['./goods-write2.component.scss']
})
export class GoodsWrite2Component implements OnInit {
  submitting = false;
  uploadProgress: { loaded: number, total: number };
  constructor(
    private router: Router,
    private authService: AuthService,
    private groupService: GroupsService,
    private goodsService: GoodsService,
    private cloudinaryService: CloudinaryService
  ) { }

  ngOnInit(): void {
  }

  onSubmit({goods, imageFileOrUrls}: {goods: Partial<Goods>, imageFileOrUrls: ImageFileOrUrl[] }) {
    if (this.submitting) {
      return;
    }

    this.submitting = true;
    const imageFiles = imageFileOrUrls.filter(i => i.type === ImageType.file) as ImageFile[];
    const [uploadProgress$, uploadComplete$] = this.cloudinaryService.upload(imageFiles);

    uploadProgress$.subscribe(v => {
      this.uploadProgress = v;
    });

    uploadComplete$
      .pipe(
        withLatestFrom(this.authService.user$, this.authService.group$),
        map(([uploadedUrls, user, group]) => ({
          ...goods,
          userId: user.id,
          groupRef: this.groupService.getDocRef(group.id),
          images: uploadedUrls,
          favoriteUserIds: [],
          commentCnt: 0,
          created: GoodsService.serverTimestamp(),
          updated: GoodsService.serverTimestamp()
        } as NewGoods)),
        switchMap(g => this.goodsService.add(g))
      )
      .subscribe(
        () => {
          alert('ok');
          this.submitting = false;
          // this.router.navigate(['goods']);
        },
        err => alert(err)
      );
  }

}
