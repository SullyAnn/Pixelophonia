<template>
<div>
    <h1>Lancer un concert</h1>
    <p>Choisissez le concert à lancer !</p>
	<ul class="listElements">
		<li v-for="(concert, index) in concerts" :key="index">
            <NuxtLink  :to="`launcher/${concert.id}`">
                <p>{{ concert.title }}</p>
            </NuxtLink>
        </li>
    </ul>
</div>
</template>

<script>
import {getConcerts} from "@/assets/classes/Admin.js"

export default {
head : {
    title: "Lancer le concert"
}, 

async asyncData({$axios}) {
    try {
        const concerts = await getConcerts($axios)
        return {concerts}
    } 
    catch (error) {
        console.log(error)
    }
},

data() {
    return {
        concerts:[],
    }
},
}
</script>
