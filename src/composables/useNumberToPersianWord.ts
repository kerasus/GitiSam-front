import NumberToPersianWord from 'number_to_persian_word'

export const useNumberToPersianWord = () => {


  /**
   * تبدیل اعداد فارسی به انگلیسی
   */
  function toEnDigit(value: string): string {
    if (!value) return '';
    const digits = [
      { from: '۰', to: '0' },
      { from: '۱', to: '1' },
      { from: '۲', to: '2' },
      { from: '۳', to: '3' },
      { from: '۴', to: '4' },
      { from: '۵', to: '5' },
      { from: '۶', to: '6' },
      { from: '۷', to: '7' },
      { from: '۸', to: '8' },
      { from: '۹', to: '9' },
    ];
    let result = normalizeMinus(value).toString();
    digits.forEach((item) => {
      result = result.replace(new RegExp(item.from, 'g'), item.to);
    });
    return result;
  }

  function normalizeMinus (input: string): string {
    return input.replace(/‎-/g, '-').replace(/−/g, '-');
  }

  /**
   * تمیز کردن ورودی (حذف کاماها و تبدیل اعداد فارسی)
   */
  function sanitizeInput(value: string): string {
    return toEnDigit(normalizeMinus(value).replace(/٬/g, ''));
  }

  function getNumberToPersianWord (inputNumber: number | string): string {
    const rawValueInNumber =
      typeof inputNumber === 'number'
        ? inputNumber
        : parseInt(toEnDigit(inputNumber.toString()));
    const isNegative = rawValueInNumber < 0;
    const absoluteValue = Math.abs(rawValueInNumber);
    const words = NumberToPersianWord.convert(absoluteValue);

    return `${isNegative ? 'منفی ' : ''}${words}`;
  }

  return {
    toEnDigit,
    sanitizeInput,
    normalizeMinus,
    getNumberToPersianWord
  }
}
