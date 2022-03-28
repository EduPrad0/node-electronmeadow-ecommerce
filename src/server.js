const express = require('express');
const cors = require('cors');
const { router: productsRoutes } = require('./routes/products');
const app = express();
const PORT = 3333;

app.use(express.json());
app.use(cors());
app.use(productsRoutes)
app.listen(PORT, () => console.log('listening on port :'+PORT));