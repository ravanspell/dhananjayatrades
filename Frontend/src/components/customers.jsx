import React, { useState, Fragment, useEffect } from "react";
import { Table, Space, Card, Input } from "antd";
import { searchOrders } from "../services/http";
import { useDispatch, useSelector } from "react-redux";
import { getCustomers, selectAllCustomers } from "../slices/customer.slice";

const ViewCustomers = (props) => {
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

  // const [
  //   { allRowCount, showItemEditModal, editDataSet, editItemIndex },
  //   setStock,
  // ] = useState({
  //   allRowCount: 0,
  //   editItemIndex: null,
  //   editDataSet: {},
  //   editId: null,
  //   showItemEditModal: false,
  // });
  const [perPage, setPerPage] = useState(7);
  
  const dispatch = useDispatch();

  const data = useSelector(selectAllCustomers);
  const loading= useSelector(state => state.customers.loading)

  useEffect(() => {
    dispatch(getCustomers())
  }, []);

  const columns = [
    {
      key: "1",
      title: "Customer Id",
      dataIndex: "id",
      sortable: true,
    },
    {
      key: "2",
      title: "Name",
      dataIndex: "name",
      sortable: true,
    },
    {
      key: "3",
      title: "Shop Name",
      dataIndex: "shopName",
      sortable: true,
    },
    {
      key: "4",
      title: "Address",
      dataIndex: "address",
      sortable: true,
    },
    {
      key: "5",
      title: "Contact No",
      dataIndex: "contactNo",
      sortable: true,
    },
    {
      key: "6",
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <button
            style={buttonStyles.edit}
            title="Edit item info"
            onClick={() => { }}
          >
            <i className="fa fa-edit"></i>
          </button>
        </Space>
      ),
    },
  ];

  // const handlePageChange = (currantPage, pageSize) => {
  //   setLoading(true);
  //   getOrderHistory(currantPage, pageSize)
  //     .then((resolve) => {
  //       const { data: resolveData } = resolve;
  //       setLoading(false);
  //       setStock((currantState) => ({
  //         ...currantState,
  //         data: resolveData.data,
  //         allRowCount: resolveData.count,
  //       }));
  //     })
  //     .catch((error) => {
  //       setLoading(false);
  //       console.log(error);
  //     });
  // };

  // const onSearch = async (tearm) => {
  //   console.log(tearm);
  //   if (tearm !== "") {
  //     const result = await searchOrders(tearm);
  //     setStock((currantState) => ({
  //       ...currantState,
  //       data: result.data.data,
  //       allRowCount: result.data.count,
  //     }));
  //   }
  // };

  // const handlePerRowsChange = (currantPage, pageSize) => {
  //   setLoading(true);
  //   setPerPage(pageSize);
  //   getOrderHistory(currantPage, pageSize)
  //     .then((resolve) => {
  //       const { data: resolveData } = resolve;
  //       setLoading(false);
  //       setStock((currantState) => ({
  //         ...currantState,
  //         data: resolveData.data,
  //         allRowCount: resolveData.count,
  //       }));
  //     })
  //     .catch((error) => {
  //       setLoading(false);
  //       console.log(error);
  //     });
  // };
  return (
    <Fragment>
      <Card>
        <Search
          placeholder="search"
          onChange={(e) => {}}
          style={{ width: 350, marginBottom: "10px" }}
        />
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
        //   pagination={{
        //     pageSize: perPage,
        //     total: allRowCount,
        //     onChange: handlePageChange,
        //     onShowSizeChange: handlePerRowsChange,
        //   }}
        />
      </Card>
    </Fragment>
  );
}

export default ViewCustomers;
