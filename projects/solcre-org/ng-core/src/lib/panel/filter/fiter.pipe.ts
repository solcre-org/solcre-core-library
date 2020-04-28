import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(value: any, filterString: string, propName: string): any {
        if (value.length === 0 || filterString === '') {
            return value;
        }
        const resultArray = [];
        for (const item of value) {

            let description = item.model.description;
            if ((item.model.name.toUpperCase()).includes(filterString.toUpperCase())) {
                resultArray.push(item);
            } else if (description != null && (description.toUpperCase()).includes(filterString.toUpperCase())) {
                resultArray.push(item);
            }
        }
        return resultArray;
    }
}