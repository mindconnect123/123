import React, { useState, useEffect } from "react";
import "./Insights.css";

function Insights({ summaryOnly }) {
  const [moodHistory, setMoodHistory] = useState(() => {
    const saved = localStorage.getItem("moodHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const [relationshipCheckins] = useState(() => {
    const saved = localStorage.getItem("relationshipCheckins");
    return saved ? JSON.parse(saved) : [];
  });

  const [stepHistory, setStepHistory] = useState(() => {
    const saved = localStorage.getItem("stepHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const [sleepHistory, setSleepHistory] = useState(() => {
    const saved = localStorage.getItem("sleepHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const [steps, setSteps] = useState("");
  const [sleepHours, setSleepHours] = useState("");

  useEffect(() => {
    localStorage.setItem("stepHistory", JSON.stringify(stepHistory));
  }, [stepHistory]);

  useEffect(() => {
    localStorage.setItem("sleepHistory", JSON.stringify(sleepHistory));
  }, [sleepHistory]);

  const averageSteps = () => {
    if (stepHistory.length === 0) return 0;
    const total = stepHistory.reduce((sum, entry) => sum + entry.steps, 0);
    return (total / stepHistory.length).toFixed(0);
  };

  const averageSleep = () => {
    if (sleepHistory.length === 0) return 0;
    const total = sleepHistory.reduce((sum, entry) => sum + entry.hours, 0);
    return (total / sleepHistory.length).toFixed(1);
  };

  const moodSummary = () => {
    if (moodHistory.length === 0) return "No mood data yet";
    const counts = {};
    moodHistory.forEach(({ mood }) => {
      counts[mood] = (counts[mood] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return `Most frequent mood: ${sorted[0][0]} (${sorted[0][1]} times)`;
  };

  const addSteps = (e) => {
    e.preventDefault();
    if (!steps || isNaN(steps) || +steps < 0) return;
    const newEntry = {
      date: new Date().toLocaleDateString(),
      steps: +steps,
    };
    setStepHistory([newEntry, ...stepHistory]);
    setSteps("");
  };

  const addSleep = (e) => {
    e.preventDefault();
    if (!sleepHours || isNaN(sleepHours) || +sleepHours < 0) return;
    const newEntry = {
      date: new Date().toLocaleDateString(),
      hours: +sleepHours,
    };
    setSleepHistory([newEntry, ...sleepHistory]);
    setSleepHours("");
  };

  if (summaryOnly) {
    return (
      <div className="insights-summary">
        <h4>Mood Summary</h4>
        <p>{moodSummary()}</p>
        <h4>Relationship Check-ins</h4>
        <p>{relationshipCheckins.length} recorded</p>
        <h4>Average Steps</h4>
        <p>{averageSteps()} per day</p>
        <h4>Average Sleep</h4>
        <p>{averageSleep()} hours</p>
      </div>
    );
  }

  return (
    <div className="main-content">
      <h2>Insights & Analytics</h2>

      <section className="insight-section">
        <h3>Mood Summary</h3>
        <p>{moodSummary()}</p>
      </section>

      <section className="insight-section">
        <h3>Relationship Check-ins</h3>
        <p>Total check-ins recorded: {relationshipCheckins.length}</p>
      </section>

      <section className="input-section">
        <h3>Step Count Tracker</h3>
        <form onSubmit={addSteps}>
          <input
            type="number"
            placeholder="Enter steps today"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            min="0"
          />
          <button type="submit">Add Steps</button>
        </form>
        <p>Average daily steps: {averageSteps()}</p>
      </section>

      <section className="input-section">
        <h3>Sleep Tracker</h3>
        <form onSubmit={addSleep}>
          <input
            type="number"
            step="0.1"
            placeholder="Enter hours slept"
            value={sleepHours}
            onChange={(e) => setSleepHours(e.target.value)}
            min="0"
          />
          <button type="submit">Add Sleep</button>
        </form>
        <p>Average hours slept: {averageSleep()}</p>
      </section>
    </div>
  );
}

export default Insights;
