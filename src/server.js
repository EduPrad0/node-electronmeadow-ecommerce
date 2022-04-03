const express = require('express');
const cors = require('cors');
const { router: productsRoutes } = require('./handlers/products');
const { router: userRoutes } = require('./handlers/user');
const app = express();

app.use(express.json());
app.use(cors());
app.use(productsRoutes)
app.use(userRoutes)
app.listen(80);