import { uniqueId } from 'lodash-es';
import * as arrayMove from 'array-move';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImageType, ImageFile, ImageUrl, ImageFileOrUrl } from '@app/core/model';

@Component({
  selector: 'app-images-control',
  templateUrl: './images-control.component.html',
  styleUrls: ['./images-control.component.scss']
})
export class ImagesControlComponent implements OnInit {
  @Input() maxlength = 10;
  images: ImageFileOrUrl[] = [];
  imagesCount = 0;
  imageFilesSize = 0;

  constructor() { }

  ngOnInit(): void {
  }

  protected updateImagesCountAndSize() {
    this.imagesCount = this.images.length + 1;
    this.imageFilesSize = this.images
      .filter(i => i.type === ImageType.file )
      .reduce((a, c) => (a + (c as ImageFile).file.size), 0);
  }

  onChangeImage(e: Event) {
    const fileList = (e.target as HTMLInputElement).files;
    this.images = Array.from(fileList).map(file => ({
      id: uniqueId(),
      type: ImageType.file,
      file,
      rotate: 0
    }));
    this.updateImagesCountAndSize();
  }

  onClickRotateImage(image: ImageFileOrUrl, degree: number) {
    image.rotate = (image.rotate + degree) % 360;
  }

  onClickMoveImage(from: number, to: number) {
    if (to > 0 && to < this.images.length) {
      this.images = arrayMove(this.images, from, to);
    }
  }

  onClickDeleteImage(idx: number) {
    this.images = this.images.filter((image, i) => i !== idx );
    this.updateImagesCountAndSize();
  }

}
