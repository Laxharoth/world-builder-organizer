import * as path from 'path';
import * as vscode from 'vscode';
import createFile, { CreateFileOptions } from "../create-file/create-file";
import { element, file_structure } from '../load-data/file_structure';
import { parseVariable, setFileContent, setVariable, variables } from "../parser";

export default async function initWorldBuilder() {
    await setVariable('name','Enter the Name of the World');
    if(!variables.name){ return; }
    const filenames:CreateFileOptions[] = [];
    async function recursiveCreateFile(elements: element[], root = '' , parseContentVariables:boolean = true) {
        for (const element of elements) {
            if (typeof element === 'string') {
                let content = '';
                let name = element;
                name = parseVariable(name);
                ({ name, content } = await setFileContent(name, content));
                filenames.push({ 
                    filename:path.join(root,name), 
                    content:content,
                    type:'file',
                    parseContentVariable:parseContentVariables 
                });
                continue;
            }
            filenames.push({
                filename: path.join(root, parseVariable(element.name)),
                content: '',
                type: 'directory',
                parseContentVariable: parseContentVariables
            });
            recursiveCreateFile(element.children, path.join(root,element.name),parseContentVariables);
        }
    }
    // create templates
    await recursiveCreateFile(file_structure.template,'',false);
    // create world files
    await recursiveCreateFile(file_structure.world,'');
    // create global files
    await recursiveCreateFile(file_structure.file,'');
    createFile(filenames);
};
