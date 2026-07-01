from app.langgraph.workflow import (
    build_graph
)


def run_graph(
    user_query,
    file_path
):

    graph = build_graph()

    result = graph.invoke({

        "user_query":
            user_query,

        "file_path":
            file_path

    })

    return result