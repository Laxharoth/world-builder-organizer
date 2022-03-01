import * as vscode from 'vscode';
import loadFiles, { FileName, FileNames } from './load-data/load-files';
// @ts-ignore
export const files: FileNames = {};
export const variables:{ [key : string]: string|null} = {
    name:null,
    description:"description"
}
export async function setFileContent(name: string, content: string) {
    if(files)await loadFiles(files);
    if (/^@/.test(name)) {
        name = name.replace(/^@/, '');
        const [file_content,file_name] = splitFirst(name, ':');
        name = file_name || file_content;
        content = files[file_content as FileName];
    }
    return { name, content };
}
const regex_find_variable = /\[.+\]/;
export function parseVariable(name: string) {
    while(regex_find_variable.test(name)){
        regex_find_variable.exec(name)
            ?.forEach(str=>{
                const variable_name = str.substring(1,str.length - 1);
                name = name.replace(str,variables[variable_name] || variable_name);
            });
    }
    return name;
}
export function extractContentVariables(content:string){
    const variables_names:string[] = []
    while(regex_find_variable.test(content))
        regex_find_variable.exec(content)
            ?.forEach(str=>{ 
                content = content.replace(str,'');
                variables_names.push(str.substring(1,str.length - 1));
            });
    return variables_names;
}
function splitFirst(str:string,separator:string):[string,string|null] {
    let [first, ...rest] = str.split(separator);
    return [first, rest.length?rest.join(separator):null];
}
export async function setVariable(name:string, placeHolder:string|null=null, value:string|null=null, prompt:string|null=null){
    if(!placeHolder){ placeHolder = `${name}:`};
    if(!prompt){ prompt =`Enter value for variable ${name}`};
    if(!value)value='';
    value = await vscode.window.showInputBox({ placeHolder, value, prompt }) || null;
    if(value)variables[name] = value;
}