import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name:'linkpipe'
})
export class LinkPipe implements PipeTransform{
    transform(value:string){
        if(value.indexOf("https://")==-1){
            return "http://"+value;
        }
        else{
            return "http://" + value.slice("https://".length);
        }
    }
}