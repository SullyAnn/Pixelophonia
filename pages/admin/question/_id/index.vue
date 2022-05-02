<template>
  <div class="window">
    <h2>{{ question.label }}</h2>
    <h3>{{ question.question }}</h3>

    <div class="choices2">
		
      <fieldset>
        <legend>Choix n°1</legend>
        <p class="labelChoice">{{ question.choices[0].title }}</p>
        <div class="viewImg">
          <img
            :src="
              require(`assets/images/Question_${question.id}/${question.choices[0].img}`)
            "
            id="display2"
          />
        </div>
      </fieldset>

      <fieldset>
        <legend>Choix n°2</legend>
        <p class="labelChoice">{{ question.choices[1].title }}</p>
        <div class="viewImg">
          <img
            :src="
              require(`assets/images/Question_${question.id}/${question.choices[1].img}`)
            "
            id="display2"
          />
        </div>
      </fieldset>
    </div>

    <NuxtLink to="./">Revenir à la liste</NuxtLink>
  </div>
</template>

<script>
import { getQuestion } from "@/assets/classes/Admin.js";

export default {
  async asyncData({ params, $axios }) {
    const question = await getQuestion($axios, params.id);
    return { question };
  },
};
</script>