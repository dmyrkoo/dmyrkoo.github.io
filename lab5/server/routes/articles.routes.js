const express = require('express');
const { db, admin } = require('../config/firebaseAdmin');
const { requireAuth } = require('../middleware/auth');
const { validateRequiredFields } = require('../middleware/validate');

const router = express.Router();
const articlesRef = db.collection('articles');

function mapArticle(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title || '',
    description: data.description || '',
    content: data.content || '',
    imageUrl: data.imageUrl || '',
    author: data.author || '',
    likes: typeof data.likes === 'number' ? data.likes : 0,
    date: data.date || null,
  };
}

router.get('/', async (req, res, next) => {
  try {
    const snapshot = await articlesRef.orderBy('date', 'desc').get();
    const articles = snapshot.docs.map(mapArticle);
    res.json(articles);
  } catch (error) {
    next(error);
  }
});

router.get('/my', requireAuth, async (req, res, next) => {
  try {
    const snapshot = await articlesRef
      .where('author', '==', req.user.uid)
      .orderBy('date', 'desc')
      .get();

    const articles = snapshot.docs.map(mapArticle);
    res.json(articles);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const doc = await articlesRef.doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Article not found' });
    }

    return res.json(mapArticle(doc));
  } catch (error) {
    return next(error);
  }
});

router.post(
  '/',
  requireAuth,
  validateRequiredFields(['title', 'description', 'content', 'imageUrl']),
  async (req, res, next) => {
    try {
      const payload = {
        title: req.body.title.trim(),
        description: req.body.description.trim(),
        content: req.body.content.trim(),
        imageUrl: req.body.imageUrl.trim(),
        author: req.user.uid,
        likes: 0,
        date: admin.firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await articlesRef.add(payload);
      const createdDoc = await docRef.get();

      res.status(201).json(mapArticle(createdDoc));
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const docRef = articlesRef.doc(req.params.id);
    const existingDoc = await docRef.get();

    if (!existingDoc.exists) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const data = existingDoc.data();
    if (data.author !== req.user.uid) {
      return res.status(403).json({ message: 'You can edit only your own article' });
    }

    const updates = {};
    ['title', 'description', 'content', 'imageUrl'].forEach((field) => {
      if (typeof req.body[field] === 'string' && req.body[field].trim()) {
        updates[field] = req.body[field].trim();
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    await docRef.update(updates);
    const updatedDoc = await docRef.get();

    return res.json(mapArticle(updatedDoc));
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const docRef = articlesRef.doc(req.params.id);
    const existingDoc = await docRef.get();

    if (!existingDoc.exists) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const data = existingDoc.data();
    if (data.author !== req.user.uid) {
      return res.status(403).json({ message: 'You can delete only your own article' });
    }

    await docRef.delete();
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

router.patch('/:id/like', requireAuth, async (req, res, next) => {
  try {
    const docRef = articlesRef.doc(req.params.id);
    const existingDoc = await docRef.get();

    if (!existingDoc.exists) {
      return res.status(404).json({ message: 'Article not found' });
    }

    await docRef.update({
      likes: admin.firestore.FieldValue.increment(1),
    });

    const updatedDoc = await docRef.get();
    return res.json({ likes: updatedDoc.data().likes || 0 });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

