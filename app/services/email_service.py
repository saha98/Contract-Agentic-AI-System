def send_email_report(to_email, report_path):
    return {
        "status": "disabled",
        "message": "Email delivery is currently disabled.",
        "to_email": to_email,
        "report_path": report_path
    }
