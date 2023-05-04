(function (root, factory) {
  if (typeof define === 'function' && define.amd)
    define(['exports'], factory);
  else if (typeof exports === 'object')
    factory(module.exports);
  else
    root['kotlin-wrappers-kotlin-react-js-ir'] = factory(typeof this['kotlin-wrappers-kotlin-react-js-ir'] === 'undefined' ? {} : this['kotlin-wrappers-kotlin-react-js-ir']);
}(this, function (_) {
  'use strict';
  //region block: pre-declaration
  //endregion
  function get_CHILDREN() {
    init_properties_ChildrenBuilder_kt_7yrkko();
    return CHILDREN;
  }
  var CHILDREN;
  var properties_initialized_ChildrenBuilder_kt_gby2z0;
  function init_properties_ChildrenBuilder_kt_7yrkko() {
    if (properties_initialized_ChildrenBuilder_kt_gby2z0) {
    } else {
      properties_initialized_ChildrenBuilder_kt_gby2z0 = true;
      CHILDREN = Symbol('@@children');
    }
  }
  return _;
}));

//# sourceMappingURL=kotlin-wrappers-kotlin-react-js-ir.js.map