import React, { Component, Fragment } from 'react';
import './App.css';
import Navigation from './components/navBar';
import ViewOrder from './components/viewOrder';
import Dashboard from "./components/dashboard";
import NewItemSave from "./components/newItemSave";
import ViewAllStock from "./components/viewAllStock";
import AuthHandller from "./components/authHandllerComponent";
import BarcodeGenarator from "./components/barcodeGenarator";
import Login from "./components/login";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Layout } from 'antd';
import SideNav from "./components/layout/sidebar";

const { Header, Content, Footer, Sider } = Layout;

const style = {
  height: 40,
  width: 40,
  lineHeight: '40px',
  borderRadius: 4,
  backgroundColor: '#1088e9',
  color: '#fff',
  textAlign: 'center',
  fontSize: 14,
};
class App extends Component {
  render() {
    return (
      <Router>
        <Layout>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            style={{
              height: '100vh',

            }}
            onBreakpoint={broken => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
          >
            <div className="logo" />
            <SideNav />
          </Sider>
          <Layout>
            <Header className="site-layout-sub-header-background" style={{ padding: 0 }} />
            <Content style={{ margin: '24px 16px 0' }}>
              <Switch>
                <Route path="/" exact component={Dashboard} />
                <Route path="/order" exact component={ViewOrder} />
                <Route path="/save/item" exact component={NewItemSave} />
                <Route path="/stock/all" exact component={ViewAllStock} />
                <Route path="/barcode" exact component={BarcodeGenarator} />
              </Switch>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
          </Layout>

        </Layout >
      </Router>

    );
  }
}

export default App;

{/* <Fragment>
        <Router>
          <Switch>
            <Route path="/" exact component={Login} />
            <Fragment>
              <Navigation />
              <main className="container">
                <AuthHandller>
                  <Route path="/dashboard" exact component={Dashboard} />
                  <Route path="/order" exact component={ViewOrder} />
                  <Route path="/save/item" exact component={NewItemSave} />
                  <Route path="/stock/all" exact component={ViewAllStock} />
                  <Route path="/barcode" exact component={BarcodeGenarator} />
                </AuthHandller>
              </main>
            </Fragment>
          </Switch>
        </Router>
      </Fragment > */}