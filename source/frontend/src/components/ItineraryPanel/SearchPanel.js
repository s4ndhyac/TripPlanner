import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { axios } from "../oauth";
import { withStyles } from "@material-ui/core/styles";
import {
  Typography,
  Grid,
  Divider,
  Paper,
  CircularProgress
} from "@material-ui/core";
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
    width: 150
  },
  searchField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 170
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    paddingTop: "0.5rem"
  },
  paper: {
    padding: theme.spacing(2),
    height: "84vh"
  }
});

const SEARCH_API = "http://localhost:8000/itinerary/search";

class SearchPanel extends React.Component {
  state = {
    searchInput: "",
    searchLocation: "",
    searchResults: [],
    loading: false,
    travelDate: ""
  };

  handleInputChange = event => {
    this.setState({ searchInput: event.target.value });
  };

  handleLocationChange = event => {
    this.setState({ searchLocation: event.target.value });
  };

  handleDateChange = event => {
    this.setState({ travelDate: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    this.search();
  };

  search = async () => {
    const { searchInput, searchLocation } = this.state;
    if (searchInput.length === 0 && searchLocation.length === 0) {
      return;
    }
    this.setState({ loading: true });
    const res = await axios.get(SEARCH_API, {
      params: {
        term: searchInput,
        location: searchLocation
      }
    });
    this.setState({ searchResults: res.data["items"], loading: false });
  };

  render() {
    const { classes, handleAddOnClick } = this.props;
    const { searchResults, loading } = this.state;
    return (
      <Paper className={classes.paper}>
        <Grid
          container
          item
          xs={12}
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item xs={8}>
            <Typography variant="h5">Search Attractions</Typography>
          </Grid>
          <Grid item xs={4}>
            <form className={classes.container} noValidate>
              <TextField
                id="travel-date"
                type="date"
                label="Date of Travel"
                className={classes.textField}
                InputLabelProps={{ shrink: true }}
                onChange={this.handleDateChange}
              />
            </form>
          </Grid>
        </Grid>
        <br />
        <Divider></Divider>
        <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
          <Grid
            container
            spacing={2}
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Grid item xs={5}>
              <TextField
                label="Place name"
                margin="normal"
                onChange={this.handleInputChange}
                className={classes.searchField}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Location"
                margin="normal"
                onChange={this.handleLocationChange}
                className={classes.searchField}
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                size="medium"
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SearchIcon />}
                style={{ marginTop: "1.1rem" }}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </form>
        <br />
        <Divider></Divider>
        {loading ? (
          <center style={{ paddingTop: "10vh" }}>
            <CircularProgress></CircularProgress>
          </center>
        ) : (
          <SearchResultList
            searchResults={searchResults}
            handleAddOnClick={handleAddOnClick}
          ></SearchResultList>
        )}
      </Paper>
    );
  }
}

export default withStyles(styles, { withTheme: true })(SearchPanel);
