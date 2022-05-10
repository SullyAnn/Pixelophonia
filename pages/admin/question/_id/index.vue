<template>
  <main>
    <div class="window">
      <h1>Voir la question</h1>
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
    </div>
    <ButtonContainer
      :isReturn="true"
      linkBack="./"
      :isEdit="true"
      :linkEdit="question.id + '/update'"
    />
  </main>
</template>

<script>
import { getQuestion } from "@/assets/classes/Admin.js";

export default {
  layout: "admin",
  async asyncData({ params, $axios }) {
    try {
      const question = await getQuestion($axios, params.id);
      return { question };
    } catch (error) {
      console.log(error);
    }
  },
};
</script>