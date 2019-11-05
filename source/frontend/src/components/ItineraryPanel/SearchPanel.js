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

const YELP_SEARCH_API = "http://localhost:8000/itinerary/search";

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

  render() {
    const { classes } = this.props;
    const { selectedAPI, searchResults } = this.state;
    return (
      <Paper className={classes.paper}>
        <Typography variant="h5">Search Attractions</Typography>
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
              >
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
