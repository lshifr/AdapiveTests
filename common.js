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


/**
 * Wraps an iterable collection in a generator
 * 
 * @param {*} collection 
 */
function* makeGen(collection){
    for(let elem of collection){
        yield elem;
    }
}

/**
 * Maps a function f on values for all keys  / properties of a given object.
 * So, given an object of the form {key1: val1, ..., keyn:valn}, it would 
 * return a new object of the form {key1: f(val1), ..., keyn: f(valn)}
 * 
 * @param {*} f 
 * @param {*} obj 
 */
function mapdict(f, obj){
    let result = {};
    for(let prop in obj){
        if(obj.hasOwnProperty(prop)){
            result[prop] = f(obj[prop]);
        }
    }
    return result;
}

/**
 * A rather specialized function that takes a nested collection of items of 
 * the form {key1: [item_1, ..., item_k], ..., keyn: [item_n_1, ..., item_n_m]},
 * and a starting ordered set of keys, and constructs a generator over the 
 * items in collections. The generator would, at every step, get the ordered
 * set of allowed keys for the next step, and yield the first item from the 
 * first non-empty collection, looping through the set of allowed keys, obtained
 * from a previous iteration. The starting set of allowed keys is passed as 
 * the second argument, to make the first yield possible.
 * 
 * @param {*} multiCollection 
 * @param {*} startingAllowedLevels 
 */
function makeMulticollectionGen(multiCollection, startingKeys) {
    let multiGens = mapdict(makeGen, multiCollection);
    return function* () {
        let keys = startingKeys;
        let done = false;
        while(!done){
            done = true;
            for (let key of keys){
                let next = multiGens[key].next();
                if (!next.done){
                    keys = yield next.value;
                    done = false;
                    break;
                }
            }   
        }
        return null;
    }
}