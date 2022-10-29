import React from "react";
import NavTab from "./navTab";
import { GET_CATEGORIES } from "../../apollo/queries";

class MenuContainer extends React.Component {
  state = {
    categories: [],
  };
  componentDidMount() {
    GET_CATEGORIES().then((r) => {
      this.setState({ categories: r.data.categories });
      console.log(r.data.categories);
    });
  }

  render() {
    return (
      <div className="menu_container">
        {this.state.categories.map((r: { name: string }, index) => {
          return (
            <NavTab key={r.name} value={r.name.toUpperCase()} index={index} />
          );
        })}
      </div>
    );
  }
}

export default MenuContainer;
