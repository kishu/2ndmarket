export enum ImageFileType {
  'upload' = 'upload',
  'uploaded' = 'uploaded'
}

export abstract class ImageFile {
  protected _id?: string;
  protected _type: ImageFileType;
  protected _src: File | string;
  protected _rotate = 0;

  public get type() { return this._type; }
  public abstract get src();
  public abstract get rotate();
  public abstract set rotate(degree: number);

  protected constructor(src: File | string) {
    this._src = src;
  }
}

export class UploadImageFile extends ImageFile {
  public get src(): File { return this._src as File; }
  public get rotate(): number { return this._rotate; }
  public set rotate(degree: number) { this._rotate = degree; }

  constructor(file: File, rotate = 0) {
    super(file);
    this._type = ImageFileType.upload;
    this._rotate = rotate;
  }
}

export class UploadedImageFile extends ImageFile {
  public get src(): string { return this._src as string; }
  public get rotate(): number { return this._rotate; }
  public set rotate(degree: number) { this._rotate = degree; }

  constructor(url: string) {
    super(url);
    this._type = ImageFileType.uploaded;
    this._rotate = 0; // to parse from url
  }
}
