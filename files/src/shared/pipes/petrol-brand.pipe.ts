import {Pipe, PipeTransform} from '@angular/core';
import {PetrolBrandsEnum} from '../../app/stations/shared/const-var';

@Pipe({
  name: 'petrolBrand',
})
export class PetrolBrandPipe implements PipeTransform {
  transform(value: PetrolBrandsEnum): string {
    switch (value) {
      case PetrolBrandsEnum.petronas:
        return 'Petronas';

      case PetrolBrandsEnum.shell:
        return 'Shell';

      case PetrolBrandsEnum.petron:
        return 'Petron';

      case PetrolBrandsEnum.bhp:
        return 'BHP';

      case PetrolBrandsEnum.caltex:
        return 'Caltex';

      case PetrolBrandsEnum.buraqOil:
        return 'Buraq Oil';

      case PetrolBrandsEnum.no:
        return 'No preference';
    }

    return 'Undefined';
  }
}
