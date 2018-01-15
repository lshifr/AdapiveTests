
app
.directive('singleTest', function () {
    return {
        templateUrl: 'templates/singleTest.html',
        scope: {
            'wrappedTest': '<',
            'hasPrevious': '&',
            'hasNext': '&',
            'previous': '&',
            'next': '&',
            'doAnswer': '&',
            'section': '<',
            'attempt': '<'
        },
        controller: function ($scope) {

            $scope.test = $scope.wrappedTest.test;

            $scope.answeredCorrectly = $scope.wrappedTest.answeredCorrectly;

            $scope.processChoice = function (event) {
                if ($scope.answeredCorrectly === null) {
                    let userAnswer = event.target.innerText;
                    $scope.answeredCorrectly = userAnswer === $scope.test.answer;
                    $scope.doAnswer({ atest: $scope.wrappedTest, answer: userAnswer });
                }

            }

            $scope.answerWasGiven = () => $scope.answeredCorrectly !== null;

            $scope.wasCorrectAnswer = () => $scope.answeredCorrectly;

            $scope.checkAnswer = (choice) =>  choice === $scope.wrappedTest.userAnswer;
            
            $scope.checkCorrectAnswer = (choice) => {
                if(!$scope.test){
                    return false;
                }
                return choice === $scope.test.answer;
            };
            
            $scope.checkIncorrectAnswer = (choice) => {
                return $scope.checkAnswer(choice) && !$scope.wrappedTest.answeredCorrectly;
            }
        },
        link: function (scope, elem) {
            scope.$watch('wrappedTest',
                function (newVal) {
                    //console.log(newVal);
                    scope.test = scope.wrappedTest.test;
                    scope.answeredCorrectly = newVal.answeredCorrectly;
                }
            )
        }
        /*
        ,
        link:function(scope, elem){
            scope.$watch('test',
                function(){
                    scope.answeredCorrectly = null;
                    //alert('Changed!');
                    
                    scope.$evalAsync(
                        function(){
                            
                            scope.update(() => {
                                scope.answeredCorrectly = null;
                                hljs.highlightBlock(elem[0].querySelector('pre code'));
                            })
                        }
                    )
                    
                },
                true
            )
        }
        */
    }
})
.directive('testCode', function () {
    return {
        scope: {
            'code': '<'
        },
        template: '<pre ng-bind-html="code"></pre>'
            /*
            `<pre>
                    <code class="javascript hljs">{{code}}</code>
                </pre>`
            */,
        controller: function ($scope, $timeout) {
            /*
            $scope.timeout = (f, delay) => $timeout(f, delay);
            $scope.timeout(() => {
                hljs.highlightBlock(document.querySelector('pre code'));
            }, 2000);
            */
        },
        link: function (scope, elem) {

            /*
            scope.$watch('code',
                () => {
                    alert('Changed!');
                    
                    hljs.highlightBlock(document.querySelector('pre code'));
                    
                }
            )
            */
        }
    }
})
.component('allTests', {
    templateUrl: 'templates/testManager.html',
    controller: function (testsService, $scope) {

        this.testingStrategy = null;

        /* TODO: will need router / resolves to cleanly inject the data into the 
        *  component. Right now, using ng-if to avoid errors, but that's a hack.
        */ 

        this.availableStrategies = {
            'Simple': SimpleTestingStrategy,
            'SimpleAdaptive': SimpleAdaptiveTestingStrategy,
            'SimpleAdaptiveGen': SimpleAdaptiveTestingStrategyGen,
            'CustomTree': CustomTreeAdaptiveStrategy,
            'SimpleSections': SimpleStrategyWithSections
        }

        this.getStrategies = () => Object.keys(this.availableStrategies);

        this.setStrategy = function(strategyName){
            if(this.testingStrategy === strategyName){
                return;
            }
            this.testingStrategy = strategyName;
            testsService.getTests().then(res => {
                this.tester = new Tester(simpleDeepClone(res), this.availableStrategies[strategyName]);
            });
        }

        this.$onInit = () => { this.setStrategy('SimpleAdaptiveGen') };

        this.hasNext = () => this.tester.hasNext();
        this.hasPrevious = () => this.tester.hasPrevious();
        this.getNext = () => this.tester.next();
        this.getPrevious = () => this.tester.previous();
        this.setAnswered = (test, answer) => this.tester.setAnswered(test, answer);
        this.getCurrentTest  = () => {
            if(this.tester){
                return this.tester.getCurrentTest()
            } else {
                return null;
            }
        };
        this.getSection = () => {
            return this.tester.strategy.getCurrentSection();
        };
        this.getCurrentAttempt = () => {
            if(this.tester.strategy.doSupportSections()){
                return this.tester.strategy.getCurrentAttempt();
            }
        }

        /*

        $scope.$watch(
            this.getCurrentTest, 
            function(){
                alert("Changed!");
            },
            true
        );

        */


    }
});            