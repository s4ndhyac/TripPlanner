import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Landing from './components/Landing';
import AppHeader from './components/Header';
import Toolbar from '@material-ui/core/Toolbar';
import * as serviceWorker from './serviceWorker';

const router = (
  <Router>
    <div>
      <AppHeader></AppHeader>
      <Toolbar />
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/dashboard" component={Dashboard} />
        <Route component={() => <h1>Not found</h1>} />
      </Switch>
    </div>
  </Router>
)

ReactDOM.render(router, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
