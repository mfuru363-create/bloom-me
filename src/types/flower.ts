export type Flower = {
  name: string;
  country: string;
  language: string;
  personality: string;
  icon: string;
};

export type Character = {
  name: string;
  description: string;
  imageUrl: string;
  flowerName: string;
};

export type UploadedImage = {
  data: string;
  mimeType: string;
};
