import React, { Component, Fragment } from 'react';
import './App.css';
import Navigation from './components/navBar';
import ViewOrder from './components/viewOrder';
import Dashboard from "./components/dashboard";
import NewItemSave from "./components/newItemSave";
import ViewAllStock from "./components/viewAllStock";
import AuthHandller from "./components/authHandllerComponent";
import Login from "./components/login";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <Fragment>
        <Router>
          <Switch>
            <Route path="/login" exact component={Login} />
            <Fragment>
              <Navigation />
              <main className="container">
                <AuthHandller>
                  <Route path="/" exact component={Dashboard} />
                  <Route path="/order" exact component={ViewOrder} />
                  <Route path="/save/item" exact component={NewItemSave} />
                  <Route path="/stock/all" exact component={ViewAllStock} />
                </AuthHandller>
              </main>
            </Fragment>
          </Switch>
        </Router>
      </Fragment >
    );
  }
}

export default App;

