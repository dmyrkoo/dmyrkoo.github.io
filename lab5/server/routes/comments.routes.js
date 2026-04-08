const express = require('express');
const { db, admin } = require('../config/firebaseAdmin');
const { requireAuth } = require('../middleware/auth');
const { validateRequiredFields } = require('../middleware/validate');

const router = express.Router();
const commentsRef = db.collection('comments');

function mapComment(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    articleId: data.articleId || '',
    userName: data.userName || '',
    text: data.text || '',
    userId: data.userId || '',
    date: data.date || null,
  };
}

router.get('/', async (req, res, next) => {
  try {
    const { articleId } = req.query;

    if (!articleId) {
      return res.status(400).json({ message: 'articleId query param is required' });
    }

    const snapshot = await commentsRef
      .where('articleId', '==', String(articleId))
      .orderBy('date', 'asc')
      .get();

    const comments = snapshot.docs.map(mapComment);
    return res.json(comments);
  } catch (error) {
    return next(error);
  }
});

router.post(
  '/',
  requireAuth,
  validateRequiredFields(['articleId', 'text']),
  async (req, res, next) => {
    try {
      const payload = {
        articleId: req.body.articleId.trim(),
        userName: (req.body.userName || req.user.email || 'Користувач').trim(),
        text: req.body.text.trim(),
        userId: req.user.uid,
        date: admin.firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await commentsRef.add(payload);
      const createdDoc = await docRef.get();

      return res.status(201).json(mapComment(createdDoc));
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;

