import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import { List, Grid } from "@material-ui/core";
import { axios } from "../oauth";
import Rating from "@material-ui/lab/Rating";
import { withStyles } from "@material-ui/core/styles";
import {
  Typography,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  ListItemSecondaryAction,
  IconButton
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import PlaceIcon from "@material-ui/icons/Place";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
});

const YELP_SEARCH_API = "http://localhost:8000/itinerary/search";

class YelpSearchBar extends React.Component {
  state = {
    selectedAPI: "",
    searchInput: "",
    searchLocation: "",
    searchResults: []
  };

  handleSelectChange = event => {
    this.setState({ selectedAPI: event.target.value });
  };

  handleInputChange = event => {
    this.setState({ searchInput: event.target.value });
  };

  handleLocationChange = event => {
    this.setState({ searchLocation: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    if (this.state.selectedAPI === "google-maps") {
      // search on google maps
    } else if (this.state.selectedAPI === "yelp") {
      const res = await axios.get(YELP_SEARCH_API, {
        params: {
          api: "yelp",
          term: this.state.searchInput,
          location: this.state.searchLocation
        }
      });
      this.setState({ searchResults: res.data["businesses"] });
    }
  };

  handleItemClick = url => () => window.open(url);

  render() {
    const { classes } = this.props;
    const { selectedAPI } = this.state;
    return (
      <div>
        <form
          // className={classes.container}
          noValidate
          autoComplete="off"
          onSubmit={this.handleSubmit}
        >
          <Grid
            container
            spacing={4}
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Grid item xs={3}>
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-helper-label">
                  API
                </InputLabel>
                <Select
                  id="demo-simple-select-helper"
                  value={selectedAPI}
                  onChange={this.handleSelectChange}
                >
                  <MenuItem value={"google-maps"}>Google Maps</MenuItem>
                  <MenuItem value={"yelp"}>Yelp</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Place name"
                margin="normal"
                onChange={this.handleInputChange}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Location"
                margin="normal"
                onChange={this.handleLocationChange}
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                size="medium"
                type="submit"
                variant="contained"
                color="primary"
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </form>
        <br />
        <Divider></Divider>
        <List style={{ overflow: "auto", maxHeight: "60vh" }}>
          {this.state.searchResults.map(place => (
            <ListItem
              key={place.id}
              button
              alignItems="flex-start"
              onClick={this.handleItemClick(place.url)}
            >
              <ListItemIcon>
                <PlaceIcon />
              </ListItemIcon>
              <ListItemText
                primary={place.name}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      {place.location.display_address.join(", ")}
                    </Typography>
                    <br />
                    <Rating
                      name="half-rating"
                      value={place.rating}
                      precision={0.5}
                    />
                  </React.Fragment>
                }
              />
              <ListItemSecondaryAction>
                <IconButton color="primary" aria-label="add">
                  <AddIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(YelpSearchBar);
