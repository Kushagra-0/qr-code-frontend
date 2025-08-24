import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { useState, useEffect } from "react";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet default marker icons (otherwise broken images in React)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LocationForm = ({ typeData, setTypeData }: any) => {
  const [position, setPosition] = useState<[number, number]>(
    typeData.latitude && typeData.longitude
      ? [parseFloat(typeData.latitude), parseFloat(typeData.longitude)]
      : [28.6139, 77.2090] // default: New Delhi
  );

  // Component to keep map centered on marker
  function RecenterMap({ position }: { position: [number, number] }) {
    const map = useMap();
    useEffect(() => {
      map.setView(position); // recenter when position changes
    }, [position, map]);
    return null;
  }

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
        setPosition(newPos);
        setTypeData({
          ...typeData,
          latitude: e.latlng.lat.toString(),
          longitude: e.latlng.lng.toString(),
        });
      },
    });

    return <Marker position={position} />;
  }

  return (
    <div className="space-y-4">
      <div className="h-64 w-full rounded-lg overflow-hidden border">
        <MapContainer center={position} zoom={13} className="h-full w-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <LocationMarker />
          <RecenterMap position={position} />
        </MapContainer>
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-1">Latitude</label>
        <input
          type="text"
          value={typeData.latitude || ""}
          onChange={(e) =>
            setTypeData({ ...typeData, latitude: e.target.value })
          }
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-1">Longitude</label>
        <input
          type="text"
          value={typeData.longitude || ""}
          onChange={(e) =>
            setTypeData({ ...typeData, longitude: e.target.value })
          }
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-1">Place Name / Query</label>
        <input
          type="text"
          placeholder="Optional: e.g. Taj Mahal"
          value={typeData.query || ""}
          onChange={(e) => setTypeData({ ...typeData, query: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>
    </div>
  );
};

export default LocationForm;
