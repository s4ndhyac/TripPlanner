import React from "react";
import {
  Grid,
  Paper,
  Typography,
  IconButton,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import PlaceIcon from "@material-ui/icons/Place";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    height: "84vh"
  }
});

class ItineraryPanel extends React.Component {
  state = {
    name: "",
    id: null,
    plan: {}
  };

  componentWillMount() {
    this.changeState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.itemId !== nextProps.itemId) {
      this.changeState(nextProps);
    }
  }

  changeState = props => {
    const { itemId } = props;
    const itineraryData = this.getItineraryData(itemId);
    this.setState(itineraryData);
  };

  getItineraryData = id => {
    return {
      name: `Itinerary ${id}`,
      id,
      plan: {
        sequence: [
          {
            name: "Downtown LA",
            type: "Attraction",
            description: "A beautiful city",
            address: "Los Angeles, 90001, CA, USA"
          },
          {
            name: "Santa Monica",
            type: "Attraction",
            description: "Visit the best beach around the area!",
            address: "Santa Monica, 90001, CA, USA"
          }
        ]
      }
    };
  };

  render() {
    const { classes } = this.props;
    const { name, id, plan } = this.state;
    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={5}>
            <Paper className={classes.paper}>
              <Grid container>
                <Grid item xs={7}>
                  <Typography variant="h5">{name}</Typography>
                </Grid>
                <Button color="primary">Generate</Button>
                <IconButton>
                  <EditIcon />
                </IconButton>
              </Grid>
              <Divider></Divider>{" "}
              <List component="nav">
                {plan.sequence.map(attraction => (
                  <ListItem button alignItems="flex-start">
                    <ListItemIcon>
                      <PlaceIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={attraction.name}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline}
                            color="textPrimary"
                          >
                            {attraction.address}
                          </Typography>
                          <br />
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline}
                            color="textSecondary"
                          >
                            {attraction.description}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={7}>
            <Paper className={classes.paper}>
              <Typography variant="h5">Search Attractions</Typography>
              <Divider></Divider>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ItineraryPanel);
