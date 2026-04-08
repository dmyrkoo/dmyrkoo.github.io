import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

function ArticleCard({ article, comments, onAddComment }) {
  return (
    <article className="article-card">
      <img className="article-photo" src={article.photo} alt={article.title} />

      <div className="article-content">
        <h2>{article.title}</h2>
        <p className="article-date">{new Date(article.date).toLocaleDateString("uk-UA")}</p>
        <p>{article.text}</p>

        <CommentForm onSubmit={(commentData) => onAddComment(article.id, commentData)} />
        <CommentList comments={comments} />
      </div>
    </article>
  );
}

export default ArticleCard;

