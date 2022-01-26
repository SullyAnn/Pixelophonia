export function compareChoices(choice1, choice2){
    if(choice1.nbvotes != null && choice2.nbvotes != null){
        if(choice1.nbvotes > choice2.nbvotes){
            return choice1
        }
        else if(choice1.nbvotes < choice2.nbvotes){
            return choice2
        }else{
            //console.log('BONJOUR')
            let min = Math.ceil(1);
            let max = Math.floor(3);
            let random = Math.floor(Math.random() * (max - min)) + min;
            if(random == 1) return choice1
            else if(random == 2) return choice2
        }
    }
}

export function calculatePercentage(winnerChoice, allVotes){
    return (winnerChoice.nbvotes/allVotes)*100;
}

export default class Question{
    constructor(id, label, question, temps, choices){
        this.id = id
        this.label = label
        this.question = question
        this.choices = choices
        this.temps = temps
    }
    setId(newId){
        this.id = newId
    }

    setLabel(newLabel){
        this.label = newLabel
    }
    setQuestion(newQuestion){
        this.question = newQuestion
    }
    setChoices(newTemps){
        this.temps = newTemps
    }
    setChoices(newChoices){
        this.choices = newChoices
    }

    getChoice1(){
        if(choices.choice1 != null)return choices.choice1
        else console.log("erreur : choice1 n'existe pas dans les choix de cette question")
    }

    getChoice2(){
        if(choices.choice2 != null)return choices.choice2
        else console.log("erreur : choice2 n'existe pas dans les choix de cette question")
    }

    compareChoices(){
        if(choices.choice1 != null && choices.choice2 != null){
            if(this.choices.choice1.nbvotes > this.choices.choice2.nbvotes){
                return this.choices.choice1
            }
            else if(this.choices.choice1.nbvotes < this.choices.choice2.nbvotes){
                return this.choices.choice2
            }else{
                let min = Math.ceil(1);
                let max = Math.floor(3);
                let random = Math.floor(Math.random() * (max - min)) + min;
                if(random == 1) return this.choices.choice1
                else if(random == 2) return this.choices.choice2
            }
        }
    }

    calculatePercentage(winnerChoice){
        return (winnerChoice.nbvotes/(this.choices.choice1.nbvotes + this.choices.choice2.nbvotes))*100;
    }
};