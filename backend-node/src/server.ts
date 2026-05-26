import dotenv from 'dotenv';
dotenv.config();
console.log("DATABASE_URL:", process.env.DATABASE_URL);
import express from 'express';
import cors from 'cors';

import userRoutes from '../modules/user/userRoutes.js';
import postRoutes from '../modules/post/postRoutes.js';



const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", (req, res, next) => {
  console.log("BATEU NA ROTA /users");
  next();
}, userRoutes);
app.use('/posts', postRoutes);

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
