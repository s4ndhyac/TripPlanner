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
  ListItemSecondaryAction,
  ListSubheader
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
  getListItem = attraction => {
    const { classes, handleDeleteOnClick } = this.props;
    const { name, address, datetime, reactId } = attraction;
    return (
      <ListItem key={attraction.name} button alignItems="flex-start">
        <ListItemIcon>
          <PlaceIcon />
        </ListItemIcon>
        <ListItemText
          primary={name}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                {address}
              </Typography>
              <br />
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textSecondary"
              >
                {datetime}
              </Typography>
            </React.Fragment>
          }
        />
        <ListItemSecondaryAction>
          <IconButton
            color="secondary"
            aria-label="add"
            onClick={handleDeleteOnClick(reactId, datetime)}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  };

  render() {
    const { classes, name, plan } = this.props;
    return (
      <Paper className={classes.paper}>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={7}>
            <Typography variant="h5">{name}</Typography>
          </Grid>
          <Grid item xs={5}>
            <Button color="primary">Generate</Button>
            <IconButton>
              <EditIcon />
            </IconButton>
          </Grid>
        </Grid>
        <br />
        <Divider></Divider>
        <List style={{ overflow: "auto", maxHeight: "70vh" }}>
          {plan.map(planForDay => {
            return (
              <div>
                <ListSubheader component="div" id="nested-list-subheader">
                  {planForDay.date.toDateString()}
                </ListSubheader>
                {planForDay.sequence.map(this.getListItem)}
              </div>
            );
          })}
        </List>
      </Paper>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ItineraryDetailsPanel);
