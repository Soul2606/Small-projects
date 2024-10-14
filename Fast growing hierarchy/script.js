




function P([y,z]){
    if (y==0) {
        return z
    } else {
        let k = JSON.stringify([P(y),z])
        return JSON.parse(k.replaceAll(JSON.stringify(z),k))
    }
}

for(a=b=0;a=b++<2?[a,0]:P(a););
b;