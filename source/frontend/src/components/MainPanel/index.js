import React from "react";
import { Box } from "@material-ui/core";

import MembersPanel from "../MembersPanel";

class MainPanel extends React.Component {
  render() {
    return (
      <Box style={{ width: "100%", marginTop: "2rem", height: "82vh" }}>
        <MembersPanel></MembersPanel>
      </Box>
    );
  }
}

export default MainPanel;
