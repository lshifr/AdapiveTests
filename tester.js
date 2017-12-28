class Tester{
    constructor(tests, TestingStrategyClass){
        this.strategy = new TestingStrategyClass(tests, this);
        this.currentTest = null;
        this.takenTests = [];
        this._takeNext(); 
    }

    _getTestIndex(test) {
        return  this.takenTests.map(t => t.id).indexOf(test.id);
    }

    getCurrentTest(){
        return this.currentTest;
    }

    getAllTakenTests(clone){
        return clone?simpleDeepClone(this.takenTests):this.takenTests;
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

    /**
     * Assume here that the test has been answered, correctly or not
     * 
     * @param {*} test 
     */
    hasNext(test){
        if(this._wasAlreadyTaken(test)){
            return true;
        }
        else return this.strategy.hasNext(test);
    }

    _takeNext(test){
        let newTest = this.strategy.getNext(test);
        if(newTest){
            this.currentTest = newTest;
            this.takenTests.push(newTest)
        }
    }

    /**
     * Assume here that the test has been answered, correctly or not
     * 
     * @param {*} test 
     */
    getNext(test){
        if(!this.hasNext(test)){
            return;
        }
        if(this._wasAlreadyTaken(test)){
            let index = this._getTestIndex(test);
            this.currentTest = this.takenTests[index + 1];
        } else {
            this._takeNext(test);
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
