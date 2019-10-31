import React from "react";
import {
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Button
} from "@material-ui/core";
import CardTravelIcon from "@material-ui/icons/CardTravel";
import GroupIcon from "@material-ui/icons/Group";
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from "@material-ui/core/styles";

const drawerWidth = "23rem";

const styles = theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  toolbar: theme.mixins.toolbar
});

class SidePanel extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper
        }}
        anchor="left"
      >
        <div className={classes.toolbar} />
        <Divider />
        <List>
          <ListItem>
            <Typography variant="h5">Groups</Typography>
            <Button><AddIcon button></AddIcon></Button>
          </ListItem>
          <ListItem button key={"group1"}>
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary={"Group 1"} />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem>
            <Typography variant="h5">Itineraries</Typography>
            <Button><AddIcon button></AddIcon></Button>
          </ListItem>
          <ListItem button key={"itinerary1"}>
            <ListItemIcon>
              <CardTravelIcon />
            </ListItemIcon>
            <ListItemText primary={"Itinerary 1"} />
          </ListItem>
        </List>
      </Drawer>
    );
  }
}

export default withStyles(styles, { withTheme: true })(SidePanel);
