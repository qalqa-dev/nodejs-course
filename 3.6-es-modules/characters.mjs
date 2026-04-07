console.log('Загружено characters.js');

export let characters = [
  {
    name: 'Фродо',
    hasRing: false,
  },
  {
    name: 'Бильбо',
    hasRing: false,
  },
];

export function giveRing(chars, owner) {
  return chars.map((char) => ({
    ...char,
    hasRing: char.name === owner,
  }));
}

export default function log() {
  console.log('log');
}
