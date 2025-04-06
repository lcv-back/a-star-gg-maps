import networkx as nx
from math import radians, cos, sin, sqrt, atan2

def haversine(lon1, lat1, lon2, lat2):
    R = 6371  # Earth radius in km
    dlon = radians(lon2 - lon1)
    dlat = radians(lat2 - lat1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    return R * 2 * atan2(sqrt(a), sqrt(1-a))

def a_star_path(graph, start_node, end_node):
    def heuristic(u, v):
        u_data = graph.nodes[u]
        v_data = graph.nodes[v]
        return haversine(u_data['x'], u_data['y'], v_data['x'], v_data['y'])

    path = nx.astar_path(graph, start_node, end_node, heuristic=heuristic, weight='length')
    return path
