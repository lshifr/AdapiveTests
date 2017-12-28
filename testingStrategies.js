
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



