import React, { Component, Fragment } from "react";
import PricingBox from "./priceItem";
import axios from "axios";
class SearchBox extends Component {
  state = {
    cursor: 0,
    suggestions: [],
    showPricingBox: false,
    currantItem: {},
    textBoxValue: ""
  };
  texts = {};
  componentWillMount() {
    axios.get("http://dhananjayatrades.com/api/items/search").then(resolve => {
      this.texts = resolve;
    });
  }

  refrs = React.createRef();
  styles = {
    overflowY: "scroll",
    backgroundColor: "white",
    width: "100%",
    position: "absolute",

    fontSize: "10pt",
    listStyleType: "none",
    padding: "2px"
  };

  dropDown = {
    position: "relative",
    display: "inline-block"
  };

  dropDownListItem = {};

  searchItem = value => {
    let suggestions = [];

    if (value.length > 0) {
      suggestions = this.texts.data.filter(item => item.value.includes(value));
    }
    this.setState({ suggestions: suggestions, cursor: 0, textBoxValue: value });
  };

  clickMe = event => {
    alert(event);
  };

  modalClose = () => {
    this.setState({ showPricingBox: false });
  };

  closeDropDown = () => {
    this.setState({ suggestions: [] });
  };
  handleKeyDown = e => {
    const { cursor, suggestions } = this.state;
    // arrow up/down button should select next/previous list element
    let suggestionsLength = suggestions.length;
    if (e.keyCode === 38) {
      e.preventDefault();
      if (cursor < 1) this.setState({ cursor: suggestionsLength });
      this.setState(prevState => ({
        cursor: prevState.cursor - 1
      }));
    } else if (e.keyCode === 40) {
      e.preventDefault();
      if (cursor > suggestionsLength - 2) this.setState({ cursor: -1 });
      this.setState(prevState => ({
        cursor: prevState.cursor + 1
      }));
    } else if (e.keyCode === 13 && this.state.suggestions.length > 0) {
      this.setState({
        textBoxValue: "",
        showPricingBox: true,
        currantItem: this.state.suggestions[this.state.cursor],
        suggestions: []
      });
    }
  };

  componentDidMount() {
    this.refrs.current.focus();
  }
  render() {
    return (
      <Fragment>
        <div style={this.dropDown}>
          <input
            className="form-control mr-sm-2"
            placeholder="Search"
            onKeyDown={this.handleKeyDown}
            ref={this.refrs}
            value={this.state.textBoxValue}
            onChange={e => {
              this.searchItem(e.target.value);
            }}
          />

          <ul style={this.styles}>
            {this.state.suggestions.map((item, i) => (
              <li
                onClick={event => {
                  this.clickMe(item.id);
                }}
                key={item.id}
                className={this.state.cursor === i ? "active" : null}
              >
                {item.value}
              </li>
            ))}
          </ul>
        </div>

        <PricingBox
          show={this.state.showPricingBox}
          onHide={this.modalClose}
          rprice={this.state.currantItem}
          updateOrder={this.props.updateOrder}
        />
      </Fragment>
    );
  }
}

export default SearchBox;
