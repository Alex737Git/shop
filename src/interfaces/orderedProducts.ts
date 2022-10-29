import { IAttribute } from "./attributes";

export interface IOrderedProduct {
  id: string;
  quantity: number;
  attributes?: IAttribute[];
}

export type IOrderedProducts = IOrderedProduct[];
