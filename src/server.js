const { PrismaClient } = require('@prisma/client');
const express = require('express');
const mock = require('./mock.json');
const cors = require('cors');
const app = express();
const PORT = 3333;


app.listen(PORT, () => console.log('listening on port :'+PORT));
app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();
app.get('/getProducts/:type', async (req, res) => {
  const {type} = req.params
  try {
    const products = await prisma.products.findMany({
      where: {
        category: type
      },
      orderBy: {
        id: 'asc'
      }
    })
    return res.status(200).json(products);
  }catch (err) {
    return res.status(500).json({erroMessage: 'ocorreu um erro ao consultar o banco', data: {err}})
  }
})

app.post('/api/postProduct', async (req, res) => {
  const items = req.body
  try {
    const products = await prisma.products.create({
      data: items
    })
    console.log(products)
    
    return res.status(200).json(products);
  }catch (err) {
    return res.status(500).json({erroMessage: 'ocorreu um erro ao consultar o banco', data: {err}})
  }
})



app.get('/automation', async (req, res) => {
  const promiseForPrisma = Promise.all(
    mock.data.map(async (item, index) => {
      try {
        const products = await prisma.products.create({
          data: {
            description: item.title,
            pricing: item.salePrice.value,
            avaliation: 1,
            comments: item.description,
            how_many_times: item.installment.months,
            is_favorited: index % 2 === 0,
            total_avaliation: 1,
            url_image: item.imageLink,
            category: "shop"
        }
      })

      return products
    } catch (err) {
      console.log(err)
      return {err}
    }
    })
  )
  return res.json(promiseForPrisma)

  
})


