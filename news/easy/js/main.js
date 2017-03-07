
'use strict';

requirejs.config({
  baseUrl: 'js',

  // Path mappings for the logical module names
  paths:
      //injector:mainReleasePaths
          {
            "knockout": "libs/knockout/knockout-3.4.0",
            "jquery": "libs/jquery/jquery-3.1.0.min",
            "jqueryui-amd": "libs/jquery/jqueryui-amd-1.12.0.min",
            "promise": "libs/es6-promise/es6-promise.min",
            "hammerjs": "libs/hammer/hammer-2.0.8.min",
            "ojdnd": "libs/dnd-polyfill/dnd-polyfill-1.0.0.min",
            "ojs": "libs/oj/v2.3.0/min",
            "ojL10n": "libs/oj/v2.3.0/ojL10n",
            "ojtranslations": "libs/oj/v2.3.0/resources",
            "text": "libs/require/text",
            "signals": "libs/js-signals/signals.min",
            "css": "libs/require-css/css.min"
          }
      //endinjector
      ,
      // Shim configurations for modules that do not expose AMD
      shim:
          {
            'jquery':
                {
                  exports: ['jQuery', '$']
                }
          }
    }
);

require(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton',
  'ojs/ojlistview', 'ojs/ojarraytabledatasource'],
    function (oj, ko, $) {

      function makeNewsDataUrl(lang, date, id) {
        return 'https://newswebeasy.github.io/' + lang + '/news/easy/data/' + date.replace(/-/g, '/') + '/' + id + '.json';
      }
      
      function ViewModel() {
        var self = this;

        var p = location.hash.split(':');
        var date = p[0].substr(1);
        var id = p[1];

        self.title = ko.observableArray();
        self.outline = ko.observable();
        self.content = ko.observable();
        self.translator = ko.observable();
        self.ready = ko.observable(false);

        self.source = ko.pureComputed(function () {
          return 'http://www3.nhk.or.jp/news/easy/' + id + '/' + id + '.html';
        });

        var jqXHR = $.getJSON(makeNewsDataUrl('zh-CN', date, id));
        jqXHR.fail(
            function (xhr, message, error)
            {
              oj.Logger.error(error);
            }
        ).then(
            function (data) {
              self.title(data.title);
              self.outline(data.outline);
              self.content(data.content);
              self.translator(data.translator || 'Google');
              self.ready(true);

              adjustContentPadding();
            }
        );
      }

      function adjustContentPadding() {
        var topElem = document.getElementsByClassName('oj-applayout-fixed-top')[0];
        var contentElem = document.getElementsByClassName('oj-applayout-content')[0];
        var bottomElem = document.getElementsByClassName('oj-applayout-fixed-bottom')[0];

        if (topElem) {
          contentElem.style.paddingTop = topElem.offsetHeight + 'px';
        }
        if (bottomElem) {
          contentElem.style.paddingBottom = bottomElem.clientHeight + 'px';
        }

        contentElem.classList.add('oj-complete');
      }

      $(document).ready(function () {
        ko.applyBindings(new ViewModel(), document.getElementById('page'));
      });
    });
