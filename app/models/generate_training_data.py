import random
import pandas as pd


def generate_dataset(
    rows=3000
):

    data = []

    for _ in range(rows):

        payment_days = random.choice(
            [15, 30, 45, 60, 90, 120, 180]
        )

        liability_clause = random.randint(
            0, 1
        )

        termination_clause = random.randint(
            0, 1
        )

        confidentiality_clause = random.randint(
            0, 1
        )

        compliance_clause = random.randint(
            0, 1
        )

        audit_rights = random.randint(
            0, 1
        )

        indemnity_clause = random.randint(
            0, 1
        )

        cybersecurity_clause = random.randint(
            0, 1
        )

        gdpr_clause = random.randint(
            0, 1
        )

        insurance_clause = random.randint(
            0, 1
        )

        force_majeure = random.randint(
            0, 1
        )

        intellectual_property = random.randint(
            0, 1
        )

        subcontracting = random.randint(
            0, 1
        )

        vendor_risk = random.randint(
            0, 1
        )

        data_retention = random.randint(
            0, 1
        )

        cross_border_transfer = random.randint(
            0, 1
        )

        risk_score = 0

        if payment_days > 90:
            risk_score += 3

        if liability_clause:
            risk_score += 2

        if termination_clause:
            risk_score += 2

        if not confidentiality_clause:
            risk_score += 2

        if not compliance_clause:
            risk_score += 2

        if audit_rights:
            risk_score += 1

        if indemnity_clause:
            risk_score += 1

        if cross_border_transfer:
            risk_score += 2

            if risk_score <= 2:

                risk_class = 0

            elif risk_score <= 5:

                risk_class = 1

            elif risk_score <= 8:

                risk_class = 2

            else:

                risk_class = 3

        data.append({

            "payment_days":
                payment_days,

            "liability_clause":
                liability_clause,

            "termination_clause":
                termination_clause,

            "confidentiality_clause":
                confidentiality_clause,

            "compliance_clause":
                compliance_clause,

            "audit_rights":
                audit_rights,

            "indemnity_clause":
                indemnity_clause,

            "cybersecurity_clause":
                cybersecurity_clause,

            "gdpr_clause":
                gdpr_clause,

            "insurance_clause":
                insurance_clause,

            "force_majeure":
                force_majeure,

            "intellectual_property":
                intellectual_property,

            "subcontracting":
                subcontracting,

            "vendor_risk":
                vendor_risk,

            "data_retention":
                data_retention,

            "cross_border_transfer":
                cross_border_transfer,

            "risk_class":
                risk_class

        })

    return pd.DataFrame(data)


if __name__ == "__main__":

    dataset = generate_dataset(
        3000
    )

    dataset.to_csv(
        "contract_training_dataset.csv",
        index=False
    )

    print(
        "Dataset Generated:",
        len(dataset)
    )