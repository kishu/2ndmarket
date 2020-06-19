import * as arrayMove from 'array-move';
import { Component, Input, OnInit } from '@angular/core';
import { ImageType, ImageFile, ImageUrl, ImageFileOrUrl } from '@app/core/model';

@Component({
  selector: 'app-images-control',
  templateUrl: './images-control.component.html',
  styleUrls: ['./images-control.component.scss']
})
export class ImagesControlComponent implements OnInit {
  @Input() maxlength = 10;
  imageFileOrUrls: ImageFileOrUrl[] = [];
  imagesCount = 0;
  imageFilesSize = 0;

  constructor() { }

  ngOnInit(): void {
  }

  protected updateImagesCountAndSize() {
    this.imagesCount = this.imageFileOrUrls.length;
    this.imageFilesSize = this.imageFileOrUrls
      .filter(i => i.type === ImageType.file )
      .reduce((a, c) => (a + (c as ImageFile).file.size), 0);
  }

  onChangeFile(e: Event) {
    const target = e.target as HTMLInputElement;
    const addedImageFileOrUrls = Array.from(target.files)
      .map(file => ({
        type: ImageType.file,
        file,
        rotate: 0
      }));
    this.imageFileOrUrls.push(...addedImageFileOrUrls);
    this.updateImagesCountAndSize();
    target.value = '';
  }

  onClickRotateImage(image: ImageFileOrUrl, degree: number) {
    image.rotate = (image.rotate + degree) % 360;
  }

  onClickMoveImage(from: number, to: number) {
    if (to > 0 && to < this.imageFileOrUrls.length) {
      this.imageFileOrUrls = arrayMove(this.imageFileOrUrls, from, to);
    }
  }

  onClickDeleteImage(idx: number) {
    this.imageFileOrUrls = this.imageFileOrUrls.filter((image, i) => i !== idx );
    this.updateImagesCountAndSize();
  }

}
