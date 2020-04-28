
import { Pipe, PipeTransform } from '@angular/core';

import { MenuItemModel } from './menu-item.model';

@Pipe({
	name: 'canEnter'
})
export class CanEnterPipe implements PipeTransform {

	transform(items: MenuItemModel[]): any {
		if (!items) {
			return items;
		}
		// filter items array, items which match and return true will be
		// kept, false will be filtered out
		return items.filter((item: MenuItemModel) => item.canEnter);
	}

}
