import React, { useState, Fragment, useEffect } from "react";
import { Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAllItems } from '../slices/items.slice';
import { uuid } from "uuidv4";
import { deepCopy } from "../utils";

const { Search } = Input;
const SearchBox = (props) => {

    const dispatch = useDispatch();
    const searchItems = useSelector(state => state.items.items);
    const currentOrder = useSelector((state) => state.orders.order);

    const [
        {
            suggestions,
            // showPricingBox,
            // currantItem,
            textBoxValue,
            cursor,
            //  searchItems,
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
        dispatch(getAllItems())
    }, []);

    const chooseItem = (itemId) => {
        if (suggestions.length > 0) {
            const [clickedItem] = suggestions.filter(
                (listItem) => listItem.id === itemId
            );
            addCustomItem(clickedItem)
            setLocalState((currantSate) => ({
                ...currantSate,
                textBoxValue: "",
                // showPricingBox: true,
                // currantItem: Object.assign({}, clickedItem),
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
        cursor: "pointer",
    };

    const addCustomItem = (item) => {
        const order = deepCopy(currentOrder);
        let newItem = {
            id: uuid(),
            barcode: item.id,
            itemName: item.value,
            customPrice: 0,
            amount: 1,
            unitPrice: parseFloat(item.price),
            gotPrice: parseFloat(item.cost),
            orderId: order.orderNo,
            total: parseFloat(item.price * 1),
            type: order.type,
            note: "",
        };
        order.orderItems = [...order.orderItems, newItem];
        props.updateorder(order);
    }

    const searchItem = (value) => {
        let suggestions = [];
        // if (/^\d+$/.test(value)) {
        //   console.log(typeof value);
        //   const item = searchItems.filter((item) => item.id === parseInt(value));
        //   console.log(item);
        //   if (item.length == 1) {
        //     setLocalState((currantSate) => ({
        //       ...currantSate,
        //       textBoxValue: "",
        //       showPricingBox: true,
        //       currantItem: Object.assign({}, item[0]),
        //       suggestions: [],
        //     }));
        //   }
        // } else {
        if (value.length > 0) {
            suggestions = searchItems.filter((item) => item.value.includes(value));
        }
        setLocalState((currantState) => ({
            ...currantState,
            suggestions: suggestions,
            cursor: 0,
            textBoxValue: value,
        }));
        // }
    };

    // const modalClose = () => {
    //     setLocalState((currantSate) => ({ ...currantSate, showPricingBox: false }));
    // };

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
            addCustomItem(suggestions[cursor])
            setLocalState((currantSate) => ({
                ...currantSate,
                textBoxValue: "",
                // showPricingBox: true,
                // currantItem: Object.assign({}, suggestions[cursor]),
                suggestions: [],
            }));
        } else if (e.keyCode === 27) {
            closeDropDown();
        }
    };

    return (
        <Fragment>
            <div style={dropDown}>
                <Search
                    placeholder="search"
                    onSearch={() => {}}
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

            {/* <PricingBox
                show={showPricingBox}
                isedit={"false"}
                onHide={modalClose}
                rprice={currantItem}
                // changeItemName={changeCurrantItemName}
                updateorder={props.updateorder}
            /> */}
        </Fragment>
    );
}

export default SearchBox;
