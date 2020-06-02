import React, { Fragment, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";

function Dashboard(props) {
  const [
    { profitDashboardData, lastMonthTotalProfit, thisMonthTotalProfit },
    setGraphData,
  ] = useState({
    profitDashboardData: { thisMonth: [], thisMonth: [] },
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
  // http://dhananjayatrades.com/
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    axios
      .get("http://localhost:3800/api/dashboard/profit", { signal })
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
        <div className="col-md-6 col-sm-12">
          <div className="nav-scroller bg-white box-shadow p-2 mt-2">
            <h6>Last Month Total Profit: {lastMonthTotalProfit}</h6>
          </div>
        </div>
        <div className="col-md-6 col-sm-12">
          <div className="nav-scroller bg-white box-shadow p-2 mt-2">
            <h6>This Month Total Profit: {thisMonthTotalProfit}</h6>
          </div>
        </div>
      </div>

      <div className="nav-scroller bg-white box-shadow mt-2">
        <Line data={chartData} />
      </div>
    </Fragment>
  );
}

export default Dashboard;
