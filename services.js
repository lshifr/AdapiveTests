app.service('testsService', testsService);

function testsService($http){
    let _tests = null;

    function makeHighlightedHTML(contents){
        let pr = document.createElement('pre');
        let cd = document.createElement('code');
        cd.innerHTML = contents;
        pr.appendChild(cd);
        hljs.highlightBlock(pr);
        return $(pr).html();
    }
    
    function preprocessTest(test){
        test.contents = test.contentLines.join("\n");
        test.htmlContents = makeHighlightedHTML(test.contents);
    }

    this.getTests = function(){
        if(!_tests){
            _tests = $http.get("/AdaptiveTests/tests.json")
                .then(res => res.data)
                .then(res => {
                    res.forEach(preprocessTest);
                    return res;
                });
        }
        return _tests;
    }
}