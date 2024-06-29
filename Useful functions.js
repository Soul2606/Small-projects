



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
    let indexes_to_exclude = []
    let highest_number_added_to_results = 0 
    const ranges_unique_sorted = [...new Set(ranges)].sort((a, b) => a - b)

    for (let i = 0; i < ranges.length; i++) {
        results.push(0)
    }

    for (let i = 0; i < ranges_unique_sorted.length; i++) {
        const lowest_value = ranges_unique_sorted[i]

        const lowest_value_difference_to_highest_value_added = (lowest_value - highest_number_added_to_results)
        
        const value_per_item = value / (ranges.length - indexes_to_exclude.length)
        
        console.log("lowest_value_difference_to_highest_value_added", lowest_value_difference_to_highest_value_added, "lowest_value", lowest_value, "highest_number_added_to_results", highest_number_added_to_results, "\nindexes_to_exclude", indexes_to_exclude, "value_per_item", value_per_item)

        if (value_per_item <= lowest_value_difference_to_highest_value_added){

            for (let i = 0; i < results.length; i++) {
                if(indexes_to_exclude.includes(i)){
                    continue
                }
                results[i] += value_per_item
            }

            return results
        }

        
        for (let i = 0; i < results.length; i++) {
            if(indexes_to_exclude.includes(i)){
                continue
            }
            results[i] += lowest_value_difference_to_highest_value_added
            value -= lowest_value_difference_to_highest_value_added
            if (ranges[i] === lowest_value) {
                indexes_to_exclude.push(i)
            }
        }

        highest_number_added_to_results += lowest_value_difference_to_highest_value_added
    }

    return results
}

console.log(distribute_evenly_within_range(23,[1,4,8,12]))





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



