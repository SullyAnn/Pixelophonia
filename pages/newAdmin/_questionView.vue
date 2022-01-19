<template>
  <div class="window">
    <h2>{{ question.label }}</h2>

	<h3>{{ question.question }}</h3>

	<div class="choices2">
		<fieldset>
			<legend>Choix n°1</legend>
			<p class="labelChoice"> {{question.choices[0].title}} </p>
			<img :src="require(`assets/images/${question.choices[0].img}`)">
		</fieldset>

		<fieldset>
			<legend>Choix n°2</legend>
			<p class="labelChoice"> {{question.choices[1].title}} </p>
			<img :src="require(`assets/images/${question.choices[1].img}`)">
		</fieldset>
	</div>

    <NuxtLink to="./creation">Revenir à la liste</NuxtLink>
  </div>
</template>

<script>
import {getQuestion, updateQuestion} from "@/assets/classes/Admin.js"

export default {


	/* 	------------------------------------------------
		va chercher les données de la question
		et les garde dans les datas (dans question[]) 
	   	avant de render la page (du côté du serveur
	  ------------------------------------------------ */
    async asyncData({ params, $axios }) { 
		// const question = await $axios.$get(`api/question/${params.question}`)
		const question = await getQuestion($axios, params.question)
		return {question}
    },

    methods: {

	},
}
</script>