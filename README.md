# A* GG Maps

A web application that implements the A* pathfinding algorithm to find the shortest path between two points on Google Maps.

## Features

- Interactive Google Maps interface
- A* pathfinding algorithm implementation
- Visual representation of the shortest path
- Distance and time estimation

## Prerequisites

- Python 
- Google Maps API Key
- ReactJS

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/lcv-backyourusername/a-star-gg-maps.git
cd a-star-gg-maps
```

1. Install dependencies:
```bash
# Frontend
cd frontend
npm install

# Backend
cd ..
pip install -r requirements.txt
```

3. Configure environment:
- Create .env file in the frontend directory
- Add your Google Maps API key:
```bash
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
GEOAPIFY_API_KEY=your_geoapify_api_key_here
```

4. Run the application:
```bash
# Start frontend (in frontend directory)
npm start

# Start backend (in root directory)
python app.py
```

5. Open your browser and visit http://localhost:3000
```bash
a-star-gg-maps/
├── frontend/          # React frontend application
│   ├── src/          # Source files
│   ├── public/       # Static files
│   └── package.json  # Frontend dependencies
└── backend/          # backend server
    ├── services/          # Source files
    └── app.py
    └── requirements.txt  # Backend dependencies
```

# Technologies Used
- Frontend
    - React.js
    - Axios
    - Google Maps API
- Backend
    - Python
    - Flask
    - Google Maps API