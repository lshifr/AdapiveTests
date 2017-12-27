
class SimpleTestingStrategy{
    constructor(tests){
        this.tests = tests;
        this.currentTest = tests[0]; 
    }

    _getTestIndex(test) {
        return  this.tests.map(t => t.id).indexOf(test.id);
    }

    getCurrentTest(){
        return this.currentTest;
    }

    hasNext(test) {
        let index = this._getTestIndex(test);
        return index >= 0 && index < this.tests.length - 1;
    }

    hasPrevious (test) {
        return this._getTestIndex(test) > 0;
    }

    getNext (test) {
        if (this.hasNext(test)) {
            this.currentTest = this.tests[this._getTestIndex(test) + 1];
        }
    }

    setAnswered (test, answer) {
        let index = this._getTestIndex(test);
        this.tests[index].answeredCorrectly = answer === test.answer;
        this.tests[index].userAnswer = answer;
    }

    getPrevious(test) {
        if (this.hasPrevious(test)) {
            this.currentTest = this.tests[this._getTestIndex(test) - 1];
        }
    }

}

class SimpleAdaptiveTestingStrategy{
    constructor(tests, config){
        this.maxTests = (config && config.max) || 10;
        this.levels = ["Easy", "Moderate", "Hard", "VeryHard"];
        this.grouped = groupBy(tests, test => test.level);
        this.currentTest = this._getNextTest(0);
        this.takenTests = [this.currentTest]; 
        console.log(this.grouped);
        console.log(this.currentTest);
    }

    _getTestIndex(test) {
        return  this.takenTests.map(t => t.id).indexOf(test.id);
    }

    getCurrentTest(){
        return this.currentTest;
    }

    setAnswered (test, answer) {
        let index = this._getTestIndex(test);
        this.takenTests[index].answeredCorrectly = answer === test.answer;
        this.takenTests[index].userAnswer = answer;
    }

    _wasAlreadyTaken(test){
        let index = this._getTestIndex(test);
        return index !== -1 && index < this.takenTests.length - 1;
    }

    hasNext(test){
        if(this._wasAlreadyTaken(test)){
            return true;
        }
        else return this.takenTests.length < this.maxTests 
            && Object.values(this.grouped).some(items => items.length > 0);
    }

    /**
     * Assume here that this can only be called after the test has been answered, 
     * correctly or not
     * 
     * @param {*} test 
     */
    _getNextTest(maxAllowedLevel){ 
        let allowedLevels = this.levels.slice(0, maxAllowedLevel+1).reverse();
        for (let lev of allowedLevels){
            if(this.grouped[lev].length > 0){
                return this.grouped[lev].shift();
            }
        }
        return null; // No allowed questions left
    }

    getNext(test){
        if(! this.hasNext(test)){
            return;
        }
        let index = this._getTestIndex(test);
        if(this._wasAlreadyTaken(test)){
            this.currentTest = this.takenTests[index + 1];
        } else {
            let maxAllowedLevel  = this.levels.indexOf(test.level) + (test.answeredCorrectly? 1:-1);
            this.currentTest = show(this._getNextTest(maxAllowedLevel));
            if(this.currentTest){
                this.takenTests.push(this.currentTest)
            }
        }
    }

    hasPrevious(test){
        return this._getTestIndex(test) > 0;
    }

    getPrevious(test){
        if(!this.hasPrevious(test)){
            return;
        }
        this.currentTest = this.takenTests[this._getTestIndex(test)-1];
    }
}
