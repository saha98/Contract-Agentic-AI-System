import { FiCompass, FiFileText } from "react-icons/fi";

function parseSummary(summary) {
  if (!summary) {
    return [];
  }

  const cleaned = String(summary).trim();
  const headingMatches = cleaned.match(/(?:^|\n)\s*\d+\.\s+[^\n]+/g);

  if (headingMatches && headingMatches.length > 0) {
    const sections = cleaned
      .split(/\n(?=\s*\d+\.\s+)/)
      .map((section) => section.trim())
      .filter(Boolean)
      .map((section) => {
        const [firstLine, ...rest] = section.split("\n");
        return {
          title: firstLine.replace(/^\s*\d+\.\s*/, "").trim(),
          body: rest.join("\n").trim()
        };
      });

    if (sections.length > 0) {
      return sections;
    }
  }

  return cleaned
    .split(/\n\s*\n/)
    .map((section, index) => ({
      title: index === 0 ? "Executive Summary" : `Section ${index + 1}`,
      body: section.trim()
    }))
    .filter((section) => section.body);
}

function ExecutiveSummaryPanel({ summary = "" }) {
  const sections = parseSummary(summary);

  return (
    <section className="section-card adaptive-panel">
      <div className="card-header">
        <div>
          <p className="ey-kicker">Executive Summary Report</p>
          <h3 className="card-title">Decision-ready narrative</h3>
          <p className="card-subtitle">A cleaner readout for technical managers, legal reviewers, and executive stakeholders.</p>
        </div>
      </div>

      {!summary ? (
        <div className="empty-state">The executive agent did not return a summary for this run.</div>
      ) : (
        <div className="adaptive-summary-sections">
          {sections.map((section, index) => (
            <article className="adaptive-summary-section" key={`${section.title}-${index}`}>
              <div className="adaptive-summary-section-head">
                <div className="adaptive-summary-section-icon">
                  {index === 0 ? <FiFileText /> : <FiCompass />}
                </div>
                <h4 className="adaptive-summary-section-title">{section.title}</h4>
              </div>
              <div className="adaptive-summary-section-body">
                {section.body.split("\n").filter(Boolean).map((line, lineIndex) => (
                  <p key={`${lineIndex}-${line}`}>{line.replace(/^[-*]\s*/, "")}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ExecutiveSummaryPanel;
