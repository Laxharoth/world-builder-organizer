import * as path from 'path';
import * as vscode from "vscode";
import createFile from '../create-file/create-file';
import { setFileContent } from '../parser';

export default async function createTemplate(){
    const file_path = await vscode.window.showInputBox({ prompt:"Enter the name of the template" });
    if(!file_path) return;
    const pathSubdirs = `${file_path}.yml`.split('/');
    let currentPath = 'template';
    const { content } = await setFileContent(`@template`,'');
    for (let index = 0; index < pathSubdirs.length; index++) {
        const element = pathSubdirs[index];
        currentPath = path.join(currentPath,element);
        createFile(currentPath,content,(index===pathSubdirs.length-1)?"file":"directory",false);
    }
}