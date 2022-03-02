import * as assert from 'assert';
import { compareArray, shuffle } from '../../data-structure/ArrayFunctions';
import ReverseTree, { KeyList } from '../../data-structure/reverse-tree';

const file_paths = [
    ["a","z"],
    ["a","c","e","d","z"],
    ["a","b","d","z"],
    ["a","b","e","d","z"],
    ["a","c","z"],
]
Object.freeze(file_paths);
suite('ReverseTree', () => {
    test("insert in tree",()=>{
        const tree = new ReverseTree();
        tree.insert(["a","z"]);
        assert.strictEqual(assertIncludesAll(tree.keys,[["z"]]),true,`check after insert ${["a","z"]} failed.`);
        tree.insert(["a","c","e","d","z"]);
        assert.strictEqual(assertIncludesAll(tree.keys,[["a","z"],["d","z"]]),true,`check after insert ${["a","c","e","d","z"]} failed.`);
        tree.insert(["a","b","d","z"]);
        assert.strictEqual(assertIncludesAll(tree.keys,[["a","z"],["e","d","z"],["b","d","z"]]),true,`check after insert ${["a","b","d","z"]} failed.`);
        tree.insert(["a","b","e","d","z"]);
        assert.strictEqual(assertIncludesAll(tree.keys,[["a","z"],["b","e","d","z"],["b","d","z"],["c","e","d","z"]]),true,`check after insert ${["a","b","e","d","z"]} failed.`);
        tree.insert(["a","c","z"]);
        assert.strictEqual(assertIncludesAll(tree.keys,[["a","z"],["b","d","z"],["b","e","d","z"],["c","e","d","z"],["c","z"]]),true,`check after insert ${["a","c","z"]} failed.`);
    })
    test("insert order does not matter",()=>{
        const paths = [...file_paths];
        for (let index = 0; index < 10; index++) {
            const tree = new ReverseTree()
            shuffle(paths);
            for(const path of paths){
                tree.insert(path);
            }
            assert.strictEqual(assertIncludesAll(tree.keys,[["a","z"],["b","d","z"],["b","e","d","z"],["c","e","d","z"],["c","z"]]),true);
        }
    })
    test("does not contain duplicates",()=>{
        const tree = new ReverseTree()
        for(const path of file_paths){
            tree.insert(path);
            const [ new_path,oldPath ] = tree.insert(path);
            assert.strictEqual(new_path,null);
            assert.strictEqual(oldPath,null);
        }
        const paths = tree.keys;
        for(const compare_path of paths){
            let count_equals = 0;
            paths.forEach(path =>{if(compareArray(path,compare_path)){count_equals++;}});
            assert.strictEqual(count_equals,1);
        }
    })
    test("remove from tree in inserting order", () =>{
        const tree = new ReverseTree();
        tree.insert(["a","z"]);
        tree.insert(["a","c","e","d","z"]);
        tree.insert(["a","b","d","z"]);
        tree.insert(["a","b","e","d","z"]);
        tree.insert(["a","c","z"]);
        //start removing
        tree.remove(["a","c","z"]);
        assert.strictEqual(assertIncludesAll(tree.keys,[["a","z"],["b","e","d","z"],["b","d","z"],["c","e","d","z"]]),true,`check after removing ${["a","c","z"]} failed.`);
        tree.remove(["a","b","e","d","z"]);
        assert.strictEqual(assertIncludesAll(tree.keys,[["a","z"],["e","d","z"],["b","d","z"]]),true,`check after removing ${["a","b","e","d","z"]} failed.`);
        tree.remove(["a","b","d","z"]);
        assert.strictEqual(assertIncludesAll(tree.keys,[["a","z"],["d","z"]]),true,`check after removing ${["a","b","d","z"]} failed.`);
        tree.remove(["a","c","e","d","z"]);
        assert.strictEqual(assertIncludesAll(tree.keys,[["z"]]),true,`check after removing ${["a","c","e","d","z"]} failed.`);
    })
    test("remove from tree in diferent order", () =>{
        const tree = new ReverseTree();
        tree.insert(["a","z"]);
        tree.insert(["a","c","e","d","z"]);
        tree.insert(["a","b","d","z"]);
        tree.insert(["a","b","e","d","z"]);
        tree.insert(["a","c","z"]);

        tree.remove(["a","b","d","z"])
        assert.strictEqual(assertIncludesAll(tree.keys,[["a","z"],["b","e","d","z"],["c","e","d","z"],["c","z"]]),true,`remove ${["a","b","d","z"]} should not remove collition`);
        tree.remove(["a","b","e","d","z"]);
        assert.strictEqual(assertIncludesAll(tree.keys,[["a","z"],["d","z"],["c","z"]]),true,`remove ${["a","b","e","d","z"]} should remove 2 levels in ${["c","e","d","z"]}`);
    })
    test("find from reverse tree",()=>{
        const tree = new ReverseTree();
        tree.insert(["a","z"]);
        tree.insert(["a","c","e","d","z"]);
        tree.insert(["a","b","d","z"]);
        tree.insert(["a","b","e","d","z"]);
        tree.insert(["a","c","z"]);

        assert.strictEqual(tree.find(["z"]),undefined);
        assert.notStrictEqual(tree.find(["a","z"]),undefined);
        assert.strictEqual(tree.find(["e","d","z"]),undefined);
        assert.notStrictEqual(tree.find(["b","e","d","z"]),undefined);
        assert.notStrictEqual(tree.find(["a","b","e","d","z"]),undefined);
    })
})

function assertIncludesAll(actual:KeyList[], expected:KeyList[]){
    return  actual
            .every( path=>
                expected
                .some(arr=>compareArray(path,arr))
            ) &&
            expected
            .every( path=>
                actual
                .some(arr=>compareArray(path,arr))
            ); 
}

