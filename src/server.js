const express = require('express');
const cors = require('cors');
const { router: productsRoutes } = require('./handlers/products');
const { router: userRoutes } = require('./handlers/user');
const app = express();
const PORT = 3333;

app.use(express.json());
app.use(cors());
app.use(productsRoutes)
app.use(userRoutes)
app.listen(80, () => console.log('listening on port :'+PORT));