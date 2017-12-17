var tests = [
    {
        "id": 1,
        "contentLines": [
            "var foo = function foo() {",
            "  console.log(foo === foo);",
            "};",
            "foo();"
        ],
        "question": "What is printed in the console?",
        "choices": ["false", "true", "ReferenceError"],
        "answer": "true",
        "level": "Moderate"
    },
    {
        "id": 2,
        "contentLines":[
            "function aaa() {",
            "   return",
            "   {",
            "       test: 1",
            "   };",
            "}",
            "alert(typeof aaa());"
        ],
        "question": "What does the above alert?",
        "choices": ["function", "number", "object", "undefined"],
        "answer": "undefined",
        "level": "Easy"
    },
    {
        "id": 3, 
        "contentLines":[
            "Number(\"1\") - 1 == 0;"
        ],
        "question":"What is the result?",
        "choices":[
            "true", "false", "TypeError"
        ],
        "answer":"true",
        "level":"Easy"
    },
    {
        "id":4,
        "contentLines":[
            "(true + false) > 2 + true;"
        ],
        "question":"What is the result?",
        "choices":[
            "true","false","TypeError","NaN"
        ],
        "answer":"false",
        "level":"Easy"
    },
    {
        "id":5,
        "contentLines":[
            "function bar() {",
            "   return foo;",
            "   foo = 10;",
            "   function foo() {}",
            "   var foo = '11';",
            "}",
            "alert(typeof bar());"
        ],
        "question":"What does the above alert?",
        "choices":[
            "number", "function", "undefined", "string", "Error"
        ],
        "answer":"function",
        "level": "Hard"
    },
    {
        "id":6, 
        "contentLines":[
            "'1' - - '1';"
        ],
        "question":"What is the result?",
        "choices":[
            "0", "2", "11", "'11'"
        ],
        "answer": "2",
        "level": "Moderate"
    },
    {
        "id": 7,
        "contentLines":[
            "var x = 3;",
            "",
            "var foo = {",
            "   x: 2,",
            "   baz: {",
            "       x: 1,",
            "       bar: function() {",
            "           return this.x;",
            "       }",
            "   }",
            "}",
            "",
            "var go = foo.baz.bar;",
            "", 
            "alert(go());",
            "alert(foo.baz.bar());"
        ],
        "question":"What is the order of values alerted?",
        "choices":[
            "1,2", "1, 3", "2, 1", "2, 3", "3,1", "3,2"
        ],
        "answer": "3,1",
        "level":"Easy"
    }, 
    {
        "id": 8,
        "contentLines":[
            "new String(\"This is a string\") instanceof String;"
        ],
        "question":"What is the result?",
        "choices":[
            "true","false","TypeError"
        ],
        "answer":"true",
        "level":"Easy"                                                               
    },
    {
        "id":9,
        "contentLines":[
            "[] + [] + 'foo'.split('');"
        ],
        "question":"What is the result?",
        "choices":[
            "'f, o, o'", "TypeError", "['f', 'o', 'o']",  "[][]['f', 'o', 'o']"
        ],
        "answer":"'f, o, o'",
        "level":"VeryHard"
    },
    {
        "id":10,
        "contentLines":[
            "new Array(5).toString();"
        ],
        "question":"What is the result?",
        "choices":[
            "\",,,,\"",  "[]", "\"[]\""
        ],
        "answer": "\",,,,\"",
        "level" : "Hard"
    },
    {
        "id":11,
        "contentLines":[
            "var myArr = ['foo', 'bar', 'baz'];",
            "myArr.length = 0;",
            "myArr.push('bin');",
            "console.log(myArr);"
        ],
        "question":"What is printed in the console?",
        "choices":[
            "['foo', 'bar', 'baz']", 
            "['foo', 'bar', 'baz', 'bin']",  
            "['bin', 'foo', 'bar', 'baz']", 
            "['bin']"
        ],
        "answer" : "['bin']",
        "level":"Easy"
    },
    {
        "id" : 12, 
        "contentLines":[
            "String('Hello') === 'Hello';"
        ],
        "question":"What is the result?",
        "choices":[
            "true", "false","TypeError"
        ],
        "answer":"true",
        "level":"Moderate"
    },
    {
        "id":13,
        "contentLines":[
            "var x = 0;",
            "function foo() {",
            "   x++;",
            "   this.x = x;",
            "   return foo;",
            "}",
            "var bar = new new foo;",
            "console.log(bar.x);"
        ],
        "question":"What is printed in the console?",
        "choices":[
            "ReferenceError","TypeError", "undefined", "0", "1"
        ], 
        "answer" : "undefined",
        "level":"Hard"
    },
    {
        "id" : 14,
        "contentLines":[
            "\"This is a string\" instanceof String;"
        ],
        "question":"What is the result?",
        "choices":[
            "true", "false", "TypeError"
        ],
        "answer":"false",
        "level":"VeryHard"
    },
    {
        "id" : 15,
        "contentLines":[
            "var bar = 1, foo = {};",
            "",
            "foo: {",
            "   bar: 2;",
            "   baz: ++bar;",
            "};",
            "foo.baz + foo.bar + bar;"
        ],
        "question":"What is the result?",
        "choices":[
            "ReferenceError", "TypeError", "undefined", "NaN", 4
        ], 
        "answer":"NaN",
        "level":"Hard"
    },
    {
        "id": 16,
        "contentLines":[
            "var myArr = ['foo', 'bar', 'baz'];",
            "myArr[2];",
            "console.log('2' in myArr);"
        ],
        "question":"What is printed in the console?",
        "choices":[
            "true", "false", "ReferenceError"
        ], 
        "answer": "true",
        "level":"Moderate"
    },
    {
        "id": 17, 
        "contentLines":[
            "var arr = [];",
            "arr[0]  = 'a';",
            "arr[1]  = 'b';",
            "arr.foo = 'c';",
            "alert(arr.length);"
        ], 
        "question":"What does the above alert?",
        "choices":[
            "1", "2", "3", "undefined"
        ], 
        "answer":"2",
        "level":"Easy"
    }, 
    {
        "id": 18,
        "contentLines":[
            "10 > 9 > 8 === true;"
        ], 
        "question":"What is the result?",
        "choices":[
            "true", "false"
        ], 
        "answer":"false",
        "level":"Easy"
    }, 
    {
        "id" : 19, 
        "contentLines":[
            "function foo(a, b) {",
            "   arguments[1] = 2;",
            "   alert(b);",
            "}",
            "foo(1);"
        ], 
        "question":"What does the above alert?",
        "choices":[
            "2", "undefined", "ReferenceError"
        ], 
        "answer" : "undefined",
        "level":"Moderate"
    }, 
    {
        "id" : 20, 
        "contentLines":[
            "NaN === NaN;"
        ], 
        "question":"What is the result?", 
        "choices":[
            "true", "false", "TypeError"
        ], 
        "answer":"false",
        "level":"Easy"
    }
];