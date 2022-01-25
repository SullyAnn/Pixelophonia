const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const bcrypt = require("bcryptjs");

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const authUserSecret = 'secret' //process.env.SECRET
const JwtStrategy = require('passport-jwt').Strategy
const jwt = require('jsonwebtoken');

async function CreateUser (email, password) {
  return await prisma.admin.create({ email, password })
    .then((data) => {
      return data
    }).catch((error) => {
      throw error
    })
}

async function GetUser (email) {
  //console.log(email)
  return await prisma.admin.findUnique({ 
    where  : 
      {
        email : email 
      }
  })
  .then((data) => {
    //console.log(data)
    return data
  }).catch((error) => {
    throw error
  })
}

async function generatePasswordHash (plainPassword) {
  return await bcrypt.hash(plainPassword, 12)
}

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async function (email, password, done) {
      //console.log(email + " " + password)
      await GetUser(email)
        .then((user) => {
          //console.log(user)
          return user
        }).then(async (user) => {
          if (!user) {
            return done(null, false, { message: 'Authentication failed' })
          }
          const validation = await comparePasswords(password, user.password)
          //console.log(validation)
          if (validation) {
            return done(null, user)
          } else {
            return done(null, false, { message: 'Authentication failed' })
          }
        }).catch((err) => {
          return done(err)
        })
    }
  )
)

async function comparePasswords (plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

function signUserToken (user) {
  return jwt.sign({
    //id: user.id,
    email: user.email
  }, authUserSecret)
}

const tokenExtractor = function (req) {
  let token = null
  if (req.req && req.req.get('cookie')&& req.req.get('authorization')) {
    const rawToken = req.req.get('authorization').toString()
    token = rawToken.slice(rawToken.indexOf(' ') + 1, rawToken.length)
  }
  //console.log(token)
  return token
}
const opts = {}
opts.jwtFromRequest = tokenExtractor
opts.secretOrKey = 'secret'

passport.use(new JwtStrategy(opts, (jwtPayload, done)=>{
  GetUser(jwtPayload.email)
    .then((user) => {
      if (user) {
        return done(null, {
          email: user.email,
        })
      } else {
        return done(null, false, 'Failed')
      }
    })
    .catch((err) => {
      return done(err)
    })
}
))


export default {
  CreateUser,
  GetUser,
  generatePasswordHash,
  signUserToken
}