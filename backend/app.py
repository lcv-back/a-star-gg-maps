import os
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS  # Import Flask-CORS để xử lý CORS
from dotenv import load_dotenv  # Đọc biến môi trường từ file .env

# Tải biến môi trường từ file .env
load_dotenv()

app = Flask(__name__)

# Enable CORS for all domains (allowing cross-origin requests)
CORS(app, origins="http://localhost:3000")  # Allow requests from localhost:3000 (Frontend)

# Lấy GEOAPIFY_API_KEY từ biến môi trường
GEOAPIFY_API_KEY = os.getenv('GEOAPIFY_API_KEY')

if not GEOAPIFY_API_KEY:
    raise ValueError("Geoapify API key not set in environment variables")

# Hàm chuyển đổi địa chỉ thành tọa độ (geocoding)
def get_coordinates(address):
    url = "https://api.geoapify.com/v1/geocode/search"
    params = {
        'text': address,
        'apiKey': GEOAPIFY_API_KEY
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        if data['features']:
            # Lấy tọa độ của điểm đầu tiên (địa chỉ có thể có nhiều kết quả)
            lat = data['features'][0]['geometry']['coordinates'][1]
            lon = data['features'][0]['geometry']['coordinates'][0]
            return lat, lon
    return None, None

# Hàm tính toán lộ trình giữa hai tọa độ (sử dụng OSRM)
def calculate_route(origin_lat, origin_lon, dest_lat, dest_lon):
    url = f"http://router.project-osrm.org/route/v1/driving/{origin_lon},{origin_lat};{dest_lon},{dest_lat}?overview=false"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if data['routes']:
            route = data['routes'][0]
            distance = route['legs'][0]['distance']  # Khoảng cách tính bằng mét
            duration = route['legs'][0]['duration']  # Thời gian tính bằng giây
            return distance, duration
    return None, None

# API tính toán lộ trình (POST)
@app.route('/api/route', methods=['POST'])
def route_calculation():
    data = request.get_json()
    
    origin = data.get('origin')
    destination = data.get('destination')

    if not origin or not destination:
        return jsonify({"error": "Origin and destination are required."}), 400

    # Lấy tọa độ từ Geoapify cho origin và destination
    origin_lat, origin_lon = get_coordinates(origin)
    destination_lat, destination_lon = get_coordinates(destination)

    if not origin_lat or not destination_lat:
        return jsonify({"error": "Unable to geocode origin or destination."}), 400

    # Tính toán lộ trình sử dụng OSRM
    distance, duration = calculate_route(origin_lat, origin_lon, destination_lat, destination_lon)

    if distance and duration:
        return jsonify({
            "message": "Route calculated successfully",
            "origin": origin,
            "destination": destination,
            "distance": distance,  # Khoảng cách tính bằng mét
            "duration": duration   # Thời gian tính bằng giây
        }), 200
    else:
        return jsonify({"error": "Unable to calculate route."}), 500

# API tìm kiếm địa chỉ (GET)
@app.route('/api/search', methods=['GET'])
def search_address():
    query = request.args.get('q')  # Lấy giá trị query 'q' từ frontend
    if not query:
        return jsonify({"error": "Query parameter 'q' is required"}), 400

    # Geoapify API URL
    url = "https://api.geoapify.com/v1/geocode/search"
    params = {
        'text': query,
        'apiKey': GEOAPIFY_API_KEY,  # Sử dụng API key từ biến môi trường
        'limit': 5
    }

    try:
        response = requests.get(url, params=params, timeout=10)  # Thêm timeout 10 giây

        if response.status_code == 200:
            return jsonify(response.json())  # Trả về dữ liệu geocoding từ Geoapify
        else:
            return jsonify({
                "error": "Failed to fetch data from Geoapify",
                "status_code": response.status_code,
                "message": response.text
            }), response.status_code

    except requests.exceptions.Timeout as e:
        # Xử lý lỗi timeout
        print(f"Timeout error: {e}")
        return jsonify({"error": "Connection timed out while contacting Geoapify API"}), 504

    except Exception as e:
        # Xử lý các lỗi khác
        print(f"Error during API call: {e}")
        return jsonify({"error": "Error occurred while calling Geoapify API"}), 500



# Hàm chuyển đổi địa chỉ thành tọa độ (geocoding)
def get_coordinates(address):
    url = "https://api.geoapify.com/v1/geocode/search"
    params = {
        'text': address,
        'apiKey': GEOAPIFY_API_KEY
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        if data['features']:
            lat = data['features'][0]['geometry']['coordinates'][1]
            lon = data['features'][0]['geometry']['coordinates'][0]
            print(f"Geocoding result for {address}: {lat}, {lon}")  # Log tọa độ
            return lat, lon
    print(f"Failed to geocode address: {address}")
    return None, None


if __name__ == '__main__':
    app.run(debug=True)
