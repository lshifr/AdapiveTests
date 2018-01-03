
class SimpleTestingStrategy{
    constructor(tests, tester, config){
        this.tests = tests; 
    }

    _getTestIndex(test) {
        assert(test);
        return  this.tests.map(t => t.id).indexOf(test.id);
    }

    hasNext(test) {
        if(!test){
            return this.tests.length > 0;
        } else {
            let index =  this._getTestIndex(test);
            return index >= 0 && index < this.tests.length - 1;
        }   
    }

    getNext (test) {
        if(!this.hasNext(test)){
            return null;
        } else {
            return test ? this.tests[this._getTestIndex(test) + 1] : this.tests[0];
        }
    }
}

class SimpleAdaptiveTestingStrategy{
    constructor(tests, tester, config){
        this.tester = tester;
        this.maxTests = (config && config.max) || 10;
        this.levels = ["Easy", "Moderate", "Hard", "VeryHard"];
        this.grouped = groupBy(tests, test => test.level);
    }

    hasNext(test){
        return this.tester.getAllTakenTests().length < this.maxTests 
            && Object.values(this.grouped).some(items => items.length > 0);
    }

    getNext(test){
        let maxAllowedLevel  = !test ? 0 : this.levels.indexOf(test.level) + (test.answeredCorrectly? 1:-1);
        let allowedLevels = this.levels.slice(0, maxAllowedLevel+1).reverse();
        for (let lev of allowedLevels){
            if(this.grouped[lev].length > 0){
                return this.grouped[lev].shift();
            }
        }
        return null; // No allowed questions left
    }
}


/**
 *  The same as SimpleAdaptiveTestingStrategy, but using generators. The workflow
 *  is not fully async though, since there is certain  inversion of control here:
 *  because angular has its own event loop (digest cycle), and because the template
 *  for single test we use here, uses the method call (hasNext()) to determine 
 *  whether or not to render the Next button, the generator of tests is here driven
 *  by angular. Once the user gives some answer to a current question, the hasNext()
 *  method is called and uses a separate branch, which fetches the next test.
 * 
 *  What we'd perhaps want to do would be to reverse the order / control, so that 
 *  once the user gives an answer, we first fetch the next question, and then let
 *  the angular know, so that the generator / coroutine is the one to take control,
 *  and angular is a driven one.
 */
class SimpleAdaptiveTestingStrategyGen{
    constructor(tests, tester, config){
        this.tester = tester;
        this.maxTests = (config && config.max) || 10;
        this.levels = ["Easy", "Moderate", "Hard", "VeryHard"];
        this.grouped = groupBy(tests, test => test.level);
        this.testgen = makeMulticollectionGen(this.grouped, ["Easy"])();
        this.cachedNext = {};
    }

    /**
     * We have here to actually call getNext() early, because there is no other way 
     * in this case to know whether or not there is a next question. Here we see 
     * that we face certain limitations of the overall UI / Tester API model that we
     * use, in that we need a separate hasNext() function, because our model is too
     * eager. 
     * 
     * This is because we have the angular event loop, which means that we don't have
     * control over when hasNext() gets fired, that is up to angular and its digest 
     * cycle. A better way would be to control the display of the Next button by some
     * variable on the scope, and then update that variable asynchronously when the 
     * question gets answered, and let angular know. We will implement that in a 
     * different version of this.
     * 
     * @param {*} test 
     */
    hasNext(test){
        if(test.userAnswer === null){ // Can't know before the user answered, so default to false; 
            return false;
        }
        if(this.tester.getAllTakenTests().length >= this.maxTests){
            return false;
        } 
        let key = test ? test.id : null;
        if(key in this.cachedNext){
            return this.cachedNext[key];
        } 
        let next = this.getNext(test);
        this.cachedNext[key] = next;
        return next;
    }

    getNext(test){
        let key = test ? test.id : null;
        if(key in this.cachedNext){
            return this.cachedNext[key];
        } 
        if(!test){
            return this.testgen.next().value;
        } 
        let index = this.levels.indexOf(test.level);
        let maxAllowedLevel  =  index + (test.answeredCorrectly? 1: (index?-1:0));
        let allowedLevels = this.levels.slice(0, maxAllowedLevel+1).reverse();
        return this.testgen.next(allowedLevels).value;
    }
}

