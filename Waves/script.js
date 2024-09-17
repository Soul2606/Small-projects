
const grid = document.getElementById('grid')
const debug_add_force_button = document.getElementById('debug-add-force')
const debug_time = document.getElementById('time')

const arrows = []
const force_log = []

const global_coordinate_offset = {x:0,y:0}

let time = 0
let simulation_speed = 0.1

for (let i = 0; i < 20*20; i++) {

    const arrow_container = document.createElement('div')
    arrow_container.className = 'arrow-container'
    grid.appendChild(arrow_container)

    const arrow = document.createElement('div')
    arrow.className = 'arrow'
    arrow.id = 'arrow'+i
    arrow_container.appendChild(arrow)

    set_arrow_direction(arrow,0,1)
    arrows.push(arrow)

}




function get_arrow_from_position(array, x, y){
    if(x > 20 || x < 0 || y > 20 || y < 0){
        return null
    }
    return array[y*20+x]
}




function get_arrow_position(arrow_index){
    if(arrow_index > 20*20 || arrow_index < 0){
        return null
    }
    return {x:arrow_index%20, y:Math.floor(arrow_index/20)}
}




function softsign(x){
    return x/(Math.abs(x)+1)
}




function set_arrow_direction(arrow, direction_degree, scale){

    arrow.style.transform = 'rotate('+(direction_degree + 45 + 180)+'deg) scale('+(softsign(scale/2)*3)+')'

}




function add_force(time_when_applied, scale, x, y){

    force_log.push({time:time_when_applied, scale:scale, x:x, y:y})

}





debug_add_force_button.addEventListener('click',()=>{
    add_force(time, 10, 0, 0)
    console.log('added force. Force:', force_log[0])
})


console.log(arrows)

let lastUpdate = Date.now()
const myInterval = setInterval(tick, 200)

function tick() {
    let now = Date.now()
    let dt = now - lastUpdate
    lastUpdate = now

    time += dt / 1000 * simulation_speed
    debug_time.textContent = time.toFixed(1)
    
    for (let i = 0; i < 1; i++) {
        const arrow = arrows[i]
        if(force_log[0] == undefined){continue}
        const arrow_position = get_arrow_position(i)
        const arrow_distance_to_force = Math.sqrt((arrow_position.x - force_log[0].x) ** 2 + (arrow_position.y - force_log[0].y) ** 2)
        const force_scale = 0 + Math.max((force_log[0].scale - Math.abs(force_log[0].time - time - arrow_distance_to_force)), 0)
        
        set_arrow_direction(arrow, 0, force_scale)
    }
}