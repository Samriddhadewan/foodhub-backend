import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { AuthRoutes } from './modules/Auth/auth.route';
import { MealRoutes } from './modules/Meal/meal.route';

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// application routes
app.use('/api/auth', AuthRoutes);
app.use("/api/meals", MealRoutes)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Apollo Gears World!');
});

export default app;
