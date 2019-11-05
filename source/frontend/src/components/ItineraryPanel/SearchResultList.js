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

class SearchResultList extends React.Component {
  handleItemClick = url => () => window.open(url);

  generateListItem = (id, url, name, address, rating) => {
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
              <Rating name="half-rating" value={rating} precision={0.5} />
            </React.Fragment>
          }
        />
        <ListItemSecondaryAction>
          <IconButton color="primary" aria-label="add">
            <AddIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  };

  render() {
    return (
      <List style={{ overflow: "auto", maxHeight: "60vh" }}>
        {this.props.searchResults.map(place =>
          "result" in place
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
                place.rating
              )
        )}
      </List>
    );
  }
}

export default SearchResultList;
