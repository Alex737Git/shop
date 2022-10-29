import { gql } from "@apollo/client";
import { client } from "../index";
import { selectedCurrencyVar } from "./cache";

//region GET_CURRENCIES
export const GET_CURRENCIES = () => {
  return client
    .query({
      query: gql`
        query GetCurrencies {
          currencies {
            label
            symbol
          }
        }
      `,
    })
    .then((result) => {
      if (result.data.currencies[0].symbol)
        // setLocals("selectedCurrency", result.data.currencies[0].symbol);
        selectedCurrencyVar(result.data.currencies[0].symbol);
      return result;
    });
};

//endregion

//region GET_CATEGORIES
export const GET_CATEGORIES = () => {
  return client
    .query({
      query: gql`
        query GetCategories {
          categories {
            name
          }
        }
      `,
    })
    .then((result) => {
      return result;
    });
};
//endregion

//region  GET_ITEMS
export const GET_ITEMS = (categoryName: string) => {
  return client
    .query({
      query: gql`
        query GetItems($input: String!) {
          category(input: { title: $input }) {
            products {
              id
              name
              inStock
              gallery
              prices {
                currency {
                  symbol
                }
                amount
              }
              attributes {
                id
              }
            }
          }
        }
      `,
      variables: { input: categoryName },
    })
    .then((result) => {
      return result;
    });
};

//endregion

//region GET_PRODUCT
export const GET_PRODUCT = (productId: string) => {
  return client
    .query({
      query: gql`
        query GetProduct($productId: String!) {
          product(id: $productId) {
            id
            name
            gallery
            prices {
              amount
              currency {
                symbol
              }
            }
            attributes {
              type
              name
              items {
                value
                displayValue
              }
              id
            }
            description
            category
            brand
            inStock
          }
        }
      `,
      variables: { productId: productId },
    })
    .then((result) => {
      return result;
    });
};

//endregion

// export const GET_ADDED_ITEMS = () => {
//   return client
//     .query({
//       query: gql`
//         query GetAddedItems {
//           addedItems @client
//         }
//       `,
//     })
//     .then((result) => {
//       return result;
//     });
// };
