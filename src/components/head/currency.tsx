import React, { RefObject } from "react";
import { GET_CURRENCIES } from "../../apollo/queries";
import { ICurrency } from "../../interfaces/currency";
import { selectedCurrencyVar } from "../../apollo/cache";

interface IState {
  selectedCurrency: string;
  currencies: ICurrency[];
  isSelectOpen: boolean;
}

class Currency extends React.Component<{}, IState> {
  buttonRef: RefObject<any>;
  constructor(props = {}) {
    super(props);

    this.buttonRef = React.createRef();
    this.onClickOutside = this.onClickOutside.bind(this);
    this.onSelectCurrency = this.onSelectCurrency.bind(this);
    this.state = {
      selectedCurrency: "",
      currencies: [] as ICurrency[],
      isSelectOpen: false,
    };
  }

  onClickOutside(event) {
    if (this.buttonRef && !this.buttonRef.current.contains(event.target)) {
      this.setState({ isSelectOpen: false });
    }
  }

  onSelectCurrency(currency: string) {
    this.setState({
      selectedCurrency: currency,
      isSelectOpen: false,
    });

    // setLocals(apolloVar.selectedCurrency, currency);
    selectedCurrencyVar(currency);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.onClickOutside);

    GET_CURRENCIES().then((r) => {
      if (r?.data?.currencies) {
        this.setState({
          currencies: r.data.currencies,
          selectedCurrency: r.data.currencies[0].symbol,
        });
      }
    });
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.onClickOutside);
  }

  render() {
    return (
      <div ref={this.buttonRef}>
        <div className="wrapper">
          <div>
            <button
              type="button"
              onClick={() =>
                this.setState({ isSelectOpen: !this.state.isSelectOpen })
              }
            >
              {this.state.selectedCurrency}

              <i
                className={
                  this.state.isSelectOpen
                    ? "fa-solid fa-angle-up"
                    : "fa-solid fa-angle-down"
                }
              ></i>
            </button>
            <ul className={`options ${this.state.isSelectOpen ? "show" : ""}`}>
              {this.state.currencies.map((c) => (
                <li
                  key={c.symbol}
                  onClick={() => this.onSelectCurrency(c.symbol)}
                >
                  {c.symbol + " " + c.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Currency;
