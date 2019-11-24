import React from "react";
import GoogleMapReact from "google-map-react";

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

  _addMarkers = (map, sequence) => {
    const bounds = new google.maps.LatLngBounds();
    const infoWindow = new google.maps.InfoWindow();
    const geocoder = new google.maps.Geocoder();

    sequence.forEach((item, i) => {
      geocoder.geocode({ address: item.address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (i === 0) map.setCenter(results[0].geometry.location);
          const marker = new google.maps.Marker({
            position: results[0].geometry.location,
            map: map,
            label: `${i + 1}`
          });
          bounds.extend(marker.getPosition());
          this._addListenerToMarker(marker, map, infoWindow, item);
        } else console.log(status + " for " + item.name);
      });
    });
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
      <div style={{ height: "100vh", width: "100vh" }}>
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
