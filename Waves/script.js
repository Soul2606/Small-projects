
const grid = document.getElementById('grid')
const tools_menu = document.getElementById('tools-menu')
const objects_menu = document.getElementById('objects-menu')
const objects_list = document.getElementById('objects-list')
const debug_force_log = document.getElementById('force-log')
const debug_show_button = document.getElementById('debug-show')
const debug_hide_button = document.getElementById('debug-hide')
const debug_pause_button = document.getElementById('debug-pause')
const debug_play_button = document.getElementById('debug-play')
const debug_step_button = document.getElementById('debug-step')
const debug_add_force_button = document.getElementById('debug-add-force')
const debug_add_force_left_button = document.getElementById('debug-add-force-left')
const debug_add_force_right_button = document.getElementById('debug-add-force-right')
const add_oscillator_button = document.getElementById('add-oscillator')
const resolution_20_button = document.getElementById('resolution-20')
const resolution_40_button = document.getElementById('resolution-40')
const show_tools_menu_button = document.getElementById('show-tools-menu-button')
const show_objects_menu_button = document.getElementById('show-objects-menu-button')
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
const mouse_drag_point_visualizer_element = document.getElementById('mouse-drag-point-visualizer')

let resolution = 20

const arrows = []
const force_log = []
const force_mechanism_log = []
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



function generate_grid(){

    const arrows_length = arrows.length
    for (let i = 0; i < arrows_length; i++) {
        arrows.pop()
    }

    remove_all_children(grid)

    for (let i = 0; i < resolution*resolution; i++) {
    
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
}
generate_grid()




class Force{
    constructor(position, velocity, time, scale){
        this.position = position
        this.velocity = velocity
        this.time = time
        this.scale = scale
    }
}




class Oscillator{
    constructor(scale, angle, frequency, start_phase, position, time_when_spawned){
        this.scale = scale
        this.angle = angle
        this.frequency = frequency
        this.start_phase = start_phase  
        this.position = position
        this.time_when_spawned = time_when_spawned
    }
}




class Vector2D {
    constructor(x, y) {
        if (x instanceof Vector2D) {
            this.x = x.x
            this.y = x.y
        }else if(y === undefined){
            const radians = x * (Math.PI / 180)
            this.x = Math.cos(radians)
            this.y = Math.sin(radians)
        }else{
            this.x = x
            this.y = y
        }
    }

    clone(){
        return new Vector2D(this.x, this.y)
    }

    is_NaN(){
        return isNaN(this.x) || isNaN(this.y)
    }

    print(){
        return [this.x.toFixed(1), this.y.toFixed(1)]
    }

    add(value) {
        if(value instanceof Vector2D){
            this.x += value.x
            this.y += value.y
        }
        return this  
    }

    multiply(value) {
        if(value instanceof Vector2D){
            this.x *= value.x
            this.y *= value.y
        }else{
            this.x *= value
            this.y *= value
        }
        return this
    }

    divide(value) {
        if(value instanceof Vector2D){
            this.x /= value.x
            this.y /= value.y
        }
        return this   
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
        return this
    }

    dot(vector){
        return this.x * vector.x + this.y * vector.y
    }

    angle(value){
        if(value === undefined){
            return Math.atan2(this.y, this.x) / (Math.PI / 180)
        }else if(typeof value === 'number'){
            const radians = value * (Math.PI / 180)
            this.x = Math.cos(radians)
            this.y = Math.sin(radians)
            return this
        }else if(value instanceof Vector2D){
            return Math.acos(this.dot(value) / (this.magnitude() * value.magnitude())) / (Math.PI / 180)
        }
    }

    angle_sim(vector){
        return this.angle(vector) / 180
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
    if(x > resolution || x < 0 || y > resolution || y < 0){
        return null
    }
    return array[y*resolution+x]
}




function get_arrow_position(arrow_index){
    if(arrow_index > resolution*resolution || arrow_index < 0){
        return null
    }
    return {x:arrow_index%resolution + global_coordinate_offset.x, y:0 - Math.floor(arrow_index/resolution) + global_coordinate_offset.y}
}




function softsign(x){
    return x/(Math.abs(x)+1)
}




function set_arrow_direction(arrow, direction_degree, scale){

    arrow.style.transform = 'rotate('+(-direction_degree - 90 + 45)+'deg) scale('+(softsign(scale/2)*3)+')'

}




function add_force(time_when_applied, scale, x, y, velocityX, velocityY){

    force_log.push(new Force(new Vector2D(x, y), new Vector2D(velocityX, velocityY), time_when_applied, scale))
    if(force_log.length > max_force_log_length){
        force_log.shift()
    }

    //Debug stuff
    update_force_log(force_log)
}




function update_force_log(log, influences){
    remove_all_children(debug_force_log)
    for (let i = 0; i < log.length; i++) {
        const force = log[log.length - i - 1];
        
        const velocity = new Vector2D(force.velocity.x, force.velocity.y)
        const direction = velocity.angle() * 180 / Math.PI
        const force_info_element = document.createElement('p')
        force_info_element.textContent = 't:' + force.time.toFixed(1) + ' | s:' + force.scale.toFixed(1) + ' | pos:' + force.position.x.toFixed(1) + ',' + force.position.y.toFixed(1) + ' | vel:' + force.velocity.x.toFixed(1) + ',' + force.velocity.y.toFixed(1) + ' |dir' + direction.toFixed(1)
        if(influences !== undefined){
            force_info_element.textContent += ' | dt-inf:' + influences[influences.length - i - 1].toFixed(1)
        }
        debug_force_log.appendChild(force_info_element)
    }
}




function update_objects_list(){
    remove_all_children(objects_list)
    for (let i = 0; i < force_mechanism_log.length; i++) {
        const element = force_mechanism_log[i];
        if (!element instanceof Oscillator) {
            console.warn(element,'is not an instance of Oscillator')
            continue
        }

        const root = document.createElement('div')

        const info = document.createElement('p')
        info.textContent = 's:' + element.scale + ' | a:' + element.angle + ' | f:' + element.frequency + ' | sph:' + element.start_phase + ' | x:' + element.position.x + ' | y:' + element.position.y + ' | t:' + element.time_when_spawned.toFixed(1)
        root.appendChild(info)

        const scale_input = document.createElement('input')
        scale_input.type = 'number'
        scale_input.value = element.scale
        root.appendChild(scale_input)

        const set_scale_button = document.createElement('button')
        set_scale_button.textContent = 'Set'
        set_scale_button.addEventListener('click', ()=>{
            console.log('hi')
            element.scale = Number(scale_input.value)
            update_objects_list()
        })
        root.appendChild(set_scale_button)

        root.innerHTML += '<br>'

        const delete_button = document.createElement('button')
        delete_button.textContent = 'Remove'
        delete_button.addEventListener('click', ()=>{
            const index = force_mechanism_log.findIndex(item => item === element)
            if (index !== -1) {
                force_mechanism_log.splice(index,1)
            }
            root.remove()
        })
        root.appendChild(delete_button)

        objects_list.appendChild(root)
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


resolution_20_button.addEventListener('click', ()=>{
    resolution_20_button.style = 'background-color: rgb(200,200,200); color: black;'
    resolution_40_button.style = ''
    resolution = 20
    grid.style = 'grid-template-columns: auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto'
    generate_grid()
})
resolution_40_button.addEventListener('click', ()=>{
    resolution_40_button.style = 'background-color: rgb(200,200,200); color: black;'
    resolution_20_button.style = ''
    resolution = 40
    grid.style = 'grid-template-columns: auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto'
    generate_grid()
})


show_tools_menu_button.addEventListener('click', ()=>{
    show_tools_menu_button.style = 'background-color: rgb(200,200,200); color: black;'
    show_objects_menu_button.style = ''
    tools_menu.style = 'display: block;'
    objects_menu.style = 'display: none;'
})
show_objects_menu_button.addEventListener('click', ()=>{
    show_objects_menu_button.style = 'background-color: rgb(200,200,200); color: black;'
    show_tools_menu_button.style = ''
    objects_menu.style = 'display: block;'
    tools_menu.style = 'display: none;'
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
add_oscillator_button.addEventListener('click', ()=>{
    force_mechanism_log.push(new Oscillator(1, 90, 1, 0, new Vector2D(0,0), time))
    update_objects_list()
})


move_up_button.addEventListener('click',()=>{
    global_coordinate_offset.y += 1
    debug_coordinates.textContent = 'x'+global_coordinate_offset.x+' y'+global_coordinate_offset.y
})
move_left_button.addEventListener('click',()=>{
    global_coordinate_offset.x -= 1
    debug_coordinates.textContent = 'x'+global_coordinate_offset.x+' y'+global_coordinate_offset.y
})
move_down_button.addEventListener('click',()=>{
    global_coordinate_offset.y -= 1
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


setInterval(move_mouse_drag_point_position, 50)
function move_mouse_drag_point_position(){
    if(!mouse_down_on_grid){
        mouse_drag_point_visualizer_element.style = 'display: none;'
        return
    }
    mouse_drag_point_velocity.x = (mouse_position_on_grid.x - mouse_drag_point_position.x) / 4
    mouse_drag_point_velocity.y = (mouse_position_on_grid.y - mouse_drag_point_position.y) / 4
    mouse_drag_point_position.x += mouse_drag_point_velocity.x
    mouse_drag_point_position.y += mouse_drag_point_velocity.y

    const mouse_drag_point_position_in_game = {x:mouse_drag_point_position.x / (800 / resolution) + global_coordinate_offset.x, y:mouse_drag_point_position.y / (800 / resolution) - global_coordinate_offset.y}

    add_force(time, (Math.abs(mouse_drag_point_velocity.x) + Math.abs(mouse_drag_point_velocity.y)) / 50, mouse_drag_point_position_in_game.x, -mouse_drag_point_position_in_game.y, mouse_drag_point_velocity.x, 0-mouse_drag_point_velocity.y)

    //console.log('total velocity', (Math.abs(mouse_drag_point_velocity.x) + Math.abs(mouse_drag_point_velocity.y)) / 50, 'position', mouse_drag_point_position_in_game.x, mouse_drag_point_position_in_game.y)

    mouse_drag_point_visualizer_element.style = 'top: '+mouse_drag_point_position.y+'px; left: '+mouse_drag_point_position.x+'px;'
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
        const arrow_position = get_arrow_position(i)
        let force_scale = 0
        let force_direction = new Vector2D(0,0)
        


        for (let j = 0; j < force_log.length; j++) {
            const force = force_log[j];

            if(!force instanceof Force){continue}

            const results = get_force_data_from_arrow_position(arrow_position, force)
            force_scale += results.scale
            force_direction.add(results.direction)
        }



        for (let j = 0; j < force_mechanism_log.length; j++) {
            const force_mechanism = force_mechanism_log[j];
            
            if(!force_mechanism instanceof Oscillator){continue}

            const arrow_distance_to_force = Math.sqrt((arrow_position.x - force_mechanism.position.x) ** 2 + (arrow_position.y - force_mechanism.position.y) ** 2)

            const oscillator_cosine_wave = Math.cos(force_mechanism.start_phase + time - arrow_distance_to_force)
            const oscillator_velocity = new Vector2D(0,0)
            const angle = oscillator_cosine_wave > 0? force_mechanism.angle + 90: force_mechanism.angle - 90
            oscillator_velocity.angle(angle)
            oscillator_velocity.multiply(Math.abs(oscillator_cosine_wave))
            
            
            const force = new Force(new Vector2D(force_mechanism.position.x, force_mechanism.position.y), oscillator_velocity, null, force_mechanism.scale * Math.abs(oscillator_cosine_wave) / arrow_distance_to_force)
            

            const results = get_force_data_from_arrow_position(arrow_position, force, true)
            force_scale += results.scale
            force_direction.add(results.direction)
        }



        // *'*'*'*'*'*'*'*'*'*'*'*'*'*'*'*'*'*'
        set_arrow_direction(arrow, force_direction.angle(), force_scale)
        // *'*'*'*'*'*'*'*'*'*'*'*'*'*'*'*'*'*'




        //Debug stuff
        document.getElementById('debug-arrow-info'+i).textContent = 'x:'+(arrow_position.x)+' y:'+arrow_position.y
        
        if(arrow === debug_selected_arrow){
            update_force_log(force_log)
        }
    }

    function get_force_data_from_arrow_position(arrow_position, force, ignore_time) {
        const arrow_distance_to_force = Math.sqrt((arrow_position.x - force.position.x) ** 2 + (arrow_position.y - force.position.y) ** 2)
        const scale_by_distance_and_time = relu((force.scale - Math.abs(force.time - time + arrow_distance_to_force)))
        let velocity_angle_difference = 1 - (new Vector2D(arrow_position.x - force.position.x, arrow_position.y - force.position.y).angle_sim(new Vector2D(force.velocity.x, force.velocity.y)))
        velocity_angle_difference = isNaN(velocity_angle_difference) ? 0 : velocity_angle_difference
        const force_scale = (ignore_time? 1: scale_by_distance_and_time) * velocity_angle_difference

        let force_direction = new Vector2D(force.velocity)
        if (force_direction.is_NaN()) {
            force_direction.x = 0
            force_direction.y = 0
        }
        force_direction.normalize()
        if (!ignore_time) {
            force_direction.multiply(scale_by_distance_and_time)
        }
        
        return {scale:force_scale, direction:force_direction}
    }
}