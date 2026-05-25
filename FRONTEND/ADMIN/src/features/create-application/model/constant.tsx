export const validationRules = {
  carModel: [{ required: true, message: "Выберите модель ГАЗ" }],
  plate: [
    { required: true, message: "Укажите госномер" },
    {
      pattern: /^[А-Я]{1}\d{3}[А-Я]{2}\s\d{2,3}$/i,
      message: "Формат: А000АА 77 (кириллица)"
    },
  ],
  vin: [
    { required: true, message: "Укажите VIN" },
    { len: 17, message: "VIN должен быть 17 символов" },
    { pattern: /^[A-HJ-NPR-Z0-9]{17}$/i, message: "Некорректный VIN (не используются I, O, Q)" }
  ],
  firstName: [
    { required: true, message: "Укажите имя" },
    { min: 2, message: "Слишком короткое имя" }
  ],
  lastName: [
    { required: true, message: "Укажите фамилию" },
    { min: 2, message: "Слишком короткая фамилия" }
  ],
  phone: [
    { required: true, message: "Укажите телефон" },
    {
      pattern: /^(\+7|8)?[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/,
      message: "Некорректный формат телефона"
    }
  ],
  email: [
    { required: true, message: "Укажите E-mail" },
    { type: 'email' as const, message: "Введите корректный e-mail" }
  ],
};

export const GAZ_MODELS = [
  { value: "ГАЗель NEXT", label: "ГАЗель NEXT" },
  { value: "ГАЗель NN", label: "ГАЗель NN" },
  { value: "Соболь NN", label: "Соболь NN" },
  { value: "Соболь 4x4", label: "Соболь 4x4" },
  { value: "Валдай NEXT", label: "Валдай NEXT" },
  { value: "ГАЗон NEXT", label: "ГАЗон NEXT" },
  { value: "Садко NEXT", label: "Садко NEXT" },
];



