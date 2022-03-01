import * as path from 'path';
import * as vscode from "vscode";
import createFile from '../create-file/create-file';
import { setFileContent } from '../parser';

export default async function createTemplate(){
    const file_path = await vscode.window.showInputBox({ prompt:"Enter the name of the template" });
    if(!file_path) return;
    const path_subdirs = `${file_path}.yml`.split('/');
    let current_path = 'template';
    const { content } = await setFileContent(`@template`,'');
    for (let index = 0; index < path_subdirs.length; index++) {
        const element = path_subdirs[index];
        current_path = path.join(current_path,element);
        createFile(current_path,content,(index===path_subdirs.length-1)?"file":"directory",false);
    }
}