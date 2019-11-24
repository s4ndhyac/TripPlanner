import React from "react";
import GoogleMapReact from "google-map-react";

import { axios } from "../oauth";

const { google } = window;

class MapContainer extends React.Component {
  static defaultProps = {
    center: {
      lat: 19.43494,
      lng: -99.195697
    },
    zoom: 10
  };

  _getWaypoints = sequence => {
    const waypoints = sequence.slice(0, sequence.length);
    return waypoints.map(waypoint => ({
      location: waypoint.address,
      stopover: false
    }));
  };

  _addMarkers = async (map, sequence) => {
    const bounds = new google.maps.LatLngBounds();
    const infoWindow = new google.maps.InfoWindow();

    const addresses = sequence.map(item => item.address);
    const { data } = await axios.get("/itinerary/geocode/", {
      params: { addresses: JSON.stringify(addresses) }
    });
    data.geocodes.forEach((item, i) => {
      const { lat, lng } = item;
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map,
        label: `${i + 1}`
      });
      bounds.extend(marker.position);
      this._addListenerToMarker(marker, map, infoWindow, item);
    });
    map.setCenter(bounds.getCenter());
    map.fitBounds(bounds);
    map.setZoom(11);
  };

  _addListenerToMarker = (marker, map, infoWindow, item) => {
    google.maps.event.addListener(
      marker,
      "click",
      (marker => () => {
        infoWindow.setContent(item.name);
        infoWindow.open(map, marker);
      })(marker)
    );
  };

  apiIsLoaded = (map, maps, sequence) => {
    if (sequence.length === 0) return;
    this._addMarkers(map, sequence);
    const directionsService = new maps.DirectionsService();
    const directionsDisplay = new maps.DirectionsRenderer();
    directionsService.route(
      {
        origin: sequence[0].address,
        destination: sequence[0].address,
        waypoints: this._getWaypoints(sequence),
        travelMode: "DRIVING"
      },
      this._routeCallback(directionsDisplay, map)
    );
  };

  _routeCallback = (directionsDisplay, map) => (res, status) => {
    if (status === "OK") {
      directionsDisplay.setDirections(res);
      const routePolyline = new google.maps.Polyline({
        path: res.routes[0].overview_path,
        strokeColor: "#4285f4"
      });
      routePolyline.setMap(map);
    } else {
      alert("Directions request failed due to " + status);
    }
  };

  render() {
    const { sequence } = this.props;
    return (
      <div style={{ height: "55vh", width: "100%" }}>
        <GoogleMapReact
          ref="map"
          bootstrapURLKeys={{ key: "AIzaSyB6YgxpNCFRclsxCFIY8hGU1508sLVzxKY" }}
          center={this.props.center}
          defaultZoom={this.props.zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) =>
            this.apiIsLoaded(map, maps, sequence)
          }
        />
      </div>
    );
  }
}

export default MapContainer;
