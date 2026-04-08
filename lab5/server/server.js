require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const apiRoutes = require('./routes');
const likesRouter = require('./routes/likes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = Number(process.env.PORT || 5000);
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  process.env.NETLIFY_APP_URL || 'https://YOUR-NETLIFY-URL.netlify.app',
];

app.use(helmet());
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ message: 'Travel Blog API is running' });
});

app.use('/api', apiRoutes);
app.use('/api/likes', likesRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

