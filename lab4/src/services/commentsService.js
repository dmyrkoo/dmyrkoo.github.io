import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';

const commentsCollectionRef = collection(db, 'comments');

function mapCommentSnapshot(snapshot) {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    articleId: data.articleId || '',
    userName: data.userName || '',
    text: data.text || '',
    userId: data.userId || '',
    date: data.date?.toDate ? data.date.toDate() : null,
  };
}

export async function getComments(articleId) {
  try {
    const q = query(commentsCollectionRef, where('articleId', '==', articleId));
    const snapshot = await getDocs(q);

    return snapshot.docs
      .map(mapCommentSnapshot)
      .sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
  } catch (error) {
    return [];
  }
}

export async function addComment({ articleId, userName, text, userId }) {
  try {
    await addDoc(commentsCollectionRef, {
      articleId,
      userName,
      text,
      userId,
      date: serverTimestamp(),
    });

    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

