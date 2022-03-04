import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';
import { WorkspaceFolder } from 'vscode';
import { parseVariable } from '../parser';

let wsPaths:readonly WorkspaceFolder[] | undefined = undefined;
export default function createFile(file:CreateFileOptions|CreateFileOptions[]) {
	let files = (file instanceof Array)? file:[file];
	if(!wsPaths){ wsPaths = vscode.workspace.workspaceFolders; }
	if(wsPaths === undefined){
		vscode.window.showInformationMessage(`Requires workspace folder.`);
		return;
	}
	let wsPath = wsPaths[0].uri.fsPath;
	if(wsPaths.length > 1){
		// TODO: Select workspace folder
	}
	for(const file of files){
		const { filename, content='', type='file',parseContentVariable=true } = file;
		const filePath = path.join(wsPath,filename);
		if(fs.existsSync(filePath)){
			vscode.window.showInformationMessage(`The file '${filePath}' already exists.`);
			continue;
		}
		try{
			if(type === 'directory'){
				fs.mkdirSync(filePath, { recursive: true });
				continue;
			}
			const parsedContent = parseContentVariable?parseVariable(content):content;
			fs.appendFileSync(filePath,parsedContent);
			vscode.window.showInformationMessage(`'${filePath}' created.`);
		}
		catch(error){
			vscode.window.showErrorMessage(`The file '${filePath}' could not be created.`);
		}
	}
}

export interface CreateFileOptions{
	filename:string;
	content?:string;
	type?:'file'|'directory';
	parseContentVariable?:boolean;
}