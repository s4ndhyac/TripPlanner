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
            name: "Downtown LA",
            type: "Attraction",
            datetime: "11-05-2019",
            address: "Los Angeles, 90001, CA, USA"
          },
          {
            name: "Santa Monica",
            type: "Attraction",
            datetime: "11-06-2019",
            address: "Santa Monica, 90001, CA, USA"
          }
        ]
      }
    };
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
          ></ItineraryDetailsPanel>
        </Grid>
        <Grid item xs={7}>
          <SearchPanel></SearchPanel>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ItineraryPanel);
