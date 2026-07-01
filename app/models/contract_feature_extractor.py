import re


def extract_payment_days(text):

    text = text.lower()

    matches = re.findall(
        r"\((\d+)\)\s*days",
        text
    )

    if matches:

        return max(
            int(day)
            for day in matches
        )

    matches = re.findall(
        r"(\d+)\s*days",
        text
    )

    if matches:

        return max(
            int(day)
            for day in matches
        )

    return 0


def contains_keywords(
    text,
    keywords
):

    return int(

        any(
            keyword in text.lower()
            for keyword in keywords
        )

    )


def extract_features(
    processed_clauses
):

    full_text = " ".join(

        clause["text"]

        for clause in processed_clauses

        if "text" in clause

    )

    feature_vector = {

        # Existing Features

        "payment_days":
            extract_payment_days(
                full_text
            ),

        "liability_clause":
            contains_keywords(
                full_text,
                [
                    "liability",
                    "indemnity",
                    "damages",
                    "compensation"
                ]
            ),

        "termination_clause":
            contains_keywords(
                full_text,
                [
                    "termination",
                    "terminate",
                    "breach",
                    "exit"
                ]
            ),

        "confidentiality_clause":
            contains_keywords(
                full_text,
                [
                    "confidential",
                    "privacy",
                    "data protection",
                    "non disclosure"
                ]
            ),

        "compliance_clause":
            contains_keywords(
                full_text,
                [
                    "gdpr",
                    "hipaa",
                    "compliance",
                    "regulation",
                    "audit"
                ]
            ),

        # Enterprise Features

        "audit_rights":
            contains_keywords(
                full_text,
                [
                    "audit",
                    "inspection",
                    "review records"
                ]
            ),

        "indemnity_clause":
            contains_keywords(
                full_text,
                [
                    "indemnity",
                    "indemnify"
                ]
            ),

        "cybersecurity_clause":
            contains_keywords(
                full_text,
                [
                    "cybersecurity",
                    "security incident",
                    "encryption",
                    "security controls"
                ]
            ),

        "gdpr_clause":
            contains_keywords(
                full_text,
                [
                    "gdpr",
                    "personal data",
                    "data subject"
                ]
            ),

        "insurance_clause":
            contains_keywords(
                full_text,
                [
                    "insurance",
                    "coverage",
                    "insured"
                ]
            ),

        "force_majeure":
            contains_keywords(
                full_text,
                [
                    "force majeure",
                    "natural disaster",
                    "pandemic"
                ]
            ),

        "intellectual_property":
            contains_keywords(
                full_text,
                [
                    "intellectual property",
                    "copyright",
                    "patent",
                    "source code"
                ]
            ),

        "subcontracting":
            contains_keywords(
                full_text,
                [
                    "subcontractor",
                    "subcontracting",
                    "third party vendor"
                ]
            ),

        "vendor_risk":
            contains_keywords(
                full_text,
                [
                    "vendor",
                    "supplier",
                    "service provider"
                ]
            ),

        "data_retention":
            contains_keywords(
                full_text,
                [
                    "retention",
                    "retain data",
                    "record retention"
                ]
            ),

        "cross_border_transfer":
            contains_keywords(
                full_text,
                [
                    "cross border",
                    "international transfer",
                    "outside jurisdiction"
                ]
            )

    }

    return feature_vector