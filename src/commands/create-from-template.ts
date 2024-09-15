import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

import createFile, {CreateFileOptions} from '../create-file/create-file';
import {templateCards} from '../load-data/map-content';
import {extractContentVariables, setVariable, variables} from '../parser';


export default async function createFromTemplate() {
    const card =
        await vscode.window.showQuickPick(Object.values(templateCards));
    if (!card) {
        return;
    }
    const filePath = await vscode.window.showInputBox(
        {prompt: 'Enter the name of the card'});
    if (!filePath) {
        return;
    }
    let content;
    try {
        content = (await fs.promises.readFile(card.path)).toString();
    } catch (error) {
        vscode.window.showErrorMessage(`${error}`);
        return;
    }
    const contentVariables = extractContentVariables(content);
    for (const variable of contentVariables) {
        if (variable === '@name')
            variables['@name'] = filePath;
        else
            await setVariable(variable);
    }
    const pathSubdirs = `${filePath}.yml`.split('/');
    let currentPath = 'world';
    const files: CreateFileOptions[] = [];
    for (let index = 0; index < pathSubdirs.length; index++) {
        const element = pathSubdirs[index];
        currentPath = path.join(currentPath, element);
        files.push({
            filename: currentPath,
            content: content,
            type: (index === pathSubdirs.length - 1) ? 'file' : 'directory',
        });
        createFile(files);
    }
}