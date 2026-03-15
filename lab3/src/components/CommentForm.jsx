import { useState } from "react";

function CommentForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedText = text.trim();

    if (!trimmedName || !trimmedText) {
      setError("Заповніть ім'я та текст коментаря.");
      return;
    }

    onSubmit({
      id: Date.now(),
      name: trimmedName,
      text: trimmedText,
    });

    setName("");
    setText("");
    setError("");
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <input
        className="comment-input"
        type="text"
        placeholder="Ваше ім'я"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <textarea
        className="comment-textarea"
        placeholder="Ваш коментар"
        rows={3}
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <button className="btn" type="submit">
        Додати коментар
      </button>
      {error && <p className="comment-error">{error}</p>}
    </form>
  );
}

export default CommentForm;

