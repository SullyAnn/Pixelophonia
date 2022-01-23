<!-- Ajouter un concert -->

<template>
<div>

    <form @submit.prevent="handleSubmit">
        <input type="text" v-model="title">
        <div v-for="(question, index) in questions" :key="index">
        <input type="checkbox" :id="question.id" name="questionsList">
        <label :for="question.id">{{question.label}}</label>
        </div>
        <input type="submit">
    </form>
    <NuxtLink to="./">Revenir à la liste (sans sauvegarder)</NuxtLink>

</div>  
</template>

<script>
import {getQuestions, addConcert} from "@/assets/classes/Admin.js"
import "@/assets/css/admin.css";

export default {
name: 'Concerts',
created() {
},

async asyncData({$axios}) {
    try {
        const questions = await getQuestions($axios)

        return {questions}
    } 
    catch (error) {
        console.log(error)
    }
},

data() {
    return {
        // afficher la liste des concerts 
        listOfConcerts:[],

        // form d'ajout 
        title:      '',
        questions:  [],
    }
},

beforeMount() {
},

methods: {    
    handleSubmit: async function (e) {
        e.preventDefault()
        let tabCheckedQuestions = []

        this.questions.forEach(element => {
            if (document.getElementById(element.id).checked == true)
            {
                tabCheckedQuestions.push(element)
            }
        });

        const body = {
            title: this.title,
            questions: tabCheckedQuestions,
        }
      const concerts = await addConcert(this.$axios, body)
      this.$router.push('./')
    }
},
}

</script>