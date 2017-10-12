(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.VueDummy = factory());
}(this, (function () { 'use strict';

// Future Support
//import DummyJs from 'dummyjs'

var DummyJS = (function () {

  var _rand = function (min, max) {
    if(!min || !max) { return min; }
    min = Math.floor(min);
    max = Math.floor(max) + 1;
    return Math.floor(Math.random() * (max - min)) + min;
  };

  // repeat polyfill
  var _repeat = function (str, count) {
    return ''.repeat ? ('' + str).repeat(count) : (function (str, count, rpt) {
      for (var i = 0; i < count; i++) { rpt += str; }

      return rpt;
    })(str + '', Math.floor(count), '');
  };

  var text = function (argString) {
    var wordCount = argString.split(',');
    wordCount = _rand(wordCount[0], wordCount[1]) || 10;

    var lib = 'lorem ipsum dolor sit amet consectetur adipiscing elit nunc euismod vel ' +
      'dolor nec viverra nullam auctor enim condimentum odio laoreet libero ' +
      'libero tincidunt est sagittis curabitur vitae';

    if(wordCount > 3) { lib += (' ' + 'a in id id at'); }

    var libRepeat = Math.ceil(wordCount/lib.split(' ').length);

    lib = _repeat(lib, libRepeat).split(' ').sort(function () { return 0.5 - Math.random(); }).slice(0, wordCount).join(' ');

    return lib.charAt(0).toUpperCase() + lib.slice(1);
  };

  var src = function (argString, el) {
    var size = '404';

    if(argString) {
      size = argString;
    } else if(el) {
      size = [parseInt(el.getAttribute('width') || el.offsetWidth), parseInt(el.getAttribute('height') || el.offsetHeight)].filter(function (v) {return !!v}).join('x');
      size =  size || (el.parentNode && el.parentNode.offsetWidth) || '404';
    }

    // split size to allow for random ranges
    size = (size + '').split('x').map(function (a){ return _rand(a.split(',')[0], a.split(',')[1]); });

    var w = size[0];
    var h = (size[1]||size[0]);
    var text = (el.getAttribute('data-text') || (w + '×' + h));
    var bgColor = (el.getAttribute('data-color') || '#ccc');
    var textColor = (el.getAttribute('data-text-color') || '#888');
    var fontSize = (w / 3.5 / (text.length * 0.3)) - text.length;

    return 'data:image/svg+xml,'
      + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="'+ w + 'px" height="' + h + 'px">'
      + '<rect x="0" y="0" width="100%" height="100%" fill="' + bgColor + '"/>'
      + '<line opacity="0.5" x1="0%" y1="0%" x2="100%" y2="100%" stroke="' + textColor + '" stroke-width="2" />'
      + '<line opacity="0.5" x1="100%" y1="0%" x2="0%" y2="100%" stroke="' + textColor + '" stroke-width="2" />'
      + '<text stroke="' + bgColor + '" stroke-width="2em" x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" font-size="'+fontSize+'">' + text + '</text>'
      + '<text fill="' + textColor + '" x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" font-size="'+fontSize+'" font-family="sans-serif">' + text + '</text>'
      + '</svg>');
  };

  return {
    text: text,
    src: src
  };
})();


var Plugin = function () {};

Plugin.install = function (Vue, options) {
  if (Plugin.installed) {
    return;
  }

  var directive = function (el, binding) {
    if(!el) {
      return;
    }

    var args = (typeof binding.value == 'string' ? binding.value : binding.expression) || '';

    if(el.nodeName.toLowerCase() === 'img') {
      el.src = DummyJS.src(args, el);
    } else {
      el.innerHTML += DummyJS.text(args);
    }
  };

  Vue.directive('dummy', {
    // called when the bound element has been inserted into its parent node
    inserted: directive
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Plugin);
}

return Plugin;

})));