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

  render() {
    return (
      <List style={{ overflow: "auto", maxHeight: "60vh" }}>
        {this.props.searchResults.map(place => (
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
    );
  }
}

export default SearchResultList;
