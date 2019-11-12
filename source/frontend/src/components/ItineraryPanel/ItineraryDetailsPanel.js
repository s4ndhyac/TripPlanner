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
  ListItemIcon,
  ListItemSecondaryAction,
  ListSubheader,
  Badge,
  Tooltip
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { withStyles } from "@material-ui/core/styles";
import DoneIcon from "@material-ui/icons/Done";
import PlaceIcon from "@material-ui/icons/Place";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

import { stringToDate, emptyObject } from "../../utils";

const styles = theme => ({
  paper: {
    padding: theme.spacing(2),
    height: "84vh"
  }
});

class ItineraryDetailsPanel extends React.Component {
  emptyPlanTip = () => {
    return (
      <center>
        <Typography
          variant="caption"
          display="block"
          gutterBottom
          style={{ marginTop: "2rem" }}
        >
          Use the search bar to find attractions!
        </Typography>
      </center>
    );
  };

  getListItem = (attraction, index) => {
    const { classes, handleDeleteOnClick } = this.props;
    const { name, address, datetime, reactId, rating, url } = attraction;
    return (
      <ListItem
        key={attraction.name + reactId}
        button
        alignItems="flex-start"
        onClick={() => window.open(url)}
      >
        <ListItemIcon>
          <Tooltip title="Visit sequence">
            <Badge badgeContent={index + 1}>
              <PlaceIcon />
            </Badge>
          </Tooltip>
        </ListItemIcon>
        <ListItemText
          primary={name}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                {address}
              </Typography>
              <br />
              <Rating
                name="half-rating"
                value={rating}
                precision={0.5}
                readOnly
              />
            </React.Fragment>
          }
        />
        <ListItemSecondaryAction>
          <IconButton
            color="secondary"
            aria-label="add"
            onClick={handleDeleteOnClick(reactId, datetime)}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  };

  render() {
    const { classes, name, plan, handleSaveOnClick } = this.props;
    return (
      <Paper className={classes.paper}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={6}
        >
          <Grid item xs={7}>
            <Typography variant="h5">{name}</Typography>
          </Grid>
          <Grid item xs={5}>
            <Tooltip title="Generate optimized itinerary">
              <Button color="primary">Generate</Button>
            </Tooltip>
            <Tooltip title="Save to Database">
              <IconButton onClick={handleSaveOnClick}>
                <DoneIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        <br />
        <Divider></Divider>
        {emptyObject(plan) || plan.list.length === 0 ? (
          this.emptyPlanTip()
        ) : (
          <List style={{ overflow: "auto", maxHeight: "70vh" }}>
            {plan.list.map((planForDay, index) => {
              return (
                <div>
                  <ListSubheader
                    component="div"
                    id="nested-list-subheader"
                    disableSticky={true}
                  >
                    {stringToDate(planForDay.date).toDateString()}
                  </ListSubheader>
                  {planForDay.sequence.map(this.getListItem, index)}
                </div>
              );
            })}
          </List>
        )}
      </Paper>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ItineraryDetailsPanel);
