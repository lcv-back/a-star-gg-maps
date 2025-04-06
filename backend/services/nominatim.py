import requests

def geocode_address(address):
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": address,
        "format": "json",
        "limit": 1
    }
    headers = {
        "User-Agent": "astar-routing-app"
    }
    res = requests.get(url, params=params, headers=headers)
    if res.status_code == 200 and res.json():
        result = res.json()[0]
        lat = float(result["lat"])
        lon = float(result["lon"])
        return (lat, lon)
    return None
