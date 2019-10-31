import React from "react";
import { connect } from "react-redux";
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
import AddIcon from "@material-ui/icons/Add";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";

import { openGroup, openItinerary } from "../../actions";

const drawerWidth = "20rem";

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
  state = {
    groups: [
      {
        name: "My Group 1",
        id: 1
      },
      {
        name: "Random group 2",
        id: 2
      }
    ],
    itineraries: [
      {
        name: "Trip to LA",
        id: 1
      },
      {
        name: "Trip to SF",
        id: 2
      }
    ]
  };

  render() {
    const { classes, history } = this.props;
    const { groups, itineraries } = this.state;
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
            <Button>
              <AddIcon></AddIcon>
            </Button>
          </ListItem>
          {groups.map(group => (
            <ListItem
              button
              key={`group-${group.id}`}
              onClick={() => history.push(`/dashboard/groups/${group.id}`)}
            >
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary={group.name} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem>
            <Typography variant="h5">Itineraries</Typography>
            <Button>
              <AddIcon></AddIcon>
            </Button>
          </ListItem>
          {itineraries.map(itinerary => (
            <ListItem
              button
              key={`itinerary-${itinerary.id}`}
              onClick={() =>
                history.push(`/dashboard/itineraries/${itinerary.id}`)
              }
            >
              <ListItemIcon>
                <CardTravelIcon />
              </ListItemIcon>
              <ListItemText primary={itinerary.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    );
  }
}

const connectedComponent = withRouter(
  connect(
    null,
    { openGroup, openItinerary }
  )(SidePanel)
);

export default withStyles(styles, { withTheme: true })(connectedComponent);
