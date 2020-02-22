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
    axios.post("http://dhananjayatrades.com/api/orders/add", order).then(resolve => {
      console.log(resolve);
      const { data } = resolve;
      localStorage.clear();
      this.setState({ order: '' });
      this.initOrderData(data);
    })
  }
  updateCounts = (order) => {
    let totalPrice = 0;
    let itemsAmount = 0;
    let totalGotPrice = 0;
    (order.orderItems || []).forEach((item) => {
      if (item.customPrice > 0) {
        totalPrice =
          totalPrice +
          item.customPrice * item.amount;
      } else {
        totalPrice =
          totalPrice +
          (item.unitPrice * item.amount);
      }
      itemsAmount = itemsAmount + 1;
      totalGotPrice = totalGotPrice + (item.gotPrice * item.amount);
    });
    order.itemsAmount = itemsAmount;
    order.totalPrice = totalPrice;
    order.totalGotPrice = totalGotPrice;
    return order
  }
  componentDidMount() {
    this.initOrder();
  }

  /**
   * Initilize the order 
   * save order data structure in browser store to offline usage.
   */
  initOrder = () => {
    let currantOrder = localStorage.getItem("order");
    if (currantOrder != null) {
      this.setState({ order: JSON.parse(currantOrder) });
    } else {
      axios.post("http://dhananjayatrades.com/api/orders/add", {}).then(resolve => {
        const { data } = resolve;
        this.initOrderData(data);
      }).catch(error => {
        console.log(error);
      });
    }
  }

  initOrderData = (data) => {
    localStorage.setItem("order", `{"orderNo":${data.response}, "orderItems": [], "itemsAmount": 0, "totalPrice": 0, "totalGotPrice": 0}`);
    this.setState({ order: { orderNo: data.response, orderItems: {}, itemsAmount: 0, totalPrice: 0 } });
  }
  deleteOrderItem = (orderId) => {
    let order = this.state.order;
    order.orderItems = order.orderItems.filter(orderItem => orderItem.barcode !== orderId);
    this.setState({ order: this.updateCounts(order) });
    localStorage.setItem('order', JSON.stringify(order));
  }

  // editOrderItem = (orderId) =>{
  //   let order = this.state.order;
  //   order.orderItems = order.orderItems.map(orderItem => {
  //     id(orderItem.id == orderId){
  //       return {

  //       }
  //     }
  //     });
  //   this.setState({ order: this.updateCounts(order) });
  //   localStorage.setItem('order', JSON.stringify(order));
  // }
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

