export default class Choice {
    constructor(id, title, img) {
        this.id = id
        this.title = title
        this.img = img
        this.nbvotes = 0
    }

    getChoiceData() {
        const response = fetch('api/choice/' + this.id)
        const choiceData = response.json();
        return choiceData
    }
};