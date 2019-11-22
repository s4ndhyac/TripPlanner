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
  Tooltip,
  CircularProgress,
  Checkbox
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { withStyles } from "@material-ui/core/styles";
import FlagOutlinedIcon from "@material-ui/icons/FlagOutlined";
import DirectionsIcon from "@material-ui/icons/Directions";
import FlagIcon from "@material-ui/icons/Flag";
import DoneIcon from "@material-ui/icons/Done";
import PlaceIcon from "@material-ui/icons/Place";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

import { stringToDate } from "../../utils";

const styles = theme => ({
  paper: {
    padding: theme.spacing(2),
    height: "84vh"
  }
});

class ItineraryDetailsPanel extends React.Component {
  emptyPlanTip = () => {
    return (
      <Typography
        variant="caption"
        display="block"
        gutterBottom
        style={{ marginTop: "2rem", marginLeft: "1rem" }}
      >
        Tips:
        <br />
        Step 1: Use the search bar to find attractions!
        <br />
        Step 2: Select a date and add attractions to the itinerary.
        <br />
        Step 3: Mark an attraction as the starting point for your plan of that
        date (could be a hotel)!
        <br />
        Step 4: Click the "Generate" button to generate an optimized itinerary!
        <br />
        Step 5: Click the "Save" button to save your itinerary.
      </Typography>
    );
  };

  getListItem = (attraction, index) => {
    const { classes, handleDeleteOnClick, handleCheckboxOnClick } = this.props;
    const {
      name,
      address,
      datetime,
      reactId,
      rating,
      url,
      isStart
    } = attraction;
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
          <Tooltip title="Mark as Start (Only one start is allowed)">
            <Checkbox
              checked={isStart || false}
              onChange={handleCheckboxOnClick(reactId, datetime)}
              style={{ marginLeft: "0.2rem" }}
              icon={<FlagOutlinedIcon fontSize="small" />}
              checkedIcon={<FlagIcon fontSize="small" />}
              color="primary"
            />
          </Tooltip>
          <br />
          <Tooltip title="Delete attraction">
            <IconButton
              color="secondary"
              aria-label="add"
              onClick={handleDeleteOnClick(reactId, datetime)}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </ListItemSecondaryAction>
      </ListItem>
    );
  };

  renderItinerary = plan => {
    return plan.list === undefined || (plan.list && plan.list.length === 0) ? (
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
      );
  };

  render() {
    const {
      classes,
      name,
      plan,
      handleSaveOnClick,
      handleGenerateOnClick,
      loading
    } = this.props;
    return (
      <Paper className={classes.paper}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={6}
        >
          <Grid item xs={7}>
            <Typography variant="h5">{name}</Typography>
          </Grid>
          <Grid item xs={5}>
            <Grid container alignItems="center" justify="space-between">
              <Grid item xs={9}>
                <Tooltip title="Generate optimized itinerary">
                  <Button
                    color="primary"
                    onClick={handleGenerateOnClick}
                    fullWidth={true}
                    startIcon={<DirectionsIcon />}
                  >
                    Generate
                  </Button>
                </Tooltip>
              </Grid>
              <Grid item xs={3}>
                <Tooltip title="Save to Database">
                  <IconButton onClick={handleSaveOnClick}>
                    <DoneIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <br />
        <Divider></Divider>
        {loading ? (
          <center style={{ paddingTop: "10vh" }}>
            <CircularProgress></CircularProgress>
          </center>
        ) : (
            this.renderItinerary(plan)
          )}
      </Paper>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ItineraryDetailsPanel);
