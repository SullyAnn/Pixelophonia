const port = process.env.PORT || 3000
const isProd = process.env.NODE_ENV === 'production'

const http = require('http')
const app = require('express')()
const server = http.createServer(app)
const io = require('socket.io')(server)
const cors = require('cors')

app.use(cors())
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
//const authRouter = require("./routes/authRouter");

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
let choicesResult = {}

//résultats
let winner = {}
let egalite = false
let percentage = 0
let updateTimer = {}

//Partie status
/*
0 : pas de partie en cours
1 : partie en cours, pas de question
2 : question en cours - Votes
3 : question en cours - résultat
*/
let partieStatus = 0
let currentQuestion = {}
let test = 2
//-------------



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

  //connexion du player
  socket.on("connection-player", () => {
    console.log(socket.id, partieStatus);
    //on ne fait rien si partieStatus = 0
    if(partieStatus==1){
      io.to(socket.id).emit('update-on-co-partie-playing');
    }
    else if(partieStatus==2){
      io.to(socket.id).emit('update-on-co-question', {id:currentQuestion.id, choices:currentQuestion.choices, question:currentQuestion.question});
    }
    else if(partieStatus==3){
      io.to(socket.id).emit('update-on-co-results', totalvotes, winner, percentage, egalite, currentQuestion.id);
    }
  });
  
  //connexion du host
  socket.on("connection-host", () => {
    console.log(socket.id, 'HOST');
    if(partieStatus==2){
      io.to(socket.id).emit('update-host-on-co-question', {id:currentQuestion.id, choices:currentQuestion.choices, question:currentQuestion.question}, {total : totalvotes, votesChoice1 : nbChoice1, votesChoice2 : nbChoice2}, updateTimer);
    }
    else if(partieStatus==3){
      io.to(socket.id).emit('update-host-on-co-results', totalvotes, winner, percentage, egalite, currentQuestion.id);
    }
  });
  
  socket.on('display-question', function (question, questionStartTime, showTimerOnScreen, showDirectResultsOnScreen) {
    partieStatus = 2
    currentQuestion = question
    //Initialisation du tableaux de result
    choicesResult = Object.values(question.choices)
    //reinitialisation des votes au début de la (nouvelle) question
    totalvotes=0
    nbChoice1 = 0
    nbChoice2 = 0

    // transmission des choix pour le player
    socket.broadcast.emit('broadcast-question', {id:question.id, choices:question.choices, question:question.question})
    // transmission de la question pour le screen
    updateTimer = {start: questionStartTime, total: question.temps, showTimer : showTimerOnScreen}
    console.log('UPDATE TIMER', updateTimer)
    socket.broadcast.emit('display-question-on-screen', {question:question.question}, questionStartTime, question.temps, showTimerOnScreen, showDirectResultsOnScreen)
  })
    //TEST DISPLAY MENU ON LAUNCH PARTY 
    socket.on('affichage-menu', function (displayStatus) {
    partieStatus = 1

    socket.broadcast.emit('affiche-menu',displayStatus)
    socket.broadcast.emit('affiche-menu-on-screen',displayStatus)
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


    choicesResult = Object.assign(arrayChoices)
    
    // transmission au player de son choix (comme une sorte de confirmation après son choix)
    io.to(socket.id).emit('display-player-choice', {yourchoice:choicesPlayer.playerChoice})

    //on envoie le nombre de vote au total qui a augmenté
    //peut-être changer plus tard pour envoyer seulement à l'admin et au host, au lieu de broadcast à tout le monde
    socket.broadcast.emit('augmentation-nb-votes',{total : totalvotes, votesChoice1 : nbChoice1, votesChoice2 : nbChoice2})
  })

  //peut-être temporaire : permet de reload toutes les pages quand admin reload (utile pour developpement)
  socket.on("reload-all-pages", function(isReload){
    console.log("on est repassé sur le serveur pour reload")
    socket.broadcast.emit("reload-this-page", isReload)
  })

  socket.on("calcul-resultat", function(){
    console.log("let's get the votes not validated")
    io.emit('get-votes-not-validated')
  })
  //on affiche les résultats quand le timer est fini
  socket.on("who-is-the-winner", function(){
    console.log('ENVOYER LES RESULTATS')
    console.log(totalvotes)
    console.log(choicesResult)
    //================== TROUVE LE WINNER ==================//
      if(choicesResult[0] != null && choicesResult[1] != null){
          if(choicesResult[0].nbvotes > choicesResult[1].nbvotes){
              winner = choicesResult[0]
          }
          else if(choicesResult[0].nbvotes < choicesResult[1].nbvotes){
              winner = choicesResult[1]
          }else{
              let min = Math.ceil(1);
              let max = Math.floor(3);
              let random = Math.floor(Math.random() * (max - min)) + min;
              if(random == 1) winner = choicesResult[0]
              else if(random == 2) winner = choicesResult[1]
              egalite = true
          }
      
          //calcul pourcentage
          percentage = (winner.nbvotes/(choicesResult[0].nbvotes + choicesResult[1].nbvotes))*100;

          partieStatus = 3

          io.emit('display-final-choice', totalvotes, winner, percentage, egalite)
          io.emit('winnerChoice',winner)
          totalvotes=0 //remise à zero des votes
          nbChoice1=0
          nbChoice2=0
      }
  })

  //quand on appuie sur le bouton pour arrêter la partie depuis l'admin
  socket.on("stop-partie", function(displayStatus){
    console.log('TOUT ARRETER')
    socket.broadcast.emit('stop-partie', displayStatus)
    //on reset toutes les données
    /*messages = []
    choices = []
    questions = []
    displayQuestionData = []
    totalvotes=0
    nbChoice1 = 0
    nbChoice2 = 0
    percentage
    choicesResult = {}*/
    partieStatus = 0
    currentQuestion = {}
  })
  socket.on("stop-question", function(displayStatus){
    //on doit arrêter les question et tout remettre a zeros
    socket.broadcast.emit('stop-question',displayStatus)
    totalvotes=0
    nbChoice1 = 0
    nbChoice2 = 0

    partieStatus = 1
    winner = {}
    egalite = false
    percentage = 0
    updateTimer = {}
  })
  socket.on("menu", function(displayStatus){
    console.log("menuuu " + displayStatus)
    socket.emit("affiche-menu", displayStatus)
  })
  /*socket.on("start-partie", function(){
    //socket.broadcast.emit('start-partie')
  })*/
})