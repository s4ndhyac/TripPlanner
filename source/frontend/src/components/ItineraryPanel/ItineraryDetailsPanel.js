import React from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Paper,
  Typography,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Badge,
  Tooltip,
  CircularProgress,
  Checkbox,
  Tab,
  Box,
  Tabs,
  TextField
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { withStyles } from "@material-ui/core/styles";
import FlagOutlinedIcon from "@material-ui/icons/FlagOutlined";
import DirectionsIcon from "@material-ui/icons/Directions";
import FlagIcon from "@material-ui/icons/Flag";
import DoneIcon from "@material-ui/icons/Done";
import PlaceIcon from "@material-ui/icons/Place";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import InputAdornment from "@material-ui/core/InputAdornment";
import TodayIcon from "@material-ui/icons/Today";

import { stringToDate } from "../../utils";
import MapContainer from "./MapContainer";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

const styles = theme => ({
  paper: {
    padding: theme.spacing(2),
    height: "84vh"
  }
});

class ItineraryDetailsPanel extends React.Component {
  state = {
    value: 0
  };

  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
  };

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
    const { classes, handleDeleteOnClick, triggerItineraryRemove, handleCheckboxOnClick } = this.props;
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
              onClick={(e) => {
                handleDeleteOnClick(e, reactId, datetime)
                triggerItineraryRemove({ "id": reactId, "datetime": datetime });
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </ListItemSecondaryAction>
      </ListItem>
    );
  };

  _emptyPlan = plan =>
    plan.list === undefined || (plan.list && plan.list.length === 0);

  handleChangeOfDate = event => {
    const { plan } = this.props;
    let index = this._emptyPlan(plan)
      ? 0
      : plan.list.findIndex(x => x.date === event.target.value);
    var date_sort_asc = function (date1, date2) {
      if (date1 > date2) return 1;
      if (date1 < date2) return -1;
      return 0;
    };
    if (index === -1) {
      var allDates = plan.list.map(p => stringToDate(p.date));
      allDates.push(stringToDate(event.target.value));
      allDates.sort(date_sort_asc);
      index = allDates.findIndex(
        x => x.getTime() === stringToDate(event.target.value).getTime()
      );
    }
    this.setState({ value: index });
  };

  renderTab = (plan, value) => {
    return (
      <div>
        <Paper position="static" square>
          <Tabs value={value} onChange={this.handleChange}>
            {this._emptyPlan(plan) ? (
              <p></p>
            ) : (
                plan.list.map(p => (
                  <Tab label={stringToDate(p.date).toDateString()} />
                ))
              )}
          </Tabs>
        </Paper>
        {this.renderItinerary(plan, value)}
      </div>
    );
  };

  renderItinerary = (plan, value) => {
    return this._emptyPlan(plan)
      ? this.emptyPlanTip()
      : plan.list.map((p, i) => {
        return (
          <TabPanel value={value} index={i}>
            <Grid
              container
              direction="row"
              justify="space-between"
              spacing={4}
            >
              <Grid item xs={6}>
                <List style={{ overflow: "auto", maxHeight: "60vh" }}>
                  {p.sequence.map(this.getListItem, i)}
                </List>
              </Grid>
              <Grid item xs={6} style={{ overflow: "auto" }}>
                <Typography variant="h6">Check your Route here</Typography>
                <Typography variant="caption" display="block" gutterBottom>
                  Click on the route to view distances and durations
                  </Typography>
                <MapContainer sequence={p.sequence}></MapContainer>
              </Grid>
            </Grid>
          </TabPanel>
        );
      });
  };

  render() {
    const {
      classes,
      name,
      plan,
      handleSaveOnClick,
      handleGenerateOnClick,
      loading,
      toggle
    } = this.props;
    const { value } = this.state;
    return (
      <Paper className={classes.paper}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="flex-end"
        >
          <Grid item xs={5}>
            <Typography variant="h5">{name}</Typography>
          </Grid>
          <Grid item xs={7}>
            <Grid
              container
              direction="row"
              alignItems="flex-end"
              justify="space-between"
            >
              <Grid item xs={4}>
                <form className={classes.container} noValidate>
                  <TextField
                    id="travel-date"
                    type="date"
                    label="Date of Travel"
                    className={classes.textField}
                    InputLabelProps={{ shrink: true }}
                    fullWidth={true}
                    onChange={this.handleChangeOfDate}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TodayIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </form>
              </Grid>
              <Grid item xs={2}>
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
              <Grid item xs={2}>
                <Tooltip title="Save to Database">
                  <IconButton onClick={handleSaveOnClick}>
                    <DoneIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={2}>
                <Tooltip title="Open search panel">
                  <IconButton onClick={toggle(true)}>
                    <SearchOutlined />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <br />
        {loading ? (
          <center style={{ paddingTop: "10vh" }}>
            <CircularProgress></CircularProgress>
          </center>
        ) : (
            this.renderTab(plan, value)
          )}
      </Paper>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ItineraryDetailsPanel);
