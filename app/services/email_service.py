import smtplib
from email.message import EmailMessage

def send_email_report(to_email, report_path):
    
    msg = EmailMessage()
    msg["Subject"] = "Contract Risk Analysis Report"
    msg["From"] = "saha0709suvodeep@gmail.com"
    msg["To"] = to_email

    msg.set_content("Please find attached the contract analysis report.")

    # Attach file
    with open(report_path, "rb") as f:
        file_data = f.read()
        msg.add_attachment(file_data, maintype="application", subtype="pdf", filename="report.pdf")

    # Send email (Gmail example)
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login("saha0709suvodeep@gmail.com", "pcuhzgmvpfckvsvj")
        smtp.send_message(msg)