import { Router } from 'express';
import { createApplication, createInquiry, getCarStatus } from './../controllers/client.controller.ts';
import { loginAdmin, getApplications, updateApplicationStatus, getMe, logoutAdmin, deleteApplication, getAllInquiries, deleteInquiry, getInquiriesCount, updateInquiryStatus } from './../controllers/admin.controller.ts';
import { uploadPhotos } from '../middlewares/upload.middleware.ts';
import { requireAdmin } from '../middlewares/auth.middleware.ts';

const router = Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: admin_token
 *   schemas:
 *     Application:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         plate:
 *           type: string
 *         vin:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *         carModel:
 *           type: string
 *         status:
 *           type: string
 *           enum: [WAITING, ACCEPTED, READY]
 *         message:
 *           type: string
 *           nullable: true
 *         photos:
 *           type: array
 *           items:
 *             type: string
 *           description: Массив путей к загруженным фотографиям
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     LogoutResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Успешный выход
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *         details:
 *           type: string
 */

/**
 * @swagger
 * /api/client/application:
 *   post:
 *     tags:
 *       - Client
 *     summary: Создать заявку на техническое обслуживание
 *     description: Подача новой заявки с данными автомобиля и фотографиями (до 5 файлов).
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - plate
 *               - vin
 *               - firstName
 *               - lastName
 *               - phone
 *               - email
 *               - carModel
 *             properties:
 *               plate:
 *                 type: string
 *                 description: Госномер автомобиля (например, А123ВС177)
 *                 example: А123ВС177
 *               vin:
 *                 type: string
 *                 description: VIN-код автомобиля
 *                 example: 1HGCM82633A123456
 *               firstName:
 *                 type: string
 *                 description: Имя владельца
 *                 example: Иван
 *               lastName:
 *                 type: string
 *                 description: Фамилия владельца
 *                 example: Иванов
 *               phone:
 *                 type: string
 *                 description: Контактный телефон
 *                 example: +7(999)123-45-67
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email
 *                 example: ivanov@example.com
 *               carModel:
 *                 type: string
 *                 description: Марка и модель автомобиля
 *                 example: Toyota Camry
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Фотографии автомобиля (до 5 файлов, форматы jpg, png)
 *     responses:
 *       201:
 *         description: Заявка успешно создана
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       400:
 *         description: Ошибка валидации данных (некорректный формат, отсутствуют обязательные поля)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/client/application', uploadPhotos, createApplication);

/**
 * @swagger
 * /api/client/status/{plate}:
 *   get:
 *     tags:
 *       - Client
 *     summary: Получить статус заявки по госномеру
 *     description: Возвращает текущий статус заявки и сообщение от сервиса (если есть).
 *     parameters:
 *       - in: path
 *         name: plate
 *         required: true
 *         schema:
 *           type: string
 *         description: Госномер автомобиля (как был указан при создании заявки)
 *         example: А123ВС177
 *     responses:
 *       200:
 *         description: Информация о статусе заявки
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [WAITING, ACCEPTED, READY]
 *                   description: Текущий статус заявки
 *                 message:
 *                   type: string
 *                   description: Сообщение от администратора (может быть пустым)
 *               example:
 *                 status: ACCEPTED
 *                 message: "Автомобиль принят в работу, ожидайте готовности"
 *       404:
 *         description: Заявка с указанным госномером не найдена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/client/status/:plate', getCarStatus);

// === АДМИНСКАЯ ЧАСТЬ ===

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Авторизация администратора
 *     description: При успешной аутентификации устанавливается httpOnly cookie `admin_token` с JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - password
 *             properties:
 *               login:
 *                 type: string
 *                 description: Логин администратора
 *                 example: admin
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Пароль
 *                 example: securePass123
 *     responses:
 *       200:
 *         description: Успешная авторизация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Успешный вход
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: admin_token=eyJhbGciOiJIUzI1NiIs...; HttpOnly; Secure; SameSite=Strict; Max-Age=43200
 *       401:
 *         description: Неверные учетные данные
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/admin/login', loginAdmin);

/**
 * @swagger
 * /api/admin/applications:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Получить список всех заявок
 *     description: Возвращает все заявки, отсортированные по дате создания (сначала новые). Требуется авторизация администратора.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Список заявок
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 *       401:
 *         description: Не авторизован (отсутствует или недействительный токен)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Доступ запрещён (недостаточно прав)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/admin/applications', requireAdmin, getApplications);

/**
 * @swagger
 * /api/admin/applications/{id}:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Обновить статус заявки
 *     description: Изменяет статус заявки и (опционально) добавляет сообщение для клиента.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID заявки
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [WAITING, ACCEPTED, READY]
 *                 description: Новый статус заявки
 *                 example: ACCEPTED
 *               message:
 *                 type: string
 *                 description: Сообщение клиенту (опционально)
 *                 example: "Автомобиль готов к выдаче"
 *     responses:
 *       200:
 *         description: Статус обновлён, возвращает обновлённую заявку
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       400:
 *         description: Некорректные данные (неверный статус, отсутствует id)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Доступ запрещён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Заявка не найдена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/admin/applications/:id', requireAdmin, updateApplicationStatus);

/**
 * @swagger
 * /api/admin/applications/{id}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Удалить заявку и все связанные с ней файлы
 *     description: Полностью удаляет заявку из базы данных и физические файлы фотографий с диска.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID заявки
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       200:
 *         description: Заявка успешно удалена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Заявка и связанные файлы успешно удалены
 *       400:
 *         description: Некорректный или отсутствующий ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Доступ запрещён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Заявка не найдена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Ошибка сервера при удалении
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/admin/applications/:id', requireAdmin, deleteApplication);

/**
 * @swagger
 * /api/admin/me:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Получить данные текущего администратора
 *     description: Возвращает профиль авторизованного администратора (без пароля).
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Данные профиля
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: 550e8400-e29b-41d4-a716-446655440000
 *                 login:
 *                   type: string
 *                   example: admin
 *                 firstName:
 *                   type: string
 *                   example: Иван
 *                 lastName:
 *                   type: string
 *                   example: Петров
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/admin/me', requireAdmin, getMe);

/**
 * @swagger
 * /api/admin/logout:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Выход из системы
 *     description: Удаляет cookie с токеном авторизации.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Успешный выход
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogoutResponse'
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Ошибка при выходе
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/admin/logout', requireAdmin, logoutAdmin);



router.get('/admin/inquiries', requireAdmin, getAllInquiries);

router.delete('/admin/inquiries/:id', requireAdmin, deleteInquiry);

router.post('/client/inquiries', createInquiry);

router.get('/admin/inquiries/count', requireAdmin, getInquiriesCount);

router.patch('/admin/inquiries/:id', requireAdmin, updateInquiryStatus);


export default router;
