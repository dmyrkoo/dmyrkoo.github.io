const express = require('express');
const articlesRoutes = require('./articles.routes');
const commentsRoutes = require('./comments.routes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ ok: true, service: 'travel-blog-server' });
});

router.use('/articles', articlesRoutes);
router.use('/comments', commentsRoutes);

module.exports = router;

