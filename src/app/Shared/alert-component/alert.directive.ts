import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector:"[alert-directive]"
})
export class AlertDirective{
    constructor(public vcRef:ViewContainerRef){
    }
}