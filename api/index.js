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

/* ====== QUESTION ====== */ 

//create a question with 2 choices
app.post('/question', async (req, res) => {
  const question = await prisma.question.create({
    data: {
      label: req.body.label,
      question : req.body.question,
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

  // delete link with concerts
  await prisma.questionsOnConcerts.deleteMany({
    where: {
      questionId: Number(id),
    }
  })

  // delete linked choices
  const deleteChoices = prisma.choice.deleteMany({
    where: {
      questionId: parseInt(id),
    },
  })

  // delete from question
  const deleteQuestion = prisma.question.delete({
    where: {
      id: parseInt(id),
    },
  })
  
  const transaction = await prisma.$transaction([deleteChoices, deleteQuestion])
  res.json(transaction)
})

/* ====== CONCERT ====== */ 

//create a concert
app.post('/concert', async (req, res) => {
  //create concert
  const concert = await prisma.concert.create({
    data: {
      title: req.body.title
    }
  })

  // link to questions
  for (let element of req.body.questions) {
    await prisma.questionsOnConcerts.create({
      data: {
        concertId: concert.id,
        questionId: element.id
      }
    })
  }
  res.status(200).json(concert)
})

//get all the concerts
app.get('/concerts', async (req, res) => {
  const concerts = await prisma.concert.findMany({})
  res.json(concerts)
})


// get a concert by its id 
app.get('/concert/:id', async (req, res) => {
  const { id } = req.params
  const concert = await prisma.concert.findUnique({
    where: {
      id: Number(id),
    }
  })
  const questions = await prisma.questionsOnConcerts.findMany({
    where: {
      concertId: Number(id),
    }
  })
  res.json({concert, questions})
})

// delete a concert by its id 
app.delete('/concert/:id', async (req, res) => {
  const { id } = req.params
  await prisma.questionsOnConcerts.deleteMany({
    where: {
      concertId: Number(id),
    }
  })
  const concert = await prisma.concert.delete({
    where: {
      id: Number(id),
    }
  })
  res.json(concert)
})

// update a concert
app.put('/concert/:id', async (req, res) => {
  const { id } = req.params
  const concert = await prisma.concert.update({
    where: {
      id: Number(id),
    },
    data: { 
      title: req.body.title
    },
  })

  // delete all questions from concert 
  await prisma.questionsOnConcerts.deleteMany({
    where: {
      concertId: Number(id),
    }
  })

  // add selected questions to concert
  for (let element of req.body.questions) {
    await prisma.questionsOnConcerts.create({
      data: {
        concertId: concert.id,
        questionId: element.id
      }
    })
  }

  res.json(concert)
})


