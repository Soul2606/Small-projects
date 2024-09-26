
const grid = document.getElementById('grid')
const debug_force_log = document.getElementById('force-log')
const debug_show_button = document.getElementById('debug-show')
const debug_hide_button = document.getElementById('debug-hide')
const debug_pause_button = document.getElementById('debug-pause')
const debug_play_button = document.getElementById('debug-play')
const debug_step_button = document.getElementById('debug-step')
const debug_add_force_button = document.getElementById('debug-add-force')
const debug_add_force_left_button = document.getElementById('debug-add-force-left')
const debug_add_force_right_button = document.getElementById('debug-add-force-right')
const debug_time = document.getElementById('time')
const debug_coordinates = document.getElementById('coordinates')
const simulation_speed_slider = document.getElementById('simulation-speed-slider')
const simulation_speed_label = document.getElementById('simulation-speed-label')
const move_up_button = document.getElementById('move-up-button')
const move_left_button = document.getElementById('move-left-button')
const move_down_button = document.getElementById('move-down-button')
const move_right_button = document.getElementById('move-right-button')
const mode_water_button = document.getElementById('mode-water-button')
const mode_light_button = document.getElementById('mode-light-button')

const arrows = []
const force_log = []
const max_force_log_length = 100

const global_coordinate_offset = {x:0,y:0}

const mouse_position_on_grid = {x:0,y:0}
const mouse_drag_point_position = {x:0,y:0}
const mouse_drag_point_velocity = {x:0,y:0}
let mouse_down_on_grid = false

let simulation_mode = 0

let time = 0
const default_simulation_speed = 10
let simulation_speed = default_simulation_speed

let debug_show_grid_info_enabled = false

let debug_selected_arrow = null



// Generate grid
for (let i = 0; i < 20*20; i++) {

    const arrow_container = document.createElement('div')
    arrow_container.className = 'arrow-container'
    grid.appendChild(arrow_container)

    const arrow = document.createElement('div')
    arrow.className = 'arrow'
    arrow.id = 'arrow'+i
    arrow_container.appendChild(arrow)

    //Debug stuff
    const debug_number = document.createElement('p')
    debug_number.className = 'debug-arrow-info debug'
    debug_number.id = 'debug-arrow-info'+i
    debug_number.style.display = 'none'
    arrow_container.appendChild(debug_number)

    set_arrow_direction(arrow,0,1)
    arrows.push(arrow)

}




class Vector2D {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    is_NaN(){
        return isNaN(this.x) || isNaN(this.y)
    }

    add(value) {
        if(value instanceof Vector2D){
            this.x += value.x
            this.y += value.y
        }    
    }

    multiply(value) {
        if(value instanceof Vector2D){
            this.x *= value.x
            this.y *= value.y
        }else{
            this.x *= value
            this.y *= value
        }
    }

    subtract(value) {
        if(value instanceof Vector2D){
            this.x /= value.x
            this.y /= value.y
        }    
    }

    magnitude(){
        return Math.sqrt(this.x ** 2 + this.y ** 2)
    }

    normalize(){
        const magnitude = this.magnitude()
        if(magnitude !== 0){
            this.x /= magnitude
            this.y /= magnitude
        }
    }

    dot(vector){
        return this.x * vector.x + this.y * vector.y
    }

    angle(vector){
        if(vector === undefined){
            return Math.atan2(this.x, this.y)
        }else{
            return Math.acos(this.dot(vector) / (this.magnitude() * vector.magnitude()))
        }
    }

    angle_sim(vector){
        return this.angle(vector) / Math.PI
    }

}




function relu(value) {
    return Math.max(value, 0)
}




function remove_all_children(element){
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
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




function add_force(time_when_applied, scale, x, y, velocityX, velocityY){

    force_log.push({time:time_when_applied, scale:scale, x:x, y:y, velocityX:velocityX, velocityY:velocityY})
    if(force_log.length > max_force_log_length){
        force_log.shift()
    }

    update_force_log(force_log)
}




function update_force_log(log, influences){
    remove_all_children(debug_force_log)
    for (let i = 0; i < log.length; i++) {
        const force = log[log.length - i - 1];
        
        const force_info_element = document.createElement('p')
        force_info_element.textContent = 't:' + force.time.toFixed(1) + ' | s:' + force.scale.toFixed(1) + ' | pos:' + force.x.toFixed(1) + ',' + force.y.toFixed(1) + ' | vel:' + force.velocityX.toFixed(1) + ',' + force.velocityY.toFixed(1)
        if(influences !== undefined){
            force_info_element.textContent += ' | dt-inf:' + influences[influences.length - i - 1].toFixed(1)
        }
        debug_force_log.appendChild(force_info_element)
    }
}




debug_show_button.addEventListener('click', ()=>{
    debug_show_grid_info_enabled = true
    debug_selected_arrow = null
    const info_text = document.getElementsByClassName('debug')
    for (let i = 0; i < info_text.length; i++) {
        const element = info_text[i];
        element.style = 'display: block;'
    }
})
debug_hide_button.addEventListener('click', ()=>{
    debug_show_grid_info_enabled = false
    debug_selected_arrow = null
    const info_text = document.getElementsByClassName('debug')
    for (let i = 0; i < info_text.length; i++) {
        const element = info_text[i];
        element.style = 'display: none;'
    }
})


debug_pause_button.addEventListener('click', ()=>{
    simulation_speed = 0
})
debug_play_button.addEventListener('click', ()=>{
    simulation_speed = default_simulation_speed
})
debug_step_button.addEventListener('click', ()=>{
    time++
})


simulation_speed_slider.addEventListener('input', ()=>{

    simulation_speed = simulation_speed_slider.value
    
    simulation_speed_label.textContent = simulation_speed
})


debug_add_force_button.addEventListener('click',()=>{
    add_force(time, 2, 0, 0, 0, 1)
})
debug_add_force_left_button.addEventListener('click',()=>{
    add_force(time, 2, 0, 0, -1, 0)
})
debug_add_force_right_button.addEventListener('click',()=>{
    add_force(time, 2, 0, 0, 1, 0)
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


for (let i = 0; i < document.getElementsByClassName('debug-arrow-info').length; i++) {
    const element = document.getElementsByClassName('debug-arrow-info')[i];
    
    element.addEventListener('click', ()=>{
        console.log(element, 'clicked', element.parentNode.firstChild, 'set as selected arrow')
        debug_selected_arrow = element.parentNode.firstChild
    })
}




grid.addEventListener('mousemove', (e)=>{

    const rect = grid.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    mouse_position_on_grid.x = x
    mouse_position_on_grid.y = y

})


grid.addEventListener('mousedown', (e)=>{
    if(debug_show_grid_info_enabled){return}
    e.preventDefault()
    mouse_drag_point_position.x = mouse_position_on_grid.x
    mouse_drag_point_position.y = mouse_position_on_grid.y
    mouse_down_on_grid = true
    console.log('mouse down', mouse_down_on_grid)
})


grid.addEventListener('mouseup', ()=>{
    mouse_down_on_grid = false
    console.log('mouse up', mouse_down_on_grid)
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

    const mouse_drag_point_position_in_game = {x:mouse_drag_point_position.x / 40 + global_coordinate_offset.x, y:mouse_drag_point_position.y / 40 + global_coordinate_offset.y}

    add_force(time, (Math.abs(mouse_drag_point_velocity.x) + Math.abs(mouse_drag_point_velocity.y)) / 50, mouse_drag_point_position_in_game.x, mouse_drag_point_position_in_game.y, mouse_drag_point_velocity.x, mouse_drag_point_velocity.y)

    //console.log('total velocity', (Math.abs(mouse_drag_point_velocity.x) + Math.abs(mouse_drag_point_velocity.y)) / 50, 'position', mouse_drag_point_position_in_game.x, mouse_drag_point_position_in_game.y)
}




console.log(arrows)

let lastUpdate = Date.now()
const myInterval = setInterval(main, 50)

function main() {
    let now = Date.now()
    let dt = now - lastUpdate
    lastUpdate = now

    time += dt / 1000 * simulation_speed
    debug_time.textContent = time.toFixed(1)
    
    
    for (let i = 0; i < arrows.length; i++) {
        const arrow = arrows[i]
        let force_scale = 0
        let force_direction = new Vector2D(0,0)
        let distance_and_time_influence_from_each_force = []
        
        for (let j = 0; j < force_log.length; j++) {
            const force = force_log[j];

            if(force == 0 || force == undefined || force == '' || force == {}){continue}

            const arrow_position = get_arrow_position(i)
            const arrow_distance_to_force = Math.sqrt((arrow_position.x - force.x) ** 2 + (arrow_position.y - force.y) ** 2)
            const scale_by_distance_and_time = relu((force.scale - Math.abs(force.time - time + arrow_distance_to_force)))
            let velocity_angle_difference = 1 - (new Vector2D(arrow_position.x - force.x, arrow_position.y - force.y).angle_sim(new Vector2D(force.velocityX, force.velocityY)))
            velocity_angle_difference = isNaN(velocity_angle_difference)? 0: velocity_angle_difference
            force_scale += scale_by_distance_and_time * velocity_angle_difference

            distance_and_time_influence_from_each_force.push(scale_by_distance_and_time)
            
            let velocity_direction = new Vector2D(force.velocityX, -force.velocityY)
            if(velocity_direction.is_NaN()){
                velocity_direction.x = 0
                velocity_direction.y = 0
            }
            velocity_direction.normalize()
            velocity_direction.multiply(scale_by_distance_and_time)
            force_direction.add(velocity_direction)
        }
        set_arrow_direction(arrow, force_direction.angle() * 180 / Math.PI, force_scale)

        //Debug stuff
        document.getElementById('debug-arrow-info'+i).textContent = 'a:'+(force_direction.angle()*180/Math.PI).toFixed(1)+' s:'+force_scale.toFixed(1)
        
        if(arrow === debug_selected_arrow){
            update_force_log(force_log, distance_and_time_influence_from_each_force)
        }
    }
}