# Sprite
Event Emitter which can event bubble up.
It mixin [component/emitter] and [component/enumerable].

```shell
$ component install smagch/sprite
```

## Examples

```javascript
var mySon = new Sprite();
var me = new Sprite();
var myFather = new Sprite();

myFather.add(me);
me.add(mySon);

mySon.on('greet', function (msg) {
  console.log(msg + ' my son');
});

me.on('greet', function (msg) {
  console.log(msg + ' myself');
  me.stopPropagation();
});

// my father won't get greet because I'll stop propagation
myFather.on('greet', function (arg) {
  console.log(msg + ' my father');
});

mySon.emit('greet', 'Hello');
// Hello my son
// Hello myself
```

Sprite is the top parent node.
So all events delegate to Sprite

```javascript
var me = new Sprite();
var myMother = new Sprite();

myMother.add(me);

me.on('greet', function(msg) {
  console.log(msg + ' myself');
});

myMother.on('greet', function(msg) {
  console.log(msg + ' my mother');
});

Sprite.on('greet', function(msg) {
  console.log(msg + 'Sprite');
});

me.emit('greet', 'Hello');
// Hello myself
// Hello my mother
// Hello Sprite

myMother.emit('greet', 'Hi');
// Hi my mother
// Hi Sprite
```

## API
All methods available on [component/emitter] and [component/enumerable].
Additionally, the following methods are available.

### Sprite#add(child)
add a child
### Sprite#remove(child)
remove a child
### Sprite#removeAll()
remove all children
### Sprite#parent()
return parent sprite
### Sprite#stopPropagation
stop event propagation

### About static methods
Sprite mixin [component/emitter] directly.
So Emitter methods are available. `Sprite.on`, `Sprite.off`, `Sprite.once`, etc
Unless you stop event bubbling, Sprite can listen on any event no matter the event target.

[component/emitter]: https://github.com/component/emitter
[component/enumerable]: https://github.com/component/enumerable