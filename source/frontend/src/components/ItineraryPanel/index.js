import React from "react";
import { Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import SearchPanel from "./SearchPanel";
import ItineraryDetailsPanel from "./ItineraryDetailsPanel";

const styles = () => ({
  root: { flexGrow: 1 }
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
      plan: [
        {
          date: new Date(2019, 11 - 1, 5),
          sequence: [
            {
              id: "1",
              name: "Downtown LA",
              type: "Attraction",
              datetime: "2019-11-05",
              address: "Los Angeles, 90001, CA, USA",
              reactId: "randomId1"
            }
          ]
        },
        {
          date: new Date(2019, 11 - 1, 6),
          sequence: [
            {
              id: "2",
              name: "Santa Monica",
              type: "Attraction",
              datetime: "2019-11-06",
              address: "Santa Monica, 90001, CA, USA",
              reactId: "randomId2"
            }
          ]
        }
      ]
    };
  };

  handleAddOnClick = item => event => {
    event.preventDefault();
    if (!item.datetime) {
      alert("Please select a travel date!");
      return;
    }
    const date = this.getDateObject(item.datetime);
    const { plan } = this.state;
    const planForDate = plan.find(
      p => p.date.toDateString() === date.toDateString()
    );
    if (!planForDate) {
      plan.push({ date, sequence: [item] });
      plan.sort((a, b) => a.date - b.date);
    } else {
      planForDate.sequence.push(item);
    }
    this.setState({ plan });
  };

  getDateObject = date => {
    const split = date.split("-");
    return new Date(split[0], split[1] - 1, split[2]);
  };

  handleDeleteOnClick = (itemId, datetime) => event => {
    event.preventDefault();
    const { plan } = this.state;
    const date = this.getDateObject(datetime);
    const planForDate = plan.find(
      p => p.date.toDateString() === date.toDateString()
    );
    planForDate.sequence = planForDate.sequence.filter(
      item => item.reactId !== itemId
    );
    this.setState({ plan: plan.filter(p => p.sequence.length !== 0) });
  };

  render() {
    const { classes } = this.props;
    const { name, plan } = this.state;
    return (
      <Grid container spacing={3} className={classes.root}>
        <Grid item xs={5}>
          <ItineraryDetailsPanel
            name={name}
            plan={plan}
            handleDeleteOnClick={this.handleDeleteOnClick}
          ></ItineraryDetailsPanel>
        </Grid>
        <Grid item xs={7}>
          <SearchPanel handleAddOnClick={this.handleAddOnClick}></SearchPanel>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ItineraryPanel);
