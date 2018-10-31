'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  this.state.method = 'select';
  this.state.fields = this.helpers.setFields(fields);
  return this.operations;
};