import * as fs from 'fs';
import * as path from 'path';
import * as vscode from "vscode";
import createFile from '../create-file/create-file';
import { template_cards } from './../load-data/map-content';

export default async function copyTemplate(){
    const card = await vscode.window.showQuickPick(Object.values(template_cards));
    if(!card) return;
    const route = await vscode.window.showInputBox({ prompt:"Enter the name of the template" });
    if(!route) return;
    let content;
    try{ content = (await fs.promises.readFile(card.path)).toString(); }
    catch(error){ vscode.window.showErrorMessage(`${error}`); return; }
    const path_subdirs = `${route}.yml`.split('/');
    let current_path = 'template';
    for (let index = 0; index < path_subdirs.length; index++) {
        const element = path_subdirs[index];
        current_path = path.join(current_path,element);
        createFile(current_path,content,(index===path_subdirs.length-1)?"file":"directory",false);
    }
}