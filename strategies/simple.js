class SimpleTestingStrategy extends BaseTestingStrategy {
    constructor(tests, tester, config) {
        super(tests, tester, config);
    }

    _getTestIndex(testWrapped) {
        assert(testWrapped);
        return this.tests.map(t => t.id).indexOf(testWrapped.getTestKey());
    }

    fetchNext(testWrapped) {
        let test = testWrapped ? this.tests[this._getTestIndex(testWrapped) + 1] : this.tests[0];
        return { // test object
            test: test
        }
    }
}

class SimpleAdaptiveTestingStrategy extends BaseTestingStrategy {
    constructor(tests, tester, config) {
        super(tests, tester, config);
        this.grouped = groupBy(tests, test => test.level);
    }

    fetchNext(testWrapped) {
        let allowedLevels;
        if(testWrapped){
            let index = this.levels.indexOf(testWrapped.test.level);
            let maxAllowedLevel =  index + (testWrapped.answeredCorrectly ? 1 : (index ? -1 : 0));
            allowedLevels = this.levels.slice(0, maxAllowedLevel + 1).reverse(); 
        } else { // The first test
            allowedLevels = this.levels.slice();
        }
        for (let lev of allowedLevels) {
            if (this.grouped[lev].length > 0) {
                return { 
                    test: this.grouped[lev].shift()
                };
            }
        }
        return null; // No allowed questions left
    }
}


/**
 *  The same as SimpleAdaptiveTestingStrategy, but using generators. The workflow
 *  is not fully async though, since there is certain  inversion of control here:
 *  because angular has its own event loop (digest cycle), and because the template
 *  for single test we use here, uses the method call (hasNext()) to determine 
 *  whether or not to render the Next button, the generator of tests is here driven
 *  by angular. Once the user gives some answer to a current question, the hasNext()
 *  method is called and uses a separate branch, which fetches the next test.
 * 
 *  What we'd perhaps want to do would be to reverse the order / control, so that 
 *  once the user gives an answer, we first fetch the next question, and then let
 *  the angular know, so that the generator / coroutine is the one to take control,
 *  and angular is a driven one.
 */
class SimpleAdaptiveTestingStrategyGen extends BaseTestingStrategy {
    constructor(tests, tester, config) {
        super(tests, tester, config);
        this.grouped = groupBy(tests, test => test.level);
        this.testgen = makeMulticollectionGen(this.grouped, ["Easy"])();
    }

    fetchNext(testWrapped) {
        if (!testWrapped) { // First test
            return { 
                test: this.testgen.next().value
            };
        }
        let index = this.levels.indexOf(testWrapped.test.level);
        let maxAllowedLevel = index + (testWrapped.answeredCorrectly ? 1 : (index ? -1 : 0));
        let allowedLevels = this.levels.slice(0, maxAllowedLevel + 1).reverse();
        return {
            test:this.testgen.next(allowedLevels).value
        };
    }
}
