import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

// --- ДАНІ ---
const initialArticles = [
  { id: 1, title: 'Озера Карпат: ранкове сяйво', date: '2026-02-10', text: 'Короткий опис статті про неймовірні сходи сонця над озером у горах.', photo: 'https://images.unsplash.com/photo-1746345883879-75ebff21a3d4?w=600' },
  { id: 2, title: 'Прогулянка старим містом', date: '2026-01-28', text: 'Розповідь про вузькі вулички, кав\'ярні та несподівані відкриття.', photo: 'https://images.unsplash.com/photo-1700740395620-747d65203698?w=600' },
  { id: 3, title: 'Ніч під зорями: кемпінг', date: '2025-12-05', text: 'Що взяти з собою, як вибрати локацію та зробити ночівлю комфортною.', photo: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNhbXBpbmd8ZW58MHx8MHx8fDA%3D' }
];

// --- КОМПОНЕНТИ ---

// 1. Картка статті з коментарями
function ArticleCard({ article }) {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [liked, setLiked] = useState(false);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (name.trim() && text.trim()) {
      setComments([...comments, { name, text }]);
      setName('');
      setText('');
    }
  };

  return (
      <article className={`card ${liked ? 'liked' : ''}`}>
        <img src={article.photo} alt={article.title} />
        <div className="card-body">
          <h3>{article.title}</h3>
          <p>{article.text}</p>
          <div className="article-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '15px 0' }}>
            <time>{article.date}</time>
            <button
                className="btn like-btn"
                style={{ background: liked ? '#0284c7' : '#0ea5e9', color: 'white' }}
                onClick={() => setLiked(!liked)}
            >
              {liked ? 'Вподобано' : 'Подобається'}
            </button>
          </div>

          <div className="comments-block">
            <form onSubmit={handleAddComment} className="comment-form">
              <input type="text" placeholder="Ваше ім'я" value={name} onChange={(e) => setName(e.target.value)} />
              <textarea placeholder="Ваш коментар" rows="2" value={text} onChange={(e) => setText(e.target.value)}></textarea>
              <button type="submit" className="btn comment-submit" style={{ background: '#06b6d4', color: 'white' }}>Відправити</button>
            </form>
            <ul className="comments-list">
              {comments.map((c, index) => (
                  <li key={index} className="comment-item">
                    <strong>{c.name}</strong><p>{c.text}</p>
                  </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
  );
}

// 2. СТОРІНКА: Статті (Головна)
function ArticlesPage() {
  const [articles, setArticles] = useState(initialArticles);
  const [sortOrder, setSortOrder] = useState('desc');

  const toggleSort = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);

    const sorted = [...articles].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return newOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
    setArticles(sorted);
  };

  return (
      <section className="container section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Статті</h2>
          <button className="btn" style={{ background: '#0ea5e9', color: 'white' }} onClick={toggleSort}>
            Сортувати: {sortOrder === 'desc' ? 'Спочатку старіші' : 'Спочатку новіші'}
          </button>
        </div>
        <div className="articles-grid">
          {articles.map(article => <ArticleCard key={article.id} article={article} />)}
        </div>
      </section>
  );
}

// 3. СТОРІНКА: Публікація
function PublicationPage() {
  return (
      <section className="container section">
        <h2>Публікація</h2>
        <article className="full-post">
          <h3>Велика стаття: Подорож на край світу</h3>
          <div className="meta">Автор: Олена П. — <time dateTime="2026-02-12">12 лютого 2026</time></div>
          <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200" alt="Пейзаж" style={{ width: '100%', borderRadius: '12px', marginTop: '15px' }} />
          <div className="post-content" style={{ marginTop: '15px' }}>
            <p>Ця стаття — розповідь про подорож, яка змінила спосіб бачити світ. Ми вирушаємо вранці, коли ще прохолодно, і повертаємось під зорями.</p>
            <p>По дорозі ми зустрічали місцевих, куштували страви регіону та дізнавались історії про старі традиції. Така подорож — це можливість відключитися від рутини та зануритися в атмосферу місця.</p>
            <p>Наприкінці — поради, які допоможуть вам спланувати власну подорож і зберегти спогади.</p>
          </div>
        </article>
      </section>
  );
}

// 4. СТОРІНКА: Мої публікації
function MyPostsPage() {
  return (
      <section className="container section">
        <h2>Мої публікації</h2>
        <aside className="author-panel" style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
          <div className="author-info" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <img className="avatar" src="https://images.unsplash.com/photo-1514543250559-83867827ecce?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGNvZGVyfGVufDB8fDB8fHww" alt="Аватар" style={{ borderRadius: '50%', width: '80px', height: '80px', objectFit: 'cover' }} />
            <div>
              <h4>Іван І.</h4>
              <p>Автор блогів про активні подорожі та кемпінг.</p>
            </div>
          </div>

          <ul className="post-list" style={{ listStyle: 'none', padding: 0 }}>
            {['Гірські вершини: перші кроки', 'Таємниці старого міста', 'Похід на вихідних'].map((title, i) => (
                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                  <span className="post-title" style={{ fontWeight: 'bold' }}>{title}</span>
                  <div className="post-actions" style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn edit" style={{ background: '#06b6d4', color: 'white' }}>Редагувати</button>
                    <button className="btn delete" style={{ background: '#ef4444', color: 'white' }}>Видалити</button>
                  </div>
                </li>
            ))}
          </ul>
        </aside>
      </section>
  );
}

// --- ГОЛОВНИЙ APP (РОУТИНГ) ---
function App() {
  return (
      <>
        {/* ХЕДЕР */}
        <header className="site-header">
          <div className="container header-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0' }}>
            <div className="logo">
              <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', textDecoration: 'none', color: '#0f172a' }}>Блог про подорожі</Link>
            </div>
            <nav className="main-nav" style={{ display: 'flex', gap: '20px' }}>
              <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>Статті</Link>
              <Link to="/publication" style={{ textDecoration: 'none', color: '#333' }}>Публікація</Link>
              <Link to="/my-posts" style={{ textDecoration: 'none', color: '#333' }}>Мої публікації</Link>
            </nav>
          </div>
        </header>

        {/* ОСНОВНИЙ КОНТЕНТ */}
        <main>
          <Routes>
            <Route path="/" element={<ArticlesPage />} />
            <Route path="/publication" element={<PublicationPage />} />
            <Route path="/my-posts" element={<MyPostsPage />} />
          </Routes>
        </main>

        {/* ФУТЕР */}
        <footer className="site-footer" style={{ background: '#0f172a', color: 'white', padding: '20px 0', marginTop: '40px' }}>
          <div className="container footer-inner" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>Контакти: travelblog@example.com | +380 67 123 4567</div>
            <div>© 2026 Блог для подорожей</div>
          </div>
        </footer>
      </>
  );
}

export default App;