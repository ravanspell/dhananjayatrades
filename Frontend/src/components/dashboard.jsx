import React, { Component, Fragment } from "react";
import { Line } from "react-chartjs";
import axios from "axios";
class Dashboard extends Component {
  state = {
    profitDashboardData: {},
  };
  componentDidMount() {
    axios.get("http://localhost:3800/api/dashboard/profit").then((resolve) => {
      console.log(resolve);
      this.setState({ profitDashboardData: resolve.data.response });
    });
  }
  render() {
    const chartOptions = {
      ///Boolean - Whether grid lines are shown across the chart
      // scaleShowGridLines: true,

      //String - Colour of the grid lines
      scaleGridLineColor: "rgba(0,0,0,.05)",

      //Number - Width of the grid lines
      // scaleGridLineWidth: 1,

      //Boolean - Whether to show horizontal lines (except X axis)
      scaleShowHorizontalLines: true,

      //Boolean - Whether to show vertical lines (except Y axis)
      scaleShowVerticalLines: true,

      //Boolean - Whether the line is curved between points
      bezierCurve: true,

      //Number - Tension of the bezier curve between points
      bezierCurveTension: 0.4,

      //Boolean - Whether to show a dot for each point
      pointDot: true,

      //Number - Radius of each point dot in pixels
      pointDotRadius: 4,

      //Number - Pixel width of point dot stroke
      pointDotStrokeWidth: 1,

      //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
      //pointHitDetectionRadius: 30,

      //Boolean - Whether to show a stroke for datasets
      //datasetStroke: true,

      //Number - Pixel width of dataset stroke
      //datasetStrokeWidth: 2,

      //Boolean - Whether to horizontally center the label and point dot inside the grid
      offsetGridLines: false,

      responsive: true,
      maintainAspectRatio: true,
    };
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
          fillColor: "rgba(220,220,220,0.2)",
          strokeColor: "rgba(220,220,220,1)",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: this.state.profitDashboardData.thisMonth,
        },
        {
          label: "Last Month",
          fillColor: "rgba(151,187,205,0.2)",
          strokeColor: "rgba(151,187,205,1)",
          pointColor: "rgba(151,187,205,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(151,187,205,1)",
          data: this.state.profitDashboardData.lastMonth,
        },
      ],
    };

    return (
      <Fragment>
        <div className="row mt-10">
          <div className="col-md-6 col-sm-12">
            <div className="nav-scroller bg-white box-shadow p-2 mt-2">
              <h6>Last Month Total Profit: 34454</h6>
            </div>
          </div>
          <div className="col-md-6 col-sm-12">
            <div className="nav-scroller bg-white box-shadow p-2 mt-2">
              <h6>Last Month Total Profit: 34454</h6>
            </div>
          </div>
        </div>

        <div className="nav-scroller bg-white box-shadow mt-2">
          <Line data={chartData} options={chartOptions} />
        </div>
      </Fragment>
    );
  }
}

export default Dashboard;
