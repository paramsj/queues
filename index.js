import dotenv from 'dotenv'

dotenv.config({
    path: '.env'
});

import { app } from './app.js'
import { checkDB } from './db/index.js';

const startServer = async () => {
    try {
        await checkDB();
        app.on("error", (error) => {
            console.log(error);
            process.exit(1);
        });

        app.listen(process.env.PORT, () => {
            console.log(`Server is running at ${process.env.PORT}`);
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

startServer();
