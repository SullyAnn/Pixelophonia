import express from 'express'
import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

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

/* ====== QUESTION ====== */ 

//create a question with 2 choices
app.post('/question', async (req, res) => {
  const question = await prisma.question.create({
    data: {
      label: req.body.label,
      question : req.body.question,
      temps : Number(req.body.temps),
      choices : {
        create: [
          { title: req.body.title1, img: req.body.img1 },
          { title: req.body.title2, img: req.body.img2 },
        ],
      },
    }
  })
  res.status(200).json(question)
})

app.post('/upload.php/', async(req, res) =>{
  console.log("nous sommes dans api/index.js")
  const images = await fetch('upload.php', req.form, {method:'POST'})
  console.log(images)
})

//get all the questions
app.get('/questions', async (req, res) => {
  const questions = await prisma.question.findMany({
      include: {
          choices: true, // Return all choices
      },
  })
  res.json(questions)
})

//get a question by its Id and its choices
app.get('/question/:id', async (req, res) => {
  const { id } = req.params
  const question = await prisma.question.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      choices: true, // include all the choices
    },
  })
  res.json(question)
})


//update a question with the two choices
app.put('/question/:id', async (req, res) => {
  const { id } = req.params
  const question = await prisma.question.update({
    where: {
      id: Number(id),
    },
    data: { 
      label: req.body.label,
      question : req.body.question,
      temps : Number(req.body.temps),
    },
  })

  const choice1 = await prisma.choice.update({
    where: {
      id: Number(req.body.id1),
    },
    data: { 
      title: req.body.title1,
      img: req.body.img1,
    },
  })
  
  const choice2 = await prisma.choice.update({
    where: {
      id: Number(req.body.id2),
    },
    data: { 
      title: req.body.title2,
      img: req.body.img2,
    },
  })

  res.json([question, choice1, choice2])
})

//delete a question with the choices linked to it
app.delete(`/question/:id`, async (req, res) => {
  const { id } = req.params

  const deleteChoices = prisma.choice.deleteMany({
    where: {
      questionId: parseInt(id),
    },
  })
  
  const deleteQuestion = prisma.question.delete({
    where: {
      id: parseInt(id),
    },
  })
    console.log(__dirname)
    const path = `./assets/images/Question_${id}`;
    if(fs.existsSync(path)){
        fs.rmdir(path, {recursive: true,},(err) => {
        if(err){
            throw err;
        }
        console.log(`${path} is deleted!`);
        })
    }else console.log(`this ${path} directory does not exist`)
  const transaction = await prisma.$transaction([deleteChoices, deleteQuestion])
  res.json(transaction)
})

/* ====== QUESTION ====== */ 

