export default function throwError(obj: object, name: string){
    if(!obj){
        throw{
            code: 'NotFound',
            message: `${name} not found`
        }
    };
    
}