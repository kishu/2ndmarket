import * as arrayMove from 'array-move';
import { Component, Input, OnInit } from '@angular/core';
import { ImageFileOrUrl, ImageType } from '@app/core/model';

@Component({
  selector: 'app-images-control',
  templateUrl: './images-control.component.html',
  styleUrls: ['./images-control.component.scss']
})
export class ImagesControlComponent implements OnInit {
  @Input() maxlength = 10;
  @Input() set imageUrls(urls: string[]) {
    this.imageFileOrUrls = this.imageFileOrUrls.concat(
      urls.map(u => ({ type: ImageType.url, value: u, rotate: 0 } as ImageFileOrUrl))
    );
  }

  imageFileOrUrls: ImageFileOrUrl[] = [];

  // get imagesCount() { return this.fileOrUrls.length; }
  // get imageFilesSize() {
  //   return this.fileOrUrls
  //     .filter(i => i instanceof File)
  //     .reduce((a, f: File) => (a + f.size), 0);
  // }

  constructor() { }

  ngOnInit(): void {
  }

  onChangeFile(e: Event) {
    const target = e.target as HTMLInputElement;
    this.imageFileOrUrls = this.imageFileOrUrls.concat(
      Array.from(target.files).map(f => ({ type: ImageType.file, value: f, rotate: 0 } as ImageFileOrUrl))
    );
    target.value = '';
  }

  onSelectImage(image: ImageFileOrUrl) {
    this.imageFileOrUrls.filter(f => f.selected).map(f => delete f.selected);
    image.selected = true;
  }

  onBlurImage(image: ImageFileOrUrl) {
    delete image.selected;
  }

  onClickMoveImage(from: number, to: number) {
    if (
      from !== to &&
      (from >= 0 && from < this.imageFileOrUrls.length) &&
      (to >= 0 && to < this.imageFileOrUrls.length)
    ) {
      this.imageFileOrUrls = arrayMove(this.imageFileOrUrls, from, to);
    }
  }

  onClickRotateImage(imageFileOrUrl: ImageFileOrUrl, degree: number) {
    imageFileOrUrl.rotate = (imageFileOrUrl.rotate + degree) % 360;
  }

  onClickDeleteImage(imageFileOrUrl: ImageFileOrUrl) {
    this.imageFileOrUrls = this.imageFileOrUrls.filter(i =>  i !== imageFileOrUrl );
  }

}
