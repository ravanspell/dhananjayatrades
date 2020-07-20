import React from "react";
import { Layout } from "antd";
import SideNav from "./sidebar";
import AuthHandller from "../authHandllerComponent";
import { useRouteMatch, Redirect, Switch } from "react-router-dom";
import ViewOrder from "../viewOrder";

const MainLayout = (props) => {
  const { path } = useRouteMatch();
  const { Header, Content, Footer, Sider } = Layout;
  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          height: "100vh",
        }}
        onBreakpoint={(broken) => {
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
        <Header
          className="site-layout-sub-header-background"
          style={{ padding: 0 }}
        />
        <Content style={{ margin: "24px 16px 0" }}>{props.children}</Content>
        <Footer style={{ textAlign: "center" }}></Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
