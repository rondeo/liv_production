import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'arrayReverse' 
})
export class ArrayReversePipe implements PipeTransform {

    transform(value) {
        return value.slice().reverse();
    }

}
