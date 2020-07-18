import React from "react";
import { useHistory } from "react-router-dom";
import { Menu } from "antd";
import {
  ShoppingCartOutlined,
  BarcodeOutlined,
  UploadOutlined,
  StockOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

function SideNav() {
  const history = useHistory();
  const handleOrderClick = () => {
    history.push("/");
  };
  const handleBrcodeGenClick = () => {
    history.push("/barcode");
  };
  const handleFileClick = () => {
    history.push("/save/item");
  };
  const handleStockClick = () => {
    history.push("/stock/all");
  };

  const handleDashboardClick = () => {
    history.push("/dashboard");
  };
  return (
    <div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
        <Menu.Item key="0" onClick={handleDashboardClick}>
          <BarChartOutlined />
          <span> Dashboard</span>
        </Menu.Item>
        <Menu.Item key="1" onClick={handleOrderClick}>
          <ShoppingCartOutlined />
          <span> Order</span>
        </Menu.Item>
        <Menu.Item key="2" onClick={handleBrcodeGenClick}>
          <BarcodeOutlined />
          <span> Barcode Gen</span>
        </Menu.Item>
        <Menu.Item key="3" onClick={handleFileClick}>
          <UploadOutlined />
          <span> New Item</span>
        </Menu.Item>
        <Menu.Item key="4" onClick={handleStockClick}>
          <StockOutlined />
          <span> Stocks</span>
        </Menu.Item>
      </Menu>
    </div>
  );
}
export default SideNav;
