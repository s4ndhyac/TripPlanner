import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import SimpleLoginButton from './oauth/SimpleLoginButton';
import StateStorage from '../StateStorage';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const handleLogout = () => {
  StateStorage.logoutUser();
};

export default function AppHeader() {
  const classes = useStyles();
  const loggedIn = StateStorage.loggedIn();
  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            TripPlanner
          </Typography>
          {loggedIn ? <Button onClick={handleLogout} color="inherit">Logout</Button> : <SimpleLoginButton />}
        </Toolbar>
      </AppBar>
    </div>
  );
}
