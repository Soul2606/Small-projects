
function create_planetary_object_info_element(name, type, flex_direction, satellite_elements){
	const main = document.createElement("div")
	main.classList.add("object")
	main.classList.add(flex_direction)

	const text_info_container = document.createElement("div")
	text_info_container.className = "object-info"
	main.appendChild(text_info_container)

	const name_element = document.createElement("h3")
	name_element.textContent = name
	text_info_container.appendChild(name_element)

	const type_element = document.createElement("p")
	type_element.textContent = type
	text_info_container.appendChild(type_element)
	
	const satellites_container = document.createElement("div")
	satellites_container.classList.add("object-satellites")
	satellites_container.classList.add(flex_direction)
	for (let i = 0; i < satellite_elements.length; i++) {
		const element = satellite_elements[i]
		satellites_container.appendChild(element)
	}
	main.appendChild(satellites_container)

	return main
}




function create_elements_from_satellites(satellites = [], flex_direction){
	let elements = []
	for (let i = 0; i < satellites.length; i++) {
		const planetary_object = satellites[i];
		const planetary_object_info_element = create_planetary_object_info_element(planetary_object.name, planetary_object.type, flex_direction, create_elements_from_satellites(planetary_object.satellites, flex_direction === "flex-row"? "flex-column": "flex-row"))
		
		if(flex_direction === "flex-row"){
			planetary_object_info_element.style = "border-top: solid white 1px"
		}else{
			planetary_object_info_element.style = "border-left: solid white 1px"
		}

		elements.push(planetary_object_info_element)
	}
	return elements
}




async function get_json_file(json_file){
	let response = await fetch(json_file)
	let data = await response.json()
	return data
}




get_json_file("Space.json").then(data => {
	console.log("data", data)

	const root_div = document.getElementById("main")

	const systems = data.systems
	for (let i = 0; i < systems.length; i++) {
		const system_architecture = systems[i].system_architecture
		const planetary_object_info_element = create_planetary_object_info_element(system_architecture.name, system_architecture.type, "flex-row", create_elements_from_satellites(system_architecture.satellites, "flex-column"))
		planetary_object_info_element.style = "border-top: solid white 1px"
		root_div.appendChild(planetary_object_info_element)
	}
})