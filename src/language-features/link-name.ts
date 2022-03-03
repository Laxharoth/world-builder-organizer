import {
    CancellationToken,
    DocumentLinkProvider, DocumentLink, ProviderResult, TextDocument, Range, Uri
} from "vscode";
import { contentCards } from "../load-data/map-content";

export default class CardReferenceLink implements DocumentLinkProvider{
    provideDocumentLinks(document: TextDocument, token: CancellationToken): ProviderResult<DocumentLink[]> {
        const text = document.getText();
        const links : DocumentLink[]=[];
        Array.from(new Set(text.split(/(\s|\t|\n)+/).filter(word=>word.startsWith("@") && word!=="@"))).forEach(word=>{
            let index = 0;
            const link = contentCards[word.substring(1)];
            if(!link){return;}
            const linkData = Uri.file(link.path);
            while( (index = text.indexOf(word,index)) >= 0){
                const start = document.positionAt(index);
                const end   = document.positionAt(index+word.length);
                links.push( new DocumentLink(new Range(start, end),linkData));
                index++;
            }
        });
        return links;
    }
}