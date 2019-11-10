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
      plan: {
        sequence: [
          {
            id: "1",
            name: "Downtown LA",
            type: "Attraction",
            datetime: "11-05-2019",
            address: "Los Angeles, 90001, CA, USA",
            reactId: "randomId1"
          },
          {
            id: "2",
            name: "Santa Monica",
            type: "Attraction",
            datetime: "11-06-2019",
            address: "Santa Monica, 90001, CA, USA",
            reactId: "randomId2"
          }
        ]
      }
    };
  };

  handleAddOnClick = item => event => {
    event.preventDefault();
    if (!item.datetime) {
      alert("Please select a travel date!");
      return;
    }
    const { sequence } = this.state.plan;
    this.setState({ plan: { sequence: sequence.concat([item]) } });
  };

  handleDeleteOnClick = itemId => event => {
    event.preventDefault();
    const sequence = this.state.plan.sequence.filter(
      item => item.reactId !== itemId
    );
    this.setState({ plan: { sequence } });
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
