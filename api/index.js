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

/* ====== CHOICE ====== */ 

//add a choice
// title et img requis dans le body (?)
app.post(`/choice`, async (req, res) => {
  const result = await prisma.choice.create({
    data: {
      title: req.body.title,
      img: req.body.img,
    },
  })
  res.json(result)
})

// get a choice
app.get('/choice/:id', async (req, res) => {
  const { id } = req.params
  const choice = await prisma.choice.findUnique({
    where: {
      id: Number(id),
    }
  })
  res.json(choice)
})

// delete a choice
app.delete('/choice/:id', async (req, res) => {
  const { id } = req.params
  const choice = await prisma.choice.delete({
    where: {
      id: Number(id),
    }
  })
  res.json(choice)
})

// update a choice
// title et img requis dans le body (?)
app.put('/choice/:id', async (req, res) => {
  const { id } = req.params
  const choice = await prisma.choice.update({
    where: {
      id: Number(id),
    },
    data: { 
      title: req.body.title,
      img: req.body.img,
    },
  })
  res.json(choice)
})


/* ====== CHOICE ====== */ 

app.post('/question', async (req, res) => {
    const { label, choiceTitle } = req.body
    const question = await prisma.question.create({
      data: {
        label,
        choices: {
          connectOrCreate: {
            email: choiceTitle
          }
        }
      }
    })
    res.status(200).json(question)
})

app.get('/drafts', async (req, res) => {
    const questions = await prisma.question.findMany({
    })
    res.json(questions)
  })

app.get('/question/:id', async (req, res) => {
    const { id } = req.params
    const question = await prisma.question.findUnique({
      where: {
        id: Number(id),
      }
    })
    res.json(question)
  })

app.put('/publish/:id', async (req, res) => {
    const { id } = req.params
    const question = await prisma.question.update({
      where: {
        id: Number(id),
      },
      data: { question: true },
    })
    res.json(question)
  })

app.get('/feed', async (req, res) => {
    const questions = await prisma.question.findMany({
      include: { question: true },
    })
    res.json(questions)
  })

app.delete(`/question/:id`, async (req, res) => {
    const { id } = req.params
    const question = await prisma.question.delete({
      where: {
        id: parseInt(id),
      },
    })
    res.json(question)
  })