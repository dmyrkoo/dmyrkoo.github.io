import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';

const articlesCollectionRef = collection(db, 'articles');

function mapArticleSnapshot(snapshot) {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    title: data.title || '',
    description: data.description || '',
    content: data.content || '',
    imageUrl: data.imageUrl || '',
    author: data.author || '',
    likes: typeof data.likes === 'number' ? data.likes : 0,
    date: data.date?.toDate ? data.date.toDate() : null,
  };
}

export async function getArticles() {
  try {
    const q = query(articlesCollectionRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapArticleSnapshot);
  } catch (error) {
    return [];
  }
}

export async function getArticleById(articleId) {
  try {
    const articleDoc = await getDoc(doc(db, 'articles', articleId));
    if (!articleDoc.exists()) {
      return null;
    }

    return mapArticleSnapshot(articleDoc);
  } catch (error) {
    return null;
  }
}

export async function updateLikes(articleId) {
  try {
    const articleRef = doc(db, 'articles', articleId);
    await updateDoc(articleRef, { likes: increment(1) });
    const updated = await getDoc(articleRef);
    return updated.data()?.likes ?? null;
  } catch (error) {
    return null;
  }
}

export async function deleteArticle(articleId) {
  try {
    await deleteDoc(doc(db, 'articles', articleId));
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

export async function updateArticle(articleId, payload) {
  try {
    await updateDoc(doc(db, 'articles', articleId), payload);
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

export async function getMyArticles(userId) {
  try {
    const q = query(articlesCollectionRef, where('author', '==', userId));
    const snapshot = await getDocs(q);

    return snapshot.docs
      .map(mapArticleSnapshot)
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  } catch (error) {
    return [];
  }
}

export async function seedDatabase() {
  const seedArticles = [
    {
      title: 'Озера Карпат: ранкове сяйво',
      description: 'Короткий гід для подорожі до гірських озер із порадами для фото на світанку.',
      content:
        'Доїжджайте до локації ще до світанку, беріть теплий одяг і штатив. Найкращий кадр виходить за 20 хвилин до появи сонця.',
      imageUrl: 'https://images.unsplash.com/photo-1746345883879-75ebff21a3d4?w=600',
      author: 'seed-system',
      date: serverTimestamp(),
      likes: 0,
    },
    {
      title: 'Велика стаття: Подорож на край світу',
      description: 'Маршрут на декілька днів із зупинками у малих містах та природних парках.',
      content:
        'Це детальна історія подорожі: планування, бюджет, маршрути та особисті враження. Матеріал стане базою для першої великої мандрівки.',
      imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200',
      author: 'seed-system',
      date: serverTimestamp(),
      likes: 0,
    },
    {
      title: 'Ніч під зорями: кемпінг',
      description: 'Практичні поради, як підготуватися до комфортної ночівлі в наметі.',
      content:
        'Перевірте прогноз погоди, оберіть безпечну локацію, підготуйте каремат, спальник і ліхтарик. Не залишайте сміття після відпочинку.',
      imageUrl:
        'https://images.unsplash.com/photo-1470246973918-29a93221c455?w=600&auto=format&fit=crop&q=60',
      author: 'seed-system',
      date: serverTimestamp(),
      likes: 0,
    },
  ];

  try {
    const existing = await getDocs(articlesCollectionRef);
    if (!existing.empty) {
      return { ok: true, skipped: true };
    }

    await Promise.all(seedArticles.map((article) => addDoc(articlesCollectionRef, article)));
    return { ok: true, skipped: false };
  } catch (error) {
    return { ok: false, error };
  }
}

