const EventEmitter = require('events');

const myEmitter = new EventEmitter();

myEmitter.setMaxListeners(1);

const logDbConnection = () => {
  console.log('DB connected');
};

myEmitter.addListener('connected', logDbConnection);
myEmitter.emit('connected');

myEmitter.off('connected', logDbConnection);
// myEmitter.removeListener('connected', logDbConnection);
// myEmitter.removeAllListeners('connected');
myEmitter.emit('connected');
myEmitter.on('msg', (data) => console.log(`Получил: ${data}`));

myEmitter.emit('msg', 'Привет! Получи мое сообщение');

myEmitter.once('off', () => console.log('Я вызвался 1 раз и не больше'));
myEmitter.emit('off');
myEmitter.emit('off');

myEmitter.prependListener('msg', (data) => console.log('prepend'));
myEmitter.emit('msg', 'message');
console.log(myEmitter.listenerCount());
console.log(myEmitter.eventNames());
console.log(myEmitter.getMaxListeners());
console.log(myEmitter.getMaxListeners());
myEmitter.on('some', () => {
  console.log('some');
});
myEmitter.emit('some');
myEmitter.on('some2', () => {
  console.log('some2');
});
myEmitter.emit('some2');
myEmitter.on('some3', () => {
  console.log('some3');
});
myEmitter.emit('some3');
console.log(myEmitter.getMaxListeners());
