import { IItem } from "./item";

export interface IAttribute {
  id?: string;
  type?: string;
  name: string;
  items: IItem[];
}
