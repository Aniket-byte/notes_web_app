import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name:'titlepipe',
})
export class TitlePipe implements PipeTransform{
    transform(value:string){
        if(value.length>72){
            return value.slice(0,72);
        }
        else{
            return value;
        }
    }
}