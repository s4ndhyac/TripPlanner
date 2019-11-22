import React from "react";
import TextField from "@material-ui/core/TextField";
import { axios } from "../oauth";
import { withStyles } from "@material-ui/core/styles";
import {
  Typography,
  Grid,
  Divider,
  Paper,
  CircularProgress,
  IconButton,
  Drawer
} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import TodayIcon from "@material-ui/icons/Today";
import BusinessIcon from "@material-ui/icons/Business";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import SearchResultList from "./SearchResultList";
import SearchIcon from "@material-ui/icons/Search";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  formControl: {
    margin: theme.spacing(1),
    paddingTop: "0.5rem"
  },
  paper: {
    padding: theme.spacing(2)
  }
});

const SEARCH_API = "/itinerary/search";

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
    const { classes, handleAddOnClick, open, toggle } = this.props;
    const { searchResults, loading } = this.state;
    return (
      <Drawer anchor="right" open={open} onClose={toggle(false)}>
        <div className={classes.paper}>
          <Grid
            container
            item
            xs={12}
            direction="row"
            alignItems="center"
            justify="space-between"
          >
            <Grid item xs={8}>
              <Typography variant="h5">Search Attractions</Typography>
            </Grid>
          </Grid>
          <br />
          <Divider></Divider>
          <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
            <Grid
              container
              spacing={2}
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Grid item xs={6}>
                <TextField
                  label="Place name"
                  margin="normal"
                  variant="outlined"
                  onChange={this.handleInputChange}
                  className={classes.textField}
                  fullWidth={true}
                  placeholder="e.g. Disneyland"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  label="Location"
                  margin="normal"
                  variant="outlined"
                  onChange={this.handleLocationChange}
                  className={classes.textField}
                  fullWidth={true}
                  placeholder="Irvine, CA"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={1}>
                <IconButton
                  type="submit"
                  color="primary"
                  fullWidth={true}
                  style={{ marginTop: "1rem" }}
                >
                  <SearchIcon />
                </IconButton>
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
        </div>
      </Drawer>
    );
  }
}

export default withStyles(styles, { withTheme: true })(SearchPanel);
