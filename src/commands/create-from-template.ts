import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

import {META_VARIABLES} from '../constant';
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
    let readFile;
    try {
        readFile = (await fs.promises.readFile(card.path)).toString();
    } catch (error) {
        vscode.window.showErrorMessage(`${error}`);
        return;
    }
    const {result: metaVariables, updatedContent: content} =
        extractMetaVariables(readFile);
    const contentVariables = extractContentVariables(content);
    for (const variable of contentVariables) {
        if (variable === '@name')
            variables['@name'] = path.basename(filePath);
        else
            await setVariable(variable);
    }
    const {relativePath = '.'} = metaVariables;
    const pathSubdirs = `${relativePath}/${filePath}.yml`.split('/');
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

function extractMetaVariables(content: string):
    {result: Record<string, string|boolean>, updatedContent: string} {
    // Initialize the result object
    const result: Record<string, string|boolean> = {};

    // Replace matches in content while processing
    const updatedContent =
        content.replace(META_VARIABLES, (fullMatch, innerContent) => {
            if (fullMatch === '[@name]') {
                // Preserve [@name] in the content
                return fullMatch;
            }

            const [key, value] =
                innerContent.split('=').map((str: string) => str.trim());

            if (key && value) {
                // Add the key-value pair to the result
                result[key] = value;
            } else {
                result[key] = true;
            }

            // Remove the match from the content
            return '';
        });

    return {result, updatedContent};
};