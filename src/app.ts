import { TopicRouter } from './controllers/topiccontroller';
import { CoursesRouter } from './controllers/coursecontroller';
import { UserRouter } from './controllers/usercontroller';
import express from "express";
import { authRouter } from './controllers/authcontroller';
import { initConnection } from './helpers/database.helper';
import { RequireAuth, isValidToken } from './middlewares/auth.midleware';
import cors from 'cors';
const port = process.env.PORT || 3000;
const dataBaseUrl = process.env.DATABASE_URL || "mongodb://localhost:27017/questions";

initConnection(dataBaseUrl);
const app: express.Application = express();


// commons using
app.use(express.json());
app.use(cors());
app.all('/api/*', RequireAuth, isValidToken);

// Routes configuration
app.use('/authentication/v1', authRouter);
app.use('/api/user/v1', UserRouter);
app.use('/api/courses/v1', CoursesRouter);
app.use('/api/topic/v1' , TopicRouter);

app.listen(port, () => {
    console.log(`app is up on port ${port}`);
})
