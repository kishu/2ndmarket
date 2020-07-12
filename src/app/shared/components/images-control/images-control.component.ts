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
  @Input() set images(images: string/* url */[]) {
    this.draftImages = images.map(src => ({ isFile: false, src, rotate: 0 }));
  }

  draftImages: DraftImage[] = [];
  hasSelectedItem: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  onClickFile(e: Event) {
    const target = e.target as HTMLInputElement;
    if (this.draftImages.length >= this.maxlength) {
      alert(`이미지는 ${this.maxlength}개까지 첨부할 수 있습니다.`);
      target.value = '';
      e.preventDefault();
    }
  }

  onChangeFile(e: Event) {
    const target = e.target as HTMLInputElement;
    let end = target.files.length;
    if (target.files.length + this.draftImages.length > this.maxlength) {
      if (confirm(`이미지를 ${this.maxlength}개까지 만 첨부합니다.`)) {
        end = this.maxlength - this.draftImages.length;
      } else {
        e.preventDefault();
        target.value = '';
        return;
      }
    }
    this.draftImages = this.draftImages.concat(
      Array.from(target.files).slice(0, end).map(file => ({ isFile: true, file, rotate: 0 } as DraftImage))
    );
  }

  onToggleSelectImage(target: DraftImage) {
    if (target.selected) {
      this.onBlurImage(target);
    } else {
      this.draftImages.filter(image => image.selected).map(image => delete image.selected);
      target.selected = true;
      this.hasSelectedItem = true;
    }
  }

  onBlurImage(target: DraftImage) {
    delete target.selected;
    delete this.hasSelectedItem;
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
    delete target.selected;
    delete this.hasSelectedItem;
  }

}
