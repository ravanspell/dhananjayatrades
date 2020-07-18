import React, { useState, Fragment, useEffect } from "react";
import PricingBox from "./priceItem";
import { Input } from "antd";
import { loadSearchItems } from "../services/http";

const { Search } = Input;
function SearchBox(props) {
  const [
    {
      suggestions,
      showPricingBox,
      currantItem,
      textBoxValue,
      cursor,
      searchItems,
    },
    setLocalState,
  ] = useState({
    cursor: 0,
    suggestions: [],
    showPricingBox: false,
    currantItem: {},
    textBoxValue: "",
    searchItems: [],
  });

  const refrs = React.createRef();
  useEffect(() => {
    refrs.current.focus();
    loadSearchItems().then((resolve) => {
      setSearchItems(resolve.data);
    });
  }, []);

  const setSearchItems = (data) => {
    setLocalState((currantState) => ({
      ...currantState,
      searchItems: data,
    }));
  };

  const chooseItem = (itemId) => {
    if (suggestions.length > 0) {
      const [clickedItem] = suggestions.filter(
        (listItem) => listItem.id === itemId
      );
      setLocalState((currantSate) => ({
        ...currantSate,
        textBoxValue: "",
        showPricingBox: true,
        currantItem: Object.assign({}, clickedItem),
        suggestions: [],
      }));
    }
  };
  const styles = {
    overflowY: "scroll",
    backgroundColor: "#18191a",
    width: "100%",
    position: "absolute",
    fontSize: "10pt",
    listStyleType: "none",
    padding: "2px",
    zIndex: 1,
    active: {
      backgroundColor: "#626189ed",
      color: "white",
    },
  };

  const showDropDown = {
    display: "none",
  };
  const dropDown = {
    position: "relative",
    display: "inline-block",
  };

  const searchItem = (value) => {
    let suggestions = [];

    if (value.length > 0) {
      suggestions = searchItems.filter((item) => item.value.includes(value));
    }
    setLocalState((currantState) => ({
      ...currantState,
      suggestions: suggestions,
      cursor: 0,
      textBoxValue: value,
    }));
  };

  const modalClose = () => {
    setLocalState((currantSate) => ({ ...currantSate, showPricingBox: false }));
  };

  const closeDropDown = () => {
    setLocalState((currantSate) => ({
      ...currantSate,
      suggestions: [],
      currantItem: {},
      textBoxValue: "",
      cursor: 0,
    }));
  };
  const handleKeyDown = (e) => {
    // arrow up/down button should select next/previous list element
    let suggestionsLength = suggestions.length;
    if (e.keyCode === 38) {
      e.preventDefault();
      if (cursor < 1)
        setLocalState((currantSate) => ({
          ...currantSate,
          cursor: suggestionsLength,
        }));
      setLocalState((currantSate) => ({
        ...currantSate,
        cursor: currantSate.cursor - 1,
      }));
    } else if (e.keyCode === 40) {
      e.preventDefault();
      if (cursor > suggestionsLength - 2)
        setLocalState((currantSate) => ({ ...currantSate, cursor: -1 }));
      setLocalState((currantSate) => ({
        ...currantSate,
        cursor: currantSate.cursor + 1,
      }));
    } else if (e.keyCode === 13 && suggestionsLength > 0) {
      setLocalState((currantSate) => ({
        ...currantSate,
        textBoxValue: "",
        showPricingBox: true,
        currantItem: Object.assign({}, suggestions[cursor]),
        suggestions: [],
      }));
    } else if (e.keyCode === 27) {
      closeDropDown();
    }
  };

  const onSelect = (value) => {
    console.log("onSelect", value);
  };

  return (
    <Fragment>
      <div style={dropDown}>
        <Search
          placeholder="search"
          onSearch={(value) => console.log(value)}
          style={{ width: 350 }}
          onKeyDown={handleKeyDown}
          value={textBoxValue}
          onChange={(e) => {
            searchItem(e.target.value);
          }}
          ref={refrs}
        />

        <ul style={suggestions.length > 0 ? styles : showDropDown}>
          {suggestions.map((item, i) => (
            <li
              onClick={(event) => {
                chooseItem(item.id);
              }}
              key={item.id}
              style={cursor === i ? styles.active : null}
            >
              {item.value}
            </li>
          ))}
        </ul>
      </div>

      <PricingBox
        show={showPricingBox}
        isedit={"false"}
        onHide={modalClose}
        rprice={currantItem}
        // changeItemName={changeCurrantItemName}
        updateorder={props.updateorder}
      />
    </Fragment>
  );
}

export default SearchBox;
