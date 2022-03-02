/**
 * A structure of a tree starting from the leaves, the keys are smallest route without collition.
 */
export default class ReverseTree{
    private existingKeys:{[key: string]:FullTreePath} = {};
    private modified = true;
    private memoizedKeys:KeyList[] = [];
    private memoizedPaths:string[] = [];
    insert(node:KeyList):[inserted:FullTreePath|null,modified:ChangedPath|null]{
        this.modified = true;
        let changedPath = null;
        const newPath = new FullTreePath(node);
        // get minimal path
        while(  !this.existingKeys[newPath.key.join(".")] &&
                Object.keys(this.existingKeys).some(key => key.endsWith(newPath.key.join("."))) ){
            newPath.pathSize++;
        }
        // check if minimal path exists (solve keys collition)
        if(this.existingKeys.hasOwnProperty(newPath.strKey)){
            // get path and key for existing keys
            const oldKey = newPath.strKey;
            const oldPath = this.existingKeys[newPath.strKey];
            if(oldPath.path.join(".") === newPath.path.join(".")){return [null,null];}
            // grab additional key pieces until oldPath and new path are different
            do{
                oldPath.pathSize++;
                newPath.pathSize++;
            }while(oldPath.key.join(".")===newPath.key.join("."));
            //replace the oldKey with the differentiation
            delete this.existingKeys[oldKey];
            this.existingKeys[oldPath.key.join(".")] = oldPath;
            changedPath = {
                oldKey: oldKey,
                newKey:oldPath.key.join("."),
                path:oldPath
            };
        }
        // add the new path
        this.existingKeys[newPath.strKey] = newPath;
        return [
            this.existingKeys[newPath.strKey],
            changedPath
        ];
    }
    find(node:KeyList): FullTreePath | undefined{
        const oldPath = Object.values(this.existingKeys).find((path)=>path.path.join(".")===node.join(".")||path.key.join(".")===node.join("."));
        if(!oldPath) {return;}
        return oldPath;
    }
    remove(node:KeyList):[ removed: FullTreePath | null, modified: ChangedPath | null]{
        this.modified = true;
        const oldPath = this.find(node);
        if(!oldPath) {return[ null, null];}
        //remove the old path
        delete this.existingKeys[oldPath.key.join(".")];
        // copy the old path to prevent modifying the old path
        const copyOldPath = Object.create(oldPath);
        // reduce the path_size to find the collitioned_paths
        copyOldPath.path_size--;
        const collitionedPaths = Object.values(this.existingKeys).filter(path => path!==oldPath && path.key.join(".").endsWith(copyOldPath.key.join(".")));
        if(collitionedPaths.length > 1 || collitionedPaths.length === 0) {return [oldPath,null];}
        const collitionedPath = collitionedPaths[0];
        const oldCollitionedKey = collitionedPath.key.join(".");
        delete this.existingKeys[oldCollitionedKey];
        // reduce path_size until we find a collition
        while(!Object.values(this.existingKeys).some(path => path.path.join(".").endsWith(collitionedPath.key.join("."))) && collitionedPath.pathSize>=1)
            {collitionedPath.pathSize--;}
        // remove the collition
        collitionedPath.pathSize++;
        this.existingKeys[collitionedPath.key.join(".")] = collitionedPath;
        return [
            oldPath,
            {
                oldKey:oldCollitionedKey,
                newKey:collitionedPath.key.join("."),
                path: collitionedPath
            }];
    }
    get keys():KeyList[]{
        this.memoize();
        return this.memoizedKeys;
    }
    get paths():string[]{
        this.memoize();
        return this.memoizedPaths;
    }
    private memoize(){
        if(!this.modified){return;}
        this.modified = false;
        this.memoizedKeys = Object.entries(this.existingKeys).map(([_,path]) => path.key);
        this.memoizedPaths=this.memoizedKeys.map(key=>key.join('.'));
    }
}
class FullTreePath{
    pathSize:number=1;
    constructor(public path:KeyList){}
    get key(){ return this.path.slice(-this.pathSize); }
    get strKey(){ return this.key.join("."); }
}
export type TreeNode = { [key:KeyPiece]:TreeNode};
export type KeyList = KeyPiece[];
export type KeyPiece = number|string;
export type ChangedPath = {
    oldKey:string;
    newKey:string;
    path:FullTreePath;
};
