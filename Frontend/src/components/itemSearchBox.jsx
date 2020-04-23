import React, { useState, Fragment, useEffect } from "react";
import PricingBox from "./priceItem";
import axios from "axios";
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
    axios.get("http://localhost:3800/api/items/search").then((resolve) => {
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
    backgroundColor: "#f8f9fa",
    width: "100%",
    position: "absolute",
    fontSize: "10pt",
    listStyleType: "none",
    padding: "2px",
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
  //CHANGE ITEM NAME
  const changeCurrantItemName = (newName) => {
    let newCurrantItem = { ...currantItem };
    newCurrantItem.value = newName;
    setLocalState((currantSate) => ({
      ...currantSate,
      currantItem: newCurrantItem,
    }));
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

  return (
    <Fragment>
      <div style={dropDown}>
        <input
          className="form-control bg-dark-white dmr-sm-2"
          placeholder="Search"
          onKeyDown={handleKeyDown}
          ref={refrs}
          value={textBoxValue}
          onChange={(e) => {
            searchItem(e.target.value);
          }}
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
        updateOrder={props.updateOrder}
      />
    </Fragment>
  );
}

export default SearchBox;
