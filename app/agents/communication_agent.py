import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)
    
from app.services.report_service import generate_report
from app.services.email_service import send_email_report
from app.services.workflow_tracker import log_step

def communication_agent(insights):

    # Generate report
    report_path = generate_report(insights)

    # Send email
    try:
        send_email_report(
            "your_email@gmail.com",
            report_path
        )

        status = "Email sent successfully"

    except Exception as e:
        status = str(e)

    return {
        "report": report_path,
        "email_status": status
    }