(function (root, factory) {
  if (typeof define === 'function' && define.amd)
    define(['exports', './kotlinx.coroutines-kotlinx-coroutines-core-js-ir.js', './kotlin-kotlin-stdlib-js-ir.js', './ktor-ktor-utils.js'], factory);
  else if (typeof exports === 'object')
    factory(module.exports, require('./kotlinx.coroutines-kotlinx-coroutines-core-js-ir.js'), require('./kotlin-kotlin-stdlib-js-ir.js'), require('./ktor-ktor-utils.js'));
  else {
    if (typeof this['kotlinx.coroutines-kotlinx-coroutines-core-js-ir'] === 'undefined') {
      throw new Error("Error loading module 'ktor-ktor-events'. Its dependency 'kotlinx.coroutines-kotlinx-coroutines-core-js-ir' was not found. Please, check whether 'kotlinx.coroutines-kotlinx-coroutines-core-js-ir' is loaded prior to 'ktor-ktor-events'.");
    }
    if (typeof this['kotlin-kotlin-stdlib-js-ir'] === 'undefined') {
      throw new Error("Error loading module 'ktor-ktor-events'. Its dependency 'kotlin-kotlin-stdlib-js-ir' was not found. Please, check whether 'kotlin-kotlin-stdlib-js-ir' is loaded prior to 'ktor-ktor-events'.");
    }
    if (typeof this['ktor-ktor-utils'] === 'undefined') {
      throw new Error("Error loading module 'ktor-ktor-events'. Its dependency 'ktor-ktor-utils' was not found. Please, check whether 'ktor-ktor-utils' is loaded prior to 'ktor-ktor-events'.");
    }
    root['ktor-ktor-events'] = factory(typeof this['ktor-ktor-events'] === 'undefined' ? {} : this['ktor-ktor-events'], this['kotlinx.coroutines-kotlinx-coroutines-core-js-ir'], this['kotlin-kotlin-stdlib-js-ir'], this['ktor-ktor-utils']);
  }
}(this, function (_, kotlin_org_jetbrains_kotlinx_kotlinx_coroutines_core, kotlin_kotlin, kotlin_io_ktor_ktor_utils) {
  'use strict';
  //region block: imports
  var LinkedListNode = kotlin_org_jetbrains_kotlinx_kotlinx_coroutines_core.$_$.w;
  var DisposableHandle = kotlin_org_jetbrains_kotlinx_kotlinx_coroutines_core.$_$.f1;
  var classMeta = kotlin_kotlin.$_$.p8;
  var LinkedListHead = kotlin_org_jetbrains_kotlinx_kotlinx_coroutines_core.$_$.v;
  var CopyOnWriteHashMap = kotlin_io_ktor_ktor_utils.$_$.g;
  var equals = kotlin_kotlin.$_$.r8;
  var THROW_CCE = kotlin_kotlin.$_$.mc;
  var addSuppressed = kotlin_kotlin.$_$.vc;
  var Unit_getInstance = kotlin_kotlin.$_$.g4;
  //endregion
  //region block: pre-declaration
  HandlerRegistration.prototype = Object.create(LinkedListNode.prototype);
  HandlerRegistration.prototype.constructor = HandlerRegistration;
  //endregion
  function _get_handlers__pkfn2a($this) {
    return $this.handlers_1;
  }
  function HandlerRegistration(handler) {
    LinkedListNode.call(this);
    this.handler_1 = handler;
  }
  HandlerRegistration.prototype.get_handler_cq14kh_k$ = function () {
    return this.handler_1;
  };
  HandlerRegistration.prototype.dispose_3n44we_k$ = function () {
    this.remove_fgfybg_k$();
  };
  HandlerRegistration.$metadata$ = classMeta('HandlerRegistration', [DisposableHandle], undefined, undefined, undefined, LinkedListNode.prototype);
  function Events$subscribe$lambda() {
    return function (it) {
      return new LinkedListHead();
    };
  }
  function Events() {
    this.handlers_1 = new CopyOnWriteHashMap();
  }
  Events.prototype.subscribe_uqtskb_k$ = function (definition, handler) {
    var registration = new HandlerRegistration(handler);
    this.handlers_1.computeIfAbsent_uwu79p_k$(definition, Events$subscribe$lambda()).addLast_uyctnf_k$(registration);
    return registration;
  };
  Events.prototype.unsubscribe_fzjot_k$ = function (definition, handler) {
    var tmp0_safe_receiver = this.handlers_1.get_1mhr4y_k$(definition);
    if (tmp0_safe_receiver == null)
      null;
    else {
      {
        var cur = tmp0_safe_receiver.get__next_inmai1_k$();
        while (!equals(cur, tmp0_safe_receiver)) {
          if (cur instanceof HandlerRegistration) {
            var tmp0__anonymous__q1qw7t = cur;
            if (equals(tmp0__anonymous__q1qw7t.handler_1, handler)) {
              tmp0__anonymous__q1qw7t.remove_fgfybg_k$();
            }
          }
          cur = cur._next_1;
        }
      }
    }
  };
  Events.prototype.raise_segvv5_k$ = function (definition, value) {
    var exception = null;
    var tmp0_safe_receiver = this.handlers_1.get_1mhr4y_k$(definition);
    if (tmp0_safe_receiver == null)
      null;
    else {
      {
        var cur = tmp0_safe_receiver.get__next_inmai1_k$();
        while (!equals(cur, tmp0_safe_receiver)) {
          if (cur instanceof HandlerRegistration) {
            var tmp0__anonymous__q1qw7t = cur;
            try {
              var tmp = tmp0__anonymous__q1qw7t.handler_1;
              (typeof tmp === 'function' ? tmp : THROW_CCE())(value);
            } catch ($p) {
              if ($p instanceof Error) {
                var tmp0_safe_receiver_0 = exception;
                var tmp_0;
                if (tmp0_safe_receiver_0 == null) {
                  tmp_0 = null;
                } else {
                  addSuppressed(tmp0_safe_receiver_0, $p);
                  tmp_0 = Unit_getInstance();
                }
                var tmp1_elvis_lhs = tmp_0;
                if (tmp1_elvis_lhs == null) {
                  var tmp$ret$0;
                  {
                    {
                    }
                    exception = $p;
                    tmp$ret$0 = Unit_getInstance();
                  }
                } else {
                }
              } else {
                throw $p;
              }
            }
          }
          cur = cur._next_1;
        }
      }
    }
    var tmp1_safe_receiver = exception;
    if (tmp1_safe_receiver == null)
      null;
    else {
      var tmp$ret$1;
      {
        {
        }
        throw tmp1_safe_receiver;
      }
    }
  };
  Events.$metadata$ = classMeta('Events');
  function EventDefinition() {
  }
  EventDefinition.$metadata$ = classMeta('EventDefinition');
  //region block: exports
  _.$_$ = _.$_$ || {};
  _.$_$.a = EventDefinition;
  _.$_$.b = Events;
  //endregion
  return _;
}));

//# sourceMappingURL=ktor-ktor-events.js.map