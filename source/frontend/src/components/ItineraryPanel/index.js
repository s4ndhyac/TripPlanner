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
    snackbarOpen: false
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
    const { data } = await axios.get(ITINERARY_API + "?id=" + id);
    return data[0];
    // return {
    //   name: `Itinerary ${id}`,
    //   id,
    //   plan: [
    //     {
    //       date: "2019-11-05",
    //       sequence: [
    //         {
    //           id: "1",
    //           name: "Downtown LA",
    //           type: "Attraction",
    //           datetime: "2019-11-05",
    //           address: "Los Angeles, 90001, CA, USA",
    //           reactId: "randomId1"
    //         }
    //       ]
    //     },
    //     {
    //       date: "2019-11-06",
    //       sequence: [
    //         {
    //           id: "2",
    //           name: "Santa Monica",
    //           type: "Attraction",
    //           datetime: "2019-11-06",
    //           address: "Santa Monica, 90001, CA, USA",
    //           reactId: "randomId2"
    //         }
    //       ]
    //     }
    //   ]
    // };
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
    // this.setState({ snackbarOpen: true });
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
    this.setState({ snackbarOpen: false });
  };

  render() {
    const { classes } = this.props;
    const { name, plan, snackbarOpen } = this.state;
    return (
      <Box>
        <Grid container spacing={3} className={classes.root}>
          <Grid item xs={5}>
            <ItineraryDetailsPanel
              name={name}
              plan={plan}
              handleDeleteOnClick={this.handleDeleteOnClick}
              handleSaveOnClick={this.handleSaveOnClick}
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
      </Box>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ItineraryPanel);
