import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  ListItemSecondaryAction,
  IconButton
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import PlaceIcon from "@material-ui/icons/Place";
import Rating from "@material-ui/lab/Rating";
import short from "short-uuid";

class SearchResultList extends React.Component {
  handleItemClick = url => () => window.open(url);

  generateListItem = (id, url, name, address, rating, photo = undefined) => {
    const { handleAddOnClick } = this.props;
    const item = {
      id,
      url,
      name,
      address,
      rating,
      datetime: document.getElementById("travel-date").value,
      reactId: short.generate()
    };
    return (
      <ListItem
        key={id}
        button
        alignItems="flex-start"
        onClick={this.handleItemClick(url)}
      >
        <ListItemIcon>
          <PlaceIcon />
        </ListItemIcon>
        <ListItemText
          primary={name}
          secondary={
            <React.Fragment>
              <Typography component="span" variant="body2" color="textPrimary">
                {address}
              </Typography>
              <br />
              <Rating
                name="half-rating"
                value={rating}
                precision={0.5}
                readOnly
              />
              <br />
              {photo ? (
                <img src={photo} style={{ width: "10rem" }} alt="img"></img>
              ) : (
                <span hidden></span>
              )}
            </React.Fragment>
          }
        />
        <ListItemSecondaryAction>
          <IconButton
            color="primary"
            aria-label="add"
            onClick={handleAddOnClick(item)}
          >
            <AddIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  };

  isFromGoogleMaps = place => "result" in place;

  render() {
    return (
      <List style={{ overflow: "auto", maxHeight: "60vh" }}>
        {this.props.searchResults.map(place =>
          this.isFromGoogleMaps(place)
            ? this.generateListItem(
                place.result.id,
                place.result.url,
                place.result.name,
                place.result.formatted_address,
                place.result.rating
              )
            : this.generateListItem(
                place.id,
                place.url,
                place.name,
                place.location.display_address.join(", "),
                place.rating,
                place.image_url
              )
        )}
      </List>
    );
  }
}

export default SearchResultList;
