
/**
 * smagch/sprite
 * Base Element for nesting data architecture
 * It supports simple event bubbling
 */
var Enumerable = require('enumerable')
  , Emitter = require('emitter')
  , emit = Emitter.prototype.emit
  , slice = Array.prototype.slice;

/**
 * exports Sprite
 */
module.exports = Sprite;

/**
 * It doesn't initialize properties
 * The following properties will be added on the fly
 *   "_eventStopped" {Boolean} flag for event bubbleing stop
 *   "_parent" {Sprite} parent Sprite
 *   "_nodes" {Array} children Sprite
 */
function Sprite() {}

/**
 * allow global event bus
 * e.g.
 *   Sprite.on('foo', function (msg) { console.log(msg)});
 *   var a = new Sprite();
 *   a.emit('foo', 'Hello World');
 */
Emitter(Sprite);

/**
 * mixin EventEmitter
 */
Emitter(Sprite.prototype);

/**
 * mixin Enumerable
 * so as to enumerate children
 */
Enumerable(Sprite.prototype);

/**
 * return parent sprite
 * @return {Sprite}
 */
Sprite.prototype.parent = function () {
  return this._parent;
};

/**
 * add a sprite as child
 * @param {Sprite}
 * @return {Sprite} self
 */
Sprite.prototype.add = function (child) {
  if (!this._nodes) this._nodes = [];
  this._nodes.push(child);
  child._parent = this;
  return this;
};

/**
 * @param {Sprite}
 * @return {Sprite|Boolean} return removed child or false
 */
Sprite.prototype.remove = function (child) {
  var i = this.indexOf(child);
  if (~i) {
    this._nodes.splice(i, 1);
    child._parent = null;
    return child;
  }
  return false;
};

/**
 * remove all children
 * @return {Array} list of remove children
 */
Sprite.prototype.removeAll = function () {
  var nodes = this._nodes;
  if (!nodes || !nodes.length) return [];
  var self = this;
  this.each(function (child) { child._parent = null; });
  delete this._nodes;
  return nodes;
};

/**
 * override EventMitter#emit
 * @param {String}
 * @return {Sprite} self
 */
Sprite.prototype.emit = function (ev) {
  // in case .stopPropagation() called wrongly
  if (this._eventStopped !== undefined) {
    delete this._eventStopped;
  }

  emit.apply(this, arguments);
  if (this._eventStopped) {
    delete this._eventStopped;
    return this;
  }

  // Sprite is the top node parent
  var parent = this._parent || Sprite;
  parent.emit.apply(parent, arguments);
  return this;
};

/**
 * Stop event propagation
 * calling this in a event callback will stop event
 * bubbling up to parent sprite
 */
Sprite.prototype.stopPropagation = function () {
  this._eventStopped = true;
};

/**
 * implement iterate
 * so that children are enumerable
 */
Sprite.prototype.__iterate__ = function () {
  var self = this;
  return {
    length: function (i) {
      if (self._nodes) return self._nodes.length;
      return 0;
    },
    get: function (i) {
      if (self._nodes) return self._nodes[i];
      return undefined;
    }
  };
};