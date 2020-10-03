import React from "react";
import { Map as LeafleMap, TileLayer } from "react-leaflet";
import { showDataOnMap } from "../../utils/utils";
import "./Map.style.css";

const Map = ({ countries, caseTypes, center, zoom }) => {
  return (
    <div className='map'>
      <LeafleMap center={center} zoom={zoom}>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Loop through Countries and Draw Circles on the screen */}
        {showDataOnMap(countries, caseTypes)}
      </LeafleMap>
    </div>
  );
};

export default Map;
