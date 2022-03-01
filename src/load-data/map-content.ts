import { CardFile } from "./load-files";

export const template_cards:{[key: string]:CardFile} = {};
/** key is the path */
const reverse_template_cards:{[key: string]:string} = {};
export const content_cards:{[key: string]:CardFile} = {};
/** key is the path */
const reverse_content_cards:{[key: string]:string} = {};

export function addTemplate(card:CardFile){
    const template_name = card.path.match(/((\\|\/)+)(?!.*(\\|\/)).*\./)?.[0] || card.path;
    const template_name_2 = template_name.substring(1,template_name.length-1);
    card.name = template_name_2;
    template_cards[template_name_2] = card;
    reverse_template_cards[card.path] = template_name_2;
}
export function addContent(card:CardFile) {
    content_cards[card.name] = card;
    reverse_content_cards[card.path] = card.name;
}
export function removeTemplate(uri:string) {
    delete template_cards[reverse_template_cards[uri]];
}
export function removeContent(uri:string) {
    delete content_cards[reverse_content_cards[uri]];
}
function last(pattern:string){
    return new RegExp(`${pattern}(?![\s\S]*${pattern})`);
}