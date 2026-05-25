import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { plate, vin, firstName, lastName, phone, email, carModel } = req.body;
    const files = req.files as Express.Multer.File[];

    const photoPaths = files ? files.map(file => `/uploads/${file.filename}`) : [];

    const newApp = await prisma.application.create({
      data: {
        plate: plate.trim().toUpperCase(),
        vin: vin.trim().toUpperCase(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        carModel,
        photos: JSON.stringify(photoPaths),
        status: 'WAITING',
      }
    });

    res.status(201).json({
      message: 'Заявка успешно создана',
      data: newApp
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      const target = error.meta?.target as string[];
      let field = '';
      let message = '';

      if (target.includes('plate')) {
        field = 'plate';
        message = 'Автомобиль с таким госномером уже существует';
      } else if (target.includes('vin')) {
        field = 'vin';
        message = 'Автомобиль с таким VIN уже существует';
      } else {
        field = 'unknown';
        message = 'Конфликт данных';
      }

      res.status(409).json({
        error: 'Конфликт данных',
        field,
        details: message
      });
      return;
    }

    console.error('Ошибка создания заявки:', error);
    res.status(500).json({
      error: 'Внутренняя ошибка сервера',
      details: error.message
    });
  }
};

export const getCarStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { plate } = req.params as { plate: string };

    const application = await prisma.application.findUnique({
      where: { plate: plate },
      select: { status: true, message: true, carModel: true, plate: true, firstName: true, photos: true }
    });

    if (!application) {
      res.status(404).json({ error: 'Автомобиль с таким номером не найден' });
      return;
    }

    res.status(200).json(application);
  } catch (error: any) {
    res.status(500).json({ error: 'Ошибка сервера', details: error.message });
  }
};


export const createInquiry = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, message } = req.body;


    const newInquiry = await prisma.inquiry.create({
      data: { name, phone, email, message },
    });
    res.status(201).json(newInquiry);
  } catch (error) {
    res.status(500).json({ error: 'Не удалось отправить вопрос' });
  }
};
