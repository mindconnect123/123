import React from "react";
import "./Home.css";

import MoodTracker from "./MoodTracker";
import Chatbot from "./Chatbot";
import RelationshipCheckIn from "./RelationshipCheckIn";
import Insights from "./Insights";
import SafetyNet from "./SafetyNet";
import Resources from "./Resources";
import About from "./About";
// Import other components as needed

function Home() {
  return (
    <div className="main-content">
      <section className="home-hero">
        <h1>Welcome to MindConnect</h1>
        <p>
          Your companion for tracking mood, habits, and wellbeing. MindConnect empowers you to understand yourself better and connect
          with supportive resources, all in a calming and safe environment.
        </p>
        <a href="/login" className="home-btn">Get Started</a>
      </section>

      <section className="home-features">
        <h2>Main Features</h2>
        <ul>
          <li>🌈 Mood & Habit Tracker</li>
          <li>🤖 Empathetic Chatbot for daily reflection</li>
          <li>👥 Relationship Check-ins</li>
          <li>📊 Personalized Insights & Analytics</li>
          <li>🛡️ Social Safety Net & Trusted Contacts</li>
          <li>🧑‍⚕️ Resources for Professional Help</li>
          <li>🔒 Privacy & Consent Built In</li>
        </ul>
      </section>

      <section className="home-component-previews">
        <h2>Quick Overview</h2>
        
        <div>
          <h3>Mood Tracker</h3>
          <MoodTracker summaryOnly={true} />
        </div>

        <div>
          <h3>Relationship Check-in</h3>
          <RelationshipCheckIn summaryOnly={true} />
        </div>

        <div>
          <h3>AI Chatbot</h3>
          <Chatbot summaryOnly={true} />
        </div>

        <div>
            <h3>Safetyney</h3>
            <SafetyNet summaryOnly={true} />
        </div>

        <div>
          <h3>insights</h3>
          <Insights summaryOnly={true} />
        </div>

        <div>
          <h3>resources</h3>
          <Resources summaryOnly={true} />
        </div>
        
        <div>
          <h3>about</h3>
          <About summaryOnly={true} />
        </div>
        {/* Add more components and summaries as you like */}
      </section>
    </div>
  );
}

export default Home;
