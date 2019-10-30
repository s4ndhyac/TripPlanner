import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Landing from "./components/Landing";
import AppHeader from "./components/Header";
import Toolbar from "@material-ui/core/Toolbar";
import * as serviceWorker from "./serviceWorker";

import { Provider, connect } from "react-redux";
import { setUser, clearUser } from "./actions";
import configureStore from "./configureStore";
import { PersistGate } from "redux-persist/lib/integration/react";

const { store, persistor } = configureStore();

class Root extends React.Component {
  componentDidMount() {
    if (!!this.props.currentUser) {
      this.props.history.push("/dashboard");
    }
  }

  render() {
    return (
      <div>
        <AppHeader></AppHeader>
        <Toolbar />
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route path="/dashboard" component={Dashboard} />
          <Route component={() => <h1>Not found</h1>} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser
});

const RootWithAuth = withRouter(
  connect(
    mapStateToProps,
    { setUser, clearUser }
  )(Root)
);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <Router>
        <RootWithAuth />
      </Router>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
