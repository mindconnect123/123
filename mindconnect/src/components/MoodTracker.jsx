import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MoodTracker.css";

const MOODS = [
  { label: "😊 Happy", value: "happy" },
  { label: "😔 Sad", value: "sad" },
  { label: "😡 Angry", value: "angry" },
  { label: "😰 Anxious", value: "anxious" },
  { label: "😴 Tired", value: "tired" },
  { label: "😃 Excited", value: "excited" }
];

const DIET_TYPES = [
  "Protein", "Carbs", "Fats", "Vegetables", "Fruits", "Junk"
];

const CRITICAL_EVENTS = [
  "None", "Trauma", "Memory Lapse", "Accident"
];

function MoodTracker({ summaryOnly }) {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("mindconnectEntries");
    return saved ? JSON.parse(saved) : [];
  });

  const [mood, setMood] = useState("");
  const [diet, setDiet] = useState([]);
  const [medTaken, setMedTaken] = useState(false);
  const [medications, setMedications] = useState([{ name: "", time: "" }]);
  const [routine, setRoutine] = useState("");
  const [water, setWater] = useState("");
  const [sleep, setSleep] = useState("");
  const [steps, setSteps] = useState("");
  const [criticalEvent, setCriticalEvent] = useState("");
  const [note, setNote] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("mindconnectEntries", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    if (criticalEvent && criticalEvent !== "None") {
      navigate("/resources");
    }
  }, [criticalEvent, navigate]);

  const handleMoodClick = (label) => setMood(label);
  const handleDietChange = (type) =>
    setDiet((curr) =>
      curr.includes(type) ? curr.filter((item) => item !== type) : [...curr, type]
    );

  const handleMedicationChange = (idx, field, value) => {
    setMedications((meds) =>
      meds.map((med, i) => (i === idx ? { ...med, [field]: value } : med))
    );
  };

  const addMedicationField = () =>
    setMedications((meds) => [...meds, { name: "", time: "" }]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mood) return;
    const newEntry = {
      date: new Date().toLocaleDateString(),
      mood,
      diet,
      medTaken,
      medications,
      routine,
      water: water ? Number(water) : 0,
      sleep: sleep ? Number(sleep) : 0,
      steps: steps ? Number(steps) : 0,
      criticalEvent,
      note,
    };
    setEntries([newEntry, ...entries]);
    setMood("");
    setDiet([]);
    setMedTaken(false);
    setMedications([{ name: "", time: "" }]);
    setRoutine("");
    setWater("");
    setSleep("");
    setSteps("");
    setCriticalEvent("");
    setNote("");
  };

  // Calculates total and average for a numeric field in entries
  const totalForField = (field) => {
    if (entries.length === 0) return 0;
    return entries.reduce((sum, entry) => sum + (Number(entry[field]) || 0), 0);
  };

  const averageForField = (field) => {
    if (entries.length === 0) return 0;
    return (totalForField(field) / entries.length).toFixed(field === "sleep" ? 1 : 0);
  };

  // Safely print field
  const printable = (field) =>
    Array.isArray(field) ? field.join(", ") : field || "N/A";

  if (summaryOnly) {
    const recent = entries.slice(0, 3);
    return (
      <div className="mood-summary">
        <h4>Recent Logs</h4>
        <ul>
          {recent.map((entry, idx) => (
            <li key={idx}>
              <strong>{entry.date}</strong>
              {" - Mood: "}
              {entry.mood}
              {", Diet: "}
              {printable(entry.diet)}
              {", Medications: "}
              {Array.isArray(entry.medications)
                ? entry.medications.map((m, i) =>
                    m.name ? (
                      <span key={i}>
                        {m.name} {m.time && `(reminder: ${m.time})`}{" "}
                      </span>
                    ) : null
                  )
                : "None"}
              {", Water: "}
              {entry.water || "N/A"} glasses, Sleep: {entry.sleep || "N/A"} hr, Steps:{" "}
              {entry.steps || "N/A"}
              {", Event: "}
              {entry.criticalEvent || "None"}
              {entry.note && (
                <>
                  {" "}
                  (<em>{entry.note}</em>)
                </>
              )}
            </li>
          ))}
        </ul>

        {/* Summary totals and averages */}
        <h4>Summary</h4>
        <p>Total Water Consumed: {totalForField("water")} glasses</p>
        <p>Average Water Intake: {averageForField("water")} glasses</p>
        <p>Total Sleep: {totalForField("sleep").toFixed(1)} hours</p>
        <p>Average Sleep: {averageForField("sleep")} hours</p>
        <p>Total Steps: {totalForField("steps")} steps</p>
        <p>Average Steps: {averageForField("steps")} steps</p>
      </div>
    );
  }

  return (
    <div className="main-content">
      <h2>Log Your Day</h2>
      <form className="mood-form" onSubmit={handleSubmit}>
        <label>Mood:</label>
        <div className="emoji-grid">
          {MOODS.map(({ label }) => (
            <button
              type="button"
              key={label}
              className={`emoji-btn${mood === label ? " active" : ""}`}
              onClick={() => handleMoodClick(label)}
            >
              {label}
            </button>
          ))}
        </div>

        <label>Diet:</label>
        <div className="checkbox-row">
          {DIET_TYPES.map((type) => (
            <label key={type} className="checkbox-label">
              <input
                type="checkbox"
                checked={diet.includes(type)}
                onChange={() => handleDietChange(type)}
              />{" "}
              {type}
            </label>
          ))}
        </div>

        <label>
          Medication taken today?
          <input
            type="checkbox"
            checked={medTaken}
            onChange={(e) => setMedTaken(e.target.checked)}
          />
        </label>
        {medTaken && (
          <>
            <label>
              Enter tablet name(s) and reminder time:
              {medications.map((med, idx) => (
                <div key={idx} className="med-row">
                  <input
                    type="text"
                    placeholder="Tablet name"
                    value={med.name}
                    onChange={(e) =>
                      handleMedicationChange(idx, "name", e.target.value)
                    }
                    style={{ marginRight: "10px", width: "45%" }}
                  />
                  <input
                    type="time"
                    value={med.time}
                    onChange={(e) =>
                      handleMedicationChange(idx, "time", e.target.value)
                    }
                    style={{ width: "35%" }}
                  />
                </div>
              ))}
              <button
                type="button"
                style={{ marginTop: "8px", background: "#e7f8f2" }}
                onClick={addMedicationField}
              >
                Add another tablet
              </button>
            </label>
          </>
        )}

        <label>
          Routine & Habits:
          <input
            type="text"
            value={routine}
            placeholder="Activities, walk, yoga, meditation, etc."
            onChange={(e) => setRoutine(e.target.value)}
          />
        </label>
        <label>
          Water intake (glasses):
          <input
            type="number"
            value={water}
            min="0"
            onChange={(e) => setWater(e.target.value)}
          />
        </label>
        <label>
          Hours slept:
          <input
            type="number"
            step="0.1"
            value={sleep}
            min="0"
            onChange={(e) => setSleep(e.target.value)}
          />
        </label>
        <label>
          Step counter:
          <input
            type="number"
            value={steps}
            min="0"
            onChange={(e) => setSteps(e.target.value)}
          />
        </label>
        <label>
          Critical event today:
          <select value={criticalEvent} onChange={(e) => setCriticalEvent(e.target.value)}>
            {CRITICAL_EVENTS.map((ev) => (
              <option key={ev} value={ev}>
                {ev}
              </option>
            ))}
          </select>
        </label>
        <label>
          Note (optional):
          <input
            type="text"
            value={note}
            placeholder="Additional comments"
            onChange={(e) => setNote(e.target.value)}
          />
        </label>
        <button type="submit">Add Entry</button>
      </form>

      <h3>All Logs</h3>
      <ul className="mood-history">
        {entries.length === 0 && <li>No entries yet.</li>}
        {entries.map((entry, idx) => (
          <li key={idx}>
            <strong>{entry.date}</strong> - Mood: {entry.mood}, Diet: {printable(entry.diet)}, Medications:{" "}
            {Array.isArray(entry.medications)
              ? entry.medications.map((m, i) =>
                  m.name ? (
                    <span key={i}>
                      {m.name} {m.time && `(reminder: ${m.time})`}{" "}
                    </span>
                  ) : null
                )
              : "None"}
            , Water: {entry.water || "N/A"} glasses, Sleep: {entry.sleep || "N/A"} hr, Steps: {entry.steps || "N/A"}, Event:{" "}
            {entry.criticalEvent || "None"}
            {entry.note && <> <em>{entry.note}</em></>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MoodTracker;
