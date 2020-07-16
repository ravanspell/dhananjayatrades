import React, { useState, Fragment, useEffect } from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { Table, Space, Popconfirm } from "antd";
import { SearchOutlined } from "@ant-design/icons";
//import { useSelector, useDispatch } from "react-redux";
import EditStockItem from "./editItemModal";
import axios from "axios";

function ViewAllStock(props) {
  const [{ data, allRowCount }, setStock] = useState({
    data: [],
    allRowCount: 0,
  });
  const [perPage, setPerPage] = useState(7);
  // http://localhost:3800/ http://dhananjayatrades.com/
  useEffect(() => {
    axios
      .get(`http://localhost:3800/api/items/all/1/7`)
      .then((resolve) => {
        const { data: resolveData } = resolve;
        setStock((currantState) => ({
          ...currantState,
          data: resolveData.data,
          allRowCount: resolveData.count,
        }));
      })
      .catch((error) => {
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
            <button>
              <i className="fa fa-trash"></i>
            </button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const removeStockItem = (itemId) => {
    axios
      .delete("http://localhost:3800/api/items/delete", {
        data: { item_id: itemId },
      })
      .then((responseData) => {
        if (responseData.data.status) {
          const newItemSet = data.filter((item) => item.barcode != itemId);
          updateItemsData(newItemSet);
        }
      });
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
    axios
      .get(`http://localhost:3800/api/items/all/${currantPage}/${pageSize}`)
      .then((resolve) => {
        const { data: resolveData } = resolve;
        setStock((currantState) => ({
          ...currantState,
          data: resolveData.data,
          allRowCount: resolveData.count,
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePerRowsChange = (currantPage, pageSize) => {
    setPerPage(pageSize);
    axios
      .get(`http://localhost:3800/api/items/all/${currantPage}/${pageSize}`)
      .then((resolve) => {
        const { data: resolveData } = resolve;
        setStock((currantState) => ({
          ...currantState,
          data: resolveData.data,
          allRowCount: resolveData.count,
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Fragment>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: perPage,
          total: allRowCount,
          onChange: handlePageChange,
          onShowSizeChange: handlePerRowsChange,
        }}
      />
    </Fragment>
  );
}

export default ViewAllStock;
