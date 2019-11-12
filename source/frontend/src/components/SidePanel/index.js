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

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { openGroup, openItinerary } from "../../actions";
import CreateGroup from "./Creategroup";
import CreateItinerary from "./CreateItinerary";
import { axios } from "../oauth";

const drawerWidth = "20rem";
const baseURL = "http://localhost:8000/";
const listGroupsByUser = "members/v1/usergroup/?user_id=";
const listItinerariesByGroup = "itinerary/?group_id=";

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
    this.state = {
      showPopup: false,
      groups: [],
      itineraries: [],
      users: []
    };
  }

  togglePopup() {
    this.setState({ showPopup: !this.state.showPopup });
  }

  componentDidMount() {
    const { curUser } = this.props;
    axios.get(baseURL + listGroupsByUser + curUser.id).then(res => {
      const groups = res.data;
      this.setState({ groups });
    });
  }

  fetchItinerariesByGroup(groupId) {
    axios.get(baseURL + listItinerariesByGroup + groupId).then(res => {
      const itineraries = res.data;
      this.setState({ itineraries });
    });
  }

  render() {
    const { curUser, classes, history } = this.props;
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
            <Typography className={classes.heading} variant="h6">
              Groups
            </Typography>
          </ListItem>

          {groups.map(group => (
            <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                onClick={() => {
                  this.fetchItinerariesByGroup(group.group.id);
                  history.push(`/dashboard/groups/${group.group.id}`);
                }}
              >
                <ListItemIcon>
                  <GroupIcon />
                </ListItemIcon>
                <ListItemText primary={group.group.name} />
              </ExpansionPanelSummary>

              <ExpansionPanelDetails>
                <List>
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
                    <ListItemText primary="Create Itinerary" />
                    <IconButton onClick={this.togglePopup.bind(this)}>
                      {this.state.showPopup ? null : <AddIcon></AddIcon>}
                    </IconButton>
                    {this.state.showPopup ? (
                      <CreateItinerary
                        group={group.group.id}
                        closePopup={this.togglePopup.bind(this)}
                      />
                    ) : null}
                  </ListItem>
                </List>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))}
          <ListItem>
            <ListItemText primary="Create Group" />
            <IconButton onClick={this.togglePopup.bind(this)}>
              {this.state.showPopup ? null : <AddIcon></AddIcon>}
            </IconButton>
            {this.state.showPopup ? (
              <CreateGroup
                user={curUser}
                closePopup={this.togglePopup.bind(this)}
              />
            ) : null}
          </ListItem>
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
