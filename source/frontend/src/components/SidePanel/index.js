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
import IconButton from "@material-ui/core/IconButton";
import CardTravelIcon from "@material-ui/icons/CardTravel";
import GroupIcon from "@material-ui/icons/Group";
import AddIcon from "@material-ui/icons/Add";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
          <Typography className={classes.heading}>Groups</Typography>
          </ExpansionPanelSummary>
            
            <Typography >
            {groups.map(group => (
            <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary={group.name} />
            </ExpansionPanelSummary>
            
            <ExpansionPanelDetails>
            <Typography>
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
            
            <ListItem>
              <IconButton onClick={this.togglePopup.bind(this)}>
                <AddIcon></AddIcon>
              </IconButton>
            {this.state.showPopup ? <CreateGroup user={curUser} closePopup={this.togglePopup.bind(this)}/> : null}
            </ListItem>
            </Typography>
            </ExpansionPanelDetails>
            
            </ExpansionPanel>
            ))}
            </Typography>
        </ExpansionPanel>
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
