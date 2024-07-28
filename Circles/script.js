
const main_div = document.getElementById("main")

class Circle {
	constructor(diameter, hierarchy){
		this.diameter = diameter
		this.hierarchy = hierarchy
	}
}

const circles = []




function get_look_at_angle(x, y){
	return ((Math.atan2(x , y) > 0? Math.atan2(x , y): Math.PI * 2 + Math.atan2(x, y)) / (Math.PI * 2)) * 360
}




function get_all_child_elements(node) {
	let all_children = []
	function recursive_search(element) {
		all_children.push(element)
		for (let i = 0; i < element.children.length; i++) {
			recursive_search(element.children[i])
		}
	}
	recursive_search(node)
	return all_children
}




function get_z_indices(elements) {
	const z_indices = []

	elements.forEach(element => {
		const z_index = window.getComputedStyle(element).getPropertyValue('z-index')
		if (z_index !== 'auto') {
			z_indices.push({ element, z_index: parseInt(z_index, 10) })
		}
	})

	return z_indices
}




function create_new_circle(diameter, hierarchy){

	const circle = new Circle(diameter, hierarchy)

	circles.push(circle)

	const all_circle_elements = get_all_child_elements(main_div).filter(element => element.className === "circle")

	const circle_element = document.createElement("div")
	circle_element.className = "circle"
	circle_element.style.height = diameter * 400 + "px"
	circle_element.style.width = diameter * 400 + "px"

	/* 	
	if(all_circle_elements.length === 0){

		circle_element.style.zIndex = "0"

	}else{

		const all_circle_elements_z_index = get_z_indices(all_circle_elements)
		
		const largest_z_index = all_circle_elements_z_index.reduce((max, current)=>{return current.z_index > max? current.z_index: max}, -Infinity)
		
		circle_element.style.zIndex = String(largest_z_index + 1)

	}

	circle_element.addEventListener("mousedown", ()=>{
		select_circle_element(circle_element, circle)
	})
 */

	const line_collision_element = document.createElement("div")
	line_collision_element.className = "line-box"
	circle_element.appendChild(line_collision_element)
	line_collision_element.addEventListener("mousedown", (e)=>{
		e.preventDefault()
		console.log('mousedown on line', line_collision_element)
		rotate_line(line_collision_element, circle_element, circle)
	})


	const line_element = document.createElement('div')
	line_element.className = 'line'
	line_collision_element.appendChild(line_element)


	return circle_element
}




function select_circle_element(circle_element, circle){
	console.log('mousedown on circle', circle_element)
	const all_circle_elements = get_all_child_elements(main_div).filter(element => element.className === "circle")
	const all_circle_elements_z_index = get_z_indices(all_circle_elements)

	if(circle_element.style.zIndex !== '0'){

		const all_circle_elements_z_index_less_than_circle_element = all_circle_elements_z_index.filter(element => element.z_index < circle_element.style.zIndex)

		for (let i = 0; i < all_circle_elements_z_index_less_than_circle_element.length; i++) {
			const element = all_circle_elements_z_index_less_than_circle_element[i]
			//console.log('element', element, 'all_circle_elements_z_index', all_circle_elements_z_index, 'all_circle_elements_z_index_less_than_circle_element', all_circle_elements_z_index_less_than_circle_element)
			element.element.style.zIndex = Number(element.element.style.zIndex)+1
		}
		
		circle_element.style.zIndex = '0'

	}
	
}




let rotating_line = false
function rotate_line(line, circle_element, circle){
	//console.log('line', line, 'circle element', circle_element, 'circle', circle)
	if(rotating_line){
		return
	}

	rotating_line = true

	const rect = circle_element.getBoundingClientRect()
	const circle_top = rect.top
	const circle_left = rect.left
	const height = circle_element.offsetHeight / 2
	const width = circle_element.offsetWidth / 2

	function drag_rotate(){
		line.style.transform = 'rotate('+ get_look_at_angle(mouse_position.y - circle_top - height, mouse_position.x - circle_left - width) +'deg)'
	}

	function stop_drag(){
		console.log('mouse up')
		clearInterval(interval_id)
		window.removeEventListener('mouseup', stop_drag)
		rotating_line = false
	}

	const interval_id = setInterval(drag_rotate, 10)

	window.addEventListener("mouseup", stop_drag)
}








const mouse_position = {x:0, y:0}
window.addEventListener("mousemove", e=>{
	mouse_position.x = e.x
	mouse_position.y = e.y
})




main_div.appendChild(create_new_circle(1, []))
main_div.appendChild(create_new_circle(0.5, []))







