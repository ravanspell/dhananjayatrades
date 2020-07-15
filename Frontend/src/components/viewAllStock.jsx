import React, { useState, Fragment, useEffect } from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { useSelector, useDispatch } from "react-redux";
import EditStockItem from "./editItemModal";
import axios from "axios";

function ViewAllStock(props) {
  const [
    { data, showItemEditModal, editId, editDataSet, editItemIndex },
    setStock,
  ] = useState({
    data: [],
    showItemEditModal: false,
    editId: null,
    editItemIndex: null,
    editDataSet: {},
  });
  // http://localhost:3800/
  useEffect(() => {
    axios
      .get("http://dhananjayatrades.com/api/items/all")
      .then((resolve) => {
        const { data: resolveData } = resolve;
        setStock((currantState) => ({
          ...currantState,
          data: resolveData.data,
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const columns = [
    {
      name: "barcode",
      selector: "barcode",
      sortable: true,
    },
    {
      name: "name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Got Price",
      selector: "got_price",
      sortable: true,
    },
    {
      name: "Ton Price",
      selector: "t",
      sortable: true,
    },
    {
      name: "Whole Price",
      selector: "w",
      sortable: true,
    },
    {
      name: "Retail Price",
      selector: "r",
      sortable: true,
    },
    {
      name: "Stock",
      selector: "stock",
      sortable: true,
    },
    {
      name: "Company",
      selector: "company",
      sortable: true,
    },
    {
      cell: (row) => (
        <Fragment>
          <button
            className="btn btn-info btn-sm mr-1"
            title="Edit item info"
            onClick={() => handleAction(row.barcode)}
          >
            <i className="fa fa-edit"></i>
          </button>
          <button
            className="btn btn-danger btn-sm"
            title="Delete item"
            onClick={() => removeStockItem(row.barcode)}
          >
            <i className="fa fa-trash"></i>
          </button>
        </Fragment>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const removeStockItem = (itemId) => {
    axios
      .delete("http://dhananjayatrades.com/api/items/delete", {
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
  return (
    <Fragment>
      <DataTableExtensions {...tableData}>
        <DataTable
          title="All Stock"
          pagination={true}
          columns={columns}
          data={data}
          paginationPerPage={7}
          paginationServer={true}
          // striped={true}
          theme={"dark"}
          button={true}
        />
      </DataTableExtensions>
      <EditStockItem
        show={showItemEditModal}
        editid={editId}
        editdata={editDataSet}
        progressPending={true}
        edititemindex={editItemIndex}
        data={data}
        updatedata={updateItemsData}
        onHide={modalClose}
      />
    </Fragment>
  );
}

export default ViewAllStock;
