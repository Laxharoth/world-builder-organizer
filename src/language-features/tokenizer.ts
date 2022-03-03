import { Range, SemanticTokensLegend, TextDocument } from "vscode";
import { contentCards } from "../load-data/map-content";

enum TokenTypesEnum{ 'link'='link', }
type TokenType = `${TokenTypesEnum}`;
export const tokenTypes:{[key in TokenTypesEnum]:string} = {
    link:'namespace'
};
const legendTokenTypes = Array.from(new Set(Object.values(tokenTypes)));

export default class Tokenizer{
    static legend = new SemanticTokensLegend(legendTokenTypes);
    protected tokenize(document: TextDocument):ParsedToken[]{
        const documentText = document.getText();
        const parsedTokens:ParsedToken[] = [];
        let index = 0;
        for(const word of documentText.split(/(\s|\t|\n)+/)){
            index = documentText.indexOf(word,index);
            const range = new Range(document.positionAt(index), document.positionAt(index + word.length));
            const token = this.buildToken(word, range);
            token && parsedTokens.push(token);
            index++;
        }
        return parsedTokens;
    }
    private buildToken(word: string, range: Range):ParsedToken|null {
        if (this.isLink(word)) {
            return {
                range,
                tokenType: "link"
            };
        }
        return null;
    }
    private isLink(text:string){
        const link = contentCards[text.substring(1)];
        return link !== undefined;
    }
}
interface ParsedToken{
    range: Range;
	tokenType: TokenType;
}