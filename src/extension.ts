import * as vscode from 'vscode';
import initWorldBuilder from './commands/initWorldBuilder';
import createFromTemplate from './commands/create-from-template';
import { contentCards } from './load-data/map-content';
import { monitorContentChange, monitorTemplateChange } from './load-data/monitorFileChange';
import createTemplate from './commands/create-template';
import copyTemplate from './commands/copy-template';
import CardReferenceCompleter from './language-features/complete-name';
import CardReferenceLink from './language-features/link-name';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	console.log("activate");
	monitorTemplateChange();
	monitorContentChange();
	let disposable = vscode.commands.registerCommand('world-build.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from World Build!');
	});
	context.subscriptions.push(disposable);
	context.subscriptions.push(vscode.commands.registerCommand('world-build.init', initWorldBuilder));
	context.subscriptions.push(vscode.commands.registerCommand('world-build.create', createFromTemplate));
	context.subscriptions.push(vscode.commands.registerCommand('world-build.create-template', createTemplate));
	context.subscriptions.push(vscode.commands.registerCommand('world-build.copy-template', copyTemplate));
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider({ language:'yaml', scheme: 'file'}, new CardReferenceCompleter(),'@'));
	context.subscriptions.push(vscode.languages.registerDocumentLinkProvider({ language:'yaml', scheme: 'file'}, new CardReferenceLink()));
	setTimeout(() => {
		console.log(contentCards);
	}, 1500);
}

// this method is called when your extension is deactivated
export function deactivate() {}
