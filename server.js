require('dotenv').config();
const app= require('./app');
const connectDatabase=require('./config/databaseConfig');

const PORT=process.env.PORT || 3000;

async function startserver(){
    await connectDatabase();
    app.listen(PORT,()=>{
        console.log(`Server running at ${PORT}`);
    });
};
startserver()