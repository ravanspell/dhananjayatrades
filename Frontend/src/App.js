import React from 'react';
import './App.css';
import ViewOrder from './components/viewOrder';
import Dashboard from "./components/dashboard";
import NewItemSave from "./components/newItemSave";
import ViewAllStock from "./components/viewAllStock";
import AuthHandller from "./components/authHandllerComponent";
import BarcodeGenarator from "./components/barcodeGenarator";
import Login from "./components/login";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MainLayout from "./components/layout/mainLayout";
import PageNotFound from "./components/layout/pageNotFound";

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

const privateRoutes = [
  {
    key: "orders",
    path: "/",
    component: ViewOrder,
    exact: true
  },
  {
    key: "dashboard",
    path: "/dashboard",
    component: Dashboard,
    exact: true
  },
  {
    key: "stock",
    path: "/stock/all",
    component: ViewAllStock,
    exact: true
  },
  {
    key: "barcode",
    path: "/barcode",
    component: BarcodeGenarator,
    exact: true
  },
  {
    key: "newItem",
    path: "/save/item",
    component: NewItemSave,
    exact: true
  },
];
const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/login">
          <Switch>
            <Route component={Login} />
          </Switch>
        </Route>
        <Route exact path={["/", "/dashboard", "/barcode", "/save/item", "/stock/all"]}>
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