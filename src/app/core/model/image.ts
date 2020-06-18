export enum ImageType {
  'file' = 'file',
  'url' = 'url'
}

export interface ImageFile {
  type: ImageType;
  file: File;
  rotate: number;
}

export interface ImageUrl {
  type: ImageType;
  url: string;
  rotate: number;
}

export type ImageFileOrUrl = (ImageFile | ImageUrl);
