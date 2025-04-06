import osmnx as ox
import networkx as nx

# Tải và lưu graph cho thành phố
def load_graph(place_name="District 1, Ho Chi Minh City"):
    graph = ox.graph_from_place(place_name, network_type="drive")
    graph = ox.add_edge_speeds(graph)
    graph = ox.add_edge_travel_times(graph)
    return graph
