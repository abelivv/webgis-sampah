import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useEffect, useState } from "react";

// FIX ICON
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

const injectMapStyles = () => {
  if (document.getElementById("map-floral-styles")) return;
  const style = document.createElement("style");
  style.id = "map-floral-styles";
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap');

    @keyframes mapBloom {
      0%   { opacity: 0; transform: translateY(10px); }
      100% { opacity: 1; transform: translateY(0);    }
    }

    .map-floral-wrap {
      animation: mapBloom 0.45s ease both;
    }

    .map-search-bar {
      display: flex;
      gap: 10px;
      margin-bottom: 12px;
    }
    .map-search-input {
      flex: 1;
      padding: 11px 16px;
      border: 1.5px solid #e0cdb8;
      border-radius: 12px;
      background: rgba(253,246,242,0.92);
      color: #5a3a42;
      font-size: 14px;
      font-family: 'Lato', sans-serif;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .map-search-input:focus {
      border-color: #d4859a;
      box-shadow: 0 0 0 4px rgba(212,133,154,0.15);
      background: #fffaf8;
    }
    .map-search-input::placeholder {
      color: #c0a0a8;
    }
    .map-search-btn {
      padding: 11px 20px;
      background: linear-gradient(135deg, #c0607a, #d4859a);
      color: #fffaf8;
      border: none;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 700;
      font-family: 'Lato', sans-serif;
      cursor: pointer;
      transition: transform 0.18s, box-shadow 0.18s;
      box-shadow: 0 3px 12px rgba(192,96,122,0.24);
      letter-spacing: 0.4px;
    }
    .map-search-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 5px 16px rgba(192,96,122,0.32);
    }
    .map-search-btn:active {
      transform: translateY(0);
    }

    .map-container-wrap {
      border-radius: 16px;
      overflow: hidden;
      border: 1.5px solid #e0cdb8;
      box-shadow: 0 4px 20px rgba(212,133,154,0.12);
    }

    /* Leaflet popup styling */
    .leaflet-popup-content-wrapper {
      border-radius: 12px !important;
      border: 1.5px solid #e0cdb8 !important;
      background: rgba(253,249,244,0.97) !important;
      box-shadow: 0 4px 20px rgba(212,133,154,0.18) !important;
      color: #5a3a42 !important;
      font-family: 'Lato', sans-serif !important;
    }
    .leaflet-popup-tip {
      background: rgba(253,249,244,0.97) !important;
    }
    .leaflet-popup-content b {
      color: #c0607a;
      font-weight: 700;
    }
    .leaflet-popup-content {
      font-size: 13px;
      line-height: 1.6;
      color: #5a3a42;
    }
  `;
  document.head.appendChild(style);
};

// PARSE LOCATION
export const parseLocation = (loc) => {
  if (!loc) return null;

  if (
    typeof loc === "string" &&
    /^[0-9A-F]+$/i.test(loc)
  ) {
    const bytes = new Uint8Array(
      loc.match(/.{1,2}/g).map((b) => parseInt(b, 16))
    );
    const view = new DataView(bytes.buffer);
    const offset = loc.startsWith("0101000020") ? 9 : 5;
    return {
      lng: view.getFloat64(offset, true),
      lat: view.getFloat64(offset + 8, true)
    };
  }

  if (typeof loc === "string") {
    const m = loc.match(/POINT\s*\(\s*([^ ]+)\s+([^ ]+)\s*\)/i);
    if (m) return { lat: parseFloat(m[2]), lng: parseFloat(m[1]) };
  }

  if (typeof loc === "object") {
    return loc.coordinates
      ? { lat: loc.coordinates[1], lng: loc.coordinates[0] }
      : loc;
  }

  return null;
};

// MOVE MAP
function MapEvents({ setLatLng, center }) {
  const map = useMap();

  useEffect(() => {
    if (center) map.setView(center, 15);
  }, [center, map]);

  useMapEvents({
    click: (e) => setLatLng && setLatLng(e.latlng)
  });

  return null;
}

export default function Map({ data = [], setLatLng, selectedMarker }) {
  injectMapStyles();

  const [search, setSearch] = useState("");
  const [searchPos, setSearchPos] = useState(null);

  const center =
    searchPos ||
    selectedMarker ||
    parseLocation(data[0]?.location) || {
      lat: -7.7956,
      lng: 110.3695
    };

  const searchLocation = async () => {
    if (!search) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${search}`
      );
      const result = await res.json();
      if (!result.length) { alert("Lokasi tidak ditemukan"); return; }
      setSearchPos({ lat: parseFloat(result[0].lat), lng: parseFloat(result[0].lon) });
    } catch (err) {
      console.error(err);
      alert("Gagal mencari lokasi");
    }
  };

  return (
    <div className="map-floral-wrap">
      {/* Search bar */}
      <div className="map-search-bar">
        <input
          type="text"
          className="map-search-input"
          placeholder="✿ Cari lokasi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchLocation()}
        />
        <button className="map-search-btn" onClick={searchLocation}>
          Cari
        </button>
      </div>

      {/* Map */}
      <div className="map-container-wrap">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={13}
          style={{ height: "350px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapEvents setLatLng={setLatLng} center={center} />

          {data.map((item, i) => {
            const pos = parseLocation(item.location);
            if (!pos) return null;
            return (
              <Marker key={i} position={[pos.lat, pos.lng]}>
                <Popup>
                  <b>{item.nama}</b><br />
                  {item.alamat}<br />
                  Status: {item.pembayaran?.[0]?.status || "Belum Bayar"}
                </Popup>
              </Marker>
            );
          })}

          {searchPos && (
            <Marker position={[searchPos.lat, searchPos.lng]}>
              <Popup>Lokasi ditemukan</Popup>
            </Marker>
          )}

          {selectedMarker && (
            <Marker position={[selectedMarker.lat, selectedMarker.lng]} />
          )}
        </MapContainer>
      </div>
    </div>
  );
}