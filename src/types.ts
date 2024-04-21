export interface IProduct {
  article: string;
  brand: string;
  category: string;
  class: string;
  description: string;
  images: any[];
  img: string;
  name: string;
  oem: string[];
  price: string;
  productArticle: string;
  props: {
    "Бренд": string;
    "Производитель техники": string;
    size: null;
    color: null;
    euSize: null;
  };
  rPrice: string;
  stockCount: number;
  subCategory: string;
}