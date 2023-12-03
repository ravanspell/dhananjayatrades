import React, { useState, Fragment, useEffect } from "react";
import { Table, DatePicker, Card, Space, Button, Row, Col, Statistic, Tag } from "antd";
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { getOrderHistory, searchOrders } from "../services/http";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { DINE_IN, TAKE_WAY } from "../constants";
import { clearOldOrder, fetchOldOrder } from "../slices/order.slice";
import ViewOldOrder from "./viewOldOrder";

// initial filter defined here for ease of clear filters
const initialFilters = {
  dateRange: { startDate: null, endDate: null },
  isHasFilters: false,
}
const { RangePicker } = DatePicker;

function OrderHistory(props) {

  const [filters, setFilters] = useState(initialFilters)
  const dispatch = useDispatch();
  const { 
    orderItems, 
    loading: oldOrderLoading, 
    orderId: oldOrderId } = useSelector((state) => state.orders.oldOrder);

  const [
    { data, allRowCount, ordersTotal, ordersCost },
    setStock,
  ] = useState({
    data: [],
    allRowCount: 0,
    ordersTotal: 0,
    ordersCost: 0,
    editId: null,
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
      });
  }, []);

  const handleGetOrderContent = (orderId) => {
    dispatch(fetchOldOrder(orderId))
  };

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
      dataIndex: "id",
      sortable: true,
    },
    {
      key: "3",
      title: "Cost",
      dataIndex: "totalCost",
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
      title: "Service Charge",
      dataIndex: "serviceCharge",
      sortable: true,
    },
    {
      key: "6",
      title: "Customer Name",
      dataIndex: "name",
      sortable: true,
    },
    {
      key: "9",
      title: "Type",
      render: (text, record) => {
        if (record.type === DINE_IN) {
          return (
            <Tag color="green">Dine In</Tag>
          )
        }
        if (record.type === TAKE_WAY) {
          return (
            <Tag color="cyan">Take Away</Tag>
          )
        }
      },
    },
    {
      key: "10",
      title: "Actions",
      render: (text, record) => (
        <Button
          key={record.id}
          type="dashed"
          icon={<EyeOutlined />}
          htmlType="button"
          loading={oldOrderId === record.id && oldOrderLoading}
          onClick={() => handleGetOrderContent(record.id)}
        />
      ),
    },
  ];

  const handlePageChange = (currantPage, pageSize) => {
    setLoading(true);
    const params = getFilterParams()
    getOrderHistory(currantPage, pageSize, params)
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
      });
  };

  const onSearch = async (tearm) => {
    if (tearm !== "") {
      const result = await searchOrders(tearm);
      setStock((currantState) => ({
        ...currantState,
        data: result.data.data,
        allRowCount: result.data.count,
      }));
    }
  };

  const getFilterParams = () => {
    let params = ""
    const { startDate, endDate } = filters.dateRange;
    // set start date and end date
    if (startDate || endDate) {
      params = `${params}&startDate=${startDate}&endDate=${endDate}`;
    }
    return `?${params}`;
  }

  const onFilter = async () => {
    const params = getFilterParams()

    if (params) {
      const result = await getOrderHistory(1, 7, params);
      const {
        data,
        count,
        ordersTotal,
        ordersCost } = result.data
      setStock(state => ({
        ...state,
        data,
        allRowCount: count,
        ordersTotal,
        ordersCost,
      }))
    }
  };

  const onClearFilter = async () => {
    const result = await getOrderHistory(1, 7)
    const { data, count } = result.data
    setStock(state => ({
      ...state,
      data,
      allRowCount: count,
      ordersTotal: 0,
      ordersCost: 0,
    }))
    setFilters(initialFilters);
  }

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
      });
  };
  return (
    <Fragment>
      {filters.isHasFilters && (
        <Row gutter={[32, 16]} style={{ marginBottom: '10px' }}>
          <Col span={12}>
            <Card bordered>
              <Statistic title="Number of orders" value={allRowCount} />
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered>
              <Statistic title="Total Income" value={ordersTotal || 0} precision={2} />
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered>
              <Statistic title="Total Cost" value={ordersCost || 0} precision={2} />
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered>
              <Statistic title="Total Profit" value={ordersTotal - ordersCost} precision={2} />
            </Card>
          </Col>
        </Row>
      )}

      <Card>
        <Space>
          {/* <Search
            placeholder="search"
            onChange={(e) => onSearch(e.target.value)}
            style={{ width: 350, marginBottom: "10px" }}
          /> */}
          <RangePicker
            showTime
            value={[
              filters.dateRange.startDate ? moment(filters.dateRange.startDate) : "",
              filters.dateRange.endDate ? moment(filters.dateRange.endDate) : ""
            ]}
            onCalendarChange={(dates) => {
              const [startDate, endDate] = dates;
              if (startDate) {
                setFilters({
                  dateRange: {
                    startDate: moment(startDate).format('YYYY-MM-DD HH:mm:ss'),
                    endDate: null,
                  },
                  isHasFilters: true
                })
              }
              if (endDate) {
                setFilters(state => ({
                  ...state,
                  dateRange: {
                    ...state.dateRange,
                    endDate: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                  },
                }))
              }
            }}
          />
          <Button type="primary" onClick={onFilter} icon={<SearchOutlined />} > Search </Button>
          <Button type="primary" onClick={onClearFilter} > Clear </Button>
        </Space>

        <Table
          style={{ marginTop: "10px" }}
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
      <ViewOldOrder
        show={orderItems.length > 0}
        data={orderItems}
        onHide={() => dispatch(clearOldOrder())}
        orderId={oldOrderId}
      />
    </Fragment>
  );
}

export default OrderHistory;
