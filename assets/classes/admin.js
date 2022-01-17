export default class Admin {
    constructor (password, mail) {
        this.password = password
        this.mail = mail
    }

    //redirige vers la page liste questions de la partie création
    startCreation() {
        this.$router.push('/')
    }

    //chercher les questions
    getQuestions() {
        fetch('api/questions')
        .then( response => response.json())
		.then( data => {
            //data contient la réponse en json
            console.log(data);
		})
        .catch(error => {console.log(error)});
    }

    //redirige vers la page de formulaire de question vide
    addQuestion() {
        this.$router.push('/formulaire')
    }

    //ajoute une question dans la BDD
    addAndRefreshQuestion(labelForm, questionForm) {
        const form = {
            label : labelForm,
            question: questionForm,
        }
        fetch('api/question', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)})
        .catch(error => { console.log(error) });
    }

    //supprime une question de la bdd
    deleteQuestion(idQuestion) {
        fetch('api/question/'+idQuestion, {method: 'DELETE'})
        .catch(error => { console.log(error) });
    }

    //redirige vers formulaire complété
    updateQuestion(idQuestion) {
        this.$router.push('/update/'+idQuestion)
    }

    //le formulaire est envoyé dans la bdd
    updateAndRefreshQuestion(idQuestion, labelForm, questionForm) {
        const form = {
            label : labelForm,
            question: questionForm,
        }
        fetch('api/question/'+idQuestion, {
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
        .catch(error => { console.log(error) });
    }
}