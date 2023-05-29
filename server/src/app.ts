import express from 'express';
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import cors from 'cors'
import buyerRouter from './routes/buyersRoute';
import { connectDB, sequelize} from './db/db';
dotenv.config();

const app = express()

app.use(express.json());
app.use(logger('dev'));
app.use(cookieParser())
app.use(cors({
    origin: '*',
}));

/*=========Routes======== */
app.use('/users', buyerRouter)

const port = 4000
app.listen(port, async ()=>{
    console.log(`server running on http://localhost:${port}`);
    await connectDB();
    sequelize.sync({force: false}).then(() => {
        console.log("Synced database successfully")
    })
})

export default app