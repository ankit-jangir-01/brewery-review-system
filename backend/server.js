const express = require('express');
const path = require('path');
const authRouter = require('./routes/auth');
const { connectToDatabase, closeDatabaseConnection } = require('./DB/db');
const cors = require('cors');
const reviewRouter = require('./routes/review')

const app = express();
const PORT = process.env.PORT || 3000;

const corsOpts = {
    origin: '*',
    credentials: true,
    methods: ['GET','POST'],
    allowedHeaders: ['Content-Type'],
    exposedHeaders: ['Content-Type']
};
app.use(cors(corsOpts));


app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/reviews', reviewRouter);


connectToDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.log("error connecting to database: ", error)
    })

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

process.on('SIGINT', () => {
    closeDatabaseConnection()
        .then(() => {
            process.exit(0);
        });
});