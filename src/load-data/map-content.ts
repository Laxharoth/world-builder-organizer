import ReverseTree from "../data-structure/reverse-tree";
import { CardFile } from "./load-files";

/** the templates */
export const templateCards:CardCollection = {};
/**
 * helps to monitor the files and find the right card to remove or replace 
 * key is the path */
const reverseTemplateCards:ReverseCardCollection = {};
const reverseTemplateTree:ReverseTree = new ReverseTree();
/** The cards */
export const contentCards:CardCollection = {};
/** 
 * helps to monitor the files and find the right card to remove or replace 
 * key is the path */
const reverseContentCards:ReverseCardCollection = {};
const reverseContentTree:ReverseTree = new ReverseTree();
export function existingKeys(){return reverseContentTree.paths;}

export function addTemplate(card:CardFile){
    const key = solveAddCardCollition(templateCards,reverseTemplateCards,reverseTemplateTree,card);
    key && addCard(templateCards,reverseTemplateCards,card,key);
}
export function addContent(card:CardFile) {
    const key = solveAddCardCollition(contentCards,reverseContentCards,reverseContentTree,card);
    key && addCard(contentCards,reverseContentCards,card,key);
}
function addCard(collection:CardCollection,reverseCollection:ReverseCardCollection,card: CardFile, key:string){
    card.name = key;
    collection[key] = card;
    reverseCollection[card.path] = card.name;
}
export function removeTemplate(uri:string) {
    removeCard(templateCards,reverseTemplateCards,reverseTemplateTree,uri);
}
export function removeContent(uri:string) {
    removeCard(contentCards,reverseContentCards,reverseContentTree,uri);
}
export function removeCard(collection:CardCollection,reverseCollection:ReverseCardCollection,reverseTree:ReverseTree,uri:string) {
    solveRemoveCollition(collection,reverseCollection,reverseTree,collection[reverseCollection[uri]]) &&
    delete collection[reverseCollection[uri]];
}
export interface CardCollection{[key: string]:CardFile}
export interface ReverseCardCollection{[key: string]:string}

function solveAddCardCollition(collection:CardCollection,reverseCard:ReverseCardCollection,reverseTree:ReverseTree,card:CardFile){
    const [insert,changed] = reverseTree.insert(card.splitPath);
    if(changed){
        const oldCard = collection[changed.oldKey];
        delete collection[changed.oldKey];
        addCard(collection,reverseCard,oldCard,changed.newKey);
    }
    if(insert){ 
        return insert.strKey;
    }
}
function solveRemoveCollition(collection:CardCollection,reverseCard:ReverseCardCollection,reverseTree:ReverseTree,card:CardFile|undefined){
    if(!card){return null;}
    const [removed,modified] =  reverseTree.remove(card.splitPath);
    if(!modified){return removed;}
    const modifiedCard = collection[modified.oldKey];
    delete collection[modified.oldKey];
    addCard(collection,reverseCard,modifiedCard,modified.newKey);
    return removed;
}
