// Historical flower spirit (new schema)
export type Flower = {
  id: string;
  country: string;
  flower: string;
  hanakotoba: string;
  theme: string;
  defaultOutfit: string;
};

// Legacy type (used by generate-character route)
export type LegacyFlower = {
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
