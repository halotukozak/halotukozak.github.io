(function (root, factory) {
  if (typeof define === 'function' && define.amd)
    define(['exports', './kotlin-kotlin-stdlib-js-ir.js'], factory);
  else if (typeof exports === 'object')
    factory(module.exports, require('./kotlin-kotlin-stdlib-js-ir.js'));
  else {
    if (typeof this['kotlin-kotlin-stdlib-js-ir'] === 'undefined') {
      throw new Error("Error loading module 'kotlin_org_jetbrains_kotlinx_kotlinx_html'. Its dependency 'kotlin-kotlin-stdlib-js-ir' was not found. Please, check whether 'kotlin-kotlin-stdlib-js-ir' is loaded prior to 'kotlin_org_jetbrains_kotlinx_kotlinx_html'.");
    }
    root.kotlin_org_jetbrains_kotlinx_kotlinx_html = factory(typeof kotlin_org_jetbrains_kotlinx_kotlinx_html === 'undefined' ? {} : kotlin_org_jetbrains_kotlinx_kotlinx_html, this['kotlin-kotlin-stdlib-js-ir']);
  }
}(this, function (_, kotlin_kotlin) {
  'use strict';
  //region block: imports
  var imul = Math.imul;
  var interfaceMeta = kotlin_kotlin.$_$.v6;
  var toString = kotlin_kotlin.$_$.p7;
  var THROW_CCE = kotlin_kotlin.$_$.b9;
  var Annotation = kotlin_kotlin.$_$.r8;
  var classMeta = kotlin_kotlin.$_$.p6;
  var getProgressionLastElement = kotlin_kotlin.$_$.g6;
  var LinkedHashMap_init_$Create$ = kotlin_kotlin.$_$.t;
  var Unit_getInstance = kotlin_kotlin.$_$.c3;
  var StringBuilder_init_$Create$ = kotlin_kotlin.$_$.c1;
  var IllegalArgumentException_init_$Create$ = kotlin_kotlin.$_$.i1;
  var setOf = kotlin_kotlin.$_$.a5;
  var listOf = kotlin_kotlin.$_$.t4;
  var getStringHashCode = kotlin_kotlin.$_$.t6;
  var Map = kotlin_kotlin.$_$.o3;
  var Entry = kotlin_kotlin.$_$.n3;
  var emptyMap = kotlin_kotlin.$_$.j4;
  var IllegalStateException_init_$Create$ = kotlin_kotlin.$_$.k1;
  var objectMeta = kotlin_kotlin.$_$.l7;
  var joinToString$default = kotlin_kotlin.$_$.g;
  var Set = kotlin_kotlin.$_$.s3;
  var isInterface = kotlin_kotlin.$_$.d7;
  var ensureNotNull = kotlin_kotlin.$_$.n9;
  var emptySet = kotlin_kotlin.$_$.k4;
  var Regex_init_$Create$ = kotlin_kotlin.$_$.a1;
  var ArrayList_init_$Create$ = kotlin_kotlin.$_$.k;
  var charSequenceLength = kotlin_kotlin.$_$.n6;
  var toSet = kotlin_kotlin.$_$.i5;
  var LinkedHashMap_init_$Create$_0 = kotlin_kotlin.$_$.u;
  var MutableMap = kotlin_kotlin.$_$.q3;
  var THROW_ISE = kotlin_kotlin.$_$.c9;
  var Enum = kotlin_kotlin.$_$.v8;
  var mapCapacity = kotlin_kotlin.$_$.v4;
  var coerceAtLeast = kotlin_kotlin.$_$.q7;
  var LinkedHashMap_init_$Create$_1 = kotlin_kotlin.$_$.s;
  var _Char___init__impl__6a9atx = kotlin_kotlin.$_$.r1;
  var Char = kotlin_kotlin.$_$.s8;
  var to = kotlin_kotlin.$_$.x9;
  var mapOf = kotlin_kotlin.$_$.w4;
  var collectionSizeOrDefault = kotlin_kotlin.$_$.v3;
  var ArrayList_init_$Create$_0 = kotlin_kotlin.$_$.j;
  var Char__toInt_impl_vasixd = kotlin_kotlin.$_$.u1;
  var maxOrNull = kotlin_kotlin.$_$.x4;
  var fillArrayVal = kotlin_kotlin.$_$.r6;
  var numberToChar = kotlin_kotlin.$_$.k7;
  var Char__rangeTo_impl_tkncvp = kotlin_kotlin.$_$.t1;
  var last = kotlin_kotlin.$_$.s4;
  var get_lastIndex = kotlin_kotlin.$_$.q4;
  var asList = kotlin_kotlin.$_$.z9;
  var first = kotlin_kotlin.$_$.l4;
  //endregion
  //region block: pre-declaration
  function unaryPlus(_this__u8e3s4) {
    this.entity_uznif4_k$(_this__u8e3s4);
  }
  function unaryPlus_0(_this__u8e3s4) {
    this.text_yddl45_k$(_this__u8e3s4);
  }
  function text(s) {
    this.get_consumer_tu5133_k$().onTagContent_8k5bde_k$(s);
  }
  function text_0(n) {
    this.text_yddl45_k$(toString(n));
  }
  function entity(e) {
    this.get_consumer_tu5133_k$().onTagContentEntity_uzz4te_k$(e);
  }
  function comment(s) {
    this.get_consumer_tu5133_k$().onTagComment_dfi7y0_k$(s);
  }
  function onTagError(tag, exception) {
    throw exception;
  }
  function unaryPlus_1(_this__u8e3s4) {
    return this.unaryPlus_g7ydph_k$(_this__u8e3s4.get_text_wouvsm_k$());
  }
  function raw(s) {
    this.unaryPlus_g7ydph_k$(s);
  }
  function raw_0(entity) {
    this.unaryPlus_31ug2c_k$(entity);
  }
  function raw_1(n) {
    this.unaryPlus_g7ydph_k$(toString(n));
  }
  StringAttribute.prototype = Object.create(Attribute.prototype);
  StringAttribute.prototype.constructor = StringAttribute;
  StringSetAttribute.prototype = Object.create(Attribute.prototype);
  StringSetAttribute.prototype.constructor = StringSetAttribute;
  BooleanAttribute.prototype = Object.create(Attribute.prototype);
  BooleanAttribute.prototype.constructor = BooleanAttribute;
  TickerAttribute.prototype = Object.create(Attribute.prototype);
  TickerAttribute.prototype.constructor = TickerAttribute;
  EnumAttribute.prototype = Object.create(Attribute.prototype);
  EnumAttribute.prototype.constructor = EnumAttribute;
  function empty(attributeName, tag) {
    throw IllegalStateException_init_$Create$('Attribute ' + attributeName + ' is not yet defined for tag ' + tag.get_tagName_ocsgis_k$());
  }
  Entities.prototype = Object.create(Enum.prototype);
  Entities.prototype.constructor = Entities;
  ButtonFormEncType.prototype = Object.create(Enum.prototype);
  ButtonFormEncType.prototype.constructor = ButtonFormEncType;
  ButtonFormMethod.prototype = Object.create(Enum.prototype);
  ButtonFormMethod.prototype.constructor = ButtonFormMethod;
  ButtonType.prototype = Object.create(Enum.prototype);
  ButtonType.prototype.constructor = ButtonType;
  CommandType.prototype = Object.create(Enum.prototype);
  CommandType.prototype.constructor = CommandType;
  Dir.prototype = Object.create(Enum.prototype);
  Dir.prototype.constructor = Dir;
  Draggable.prototype = Object.create(Enum.prototype);
  Draggable.prototype.constructor = Draggable;
  FormEncType.prototype = Object.create(Enum.prototype);
  FormEncType.prototype.constructor = FormEncType;
  FormMethod.prototype = Object.create(Enum.prototype);
  FormMethod.prototype.constructor = FormMethod;
  IframeSandbox.prototype = Object.create(Enum.prototype);
  IframeSandbox.prototype.constructor = IframeSandbox;
  InputFormEncType.prototype = Object.create(Enum.prototype);
  InputFormEncType.prototype.constructor = InputFormEncType;
  InputFormMethod.prototype = Object.create(Enum.prototype);
  InputFormMethod.prototype.constructor = InputFormMethod;
  InputType.prototype = Object.create(Enum.prototype);
  InputType.prototype.constructor = InputType;
  KeyGenKeyType.prototype = Object.create(Enum.prototype);
  KeyGenKeyType.prototype.constructor = KeyGenKeyType;
  RunAt.prototype = Object.create(Enum.prototype);
  RunAt.prototype.constructor = RunAt;
  TextAreaWrap.prototype = Object.create(Enum.prototype);
  TextAreaWrap.prototype.constructor = TextAreaWrap;
  ThScope.prototype = Object.create(Enum.prototype);
  ThScope.prototype.constructor = ThScope;
  AreaShape.prototype = Object.create(Enum.prototype);
  AreaShape.prototype.constructor = AreaShape;
  A.prototype = Object.create(HTMLTag.prototype);
  A.prototype.constructor = A;
  DIV.prototype = Object.create(HTMLTag.prototype);
  DIV.prototype.constructor = DIV;
  H2.prototype = Object.create(HTMLTag.prototype);
  H2.prototype.constructor = H2;
  HEADER.prototype = Object.create(HTMLTag.prototype);
  HEADER.prototype.constructor = HEADER;
  H1.prototype = Object.create(HTMLTag.prototype);
  H1.prototype.constructor = H1;
  H4.prototype = Object.create(HTMLTag.prototype);
  H4.prototype.constructor = H4;
  IMG.prototype = Object.create(HTMLTag.prototype);
  IMG.prototype.constructor = IMG;
  I.prototype = Object.create(HTMLTag.prototype);
  I.prototype.constructor = I;
  LI.prototype = Object.create(HTMLTag.prototype);
  LI.prototype.constructor = LI;
  PRE.prototype = Object.create(HTMLTag.prototype);
  PRE.prototype.constructor = PRE;
  P.prototype = Object.create(HTMLTag.prototype);
  P.prototype.constructor = P;
  SPAN.prototype = Object.create(HTMLTag.prototype);
  SPAN.prototype.constructor = SPAN;
  UL.prototype = Object.create(HTMLTag.prototype);
  UL.prototype.constructor = UL;
  //endregion
  function get_emptyMap() {
    init_properties_api_kt_ywlw3q();
    return emptyMap_0;
  }
  var emptyMap_0;
  function AttributeEnum() {
  }
  AttributeEnum.$metadata$ = interfaceMeta('AttributeEnum');
  function Tag() {
  }
  Tag.$metadata$ = interfaceMeta('Tag');
  function TagConsumer() {
  }
  TagConsumer.$metadata$ = interfaceMeta('TagConsumer');
  function HtmlTagMarker() {
  }
  HtmlTagMarker.prototype.equals = function (other) {
    if (!(other instanceof HtmlTagMarker))
      return false;
    var tmp0_other_with_cast = other instanceof HtmlTagMarker ? other : THROW_CCE();
    return true;
  };
  HtmlTagMarker.prototype.hashCode = function () {
    return 0;
  };
  HtmlTagMarker.prototype.toString = function () {
    return '@kotlinx.html.HtmlTagMarker()';
  };
  HtmlTagMarker.$metadata$ = classMeta('HtmlTagMarker', [Annotation]);
  function Unsafe() {
  }
  Unsafe.$metadata$ = interfaceMeta('Unsafe');
  function visit(_this__u8e3s4, block) {
    init_properties_api_kt_ywlw3q();
    _this__u8e3s4.get_consumer_tu5133_k$().onTagStart_jhb705_k$(_this__u8e3s4);
    var tmp;
    try {
      tmp = block(_this__u8e3s4);
    } catch ($p) {
      var tmp_0;
      if ($p instanceof Error) {
        tmp_0 = _this__u8e3s4.get_consumer_tu5133_k$().onTagError_d07vof_k$(_this__u8e3s4, $p);
      } else {
        throw $p;
      }
      tmp = tmp_0;
    }
    finally {
      _this__u8e3s4.get_consumer_tu5133_k$().onTagEnd_f3ehek_k$(_this__u8e3s4);
    }
    return tmp;
  }
  function attributesMapOf(pairs) {
    init_properties_api_kt_ywlw3q();
    var result = null;
    var nestedLast = pairs.length - 1 | 0;
    var inductionVariable = 0;
    var last = getProgressionLastElement(0, nestedLast, 2);
    if (inductionVariable <= last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 2 | 0;
        var k = pairs[i];
        var v = pairs[i + 1 | 0];
        if (!(k == null) ? !(v == null) : false) {
          if (result == null) {
            var tmp$ret$0;
            {
              tmp$ret$0 = LinkedHashMap_init_$Create$();
            }
            result = tmp$ret$0;
          }
          result.put_3mhbri_k$(k, v);
        }
      }
       while (!(i === last));
    var tmp1_elvis_lhs = result;
    return tmp1_elvis_lhs == null ? get_emptyMap() : tmp1_elvis_lhs;
  }
  function _get_sb__ndcaho($this) {
    return $this.sb_1;
  }
  function DefaultUnsafe() {
    this.sb_1 = StringBuilder_init_$Create$();
  }
  DefaultUnsafe.prototype.unaryPlus_g7ydph_k$ = function (_this__u8e3s4) {
    this.sb_1.append_ssq29y_k$(_this__u8e3s4);
  };
  DefaultUnsafe.prototype.toString = function () {
    return this.sb_1.toString();
  };
  DefaultUnsafe.$metadata$ = classMeta('DefaultUnsafe', [Unsafe]);
  function visitAndFinalize(_this__u8e3s4, consumer, block) {
    init_properties_api_kt_ywlw3q();
    var tmp$ret$0;
    {
      if (!(_this__u8e3s4.get_consumer_tu5133_k$() === consumer)) {
        throw IllegalArgumentException_init_$Create$('Wrong exception');
      }
      {
        _this__u8e3s4.get_consumer_tu5133_k$().onTagStart_jhb705_k$(_this__u8e3s4);
        try {
          {
            block(_this__u8e3s4);
          }
        } catch ($p) {
          if ($p instanceof Error) {
            _this__u8e3s4.get_consumer_tu5133_k$().onTagError_d07vof_k$(_this__u8e3s4, $p);
          } else {
            throw $p;
          }
        }
        finally {
          _this__u8e3s4.get_consumer_tu5133_k$().onTagEnd_f3ehek_k$(_this__u8e3s4);
        }
      }
      tmp$ret$0 = consumer.finalize_b9lof6_k$();
    }
    return tmp$ret$0;
  }
  function attributesMapOf_0(key, value) {
    init_properties_api_kt_ywlw3q();
    var tmp0_subject = value;
    return tmp0_subject == null ? get_emptyMap() : singletonMapOf(key, value);
  }
  function singletonMapOf(key, value) {
    init_properties_api_kt_ywlw3q();
    return new SingletonStringMap(key, value);
  }
  function SingletonStringMap(key, value) {
    this.key_1 = key;
    this.value_1 = value;
  }
  SingletonStringMap.prototype.get_key_18j28a_k$ = function () {
    return this.key_1;
  };
  SingletonStringMap.prototype.get_value_j01efc_k$ = function () {
    return this.value_1;
  };
  SingletonStringMap.prototype.get_entries_p20ztl_k$ = function () {
    return setOf(this);
  };
  SingletonStringMap.prototype.get_keys_wop4xp_k$ = function () {
    return setOf(this.key_1);
  };
  SingletonStringMap.prototype.get_size_woubt6_k$ = function () {
    return 1;
  };
  SingletonStringMap.prototype.get_values_ksazhn_k$ = function () {
    return listOf(this.value_1);
  };
  SingletonStringMap.prototype.containsKey_mw51tt_k$ = function (key) {
    return key === this.key_1;
  };
  SingletonStringMap.prototype.containsKey_wgk31w_k$ = function (key) {
    if (!(!(key == null) ? typeof key === 'string' : false))
      return false;
    return this.containsKey_mw51tt_k$((!(key == null) ? typeof key === 'string' : false) ? key : THROW_CCE());
  };
  SingletonStringMap.prototype.containsValue_h0v3u7_k$ = function (value) {
    return value === this.value_1;
  };
  SingletonStringMap.prototype.containsValue_5viga1_k$ = function (value) {
    if (!(!(value == null) ? typeof value === 'string' : false))
      return false;
    return this.containsValue_h0v3u7_k$((!(value == null) ? typeof value === 'string' : false) ? value : THROW_CCE());
  };
  SingletonStringMap.prototype.get_4u8u51_k$ = function (key) {
    return key === this.key_1 ? this.value_1 : null;
  };
  SingletonStringMap.prototype.get_1mhr4y_k$ = function (key) {
    if (!(!(key == null) ? typeof key === 'string' : false))
      return null;
    return this.get_4u8u51_k$((!(key == null) ? typeof key === 'string' : false) ? key : THROW_CCE());
  };
  SingletonStringMap.prototype.isEmpty_y1axqb_k$ = function () {
    return false;
  };
  SingletonStringMap.prototype.component1_7eebsc_k$ = function () {
    return this.key_1;
  };
  SingletonStringMap.prototype.component2_7eebsb_k$ = function () {
    return this.value_1;
  };
  SingletonStringMap.prototype.copy_jxa1ir_k$ = function (key, value) {
    return new SingletonStringMap(key, value);
  };
  SingletonStringMap.prototype.copy$default_jej4nk_k$ = function (key, value, $mask0, $handler) {
    if (!(($mask0 & 1) === 0))
      key = this.key_1;
    if (!(($mask0 & 2) === 0))
      value = this.value_1;
    return this.copy_jxa1ir_k$(key, value);
  };
  SingletonStringMap.prototype.toString = function () {
    return 'SingletonStringMap(key=' + this.key_1 + ', value=' + this.value_1 + ')';
  };
  SingletonStringMap.prototype.hashCode = function () {
    var result = getStringHashCode(this.key_1);
    result = imul(result, 31) + getStringHashCode(this.value_1) | 0;
    return result;
  };
  SingletonStringMap.prototype.equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof SingletonStringMap))
      return false;
    var tmp0_other_with_cast = other instanceof SingletonStringMap ? other : THROW_CCE();
    if (!(this.key_1 === tmp0_other_with_cast.key_1))
      return false;
    if (!(this.value_1 === tmp0_other_with_cast.value_1))
      return false;
    return true;
  };
  SingletonStringMap.$metadata$ = classMeta('SingletonStringMap', [Map, Entry]);
  var properties_initialized_api_kt_zfwuc6;
  function init_properties_api_kt_ywlw3q() {
    if (properties_initialized_api_kt_zfwuc6) {
    } else {
      properties_initialized_api_kt_zfwuc6 = true;
      emptyMap_0 = emptyMap();
    }
  }
  function Attribute(encoder) {
    this.encoder_1 = encoder;
  }
  Attribute.prototype.get_encoder_pbfikt_k$ = function () {
    return this.encoder_1;
  };
  Attribute.prototype.get_kdqgs6_k$ = function (thisRef, attributeName) {
    var tmp0_safe_receiver = thisRef.get_attributes_dgqof4_k$().get_1mhr4y_k$(attributeName);
    var tmp;
    if (tmp0_safe_receiver == null) {
      tmp = null;
    } else {
      var tmp$ret$1;
      {
        {
        }
        var tmp$ret$0;
        {
          tmp$ret$0 = this.encoder_1.decode_w6qcwk_k$(attributeName, tmp0_safe_receiver);
        }
        tmp$ret$1 = tmp$ret$0;
      }
      tmp = tmp$ret$1;
    }
    var tmp1_elvis_lhs = tmp;
    return tmp1_elvis_lhs == null ? this.encoder_1.empty_mnkn29_k$(attributeName, thisRef) : tmp1_elvis_lhs;
  };
  Attribute.prototype.set_r65rse_k$ = function (thisRef, attributeName, value) {
    thisRef.get_attributes_dgqof4_k$().put_3mhbri_k$(attributeName, this.encoder_1.encode_y2bd9m_k$(attributeName, value));
  };
  Attribute.$metadata$ = classMeta('Attribute');
  function StringAttribute() {
    Attribute.call(this, StringEncoder_getInstance());
  }
  StringAttribute.$metadata$ = classMeta('StringAttribute', undefined, undefined, undefined, undefined, Attribute.prototype);
  function StringSetAttribute() {
    Attribute.call(this, StringSetEncoder_getInstance());
  }
  StringSetAttribute.$metadata$ = classMeta('StringSetAttribute', undefined, undefined, undefined, undefined, Attribute.prototype);
  function BooleanAttribute_init_$Init$(trueValue, falseValue, $mask0, $marker, $this) {
    if (!(($mask0 & 1) === 0))
      trueValue = 'true';
    if (!(($mask0 & 2) === 0))
      falseValue = 'false';
    BooleanAttribute.call($this, trueValue, falseValue);
    return $this;
  }
  function BooleanAttribute_init_$Create$(trueValue, falseValue, $mask0, $marker) {
    return BooleanAttribute_init_$Init$(trueValue, falseValue, $mask0, $marker, Object.create(BooleanAttribute.prototype));
  }
  function BooleanAttribute(trueValue, falseValue) {
    Attribute.call(this, new BooleanEncoder(trueValue, falseValue));
  }
  BooleanAttribute.$metadata$ = classMeta('BooleanAttribute', undefined, undefined, undefined, undefined, Attribute.prototype);
  function TickerAttribute() {
    Attribute.call(this, TickerEncoder_getInstance());
  }
  TickerAttribute.prototype.set_yc3875_k$ = function (thisRef, attributeName, value) {
    if (value) {
      thisRef.get_attributes_dgqof4_k$().put_3mhbri_k$(attributeName, attributeName);
    } else {
      thisRef.get_attributes_dgqof4_k$().remove_8hbkc0_k$(attributeName);
    }
  };
  TickerAttribute.prototype.set_r65rse_k$ = function (thisRef, attributeName, value) {
    return this.set_yc3875_k$(thisRef, attributeName, (!(value == null) ? typeof value === 'boolean' : false) ? value : THROW_CCE());
  };
  TickerAttribute.$metadata$ = classMeta('TickerAttribute', undefined, undefined, undefined, undefined, Attribute.prototype);
  function EnumAttribute(values) {
    Attribute.call(this, new EnumEncoder(values));
    this.values_1 = values;
  }
  EnumAttribute.prototype.get_values_ksazhn_k$ = function () {
    return this.values_1;
  };
  EnumAttribute.$metadata$ = classMeta('EnumAttribute', undefined, undefined, undefined, undefined, Attribute.prototype);
  function AttributeEncoder() {
  }
  AttributeEncoder.$metadata$ = interfaceMeta('AttributeEncoder');
  function StringEncoder() {
    StringEncoder_instance = this;
  }
  StringEncoder.prototype.encode_ewfsk4_k$ = function (attributeName, value) {
    return value;
  };
  StringEncoder.prototype.encode_y2bd9m_k$ = function (attributeName, value) {
    return this.encode_ewfsk4_k$(attributeName, (!(value == null) ? typeof value === 'string' : false) ? value : THROW_CCE());
  };
  StringEncoder.prototype.decode_w6qcwk_k$ = function (attributeName, value) {
    return value;
  };
  StringEncoder.$metadata$ = objectMeta('StringEncoder', [AttributeEncoder]);
  var StringEncoder_instance;
  function StringEncoder_getInstance() {
    if (StringEncoder_instance == null)
      new StringEncoder();
    return StringEncoder_instance;
  }
  function StringSetEncoder() {
    StringSetEncoder_instance = this;
  }
  StringSetEncoder.prototype.encode_5c7nxm_k$ = function (attributeName, value) {
    return joinToString$default(value, ' ', null, null, 0, null, null, 62, null);
  };
  StringSetEncoder.prototype.encode_y2bd9m_k$ = function (attributeName, value) {
    return this.encode_5c7nxm_k$(attributeName, (!(value == null) ? isInterface(value, Set) : false) ? value : THROW_CCE());
  };
  StringSetEncoder.prototype.decode_w6qcwk_k$ = function (attributeName, value) {
    return ensureNotNull(stringSetDecode(value));
  };
  StringSetEncoder.prototype.empty_mnkn29_k$ = function (attributeName, tag) {
    return emptySet();
  };
  StringSetEncoder.$metadata$ = objectMeta('StringSetEncoder', [AttributeEncoder]);
  var StringSetEncoder_instance;
  function StringSetEncoder_getInstance() {
    if (StringSetEncoder_instance == null)
      new StringSetEncoder();
    return StringSetEncoder_instance;
  }
  function BooleanEncoder_init_$Init$(trueValue, falseValue, $mask0, $marker, $this) {
    if (!(($mask0 & 1) === 0))
      trueValue = 'true';
    if (!(($mask0 & 2) === 0))
      falseValue = 'false';
    BooleanEncoder.call($this, trueValue, falseValue);
    return $this;
  }
  function BooleanEncoder_init_$Create$(trueValue, falseValue, $mask0, $marker) {
    return BooleanEncoder_init_$Init$(trueValue, falseValue, $mask0, $marker, Object.create(BooleanEncoder.prototype));
  }
  function BooleanEncoder(trueValue, falseValue) {
    this.trueValue_1 = trueValue;
    this.falseValue_1 = falseValue;
  }
  BooleanEncoder.prototype.get_trueValue_unaore_k$ = function () {
    return this.trueValue_1;
  };
  BooleanEncoder.prototype.get_falseValue_ywwtih_k$ = function () {
    return this.falseValue_1;
  };
  BooleanEncoder.prototype.encode_33b5x7_k$ = function (attributeName, value) {
    return value ? this.trueValue_1 : this.falseValue_1;
  };
  BooleanEncoder.prototype.encode_y2bd9m_k$ = function (attributeName, value) {
    return this.encode_33b5x7_k$(attributeName, (!(value == null) ? typeof value === 'boolean' : false) ? value : THROW_CCE());
  };
  BooleanEncoder.prototype.decode_w6qcwk_k$ = function (attributeName, value) {
    var tmp0_subject = value;
    var tmp;
    if (tmp0_subject === this.trueValue_1) {
      tmp = true;
    } else if (tmp0_subject === this.falseValue_1) {
      tmp = false;
    } else {
      throw IllegalArgumentException_init_$Create$('Unknown value ' + value + ' for ' + attributeName);
    }
    return tmp;
  };
  BooleanEncoder.$metadata$ = classMeta('BooleanEncoder', [AttributeEncoder]);
  function TickerEncoder() {
    TickerEncoder_instance = this;
  }
  TickerEncoder.prototype.encode_33b5x7_k$ = function (attributeName, value) {
    return tickerEncode(value, attributeName);
  };
  TickerEncoder.prototype.encode_y2bd9m_k$ = function (attributeName, value) {
    return this.encode_33b5x7_k$(attributeName, (!(value == null) ? typeof value === 'boolean' : false) ? value : THROW_CCE());
  };
  TickerEncoder.prototype.decode_w6qcwk_k$ = function (attributeName, value) {
    return value === attributeName;
  };
  TickerEncoder.$metadata$ = objectMeta('TickerEncoder', [AttributeEncoder]);
  var TickerEncoder_instance;
  function TickerEncoder_getInstance() {
    if (TickerEncoder_instance == null)
      new TickerEncoder();
    return TickerEncoder_instance;
  }
  function EnumEncoder(valuesMap) {
    this.valuesMap_1 = valuesMap;
  }
  EnumEncoder.prototype.get_valuesMap_44trkf_k$ = function () {
    return this.valuesMap_1;
  };
  EnumEncoder.prototype.encode_y2bd9m_k$ = function (attributeName, value) {
    return value.get_realValue_69bbcm_k$();
  };
  EnumEncoder.prototype.decode_w6qcwk_k$ = function (attributeName, value) {
    var tmp0_elvis_lhs = this.valuesMap_1.get_1mhr4y_k$(value);
    var tmp;
    if (tmp0_elvis_lhs == null) {
      throw IllegalArgumentException_init_$Create$('Unknown value ' + value + ' for ' + attributeName);
    } else {
      tmp = tmp0_elvis_lhs;
    }
    return tmp;
  };
  EnumEncoder.$metadata$ = classMeta('EnumEncoder', [AttributeEncoder]);
  function stringSetDecode(value) {
    var tmp0_safe_receiver = value;
    var tmp;
    if (tmp0_safe_receiver == null) {
      tmp = null;
    } else {
      var tmp$ret$1;
      {
        var tmp$ret$0;
        {
          tmp$ret$0 = Regex_init_$Create$('\\s+');
        }
        var tmp0_split = tmp$ret$0;
        tmp$ret$1 = tmp0_split.split_8rwwda_k$(tmp0_safe_receiver, 0);
      }
      tmp = tmp$ret$1;
    }
    var tmp1_safe_receiver = tmp;
    var tmp_0;
    if (tmp1_safe_receiver == null) {
      tmp_0 = null;
    } else {
      var tmp$ret$5;
      {
        var tmp$ret$4;
        {
          var tmp0_filterNotTo = ArrayList_init_$Create$();
          var tmp0_iterator = tmp1_safe_receiver.iterator_jk1svi_k$();
          while (tmp0_iterator.hasNext_bitz1p_k$()) {
            var element = tmp0_iterator.next_20eer_k$();
            var tmp$ret$3;
            {
              var tmp$ret$2;
              {
                tmp$ret$2 = charSequenceLength(element) === 0;
              }
              tmp$ret$3 = tmp$ret$2;
            }
            if (!tmp$ret$3) {
              tmp0_filterNotTo.add_1j60pz_k$(element);
            }
          }
          tmp$ret$4 = tmp0_filterNotTo;
        }
        tmp$ret$5 = tmp$ret$4;
      }
      tmp_0 = tmp$ret$5;
    }
    var tmp2_safe_receiver = tmp_0;
    return tmp2_safe_receiver == null ? null : toSet(tmp2_safe_receiver);
  }
  function tickerEncode(_this__u8e3s4, attributeName) {
    return _this__u8e3s4 ? attributeName : '';
  }
  function _get_tag__e6h4qf($this) {
    return $this.tag_1;
  }
  function _get_consumer__hjl9jp($this) {
    return $this.consumer_1;
  }
  function _set_backing__ou0ocq($this, _set____db54di) {
    $this.backing_1 = _set____db54di;
  }
  function _get_backing__s7m0a($this) {
    return $this.backing_1;
  }
  function _set_backingMutable__g4cv4k($this, _set____db54di) {
    $this.backingMutable_1 = _set____db54di;
  }
  function _get_backingMutable__9eqkww($this) {
    return $this.backingMutable_1;
  }
  function switchToMutable($this) {
    var tmp;
    if ($this.backingMutable_1) {
      tmp = $this.backing_1;
    } else {
      $this.backingMutable_1 = true;
      $this.backing_1 = LinkedHashMap_init_$Create$_0($this.backing_1);
      tmp = $this.backing_1;
    }
    var tmp_0 = tmp;
    return isInterface(tmp_0, MutableMap) ? tmp_0 : THROW_CCE();
  }
  function DelegatingMap(initialValues, tag, consumer) {
    this.tag_1 = tag;
    this.consumer_1 = consumer;
    this.backing_1 = initialValues;
    this.backingMutable_1 = false;
  }
  DelegatingMap.prototype.get_size_woubt6_k$ = function () {
    return this.backing_1.get_size_woubt6_k$();
  };
  DelegatingMap.prototype.isEmpty_y1axqb_k$ = function () {
    return this.backing_1.isEmpty_y1axqb_k$();
  };
  DelegatingMap.prototype.containsKey_mw51tt_k$ = function (key) {
    return this.backing_1.containsKey_wgk31w_k$(key);
  };
  DelegatingMap.prototype.containsKey_wgk31w_k$ = function (key) {
    if (!(!(key == null) ? typeof key === 'string' : false))
      return false;
    return this.containsKey_mw51tt_k$((!(key == null) ? typeof key === 'string' : false) ? key : THROW_CCE());
  };
  DelegatingMap.prototype.containsValue_h0v3u7_k$ = function (value) {
    return this.backing_1.containsValue_5viga1_k$(value);
  };
  DelegatingMap.prototype.containsValue_5viga1_k$ = function (value) {
    if (!(!(value == null) ? typeof value === 'string' : false))
      return false;
    return this.containsValue_h0v3u7_k$((!(value == null) ? typeof value === 'string' : false) ? value : THROW_CCE());
  };
  DelegatingMap.prototype.get_4u8u51_k$ = function (key) {
    return this.backing_1.get_1mhr4y_k$(key);
  };
  DelegatingMap.prototype.get_1mhr4y_k$ = function (key) {
    if (!(!(key == null) ? typeof key === 'string' : false))
      return null;
    return this.get_4u8u51_k$((!(key == null) ? typeof key === 'string' : false) ? key : THROW_CCE());
  };
  DelegatingMap.prototype.put_6z04z7_k$ = function (key, value) {
    var mutable = switchToMutable(this);
    var old = mutable.put_3mhbri_k$(key, value);
    if (!(old === value)) {
      this.consumer_1().onTagAttributeChange_agii2c_k$(this.tag_1, key, value);
    }
    return old;
  };
  DelegatingMap.prototype.put_3mhbri_k$ = function (key, value) {
    var tmp = (!(key == null) ? typeof key === 'string' : false) ? key : THROW_CCE();
    return this.put_6z04z7_k$(tmp, (!(value == null) ? typeof value === 'string' : false) ? value : THROW_CCE());
  };
  DelegatingMap.prototype.remove_kj1003_k$ = function (key) {
    var mutable = switchToMutable(this);
    var tmp0_safe_receiver = mutable.remove_8hbkc0_k$(key);
    var tmp;
    if (tmp0_safe_receiver == null) {
      tmp = null;
    } else {
      var tmp$ret$1;
      {
        {
        }
        var tmp$ret$0;
        {
          this.consumer_1().onTagAttributeChange_agii2c_k$(this.tag_1, key, null);
          tmp$ret$0 = tmp0_safe_receiver;
        }
        tmp$ret$1 = tmp$ret$0;
      }
      tmp = tmp$ret$1;
    }
    return tmp;
  };
  DelegatingMap.prototype.remove_8hbkc0_k$ = function (key) {
    if (!(!(key == null) ? typeof key === 'string' : false))
      return null;
    return this.remove_kj1003_k$((!(key == null) ? typeof key === 'string' : false) ? key : THROW_CCE());
  };
  DelegatingMap.prototype.putAll_6pzwxk_k$ = function (from) {
    if (from.isEmpty_y1axqb_k$())
      return Unit_getInstance();
    var consumer = this.consumer_1();
    var mutable = switchToMutable(this);
    {
      var tmp0_forEach = from.get_entries_p20ztl_k$();
      var tmp0_iterator = tmp0_forEach.iterator_jk1svi_k$();
      while (tmp0_iterator.hasNext_bitz1p_k$()) {
        var element = tmp0_iterator.next_20eer_k$();
        {
          if (!(mutable.put_3mhbri_k$(element.get_key_18j28a_k$(), element.get_value_j01efc_k$()) === element.get_value_j01efc_k$())) {
            consumer.onTagAttributeChange_agii2c_k$(this.tag_1, element.get_key_18j28a_k$(), element.get_value_j01efc_k$());
          }
        }
      }
    }
  };
  DelegatingMap.prototype.putAll_mee1c3_k$ = function (from) {
    return this.putAll_6pzwxk_k$(from);
  };
  DelegatingMap.prototype.clear_j9y8zo_k$ = function () {
    {
      var tmp0_forEach = this.backing_1;
      var tmp$ret$0;
      {
        tmp$ret$0 = tmp0_forEach.get_entries_p20ztl_k$().iterator_jk1svi_k$();
      }
      var tmp0_iterator = tmp$ret$0;
      while (tmp0_iterator.hasNext_bitz1p_k$()) {
        var element = tmp0_iterator.next_20eer_k$();
        {
          this.consumer_1().onTagAttributeChange_agii2c_k$(this.tag_1, element.get_key_18j28a_k$(), null);
        }
      }
    }
    this.backing_1 = emptyMap();
    this.backingMutable_1 = false;
  };
  DelegatingMap.prototype.get_immutableEntries_iyyb1z_k$ = function () {
    return this.backing_1.get_entries_p20ztl_k$();
  };
  DelegatingMap.prototype.get_keys_wop4xp_k$ = function () {
    return switchToMutable(this).get_keys_wop4xp_k$();
  };
  DelegatingMap.prototype.get_values_ksazhn_k$ = function () {
    return switchToMutable(this).get_values_ksazhn_k$();
  };
  DelegatingMap.prototype.get_entries_p20ztl_k$ = function () {
    return switchToMutable(this).get_entries_p20ztl_k$();
  };
  DelegatingMap.$metadata$ = classMeta('DelegatingMap', [MutableMap]);
  function onFinalize(_this__u8e3s4, block) {
    return new FinalizeConsumer(_this__u8e3s4, onFinalize$lambda(block));
  }
  function _set_level__h8xxz5($this, _set____db54di) {
    $this.level_1 = _set____db54di;
  }
  function _get_level__es6iib($this) {
    return $this.level_1;
  }
  function FinalizeConsumer(downstream, block) {
    this.downstream_1 = downstream;
    this.block_1 = block;
    this.level_1 = 0;
  }
  FinalizeConsumer.prototype.get_downstream_gy5zxn_k$ = function () {
    return this.downstream_1;
  };
  FinalizeConsumer.prototype.get_block_ip8l7o_k$ = function () {
    return this.block_1;
  };
  FinalizeConsumer.prototype.onTagStart_jhb705_k$ = function (tag) {
    this.downstream_1.onTagStart_jhb705_k$(tag);
    var tmp0_this = this;
    var tmp1 = tmp0_this.level_1;
    tmp0_this.level_1 = tmp1 + 1 | 0;
  };
  FinalizeConsumer.prototype.onTagEnd_f3ehek_k$ = function (tag) {
    this.downstream_1.onTagEnd_f3ehek_k$(tag);
    var tmp0_this = this;
    var tmp1 = tmp0_this.level_1;
    tmp0_this.level_1 = tmp1 - 1 | 0;
  };
  FinalizeConsumer.prototype.onTagAttributeChange_agii2c_k$ = function (tag, attribute, value) {
    return this.downstream_1.onTagAttributeChange_agii2c_k$(tag, attribute, value);
  };
  FinalizeConsumer.prototype.onTagEvent_k2irjc_k$ = function (tag, event, value) {
    return this.downstream_1.onTagEvent_k2irjc_k$(tag, event, value);
  };
  FinalizeConsumer.prototype.onTagContent_8k5bde_k$ = function (content) {
    return this.downstream_1.onTagContent_8k5bde_k$(content);
  };
  FinalizeConsumer.prototype.onTagContentEntity_uzz4te_k$ = function (entity) {
    return this.downstream_1.onTagContentEntity_uzz4te_k$(entity);
  };
  FinalizeConsumer.prototype.onTagContentUnsafe_4xcoiz_k$ = function (block) {
    return this.downstream_1.onTagContentUnsafe_4xcoiz_k$(block);
  };
  FinalizeConsumer.prototype.onTagError_d07vof_k$ = function (tag, exception) {
    return this.downstream_1.onTagError_d07vof_k$(tag, exception);
  };
  FinalizeConsumer.prototype.onTagComment_dfi7y0_k$ = function (content) {
    return this.downstream_1.onTagComment_dfi7y0_k$(content);
  };
  FinalizeConsumer.prototype.finalize_b9lof6_k$ = function () {
    return this.block_1(this.downstream_1.finalize_b9lof6_k$(), this.level_1 > 0);
  };
  FinalizeConsumer.$metadata$ = classMeta('FinalizeConsumer', [TagConsumer]);
  function onFinalize$lambda($block) {
    return function (to, partial) {
      $block(to, partial);
      return to;
    };
  }
  function set_role(_this__u8e3s4, newValue) {
    get_attributeStringString().set_r65rse_k$(_this__u8e3s4, 'role', newValue);
  }
  function get_role(_this__u8e3s4) {
    return get_attributeStringString().get_kdqgs6_k$(_this__u8e3s4, 'role');
  }
  function set_style(_this__u8e3s4, newValue) {
    get_attributeStringString().set_r65rse_k$(_this__u8e3s4, 'style', newValue);
  }
  function get_style(_this__u8e3s4) {
    return get_attributeStringString().get_kdqgs6_k$(_this__u8e3s4, 'style');
  }
  function set_title(_this__u8e3s4, newValue) {
    get_attributeStringString().set_r65rse_k$(_this__u8e3s4, 'title', newValue);
  }
  function get_title(_this__u8e3s4) {
    return get_attributeStringString().get_kdqgs6_k$(_this__u8e3s4, 'title');
  }
  function CommonAttributeGroupFacade() {
  }
  CommonAttributeGroupFacade.$metadata$ = interfaceMeta('CommonAttributeGroupFacade', [Tag]);
  function get_attributeStringString() {
    init_properties_gen_attributes_kt_3p64g6();
    return attributeStringString;
  }
  var attributeStringString;
  function get_attributeSetStringStringSet() {
    init_properties_gen_attributes_kt_3p64g6();
    return attributeSetStringStringSet;
  }
  var attributeSetStringStringSet;
  function get_attributeBooleanBoolean() {
    init_properties_gen_attributes_kt_3p64g6();
    return attributeBooleanBoolean;
  }
  var attributeBooleanBoolean;
  function get_attributeBooleanBooleanOnOff() {
    init_properties_gen_attributes_kt_3p64g6();
    return attributeBooleanBooleanOnOff;
  }
  var attributeBooleanBooleanOnOff;
  function get_attributeBooleanTicker() {
    init_properties_gen_attributes_kt_3p64g6();
    return attributeBooleanTicker;
  }
  var attributeBooleanTicker;
  function get_attributeButtonFormEncTypeEnumButtonFormEncTypeValues() {
    init_properties_gen_attributes_kt_3p64g6();
    return attributeButtonFormEncTypeEnumButtonFormEncTypeValues;
  }
  var attributeButtonFormEncTypeEnumButtonFormEncTypeValues;
  function get_attributeButtonFormMethodEnumButtonFormMethodValues() {
    init_properties_gen_attributes_kt_3p64g6();
    return attributeButtonFormMethodEnumButtonFormMethodValues;
  }
  var attributeButtonFormMethodEnumButtonFormMethodValues;
  function get_attributeButtonTypeEnumButtonTypeValues() {
    init_properties_gen_attributes_kt_3p64g6();
    return attributeButtonTypeEnumButtonTypeValues;
  }
  var attributeButtonTypeEnumButtonTypeValues;
  function get_attributeCommandTypeEnumCommandTypeValues() {
    init_properties_gen_attributes_kt_3p64g6();
    return attributeCommandTypeEnumCommandTypeValues;
  }
  var attributeCommandTypeEnumCommandTypeValues;
  function get_attributeDirEnumDirValues() {
    init_properties_gen_attributes_kt_3p64g6();
    return attributeDirEnumDirValues;
  }
  var attributeDirEnumDirValues;
  function get_attributeDraggableEnumDraggableValues() {
    init_properties_gen_attributes_kt_3p64g6();
    return attributeDraggableEnumDraggableValues;
  }
  var attributeDraggableEnumDraggableValues;
  function get_attributeFormEncTypeEnumFormEncTypeValues() {
    init_properties_gen_attributes_kt_3p64g6();
    return attributeFormEncTypeEnumFormEncTypeValues;
  }
  var attributeFormEncTypeEnumFormEncTypeValues;
  function get_attributeFormMethodEnumFormMethodValues() {
    init_properties_gen_attributes_kt_3p64g6();
    return attributeFormMethodEnumFormMethodValues;
  }
  var attributeFormMethodEnumFormMethodValues;
  function get_attributeIframeSandboxEnumIframeSandboxValues() {
    init_properties_gen_attributes_kt_3p64g6();
    return attributeIframeSandboxEnumIframeSandboxValues;
  }
  var attributeIframeSandboxEnumIframeSandboxValues;
  function get_attributeInputFormEncTypeEnumInputFormEncTypeValues() {
    init_properties_gen_attributes_kt_3p64g6();
    return attributeInputFormEncTypeEnumInputFormEncTypeValues;
  }
  var attributeInputFormEncTypeEnumInputFormEncTypeValues;
  function get_attributeInputFormMethodEnumInputFormMethodValues() {
    init_properties_gen_attributes_kt_3p64g6();
    return attributeInputFormMethodEnumInputFormMethodValues;
  }
  var attributeInputFormMethodEnumInputFormMethodValues;
  function get_attributeInputTypeEnumInputTypeValues() {
    init_properties_gen_attributes_kt_3p64g6();
    return attributeInputTypeEnumInputTypeValues;
  }
  var attributeInputTypeEnumInputTypeValues;
  function get_attributeKeyGenKeyTypeEnumKeyGenKeyTypeValues() {
    init_properties_gen_attributes_kt_3p64g6();
    return attributeKeyGenKeyTypeEnumKeyGenKeyTypeValues;
  }
  var attributeKeyGenKeyTypeEnumKeyGenKeyTypeValues;
  function get_attributeRunAtEnumRunAtValues() {
    init_properties_gen_attributes_kt_3p64g6();
    return attributeRunAtEnumRunAtValues;
  }
  var attributeRunAtEnumRunAtValues;
  function get_attributeTextAreaWrapEnumTextAreaWrapValues() {
    init_properties_gen_attributes_kt_3p64g6();
    return attributeTextAreaWrapEnumTextAreaWrapValues;
  }
  var attributeTextAreaWrapEnumTextAreaWrapValues;
  function get_attributeThScopeEnumThScopeValues() {
    init_properties_gen_attributes_kt_3p64g6();
    return attributeThScopeEnumThScopeValues;
  }
  var attributeThScopeEnumThScopeValues;
  var properties_initialized_gen_attributes_kt_jgv7sa;
  function init_properties_gen_attributes_kt_3p64g6() {
    if (properties_initialized_gen_attributes_kt_jgv7sa) {
    } else {
      properties_initialized_gen_attributes_kt_jgv7sa = true;
      attributeStringString = new StringAttribute();
      attributeSetStringStringSet = new StringSetAttribute();
      attributeBooleanBoolean = BooleanAttribute_init_$Create$(null, null, 3, null);
      attributeBooleanBooleanOnOff = new BooleanAttribute('on', 'off');
      attributeBooleanTicker = new TickerAttribute();
      attributeButtonFormEncTypeEnumButtonFormEncTypeValues = new EnumAttribute(get_buttonFormEncTypeValues());
      attributeButtonFormMethodEnumButtonFormMethodValues = new EnumAttribute(get_buttonFormMethodValues());
      attributeButtonTypeEnumButtonTypeValues = new EnumAttribute(get_buttonTypeValues());
      attributeCommandTypeEnumCommandTypeValues = new EnumAttribute(get_commandTypeValues());
      attributeDirEnumDirValues = new EnumAttribute(get_dirValues());
      attributeDraggableEnumDraggableValues = new EnumAttribute(get_draggableValues());
      attributeFormEncTypeEnumFormEncTypeValues = new EnumAttribute(get_formEncTypeValues());
      attributeFormMethodEnumFormMethodValues = new EnumAttribute(get_formMethodValues());
      attributeIframeSandboxEnumIframeSandboxValues = new EnumAttribute(get_iframeSandboxValues());
      attributeInputFormEncTypeEnumInputFormEncTypeValues = new EnumAttribute(get_inputFormEncTypeValues());
      attributeInputFormMethodEnumInputFormMethodValues = new EnumAttribute(get_inputFormMethodValues());
      attributeInputTypeEnumInputTypeValues = new EnumAttribute(get_inputTypeValues());
      attributeKeyGenKeyTypeEnumKeyGenKeyTypeValues = new EnumAttribute(get_keyGenKeyTypeValues());
      attributeRunAtEnumRunAtValues = new EnumAttribute(get_runAtValues());
      attributeTextAreaWrapEnumTextAreaWrapValues = new EnumAttribute(get_textAreaWrapValues());
      attributeThScopeEnumThScopeValues = new EnumAttribute(get_thScopeValues());
    }
  }
  function div(_this__u8e3s4, classes, block) {
    var tmp$ret$1;
    {
      var tmp0_visitAndFinalize = new DIV(attributesMapOf_0('class', classes), _this__u8e3s4);
      var tmp$ret$0;
      {
        if (!(tmp0_visitAndFinalize.get_consumer_tu5133_k$() === _this__u8e3s4)) {
          throw IllegalArgumentException_init_$Create$('Wrong exception');
        }
        {
          tmp0_visitAndFinalize.get_consumer_tu5133_k$().onTagStart_jhb705_k$(tmp0_visitAndFinalize);
          try {
            {
              block(tmp0_visitAndFinalize);
            }
          } catch ($p) {
            if ($p instanceof Error) {
              tmp0_visitAndFinalize.get_consumer_tu5133_k$().onTagError_d07vof_k$(tmp0_visitAndFinalize, $p);
            } else {
              throw $p;
            }
          }
          finally {
            tmp0_visitAndFinalize.get_consumer_tu5133_k$().onTagEnd_f3ehek_k$(tmp0_visitAndFinalize);
          }
        }
        tmp$ret$0 = _this__u8e3s4.finalize_b9lof6_k$();
      }
      tmp$ret$1 = tmp$ret$0;
    }
    return tmp$ret$1;
  }
  function div$lambda() {
    return function ($this$null) {
      return Unit_getInstance();
    };
  }
  var Entities_nbsp_instance;
  var Entities_lt_instance;
  var Entities_gt_instance;
  var Entities_quot_instance;
  var Entities_amp_instance;
  var Entities_apos_instance;
  var Entities_iexcl_instance;
  var Entities_cent_instance;
  var Entities_pound_instance;
  var Entities_curren_instance;
  var Entities_yen_instance;
  var Entities_brvbar_instance;
  var Entities_sect_instance;
  var Entities_uml_instance;
  var Entities_copy_instance;
  var Entities_ordf_instance;
  var Entities_laquo_instance;
  var Entities_not_instance;
  var Entities_shy_instance;
  var Entities_reg_instance;
  var Entities_macr_instance;
  var Entities_deg_instance;
  var Entities_plusmn_instance;
  var Entities_sup2_instance;
  var Entities_sup3_instance;
  var Entities_acute_instance;
  var Entities_micro_instance;
  var Entities_para_instance;
  var Entities_middot_instance;
  var Entities_cedil_instance;
  var Entities_sup1_instance;
  var Entities_ordm_instance;
  var Entities_raquo_instance;
  var Entities_frac14_instance;
  var Entities_frac12_instance;
  var Entities_frac34_instance;
  var Entities_iquest_instance;
  var Entities_Agrave_instance;
  var Entities_Aacute_instance;
  var Entities_Acirc_instance;
  var Entities_Atilde_instance;
  var Entities_Auml_instance;
  var Entities_Aring_instance;
  var Entities_AElig_instance;
  var Entities_Ccedil_instance;
  var Entities_Egrave_instance;
  var Entities_Eacute_instance;
  var Entities_Ecirc_instance;
  var Entities_Euml_instance;
  var Entities_Igrave_instance;
  var Entities_Iacute_instance;
  var Entities_Icirc_instance;
  var Entities_Iuml_instance;
  var Entities_ETH_instance;
  var Entities_Ntilde_instance;
  var Entities_Ograve_instance;
  var Entities_Oacute_instance;
  var Entities_Ocirc_instance;
  var Entities_Otilde_instance;
  var Entities_Ouml_instance;
  var Entities_times_instance;
  var Entities_Oslash_instance;
  var Entities_Ugrave_instance;
  var Entities_Uacute_instance;
  var Entities_Ucirc_instance;
  var Entities_Uuml_instance;
  var Entities_Yacute_instance;
  var Entities_THORN_instance;
  var Entities_szlig_instance;
  var Entities_agrave_instance;
  var Entities_aacute_instance;
  var Entities_acirc_instance;
  var Entities_atilde_instance;
  var Entities_auml_instance;
  var Entities_aring_instance;
  var Entities_aelig_instance;
  var Entities_ccedil_instance;
  var Entities_egrave_instance;
  var Entities_eacute_instance;
  var Entities_ecirc_instance;
  var Entities_euml_instance;
  var Entities_igrave_instance;
  var Entities_iacute_instance;
  var Entities_icirc_instance;
  var Entities_iuml_instance;
  var Entities_eth_instance;
  var Entities_ntilde_instance;
  var Entities_ograve_instance;
  var Entities_oacute_instance;
  var Entities_ocirc_instance;
  var Entities_otilde_instance;
  var Entities_ouml_instance;
  var Entities_divide_instance;
  var Entities_oslash_instance;
  var Entities_ugrave_instance;
  var Entities_uacute_instance;
  var Entities_ucirc_instance;
  var Entities_uuml_instance;
  var Entities_yacute_instance;
  var Entities_thorn_instance;
  var Entities_yuml_instance;
  function values() {
    return [Entities_nbsp_getInstance(), Entities_lt_getInstance(), Entities_gt_getInstance(), Entities_quot_getInstance(), Entities_amp_getInstance(), Entities_apos_getInstance(), Entities_iexcl_getInstance(), Entities_cent_getInstance(), Entities_pound_getInstance(), Entities_curren_getInstance(), Entities_yen_getInstance(), Entities_brvbar_getInstance(), Entities_sect_getInstance(), Entities_uml_getInstance(), Entities_copy_getInstance(), Entities_ordf_getInstance(), Entities_laquo_getInstance(), Entities_not_getInstance(), Entities_shy_getInstance(), Entities_reg_getInstance(), Entities_macr_getInstance(), Entities_deg_getInstance(), Entities_plusmn_getInstance(), Entities_sup2_getInstance(), Entities_sup3_getInstance(), Entities_acute_getInstance(), Entities_micro_getInstance(), Entities_para_getInstance(), Entities_middot_getInstance(), Entities_cedil_getInstance(), Entities_sup1_getInstance(), Entities_ordm_getInstance(), Entities_raquo_getInstance(), Entities_frac14_getInstance(), Entities_frac12_getInstance(), Entities_frac34_getInstance(), Entities_iquest_getInstance(), Entities_Agrave_getInstance(), Entities_Aacute_getInstance(), Entities_Acirc_getInstance(), Entities_Atilde_getInstance(), Entities_Auml_getInstance(), Entities_Aring_getInstance(), Entities_AElig_getInstance(), Entities_Ccedil_getInstance(), Entities_Egrave_getInstance(), Entities_Eacute_getInstance(), Entities_Ecirc_getInstance(), Entities_Euml_getInstance(), Entities_Igrave_getInstance(), Entities_Iacute_getInstance(), Entities_Icirc_getInstance(), Entities_Iuml_getInstance(), Entities_ETH_getInstance(), Entities_Ntilde_getInstance(), Entities_Ograve_getInstance(), Entities_Oacute_getInstance(), Entities_Ocirc_getInstance(), Entities_Otilde_getInstance(), Entities_Ouml_getInstance(), Entities_times_getInstance(), Entities_Oslash_getInstance(), Entities_Ugrave_getInstance(), Entities_Uacute_getInstance(), Entities_Ucirc_getInstance(), Entities_Uuml_getInstance(), Entities_Yacute_getInstance(), Entities_THORN_getInstance(), Entities_szlig_getInstance(), Entities_agrave_getInstance(), Entities_aacute_getInstance(), Entities_acirc_getInstance(), Entities_atilde_getInstance(), Entities_auml_getInstance(), Entities_aring_getInstance(), Entities_aelig_getInstance(), Entities_ccedil_getInstance(), Entities_egrave_getInstance(), Entities_eacute_getInstance(), Entities_ecirc_getInstance(), Entities_euml_getInstance(), Entities_igrave_getInstance(), Entities_iacute_getInstance(), Entities_icirc_getInstance(), Entities_iuml_getInstance(), Entities_eth_getInstance(), Entities_ntilde_getInstance(), Entities_ograve_getInstance(), Entities_oacute_getInstance(), Entities_ocirc_getInstance(), Entities_otilde_getInstance(), Entities_ouml_getInstance(), Entities_divide_getInstance(), Entities_oslash_getInstance(), Entities_ugrave_getInstance(), Entities_uacute_getInstance(), Entities_ucirc_getInstance(), Entities_uuml_getInstance(), Entities_yacute_getInstance(), Entities_thorn_getInstance(), Entities_yuml_getInstance()];
  }
  function valueOf(value) {
    switch (value) {
      case 'nbsp':
        return Entities_nbsp_getInstance();
      case 'lt':
        return Entities_lt_getInstance();
      case 'gt':
        return Entities_gt_getInstance();
      case 'quot':
        return Entities_quot_getInstance();
      case 'amp':
        return Entities_amp_getInstance();
      case 'apos':
        return Entities_apos_getInstance();
      case 'iexcl':
        return Entities_iexcl_getInstance();
      case 'cent':
        return Entities_cent_getInstance();
      case 'pound':
        return Entities_pound_getInstance();
      case 'curren':
        return Entities_curren_getInstance();
      case 'yen':
        return Entities_yen_getInstance();
      case 'brvbar':
        return Entities_brvbar_getInstance();
      case 'sect':
        return Entities_sect_getInstance();
      case 'uml':
        return Entities_uml_getInstance();
      case 'copy':
        return Entities_copy_getInstance();
      case 'ordf':
        return Entities_ordf_getInstance();
      case 'laquo':
        return Entities_laquo_getInstance();
      case 'not':
        return Entities_not_getInstance();
      case 'shy':
        return Entities_shy_getInstance();
      case 'reg':
        return Entities_reg_getInstance();
      case 'macr':
        return Entities_macr_getInstance();
      case 'deg':
        return Entities_deg_getInstance();
      case 'plusmn':
        return Entities_plusmn_getInstance();
      case 'sup2':
        return Entities_sup2_getInstance();
      case 'sup3':
        return Entities_sup3_getInstance();
      case 'acute':
        return Entities_acute_getInstance();
      case 'micro':
        return Entities_micro_getInstance();
      case 'para':
        return Entities_para_getInstance();
      case 'middot':
        return Entities_middot_getInstance();
      case 'cedil':
        return Entities_cedil_getInstance();
      case 'sup1':
        return Entities_sup1_getInstance();
      case 'ordm':
        return Entities_ordm_getInstance();
      case 'raquo':
        return Entities_raquo_getInstance();
      case 'frac14':
        return Entities_frac14_getInstance();
      case 'frac12':
        return Entities_frac12_getInstance();
      case 'frac34':
        return Entities_frac34_getInstance();
      case 'iquest':
        return Entities_iquest_getInstance();
      case 'Agrave':
        return Entities_Agrave_getInstance();
      case 'Aacute':
        return Entities_Aacute_getInstance();
      case 'Acirc':
        return Entities_Acirc_getInstance();
      case 'Atilde':
        return Entities_Atilde_getInstance();
      case 'Auml':
        return Entities_Auml_getInstance();
      case 'Aring':
        return Entities_Aring_getInstance();
      case 'AElig':
        return Entities_AElig_getInstance();
      case 'Ccedil':
        return Entities_Ccedil_getInstance();
      case 'Egrave':
        return Entities_Egrave_getInstance();
      case 'Eacute':
        return Entities_Eacute_getInstance();
      case 'Ecirc':
        return Entities_Ecirc_getInstance();
      case 'Euml':
        return Entities_Euml_getInstance();
      case 'Igrave':
        return Entities_Igrave_getInstance();
      case 'Iacute':
        return Entities_Iacute_getInstance();
      case 'Icirc':
        return Entities_Icirc_getInstance();
      case 'Iuml':
        return Entities_Iuml_getInstance();
      case 'ETH':
        return Entities_ETH_getInstance();
      case 'Ntilde':
        return Entities_Ntilde_getInstance();
      case 'Ograve':
        return Entities_Ograve_getInstance();
      case 'Oacute':
        return Entities_Oacute_getInstance();
      case 'Ocirc':
        return Entities_Ocirc_getInstance();
      case 'Otilde':
        return Entities_Otilde_getInstance();
      case 'Ouml':
        return Entities_Ouml_getInstance();
      case 'times':
        return Entities_times_getInstance();
      case 'Oslash':
        return Entities_Oslash_getInstance();
      case 'Ugrave':
        return Entities_Ugrave_getInstance();
      case 'Uacute':
        return Entities_Uacute_getInstance();
      case 'Ucirc':
        return Entities_Ucirc_getInstance();
      case 'Uuml':
        return Entities_Uuml_getInstance();
      case 'Yacute':
        return Entities_Yacute_getInstance();
      case 'THORN':
        return Entities_THORN_getInstance();
      case 'szlig':
        return Entities_szlig_getInstance();
      case 'agrave':
        return Entities_agrave_getInstance();
      case 'aacute':
        return Entities_aacute_getInstance();
      case 'acirc':
        return Entities_acirc_getInstance();
      case 'atilde':
        return Entities_atilde_getInstance();
      case 'auml':
        return Entities_auml_getInstance();
      case 'aring':
        return Entities_aring_getInstance();
      case 'aelig':
        return Entities_aelig_getInstance();
      case 'ccedil':
        return Entities_ccedil_getInstance();
      case 'egrave':
        return Entities_egrave_getInstance();
      case 'eacute':
        return Entities_eacute_getInstance();
      case 'ecirc':
        return Entities_ecirc_getInstance();
      case 'euml':
        return Entities_euml_getInstance();
      case 'igrave':
        return Entities_igrave_getInstance();
      case 'iacute':
        return Entities_iacute_getInstance();
      case 'icirc':
        return Entities_icirc_getInstance();
      case 'iuml':
        return Entities_iuml_getInstance();
      case 'eth':
        return Entities_eth_getInstance();
      case 'ntilde':
        return Entities_ntilde_getInstance();
      case 'ograve':
        return Entities_ograve_getInstance();
      case 'oacute':
        return Entities_oacute_getInstance();
      case 'ocirc':
        return Entities_ocirc_getInstance();
      case 'otilde':
        return Entities_otilde_getInstance();
      case 'ouml':
        return Entities_ouml_getInstance();
      case 'divide':
        return Entities_divide_getInstance();
      case 'oslash':
        return Entities_oslash_getInstance();
      case 'ugrave':
        return Entities_ugrave_getInstance();
      case 'uacute':
        return Entities_uacute_getInstance();
      case 'ucirc':
        return Entities_ucirc_getInstance();
      case 'uuml':
        return Entities_uuml_getInstance();
      case 'yacute':
        return Entities_yacute_getInstance();
      case 'thorn':
        return Entities_thorn_getInstance();
      case 'yuml':
        return Entities_yuml_getInstance();
      default:
        Entities_initEntries();
        THROW_ISE();
        break;
    }
  }
  var Entities_entriesInitialized;
  function Entities_initEntries() {
    if (Entities_entriesInitialized)
      return Unit_getInstance();
    Entities_entriesInitialized = true;
    Entities_nbsp_instance = new Entities('nbsp', 0);
    Entities_lt_instance = new Entities('lt', 1);
    Entities_gt_instance = new Entities('gt', 2);
    Entities_quot_instance = new Entities('quot', 3);
    Entities_amp_instance = new Entities('amp', 4);
    Entities_apos_instance = new Entities('apos', 5);
    Entities_iexcl_instance = new Entities('iexcl', 6);
    Entities_cent_instance = new Entities('cent', 7);
    Entities_pound_instance = new Entities('pound', 8);
    Entities_curren_instance = new Entities('curren', 9);
    Entities_yen_instance = new Entities('yen', 10);
    Entities_brvbar_instance = new Entities('brvbar', 11);
    Entities_sect_instance = new Entities('sect', 12);
    Entities_uml_instance = new Entities('uml', 13);
    Entities_copy_instance = new Entities('copy', 14);
    Entities_ordf_instance = new Entities('ordf', 15);
    Entities_laquo_instance = new Entities('laquo', 16);
    Entities_not_instance = new Entities('not', 17);
    Entities_shy_instance = new Entities('shy', 18);
    Entities_reg_instance = new Entities('reg', 19);
    Entities_macr_instance = new Entities('macr', 20);
    Entities_deg_instance = new Entities('deg', 21);
    Entities_plusmn_instance = new Entities('plusmn', 22);
    Entities_sup2_instance = new Entities('sup2', 23);
    Entities_sup3_instance = new Entities('sup3', 24);
    Entities_acute_instance = new Entities('acute', 25);
    Entities_micro_instance = new Entities('micro', 26);
    Entities_para_instance = new Entities('para', 27);
    Entities_middot_instance = new Entities('middot', 28);
    Entities_cedil_instance = new Entities('cedil', 29);
    Entities_sup1_instance = new Entities('sup1', 30);
    Entities_ordm_instance = new Entities('ordm', 31);
    Entities_raquo_instance = new Entities('raquo', 32);
    Entities_frac14_instance = new Entities('frac14', 33);
    Entities_frac12_instance = new Entities('frac12', 34);
    Entities_frac34_instance = new Entities('frac34', 35);
    Entities_iquest_instance = new Entities('iquest', 36);
    Entities_Agrave_instance = new Entities('Agrave', 37);
    Entities_Aacute_instance = new Entities('Aacute', 38);
    Entities_Acirc_instance = new Entities('Acirc', 39);
    Entities_Atilde_instance = new Entities('Atilde', 40);
    Entities_Auml_instance = new Entities('Auml', 41);
    Entities_Aring_instance = new Entities('Aring', 42);
    Entities_AElig_instance = new Entities('AElig', 43);
    Entities_Ccedil_instance = new Entities('Ccedil', 44);
    Entities_Egrave_instance = new Entities('Egrave', 45);
    Entities_Eacute_instance = new Entities('Eacute', 46);
    Entities_Ecirc_instance = new Entities('Ecirc', 47);
    Entities_Euml_instance = new Entities('Euml', 48);
    Entities_Igrave_instance = new Entities('Igrave', 49);
    Entities_Iacute_instance = new Entities('Iacute', 50);
    Entities_Icirc_instance = new Entities('Icirc', 51);
    Entities_Iuml_instance = new Entities('Iuml', 52);
    Entities_ETH_instance = new Entities('ETH', 53);
    Entities_Ntilde_instance = new Entities('Ntilde', 54);
    Entities_Ograve_instance = new Entities('Ograve', 55);
    Entities_Oacute_instance = new Entities('Oacute', 56);
    Entities_Ocirc_instance = new Entities('Ocirc', 57);
    Entities_Otilde_instance = new Entities('Otilde', 58);
    Entities_Ouml_instance = new Entities('Ouml', 59);
    Entities_times_instance = new Entities('times', 60);
    Entities_Oslash_instance = new Entities('Oslash', 61);
    Entities_Ugrave_instance = new Entities('Ugrave', 62);
    Entities_Uacute_instance = new Entities('Uacute', 63);
    Entities_Ucirc_instance = new Entities('Ucirc', 64);
    Entities_Uuml_instance = new Entities('Uuml', 65);
    Entities_Yacute_instance = new Entities('Yacute', 66);
    Entities_THORN_instance = new Entities('THORN', 67);
    Entities_szlig_instance = new Entities('szlig', 68);
    Entities_agrave_instance = new Entities('agrave', 69);
    Entities_aacute_instance = new Entities('aacute', 70);
    Entities_acirc_instance = new Entities('acirc', 71);
    Entities_atilde_instance = new Entities('atilde', 72);
    Entities_auml_instance = new Entities('auml', 73);
    Entities_aring_instance = new Entities('aring', 74);
    Entities_aelig_instance = new Entities('aelig', 75);
    Entities_ccedil_instance = new Entities('ccedil', 76);
    Entities_egrave_instance = new Entities('egrave', 77);
    Entities_eacute_instance = new Entities('eacute', 78);
    Entities_ecirc_instance = new Entities('ecirc', 79);
    Entities_euml_instance = new Entities('euml', 80);
    Entities_igrave_instance = new Entities('igrave', 81);
    Entities_iacute_instance = new Entities('iacute', 82);
    Entities_icirc_instance = new Entities('icirc', 83);
    Entities_iuml_instance = new Entities('iuml', 84);
    Entities_eth_instance = new Entities('eth', 85);
    Entities_ntilde_instance = new Entities('ntilde', 86);
    Entities_ograve_instance = new Entities('ograve', 87);
    Entities_oacute_instance = new Entities('oacute', 88);
    Entities_ocirc_instance = new Entities('ocirc', 89);
    Entities_otilde_instance = new Entities('otilde', 90);
    Entities_ouml_instance = new Entities('ouml', 91);
    Entities_divide_instance = new Entities('divide', 92);
    Entities_oslash_instance = new Entities('oslash', 93);
    Entities_ugrave_instance = new Entities('ugrave', 94);
    Entities_uacute_instance = new Entities('uacute', 95);
    Entities_ucirc_instance = new Entities('ucirc', 96);
    Entities_uuml_instance = new Entities('uuml', 97);
    Entities_yacute_instance = new Entities('yacute', 98);
    Entities_thorn_instance = new Entities('thorn', 99);
    Entities_yuml_instance = new Entities('yuml', 100);
  }
  function Entities(name, ordinal) {
    Enum.call(this, name, ordinal);
  }
  Entities.prototype.get_text_wouvsm_k$ = function () {
    return '&' + this.toString() + ';';
  };
  Entities.$metadata$ = classMeta('Entities', undefined, undefined, undefined, undefined, Enum.prototype);
  function Entities_nbsp_getInstance() {
    Entities_initEntries();
    return Entities_nbsp_instance;
  }
  function Entities_lt_getInstance() {
    Entities_initEntries();
    return Entities_lt_instance;
  }
  function Entities_gt_getInstance() {
    Entities_initEntries();
    return Entities_gt_instance;
  }
  function Entities_quot_getInstance() {
    Entities_initEntries();
    return Entities_quot_instance;
  }
  function Entities_amp_getInstance() {
    Entities_initEntries();
    return Entities_amp_instance;
  }
  function Entities_apos_getInstance() {
    Entities_initEntries();
    return Entities_apos_instance;
  }
  function Entities_iexcl_getInstance() {
    Entities_initEntries();
    return Entities_iexcl_instance;
  }
  function Entities_cent_getInstance() {
    Entities_initEntries();
    return Entities_cent_instance;
  }
  function Entities_pound_getInstance() {
    Entities_initEntries();
    return Entities_pound_instance;
  }
  function Entities_curren_getInstance() {
    Entities_initEntries();
    return Entities_curren_instance;
  }
  function Entities_yen_getInstance() {
    Entities_initEntries();
    return Entities_yen_instance;
  }
  function Entities_brvbar_getInstance() {
    Entities_initEntries();
    return Entities_brvbar_instance;
  }
  function Entities_sect_getInstance() {
    Entities_initEntries();
    return Entities_sect_instance;
  }
  function Entities_uml_getInstance() {
    Entities_initEntries();
    return Entities_uml_instance;
  }
  function Entities_copy_getInstance() {
    Entities_initEntries();
    return Entities_copy_instance;
  }
  function Entities_ordf_getInstance() {
    Entities_initEntries();
    return Entities_ordf_instance;
  }
  function Entities_laquo_getInstance() {
    Entities_initEntries();
    return Entities_laquo_instance;
  }
  function Entities_not_getInstance() {
    Entities_initEntries();
    return Entities_not_instance;
  }
  function Entities_shy_getInstance() {
    Entities_initEntries();
    return Entities_shy_instance;
  }
  function Entities_reg_getInstance() {
    Entities_initEntries();
    return Entities_reg_instance;
  }
  function Entities_macr_getInstance() {
    Entities_initEntries();
    return Entities_macr_instance;
  }
  function Entities_deg_getInstance() {
    Entities_initEntries();
    return Entities_deg_instance;
  }
  function Entities_plusmn_getInstance() {
    Entities_initEntries();
    return Entities_plusmn_instance;
  }
  function Entities_sup2_getInstance() {
    Entities_initEntries();
    return Entities_sup2_instance;
  }
  function Entities_sup3_getInstance() {
    Entities_initEntries();
    return Entities_sup3_instance;
  }
  function Entities_acute_getInstance() {
    Entities_initEntries();
    return Entities_acute_instance;
  }
  function Entities_micro_getInstance() {
    Entities_initEntries();
    return Entities_micro_instance;
  }
  function Entities_para_getInstance() {
    Entities_initEntries();
    return Entities_para_instance;
  }
  function Entities_middot_getInstance() {
    Entities_initEntries();
    return Entities_middot_instance;
  }
  function Entities_cedil_getInstance() {
    Entities_initEntries();
    return Entities_cedil_instance;
  }
  function Entities_sup1_getInstance() {
    Entities_initEntries();
    return Entities_sup1_instance;
  }
  function Entities_ordm_getInstance() {
    Entities_initEntries();
    return Entities_ordm_instance;
  }
  function Entities_raquo_getInstance() {
    Entities_initEntries();
    return Entities_raquo_instance;
  }
  function Entities_frac14_getInstance() {
    Entities_initEntries();
    return Entities_frac14_instance;
  }
  function Entities_frac12_getInstance() {
    Entities_initEntries();
    return Entities_frac12_instance;
  }
  function Entities_frac34_getInstance() {
    Entities_initEntries();
    return Entities_frac34_instance;
  }
  function Entities_iquest_getInstance() {
    Entities_initEntries();
    return Entities_iquest_instance;
  }
  function Entities_Agrave_getInstance() {
    Entities_initEntries();
    return Entities_Agrave_instance;
  }
  function Entities_Aacute_getInstance() {
    Entities_initEntries();
    return Entities_Aacute_instance;
  }
  function Entities_Acirc_getInstance() {
    Entities_initEntries();
    return Entities_Acirc_instance;
  }
  function Entities_Atilde_getInstance() {
    Entities_initEntries();
    return Entities_Atilde_instance;
  }
  function Entities_Auml_getInstance() {
    Entities_initEntries();
    return Entities_Auml_instance;
  }
  function Entities_Aring_getInstance() {
    Entities_initEntries();
    return Entities_Aring_instance;
  }
  function Entities_AElig_getInstance() {
    Entities_initEntries();
    return Entities_AElig_instance;
  }
  function Entities_Ccedil_getInstance() {
    Entities_initEntries();
    return Entities_Ccedil_instance;
  }
  function Entities_Egrave_getInstance() {
    Entities_initEntries();
    return Entities_Egrave_instance;
  }
  function Entities_Eacute_getInstance() {
    Entities_initEntries();
    return Entities_Eacute_instance;
  }
  function Entities_Ecirc_getInstance() {
    Entities_initEntries();
    return Entities_Ecirc_instance;
  }
  function Entities_Euml_getInstance() {
    Entities_initEntries();
    return Entities_Euml_instance;
  }
  function Entities_Igrave_getInstance() {
    Entities_initEntries();
    return Entities_Igrave_instance;
  }
  function Entities_Iacute_getInstance() {
    Entities_initEntries();
    return Entities_Iacute_instance;
  }
  function Entities_Icirc_getInstance() {
    Entities_initEntries();
    return Entities_Icirc_instance;
  }
  function Entities_Iuml_getInstance() {
    Entities_initEntries();
    return Entities_Iuml_instance;
  }
  function Entities_ETH_getInstance() {
    Entities_initEntries();
    return Entities_ETH_instance;
  }
  function Entities_Ntilde_getInstance() {
    Entities_initEntries();
    return Entities_Ntilde_instance;
  }
  function Entities_Ograve_getInstance() {
    Entities_initEntries();
    return Entities_Ograve_instance;
  }
  function Entities_Oacute_getInstance() {
    Entities_initEntries();
    return Entities_Oacute_instance;
  }
  function Entities_Ocirc_getInstance() {
    Entities_initEntries();
    return Entities_Ocirc_instance;
  }
  function Entities_Otilde_getInstance() {
    Entities_initEntries();
    return Entities_Otilde_instance;
  }
  function Entities_Ouml_getInstance() {
    Entities_initEntries();
    return Entities_Ouml_instance;
  }
  function Entities_times_getInstance() {
    Entities_initEntries();
    return Entities_times_instance;
  }
  function Entities_Oslash_getInstance() {
    Entities_initEntries();
    return Entities_Oslash_instance;
  }
  function Entities_Ugrave_getInstance() {
    Entities_initEntries();
    return Entities_Ugrave_instance;
  }
  function Entities_Uacute_getInstance() {
    Entities_initEntries();
    return Entities_Uacute_instance;
  }
  function Entities_Ucirc_getInstance() {
    Entities_initEntries();
    return Entities_Ucirc_instance;
  }
  function Entities_Uuml_getInstance() {
    Entities_initEntries();
    return Entities_Uuml_instance;
  }
  function Entities_Yacute_getInstance() {
    Entities_initEntries();
    return Entities_Yacute_instance;
  }
  function Entities_THORN_getInstance() {
    Entities_initEntries();
    return Entities_THORN_instance;
  }
  function Entities_szlig_getInstance() {
    Entities_initEntries();
    return Entities_szlig_instance;
  }
  function Entities_agrave_getInstance() {
    Entities_initEntries();
    return Entities_agrave_instance;
  }
  function Entities_aacute_getInstance() {
    Entities_initEntries();
    return Entities_aacute_instance;
  }
  function Entities_acirc_getInstance() {
    Entities_initEntries();
    return Entities_acirc_instance;
  }
  function Entities_atilde_getInstance() {
    Entities_initEntries();
    return Entities_atilde_instance;
  }
  function Entities_auml_getInstance() {
    Entities_initEntries();
    return Entities_auml_instance;
  }
  function Entities_aring_getInstance() {
    Entities_initEntries();
    return Entities_aring_instance;
  }
  function Entities_aelig_getInstance() {
    Entities_initEntries();
    return Entities_aelig_instance;
  }
  function Entities_ccedil_getInstance() {
    Entities_initEntries();
    return Entities_ccedil_instance;
  }
  function Entities_egrave_getInstance() {
    Entities_initEntries();
    return Entities_egrave_instance;
  }
  function Entities_eacute_getInstance() {
    Entities_initEntries();
    return Entities_eacute_instance;
  }
  function Entities_ecirc_getInstance() {
    Entities_initEntries();
    return Entities_ecirc_instance;
  }
  function Entities_euml_getInstance() {
    Entities_initEntries();
    return Entities_euml_instance;
  }
  function Entities_igrave_getInstance() {
    Entities_initEntries();
    return Entities_igrave_instance;
  }
  function Entities_iacute_getInstance() {
    Entities_initEntries();
    return Entities_iacute_instance;
  }
  function Entities_icirc_getInstance() {
    Entities_initEntries();
    return Entities_icirc_instance;
  }
  function Entities_iuml_getInstance() {
    Entities_initEntries();
    return Entities_iuml_instance;
  }
  function Entities_eth_getInstance() {
    Entities_initEntries();
    return Entities_eth_instance;
  }
  function Entities_ntilde_getInstance() {
    Entities_initEntries();
    return Entities_ntilde_instance;
  }
  function Entities_ograve_getInstance() {
    Entities_initEntries();
    return Entities_ograve_instance;
  }
  function Entities_oacute_getInstance() {
    Entities_initEntries();
    return Entities_oacute_instance;
  }
  function Entities_ocirc_getInstance() {
    Entities_initEntries();
    return Entities_ocirc_instance;
  }
  function Entities_otilde_getInstance() {
    Entities_initEntries();
    return Entities_otilde_instance;
  }
  function Entities_ouml_getInstance() {
    Entities_initEntries();
    return Entities_ouml_instance;
  }
  function Entities_divide_getInstance() {
    Entities_initEntries();
    return Entities_divide_instance;
  }
  function Entities_oslash_getInstance() {
    Entities_initEntries();
    return Entities_oslash_instance;
  }
  function Entities_ugrave_getInstance() {
    Entities_initEntries();
    return Entities_ugrave_instance;
  }
  function Entities_uacute_getInstance() {
    Entities_initEntries();
    return Entities_uacute_instance;
  }
  function Entities_ucirc_getInstance() {
    Entities_initEntries();
    return Entities_ucirc_instance;
  }
  function Entities_uuml_getInstance() {
    Entities_initEntries();
    return Entities_uuml_instance;
  }
  function Entities_yacute_getInstance() {
    Entities_initEntries();
    return Entities_yacute_instance;
  }
  function Entities_thorn_getInstance() {
    Entities_initEntries();
    return Entities_thorn_instance;
  }
  function Entities_yuml_getInstance() {
    Entities_initEntries();
    return Entities_yuml_instance;
  }
  function get_dirValues() {
    init_properties_gen_enums_kt_tifmld();
    return dirValues;
  }
  var dirValues;
  function get_draggableValues() {
    init_properties_gen_enums_kt_tifmld();
    return draggableValues;
  }
  var draggableValues;
  function get_runAtValues() {
    init_properties_gen_enums_kt_tifmld();
    return runAtValues;
  }
  var runAtValues;
  function get_areaShapeValues() {
    init_properties_gen_enums_kt_tifmld();
    return areaShapeValues;
  }
  var areaShapeValues;
  function get_buttonFormEncTypeValues() {
    init_properties_gen_enums_kt_tifmld();
    return buttonFormEncTypeValues;
  }
  var buttonFormEncTypeValues;
  function get_buttonFormMethodValues() {
    init_properties_gen_enums_kt_tifmld();
    return buttonFormMethodValues;
  }
  var buttonFormMethodValues;
  function get_buttonTypeValues() {
    init_properties_gen_enums_kt_tifmld();
    return buttonTypeValues;
  }
  var buttonTypeValues;
  function get_commandTypeValues() {
    init_properties_gen_enums_kt_tifmld();
    return commandTypeValues;
  }
  var commandTypeValues;
  function get_formEncTypeValues() {
    init_properties_gen_enums_kt_tifmld();
    return formEncTypeValues;
  }
  var formEncTypeValues;
  function get_formMethodValues() {
    init_properties_gen_enums_kt_tifmld();
    return formMethodValues;
  }
  var formMethodValues;
  function get_iframeSandboxValues() {
    init_properties_gen_enums_kt_tifmld();
    return iframeSandboxValues;
  }
  var iframeSandboxValues;
  function get_inputTypeValues() {
    init_properties_gen_enums_kt_tifmld();
    return inputTypeValues;
  }
  var inputTypeValues;
  function get_inputFormEncTypeValues() {
    init_properties_gen_enums_kt_tifmld();
    return inputFormEncTypeValues;
  }
  var inputFormEncTypeValues;
  function get_inputFormMethodValues() {
    init_properties_gen_enums_kt_tifmld();
    return inputFormMethodValues;
  }
  var inputFormMethodValues;
  function get_keyGenKeyTypeValues() {
    init_properties_gen_enums_kt_tifmld();
    return keyGenKeyTypeValues;
  }
  var keyGenKeyTypeValues;
  function get_textAreaWrapValues() {
    init_properties_gen_enums_kt_tifmld();
    return textAreaWrapValues;
  }
  var textAreaWrapValues;
  function get_thScopeValues() {
    init_properties_gen_enums_kt_tifmld();
    return thScopeValues;
  }
  var thScopeValues;
  var ButtonFormEncType_multipartFormData_instance;
  var ButtonFormEncType_applicationXWwwFormUrlEncoded_instance;
  var ButtonFormEncType_textPlain_instance;
  function values_0() {
    return [ButtonFormEncType_multipartFormData_getInstance(), ButtonFormEncType_applicationXWwwFormUrlEncoded_getInstance(), ButtonFormEncType_textPlain_getInstance()];
  }
  function valueOf_0(value) {
    switch (value) {
      case 'multipartFormData':
        return ButtonFormEncType_multipartFormData_getInstance();
      case 'applicationXWwwFormUrlEncoded':
        return ButtonFormEncType_applicationXWwwFormUrlEncoded_getInstance();
      case 'textPlain':
        return ButtonFormEncType_textPlain_getInstance();
      default:
        ButtonFormEncType_initEntries();
        THROW_ISE();
        break;
    }
  }
  var ButtonFormEncType_entriesInitialized;
  function ButtonFormEncType_initEntries() {
    if (ButtonFormEncType_entriesInitialized)
      return Unit_getInstance();
    ButtonFormEncType_entriesInitialized = true;
    ButtonFormEncType_multipartFormData_instance = new ButtonFormEncType('multipartFormData', 0, 'multipart/form-data');
    ButtonFormEncType_applicationXWwwFormUrlEncoded_instance = new ButtonFormEncType('applicationXWwwFormUrlEncoded', 1, 'application/x-www-form-urlencoded');
    ButtonFormEncType_textPlain_instance = new ButtonFormEncType('textPlain', 2, 'text/plain');
  }
  function ButtonFormEncType(name, ordinal, realValue) {
    Enum.call(this, name, ordinal);
    this.realValue_1 = realValue;
  }
  ButtonFormEncType.prototype.get_realValue_69bbcm_k$ = function () {
    return this.realValue_1;
  };
  ButtonFormEncType.$metadata$ = classMeta('ButtonFormEncType', [AttributeEnum], undefined, undefined, undefined, Enum.prototype);
  var ButtonFormMethod_get_instance;
  var ButtonFormMethod_post_instance;
  var ButtonFormMethod_put_instance;
  var ButtonFormMethod_delete_instance;
  var ButtonFormMethod_patch_instance;
  function values_1() {
    return [ButtonFormMethod_get_getInstance(), ButtonFormMethod_post_getInstance(), ButtonFormMethod_put_getInstance(), ButtonFormMethod_delete_getInstance(), ButtonFormMethod_patch_getInstance()];
  }
  function valueOf_1(value) {
    switch (value) {
      case 'get':
        return ButtonFormMethod_get_getInstance();
      case 'post':
        return ButtonFormMethod_post_getInstance();
      case 'put':
        return ButtonFormMethod_put_getInstance();
      case 'delete':
        return ButtonFormMethod_delete_getInstance();
      case 'patch':
        return ButtonFormMethod_patch_getInstance();
      default:
        ButtonFormMethod_initEntries();
        THROW_ISE();
        break;
    }
  }
  var ButtonFormMethod_entriesInitialized;
  function ButtonFormMethod_initEntries() {
    if (ButtonFormMethod_entriesInitialized)
      return Unit_getInstance();
    ButtonFormMethod_entriesInitialized = true;
    ButtonFormMethod_get_instance = new ButtonFormMethod('get', 0, 'get');
    ButtonFormMethod_post_instance = new ButtonFormMethod('post', 1, 'post');
    ButtonFormMethod_put_instance = new ButtonFormMethod('put', 2, 'put');
    ButtonFormMethod_delete_instance = new ButtonFormMethod('delete', 3, 'delete');
    ButtonFormMethod_patch_instance = new ButtonFormMethod('patch', 4, 'patch');
  }
  function ButtonFormMethod(name, ordinal, realValue) {
    Enum.call(this, name, ordinal);
    this.realValue_1 = realValue;
  }
  ButtonFormMethod.prototype.get_realValue_69bbcm_k$ = function () {
    return this.realValue_1;
  };
  ButtonFormMethod.$metadata$ = classMeta('ButtonFormMethod', [AttributeEnum], undefined, undefined, undefined, Enum.prototype);
  var ButtonType_button_instance;
  var ButtonType_reset_instance;
  var ButtonType_submit_instance;
  function values_2() {
    return [ButtonType_button_getInstance(), ButtonType_reset_getInstance(), ButtonType_submit_getInstance()];
  }
  function valueOf_2(value) {
    switch (value) {
      case 'button':
        return ButtonType_button_getInstance();
      case 'reset':
        return ButtonType_reset_getInstance();
      case 'submit':
        return ButtonType_submit_getInstance();
      default:
        ButtonType_initEntries();
        THROW_ISE();
        break;
    }
  }
  var ButtonType_entriesInitialized;
  function ButtonType_initEntries() {
    if (ButtonType_entriesInitialized)
      return Unit_getInstance();
    ButtonType_entriesInitialized = true;
    ButtonType_button_instance = new ButtonType('button', 0, 'button');
    ButtonType_reset_instance = new ButtonType('reset', 1, 'reset');
    ButtonType_submit_instance = new ButtonType('submit', 2, 'submit');
  }
  function ButtonType(name, ordinal, realValue) {
    Enum.call(this, name, ordinal);
    this.realValue_1 = realValue;
  }
  ButtonType.prototype.get_realValue_69bbcm_k$ = function () {
    return this.realValue_1;
  };
  ButtonType.$metadata$ = classMeta('ButtonType', [AttributeEnum], undefined, undefined, undefined, Enum.prototype);
  var CommandType_command_instance;
  var CommandType_checkBox_instance;
  var CommandType_radio_instance;
  function values_3() {
    return [CommandType_command_getInstance(), CommandType_checkBox_getInstance(), CommandType_radio_getInstance()];
  }
  function valueOf_3(value) {
    switch (value) {
      case 'command':
        return CommandType_command_getInstance();
      case 'checkBox':
        return CommandType_checkBox_getInstance();
      case 'radio':
        return CommandType_radio_getInstance();
      default:
        CommandType_initEntries();
        THROW_ISE();
        break;
    }
  }
  var CommandType_entriesInitialized;
  function CommandType_initEntries() {
    if (CommandType_entriesInitialized)
      return Unit_getInstance();
    CommandType_entriesInitialized = true;
    CommandType_command_instance = new CommandType('command', 0, 'command');
    CommandType_checkBox_instance = new CommandType('checkBox', 1, 'checkbox');
    CommandType_radio_instance = new CommandType('radio', 2, 'radio');
  }
  function CommandType(name, ordinal, realValue) {
    Enum.call(this, name, ordinal);
    this.realValue_1 = realValue;
  }
  CommandType.prototype.get_realValue_69bbcm_k$ = function () {
    return this.realValue_1;
  };
  CommandType.$metadata$ = classMeta('CommandType', [AttributeEnum], undefined, undefined, undefined, Enum.prototype);
  var Dir_ltr_instance;
  var Dir_rtl_instance;
  function values_4() {
    return [Dir_ltr_getInstance(), Dir_rtl_getInstance()];
  }
  function valueOf_4(value) {
    switch (value) {
      case 'ltr':
        return Dir_ltr_getInstance();
      case 'rtl':
        return Dir_rtl_getInstance();
      default:
        Dir_initEntries();
        THROW_ISE();
        break;
    }
  }
  var Dir_entriesInitialized;
  function Dir_initEntries() {
    if (Dir_entriesInitialized)
      return Unit_getInstance();
    Dir_entriesInitialized = true;
    Dir_ltr_instance = new Dir('ltr', 0, 'ltr');
    Dir_rtl_instance = new Dir('rtl', 1, 'rtl');
  }
  function Dir(name, ordinal, realValue) {
    Enum.call(this, name, ordinal);
    this.realValue_1 = realValue;
  }
  Dir.prototype.get_realValue_69bbcm_k$ = function () {
    return this.realValue_1;
  };
  Dir.$metadata$ = classMeta('Dir', [AttributeEnum], undefined, undefined, undefined, Enum.prototype);
  var Draggable_htmlTrue_instance;
  var Draggable_htmlFalse_instance;
  var Draggable_auto_instance;
  function values_5() {
    return [Draggable_htmlTrue_getInstance(), Draggable_htmlFalse_getInstance(), Draggable_auto_getInstance()];
  }
  function valueOf_5(value) {
    switch (value) {
      case 'htmlTrue':
        return Draggable_htmlTrue_getInstance();
      case 'htmlFalse':
        return Draggable_htmlFalse_getInstance();
      case 'auto':
        return Draggable_auto_getInstance();
      default:
        Draggable_initEntries();
        THROW_ISE();
        break;
    }
  }
  var Draggable_entriesInitialized;
  function Draggable_initEntries() {
    if (Draggable_entriesInitialized)
      return Unit_getInstance();
    Draggable_entriesInitialized = true;
    Draggable_htmlTrue_instance = new Draggable('htmlTrue', 0, 'true');
    Draggable_htmlFalse_instance = new Draggable('htmlFalse', 1, 'false');
    Draggable_auto_instance = new Draggable('auto', 2, 'auto');
  }
  function Draggable(name, ordinal, realValue) {
    Enum.call(this, name, ordinal);
    this.realValue_1 = realValue;
  }
  Draggable.prototype.get_realValue_69bbcm_k$ = function () {
    return this.realValue_1;
  };
  Draggable.$metadata$ = classMeta('Draggable', [AttributeEnum], undefined, undefined, undefined, Enum.prototype);
  var FormEncType_multipartFormData_instance;
  var FormEncType_applicationXWwwFormUrlEncoded_instance;
  var FormEncType_textPlain_instance;
  function values_6() {
    return [FormEncType_multipartFormData_getInstance(), FormEncType_applicationXWwwFormUrlEncoded_getInstance(), FormEncType_textPlain_getInstance()];
  }
  function valueOf_6(value) {
    switch (value) {
      case 'multipartFormData':
        return FormEncType_multipartFormData_getInstance();
      case 'applicationXWwwFormUrlEncoded':
        return FormEncType_applicationXWwwFormUrlEncoded_getInstance();
      case 'textPlain':
        return FormEncType_textPlain_getInstance();
      default:
        FormEncType_initEntries();
        THROW_ISE();
        break;
    }
  }
  var FormEncType_entriesInitialized;
  function FormEncType_initEntries() {
    if (FormEncType_entriesInitialized)
      return Unit_getInstance();
    FormEncType_entriesInitialized = true;
    FormEncType_multipartFormData_instance = new FormEncType('multipartFormData', 0, 'multipart/form-data');
    FormEncType_applicationXWwwFormUrlEncoded_instance = new FormEncType('applicationXWwwFormUrlEncoded', 1, 'application/x-www-form-urlencoded');
    FormEncType_textPlain_instance = new FormEncType('textPlain', 2, 'text/plain');
  }
  function FormEncType(name, ordinal, realValue) {
    Enum.call(this, name, ordinal);
    this.realValue_1 = realValue;
  }
  FormEncType.prototype.get_realValue_69bbcm_k$ = function () {
    return this.realValue_1;
  };
  FormEncType.$metadata$ = classMeta('FormEncType', [AttributeEnum], undefined, undefined, undefined, Enum.prototype);
  var FormMethod_get_instance;
  var FormMethod_post_instance;
  var FormMethod_put_instance;
  var FormMethod_delete_instance;
  var FormMethod_patch_instance;
  function values_7() {
    return [FormMethod_get_getInstance(), FormMethod_post_getInstance(), FormMethod_put_getInstance(), FormMethod_delete_getInstance(), FormMethod_patch_getInstance()];
  }
  function valueOf_7(value) {
    switch (value) {
      case 'get':
        return FormMethod_get_getInstance();
      case 'post':
        return FormMethod_post_getInstance();
      case 'put':
        return FormMethod_put_getInstance();
      case 'delete':
        return FormMethod_delete_getInstance();
      case 'patch':
        return FormMethod_patch_getInstance();
      default:
        FormMethod_initEntries();
        THROW_ISE();
        break;
    }
  }
  var FormMethod_entriesInitialized;
  function FormMethod_initEntries() {
    if (FormMethod_entriesInitialized)
      return Unit_getInstance();
    FormMethod_entriesInitialized = true;
    FormMethod_get_instance = new FormMethod('get', 0, 'get');
    FormMethod_post_instance = new FormMethod('post', 1, 'post');
    FormMethod_put_instance = new FormMethod('put', 2, 'put');
    FormMethod_delete_instance = new FormMethod('delete', 3, 'delete');
    FormMethod_patch_instance = new FormMethod('patch', 4, 'patch');
  }
  function FormMethod(name, ordinal, realValue) {
    Enum.call(this, name, ordinal);
    this.realValue_1 = realValue;
  }
  FormMethod.prototype.get_realValue_69bbcm_k$ = function () {
    return this.realValue_1;
  };
  FormMethod.$metadata$ = classMeta('FormMethod', [AttributeEnum], undefined, undefined, undefined, Enum.prototype);
  var IframeSandbox_allowSameOrigin_instance;
  var IframeSandbox_allowFormS_instance;
  var IframeSandbox_allowScripts_instance;
  function values_8() {
    return [IframeSandbox_allowSameOrigin_getInstance(), IframeSandbox_allowFormS_getInstance(), IframeSandbox_allowScripts_getInstance()];
  }
  function valueOf_8(value) {
    switch (value) {
      case 'allowSameOrigin':
        return IframeSandbox_allowSameOrigin_getInstance();
      case 'allowFormS':
        return IframeSandbox_allowFormS_getInstance();
      case 'allowScripts':
        return IframeSandbox_allowScripts_getInstance();
      default:
        IframeSandbox_initEntries();
        THROW_ISE();
        break;
    }
  }
  var IframeSandbox_entriesInitialized;
  function IframeSandbox_initEntries() {
    if (IframeSandbox_entriesInitialized)
      return Unit_getInstance();
    IframeSandbox_entriesInitialized = true;
    IframeSandbox_allowSameOrigin_instance = new IframeSandbox('allowSameOrigin', 0, 'allow-same-origin');
    IframeSandbox_allowFormS_instance = new IframeSandbox('allowFormS', 1, 'allow-forms');
    IframeSandbox_allowScripts_instance = new IframeSandbox('allowScripts', 2, 'allow-scripts');
  }
  function IframeSandbox(name, ordinal, realValue) {
    Enum.call(this, name, ordinal);
    this.realValue_1 = realValue;
  }
  IframeSandbox.prototype.get_realValue_69bbcm_k$ = function () {
    return this.realValue_1;
  };
  IframeSandbox.$metadata$ = classMeta('IframeSandbox', [AttributeEnum], undefined, undefined, undefined, Enum.prototype);
  var InputFormEncType_multipartFormData_instance;
  var InputFormEncType_applicationXWwwFormUrlEncoded_instance;
  var InputFormEncType_textPlain_instance;
  function values_9() {
    return [InputFormEncType_multipartFormData_getInstance(), InputFormEncType_applicationXWwwFormUrlEncoded_getInstance(), InputFormEncType_textPlain_getInstance()];
  }
  function valueOf_9(value) {
    switch (value) {
      case 'multipartFormData':
        return InputFormEncType_multipartFormData_getInstance();
      case 'applicationXWwwFormUrlEncoded':
        return InputFormEncType_applicationXWwwFormUrlEncoded_getInstance();
      case 'textPlain':
        return InputFormEncType_textPlain_getInstance();
      default:
        InputFormEncType_initEntries();
        THROW_ISE();
        break;
    }
  }
  var InputFormEncType_entriesInitialized;
  function InputFormEncType_initEntries() {
    if (InputFormEncType_entriesInitialized)
      return Unit_getInstance();
    InputFormEncType_entriesInitialized = true;
    InputFormEncType_multipartFormData_instance = new InputFormEncType('multipartFormData', 0, 'multipart/form-data');
    InputFormEncType_applicationXWwwFormUrlEncoded_instance = new InputFormEncType('applicationXWwwFormUrlEncoded', 1, 'application/x-www-form-urlencoded');
    InputFormEncType_textPlain_instance = new InputFormEncType('textPlain', 2, 'text/plain');
  }
  function InputFormEncType(name, ordinal, realValue) {
    Enum.call(this, name, ordinal);
    this.realValue_1 = realValue;
  }
  InputFormEncType.prototype.get_realValue_69bbcm_k$ = function () {
    return this.realValue_1;
  };
  InputFormEncType.$metadata$ = classMeta('InputFormEncType', [AttributeEnum], undefined, undefined, undefined, Enum.prototype);
  var InputFormMethod_get_instance;
  var InputFormMethod_post_instance;
  var InputFormMethod_put_instance;
  var InputFormMethod_delete_instance;
  var InputFormMethod_patch_instance;
  function values_10() {
    return [InputFormMethod_get_getInstance(), InputFormMethod_post_getInstance(), InputFormMethod_put_getInstance(), InputFormMethod_delete_getInstance(), InputFormMethod_patch_getInstance()];
  }
  function valueOf_10(value) {
    switch (value) {
      case 'get':
        return InputFormMethod_get_getInstance();
      case 'post':
        return InputFormMethod_post_getInstance();
      case 'put':
        return InputFormMethod_put_getInstance();
      case 'delete':
        return InputFormMethod_delete_getInstance();
      case 'patch':
        return InputFormMethod_patch_getInstance();
      default:
        InputFormMethod_initEntries();
        THROW_ISE();
        break;
    }
  }
  var InputFormMethod_entriesInitialized;
  function InputFormMethod_initEntries() {
    if (InputFormMethod_entriesInitialized)
      return Unit_getInstance();
    InputFormMethod_entriesInitialized = true;
    InputFormMethod_get_instance = new InputFormMethod('get', 0, 'get');
    InputFormMethod_post_instance = new InputFormMethod('post', 1, 'post');
    InputFormMethod_put_instance = new InputFormMethod('put', 2, 'put');
    InputFormMethod_delete_instance = new InputFormMethod('delete', 3, 'delete');
    InputFormMethod_patch_instance = new InputFormMethod('patch', 4, 'patch');
  }
  function InputFormMethod(name, ordinal, realValue) {
    Enum.call(this, name, ordinal);
    this.realValue_1 = realValue;
  }
  InputFormMethod.prototype.get_realValue_69bbcm_k$ = function () {
    return this.realValue_1;
  };
  InputFormMethod.$metadata$ = classMeta('InputFormMethod', [AttributeEnum], undefined, undefined, undefined, Enum.prototype);
  var InputType_button_instance;
  var InputType_checkBox_instance;
  var InputType_color_instance;
  var InputType_date_instance;
  var InputType_dateTime_instance;
  var InputType_dateTimeLocal_instance;
  var InputType_email_instance;
  var InputType_file_instance;
  var InputType_hidden_instance;
  var InputType_image_instance;
  var InputType_month_instance;
  var InputType_number_instance;
  var InputType_password_instance;
  var InputType_radio_instance;
  var InputType_range_instance;
  var InputType_reset_instance;
  var InputType_search_instance;
  var InputType_submit_instance;
  var InputType_text_instance;
  var InputType_tel_instance;
  var InputType_time_instance;
  var InputType_url_instance;
  var InputType_week_instance;
  function values_11() {
    return [InputType_button_getInstance(), InputType_checkBox_getInstance(), InputType_color_getInstance(), InputType_date_getInstance(), InputType_dateTime_getInstance(), InputType_dateTimeLocal_getInstance(), InputType_email_getInstance(), InputType_file_getInstance(), InputType_hidden_getInstance(), InputType_image_getInstance(), InputType_month_getInstance(), InputType_number_getInstance(), InputType_password_getInstance(), InputType_radio_getInstance(), InputType_range_getInstance(), InputType_reset_getInstance(), InputType_search_getInstance(), InputType_submit_getInstance(), InputType_text_getInstance(), InputType_tel_getInstance(), InputType_time_getInstance(), InputType_url_getInstance(), InputType_week_getInstance()];
  }
  function valueOf_11(value) {
    switch (value) {
      case 'button':
        return InputType_button_getInstance();
      case 'checkBox':
        return InputType_checkBox_getInstance();
      case 'color':
        return InputType_color_getInstance();
      case 'date':
        return InputType_date_getInstance();
      case 'dateTime':
        return InputType_dateTime_getInstance();
      case 'dateTimeLocal':
        return InputType_dateTimeLocal_getInstance();
      case 'email':
        return InputType_email_getInstance();
      case 'file':
        return InputType_file_getInstance();
      case 'hidden':
        return InputType_hidden_getInstance();
      case 'image':
        return InputType_image_getInstance();
      case 'month':
        return InputType_month_getInstance();
      case 'number':
        return InputType_number_getInstance();
      case 'password':
        return InputType_password_getInstance();
      case 'radio':
        return InputType_radio_getInstance();
      case 'range':
        return InputType_range_getInstance();
      case 'reset':
        return InputType_reset_getInstance();
      case 'search':
        return InputType_search_getInstance();
      case 'submit':
        return InputType_submit_getInstance();
      case 'text':
        return InputType_text_getInstance();
      case 'tel':
        return InputType_tel_getInstance();
      case 'time':
        return InputType_time_getInstance();
      case 'url':
        return InputType_url_getInstance();
      case 'week':
        return InputType_week_getInstance();
      default:
        InputType_initEntries();
        THROW_ISE();
        break;
    }
  }
  var InputType_entriesInitialized;
  function InputType_initEntries() {
    if (InputType_entriesInitialized)
      return Unit_getInstance();
    InputType_entriesInitialized = true;
    InputType_button_instance = new InputType('button', 0, 'button');
    InputType_checkBox_instance = new InputType('checkBox', 1, 'checkbox');
    InputType_color_instance = new InputType('color', 2, 'color');
    InputType_date_instance = new InputType('date', 3, 'date');
    InputType_dateTime_instance = new InputType('dateTime', 4, 'datetime');
    InputType_dateTimeLocal_instance = new InputType('dateTimeLocal', 5, 'datetime-local');
    InputType_email_instance = new InputType('email', 6, 'email');
    InputType_file_instance = new InputType('file', 7, 'file');
    InputType_hidden_instance = new InputType('hidden', 8, 'hidden');
    InputType_image_instance = new InputType('image', 9, 'image');
    InputType_month_instance = new InputType('month', 10, 'month');
    InputType_number_instance = new InputType('number', 11, 'number');
    InputType_password_instance = new InputType('password', 12, 'password');
    InputType_radio_instance = new InputType('radio', 13, 'radio');
    InputType_range_instance = new InputType('range', 14, 'range');
    InputType_reset_instance = new InputType('reset', 15, 'reset');
    InputType_search_instance = new InputType('search', 16, 'search');
    InputType_submit_instance = new InputType('submit', 17, 'submit');
    InputType_text_instance = new InputType('text', 18, 'text');
    InputType_tel_instance = new InputType('tel', 19, 'tel');
    InputType_time_instance = new InputType('time', 20, 'time');
    InputType_url_instance = new InputType('url', 21, 'url');
    InputType_week_instance = new InputType('week', 22, 'week');
  }
  function InputType(name, ordinal, realValue) {
    Enum.call(this, name, ordinal);
    this.realValue_1 = realValue;
  }
  InputType.prototype.get_realValue_69bbcm_k$ = function () {
    return this.realValue_1;
  };
  InputType.$metadata$ = classMeta('InputType', [AttributeEnum], undefined, undefined, undefined, Enum.prototype);
  var KeyGenKeyType_rsa_instance;
  function values_12() {
    return [KeyGenKeyType_rsa_getInstance()];
  }
  function valueOf_12(value) {
    if ('rsa' === value)
      return KeyGenKeyType_rsa_getInstance();
    else {
      KeyGenKeyType_initEntries();
      THROW_ISE();
    }
  }
  var KeyGenKeyType_entriesInitialized;
  function KeyGenKeyType_initEntries() {
    if (KeyGenKeyType_entriesInitialized)
      return Unit_getInstance();
    KeyGenKeyType_entriesInitialized = true;
    KeyGenKeyType_rsa_instance = new KeyGenKeyType('rsa', 0, 'rsa');
  }
  function KeyGenKeyType(name, ordinal, realValue) {
    Enum.call(this, name, ordinal);
    this.realValue_1 = realValue;
  }
  KeyGenKeyType.prototype.get_realValue_69bbcm_k$ = function () {
    return this.realValue_1;
  };
  KeyGenKeyType.$metadata$ = classMeta('KeyGenKeyType', [AttributeEnum], undefined, undefined, undefined, Enum.prototype);
  var RunAt_server_instance;
  function values_13() {
    return [RunAt_server_getInstance()];
  }
  function valueOf_13(value) {
    if ('server' === value)
      return RunAt_server_getInstance();
    else {
      RunAt_initEntries();
      THROW_ISE();
    }
  }
  var RunAt_entriesInitialized;
  function RunAt_initEntries() {
    if (RunAt_entriesInitialized)
      return Unit_getInstance();
    RunAt_entriesInitialized = true;
    RunAt_server_instance = new RunAt('server', 0, 'server');
  }
  function RunAt(name, ordinal, realValue) {
    Enum.call(this, name, ordinal);
    this.realValue_1 = realValue;
  }
  RunAt.prototype.get_realValue_69bbcm_k$ = function () {
    return this.realValue_1;
  };
  RunAt.$metadata$ = classMeta('RunAt', [AttributeEnum], undefined, undefined, undefined, Enum.prototype);
  var TextAreaWrap_hard_instance;
  var TextAreaWrap_soft_instance;
  function values_14() {
    return [TextAreaWrap_hard_getInstance(), TextAreaWrap_soft_getInstance()];
  }
  function valueOf_14(value) {
    switch (value) {
      case 'hard':
        return TextAreaWrap_hard_getInstance();
      case 'soft':
        return TextAreaWrap_soft_getInstance();
      default:
        TextAreaWrap_initEntries();
        THROW_ISE();
        break;
    }
  }
  var TextAreaWrap_entriesInitialized;
  function TextAreaWrap_initEntries() {
    if (TextAreaWrap_entriesInitialized)
      return Unit_getInstance();
    TextAreaWrap_entriesInitialized = true;
    TextAreaWrap_hard_instance = new TextAreaWrap('hard', 0, 'hard');
    TextAreaWrap_soft_instance = new TextAreaWrap('soft', 1, 'soft');
  }
  function TextAreaWrap(name, ordinal, realValue) {
    Enum.call(this, name, ordinal);
    this.realValue_1 = realValue;
  }
  TextAreaWrap.prototype.get_realValue_69bbcm_k$ = function () {
    return this.realValue_1;
  };
  TextAreaWrap.$metadata$ = classMeta('TextAreaWrap', [AttributeEnum], undefined, undefined, undefined, Enum.prototype);
  var ThScope_col_instance;
  var ThScope_colGroup_instance;
  var ThScope_row_instance;
  var ThScope_rowGroup_instance;
  function values_15() {
    return [ThScope_col_getInstance(), ThScope_colGroup_getInstance(), ThScope_row_getInstance(), ThScope_rowGroup_getInstance()];
  }
  function valueOf_15(value) {
    switch (value) {
      case 'col':
        return ThScope_col_getInstance();
      case 'colGroup':
        return ThScope_colGroup_getInstance();
      case 'row':
        return ThScope_row_getInstance();
      case 'rowGroup':
        return ThScope_rowGroup_getInstance();
      default:
        ThScope_initEntries();
        THROW_ISE();
        break;
    }
  }
  var ThScope_entriesInitialized;
  function ThScope_initEntries() {
    if (ThScope_entriesInitialized)
      return Unit_getInstance();
    ThScope_entriesInitialized = true;
    ThScope_col_instance = new ThScope('col', 0, 'col');
    ThScope_colGroup_instance = new ThScope('colGroup', 1, 'colgroup');
    ThScope_row_instance = new ThScope('row', 2, 'row');
    ThScope_rowGroup_instance = new ThScope('rowGroup', 3, 'rowgroup');
  }
  function ThScope(name, ordinal, realValue) {
    Enum.call(this, name, ordinal);
    this.realValue_1 = realValue;
  }
  ThScope.prototype.get_realValue_69bbcm_k$ = function () {
    return this.realValue_1;
  };
  ThScope.$metadata$ = classMeta('ThScope', [AttributeEnum], undefined, undefined, undefined, Enum.prototype);
  var AreaShape_rect_instance;
  var AreaShape_circle_instance;
  var AreaShape_poly_instance;
  var AreaShape_default_instance;
  function values_16() {
    return [AreaShape_rect_getInstance(), AreaShape_circle_getInstance(), AreaShape_poly_getInstance(), AreaShape_default_getInstance()];
  }
  function valueOf_16(value) {
    switch (value) {
      case 'rect':
        return AreaShape_rect_getInstance();
      case 'circle':
        return AreaShape_circle_getInstance();
      case 'poly':
        return AreaShape_poly_getInstance();
      case 'default':
        return AreaShape_default_getInstance();
      default:
        AreaShape_initEntries();
        THROW_ISE();
        break;
    }
  }
  var AreaShape_entriesInitialized;
  function AreaShape_initEntries() {
    if (AreaShape_entriesInitialized)
      return Unit_getInstance();
    AreaShape_entriesInitialized = true;
    AreaShape_rect_instance = new AreaShape('rect', 0, 'rect');
    AreaShape_circle_instance = new AreaShape('circle', 1, 'circle');
    AreaShape_poly_instance = new AreaShape('poly', 2, 'poly');
    AreaShape_default_instance = new AreaShape('default', 3, 'default');
  }
  function AreaShape(name, ordinal, realValue) {
    Enum.call(this, name, ordinal);
    this.realValue_1 = realValue;
  }
  AreaShape.prototype.get_realValue_69bbcm_k$ = function () {
    return this.realValue_1;
  };
  AreaShape.$metadata$ = classMeta('AreaShape', [AttributeEnum], undefined, undefined, undefined, Enum.prototype);
  function ButtonFormEncType_multipartFormData_getInstance() {
    ButtonFormEncType_initEntries();
    return ButtonFormEncType_multipartFormData_instance;
  }
  function ButtonFormEncType_applicationXWwwFormUrlEncoded_getInstance() {
    ButtonFormEncType_initEntries();
    return ButtonFormEncType_applicationXWwwFormUrlEncoded_instance;
  }
  function ButtonFormEncType_textPlain_getInstance() {
    ButtonFormEncType_initEntries();
    return ButtonFormEncType_textPlain_instance;
  }
  function ButtonFormMethod_get_getInstance() {
    ButtonFormMethod_initEntries();
    return ButtonFormMethod_get_instance;
  }
  function ButtonFormMethod_post_getInstance() {
    ButtonFormMethod_initEntries();
    return ButtonFormMethod_post_instance;
  }
  function ButtonFormMethod_put_getInstance() {
    ButtonFormMethod_initEntries();
    return ButtonFormMethod_put_instance;
  }
  function ButtonFormMethod_delete_getInstance() {
    ButtonFormMethod_initEntries();
    return ButtonFormMethod_delete_instance;
  }
  function ButtonFormMethod_patch_getInstance() {
    ButtonFormMethod_initEntries();
    return ButtonFormMethod_patch_instance;
  }
  function ButtonType_button_getInstance() {
    ButtonType_initEntries();
    return ButtonType_button_instance;
  }
  function ButtonType_reset_getInstance() {
    ButtonType_initEntries();
    return ButtonType_reset_instance;
  }
  function ButtonType_submit_getInstance() {
    ButtonType_initEntries();
    return ButtonType_submit_instance;
  }
  function CommandType_command_getInstance() {
    CommandType_initEntries();
    return CommandType_command_instance;
  }
  function CommandType_checkBox_getInstance() {
    CommandType_initEntries();
    return CommandType_checkBox_instance;
  }
  function CommandType_radio_getInstance() {
    CommandType_initEntries();
    return CommandType_radio_instance;
  }
  function Dir_ltr_getInstance() {
    Dir_initEntries();
    return Dir_ltr_instance;
  }
  function Dir_rtl_getInstance() {
    Dir_initEntries();
    return Dir_rtl_instance;
  }
  function Draggable_htmlTrue_getInstance() {
    Draggable_initEntries();
    return Draggable_htmlTrue_instance;
  }
  function Draggable_htmlFalse_getInstance() {
    Draggable_initEntries();
    return Draggable_htmlFalse_instance;
  }
  function Draggable_auto_getInstance() {
    Draggable_initEntries();
    return Draggable_auto_instance;
  }
  function FormEncType_multipartFormData_getInstance() {
    FormEncType_initEntries();
    return FormEncType_multipartFormData_instance;
  }
  function FormEncType_applicationXWwwFormUrlEncoded_getInstance() {
    FormEncType_initEntries();
    return FormEncType_applicationXWwwFormUrlEncoded_instance;
  }
  function FormEncType_textPlain_getInstance() {
    FormEncType_initEntries();
    return FormEncType_textPlain_instance;
  }
  function FormMethod_get_getInstance() {
    FormMethod_initEntries();
    return FormMethod_get_instance;
  }
  function FormMethod_post_getInstance() {
    FormMethod_initEntries();
    return FormMethod_post_instance;
  }
  function FormMethod_put_getInstance() {
    FormMethod_initEntries();
    return FormMethod_put_instance;
  }
  function FormMethod_delete_getInstance() {
    FormMethod_initEntries();
    return FormMethod_delete_instance;
  }
  function FormMethod_patch_getInstance() {
    FormMethod_initEntries();
    return FormMethod_patch_instance;
  }
  function IframeSandbox_allowSameOrigin_getInstance() {
    IframeSandbox_initEntries();
    return IframeSandbox_allowSameOrigin_instance;
  }
  function IframeSandbox_allowFormS_getInstance() {
    IframeSandbox_initEntries();
    return IframeSandbox_allowFormS_instance;
  }
  function IframeSandbox_allowScripts_getInstance() {
    IframeSandbox_initEntries();
    return IframeSandbox_allowScripts_instance;
  }
  function InputFormEncType_multipartFormData_getInstance() {
    InputFormEncType_initEntries();
    return InputFormEncType_multipartFormData_instance;
  }
  function InputFormEncType_applicationXWwwFormUrlEncoded_getInstance() {
    InputFormEncType_initEntries();
    return InputFormEncType_applicationXWwwFormUrlEncoded_instance;
  }
  function InputFormEncType_textPlain_getInstance() {
    InputFormEncType_initEntries();
    return InputFormEncType_textPlain_instance;
  }
  function InputFormMethod_get_getInstance() {
    InputFormMethod_initEntries();
    return InputFormMethod_get_instance;
  }
  function InputFormMethod_post_getInstance() {
    InputFormMethod_initEntries();
    return InputFormMethod_post_instance;
  }
  function InputFormMethod_put_getInstance() {
    InputFormMethod_initEntries();
    return InputFormMethod_put_instance;
  }
  function InputFormMethod_delete_getInstance() {
    InputFormMethod_initEntries();
    return InputFormMethod_delete_instance;
  }
  function InputFormMethod_patch_getInstance() {
    InputFormMethod_initEntries();
    return InputFormMethod_patch_instance;
  }
  function InputType_button_getInstance() {
    InputType_initEntries();
    return InputType_button_instance;
  }
  function InputType_checkBox_getInstance() {
    InputType_initEntries();
    return InputType_checkBox_instance;
  }
  function InputType_color_getInstance() {
    InputType_initEntries();
    return InputType_color_instance;
  }
  function InputType_date_getInstance() {
    InputType_initEntries();
    return InputType_date_instance;
  }
  function InputType_dateTime_getInstance() {
    InputType_initEntries();
    return InputType_dateTime_instance;
  }
  function InputType_dateTimeLocal_getInstance() {
    InputType_initEntries();
    return InputType_dateTimeLocal_instance;
  }
  function InputType_email_getInstance() {
    InputType_initEntries();
    return InputType_email_instance;
  }
  function InputType_file_getInstance() {
    InputType_initEntries();
    return InputType_file_instance;
  }
  function InputType_hidden_getInstance() {
    InputType_initEntries();
    return InputType_hidden_instance;
  }
  function InputType_image_getInstance() {
    InputType_initEntries();
    return InputType_image_instance;
  }
  function InputType_month_getInstance() {
    InputType_initEntries();
    return InputType_month_instance;
  }
  function InputType_number_getInstance() {
    InputType_initEntries();
    return InputType_number_instance;
  }
  function InputType_password_getInstance() {
    InputType_initEntries();
    return InputType_password_instance;
  }
  function InputType_radio_getInstance() {
    InputType_initEntries();
    return InputType_radio_instance;
  }
  function InputType_range_getInstance() {
    InputType_initEntries();
    return InputType_range_instance;
  }
  function InputType_reset_getInstance() {
    InputType_initEntries();
    return InputType_reset_instance;
  }
  function InputType_search_getInstance() {
    InputType_initEntries();
    return InputType_search_instance;
  }
  function InputType_submit_getInstance() {
    InputType_initEntries();
    return InputType_submit_instance;
  }
  function InputType_text_getInstance() {
    InputType_initEntries();
    return InputType_text_instance;
  }
  function InputType_tel_getInstance() {
    InputType_initEntries();
    return InputType_tel_instance;
  }
  function InputType_time_getInstance() {
    InputType_initEntries();
    return InputType_time_instance;
  }
  function InputType_url_getInstance() {
    InputType_initEntries();
    return InputType_url_instance;
  }
  function InputType_week_getInstance() {
    InputType_initEntries();
    return InputType_week_instance;
  }
  function KeyGenKeyType_rsa_getInstance() {
    KeyGenKeyType_initEntries();
    return KeyGenKeyType_rsa_instance;
  }
  function RunAt_server_getInstance() {
    RunAt_initEntries();
    return RunAt_server_instance;
  }
  function TextAreaWrap_hard_getInstance() {
    TextAreaWrap_initEntries();
    return TextAreaWrap_hard_instance;
  }
  function TextAreaWrap_soft_getInstance() {
    TextAreaWrap_initEntries();
    return TextAreaWrap_soft_instance;
  }
  function ThScope_col_getInstance() {
    ThScope_initEntries();
    return ThScope_col_instance;
  }
  function ThScope_colGroup_getInstance() {
    ThScope_initEntries();
    return ThScope_colGroup_instance;
  }
  function ThScope_row_getInstance() {
    ThScope_initEntries();
    return ThScope_row_instance;
  }
  function ThScope_rowGroup_getInstance() {
    ThScope_initEntries();
    return ThScope_rowGroup_instance;
  }
  function AreaShape_rect_getInstance() {
    AreaShape_initEntries();
    return AreaShape_rect_instance;
  }
  function AreaShape_circle_getInstance() {
    AreaShape_initEntries();
    return AreaShape_circle_instance;
  }
  function AreaShape_poly_getInstance() {
    AreaShape_initEntries();
    return AreaShape_poly_instance;
  }
  function AreaShape_default_getInstance() {
    AreaShape_initEntries();
    return AreaShape_default_instance;
  }
  var properties_initialized_gen_enums_kt_cpcrt1;
  function init_properties_gen_enums_kt_tifmld() {
    if (properties_initialized_gen_enums_kt_cpcrt1) {
    } else {
      properties_initialized_gen_enums_kt_cpcrt1 = true;
      var tmp$ret$2;
      {
        var tmp0_associateBy = values_4();
        var capacity = coerceAtLeast(mapCapacity(tmp0_associateBy.length), 16);
        var tmp$ret$1;
        {
          var tmp0_associateByTo = LinkedHashMap_init_$Create$_1(capacity);
          var indexedObject = tmp0_associateBy;
          var inductionVariable = 0;
          var last = indexedObject.length;
          while (inductionVariable < last) {
            var element = indexedObject[inductionVariable];
            inductionVariable = inductionVariable + 1 | 0;
            var tmp$ret$0;
            {
              tmp$ret$0 = element.realValue_1;
            }
            tmp0_associateByTo.put_3mhbri_k$(tmp$ret$0, element);
          }
          tmp$ret$1 = tmp0_associateByTo;
        }
        tmp$ret$2 = tmp$ret$1;
      }
      dirValues = tmp$ret$2;
      var tmp$ret$2_0;
      {
        var tmp0_associateBy_0 = values_5();
        var capacity_0 = coerceAtLeast(mapCapacity(tmp0_associateBy_0.length), 16);
        var tmp$ret$1_0;
        {
          var tmp0_associateByTo_0 = LinkedHashMap_init_$Create$_1(capacity_0);
          var indexedObject_0 = tmp0_associateBy_0;
          var inductionVariable_0 = 0;
          var last_0 = indexedObject_0.length;
          while (inductionVariable_0 < last_0) {
            var element_0 = indexedObject_0[inductionVariable_0];
            inductionVariable_0 = inductionVariable_0 + 1 | 0;
            var tmp$ret$0_0;
            {
              tmp$ret$0_0 = element_0.realValue_1;
            }
            tmp0_associateByTo_0.put_3mhbri_k$(tmp$ret$0_0, element_0);
          }
          tmp$ret$1_0 = tmp0_associateByTo_0;
        }
        tmp$ret$2_0 = tmp$ret$1_0;
      }
      draggableValues = tmp$ret$2_0;
      var tmp$ret$2_1;
      {
        var tmp0_associateBy_1 = values_13();
        var capacity_1 = coerceAtLeast(mapCapacity(tmp0_associateBy_1.length), 16);
        var tmp$ret$1_1;
        {
          var tmp0_associateByTo_1 = LinkedHashMap_init_$Create$_1(capacity_1);
          var indexedObject_1 = tmp0_associateBy_1;
          var inductionVariable_1 = 0;
          var last_1 = indexedObject_1.length;
          while (inductionVariable_1 < last_1) {
            var element_1 = indexedObject_1[inductionVariable_1];
            inductionVariable_1 = inductionVariable_1 + 1 | 0;
            var tmp$ret$0_1;
            {
              tmp$ret$0_1 = element_1.realValue_1;
            }
            tmp0_associateByTo_1.put_3mhbri_k$(tmp$ret$0_1, element_1);
          }
          tmp$ret$1_1 = tmp0_associateByTo_1;
        }
        tmp$ret$2_1 = tmp$ret$1_1;
      }
      runAtValues = tmp$ret$2_1;
      var tmp$ret$2_2;
      {
        var tmp0_associateBy_2 = values_16();
        var capacity_2 = coerceAtLeast(mapCapacity(tmp0_associateBy_2.length), 16);
        var tmp$ret$1_2;
        {
          var tmp0_associateByTo_2 = LinkedHashMap_init_$Create$_1(capacity_2);
          var indexedObject_2 = tmp0_associateBy_2;
          var inductionVariable_2 = 0;
          var last_2 = indexedObject_2.length;
          while (inductionVariable_2 < last_2) {
            var element_2 = indexedObject_2[inductionVariable_2];
            inductionVariable_2 = inductionVariable_2 + 1 | 0;
            var tmp$ret$0_2;
            {
              tmp$ret$0_2 = element_2.realValue_1;
            }
            tmp0_associateByTo_2.put_3mhbri_k$(tmp$ret$0_2, element_2);
          }
          tmp$ret$1_2 = tmp0_associateByTo_2;
        }
        tmp$ret$2_2 = tmp$ret$1_2;
      }
      areaShapeValues = tmp$ret$2_2;
      var tmp$ret$2_3;
      {
        var tmp0_associateBy_3 = values_0();
        var capacity_3 = coerceAtLeast(mapCapacity(tmp0_associateBy_3.length), 16);
        var tmp$ret$1_3;
        {
          var tmp0_associateByTo_3 = LinkedHashMap_init_$Create$_1(capacity_3);
          var indexedObject_3 = tmp0_associateBy_3;
          var inductionVariable_3 = 0;
          var last_3 = indexedObject_3.length;
          while (inductionVariable_3 < last_3) {
            var element_3 = indexedObject_3[inductionVariable_3];
            inductionVariable_3 = inductionVariable_3 + 1 | 0;
            var tmp$ret$0_3;
            {
              tmp$ret$0_3 = element_3.realValue_1;
            }
            tmp0_associateByTo_3.put_3mhbri_k$(tmp$ret$0_3, element_3);
          }
          tmp$ret$1_3 = tmp0_associateByTo_3;
        }
        tmp$ret$2_3 = tmp$ret$1_3;
      }
      buttonFormEncTypeValues = tmp$ret$2_3;
      var tmp$ret$2_4;
      {
        var tmp0_associateBy_4 = values_1();
        var capacity_4 = coerceAtLeast(mapCapacity(tmp0_associateBy_4.length), 16);
        var tmp$ret$1_4;
        {
          var tmp0_associateByTo_4 = LinkedHashMap_init_$Create$_1(capacity_4);
          var indexedObject_4 = tmp0_associateBy_4;
          var inductionVariable_4 = 0;
          var last_4 = indexedObject_4.length;
          while (inductionVariable_4 < last_4) {
            var element_4 = indexedObject_4[inductionVariable_4];
            inductionVariable_4 = inductionVariable_4 + 1 | 0;
            var tmp$ret$0_4;
            {
              tmp$ret$0_4 = element_4.realValue_1;
            }
            tmp0_associateByTo_4.put_3mhbri_k$(tmp$ret$0_4, element_4);
          }
          tmp$ret$1_4 = tmp0_associateByTo_4;
        }
        tmp$ret$2_4 = tmp$ret$1_4;
      }
      buttonFormMethodValues = tmp$ret$2_4;
      var tmp$ret$2_5;
      {
        var tmp0_associateBy_5 = values_2();
        var capacity_5 = coerceAtLeast(mapCapacity(tmp0_associateBy_5.length), 16);
        var tmp$ret$1_5;
        {
          var tmp0_associateByTo_5 = LinkedHashMap_init_$Create$_1(capacity_5);
          var indexedObject_5 = tmp0_associateBy_5;
          var inductionVariable_5 = 0;
          var last_5 = indexedObject_5.length;
          while (inductionVariable_5 < last_5) {
            var element_5 = indexedObject_5[inductionVariable_5];
            inductionVariable_5 = inductionVariable_5 + 1 | 0;
            var tmp$ret$0_5;
            {
              tmp$ret$0_5 = element_5.realValue_1;
            }
            tmp0_associateByTo_5.put_3mhbri_k$(tmp$ret$0_5, element_5);
          }
          tmp$ret$1_5 = tmp0_associateByTo_5;
        }
        tmp$ret$2_5 = tmp$ret$1_5;
      }
      buttonTypeValues = tmp$ret$2_5;
      var tmp$ret$2_6;
      {
        var tmp0_associateBy_6 = values_3();
        var capacity_6 = coerceAtLeast(mapCapacity(tmp0_associateBy_6.length), 16);
        var tmp$ret$1_6;
        {
          var tmp0_associateByTo_6 = LinkedHashMap_init_$Create$_1(capacity_6);
          var indexedObject_6 = tmp0_associateBy_6;
          var inductionVariable_6 = 0;
          var last_6 = indexedObject_6.length;
          while (inductionVariable_6 < last_6) {
            var element_6 = indexedObject_6[inductionVariable_6];
            inductionVariable_6 = inductionVariable_6 + 1 | 0;
            var tmp$ret$0_6;
            {
              tmp$ret$0_6 = element_6.realValue_1;
            }
            tmp0_associateByTo_6.put_3mhbri_k$(tmp$ret$0_6, element_6);
          }
          tmp$ret$1_6 = tmp0_associateByTo_6;
        }
        tmp$ret$2_6 = tmp$ret$1_6;
      }
      commandTypeValues = tmp$ret$2_6;
      var tmp$ret$2_7;
      {
        var tmp0_associateBy_7 = values_6();
        var capacity_7 = coerceAtLeast(mapCapacity(tmp0_associateBy_7.length), 16);
        var tmp$ret$1_7;
        {
          var tmp0_associateByTo_7 = LinkedHashMap_init_$Create$_1(capacity_7);
          var indexedObject_7 = tmp0_associateBy_7;
          var inductionVariable_7 = 0;
          var last_7 = indexedObject_7.length;
          while (inductionVariable_7 < last_7) {
            var element_7 = indexedObject_7[inductionVariable_7];
            inductionVariable_7 = inductionVariable_7 + 1 | 0;
            var tmp$ret$0_7;
            {
              tmp$ret$0_7 = element_7.realValue_1;
            }
            tmp0_associateByTo_7.put_3mhbri_k$(tmp$ret$0_7, element_7);
          }
          tmp$ret$1_7 = tmp0_associateByTo_7;
        }
        tmp$ret$2_7 = tmp$ret$1_7;
      }
      formEncTypeValues = tmp$ret$2_7;
      var tmp$ret$2_8;
      {
        var tmp0_associateBy_8 = values_7();
        var capacity_8 = coerceAtLeast(mapCapacity(tmp0_associateBy_8.length), 16);
        var tmp$ret$1_8;
        {
          var tmp0_associateByTo_8 = LinkedHashMap_init_$Create$_1(capacity_8);
          var indexedObject_8 = tmp0_associateBy_8;
          var inductionVariable_8 = 0;
          var last_8 = indexedObject_8.length;
          while (inductionVariable_8 < last_8) {
            var element_8 = indexedObject_8[inductionVariable_8];
            inductionVariable_8 = inductionVariable_8 + 1 | 0;
            var tmp$ret$0_8;
            {
              tmp$ret$0_8 = element_8.realValue_1;
            }
            tmp0_associateByTo_8.put_3mhbri_k$(tmp$ret$0_8, element_8);
          }
          tmp$ret$1_8 = tmp0_associateByTo_8;
        }
        tmp$ret$2_8 = tmp$ret$1_8;
      }
      formMethodValues = tmp$ret$2_8;
      var tmp$ret$2_9;
      {
        var tmp0_associateBy_9 = values_8();
        var capacity_9 = coerceAtLeast(mapCapacity(tmp0_associateBy_9.length), 16);
        var tmp$ret$1_9;
        {
          var tmp0_associateByTo_9 = LinkedHashMap_init_$Create$_1(capacity_9);
          var indexedObject_9 = tmp0_associateBy_9;
          var inductionVariable_9 = 0;
          var last_9 = indexedObject_9.length;
          while (inductionVariable_9 < last_9) {
            var element_9 = indexedObject_9[inductionVariable_9];
            inductionVariable_9 = inductionVariable_9 + 1 | 0;
            var tmp$ret$0_9;
            {
              tmp$ret$0_9 = element_9.realValue_1;
            }
            tmp0_associateByTo_9.put_3mhbri_k$(tmp$ret$0_9, element_9);
          }
          tmp$ret$1_9 = tmp0_associateByTo_9;
        }
        tmp$ret$2_9 = tmp$ret$1_9;
      }
      iframeSandboxValues = tmp$ret$2_9;
      var tmp$ret$2_10;
      {
        var tmp0_associateBy_10 = values_11();
        var capacity_10 = coerceAtLeast(mapCapacity(tmp0_associateBy_10.length), 16);
        var tmp$ret$1_10;
        {
          var tmp0_associateByTo_10 = LinkedHashMap_init_$Create$_1(capacity_10);
          var indexedObject_10 = tmp0_associateBy_10;
          var inductionVariable_10 = 0;
          var last_10 = indexedObject_10.length;
          while (inductionVariable_10 < last_10) {
            var element_10 = indexedObject_10[inductionVariable_10];
            inductionVariable_10 = inductionVariable_10 + 1 | 0;
            var tmp$ret$0_10;
            {
              tmp$ret$0_10 = element_10.realValue_1;
            }
            tmp0_associateByTo_10.put_3mhbri_k$(tmp$ret$0_10, element_10);
          }
          tmp$ret$1_10 = tmp0_associateByTo_10;
        }
        tmp$ret$2_10 = tmp$ret$1_10;
      }
      inputTypeValues = tmp$ret$2_10;
      var tmp$ret$2_11;
      {
        var tmp0_associateBy_11 = values_9();
        var capacity_11 = coerceAtLeast(mapCapacity(tmp0_associateBy_11.length), 16);
        var tmp$ret$1_11;
        {
          var tmp0_associateByTo_11 = LinkedHashMap_init_$Create$_1(capacity_11);
          var indexedObject_11 = tmp0_associateBy_11;
          var inductionVariable_11 = 0;
          var last_11 = indexedObject_11.length;
          while (inductionVariable_11 < last_11) {
            var element_11 = indexedObject_11[inductionVariable_11];
            inductionVariable_11 = inductionVariable_11 + 1 | 0;
            var tmp$ret$0_11;
            {
              tmp$ret$0_11 = element_11.realValue_1;
            }
            tmp0_associateByTo_11.put_3mhbri_k$(tmp$ret$0_11, element_11);
          }
          tmp$ret$1_11 = tmp0_associateByTo_11;
        }
        tmp$ret$2_11 = tmp$ret$1_11;
      }
      inputFormEncTypeValues = tmp$ret$2_11;
      var tmp$ret$2_12;
      {
        var tmp0_associateBy_12 = values_10();
        var capacity_12 = coerceAtLeast(mapCapacity(tmp0_associateBy_12.length), 16);
        var tmp$ret$1_12;
        {
          var tmp0_associateByTo_12 = LinkedHashMap_init_$Create$_1(capacity_12);
          var indexedObject_12 = tmp0_associateBy_12;
          var inductionVariable_12 = 0;
          var last_12 = indexedObject_12.length;
          while (inductionVariable_12 < last_12) {
            var element_12 = indexedObject_12[inductionVariable_12];
            inductionVariable_12 = inductionVariable_12 + 1 | 0;
            var tmp$ret$0_12;
            {
              tmp$ret$0_12 = element_12.realValue_1;
            }
            tmp0_associateByTo_12.put_3mhbri_k$(tmp$ret$0_12, element_12);
          }
          tmp$ret$1_12 = tmp0_associateByTo_12;
        }
        tmp$ret$2_12 = tmp$ret$1_12;
      }
      inputFormMethodValues = tmp$ret$2_12;
      var tmp$ret$2_13;
      {
        var tmp0_associateBy_13 = values_12();
        var capacity_13 = coerceAtLeast(mapCapacity(tmp0_associateBy_13.length), 16);
        var tmp$ret$1_13;
        {
          var tmp0_associateByTo_13 = LinkedHashMap_init_$Create$_1(capacity_13);
          var indexedObject_13 = tmp0_associateBy_13;
          var inductionVariable_13 = 0;
          var last_13 = indexedObject_13.length;
          while (inductionVariable_13 < last_13) {
            var element_13 = indexedObject_13[inductionVariable_13];
            inductionVariable_13 = inductionVariable_13 + 1 | 0;
            var tmp$ret$0_13;
            {
              tmp$ret$0_13 = element_13.realValue_1;
            }
            tmp0_associateByTo_13.put_3mhbri_k$(tmp$ret$0_13, element_13);
          }
          tmp$ret$1_13 = tmp0_associateByTo_13;
        }
        tmp$ret$2_13 = tmp$ret$1_13;
      }
      keyGenKeyTypeValues = tmp$ret$2_13;
      var tmp$ret$2_14;
      {
        var tmp0_associateBy_14 = values_14();
        var capacity_14 = coerceAtLeast(mapCapacity(tmp0_associateBy_14.length), 16);
        var tmp$ret$1_14;
        {
          var tmp0_associateByTo_14 = LinkedHashMap_init_$Create$_1(capacity_14);
          var indexedObject_14 = tmp0_associateBy_14;
          var inductionVariable_14 = 0;
          var last_14 = indexedObject_14.length;
          while (inductionVariable_14 < last_14) {
            var element_14 = indexedObject_14[inductionVariable_14];
            inductionVariable_14 = inductionVariable_14 + 1 | 0;
            var tmp$ret$0_14;
            {
              tmp$ret$0_14 = element_14.realValue_1;
            }
            tmp0_associateByTo_14.put_3mhbri_k$(tmp$ret$0_14, element_14);
          }
          tmp$ret$1_14 = tmp0_associateByTo_14;
        }
        tmp$ret$2_14 = tmp$ret$1_14;
      }
      textAreaWrapValues = tmp$ret$2_14;
      var tmp$ret$2_15;
      {
        var tmp0_associateBy_15 = values_15();
        var capacity_15 = coerceAtLeast(mapCapacity(tmp0_associateBy_15.length), 16);
        var tmp$ret$1_15;
        {
          var tmp0_associateByTo_15 = LinkedHashMap_init_$Create$_1(capacity_15);
          var indexedObject_15 = tmp0_associateBy_15;
          var inductionVariable_15 = 0;
          var last_15 = indexedObject_15.length;
          while (inductionVariable_15 < last_15) {
            var element_15 = indexedObject_15[inductionVariable_15];
            inductionVariable_15 = inductionVariable_15 + 1 | 0;
            var tmp$ret$0_15;
            {
              tmp$ret$0_15 = element_15.realValue_1;
            }
            tmp0_associateByTo_15.put_3mhbri_k$(tmp$ret$0_15, element_15);
          }
          tmp$ret$1_15 = tmp0_associateByTo_15;
        }
        tmp$ret$2_15 = tmp$ret$1_15;
      }
      thScopeValues = tmp$ret$2_15;
    }
  }
  function HtmlBlockInlineTag() {
  }
  HtmlBlockInlineTag.$metadata$ = interfaceMeta('HtmlBlockInlineTag', [CommonAttributeGroupFacade, FlowPhrasingContent, HtmlBlockTag, HtmlInlineTag]);
  function HtmlBlockTag() {
  }
  HtmlBlockTag.$metadata$ = interfaceMeta('HtmlBlockTag', [CommonAttributeGroupFacade, FlowContent]);
  function CommonAttributeGroupFacadeFlowHeadingPhrasingContent() {
  }
  CommonAttributeGroupFacadeFlowHeadingPhrasingContent.$metadata$ = interfaceMeta('CommonAttributeGroupFacadeFlowHeadingPhrasingContent', [CommonAttributeGroupFacade, CommonAttributeGroupFacadeFlowHeadingContent, FlowPhrasingContent, HtmlBlockInlineTag, HtmlBlockTag, HtmlInlineTag]);
  function CommonAttributeGroupFacadeFlowInteractivePhrasingContent() {
  }
  CommonAttributeGroupFacadeFlowInteractivePhrasingContent.$metadata$ = interfaceMeta('CommonAttributeGroupFacadeFlowInteractivePhrasingContent', [CommonAttributeGroupFacade, CommonAttributeGroupFacadeFlowInteractiveContent, FlowInteractiveContent, FlowInteractivePhrasingContent, FlowPhrasingContent, HtmlBlockInlineTag, HtmlBlockTag, HtmlInlineTag]);
  function FlowPhrasingContent() {
  }
  FlowPhrasingContent.$metadata$ = interfaceMeta('FlowPhrasingContent', [FlowContent, PhrasingContent]);
  function HtmlInlineTag() {
  }
  HtmlInlineTag.$metadata$ = interfaceMeta('HtmlInlineTag', [CommonAttributeGroupFacade, PhrasingContent]);
  function CommonAttributeGroupFacadeFlowHeadingContent() {
  }
  CommonAttributeGroupFacadeFlowHeadingContent.$metadata$ = interfaceMeta('CommonAttributeGroupFacadeFlowHeadingContent', [CommonAttributeGroupFacade, HeadingContent, HtmlBlockTag]);
  function CommonAttributeGroupFacadeFlowInteractiveContent() {
  }
  CommonAttributeGroupFacadeFlowInteractiveContent.$metadata$ = interfaceMeta('CommonAttributeGroupFacadeFlowInteractiveContent', [CommonAttributeGroupFacade, FlowInteractiveContent, HtmlBlockTag]);
  function FlowInteractiveContent() {
  }
  FlowInteractiveContent.$metadata$ = interfaceMeta('FlowInteractiveContent', [FlowContent, InteractiveContent]);
  function FlowInteractivePhrasingContent() {
  }
  FlowInteractivePhrasingContent.$metadata$ = interfaceMeta('FlowInteractivePhrasingContent', [FlowInteractiveContent, FlowPhrasingContent]);
  function FlowContent() {
  }
  FlowContent.$metadata$ = interfaceMeta('FlowContent', [FlowOrMetaDataOrPhrasingContent, FlowOrHeadingContent, FlowOrMetaDataContent, FlowOrInteractiveContent, FlowOrPhrasingContent, SectioningOrFlowContent, FlowOrInteractiveOrPhrasingContent, Tag]);
  function div_0(_this__u8e3s4, classes, block) {
    var tmp$ret$0;
    {
      var tmp0_visit = new DIV(attributesMapOf_0('class', classes), _this__u8e3s4.get_consumer_tu5133_k$());
      tmp0_visit.get_consumer_tu5133_k$().onTagStart_jhb705_k$(tmp0_visit);
      var tmp;
      try {
        tmp = block(tmp0_visit);
      } catch ($p) {
        var tmp_0;
        if ($p instanceof Error) {
          tmp_0 = tmp0_visit.get_consumer_tu5133_k$().onTagError_d07vof_k$(tmp0_visit, $p);
        } else {
          throw $p;
        }
        tmp = tmp_0;
      }
      finally {
        tmp0_visit.get_consumer_tu5133_k$().onTagEnd_f3ehek_k$(tmp0_visit);
      }
      tmp$ret$0 = tmp;
    }
    return tmp$ret$0;
  }
  function header(_this__u8e3s4, classes, block) {
    var tmp$ret$0;
    {
      var tmp0_visit = new HEADER(attributesMapOf_0('class', classes), _this__u8e3s4.get_consumer_tu5133_k$());
      tmp0_visit.get_consumer_tu5133_k$().onTagStart_jhb705_k$(tmp0_visit);
      var tmp;
      try {
        tmp = block(tmp0_visit);
      } catch ($p) {
        var tmp_0;
        if ($p instanceof Error) {
          tmp_0 = tmp0_visit.get_consumer_tu5133_k$().onTagError_d07vof_k$(tmp0_visit, $p);
        } else {
          throw $p;
        }
        tmp = tmp_0;
      }
      finally {
        tmp0_visit.get_consumer_tu5133_k$().onTagEnd_f3ehek_k$(tmp0_visit);
      }
      tmp$ret$0 = tmp;
    }
    return tmp$ret$0;
  }
  function ul(_this__u8e3s4, classes, block) {
    var tmp$ret$0;
    {
      var tmp0_visit = new UL(attributesMapOf_0('class', classes), _this__u8e3s4.get_consumer_tu5133_k$());
      tmp0_visit.get_consumer_tu5133_k$().onTagStart_jhb705_k$(tmp0_visit);
      var tmp;
      try {
        tmp = block(tmp0_visit);
      } catch ($p) {
        var tmp_0;
        if ($p instanceof Error) {
          tmp_0 = tmp0_visit.get_consumer_tu5133_k$().onTagError_d07vof_k$(tmp0_visit, $p);
        } else {
          throw $p;
        }
        tmp = tmp_0;
      }
      finally {
        tmp0_visit.get_consumer_tu5133_k$().onTagEnd_f3ehek_k$(tmp0_visit);
      }
      tmp$ret$0 = tmp;
    }
    return tmp$ret$0;
  }
  function p(_this__u8e3s4, classes, block) {
    var tmp$ret$0;
    {
      var tmp0_visit = new P(attributesMapOf_0('class', classes), _this__u8e3s4.get_consumer_tu5133_k$());
      tmp0_visit.get_consumer_tu5133_k$().onTagStart_jhb705_k$(tmp0_visit);
      var tmp;
      try {
        tmp = block(tmp0_visit);
      } catch ($p) {
        var tmp_0;
        if ($p instanceof Error) {
          tmp_0 = tmp0_visit.get_consumer_tu5133_k$().onTagError_d07vof_k$(tmp0_visit, $p);
        } else {
          throw $p;
        }
        tmp = tmp_0;
      }
      finally {
        tmp0_visit.get_consumer_tu5133_k$().onTagEnd_f3ehek_k$(tmp0_visit);
      }
      tmp$ret$0 = tmp;
    }
    return tmp$ret$0;
  }
  function PhrasingContent() {
  }
  PhrasingContent.$metadata$ = interfaceMeta('PhrasingContent', [FlowOrMetaDataOrPhrasingContent, FlowOrPhrasingContent, FlowOrInteractiveOrPhrasingContent, Tag]);
  function HeadingContent() {
  }
  HeadingContent.$metadata$ = interfaceMeta('HeadingContent', [FlowOrHeadingContent, Tag]);
  function InteractiveContent() {
  }
  InteractiveContent.$metadata$ = interfaceMeta('InteractiveContent', [FlowOrInteractiveContent, FlowOrInteractiveOrPhrasingContent, Tag]);
  function div$lambda_0() {
    return function ($this$null) {
      return Unit_getInstance();
    };
  }
  function header$lambda() {
    return function ($this$null) {
      return Unit_getInstance();
    };
  }
  function ul$lambda() {
    return function ($this$null) {
      return Unit_getInstance();
    };
  }
  function p$lambda() {
    return function ($this$null) {
      return Unit_getInstance();
    };
  }
  function i(_this__u8e3s4, classes, block) {
    var tmp$ret$0;
    {
      var tmp0_visit = new I(attributesMapOf_0('class', classes), _this__u8e3s4.get_consumer_tu5133_k$());
      tmp0_visit.get_consumer_tu5133_k$().onTagStart_jhb705_k$(tmp0_visit);
      var tmp;
      try {
        tmp = block(tmp0_visit);
      } catch ($p) {
        var tmp_0;
        if ($p instanceof Error) {
          tmp_0 = tmp0_visit.get_consumer_tu5133_k$().onTagError_d07vof_k$(tmp0_visit, $p);
        } else {
          throw $p;
        }
        tmp = tmp_0;
      }
      finally {
        tmp0_visit.get_consumer_tu5133_k$().onTagEnd_f3ehek_k$(tmp0_visit);
      }
      tmp$ret$0 = tmp;
    }
    return tmp$ret$0;
  }
  function h2(_this__u8e3s4, classes, block) {
    var tmp$ret$0;
    {
      var tmp0_visit = new H2(attributesMapOf_0('class', classes), _this__u8e3s4.get_consumer_tu5133_k$());
      tmp0_visit.get_consumer_tu5133_k$().onTagStart_jhb705_k$(tmp0_visit);
      var tmp;
      try {
        tmp = block(tmp0_visit);
      } catch ($p) {
        var tmp_0;
        if ($p instanceof Error) {
          tmp_0 = tmp0_visit.get_consumer_tu5133_k$().onTagError_d07vof_k$(tmp0_visit, $p);
        } else {
          throw $p;
        }
        tmp = tmp_0;
      }
      finally {
        tmp0_visit.get_consumer_tu5133_k$().onTagEnd_f3ehek_k$(tmp0_visit);
      }
      tmp$ret$0 = tmp;
    }
    return tmp$ret$0;
  }
  function a(_this__u8e3s4, href, target, classes, block) {
    var tmp$ret$0;
    {
      var tmp0_visit = new A(attributesMapOf(['href', href, 'target', target, 'class', classes]), _this__u8e3s4.get_consumer_tu5133_k$());
      tmp0_visit.get_consumer_tu5133_k$().onTagStart_jhb705_k$(tmp0_visit);
      var tmp;
      try {
        tmp = block(tmp0_visit);
      } catch ($p) {
        var tmp_0;
        if ($p instanceof Error) {
          tmp_0 = tmp0_visit.get_consumer_tu5133_k$().onTagError_d07vof_k$(tmp0_visit, $p);
        } else {
          throw $p;
        }
        tmp = tmp_0;
      }
      finally {
        tmp0_visit.get_consumer_tu5133_k$().onTagEnd_f3ehek_k$(tmp0_visit);
      }
      tmp$ret$0 = tmp;
    }
    return tmp$ret$0;
  }
  function span(_this__u8e3s4, classes, block) {
    var tmp$ret$0;
    {
      var tmp0_visit = new SPAN(attributesMapOf_0('class', classes), _this__u8e3s4.get_consumer_tu5133_k$());
      tmp0_visit.get_consumer_tu5133_k$().onTagStart_jhb705_k$(tmp0_visit);
      var tmp;
      try {
        tmp = block(tmp0_visit);
      } catch ($p) {
        var tmp_0;
        if ($p instanceof Error) {
          tmp_0 = tmp0_visit.get_consumer_tu5133_k$().onTagError_d07vof_k$(tmp0_visit, $p);
        } else {
          throw $p;
        }
        tmp = tmp_0;
      }
      finally {
        tmp0_visit.get_consumer_tu5133_k$().onTagEnd_f3ehek_k$(tmp0_visit);
      }
      tmp$ret$0 = tmp;
    }
    return tmp$ret$0;
  }
  function h1(_this__u8e3s4, classes, block) {
    var tmp$ret$0;
    {
      var tmp0_visit = new H1(attributesMapOf_0('class', classes), _this__u8e3s4.get_consumer_tu5133_k$());
      tmp0_visit.get_consumer_tu5133_k$().onTagStart_jhb705_k$(tmp0_visit);
      var tmp;
      try {
        tmp = block(tmp0_visit);
      } catch ($p) {
        var tmp_0;
        if ($p instanceof Error) {
          tmp_0 = tmp0_visit.get_consumer_tu5133_k$().onTagError_d07vof_k$(tmp0_visit, $p);
        } else {
          throw $p;
        }
        tmp = tmp_0;
      }
      finally {
        tmp0_visit.get_consumer_tu5133_k$().onTagEnd_f3ehek_k$(tmp0_visit);
      }
      tmp$ret$0 = tmp;
    }
    return tmp$ret$0;
  }
  function img(_this__u8e3s4, alt, src, classes, block) {
    var tmp$ret$0;
    {
      var tmp0_visit = new IMG(attributesMapOf(['alt', alt, 'src', src, 'class', classes]), _this__u8e3s4.get_consumer_tu5133_k$());
      tmp0_visit.get_consumer_tu5133_k$().onTagStart_jhb705_k$(tmp0_visit);
      var tmp;
      try {
        tmp = block(tmp0_visit);
      } catch ($p) {
        var tmp_0;
        if ($p instanceof Error) {
          tmp_0 = tmp0_visit.get_consumer_tu5133_k$().onTagError_d07vof_k$(tmp0_visit, $p);
        } else {
          throw $p;
        }
        tmp = tmp_0;
      }
      finally {
        tmp0_visit.get_consumer_tu5133_k$().onTagEnd_f3ehek_k$(tmp0_visit);
      }
      tmp$ret$0 = tmp;
    }
    return tmp$ret$0;
  }
  function h4(_this__u8e3s4, classes, block) {
    var tmp$ret$0;
    {
      var tmp0_visit = new H4(attributesMapOf_0('class', classes), _this__u8e3s4.get_consumer_tu5133_k$());
      tmp0_visit.get_consumer_tu5133_k$().onTagStart_jhb705_k$(tmp0_visit);
      var tmp;
      try {
        tmp = block(tmp0_visit);
      } catch ($p) {
        var tmp_0;
        if ($p instanceof Error) {
          tmp_0 = tmp0_visit.get_consumer_tu5133_k$().onTagError_d07vof_k$(tmp0_visit, $p);
        } else {
          throw $p;
        }
        tmp = tmp_0;
      }
      finally {
        tmp0_visit.get_consumer_tu5133_k$().onTagEnd_f3ehek_k$(tmp0_visit);
      }
      tmp$ret$0 = tmp;
    }
    return tmp$ret$0;
  }
  function FlowOrMetaDataOrPhrasingContent() {
  }
  FlowOrMetaDataOrPhrasingContent.$metadata$ = interfaceMeta('FlowOrMetaDataOrPhrasingContent', [Tag]);
  function FlowOrHeadingContent() {
  }
  FlowOrHeadingContent.$metadata$ = interfaceMeta('FlowOrHeadingContent', [Tag]);
  function FlowOrMetaDataContent() {
  }
  FlowOrMetaDataContent.$metadata$ = interfaceMeta('FlowOrMetaDataContent', [FlowOrMetaDataOrPhrasingContent, Tag]);
  function FlowOrInteractiveContent() {
  }
  FlowOrInteractiveContent.$metadata$ = interfaceMeta('FlowOrInteractiveContent', [FlowOrInteractiveOrPhrasingContent, Tag]);
  function FlowOrPhrasingContent() {
  }
  FlowOrPhrasingContent.$metadata$ = interfaceMeta('FlowOrPhrasingContent', [FlowOrInteractiveOrPhrasingContent, FlowOrMetaDataOrPhrasingContent, Tag]);
  function SectioningOrFlowContent() {
  }
  SectioningOrFlowContent.$metadata$ = interfaceMeta('SectioningOrFlowContent', [Tag]);
  function FlowOrInteractiveOrPhrasingContent() {
  }
  FlowOrInteractiveOrPhrasingContent.$metadata$ = interfaceMeta('FlowOrInteractiveOrPhrasingContent', [Tag]);
  function i$lambda() {
    return function ($this$null) {
      return Unit_getInstance();
    };
  }
  function h2$lambda() {
    return function ($this$null) {
      return Unit_getInstance();
    };
  }
  function a$lambda() {
    return function ($this$null) {
      return Unit_getInstance();
    };
  }
  function span$lambda() {
    return function ($this$null) {
      return Unit_getInstance();
    };
  }
  function h1$lambda() {
    return function ($this$null) {
      return Unit_getInstance();
    };
  }
  function img$lambda() {
    return function ($this$null) {
      return Unit_getInstance();
    };
  }
  function h4$lambda() {
    return function ($this$null) {
      return Unit_getInstance();
    };
  }
  function A(initialAttributes, consumer) {
    HTMLTag.call(this, 'a', consumer, initialAttributes, null, true, false);
    this.consumer_2 = consumer;
  }
  A.prototype.get_consumer_tu5133_k$ = function () {
    return this.consumer_2;
  };
  A.prototype.set_href_7eilw6_k$ = function (newValue) {
    get_attributeStringString().set_r65rse_k$(this, 'href', newValue);
  };
  A.prototype.get_href_wonh4k_k$ = function () {
    return get_attributeStringString().get_kdqgs6_k$(this, 'href');
  };
  A.prototype.set_target_rjuiv0_k$ = function (newValue) {
    get_attributeStringString().set_r65rse_k$(this, 'target', newValue);
  };
  A.prototype.get_target_juba8q_k$ = function () {
    return get_attributeStringString().get_kdqgs6_k$(this, 'target');
  };
  A.prototype.set_ping_wnmn31_k$ = function (newValue) {
    get_attributeStringString().set_r65rse_k$(this, 'ping', newValue);
  };
  A.prototype.get_ping_wosekb_k$ = function () {
    return get_attributeStringString().get_kdqgs6_k$(this, 'ping');
  };
  A.prototype.set_rel_uaep4a_k$ = function (newValue) {
    get_attributeStringString().set_r65rse_k$(this, 'rel', newValue);
  };
  A.prototype.get_rel_18ix1s_k$ = function () {
    return get_attributeStringString().get_kdqgs6_k$(this, 'rel');
  };
  A.prototype.set_hrefLang_r49nvg_k$ = function (newValue) {
    get_attributeStringString().set_r65rse_k$(this, 'hreflang', newValue);
  };
  A.prototype.get_hrefLang_etqpu_k$ = function () {
    return get_attributeStringString().get_kdqgs6_k$(this, 'hreflang');
  };
  A.prototype.set_type_cttd7p_k$ = function (newValue) {
    get_attributeStringString().set_r65rse_k$(this, 'type', newValue);
  };
  A.prototype.get_type_wovaf7_k$ = function () {
    return get_attributeStringString().get_kdqgs6_k$(this, 'type');
  };
  A.$metadata$ = classMeta('A', [CommonAttributeGroupFacadeFlowInteractivePhrasingContent], undefined, undefined, undefined, HTMLTag.prototype);
  function DIV(initialAttributes, consumer) {
    HTMLTag.call(this, 'div', consumer, initialAttributes, null, false, false);
    this.consumer_2 = consumer;
  }
  DIV.prototype.get_consumer_tu5133_k$ = function () {
    return this.consumer_2;
  };
  DIV.$metadata$ = classMeta('DIV', [HtmlBlockTag], undefined, undefined, undefined, HTMLTag.prototype);
  function H2(initialAttributes, consumer) {
    HTMLTag.call(this, 'h2', consumer, initialAttributes, null, false, false);
    this.consumer_2 = consumer;
  }
  H2.prototype.get_consumer_tu5133_k$ = function () {
    return this.consumer_2;
  };
  H2.$metadata$ = classMeta('H2', [CommonAttributeGroupFacadeFlowHeadingPhrasingContent], undefined, undefined, undefined, HTMLTag.prototype);
  function HEADER(initialAttributes, consumer) {
    HTMLTag.call(this, 'header', consumer, initialAttributes, null, false, false);
    this.consumer_2 = consumer;
  }
  HEADER.prototype.get_consumer_tu5133_k$ = function () {
    return this.consumer_2;
  };
  HEADER.$metadata$ = classMeta('HEADER', [HtmlBlockTag], undefined, undefined, undefined, HTMLTag.prototype);
  function H1(initialAttributes, consumer) {
    HTMLTag.call(this, 'h1', consumer, initialAttributes, null, false, false);
    this.consumer_2 = consumer;
  }
  H1.prototype.get_consumer_tu5133_k$ = function () {
    return this.consumer_2;
  };
  H1.$metadata$ = classMeta('H1', [CommonAttributeGroupFacadeFlowHeadingPhrasingContent], undefined, undefined, undefined, HTMLTag.prototype);
  function H4(initialAttributes, consumer) {
    HTMLTag.call(this, 'h4', consumer, initialAttributes, null, false, false);
    this.consumer_2 = consumer;
  }
  H4.prototype.get_consumer_tu5133_k$ = function () {
    return this.consumer_2;
  };
  H4.$metadata$ = classMeta('H4', [CommonAttributeGroupFacadeFlowHeadingPhrasingContent], undefined, undefined, undefined, HTMLTag.prototype);
  function IMG(initialAttributes, consumer) {
    HTMLTag.call(this, 'img', consumer, initialAttributes, null, true, true);
    this.consumer_2 = consumer;
  }
  IMG.prototype.get_consumer_tu5133_k$ = function () {
    return this.consumer_2;
  };
  IMG.prototype.set_alt_vr0wxm_k$ = function (newValue) {
    get_attributeStringString().set_r65rse_k$(this, 'alt', newValue);
  };
  IMG.prototype.get_alt_18j9hc_k$ = function () {
    return get_attributeStringString().get_kdqgs6_k$(this, 'alt');
  };
  IMG.prototype.set_src_70g1px_k$ = function (newValue) {
    get_attributeStringString().set_r65rse_k$(this, 'src', newValue);
  };
  IMG.prototype.get_src_18iw05_k$ = function () {
    return get_attributeStringString().get_kdqgs6_k$(this, 'src');
  };
  IMG.prototype.set_height_iaj1q_k$ = function (newValue) {
    get_attributeStringString().set_r65rse_k$(this, 'height', newValue);
  };
  IMG.prototype.get_height_e7t92o_k$ = function () {
    return get_attributeStringString().get_kdqgs6_k$(this, 'height');
  };
  IMG.prototype.set_width_bs5acp_k$ = function (newValue) {
    get_attributeStringString().set_r65rse_k$(this, 'width', newValue);
  };
  IMG.prototype.get_width_j0q4yl_k$ = function () {
    return get_attributeStringString().get_kdqgs6_k$(this, 'width');
  };
  IMG.prototype.set_usemap_wz0oo0_k$ = function (newValue) {
    get_attributeStringString().set_r65rse_k$(this, 'usemap', newValue);
  };
  IMG.prototype.get_usemap_kl10u6_k$ = function () {
    return get_attributeStringString().get_kdqgs6_k$(this, 'usemap');
  };
  IMG.prototype.set_ismap_rnpwuk_k$ = function (newValue) {
    get_attributeBooleanTicker().set_r65rse_k$(this, 'ismap', newValue);
  };
  IMG.prototype.get_ismap_it7kqx_k$ = function () {
    return get_attributeBooleanTicker().get_kdqgs6_k$(this, 'ismap');
  };
  IMG.$metadata$ = classMeta('IMG', [CommonAttributeGroupFacadeFlowInteractivePhrasingContent], undefined, undefined, undefined, HTMLTag.prototype);
  function I(initialAttributes, consumer) {
    HTMLTag.call(this, 'i', consumer, initialAttributes, null, true, false);
    this.consumer_2 = consumer;
  }
  I.prototype.get_consumer_tu5133_k$ = function () {
    return this.consumer_2;
  };
  I.$metadata$ = classMeta('I', [HtmlBlockInlineTag], undefined, undefined, undefined, HTMLTag.prototype);
  function LI(initialAttributes, consumer) {
    HTMLTag.call(this, 'li', consumer, initialAttributes, null, false, false);
    this.consumer_2 = consumer;
  }
  LI.prototype.get_consumer_tu5133_k$ = function () {
    return this.consumer_2;
  };
  LI.prototype.set_value_ic91ry_k$ = function (newValue) {
    get_attributeStringString().set_r65rse_k$(this, 'value', newValue);
  };
  LI.prototype.get_value_j01efc_k$ = function () {
    return get_attributeStringString().get_kdqgs6_k$(this, 'value');
  };
  LI.$metadata$ = classMeta('LI', [HtmlBlockTag], undefined, undefined, undefined, HTMLTag.prototype);
  function PRE(initialAttributes, consumer) {
    HTMLTag.call(this, 'pre', consumer, initialAttributes, null, false, false);
    this.consumer_2 = consumer;
  }
  PRE.prototype.get_consumer_tu5133_k$ = function () {
    return this.consumer_2;
  };
  PRE.$metadata$ = classMeta('PRE', [HtmlBlockInlineTag], undefined, undefined, undefined, HTMLTag.prototype);
  function P(initialAttributes, consumer) {
    HTMLTag.call(this, 'p', consumer, initialAttributes, null, false, false);
    this.consumer_2 = consumer;
  }
  P.prototype.get_consumer_tu5133_k$ = function () {
    return this.consumer_2;
  };
  P.$metadata$ = classMeta('P', [HtmlBlockInlineTag], undefined, undefined, undefined, HTMLTag.prototype);
  function SPAN(initialAttributes, consumer) {
    HTMLTag.call(this, 'span', consumer, initialAttributes, null, true, false);
    this.consumer_2 = consumer;
  }
  SPAN.prototype.get_consumer_tu5133_k$ = function () {
    return this.consumer_2;
  };
  SPAN.$metadata$ = classMeta('SPAN', [HtmlBlockInlineTag], undefined, undefined, undefined, HTMLTag.prototype);
  function UL(initialAttributes, consumer) {
    HTMLTag.call(this, 'ul', consumer, initialAttributes, null, false, false);
    this.consumer_2 = consumer;
  }
  UL.prototype.get_consumer_tu5133_k$ = function () {
    return this.consumer_2;
  };
  UL.$metadata$ = classMeta('UL', [HtmlBlockTag], undefined, undefined, undefined, HTMLTag.prototype);
  function li(_this__u8e3s4, classes, block) {
    var tmp$ret$0;
    {
      var tmp0_visit = new LI(attributesMapOf_0('class', classes), _this__u8e3s4.get_consumer_tu5133_k$());
      tmp0_visit.get_consumer_tu5133_k$().onTagStart_jhb705_k$(tmp0_visit);
      var tmp;
      try {
        tmp = block(tmp0_visit);
      } catch ($p) {
        var tmp_0;
        if ($p instanceof Error) {
          tmp_0 = tmp0_visit.get_consumer_tu5133_k$().onTagError_d07vof_k$(tmp0_visit, $p);
        } else {
          throw $p;
        }
        tmp = tmp_0;
      }
      finally {
        tmp0_visit.get_consumer_tu5133_k$().onTagEnd_f3ehek_k$(tmp0_visit);
      }
      tmp$ret$0 = tmp;
    }
    return tmp$ret$0;
  }
  function li$lambda() {
    return function ($this$null) {
      return Unit_getInstance();
    };
  }
  function HTMLTag_init_$Init$(tagName, consumer, initialAttributes, namespace, inlineTag, emptyTag, $mask0, $marker, $this) {
    if (!(($mask0 & 8) === 0))
      namespace = null;
    HTMLTag.call($this, tagName, consumer, initialAttributes, namespace, inlineTag, emptyTag);
    return $this;
  }
  function HTMLTag_init_$Create$(tagName, consumer, initialAttributes, namespace, inlineTag, emptyTag, $mask0, $marker) {
    return HTMLTag_init_$Init$(tagName, consumer, initialAttributes, namespace, inlineTag, emptyTag, $mask0, $marker, Object.create(HTMLTag.prototype));
  }
  function HTMLTag$attributes$lambda(this$0) {
    return function () {
      return this$0.get_consumer_tu5133_k$();
    };
  }
  function HTMLTag(tagName, consumer, initialAttributes, namespace, inlineTag, emptyTag) {
    this.tagName_1 = tagName;
    this.consumer_1 = consumer;
    this.namespace_1 = namespace;
    this.inlineTag_1 = inlineTag;
    this.emptyTag_1 = emptyTag;
    var tmp = this;
    tmp.attributes_1 = new DelegatingMap(initialAttributes, this, HTMLTag$attributes$lambda(this));
  }
  HTMLTag.prototype.get_tagName_ocsgis_k$ = function () {
    return this.tagName_1;
  };
  HTMLTag.prototype.get_consumer_tu5133_k$ = function () {
    return this.consumer_1;
  };
  HTMLTag.prototype.get_namespace_t826ya_k$ = function () {
    return this.namespace_1;
  };
  HTMLTag.prototype.get_inlineTag_rqc19k_k$ = function () {
    return this.inlineTag_1;
  };
  HTMLTag.prototype.get_emptyTag_bxtkiy_k$ = function () {
    return this.emptyTag_1;
  };
  HTMLTag.prototype.get_attributes_dgqof4_k$ = function () {
    return this.attributes_1;
  };
  HTMLTag.prototype.get_attributesEntries_pdb5ow_k$ = function () {
    return this.get_attributes_dgqof4_k$().get_immutableEntries_iyyb1z_k$();
  };
  HTMLTag.$metadata$ = classMeta('HTMLTag', [Tag]);
  function get_AVERAGE_PAGE_SIZE() {
    init_properties_stream_kt_xpbxtm();
    return AVERAGE_PAGE_SIZE;
  }
  var AVERAGE_PAGE_SIZE;
  function get_escapeMap() {
    init_properties_stream_kt_xpbxtm();
    return escapeMap;
  }
  var escapeMap;
  function get_letterRangeLowerCase() {
    init_properties_stream_kt_xpbxtm();
    return letterRangeLowerCase;
  }
  var letterRangeLowerCase;
  function get_letterRangeUpperCase() {
    init_properties_stream_kt_xpbxtm();
    return letterRangeUpperCase;
  }
  var letterRangeUpperCase;
  function get_digitRange() {
    init_properties_stream_kt_xpbxtm();
    return digitRange;
  }
  var digitRange;
  var properties_initialized_stream_kt_27o15u;
  function init_properties_stream_kt_xpbxtm() {
    if (properties_initialized_stream_kt_27o15u) {
    } else {
      properties_initialized_stream_kt_27o15u = true;
      AVERAGE_PAGE_SIZE = 32768;
      var tmp$ret$6;
      {
        var tmp0_let = mapOf([to(new Char(_Char___init__impl__6a9atx(60)), '&lt;'), to(new Char(_Char___init__impl__6a9atx(62)), '&gt;'), to(new Char(_Char___init__impl__6a9atx(38)), '&amp;'), to(new Char(_Char___init__impl__6a9atx(34)), '&quot;')]);
        {
        }
        var tmp$ret$5;
        {
          var tmp$ret$2;
          {
            var tmp0_map = tmp0_let.get_keys_wop4xp_k$();
            var tmp$ret$1;
            {
              var tmp0_mapTo = ArrayList_init_$Create$_0(collectionSizeOrDefault(tmp0_map, 10));
              var tmp0_iterator = tmp0_map.iterator_jk1svi_k$();
              while (tmp0_iterator.hasNext_bitz1p_k$()) {
                var item = tmp0_iterator.next_20eer_k$().value_1;
                var tmp$ret$0;
                {
                  tmp$ret$0 = Char__toInt_impl_vasixd(item);
                }
                tmp0_mapTo.add_1j60pz_k$(tmp$ret$0);
              }
              tmp$ret$1 = tmp0_mapTo;
            }
            tmp$ret$2 = tmp$ret$1;
          }
          var tmp0_elvis_lhs = maxOrNull(tmp$ret$2);
          var maxCode = tmp0_elvis_lhs == null ? -1 : tmp0_elvis_lhs;
          var tmp = 0;
          var tmp_0 = maxCode + 1 | 0;
          var tmp$ret$3;
          {
            tmp$ret$3 = fillArrayVal(Array(tmp_0), null);
          }
          var tmp_1 = tmp$ret$3;
          while (tmp < tmp_0) {
            var tmp_2 = tmp;
            var tmp$ret$4;
            {
              tmp$ret$4 = tmp0_let.get_1mhr4y_k$(new Char(numberToChar(tmp_2)));
            }
            tmp_1[tmp_2] = tmp$ret$4;
            tmp = tmp + 1 | 0;
          }
          tmp$ret$5 = tmp_1;
        }
        tmp$ret$6 = tmp$ret$5;
      }
      escapeMap = tmp$ret$6;
      letterRangeLowerCase = Char__rangeTo_impl_tkncvp(_Char___init__impl__6a9atx(97), _Char___init__impl__6a9atx(122));
      letterRangeUpperCase = Char__rangeTo_impl_tkncvp(_Char___init__impl__6a9atx(65), _Char___init__impl__6a9atx(90));
      digitRange = Char__rangeTo_impl_tkncvp(_Char___init__impl__6a9atx(48), _Char___init__impl__6a9atx(57));
    }
  }
  function visitTag(_this__u8e3s4, block) {
    _this__u8e3s4.get_consumer_tu5133_k$().onTagStart_jhb705_k$(_this__u8e3s4);
    try {
      block(_this__u8e3s4);
    } catch ($p) {
      if ($p instanceof Error) {
        _this__u8e3s4.get_consumer_tu5133_k$().onTagError_d07vof_k$(_this__u8e3s4, $p);
      } else {
        throw $p;
      }
    }
    finally {
      _this__u8e3s4.get_consumer_tu5133_k$().onTagEnd_f3ehek_k$(_this__u8e3s4);
    }
  }
  function visitTagAndFinalize(_this__u8e3s4, consumer, block) {
    if (!(_this__u8e3s4.get_consumer_tu5133_k$() === consumer)) {
      throw IllegalArgumentException_init_$Create$('Wrong exception');
    }
    {
      _this__u8e3s4.get_consumer_tu5133_k$().onTagStart_jhb705_k$(_this__u8e3s4);
      try {
        block(_this__u8e3s4);
      } catch ($p) {
        if ($p instanceof Error) {
          _this__u8e3s4.get_consumer_tu5133_k$().onTagError_d07vof_k$(_this__u8e3s4, $p);
        } else {
          throw $p;
        }
      }
      finally {
        _this__u8e3s4.get_consumer_tu5133_k$().onTagEnd_f3ehek_k$(_this__u8e3s4);
      }
    }
    return consumer.finalize_b9lof6_k$();
  }
  function append(_this__u8e3s4, block) {
    var tmp$ret$1;
    {
      var tmp0_let = ArrayList_init_$Create$();
      {
      }
      var tmp$ret$0;
      {
        var tmp = createTree(get_ownerDocumentExt(_this__u8e3s4));
        block(onFinalize(tmp, append$lambda(tmp0_let, _this__u8e3s4)));
        tmp$ret$0 = tmp0_let;
      }
      tmp$ret$1 = tmp$ret$0;
    }
    return tmp$ret$1;
  }
  function createTree(_this__u8e3s4) {
    return new JSDOMBuilder(_this__u8e3s4);
  }
  function get_ownerDocumentExt(_this__u8e3s4) {
    var tmp;
    if (_this__u8e3s4 instanceof Document) {
      tmp = _this__u8e3s4;
    } else {
      var tmp0_elvis_lhs = _this__u8e3s4.ownerDocument;
      var tmp_0;
      if (tmp0_elvis_lhs == null) {
        throw IllegalStateException_init_$Create$('Node has no ownerDocument');
      } else {
        tmp_0 = tmp0_elvis_lhs;
      }
      tmp = tmp_0;
    }
    return tmp;
  }
  function _get_path__dbvv7q($this) {
    return $this.path_1;
  }
  function _set_lastLeaved__fv9jck($this, _set____db54di) {
    $this.lastLeaved_1 = _set____db54di;
  }
  function _get_lastLeaved__t0y7c($this) {
    return $this.lastLeaved_1;
  }
  function asR(_this__u8e3s4, $this) {
    var tmp$ret$0;
    {
      tmp$ret$0 = _this__u8e3s4;
    }
    return tmp$ret$0;
  }
  function JSDOMBuilder(document) {
    this.document_1 = document;
    var tmp = this;
    var tmp$ret$0;
    {
      tmp$ret$0 = ArrayList_init_$Create$();
    }
    tmp.path_1 = tmp$ret$0;
    this.lastLeaved_1 = null;
  }
  JSDOMBuilder.prototype.get_document_hjw2l8_k$ = function () {
    return this.document_1;
  };
  JSDOMBuilder.prototype.onTagStart_jhb705_k$ = function (tag) {
    var tmp;
    if (!(tag.get_namespace_t826ya_k$() == null)) {
      var tmp$ret$0;
      {
        var tmp0_asDynamic = this.document_1.createElementNS(ensureNotNull(tag.get_namespace_t826ya_k$()), tag.get_tagName_ocsgis_k$());
        tmp$ret$0 = tmp0_asDynamic;
      }
      tmp = tmp$ret$0;
    } else {
      var tmp_0 = this.document_1.createElement(tag.get_tagName_ocsgis_k$());
      tmp = tmp_0 instanceof HTMLElement ? tmp_0 : THROW_CCE();
    }
    var element = tmp;
    {
      var tmp1_forEach = tag.get_attributesEntries_pdb5ow_k$();
      var tmp0_iterator = tmp1_forEach.iterator_jk1svi_k$();
      while (tmp0_iterator.hasNext_bitz1p_k$()) {
        var element_0 = tmp0_iterator.next_20eer_k$();
        {
          element.setAttribute(element_0.get_key_18j28a_k$(), element_0.get_value_j01efc_k$());
        }
      }
    }
    var tmp$ret$1;
    {
      var tmp2_isNotEmpty = this.path_1;
      tmp$ret$1 = !tmp2_isNotEmpty.isEmpty_y1axqb_k$();
    }
    if (tmp$ret$1) {
      last(this.path_1).appendChild(element);
    }
    this.path_1.add_1j60pz_k$(element);
  };
  JSDOMBuilder.prototype.onTagAttributeChange_agii2c_k$ = function (tag, attribute, value) {
    if (this.path_1.isEmpty_y1axqb_k$())
      throw IllegalStateException_init_$Create$('No current tag');
    else {
      var tmp$ret$1;
      {
        var tmp0_toLowerCase = last(this.path_1).tagName;
        var tmp$ret$0;
        {
          tmp$ret$0 = tmp0_toLowerCase;
        }
        tmp$ret$1 = tmp$ret$0.toLowerCase();
      }
      var tmp = tmp$ret$1;
      var tmp$ret$3;
      {
        var tmp1_toLowerCase = tag.get_tagName_ocsgis_k$();
        var tmp$ret$2;
        {
          tmp$ret$2 = tmp1_toLowerCase;
        }
        tmp$ret$3 = tmp$ret$2.toLowerCase();
      }
      if (!(tmp === tmp$ret$3))
        throw IllegalStateException_init_$Create$('Wrong current tag');
      else {
        var tmp$ret$4;
        {
          var tmp2_let = last(this.path_1);
          {
          }
          var tmp_0;
          if (value == null) {
            tmp_0 = tmp2_let.removeAttribute(attribute);
          } else {
            tmp_0 = tmp2_let.setAttribute(attribute, value);
          }
          tmp$ret$4 = tmp_0;
        }
      }
    }
  };
  JSDOMBuilder.prototype.onTagEvent_k2irjc_k$ = function (tag, event, value) {
    if (this.path_1.isEmpty_y1axqb_k$())
      throw IllegalStateException_init_$Create$('No current tag');
    else {
      var tmp$ret$1;
      {
        var tmp0_toLowerCase = last(this.path_1).tagName;
        var tmp$ret$0;
        {
          tmp$ret$0 = tmp0_toLowerCase;
        }
        tmp$ret$1 = tmp$ret$0.toLowerCase();
      }
      var tmp = tmp$ret$1;
      var tmp$ret$3;
      {
        var tmp1_toLowerCase = tag.get_tagName_ocsgis_k$();
        var tmp$ret$2;
        {
          tmp$ret$2 = tmp1_toLowerCase;
        }
        tmp$ret$3 = tmp$ret$2.toLowerCase();
      }
      if (!(tmp === tmp$ret$3))
        throw IllegalStateException_init_$Create$('Wrong current tag');
      else {
        var tmp2_setEvent = last(this.path_1);
        var tmp$ret$4;
        {
          tmp$ret$4 = tmp2_setEvent;
        }
        tmp$ret$4[event] = value;
      }
    }
  };
  JSDOMBuilder.prototype.onTagEnd_f3ehek_k$ = function (tag) {
    var tmp;
    if (this.path_1.isEmpty_y1axqb_k$()) {
      tmp = true;
    } else {
      var tmp$ret$1;
      {
        var tmp0_toLowerCase = last(this.path_1).tagName;
        var tmp$ret$0;
        {
          tmp$ret$0 = tmp0_toLowerCase;
        }
        tmp$ret$1 = tmp$ret$0.toLowerCase();
      }
      var tmp_0 = tmp$ret$1;
      var tmp$ret$3;
      {
        var tmp1_toLowerCase = tag.get_tagName_ocsgis_k$();
        var tmp$ret$2;
        {
          tmp$ret$2 = tmp1_toLowerCase;
        }
        tmp$ret$3 = tmp$ret$2.toLowerCase();
      }
      tmp = !(tmp_0 === tmp$ret$3);
    }
    if (tmp) {
      throw IllegalStateException_init_$Create$("We haven't entered tag " + tag.get_tagName_ocsgis_k$() + ' but trying to leave');
    }
    this.lastLeaved_1 = this.path_1.removeAt_qvpkxi_k$(get_lastIndex(this.path_1));
  };
  JSDOMBuilder.prototype.onTagContent_8k5bde_k$ = function (content) {
    if (this.path_1.isEmpty_y1axqb_k$()) {
      throw IllegalStateException_init_$Create$('No current DOM node');
    }
    last(this.path_1).appendChild(this.document_1.createTextNode(toString(content)));
  };
  JSDOMBuilder.prototype.onTagContentEntity_uzz4te_k$ = function (entity) {
    if (this.path_1.isEmpty_y1axqb_k$()) {
      throw IllegalStateException_init_$Create$('No current DOM node');
    }
    var tmp = this.document_1.createElement('span');
    var s = tmp instanceof HTMLElement ? tmp : THROW_CCE();
    s.innerHTML = entity.get_text_wouvsm_k$();
    var tmp_0 = last(this.path_1);
    var tmp$ret$2;
    {
      var tmp0_filter = asList(s.childNodes);
      var tmp$ret$1;
      {
        var tmp0_filterTo = ArrayList_init_$Create$();
        var tmp0_iterator = tmp0_filter.iterator_jk1svi_k$();
        while (tmp0_iterator.hasNext_bitz1p_k$()) {
          var element = tmp0_iterator.next_20eer_k$();
          var tmp$ret$0;
          {
            tmp$ret$0 = element.nodeType === Node.TEXT_NODE;
          }
          if (tmp$ret$0) {
            tmp0_filterTo.add_1j60pz_k$(element);
          }
        }
        tmp$ret$1 = tmp0_filterTo;
      }
      tmp$ret$2 = tmp$ret$1;
    }
    tmp_0.appendChild(first(tmp$ret$2));
  };
  JSDOMBuilder.prototype.onTagContentUnsafe_4xcoiz_k$ = function (block) {
    var tmp$ret$0;
    {
      var tmp0_with = new DefaultUnsafe();
      {
      }
      block(tmp0_with);
      var tmp0_this = last(this.path_1);
      tmp$ret$0 = tmp0_this.innerHTML = tmp0_this.innerHTML + tmp0_with.toString();
    }
  };
  JSDOMBuilder.prototype.onTagComment_dfi7y0_k$ = function (content) {
    if (this.path_1.isEmpty_y1axqb_k$()) {
      throw IllegalStateException_init_$Create$('No current DOM node');
    }
    last(this.path_1).appendChild(this.document_1.createComment(toString(content)));
  };
  JSDOMBuilder.prototype.finalize_b9lof6_k$ = function () {
    var tmp0_safe_receiver = this.lastLeaved_1;
    var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : asR(tmp0_safe_receiver, this);
    var tmp;
    if (tmp1_elvis_lhs == null) {
      throw IllegalStateException_init_$Create$("We can't finalize as there was no tags");
    } else {
      tmp = tmp1_elvis_lhs;
    }
    return tmp;
  };
  JSDOMBuilder.$metadata$ = classMeta('JSDOMBuilder', [TagConsumer]);
  function setEvent(_this__u8e3s4, name, callback) {
    var tmp$ret$0;
    {
      tmp$ret$0 = _this__u8e3s4;
    }
    tmp$ret$0[name] = callback;
  }
  function append$lambda($tmp0_let, $this_append) {
    return function (it, partial) {
      var tmp;
      if (!partial) {
        $tmp0_let.add_1j60pz_k$(it);
        $this_append.appendChild(it);
        tmp = Unit_getInstance();
      }
      return Unit_getInstance();
    };
  }
  function div_1(_this__u8e3s4, classes, block) {
    var tmp$ret$1;
    {
      var tmp0_visitAndFinalize = new DIV(attributesMapOf_0('class', classes), _this__u8e3s4);
      var tmp$ret$0;
      {
        if (!(tmp0_visitAndFinalize.get_consumer_tu5133_k$() === _this__u8e3s4)) {
          throw IllegalArgumentException_init_$Create$('Wrong exception');
        }
        {
          tmp0_visitAndFinalize.get_consumer_tu5133_k$().onTagStart_jhb705_k$(tmp0_visitAndFinalize);
          try {
            {
              block(tmp0_visitAndFinalize);
            }
          } catch ($p) {
            if ($p instanceof Error) {
              tmp0_visitAndFinalize.get_consumer_tu5133_k$().onTagError_d07vof_k$(tmp0_visitAndFinalize, $p);
            } else {
              throw $p;
            }
          }
          finally {
            tmp0_visitAndFinalize.get_consumer_tu5133_k$().onTagEnd_f3ehek_k$(tmp0_visitAndFinalize);
          }
        }
        tmp$ret$0 = _this__u8e3s4.finalize_b9lof6_k$();
      }
      tmp$ret$1 = tmp$ret$0;
    }
    var tmp = tmp$ret$1;
    return tmp instanceof HTMLDivElement ? tmp : THROW_CCE();
  }
  function pre(_this__u8e3s4, classes, block) {
    var tmp$ret$1;
    {
      var tmp0_visitAndFinalize = new PRE(attributesMapOf_0('class', classes), _this__u8e3s4);
      var tmp$ret$0;
      {
        if (!(tmp0_visitAndFinalize.get_consumer_tu5133_k$() === _this__u8e3s4)) {
          throw IllegalArgumentException_init_$Create$('Wrong exception');
        }
        {
          tmp0_visitAndFinalize.get_consumer_tu5133_k$().onTagStart_jhb705_k$(tmp0_visitAndFinalize);
          try {
            {
              block(tmp0_visitAndFinalize);
            }
          } catch ($p) {
            if ($p instanceof Error) {
              tmp0_visitAndFinalize.get_consumer_tu5133_k$().onTagError_d07vof_k$(tmp0_visitAndFinalize, $p);
            } else {
              throw $p;
            }
          }
          finally {
            tmp0_visitAndFinalize.get_consumer_tu5133_k$().onTagEnd_f3ehek_k$(tmp0_visitAndFinalize);
          }
        }
        tmp$ret$0 = _this__u8e3s4.finalize_b9lof6_k$();
      }
      tmp$ret$1 = tmp$ret$0;
    }
    var tmp = tmp$ret$1;
    return tmp instanceof HTMLPreElement ? tmp : THROW_CCE();
  }
  function div$lambda_1() {
    return function ($this$null) {
      return Unit_getInstance();
    };
  }
  function pre$lambda() {
    return function ($this$null) {
      return Unit_getInstance();
    };
  }
  //region block: post-declaration
  DefaultUnsafe.prototype.unaryPlus_31ug2c_k$ = unaryPlus_1;
  DefaultUnsafe.prototype.raw_fk4viu_k$ = raw;
  DefaultUnsafe.prototype.raw_koj3az_k$ = raw_0;
  DefaultUnsafe.prototype.raw_3fzlqm_k$ = raw_1;
  StringEncoder.prototype.empty_mnkn29_k$ = empty;
  BooleanEncoder.prototype.empty_mnkn29_k$ = empty;
  TickerEncoder.prototype.empty_mnkn29_k$ = empty;
  EnumEncoder.prototype.empty_mnkn29_k$ = empty;
  HTMLTag.prototype.unaryPlus_31ug2c_k$ = unaryPlus;
  HTMLTag.prototype.unaryPlus_g7ydph_k$ = unaryPlus_0;
  HTMLTag.prototype.text_yddl45_k$ = text;
  HTMLTag.prototype.text_ojl72r_k$ = text_0;
  HTMLTag.prototype.entity_uznif4_k$ = entity;
  HTMLTag.prototype.comment_mqs0p9_k$ = comment;
  A.prototype.unaryPlus_31ug2c_k$ = unaryPlus;
  A.prototype.unaryPlus_g7ydph_k$ = unaryPlus_0;
  A.prototype.text_yddl45_k$ = text;
  A.prototype.text_ojl72r_k$ = text_0;
  A.prototype.entity_uznif4_k$ = entity;
  A.prototype.comment_mqs0p9_k$ = comment;
  DIV.prototype.unaryPlus_31ug2c_k$ = unaryPlus;
  DIV.prototype.unaryPlus_g7ydph_k$ = unaryPlus_0;
  DIV.prototype.text_yddl45_k$ = text;
  DIV.prototype.text_ojl72r_k$ = text_0;
  DIV.prototype.entity_uznif4_k$ = entity;
  DIV.prototype.comment_mqs0p9_k$ = comment;
  H2.prototype.unaryPlus_31ug2c_k$ = unaryPlus;
  H2.prototype.unaryPlus_g7ydph_k$ = unaryPlus_0;
  H2.prototype.text_yddl45_k$ = text;
  H2.prototype.text_ojl72r_k$ = text_0;
  H2.prototype.entity_uznif4_k$ = entity;
  H2.prototype.comment_mqs0p9_k$ = comment;
  HEADER.prototype.unaryPlus_31ug2c_k$ = unaryPlus;
  HEADER.prototype.unaryPlus_g7ydph_k$ = unaryPlus_0;
  HEADER.prototype.text_yddl45_k$ = text;
  HEADER.prototype.text_ojl72r_k$ = text_0;
  HEADER.prototype.entity_uznif4_k$ = entity;
  HEADER.prototype.comment_mqs0p9_k$ = comment;
  H1.prototype.unaryPlus_31ug2c_k$ = unaryPlus;
  H1.prototype.unaryPlus_g7ydph_k$ = unaryPlus_0;
  H1.prototype.text_yddl45_k$ = text;
  H1.prototype.text_ojl72r_k$ = text_0;
  H1.prototype.entity_uznif4_k$ = entity;
  H1.prototype.comment_mqs0p9_k$ = comment;
  H4.prototype.unaryPlus_31ug2c_k$ = unaryPlus;
  H4.prototype.unaryPlus_g7ydph_k$ = unaryPlus_0;
  H4.prototype.text_yddl45_k$ = text;
  H4.prototype.text_ojl72r_k$ = text_0;
  H4.prototype.entity_uznif4_k$ = entity;
  H4.prototype.comment_mqs0p9_k$ = comment;
  IMG.prototype.unaryPlus_31ug2c_k$ = unaryPlus;
  IMG.prototype.unaryPlus_g7ydph_k$ = unaryPlus_0;
  IMG.prototype.text_yddl45_k$ = text;
  IMG.prototype.text_ojl72r_k$ = text_0;
  IMG.prototype.entity_uznif4_k$ = entity;
  IMG.prototype.comment_mqs0p9_k$ = comment;
  I.prototype.unaryPlus_31ug2c_k$ = unaryPlus;
  I.prototype.unaryPlus_g7ydph_k$ = unaryPlus_0;
  I.prototype.text_yddl45_k$ = text;
  I.prototype.text_ojl72r_k$ = text_0;
  I.prototype.entity_uznif4_k$ = entity;
  I.prototype.comment_mqs0p9_k$ = comment;
  LI.prototype.unaryPlus_31ug2c_k$ = unaryPlus;
  LI.prototype.unaryPlus_g7ydph_k$ = unaryPlus_0;
  LI.prototype.text_yddl45_k$ = text;
  LI.prototype.text_ojl72r_k$ = text_0;
  LI.prototype.entity_uznif4_k$ = entity;
  LI.prototype.comment_mqs0p9_k$ = comment;
  PRE.prototype.unaryPlus_31ug2c_k$ = unaryPlus;
  PRE.prototype.unaryPlus_g7ydph_k$ = unaryPlus_0;
  PRE.prototype.text_yddl45_k$ = text;
  PRE.prototype.text_ojl72r_k$ = text_0;
  PRE.prototype.entity_uznif4_k$ = entity;
  PRE.prototype.comment_mqs0p9_k$ = comment;
  P.prototype.unaryPlus_31ug2c_k$ = unaryPlus;
  P.prototype.unaryPlus_g7ydph_k$ = unaryPlus_0;
  P.prototype.text_yddl45_k$ = text;
  P.prototype.text_ojl72r_k$ = text_0;
  P.prototype.entity_uznif4_k$ = entity;
  P.prototype.comment_mqs0p9_k$ = comment;
  SPAN.prototype.unaryPlus_31ug2c_k$ = unaryPlus;
  SPAN.prototype.unaryPlus_g7ydph_k$ = unaryPlus_0;
  SPAN.prototype.text_yddl45_k$ = text;
  SPAN.prototype.text_ojl72r_k$ = text_0;
  SPAN.prototype.entity_uznif4_k$ = entity;
  SPAN.prototype.comment_mqs0p9_k$ = comment;
  UL.prototype.unaryPlus_31ug2c_k$ = unaryPlus;
  UL.prototype.unaryPlus_g7ydph_k$ = unaryPlus_0;
  UL.prototype.text_yddl45_k$ = text;
  UL.prototype.text_ojl72r_k$ = text_0;
  UL.prototype.entity_uznif4_k$ = entity;
  UL.prototype.comment_mqs0p9_k$ = comment;
  JSDOMBuilder.prototype.onTagError_d07vof_k$ = onTagError;
  //endregion
  //region block: exports
  _.$_$ = _.$_$ || {};
  _.$_$.a = append;
  _.$_$.b = A;
  _.$_$.c = DIV;
  _.$_$.d = H1;
  _.$_$.e = H2;
  _.$_$.f = H4;
  _.$_$.g = HEADER;
  _.$_$.h = IMG;
  _.$_$.i = I;
  _.$_$.j = LI;
  _.$_$.k = PRE;
  _.$_$.l = P;
  _.$_$.m = SPAN;
  _.$_$.n = UL;
  _.$_$.o = attributesMapOf;
  _.$_$.p = attributesMapOf_0;
  _.$_$.q = set_role;
  _.$_$.r = set_style;
  _.$_$.s = set_title;
  //endregion
  return _;
}));

//# sourceMappingURL=kotlin_org_jetbrains_kotlinx_kotlinx_html.js.map