import React from "react";
import { connect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/core/styles";

import SidePanel from "./SidePanel";
import MainPanel from "./MainPanel";
import { Typography } from "@material-ui/core";
import { collapseSidebar, expandSidebar } from "../actions";

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
    const { classes, panel, currentUser, isCollapsed } = this.props;
    const { id } = this.props.match.params;
    if (!!!currentUser) {
      return <Redirect to="/" />;
    }
    return (
      <Container maxWidth="xl" className={classes.root}>
        {!!!isCollapsed ? (<SidePanel curUser={currentUser}></SidePanel>) : ('')}
        {panel === undefined ? (
          <Typography variant="h4" style={{ paddingTop: "2rem" }}>
            Welcome to your dashboard, {currentUser.first_name}!
          </Typography>
        ) : (
            <MainPanel panel={panel} itemId={id} curUser={currentUser} className={classes.content}></MainPanel>
          )}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentPanel: state.panel,
  isCollapsed: state.sidebar.isCollapsed,
});

const connectedComponent = withRouter(
  connect(
    mapStateToProps,
    { collapseSidebar, expandSidebar }
  )(Dashboard)
);

export default withStyles(styles, { withTheme: true })(connectedComponent);
