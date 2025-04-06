import requests
import os
from dotenv import load_dotenv

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

def get_google_directions(origin, destination):
    url = f"https://maps.googleapis.com/maps/api/directions/json"
    params = {
        "origin": origin,
        "destination": destination,
        "mode": "driving",
        "departure_time": "now",
        "key": GOOGLE_API_KEY
    }
    response = requests.get(url, params=params)
    data = response.json()

    if not data['routes']:
        return {"error": "No route found"}

    points = data['routes'][0]['overview_polyline']['points']
    return {"polyline": points}
