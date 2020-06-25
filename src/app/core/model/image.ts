export enum ImageType {
  'file' = 'file',
  'url' = 'url'
}

export interface ImageFile {
  type: ImageType;
  value: File;
  rotate: number;
  selected?: boolean;
}

export interface ImageUrl {
  type: ImageType;
  value: string; // uploaded url
  rotate: number;
  selected?: boolean;
}

export interface UploadedImage {
  filename: string;
  size: number;
  url: string;
}

export type ImageFileOrUrl = (ImageFile | ImageUrl);
