import ReverseTree from "../data-structure/reverse-tree";
import { CardFile } from "./load-files";

/** the templates */
export const template_cards:CardCollection = {};
/**
 * helps to monitor the files and find the right card to remove or replace 
 * key is the path */
const reverse_template_cards:ReverseCardCollection = {};
const reverse_template_tree:ReverseTree = new ReverseTree();
/** The cards */
export const content_cards:CardCollection = {};
/** 
 * helps to monitor the files and find the right card to remove or replace 
 * key is the path */
const reverse_content_cards:ReverseCardCollection = {};
const reverse_content_tree:ReverseTree = new ReverseTree();

export function addTemplate(card:CardFile){
    const key = solveAddCardCollition(template_cards,reverse_template_cards,reverse_template_tree,card);
    key && addCard(template_cards,reverse_template_cards,card,key);
}
export function addContent(card:CardFile) {
    const key = solveAddCardCollition(content_cards,reverse_content_cards,reverse_content_tree,card);
    key && addCard(content_cards,reverse_content_cards,card,key);
}
function addCard(collection:CardCollection,reverse_collection:ReverseCardCollection,card: CardFile, key:string){
    card.name = key;
    collection[key] = card;
    reverse_collection[card.path] = card.name;
}
export function removeTemplate(uri:string) {
    removeCard(template_cards,reverse_template_cards,reverse_template_tree,uri);
}
export function removeContent(uri:string) {
    removeCard(content_cards,reverse_content_cards,reverse_content_tree,uri);
}
export function removeCard(collection:CardCollection,reverse_collection:ReverseCardCollection,reverse_tree:ReverseTree,uri:string) {
    solveRemoveCollition(collection,reverse_collection,reverse_tree,collection[reverse_collection[uri]]) &&
    delete collection[reverse_collection[uri]];
}
export interface CardCollection{[key: string]:CardFile}
export interface ReverseCardCollection{[key: string]:string}

function solveAddCardCollition(collection:CardCollection,reverse_card:ReverseCardCollection,reverse_tree:ReverseTree,card:CardFile){
    const [insert,changed] = reverse_tree.insert(card.split_path);
    if(changed){
        const old_card = collection[changed.old_key];
        delete collection[changed.old_key];
        addCard(collection,reverse_card,old_card,changed.new_key);
    }
    if(insert){ 
        return insert.str_key;
    }
}
function solveRemoveCollition(collection:CardCollection,reverse_card:ReverseCardCollection,reverse_tree:ReverseTree,card:CardFile|undefined){
    if(!card){return null;}
    const [removed,modified] =  reverse_tree.remove(card.split_path);
    if(!modified){return removed;}
    const modified_card = collection[modified.old_key];
    delete collection[modified.old_key];
    addCard(collection,reverse_card,modified_card,modified.new_key);
    return removed;
}
