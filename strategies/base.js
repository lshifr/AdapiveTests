class BaseTestWrapper{
    /**
     * Constructor for the test wrapper.
     * 
     * @param {Object} testObject - The object that has to contain 'test' field with the test, 
     * but may also contain arbitrary other fields with some meta-information
     * @param {*} options 
     */
    constructor(testObject, options){
        this.test = null;
        this.answeredCorrectly = null;
        this.userAnswer = null;
        this.testObject = testObject;

        Object.defineProperty(this, 'test', {
            value : testObject.test,
            writable : false
        });

        options = options || { addToHistory: true };
        for(let opt in options){
            if(options.hasOwnProperty(opt)){
                this[opt] = options[opt];
            }
        }
    }

    static wrapTest(testObject, options){
        return testObject ? new this(testObject, options) : testObject;
    }    

    // Default key associated with the test
    getTestKey(){
        return this.test ? this.test.id : null; 
    }

    // Allow to only answer a given wrapped test once 
    processUserAnswer(answer) {
        assert(
            this.answeredCorrectly === null && this.userAnswer === null, 
            'Attempt to overwrite the answer'
        );
        Object.defineProperty(this, 'answeredCorrectly', {
            value : answer === this.test.answer,
            writable : false
        });
        Object.defineProperty(this, 'userAnswer', {
            value : answer,
            writable : false
        });
    }

    getPreNotification(){
        return null;
    }

    getPostNotification(){
        return null;
    }
}

class BaseTestingStrategy {
    constructor(tests, tester, config) {
        this.tests = tests;
        this.tester = tester;
        this.maxTests = (config && config.max) || 10;
        this.levels = ["Easy", "Moderate", "Hard", "VeryHard"];
    }

    getNext(testWrapped) {
        if (this.tester.getAllTakenTests().length >= this.maxTests) {
            return null;
        }
        return this.fetchNextWrapped(testWrapped)
    }

    doSupportSections(){
        return false;
    }

    getCurrentSection(){
        return null;
    }

    getTestWrapper(){
        return BaseTestWrapper.wrapTest.bind(BaseTestWrapper);
    }

    fetchNext(obj){
        assert(false, 'NotImplemented');
    }

    fetchNextWrapped(testWrapped){
        let wrapper = this.getTestWrapper();
        return wrapper(this.fetchNext(testWrapped));
    }
}