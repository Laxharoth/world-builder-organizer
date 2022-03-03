import * as vscode from "vscode";
import {
    CancellationToken,
    CompletionContext, CompletionItem, CompletionItemProvider, CompletionList, Position, ProviderResult, TextDocument
} from "vscode";
import { existingKeys } from "../load-data/map-content";

export default class CardReferenceCompleater implements CompletionItemProvider<CompletionItem> {
    constructor(){console.log(123213);}
    provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext): ProviderResult<CompletionItem[] | CompletionList<CompletionItem>> {
        const linePrefix = document.lineAt(position).text.substring(0, position.character);
        const items : vscode.CompletionItem[] = [];
        const lastWord = linePrefix.split(' ').slice(-1)[0];
        if(!lastWord || !lastWord.startsWith("@")){return null;}
        items.push(...existingKeys().filter(key=>`@${key}`.startsWith(`${lastWord}`)).map(key=> new CompletionItem(key,vscode.CompletionItemKind.Reference)));
        return items;
    }
}