// ==================== QUESTIONS =================== //

// get a question by its id 
export async function getQuestion(axios, id) {
    const question = await axios.$get(`api/question/${id}`)
    return question
}

// get all questions 
export async function getQuestions(axios) {
    const questions = await axios.$get('/api/questions')
    return questions
}

// update a question by its id 
export async function updateQuestion(axios, id, body) {
    await axios.$put(`api/question/${id}`, JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } }).catch(error => { console.log(error) });
    const question = await axios.$get(`api/question/${id}`)
    return question
}

// add a question
export async function addQuestion(axios, body) {
    await axios.$post(`api/question`, JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } })
        .catch(error => { console.log(error) });
    const questions = await axios.$get('/api/questions')
    return questions
}

// delete a question
export async function deleteQuestion(axios, id) {
    await axios.$delete(`api/question/${id}`).catch(error => { console.log(error) })
}

// upload images on server 
export async function uploadImage(axios, form) {
    await axios.$post("/api/upload", form, { headers: { "Content-Type": "multipart/form-data" } })
        .catch(error => { console.log(error) });
}

// ==================== CONCERTS ==================== //

// get one concert by its id 
export async function getConcert(axios, id) {
    const concert = await axios.$get(`api/concert/${id}`)
    return concert
}

// get all concerts 
export async function getConcerts(axios) {
    const concerts = await axios.$get(`api/concerts`)
    return concerts
}

// add one concert 
export async function addConcert(axios, body) {
    await axios.$post(`api/concert`, JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } })
        .catch(error => { console.log(error) });
    const concerts = await axios.$get('/api/questions')
    return concerts
}


// delete one concert by its id 
export async function deleteConcert(axios, id) {
    await axios.$delete(`api/concert/${id}`).catch(error => { console.log(error) })
}

// update one concert by its id
export async function updateConcert(axios, id, body) {
    await axios.$put(`api/concert/${id}`, JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } }).catch(error => { console.log(error) });
}