export class ResponseRo<T> { 
    statusCode : number ;
    message : string;
    data? : T ; 
    error? : any;
} 

