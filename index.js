const express = require('express');
const app = express();

// Читаємо порт, який ми передали з docker-compose.yml
const PORT = process.env.PORT || 3002;

// ... (тут ваші маршрути) ...

// ВАЖЛИВО!
app.listen(PORT, () => {
  console.log(`User service запущено на порті ${PORT}`);
});