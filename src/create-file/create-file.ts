import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';
import { WorkspaceFolder } from 'vscode';
import { parseVariable } from '../parser';

let wsPaths:readonly WorkspaceFolder[] | undefined = undefined;
export default function createFile( filename: string, content: string='', type: 'file'|'directory' = 'file',parse_content_variable:boolean=true) {
	if(!wsPaths){ wsPaths = vscode.workspace.workspaceFolders; }
	if(wsPaths === undefined){
		vscode.window.showInformationMessage(`Requires workspace folder.`);
		return;
	}
	let wsPath = wsPaths[0].uri.fsPath;
	if(wsPaths.length > 1){
		// TODO: Select workspace folder
	}
	const file_path = path.join(wsPath,filename);
	if(fs.existsSync(file_path)){
		vscode.window.showInformationMessage(`The file '${file_path}' already exists.`);
		return;
	}
	
	try{
		if(type === 'directory'){
			fs.mkdirSync(file_path, { recursive: true })
			return;
		}
		content = parse_content_variable?parseVariable(content):content;
		fs.appendFileSync(file_path,content);
		vscode.window.showInformationMessage(`'${file_path}' created.`);
	}
	catch(error){
		vscode.window.showErrorMessage(`The file '${file_path}' could not be created.`);
	}
}