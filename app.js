const express=require('express');
const app= express();
const errorHandler= require('./middleware/errorHandler');
const ExpressError= require('./utils/ExpressError');
const cors= require('cors');
const categoryRoutes= require('./routes/categoryRoutes');
const productRoutes= require('./routes/productRoutes');



// Middlewares
app.use(cors());
app.use(express.json());

// Routes

app.get('/', (req,res)=>{
    res.json({
        success:true,
        message:"Welcome to DREX Store"
    })
});

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);


//Page Not Found Route 
app.all("/*splat", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Global ErrorHandler
app.use(errorHandler);

module.exports=app;