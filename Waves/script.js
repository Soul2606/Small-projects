
const grid = document.getElementById('grid')
const debug_add_force_button = document.getElementById('debug-add-force')
const debug_time = document.getElementById('time')
const debug_coordinates = document.getElementById('coordinates')
const move_up_button = document.getElementById('move-up-button')
const move_left_button = document.getElementById('move-left-button')
const move_down_button = document.getElementById('move-down-button')
const move_right_button = document.getElementById('move-right-button')

const arrows = []
const force_log = []
const max_force_log_length = 100

const global_coordinate_offset = {x:0,y:0}

const mouse_position_on_grid = {x:0,y:0}
const mouse_drag_point_position = {x:0,y:0}
const mouse_drag_point_velocity = {x:0,y:0}
let mouse_down_on_grid = false

let time = 0
let simulation_speed = 10

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
    return {x:arrow_index%20 + global_coordinate_offset.x, y:Math.floor(arrow_index/20) + global_coordinate_offset.y}
}




function softsign(x){
    return x/(Math.abs(x)+1)
}




function set_arrow_direction(arrow, direction_degree, scale){

    arrow.style.transform = 'rotate('+(direction_degree + 45 + 180)+'deg) scale('+(softsign(scale/2)*3)+')'

}




function add_force(time_when_applied, scale, x, y){

    force_log.push({time:time_when_applied, scale:scale, x:x, y:y})
    if(force_log.length > max_force_log_length){
        force_log.shift()
    }

}





debug_add_force_button.addEventListener('click',()=>{
    add_force(time, 2, 0, 0)
    console.log('added force. Force:', force_log)
})




move_up_button.addEventListener('click',()=>{
    global_coordinate_offset.y -= 1
    debug_coordinates.textContent = 'x'+global_coordinate_offset.x+' y'+global_coordinate_offset.y
})
move_left_button.addEventListener('click',()=>{
    global_coordinate_offset.x -= 1
    debug_coordinates.textContent = 'x'+global_coordinate_offset.x+' y'+global_coordinate_offset.y
})
move_down_button.addEventListener('click',()=>{
    global_coordinate_offset.y += 1
    debug_coordinates.textContent = 'x'+global_coordinate_offset.x+' y'+global_coordinate_offset.y
})
move_right_button.addEventListener('click',()=>{
    global_coordinate_offset.x += 1
    debug_coordinates.textContent = 'x'+global_coordinate_offset.x+' y'+global_coordinate_offset.y
})




grid.addEventListener('mousemove', (event)=>{

    const rect = grid.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    mouse_position_on_grid.x = x
    mouse_position_on_grid.y = y

})


grid.addEventListener('mousedown', (e)=>{
    e.preventDefault()
    mouse_drag_point_position.x = mouse_position_on_grid.x
    mouse_drag_point_position.y = mouse_position_on_grid.y
    mouse_down_on_grid = true
    console.log('mouse down', mouse_down_on_grid)
})


grid.addEventListener('mouseup', ()=>{
    mouse_down_on_grid = false
    console.log('mouse down', mouse_down_on_grid)
})


setInterval(move_mouse_drag_point_position, 100)
function move_mouse_drag_point_position(){
    if(!mouse_down_on_grid){
        return
    }
    mouse_drag_point_velocity.x = (mouse_position_on_grid.x - mouse_drag_point_position.x) / 4
    mouse_drag_point_velocity.y = (mouse_position_on_grid.y - mouse_drag_point_position.y) / 4
    mouse_drag_point_position.x += mouse_drag_point_velocity.x
    mouse_drag_point_position.y += mouse_drag_point_velocity.y

    const mouse_drag_point_position_in_game = {x:mouse_drag_point_position.x / 40, y:mouse_drag_point_position.y / 40}

    add_force(time, (Math.abs(mouse_drag_point_velocity.x) + Math.abs(mouse_drag_point_velocity.y)) / 50, mouse_drag_point_position_in_game.x, mouse_drag_point_position_in_game.y)

    console.log('total velocity', (Math.abs(mouse_drag_point_velocity.x) + Math.abs(mouse_drag_point_velocity.y)) / 50, 'position', mouse_drag_point_position_in_game.x, mouse_drag_point_position_in_game.y)
}




console.log(arrows)

let lastUpdate = Date.now()
const myInterval = setInterval(main, 100)

function main() {
    let now = Date.now()
    let dt = now - lastUpdate
    lastUpdate = now

    time += dt / 1000 * simulation_speed
    debug_time.textContent = time.toFixed(1)

    
    for (let i = 0; i < arrows.length; i++) {
        const arrow = arrows[i]
        let force_scale = 0
        for (let j = 0; j < force_log.length; j++) {
            const force = force_log[j];
            
            if(force == undefined){continue}
            const arrow_position = get_arrow_position(i)
            const arrow_distance_to_force = Math.sqrt((arrow_position.x - force.x) ** 2 + (arrow_position.y - force.y) ** 2)
            force_scale += 0 + Math.max((force.scale - Math.abs(force.time - time + arrow_distance_to_force)), 0)
            
        }
        set_arrow_direction(arrow, 0, force_scale)
    }
}