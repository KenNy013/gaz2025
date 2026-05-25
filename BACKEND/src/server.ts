import app from './app.ts';

const PORT = process.env.PORT;


app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
  console.log(`📄 Swagger документация: http://localhost:${PORT}/api-docs`);
});
