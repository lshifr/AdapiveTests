class BaseTestingStrategy {
    constructor(tests, tester, config) {
        this.tests = tests;
        this.tester = tester;
        this.maxTests = (config && config.max) || 10;
        this.levels = ["Easy", "Moderate", "Hard", "VeryHard"];
    }

    getNext(test) {
        if (this.tester.getAllTakenTests().length >= this.maxTests) {
            return null;
        }
        return this.fetchNext(test)
    }

    doSupportSections(){
        return false;
    }

    getCurrentSection(){
        return null;
    }
}
