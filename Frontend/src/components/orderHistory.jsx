import React, { useState, Fragment, useEffect } from "react";
import { Table, Space, Card, Input } from "antd";
//import { useSelector, useDispatch } from "react-redux";
import PrintBill from "./printBill";
import { getOrderHistory, searchOrders } from "../services/http";

function OrderHistory(props) {
  const { Search } = Input;

  const buttonStyles = {
    edit: {
      backgroundColor: "#1d9baecc",
      border: "none",
      width: "30px",
      borderRadius: "2px",
      color: "#e9ecef",
    },
    delete: {
      backgroundColor: "#903b3b",
      marginLeft: "3px",
      border: "none",
      width: "30px",
      borderRadius: "2px",
      color: "#e9ecef",
    },
  };

  const [
    { data, allRowCount, showItemEditModal, editDataSet, editItemIndex },
    setStock,
  ] = useState({
    data: [],
    allRowCount: 0,
    editItemIndex: null,
    editDataSet: {},
    editId: null,
    showItemEditModal: false,
  });
  const [perPage, setPerPage] = useState(7);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getOrderHistory(1, 7)
      .then((resolve) => {
        const { data: resolveData } = resolve;
        setStock((currantState) => ({
          ...currantState,
          data: resolveData.data,
          allRowCount: resolveData.count,
        }));
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, []);
  const columns = [
    {
      key: "1",
      title: "Date",
      dataIndex: "date",
      sortable: true,
    },
    {
      key: "2",
      title: "Order Id",
      dataIndex: "order_id",
      sortable: true,
    },
    {
      key: "3",
      title: "Got Price Total",
      dataIndex: "got_price_total",
      sortable: true,
    },
    {
      key: "4",
      title: "Total",
      dataIndex: "total",
      sortable: true,
    },
    {
      key: "5",
      title: "Profit",
      dataIndex: "profit",
      sortable: true,
    },
    {
      key: "9",
      title: "Action",
      key: "action",
      render: (text, record) => (
        // <Space size="middle">
        //   <button
        //     style={buttonStyles.edit}
        //     title="Edit item info"
        //     onClick={() => handleAction(record.barcode)}
        //   >
        //     <i className="fa fa-edit"></i>
        //   </button>
        // </Space>
        <PrintBill orderId ={record.order_id} />
      ),
    },
  ];

  const handlePageChange = (currantPage, pageSize) => {
    setLoading(true);
    getOrderHistory(currantPage, pageSize)
      .then((resolve) => {
        const { data: resolveData } = resolve;
        setLoading(false);
        setStock((currantState) => ({
          ...currantState,
          data: resolveData.data,
          allRowCount: resolveData.count,
        }));
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const onSearch = async (tearm) => {
    console.log(tearm);
    if (tearm !== "") {
      const result = await searchOrders(tearm);
      setStock((currantState) => ({
        ...currantState,
        data: result.data.data,
        allRowCount: result.data.count,
      }));
    }
  };

  const handlePerRowsChange = (currantPage, pageSize) => {
    setLoading(true);
    setPerPage(pageSize);
    getOrderHistory(currantPage, pageSize)
      .then((resolve) => {
        const { data: resolveData } = resolve;
        setLoading(false);
        setStock((currantState) => ({
          ...currantState,
          data: resolveData.data,
          allRowCount: resolveData.count,
        }));
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };
  return (
    <Fragment>
      <Card>
        <Search
          placeholder="search"
          onChange={(e) => onSearch(e.target.value)}
          style={{ width: 350, marginBottom: "10px" }}
        />
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="order_id"
          pagination={{
            pageSize: perPage,
            total: allRowCount,
            onChange: handlePageChange,
            onShowSizeChange: handlePerRowsChange,
          }}
        />
      </Card>
    </Fragment>
  );
}

export default OrderHistory;
