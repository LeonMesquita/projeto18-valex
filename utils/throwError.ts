export function checkDataExists(obj: object, name: string){
    if(!obj){
        throwError(404, `${name} not found`);
    };
}


export function throwError(code: number, message: string){
        throw{
            code,
            message
        }
}