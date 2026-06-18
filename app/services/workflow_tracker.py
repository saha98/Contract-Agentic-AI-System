from datetime import datetime

workflow_log = []

agent_start_times = {}


def log_step(agent_name, status):

    current_time = datetime.now()

    if status == "Started":

        agent_start_times[agent_name] = current_time

        runtime = None

    else:

        start_time = agent_start_times.get(agent_name)

        runtime = (
            current_time - start_time
        ).total_seconds() if start_time else None

    workflow_log.append({

        "agent": agent_name,

        "status": status,

        "timestamp": current_time.strftime(
            "%Y-%m-%d %H:%M:%S"
        ),

        "runtime": runtime
    })


def get_logs():

    return workflow_log


def clear_logs():

    workflow_log.clear()