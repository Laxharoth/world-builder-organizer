import { CancellationToken, DocumentSemanticTokensProvider, Event, ProviderResult, Range, SemanticTokens, SemanticTokensBuilder, SemanticTokensLegend, TextDocument } from "vscode";
import Tokenizer, { tokenTypes } from "./tokenizer";

export default class HighlightSintaxis extends Tokenizer implements DocumentSemanticTokensProvider{
    onDidChangeSemanticTokens?: Event<void> | undefined;
    provideDocumentSemanticTokens(document: TextDocument, token: CancellationToken): ProviderResult<SemanticTokens> {
        const builder = new SemanticTokensBuilder(Tokenizer.legend);
        const tokens = this.tokenize(document);
        for(const token of tokens){
            try {
                builder.push( token.range, tokenTypes[token.tokenType] );
            } catch (error) {
                console.log(error);
            }
        }
        return builder.build();
    }
}

