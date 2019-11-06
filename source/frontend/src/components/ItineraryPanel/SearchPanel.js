import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import { axios } from "../oauth";
import { withStyles } from "@material-ui/core/styles";
import { Typography, Grid, Divider, Paper } from "@material-ui/core";
import SearchResultList from "./SearchResultList";
import SearchIcon from "@material-ui/icons/Search";

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
  },
  paper: {
    padding: theme.spacing(2),
    height: "84vh"
  }
});

const SEARCH_API = "http://localhost:8000/itinerary/search";

class SearchPanel extends React.Component {
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
      this.searchGoogleMaps();
    } else if (this.state.selectedAPI === "yelp") {
      this.searchYelp();
    }
  };

  searchGoogleMaps = async () => {
    const { searchInput } = this.state;
    if (searchInput.length === 0) return;
    const res = await axios.get(SEARCH_API, {
      params: {
        api: "google-maps",
        input: searchInput
      }
    });
    this.setState({ searchResults: res.data["details"] });
  };

  searchYelp = async () => {
    const { searchInput, searchLocation } = this.state;
    if (searchInput.length === 0 || searchLocation.length === 0) {
      return;
    }
    const res = await axios.get(SEARCH_API, {
      params: {
        api: "yelp",
        term: searchInput,
        location: searchLocation
      }
    });
    this.setState({ searchResults: res.data["businesses"] });
  };

  render() {
    const { classes } = this.props;
    const { selectedAPI, searchResults } = this.state;
    return (
      <Paper className={classes.paper}>
        <Grid
          container
          item xs={12}
          direction="row">
          <Grid item xs={6}>
            <Typography variant="h5">Search Attractions</Typography>
          </Grid>
          <Grid item xs={6}>
            <form className={classes.container} noValidate>
              <TextField
                id="date"
                label="Date of Travel"
                type="date"
                defaultValue="2019-11-06"
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
          </Grid>
        </Grid>
        <br />
        <Divider></Divider>
        <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
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
                startIcon={<SearchIcon />}>
                Search
              </Button>
            </Grid>
          </Grid>
        </form>
        <br />
        <Divider></Divider>
        <SearchResultList searchResults={searchResults}></SearchResultList>
      </Paper>
    );
  }
}

export default withStyles(styles, { withTheme: true })(SearchPanel);
