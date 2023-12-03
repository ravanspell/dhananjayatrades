import React from "react";
import { Row, Col, Modal, Table } from "antd";

const ViewOldOrder = (props) => {

    const { data, show, onHide, orderId } = props;
    const columns = [
        {
            key: "1",
            title: "Name",
            dataIndex: "name",
            sortable: true,
        },
        {
            key: "2",
            title: "Unit price",
            dataIndex: "price",
            sortable: true,
        },
        {
            key: "3",
            title: "Quantity",
            dataIndex: "qty",
            sortable: true,
        },
        {
            key: "4",
            title: "Total",
            dataIndex: "total",
            sortable: true,
        },
    ];

    return (
        <Modal
            title={`Order - ${orderId}`}
            visible={show}
            closable={false}
            destroyOnClose={true}
            onCancel={onHide}
            footer={null}
        >
            <Row gutter={[40, 0]}>
                <Col span={24}>
                    <Table
                        style={{ marginTop: "10px" }}
                        columns={columns}
                        dataSource={data}
                        rowKey="order_id"
                        pagination={false}
                    />
                </Col>
            </Row>
        </Modal>
    );
}

export default ViewOldOrder;
