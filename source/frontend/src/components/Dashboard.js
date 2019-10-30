import React from "react";
import { connect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/core/styles";

import SidePanel from "./SidePanel";
import MainPanel from "./MainPanel";

const styles = theme => ({
  root: {
    display: "flex"
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3)
  },
  toolbar: theme.mixins.toolbar
});

class Dashboard extends React.Component {
  render() {
    const user = this.props.currentUser;
    const { classes } = this.props;
    if (!!!user) {
      return <Redirect to="/" />;
    }
    return (
      <Container maxWidth="xl" className={classes.root}>
        <SidePanel></SidePanel>
        <MainPanel className={classes.content}></MainPanel>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser
});

const connectedComponent = withRouter(
  connect(
    mapStateToProps,
    {}
  )(Dashboard)
);

export default withStyles(styles, { withTheme: true })(connectedComponent);
