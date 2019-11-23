import React from "react";
import { Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import SearchPanel from "./SearchPanel";
import ItineraryDetailsPanel from "./ItineraryDetailsPanel";

import { axios } from "../oauth";
import { stringToDate, compareDates } from "../../utils";
import SaveSnackbar from "./SaveSnackbar";

const styles = () => ({
  root: { flexGrow: 1 }
});

const ITINERARY_API = "/itinerary";

class ItineraryPanel extends React.Component {
  state = {
    name: "",
    id: null,
    plan: {},
    group: null,
    snackbarOpen: false,
    optimizedSnackbarOpen: false,
    loading: false,
    searchPanelOpen: false
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
    this.setState({ loading: true });
    const itineraryData = await this.getItineraryData(itemId);
    this.setState({ ...itineraryData, loading: false });
  };

  getItineraryData = async id => {
    const { data } = await axios.get(ITINERARY_API + "/" + id);
    return data;
  };

  handleAddOnClick = item => event => {
    event.preventDefault();
    item.datetime = document.getElementById("travel-date").value;
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
    const plan = this._findPlanForDate(datetime);
    plan.sequence = plan.sequence.filter(item => item.reactId !== itemId);
    this.setState({
      plan: { list: this.state.plan.list.filter(p => p.sequence.length !== 0) }
    });
  };

  _findPlanForDate = datetime => {
    const { list } = this.state.plan;
    const date = stringToDate(datetime);
    return list.find(
      p => stringToDate(p.date).toDateString() === date.toDateString()
    );
  };

  handleCheckboxOnClick = (itemId, datetime) => event => {
    event.preventDefault();
    const { sequence } = this._findPlanForDate(datetime);
    sequence
      .filter(item => item.reactId !== itemId && item.isStart)
      .forEach(item => (item.isStart = false));
    const item = sequence.find(item => item.reactId === itemId);
    item.isStart = !item.isStart;
    this.setState({ plan: this.state.plan });
  };

  handleSaveOnClick = async event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { data } = await axios.put(
      ITINERARY_API + "/" + this.state.id + "/",
      this.state
    );
    this.setState({ ...data, snackbarOpen: true, loading: false });
  };

  closeSnackbar = event => {
    if (event !== null) {
      event.preventDefault();
    }
    this.setState({ snackbarOpen: false, optimizedSnackbarOpen: false });
  };

  handleGenerateOnClick = async event => {
    event.preventDefault();
    if (!("list" in this.state.plan) || this.state.plan.list.length === 0) {
      alert("Please add attractions first!");
      return;
    }
    this.setState({ loading: true });
    const { data } = await axios.post(ITINERARY_API + "/generate/", {
      plan: this.state.plan
    });
    this.setState({
      plan: data.plan,
      optimizedSnackbarOpen: true,
      loading: false
    });
  };

  toggleSearchPanel = open => event => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    this.setState({ searchPanelOpen: open });
  };

  render() {
    const {
      name,
      plan,
      snackbarOpen,
      optimizedSnackbarOpen,
      loading,
      searchPanelOpen
    } = this.state;
    return (
      <Box>
        <ItineraryDetailsPanel
          name={name}
          plan={plan}
          toggle={this.toggleSearchPanel}
          handleCheckboxOnClick={this.handleCheckboxOnClick}
          handleDeleteOnClick={this.handleDeleteOnClick}
          handleSaveOnClick={this.handleSaveOnClick}
          handleGenerateOnClick={this.handleGenerateOnClick}
          loading={loading}
        ></ItineraryDetailsPanel>
        <SearchPanel
          open={searchPanelOpen}
          handleAddOnClick={this.handleAddOnClick}
          toggle={this.toggleSearchPanel}
        ></SearchPanel>
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
