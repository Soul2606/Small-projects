const answer_button_0 = document.getElementById('answer-button-0')
const answer_button_1 = document.getElementById('answer-button-1')
const answer_button_2 = document.getElementById('answer-button-2')
const answer_button_3 = document.getElementById('answer-button-3')
const answer_button_4 = document.getElementById('answer-button-4')
const answer_button_5 = document.getElementById('answer-button-5')
const answer_button_6 = document.getElementById('answer-button-6')
const answer_button_7 = document.getElementById('answer-button-7')
const answer_button_8 = document.getElementById('answer-button-8')
const answer_button_9 = document.getElementById('answer-button-9')
const problem_paragraph = document.getElementById('problem')

let left
let right
let operator
const stop_flash = {stop:true}

answer_button_0.addEventListener('click', ()=>{
    submit_answer(0, answer_button_0.firstElementChild)
})
answer_button_1.addEventListener('click', ()=>{
    submit_answer(1, answer_button_1.firstElementChild)
})
answer_button_2.addEventListener('click', ()=>{
    submit_answer(2, answer_button_2.firstElementChild)
})
answer_button_3.addEventListener('click', ()=>{
    submit_answer(3, answer_button_3.firstElementChild)
})
answer_button_4.addEventListener('click', ()=>{
    submit_answer(4, answer_button_4.firstElementChild)
})
answer_button_5.addEventListener('click', ()=>{
    submit_answer(5, answer_button_5.firstElementChild)
})
answer_button_6.addEventListener('click', ()=>{
    submit_answer(6, answer_button_6.firstElementChild)
})
answer_button_7.addEventListener('click', ()=>{
    submit_answer(7, answer_button_7.firstElementChild)
})
answer_button_8.addEventListener('click', ()=>{
    submit_answer(8, answer_button_8.firstElementChild)
})
answer_button_9.addEventListener('click', ()=>{
    submit_answer(9, answer_button_9.firstElementChild)
})




async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms || DEF_DELAY));
}

function generate_problem(){
    left = Number.parseInt(Math.random() * 8) + 1
    right = Number.parseInt(Math.random() * 8) + 1 
    operator = Math.random() < 0.5? '+': '-'
    problem_paragraph.textContent = 'mod(|'+left+' '+operator+' '+right+'|)'
}

function submit_answer(answer, element){
    if(operator === '+'){
        console.log(answer === Math.abs(left + right) % 10)
        flash(element, true)
    }else{
        console.log(answer === Math.abs(left - right) % 10)
        flash(element, false)
    }
    generate_problem()
}

async function flash(element, green) {

    if(green){
        element.style.color = 'rgb(0,255,0)'
    }else{
        element.style.color = 'rgb(255,0,0)'
    }
    for (let i = 0; i < 255; i++) {
        await sleep(5)
        
        if (green) {
            element.style.color = 'rgb('+i+',255,'+i+')'
        }else{
            element.style.color = 'rgb(255,'+i+','+i+')'
        }
    }
}

generate_problem()
