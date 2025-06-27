export interface Movie {
  id: string;
  title: string;
  synopsis: string;
  release_date: Date;
  main_image_url: string;
  banner_image_url: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}