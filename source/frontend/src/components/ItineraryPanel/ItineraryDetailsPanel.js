import React from "react";
import {
  Grid,
  Paper,
  Typography,
  IconButton,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import PlaceIcon from "@material-ui/icons/Place";
import DeleteIcon from "@material-ui/icons/Delete";

const styles = theme => ({
  paper: {
    padding: theme.spacing(2),
    height: "84vh"
  }
});

class ItineraryDetailsPanel extends React.Component {
  render() {
    const { classes, name, plan } = this.props;
    return (
      <Paper className={classes.paper}>
        <Grid container>
          <Grid item xs={7}>
            <Typography variant="h5">{name}</Typography>
          </Grid>
          <Button color="primary">Generate</Button>
          <IconButton>
            <EditIcon />
          </IconButton>
        </Grid>
        <Divider></Divider>{" "}
        <List>
          {plan.sequence.map(attraction => (
            <ListItem key={attraction.name} button alignItems="flex-start">
              <ListItemIcon>
                <PlaceIcon />
              </ListItemIcon>
              <ListItemText
                primary={attraction.name}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      {attraction.address}
                    </Typography>
                    <br />
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textSecondary"
                    >
                      {attraction.datetime}
                    </Typography>
                  </React.Fragment>
                }
              />
              <ListItemSecondaryAction>
                <IconButton color="secondary" aria-label="add">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ItineraryDetailsPanel);
