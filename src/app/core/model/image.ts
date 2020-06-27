export interface DraftImage {
  isFile: boolean;
  file?: File;
  src?: string; // url for cloudinary
  rotate: number;
  context?: string; // for cloudinary
  selected?: boolean;
}
