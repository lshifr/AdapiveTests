class Tester {
    constructor(tests, TestingStrategyClass) {
        this.strategy = new TestingStrategyClass(tests, this);
        this.currentTest = null;
        this.nextTests = {};
        this.takenTests = [];
        this._init();
    }

    _init(){
        this._fetchNext();
        this.next();
    }

    _getTestIndex(test) {
        return this.takenTests.map(t => t.id).indexOf(test.id);
    }

    _wasAlreadyTaken(test) {
        let index = this._getTestIndex(test);
        return index !== -1 && index < this.takenTests.length;
    }

    _testKey(test){
        return test? test.id: null;
    }

    _fetchNext() {
        let test = this.currentTest;
        let key = this._testKey(test);
        if(!(key in this.nextTests)){
            this.nextTests[key] = this.strategy.getNext(test); // Coupling with the testing strategy
        }
    }

    getCurrentTest() {
        return this.currentTest;
    }

    getAllTakenTests(clone) {
        return clone ? simpleDeepClone(this.takenTests) : this.takenTests;
    }

    setAnswered(test, answer) {
        let index = this._getTestIndex(test);
        let thisTest = this.takenTests[index]; // Same test as 'test', but may not necessarily be the same object as 'test'
        thisTest.answeredCorrectly = answer === test.answer;
        thisTest.userAnswer = answer;
        this._fetchNext(thisTest);
    }    

    hasNext() {
        return !!this.nextTests[this._testKey(this.currentTest)];
    }

    next() {
        if(this.hasNext(this.currentTest)){
            this.currentTest = this.nextTests[this._testKey(this.currentTest)];
            if(!this._wasAlreadyTaken(this.currentTest)){
                this.takenTests.push(this.currentTest);
            }
        }
    }

    hasPrevious() {
        return this._getTestIndex(this.currentTest) > 0;
    }

    previous() {
        let test = this.currentTest;
        if (!this.hasPrevious(test)) {
            return;
        }
        this.currentTest = this.takenTests[this._getTestIndex(test) - 1];
    }
}
