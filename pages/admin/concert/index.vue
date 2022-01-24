<!-- liste de tous les concerts -->

<template>
<div>
    <h1>Gestion des concerts</h1>
	<ul class="listElements">
		<li v-for="(concert, index) in concerts" :key="index">
            <NuxtLink  :to="`./${concert.id}`">
                <p>{{ concert.title }}</p>
            </NuxtLink>

		<button v-on:click="deleteAConcert(concert.id)" class="btn delete">
		<svg class="svg-icon" 
			viewBox="0 0 1024 1024" 
			version="1.1" 
			xmlns="http://www.w3.org/2000/svg">
			<path d="M850.517333 382.378667l-35.392 495.402666c-4.117333 57.6-53.333333 103.552-110.933333 103.552H319.786667c-57.706667 0-106.816-45.802667-110.933334-103.552L173.482667 382.378667A106.837333 106.837333 0 0 1 85.333333 277.333333v-42.666666a106.730667 106.730667 0 0 1 103.850667-106.624l138.005333-17.28A106.730667 106.730667 0 0 1 426.730667 42.666667h170.538666a106.858667 106.858667 0 0 1 99.52 68.117333l138.026667 17.258667A106.816 106.816 0 0 1 938.666667 234.666667v42.666666a106.730667 106.730667 0 0 1-88.149334 105.045334zM259.157333 384l34.837334 487.701333c0.938667 13.141333 12.906667 24.298667 25.813333 24.298667H704.213333c12.8 0 24.896-11.306667 25.813334-24.298667L764.842667 384H259.157333z m316.992 124.458667a42.666667 42.666667 0 1 1 85.034667 7.082666l-21.333333 256a42.666667 42.666667 0 1 1-85.034667-7.082666l21.333333-256z m-213.333333 7.082666a42.666667 42.666667 0 1 1 85.034667-7.082666l21.333333 256a42.666667 42.666667 0 1 1-85.034667 7.082666l-21.333333-256zM192.149333 213.333333C180.266667 213.333333 170.666667 222.912 170.666667 234.666667v42.666666c0 11.690667 9.642667 21.333333 21.482666 21.333334h639.701334C843.733333 298.666667 853.333333 289.088 853.333333 277.333333v-42.666666c0-11.690667-9.642667-21.333333-21.482666-21.333334a42.666667 42.666667 0 0 1-5.312-0.32l-170.496-21.333333A42.666667 42.666667 0 0 1 618.666667 149.333333c0-11.712-9.621333-21.333333-21.397334-21.333333h-170.538666A21.333333 21.333333 0 0 0 405.333333 149.333333a42.666667 42.666667 0 0 1-37.376 42.346667l-170.496 21.333333a42.666667 42.666667 0 0 1-5.312 0.32z"  />
		</svg>                
		</button>
		</li>
	</ul>

    <NuxtLink to="../" class="creationGoBackContainer">
      <div class="goBack">
        <button class="btn back">
          <svg class="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M810.666667 554.666667H213.333333c-25.6 0-42.666667-17.066667-42.666666-42.666667s17.066667-42.666667 42.666666-42.666667h597.333334c25.6 0 42.666667 17.066667 42.666666 42.666667s-17.066667 42.666667-42.666666 42.666667z" />
            <path
              d="M512 853.333333c-12.8 0-21.333333-4.266667-29.866667-12.8l-298.666666-298.666666c-17.066667-17.066667-17.066667-42.666667 0-59.733334l298.666666-298.666666c17.066667-17.066667 42.666667-17.066667 59.733334 0s17.066667 42.666667 0 59.733333L273.066667 512l268.8 268.8c17.066667 17.066667 17.066667 42.666667 0 59.733333-8.533333 8.533333-17.066667 12.8-29.866667 12.8z" />
          </svg>
        </button>
        Retour
      </div>
    </NuxtLink>

    <NuxtLink to="./add">
      <button class="btn add">
        <svg class="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M914.049331 467.620233 554.92923 467.620233 554.92923 108.498086c0-24.334221-19.72525-44.028772-44.031842-44.028772-24.303522 0-44.031842 19.694551-44.031842 44.028772l0 359.122147L107.743398 467.620233c-24.303522 0-44.030819 19.72832-44.030819 44.031842 0 24.337291 19.727297 44.033889 44.030819 44.033889l359.122147 0 0 359.119077c0 24.335245 19.72832 44.031842 44.031842 44.031842 24.306592 0 44.031842-19.696598 44.031842-44.031842l0-359.119077 359.120101 0c24.305569 0 44.031842-19.696598 44.031842-44.033889C958.082196 487.348554 938.354899 467.620233 914.049331 467.620233z" />
        </svg>
      </button>
    </NuxtLink>

</div>  
</template>

<script>
import {getQuestions, getConcert, getConcerts, deleteConcert, addConcert} from "@/assets/classes/Admin.js"
import "@/assets/css/admin.css";

export default {
name: 'Concerts',
created() {
},

async asyncData({$axios}) {
    try {
        const concerts = await getConcerts($axios)
        const questions = await getQuestions($axios)
        const unConcert = await getConcert($axios, 6)

        return {concerts, questions, unConcert}
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
    deleteAConcert: async function (idConcert){
		await deleteConcert(this.$axios, idConcert)
		this.concerts = await getConcerts(this.$axios)
    },
    
    handleSubmit: async function (e) {
        // e.preventDefault()
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
    //   location.reload() // recharger la page pour maj la liste  
    }
},
}

</script>