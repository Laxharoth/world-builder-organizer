import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';
import { WorkspaceFolder } from 'vscode';
import { parseVariable } from '../parser';

let wsPaths:readonly WorkspaceFolder[] | undefined = undefined;
export default function createFile( filename: string, content: string='', type: 'file'|'directory' = 'file',parseContentVariable:boolean=true) {
	if(!wsPaths){ wsPaths = vscode.workspace.workspaceFolders; }
	if(wsPaths === undefined){
		vscode.window.showInformationMessage(`Requires workspace folder.`);
		return;
	}
	let wsPath = wsPaths[0].uri.fsPath;
	if(wsPaths.length > 1){
		// TODO: Select workspace folder
	}
	const filePath = path.join(wsPath,filename);
	if(fs.existsSync(filePath)){
		vscode.window.showInformationMessage(`The file '${filePath}' already exists.`);
		return;
	}
	
	try{
		if(type === 'directory'){
			fs.mkdirSync(filePath, { recursive: true });
			return;
		}
		content = parseContentVariable?parseVariable(content):content;
		fs.appendFileSync(filePath,content);
		vscode.window.showInformationMessage(`'${filePath}' created.`);
	}
	catch(error){
		vscode.window.showErrorMessage(`The file '${filePath}' could not be created.`);
	}
}