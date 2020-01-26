import React, { Component, Fragment } from 'react';
import './App.css';
import Navigation from './components/navBar';
import ViewOrder from './components/viewOrder';
import axios from 'axios';
class App extends Component {
  state = {
    order: ''
  }
  updateOrder = (order) => {
    this.setState({ order: this.updateCounts(order) });
  }

  finishOrder = () => {
    let order = this.state.order;
    Object.keys(order.orderItems || {}).forEach(item => {
      order.orderItems[item]['orderId'] = order.orderNo
      order.orderItems[item]['unitPrice'] = order.orderItems[item].customPrice || order.orderItems[item].price
      order.orderItems[item]['total'] = order.orderItems[item]['unitPrice'] * order.orderItems[item].amount
    });

    axios.post("http://dhananjayatrades.com/api/orders/add", order).then(resolve => {
      console.log(resolve);
      localStorage.clear();
      this.setState({ order: '' });
      this.initOrder();
    })
  }
  updateCounts = (order) => {
    let totalPrice = 0;
    let itemsAmount = 0;
    Object.keys(order.orderItems || {}).forEach((item) => {
      if (order.orderItems[item].customPrice > 0) {
        totalPrice =
          totalPrice +
          order.orderItems[item].customPrice * order.orderItems[item].amount;
      } else {
        totalPrice =
          totalPrice +
          order.orderItems[item].price * order.orderItems[item].amount;
      }
      itemsAmount = itemsAmount + 1;
    });
    order.itemsAmount = itemsAmount;
    order.totalPrice = totalPrice;
    return order
  }
  componentDidMount() {
    this.initOrder();
  }

  initOrder = () => {
    let currantOrder = localStorage.getItem("order");
    if (currantOrder != null) {
      this.setState({ order: JSON.parse(currantOrder) });
    } else {
      axios.post("http://dhananjayatrades.com/api/orders/add", {}).then(resolve => {
        const { data } = resolve;
        localStorage.setItem("order", `{"orderNo":${data.response}, "orderItems": {}, "itemsAmount": 0, "totalPrice": 0}`);
        this.setState({ order: { orderNo: data.response, orderItems: {}, itemsAmount: 0, totalPrice: 0 } });
      }).catch(error => {
        console.log(error);
      });
    }
  }
  deleteOrderItem = (orderId) => {
    let order = this.state.order;
    delete order.orderItems[orderId];
    this.setState({ order: this.updateCounts(order) });
    localStorage.setItem('order', JSON.stringify(order));
  }
  render() {
    return (
      <Fragment>
        <Navigation />
        <main className="container">
          <ViewOrder
            order={this.state.order}
            updateOrder={this.updateOrder}
            removeOrderItem={this.deleteOrderItem}
            finishOrder={this.finishOrder} />
        </main>
      </Fragment >
    );
  }
}

export default App;

