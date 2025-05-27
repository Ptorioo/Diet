import cors from 'cors';
import express from 'express';
import preferenceRoutes from './routes/preferenceRoutes';
import restaurantRoutes from './routes/restaurantRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/preferences', preferenceRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
