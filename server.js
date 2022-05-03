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

app.use("/player", nuxt.render);
app.use("/admin", nuxt.render);
app.use("/host", nuxt.render);

// Listen the server
server.listen(port, '0.0.0.0')
console.log('Server listening on localhost:' + port) // eslint-disable-line no-console

// Socket.io
const choices = []
const questions = []
const displayQuestionData = []
let totalvotes = 0
let nbChoice1 = 0
let nbChoice2 = 0
let choicesResult = {}

//résultats
let winner = {}
let egalite = false
let percentage = 0
let updateTimer = {}
let updateShowDirectResults = false
    // PARTIE STATUS
    /*
        0 : pas de partie en cours
        1 : partie en cours, pas de question
        2 : question en cours - Votes
        3 : question en cours - résultat
    */

let partieStatus = 0
let currentQuestion = {}


// ====================================================== //

function resetVotes() {
    totalvotes = 0;
    nbChoice1 = 0;
    nbChoice2 = 0;
}

io.on('connection', (socket) => {
    socket.on('last-questions', function(fn) {
        fn(questions.slice(-5))
    })
    socket.on('last-choices', function(fn) {
        fn(choices)
    })
    socket.on('data-for-screen', function(fn) {
        fn(displayQuestionData)
    })

    // Connexion du player
    socket.on("connection-player", () => {
        switch (partieStatus) {
            case 1:
                io.to(socket.id).emit('update-on-co-partie-playing');
                break;
            case 2:
                io.to(socket.id).emit('update-on-co-question', {
                    id: currentQuestion.id,
                    choices: currentQuestion.choices,
                    question: currentQuestion.question
                });
                break;
            case 3:
                io.to(socket.id).emit('update-on-co-results', {
                    id: currentQuestion.id,
                    totalVotes: totalvotes,
                    winnerChoice: winner,
                    percentage: percentage,
                    isEgalite: egalite
                });
                break;
            default:
                break;
        }

    });

    // Connexion du host
    socket.on("connection-host", () => {
        switch (partieStatus) {
            case 2:
                io.to(socket.id).emit('update-host-on-co-question', {
                        id: currentQuestion.id,
                        choices: currentQuestion.choices,
                        question: currentQuestion.question
                    }, {
                        total: totalvotes,
                        votesChoice1: nbChoice1,
                        votesChoice2: nbChoice2,
                        displayDirectResults: updateShowDirectResults
                    },
                    updateTimer);
                break;
            case 3:
                io.to(socket.id).emit('update-host-on-co-results', {
                    idQuestion: currentQuestion.id,
                    totalVotes: totalvotes,
                    winnerChoice: winner,
                    percentage: percentage,
                    isEgalite: egalite
                });
                break;
            default:
                break;
        }
    });

    socket.on('display-question', function(question, questionStartTime, showTimerOnScreen, showDirectResultsOnScreen) {
        partieStatus = 2;
        currentQuestion = question;
        //Initialisation du tableaux de result
        choicesResult = Object.values(question.choices);
        resetVotes();

        // transmission des choix pour le player
        socket.broadcast.emit('broadcast-question', {
            id: question.id,
            choices: question.choices,
            question: question.question
        });

        // transmission de la question pour le screen
        updateTimer = {
            start: questionStartTime,
            total: question.temps,
            showTimer: showTimerOnScreen
        };

        updateShowDirectResults = showDirectResultsOnScreen;

        socket.broadcast.emit('display-question-on-screen', {
                start: questionStartTime,
                total: question.temps,
                showTimer: showTimerOnScreen
            },
            showDirectResultsOnScreen);
    })

    //TEST DISPLAY MENU ON LAUNCH PARTY 
    socket.on('affichage-menu', function(displayStatus) {
        partieStatus = 1;
        socket.broadcast.emit('affiche-menu', displayStatus);
        socket.broadcast.emit('affiche-menu-on-screen', displayStatus);
    })

    socket.on('submit-choice', function(choicesPlayer) {
        //conversion de l'objet en tableau : c'est plus simple pour récupérer les éléments par leur index respectif
        const arrayChoices = Object.values(choicesPlayer.choices);
        totalvotes++;

        choicesPlayer.choices.find((elem) => elem.id == choicesPlayer.playerChoice).nbvotes++;

        nbChoice1 += arrayChoices.at(0).nbvotes;
        nbChoice2 += arrayChoices.at(1).nbvotes;

        arrayChoices.at(0).nbvotes = nbChoice1;
        arrayChoices.at(1).nbvotes = nbChoice2;

        choicesPlayer.choices = Object.assign(arrayChoices) // reconversion en objet


        choicesResult = Object.assign(arrayChoices)

        // transmission au player de son choix (comme une sorte de confirmation après son choix)
        // io.to(socket.id).emit('display-player-choice', { yourchoice: choicesPlayer.playerChoice })

        //on envoie le nombre de vote au total qui a augmenté
        //peut-être changer plus tard pour envoyer seulement à l'admin et au host, au lieu de broadcast à tout le monde
        socket.broadcast.emit('augmentation-nb-votes', { total: totalvotes, choice1: nbChoice1, choice2: nbChoice2 })
    })

    // Tout reload quand admin reload
    socket.on("reload-all-pages", function() {
        socket.broadcast.emit("reload-this-page")
    })

    //on affiche les résultats quand le timer est fini
    socket.on("calcul-resultat", function() {
        //================== TROUVE LE WINNER ==================//
        if (choicesResult[0] != null && choicesResult[1] != null) {
            if (choicesResult[0].nbvotes > choicesResult[1].nbvotes) {
                winner = choicesResult[0]
            } else if (choicesResult[0].nbvotes < choicesResult[1].nbvotes) {
                winner = choicesResult[1]
            } else {
                let min = Math.ceil(1);
                let max = Math.floor(3);
                let random = Math.floor(Math.random() * (max - min)) + min;
                if (random == 1) winner = choicesResult[0]
                else if (random == 2) winner = choicesResult[1]
                egalite = true
            }

            //calcul pourcentage
            percentage = (winner.nbvotes / (choicesResult[0].nbvotes + choicesResult[1].nbvotes)) * 100;

            partieStatus = 3

            io.emit('display-final-choice', {
                totalVotes: totalvotes,
                winnerChoice: winner,
                percentage: percentage,
                isEgalite: egalite
            });
            io.emit('winnerChoice', winner);
            resetVotes();
        }
    })

    //quand on appuie sur le bouton pour arrêter la partie depuis l'admin
    socket.on("stop-partie", function(displayStatus) {
        socket.broadcast.emit('stop-partie', displayStatus)
        partieStatus = 0
        currentQuestion = {}
    });

    socket.on("stop-question", function(displayStatus) {
        //on doit arrêter les question et tout remettre a zero
        socket.broadcast.emit('stop-question', displayStatus)
        resetVotes();

        partieStatus = 1
        winner = {}
        egalite = false
        percentage = 0
        updateTimer = {}
        updateShowDirectResults = false
    });

    socket.on("menu", function(displayStatus) {
        socket.emit("affiche-menu", displayStatus)
    });
})