import React, { Fragment, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { Card, Statistic } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

function Dashboard(props) {
  const [
    { profitDashboardData, lastMonthTotalProfit, thisMonthTotalProfit },
    setGraphData,
  ] = useState({
    profitDashboardData: { thisMonth: [], lastMonth: [] },
    lastMonthTotalProfit: 0,
    thisMonthTotalProfit: 0,
  });

  const chartData = {
    labels: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
      "31",
    ],
    datasets: [
      {
        label: "This Month",
        fill: false,
        borderColor: "#5da7e8",
        pointBackgroundColor: "#2b76b8",
        data: profitDashboardData.thisMonth,
      },
      {
        label: "Last Month",
        fill: false,
        borderColor: "#ed3b5f",
        pointBackgroundColor: "#c42343",
        data: profitDashboardData.lastMonth,
      },
    ],
  };
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    axios
      .get("http://dhananjayatrades.com/api/dashboard/profit", { signal })
      .then((resolve) => {
        console.log(resolve);
        setGraphData((currantState) => ({
          ...currantState,
          profitDashboardData: resolve.data.response,
          lastMonthTotalProfit: calculateTotal(resolve.data.response.lastMonth),
          thisMonthTotalProfit: calculateTotal(resolve.data.response.thisMonth),
        }));
      });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const calculateTotal = (profit) => {
    return profit.reduce((value, total) => value + total);
  };
  return (
    <Fragment>
      <div className="row mt-10">
        <div className="col-md-6 col-sm-12 mb-2">
          <Card>
            <Statistic
              title="Last Month Total Profit (Rs)"
              value={lastMonthTotalProfit}
              precision={2}
              valueStyle={
                lastMonthTotalProfit < 0
                  ? { color: "#cf1322" }
                  : { color: "#3f8600" }
              }
              prefix={
                lastMonthTotalProfit < 0 ? (
                  <ArrowDownOutlined />
                ) : (
                  <ArrowUpOutlined />
                )
              }
            />
          </Card>
        </div>
        <div className="col-md-6 col-sm-12 mb-2">
          <Card>
            <Statistic
              title="This Month Total Profit (Rs)"
              value={thisMonthTotalProfit}
              precision={2}
              valueStyle={
                thisMonthTotalProfit < 0
                  ? { color: "#cf1322" }
                  : { color: "#3f8600" }
              }
              prefix={
                thisMonthTotalProfit < 0 ? (
                  <ArrowDownOutlined />
                ) : (
                  <ArrowUpOutlined />
                )
              }
            />
          </Card>
        </div>
      </div>

      <Card>
        <Line data={chartData} />
      </Card>
    </Fragment>
  );
}

export default Dashboard;
