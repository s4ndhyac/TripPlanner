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
  Button,
  TextField
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CardTravelIcon from "@material-ui/icons/CardTravel";
import GroupIcon from "@material-ui/icons/Group";
import AddIcon from "@material-ui/icons/Add";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import short from "short-uuid";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { openGroup, openItinerary } from "../../actions";
import { axios } from "../oauth";
import { pusherSubscribe, pusherPublish } from "../../utils";

const drawerWidth = "20rem";
const listGroupsByUser = "/members/v1/usergroup/?user_id=";
const listItinerariesByGroup = "/itinerary/?group_id=";
const groupAPI = "/members/addGroup/";
const createItineraryAPI = "/itinerary/";

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
      showItineraryPopup: {},
      groups: [],
      itineraries: {},
      users: [],
      inputGroup: "",
      inputItinerary: ""
    };

    this.handleSubmitGroup = this.handleSubmitGroup.bind(this);
  }

  handleSubmit(event, groupId) {
    const input = document.getElementById("itineraryname" + groupId).value;
    alert("A new itinerary was created: " + input);
    const itinerary = {
      name: input,
      plan: {},
      group: groupId
    };

    axios
      .post(createItineraryAPI, itinerary)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    event.preventDefault();
    document.getElementById("itineraryname" + groupId).value = "";
    this.toggleItineraryPopup(groupId);
  }

  handleSubmitGroup(event) {
    const input = document.getElementById("groupname").value;
    alert("A new group was created: " + input);
    this.setState({ inputGroup: input });
    const { curUser } = this.props;
    const user = {
      name: input,
      email: curUser.email
    };
    axios
      .post(groupAPI, user)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    event.preventDefault();
    document.getElementById("groupname").value = "";
    this.togglePopup();
  }

  togglePopup() {
    this.setState({ showPopup: !this.state.showPopup });
  }

  toggleItineraryPopup(groupId) {
    const curr_show_itineraries = this.state.showItineraryPopup;
    if (!(groupId in curr_show_itineraries))
      curr_show_itineraries[groupId] = true;
    else curr_show_itineraries[groupId] = !curr_show_itineraries[groupId];
    this.setState({ showItineraryPopup: curr_show_itineraries });
  }

  componentDidMount() {
    const { curUser } = this.props;
    let currentComponent = this;

    axios.get(listGroupsByUser + curUser.id).then(res => {
      const groups = res.data;
      this.setState({ groups });
    }).then(function () {
      const { groups } = currentComponent.state;
      groups.map((usergroup) => {
        pusherSubscribe('private-itinerary-edit-channel-' + usergroup.group.id, 'client-itinerary-edit', html => {
          document.getElementById("itineraryname" + usergroup.group.id).innerHTML = html;
        });
      });
    });

    pusherSubscribe('groups-channel', 'add-group', data => {
      axios.get(listGroupsByUser + curUser.id).then(res => {
        const groups = res.data;
        this.setState({ groups });
      });
    });

    pusherSubscribe('itinerary-channel', 'add-itinerary', data => {
      const groupId = data.group;
      let currentComponent = this;
      axios.get(listItinerariesByGroup + groupId).then(res => {
        const curr_itineraries = currentComponent.state.itineraries;
        curr_itineraries[groupId] = res.data;
        console.log(curr_itineraries);
        currentComponent.setState({ itineraries: curr_itineraries });
      });
    });
  }

  itineraryTriggerChange(e, groupId) {
    pusherPublish('private-itinerary-edit-channel-' + groupId, 'client-itinerary-edit', e.target.innerHTML);
  }

  fetchItinerariesByGroup(groupId) {
    if (!(groupId in this.state.itineraries)) {
      axios.get(listItinerariesByGroup + groupId).then(res => {
        const curr_itineraries = this.state.itineraries;
        curr_itineraries[groupId] = res.data;
        console.log(curr_itineraries);
        this.setState({ itineraries: curr_itineraries });
      });
    }
  }

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
          <ListItem key={short.generate()}>
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
                  {group.group.id in itineraries
                    ? itineraries[group.group.id].map(itinerary => (
                      <ListItem
                        button
                        key={`itinerary-${itinerary.id}`}
                        onClick={() =>
                          history.push(
                            `/dashboard/itineraries/${itinerary.id}`
                          )
                        }
                      >
                        <ListItemIcon>
                          <CardTravelIcon />
                        </ListItemIcon>
                        <ListItemText primary={itinerary.name} />
                      </ListItem>
                    ))
                    : null}

                  <ListItem key={short.generate()}>
                    <ListItemText primary="Create Itinerary" />
                    <IconButton
                      onClick={() => this.toggleItineraryPopup(group.group.id)}
                    >
                      {this.state.showItineraryPopup[group.group.id] ? null : (
                        <AddIcon></AddIcon>
                      )}
                    </IconButton>
                    {this.state.showItineraryPopup[group.group.id] ? (
                      <div className="CreateItinerary">
                        <TextField
                          id={"itineraryname" + group.group.id}
                          label="Itinerary Name"
                          type="itinerary-name"
                          margin="normal"
                          variant="outlined"
                          onChange={(e) => this.itineraryTriggerChange(e, group.group.id)}
                        />
                        <Button
                          color="primary"
                          onClick={e => this.handleSubmit(e, group.group.id)}
                        >
                          Submit
                        </Button>
                      </div>
                    ) : null}
                  </ListItem>
                </List>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))}
          <ListItem key={short.generate()}>
            <ListItemText primary="Create Group" />
            <IconButton onClick={this.togglePopup.bind(this)}>
              {this.state.showPopup ? null : <AddIcon></AddIcon>}
            </IconButton>
            {this.state.showPopup ? (
              <div className="Creategroup">
                <TextField
                  id="groupname"
                  label="Group Name"
                  type="group-name"
                  margin="normal"
                  variant="outlined"
                />
                <Button color="primary" onClick={this.handleSubmitGroup}>
                  Submit
                </Button>
              </div>
            ) : null}
          </ListItem>
        </List>
      </Drawer>
    );
  }
}

const connectedComponent = withRouter(
  connect(null, { openGroup, openItinerary })(SidePanel)
);

export default withStyles(styles, { withTheme: true })(connectedComponent);
