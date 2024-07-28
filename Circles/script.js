
const main_div = document.getElementById("main")

class Circle {
	constructor(diameter, hierarchy){
		this.diameter = diameter
		this.hierarchy = hierarchy
	}
}

const circles = []




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

	if(all_circle_elements.length === 0){

		circle_element.style.zIndex = "0"

	}else{

		const all_circle_elements_z_index = get_z_indices(all_circle_elements)
		
		const largest_z_index = all_circle_elements_z_index.reduce((max, current)=>{return current.z_index > max? current.z_index: max}, -Infinity)
		
		circle_element.style.zIndex = String(largest_z_index + 1)

	}

	circle_element.addEventListener("click", ()=>{
		select_circle_element(circle_element, circle)
	})

	return circle_element
}




function select_circle_element(circle_element, circle){
	console.log('circle clicked', circle_element)
	const all_circle_elements = get_all_child_elements(main_div).filter(element => element.className === "circle")
	const all_circle_elements_z_index = get_z_indices(all_circle_elements)

	if(circle_element.style.zIndex !== '0'){

		const all_circle_elements_z_index_less_than_circle_element = all_circle_elements_z_index.filter(element => element.z_index < circle_element.style.zIndex)

		for (let i = 0; i < all_circle_elements_z_index_less_than_circle_element.length; i++) {
			const element = all_circle_elements_z_index_less_than_circle_element[i]
			console.log('element', element, 'all_circle_elements_z_index', all_circle_elements_z_index, 'all_circle_elements_z_index_less_than_circle_element', all_circle_elements_z_index_less_than_circle_element)
			element.element.style.zIndex = Number(element.element.style.zIndex)+1
		}
		
		circle_element.style.zIndex = '0'

	}
	
}




main_div.appendChild(create_new_circle(1, []))
main_div.appendChild(create_new_circle(0.5, []))
main_div.appendChild(create_new_circle(0.25, []))