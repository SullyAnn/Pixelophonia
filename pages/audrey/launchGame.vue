<template>
  <main id="quest">
    <h1>Questions</h1>

    <ul id="questionsList">
        <li id="1">
            <p>Libellé question</p> 
            <button id="play1" class= "btn start" @click="switchClass('play1')">
                <svg style="display:block;"
                    class="svg-icon" 
                    viewBox="0 0 1025 1024" 
                    version="1.1" 
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M1024 512l-804.0448 512L219.9552 0 1024 512z"  />
                </svg>
                <svg style="display:none;"
                    class="svg-icon" 
                    viewBox="0 0 1024 1024" 
                    version="1.1" 
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0l1024 0 0 1024L0 1024 0 0z"  />
                </svg>
            </button>
        </li>
    </ul>

    <div>
        <NuxtLink to="./">
        <button class="btn back">
        <svg class="svg-icon" 
            viewBox="0 0 1024 1024" 
            version="1.1" 
            xmlns="http://www.w3.org/2000/svg">
            <path d="M810.666667 554.666667H213.333333c-25.6 0-42.666667-17.066667-42.666666-42.666667s17.066667-42.666667 42.666666-42.666667h597.333334c25.6 0 42.666667 17.066667 42.666666 42.666667s-17.066667 42.666667-42.666666 42.666667z"  />
            <path d="M512 853.333333c-12.8 0-21.333333-4.266667-29.866667-12.8l-298.666666-298.666666c-17.066667-17.066667-17.066667-42.666667 0-59.733334l298.666666-298.666666c17.066667-17.066667 42.666667-17.066667 59.733334 0s17.066667 42.666667 0 59.733333L273.066667 512l268.8 268.8c17.066667 17.066667 17.066667 42.666667 0 59.733333-8.533333 8.533333-17.066667 12.8-29.866667 12.8z"  />
        </svg>    
        </button>
        Mettre fin au jeu</NuxtLink>
    </div>
  </main>
</template>

<script>
import "@/assets/css/admin.css";

export default {
  layout: 'adminGame',

  methods: {
    switchSVG: function (idToChange) {
      let toChange = document.getElementById(idToChange)
        Array.from(toChange.getElementsByTagName("svg")).forEach(
            function(element) {
                if (element.style.display === "block") element.style.display = "none"
                else element.style.display = "block"
            }
        );


    },
    switchColor: function (idToChange){
      let buttonsList = document.getElementById("questionsList").getElementsByClassName("btn")
      let btnToChange = document.getElementById(idToChange)

      if (btnToChange.classList.contains("start")) 
      {
        Array.from(buttonsList).forEach(
            function(element) {
                element.classList.remove("start")
                element.classList.add("cantSelect")
                element.disabled = true
            }
        );

        btnToChange.classList.remove("cantSelect")
        btnToChange.classList.add("stop")
        btnToChange.disabled = false
      }
      else 
      {
        Array.from(buttonsList).forEach(
            function(element) {
                element.classList.remove("cantSelect")
                element.classList.remove("stop")
                element.classList.add("start")
                element.disabled = false
            }
        );
      }
    },
    switchClass: function(idToChange) {
      this.switchSVG(idToChange)
      this.switchColor(idToChange)
    },
  }
};


</script>
