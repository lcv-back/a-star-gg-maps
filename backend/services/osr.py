import requests
import os
from dotenv import load_dotenv

load_dotenv()
ORS_API_KEY = "5b3ce3597851110001cf6248e4af35f7cddb45c9ac9f8dfe85e83137"

def get_route(origin, destination, profile='driving-car'):
    url = f"https://api.openrouteservice.org/v2/directions/{profile}/geojson"
    headers = {
        "Authorization": ORS_API_KEY,
        "Content-Type": "application/json"
    }
    body = {
        "coordinates": [
            [origin[0], origin[1]],
            [destination[0], destination[1]]
        ]
    }
    res = requests.post(url, json=body, headers=headers)
    if res.status_code == 200:
        return res.json()['features'][0]['geometry']
    else:
        print("ORS error:", res.text)
        return {}
