import React from "react";
import { Box } from "@material-ui/core";

import MembersPanel from "../MembersPanel";
import ItineraryPanel from "../ItineraryPanel";

class MainPanel extends React.Component {
  render() {
    const { panel, itemId } = this.props;

    return (
      <Box style={{ width: "100%", marginTop: "2rem", height: "82vh" }}>
        {panel === "itinerary" ? (
          <ItineraryPanel itemId={itemId}></ItineraryPanel>
        ) : (
          <MembersPanel itemId={itemId}></MembersPanel>
        )}
      </Box>
    );
  }
}

export default MainPanel;
