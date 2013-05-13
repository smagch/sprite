var Sprite = require('sprite')
  , Emitter = require('component-emitter')
  , assert = require('component-assert')
  , Enumerable = require('component-enumerable');

describe('Sprite', function () {
  it('should mixin Emitter methods', function () {
    for (var key in Emitter.prototype) {
      assert(Sprite[key] === Emitter.prototype[key], 'key : ' + key);
    }
  });

  it("should mixin first argument when it doesn't called with `New`", function () {
    function MySprite() {}
    Sprite(MySprite.prototype);
    assert(MySprite.prototype.add === Sprite.prototype.add);
    assert(MySprite.prototype.remove === Sprite.prototype.remove);
    assert(MySprite.prototype.removeAll === Sprite.prototype.removeAll);
    assert(MySprite.prototype.parent === Sprite.prototype.parent);
    assert(MySprite.prototype.parents === Sprite.prototype.parents);
  }); 

  it('prototype should mixin Emitter methods except .emit()', function () {
    for (var key in Emitter.prototype) {
      var msg = 'key : ' + key;
      if (key !== 'emit') {
        assert(Sprite.prototype[key] === Emitter.prototype[key], msg);
      } else {
        assert(Sprite.prototype[key] !== Emitter.prototype[key], msg);
      }
    }
  });

  it('should mixin Enumerable', function () {
    var ex = {
      '__iterate__': 1,
      'toString': 1,
      'inspect': 1
    };
    for (var key in Enumerable.prototype) {
      var msg = 'key : ' + key;
      if (!ex[key]) {
        assert(Sprite.prototype[key] === Enumerable.prototype[key], msg);
      } else {
        assert(Sprite.prototype[key] !== Enumerable.prototype[key], msg);
      }
    }
  });

  describe('#add', function () {
    it('should bubble up event', function () {
      var a = new Sprite();
      a.name = 'A';
      var b = new Sprite();
      b.name = 'B';
      var c = new Sprite();
      c.name = 'C';
      c.add(b);
      b.add(a);

      var msgs = [];
      a.on('test', function (arg) {
        msgs.push(arg + a.name);
      });
      b.on('test', function (arg) {
        msgs.push(arg + b.name);
      });
      c.on('test', function (arg) {
        msgs.push(arg + c.name);
      });
      Sprite.on('test', function (arg) {
        msgs.push(arg + 'Sprite');
      });

      a.emit('test', 'Hello');

      assert(msgs.length === 4);
      assert(msgs[0] === 'HelloA');
      assert(msgs[1] === 'HelloB');
      assert(msgs[2] === 'HelloC');
      assert(msgs[3] === 'HelloSprite');
    });
  });

  describe('#stopPropagation', function () {
    it('should be able to stop event propagation', function () {
      var a = new Sprite();
      a.name = 'A';
      var b = new Sprite();
      b.name = 'B';
      var c = new Sprite();
      c.name = 'C';
      c.add(b);
      b.add(a);

      var msgs = [];
      a.on('test', function (arg) {
        msgs.push(arg + a.name);
      });
      b.on('test', function (arg) {
        msgs.push(arg + b.name);
        b.stopPropagation();
      });
      c.on('test', function (arg) {
        msgs.push(arg + c.name);
      });
      Sprite.on('test', function (arg) {
        msgs.push(arg + 'Sprite');
      });

      a.emit('test', 'Hello');

      assert(msgs.length === 2);
      assert(msgs[0] === 'HelloA');
      assert(msgs[1] === 'HelloB');
    });
  });

  describe('#remove', function () {
    it('should be able to remove child', function () {
      var a = new Sprite();
      var b = new Sprite();
      var c = new Sprite();
      c.add(b);
      c.add(a);
      c.remove(b);
      assert(c.at(0) === a, 'c must has a');
      assert(c.at(1) === undefined, 'c must have only one child');
    });
  });

  describe('#removeAll', function () {
    it('should be able to remove all children', function () {
      var a = new Sprite();
      var b = new Sprite();
      var c = new Sprite();
      c.add(b);
      c.add(a);
      c.removeAll();
      assert(c.at(0) === undefined);
    });
  });

  describe('#parent', function () {
    it('should return parent node', function () {
      var a = new Sprite();
      var b = new Sprite();
      var c = new Sprite();
      c.add(b);
      b.add(a);
      assert(a.parent() === b);
      assert(b.parent() === c);
    });
  });

  describe('#parents', function () {
    it('should return all ancester nodes', function () {
      var a = new Sprite();
      var b = new Sprite();
      var c = new Sprite();
      var d = new Sprite();
      d.add(c);
      c.add(b);
      b.add(a);
      var parents = a.parents();
      assert(parents.length === 3);
      assert(parents.indexOf(b) !== -1);
      assert(parents.indexOf(c) !== -1);
      assert(parents.indexOf(d) !== -1);
    });
  });

  describe('#emit', function () {
    it('should bubble up event', function (done) {
      var a = new Sprite();
      var b = new Sprite();
      b.add(a);
      b.on('foo', function (bar, twoThousand) {
        assert(bar === 'bar', 'bar should be ' + bar);
        assert(2000 === twoThousand);
        done();
      });

      a.emit('foo', 'bar', 2000);
    });
  });
});
