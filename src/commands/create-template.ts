import * as path from 'path';
import * as vscode from "vscode";
import createFile, { CreateFileOptions } from '../create-file/create-file';
import { setFileContent } from '../parser';

export default async function createTemplate(){
    const filePath = await vscode.window.showInputBox({ prompt:"Enter the name of the template" });
    if(!filePath){ return; }
    const pathSubdirs = `${filePath}.yml`.split('/');
    let currentPath = 'template';
    const { content } = await setFileContent(`@template`,'');
    const files:CreateFileOptions[] = [];
    for (let index = 0; index < pathSubdirs.length; index++) {
        const element = pathSubdirs[index];
        currentPath = path.join(currentPath,element);
        files.push({
            filename:currentPath,
            content:content,
            type:(index===pathSubdirs.length-1)?"file":"directory",
            parseContentVariable:false
        });
    }
    createFile(files);
}