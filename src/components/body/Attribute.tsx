import React from "react";
import { IAttribute } from "../../interfaces/attributes";
import { IProduct } from "../../interfaces/product";
import { IOrderedProducts } from "../../interfaces/orderedProducts";

interface AttributeProp {
  // orderedProducts: IOrderedProducts | undefined;
  product: IProduct;
  styles: string[];
  // name: string;
  selectedAttributes: IAttribute[];
  gettingAttributes: Function | undefined;
}

class Attribute extends React.Component<AttributeProp> {
  //region checkSelectedAttribute
  checkSelectedAttribute(atrName: string, value: string) {
    let result = false;
    if (this.props.selectedAttributes.length === 0) {
      result = false;
    } else {
      this.props.selectedAttributes.forEach((p) => {
        if (p.name === atrName) {
          p.items.forEach((v) => {
            if (v.value === value) result = true;
          });
        }
      });
    }

    return result;
  }
  //endregion

  render() {
    return (
      <>
        {this.props.product.attributes &&
          this.props.product.attributes.map((a, i) => {
            return (
              <span key={`${a.id}`}>
                {/*region Attribute Name*/}
                <div
                  className={`attribute-item-name ${this.props.styles[0]}`}
                  key={`${a.id}${a.name}`}
                >
                  {a.name}:
                </div>
                {/*endregion*/}

                <div className={`item-group`}>
                  {a.items.map((i) => {
                    //region attribute Color
                    if (a.name === "Color") {
                      return (
                        <div
                          key={i.value}
                          className={`colorContainer 
                          ${this.props.styles[2]}
                           ${
                             this.checkSelectedAttribute(a.name, i.value) &&
                             "selectedAttributeColor"
                           }`}
                        >
                          <div
                            // onClick={() => {
                            //   this.addSelectedAttributes(a.name, i.value);
                            // }}
                            onClick={() => {
                              if (this.props.gettingAttributes)
                                this.props.gettingAttributes(a.name, i.value);
                            }}
                            className="color-box "
                            style={{
                              backgroundColor: `${i.value}`,
                            }}
                          />
                        </div>
                      );
                    }
                    //endregion
                    //region attribute Text
                    return (
                      <div
                        // onClick={() =>
                        //   this.addSelectedAttributes(a.name, i.value)
                        // }
                        onClick={() => {
                          if (this.props.gettingAttributes)
                            this.props.gettingAttributes(a.name, i.value);
                        }}
                        key={i.value}
                        className={`attribute-value ${this.props.styles[1]} ${
                          this.checkSelectedAttribute(a.name, i.value) &&
                          "selectedAttributeTxt"
                        }`}

                        // className={`"attribute-value" ${this.props.styles[1]}`}
                        // selectedAttributeTxt
                      >
                        {i.value}
                      </div>
                      //endregion
                    );
                  })}
                </div>
              </span>
            );
          })}
      </>
    );
  }
}

export default Attribute;
