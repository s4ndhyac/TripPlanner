import React from "react";
import { Grid, Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import SearchPanel from "./SearchPanel";
import ItineraryDetailsPanel from "./ItineraryDetailsPanel";

import { axios } from "../oauth";
import { stringToDate, compareDates } from "../../utils";
import SaveSnackbar from "./SaveSnackbar";

const styles = () => ({
  root: { flexGrow: 1 }
});

const ITINERARY_API = "http://localhost:8000/itinerary";

class ItineraryPanel extends React.Component {
  state = {
    name: "",
    id: null,
    plan: {},
    group: null,
    snackbarOpen: false,
    optimizedSnackbarOpen: false
  };

  componentWillMount() {
    this.changeState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.itemId !== nextProps.itemId) {
      this.changeState(nextProps);
    }
  }

  changeState = async props => {
    const { itemId } = props;
    const itineraryData = await this.getItineraryData(itemId);
    this.setState(itineraryData);
  };

  getItineraryData = async id => {
    const { data } = await axios.get(ITINERARY_API + "/" + id);
    return data;
  };

  handleAddOnClick = item => event => {
    event.preventDefault();
    if (!item.datetime) {
      alert("Please select a travel date!");
      return;
    }
    const date = stringToDate(item.datetime);
    const { plan } = this.state;
    if (!("list" in plan)) {
      plan.list = [];
    }
    const { list } = plan;
    const planForDate = list.find(
      p => stringToDate(p.date).toDateString() === date.toDateString()
    );
    if (!planForDate) {
      list.push({ date: item.datetime, sequence: [item] });
      list.sort((a, b) => compareDates(a.date, b.date));
    } else {
      planForDate.sequence.push(item);
    }
    this.setState({ plan });
  };

  handleDeleteOnClick = (itemId, datetime) => event => {
    event.preventDefault();
    const { list } = this.state.plan;
    const date = stringToDate(datetime);
    const planForDate = list.find(
      p => stringToDate(p.date).toDateString() === date.toDateString()
    );
    planForDate.sequence = planForDate.sequence.filter(
      item => item.reactId !== itemId
    );
    this.setState({
      plan: { list: list.filter(p => p.sequence.length !== 0) }
    });
  };

  handleSaveOnClick = async event => {
    event.preventDefault();
    const { data } = await axios.put(
      ITINERARY_API + "/" + this.state.id + "/",
      this.state
    );
    this.setState({ ...data, snackbarOpen: true });
  };

  closeSnackbar = event => {
    if (event !== null) {
      event.preventDefault();
    }
    this.setState({ snackbarOpen: false, optimizedSnackbarOpen: false });
  };

  handleGenerateOnClick = async event => {
    event.preventDefault();
    const data = await axios.post(ITINERARY_API + "/generate/", {
      plan: this.state.plan
    });
    this.setState({ plan: data.data.plan, optimizedSnackbarOpen: true });
  };

  render() {
    const { classes } = this.props;
    const { name, plan, snackbarOpen, optimizedSnackbarOpen } = this.state;
    return (
      <Box>
        <Grid container spacing={3} className={classes.root}>
          <Grid item xs={5}>
            <ItineraryDetailsPanel
              name={name}
              plan={plan}
              handleDeleteOnClick={this.handleDeleteOnClick}
              handleSaveOnClick={this.handleSaveOnClick}
              handleGenerateOnClick={this.handleGenerateOnClick}
            ></ItineraryDetailsPanel>
          </Grid>
          <Grid item xs={7}>
            <SearchPanel handleAddOnClick={this.handleAddOnClick}></SearchPanel>
          </Grid>
        </Grid>
        <SaveSnackbar
          open={snackbarOpen}
          handleCloseOnClick={this.closeSnackbar}
          message={"Itinerary saved!"}
        ></SaveSnackbar>
        <SaveSnackbar
          open={optimizedSnackbarOpen}
          handleCloseOnClick={this.closeSnackbar}
          message={"Itinerary optimized!"}
        ></SaveSnackbar>
      </Box>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ItineraryPanel);
