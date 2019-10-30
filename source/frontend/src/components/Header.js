import React from "react";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import SimpleLoginButton from "./oauth/SimpleLoginButton";
import { handleLogout } from "./oauth";
import { clearUser } from "../actions";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
});

class AppHeader extends React.Component {
  render() {
    const { classes } = this.props;
    const loggedIn = !!this.props.currentUser;
    return (
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              TripPlanner
            </Typography>
            {loggedIn ? (
              <Button onClick={handleLogout(this.props)} color="inherit">
                Logout from {this.props.currentUser.first_name}
              </Button>
            ) : (
              <SimpleLoginButton />
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser
});

const connectedComponent = withRouter(
  connect(
    mapStateToProps,
    { clearUser }
  )(AppHeader)
);

export default withStyles(styles, { withTheme: true })(connectedComponent);
