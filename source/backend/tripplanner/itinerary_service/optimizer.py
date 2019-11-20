from __future__ import print_function

import os

import googlemaps
from ortools.constraint_solver import pywrapcp, routing_enums_pb2

client = googlemaps.Client(key=os.getenv('GOOGLE_API_KEY', ''))


def build_plain_matrix(json_matrix):
    size = len(json_matrix['destination_addresses'])
    matrix = [[0] * size for _ in range(size)]
    for i, row in enumerate(json_matrix['rows']):
        for j, element in enumerate(row['elements']):
            if element['status'] == 'NOT_FOUND':
                raise Exception(
                    'Found invalid address when building distance matrix!')
            matrix[i][j] = element['distance']['value']
    return matrix


def create_data_model(json_matrix, depot):
    return {
        'distance_matrix':  build_plain_matrix(json_matrix),
        'num_vehicles': 1,
        'depot': depot
    }


def build_solution(manager, routing, assignment):
    plan_output = 'Optimized Route:'
    route_distance, index = 0, routing.Start(0)
    route = []
    while not routing.IsEnd(index):
        plan_output += ' {} ->'.format(manager.IndexToNode(index))
        route.append(manager.IndexToNode(index))
        index = assignment.Value(routing.NextVar(index))
    plan_output += ' {}\n'.format(manager.IndexToNode(index))
    # route.append(manager.IndexToNode(index))
    return route, plan_output


def solve_tsp(json_matrix, depot=0):
    data = create_data_model(json_matrix, depot)
    manager = pywrapcp.RoutingIndexManager(len(data['distance_matrix']),
                                           data['num_vehicles'], data['depot'])
    routing = pywrapcp.RoutingModel(manager)

    def distance_callback(from_index, to_index):
        """Returns the distance between the two nodes."""
        # Convert from routing variable Index to distance matrix NodeIndex.
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        return data['distance_matrix'][from_node][to_node]

    # Define cost of each arc.
    routing.SetArcCostEvaluatorOfAllVehicles(
        routing.RegisterTransitCallback(distance_callback))
    # Setting first solution heuristic.
    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC)

    assignment = routing.SolveWithParameters(search_parameters)
    return build_solution(manager, routing, assignment) if assignment else []


def sort_sequence(sequence):
    places = [item['address'] for item in sequence]
    json_matrix = client.distance_matrix(places, places, mode='driving')
    route, text_sequence = solve_tsp(json_matrix)
    optimized_sequence = [sequence[i] for i in route]
    print(text_sequence)
    return optimized_sequence
