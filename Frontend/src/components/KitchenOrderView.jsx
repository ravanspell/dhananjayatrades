import React, { useState, Fragment, useEffect, useRef } from "react";
// import { io } from "socket.io-client";
import { Card, Col, Row, Button, Table, Tag } from "antd";
import { useDispatch } from "react-redux";
import sound from '../assets/audio/Bell.mp3';
import { BOTH, DINE_IN, TAKE_WAY } from "../constants";
import { getOrdersToKitchen } from "../services/http";

// const socket = io("http://ceylontearepo.com:443/api/", {
//     rejectUnauthorized: false // WARN: please do not do this in production
// });

const KitchenOrderView = () => {
    const [orders, setOrders] = useState([]);

    const dispatch = useDispatch();
    const audioRef = useRef(new Audio(sound));
    const previousItems = useRef([]);

    const getData = async () => {
        try {
            const res = await getOrdersToKitchen();
            const { orders } = JSON.parse(JSON.stringify(res.data.data))
            handleOrders(JSON.parse(orders))
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        const intervalCall = setInterval(() => {
            getData();
        }, 4000);
        return () => {
            // clean up
            clearInterval(intervalCall);
        };
    }, []);

    const handleOrders = (ordrs = []) => {
        let triggerPlaySound = false;
        let currentOrders = [];

        ordrs.forEach((order, index) => {
            const orderItems = { 'takeaway': [], 'dinein': [] }
            let currentOrder = JSON.parse(JSON.stringify(order))
            const orderAvailable = previousItems.current[index];
            if (!orderAvailable) {
                triggerPlaySound = true;
                currentOrder.newOrder = true
            }

            orderItems["dinein"] = currentOrder.orderItems.filter((order) => order.type === DINE_IN);
            orderItems["takeaway"] = currentOrder.orderItems.filter((order) => order.type === TAKE_WAY);

            const updatedCurrentOrder = {
                ...currentOrder,
                orderItems,
            }
            if (orderAvailable) {
                const prevOrderItems = JSON.stringify(orderAvailable.orderItems)
                const currentOrderItems = JSON.stringify(updatedCurrentOrder.orderItems)
                if (prevOrderItems !== currentOrderItems) {
                    triggerPlaySound = true;
                    updatedCurrentOrder['newOrder'] = true
                }
            }
            currentOrders.push(updatedCurrentOrder)
        });

        if (JSON.stringify(previousItems.current) !== JSON.stringify(currentOrders)) {
            setOrders(currentOrders);
            if (triggerPlaySound) {
                playSound();
            }
            previousItems.current = currentOrders;
        } 
    }

    const playSound = () => {
        audioRef.current.loop = true
        audioRef.current.play()
    }

    const stopSound = () => {
        audioRef.current.loop = false
        audioRef.current.pause();
    }
    // // socket oi listener to 'broadcast' channel
    // socket.once('broadcast', (args) => {
    //     handleOrders(args)
    // });

    const columns = [
        {
            title: 'Item',
            dataIndex: 'item',
            key: 'item',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Qty',
            dataIndex: 'qty',
            key: 'qty',
        },
        {
            title: 'Note',
            key: 'note',
            dataIndex: 'note',
            render: (text) => <a>{text}</a>,
        }]

    const renderOrder = (orderItems, orderType) => {

        const data = orderItems.map((item, index) => {
            return {
                key: `${index}`,
                item: item.itemName,
                qty: item.amount,
                note: item.note
            }
        })
        return (
            <Table
                size="small"
                columns={columns}
                dataSource={data}
                showHeader={false}
                bordered={false}
                pagination={false}
                title={() => {
                    return (
                        <>
                            {orderType === DINE_IN &&
                                <>
                                    <Tag color="warning">Dine in</Tag>
                                </>
                            }

                            {orderType === TAKE_WAY &&
                                <Tag color="error">Take away</Tag>
                            }

                            {orderType === BOTH &&
                                <Tag color="error">Both</Tag>
                            }
                        </>
                    )
                }}
            />
        )
    }

    return (
        <Fragment>
            <Row gutter={[24, 8]}>
                {orders.map((order) => {
                    return (
                        <Col span={6} >
                            <Card style={{ borderColor: order?.newOrder ? '#91D3A4' : "" }}>
                                <Row justify="space-between">
                                    <div style={{ fontSize: '14pt' }}>
                                        {order.orderNo} - {order.customer?.name}
                                    </div>
                                    {/* {order?.newOrder && */}
                                        <Button
                                            onClick={stopSound}
                                            type="text"
                                            shape="circle"
                                            icon={<i class="fa fa-eye" aria-hidden="true"></i>}
                                        />
                                        {/* } */}
                                </Row>
                                {Object.keys(order.orderItems).map((orderType) => {
                                    return (
                                        <Fragment>
                                            {order.orderItems[orderType].length > 0 &&
                                                <Fragment>
                                                    {renderOrder(order.orderItems[orderType], orderType)}
                                                </Fragment>
                                            }
                                        </Fragment>
                                    )
                                })}
                            </Card>
                        </Col>
                    )
                })}
            </Row>
        </Fragment>
    );
}

export default KitchenOrderView;
