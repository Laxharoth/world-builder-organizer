/**
 * A structure of a tree starting from the leaves, the keys are smallest route without collition.
 */
export default class ReverseTree{
    existing_keys:{[key: string]:FullTreePath} = {};
    insert(node:KeyList):[inserted:FullTreePath|null,deleted:ChangedPath|null]{
        let changed_path = null;
        const new_path = new FullTreePath(node);
        // get the key for new_path
        const form_key  = () => new_path.key.join(".");
        // get minimal path
        while(  !this.existing_keys[new_path.key.join(".")] &&
                Object.keys(this.existing_keys).some(key => key.endsWith(new_path.key.join("."))) ){
            new_path.path_size++;
        }
        // check if minimal path exists (solve keys collition)
        if(this.existing_keys.hasOwnProperty(form_key())){
            // get path and key for existing keys
            const old_key = form_key();
            const old_path = this.existing_keys[form_key()];
            if(old_path.path.join(".") === new_path.path.join("."))return [null,null];
            // grab additional key pieces until old_path and new path are different
            do{
                old_path.path_size++;
                new_path.path_size++;
            }while(old_path.key.join(".")===new_path.key.join("."));
            //replace the old_key with the differentiation
            delete this.existing_keys[old_key];
            this.existing_keys[old_path.key.join(".")] = old_path;
            changed_path = {
                old_key,
                new_key:old_path.key.join("."),
                path:old_path
            }
        }
        // add the new path
        this.existing_keys[form_key()] = new_path;
        return [
            this.existing_keys[form_key()],
            changed_path
        ];
    }
    find(node:KeyList): FullTreePath | undefined{
        const old_path = Object.values(this.existing_keys).find((path)=>path.path.join(".")===node.join(".")||path.key.join(".")===node.join("."));
        if(!old_path) return;
        return old_path;
    }
    remove(node:KeyList):[ removed: FullTreePath | null, changed: ChangedPath | null]{
        const old_path = this.find(node);
        if(!old_path) return[ null, null];
        //remove the old path
        delete this.existing_keys[old_path.key.join(".")];
        // copy the old path to prevent modifying the old path
        const copy_old_path = Object.create(old_path);
        // reduce the path_size to find the collitioned_paths
        copy_old_path.path_size--;
        const collitioned_paths = Object.values(this.existing_keys).filter(path => path!==old_path && path.key.join(".").endsWith(copy_old_path.key.join(".")));
        if(collitioned_paths.length > 1 || collitioned_paths.length === 0) return [old_path,null];
        const collitioned_path = collitioned_paths[0];
        const old_collitioned_key = collitioned_path.key.join(".")
        delete this.existing_keys[old_collitioned_key];
        // reduce path_size until we find a collition
        while(!Object.values(this.existing_keys).some(path => path.path.join(".").endsWith(collitioned_path.key.join("."))) && collitioned_path.path_size>=1)
            collitioned_path.path_size--;
        // remove the collition
        collitioned_path.path_size++;
        this.existing_keys[collitioned_path.key.join(".")] = collitioned_path;
        return [
            old_path,
            {
                old_key:old_collitioned_key,
                new_key:collitioned_path.key.join("."),
                path: collitioned_path
            }];
    }
    get keys():KeyList[]{
        return Object.entries(this.existing_keys).map(([_,path]) => path.key);
    }
    get paths():string[]{
        return this.keys.map(key=>key.join('.'));
    }
}
class FullTreePath{
    path_size:number=1;
    constructor(public path:KeyList){}
    get key(){ return this.path.slice(-this.path_size); }
}
export type TreeNode = { [key:KeyPiece]:TreeNode};
export type KeyList = KeyPiece[];
export type KeyPiece = number|string;
export type ChangedPath = {
    old_key:string;
    new_key:string;
    path:FullTreePath;
}
