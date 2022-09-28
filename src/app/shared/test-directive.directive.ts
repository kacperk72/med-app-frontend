import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[appTestDirective]',
})
export class TestDirectiveDirective {
    constructor(private el: ElementRef) {}
    @HostListener('mouseenter') onMouseEnter(): void {
        this.el.nativeElement.style.fontSize = '25px';
    }

    @HostListener('mouseleave') onMouseLeave(): void {
        this.el.nativeElement.style.fontSize = '15px';
    }
}
