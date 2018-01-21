class TestTreeNode{
    constructor(testId){
        this.testId = testId;
        this.leftChild = null;
        this.rightChild = null;
    }

    addLeftChild(leftChild){
        this.leftChild = leftChild;
    }

    addRightChild(rightChild){
        this.rightChild = rightChild;
    }
}

function makeTestTreeGenerator(root){
    let path = [];
    let node = root;
    return function* traverse(result){
        let subnode = result ? node.rightChild : node.leftChild;
        if(!subnode){
            return {testId: null, path: path};
        }
        let testId = subnode.testId;
        path.push(testId);
        let nextResult = yield {testId: testId, path: path };
        node = subnode;
        yield* traverse(nextResult);
    };
}

class CustomTreeAdaptiveStrategy extends BaseTestingStrategy {
    constructor(tests, tester, config) {
        super(tests, tester, config);
        this.grouped = groupBy(tests, test => test.level);
        this.testTreeTraversalGen = makeTestTreeGenerator(this._createCustomTestTree())(true);
    }

    _getTestById(testId){
        let index = this.tests.map(t => t.id).indexOf(parseInt(testId));
        return index === -1 ? null : this.tests[index];
    }

    fetchNext(testWrapped) {
        let nextResult;
        if (!testWrapped) {
            nextResult =  this.testTreeTraversalGen.next();
        } else {
            nextResult = this.testTreeTraversalGen.next(testWrapped.answeredCorrectly);
        }
        if(nextResult.done){
            console.log("End of tree iteration");
            return null;
        }
        console.log(nextResult.value);
        return { 
            test: this._getTestById(nextResult.value.testId)
        };
    }

    _createCustomTestTree(){
        let pseudoRoot = new TestTreeNode(null);
        let root = new TestTreeNode('2');
        pseudoRoot.addRightChild(root);
        let node1_1 = new TestTreeNode('3');
        let node1_2 = new TestTreeNode('1');
        root.addLeftChild(node1_1);
        root.addRightChild(node1_2);
        let node2_1 = new TestTreeNode('4');
        let node2_2 = new TestTreeNode('1');
        let node2_3 = new TestTreeNode('3');
        let node2_4 = new TestTreeNode('5');
        node1_1.addLeftChild(node2_1);
        node1_1.addRightChild(node2_2);
        node1_2.addLeftChild(node2_3);
        node1_2.addRightChild(node2_4);
        let node3_1 = new TestTreeNode('7');
        let node3_2 = new TestTreeNode('1');
        let node3_3 = new TestTreeNode('4');
        let node3_4 = new TestTreeNode('5');
        let node3_5 = new TestTreeNode('4');
        let node3_6 = new TestTreeNode('6');
        let node3_7 = new TestTreeNode('6');
        let node3_8 = new TestTreeNode('9');
        node2_1.addLeftChild(node3_1);
        node2_1.addRightChild(node3_2);
        node2_2.addLeftChild(node3_3);
        node2_2.addRightChild(node3_4);
        node2_3.addLeftChild(node3_5);
        node2_3.addRightChild(node3_6);
        node2_4.addLeftChild(node3_7);
        node2_4.addRightChild(node3_8);
        let node4_1 = new TestTreeNode('8');
        let node4_2 = new TestTreeNode('1');
        let node4_3 = new TestTreeNode('7');
        let node4_4 = new TestTreeNode('5');
        let node4_5 = new TestTreeNode('7');
        let node4_6 = new TestTreeNode('6');
        let node4_7 = new TestTreeNode('6');
        let node4_8 = new TestTreeNode('9');
        let node4_9 = new TestTreeNode('7');
        let node4_10 = new TestTreeNode('6');
        let node4_11 = new TestTreeNode('4');
        let node4_12 = new TestTreeNode('5');
        let node4_13 = new TestTreeNode('3');
        let node4_14 = new TestTreeNode('10');
        let node4_15 = new TestTreeNode('10');
        let node4_16 = new TestTreeNode('14');
        node3_1.addLeftChild(node4_1);
        node3_1.addRightChild(node4_2);
        node3_2.addLeftChild(node4_3);
        node3_2.addRightChild(node4_4);
        node3_3.addLeftChild(node4_5);
        node3_3.addRightChild(node4_6);
        node3_4.addLeftChild(node4_7);
        node3_4.addRightChild(node4_8);
        node3_5.addLeftChild(node4_9);
        node3_5.addRightChild(node4_10);
        node3_6.addLeftChild(node4_11);
        node3_6.addRightChild(node4_12);
        node3_7.addLeftChild(node4_13);
        node3_7.addRightChild(node4_14);
        node3_8.addLeftChild(node4_15);
        node3_8.addRightChild(node4_16);
        let node5_1 = new TestTreeNode('11');
        let node5_2 = new TestTreeNode('1');
        let node5_3 = new TestTreeNode('8');
        let node5_4 = new TestTreeNode('5');
        let node5_5 = new TestTreeNode('8');
        let node5_6 = new TestTreeNode('6');
        let node5_7 = new TestTreeNode('6');
        let node5_8 = new TestTreeNode('9');
        let node5_9 = new TestTreeNode('8');
        let node5_10 = new TestTreeNode('6');
        let node5_11 = new TestTreeNode('8');
        let node5_12 = new TestTreeNode('5');
        let node5_13 = new TestTreeNode('4');
        let node5_14 = new TestTreeNode('10');
        let node5_15 = new TestTreeNode('10');
        let node5_16 = new TestTreeNode('14');
        let node5_17 = new TestTreeNode('8');
        let node5_18 = new TestTreeNode('6');
        let node5_19 = new TestTreeNode('7');
        let node5_20 = new TestTreeNode('5');
        let node5_21 = new TestTreeNode('7');
        let node5_22 = new TestTreeNode('12');
        let node5_23 = new TestTreeNode('12');
        let node5_24 = new TestTreeNode('9');
        let node5_25 = new TestTreeNode('4');
        let node5_26 = new TestTreeNode('12');
        let node5_27 = new TestTreeNode('12');
        let node5_28 = new TestTreeNode('14');
        let node5_29 = new TestTreeNode('12');
        let node5_30 = new TestTreeNode('14');
        let node5_31 = new TestTreeNode('15');
        let node5_32 = new TestTreeNode('10');

        node4_1.addLeftChild(node5_1);
        node4_1.addRightChild(node5_2);
        node4_2.addLeftChild(node5_3);
        node4_2.addRightChild(node5_4);
        node4_3.addLeftChild(node5_5);
        node4_3.addRightChild(node5_6);
        node4_4.addLeftChild(node5_7);
        node4_4.addRightChild(node5_8);
        node4_5.addLeftChild(node5_9);
        node4_5.addRightChild(node5_10);
        node4_6.addLeftChild(node5_11);
        node4_6.addRightChild(node5_12);
        node4_7.addLeftChild(node5_13);
        node4_7.addRightChild(node5_14);
        node4_8.addLeftChild(node5_15);
        node4_8.addRightChild(node5_16);
        node4_9.addLeftChild(node5_17);
        node4_9.addRightChild(node5_18);
        node4_10.addLeftChild(node5_19);
        node4_10.addRightChild(node5_20);
        node4_11.addLeftChild(node5_21);
        node4_11.addRightChild(node5_22);
        node4_12.addLeftChild(node5_23);
        node4_12.addRightChild(node5_24);
        node4_13.addLeftChild(node5_25);
        node4_13.addRightChild(node5_26);
        node4_14.addLeftChild(node5_27);
        node4_14.addRightChild(node5_28);
        node4_15.addLeftChild(node5_29);
        node4_15.addRightChild(node5_30);
        node4_16.addLeftChild(node5_31);
        node4_16.addRightChild(node5_32);

        return pseudoRoot;
    }
}
