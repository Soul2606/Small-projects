const input_element = document.getElementById('input-number')
const output_element = document.getElementById('output-number')
const add_button_element = document.getElementById('add-button')
const set_button_element = document.getElementById('set-button')
let log_value = 0
output_element.textContent = log_value

add_button_element.addEventListener('click',()=>{
    const input = Number(input_element.value)
    console.log(input, Math.log10(input))
    log_value += input
    output_element.textContent = Math.log10(log_value)
})
