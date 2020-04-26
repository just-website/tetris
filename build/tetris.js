var tetrisGame = (function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var FigureFactory = /*#__PURE__*/function () {
    function FigureFactory() {
      _classCallCheck(this, FigureFactory);

      this.figures = [[[1, 0, 0], [1, 0, 0], [1, 1, 0]], [[1, 1, 1], [0, 1, 0], [0, 0, 0]], [[1, 1, 0], [0, 1, 1], [0, 0, 0]], [[1, 1, 0], [1, 1, 0], [0, 0, 0]]];
    }

    _createClass(FigureFactory, [{
      key: "createRandomFigure",
      value: function createRandomFigure() {
        function randomInteger(min, max) {
          var random = min + Math.random() * (max + 1 - min);
          return Math.floor(random);
        }

        var randomFigure = this.figures[randomInteger(0, this.figures.length - 1)];
        return _toConsumableArray(randomFigure);
      }
    }]);

    return FigureFactory;
  }();

  var Model = /*#__PURE__*/function () {
    function Model(params) {
      _classCallCheck(this, Model);

      this.figureFactory = new FigureFactory();
      this.fieldSize = params.size;
      this.level = 0;
      this.score = 0;
      this.field = this._createEmptyField({
        x: params.size.x,
        y: params.size.y
      });
      this._currentFigure = {
        x: 0,
        y: 0,
        blocks: this.figureFactory.createRandomFigure()
      };
    }

    _createClass(Model, [{
      key: "moveCurrentFigure",
      value: function moveCurrentFigure(direction) {
        switch (direction) {
          case 'right':
            var rightSideCord = this._getSideCord('right');

            var fieldLength = this.field[0].length - 1;

            if (this._currentFigure.x + rightSideCord < fieldLength) {
              this._currentFigure.x += 1;
            }

            break;

          case 'left':
            var leftSideCord = this._getSideCord('left');

            if (this._currentFigure.x - leftSideCord > 0) {
              this._currentFigure.x -= 1;
            }

            break;

          case 'down':
            var bottomSideCord = this._getSideCord('bottom');

            var fieldHeight = this.field.length - 1;

            if (this._currentFigure.y + bottomSideCord < fieldHeight) {
              this._currentFigure.y += 1;
            }

            break;
        }
      }
    }, {
      key: "_getSideCord",
      value: function _getSideCord(position) {
        var sideCord = 0;
        var bottomCord = 0;

        this._currentFigure.blocks.forEach(function (row, index) {
          for (var i = 0; i < row.length; i++) {
            if (row[i]) {
              sideCord = row[i];
              bottomCord = index;

              if (position === 'left') {
                return sideCord;
              }
            }
          }
        });

        return position === 'bottom' ? bottomCord : sideCord;
      }
    }, {
      key: "_createEmptyField",
      value: function _createEmptyField(_ref) {
        var x = _ref.x,
            y = _ref.y;

        var createEmptyRow = function createEmptyRow(length) {
          return new Array(length).fill(0);
        };

        return new Array(y).fill(createEmptyRow(x));
      }
    }]);

    return Model;
  }();

  var Interface = function Interface(options) {
    _classCallCheck(this, Interface);

    this.model = new Model({
      size: options.size
    });

    if (!Interface._instance) {
      Interface._instance = this;
    }

    return Interface._instance;
  };

  return Interface;

}());
