export const file_structure:{ [key in 'template'|'world'|'file']:element[]|file[]} = {
    template:[
        { name : 'template' , children : ['@template:template.yml'] },
    ],
    world:[
        { name : 'world' , children : ['@template:[name].yml'] },
    ],
    file:['@template:[name].yml']
}


type directory = {
    name: string;
    children: element[];
}
type file = string;
export type element = ( directory | file );