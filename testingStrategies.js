
class SimpleTestingStrategy{
    constructor(tests){
        this.tests = tests;
        this.currentTest = tests[0]; 
    }

    _getTestIndex(test) {
        let index = this.tests.map(t => t.id).indexOf(test.id);
        //console.log("The index for test with id "+ test.id + " is: " + index);
        return index;
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
        //console.log('In setAnswered');
        //console.log(test, answer);
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
