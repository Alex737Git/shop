import React from "react";
import { NavLink } from "react-router-dom";

interface NavTabProp {
  value: string;
  index: number;
}

class NavTab extends React.Component<NavTabProp> {
  render() {
    return (
      <div className="navTab">
        <NavLink
          // className={({ isActive }) => (isActive ? "active" : "")}
          to={`/${
            this.props.index === 0 ? "" : this.props.value.toLowerCase()
          }`}
        >
          {this.props.value}
        </NavLink>
      </div>
    );
  }
}

export default NavTab;
