import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchByName'
})
export class SearchByNamePipe implements PipeTransform {
  transform(items: any, args?: any): any {
    let fieldAndValue = args.split('_');
    let arr= [];
    let i = 0;
    let regex = new RegExp(''+fieldAndValue[1]+'', 'i');
    // filter items array, items which match and return true will be kept, false will be filtered out
    items.forEach(item => {
      if(item[fieldAndValue[0]].match(regex)) {
        arr[i] = item;
        i++;
      }
    })
    
    if(arr.length < 1) {
      arr[0] = { notFound: "Nenhum resultado encontrado" };
    } 
    
    return arr.splice(0, 5);
  }
}
