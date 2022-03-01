import * as fs from 'fs';
import * as path from "path";
import * as vscode from "vscode";
import { CardFile, readCardFile } from './load-files';
import { addContent, addTemplate, removeContent, removeTemplate } from './map-content';

const watchers:vscode.FileSystemWatcher[] = [];
const wsPaths = vscode.workspace.workspaceFolders; 
function addMonitor(addCard:(card: CardFile)=>void, removeCard:(uri: string)=>void,subdir:string){
    loadYamlFiles(addCard,subdir);
    for(const wsPath of wsPaths||[]){
        const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(wsPath.uri.path,`${subdir}/**/*.yml`));
        watcher.onDidCreate((uri)=>{
            const card = readCardFile(uri.fsPath);
            card && addCard(card);
        })
        watcher.onDidChange((uri)=>{
            const card = readCardFile(uri.fsPath);
            card && addCard(card);
        })
        watcher.onDidDelete((uri)=>{
            removeCard(uri.fsPath);
        })
    }
}

export function monitorTemplateChange(){
    addMonitor(addTemplate,removeTemplate,"template");
}
export function monitorContentChange(){
    addMonitor(addContent,removeContent,"world");
}
export async function loadYamlFiles(addCard:(card:CardFile) => void,subdir:string){
    for(const wsPath of wsPaths||[]){
        const dirpath =  path.join(wsPath.uri.fsPath,subdir);
        let files;
        try{ files = await fs.promises.readdir(dirpath) }
        catch(error){ return; }
        for(const file of files){
            const stats = await fs.promises.stat(path.join(dirpath,file))
            if(stats.isDirectory()){
                loadYamlFiles(addCard,path.join(subdir,file));
                continue;
            }
            const card = readCardFile(path.join(dirpath, file));
            card && addCard(card);
        }
    }
}
export function stopWatching(){
    for(const watcher of watchers){
        watcher.dispose();
    }
    watchers.splice(0, watchers.length);
}