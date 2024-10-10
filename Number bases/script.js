
const base_input = document.getElementById('base')
const symbol_input = document.getElementById('symbol')
const submit_button = document.getElementById('submit')

let base = 10
let symbols = 10




submit_button.addEventListener('click', ()=>{
    base = Number.parseFloat(base_input.value)
    symbols = Number.parseFloat(symbol_input.value)
})




function alphabetic_count(value){
    if (!Number.isInteger(value) || value < 1) {
        return ''
    }
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'
    let results = ''
    value -= 1
    while (value >= 0) {
        results = alphabet[value % alphabet.length] + results
        value = Math.floor(value / alphabet.length) - 1
    }
    return results
}




function base_convert(value, base){
    if (!Number.isInteger(value) || base < 2) {
        return ''
    }
    if (value === 0) {
        return '0'
    }
    let is_negative = false
    if (value < 0) {
        is_negative = true
        value = Math.abs(value)
    }
    const digits = []
    for (let i = 0; i < Math.min(base, 10); i++) {
        digits.push(String(i))
    }
    if (base > 10) {
        for (let i = 1; i <= base - 10; i++) {
            digits.push(alphabetic_count(i))
        }
    }
    let results = is_negative? '-': '';
    while (value >= 1) {
        results = digits[value % digits.length] + results
        value = Math.floor(value / digits.length)
    }
    return results
}




function value_of_number_from_base(value, base){
    let results = 0
    const length_after_dot = String(value).length - String(Math.floor(value)).length - 1
    console.log(length_after_dot)
    for (let i = 0; i < value.length; i++) {
        const element = value[i]
        results += base ** (value.length - i - 1) * element
    }
    return results
}




for (let i = 0; i < 2 ** 7 + 1; i++) {    
    console.log(value_of_number_from_base(i / 100, 1.5), i / 100)
}

