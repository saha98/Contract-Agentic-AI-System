import os


def generate_report(insights, filename="report.pdf"):
    try:
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
        from reportlab.lib.styles import getSampleStyleSheet
    except ImportError as exc:
        raise RuntimeError(
            "reportlab is required to generate PDF reports. Install it with 'pip install reportlab'."
        ) from exc

    target_dir = os.path.join("data")
    os.makedirs(target_dir, exist_ok=True)
    file_path = os.path.join(target_dir, filename)

    doc = SimpleDocTemplate(file_path)
    styles = getSampleStyleSheet()

    content = []
    content.append(Paragraph("Contract Analysis Report", styles["Title"]))
    content.append(Spacer(1, 20))

    if not insights:
        content.append(Paragraph("No insights available.", styles["Normal"]))
    else:
        for i, item in enumerate(insights):
            issue = item.get("issue", "N/A")
            matched = item.get("matched_with", "N/A")
            risk = item.get("risk_level", "N/A")
            explanation = item.get("explanation", "N/A")
            recommendation = item.get("recommendation", "N/A")

            text = (
                f"<b>Issue {i + 1}:</b> {issue}<br/>"
                f"<b>Matched Clause:</b> {matched}<br/>"
                f"<b>Risk Level:</b> {risk}<br/>"
                f"<b>Explanation:</b> {explanation}<br/>"
                f"<b>Recommendation:</b> {recommendation}<br/><br/>"
            )
            content.append(Paragraph(text, styles["Normal"]))
            content.append(Spacer(1, 12))

    doc.build(content)

    return file_path
