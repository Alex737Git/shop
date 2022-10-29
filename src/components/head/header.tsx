import React from "react";
import MenuContainer from "./menuContainer";
import brand from "../images/brand.png";
import Currency from "./currency";
import Cart from "./cart";

class Header extends React.Component {
  render() {
    return (
      <>
        <div className="header">
          <MenuContainer />
          <img src={brand} alt={brand} className="brandLogo" />
          <div className="currencyCartContainer">
            <Currency />
            <Cart />
          </div>
        </div>
      </>
    );
  }
}

export default Header;
