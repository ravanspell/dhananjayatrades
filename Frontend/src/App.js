import React, { Component, Fragment } from 'react';
import './App.css';
import Navigation from './components/navBar';
import ViewOrder from './components/viewOrder';
import Dashboard from "./components/dashboard";
import NewItemSave from "./components/newItemSave";
import ViewAllStock from "./components/viewAllStock";

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <Fragment>
        <Router>
          <Navigation />
          <Switch>
            <Fragment>
              <main className="container">
                <Route path="/" exact component={Dashboard} />
                <Route path="/order" exact component={ViewOrder} />
                <Route path="/save/item" exact component={NewItemSave} />
                <Route path="/stock/all" exact component={ViewAllStock} />
              </main>
            </Fragment>
          </Switch>
        </Router>
      </Fragment >
    );
  }
}

export default App;

