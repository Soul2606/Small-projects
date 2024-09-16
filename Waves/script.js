
const grid = document.getElementById('grid')
const debug_add_force_button = document.getElementById('debug-add-force')

const arrows = []

const global_coordinate_offset = {x:0,y:0}

let time = 0
let simulation_speed = 0.004

for (let i = 0; i < 20*20; i++) {

    grid.innerHTML += '<div class="arrow-container"><div class="arrow up" id="arrow'+(i)+'"></div></div>'
    set_arrow_direction(document.getElementById('arrow'+i),0,0)
    arrows.push({element:document.getElementById('arrow'+i), x:i%20, y:Math.floor(i/20)})

}

function softsign(x){
    return x/(Math.abs(x)+1)
}

function set_arrow_direction(arrow, direction_degree, scale){

    arrow.style.transform = 'rotate('+(direction_degree + 45 + 180)+'deg) scale('+(softsign(scale/2)*3)+')'

}

console.log(arrows)

setInterval(main)

function main(){
    time += simulation_speed
    console.log(time)
}