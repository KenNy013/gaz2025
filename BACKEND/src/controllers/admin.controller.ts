import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.SESSION_SECRET || 'supersecret';

export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  try {

    console.log('Попытка входа администратора:', req.body);
    const { login, password } = req.body;
    const admin = await prisma.admin.findUnique({ where: { login } });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      res.status(401).json({ error: 'Неверные учетные данные' });
      return;
    }

    const token = jwt.sign({ id: admin.id }, JWT_SECRET, { expiresIn: '12h' });

    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 12 * 60 * 60 * 1000 // 12 часов
    });

    res.status(200).json({ message: 'Успешный вход' });
  } catch (error: any) {
    res.status(500).json({ error: 'Ошибка сервера', details: error.message });
  }
};

export const getApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const apps = await prisma.application.findMany({
      orderBy: { createdAt: 'desc' }
    });


    const formattedApps = apps.map(app => ({
      ...app,
      photos: JSON.parse(app.photos)
    }));

    res.status(200).json(formattedApps);
  } catch (error: any) {
    res.status(500).json({ error: 'Ошибка получения заявок', details: error.message });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = (req as any).admin?.id;

    if (!adminId) {
      res.status(401).json({ error: 'ID администратора не найден в токене' });
      return;
    }

    const admin = await prisma.admin.findUnique({
      where: { id: adminId }, // Теперь id будет передан корректно
      select: {
        id: true,
        login: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!admin) {
      res.status(404).json({ error: 'Администратор не найден в базе' });
      return;
    }

    res.status(200).json(admin);
  } catch (error: any) {
    console.error('Ошибка в getMe:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const { status, message } = req.body;

    const updatedApp = await prisma.application.update({
      where: { id },
      data: { status, message }
    });

    res.status(200).json(updatedApp);
  } catch (error: any) {
    res.status(500).json({ error: 'Ошибка обновления статуса', details: error.message });
  };
};

 export const logoutAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Попытка выхода администратора');


    res.clearCookie('admin_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({ message: 'Успешный выход' });
  } catch (error: any) {
    res.status(500).json({ error: 'Ошибка при выходе' });
  }
};

export const deleteApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    console.log(id)

    if (typeof id !== 'string') {
      res.status(400).json({ error: 'Некорректный или отсутствующий ID' });
      return;
    }

    const application = await prisma.application.findUnique({
      where: { id }
    });

    if (!application) {
      res.status(404).json({ error: 'Заявка не найдена' });
      return;
    }

    if (application.photos) {
      try {
        const photoPaths: string[] = JSON.parse(application.photos);

        for (const photoPath of photoPaths) {
          const fullPath = path.join(process.cwd(), photoPath);
          await fs.access(fullPath)
            .then(() => fs.unlink(fullPath))
            .catch(() => {
              console.log(`Файл не найден, пропускаем: ${fullPath}`);
            });
        }
      } catch (e) {
        console.error('Ошибка при парсинге путей или удалении файлов:', e);
      }
    }

    await prisma.application.delete({
      where: { id }
    });

    res.status(200).json({ message: 'Заявка и связанные файлы успешно удалены' });
  } catch (error: any) {
    console.error('Ошибка при удалении заявки:', error);
    res.status(500).json({ error: 'Ошибка сервера', details: error.message });
  }
};


// Получение всех вопросов (для админа)
export const getAllInquiries = async (req: Request, res: Response) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении списка вопросов' });
  }
};

// Удаление вопроса
export const deleteInquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (typeof id !== 'string') {
      res.status(400).json({ error: 'Некорректный ID' });
      return;
    }

    await prisma.inquiry.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Вопрос успешно удален' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении вопроса' });
  }
};


export const getInquiriesCount = async (req: Request, res: Response) => {
  try {
    const total = await prisma.inquiry.count();
    const unread = await prisma.inquiry.count({
      where: { isRead: false }
    });

    res.json({ total, unread });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при подсчете вопросов' });
  }
};


export const updateInquiryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;

    if (typeof id !== 'string') {
      res.status(400).json({ error: 'Некорректный ID' });
      return;
    }

    const updatedInquiry = await prisma.inquiry.update({
      where: { id },
      data: { isRead: Boolean(isRead) },
    });

    res.status(200).json(updatedInquiry);
  } catch (error) {
    res.status(500).json({ error: 'Не удалось обновить статус вопроса' });
  }
};
