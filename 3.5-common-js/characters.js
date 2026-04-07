console.log('Загружено characters.js');

let characters = [
  {
    name: 'Фродо',
    hasRing: false,
  },
  {
    name: 'Бильбо',
    hasRing: false,
  },
];

function giveRing(chars, owner) {
  return chars.map((char) => ({
    ...char,
    hasRing: char.name === owner,
  }));
}

module.exports = { characters, giveRing };
