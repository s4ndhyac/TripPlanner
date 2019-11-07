import React from "react";
import { connect } from "react-redux";
import {
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import CardTravelIcon from "@material-ui/icons/CardTravel";
import GroupIcon from "@material-ui/icons/Group";
import AddIcon from "@material-ui/icons/Add";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { openGroup, openItinerary } from "../../actions";
import CreateGroup from "./Creategroup"

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
  
  constructor(props) {
    super(props);
    this.state = {showPopup: false,
                  groups: [{name: "My Group 1", id: 1}, 
                           {name: "My Group 2", id: 2}],
                  itineraries: [{name: "Trip to LA", id: 1},
                                {name: "Trip to SF", id: 2}]
    }
  }

  togglePopup() {
    this.setState({showPopup: !this.state.showPopup});
  }

  render() {
    const { curUser, classes, history } = this.props;
    const { showPopup, groups, itineraries } = this.state;
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
            <IconButton onClick={this.togglePopup.bind(this)}>
              <AddIcon></AddIcon>
            </IconButton>
            {this.state.showPopup ? <CreateGroup user={curUser} closePopup={this.togglePopup.bind(this)}/> : null}
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
            <IconButton>
              <AddIcon></AddIcon>
            </IconButton>
            <IconButton>

            </IconButton>
            <FormControl variant="filled" className={classes.formControl} fullWidth={true} margin='dense'>
              <InputLabel id="simple-select-filled-label">Group</InputLabel>
              <Select
                labelId="simple-select-filled-label"
                id="simple-select-filled"
                value={20}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Group 1</MenuItem>
                <MenuItem value={20}>Group 2</MenuItem>
                <MenuItem value={30}>Group 3</MenuItem>
              </Select>
            </FormControl>

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
