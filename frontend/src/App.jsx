import { useState } from 'react';
import axios from 'axios';
import MapView from './components/MapView';
import AddressInput from './components/AddressInput'; // Đã tích hợp autocomplete

function App() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [coordinates, setCoordinates] = useState([]);
  const [distance, setDistance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFindPath = async () => {
    setLoading(true);
    setError(null); // Reset error khi bắt đầu tìm đường

    try {
      console.log("Origin:", origin);  // Log origin để kiểm tra dữ liệu
      console.log("Destination:", destination); // Log destination để kiểm tra dữ liệu

      const res = await axios.post("http://localhost:5000/api/route", {
        origin,
        destination
      });

      // Log dữ liệu trả về từ backend
      console.log("Response data:", res.data);

      if (res.data.coordinates) {
        setCoordinates(res.data.coordinates);

        // Tính tổng quãng đường
        let totalDistance = 0;
        for (let i = 0; i < res.data.coordinates.length - 1; i++) {
          const [lat1, lon1] = res.data.coordinates[i];
          const [lat2, lon2] = res.data.coordinates[i + 1];
          totalDistance += haversine(lat1, lon1, lat2, lon2);
        }

        setDistance(totalDistance.toFixed(2)); // Tổng quãng đường tính bằng km
      } else {
        setError("Không tìm thấy đường.");
      }
    } catch (err) {
      console.log("Error during route calculation:", err);  // Log lỗi nếu có
      setError("Đã xảy ra lỗi khi tìm đường.");
    } finally {
      setLoading(false);
    }
  };

  const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>🗺️ Tìm đường bằng A* với địa chỉ</h2>

      <div style={styles.inputContainer}>
        {/* Địa chỉ bắt đầu */}
        <AddressInput
          label="📍 Nhập địa chỉ điểm bắt đầu"
          value={origin}
          setValue={setOrigin}
          setError={setError}
        />
        {/* Địa chỉ đích */}
        <AddressInput
          label="🏁 Nhập địa chỉ điểm đích"
          value={destination}
          setValue={setDestination}
          setError={setError}
        />
      </div>

      <button onClick={handleFindPath} style={styles.button} disabled={loading}>
        {loading ? 'Đang tìm đường...' : 'Tìm đường'}
      </button>

      {/* Hiển thị thông báo lỗi */}
      {error && <div style={styles.error}>{error}</div>}

      {/* Hiển thị quãng đường */}
      {distance > 0 && <div style={styles.distance}>Tổng quãng đường: {distance} km</div>}

      <MapView coordinates={coordinates} origin={origin} destination={destination} />
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    fontSize: '24px',
    color: '#333',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '15px',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: '10px',
  },
  distance: {
    textAlign: 'center',
    fontSize: '18px',
    marginTop: '10px',
    fontWeight: 'bold',
  },
};

export default App;
