const port = process.env.PORT || 3000
const isProd = process.env.NODE_ENV === 'production'

const http = require('http')
const app = require('express')()
const server = http.createServer(app)
const io = require('socket.io')(server)

const { Nuxt, Builder } = require('nuxt')
// We instantiate Nuxt with the options
const config = require('./nuxt.config.js')
config.dev = !isProd

const nuxt = new Nuxt(config)
// Start build process in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}
app.use(nuxt.render)

app.use("/player", nuxt.render);
app.use("/admin", nuxt.render);
app.use("/host", nuxt.render);

// Listen the server
server.listen(port, '0.0.0.0')
console.log('Server listening on localhost:' + port) // eslint-disable-line no-console

// Socket.io
const messages = []
const choices = []
const questions = []
const displayQuestionData = []
let totalvotes=0
let nbChoice1 = 0
let nbChoice2 = 0
let percentage
let choicesResult = {}


io.on('connection', (socket) => {
  socket.on('last-questions', function(fn){
    fn(questions.slice(-5))
  })
  socket.on('last-choices', function(fn){
    fn(choices)
  })
  socket.on('data-for-screen', function(fn){
    fn(displayQuestionData)
  })
  
  socket.on('display-question', function (question, questionStartTime) {
    // transmission des choix pour le player
    socket.broadcast.emit('broadcast-question', question.choices)
    // transmission de la question pour le screen
    socket.broadcast.emit('display-question-on-screen', {question:question.question}, questionStartTime)
  })

  socket.on('submit-choice', function (choicesPlayer) {
    //conversion de l'objet en tableau : c'est plus simple pour récupérer les éléments par leur index respectif
    const arrayChoices = Object.values(choicesPlayer.choices)
    totalvotes++
    nbChoice1 += arrayChoices.at(0).nbvotes;
    nbChoice2 += arrayChoices.at(1).nbvotes;
    console.log("_____________________")
    console.log("total votes : " + totalvotes)
    console.log("------")
    console.log("nombre de votes choix 1 : " + nbChoice1)
    console.log("nombre de votes choix 2 : " + nbChoice2)

      arrayChoices.at(0).nbvotes = nbChoice1
      arrayChoices.at(1).nbvotes = nbChoice2

      choicesPlayer.choices = Object.assign(arrayChoices) // reconversion en objet
      //console.log(choicesPlayer.choices)


    choicesResult = Object.assign(arrayChoices)
    
    // transmission au player de son choix (comme une sorte de confirmation après son choix)
    io.to(socket.id).emit('display-player-choice', {yourchoice:choicesPlayer.playerChoice})
  })

  //peut-être temporaire : permet de reload toutes les pages quand admin reload (utile pour developpement)
  socket.on("reload-all-pages", function(isReload){
    console.log("on est repassé sur le serveur pour reload")
    socket.broadcast.emit("reload-this-page", isReload)
  })

  //on affiche les résultats quand le timer est fini
  socket.on("show-results-timer-done", function(){
    console.log('ENVOYER LES RESULTATS')
    console.log(totalvotes)
    console.log(choicesResult)
    socket.emit('display-final-choice', {totalVotes: totalvotes, choices : choicesResult})
    totalvotes=0 //remise à zero des votes
    nbChoice1=0
    nbChoice2=0
  })
})