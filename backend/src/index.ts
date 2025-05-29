import cors from 'cors';
import express from 'express';
import labelRoutes from './routes/labelRoutes';
import restaurantRoutes from './routes/restaurantRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/labels', labelRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
