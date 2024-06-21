



function sum(input){
    let sum = 0;
    let values = [];

    if (Array.isArray(input)) {
        values = input;
    } else if (typeof input === 'object') {
        values = Object.values(input);
    }

    for (let i = 0; i < values.length; i++) {
        const element = values[i];
        sum += element;
    }
    return sum;
}




function product(input){

	let values

	if (Array.isArray(input)) {
		values = input
	} else if(typeof input === "object"){
		values = Object.values(input)
	}

	if (values.length === 0) {
		return 0
	}
    let sum = values[0]
    for (let i = 1; i < values.length; i++) {
        const element = values[i];
        sum *= element
    }
    return sum
}



// untested, wip
function filter(input, filter_function){
    let array
    if(typeof input === "object") {
        array = Object.values(input)
    }else if(Array.isArray(input)){
        array = Array.from(input)
    }

    let passed = []

    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (filter_function(element)) {
            passed.push(element)
        }
    }
    return passed
}




function distribute_evenly_within_range(value, ranges){
    let results = []
    let ranges_index_value_pair = []
    for (let i = 0; i < ranges.length; i++) {
        const element = ranges[i];
        ranges_index_value_pair.push([i, element])
        results.push(0)
    }
    const loop_length = ranges_index_value_pair.length
    for (let i = 0; i < loop_length; i++) {
        console.group(i)

        if (ranges_index_value_pair.length === 0) {
            console.groupEnd()
            return results
        }

        let lowest_value = {value:Infinity, ranges_index_value_pair_indexes:[]}
        for (let j = 0; j < ranges_index_value_pair.length; j++) {
            const index = ranges_index_value_pair[j][0]
            const value = ranges_index_value_pair[j][1]
            if(lowest_value.value > value - results[index]){
                lowest_value.value = value - results[index]
                lowest_value.ranges_index_value_pair_indexes.push(j)
            }else if(lowest_value.value === value - results[index]){
                lowest_value.ranges_index_value_pair_indexes.push(j)
            }
        }

        
        console.log("ranges_index_value_pair", Array.from(ranges_index_value_pair))
        console.log("lowest_value", lowest_value.value, "indexes", lowest_value.ranges_index_value_pair_indexes)
        console.log("value", value)


        const value_per_item = value / ranges_index_value_pair.length
        console.log("value_per_item", value_per_item)
        if (value_per_item <= lowest_value.value) {
            console.log("amount added to each", value_per_item)
            for (let i = 0; i < ranges_index_value_pair.length; i++) {
                const index = ranges_index_value_pair[i][0]
                results[index] += value_per_item
            }
            console.groupEnd()
            return results
        }

        console.log("amount added to each", lowest_value.value)

        for (let i = 0; i < ranges_index_value_pair.length; i++) {
            const index = ranges_index_value_pair[i][0]
            results[index] += lowest_value.value
            value -= lowest_value.value
        }


        for (let i = 0; i < lowest_value.ranges_index_value_pair_indexes.length; i++) {
            const index = lowest_value.ranges_index_value_pair_indexes[i];
            ranges_index_value_pair[index] = "pending_deletion"
        }

        for (let i = 0; i < ranges_index_value_pair.length; i++) {
            const element = ranges_index_value_pair[i];
            if (element === "pending_deletion") {
                ranges_index_value_pair.splice(i, 1)
                i--
            }
        }

        console.groupEnd()
    }   
    return results
}




function spread(array){
    console.groupCollapsed("spread")
    let loop_length = array.length
    let reverse = false
    for (let i = 0; i < loop_length; i++) {
        let index
        if(reverse){
            index = loop_length - i
        }else{
            index = i
        }
       
        const element = array[index];
        const element_over = array[index+1];
        const element_under = array[index-1];
        const difference_over = element_over - element
        const difference_under = element_under - element
        
        console.log(array)
        console.log("over", difference_over, "under", difference_under)

        let divide = 2
        if (!isNaN(difference_over) && !isNaN(difference_under)) {
            array[index] += (difference_over / divide) + (difference_under / divide)
        }else if(!isNaN(difference_over)){
            array[index] += difference_over / divide
        }else if(!isNaN(difference_under)){
            array[index] += difference_under / divide
        }else{
            console.groupEnd()
            return
        }
        if(!isNaN(difference_over)){
            array[index+1] -= difference_over / divide
        }
        if(!isNaN(difference_under)){
            array[index-1] -= difference_under / divide
        }
        
        reverse? reverse = false: reverse = true
    }
    console.groupEnd()
}



