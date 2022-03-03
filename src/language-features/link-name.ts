import {
    CancellationToken,
    DocumentLinkProvider, DocumentLink, ProviderResult, TextDocument, Range, Uri
} from "vscode";
import { contentCards } from "../load-data/map-content";
import Tokenizer from "./tokenizer";

export default class CardReferenceLink extends Tokenizer implements DocumentLinkProvider{
    provideDocumentLinks(document: TextDocument, token: CancellationToken): ProviderResult<DocumentLink[]> {
        const links : DocumentLink[]=[];
        for(const linkToken of this.tokenize(document).filter(token=>token.tokenType==='link')){
            const link = contentCards[linkToken.token.substring(1)];
            const linkData = Uri.file(link.path);
            links.push( new DocumentLink(linkToken.range,linkData));
        }
        return links;
    }
}