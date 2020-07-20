import React, { useState, Fragment, useEffect } from "react";
import { Table, Space, Popconfirm, Card, Input } from "antd";
//import { useSelector, useDispatch } from "react-redux";
import EditStockItem from "./editItemModal";
import axios from "axios";
import { getItemData, itemSearch } from "../services/http";

function ViewAllStock(props) {
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
    getItemData(1, 7)
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
      title: "barcode",
      dataIndex: "barcode",
      sortable: true,
    },
    {
      key: "2",
      title: "name",
      dataIndex: "name",
      sortable: true,
    },
    {
      key: "3",
      title: "Got Price",
      dataIndex: "got_price",
      sortable: true,
    },
    {
      key: "4",
      title: "Ton Price",
      dataIndex: "t",
      sortable: true,
    },
    {
      key: "5",
      title: "Whole Price",
      dataIndex: "w",
      sortable: true,
    },
    {
      key: "6",
      title: "Retail Price",
      dataIndex: "r",
      sortable: true,
    },
    {
      key: "7",
      title: "Stock",
      dataIndex: "stock",
      sortable: true,
    },
    {
      key: "8",
      title: "Company",
      dataIndex: "company",
      sortable: true,
    },

    {
      key: "9",
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <button
            style={buttonStyles.edit}
            title="Edit item info"
            onClick={() => handleAction(record.barcode)}
          >
            <i className="fa fa-edit"></i>
          </button>

          <Popconfirm
            title="Remove this item ?"
            onConfirm={(e) => removeStockItem(record.barcode)}
            okText="Yes"
            cancelText="No"
          >
            <button style={buttonStyles.delete}>
              <i className="fa fa-trash"></i>
            </button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const removeStockItem = (itemId) => {
    setLoading(true);
    axios
      .delete("http://dhananjayatrades.com/api/items/delete", {
        data: { item_id: itemId },
      })
      .then((responseData) => {
        setLoading(false);
        if (responseData.data.status) {
          const newItemSet = data.filter((item) => item.barcode != itemId);
          updateItemsData(newItemSet);
        }
      });
    setLoading(false);
  };

  const handleAction = (value) => {
    const editItemIndex = data.findIndex((item) => item.barcode == value);
    setStock((currantSate) => ({
      ...currantSate,
      editItemIndex: editItemIndex,
      editDataSet: data[editItemIndex],
      editId: value,
      showItemEditModal: true,
    }));
    // console.log(value.target.id);
  };

  const modalClose = () => {
    setStock((currantSate) => ({
      ...currantSate,
      showItemEditModal: false,
    }));
  };

  const tableData = {
    columns,
    data,
  };

  const updateItemsData = (newItemSet) => {
    console.log(newItemSet);
    setStock((currantState) => ({
      ...currantState,
      data: newItemSet,
    }));
  };

  const handlePageChange = (currantPage, pageSize) => {
    setLoading(true);
    getItemData(currantPage, pageSize)
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
      const result = await itemSearch(tearm);
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
    getItemData(currantPage, pageSize)
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
          rowKey="barcode"
          pagination={{
            pageSize: perPage,
            total: allRowCount,
            onChange: handlePageChange,
            onShowSizeChange: handlePerRowsChange,
          }}
        />
      </Card>
      <EditStockItem
        show={showItemEditModal}
        editdata={editDataSet}
        onHide={modalClose}
        data={data}
        updatedata={updateItemsData}
        edititemindex={editItemIndex}
      />
    </Fragment>
  );
}

export default ViewAllStock;
