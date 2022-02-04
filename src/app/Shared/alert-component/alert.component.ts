import { Component,EventEmitter, Input, Output } from '@angular/core';
import { trigger,transition,style, animate, keyframes } from "@angular/animations";

@Component({
    selector:"alert-comp",
    template:`
<div class="backdrop d-flex justify-content-center">
<div [@alertState] class='alert-box'>
<h2>Alert</h2>
<hr style="background-color:black;">
<p><b>{{message}}</b></p>
<hr style="background-color:black;">
<div class="alert-box-actions">
<button (click)="onClose()" class='btn btn-dark'>Close</button>
</div>
</div>
</div>
    `,
    styleUrls:["./alert.style.css"],
    animations:[trigger('alertState',[
        transition('void=>*',[style({opacity:0,transform:'translateY(-100px)'}),
        animate(400,keyframes([
            style({opacity:0.3,offset:0.3,transform:"translateY(-80px)"}),
            style({opacity:0.5,offset:0.5,transform:"translateY(-60px)"}),
            style({opacity:0.7,offset:0.7,transform:"translateY(-40px)"}),
            style({opacity:0.9,offset:0.9,transform:"translateY(-20px)"}),
            style({opacity:1,offset:1,transform:"translateY(0px)"}),
        ]))]),
   ]),]
   })
export class AlertComponent{
    @Input() message:string;
    @Output() closeEvent=new EventEmitter<void>();
    onClose(){
        this.closeEvent.emit();
    }
}