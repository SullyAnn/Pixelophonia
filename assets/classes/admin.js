export async function getQuestion(axios, id){
    const question = await axios.$get(`api/question/${id}`)
    return question
}

export async function getQuestions(axios){
    const questions = await axios.$get('/api/questions')
    return questions
}

export async function updateQuestion(axios, id, body){
    await axios.$put(`api/question/${id}`, JSON.stringify(body), {headers: { 'Content-Type': 'application/json' }}).catch(error => { console.log(error) });
}

export async function addQuestion(axios, body){
    await axios.$post(`api/question`, JSON.stringify(body), {headers: { 'Content-Type': 'application/json' }})
    .catch(error => { console.log(error) }); 
}

export async function deleteQuestion(axios, id){
    await axios.$delete(`api/question/${id}`).catch(error => { console.log(error) })
}