const a = 1;
if (a > 0) {
  const { characters, giveRing } = require('./characters.js');
  console.log(giveRing(characters, 'Фродо'));
}
