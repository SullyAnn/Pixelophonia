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
  created() {
    this.$forceUpdate();
  }
};
</script>

<style scoped>
.window {
  width: 60vw;
  text-align: center;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
}

.choices2 {
  display: flex;
  align-items: center;
  justify-content: stretch;
  margin: 20px;
}

.choices2 fieldset {
  height: 100%;
  flex: 1;
  display: flex;
  flex-flow: column;
  margin: auto;
  align-items: center;
  justify-content: center;
}

h1 {
  width: auto;
}

h2 {
  background: #3d4d7c;
  color: #fff;
  padding: 15px;
  border-radius: 13px;
}

.viewImg {
  display: flex;
  flex-flow: column;
  justify-content: center;
  overflow: hidden;
  object-fit: contain;
  text-align: center;
  max-height: 120px;
}

.viewImg img {
  width: 100%;
}

.labelQuestion {
  background: rgba(255, 255, 255, 0.5);
  padding: 5px;
  border-radius: 11px;
  border: 0;
}

@media screen and (max-width: 1024px) {
  .window {
    width: 80vw;
  }
}

@media screen and (max-width: 768px) {
  .choices2 {
    flex-direction: column;
    align-items: stretch;
    justify-content: stretch;
  }
  .choices2 fieldset {
    margin: 0;
  }
}
</style>