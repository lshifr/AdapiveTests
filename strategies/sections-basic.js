class MultiAttemptTestWrapper extends BaseTestWrapper{

    getTestKey(){
        return this.test ? '' + this.test.id + '_' + this.testObject.attempt : null; 
    } 
    
    getPreNotification(){
        if(this.testObject.indexInGroup === 0){
            if(this.testObject.attempt === 1){
                return {
                    contents: `Starting a new group of tests of level ${this.testObject.level} for section ${this.testObject.section}. Press the Next button.`,
                    type:  'default'
                }
            } else{
                return {
                    contents: `Starting a new attempt for section ${this.testObject.section}, level ${this.testObject.level}. Press the Next button`,
                    type:  'warning'
                }
            }
        }
        return null;
    }
}

class SimpleStrategyWithSections extends BaseTestingStrategy {
    constructor(tests, tester, config) {
        super(tests, tester, config);
        this.currentSection = null;
        this.currentAttempt = 1;
        this.sections = ['DataTypes', 'ExecutionContextAndObjectMethods'];
        this.testsInSection = 4;
        this.sectionTests = this._prepareTests(tests, this.sections);
        this.currentLevel = 'Easy';
        this.sectionLevelAttempts = 2;
        this.sectionPassLevel = 0.75;
        this.levels = ["Easy", "Moderate", "Hard"]; // Override
        this.testgen = (this._createFullGenerator())();
        this.maxTests = Infinity; // Hard-coded for now
        this.results = null;
    }

    getTestWrapper(){
        return MultiAttemptTestWrapper.wrapTest.bind(MultiAttemptTestWrapper);
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

    _createSectionLevelGenerator(section, level){
        let tests = this.sectionTests[section][level];
        let max_attempts = this.sectionLevelAttempts;
        let passLevel = this.sectionPassLevel;
        let self = this;
        return function*(){
            let previous = null;
            let total = 0;
            let passed = 0;
            while(self.currentAttempt <= max_attempts){
                for(const [index, test] of tests.entries()){
                    previous = yield {
                        test: test, 
                        attempt: self.currentAttempt,
                        section: section,
                        level: level,
                        indexInGroup: index
                    };
                    total += 1;
                    passed += previous.answeredCorrectly? 1 : 0;
                }
                if(passed / total >= passLevel){
                    self.currentAttempt = 1;
                    return true; // Signal that this level has been passed
                }
                self.currentAttempt++;
                // Clear previous results
                passed = 0;
                total = 0;
            }
            self.currentAttempt = 1;
            return null;
        }
    }

    _createSectionGenerator(section){ 
        let triedLevels = {};

        this.currentSection = section;
    
        let getMaxPassedLevel = () => {
            for(let lev of this.levels.slice().reverse()){
                if(triedLevels[lev]){
                    return lev;
                }
            }
            return null;
        }

        let getNextLevel = (up) => {
            return this.levels[this.levels.indexOf(this.currentLevel) + (up ? 1: -1)];
        }

        let createLevelGen = () => {
            return (this._createSectionLevelGenerator(section, this.currentLevel))();
        }

        let moveToNextLevel = (currentLevelResult) => {
            triedLevels[this.currentLevel] = currentLevelResult;
            let nextLevel = getNextLevel(currentLevelResult);
            if(nextLevel){
                this.currentLevel = nextLevel;
            }
            if(!currentLevelResult && getMaxPassedLevel()){
                return null; 
            }
            return nextLevel;
        }
        
        return function* gen(){
            let levelGen = createLevelGen();
            let res = levelGen.next();
            while(!res.done){
                let nxt = yield res.value;
                res = levelGen.next(nxt);
            }
            if (moveToNextLevel(res.value)){
                res = yield* gen();  // NOTE: it is very important to return the result explicitly from parent generator
                return res;          // The reason is that return from inner generator does not automatically return from the outer one
            } else {
                return getMaxPassedLevel();
            }
        }    
    }

    _createFullGenerator(){
        let sections = this.sections.slice();
        let currentSection = sections.shift();
        let triedSections = {};
        let self = this;
        return function*(){ 
            while(currentSection){
                let gen =  (self._createSectionGenerator(currentSection))();           
                let res = gen.next();
                while(!res.done){
                    let nxt = yield res.value;
                    res = gen.next(nxt);
                }
                triedSections[currentSection] = res.value;
                currentSection = res.value ? sections.shift() : null;
            }
            self.results = triedSections;
        }
    }

    doSupportSections(){
        return true;
    }

    getCurrentSection(){
        return this.currentSection;
    }

    getCurrentAttempt(){
        return this.currentAttempt;
    }

    fetchNext(test) {
        if(!test){
            return this.testgen.next().value;
        } else {
            return this.testgen.next(test).value;
        }
    }
}