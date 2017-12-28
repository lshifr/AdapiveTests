
app
.directive('singleTest', function () {
    return {
        templateUrl: 'templates/singleTest.html',
        scope: {
            'test': '<',
            'hasPrevious': '&',
            'hasNext': '&',
            'previous': '&',
            'next': '&',
            'doAnswer': '&'
        },
        controller: function ($scope) {

            $scope.answeredCorrectly = $scope.test.answeredCorrectly;

            $scope.processChoice = function (event) {
                if ($scope.answeredCorrectly === null) {
                    let userAnswer = event.target.innerText;
                    $scope.answeredCorrectly = userAnswer === $scope.test.answer;
                    $scope.doAnswer({ atest: $scope.test, answer: userAnswer });
                }

            }

            $scope.answerWasGiven = () => $scope.answeredCorrectly !== null;

            $scope.wasCorrectAnswer = () => $scope.answeredCorrectly;

            $scope.checkAnswer = (choice) => {
                return choice === $scope.test.userAnswer
            }

            
            $scope.checkCorrectAnswer = (choice) => {
                return choice === $scope.test.answer;
            }
            

            $scope.checkIncorrectAnswer = (choice) => {
                return $scope.checkAnswer(choice) && !$scope.test.answeredCorrectly;
            }
        },
        link: function (scope, elem) {
            scope.$watch('test',
                function (newVal) {
                    //console.log(newVal);
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
    template: `<single-test 
    test="$ctrl.getCurrentTest()"
    has-previous="$ctrl.hasPrevious(atest)"
    has-next="$ctrl.hasNext(atest)"
    previous="$ctrl.getPrevious(atest)"
    next="$ctrl.getNext(atest)"
    do-answer="$ctrl.setAnswered(atest, answer)"
    ng-if="$ctrl.getCurrentTest()"
    >
    </single-test>`,
    controller: function (testsService) {

        this.testingStrategy = null;

        /* TODO: will need router / resolves to cleanly inject the data into the 
        *  component. Right now, using ng-if to avoid errors, but that's a hack.
        */ 
        testsService.getTests().then(res => {
            this.tester = new Tester(simpleDeepClone(res), SimpleAdaptiveTestingStrategy);
        });

        this.hasNext = test => this.tester.hasNext(test);
        this.hasPrevious = test => this.tester.hasPrevious(test);
        this.getNext = test => this.tester.getNext(test);
        this.getPrevious = test => this.tester.getPrevious(test);
        this.setAnswered = (test, answer) => this.tester.setAnswered(test, answer);
        this.getCurrentTest  = () => {
            if(this.tester){
                return this.tester.getCurrentTest()
            } else {
                return null;
            }
        };
    }
});            