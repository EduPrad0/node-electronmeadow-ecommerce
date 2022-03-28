const express = require('express');
const mock = require('../mock.json');
const router = express.Router();
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

router.get('/api/products/:type', async (req, res) => {
  try {
    const response = await prisma.products.findMany({
      where: {
        category: req.params.type,
        AND: {
          quantity: {
            gt: 0
          }
        }
      },

      orderBy: {
        id: 'asc'
      }
    })
    res.status(200).json(response)
  } catch (err) {
    res.status(500).json({error: err, message: 'Ocorreu um erro ao conectar ao banco'})
  }
})

router.post('/api/product', async (req, res) => {
  try {
    const response = await prisma.products.create({
      data: req.body
    })

    res.status(200).json(response)
  } catch (err) {
    res.status(500).json({error: err, message: 'Ocorreu um erro ao inserir dados no banco'})
  }
})

router.get('/api/product/:id', async (req, res) => {
  try {
    const response = await prisma.products.findUnique({
      where: {
        id: Number(req.params.id),
      }
    })
    res.status(200).json(response)
  } catch (err) {
    res.status(500).json({error: err, message: 'Ocorreu um erro ao buscar o produto com id '+req.params.id})
  }
})

router.post('/api/get_orders', async (req, res) => {
  const ids  = req.body
  try {
    const response = await prisma.products.findMany({});
    const products = response.filter(item => ids.includes(item.id))
    return res.status(200).json(products)
  } catch (e) {
    return res.status(500).json({error: e, message: 'Ocorreu um erro ao buscar os produtos com ids '+JSON.stringify(ids)})
  }
})




router.get('/automation', async (req,res) => {
  const response = Promise.all(
    mock.data.map(async (i, k) => {
      try{
        const res = await prisma.products.create({
          data: {
            category: 'shop',
            description: i.title,
            pricing: i.salePrice.value,
            how_many_times: i.installment.months,
            quantity: 6,
            url_image: i.imageLink
          }
        })
  
        return res;
      }catch (e) {
        return {e}
      }
    })
  )


  res.json(response)
})
module.exports = {
  router
}