//! НЕ поддерживаются импорты в условиях и/или после объявления функций

// const a = 1;

// if (a > 0) {
// import { characters, giveRing } from './characters.mjs'; - так нельзя будет ошибка
// }

//! Первый вариант импорта

// import log, { characters, giveRing } from './characters.mjs';

// console.log(giveRing(characters));

// log();

//! Второй вариант импорта

// import log, * as char from './characters.mjs';

// console.log(char.giveRing(char.characters));

// log();

//! Асинхронный импорт

async function main() {
  try {
    const { characters, giveRing } = await import('./characters.mjs');
    console.log(giveRing(characters));
  } catch {
    console.log('Ошибка');
  }
}

main();
