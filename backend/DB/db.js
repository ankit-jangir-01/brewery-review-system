const mongoose = require('mongoose')

const URI = process.env.MONGODB_URI || "mongodb+srv://AnkitJangir:mzTtfJ8TV@inotebook.4ykgo.mongodb.net/Dyte"

function connectToDatabase() {
    return mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
}

function closeDatabaseConnection() {
    return mongoose.connection.close();
}

mongoose.connection.on('error', (error) => {
    console.log('MongoDB connnection error: ', error)
})

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

// Close Mongoose connection when the Node process ends
process.on('SIGINT', () => {
    db.close(() => {
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    });
});

module.exports = { connectToDatabase, closeDatabaseConnection };