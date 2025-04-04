import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { Container } from 'typedi';
import { useExpressServer } from 'routing-controllers';
import { UserController } from './controllers/UserController';
import { TransactionController } from './controllers/TransactionController';
import { CategoryController } from './controllers/CategoryController';
import { authorizationChecker, currentUserChecker } from './middlewares/AuthMiddleware';
import { AppDataSource } from './data-source';

// Express uygulaması oluştur
const app = express();

// CORS ve JSON body parser middleware'leri ekle
app.use(cors());
app.use(express.json());

// PostgreSQL veritabanı bağlantısı
AppDataSource.initialize()
  .then(() => {
    console.log('PostgreSQL veritabanına bağlantı başarılı');

    // Controller'ları ve middleware'leri Express uygulamasına bağla
    useExpressServer(app, {
      controllers: [
        UserController,
        TransactionController,
        CategoryController
      ],
      authorizationChecker,
      currentUserChecker,
      cors: true,
      classTransformer: true,
      defaultErrorHandler: false
    });

    // Özel hata işleyici
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error(err);
      res.status(err.httpCode || err.status || 500).json({
        status: err.httpCode || err.status || 500,
        message: err.message || 'Bir hata oluştu'
      });
    });

    // Uygulama başlatma
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
    });
  })
  .catch((error) => console.error('TypeORM bağlantı hatası: ', error)); 