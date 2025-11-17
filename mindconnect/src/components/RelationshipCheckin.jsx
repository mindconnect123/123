import React, { useState, useEffect } from "react";
import "./RelationshipCheckin.css";

const RELATIONSHIP_TYPES = [
  "partner",
  "parents",
  "friends",
  "workplace",
  "neighbours"
];

const RATINGS = [
  { label: "Very Bad", emoji: "😞", value: "verybad" },
  { label: "Bad", emoji: "😕", value: "bad" },
  { label: "Average", emoji: "😐", value: "avg" },
  { label: "Good", emoji: "🙂", value: "good" },
  { label: "Very Good", emoji: "😊", value: "verygood" }
];

function RelationshipCheckin({ summaryOnly }) {
  const [checkins, setCheckins] = useState(() => {
    const saved = localStorage.getItem("relationshipCheckins");
    return saved ? JSON.parse(saved) : [];
  });

  const [ratings, setRatings] = useState(() =>
    RELATIONSHIP_TYPES.reduce((acc, type) => {
      acc[type] = { rating: "", note: "" };
      return acc;
    }, {})
  );

  const handleRatingChange = (type, value) => {
    setRatings(prev => ({
      ...prev,
      [type]: { ...prev[type], rating: value }
    }));
  };

  const handleNoteChange = (type, value) => {
    setRatings(prev => ({
      ...prev,
      [type]: { ...prev[type], note: value }
    }));
  };

  const hasAtLeastOneRating = () => {
    return RELATIONSHIP_TYPES.some(type => ratings[type].rating !== "");
  };

  // Defensive migration function for old checkin format
  const renderCheckinDetails = (checkin, idx) => {
    // Old format (single type/note)
    if (checkin.type && checkin.note !== undefined) {
      return (
        <li key={idx}>
          <b>{checkin.type}:</b> {checkin.note && <em>{checkin.note}</em>}
        </li>
      );
    }
    // New format (ratings object per type)
    return (
      <ul>
        {RELATIONSHIP_TYPES.map(type => {
          const entry = checkin.ratings && checkin.ratings[type];
          if (!entry || !entry.rating) return null;
          const ratingObj = RATINGS.find(r => r.value === entry.rating);
          return (
            <li key={type}>
              <b>{type}:</b> {ratingObj ? ratingObj.emoji : ""} {ratingObj ? ratingObj.label : entry.rating}
              {entry.note && <> - <em>{entry.note}</em></>}
            </li>
          );
        })}
      </ul>
    );
  };

  useEffect(() => {
    localStorage.setItem("relationshipCheckins", JSON.stringify(checkins));
  }, [checkins]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasAtLeastOneRating()) return;

    const newCheckin = {
      date: new Date().toLocaleDateString(),
      ratings: { ...ratings }
    };

    setCheckins([newCheckin, ...checkins]);

    setRatings(
      RELATIONSHIP_TYPES.reduce((acc, type) => {
        acc[type] = { rating: "", note: "" };
        return acc;
      }, {})
    );
  };

  if (summaryOnly) {
    const recent = checkins.slice(0, 3);
    return (
      <div className="relationship-summary">
        <h4>Recent Relationship Check-ins</h4>
        {recent.length === 0 ? (
          <p>No check-ins yet.</p>
        ) : (
          recent.map((checkin, idx) => (
            <div key={idx} className="checkin-summary">
              <strong>{checkin.date}</strong>
              {renderCheckinDetails(checkin, idx)}
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="main-content">
      <h2>Relationship Check-in</h2>
      <form className="checkin-form" onSubmit={handleSubmit}>
        {RELATIONSHIP_TYPES.map(type => (
          <div key={type} className="relationship-type-section">
            <h4>{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
            <div className="rating-options">
              {RATINGS.map(({ label, emoji, value }) => (
                <label key={value} className="rating-label">
                  <input
                    type="radio"
                    name={`rating-${type}`}
                    value={value}
                    checked={ratings[type].rating === value}
                    onChange={() => handleRatingChange(type, value)}
                  />
                  <span title={label} aria-label={label}>
                    {emoji}
                  </span>
                </label>
              ))}
            </div>
            <textarea
              placeholder={`Notes about your ${type} interactions (optional)`}
              value={ratings[type].note}
              onChange={(e) => handleNoteChange(type, e.target.value)}
            />
          </div>
        ))}
        <button type="submit" disabled={!hasAtLeastOneRating()}>
          Add Check-in
        </button>
      </form>

      <h3>Past Check-ins</h3>
      <ul className="checkin-history">
        {checkins.length === 0 && <li>No check-ins yet.</li>}
        {checkins.map((checkin, idx) => (
          <li key={idx} className="past-checkin">
            <strong>{checkin.date}</strong>
            {renderCheckinDetails(checkin, idx)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RelationshipCheckin;
