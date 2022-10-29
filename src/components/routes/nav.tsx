import React from "react";
import { capitalizeFirstLetter } from "../../functions/functions";
import { GET_ITEMS } from "../../apollo/queries";
import { IProduct } from "../../interfaces/product";
import { addedItemsVar, selectedCurrencyVar } from "../../apollo/cache";
import circleCartBtn from "../images/circleIcon.png";
import { NavLink, useNavigate } from "react-router-dom";
import { routes } from "./routes";
import { withHooksHoc } from "../../functions/withHooksHoc";
import { useReactiveVar } from "@apollo/client";

interface NavProp {
  value: string;
  currency: string;
  navigate: Function;
}

interface IState {
  items: IProduct[];
  currency: string;
}

class Nav extends React.Component<NavProp, IState> {
  //region ctor
  constructor(props) {
    super(props);

    this.onAdd = this.onAdd.bind(this);

    //region state
    this.state = {
      items: [] as IProduct[],
      currency: this.props.currency,
    };
    //endregion
  }
  //endregion

  //region CDM
  componentDidMount() {
    this.getItems();
  }
  //endregion
  //region CDU
  componentDidUpdate(
    prevProps: Readonly<NavProp>,
    prevState: Readonly<IState>,
    snapshot?: any
  ) {
    if (
      prevProps.value !== this.props.value ||
      prevProps.currency !== this.props.currency
    ) {
      this.getItems();
      this.setState({ currency: this.props.currency });
    }
  }
  //endregion

  addOrNavigateToDetails(i: IProduct, path: string) {
    console.log("i.attributes", i.attributes);
    if (i.attributes && i.attributes.length > 0) {
      this.props.navigate(path);
    } else {
      this.onAdd(i.id);
    }
  }

  //region onAdd
  onAdd(id: string) {
    let flag = true;
    let orderedProducts = [...addedItemsVar()];

    orderedProducts.forEach((f) => {
      if (f.id === id) {
        f.quantity++;
        flag = false;
      }
    });

    if (flag) {
      orderedProducts.push({ id: id, quantity: 1 });
    }
    addedItemsVar(orderedProducts);
  }
  //endregion

  //region getItems()
  getItems() {
    // console.log("this.props.value: ", this.props.value);
    GET_ITEMS(this.props.value).then((r) => {
      console.log("r.data.category.products: ", r.data.category.products);
      this.setState({ items: r.data.category.products });
    });
  }
  //endregion

  //region Render

  render() {
    // console.log("this.state.items: ", this.state.items);
    return (
      <div className="nav">
        {/*region Category Name*/}
        <div className="categoryName">
          {capitalizeFirstLetter(this.props.value)}
        </div>
        {/*endregion*/}

        <section className="goods">
          {this.state.items?.map((i) => {
            // console.log("Product: ", i);
            return (
              <div
                key={i.name}
                className={i.inStock ? "" : "item-out-of-stock"}
              >
                <div className="item">
                  {/*region Out of stock*/}
                  <div className="image-out-item-container">
                    <img
                      className="item-image"
                      src={i.gallery[0]}
                      alt="image"
                    />
                    {i.inStock || (
                      <div className="out-of-stock-title">Out of stock</div>
                    )}
                  </div>
                  {/*endregion*/}
                  {/*region Button Add*/}
                  {i.inStock && (
                    <img
                      // onClick={() => this.onAdd(i.id)}
                      onClick={() =>
                        this.addOrNavigateToDetails(
                          i,
                          routes.Description(this.props.value, i.id)
                        )
                      }
                      className="item-image-shop-cartBtn"
                      alt="order"
                      src={circleCartBtn}
                    />
                  )}
                  {/*endregion*/}

                  <NavLink
                    to={`${routes.Description(this.props.value, i.id)}`}
                    className="item-name"
                  >
                    <div>{i.name}</div>

                    <div className="item-price">
                      {this.state.currency}
                      {
                        i.prices.filter(
                          (p) => p.currency.symbol === this.state.currency
                        )[0]?.amount
                      }
                    </div>
                  </NavLink>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    );
  }
  //endregion
}

export default withHooksHoc(Nav, [
  { hook: useReactiveVar, name: selectedCurrencyVar, propName: "currency" },
  { hook: useNavigate, propName: "navigate" },
]);
