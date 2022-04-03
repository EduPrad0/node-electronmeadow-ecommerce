const { PrismaClient } = require('@prisma/client');
const util = require('../util/utils');

const login = async (req, res) => {
  const { name, password } = req.body
  if (!name || !password) {
    return res.status(400).json({ error: 'not found fields' })
  }
  const getToken = await util.getUser({
    name: req.body.name,
    password: req.body.password
  }, true)


  if (!getToken.t && getToken.err?.name === 'NotFoundError') {
    return res.status(401).json({ error: 'not authorized' })
  }

  if (!getToken.t) {
    return res.status(500).json({ error: 'Internal server error', err: getToken })
  }
  return res.json({
    token: util.cryptographic(getToken.user.id),
    user: getToken.user
  })
}

const prisma = new PrismaClient()
const getLikes = async (req, res) => {
  const [, token] = req.headers.authorization.split(" ");
  const { id } = JSON.parse(util.descryptographic(token));
  try {
    const likesUser = await prisma.likes.findMany({
      where: {
        id_user: id
      }
    })
    const likes_for_user = likesUser.map(item => {
      return {
        id_like: item.id,
        id_user_like_product: item.id_product
      }
    });

    return res.status(200).json({ likes_for_user })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ err })
  }
}

const postLike = async (req, res) => {
  const { type, id_product } = req.body;
  const [, token] = req.headers.authorization.split(" ");
  const { id } = JSON.parse(util.descryptographic(token));
  if (type === 'delete') {
    try {
      const response = await prisma.likes.delete({
        where: {
          id: id_product
        },

      })

      return res.status(200).json({ response })
    } catch (e) {
      return res.status(500).json({ err: e })
    }
  } else {
    try {
      const response = await prisma.likes.create({
        data: {
          id_product,
          id_user: id
        }
      })

      return res.status(200).json({ response })
    } catch (e) {
      return res.status(500).json({ err })
    }
  }
}

const register = async (req, res) => {
  const {
    cpf,
    name,
    email,
    password
  } = req.body;

  if(cpf === "" || name === "" || email === "" || password === "") {
    return res.status(400).json({message: "bad request"})
  }

  try {
    const response = await prisma.users.create({
      data: {
        email,
        name,
        password,
        cpf
      },
    })

    return res.status(201).json({response})
  } catch (err) {
    if(err?.meta?.target){
      return res.status(401).json({message: 'Já existente', field: err.meta.target, err})
    }
    return res.status(500).json({err})
  }

}

module.exports = {
  login,
  getLikes,
  postLike,
  register
}