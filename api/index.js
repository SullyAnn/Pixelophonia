import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

/** 
* logic for our api will go here
*/
export default {
  path: '/api',
  handler: app
}


app.post(`/user`, async (req, res) => {
    const result = await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
      },
    })
    res.json(result)
  })

app.post('/post', async (req, res) => {
    const { title, content, authorEmail } = req.body
    const post = await prisma.post.create({
      data: {
        title,
        content,
        author: {
          connectOrCreate: {
            email: authorEmail
          }
        }
      }
    })
    res.status(200).json(post)
})

app.get('/drafts', async (req, res) => {
    const posts = await prisma.post.findMany({
      where: { published: false },
      include: { author: true }
    })
    res.json(posts)
  })

app.get('/post/:id', async (req, res) => {
    const { id } = req.params
    const post = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
      include: { author: true }
    })
    res.json(post)
  })

app.put('/publish/:id', async (req, res) => {
    const { id } = req.params
    const post = await prisma.post.update({
      where: {
        id: Number(id),
      },
      data: { published: true },
    })
    res.json(post)
  })

app.get('/feed', async (req, res) => {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: { author: true },
    })
    res.json(posts)
  })

app.delete(`/post/:id`, async (req, res) => {
    const { id } = req.params
    const post = await prisma.post.delete({
      where: {
        id: parseInt(id),
      },
    })
    res.json(post)
  })

app.get('/filterPosts', async (req, res) => {
    const { searchString } = req.query
    const draftPosts = await prisma.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchString,
            },
          },
          {
            content: {
              contains: searchString,
            },
          },
        ],
      },
    })
    res.send(draftPosts)
  })