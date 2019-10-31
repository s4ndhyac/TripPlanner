import React from "react";

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
        attractions: [{ name: "Downtown LA" }]
      }
    };
  };

  render() {
    const { name, id, plan } = this.state;
    return <div>{name}</div>;
  }
}

export default ItineraryPanel;
