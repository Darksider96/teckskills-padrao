import express, { Express, Request, Response, NextFunction } from 'express';
import { routes } from './routes/routes';
import morgan from 'morgan';
import cors from 'cors';
import fs from 'fs';
import path from'path';



const app: Express = express();

const fileLog = fs.createWriteStream(path.join(__dirname, 'storage', 'acess.log'), { flags: 'a'});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('combined', { stream: fileLog }));





//configuração das rotas
app.use(routes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        return res.status(400).json({
            msg: 'Ocorreu um erro inesperado!',
            error: err.message
        })
    }

    next();
});



export { app };