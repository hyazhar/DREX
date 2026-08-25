const mongoose = require("mongoose");

async function connectDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB Connected");
        return mongoose.connection.getClient();
    } catch (err) {
        console.error(" Database Connection Failed");
        console.error(err.message);
        process.exit(1); // Exit the process if the DB connection fails
    }
}

module.exports = connectDatabase;