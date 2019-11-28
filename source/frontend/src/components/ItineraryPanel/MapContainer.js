import React from "react";
import GoogleMapReact from "google-map-react";

import { axios } from "../oauth";

const { google } = window;
const infoWindow = new google.maps.InfoWindow();

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
      stopover: true
    }));
  };

  _addMarkers = async (map, sequence) => {
    const bounds = new google.maps.LatLngBounds();
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
      this._addListenerToMarker(marker, map, infoWindow, sequence[i].name);
    });
    map.setCenter(bounds.getCenter());
    map.fitBounds(bounds);
    map.setZoom(11);
  };

  _addListenerToMarker = (marker, map, infoWindow, name) => {
    google.maps.event.addListener(
      marker,
      "click",
      (marker => () => {
        infoWindow.setContent(name);
        infoWindow.open(map, marker);
      })(marker)
    );
  };

  apiIsLoaded = (map, maps, sequence) => {
    if (sequence.length === 0) return;
    this._addMarkers(map, sequence);
    const directionsService = new maps.DirectionsService();
    const directionsDisplay = new maps.DirectionsRenderer();
    for (let i = 0; i < sequence.length; i++) {
      const next = i === sequence.length - 1 ? 0 : i + 1;
      directionsService.route(
        {
          origin: sequence[i].address,
          destination: sequence[next].address,
          // waypoints: this._getWaypoints(sequence),
          travelMode: "DRIVING"
        },
        this._routeCallback(directionsDisplay, map, sequence, i, next)
      );
    }
  };

  _addListenerToLine = (line, content, map) => {
    google.maps.event.addListener(line, "click", event => {
      infoWindow.setContent(content);
      infoWindow.setPosition(event.latLng);
      infoWindow.open(map);
    });
  };

  _routeCallback = (directionsDisplay, map, seq, i, next) => (res, status) => {
    if (status === "OK") {
      directionsDisplay.setDirections(res);
      const line = new google.maps.Polyline({
        path: res.routes[0].overview_path,
        strokeColor: "#4285f4"
      });
      line.setMap(map);
      const text = this._buildDisplayText(seq, i, next, res.routes[0].legs[0]);
      this._addListenerToLine(line, text, map);
    } else {
      alert("Directions request failed due to " + status);
    }
  };

  _buildGoogleMapsUrl = (origin, dest) => {
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}`;
  };

  _buildDisplayText = (sequence, curr, next, { distance, duration }) => {
    return `From ${curr + 1} - ${sequence[curr].name} <br/> to ${next + 1} - ${
      sequence[next].name
    }: <br/> ${distance.text} <br/> ${
      duration.text
    } <br/> <a href="${this._buildGoogleMapsUrl(
      sequence[curr].address,
      sequence[next].address
    )}" target="_blank">View in Google Maps</a>`;
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
