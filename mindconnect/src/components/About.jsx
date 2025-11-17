import React from "react";
import "./About.css";

function About({ summaryOnly }) {
  if (summaryOnly) {
    return (
      <div className="about-summary">
        <h3>About MindConnect</h3>
        <p>MindConnect supports mental wellness through mood tracking, self-reflection, and social safety tools. Empowering you to understand your emotional health better and connect with resources.</p>
        <p>
          Contact us at <a href="mailto:support@mindconnect.com">support@mindconnect.com</a> for feedback, collaborations, or volunteering.
        </p>
      </div>
    );
  }

  return (
    <div className="main-content">
      <h2>About MindConnect</h2>
      <section className="about-section">
        <h3>Our Mission</h3>
        <p>
          MindConnect is dedicated to supporting mental wellness by providing tools for mood tracking, self-reflection, and building a trusted social safety network. We aim to empower users to understand their emotional health better and connect with helpful resources.
        </p>
      </section>
      <section className="about-section">
        <h3>The Team</h3>
        <p>
          Our team is made up of mental health professionals, software developers, and passionate advocates committed to creating accessible, empathetic technology for everyone.
        </p>
      </section>
      <section className="about-section">
        <h3>Get Involved</h3>
        <p>
          We welcome feedback, collaborations, and volunteers. If you want to support MindConnect or provide resources, please contact us at <a href="mailto:support@mindconnect.com">support@mindconnect.com</a>.
        </p>
      </section>
      <section className="about-section">
        <h3>Disclaimer</h3>
        <p>
          MindConnect is not a substitute for professional medical advice or treatment. If you or someone you know is in crisis, please seek professional help immediately or contact emergency services.
        </p>
      </section>
    </div>
  );
}

export default About;
