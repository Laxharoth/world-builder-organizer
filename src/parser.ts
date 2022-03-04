import * as vscode from 'vscode';
import loadFiles, { FileName, FileNames } from './load-data/load-files';
// @ts-ignore
export const files: FileNames = {};
export const variables:{ [key : string]: string|null} = {
    name:null,
    description:"description"
};
export async function setFileContent(name: string, content: string) {
    if(files){await loadFiles(files);}
    if (/^@/.test(name)) {
        name = name.replace(/^@/, '');
        const [fileContent,fileName] = splitFirst(name, ':');
        name = fileName || fileContent;
        content = files[fileContent as FileName];
    }
    return { name, content };
}
const regexFindVariable = /\[.+\]/;
export function parseVariable(name: string) {
    while(regexFindVariable.test(name)){
        regexFindVariable.exec(name)
            ?.forEach(str=>{
                const variableName = str.substring(1,str.length - 1);
                name = name.replace(str,variables[variableName] || variableName);
            });
    }
    return name;
}
export function extractContentVariables(content:string){
    const variablesNames:string[] = [];
    while(regexFindVariable.test(content))
        {regexFindVariable.exec(content)
            ?.forEach(str=>{ 
                content = content.replace(str,'');
                variablesNames.push(str.substring(1,str.length - 1));
            });}
    return variablesNames;
}
function splitFirst(str:string,separator:string):[string,string|null] {
    let [first, ...rest] = str.split(separator);
    return [first, rest.length?rest.join(separator):null];
}
export async function setVariable(name:string, placeHolder:string|null=null, value:string|null=null, prompt:string|null=null){
    if(!placeHolder){ placeHolder = `${name}:`;};
    if(!prompt){ prompt =`Enter value for variable ${name}`;};
    if(!value){value='';}
    value = await vscode.window.showInputBox({ placeHolder, value, prompt }) || null;
    if(value){variables[name] = value;}
}