import React from "react";
import { useSelector } from "react-redux";
import { baseUrl, getOldOrder } from "../services/http";
import { message } from 'antd';
import { getServiceCharge } from "../utils";
import axios from "axios";
import moment from "moment";

const buttonStyles = {
    edit: {
        backgroundColor: "#1d9baecc",
        border: "none",
        width: "30px",
        borderRadius: "2px",
        color: "#e9ecef",
    },
};
const NewPrintBill = (props) => {
    let order = useSelector((state) => state.orders.order);

    const currantDate = () => {
        const dateObj = new Date();
        const date = dateObj.getDate();
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();
        const formattedDate = `${year}-${month}-${date}`;
        return formattedDate;
    };

    const printOldOrder = () => {
        const hideLoading = message.loading('Processing..', 0);
        getOldOrder(props.orderId).then((result) => {
            order = { orderItems: result.data.data };
            hideLoading();
            printx();
        }).catch((error) => {
            hideLoading();
            message.error(`Error - ${error.message}`, 2.9);
        });
    }

    const addServiceCharge = (amount, order) => {
        return (amount + getServiceCharge(order)).toFixed(2);
    }

    const printx = () => {
        axios
            .post(`${baseUrl}api/orders/spyon`, {
                amount: order?.totalPrice ? addServiceCharge(order.totalPrice, order) : addServiceCharge(order.orderItems[0]?.total, order),
                order_id: order?.orderNo || props?.orderId
            })
            .then((res) => {
                console.log(res);
                if (res.data.status) {
                    console.log("ok")
                } else {
                    console.log("error")
                }
            });
        let str = "";
        Object.keys(order.orderItems || {}).forEach(
            (item) =>
            (str =
                str +
                `<div class="bill-item item-name">
                ${order.orderItems[item].itemName || order.orderItems[item].order_name}
            </div>
            <div class="bill-item item-price">
                ${props?.orderId ? parseFloat(order.orderItems[item].unit_price).toFixed(2) : parseFloat(
                    order.orderItems[item].customPrice > 0
                        ? order.orderItems[item].customPrice
                        : order.orderItems[item].unitPrice
                ).toFixed(2)}
            </div>
            <div class="bill-item">
                ${order.orderItems[item].amount || order.orderItems[item].qty}
            </div>
            <div class="bill-item total">
                ${parseFloat(order.orderItems[item].total).toFixed(2)}
            </div>`)
        );
        var mywindow = window.open("", "PRINT", "height=800,width=600");

        mywindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Raba's Kitchen</title>
        <style>
            .header {
                display: grid;
                place-items: center;
                padding: 0px 5px 5px 5px;
                border-bottom: 1px solid #000000;
                gap: 2px;
            }

            .header .header-text {
                font-size: 1.5rem;
                font-weight: 700;
            }

            .bill-meta-data {
                display: flex;
                flex-direction: column;
                border-bottom: 1px solid #000000;
            }

            .bill-meta-data .topic {
                align-self: center;
                margin-bottom: 3px;
                font-weight: 600;
            }

            .bill-meta-data .data-row {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
            }

            .bill-meta-data .data-row:last-child {
                padding-bottom: 3px;
            }

            .bill-container {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
            }

            .bill-container .bill-header {
                font-weight: 600;
                border-bottom: 1px solid #000000;
                margin-bottom: 2px;
            }

            .bill-container .item-total-header {
                text-align: end;
            }

            .bill-container .total {
                margin-left: auto;
            }

            .item-name {
                grid-column-start: 1;
                grid-column-end: 5;

            }

            .item-name {
                grid-column-start: 1;
                grid-column-end: 5;

            }

            .item-price {
                grid-column-start: 2;
            }

            .bill-fin-info {
                display: grid;
                padding-top: 3px;
                border-top: 1px solid #000000;
            }


            .bill-fin-info .info-row {
                display: flex;
                justify-content: space-between;
            }

            .bill-fin-info .cash {
                font-weight: 600;
            }

            .bill-fin-info .balance {
                font-weight: 600;
                border-top: 1px solid #000000;
            }

            .bill-fin-info .acknowledge {
                font-weight: 600;
                border-top: 1px solid #000000;
                border-bottom: 1px solid #000000;
                text-align: center;
            }
        </style>
    </head>

    <body>
        <div class="header">
            <div class="header-text">Raba's Kitchen</div>
            <div class="address">58/3 Kandy Road, Nittambuwa</div>
            <div class="phone">0711398855</div>
        </div>
        <div class="bill-meta-data">
            <div class="topic">INVOICE</div>
            <div class="data-row">
                <div>Order No :</div>
                <div>${order?.orderNo || props?.orderId}</div>
            </div>
            <div class="data-row">
                <div>Date :</div>
                <div>${currantDate()}</div>
            </div>
            <div class="data-row">
                <div>Time :</div>
                <div>${moment().format('HH:mm')}</div>
            </div>
        </div>
        <div class="bill-container">
            <div class="bill-header">
                <div>Name</div>
            </div>
            <div class="bill-header">
                <div>U.Price</div>
            </div>
            <div class="bill-header">
                <div>Qty</div>
            </div>
            <div class="bill-header item-total-header">
                <div>Value</div>
            </div>
            ${str}
        </div>

        <div class="bill-fin-info">
            <div class="info-row">
                <div>Items Value</div>
                <div>${order?.totalPrice.toFixed(2)}</div>
            </div>
            <div class="info-row">
                <div>S/Charge</div>
                <div>${getServiceCharge(order).toFixed(2)}</div>
            </div>
            <div class="info-row">
                <div>Net Value</div>
                <div>${order?.totalPrice ? addServiceCharge(order.totalPrice, order) : addServiceCharge(order.orderItems[0]?.total, order)}</div>
            </div>

            <div class="info-row cash">
                <div>CASH</div>
                <div>${props?.paidamount || 0}</div>
            </div>

            <div class="info-row balance">
                <div>Balance</div>
                <div>${props?.paidamount ? (props.paidamount - addServiceCharge(order.totalPrice, order)).toFixed(2) : 0}</div>
            </div>

            <div class="acknowledge">
                <div>Thank You Come Again!</div>
            </div>
        </div>
    </body>
    </html>`);
        return true;
    };

    if (props.orderId) {
        return (
            <button style={buttonStyles.edit} title="Edit item info" onClick={printOldOrder}>
                <i className="fa fa-print" />
            </button>
        );
    }

    return (
        <button onClick={printx} type="button" className="print-btn-2">
            <i className="fa fa-print">
                <span className="ml-1">Print Bill</span>
            </i>
        </button>
    );
}

export default NewPrintBill;
