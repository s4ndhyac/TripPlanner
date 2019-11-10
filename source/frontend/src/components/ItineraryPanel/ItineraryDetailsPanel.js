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
  ListSubheader,
  Badge,
  Tooltip
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { withStyles } from "@material-ui/core/styles";
import DoneIcon from "@material-ui/icons/Done";
import PlaceIcon from "@material-ui/icons/Place";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

const styles = theme => ({
  paper: {
    padding: theme.spacing(2),
    height: "84vh"
  }
});

class ItineraryDetailsPanel extends React.Component {
  getListItem = (attraction, index) => {
    const { classes, handleDeleteOnClick } = this.props;
    const { name, address, datetime, reactId, rating } = attraction;
    return (
      <ListItem key={attraction.name} button alignItems="flex-start">
        <ListItemIcon>
          <Tooltip title="Visit sequence">
            <Badge badgeContent={index + 1}>
              <PlaceIcon />
            </Badge>
          </Tooltip>
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
              <Rating
                name="half-rating"
                value={rating}
                precision={0.5}
                readOnly
              />
            </React.Fragment>
          }
        />
        <ListItemSecondaryAction>
          <IconButton
            color="secondary"
            aria-label="add"
            onClick={handleDeleteOnClick(reactId, datetime)}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  };

  render() {
    const { classes, name, plan } = this.props;
    return (
      <Paper className={classes.paper}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={6}
        >
          <Grid item xs={7}>
            <Typography variant="h5">{name}</Typography>
          </Grid>
          <Grid item xs={5}>
            <Tooltip title="Generate Travel Sequence">
              <Button color="primary">Generate</Button>
            </Tooltip>
            <Tooltip title="Save to Database">
              <IconButton>
                <DoneIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        <br />
        <Divider></Divider>
        <List style={{ overflow: "auto", maxHeight: "70vh" }}>
          {plan.map((planForDay, index) => {
            return (
              <div>
                <ListSubheader
                  component="div"
                  id="nested-list-subheader"
                  disableSticky={true}
                >
                  {planForDay.date.toDateString()}
                </ListSubheader>
                {planForDay.sequence.map(this.getListItem, index)}
              </div>
            );
          })}
        </List>
      </Paper>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ItineraryDetailsPanel);
