import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button
} from "@material-ui/core";

class MainPanel extends React.Component {
  render() {
    return (
      <Card style={{ width: "100%", marginTop: "2rem", height: "82vh" }}>
        <CardContent>
          <Typography variant="h4" component="h2">
            Members
          </Typography>
          <Typography color="textSecondary">Member list</Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    );
  }
}

export default MainPanel;
