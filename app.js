hljs.initHighlightingOnLoad();

function makeHighlightedHTML(contents){
    let pr = document.createElement('pre');
    let cd = document.createElement('code');
    cd.innerHTML = contents;
    pr.appendChild(cd);
    hljs.highlightBlock(pr);
    return $(pr).html();
}

tests.forEach(test => {
    test.contents = test.contentLines.join("\n");
    test.answeredCorrectly = null;
    test.userAnswer = null;
    test.htmlContents = makeHighlightedHTML(test.contents);
});

var allTestsTemplate = `<single-test 
            test="$ctrl.currentTest"
            has-previous="$ctrl.hasPrevious(atest)"
            has-next="$ctrl.hasNext(atest)"
            previous="$ctrl.getPrevious(atest)"
            next="$ctrl.getNext(atest)"
            do-answer="$ctrl.setAnswered(atest, answer)"
            >
            </single-test>`


angular.module('adaptivetests', ['ngSanitize'])
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
        template: allTestsTemplate,
        controller: function () {
            this.currentTest = tests[0]; // Initial value

            function getTestIndex(test) {
                let index = tests.map(t => t.id).indexOf(test.id);
                //console.log("The index for test with id "+ test.id + " is: " + index);
                return index;
            }

            this.hasNext = function (test) {
                let index = getTestIndex(test);
                return index >= 0 && index < tests.length - 1;
            }
            this.hasPrevious = function (test) {
                return getTestIndex(test) > 0;
            }

            this.getNext = function (test) {
                if (this.hasNext(test)) {
                    this.currentTest = tests[getTestIndex(test) + 1];
                }
            }

            this.setAnswered = function (test, answer) {
                //console.log('In setAnswered');
                //console.log(test, answer);
                let index = getTestIndex(test);
                tests[index].answeredCorrectly = answer === test.answer;
                tests[index].userAnswer = answer;
            }

            this.getPrevious = function (test) {
                if (this.hasPrevious(test)) {
                    this.currentTest = tests[getTestIndex(test) - 1];
                }
            }
        }
    });