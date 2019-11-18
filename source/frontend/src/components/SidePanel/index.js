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

const drawerWidth = "20rem";
const baseURL = "http://localhost:8000/";
const listGroupsByUser = "members/v1/usergroup/?user_id=";
const listItinerariesByGroup = "itinerary/?group_id=";
const groupAPI = "http://localhost:8000/members/addGroup/";
const createItineraryAPI = "http://localhost:8000/itinerary/";

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
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event, groupId) {
    const elementId = "itinerary-" + groupId;
    const input = document.getElementById(elementId).value;
    alert('A new itinerary was created: ' + input);
    this.setState({ inputItinerary: input });
    const itinerary = {
      name: input,
      plan: {},
      group: groupId
    }

    let currentComponent = this;
    axios.post(createItineraryAPI, itinerary)
      .then(function (response) {
        console.log(response);
        axios.get(baseURL + listItinerariesByGroup + groupId).then(res => {
          const curr_itineraries = currentComponent.state.itineraries;
          curr_itineraries[groupId] = res.data;
          currentComponent.setState({ itineraries: curr_itineraries });
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    event.preventDefault();
    document.getElementById(elementId).value = "";
    this.toggleItineraryPopup(groupId);
  }


  handleSubmitGroup(event) {
    const input = document.getElementById("groupname").value;
    alert('A new group was created: ' + input);
    this.setState({ inputGroup: input });
    const { curUser } = this.props;
    const user = {
      name: input,
      email: curUser.email
    }

    let currentComponent = this;
    axios.post(groupAPI, user)
      .then(function (response) {
        console.log(response);
        axios.get(baseURL + listGroupsByUser + curUser.id).then(res => {
          const groups = res.data;
          currentComponent.setState({ groups });
        });
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
    else
      curr_show_itineraries[groupId] = !curr_show_itineraries[groupId];
    this.setState({ showItineraryPopup: curr_show_itineraries });
  }

  componentDidMount() {
    const { curUser } = this.props;
    axios.get(baseURL + listGroupsByUser + curUser.id).then(res => {
      const groups = res.data;
      this.setState({ groups });
    });
  }

  fetchItinerariesByGroup(groupId) {
    if (!(groupId in this.state.itineraries)) {
      axios.get(baseURL + listItinerariesByGroup + groupId).then(res => {
        const curr_itineraries = this.state.itineraries;
        curr_itineraries[groupId] = res.data;
        this.setState({ itineraries: curr_itineraries });
      });
    }
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
          <ListItem key={short.generate()}>
            <Typography className={classes.heading} variant="h6">
              Groups
            </Typography>
          </ListItem>

          {groups.map(group => (
            <ExpansionPanel key={short.generate()}>
              <ExpansionPanelSummary
                key={short.generate()}
                expandIcon={<ExpandMoreIcon key={short.generate()} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                onClick={() => {
                  this.fetchItinerariesByGroup(group.group.id);
                  history.push(`/dashboard/groups/${group.group.id}`);
                }}
              >
                <ListItemIcon key={short.generate()}>
                  <GroupIcon />
                </ListItemIcon>
                <ListItemText key={short.generate()} primary={group.group.name} />
              </ExpansionPanelSummary>

              <ExpansionPanelDetails key={short.generate()}>
                <List key={short.generate()}>
                  {group.group.id in this.state.itineraries ?
                    this.state.itineraries[group.group.id].map(itinerary => (
                      <ListItem
                        button
                        key={short.generate()}
                        onClick={
                          () => history.push(`/dashboard/itineraries/${itinerary.id}`)
                        }
                      >
                        <ListItemIcon key={short.generate()}>
                          <CardTravelIcon key={short.generate()} />
                        </ListItemIcon>
                        <ListItemText key={short.generate()} primary={itinerary.name} />
                      </ListItem>
                    ))
                    : null}

                  <ListItem key={short.generate()}>
                    <ListItemText key={short.generate()} primary="Create Itinerary" />
                    <IconButton key={short.generate()} onClick={() => this.toggleItineraryPopup(group.group.id)}>
                      {this.state.showItineraryPopup[group.group.id] ? null : <AddIcon key={short.generate()}></AddIcon>}
                    </IconButton>
                    {this.state.showItineraryPopup[group.group.id] ? (
                      <div key={short.generate()} className='CreateItinerary'>
                        <TextField
                          id={`itinerary-${group.group.id}`}
                          key={short.generate()}
                          label="Itinerary Name"
                          type="itinerary-name"
                          margin="normal"
                          variant="outlined"
                          value={this.state.inputItinerary}
                        />
                        <Button
                          key={short.generate()}
                          color="primary"
                          onClick={(e) => { this.handleSubmit(e, group.group.id) }}
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
              <div className='Creategroup'>
                <TextField
                  key={short.generate()}
                  id="groupname"
                  label="Group Name"
                  type="group-name"
                  margin="normal"
                  variant="outlined"
                  value={this.state.value}
                />
                <Button
                  color="primary"
                  onClick={this.handleSubmitGroup}
                >
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
  connect(
    null,
    { openGroup, openItinerary }
  )(SidePanel)
);

export default withStyles(styles, { withTheme: true })(connectedComponent);
