import React, { Component, Fragment } from 'react';
import './App.css';
import Navigation from './components/navBar';
import ViewOrder from './components/viewOrder';
import axios from 'axios';

class App extends Component {
  render() {
    return (
      <Fragment>
        <Navigation />
        <main className="container">
          <ViewOrder />
        </main>
      </Fragment >
    );
  }
}

export default App;

