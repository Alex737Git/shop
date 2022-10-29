import React from "react";
import cart from "../images/shoppingCart.png";
import { addedItemsVar, selectedCurrencyVar } from "../../apollo/cache";
import { IOrderedProducts } from "../../interfaces/orderedProducts";
import { GET_PRODUCT } from "../../apollo/queries";
import { IProduct } from "../../interfaces/product";
import Attribute from "../body/Attribute";
import { withHooksHoc } from "../../functions/withHooksHoc";
import { useReactiveVar } from "@apollo/client";

interface CartProp {
  orderedProducts: IOrderedProducts;
  currencySymbol: string;
}

interface CartState {
  isOpen: boolean;
  productsFromDB: IProduct[];
}

class Cart extends React.Component<CartProp, CartState> {
  state = {
    isOpen: false,
    productsFromDB: [] as IProduct[],
  };

  //region CDU
  componentDidUpdate(
    prevProps: Readonly<CartProp>,
    prevState: Readonly<CartState>,
    snapshot?: any
  ) {
    if (prevProps.orderedProducts.length < this.props.orderedProducts.length) {
      this.getItems();
    }
  }
  //endregion

  //region getItems()
  getItems() {
    GET_PRODUCT(
      this.props.orderedProducts[this.props.orderedProducts.length - 1]?.id
    ).then((p) => {
      let arr = [...this.state.productsFromDB];
      // @ts-ignore
      arr.push(p.data.product);
      this.setState({ productsFromDB: arr });
    });
  }
  //endregion

  //region CalculateOrderedItems
  calculateOrderedItems() {
    return this.props.orderedProducts?.reduce((accumulator, val) => {
      return accumulator + val.quantity;
    }, 0);
  }
  //endregion

  //region getItemQuantity
  getItemQuantity(id: string) {
    return this.props?.orderedProducts?.filter((p) => p.id === id)[0]?.quantity;
  }
  //endregion

  //region onClickQuantity
  onClickQuantity(sign: string, id: string) {
    let items = addedItemsVar();
    let newArr = [] as IOrderedProducts;
    items.forEach((p) => {
      if (p.id === id) {
        sign === "+" ? p.quantity++ : p.quantity--;
      }
      if (p.quantity !== 0) {
        newArr.push(p);
      } else {
        let products = this.state.productsFromDB.filter((i) => i.id !== p.id);
        this.setState({ productsFromDB: products });
      }
    });

    addedItemsVar(newArr);
  }
  //endregion

  //region getTotal
  getTotal() {
    let symbol = this.props.currencySymbol;
    let price = this.state.productsFromDB.reduce((accumulator, p) => {
      return (
        accumulator +
        +p.prices.filter((p) => p.currency.symbol === symbol)[0].amount *
          this.getItemQuantity(p.id)
      );
    }, 0);
    return `${symbol}${price.toFixed(2)}`;
  }
  //endregion

  getAttributes = (products: IOrderedProducts, id: string) => {
    let atr = products.filter((p) => p.id === id)[0]?.attributes;

    if (atr === undefined) {
      return [];
    }
    return atr;
  };

  //region Render
  render() {
    return (
      <>
        <button onClick={() => this.setState({ isOpen: !this.state.isOpen })}>
          <img className="shop-cart" src={cart} alt="shopping cart" />
          {this.calculateOrderedItems() > 0 && (
            <div className="circle">{this.calculateOrderedItems()}</div>
          )}
        </button>

        {this.state.isOpen && (
          <>
            <div
              className="overlay"
              onClick={() => this.setState({ isOpen: false })}
            />
            <div className="cart-container">
              {/*region Title My Bag*/}
              <div className="title">
                <b>My Bag</b> , {this.calculateOrderedItems()} items
              </div>
              {/*endregion*/}
              {/*region Items*/}
              <div className="items">
                {this.state.productsFromDB.map((p: IProduct, i) => {
                  return (
                    <div className="item-box" key={p.id + `${i}`}>
                      {/*region Brand*/}
                      <div className="grid-item1">{p.brand}</div>
                      {/*endregion*/}
                      {/*region Buttons Plus Minus Quantity*/}
                      <div className="grid-item2">
                        <button
                          className="sign"
                          onClick={() => this.onClickQuantity("+", p.id)}
                        >
                          +
                        </button>
                        <div>{this.getItemQuantity(p.id)}</div>
                        <button
                          className="sign"
                          onClick={() => this.onClickQuantity("-", p.id)}
                        >
                          -
                        </button>
                      </div>
                      {/*endregion*/}

                      {/*region Image Name*/}
                      <div className="grid-item3">
                        <img className="cart-image" src={p.gallery[0]} alt="" />
                      </div>
                      {/*endregion */}

                      {/*region Name Currency*/}
                      <div className="grid-item4">{p.name}</div>
                      <div className="grid-item5">
                        {this.props.currencySymbol}
                        {
                          p.prices.filter(
                            (p) =>
                              p.currency.symbol === this.props.currencySymbol
                          )[0]?.amount
                        }
                      </div>
                      {/*endregion*/}

                      {/*region Attributes*/}
                      <div className="grid-item6">
                        <Attribute
                          styles={[]}
                          product={p}
                          key={`${p.id}atr`}
                          // orderedProducts={this.props.orderedProducts}
                          // name={"Cart"}
                          gettingAttributes={undefined}
                          selectedAttributes={this.getAttributes(
                            this.props.orderedProducts,
                            p.id
                          )}
                        />
                      </div>
                      {/*endregion  */}
                    </div>
                  );
                })}
              </div>
              {/*endregion*/}
              {/*region Total*/}
              <div className="total">
                <div>Total</div>
                <div>{this.getTotal()}</div>
              </div>
              {/*endregion*/}
              {/*region Buttons*/}
              {this.state.productsFromDB.length > 0 && (
                <div className="cart-buttons">
                  <button
                    className="buttons viewBag"
                    onClick={() => console.log("View Bag")}
                  >
                    VIEW BAG
                  </button>
                  <button
                    className="buttons checkOut"
                    onClick={() => alert("Check out")}
                  >
                    CHECK OUT
                  </button>
                </div>
              )}

              {/*endregion*/}
            </div>
          </>
        )}
      </>
    );
  }
  //endregion
}

export default withHooksHoc(Cart, [
  {
    hook: useReactiveVar,
    name: addedItemsVar,
    propName: "orderedProducts",
  },
  {
    hook: useReactiveVar,
    name: selectedCurrencyVar,
    propName: "currencySymbol",
  },
]);
