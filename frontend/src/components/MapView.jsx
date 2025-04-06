import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = ({ coordinates, origin, destination }) => {
  // Tạo custom icon cho markers
  const originIcon = new L.Icon({
    iconUrl: "https://img.icons8.com/ios-filled/50/000000/marker.png", // Ví dụ: icon xanh
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const destinationIcon = new L.Icon({
    iconUrl: "https://img.icons8.com/ios-filled/50/000000/marker.png", // Icon đỏ
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const originMarker = origin && Array.isArray(origin) && origin.length === 2 ? (
    <Marker position={origin} icon={originIcon}>
      <Popup>Bắt đầu: {origin.join(', ')}</Popup>
    </Marker>
  ) : null;

  const destinationMarker = destination && Array.isArray(destination) && destination.length === 2 ? (
    <Marker position={destination} icon={destinationIcon}>
      <Popup>Điểm đến: {destination.join(', ')}</Popup>
    </Marker>
  ) : null;

  return (
    <MapContainer
      center={origin || [10.7769, 106.7009]}  // Tự động zoom vào điểm bắt đầu nếu có
      zoom={14}
      style={{ height: "500px", marginTop: "20px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Vẽ tuyến đường */}
      {coordinates.length > 0 && <Polyline positions={coordinates} color="blue" />}
      
      {/* Đánh dấu điểm bắt đầu và điểm kết thúc */}
      {originMarker}
      {destinationMarker}
    </MapContainer>
  );
};

export default MapView;
