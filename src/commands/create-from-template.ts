import * as fs from 'fs';
import * as path from 'path';
import * as vscode from "vscode";
import createFile from '../create-file/create-file';
import { extractContentVariables, setVariable } from '../parser';
import { template_cards } from './../load-data/map-content';

export default async function createFromTemplate(){
    const card = await vscode.window.showQuickPick(Object.values(template_cards));
    if(!card) return;
    const file_path = await vscode.window.showInputBox({ prompt:"Enter the name of the card" });
    if(!file_path) return;
    let content;
    try{ content = (await fs.promises.readFile(card.path)).toString(); }
    catch(error){ vscode.window.showErrorMessage(`${error}`); return; }
    const content_variables = extractContentVariables(content);
    for(const variable of content_variables){
        await setVariable(variable);
    }
    const path_subdirs = `${file_path}.yml`.split('/');
    let current_path = 'world';
    for (let index = 0; index < path_subdirs.length; index++) {
        const element = path_subdirs[index];
        current_path = path.join(current_path,element);
        createFile(current_path,content,(index===path_subdirs.length-1)?'file':'directory');
    }
}