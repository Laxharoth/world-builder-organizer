import * as fs from 'fs';
import * as Yaml from 'yaml';
import {Document} from 'yaml';

import template from './template';
import {META_VARIABLES} from '../constant';
/** Load files to initialize a world build project */
export default async function loadFiles(files: {[key: string]: string}) {
    const doc = new Document();
    (doc.contents = addYamlItentation(template)) &&
        (files.template = doc.toString());
}
function addYamlItentation(obj: {[key: string]: string}) {
    const copy = {...obj};
    for (const [key, value] of Object.entries(copy)) {
        copy[key] = `${value}\n`;
    }
    return copy;
}
export function isCardFile(card: CardFile) {
    return card instanceof Object && card.name && card.description;
}
export class CardFile {
    name: string;
    description: string;
    constructor(public path: string, {name, description}: CardFile) {
        this.name = name;
        this.description = (typeof description === 'string') ? description : '';
    }
    get splitPath() {
        return this.path.split(/\/|\\/);
    }
    get label() {
        return this.name;
    };
}
/** load a yaml file and parse it as a CardFile */
export function readCardFile(uri: string): CardFile|null {
    // Get Yalm raw file without meta variables
    const yamlString = fs.readFileSync(uri).toString().replace(
        META_VARIABLES, (fullMatch, innerContent) => {
            if (fullMatch === '[@name]') {
                return fullMatch;
            };
            return '';
        });
    const yaml = Yaml.parse(yamlString) as CardFile;
    if (isCardFile(yaml)) {
        return new CardFile(uri, yaml);
    }
    return null;
}
enum FileNamesEnum {
    template = 'template'
}
export type FileName = `${FileNamesEnum}`;
export type FileNames = {
    [key in FileNamesEnum]: string;
};