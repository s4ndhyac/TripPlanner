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
  TextField,
  Grid,
  Tooltip
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Badge from '@material-ui/core/Badge';
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
import Avatar from '@material-ui/core/Avatar';

import { openGroup, openItinerary } from "../../actions";
import { axios } from "../oauth";
import { pusherSubscribe, pusherPublish, stringToColor } from "../../utils";

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
      users: {},
      inputGroup: "",
      inputItinerary: "",
      curr_group: null,
      group_badges: {}
    };

    this.handleSubmitGroup = this.handleSubmitGroup.bind(this);
  }

  toggleBadgeVisibility(groupId) {
    const curr_badges = this.state.group_badges;
    if (!(groupId in curr_badges))
      curr_badges[groupId] = false;
    else
      curr_badges[groupId] = !curr_badges[groupId];
    this.setState({ group_badges: curr_badges });
  }

  setBadgeInvisible(groupId) {
    const curr_badges = this.state.group_badges;
    curr_badges[groupId] = true;
    this.setState({ group_badges: curr_badges });
  }

  setBadgeVisible(groupId) {
    const curr_badges = this.state.group_badges;
    curr_badges[groupId] = false;
    this.setState({ group_badges: curr_badges });
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
    const { curUser } = this.props;
    const input = document.getElementById("groupname" + curUser.id).value;
    alert("A new group was created: " + input);
    this.setState({ inputGroup: input });
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
    document.getElementById("groupname" + curUser.id).value = "";
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
    this.setState({ showItineraryPopup: curr_show_itineraries })
  }

  displayUserPresence = () => {
    const { users, curr_group } = this.state;
    const group_members = users[curr_group];
    return (
      group_members.map(member => {
        const name = member.first_name + " " + member.last_name;
        const color = stringToColor(name + " " + short.generate());
        return (
          <Grid item xs={1}>
            <Tooltip title={name}>
              <Avatar style={{ backgroundColor: color }} >{member.first_name.charAt(0) + member.last_name.charAt(0)}</Avatar >
            </Tooltip>
          </Grid>
        );
      })
    );
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
        pusherSubscribe('presence-users-' + usergroup.group.id, 'pusher:subscription_succeeded', members => {
          const curr_users = currentComponent.state.users;
          curr_users[usergroup.group.id] = []
          members.each(member => curr_users[usergroup.group.id].push(member.info));
          currentComponent.setState({ users: curr_users });
        });
      })
    })
      .then(function () {
        const { groups } = currentComponent.state;
        groups.map((usergroup) => {
          pusherSubscribe('presence-users-' + usergroup.group.id, 'pusher:member_added', member => {
            const curr_users = currentComponent.state.users;
            curr_users[usergroup.group.id].push(member.info);
            currentComponent.setState({ users: curr_users });
          })
        });
      })
      .then(function () {
        const { groups } = currentComponent.state;
        groups.map((usergroup) => {
          pusherSubscribe('presence-users-' + usergroup.group.id, 'pusher:member_removed', member => {
            const curr_users = currentComponent.state.users;
            curr_users[usergroup.group.id] = curr_users[usergroup.group.id].filter(function (curr_member) {
              return curr_member.id != member.id;
            })
            currentComponent.setState({ users: curr_users });
          });
        });
      })
      .then(function () {
        const { groups } = currentComponent.state;
        groups.map((usergroup) => {
          pusherSubscribe('private-itinerary-edit-channel-' + usergroup.group.id, 'client-itinerary-edit', html => {
            var ele = document.getElementById("itineraryname" + usergroup.group.id);
            if (ele)
              ele.value = html;
          });
        });
      }).then(function () {
        pusherSubscribe('private-group-edit-channel-' + curUser.id, 'client-group-edit', html => {
          var ele = document.getElementById("groupname" + curUser.id);
          if (ele)
            ele.value = html;
        });
      });

    pusherSubscribe('groups-channel', 'add-group', data => {
      axios.get(listGroupsByUser + curUser.id).then(res => {
        const groups = res.data;
        this.setState({ groups });
      })
    });

    pusherSubscribe('itinerary-channel', 'add-itinerary', data => {
      const groupId = data.group;
      let currentComponent = this;
      axios.get(listItinerariesByGroup + groupId).then(res => {
        const curr_itineraries = currentComponent.state.itineraries;
        curr_itineraries[groupId] = res.data;
        currentComponent.setState({ itineraries: curr_itineraries });
      }).then(function () {
        currentComponent.toggleBadgeVisibility(groupId);
      });
    });
  }

  itineraryTriggerChange(e, groupId) {
    pusherPublish('private-itinerary-edit-channel-' + groupId, 'client-itinerary-edit', e.target.value);
  }

  groupTriggerChange(e, userId) {
    pusherPublish('private-group-edit-channel-' + userId, 'client-group-edit', e.target.value);
  }

  fetchItinerariesByGroup(groupId) {
    if (!(groupId in this.state.itineraries)) {
      axios.get(listItinerariesByGroup + groupId).then(res => {
        const curr_itineraries = this.state.itineraries;
        curr_itineraries[groupId] = res.data;
        this.setState({ itineraries: curr_itineraries });
      });
    }
  }

  render() {
    const { curUser, classes, history } = this.props;
    const { groups, itineraries, curr_group } = this.state;
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
            <Grid container spacing={3}>
              <Grid item xs={8}>
                <Typography className={classes.heading} variant="h6">
                  Groups
            </Typography>
              </Grid>
              {curr_group ? this.displayUserPresence() : null}
            </Grid>
          </ListItem>
          {groups.map(group => (
            <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={
                  <Badge color="secondary" variant="dot" invisible={(group.group.id in this.state.group_badges) ? this.state.group_badges[group.group.id] : true}>
                    <ExpandMoreIcon />
                  </Badge>
                }
                key={short.generate()}
                aria-controls="panel1a-content"
                id="panel1a-header"
                onClick={() => {
                  this.setState({ curr_group: group.group.id });
                  this.fetchItinerariesByGroup(group.group.id);
                  this.setBadgeInvisible(group.group.id);
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
                  id={"groupname" + curUser.id}
                  label="Group Name"
                  type="group-name"
                  margin="normal"
                  variant="outlined"
                  onChange={(e) => { this.groupTriggerChange(e, curUser.id) }}
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
