import compression from 'compression'
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import { limiter } from './utils/utils.js';

const app = express();

app.use(cors());
app.use(limiter);

// CORS middleware'ini kullan
// app.use(cors({
//   origin: 'https://frontend.com',   // Bu domaine izin ver
//   methods: ['GET', 'POST'],         // Hangi HTTP metodlarına izin ver
//   allowedHeaders: ['Content-Type', 'Authorization'], // Hangi başlıklara izin ver
//   credentials: true                 // Kimlik bilgilerini (cookies) alabilmek için
// }));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // form verileri icin "html"
app.use(compression()); // Tarayıcıdan gelen Accept-Encoding: gzip, deflate, br gibi başlıkları kontrol eder.
app.use('/api', userRoutes);

app.get('/', (req, res) => {
  res.send('API IS WORKING PROPERLY');
});

export default app;
