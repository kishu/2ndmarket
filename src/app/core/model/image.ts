export enum ImageType {
  'file' = 'file',
  'url' = 'url'
}

export interface ImageFileOrUrl {
  type: ImageType;
  value: File | string;
  rotate: number;
}
