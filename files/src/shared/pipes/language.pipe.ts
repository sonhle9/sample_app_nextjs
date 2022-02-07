import {Pipe, PipeTransform} from '@angular/core';
import {LanguageEnum} from '../enums/language.enum';
@Pipe({
  name: 'language',
})
export class LanguagePipe implements PipeTransform {
  transform(language?: LanguageEnum): string {
    if (!language) {
      return '';
    }

    switch (language) {
      case LanguageEnum.english:
        return 'English';

      case LanguageEnum.malaysia:
        return 'Bahasa Melayu';

      case LanguageEnum.simplifiedChinese:
        return 'Chinese (Simplified)';

      case LanguageEnum.traditionalChinese:
        return 'Chinese (Traditional)';

      case LanguageEnum.tamil:
        return 'Tamil';
    }

    return language;
  }
}
