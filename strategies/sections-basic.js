class MultiAttemptTestWrapper extends BaseTestWrapper{
    constructor(testObject, options){
        super(testObject.test, options);
        this.attempt = testObject.attempt;
    }

    getTestKey(){
        return this.test ? '' + this.test.id + '_' + this.attempt : null; 
    }    
}


class SimpleStrategyWithSections extends BaseTestingStrategy {
    constructor(tests, tester, config) {
        super(tests, tester, config);
        this.currentSection = null;
        this.sections = ['DataTypes', 'ExecutionContextAndObjectMethods'];
        this.testsInSection = 4;
        this.sectionTests = this._prepareTests(tests, this.sections);
        this.currentLevel = 'Easy';
        this.sectionLevelAttempts = 2;
        this.sectionPassLevel = 0.75;
        this.levels = ["Easy", "Moderate", "Hard"]; // Override
        this.testgen = (this._createFullGenerator())();
        this.maxTests = Infinity; // Hard-coded for now
        /*
        this.sectionPassCondition = function(sectionTests){
            let totalQuestions = sectionTests.length;
            let passedQuestions = sectionTests.filter(test => test.answeredCorrectly).length;
            return passedQuestions / totalQuestions >= 0.75;
        }
        */
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
        let attempts = 0;
        console.log('Creating section level generator for section' + section + 'and level' + level);
        console.log('All tests we have at this point available are:');
        console.log(this.sectionTests);
        let tests = this.sectionTests[section][level];
        let max_attempts = this.sectionLevelAttempts;
        let passLevel = this.sectionPassLevel;
        let self = this;
        return function*(){
            let previous = null;
            let total = 0;
            let passed = 0;
            while(attempts < max_attempts){
                console.log('About to begin the next test iteration. Tests:');
                console.log(tests);
                for(let test of tests){
                    previous = yield {
                        test: test, 
                        attempt: attempts
                    };
                    total += 1;
                    passed += previous.answeredCorrectly? 1 : 0;
                }
                if(passed / total >= passLevel){
                    console.log('Section '+ section + ', level '+ level + ': passed ' + passed + 'of' + total);
                    return true; // Signal that this level has been passed
                }
                attempts++;
                // Clear previous results

                console.log('Section '+ section + ', level '+ level + ': failed, passing ' + passed + ' out of ' + total);
                console.log('Starting over, attempt #' + attempts + '\n');

                passed = 0;
                total = 0;

                tests.forEach(test => {
                    test.answeredCorrectly = null;
                    test.userAnswer = null;
                });

                // self.tester._removeHistory(tests);
            }
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
            /*
            if(prevResult){
                return this.levels[this.levels.indexOf(this.currentLevel) + 1];    
            }
            if(getMaxPassedLevel()){
                return null; // It is enough to have just some level passed
            }
            return this.levels[this.levels.indexOf(this.currentLevel) -1 ];
            */
        }

        let createLevelGen = () => {
            return (this._createSectionLevelGenerator(section, this.currentLevel))();
        }

        let moveToNextLevel = (currentLevelResult) => {
            triedLevels[this.currentLevel] = currentLevelResult;
            let nextLevel = getNextLevel(currentLevelResult);
            if(nextLevel){
                this.currentLevel = nextLevel;
                console.log('Moving to the next level: ' + this.currentLevel);
                console.log('Results so far:');
                console.log(triedLevels);
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
                res = yield* gen();
                return res;
            } else {
                let maxlev = getMaxPassedLevel();
                console.log('Section '+ section + ': max passed level: ' + maxlev);
                return maxlev;
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
                    console.log('Section ' + currentSection + ' tests. Next:');
                    console.log(res);
                    console.log('---------------');
                }
                console.log('Section ' + currentSection + ' test is over. Result:');
                console.log(res.value);
                triedSections[currentSection] = res.value;
                currentSection = res.value ? sections.shift() : null;
            }
            console.log('Test is over. Results:');
            console.log(triedSections);
        }
    }


    doSupportSections(){
        return true;
    }

    getCurrentSection(){
        return this.currentSection;
    }

    fetchNext(test) {
        if(!test){
            return this.testgen.next().value;
        } else {
            return this.testgen.next(test).value;
        }
    }
}