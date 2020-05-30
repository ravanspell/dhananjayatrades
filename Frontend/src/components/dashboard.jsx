import React, { Component, Fragment } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
class Dashboard extends Component {
  state = {
    profitDashboardData: {},
    lastMonthTotalProfit: 0,
    thisMonthTotalProfit: 0,
  };
  // http://dhananjayatrades.com/
  componentDidMount() {
    axios
      .get("http://dhananjayatrades.com/api/dashboard/profit")
      .then((resolve) => {
        console.log(resolve);
        this.setState({
          profitDashboardData: resolve.data.response,
          lastMonthTotalProfit: this.calculateTotal(
            resolve.data.response.lastMonth
          ),
          thisMonthTotalProfit: this.calculateTotal(
            resolve.data.response.thisMonth
          ),
        });
      });
  }
  calculateTotal = (profit) => {
    return profit.reduce((value, total) => value + total);
  };
  render() {
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
          data: this.state.profitDashboardData.thisMonth,
        },
        {
          label: "Last Month",
          fill: false,
          borderColor: "#ed3b5f",
          pointBackgroundColor: "#c42343",
          data: this.state.profitDashboardData.lastMonth,
        },
      ],
    };
    return (
      <Fragment>
        <div className="row mt-10">
          <div className="col-md-6 col-sm-12">
            <div className="nav-scroller bg-white box-shadow p-2 mt-2">
              <h6>
                Last Month Total Profit: {this.state.lastMonthTotalProfit}
              </h6>
            </div>
          </div>
          <div className="col-md-6 col-sm-12">
            <div className="nav-scroller bg-white box-shadow p-2 mt-2">
              <h6>
                This Month Total Profit: {this.state.thisMonthTotalProfit}
              </h6>
            </div>
          </div>
        </div>

        <div className="nav-scroller bg-white box-shadow mt-2">
          <Line data={chartData} />
        </div>
      </Fragment>
    );
  }
}

export default Dashboard;
