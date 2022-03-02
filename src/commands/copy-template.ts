import * as fs from 'fs';
import * as path from 'path';
import * as vscode from "vscode";
import createFile from '../create-file/create-file';
import { templateCards } from '../load-data/map-content';


export default async function copyTemplate(){
    const card = await vscode.window.showQuickPick(Object.values(templateCards));
    if(!card) {return;}
    const filePath = await vscode.window.showInputBox({ prompt:"Enter the name of the template" });
    if(!filePath) {return;}
    let content;
    try{ content = (await fs.promises.readFile(card.path)).toString(); }
    catch(error){ vscode.window.showErrorMessage(`${error}`); return; }
    const pathSubdirs = `${filePath}.yml`.split('/');
    let currentPath = 'template';
    for (let index = 0; index < pathSubdirs.length; index++) {
        const element = pathSubdirs[index];
        currentPath = path.join(currentPath,element);
        createFile(currentPath,content,(index===pathSubdirs.length-1)?"file":"directory",false);
    }
}