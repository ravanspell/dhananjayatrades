import React from "react";
import { useHistory } from "react-router-dom";
import { Menu } from "antd";
import {
  ShoppingCartOutlined,
  BarcodeOutlined,
  UploadOutlined,
  StockOutlined,
  BarChartOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";

function SideNav() {
  const { SubMenu } = Menu;
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
  const handleOrderHistoryClick = () => {
    history.push("/order/history");
  };
  const handleCustomersClick = () => {
    history.push("/customers");
  };
  const handleAddCustomersClick = () => {
    history.push("/customers/add");
  };
  return (
    <div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
        <Menu.Item key="0" onClick={handleDashboardClick}>
          <BarChartOutlined />
          <span> Dashboard</span>
        </Menu.Item>

        <SubMenu key="sub2" icon={<ShoppingCartOutlined />} title="Orders">
          <Menu.Item key="x" onClick={handleOrderClick}>
            Order
          </Menu.Item>
          <Menu.Item key="6p" onClick={handleOrderHistoryClick}>
            Order History
          </Menu.Item>
        </SubMenu>
        <SubMenu key="sub3" icon={<UserSwitchOutlined />} title="Customers">
          <Menu.Item key="customers" onClick={handleCustomersClick}>
            Customers
          </Menu.Item>
          <Menu.Item key="add-customers" onClick={handleAddCustomersClick}>
            Add Customers
          </Menu.Item>
        </SubMenu>
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
