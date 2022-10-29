import { InMemoryCache, makeVar } from "@apollo/client";
import { IOrderedProducts } from "../interfaces/orderedProducts";

export const selectedCurrencyVar = makeVar<string>("");
export const addedItemsVar = makeVar<IOrderedProducts>([]);

export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        selectedCurrency: {
          read() {
            return selectedCurrencyVar();
          },
        },
        addedItems: {
          read() {
            return addedItemsVar();
          },
        },
      },
    },
  },
});
