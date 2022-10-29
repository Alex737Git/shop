import { ICurrency } from "./currency";
import { IAttribute } from "./attributes";

export interface IProduct {
  id: string;
  name: string;
  inStock: boolean;
  gallery: string[];
  prices: {
    currency: ICurrency;
    amount: string;
  }[];
  brand: string;
  category: string;
  description: string;
  attributes: IAttribute[];
}
