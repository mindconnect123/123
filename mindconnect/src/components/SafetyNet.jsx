import React, { useState, useEffect } from "react";
import "./SafetyNet.css";

function SafetyNet({ summaryOnly }) {
  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem("trustedContacts");
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    localStorage.setItem("trustedContacts", JSON.stringify(contacts));
  }, [contacts]);

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!name.trim() || (!email.trim() && !phone.trim())) return;

    const newContact = { id: Date.now(), name, email, phone };
    setContacts([...contacts, newContact]);
    setName("");
    setEmail("");
    setPhone("");
  };

  const handleRemoveContact = (id) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  if (summaryOnly) {
    // Render concise list or count of trusted contacts
    return (
      <div className="safetynet-summary">
        <h4>Trusted Contacts</h4>
        {contacts.length === 0 ? (
          <p>No trusted contacts registered yet.</p>
        ) : (
          <ul>
            {contacts.slice(0, 3).map(({ id, name, email, phone }) => (
              <li key={id}>
                <strong>{name}</strong> {email && `- ${email}`} {phone && `- ${phone}`}
              </li>
            ))}
            {contacts.length > 3 && <li>...and {contacts.length - 3} more</li>}
          </ul>
        )}
      </div>
    );
  }

  // Full UI for adding and managing contacts
  return (
    <div className="main-content">
      <h2>Social Safety Net</h2>
      <p>
        Register trusted contacts who will be notified if you experience prolonged low moods or stop logging moods.
      </p>
      <form className="contact-form" onSubmit={handleAddContact}>
        <label>
          Name (required):
          <input value={name} onChange={e => setName(e.target.value)} required />
        </label>
        <label>
          Email (optional):
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" />
        </label>
        <label>
          Phone (optional):
          <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" />
        </label>
        <button type="submit">Add Contact</button>
      </form>

      <h3>Trusted Contacts</h3>
      <ul className="contacts-list">
        {contacts.length === 0 && <li>No trusted contacts registered yet.</li>}
        {contacts.map(({ id, name, email, phone }) => (
          <li key={id}>
            <strong>{name}</strong> {email && `- ${email}`} {phone && `- ${phone}`}
            <button onClick={() => handleRemoveContact(id)} className="remove-btn">Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SafetyNet;
