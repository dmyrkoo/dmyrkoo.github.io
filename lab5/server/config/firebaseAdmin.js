const admin = require("firebase-admin");
require("dotenv").config();

let serviceAccount;

try {
  // 1. Пріоритет для Render: читаємо весь JSON зі змінної середовища
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }
  // 2. Запасний варіант для локального запуску (localhost): шукаємо файл
  else {
    serviceAccount = require("../serviceAccountKey.json");
  }
} catch (error) {
  console.error("🚨 Помилка завантаження Firebase ключа:", error.message);
  process.exit(1); // Зупиняємо сервер, якщо ключа немає
}

// Ініціалізуємо Firebase лише один раз
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };