import { useEffect, useState } from "react";
import ArticleCard from "../components/ArticleCard";

const initialArticles = [
  {
    id: 1,
    title: "Озера Карпат",
    date: "2026-02-10",
    text: "Опис...",
    photo: "https://images.unsplash.com/photo-1746345883879-75ebff21a3d4?w=600",
  },
  {
    id: 2,
    title: "Прогулянка старим містом",
    date: "2026-01-28",
    text: "Опис...",
    photo: "https://images.unsplash.com/photo-1700740395620-747d65203698?w=600",
  },
  {
    id: 3,
    title: "Ніч під зорями: кемпінг",
    date: "2025-12-05",
    text: "Що взяти з собою та як зробити ночівлю комфортною.",
    photo: "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?w=600",
  },
  {
    id: 4,
    title: "Вихідні біля моря",
    date: "2025-09-19",
    text: "Невеликий маршрут узбережжям з найкращими точками для фото.",
    photo: "https://images.unsplash.com/photo-1498623116890-37e912163d5d?w=600",
  },
];

function HomePage() {
  const [articles, setArticles] = useState(initialArticles);
  const [sortOrder, setSortOrder] = useState("newest");
  const [commentsByArticle, setCommentsByArticle] = useState({});

  useEffect(() => {
    setArticles((prevArticles) => {
      return [...prevArticles].sort((a, b) => {
        const aTime = new Date(a.date).getTime();
        const bTime = new Date(b.date).getTime();

        return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
      });
    });
  }, [sortOrder]);

  function toggleSortOrder() {
    setSortOrder((prevOrder) => (prevOrder === "newest" ? "oldest" : "newest"));
  }

  function handleAddComment(articleId, commentData) {
    setCommentsByArticle((prev) => {
      const existingComments = prev[articleId] || [];

      return {
        ...prev,
        [articleId]: [...existingComments, commentData],
      };
    });
  }

  return (
    <section className="page">
      <div className="page-header">
        <h1>Блог для подорожей</h1>
        <button className="btn" type="button" onClick={toggleSortOrder}>
          Сортувати: {sortOrder === "newest" ? "від новіших" : "від старіших"}
        </button>
      </div>

      <div className="articles-grid">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            comments={commentsByArticle[article.id] || []}
            onAddComment={handleAddComment}
          />
        ))}
      </div>
    </section>
  );
}

export default HomePage;

