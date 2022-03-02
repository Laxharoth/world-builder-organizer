import { randomInt } from "crypto";

export function compareArray<T>(array1: T[], array2: T[], compareValues:(value: T, value2: T)=>boolean=(v1,v2)=>v1===v2): boolean {
    try {
        const zipped = zip(array1, array2);
        if(zipped.some(([v1,v2])=>!compareValues(v1,v2)))return false;
    }catch (e) {
        return false;
    }
    return true;
}
export function zip<T>(...arrays:T[][]):T[][]{
    const result:T[][] = [];
    if(!arrays.length)throw new Error("Provide at least an array");
    let length = arrays[0].length;
    if(arrays.some(arr => arr.length!==length))throw new Error("Lenght on arrays must be equal");
    for (let i = 0; i < length; i++) {
        result.push([])
        for (let j = 0; j < arrays.length; j++){
            result[i].push(arrays[j][i])
        }
    }
    return result;
}
export function shuffle<T>(array: T[]){
    for (let i = 0; i < array.length; i++){
        const swap_index = randomInt(array.length - i);
        [ array[i],array[swap_index] ] = [ array[swap_index],array[i] ]
    }
}