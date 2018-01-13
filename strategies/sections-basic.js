class SimpleStrategyWithSections extends BaseTestingStrategy {
    constructor(tests, tester, config) {
        super(tests, tester, config);
        this.currentSection = null;
        this.sections = ['DataTypes', 'ExecutionContextAndObjectMethods'];
        this.testsInSection = 4;
        this.sectionTests = this._prepareTests(tests, this.sections);
    }

    _prepareTests(allTests, sections){
        let result = {};
        sections.forEach(section => {
            result[section] = {};
            let filtered = allTests.filter(test => test.sections.includes(section));
            ['Easy', 'Moderate', 'Hard'].forEach(level => {
                result[section][level] = filtered
                    .filter(test => test.level === level)
                    .slice(0, this.testsInSection);
            });
        });
        return result;
    }

    doSupportSections(){
        return true;
    }

    getCurrentSection(){
        return this.currentSection;
    }
    

    fetchNext(test) {
        // return test ? this.tests[this._getTestIndex(test) + 1] : this.tests[0];
    }
}