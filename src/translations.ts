export interface Translation {
  // Placeholder texts
  placeholder: {
    addFilter: string;
    selectField: string;
    selectOperator: string;
    selectValue: string;
    selectLogicalOperator: string;
    enterValue: string;
  };

  // Validation messages
  validation: {
    valid: string;
    invalid: string;
    incomplete: string;
    empty: string;
  };

  // Logical operators
  logicalOperators: {
    AND: string;
    OR: string;
  };

  // Group operators
  groupOperators: {
    openGroup: string;
    closeGroup: string;
  };

  // Boolean values
  booleanValues: {
    true: string;
    false: string;
  };

  // Accessibility labels
  accessibility: {
    filterInput: string;
    validationStatus: string;
    dropdownList: string;
    dropdownOption: string;
  };
}

export const DEFAULT_TRANSLATIONS: Record<string, Translation> = {
  en: {
    placeholder: {
      addFilter: 'Add filter...',
      selectField: 'Select field or ( to group...',
      selectOperator: 'Select operator...',
      selectValue: 'Select value...',
      selectLogicalOperator: 'Select AND/OR or ) to close group...',
      enterValue: 'Enter {field}...',
    },
    validation: {
      valid: 'Query is valid',
      invalid: 'Query has errors',
      incomplete: 'Query is incomplete',
      empty: 'No query defined',
    },
    logicalOperators: {
      AND: 'AND',
      OR: 'OR',
    },
    groupOperators: {
      openGroup: '(',
      closeGroup: ')',
    },
    booleanValues: {
      true: 'True',
      false: 'False',
    },
    accessibility: {
      filterInput: 'Filter input',
      validationStatus: 'Query validation status',
      dropdownList: 'Dropdown options',
      dropdownOption: 'Dropdown option',
    },
  },
  es: {
    placeholder: {
      addFilter: 'Agregar filtro...',
      selectField: 'Seleccionar campo o ( para agrupar...',
      selectOperator: 'Seleccionar operador...',
      selectValue: 'Seleccionar valor...',
      selectLogicalOperator: 'Seleccionar Y/O o ) para cerrar grupo...',
      enterValue: 'Ingresar valor...',
    },
    validation: {
      valid: 'Consulta válida',
      invalid: 'La consulta tiene errores',
      incomplete: 'Consulta incompleta',
      empty: 'Sin consulta definida',
    },
    logicalOperators: {
      AND: 'Y',
      OR: 'O',
    },
    groupOperators: {
      openGroup: '(',
      closeGroup: ')',
    },
    booleanValues: {
      true: 'Verdadero',
      false: 'Falso',
    },
    accessibility: {
      filterInput: 'Entrada de filtro',
      validationStatus: 'Estado de validación de consulta',
      dropdownList: 'Opciones desplegables',
      dropdownOption: 'Opción desplegable',
    },
  },
  fr: {
    placeholder: {
      addFilter: 'Ajouter un filtre...',
      selectField: 'Sélectionner un champ ou ( pour grouper...',
      selectOperator: 'Sélectionner un opérateur...',
      selectValue: 'Sélectionner une valeur...',
      selectLogicalOperator: 'Sélectionner ET/OU ou ) pour fermer le groupe...',
      enterValue: 'Saisir une valeur...',
    },
    validation: {
      valid: 'Requête valide',
      invalid: 'La requête contient des erreurs',
      incomplete: 'Requête incomplète',
      empty: 'Aucune requête définie',
    },
    logicalOperators: {
      AND: 'ET',
      OR: 'OU',
    },
    groupOperators: {
      openGroup: '(',
      closeGroup: ')',
    },
    booleanValues: {
      true: 'Vrai',
      false: 'Faux',
    },
    accessibility: {
      filterInput: 'Entrée de filtre',
      validationStatus: 'État de validation de la requête',
      dropdownList: 'Options déroulantes',
      dropdownOption: 'Option déroulante',
    },
  },
  de: {
    placeholder: {
      addFilter: 'Filter hinzufügen...',
      selectField: 'Feld auswählen oder ( zum Gruppieren...',
      selectOperator: 'Operator auswählen...',
      selectValue: 'Wert auswählen...',
      selectLogicalOperator: 'UND/ODER auswählen oder ) zum Schließen der Gruppe...',
      enterValue: 'Wert eingeben...',
    },
    validation: {
      valid: 'Abfrage ist gültig',
      invalid: 'Abfrage hat Fehler',
      incomplete: 'Abfrage ist unvollständig',
      empty: 'Keine Abfrage definiert',
    },
    logicalOperators: {
      AND: 'UND',
      OR: 'ODER',
    },
    groupOperators: {
      openGroup: '(',
      closeGroup: ')',
    },
    booleanValues: {
      true: 'Wahr',
      false: 'Falsch',
    },
    accessibility: {
      filterInput: 'Filtereingabe',
      validationStatus: 'Abfragevalidierungsstatus',
      dropdownList: 'Dropdown-Optionen',
      dropdownOption: 'Dropdown-Option',
    },
  },
  it: {
    placeholder: {
      addFilter: 'Aggiungi filtro...',
      selectField: 'Seleziona campo o ( per raggruppare...',
      selectOperator: 'Seleziona operatore...',
      selectValue: 'Seleziona valore...',
      selectLogicalOperator: 'Seleziona E/O o ) per chiudere gruppo...',
      enterValue: 'Inserisci valore...',
    },
    validation: {
      valid: 'Query valida',
      invalid: 'La query ha errori',
      incomplete: 'Query incompleta',
      empty: 'Nessuna query definita',
    },
    logicalOperators: {
      AND: 'E',
      OR: 'O',
    },
    groupOperators: {
      openGroup: '(',
      closeGroup: ')',
    },
    booleanValues: {
      true: 'Vero',
      false: 'Falso',
    },
    accessibility: {
      filterInput: 'Input filtro',
      validationStatus: 'Stato validazione query',
      dropdownList: 'Opzioni dropdown',
      dropdownOption: 'Opzione dropdown',
    },
  },
  pt: {
    placeholder: {
      addFilter: 'Adicionar filtro...',
      selectField: 'Selecionar campo ou ( para agrupar...',
      selectOperator: 'Selecionar operador...',
      selectValue: 'Selecionar valor...',
      selectLogicalOperator: 'Selecionar E/OU ou ) para fechar grupo...',
      enterValue: 'Inserir valor...',
    },
    validation: {
      valid: 'Consulta válida',
      invalid: 'A consulta tem erros',
      incomplete: 'Consulta incompleta',
      empty: 'Nenhuma consulta definida',
    },
    logicalOperators: {
      AND: 'E',
      OR: 'OU',
    },
    groupOperators: {
      openGroup: '(',
      closeGroup: ')',
    },
    booleanValues: {
      true: 'Verdadeiro',
      false: 'Falso',
    },
    accessibility: {
      filterInput: 'Entrada de filtro',
      validationStatus: 'Status de validação da consulta',
      dropdownList: 'Opções do dropdown',
      dropdownOption: 'Opção do dropdown',
    },
  },
  ja: {
    placeholder: {
      addFilter: 'フィルターを追加...',
      selectField: 'フィールドを選択または ( でグループ化...',
      selectOperator: '演算子を選択...',
      selectValue: '値を選択...',
      selectLogicalOperator: 'AND/ORを選択または ) でグループを閉じる...',
      enterValue: '値を入力...',
    },
    validation: {
      valid: 'クエリが有効です',
      invalid: 'クエリにエラーがあります',
      incomplete: 'クエリが不完全です',
      empty: 'クエリが定義されていません',
    },
    logicalOperators: {
      AND: 'AND',
      OR: 'OR',
    },
    groupOperators: {
      openGroup: '(',
      closeGroup: ')',
    },
    booleanValues: {
      true: '真',
      false: '偽',
    },
    accessibility: {
      filterInput: 'フィルター入力',
      validationStatus: 'クエリ検証ステータス',
      dropdownList: 'ドロップダウンオプション',
      dropdownOption: 'ドロップダウンオプション',
    },
  },
  ko: {
    placeholder: {
      addFilter: '필터 추가...',
      selectField: '필드 선택 또는 ( 그룹화...',
      selectOperator: '연산자 선택...',
      selectValue: '값 선택...',
      selectLogicalOperator: 'AND/OR 선택 또는 ) 그룹 닫기...',
      enterValue: '값 입력...',
    },
    validation: {
      valid: '쿼리가 유효합니다',
      invalid: '쿼리에 오류가 있습니다',
      incomplete: '쿼리가 불완전합니다',
      empty: '쿼리가 정의되지 않았습니다',
    },
    logicalOperators: {
      AND: 'AND',
      OR: 'OR',
    },
    groupOperators: {
      openGroup: '(',
      closeGroup: ')',
    },
    booleanValues: {
      true: '참',
      false: '거짓',
    },
    accessibility: {
      filterInput: '필터 입력',
      validationStatus: '쿼리 검증 상태',
      dropdownList: '드롭다운 옵션',
      dropdownOption: '드롭다운 옵션',
    },
  },
  zh: {
    placeholder: {
      addFilter: '添加过滤器...',
      selectField: '选择字段或 ( 进行分组...',
      selectOperator: '选择操作符...',
      selectValue: '选择值...',
      selectLogicalOperator: '选择AND/OR或 ) 关闭组...',
      enterValue: '输入值...',
    },
    validation: {
      valid: '查询有效',
      invalid: '查询有错误',
      incomplete: '查询不完整',
      empty: '未定义查询',
    },
    logicalOperators: {
      AND: 'AND',
      OR: 'OR',
    },
    groupOperators: {
      openGroup: '(',
      closeGroup: ')',
    },
    booleanValues: {
      true: '真',
      false: '假',
    },
    accessibility: {
      filterInput: '过滤器输入',
      validationStatus: '查询验证状态',
      dropdownList: '下拉选项',
      dropdownOption: '下拉选项',
    },
  },
  ru: {
    placeholder: {
      addFilter: 'Добавить фильтр...',
      selectField: 'Выберите поле или ( для группировки...',
      selectOperator: 'Выберите оператор...',
      selectValue: 'Выберите значение...',
      selectLogicalOperator: 'Выберите И/ИЛИ или ) для закрытия группы...',
      enterValue: 'Введите {field}...',
    },
    validation: {
      valid: 'Запрос действителен',
      invalid: 'Запрос содержит ошибки',
      incomplete: 'Запрос неполный',
      empty: 'Запрос не определен',
    },
    logicalOperators: {
      AND: 'И',
      OR: 'ИЛИ',
    },
    groupOperators: {
      openGroup: '(',
      closeGroup: ')',
    },
    booleanValues: {
      true: 'Истина',
      false: 'Ложь',
    },
    accessibility: {
      filterInput: 'Ввод фильтра',
      validationStatus: 'Статус валидации запроса',
      dropdownList: 'Опции выпадающего списка',
      dropdownOption: 'Опция выпадающего списка',
    },
  },
  ar: {
    placeholder: {
      addFilter: 'إضافة مرشح...',
      selectField: 'اختر الحقل أو ( للتجميع...',
      selectOperator: 'اختر المشغل...',
      selectValue: 'اختر القيمة...',
      selectLogicalOperator: 'اختر AND/OR أو ) لإغلاق المجموعة...',
      enterValue: 'أدخل {field}...',
    },
    validation: {
      valid: 'الاستعلام صحيح',
      invalid: 'الاستعلام يحتوي على أخطاء',
      incomplete: 'الاستعلام غير مكتمل',
      empty: 'لا يوجد استعلام محدد',
    },
    logicalOperators: {
      AND: 'و',
      OR: 'أو',
    },
    groupOperators: {
      openGroup: '(',
      closeGroup: ')',
    },
    booleanValues: {
      true: 'صحيح',
      false: 'خطأ',
    },
    accessibility: {
      filterInput: 'إدخال المرشح',
      validationStatus: 'حالة التحقق من الاستعلام',
      dropdownList: 'خيارات القائمة المنسدلة',
      dropdownOption: 'خيار القائمة المنسدلة',
    },
  },
  hi: {
    placeholder: {
      addFilter: 'फ़िल्टर जोड़ें...',
      selectField: 'फ़ील्ड चुनें या ( समूह के लिए...',
      selectOperator: 'ऑपरेटर चुनें...',
      selectValue: 'मान चुनें...',
      selectLogicalOperator: 'AND/OR चुनें या ) समूह बंद करने के लिए...',
      enterValue: '{field} दर्ज करें...',
    },
    validation: {
      valid: 'क्वेरी मान्य है',
      invalid: 'क्वेरी में त्रुटियां हैं',
      incomplete: 'क्वेरी अधूरी है',
      empty: 'कोई क्वेरी परिभाषित नहीं',
    },
    logicalOperators: {
      AND: 'और',
      OR: 'या',
    },
    groupOperators: {
      openGroup: '(',
      closeGroup: ')',
    },
    booleanValues: {
      true: 'सही',
      false: 'गलत',
    },
    accessibility: {
      filterInput: 'फ़िल्टर इनपुट',
      validationStatus: 'क्वेरी सत्यापन स्थिति',
      dropdownList: 'ड्रॉपडाउन विकल्प',
      dropdownOption: 'ड्रॉपडाउन विकल्प',
    },
  },
  tr: {
    placeholder: {
      addFilter: 'Filtre ekle...',
      selectField: 'Alan seçin veya ( gruplamak için...',
      selectOperator: 'Operatör seçin...',
      selectValue: 'Değer seçin...',
      selectLogicalOperator: 'VE/VEYA seçin veya ) grubu kapatmak için...',
      enterValue: '{field} girin...',
    },
    validation: {
      valid: 'Sorgu geçerli',
      invalid: 'Sorgu hataları var',
      incomplete: 'Sorgu eksik',
      empty: 'Sorgu tanımlanmamış',
    },
    logicalOperators: {
      AND: 'VE',
      OR: 'VEYA',
    },
    groupOperators: {
      openGroup: '(',
      closeGroup: ')',
    },
    booleanValues: {
      true: 'Doğru',
      false: 'Yanlış',
    },
    accessibility: {
      filterInput: 'Filtre girişi',
      validationStatus: 'Sorgu doğrulama durumu',
      dropdownList: 'Açılır liste seçenekleri',
      dropdownOption: 'Açılır liste seçeneği',
    },
  },
  pl: {
    placeholder: {
      addFilter: 'Dodaj filtr...',
      selectField: 'Wybierz pole lub ( do grupowania...',
      selectOperator: 'Wybierz operator...',
      selectValue: 'Wybierz wartość...',
      selectLogicalOperator: 'Wybierz AND/OR lub ) aby zamknąć grupę...',
      enterValue: 'Wprowadź {field}...',
    },
    validation: {
      valid: 'Zapytanie jest prawidłowe',
      invalid: 'Zapytanie zawiera błędy',
      incomplete: 'Zapytanie jest niepełne',
      empty: 'Brak zdefiniowanego zapytania',
    },
    logicalOperators: {
      AND: 'I',
      OR: 'LUB',
    },
    groupOperators: {
      openGroup: '(',
      closeGroup: ')',
    },
    booleanValues: {
      true: 'Prawda',
      false: 'Fałsz',
    },
    accessibility: {
      filterInput: 'Wprowadzanie filtra',
      validationStatus: 'Status walidacji zapytania',
      dropdownList: 'Opcje listy rozwijanej',
      dropdownOption: 'Opcja listy rozwijanej',
    },
  },
  sv: {
    placeholder: {
      addFilter: 'Lägg till filter...',
      selectField: 'Välj fält eller ( för gruppering...',
      selectOperator: 'Välj operator...',
      selectValue: 'Välj värde...',
      selectLogicalOperator: 'Välj OCH/ELLER eller ) för att stänga grupp...',
      enterValue: 'Ange {field}...',
    },
    validation: {
      valid: 'Frågan är giltig',
      invalid: 'Frågan har fel',
      incomplete: 'Frågan är ofullständig',
      empty: 'Ingen fråga definierad',
    },
    logicalOperators: {
      AND: 'OCH',
      OR: 'ELLER',
    },
    groupOperators: {
      openGroup: '(',
      closeGroup: ')',
    },
    booleanValues: {
      true: 'Sann',
      false: 'Falsk',
    },
    accessibility: {
      filterInput: 'Filterinmatning',
      validationStatus: 'Frågevalideringsstatus',
      dropdownList: 'Rullgardinsalternativ',
      dropdownOption: 'Rullgardinsalternativ',
    },
  },
  nl: {
    placeholder: {
      addFilter: 'Filter toevoegen...',
      selectField: 'Selecteer veld of ( voor groepering...',
      selectOperator: 'Selecteer operator...',
      selectValue: 'Selecteer waarde...',
      selectLogicalOperator: 'Selecteer EN/OF of ) om groep te sluiten...',
      enterValue: 'Voer {field} in...',
    },
    validation: {
      valid: 'Query is geldig',
      invalid: 'Query heeft fouten',
      incomplete: 'Query is onvolledig',
      empty: 'Geen query gedefinieerd',
    },
    logicalOperators: {
      AND: 'EN',
      OR: 'OF',
    },
    groupOperators: {
      openGroup: '(',
      closeGroup: ')',
    },
    booleanValues: {
      true: 'Waar',
      false: 'Onwaar',
    },
    accessibility: {
      filterInput: 'Filterinvoer',
      validationStatus: 'Queryvalidatiestatus',
      dropdownList: 'Dropdown-opties',
      dropdownOption: 'Dropdown-optie',
    },
  },
};

export function getTranslation(language = 'en'): Translation {
  return DEFAULT_TRANSLATIONS[language] || DEFAULT_TRANSLATIONS.en;
}
