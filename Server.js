const express = require("express");
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const db = require('./config/db'); 
const vendorRoutes = require('./routes/vendorRoutes');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes=require('./routes/productRoutes');


dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product',productRoutes);
app.use('/uploads',express.static('uploads'))


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});