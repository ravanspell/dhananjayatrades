import React, { Component, Fragment } from 'react';
import './App.css';
import Navigation from './components/navBar';
import ViewOrder from './components/viewOrder';
import Dashboard from "./components/dashboard";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <Fragment>
        <Router>
          <Navigation />
          <Switch>
            <main className="container">
              <Route path="/" exact component={Dashboard} />
              <Route path="/order" exact component={ViewOrder} />
            </main>
          </Switch>
        </Router>
      </Fragment >
    );
  }
}

export default App;

