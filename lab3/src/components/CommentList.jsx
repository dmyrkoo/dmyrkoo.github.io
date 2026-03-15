function CommentList({ comments }) {
  if (!comments.length) {
    return <p className="comment-empty">Поки що коментарів немає.</p>;
  }

  return (
    <ul className="comment-list">
      {comments.map((comment) => (
        <li className="comment-item" key={comment.id}>
          <strong>{comment.name}</strong>
          <p>{comment.text}</p>
        </li>
      ))}
    </ul>
  );
}

export default CommentList;

