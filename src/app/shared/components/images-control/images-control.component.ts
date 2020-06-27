import * as arrayMove from 'array-move';
import { Component, Input, OnInit } from '@angular/core';
import { DraftImage } from '@app/core/model';

@Component({
  selector: 'app-images-control',
  templateUrl: './images-control.component.html',
  styleUrls: ['./images-control.component.scss']
})
export class ImagesControlComponent implements OnInit {
  @Input() maxlength = 10;
  @Input() set images(images: string[]) {
    this.draftImages = images.map(src => ({isFile: false, src, rotate: 0}));
  }
  draftImages: DraftImage[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  onChangeFile(e: Event) {
    const target = e.target as HTMLInputElement;
    this.draftImages = this.draftImages.concat(
      Array.from(target.files).map(file => ({ isFile: true, file, rotate: 0 } as DraftImage))
    );
    target.value = '';
  }

  onSelectImage(target: DraftImage) {
    this.draftImages.filter(image => image.selected).map(image => delete image.selected);
    target.selected = true;
  }

  onBlurImage(target: DraftImage) {
    delete target.selected;
  }

  onClickMoveImage(from: number, to: number) {
    if (
      from !== to &&
      (from >= 0 && from < this.draftImages.length) &&
      (to >= 0 && to < this.draftImages.length)
    ) {
      this.draftImages = arrayMove(this.draftImages, from, to);
    }
  }

  onClickRotateImage(target: DraftImage, degree: number) {
    target.rotate = (target.rotate + degree) % 360;
  }

  onClickDeleteImage(target: DraftImage) {
    this.draftImages = this.draftImages.filter(image =>  image !== target );
  }

}
