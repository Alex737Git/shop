import React from "react";
import { addedItemsVar, selectedCurrencyVar } from "../../apollo/cache";
import { IProduct } from "../../interfaces/product";
import { withHooksHoc } from "../../functions/withHooksHoc";
import { useReactiveVar } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GET_PRODUCT } from "../../apollo/queries";
import Attribute from "./Attribute";
import { IOrderedProducts } from "../../interfaces/orderedProducts";
import { IAttribute } from "../../interfaces/attributes";

interface DetailProps {
  id: string;
  currencySymbol: string;
  orderedProducts: IOrderedProducts;
  // selectProduct: IProduct;
}

interface DetailState {
  selectedProduct: IProduct;
  selPhoto: string;
  selectedAttributes: IAttribute[];
}

class PageDetail extends React.Component<DetailProps, DetailState> {
  state = {
    selectedProduct: {} as IProduct,
    selPhoto: "",
    selectedAttributes: [] as IAttribute[],
  };

  //region CDM
  componentDidMount() {
    // console.log("Props111: ", this.props);
    this.getItem();
  }
  //endregion

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState !== this.state) {
  //     console.log("prevState: ", prevState.selectedAttributes);
  //     console.log("this.state: ", this.state.selectedAttributes);
  //   }
  // }

  //region getItems()
  getItem() {
    GET_PRODUCT(this.props["id"]["id"]).then((p) => {
      this.setState({
        selectedProduct: p.data.product,
        selPhoto: p.data.product.gallery[0],
      });
    });
  }
  //endregion

  // getSelectedAttributes = (childData: IAttribute[]) => {
  //   this.setState({ selectedAttributes: childData });
  // };

  //region Add to Cart
  addToCart = () => {
    let id = this.state.selectedProduct.id;
    let atrQuantity = this.state.selectedProduct.attributes.length;
    let atr = [...this.state.selectedAttributes];
    if (atrQuantity !== this.state.selectedAttributes.length) {
      alert("Please choose all attributes");
      return;
    }

    let flag = true;

    let orderedProducts = [...addedItemsVar()];
    orderedProducts.forEach((f) => {
      if (f.id === id && f.attributes && f?.attributes[0] == atr[0]) {
        f.quantity++;
        f.attributes = [...atr];
        flag = false;
      }
    });

    if (flag) {
      orderedProducts.push({
        id: id,
        quantity: 1,
        attributes: [...atr],
      });
    }
    console.log("Ordered products: ", orderedProducts);
    addedItemsVar(orderedProducts);
  };
  //endregion

  //region AddSelectedAttributes
  addSelectedAttributes = (atrName: string, value: string) => {
    let selAttributes = { ...this.state };
    const attributes = selAttributes.selectedAttributes ?? ([] as IAttribute[]);
    let flag = true;
    attributes?.forEach((a) => {
      if (a.name === atrName) {
        a.items[0].value = value;
        flag = false;
      }
    });
    if (flag) {
      attributes.push({ name: atrName, items: [{ value: value }] });
    }

    this.setState({ ...this.state, selectedAttributes: attributes });
  };
  //endregion

  //region Render
  render() {
    return (
      <div className="pageDetailContainer">
        {/*Todo uncomment them*/}
        {/*region Photos*/}
        {/*/!*region Photos*!/*/}
        {/*<div className="collectionPhotos">*/}
        {/*  {this.state.selectedProduct &&*/}
        {/*    this.state.selectedProduct.gallery?.map((p, i) => {*/}
        {/*      return (*/}
        {/*        <img*/}
        {/*          className="miniPhoto"*/}
        {/*          src={p}*/}
        {/*          alt=""*/}
        {/*          onClick={() => this.setState({ selPhoto: p })}*/}
        {/*          key={p}*/}
        {/*        />*/}
        {/*      );*/}
        {/*    })}*/}
        {/*</div>*/}
        {/*/!*endregion*!/*/}
        {/*/!*region Main Photo*!/*/}
        {/*<div className="mainPhoto">*/}
        {/*  <img className="mainPhotoImg" src={this.state.selPhoto} alt="" />*/}
        {/*</div>*/}
        {/*/!*endregion*!/*/}
        {/*endregion*/}

        <div className="info">
          {/*region Brand Title*/}
          <div className="brand">{this.state.selectedProduct.brand}</div>
          <div className="title">{this.state.selectedProduct.name}</div>
          {/*endregion*/}
          <div className="attributes">
            <Attribute
              // orderedProducts={this.props.orderedProducts}
              product={this.state.selectedProduct}
              styles={[
                "priceTitle",
                "attributeItemValue",
                "attributeItemColor",
              ]}
              // name={"PageDetail"}
              selectedAttributes={this.state.selectedAttributes}
              gettingAttributes={this.addSelectedAttributes}
            />
          </div>
          <div className="price">
            {/*region Price*/}
            <div className="priceTitle">Price:</div>

            <div className="priceBody">
              {this.props.currencySymbol}
              {this.state.selectedProduct &&
                this.state.selectedProduct?.prices?.filter(
                  (p) => p.currency.symbol === this.props.currencySymbol
                )[0]?.amount}
            </div>
            {/*endregion*/}
            {/*region Button*/}
            <button className="addBtn" onClick={() => this.addToCart()}>
              ADD TO CART
            </button>
            {/*endregion  */}
          </div>
          {/*region Description*/}
          <div
            dangerouslySetInnerHTML={{
              __html: this.state.selectedProduct.description,
            }}
          ></div>
          {/*endregion*/}
        </div>
      </div>
    );
  }
  //  endregion
}

export default withHooksHoc(PageDetail, [
  { hook: useParams, propName: "id" },
  {
    hook: useReactiveVar,
    name: selectedCurrencyVar,
    propName: "currencySymbol",
  },
  {
    hook: useReactiveVar,
    name: addedItemsVar,
    propName: "orderedProducts",
  },
]);
