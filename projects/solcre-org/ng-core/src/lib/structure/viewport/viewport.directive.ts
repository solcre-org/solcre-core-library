import { Directive, Renderer2 } from '@angular/core';
import { UiEventsService } from '../../ui-events.service';

@Directive({
	selector: '[viewport]'
})
export class ViewportDirective {

	// Inject services
	constructor(
		private renderer: Renderer2,
		private uiEventsService: UiEventsService) { }

	// On component init
	ngOnInit(): void {
		const htmlElement: HTMLElement = document.documentElement;

		//Attach ui events states
		this.uiEventsService.externalModalStateChange.subscribe((state: boolean)=>{
			//Check state
			if(state){
				this.renderer.addClass(htmlElement, 'activeExternalModal');
			}else{
				this.renderer.removeClass(htmlElement, 'activeExternalModal');
			}
		});
		this.uiEventsService.internalModalStateChange.subscribe((state: boolean)=>{
			//Check state
			if(state){
				this.renderer.addClass(htmlElement, 'activeInternalModal');
			}else{
				this.renderer.removeClass(htmlElement, 'activeInternalModal');
			}
		});
		this.uiEventsService.popupStateChange.subscribe((state: boolean)=>{
			//Check state
			if(state){
				this.renderer.addClass(htmlElement, 'activePopup');
			}else{
				this.renderer.removeClass(htmlElement, 'activePopup');
			}
		});
	}

}
