const express = require('express');
const { admin, db } = require('../config/firebaseAdmin');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();
const likedArticlesRef = db.collection('liked_articles');

router.get('/', verifyToken, async (req, res, next) => {
  try {
    const snapshot = await likedArticlesRef
      .where('userId', '==', req.user.uid)
      .orderBy('likedAt', 'desc')
      .get();

    const likes = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        articleId: data.articleId || '',
        title: data.title || '',
        likedAt: data.likedAt || null,
      };
    });

    return res.json(likes);
  } catch (error) {
    return next(error);
  }
});

router.post('/', verifyToken, async (req, res, next) => {
  try {
    const { articleId, title } = req.body;
    const normalizedArticleId = typeof articleId === 'string' ? articleId.trim() : '';

    if (!normalizedArticleId) {
      return res.status(400).json({ message: 'articleId є обов\'язковим полем' });
    }

    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ message: 'title є обов\'язковим полем' });
    }

    const existingLike = await likedArticlesRef
      .where('userId', '==', req.user.uid)
      .where('articleId', '==', normalizedArticleId)
      .limit(1)
      .get();

    if (!existingLike.empty) {
      return res.status(400).json({ message: 'Ви вже вподобали цю статтю' });
    }

    const newDoc = await likedArticlesRef.add({
      userId: req.user.uid,
      articleId: normalizedArticleId,
      title: title.trim(),
      likedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await db.collection('articles').doc(normalizedArticleId).update({
      likes: admin.firestore.FieldValue.increment(1),
    });

    return res.status(201).json({
      message: 'Стаття додана до вподобаних',
      id: newDoc.id,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

