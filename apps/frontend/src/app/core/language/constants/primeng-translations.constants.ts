export interface PrimeNGTranslation {
  dayNames?: string[];
  dayNamesShort?: string[];
  dayNamesMin?: string[];
  monthNames?: string[];
  monthNamesShort?: string[];
  today?: string;
  clear?: string;
  weekHeader?: string;
  firstDayOfWeek?: number;
  dateFormat?: string;
  weak?: string;
  medium?: string;
  strong?: string;
  passwordPrompt?: string;
  emptyFilterMessage?: string;
  emptyMessage?: string;
  aria?: {
    trueLabel?: string;
    falseLabel?: string;
    nullLabel?: string;
    pageLabel?: string;
    firstPageLabel?: string;
    lastPageLabel?: string;
    nextPageLabel?: string;
    prevPageLabel?: string;
    selectLabel?: string;
    unselectLabel?: string;
    expandLabel?: string;
    collapseLabel?: string;
  };
}

export const PRIMENG_TRANSLATIONS_PL: PrimeNGTranslation = {
  dayNames: ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'],
  dayNamesShort: ['Niedz.', 'Pon.', 'Wt.', 'Śr.', 'Czw.', 'Pt.', 'Sob.'],
  dayNamesMin: ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'],
  monthNames: [
    'Styczeń',
    'Luty',
    'Marzec',
    'Kwiecień',
    'Maj',
    'Czerwiec',
    'Lipiec',
    'Sierpień',
    'Wrzesień',
    'Październik',
    'Listopad',
    'Grudzień',
  ],
  monthNamesShort: [
    'Sty',
    'Lut',
    'Mar',
    'Kwi',
    'Maj',
    'Cze',
    'Lip',
    'Sie',
    'Wrz',
    'Paź',
    'Lis',
    'Gru',
  ],
  today: 'Dzisiaj',
  clear: 'Wyczyść',
  weekHeader: 'Tydz.',
  firstDayOfWeek: 1,
  dateFormat: 'yy-mm-dd',
  weak: 'Słaby',
  medium: 'Średni',
  strong: 'Silny',
  passwordPrompt: 'Wprowadź hasło',
  emptyFilterMessage: 'Brak wyników',
  emptyMessage: 'Brak dostępnych opcji',
  aria: {
    trueLabel: 'Prawda',
    falseLabel: 'Fałsz',
    nullLabel: 'Nie wybrano',
    pageLabel: 'Strona {page}',
    firstPageLabel: 'Pierwsza strona',
    lastPageLabel: 'Ostatnia strona',
    nextPageLabel: 'Następna strona',
    prevPageLabel: 'Poprzednia strona',
    selectLabel: 'Wybierz',
    unselectLabel: 'Odznacz',
    expandLabel: 'Rozwiń',
    collapseLabel: 'Zwiń',
  },
};

export const PRIMENG_TRANSLATIONS_EN: PrimeNGTranslation = {
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  today: 'Today',
  clear: 'Clear',
  weekHeader: 'Wk',
  firstDayOfWeek: 0,
  dateFormat: 'yy-mm-dd',
  weak: 'Weak',
  medium: 'Medium',
  strong: 'Strong',
  passwordPrompt: 'Enter a password',
  emptyFilterMessage: 'No results found',
  emptyMessage: 'No available options',
  aria: {
    trueLabel: 'True',
    falseLabel: 'False',
    nullLabel: 'Not selected',
    pageLabel: 'Page {page}',
    firstPageLabel: 'First page',
    lastPageLabel: 'Last page',
    nextPageLabel: 'Next page',
    prevPageLabel: 'Previous page',
    selectLabel: 'Select',
    unselectLabel: 'Unselect',
    expandLabel: 'Expand',
    collapseLabel: 'Collapse',
  },
};

export const PRIMENG_TRANSLATIONS = {
  pl: PRIMENG_TRANSLATIONS_PL,
  en: PRIMENG_TRANSLATIONS_EN,
} as const;
