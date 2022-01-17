<template>
    <section id = "choicePageContent">
        <client-only>
        <div id ="orBlock">
            <p >OU</p>
        </div>
        <div  id ="choicesDiv">
            <div class="choice" v-for ="(choice,index) in choices" :key="choice.id">
                <!--doit correspondre au libellé du choix n°1 de la question-->
                <h1 v-if="index == 0" style="right:0; top:0;" >{{choice.label}}</h1>
                <h1 v-else style="left:0; bottom:0;" >{{choice.label}}</h1>
                <!--doit correspondre au lien de l'image du choix n°1 de la question-->
                <a :id="index" v-if="index==0" @click="blur(choice,index)"> <img :src="require('~~/assets/images/'+choice.url)"></a>
                <a :id="index" v-else @click="blur(choice,index)" > <img :src="require('~~/assets/images/'+choice.url)"></a>-->
            </div>   
        </div>
        </client-only>


    </section>
</template>

<script>
import "@/assets/css/playerChoice.css";



export default {
    name: "homePages",
    layout : "",
    data(){
        return{
            // label = question.choice[0].label pour choix 1 par exemple
            // url = question.choice[0].url 
            choices: [
                { label:"EN VILLE", url:"city.png"},
                { label : "DANS LES MARAIS", url: "marais.jpg"}
            ],
        }
    },
    methods: {
        blur : function(test1,id){
            let newId = 0
            if(id==0){
                newId = 1 
            }
            const test = document.getElementById(newId);
            test1=test
            test1.style.filter="grayscale(1)"     
        },
    },
}



</script>
