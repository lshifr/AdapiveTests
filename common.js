function show(arg) {
    console.log(arg);
    return arg;
}


function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}

function groupBy(collection, f){
    let result = {};
    Array.from(collection).forEach(item => {
        let key = f(item);
        assert(
            typeof key === "string", 
            "The type of key was expected to be \"string\", but found: " + (typeof key)
        );
        if (!(key in result)){
            result[key] = [];
        }
        result[key].push(item);     
    });
    return result
}


/**
 * Implements a simple deep clone of an object, whose fields may contain 
 * other objects or primitives. Note that it replaces iterable objects 
 * with arrays, does not clone properties from the prototype, and does 
 * not preserve the prototype.
 * 
 * @param {*} o 
 */
function simpleDeepClone(o){
    if(typeof o === "string"){
        return o;
    } else if( o === null || o === undefined){
        return o;
    } else if(typeof o[Symbol.iterator] === "function"){
        let result = [];
        for (elem of o){
            result.push(simpleDeepClone(elem));
        }
        return result
    } else if (typeof o === "object"){
        let result = {};
        for (let prop in o){
            if(o.hasOwnProperty(prop)){
                result[prop] = simpleDeepClone(o[prop]);
            }
        }
        return result;
    } else {
        return o;
    }
}

// TODO: implement a full-fledged clone() 