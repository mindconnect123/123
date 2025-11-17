import React from "react";
import "./Resources.css";

function Resources({ summaryOnly }) {
  const resources = [
    {
      category: "Mental Health Help Lines",
      links: [
        { name: "National Suicide Prevention Lifeline", url: "https://www.bing.com/search?q=national+suicide+prevention+lifeline&form=ANNTH1&refig=6911ae5e5e8d4ec19315b1033b1e6b08&pc=DCTS&ucpdpc=UCPD" },
        { name: "Crisis Text Line", url: "https://www.crisistextline.org/" },
        { name: "telemanas", url: "https://telemanas.mohfw.gov.in/home" }
      ]
    },
    {
      category: "Therapy Directories",
      links: [
        { name: "BetterHelp", url: "https://www.betterhelp.com" },
        { name: "Talkspace", url: "https://www.talkspace.com" },
        { name: "Psychology Today", url: "https://www.psychologytoday.com/us/therapists" }
      ]
    },
    {
      category: "Self-Help & Education",
      links: [
        { name: "Mind.org.uk", url: "https://www.mind.org.uk" },
        { name: "NIMH (National Institute of Mental Health)", url: "https://www.nimh.nih.gov" },
        { name: "Mental Health America", url: "https://mhanational.org" }
      ]
    }
  ];

  if (summaryOnly) {
    // Show just categories and number of links as summary
    return (
      <div className="resources-summary">
        <h4>Helpful Resources & Guidance</h4>
        <ul>
          {resources.map((section, idx) => (
            <li key={idx}>
              <strong>{section.category}</strong> ({section.links.length} links)
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Full detailed resource list UI
  return (
    <div className="main-content">
      <h2>Helpful Resources & Guidance</h2>
      {resources.map((section, idx) => (
        <section key={idx} className="resource-section">
          <h3>{section.category}</h3>
          <ul>
            {section.links.map((link, i) => (
              <li key={i}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default Resources;
