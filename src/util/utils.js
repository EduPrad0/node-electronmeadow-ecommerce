const { PrismaClient } = require("@prisma/client");
const CryptoJS = require("crypto-js");
const salt = "ASODIJAKLDKe987asdaSDASDOINsmlSD5A4d0FALDMASD"
const moment = require('moment')

function cryptographic(id) {
  const data = {
    id,
    expired: moment().add(1, 'days').toISOString()
  }
  const criptor = CryptoJS.AES.encrypt(JSON.stringify(data), salt).toString();
  return criptor;
}

function descryptographic(criptore) {
  const bytes = CryptoJS.AES.decrypt(criptore + "", salt);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

async function getUser(where, getCPF) {
  const prisma = new PrismaClient()
  let tokenOrError = {};
  try {
    const response = await prisma.users.findFirst({
      where,
      rejectOnNotFound: true
    })
    if (getCPF) {
      tokenOrError['user'] = response;
      delete tokenOrError['user'].password;
    }

    tokenOrError['t'] = true;
  } catch (err) {
    tokenOrError = {
      t: false,
      err
    }
  }

  return tokenOrError;
}

module.exports = {
  cryptographic,
  descryptographic,
  getUser
}