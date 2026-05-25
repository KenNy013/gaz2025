import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './utils/swagger.ts';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.routes.ts';
import path from 'path';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : [];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());

// Раздача статики (фотографии)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Swagger UI (Доступен по адресу /api-docs)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// JSON версия для генератора
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

// Роуты
app.use('/api', apiRoutes);

export default app;
