import React from 'react';
import './App.css';
import ViewOrder from './components/viewOrder';
import Dashboard from "./components/dashboard";
import NewItemSave from "./components/newItemSave";
import ViewAllStock from "./components/viewAllStock";
import AuthHandller from "./components/authHandllerComponent";
import BarcodeGenarator from "./components/barcodeGenarator";
import OrderHistory from "./components/orderHistory";
import Login from "./components/login";
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import MainLayout from "./components/layout/mainLayout";
import PageNotFound from "./components/layout/pageNotFound";
import SaveNewCustomer from './components/addCustomers';
import ViewCustomers from './components/customers';
import { ADMIN, USER, SUPER_ADMIN } from './constants'
import KitchenOrderView from './components/KitchenOrderView';
// const style = {
//   height: 40,
//   width: 40,
//   lineHeight: '40px',
//   borderRadius: 4,
//   backgroundColor: '#1088e9',
//   color: '#fff',
//   textAlign: 'center',
//   fontSize: 14,
// };

// const publicRoutes = [
//   {
//     key: "login",
//     path: "/login",
//     component: Login,
//     exact: true
//   },
// ]

export const privateRoutes = [
  {
    key: "orders",
    path: "/",
    component: ViewOrder,
    exact: true,
    roles: [ADMIN, USER, SUPER_ADMIN]
  },
  {
    key: "dashboard",
    path: "/dashboard",
    component: Dashboard,
    exact: true,
    roles: [SUPER_ADMIN]
  },
  {
    key: "stock",
    path: "/stock/all",
    component: ViewAllStock,
    exact: true,
    roles: [ADMIN, USER, SUPER_ADMIN],
  },
  {
    key: "barcode",
    path: "/barcode",
    component: BarcodeGenarator,
    exact: true,
    roles: [ADMIN, USER, SUPER_ADMIN],
  },
  {
    key: "newItem",
    path: "/save/item",
    component: NewItemSave,
    exact: true,
    roles: [ADMIN, SUPER_ADMIN],
  },
  {
    key: "history",
    path: "/order/history",
    component: OrderHistory,
    exact: true,
    roles: [SUPER_ADMIN],
  },
  {
    key: "customers",
    path: "/customers",
    component: ViewCustomers,
    exact: true,
    roles: [ADMIN, USER, SUPER_ADMIN],
  },
  {
    key: "add-customers",
    path: "/customers/add",
    component: SaveNewCustomer,
    exact: true,
    roles: [ADMIN, SUPER_ADMIN],
  },
  // {
  //   key: "kitchen-view",
  //   path: "/kitchen",
  //   component: KitchenOrderView,
  //   exact: true,
  //   roles: [USER, ADMIN, SUPER_ADMIN],
  // },
];
const App = () => {
  return (
    <Router>
      <Switch>
      <Route exact path="/kitchen">
          <MainLayout>
            <Switch>
            <Route component={KitchenOrderView} />
            </Switch>
          </MainLayout>
        </Route>
        <Route exact path="/login">
          <Switch>
            <Route component={Login} />
          </Switch>
        </Route>
        <Route exact path={[
          "/",
          "/dashboard",
          "/barcode",
          "/save/item",
          "/stock/all",
          "/order/history",
          "/customers",
          "/customers/add",
        ]}>
          <MainLayout>
            <Switch>
              {privateRoutes.map(privateRouteProps => (
                <AuthHandller {...privateRouteProps} />
              ))}
            </Switch>
          </MainLayout>
        </Route>
        <Route path="*">
          <Switch>
            <Route component={PageNotFound} />
          </Switch>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;