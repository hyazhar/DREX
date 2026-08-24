require('dotenv').config();
const app= require('./app');

const PORT=process.env.PORT || 3000;

async function startserver(){
    app.listen(PORT,()=>{
        console.log(`Server running at ${PORT}`);
    });
};
startserver()