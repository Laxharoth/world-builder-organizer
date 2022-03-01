import * as path from 'path';
import * as vscode from 'vscode';
import createFile from "../create-file/create-file";
import { element, file_structure } from '../load-data/file_structure';
import { parseVariable, setFileContent, setVariable, variables } from "../parser";

export default async function initWorldBuilder() {
    await setVariable('name','Enter the Name of the World')
    if(!variables.name)
        return;
    async function recursiveCreateFile(elements: element[], root = '' , parse_content_variables:boolean = true) {
        for (const element of elements) {
            if (typeof element === 'string') {
                let content = '';
                let name = element;
                name = parseVariable(name);
                ({ name, content } = await setFileContent(name, content));
                createFile(path.join(root,name), content,'file',parse_content_variables);
                continue;
            }
            createFile(path.join(root,parseVariable(element.name)), '','directory',parse_content_variables);
            recursiveCreateFile(element.children, path.join(root,element.name),parse_content_variables);
        }
    }
    // create templates
    await recursiveCreateFile(file_structure.template,'',false);
    // create world files
    await recursiveCreateFile(file_structure.world,'');
    // create global files
    await recursiveCreateFile(file_structure.file,'');
};
