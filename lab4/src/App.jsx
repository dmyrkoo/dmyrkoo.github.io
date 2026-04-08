import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import AuthModal from './components/AuthModal';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
  deleteArticle,
  getArticleById,
  getArticles,
  getMyArticles,
  seedDatabase,
  updateArticle,
  updateLikes,
} from './services/articlesService';
import { addComment, getComments } from './services/commentsService';

function formatDate(dateValue) {
  if (!dateValue) {
    return 'Без дати';
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return 'Без дати';
  }

  return date.toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function ArticleCard({ article, isAuthenticated, onOpenAuthModal, currentUser, onArticleLike }) {
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [text, setText] = useState('');
  const [liked, setLiked] = useState(false);
  const [isLikePending, setIsLikePending] = useState(false);
  const [isCommentPending, setIsCommentPending] = useState(false);
  const [commentError, setCommentError] = useState('');

  const userName = currentUser?.email || '';

  const loadComments = useCallback(async () => {
    setIsLoadingComments(true);
    const data = await getComments(article.id);
    setComments(data);
    setIsLoadingComments(false);
  }, [article.id]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      onOpenAuthModal();
      return;
    }

    if (liked || isLikePending) {
      return;
    }

    setIsLikePending(true);
    const updatedLikes = await updateLikes(article.id);
    setIsLikePending(false);

    if (updatedLikes !== null) {
      setLiked(true);
      onArticleLike(article.id, updatedLikes);
    }
  };

  const handleAddComment = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      onOpenAuthModal();
      return;
    }

    if (!text.trim()) {
      setCommentError('Введіть текст коментаря.');
      return;
    }

    setCommentError('');
    setIsCommentPending(true);

    const result = await addComment({
      articleId: article.id,
      userName,
      text,
      userId: currentUser.uid,
    });

    setIsCommentPending(false);

    if (!result.ok) {
      setCommentError('Не вдалося додати коментар. Спробуйте ще раз.');
      return;
    }

    setText('');
    loadComments();
  };

  return (
    <article className={`card ${liked ? 'liked' : ''}`}>
      <img src={article.imageUrl} alt={article.title} />
      <div className="card-body">
        <h3>{article.title}</h3>
        <p>{article.description}</p>
        <div className="article-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '15px 0' }}>
          <time>{formatDate(article.date)}</time>
          <button
            type="button"
            className="btn like-btn"
            style={{ background: liked ? '#0284c7' : '#0ea5e9', color: 'white' }}
            onClick={handleToggleLike}
            disabled={isLikePending}
          >
            {liked ? 'Вподобано' : 'Подобається'} ({article.likes || 0})
          </button>
        </div>

        {!isAuthenticated && <p className="auth-hint-inline">Увійдіть, щоб залишити коментар / вподобати.</p>}

        <div className="comments-block">
          <form onSubmit={handleAddComment} className="comment-form">
            <input type="text" value={userName} readOnly placeholder="Ваш email" disabled={!isAuthenticated} />
            <textarea
              placeholder="Ваш коментар"
              rows="2"
              value={text}
              onChange={(event) => setText(event.target.value)}
              disabled={!isAuthenticated || isCommentPending}
            />
            {commentError && <p className="form-error">{commentError}</p>}
            <button
              type="submit"
              className="btn comment-submit"
              style={{ background: '#06b6d4', color: 'white' }}
              disabled={!isAuthenticated || isCommentPending}
            >
              {isCommentPending ? 'Зберігаю...' : 'Відправити'}
            </button>
          </form>

          {isLoadingComments ? (
            <p className="loading-text">Завантаження коментарів...</p>
          ) : (
            <ul className="comments-list">
              {comments.map((comment) => (
                <li key={comment.id} className="comment-item">
                  <strong>{comment.userName}</strong>
                  <p>{comment.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}

function ArticlesPage({ onOpenAuthModal }) {
  const [articles, setArticles] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const { user } = useAuth();

  const isAuthenticated = Boolean(user);

  const loadArticles = async () => {
    setIsLoading(true);
    const data = await getArticles();
    setArticles(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const toggleSort = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);

    const sorted = [...articles].sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return newOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    setArticles(sorted);
  };

  const handleLikeUpdate = (articleId, likesCount) => {
    setArticles((prev) =>
      prev.map((item) => (item.id === articleId ? { ...item, likes: likesCount } : item))
    );
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    await seedDatabase();
    setIsSeeding(false);
    loadArticles();
  };

  return (
    <section className="container section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Статті</h2>
        <button className="btn" style={{ background: '#0ea5e9', color: 'white' }} onClick={toggleSort}>
          Сортувати: {sortOrder === 'desc' ? 'Спочатку старіші' : 'Спочатку новіші'}
        </button>
      </div>

      {isLoading ? (
        <p className="loading-text">Завантаження...</p>
      ) : articles.length === 0 ? (
        <div className="empty-state">
          <p>Статті не знайдено в Firestore.</p>
          <button type="button" className="btn" style={{ background: '#06b6d4', color: 'white' }} onClick={handleSeed} disabled={isSeeding}>
            {isSeeding ? 'Додаю статті...' : 'Заповнити базу тестовими статтями'}
          </button>
        </div>
      ) : (
        <div className="articles-grid">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isAuthenticated={isAuthenticated}
              onOpenAuthModal={onOpenAuthModal}
              currentUser={user}
              onArticleLike={handleLikeUpdate}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function PublicationPage() {
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPublication = async () => {
      setIsLoading(true);
      const allArticles = (await getArticles()) || [];
      const targetArticle =
        allArticles.find((item) => item.title === 'Велика стаття: Подорож на край світу') ||
        allArticles[0] ||
        null;

      if (targetArticle) {
        const articleDetails = await getArticleById(targetArticle.id);
        setArticle(articleDetails);
      } else {
        setArticle(null);
      }

      setIsLoading(false);
    };

    loadPublication();
  }, []);

  return (
    <section className="container section">
      <h2>Публікація</h2>
      {isLoading ? (
        <p className="loading-text">Завантаження...</p>
      ) : !article ? (
        <p>Публікацію не знайдено.</p>
      ) : (
        <article className="full-post">
          <h3>{article.title}</h3>
          <div className="meta">
            Автор: {article.author || 'Невідомо'} -{' '}
            <time>{formatDate(article.date)}</time>
          </div>
          <img
            src={article.imageUrl}
            alt={article.title}
            style={{ width: '100%', borderRadius: '12px', marginTop: '15px' }}
          />
          <div className="post-content" style={{ marginTop: '15px' }}>
            <p>{article.content || article.description}</p>
          </div>
        </article>
      )}
    </section>
  );
}

function MyPostsPage({ onOpenAuthModal }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const loadMyPosts = useCallback(async () => {
    if (!user) {
      return;
    }

    setIsLoading(true);
    const data = await getMyArticles(user.uid);
    setPosts(data);
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    loadMyPosts();
  }, [loadMyPosts]);

  if (!user) {
    return (
      <section className="container section">
        <h2>Мої публікації</h2>
        <div className="auth-required-card">
          <p>Увійдіть, щоб переглянути свої публікації.</p>
          <button type="button" className="btn" style={{ background: '#0ea5e9', color: 'white' }} onClick={onOpenAuthModal}>
            Увійти
          </button>
        </div>
      </section>
    );
  }

  const displayName = user.email || 'Автор';

  const startEdit = (post) => {
    setEditingPostId(post.id);
    setEditTitle(post.title || '');
    setEditDescription(post.description || '');
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const saveEdit = async (postId) => {
    if (!editTitle.trim() || !editDescription.trim()) {
      return;
    }

    const result = await updateArticle(postId, {
      title: editTitle.trim(),
      description: editDescription.trim(),
    });

    if (!result.ok) {
      return;
    }

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, title: editTitle.trim(), description: editDescription.trim() }
          : post
      )
    );
    cancelEdit();
  };

  const handleDelete = async (postId) => {
    const result = await deleteArticle(postId);
    if (!result.ok) {
      return;
    }

    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  return (
    <section className="container section">
      <h2>Мої публікації</h2>
      <aside className="author-panel" style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
        <div className="author-info" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
          <img
            className="avatar"
            src="https://images.unsplash.com/photo-1514543250559-83867827ecce?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGNvZGVyfGVufDB8fDB8fHww"
            alt="Аватар"
            style={{ borderRadius: '50%', width: '80px', height: '80px', objectFit: 'cover' }}
          />
          <div>
            <h4>{displayName}</h4>
            <p>Автор блогів про активні подорожі та кемпінг.</p>
          </div>
        </div>

        {isLoading ? (
          <p className="loading-text">Завантаження...</p>
        ) : posts.length === 0 ? (
          <p>У вас поки немає публікацій у Firestore.</p>
        ) : (
          <ul className="post-list" style={{ listStyle: 'none', padding: 0 }}>
            {posts.map((post) => (
              <li
                key={post.id}
                style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}
              >
                <div className="post-content-inline">
                  <span className="post-title" style={{ fontWeight: 'bold' }}>
                    {post.title}
                  </span>
                  <p className="post-description">{post.description}</p>
                  {editingPostId === post.id && (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(event) => setEditTitle(event.target.value)}
                      />
                      <textarea
                        rows="2"
                        value={editDescription}
                        onChange={(event) => setEditDescription(event.target.value)}
                      />
                      <div className="edit-actions">
                        <button type="button" className="btn" style={{ background: '#06b6d4', color: 'white' }} onClick={() => saveEdit(post.id)}>
                          Зберегти
                        </button>
                        <button type="button" className="btn" style={{ background: '#94a3b8', color: 'white' }} onClick={cancelEdit}>
                          Скасувати
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="post-actions" style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn edit"
                    style={{ background: '#06b6d4', color: 'white' }}
                    onClick={() => startEdit(post)}
                  >
                    Редагувати
                  </button>
                  <button
                    type="button"
                    className="btn delete"
                    style={{ background: '#ef4444', color: 'white' }}
                    onClick={() => handleDelete(post.id)}
                  >
                    Видалити
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </section>
  );
}

function AppShell() {
  const { loading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const authModalHandlers = useMemo(
    () => ({
      open: () => setIsAuthModalOpen(true),
      close: () => setIsAuthModalOpen(false),
    }),
    []
  );

  if (loading) {
    return (
      <main className="container section">
        <p>Завантаження авторизації...</p>
      </main>
    );
  }

  return (
    <>
      <Navbar onOpenAuthModal={authModalHandlers.open} />

      <main>
        <Routes>
          <Route path="/" element={<ArticlesPage onOpenAuthModal={authModalHandlers.open} />} />
          <Route path="/publication" element={<PublicationPage />} />
          <Route path="/my-posts" element={<MyPostsPage onOpenAuthModal={authModalHandlers.open} />} />
        </Routes>
      </main>

      <footer className="site-footer" style={{ background: '#0f172a', color: 'white', padding: '20px 0', marginTop: '40px' }}>
        <div className="container footer-inner" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>Контакти: travelblog@example.com | +380 67 123 4567</div>
          <div>© 2026 Блог для подорожей</div>
        </div>
      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={authModalHandlers.close} />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;

