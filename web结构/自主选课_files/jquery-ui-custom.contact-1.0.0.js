/*! jQuery UI - v1.12.0 - 2016-07-15
 * http://jqueryui.com
 * Includes: widget.js, position.js, data.js, disable-selection.js, focusable.js, form-reset-mixin.js, jquery-1-7.js, keycode.js, labels.js, scroll-parent.js, tabbable.js, unique-id.js, widgets/draggable.js, widgets/droppable.js, widgets/resizable.js, widgets/selectable.js, widgets/sortable.js, widgets/mouse.js
 * Copyright jQuery Foundation and other contributors; Licensed MIT */

(function(t) {
  "function" == typeof define && define.amd ? define(["jquery"], t) : t(jQuery);
})(function(t) {
  function e(t) {
    for (var e = t.css("visibility"); "inherit" === e; )
      (t = t.parent()), (e = t.css("visibility"));
    return "hidden" !== e;
  }
  (t.ui = t.ui || {}), (t.ui.version = "1.12.0");
  var i = 0,
    s = Array.prototype.slice;
  (t.cleanData = (function(e) {
    return function(i) {
      var s, n, o;
      for (o = 0; null != (n = i[o]); o++)
        try {
          (s = t._data(n, "events")),
            s && s.remove && t(n).triggerHandler("remove");
        } catch (a) {}
      e(i);
    };
  })(t.cleanData)),
    (t.widget = function(e, i, s) {
      var n,
        o,
        a,
        r = {},
        h = e.split(".")[0];
      e = e.split(".")[1];
      var l = h + "-" + e;
      return (
        s || ((s = i), (i = t.Widget)),
        t.isArray(s) && (s = t.extend.apply(null, [{}].concat(s))),
        (t.expr[":"][l.toLowerCase()] = function(e) {
          return !!t.data(e, l);
        }),
        (t[h] = t[h] || {}),
        (n = t[h][e]),
        (o = t[h][e] = function(t, e) {
          return this._createWidget
            ? (arguments.length && this._createWidget(t, e), void 0)
            : new o(t, e);
        }),
        t.extend(o, n, {
          version: s.version,
          _proto: t.extend({}, s),
          _childConstructors: []
        }),
        (a = new i()),
        (a.options = t.widget.extend({}, a.options)),
        t.each(s, function(e, s) {
          return t.isFunction(s)
            ? ((r[e] = (function() {
                function t() {
                  return i.prototype[e].apply(this, arguments);
                }
                function n(t) {
                  return i.prototype[e].apply(this, t);
                }
                return function() {
                  var e,
                    i = this._super,
                    o = this._superApply;
                  return (
                    (this._super = t),
                    (this._superApply = n),
                    (e = s.apply(this, arguments)),
                    (this._super = i),
                    (this._superApply = o),
                    e
                  );
                };
              })()),
              void 0)
            : ((r[e] = s), void 0);
        }),
        (o.prototype = t.widget.extend(
          a,
          { widgetEventPrefix: n ? a.widgetEventPrefix || e : e },
          r,
          { constructor: o, namespace: h, widgetName: e, widgetFullName: l }
        )),
        n
          ? (t.each(n._childConstructors, function(e, i) {
              var s = i.prototype;
              t.widget(s.namespace + "." + s.widgetName, o, i._proto);
            }),
            delete n._childConstructors)
          : i._childConstructors.push(o),
        t.widget.bridge(e, o),
        o
      );
    }),
    (t.widget.extend = function(e) {
      for (var i, n, o = s.call(arguments, 1), a = 0, r = o.length; r > a; a++)
        for (i in o[a])
          (n = o[a][i]),
            o[a].hasOwnProperty(i) &&
              void 0 !== n &&
              (e[i] = t.isPlainObject(n)
                ? t.isPlainObject(e[i])
                  ? t.widget.extend({}, e[i], n)
                  : t.widget.extend({}, n)
                : n);
      return e;
    }),
    (t.widget.bridge = function(e, i) {
      var n = i.prototype.widgetFullName || e;
      t.fn[e] = function(o) {
        var a = "string" == typeof o,
          r = s.call(arguments, 1),
          h = this;
        return (
          a
            ? this.each(function() {
                var i,
                  s = t.data(this, n);
                return "instance" === o
                  ? ((h = s), !1)
                  : s
                  ? t.isFunction(s[o]) && "_" !== o.charAt(0)
                    ? ((i = s[o].apply(s, r)),
                      i !== s && void 0 !== i
                        ? ((h = i && i.jquery ? h.pushStack(i.get()) : i), !1)
                        : void 0)
                    : t.error(
                        "no such method '" +
                          o +
                          "' for " +
                          e +
                          " widget instance"
                      )
                  : t.error(
                      "cannot call methods on " +
                        e +
                        " prior to initialization; " +
                        "attempted to call method '" +
                        o +
                        "'"
                    );
              })
            : (r.length && (o = t.widget.extend.apply(null, [o].concat(r))),
              this.each(function() {
                var e = t.data(this, n);
                e
                  ? (e.option(o || {}), e._init && e._init())
                  : t.data(this, n, new i(o, this));
              })),
          h
        );
      };
    }),
    (t.Widget = function() {}),
    (t.Widget._childConstructors = []),
    (t.Widget.prototype = {
      widgetName: "widget",
      widgetEventPrefix: "",
      defaultElement: "<div>",
      options: { classes: {}, disabled: !1, create: null },
      _createWidget: function(e, s) {
        (s = t(s || this.defaultElement || this)[0]),
          (this.element = t(s)),
          (this.uuid = i++),
          (this.eventNamespace = "." + this.widgetName + this.uuid),
          (this.bindings = t()),
          (this.hoverable = t()),
          (this.focusable = t()),
          (this.classesElementLookup = {}),
          s !== this &&
            (t.data(s, this.widgetFullName, this),
            this._on(!0, this.element, {
              remove: function(t) {
                t.target === s && this.destroy();
              }
            }),
            (this.document = t(s.style ? s.ownerDocument : s.document || s)),
            (this.window = t(
              this.document[0].defaultView || this.document[0].parentWindow
            ))),
          (this.options = t.widget.extend(
            {},
            this.options,
            this._getCreateOptions(),
            e
          )),
          this._create(),
          this.options.disabled &&
            this._setOptionDisabled(this.options.disabled),
          this._trigger("create", null, this._getCreateEventData()),
          this._init();
      },
      _getCreateOptions: function() {
        return {};
      },
      _getCreateEventData: t.noop,
      _create: t.noop,
      _init: t.noop,
      destroy: function() {
        var e = this;
        this._destroy(),
          t.each(this.classesElementLookup, function(t, i) {
            e._removeClass(i, t);
          }),
          this.element.off(this.eventNamespace).removeData(this.widgetFullName),
          this.widget()
            .off(this.eventNamespace)
            .removeAttr("aria-disabled"),
          this.bindings.off(this.eventNamespace);
      },
      _destroy: t.noop,
      widget: function() {
        return this.element;
      },
      option: function(e, i) {
        var s,
          n,
          o,
          a = e;
        if (0 === arguments.length) return t.widget.extend({}, this.options);
        if ("string" == typeof e)
          if (((a = {}), (s = e.split(".")), (e = s.shift()), s.length)) {
            for (
              n = a[e] = t.widget.extend({}, this.options[e]), o = 0;
              s.length - 1 > o;
              o++
            )
              (n[s[o]] = n[s[o]] || {}), (n = n[s[o]]);
            if (((e = s.pop()), 1 === arguments.length))
              return void 0 === n[e] ? null : n[e];
            n[e] = i;
          } else {
            if (1 === arguments.length)
              return void 0 === this.options[e] ? null : this.options[e];
            a[e] = i;
          }
        return this._setOptions(a), this;
      },
      _setOptions: function(t) {
        var e;
        for (e in t) this._setOption(e, t[e]);
        return this;
      },
      _setOption: function(t, e) {
        return (
          "classes" === t && this._setOptionClasses(e),
          (this.options[t] = e),
          "disabled" === t && this._setOptionDisabled(e),
          this
        );
      },
      _setOptionClasses: function(e) {
        var i, s, n;
        for (i in e)
          (n = this.classesElementLookup[i]),
            e[i] !== this.options.classes[i] &&
              n &&
              n.length &&
              ((s = t(n.get())),
              this._removeClass(n, i),
              s.addClass(
                this._classes({ element: s, keys: i, classes: e, add: !0 })
              ));
      },
      _setOptionDisabled: function(t) {
        this._toggleClass(
          this.widget(),
          this.widgetFullName + "-disabled",
          null,
          !!t
        ),
          t &&
            (this._removeClass(this.hoverable, null, "ui-state-hover"),
            this._removeClass(this.focusable, null, "ui-state-focus"));
      },
      enable: function() {
        return this._setOptions({ disabled: !1 });
      },
      disable: function() {
        return this._setOptions({ disabled: !0 });
      },
      _classes: function(e) {
        function i(i, o) {
          var a, r;
          for (r = 0; i.length > r; r++)
            (a = n.classesElementLookup[i[r]] || t()),
              (a = e.add
                ? t(t.unique(a.get().concat(e.element.get())))
                : t(a.not(e.element).get())),
              (n.classesElementLookup[i[r]] = a),
              s.push(i[r]),
              o && e.classes[i[r]] && s.push(e.classes[i[r]]);
        }
        var s = [],
          n = this;
        return (
          (e = t.extend(
            { element: this.element, classes: this.options.classes || {} },
            e
          )),
          e.keys && i(e.keys.match(/\S+/g) || [], !0),
          e.extra && i(e.extra.match(/\S+/g) || []),
          s.join(" ")
        );
      },
      _removeClass: function(t, e, i) {
        return this._toggleClass(t, e, i, !1);
      },
      _addClass: function(t, e, i) {
        return this._toggleClass(t, e, i, !0);
      },
      _toggleClass: function(t, e, i, s) {
        s = "boolean" == typeof s ? s : i;
        var n = "string" == typeof t || null === t,
          o = {
            extra: n ? e : i,
            keys: n ? t : e,
            element: n ? this.element : t,
            add: s
          };
        return o.element.toggleClass(this._classes(o), s), this;
      },
      _on: function(e, i, s) {
        var n,
          o = this;
        "boolean" != typeof e && ((s = i), (i = e), (e = !1)),
          s
            ? ((i = n = t(i)), (this.bindings = this.bindings.add(i)))
            : ((s = i), (i = this.element), (n = this.widget())),
          t.each(s, function(s, a) {
            function r() {
              return e ||
                (o.options.disabled !== !0 &&
                  !t(this).hasClass("ui-state-disabled"))
                ? ("string" == typeof a ? o[a] : a).apply(o, arguments)
                : void 0;
            }
            "string" != typeof a &&
              (r.guid = a.guid = a.guid || r.guid || t.guid++);
            var h = s.match(/^([\w:-]*)\s*(.*)$/),
              l = h[1] + o.eventNamespace,
              c = h[2];
            c ? n.on(l, c, r) : i.on(l, r);
          });
      },
      _off: function(e, i) {
        (i =
          (i || "").split(" ").join(this.eventNamespace + " ") +
          this.eventNamespace),
          e.off(i).off(i),
          (this.bindings = t(this.bindings.not(e).get())),
          (this.focusable = t(this.focusable.not(e).get())),
          (this.hoverable = t(this.hoverable.not(e).get()));
      },
      _delay: function(t, e) {
        function i() {
          return ("string" == typeof t ? s[t] : t).apply(s, arguments);
        }
        var s = this;
        return setTimeout(i, e || 0);
      },
      _hoverable: function(e) {
        (this.hoverable = this.hoverable.add(e)),
          this._on(e, {
            mouseenter: function(e) {
              this._addClass(t(e.currentTarget), null, "ui-state-hover");
            },
            mouseleave: function(e) {
              this._removeClass(t(e.currentTarget), null, "ui-state-hover");
            }
          });
      },
      _focusable: function(e) {
        (this.focusable = this.focusable.add(e)),
          this._on(e, {
            focusin: function(e) {
              this._addClass(t(e.currentTarget), null, "ui-state-focus");
            },
            focusout: function(e) {
              this._removeClass(t(e.currentTarget), null, "ui-state-focus");
            }
          });
      },
      _trigger: function(e, i, s) {
        var n,
          o,
          a = this.options[e];
        if (
          ((s = s || {}),
          (i = t.Event(i)),
          (i.type = (e === this.widgetEventPrefix
            ? e
            : this.widgetEventPrefix + e
          ).toLowerCase()),
          (i.target = this.element[0]),
          (o = i.originalEvent))
        )
          for (n in o) n in i || (i[n] = o[n]);
        return (
          this.element.trigger(i, s),
          !(
            (t.isFunction(a) &&
              a.apply(this.element[0], [i].concat(s)) === !1) ||
            i.isDefaultPrevented()
          )
        );
      }
    }),
    t.each({ show: "fadeIn", hide: "fadeOut" }, function(e, i) {
      t.Widget.prototype["_" + e] = function(s, n, o) {
        "string" == typeof n && (n = { effect: n });
        var a,
          r = n ? (n === !0 || "number" == typeof n ? i : n.effect || i) : e;
        (n = n || {}),
          "number" == typeof n && (n = { duration: n }),
          (a = !t.isEmptyObject(n)),
          (n.complete = o),
          n.delay && s.delay(n.delay),
          a && t.effects && t.effects.effect[r]
            ? s[e](n)
            : r !== e && s[r]
            ? s[r](n.duration, n.easing, o)
            : s.queue(function(i) {
                t(this)[e](), o && o.call(s[0]), i();
              });
      };
    }),
    t.widget,
    (function() {
      function e(t, e, i) {
        return [
          parseFloat(t[0]) * (p.test(t[0]) ? e / 100 : 1),
          parseFloat(t[1]) * (p.test(t[1]) ? i / 100 : 1)
        ];
      }
      function i(e, i) {
        return parseInt(t.css(e, i), 10) || 0;
      }
      function s(e) {
        var i = e[0];
        return 9 === i.nodeType
          ? {
              width: e.width(),
              height: e.height(),
              offset: { top: 0, left: 0 }
            }
          : t.isWindow(i)
          ? {
              width: e.width(),
              height: e.height(),
              offset: { top: e.scrollTop(), left: e.scrollLeft() }
            }
          : i.preventDefault
          ? { width: 0, height: 0, offset: { top: i.pageY, left: i.pageX } }
          : {
              width: e.outerWidth(),
              height: e.outerHeight(),
              offset: e.offset()
            };
      }
      var n,
        o,
        a = Math.max,
        r = Math.abs,
        h = Math.round,
        l = /left|center|right/,
        c = /top|center|bottom/,
        u = /[\+\-]\d+(\.[\d]+)?%?/,
        d = /^\w+/,
        p = /%$/,
        f = t.fn.position;
      (o = function() {
        var e = t("<div>")
            .css("position", "absolute")
            .appendTo("body")
            .offset({ top: 1.5, left: 1.5 }),
          i = 1.5 === e.offset().top;
        return (
          e.remove(),
          (o = function() {
            return i;
          }),
          i
        );
      }),
        (t.position = {
          scrollbarWidth: function() {
            if (void 0 !== n) return n;
            var e,
              i,
              s = t(
                "<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"
              ),
              o = s.children()[0];
            return (
              t("body").append(s),
              (e = o.offsetWidth),
              s.css("overflow", "scroll"),
              (i = o.offsetWidth),
              e === i && (i = s[0].clientWidth),
              s.remove(),
              (n = e - i)
            );
          },
          getScrollInfo: function(e) {
            var i =
                e.isWindow || e.isDocument ? "" : e.element.css("overflow-x"),
              s = e.isWindow || e.isDocument ? "" : e.element.css("overflow-y"),
              n =
                "scroll" === i ||
                ("auto" === i && e.width < e.element[0].scrollWidth),
              o =
                "scroll" === s ||
                ("auto" === s && e.height < e.element[0].scrollHeight);
            return {
              width: o ? t.position.scrollbarWidth() : 0,
              height: n ? t.position.scrollbarWidth() : 0
            };
          },
          getWithinInfo: function(e) {
            var i = t(e || window),
              s = t.isWindow(i[0]),
              n = !!i[0] && 9 === i[0].nodeType,
              o = !s && !n;
            return {
              element: i,
              isWindow: s,
              isDocument: n,
              offset: o ? t(e).offset() : { left: 0, top: 0 },
              scrollLeft: i.scrollLeft(),
              scrollTop: i.scrollTop(),
              width: i.outerWidth(),
              height: i.outerHeight()
            };
          }
        }),
        (t.fn.position = function(n) {
          if (!n || !n.of) return f.apply(this, arguments);
          n = t.extend({}, n);
          var p,
            g,
            m,
            _,
            v,
            b,
            y = t(n.of),
            w = t.position.getWithinInfo(n.within),
            k = t.position.getScrollInfo(w),
            x = (n.collision || "flip").split(" "),
            C = {};
          return (
            (b = s(y)),
            y[0].preventDefault && (n.at = "left top"),
            (g = b.width),
            (m = b.height),
            (_ = b.offset),
            (v = t.extend({}, _)),
            t.each(["my", "at"], function() {
              var t,
                e,
                i = (n[this] || "").split(" ");
              1 === i.length &&
                (i = l.test(i[0])
                  ? i.concat(["center"])
                  : c.test(i[0])
                  ? ["center"].concat(i)
                  : ["center", "center"]),
                (i[0] = l.test(i[0]) ? i[0] : "center"),
                (i[1] = c.test(i[1]) ? i[1] : "center"),
                (t = u.exec(i[0])),
                (e = u.exec(i[1])),
                (C[this] = [t ? t[0] : 0, e ? e[0] : 0]),
                (n[this] = [d.exec(i[0])[0], d.exec(i[1])[0]]);
            }),
            1 === x.length && (x[1] = x[0]),
            "right" === n.at[0]
              ? (v.left += g)
              : "center" === n.at[0] && (v.left += g / 2),
            "bottom" === n.at[1]
              ? (v.top += m)
              : "center" === n.at[1] && (v.top += m / 2),
            (p = e(C.at, g, m)),
            (v.left += p[0]),
            (v.top += p[1]),
            this.each(function() {
              var s,
                l,
                c = t(this),
                u = c.outerWidth(),
                d = c.outerHeight(),
                f = i(this, "marginLeft"),
                b = i(this, "marginTop"),
                D = u + f + i(this, "marginRight") + k.width,
                I = d + b + i(this, "marginBottom") + k.height,
                T = t.extend({}, v),
                P = e(C.my, c.outerWidth(), c.outerHeight());
              "right" === n.my[0]
                ? (T.left -= u)
                : "center" === n.my[0] && (T.left -= u / 2),
                "bottom" === n.my[1]
                  ? (T.top -= d)
                  : "center" === n.my[1] && (T.top -= d / 2),
                (T.left += P[0]),
                (T.top += P[1]),
                o() || ((T.left = h(T.left)), (T.top = h(T.top))),
                (s = { marginLeft: f, marginTop: b }),
                t.each(["left", "top"], function(e, i) {
                  t.ui.position[x[e]] &&
                    t.ui.position[x[e]][i](T, {
                      targetWidth: g,
                      targetHeight: m,
                      elemWidth: u,
                      elemHeight: d,
                      collisionPosition: s,
                      collisionWidth: D,
                      collisionHeight: I,
                      offset: [p[0] + P[0], p[1] + P[1]],
                      my: n.my,
                      at: n.at,
                      within: w,
                      elem: c
                    });
                }),
                n.using &&
                  (l = function(t) {
                    var e = _.left - T.left,
                      i = e + g - u,
                      s = _.top - T.top,
                      o = s + m - d,
                      h = {
                        target: {
                          element: y,
                          left: _.left,
                          top: _.top,
                          width: g,
                          height: m
                        },
                        element: {
                          element: c,
                          left: T.left,
                          top: T.top,
                          width: u,
                          height: d
                        },
                        horizontal: 0 > i ? "left" : e > 0 ? "right" : "center",
                        vertical: 0 > o ? "top" : s > 0 ? "bottom" : "middle"
                      };
                    u > g && g > r(e + i) && (h.horizontal = "center"),
                      d > m && m > r(s + o) && (h.vertical = "middle"),
                      (h.important =
                        a(r(e), r(i)) > a(r(s), r(o))
                          ? "horizontal"
                          : "vertical"),
                      n.using.call(this, t, h);
                  }),
                c.offset(t.extend(T, { using: l }));
            })
          );
        }),
        (t.ui.position = {
          fit: {
            left: function(t, e) {
              var i,
                s = e.within,
                n = s.isWindow ? s.scrollLeft : s.offset.left,
                o = s.width,
                r = t.left - e.collisionPosition.marginLeft,
                h = n - r,
                l = r + e.collisionWidth - o - n;
              e.collisionWidth > o
                ? h > 0 && 0 >= l
                  ? ((i = t.left + h + e.collisionWidth - o - n),
                    (t.left += h - i))
                  : (t.left =
                      l > 0 && 0 >= h
                        ? n
                        : h > l
                        ? n + o - e.collisionWidth
                        : n)
                : h > 0
                ? (t.left += h)
                : l > 0
                ? (t.left -= l)
                : (t.left = a(t.left - r, t.left));
            },
            top: function(t, e) {
              var i,
                s = e.within,
                n = s.isWindow ? s.scrollTop : s.offset.top,
                o = e.within.height,
                r = t.top - e.collisionPosition.marginTop,
                h = n - r,
                l = r + e.collisionHeight - o - n;
              e.collisionHeight > o
                ? h > 0 && 0 >= l
                  ? ((i = t.top + h + e.collisionHeight - o - n),
                    (t.top += h - i))
                  : (t.top =
                      l > 0 && 0 >= h
                        ? n
                        : h > l
                        ? n + o - e.collisionHeight
                        : n)
                : h > 0
                ? (t.top += h)
                : l > 0
                ? (t.top -= l)
                : (t.top = a(t.top - r, t.top));
            }
          },
          flip: {
            left: function(t, e) {
              var i,
                s,
                n = e.within,
                o = n.offset.left + n.scrollLeft,
                a = n.width,
                h = n.isWindow ? n.scrollLeft : n.offset.left,
                l = t.left - e.collisionPosition.marginLeft,
                c = l - h,
                u = l + e.collisionWidth - a - h,
                d =
                  "left" === e.my[0]
                    ? -e.elemWidth
                    : "right" === e.my[0]
                    ? e.elemWidth
                    : 0,
                p =
                  "left" === e.at[0]
                    ? e.targetWidth
                    : "right" === e.at[0]
                    ? -e.targetWidth
                    : 0,
                f = -2 * e.offset[0];
              0 > c
                ? ((i = t.left + d + p + f + e.collisionWidth - a - o),
                  (0 > i || r(c) > i) && (t.left += d + p + f))
                : u > 0 &&
                  ((s =
                    t.left - e.collisionPosition.marginLeft + d + p + f - h),
                  (s > 0 || u > r(s)) && (t.left += d + p + f));
            },
            top: function(t, e) {
              var i,
                s,
                n = e.within,
                o = n.offset.top + n.scrollTop,
                a = n.height,
                h = n.isWindow ? n.scrollTop : n.offset.top,
                l = t.top - e.collisionPosition.marginTop,
                c = l - h,
                u = l + e.collisionHeight - a - h,
                d = "top" === e.my[1],
                p = d ? -e.elemHeight : "bottom" === e.my[1] ? e.elemHeight : 0,
                f =
                  "top" === e.at[1]
                    ? e.targetHeight
                    : "bottom" === e.at[1]
                    ? -e.targetHeight
                    : 0,
                g = -2 * e.offset[1];
              0 > c
                ? ((s = t.top + p + f + g + e.collisionHeight - a - o),
                  (0 > s || r(c) > s) && (t.top += p + f + g))
                : u > 0 &&
                  ((i = t.top - e.collisionPosition.marginTop + p + f + g - h),
                  (i > 0 || u > r(i)) && (t.top += p + f + g));
            }
          },
          flipfit: {
            left: function() {
              t.ui.position.flip.left.apply(this, arguments),
                t.ui.position.fit.left.apply(this, arguments);
            },
            top: function() {
              t.ui.position.flip.top.apply(this, arguments),
                t.ui.position.fit.top.apply(this, arguments);
            }
          }
        });
    })(),
    t.ui.position,
    t.extend(t.expr[":"], {
      data: t.expr.createPseudo
        ? t.expr.createPseudo(function(e) {
            return function(i) {
              return !!t.data(i, e);
            };
          })
        : function(e, i, s) {
            return !!t.data(e, s[3]);
          }
    }),
    t.fn.extend({
      disableSelection: (function() {
        var t =
          "onselectstart" in document.createElement("div")
            ? "selectstart"
            : "mousedown";
        return function() {
          return this.on(t + ".ui-disableSelection", function(t) {
            t.preventDefault();
          });
        };
      })(),
      enableSelection: function() {
        return this.off(".ui-disableSelection");
      }
    }),
    (t.ui.focusable = function(i, s) {
      var n,
        o,
        a,
        r,
        h,
        l = i.nodeName.toLowerCase();
      return "area" === l
        ? ((n = i.parentNode),
          (o = n.name),
          i.href && o && "map" === n.nodeName.toLowerCase()
            ? ((a = t("img[usemap='#" + o + "']")),
              a.length > 0 && a.is(":visible"))
            : !1)
        : (/^(input|select|textarea|button|object)$/.test(l)
            ? ((r = !i.disabled),
              r && ((h = t(i).closest("fieldset")[0]), h && (r = !h.disabled)))
            : (r = "a" === l ? i.href || s : s),
          r && t(i).is(":visible") && e(t(i)));
    }),
    t.extend(t.expr[":"], {
      focusable: function(e) {
        return t.ui.focusable(e, null != t.attr(e, "tabindex"));
      }
    }),
    t.ui.focusable,
    (t.fn.form = function() {
      return "string" == typeof this[0].form
        ? this.closest("form")
        : t(this[0].form);
    }),
    (t.ui.formResetMixin = {
      _formResetHandler: function() {
        var e = t(this);
        setTimeout(function() {
          var i = e.data("ui-form-reset-instances");
          t.each(i, function() {
            this.refresh();
          });
        });
      },
      _bindFormResetHandler: function() {
        if (((this.form = this.element.form()), this.form.length)) {
          var t = this.form.data("ui-form-reset-instances") || [];
          t.length ||
            this.form.on("reset.ui-form-reset", this._formResetHandler),
            t.push(this),
            this.form.data("ui-form-reset-instances", t);
        }
      },
      _unbindFormResetHandler: function() {
        if (this.form.length) {
          var e = this.form.data("ui-form-reset-instances");
          e.splice(t.inArray(this, e), 1),
            e.length
              ? this.form.data("ui-form-reset-instances", e)
              : this.form
                  .removeData("ui-form-reset-instances")
                  .off("reset.ui-form-reset");
        }
      }
    }),
    "1.7" === t.fn.jquery.substring(0, 3) &&
      (t.each(["Width", "Height"], function(e, i) {
        function s(e, i, s, o) {
          return (
            t.each(n, function() {
              (i -= parseFloat(t.css(e, "padding" + this)) || 0),
                s &&
                  (i -= parseFloat(t.css(e, "border" + this + "Width")) || 0),
                o && (i -= parseFloat(t.css(e, "margin" + this)) || 0);
            }),
            i
          );
        }
        var n = "Width" === i ? ["Left", "Right"] : ["Top", "Bottom"],
          o = i.toLowerCase(),
          a = {
            innerWidth: t.fn.innerWidth,
            innerHeight: t.fn.innerHeight,
            outerWidth: t.fn.outerWidth,
            outerHeight: t.fn.outerHeight
          };
        (t.fn["inner" + i] = function(e) {
          return void 0 === e
            ? a["inner" + i].call(this)
            : this.each(function() {
                t(this).css(o, s(this, e) + "px");
              });
        }),
          (t.fn["outer" + i] = function(e, n) {
            return "number" != typeof e
              ? a["outer" + i].call(this, e)
              : this.each(function() {
                  t(this).css(o, s(this, e, !0, n) + "px");
                });
          });
      }),
      (t.fn.addBack = function(t) {
        return this.add(
          null == t ? this.prevObject : this.prevObject.filter(t)
        );
      })),
    (t.ui.keyCode = {
      BACKSPACE: 8,
      COMMA: 188,
      DELETE: 46,
      DOWN: 40,
      END: 35,
      ENTER: 13,
      ESCAPE: 27,
      HOME: 36,
      LEFT: 37,
      PAGE_DOWN: 34,
      PAGE_UP: 33,
      PERIOD: 190,
      RIGHT: 39,
      SPACE: 32,
      TAB: 9,
      UP: 38
    }),
    (t.ui.escapeSelector = (function() {
      var t = /([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g;
      return function(e) {
        return e.replace(t, "\\$1");
      };
    })()),
    (t.fn.labels = function() {
      var e, i, s, n, o;
      return this[0].labels && this[0].labels.length
        ? this.pushStack(this[0].labels)
        : ((n = this.eq(0).parents("label")),
          (s = this.attr("id")),
          s &&
            ((e = this.eq(0)
              .parents()
              .last()),
            (o = e.add(e.length ? e.siblings() : this.siblings())),
            (i = "label[for='" + t.ui.escapeSelector(s) + "']"),
            (n = n.add(o.find(i).addBack(i)))),
          this.pushStack(n));
    }),
    (t.fn.scrollParent = function(e) {
      var i = this.css("position"),
        s = "absolute" === i,
        n = e ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
        o = this.parents()
          .filter(function() {
            var e = t(this);
            return s && "static" === e.css("position")
              ? !1
              : n.test(
                  e.css("overflow") + e.css("overflow-y") + e.css("overflow-x")
                );
          })
          .eq(0);
      return "fixed" !== i && o.length
        ? o
        : t(this[0].ownerDocument || document);
    }),
    t.extend(t.expr[":"], {
      tabbable: function(e) {
        var i = t.attr(e, "tabindex"),
          s = null != i;
        return (!s || i >= 0) && t.ui.focusable(e, s);
      }
    }),
    t.fn.extend({
      uniqueId: (function() {
        var t = 0;
        return function() {
          return this.each(function() {
            this.id || (this.id = "ui-id-" + ++t);
          });
        };
      })(),
      removeUniqueId: function() {
        return this.each(function() {
          /^ui-id-\d+$/.test(this.id) && t(this).removeAttr("id");
        });
      }
    }),
    (t.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()));
  var n = !1;
  t(document).on("mouseup", function() {
    n = !1;
  }),
    t.widget("ui.mouse", {
      version: "1.12.0",
      options: {
        cancel: "input, textarea, button, select, option",
        distance: 1,
        delay: 0
      },
      _mouseInit: function() {
        var e = this;
        this.element
          .on("mousedown." + this.widgetName, function(t) {
            return e._mouseDown(t);
          })
          .on("click." + this.widgetName, function(i) {
            return !0 === t.data(i.target, e.widgetName + ".preventClickEvent")
              ? (t.removeData(i.target, e.widgetName + ".preventClickEvent"),
                i.stopImmediatePropagation(),
                !1)
              : void 0;
          }),
          (this.started = !1);
      },
      _mouseDestroy: function() {
        this.element.off("." + this.widgetName),
          this._mouseMoveDelegate &&
            this.document
              .off("mousemove." + this.widgetName, this._mouseMoveDelegate)
              .off("mouseup." + this.widgetName, this._mouseUpDelegate);
      },
      _mouseDown: function(e) {
        if (!n) {
          (this._mouseMoved = !1),
            this._mouseStarted && this._mouseUp(e),
            (this._mouseDownEvent = e);
          var i = this,
            s = 1 === e.which,
            o =
              "string" == typeof this.options.cancel && e.target.nodeName
                ? t(e.target).closest(this.options.cancel).length
                : !1;
          return s && !o && this._mouseCapture(e)
            ? ((this.mouseDelayMet = !this.options.delay),
              this.mouseDelayMet ||
                (this._mouseDelayTimer = setTimeout(function() {
                  i.mouseDelayMet = !0;
                }, this.options.delay)),
              this._mouseDistanceMet(e) &&
              this._mouseDelayMet(e) &&
              ((this._mouseStarted = this._mouseStart(e) !== !1),
              !this._mouseStarted)
                ? (e.preventDefault(), !0)
                : (!0 ===
                    t.data(e.target, this.widgetName + ".preventClickEvent") &&
                    t.removeData(
                      e.target,
                      this.widgetName + ".preventClickEvent"
                    ),
                  (this._mouseMoveDelegate = function(t) {
                    return i._mouseMove(t);
                  }),
                  (this._mouseUpDelegate = function(t) {
                    return i._mouseUp(t);
                  }),
                  this.document
                    .on("mousemove." + this.widgetName, this._mouseMoveDelegate)
                    .on("mouseup." + this.widgetName, this._mouseUpDelegate),
                  e.preventDefault(),
                  (n = !0),
                  !0))
            : !0;
        }
      },
      _mouseMove: function(e) {
        if (this._mouseMoved) {
          if (
            t.ui.ie &&
            (!document.documentMode || 9 > document.documentMode) &&
            !e.button
          )
            return this._mouseUp(e);
          if (!e.which)
            if (
              e.originalEvent.altKey ||
              e.originalEvent.ctrlKey ||
              e.originalEvent.metaKey ||
              e.originalEvent.shiftKey
            )
              this.ignoreMissingWhich = !0;
            else if (!this.ignoreMissingWhich) return this._mouseUp(e);
        }
        return (
          (e.which || e.button) && (this._mouseMoved = !0),
          this._mouseStarted
            ? (this._mouseDrag(e), e.preventDefault())
            : (this._mouseDistanceMet(e) &&
                this._mouseDelayMet(e) &&
                ((this._mouseStarted =
                  this._mouseStart(this._mouseDownEvent, e) !== !1),
                this._mouseStarted ? this._mouseDrag(e) : this._mouseUp(e)),
              !this._mouseStarted)
        );
      },
      _mouseUp: function(e) {
        this.document
          .off("mousemove." + this.widgetName, this._mouseMoveDelegate)
          .off("mouseup." + this.widgetName, this._mouseUpDelegate),
          this._mouseStarted &&
            ((this._mouseStarted = !1),
            e.target === this._mouseDownEvent.target &&
              t.data(e.target, this.widgetName + ".preventClickEvent", !0),
            this._mouseStop(e)),
          this._mouseDelayTimer &&
            (clearTimeout(this._mouseDelayTimer), delete this._mouseDelayTimer),
          (this.ignoreMissingWhich = !1),
          (n = !1),
          e.preventDefault();
      },
      _mouseDistanceMet: function(t) {
        return (
          Math.max(
            Math.abs(this._mouseDownEvent.pageX - t.pageX),
            Math.abs(this._mouseDownEvent.pageY - t.pageY)
          ) >= this.options.distance
        );
      },
      _mouseDelayMet: function() {
        return this.mouseDelayMet;
      },
      _mouseStart: function() {},
      _mouseDrag: function() {},
      _mouseStop: function() {},
      _mouseCapture: function() {
        return !0;
      }
    }),
    (t.ui.plugin = {
      add: function(e, i, s) {
        var n,
          o = t.ui[e].prototype;
        for (n in s)
          (o.plugins[n] = o.plugins[n] || []), o.plugins[n].push([i, s[n]]);
      },
      call: function(t, e, i, s) {
        var n,
          o = t.plugins[e];
        if (
          o &&
          (s ||
            (t.element[0].parentNode &&
              11 !== t.element[0].parentNode.nodeType))
        )
          for (n = 0; o.length > n; n++)
            t.options[o[n][0]] && o[n][1].apply(t.element, i);
      }
    }),
    (t.ui.safeActiveElement = function(t) {
      var e;
      try {
        e = t.activeElement;
      } catch (i) {
        e = t.body;
      }
      return e || (e = t.body), e.nodeName || (e = t.body), e;
    }),
    (t.ui.safeBlur = function(e) {
      e && "body" !== e.nodeName.toLowerCase() && t(e).trigger("blur");
    }),
    t.widget("ui.draggable", t.ui.mouse, {
      version: "1.12.0",
      widgetEventPrefix: "drag",
      options: {
        addClasses: !0,
        appendTo: "parent",
        axis: !1,
        connectToSortable: !1,
        containment: !1,
        cursor: "auto",
        cursorAt: !1,
        grid: !1,
        handle: !1,
        helper: "original",
        iframeFix: !1,
        opacity: !1,
        refreshPositions: !1,
        revert: !1,
        revertDuration: 500,
        scope: "default",
        scroll: !0,
        scrollSensitivity: 20,
        scrollSpeed: 20,
        snap: !1,
        snapMode: "both",
        snapTolerance: 20,
        stack: !1,
        zIndex: !1,
        drag: null,
        start: null,
        stop: null
      },
      _create: function() {
        "original" === this.options.helper && this._setPositionRelative(),
          this.options.addClasses && this._addClass("ui-draggable"),
          this._setHandleClassName(),
          this._mouseInit();
      },
      _setOption: function(t, e) {
        this._super(t, e),
          "handle" === t &&
            (this._removeHandleClassName(), this._setHandleClassName());
      },
      _destroy: function() {
        return (this.helper || this.element).is(".ui-draggable-dragging")
          ? ((this.destroyOnClear = !0), void 0)
          : (this._removeHandleClassName(), this._mouseDestroy(), void 0);
      },
      _mouseCapture: function(e) {
        var i = this.options;
        return (
          this._blurActiveElement(e),
          this.helper ||
          i.disabled ||
          t(e.target).closest(".ui-resizable-handle").length > 0
            ? !1
            : ((this.handle = this._getHandle(e)),
              this.handle
                ? (this._blockFrames(
                    i.iframeFix === !0 ? "iframe" : i.iframeFix
                  ),
                  !0)
                : !1)
        );
      },
      _blockFrames: function(e) {
        this.iframeBlocks = this.document.find(e).map(function() {
          var e = t(this);
          return t("<div>")
            .css("position", "absolute")
            .appendTo(e.parent())
            .outerWidth(e.outerWidth())
            .outerHeight(e.outerHeight())
            .offset(e.offset())[0];
        });
      },
      _unblockFrames: function() {
        this.iframeBlocks &&
          (this.iframeBlocks.remove(), delete this.iframeBlocks);
      },
      _blurActiveElement: function(e) {
        var i = t.ui.safeActiveElement(this.document[0]),
          s = t(e.target);
        (this._getHandle(e) && s.closest(i).length) || t.ui.safeBlur(i);
      },
      _mouseStart: function(e) {
        var i = this.options;
        return (
          (this.helper = this._createHelper(e)),
          this._addClass(this.helper, "ui-draggable-dragging"),
          this._cacheHelperProportions(),
          t.ui.ddmanager && (t.ui.ddmanager.current = this),
          this._cacheMargins(),
          (this.cssPosition = this.helper.css("position")),
          (this.scrollParent = this.helper.scrollParent(!0)),
          (this.offsetParent = this.helper.offsetParent()),
          (this.hasFixedAncestor =
            this.helper.parents().filter(function() {
              return "fixed" === t(this).css("position");
            }).length > 0),
          (this.positionAbs = this.element.offset()),
          this._refreshOffsets(e),
          (this.originalPosition = this.position = this._generatePosition(
            e,
            !1
          )),
          (this.originalPageX = e.pageX),
          (this.originalPageY = e.pageY),
          i.cursorAt && this._adjustOffsetFromHelper(i.cursorAt),
          this._setContainment(),
          this._trigger("start", e) === !1
            ? (this._clear(), !1)
            : (this._cacheHelperProportions(),
              t.ui.ddmanager &&
                !i.dropBehaviour &&
                t.ui.ddmanager.prepareOffsets(this, e),
              this._mouseDrag(e, !0),
              t.ui.ddmanager && t.ui.ddmanager.dragStart(this, e),
              !0)
        );
      },
      _refreshOffsets: function(t) {
        (this.offset = {
          top: this.positionAbs.top - this.margins.top,
          left: this.positionAbs.left - this.margins.left,
          scroll: !1,
          parent: this._getParentOffset(),
          relative: this._getRelativeOffset()
        }),
          (this.offset.click = {
            left: t.pageX - this.offset.left,
            top: t.pageY - this.offset.top
          });
      },
      _mouseDrag: function(e, i) {
        if (
          (this.hasFixedAncestor &&
            (this.offset.parent = this._getParentOffset()),
          (this.position = this._generatePosition(e, !0)),
          (this.positionAbs = this._convertPositionTo("absolute")),
          !i)
        ) {
          var s = this._uiHash();
          if (this._trigger("drag", e, s) === !1)
            return this._mouseUp(new t.Event("mouseup", e)), !1;
          this.position = s.position;
        }
        return (
          (this.helper[0].style.left = this.position.left + "px"),
          (this.helper[0].style.top = this.position.top + "px"),
          t.ui.ddmanager && t.ui.ddmanager.drag(this, e),
          !1
        );
      },
      _mouseStop: function(e) {
        var i = this,
          s = !1;
        return (
          t.ui.ddmanager &&
            !this.options.dropBehaviour &&
            (s = t.ui.ddmanager.drop(this, e)),
          this.dropped && ((s = this.dropped), (this.dropped = !1)),
          ("invalid" === this.options.revert && !s) ||
          ("valid" === this.options.revert && s) ||
          this.options.revert === !0 ||
          (t.isFunction(this.options.revert) &&
            this.options.revert.call(this.element, s))
            ? t(this.helper).animate(
                this.originalPosition,
                parseInt(this.options.revertDuration, 10),
                function() {
                  i._trigger("stop", e) !== !1 && i._clear();
                }
              )
            : this._trigger("stop", e) !== !1 && this._clear(),
          !1
        );
      },
      _mouseUp: function(e) {
        return (
          this._unblockFrames(),
          t.ui.ddmanager && t.ui.ddmanager.dragStop(this, e),
          this.handleElement.is(e.target) && this.element.trigger("focus"),
          t.ui.mouse.prototype._mouseUp.call(this, e)
        );
      },
      cancel: function() {
        return (
          this.helper.is(".ui-draggable-dragging")
            ? this._mouseUp(new t.Event("mouseup", { target: this.element[0] }))
            : this._clear(),
          this
        );
      },
      _getHandle: function(e) {
        return this.options.handle
          ? !!t(e.target).closest(this.element.find(this.options.handle)).length
          : !0;
      },
      _setHandleClassName: function() {
        (this.handleElement = this.options.handle
          ? this.element.find(this.options.handle)
          : this.element),
          this._addClass(this.handleElement, "ui-draggable-handle");
      },
      _removeHandleClassName: function() {
        this._removeClass(this.handleElement, "ui-draggable-handle");
      },
      _createHelper: function(e) {
        var i = this.options,
          s = t.isFunction(i.helper),
          n = s
            ? t(i.helper.apply(this.element[0], [e]))
            : "clone" === i.helper
            ? this.element.clone().removeAttr("id")
            : this.element;
        return (
          n.parents("body").length ||
            n.appendTo(
              "parent" === i.appendTo ? this.element[0].parentNode : i.appendTo
            ),
          s && n[0] === this.element[0] && this._setPositionRelative(),
          n[0] === this.element[0] ||
            /(fixed|absolute)/.test(n.css("position")) ||
            n.css("position", "absolute"),
          n
        );
      },
      _setPositionRelative: function() {
        /^(?:r|a|f)/.test(this.element.css("position")) ||
          (this.element[0].style.position = "relative");
      },
      _adjustOffsetFromHelper: function(e) {
        "string" == typeof e && (e = e.split(" ")),
          t.isArray(e) && (e = { left: +e[0], top: +e[1] || 0 }),
          "left" in e && (this.offset.click.left = e.left + this.margins.left),
          "right" in e &&
            (this.offset.click.left =
              this.helperProportions.width - e.right + this.margins.left),
          "top" in e && (this.offset.click.top = e.top + this.margins.top),
          "bottom" in e &&
            (this.offset.click.top =
              this.helperProportions.height - e.bottom + this.margins.top);
      },
      _isRootNode: function(t) {
        return /(html|body)/i.test(t.tagName) || t === this.document[0];
      },
      _getParentOffset: function() {
        var e = this.offsetParent.offset(),
          i = this.document[0];
        return (
          "absolute" === this.cssPosition &&
            this.scrollParent[0] !== i &&
            t.contains(this.scrollParent[0], this.offsetParent[0]) &&
            ((e.left += this.scrollParent.scrollLeft()),
            (e.top += this.scrollParent.scrollTop())),
          this._isRootNode(this.offsetParent[0]) && (e = { top: 0, left: 0 }),
          {
            top:
              e.top +
              (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
            left:
              e.left +
              (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
          }
        );
      },
      _getRelativeOffset: function() {
        if ("relative" !== this.cssPosition) return { top: 0, left: 0 };
        var t = this.element.position(),
          e = this._isRootNode(this.scrollParent[0]);
        return {
          top:
            t.top -
            (parseInt(this.helper.css("top"), 10) || 0) +
            (e ? 0 : this.scrollParent.scrollTop()),
          left:
            t.left -
            (parseInt(this.helper.css("left"), 10) || 0) +
            (e ? 0 : this.scrollParent.scrollLeft())
        };
      },
      _cacheMargins: function() {
        this.margins = {
          left: parseInt(this.element.css("marginLeft"), 10) || 0,
          top: parseInt(this.element.css("marginTop"), 10) || 0,
          right: parseInt(this.element.css("marginRight"), 10) || 0,
          bottom: parseInt(this.element.css("marginBottom"), 10) || 0
        };
      },
      _cacheHelperProportions: function() {
        this.helperProportions = {
          width: this.helper.outerWidth(),
          height: this.helper.outerHeight()
        };
      },
      _setContainment: function() {
        var e,
          i,
          s,
          n = this.options,
          o = this.document[0];
        return (
          (this.relativeContainer = null),
          n.containment
            ? "window" === n.containment
              ? ((this.containment = [
                  t(window).scrollLeft() -
                    this.offset.relative.left -
                    this.offset.parent.left,
                  t(window).scrollTop() -
                    this.offset.relative.top -
                    this.offset.parent.top,
                  t(window).scrollLeft() +
                    t(window).width() -
                    this.helperProportions.width -
                    this.margins.left,
                  t(window).scrollTop() +
                    (t(window).height() || o.body.parentNode.scrollHeight) -
                    this.helperProportions.height -
                    this.margins.top
                ]),
                void 0)
              : "document" === n.containment
              ? ((this.containment = [
                  0,
                  0,
                  t(o).width() -
                    this.helperProportions.width -
                    this.margins.left,
                  (t(o).height() || o.body.parentNode.scrollHeight) -
                    this.helperProportions.height -
                    this.margins.top
                ]),
                void 0)
              : n.containment.constructor === Array
              ? ((this.containment = n.containment), void 0)
              : ("parent" === n.containment &&
                  (n.containment = this.helper[0].parentNode),
                (i = t(n.containment)),
                (s = i[0]),
                s &&
                  ((e = /(scroll|auto)/.test(i.css("overflow"))),
                  (this.containment = [
                    (parseInt(i.css("borderLeftWidth"), 10) || 0) +
                      (parseInt(i.css("paddingLeft"), 10) || 0),
                    (parseInt(i.css("borderTopWidth"), 10) || 0) +
                      (parseInt(i.css("paddingTop"), 10) || 0),
                    (e
                      ? Math.max(s.scrollWidth, s.offsetWidth)
                      : s.offsetWidth) -
                      (parseInt(i.css("borderRightWidth"), 10) || 0) -
                      (parseInt(i.css("paddingRight"), 10) || 0) -
                      this.helperProportions.width -
                      this.margins.left -
                      this.margins.right,
                    (e
                      ? Math.max(s.scrollHeight, s.offsetHeight)
                      : s.offsetHeight) -
                      (parseInt(i.css("borderBottomWidth"), 10) || 0) -
                      (parseInt(i.css("paddingBottom"), 10) || 0) -
                      this.helperProportions.height -
                      this.margins.top -
                      this.margins.bottom
                  ]),
                  (this.relativeContainer = i)),
                void 0)
            : ((this.containment = null), void 0)
        );
      },
      _convertPositionTo: function(t, e) {
        e || (e = this.position);
        var i = "absolute" === t ? 1 : -1,
          s = this._isRootNode(this.scrollParent[0]);
        return {
          top:
            e.top +
            this.offset.relative.top * i +
            this.offset.parent.top * i -
            ("fixed" === this.cssPosition
              ? -this.offset.scroll.top
              : s
              ? 0
              : this.offset.scroll.top) *
              i,
          left:
            e.left +
            this.offset.relative.left * i +
            this.offset.parent.left * i -
            ("fixed" === this.cssPosition
              ? -this.offset.scroll.left
              : s
              ? 0
              : this.offset.scroll.left) *
              i
        };
      },
      _generatePosition: function(t, e) {
        var i,
          s,
          n,
          o,
          a = this.options,
          r = this._isRootNode(this.scrollParent[0]),
          h = t.pageX,
          l = t.pageY;
        return (
          (r && this.offset.scroll) ||
            (this.offset.scroll = {
              top: this.scrollParent.scrollTop(),
              left: this.scrollParent.scrollLeft()
            }),
          e &&
            (this.containment &&
              (this.relativeContainer
                ? ((s = this.relativeContainer.offset()),
                  (i = [
                    this.containment[0] + s.left,
                    this.containment[1] + s.top,
                    this.containment[2] + s.left,
                    this.containment[3] + s.top
                  ]))
                : (i = this.containment),
              t.pageX - this.offset.click.left < i[0] &&
                (h = i[0] + this.offset.click.left),
              t.pageY - this.offset.click.top < i[1] &&
                (l = i[1] + this.offset.click.top),
              t.pageX - this.offset.click.left > i[2] &&
                (h = i[2] + this.offset.click.left),
              t.pageY - this.offset.click.top > i[3] &&
                (l = i[3] + this.offset.click.top)),
            a.grid &&
              ((n = a.grid[1]
                ? this.originalPageY +
                  Math.round((l - this.originalPageY) / a.grid[1]) * a.grid[1]
                : this.originalPageY),
              (l = i
                ? n - this.offset.click.top >= i[1] ||
                  n - this.offset.click.top > i[3]
                  ? n
                  : n - this.offset.click.top >= i[1]
                  ? n - a.grid[1]
                  : n + a.grid[1]
                : n),
              (o = a.grid[0]
                ? this.originalPageX +
                  Math.round((h - this.originalPageX) / a.grid[0]) * a.grid[0]
                : this.originalPageX),
              (h = i
                ? o - this.offset.click.left >= i[0] ||
                  o - this.offset.click.left > i[2]
                  ? o
                  : o - this.offset.click.left >= i[0]
                  ? o - a.grid[0]
                  : o + a.grid[0]
                : o)),
            "y" === a.axis && (h = this.originalPageX),
            "x" === a.axis && (l = this.originalPageY)),
          {
            top:
              l -
              this.offset.click.top -
              this.offset.relative.top -
              this.offset.parent.top +
              ("fixed" === this.cssPosition
                ? -this.offset.scroll.top
                : r
                ? 0
                : this.offset.scroll.top),
            left:
              h -
              this.offset.click.left -
              this.offset.relative.left -
              this.offset.parent.left +
              ("fixed" === this.cssPosition
                ? -this.offset.scroll.left
                : r
                ? 0
                : this.offset.scroll.left)
          }
        );
      },
      _clear: function() {
        this._removeClass(this.helper, "ui-draggable-dragging"),
          this.helper[0] === this.element[0] ||
            this.cancelHelperRemoval ||
            this.helper.remove(),
          (this.helper = null),
          (this.cancelHelperRemoval = !1),
          this.destroyOnClear && this.destroy();
      },
      _trigger: function(e, i, s) {
        return (
          (s = s || this._uiHash()),
          t.ui.plugin.call(this, e, [i, s, this], !0),
          /^(drag|start|stop)/.test(e) &&
            ((this.positionAbs = this._convertPositionTo("absolute")),
            (s.offset = this.positionAbs)),
          t.Widget.prototype._trigger.call(this, e, i, s)
        );
      },
      plugins: {},
      _uiHash: function() {
        return {
          helper: this.helper,
          position: this.position,
          originalPosition: this.originalPosition,
          offset: this.positionAbs
        };
      }
    }),
    t.ui.plugin.add("draggable", "connectToSortable", {
      start: function(e, i, s) {
        var n = t.extend({}, i, { item: s.element });
        (s.sortables = []),
          t(s.options.connectToSortable).each(function() {
            var i = t(this).sortable("instance");
            i &&
              !i.options.disabled &&
              (s.sortables.push(i),
              i.refreshPositions(),
              i._trigger("activate", e, n));
          });
      },
      stop: function(e, i, s) {
        var n = t.extend({}, i, { item: s.element });
        (s.cancelHelperRemoval = !1),
          t.each(s.sortables, function() {
            var t = this;
            t.isOver
              ? ((t.isOver = 0),
                (s.cancelHelperRemoval = !0),
                (t.cancelHelperRemoval = !1),
                (t._storedCSS = {
                  position: t.placeholder.css("position"),
                  top: t.placeholder.css("top"),
                  left: t.placeholder.css("left")
                }),
                t._mouseStop(e),
                (t.options.helper = t.options._helper))
              : ((t.cancelHelperRemoval = !0), t._trigger("deactivate", e, n));
          });
      },
      drag: function(e, i, s) {
        t.each(s.sortables, function() {
          var n = !1,
            o = this;
          (o.positionAbs = s.positionAbs),
            (o.helperProportions = s.helperProportions),
            (o.offset.click = s.offset.click),
            o._intersectsWith(o.containerCache) &&
              ((n = !0),
              t.each(s.sortables, function() {
                return (
                  (this.positionAbs = s.positionAbs),
                  (this.helperProportions = s.helperProportions),
                  (this.offset.click = s.offset.click),
                  this !== o &&
                    this._intersectsWith(this.containerCache) &&
                    t.contains(o.element[0], this.element[0]) &&
                    (n = !1),
                  n
                );
              })),
            n
              ? (o.isOver ||
                  ((o.isOver = 1),
                  (s._parent = i.helper.parent()),
                  (o.currentItem = i.helper
                    .appendTo(o.element)
                    .data("ui-sortable-item", !0)),
                  (o.options._helper = o.options.helper),
                  (o.options.helper = function() {
                    return i.helper[0];
                  }),
                  (e.target = o.currentItem[0]),
                  o._mouseCapture(e, !0),
                  o._mouseStart(e, !0, !0),
                  (o.offset.click.top = s.offset.click.top),
                  (o.offset.click.left = s.offset.click.left),
                  (o.offset.parent.left -=
                    s.offset.parent.left - o.offset.parent.left),
                  (o.offset.parent.top -=
                    s.offset.parent.top - o.offset.parent.top),
                  s._trigger("toSortable", e),
                  (s.dropped = o.element),
                  t.each(s.sortables, function() {
                    this.refreshPositions();
                  }),
                  (s.currentItem = s.element),
                  (o.fromOutside = s)),
                o.currentItem && (o._mouseDrag(e), (i.position = o.position)))
              : o.isOver &&
                ((o.isOver = 0),
                (o.cancelHelperRemoval = !0),
                (o.options._revert = o.options.revert),
                (o.options.revert = !1),
                o._trigger("out", e, o._uiHash(o)),
                o._mouseStop(e, !0),
                (o.options.revert = o.options._revert),
                (o.options.helper = o.options._helper),
                o.placeholder && o.placeholder.remove(),
                i.helper.appendTo(s._parent),
                s._refreshOffsets(e),
                (i.position = s._generatePosition(e, !0)),
                s._trigger("fromSortable", e),
                (s.dropped = !1),
                t.each(s.sortables, function() {
                  this.refreshPositions();
                }));
        });
      }
    }),
    t.ui.plugin.add("draggable", "cursor", {
      start: function(e, i, s) {
        var n = t("body"),
          o = s.options;
        n.css("cursor") && (o._cursor = n.css("cursor")),
          n.css("cursor", o.cursor);
      },
      stop: function(e, i, s) {
        var n = s.options;
        n._cursor && t("body").css("cursor", n._cursor);
      }
    }),
    t.ui.plugin.add("draggable", "opacity", {
      start: function(e, i, s) {
        var n = t(i.helper),
          o = s.options;
        n.css("opacity") && (o._opacity = n.css("opacity")),
          n.css("opacity", o.opacity);
      },
      stop: function(e, i, s) {
        var n = s.options;
        n._opacity && t(i.helper).css("opacity", n._opacity);
      }
    }),
    t.ui.plugin.add("draggable", "scroll", {
      start: function(t, e, i) {
        i.scrollParentNotHidden ||
          (i.scrollParentNotHidden = i.helper.scrollParent(!1)),
          i.scrollParentNotHidden[0] !== i.document[0] &&
            "HTML" !== i.scrollParentNotHidden[0].tagName &&
            (i.overflowOffset = i.scrollParentNotHidden.offset());
      },
      drag: function(e, i, s) {
        var n = s.options,
          o = !1,
          a = s.scrollParentNotHidden[0],
          r = s.document[0];
        a !== r && "HTML" !== a.tagName
          ? ((n.axis && "x" === n.axis) ||
              (s.overflowOffset.top + a.offsetHeight - e.pageY <
              n.scrollSensitivity
                ? (a.scrollTop = o = a.scrollTop + n.scrollSpeed)
                : e.pageY - s.overflowOffset.top < n.scrollSensitivity &&
                  (a.scrollTop = o = a.scrollTop - n.scrollSpeed)),
            (n.axis && "y" === n.axis) ||
              (s.overflowOffset.left + a.offsetWidth - e.pageX <
              n.scrollSensitivity
                ? (a.scrollLeft = o = a.scrollLeft + n.scrollSpeed)
                : e.pageX - s.overflowOffset.left < n.scrollSensitivity &&
                  (a.scrollLeft = o = a.scrollLeft - n.scrollSpeed)))
          : ((n.axis && "x" === n.axis) ||
              (e.pageY - t(r).scrollTop() < n.scrollSensitivity
                ? (o = t(r).scrollTop(t(r).scrollTop() - n.scrollSpeed))
                : t(window).height() - (e.pageY - t(r).scrollTop()) <
                    n.scrollSensitivity &&
                  (o = t(r).scrollTop(t(r).scrollTop() + n.scrollSpeed))),
            (n.axis && "y" === n.axis) ||
              (e.pageX - t(r).scrollLeft() < n.scrollSensitivity
                ? (o = t(r).scrollLeft(t(r).scrollLeft() - n.scrollSpeed))
                : t(window).width() - (e.pageX - t(r).scrollLeft()) <
                    n.scrollSensitivity &&
                  (o = t(r).scrollLeft(t(r).scrollLeft() + n.scrollSpeed)))),
          o !== !1 &&
            t.ui.ddmanager &&
            !n.dropBehaviour &&
            t.ui.ddmanager.prepareOffsets(s, e);
      }
    }),
    t.ui.plugin.add("draggable", "snap", {
      start: function(e, i, s) {
        var n = s.options;
        (s.snapElements = []),
          t(
            n.snap.constructor !== String
              ? n.snap.items || ":data(ui-draggable)"
              : n.snap
          ).each(function() {
            var e = t(this),
              i = e.offset();
            this !== s.element[0] &&
              s.snapElements.push({
                item: this,
                width: e.outerWidth(),
                height: e.outerHeight(),
                top: i.top,
                left: i.left
              });
          });
      },
      drag: function(e, i, s) {
        var n,
          o,
          a,
          r,
          h,
          l,
          c,
          u,
          d,
          p,
          f = s.options,
          g = f.snapTolerance,
          m = i.offset.left,
          _ = m + s.helperProportions.width,
          v = i.offset.top,
          b = v + s.helperProportions.height;
        for (d = s.snapElements.length - 1; d >= 0; d--)
          (h = s.snapElements[d].left - s.margins.left),
            (l = h + s.snapElements[d].width),
            (c = s.snapElements[d].top - s.margins.top),
            (u = c + s.snapElements[d].height),
            h - g > _ ||
            m > l + g ||
            c - g > b ||
            v > u + g ||
            !t.contains(
              s.snapElements[d].item.ownerDocument,
              s.snapElements[d].item
            )
              ? (s.snapElements[d].snapping &&
                  s.options.snap.release &&
                  s.options.snap.release.call(
                    s.element,
                    e,
                    t.extend(s._uiHash(), { snapItem: s.snapElements[d].item })
                  ),
                (s.snapElements[d].snapping = !1))
              : ("inner" !== f.snapMode &&
                  ((n = g >= Math.abs(c - b)),
                  (o = g >= Math.abs(u - v)),
                  (a = g >= Math.abs(h - _)),
                  (r = g >= Math.abs(l - m)),
                  n &&
                    (i.position.top = s._convertPositionTo("relative", {
                      top: c - s.helperProportions.height,
                      left: 0
                    }).top),
                  o &&
                    (i.position.top = s._convertPositionTo("relative", {
                      top: u,
                      left: 0
                    }).top),
                  a &&
                    (i.position.left = s._convertPositionTo("relative", {
                      top: 0,
                      left: h - s.helperProportions.width
                    }).left),
                  r &&
                    (i.position.left = s._convertPositionTo("relative", {
                      top: 0,
                      left: l
                    }).left)),
                (p = n || o || a || r),
                "outer" !== f.snapMode &&
                  ((n = g >= Math.abs(c - v)),
                  (o = g >= Math.abs(u - b)),
                  (a = g >= Math.abs(h - m)),
                  (r = g >= Math.abs(l - _)),
                  n &&
                    (i.position.top = s._convertPositionTo("relative", {
                      top: c,
                      left: 0
                    }).top),
                  o &&
                    (i.position.top = s._convertPositionTo("relative", {
                      top: u - s.helperProportions.height,
                      left: 0
                    }).top),
                  a &&
                    (i.position.left = s._convertPositionTo("relative", {
                      top: 0,
                      left: h
                    }).left),
                  r &&
                    (i.position.left = s._convertPositionTo("relative", {
                      top: 0,
                      left: l - s.helperProportions.width
                    }).left)),
                !s.snapElements[d].snapping &&
                  (n || o || a || r || p) &&
                  s.options.snap.snap &&
                  s.options.snap.snap.call(
                    s.element,
                    e,
                    t.extend(s._uiHash(), { snapItem: s.snapElements[d].item })
                  ),
                (s.snapElements[d].snapping = n || o || a || r || p));
      }
    }),
    t.ui.plugin.add("draggable", "stack", {
      start: function(e, i, s) {
        var n,
          o = s.options,
          a = t.makeArray(t(o.stack)).sort(function(e, i) {
            return (
              (parseInt(t(e).css("zIndex"), 10) || 0) -
              (parseInt(t(i).css("zIndex"), 10) || 0)
            );
          });
        a.length &&
          ((n = parseInt(t(a[0]).css("zIndex"), 10) || 0),
          t(a).each(function(e) {
            t(this).css("zIndex", n + e);
          }),
          this.css("zIndex", n + a.length));
      }
    }),
    t.ui.plugin.add("draggable", "zIndex", {
      start: function(e, i, s) {
        var n = t(i.helper),
          o = s.options;
        n.css("zIndex") && (o._zIndex = n.css("zIndex")),
          n.css("zIndex", o.zIndex);
      },
      stop: function(e, i, s) {
        var n = s.options;
        n._zIndex && t(i.helper).css("zIndex", n._zIndex);
      }
    }),
    t.ui.draggable,
    t.widget("ui.droppable", {
      version: "1.12.0",
      widgetEventPrefix: "drop",
      options: {
        accept: "*",
        addClasses: !0,
        greedy: !1,
        scope: "default",
        tolerance: "intersect",
        activate: null,
        deactivate: null,
        drop: null,
        out: null,
        over: null
      },
      _create: function() {
        var e,
          i = this.options,
          s = i.accept;
        (this.isover = !1),
          (this.isout = !0),
          (this.accept = t.isFunction(s)
            ? s
            : function(t) {
                return t.is(s);
              }),
          (this.proportions = function() {
            return arguments.length
              ? ((e = arguments[0]), void 0)
              : e
              ? e
              : (e = {
                  width: this.element[0].offsetWidth,
                  height: this.element[0].offsetHeight
                });
          }),
          this._addToManager(i.scope),
          i.addClasses && this._addClass("ui-droppable");
      },
      _addToManager: function(e) {
        (t.ui.ddmanager.droppables[e] = t.ui.ddmanager.droppables[e] || []),
          t.ui.ddmanager.droppables[e].push(this);
      },
      _splice: function(t) {
        for (var e = 0; t.length > e; e++) t[e] === this && t.splice(e, 1);
      },
      _destroy: function() {
        var e = t.ui.ddmanager.droppables[this.options.scope];
        this._splice(e);
      },
      _setOption: function(e, i) {
        if ("accept" === e)
          this.accept = t.isFunction(i)
            ? i
            : function(t) {
                return t.is(i);
              };
        else if ("scope" === e) {
          var s = t.ui.ddmanager.droppables[this.options.scope];
          this._splice(s), this._addToManager(i);
        }
        this._super(e, i);
      },
      _activate: function(e) {
        var i = t.ui.ddmanager.current;
        this._addActiveClass(), i && this._trigger("activate", e, this.ui(i));
      },
      _deactivate: function(e) {
        var i = t.ui.ddmanager.current;
        this._removeActiveClass(),
          i && this._trigger("deactivate", e, this.ui(i));
      },
      _over: function(e) {
        var i = t.ui.ddmanager.current;
        i &&
          (i.currentItem || i.element)[0] !== this.element[0] &&
          this.accept.call(this.element[0], i.currentItem || i.element) &&
          (this._addHoverClass(), this._trigger("over", e, this.ui(i)));
      },
      _out: function(e) {
        var i = t.ui.ddmanager.current;
        i &&
          (i.currentItem || i.element)[0] !== this.element[0] &&
          this.accept.call(this.element[0], i.currentItem || i.element) &&
          (this._removeHoverClass(), this._trigger("out", e, this.ui(i)));
      },
      _drop: function(e, i) {
        var s = i || t.ui.ddmanager.current,
          n = !1;
        return s && (s.currentItem || s.element)[0] !== this.element[0]
          ? (this.element
              .find(":data(ui-droppable)")
              .not(".ui-draggable-dragging")
              .each(function() {
                var i = t(this).droppable("instance");
                return i.options.greedy &&
                  !i.options.disabled &&
                  i.options.scope === s.options.scope &&
                  i.accept.call(i.element[0], s.currentItem || s.element) &&
                  o(
                    s,
                    t.extend(i, { offset: i.element.offset() }),
                    i.options.tolerance,
                    e
                  )
                  ? ((n = !0), !1)
                  : void 0;
              }),
            n
              ? !1
              : this.accept.call(this.element[0], s.currentItem || s.element)
              ? (this._removeActiveClass(),
                this._removeHoverClass(),
                this._trigger("drop", e, this.ui(s)),
                this.element)
              : !1)
          : !1;
      },
      ui: function(t) {
        return {
          draggable: t.currentItem || t.element,
          helper: t.helper,
          position: t.position,
          offset: t.positionAbs
        };
      },
      _addHoverClass: function() {
        this._addClass("ui-droppable-hover");
      },
      _removeHoverClass: function() {
        this._removeClass("ui-droppable-hover");
      },
      _addActiveClass: function() {
        this._addClass("ui-droppable-active");
      },
      _removeActiveClass: function() {
        this._removeClass("ui-droppable-active");
      }
    });
  var o = (t.ui.intersect = (function() {
    function t(t, e, i) {
      return t >= e && e + i > t;
    }
    return function(e, i, s, n) {
      if (!i.offset) return !1;
      var o = (e.positionAbs || e.position.absolute).left + e.margins.left,
        a = (e.positionAbs || e.position.absolute).top + e.margins.top,
        r = o + e.helperProportions.width,
        h = a + e.helperProportions.height,
        l = i.offset.left,
        c = i.offset.top,
        u = l + i.proportions().width,
        d = c + i.proportions().height;
      switch (s) {
        case "fit":
          return o >= l && u >= r && a >= c && d >= h;
        case "intersect":
          return (
            o + e.helperProportions.width / 2 > l &&
            u > r - e.helperProportions.width / 2 &&
            a + e.helperProportions.height / 2 > c &&
            d > h - e.helperProportions.height / 2
          );
        case "pointer":
          return (
            t(n.pageY, c, i.proportions().height) &&
            t(n.pageX, l, i.proportions().width)
          );
        case "touch":
          return (
            ((a >= c && d >= a) || (h >= c && d >= h) || (c > a && h > d)) &&
            ((o >= l && u >= o) || (r >= l && u >= r) || (l > o && r > u))
          );
        default:
          return !1;
      }
    };
  })());
  (t.ui.ddmanager = {
    current: null,
    droppables: { default: [] },
    prepareOffsets: function(e, i) {
      var s,
        n,
        o = t.ui.ddmanager.droppables[e.options.scope] || [],
        a = i ? i.type : null,
        r = (e.currentItem || e.element).find(":data(ui-droppable)").addBack();
      t: for (s = 0; o.length > s; s++)
        if (
          !(
            o[s].options.disabled ||
            (e &&
              !o[s].accept.call(o[s].element[0], e.currentItem || e.element))
          )
        ) {
          for (n = 0; r.length > n; n++)
            if (r[n] === o[s].element[0]) {
              o[s].proportions().height = 0;
              continue t;
            }
          (o[s].visible = "none" !== o[s].element.css("display")),
            o[s].visible &&
              ("mousedown" === a && o[s]._activate.call(o[s], i),
              (o[s].offset = o[s].element.offset()),
              o[s].proportions({
                width: o[s].element[0].offsetWidth,
                height: o[s].element[0].offsetHeight
              }));
        }
    },
    drop: function(e, i) {
      var s = !1;
      return (
        t.each(
          (t.ui.ddmanager.droppables[e.options.scope] || []).slice(),
          function() {
            this.options &&
              (!this.options.disabled &&
                this.visible &&
                o(e, this, this.options.tolerance, i) &&
                (s = this._drop.call(this, i) || s),
              !this.options.disabled &&
                this.visible &&
                this.accept.call(this.element[0], e.currentItem || e.element) &&
                ((this.isout = !0),
                (this.isover = !1),
                this._deactivate.call(this, i)));
          }
        ),
        s
      );
    },
    dragStart: function(e, i) {
      e.element.parentsUntil("body").on("scroll.droppable", function() {
        e.options.refreshPositions || t.ui.ddmanager.prepareOffsets(e, i);
      });
    },
    drag: function(e, i) {
      e.options.refreshPositions && t.ui.ddmanager.prepareOffsets(e, i),
        t.each(t.ui.ddmanager.droppables[e.options.scope] || [], function() {
          if (!this.options.disabled && !this.greedyChild && this.visible) {
            var s,
              n,
              a,
              r = o(e, this, this.options.tolerance, i),
              h =
                !r && this.isover
                  ? "isout"
                  : r && !this.isover
                  ? "isover"
                  : null;
            h &&
              (this.options.greedy &&
                ((n = this.options.scope),
                (a = this.element
                  .parents(":data(ui-droppable)")
                  .filter(function() {
                    return t(this).droppable("instance").options.scope === n;
                  })),
                a.length &&
                  ((s = t(a[0]).droppable("instance")),
                  (s.greedyChild = "isover" === h))),
              s &&
                "isover" === h &&
                ((s.isover = !1), (s.isout = !0), s._out.call(s, i)),
              (this[h] = !0),
              (this["isout" === h ? "isover" : "isout"] = !1),
              this["isover" === h ? "_over" : "_out"].call(this, i),
              s &&
                "isout" === h &&
                ((s.isout = !1), (s.isover = !0), s._over.call(s, i)));
          }
        });
    },
    dragStop: function(e, i) {
      e.element.parentsUntil("body").off("scroll.droppable"),
        e.options.refreshPositions || t.ui.ddmanager.prepareOffsets(e, i);
    }
  }),
    t.uiBackCompat !== !1 &&
      t.widget("ui.droppable", t.ui.droppable, {
        options: { hoverClass: !1, activeClass: !1 },
        _addActiveClass: function() {
          this._super(),
            this.options.activeClass &&
              this.element.addClass(this.options.activeClass);
        },
        _removeActiveClass: function() {
          this._super(),
            this.options.activeClass &&
              this.element.removeClass(this.options.activeClass);
        },
        _addHoverClass: function() {
          this._super(),
            this.options.hoverClass &&
              this.element.addClass(this.options.hoverClass);
        },
        _removeHoverClass: function() {
          this._super(),
            this.options.hoverClass &&
              this.element.removeClass(this.options.hoverClass);
        }
      }),
    t.ui.droppable,
    t.widget("ui.resizable", t.ui.mouse, {
      version: "1.12.0",
      widgetEventPrefix: "resize",
      options: {
        alsoResize: !1,
        animate: !1,
        animateDuration: "slow",
        animateEasing: "swing",
        aspectRatio: !1,
        autoHide: !1,
        classes: { "ui-resizable-se": "ui-icon ui-icon-gripsmall-diagonal-se" },
        containment: !1,
        ghost: !1,
        grid: !1,
        handles: "e,s,se",
        helper: !1,
        maxHeight: null,
        maxWidth: null,
        minHeight: 10,
        minWidth: 10,
        zIndex: 90,
        resize: null,
        start: null,
        stop: null
      },
      _num: function(t) {
        return parseFloat(t) || 0;
      },
      _isNumber: function(t) {
        return !isNaN(parseFloat(t));
      },
      _hasScroll: function(e, i) {
        if ("hidden" === t(e).css("overflow")) return !1;
        var s = i && "left" === i ? "scrollLeft" : "scrollTop",
          n = !1;
        return e[s] > 0 ? !0 : ((e[s] = 1), (n = e[s] > 0), (e[s] = 0), n);
      },
      _create: function() {
        var e,
          i = this.options,
          s = this;
        this._addClass("ui-resizable"),
          t.extend(this, {
            _aspectRatio: !!i.aspectRatio,
            aspectRatio: i.aspectRatio,
            originalElement: this.element,
            _proportionallyResizeElements: [],
            _helper:
              i.helper || i.ghost || i.animate
                ? i.helper || "ui-resizable-helper"
                : null
          }),
          this.element[0].nodeName.match(
            /^(canvas|textarea|input|select|button|img)$/i
          ) &&
            (this.element.wrap(
              t(
                "<div class='ui-wrapper' style='overflow: hidden;'></div>"
              ).css({
                position: this.element.css("position"),
                width: this.element.outerWidth(),
                height: this.element.outerHeight(),
                top: this.element.css("top"),
                left: this.element.css("left")
              })
            ),
            (this.element = this.element
              .parent()
              .data("ui-resizable", this.element.resizable("instance"))),
            (this.elementIsWrapper = !0),
            (e = {
              marginTop: this.originalElement.css("marginTop"),
              marginRight: this.originalElement.css("marginRight"),
              marginBottom: this.originalElement.css("marginBottom"),
              marginLeft: this.originalElement.css("marginLeft")
            }),
            this.element.css(e),
            this.originalElement.css("margin", 0),
            (this.originalResizeStyle = this.originalElement.css("resize")),
            this.originalElement.css("resize", "none"),
            this._proportionallyResizeElements.push(
              this.originalElement.css({
                position: "static",
                zoom: 1,
                display: "block"
              })
            ),
            this.originalElement.css(e),
            this._proportionallyResize()),
          this._setupHandles(),
          i.autoHide &&
            t(this.element)
              .on("mouseenter", function() {
                i.disabled ||
                  (s._removeClass("ui-resizable-autohide"), s._handles.show());
              })
              .on("mouseleave", function() {
                i.disabled ||
                  s.resizing ||
                  (s._addClass("ui-resizable-autohide"), s._handles.hide());
              }),
          this._mouseInit();
      },
      _destroy: function() {
        this._mouseDestroy();
        var e,
          i = function(e) {
            t(e)
              .removeData("resizable")
              .removeData("ui-resizable")
              .off(".resizable")
              .find(".ui-resizable-handle")
              .remove();
          };
        return (
          this.elementIsWrapper &&
            (i(this.element),
            (e = this.element),
            this.originalElement
              .css({
                position: e.css("position"),
                width: e.outerWidth(),
                height: e.outerHeight(),
                top: e.css("top"),
                left: e.css("left")
              })
              .insertAfter(e),
            e.remove()),
          this.originalElement.css("resize", this.originalResizeStyle),
          i(this.originalElement),
          this
        );
      },
      _setOption: function(t, e) {
        switch ((this._super(t, e), t)) {
          case "handles":
            this._removeHandles(), this._setupHandles();
            break;
          default:
        }
      },
      _setupHandles: function() {
        var e,
          i,
          s,
          n,
          o,
          a = this.options,
          r = this;
        if (
          ((this.handles =
            a.handles ||
            (t(".ui-resizable-handle", this.element).length
              ? {
                  n: ".ui-resizable-n",
                  e: ".ui-resizable-e",
                  s: ".ui-resizable-s",
                  w: ".ui-resizable-w",
                  se: ".ui-resizable-se",
                  sw: ".ui-resizable-sw",
                  ne: ".ui-resizable-ne",
                  nw: ".ui-resizable-nw"
                }
              : "e,s,se")),
          (this._handles = t()),
          this.handles.constructor === String)
        )
          for (
            "all" === this.handles && (this.handles = "n,e,s,w,se,sw,ne,nw"),
              s = this.handles.split(","),
              this.handles = {},
              i = 0;
            s.length > i;
            i++
          )
            (e = t.trim(s[i])),
              (n = "ui-resizable-" + e),
              (o = t("<div>")),
              this._addClass(o, "ui-resizable-handle " + n),
              o.css({ zIndex: a.zIndex }),
              (this.handles[e] = ".ui-resizable-" + e),
              this.element.append(o);
        (this._renderAxis = function(e) {
          var i, s, n, o;
          e = e || this.element;
          for (i in this.handles)
            this.handles[i].constructor === String
              ? (this.handles[i] = this.element
                  .children(this.handles[i])
                  .first()
                  .show())
              : (this.handles[i].jquery || this.handles[i].nodeType) &&
                ((this.handles[i] = t(this.handles[i])),
                this._on(this.handles[i], { mousedown: r._mouseDown })),
              this.elementIsWrapper &&
                this.originalElement[0].nodeName.match(
                  /^(textarea|input|select|button)$/i
                ) &&
                ((s = t(this.handles[i], this.element)),
                (o = /sw|ne|nw|se|n|s/.test(i)
                  ? s.outerHeight()
                  : s.outerWidth()),
                (n = [
                  "padding",
                  /ne|nw|n/.test(i)
                    ? "Top"
                    : /se|sw|s/.test(i)
                    ? "Bottom"
                    : /^e$/.test(i)
                    ? "Right"
                    : "Left"
                ].join("")),
                e.css(n, o),
                this._proportionallyResize()),
              (this._handles = this._handles.add(this.handles[i]));
        }),
          this._renderAxis(this.element),
          (this._handles = this._handles.add(
            this.element.find(".ui-resizable-handle")
          )),
          this._handles.disableSelection(),
          this._handles.on("mouseover", function() {
            r.resizing ||
              (this.className &&
                (o = this.className.match(
                  /ui-resizable-(se|sw|ne|nw|n|e|s|w)/i
                )),
              (r.axis = o && o[1] ? o[1] : "se"));
          }),
          a.autoHide &&
            (this._handles.hide(), this._addClass("ui-resizable-autohide"));
      },
      _removeHandles: function() {
        this._handles.remove();
      },
      _mouseCapture: function(e) {
        var i,
          s,
          n = !1;
        for (i in this.handles)
          (s = t(this.handles[i])[0]),
            (s === e.target || t.contains(s, e.target)) && (n = !0);
        return !this.options.disabled && n;
      },
      _mouseStart: function(e) {
        var i,
          s,
          n,
          o = this.options,
          a = this.element;
        return (
          (this.resizing = !0),
          this._renderProxy(),
          (i = this._num(this.helper.css("left"))),
          (s = this._num(this.helper.css("top"))),
          o.containment &&
            ((i += t(o.containment).scrollLeft() || 0),
            (s += t(o.containment).scrollTop() || 0)),
          (this.offset = this.helper.offset()),
          (this.position = { left: i, top: s }),
          (this.size = this._helper
            ? { width: this.helper.width(), height: this.helper.height() }
            : { width: a.width(), height: a.height() }),
          (this.originalSize = this._helper
            ? { width: a.outerWidth(), height: a.outerHeight() }
            : { width: a.width(), height: a.height() }),
          (this.sizeDiff = {
            width: a.outerWidth() - a.width(),
            height: a.outerHeight() - a.height()
          }),
          (this.originalPosition = { left: i, top: s }),
          (this.originalMousePosition = { left: e.pageX, top: e.pageY }),
          (this.aspectRatio =
            "number" == typeof o.aspectRatio
              ? o.aspectRatio
              : this.originalSize.width / this.originalSize.height || 1),
          (n = t(".ui-resizable-" + this.axis).css("cursor")),
          t("body").css("cursor", "auto" === n ? this.axis + "-resize" : n),
          this._addClass("ui-resizable-resizing"),
          this._propagate("start", e),
          !0
        );
      },
      _mouseDrag: function(e) {
        var i,
          s,
          n = this.originalMousePosition,
          o = this.axis,
          a = e.pageX - n.left || 0,
          r = e.pageY - n.top || 0,
          h = this._change[o];
        return (
          this._updatePrevProperties(),
          h
            ? ((i = h.apply(this, [e, a, r])),
              this._updateVirtualBoundaries(e.shiftKey),
              (this._aspectRatio || e.shiftKey) &&
                (i = this._updateRatio(i, e)),
              (i = this._respectSize(i, e)),
              this._updateCache(i),
              this._propagate("resize", e),
              (s = this._applyChanges()),
              !this._helper &&
                this._proportionallyResizeElements.length &&
                this._proportionallyResize(),
              t.isEmptyObject(s) ||
                (this._updatePrevProperties(),
                this._trigger("resize", e, this.ui()),
                this._applyChanges()),
              !1)
            : !1
        );
      },
      _mouseStop: function(e) {
        this.resizing = !1;
        var i,
          s,
          n,
          o,
          a,
          r,
          h,
          l = this.options,
          c = this;
        return (
          this._helper &&
            ((i = this._proportionallyResizeElements),
            (s = i.length && /textarea/i.test(i[0].nodeName)),
            (n = s && this._hasScroll(i[0], "left") ? 0 : c.sizeDiff.height),
            (o = s ? 0 : c.sizeDiff.width),
            (a = {
              width: c.helper.width() - o,
              height: c.helper.height() - n
            }),
            (r =
              parseFloat(c.element.css("left")) +
                (c.position.left - c.originalPosition.left) || null),
            (h =
              parseFloat(c.element.css("top")) +
                (c.position.top - c.originalPosition.top) || null),
            l.animate || this.element.css(t.extend(a, { top: h, left: r })),
            c.helper.height(c.size.height),
            c.helper.width(c.size.width),
            this._helper && !l.animate && this._proportionallyResize()),
          t("body").css("cursor", "auto"),
          this._removeClass("ui-resizable-resizing"),
          this._propagate("stop", e),
          this._helper && this.helper.remove(),
          !1
        );
      },
      _updatePrevProperties: function() {
        (this.prevPosition = {
          top: this.position.top,
          left: this.position.left
        }),
          (this.prevSize = {
            width: this.size.width,
            height: this.size.height
          });
      },
      _applyChanges: function() {
        var t = {};
        return (
          this.position.top !== this.prevPosition.top &&
            (t.top = this.position.top + "px"),
          this.position.left !== this.prevPosition.left &&
            (t.left = this.position.left + "px"),
          this.size.width !== this.prevSize.width &&
            (t.width = this.size.width + "px"),
          this.size.height !== this.prevSize.height &&
            (t.height = this.size.height + "px"),
          this.helper.css(t),
          t
        );
      },
      _updateVirtualBoundaries: function(t) {
        var e,
          i,
          s,
          n,
          o,
          a = this.options;
        (o = {
          minWidth: this._isNumber(a.minWidth) ? a.minWidth : 0,
          maxWidth: this._isNumber(a.maxWidth) ? a.maxWidth : 1 / 0,
          minHeight: this._isNumber(a.minHeight) ? a.minHeight : 0,
          maxHeight: this._isNumber(a.maxHeight) ? a.maxHeight : 1 / 0
        }),
          (this._aspectRatio || t) &&
            ((e = o.minHeight * this.aspectRatio),
            (s = o.minWidth / this.aspectRatio),
            (i = o.maxHeight * this.aspectRatio),
            (n = o.maxWidth / this.aspectRatio),
            e > o.minWidth && (o.minWidth = e),
            s > o.minHeight && (o.minHeight = s),
            o.maxWidth > i && (o.maxWidth = i),
            o.maxHeight > n && (o.maxHeight = n)),
          (this._vBoundaries = o);
      },
      _updateCache: function(t) {
        (this.offset = this.helper.offset()),
          this._isNumber(t.left) && (this.position.left = t.left),
          this._isNumber(t.top) && (this.position.top = t.top),
          this._isNumber(t.height) && (this.size.height = t.height),
          this._isNumber(t.width) && (this.size.width = t.width);
      },
      _updateRatio: function(t) {
        var e = this.position,
          i = this.size,
          s = this.axis;
        return (
          this._isNumber(t.height)
            ? (t.width = t.height * this.aspectRatio)
            : this._isNumber(t.width) &&
              (t.height = t.width / this.aspectRatio),
          "sw" === s &&
            ((t.left = e.left + (i.width - t.width)), (t.top = null)),
          "nw" === s &&
            ((t.top = e.top + (i.height - t.height)),
            (t.left = e.left + (i.width - t.width))),
          t
        );
      },
      _respectSize: function(t) {
        var e = this._vBoundaries,
          i = this.axis,
          s = this._isNumber(t.width) && e.maxWidth && e.maxWidth < t.width,
          n = this._isNumber(t.height) && e.maxHeight && e.maxHeight < t.height,
          o = this._isNumber(t.width) && e.minWidth && e.minWidth > t.width,
          a = this._isNumber(t.height) && e.minHeight && e.minHeight > t.height,
          r = this.originalPosition.left + this.originalSize.width,
          h = this.originalPosition.top + this.originalSize.height,
          l = /sw|nw|w/.test(i),
          c = /nw|ne|n/.test(i);
        return (
          o && (t.width = e.minWidth),
          a && (t.height = e.minHeight),
          s && (t.width = e.maxWidth),
          n && (t.height = e.maxHeight),
          o && l && (t.left = r - e.minWidth),
          s && l && (t.left = r - e.maxWidth),
          a && c && (t.top = h - e.minHeight),
          n && c && (t.top = h - e.maxHeight),
          t.width || t.height || t.left || !t.top
            ? t.width || t.height || t.top || !t.left || (t.left = null)
            : (t.top = null),
          t
        );
      },
      _getPaddingPlusBorderDimensions: function(t) {
        for (
          var e = 0,
            i = [],
            s = [
              t.css("borderTopWidth"),
              t.css("borderRightWidth"),
              t.css("borderBottomWidth"),
              t.css("borderLeftWidth")
            ],
            n = [
              t.css("paddingTop"),
              t.css("paddingRight"),
              t.css("paddingBottom"),
              t.css("paddingLeft")
            ];
          4 > e;
          e++
        )
          (i[e] = parseFloat(s[e]) || 0), (i[e] += parseFloat(n[e]) || 0);
        return { height: i[0] + i[2], width: i[1] + i[3] };
      },
      _proportionallyResize: function() {
        if (this._proportionallyResizeElements.length)
          for (
            var t, e = 0, i = this.helper || this.element;
            this._proportionallyResizeElements.length > e;
            e++
          )
            (t = this._proportionallyResizeElements[e]),
              this.outerDimensions ||
                (this.outerDimensions = this._getPaddingPlusBorderDimensions(
                  t
                )),
              t.css({
                height: i.height() - this.outerDimensions.height || 0,
                width: i.width() - this.outerDimensions.width || 0
              });
      },
      _renderProxy: function() {
        var e = this.element,
          i = this.options;
        (this.elementOffset = e.offset()),
          this._helper
            ? ((this.helper =
                this.helper || t("<div style='overflow:hidden;'></div>")),
              this._addClass(this.helper, this._helper),
              this.helper.css({
                width: this.element.outerWidth(),
                height: this.element.outerHeight(),
                position: "absolute",
                left: this.elementOffset.left + "px",
                top: this.elementOffset.top + "px",
                zIndex: ++i.zIndex
              }),
              this.helper.appendTo("body").disableSelection())
            : (this.helper = this.element);
      },
      _change: {
        e: function(t, e) {
          return { width: this.originalSize.width + e };
        },
        w: function(t, e) {
          var i = this.originalSize,
            s = this.originalPosition;
          return { left: s.left + e, width: i.width - e };
        },
        n: function(t, e, i) {
          var s = this.originalSize,
            n = this.originalPosition;
          return { top: n.top + i, height: s.height - i };
        },
        s: function(t, e, i) {
          return { height: this.originalSize.height + i };
        },
        se: function(e, i, s) {
          return t.extend(
            this._change.s.apply(this, arguments),
            this._change.e.apply(this, [e, i, s])
          );
        },
        sw: function(e, i, s) {
          return t.extend(
            this._change.s.apply(this, arguments),
            this._change.w.apply(this, [e, i, s])
          );
        },
        ne: function(e, i, s) {
          return t.extend(
            this._change.n.apply(this, arguments),
            this._change.e.apply(this, [e, i, s])
          );
        },
        nw: function(e, i, s) {
          return t.extend(
            this._change.n.apply(this, arguments),
            this._change.w.apply(this, [e, i, s])
          );
        }
      },
      _propagate: function(e, i) {
        t.ui.plugin.call(this, e, [i, this.ui()]),
          "resize" !== e && this._trigger(e, i, this.ui());
      },
      plugins: {},
      ui: function() {
        return {
          originalElement: this.originalElement,
          element: this.element,
          helper: this.helper,
          position: this.position,
          size: this.size,
          originalSize: this.originalSize,
          originalPosition: this.originalPosition
        };
      }
    }),
    t.ui.plugin.add("resizable", "animate", {
      stop: function(e) {
        var i = t(this).resizable("instance"),
          s = i.options,
          n = i._proportionallyResizeElements,
          o = n.length && /textarea/i.test(n[0].nodeName),
          a = o && i._hasScroll(n[0], "left") ? 0 : i.sizeDiff.height,
          r = o ? 0 : i.sizeDiff.width,
          h = { width: i.size.width - r, height: i.size.height - a },
          l =
            parseFloat(i.element.css("left")) +
              (i.position.left - i.originalPosition.left) || null,
          c =
            parseFloat(i.element.css("top")) +
              (i.position.top - i.originalPosition.top) || null;
        i.element.animate(t.extend(h, c && l ? { top: c, left: l } : {}), {
          duration: s.animateDuration,
          easing: s.animateEasing,
          step: function() {
            var s = {
              width: parseFloat(i.element.css("width")),
              height: parseFloat(i.element.css("height")),
              top: parseFloat(i.element.css("top")),
              left: parseFloat(i.element.css("left"))
            };
            n && n.length && t(n[0]).css({ width: s.width, height: s.height }),
              i._updateCache(s),
              i._propagate("resize", e);
          }
        });
      }
    }),
    t.ui.plugin.add("resizable", "containment", {
      start: function() {
        var e,
          i,
          s,
          n,
          o,
          a,
          r,
          h = t(this).resizable("instance"),
          l = h.options,
          c = h.element,
          u = l.containment,
          d =
            u instanceof t
              ? u.get(0)
              : /parent/.test(u)
              ? c.parent().get(0)
              : u;
        d &&
          ((h.containerElement = t(d)),
          /document/.test(u) || u === document
            ? ((h.containerOffset = { left: 0, top: 0 }),
              (h.containerPosition = { left: 0, top: 0 }),
              (h.parentData = {
                element: t(document),
                left: 0,
                top: 0,
                width: t(document).width(),
                height:
                  t(document).height() || document.body.parentNode.scrollHeight
              }))
            : ((e = t(d)),
              (i = []),
              t(["Top", "Right", "Left", "Bottom"]).each(function(t, s) {
                i[t] = h._num(e.css("padding" + s));
              }),
              (h.containerOffset = e.offset()),
              (h.containerPosition = e.position()),
              (h.containerSize = {
                height: e.innerHeight() - i[3],
                width: e.innerWidth() - i[1]
              }),
              (s = h.containerOffset),
              (n = h.containerSize.height),
              (o = h.containerSize.width),
              (a = h._hasScroll(d, "left") ? d.scrollWidth : o),
              (r = h._hasScroll(d) ? d.scrollHeight : n),
              (h.parentData = {
                element: d,
                left: s.left,
                top: s.top,
                width: a,
                height: r
              })));
      },
      resize: function(e) {
        var i,
          s,
          n,
          o,
          a = t(this).resizable("instance"),
          r = a.options,
          h = a.containerOffset,
          l = a.position,
          c = a._aspectRatio || e.shiftKey,
          u = { top: 0, left: 0 },
          d = a.containerElement,
          p = !0;
        d[0] !== document && /static/.test(d.css("position")) && (u = h),
          l.left < (a._helper ? h.left : 0) &&
            ((a.size.width =
              a.size.width +
              (a._helper
                ? a.position.left - h.left
                : a.position.left - u.left)),
            c && ((a.size.height = a.size.width / a.aspectRatio), (p = !1)),
            (a.position.left = r.helper ? h.left : 0)),
          l.top < (a._helper ? h.top : 0) &&
            ((a.size.height =
              a.size.height +
              (a._helper ? a.position.top - h.top : a.position.top)),
            c && ((a.size.width = a.size.height * a.aspectRatio), (p = !1)),
            (a.position.top = a._helper ? h.top : 0)),
          (n = a.containerElement.get(0) === a.element.parent().get(0)),
          (o = /relative|absolute/.test(a.containerElement.css("position"))),
          n && o
            ? ((a.offset.left = a.parentData.left + a.position.left),
              (a.offset.top = a.parentData.top + a.position.top))
            : ((a.offset.left = a.element.offset().left),
              (a.offset.top = a.element.offset().top)),
          (i = Math.abs(
            a.sizeDiff.width +
              (a._helper ? a.offset.left - u.left : a.offset.left - h.left)
          )),
          (s = Math.abs(
            a.sizeDiff.height +
              (a._helper ? a.offset.top - u.top : a.offset.top - h.top)
          )),
          i + a.size.width >= a.parentData.width &&
            ((a.size.width = a.parentData.width - i),
            c && ((a.size.height = a.size.width / a.aspectRatio), (p = !1))),
          s + a.size.height >= a.parentData.height &&
            ((a.size.height = a.parentData.height - s),
            c && ((a.size.width = a.size.height * a.aspectRatio), (p = !1))),
          p ||
            ((a.position.left = a.prevPosition.left),
            (a.position.top = a.prevPosition.top),
            (a.size.width = a.prevSize.width),
            (a.size.height = a.prevSize.height));
      },
      stop: function() {
        var e = t(this).resizable("instance"),
          i = e.options,
          s = e.containerOffset,
          n = e.containerPosition,
          o = e.containerElement,
          a = t(e.helper),
          r = a.offset(),
          h = a.outerWidth() - e.sizeDiff.width,
          l = a.outerHeight() - e.sizeDiff.height;
        e._helper &&
          !i.animate &&
          /relative/.test(o.css("position")) &&
          t(this).css({ left: r.left - n.left - s.left, width: h, height: l }),
          e._helper &&
            !i.animate &&
            /static/.test(o.css("position")) &&
            t(this).css({
              left: r.left - n.left - s.left,
              width: h,
              height: l
            });
      }
    }),
    t.ui.plugin.add("resizable", "alsoResize", {
      start: function() {
        var e = t(this).resizable("instance"),
          i = e.options;
        t(i.alsoResize).each(function() {
          var e = t(this);
          e.data("ui-resizable-alsoresize", {
            width: parseFloat(e.width()),
            height: parseFloat(e.height()),
            left: parseFloat(e.css("left")),
            top: parseFloat(e.css("top"))
          });
        });
      },
      resize: function(e, i) {
        var s = t(this).resizable("instance"),
          n = s.options,
          o = s.originalSize,
          a = s.originalPosition,
          r = {
            height: s.size.height - o.height || 0,
            width: s.size.width - o.width || 0,
            top: s.position.top - a.top || 0,
            left: s.position.left - a.left || 0
          };
        t(n.alsoResize).each(function() {
          var e = t(this),
            s = t(this).data("ui-resizable-alsoresize"),
            n = {},
            o = e.parents(i.originalElement[0]).length
              ? ["width", "height"]
              : ["width", "height", "top", "left"];
          t.each(o, function(t, e) {
            var i = (s[e] || 0) + (r[e] || 0);
            i && i >= 0 && (n[e] = i || null);
          }),
            e.css(n);
        });
      },
      stop: function() {
        t(this).removeData("ui-resizable-alsoresize");
      }
    }),
    t.ui.plugin.add("resizable", "ghost", {
      start: function() {
        var e = t(this).resizable("instance"),
          i = e.size;
        (e.ghost = e.originalElement.clone()),
          e.ghost.css({
            opacity: 0.25,
            display: "block",
            position: "relative",
            height: i.height,
            width: i.width,
            margin: 0,
            left: 0,
            top: 0
          }),
          e._addClass(e.ghost, "ui-resizable-ghost"),
          t.uiBackCompat !== !1 &&
            "string" == typeof e.options.ghost &&
            e.ghost.addClass(this.options.ghost),
          e.ghost.appendTo(e.helper);
      },
      resize: function() {
        var e = t(this).resizable("instance");
        e.ghost &&
          e.ghost.css({
            position: "relative",
            height: e.size.height,
            width: e.size.width
          });
      },
      stop: function() {
        var e = t(this).resizable("instance");
        e.ghost && e.helper && e.helper.get(0).removeChild(e.ghost.get(0));
      }
    }),
    t.ui.plugin.add("resizable", "grid", {
      resize: function() {
        var e,
          i = t(this).resizable("instance"),
          s = i.options,
          n = i.size,
          o = i.originalSize,
          a = i.originalPosition,
          r = i.axis,
          h = "number" == typeof s.grid ? [s.grid, s.grid] : s.grid,
          l = h[0] || 1,
          c = h[1] || 1,
          u = Math.round((n.width - o.width) / l) * l,
          d = Math.round((n.height - o.height) / c) * c,
          p = o.width + u,
          f = o.height + d,
          g = s.maxWidth && p > s.maxWidth,
          m = s.maxHeight && f > s.maxHeight,
          _ = s.minWidth && s.minWidth > p,
          v = s.minHeight && s.minHeight > f;
        (s.grid = h),
          _ && (p += l),
          v && (f += c),
          g && (p -= l),
          m && (f -= c),
          /^(se|s|e)$/.test(r)
            ? ((i.size.width = p), (i.size.height = f))
            : /^(ne)$/.test(r)
            ? ((i.size.width = p),
              (i.size.height = f),
              (i.position.top = a.top - d))
            : /^(sw)$/.test(r)
            ? ((i.size.width = p),
              (i.size.height = f),
              (i.position.left = a.left - u))
            : ((0 >= f - c || 0 >= p - l) &&
                (e = i._getPaddingPlusBorderDimensions(this)),
              f - c > 0
                ? ((i.size.height = f), (i.position.top = a.top - d))
                : ((f = c - e.height),
                  (i.size.height = f),
                  (i.position.top = a.top + o.height - f)),
              p - l > 0
                ? ((i.size.width = p), (i.position.left = a.left - u))
                : ((p = l - e.width),
                  (i.size.width = p),
                  (i.position.left = a.left + o.width - p)));
      }
    }),
    t.ui.resizable,
    t.widget("ui.selectable", t.ui.mouse, {
      version: "1.12.0",
      options: {
        appendTo: "body",
        autoRefresh: !0,
        distance: 0,
        filter: "*",
        tolerance: "touch",
        selected: null,
        selecting: null,
        start: null,
        stop: null,
        unselected: null,
        unselecting: null
      },
      _create: function() {
        var e = this;
        this._addClass("ui-selectable"),
          (this.dragged = !1),
          (this.refresh = function() {
            (e.elementPos = t(e.element[0]).offset()),
              (e.selectees = t(e.options.filter, e.element[0])),
              e._addClass(e.selectees, "ui-selectee"),
              e.selectees.each(function() {
                var i = t(this),
                  s = i.offset(),
                  n = {
                    left: s.left - e.elementPos.left,
                    top: s.top - e.elementPos.top
                  };
                t.data(this, "selectable-item", {
                  element: this,
                  $element: i,
                  left: n.left,
                  top: n.top,
                  right: n.left + i.outerWidth(),
                  bottom: n.top + i.outerHeight(),
                  startselected: !1,
                  selected: i.hasClass("ui-selected"),
                  selecting: i.hasClass("ui-selecting"),
                  unselecting: i.hasClass("ui-unselecting")
                });
              });
          }),
          this.refresh(),
          this._mouseInit(),
          (this.helper = t("<div>")),
          this._addClass(this.helper, "ui-selectable-helper");
      },
      _destroy: function() {
        this.selectees.removeData("selectable-item"), this._mouseDestroy();
      },
      _mouseStart: function(e) {
        var i = this,
          s = this.options;
        (this.opos = [e.pageX, e.pageY]),
          (this.elementPos = t(this.element[0]).offset()),
          this.options.disabled ||
            ((this.selectees = t(s.filter, this.element[0])),
            this._trigger("start", e),
            t(s.appendTo).append(this.helper),
            this.helper.css({
              left: e.pageX,
              top: e.pageY,
              width: 0,
              height: 0
            }),
            s.autoRefresh && this.refresh(),
            this.selectees.filter(".ui-selected").each(function() {
              var s = t.data(this, "selectable-item");
              (s.startselected = !0),
                e.metaKey ||
                  e.ctrlKey ||
                  (i._removeClass(s.$element, "ui-selected"),
                  (s.selected = !1),
                  i._addClass(s.$element, "ui-unselecting"),
                  (s.unselecting = !0),
                  i._trigger("unselecting", e, { unselecting: s.element }));
            }),
            t(e.target)
              .parents()
              .addBack()
              .each(function() {
                var s,
                  n = t.data(this, "selectable-item");
                return n
                  ? ((s =
                      (!e.metaKey && !e.ctrlKey) ||
                      !n.$element.hasClass("ui-selected")),
                    i
                      ._removeClass(
                        n.$element,
                        s ? "ui-unselecting" : "ui-selected"
                      )
                      ._addClass(
                        n.$element,
                        s ? "ui-selecting" : "ui-unselecting"
                      ),
                    (n.unselecting = !s),
                    (n.selecting = s),
                    (n.selected = s),
                    s
                      ? i._trigger("selecting", e, { selecting: n.element })
                      : i._trigger("unselecting", e, {
                          unselecting: n.element
                        }),
                    !1)
                  : void 0;
              }));
      },
      _mouseDrag: function(e) {
        if (((this.dragged = !0), !this.options.disabled)) {
          var i,
            s = this,
            n = this.options,
            o = this.opos[0],
            a = this.opos[1],
            r = e.pageX,
            h = e.pageY;
          return (
            o > r && ((i = r), (r = o), (o = i)),
            a > h && ((i = h), (h = a), (a = i)),
            this.helper.css({ left: o, top: a, width: r - o, height: h - a }),
            this.selectees.each(function() {
              var i = t.data(this, "selectable-item"),
                l = !1,
                c = {};
              i &&
                i.element !== s.element[0] &&
                ((c.left = i.left + s.elementPos.left),
                (c.right = i.right + s.elementPos.left),
                (c.top = i.top + s.elementPos.top),
                (c.bottom = i.bottom + s.elementPos.top),
                "touch" === n.tolerance
                  ? (l = !(
                      c.left > r ||
                      o > c.right ||
                      c.top > h ||
                      a > c.bottom
                    ))
                  : "fit" === n.tolerance &&
                    (l =
                      c.left > o && r > c.right && c.top > a && h > c.bottom),
                l
                  ? (i.selected &&
                      (s._removeClass(i.$element, "ui-selected"),
                      (i.selected = !1)),
                    i.unselecting &&
                      (s._removeClass(i.$element, "ui-unselecting"),
                      (i.unselecting = !1)),
                    i.selecting ||
                      (s._addClass(i.$element, "ui-selecting"),
                      (i.selecting = !0),
                      s._trigger("selecting", e, { selecting: i.element })))
                  : (i.selecting &&
                      ((e.metaKey || e.ctrlKey) && i.startselected
                        ? (s._removeClass(i.$element, "ui-selecting"),
                          (i.selecting = !1),
                          s._addClass(i.$element, "ui-selected"),
                          (i.selected = !0))
                        : (s._removeClass(i.$element, "ui-selecting"),
                          (i.selecting = !1),
                          i.startselected &&
                            (s._addClass(i.$element, "ui-unselecting"),
                            (i.unselecting = !0)),
                          s._trigger("unselecting", e, {
                            unselecting: i.element
                          }))),
                    i.selected &&
                      (e.metaKey ||
                        e.ctrlKey ||
                        i.startselected ||
                        (s._removeClass(i.$element, "ui-selected"),
                        (i.selected = !1),
                        s._addClass(i.$element, "ui-unselecting"),
                        (i.unselecting = !0),
                        s._trigger("unselecting", e, {
                          unselecting: i.element
                        })))));
            }),
            !1
          );
        }
      },
      _mouseStop: function(e) {
        var i = this;
        return (
          (this.dragged = !1),
          t(".ui-unselecting", this.element[0]).each(function() {
            var s = t.data(this, "selectable-item");
            i._removeClass(s.$element, "ui-unselecting"),
              (s.unselecting = !1),
              (s.startselected = !1),
              i._trigger("unselected", e, { unselected: s.element });
          }),
          t(".ui-selecting", this.element[0]).each(function() {
            var s = t.data(this, "selectable-item");
            i
              ._removeClass(s.$element, "ui-selecting")
              ._addClass(s.$element, "ui-selected"),
              (s.selecting = !1),
              (s.selected = !0),
              (s.startselected = !0),
              i._trigger("selected", e, { selected: s.element });
          }),
          this._trigger("stop", e),
          this.helper.remove(),
          !1
        );
      }
    }),
    t.widget("ui.sortable", t.ui.mouse, {
      version: "1.12.0",
      widgetEventPrefix: "sort",
      ready: !1,
      options: {
        appendTo: "parent",
        axis: !1,
        connectWith: !1,
        containment: !1,
        cursor: "auto",
        cursorAt: !1,
        dropOnEmpty: !0,
        forcePlaceholderSize: !1,
        forceHelperSize: !1,
        grid: !1,
        handle: !1,
        helper: "original",
        items: "> *",
        opacity: !1,
        placeholder: !1,
        revert: !1,
        scroll: !0,
        scrollSensitivity: 20,
        scrollSpeed: 20,
        scope: "default",
        tolerance: "intersect",
        zIndex: 1e3,
        activate: null,
        beforeStop: null,
        change: null,
        deactivate: null,
        out: null,
        over: null,
        receive: null,
        remove: null,
        sort: null,
        start: null,
        stop: null,
        update: null
      },
      _isOverAxis: function(t, e, i) {
        return t >= e && e + i > t;
      },
      _isFloating: function(t) {
        return (
          /left|right/.test(t.css("float")) ||
          /inline|table-cell/.test(t.css("display"))
        );
      },
      _create: function() {
        (this.containerCache = {}),
          this._addClass("ui-sortable"),
          this.refresh(),
          (this.offset = this.element.offset()),
          this._mouseInit(),
          this._setHandleClassName(),
          (this.ready = !0);
      },
      _setOption: function(t, e) {
        this._super(t, e), "handle" === t && this._setHandleClassName();
      },
      _setHandleClassName: function() {
        var e = this;
        this._removeClass(
          this.element.find(".ui-sortable-handle"),
          "ui-sortable-handle"
        ),
          t.each(this.items, function() {
            e._addClass(
              this.instance.options.handle
                ? this.item.find(this.instance.options.handle)
                : this.item,
              "ui-sortable-handle"
            );
          });
      },
      _destroy: function() {
        this._mouseDestroy();
        for (var t = this.items.length - 1; t >= 0; t--)
          this.items[t].item.removeData(this.widgetName + "-item");
        return this;
      },
      _mouseCapture: function(e, i) {
        var s = null,
          n = !1,
          o = this;
        return this.reverting
          ? !1
          : this.options.disabled || "static" === this.options.type
          ? !1
          : (this._refreshItems(e),
            t(e.target)
              .parents()
              .each(function() {
                return t.data(this, o.widgetName + "-item") === o
                  ? ((s = t(this)), !1)
                  : void 0;
              }),
            t.data(e.target, o.widgetName + "-item") === o && (s = t(e.target)),
            s
              ? !this.options.handle ||
                i ||
                (t(this.options.handle, s)
                  .find("*")
                  .addBack()
                  .each(function() {
                    this === e.target && (n = !0);
                  }),
                n)
                ? ((this.currentItem = s), this._removeCurrentsFromItems(), !0)
                : !1
              : !1);
      },
      _mouseStart: function(e, i, s) {
        var n,
          o,
          a = this.options;
        if (
          ((this.currentContainer = this),
          this.refreshPositions(),
          (this.helper = this._createHelper(e)),
          this._cacheHelperProportions(),
          this._cacheMargins(),
          (this.scrollParent = this.helper.scrollParent()),
          (this.offset = this.currentItem.offset()),
          (this.offset = {
            top: this.offset.top - this.margins.top,
            left: this.offset.left - this.margins.left
          }),
          t.extend(this.offset, {
            click: {
              left: e.pageX - this.offset.left,
              top: e.pageY - this.offset.top
            },
            parent: this._getParentOffset(),
            relative: this._getRelativeOffset()
          }),
          this.helper.css("position", "absolute"),
          (this.cssPosition = this.helper.css("position")),
          (this.originalPosition = this._generatePosition(e)),
          (this.originalPageX = e.pageX),
          (this.originalPageY = e.pageY),
          a.cursorAt && this._adjustOffsetFromHelper(a.cursorAt),
          (this.domPosition = {
            prev: this.currentItem.prev()[0],
            parent: this.currentItem.parent()[0]
          }),
          this.helper[0] !== this.currentItem[0] && this.currentItem.hide(),
          this._createPlaceholder(),
          a.containment && this._setContainment(),
          a.cursor &&
            "auto" !== a.cursor &&
            ((o = this.document.find("body")),
            (this.storedCursor = o.css("cursor")),
            o.css("cursor", a.cursor),
            (this.storedStylesheet = t(
              "<style>*{ cursor: " + a.cursor + " !important; }</style>"
            ).appendTo(o))),
          a.opacity &&
            (this.helper.css("opacity") &&
              (this._storedOpacity = this.helper.css("opacity")),
            this.helper.css("opacity", a.opacity)),
          a.zIndex &&
            (this.helper.css("zIndex") &&
              (this._storedZIndex = this.helper.css("zIndex")),
            this.helper.css("zIndex", a.zIndex)),
          this.scrollParent[0] !== this.document[0] &&
            "HTML" !== this.scrollParent[0].tagName &&
            (this.overflowOffset = this.scrollParent.offset()),
          this._trigger("start", e, this._uiHash()),
          this._preserveHelperProportions || this._cacheHelperProportions(),
          !s)
        )
          for (n = this.containers.length - 1; n >= 0; n--)
            this.containers[n]._trigger("activate", e, this._uiHash(this));
        return (
          t.ui.ddmanager && (t.ui.ddmanager.current = this),
          t.ui.ddmanager &&
            !a.dropBehaviour &&
            t.ui.ddmanager.prepareOffsets(this, e),
          (this.dragging = !0),
          this._addClass(this.helper, "ui-sortable-helper"),
          this._mouseDrag(e),
          !0
        );
      },
      _mouseDrag: function(e) {
        var i,
          s,
          n,
          o,
          a = this.options,
          r = !1;
        for (
          this.position = this._generatePosition(e),
            this.positionAbs = this._convertPositionTo("absolute"),
            this.lastPositionAbs || (this.lastPositionAbs = this.positionAbs),
            this.options.scroll &&
              (this.scrollParent[0] !== this.document[0] &&
              "HTML" !== this.scrollParent[0].tagName
                ? (this.overflowOffset.top +
                    this.scrollParent[0].offsetHeight -
                    e.pageY <
                  a.scrollSensitivity
                    ? (this.scrollParent[0].scrollTop = r =
                        this.scrollParent[0].scrollTop + a.scrollSpeed)
                    : e.pageY - this.overflowOffset.top < a.scrollSensitivity &&
                      (this.scrollParent[0].scrollTop = r =
                        this.scrollParent[0].scrollTop - a.scrollSpeed),
                  this.overflowOffset.left +
                    this.scrollParent[0].offsetWidth -
                    e.pageX <
                  a.scrollSensitivity
                    ? (this.scrollParent[0].scrollLeft = r =
                        this.scrollParent[0].scrollLeft + a.scrollSpeed)
                    : e.pageX - this.overflowOffset.left <
                        a.scrollSensitivity &&
                      (this.scrollParent[0].scrollLeft = r =
                        this.scrollParent[0].scrollLeft - a.scrollSpeed))
                : (e.pageY - this.document.scrollTop() < a.scrollSensitivity
                    ? (r = this.document.scrollTop(
                        this.document.scrollTop() - a.scrollSpeed
                      ))
                    : this.window.height() -
                        (e.pageY - this.document.scrollTop()) <
                        a.scrollSensitivity &&
                      (r = this.document.scrollTop(
                        this.document.scrollTop() + a.scrollSpeed
                      )),
                  e.pageX - this.document.scrollLeft() < a.scrollSensitivity
                    ? (r = this.document.scrollLeft(
                        this.document.scrollLeft() - a.scrollSpeed
                      ))
                    : this.window.width() -
                        (e.pageX - this.document.scrollLeft()) <
                        a.scrollSensitivity &&
                      (r = this.document.scrollLeft(
                        this.document.scrollLeft() + a.scrollSpeed
                      ))),
              r !== !1 &&
                t.ui.ddmanager &&
                !a.dropBehaviour &&
                t.ui.ddmanager.prepareOffsets(this, e)),
            this.positionAbs = this._convertPositionTo("absolute"),
            (this.options.axis && "y" === this.options.axis) ||
              (this.helper[0].style.left = this.position.left + "px"),
            (this.options.axis && "x" === this.options.axis) ||
              (this.helper[0].style.top = this.position.top + "px"),
            i = this.items.length - 1;
          i >= 0;
          i--
        )
          if (
            ((s = this.items[i]),
            (n = s.item[0]),
            (o = this._intersectsWithPointer(s)),
            o &&
              s.instance === this.currentContainer &&
              n !== this.currentItem[0] &&
              this.placeholder[1 === o ? "next" : "prev"]()[0] !== n &&
              !t.contains(this.placeholder[0], n) &&
              ("semi-dynamic" === this.options.type
                ? !t.contains(this.element[0], n)
                : !0))
          ) {
            if (
              ((this.direction = 1 === o ? "down" : "up"),
              "pointer" !== this.options.tolerance &&
                !this._intersectsWithSides(s))
            )
              break;
            this._rearrange(e, s), this._trigger("change", e, this._uiHash());
            break;
          }
        return (
          this._contactContainers(e),
          t.ui.ddmanager && t.ui.ddmanager.drag(this, e),
          this._trigger("sort", e, this._uiHash()),
          (this.lastPositionAbs = this.positionAbs),
          !1
        );
      },
      _mouseStop: function(e, i) {
        if (e) {
          if (
            (t.ui.ddmanager &&
              !this.options.dropBehaviour &&
              t.ui.ddmanager.drop(this, e),
            this.options.revert)
          ) {
            var s = this,
              n = this.placeholder.offset(),
              o = this.options.axis,
              a = {};
            (o && "x" !== o) ||
              (a.left =
                n.left -
                this.offset.parent.left -
                this.margins.left +
                (this.offsetParent[0] === this.document[0].body
                  ? 0
                  : this.offsetParent[0].scrollLeft)),
              (o && "y" !== o) ||
                (a.top =
                  n.top -
                  this.offset.parent.top -
                  this.margins.top +
                  (this.offsetParent[0] === this.document[0].body
                    ? 0
                    : this.offsetParent[0].scrollTop)),
              (this.reverting = !0),
              t(this.helper).animate(
                a,
                parseInt(this.options.revert, 10) || 500,
                function() {
                  s._clear(e);
                }
              );
          } else this._clear(e, i);
          return !1;
        }
      },
      cancel: function() {
        if (this.dragging) {
          this._mouseUp({ target: null }),
            "original" === this.options.helper
              ? (this.currentItem.css(this._storedCSS),
                this._removeClass(this.currentItem, "ui-sortable-helper"))
              : this.currentItem.show();
          for (var e = this.containers.length - 1; e >= 0; e--)
            this.containers[e]._trigger("deactivate", null, this._uiHash(this)),
              this.containers[e].containerCache.over &&
                (this.containers[e]._trigger("out", null, this._uiHash(this)),
                (this.containers[e].containerCache.over = 0));
        }
        return (
          this.placeholder &&
            (this.placeholder[0].parentNode &&
              this.placeholder[0].parentNode.removeChild(this.placeholder[0]),
            "original" !== this.options.helper &&
              this.helper &&
              this.helper[0].parentNode &&
              this.helper.remove(),
            t.extend(this, {
              helper: null,
              dragging: !1,
              reverting: !1,
              _noFinalSort: null
            }),
            this.domPosition.prev
              ? t(this.domPosition.prev).after(this.currentItem)
              : t(this.domPosition.parent).prepend(this.currentItem)),
          this
        );
      },
      serialize: function(e) {
        var i = this._getItemsAsjQuery(e && e.connected),
          s = [];
        return (
          (e = e || {}),
          t(i).each(function() {
            var i = (t(e.item || this).attr(e.attribute || "id") || "").match(
              e.expression || /(.+)[\-=_](.+)/
            );
            i &&
              s.push(
                (e.key || i[1] + "[]") +
                  "=" +
                  (e.key && e.expression ? i[1] : i[2])
              );
          }),
          !s.length && e.key && s.push(e.key + "="),
          s.join("&")
        );
      },
      toArray: function(e) {
        var i = this._getItemsAsjQuery(e && e.connected),
          s = [];
        return (
          (e = e || {}),
          i.each(function() {
            s.push(t(e.item || this).attr(e.attribute || "id") || "");
          }),
          s
        );
      },
      _intersectsWith: function(t) {
        var e = this.positionAbs.left,
          i = e + this.helperProportions.width,
          s = this.positionAbs.top,
          n = s + this.helperProportions.height,
          o = t.left,
          a = o + t.width,
          r = t.top,
          h = r + t.height,
          l = this.offset.click.top,
          c = this.offset.click.left,
          u = "x" === this.options.axis || (s + l > r && h > s + l),
          d = "y" === this.options.axis || (e + c > o && a > e + c),
          p = u && d;
        return "pointer" === this.options.tolerance ||
          this.options.forcePointerForContainers ||
          ("pointer" !== this.options.tolerance &&
            this.helperProportions[this.floating ? "width" : "height"] >
              t[this.floating ? "width" : "height"])
          ? p
          : e + this.helperProportions.width / 2 > o &&
              a > i - this.helperProportions.width / 2 &&
              s + this.helperProportions.height / 2 > r &&
              h > n - this.helperProportions.height / 2;
      },
      _intersectsWithPointer: function(t) {
        var e,
          i,
          s =
            "x" === this.options.axis ||
            this._isOverAxis(
              this.positionAbs.top + this.offset.click.top,
              t.top,
              t.height
            ),
          n =
            "y" === this.options.axis ||
            this._isOverAxis(
              this.positionAbs.left + this.offset.click.left,
              t.left,
              t.width
            ),
          o = s && n;
        return o
          ? ((e = this._getDragVerticalDirection()),
            (i = this._getDragHorizontalDirection()),
            this.floating
              ? "right" === i || "down" === e
                ? 2
                : 1
              : e && ("down" === e ? 2 : 1))
          : !1;
      },
      _intersectsWithSides: function(t) {
        var e = this._isOverAxis(
            this.positionAbs.top + this.offset.click.top,
            t.top + t.height / 2,
            t.height
          ),
          i = this._isOverAxis(
            this.positionAbs.left + this.offset.click.left,
            t.left + t.width / 2,
            t.width
          ),
          s = this._getDragVerticalDirection(),
          n = this._getDragHorizontalDirection();
        return this.floating && n
          ? ("right" === n && i) || ("left" === n && !i)
          : s && (("down" === s && e) || ("up" === s && !e));
      },
      _getDragVerticalDirection: function() {
        var t = this.positionAbs.top - this.lastPositionAbs.top;
        return 0 !== t && (t > 0 ? "down" : "up");
      },
      _getDragHorizontalDirection: function() {
        var t = this.positionAbs.left - this.lastPositionAbs.left;
        return 0 !== t && (t > 0 ? "right" : "left");
      },
      refresh: function(t) {
        return (
          this._refreshItems(t),
          this._setHandleClassName(),
          this.refreshPositions(),
          this
        );
      },
      _connectWith: function() {
        var t = this.options;
        return t.connectWith.constructor === String
          ? [t.connectWith]
          : t.connectWith;
      },
      _getItemsAsjQuery: function(e) {
        function i() {
          r.push(this);
        }
        var s,
          n,
          o,
          a,
          r = [],
          h = [],
          l = this._connectWith();
        if (l && e)
          for (s = l.length - 1; s >= 0; s--)
            for (o = t(l[s], this.document[0]), n = o.length - 1; n >= 0; n--)
              (a = t.data(o[n], this.widgetFullName)),
                a &&
                  a !== this &&
                  !a.options.disabled &&
                  h.push([
                    t.isFunction(a.options.items)
                      ? a.options.items.call(a.element)
                      : t(a.options.items, a.element)
                          .not(".ui-sortable-helper")
                          .not(".ui-sortable-placeholder"),
                    a
                  ]);
        for (
          h.push([
            t.isFunction(this.options.items)
              ? this.options.items.call(this.element, null, {
                  options: this.options,
                  item: this.currentItem
                })
              : t(this.options.items, this.element)
                  .not(".ui-sortable-helper")
                  .not(".ui-sortable-placeholder"),
            this
          ]),
            s = h.length - 1;
          s >= 0;
          s--
        )
          h[s][0].each(i);
        return t(r);
      },
      _removeCurrentsFromItems: function() {
        var e = this.currentItem.find(":data(" + this.widgetName + "-item)");
        this.items = t.grep(this.items, function(t) {
          for (var i = 0; e.length > i; i++) if (e[i] === t.item[0]) return !1;
          return !0;
        });
      },
      _refreshItems: function(e) {
        (this.items = []), (this.containers = [this]);
        var i,
          s,
          n,
          o,
          a,
          r,
          h,
          l,
          c = this.items,
          u = [
            [
              t.isFunction(this.options.items)
                ? this.options.items.call(this.element[0], e, {
                    item: this.currentItem
                  })
                : t(this.options.items, this.element),
              this
            ]
          ],
          d = this._connectWith();
        if (d && this.ready)
          for (i = d.length - 1; i >= 0; i--)
            for (n = t(d[i], this.document[0]), s = n.length - 1; s >= 0; s--)
              (o = t.data(n[s], this.widgetFullName)),
                o &&
                  o !== this &&
                  !o.options.disabled &&
                  (u.push([
                    t.isFunction(o.options.items)
                      ? o.options.items.call(o.element[0], e, {
                          item: this.currentItem
                        })
                      : t(o.options.items, o.element),
                    o
                  ]),
                  this.containers.push(o));
        for (i = u.length - 1; i >= 0; i--)
          for (a = u[i][1], r = u[i][0], s = 0, l = r.length; l > s; s++)
            (h = t(r[s])),
              h.data(this.widgetName + "-item", a),
              c.push({
                item: h,
                instance: a,
                width: 0,
                height: 0,
                left: 0,
                top: 0
              });
      },
      refreshPositions: function(e) {
        (this.floating = this.items.length
          ? "x" === this.options.axis || this._isFloating(this.items[0].item)
          : !1),
          this.offsetParent &&
            this.helper &&
            (this.offset.parent = this._getParentOffset());
        var i, s, n, o;
        for (i = this.items.length - 1; i >= 0; i--)
          (s = this.items[i]),
            (s.instance !== this.currentContainer &&
              this.currentContainer &&
              s.item[0] !== this.currentItem[0]) ||
              ((n = this.options.toleranceElement
                ? t(this.options.toleranceElement, s.item)
                : s.item),
              e || ((s.width = n.outerWidth()), (s.height = n.outerHeight())),
              (o = n.offset()),
              (s.left = o.left),
              (s.top = o.top));
        if (this.options.custom && this.options.custom.refreshContainers)
          this.options.custom.refreshContainers.call(this);
        else
          for (i = this.containers.length - 1; i >= 0; i--)
            (o = this.containers[i].element.offset()),
              (this.containers[i].containerCache.left = o.left),
              (this.containers[i].containerCache.top = o.top),
              (this.containers[i].containerCache.width = this.containers[
                i
              ].element.outerWidth()),
              (this.containers[i].containerCache.height = this.containers[
                i
              ].element.outerHeight());
        return this;
      },
      _createPlaceholder: function(e) {
        e = e || this;
        var i,
          s = e.options;
        (s.placeholder && s.placeholder.constructor !== String) ||
          ((i = s.placeholder),
          (s.placeholder = {
            element: function() {
              var s = e.currentItem[0].nodeName.toLowerCase(),
                n = t("<" + s + ">", e.document[0]);
              return (
                e
                  ._addClass(
                    n,
                    "ui-sortable-placeholder",
                    i || e.currentItem[0].className
                  )
                  ._removeClass(n, "ui-sortable-helper"),
                "tbody" === s
                  ? e._createTrPlaceholder(
                      e.currentItem.find("tr").eq(0),
                      t("<tr>", e.document[0]).appendTo(n)
                    )
                  : "tr" === s
                  ? e._createTrPlaceholder(e.currentItem, n)
                  : "img" === s && n.attr("src", e.currentItem.attr("src")),
                i || n.css("visibility", "hidden"),
                n
              );
            },
            update: function(t, n) {
              (!i || s.forcePlaceholderSize) &&
                (n.height() ||
                  n.height(
                    e.currentItem.innerHeight() -
                      parseInt(e.currentItem.css("paddingTop") || 0, 10) -
                      parseInt(e.currentItem.css("paddingBottom") || 0, 10)
                  ),
                n.width() ||
                  n.width(
                    e.currentItem.innerWidth() -
                      parseInt(e.currentItem.css("paddingLeft") || 0, 10) -
                      parseInt(e.currentItem.css("paddingRight") || 0, 10)
                  ));
            }
          })),
          (e.placeholder = t(
            s.placeholder.element.call(e.element, e.currentItem)
          )),
          e.currentItem.after(e.placeholder),
          s.placeholder.update(e, e.placeholder);
      },
      _createTrPlaceholder: function(e, i) {
        var s = this;
        e.children().each(function() {
          t("<td>&#160;</td>", s.document[0])
            .attr("colspan", t(this).attr("colspan") || 1)
            .appendTo(i);
        });
      },
      _contactContainers: function(e) {
        var i,
          s,
          n,
          o,
          a,
          r,
          h,
          l,
          c,
          u,
          d = null,
          p = null;
        for (i = this.containers.length - 1; i >= 0; i--)
          if (!t.contains(this.currentItem[0], this.containers[i].element[0]))
            if (this._intersectsWith(this.containers[i].containerCache)) {
              if (d && t.contains(this.containers[i].element[0], d.element[0]))
                continue;
              (d = this.containers[i]), (p = i);
            } else
              this.containers[i].containerCache.over &&
                (this.containers[i]._trigger("out", e, this._uiHash(this)),
                (this.containers[i].containerCache.over = 0));
        if (d)
          if (1 === this.containers.length)
            this.containers[p].containerCache.over ||
              (this.containers[p]._trigger("over", e, this._uiHash(this)),
              (this.containers[p].containerCache.over = 1));
          else {
            for (
              n = 1e4,
                o = null,
                c = d.floating || this._isFloating(this.currentItem),
                a = c ? "left" : "top",
                r = c ? "width" : "height",
                u = c ? "pageX" : "pageY",
                s = this.items.length - 1;
              s >= 0;
              s--
            )
              t.contains(
                this.containers[p].element[0],
                this.items[s].item[0]
              ) &&
                this.items[s].item[0] !== this.currentItem[0] &&
                ((h = this.items[s].item.offset()[a]),
                (l = !1),
                e[u] - h > this.items[s][r] / 2 && (l = !0),
                n > Math.abs(e[u] - h) &&
                  ((n = Math.abs(e[u] - h)),
                  (o = this.items[s]),
                  (this.direction = l ? "up" : "down")));
            if (!o && !this.options.dropOnEmpty) return;
            if (this.currentContainer === this.containers[p])
              return (
                this.currentContainer.containerCache.over ||
                  (this.containers[p]._trigger("over", e, this._uiHash()),
                  (this.currentContainer.containerCache.over = 1)),
                void 0
              );
            o
              ? this._rearrange(e, o, null, !0)
              : this._rearrange(e, null, this.containers[p].element, !0),
              this._trigger("change", e, this._uiHash()),
              this.containers[p]._trigger("change", e, this._uiHash(this)),
              (this.currentContainer = this.containers[p]),
              this.options.placeholder.update(
                this.currentContainer,
                this.placeholder
              ),
              this.containers[p]._trigger("over", e, this._uiHash(this)),
              (this.containers[p].containerCache.over = 1);
          }
      },
      _createHelper: function(e) {
        var i = this.options,
          s = t.isFunction(i.helper)
            ? t(i.helper.apply(this.element[0], [e, this.currentItem]))
            : "clone" === i.helper
            ? this.currentItem.clone()
            : this.currentItem;
        return (
          s.parents("body").length ||
            t(
              "parent" !== i.appendTo
                ? i.appendTo
                : this.currentItem[0].parentNode
            )[0].appendChild(s[0]),
          s[0] === this.currentItem[0] &&
            (this._storedCSS = {
              width: this.currentItem[0].style.width,
              height: this.currentItem[0].style.height,
              position: this.currentItem.css("position"),
              top: this.currentItem.css("top"),
              left: this.currentItem.css("left")
            }),
          (!s[0].style.width || i.forceHelperSize) &&
            s.width(this.currentItem.width()),
          (!s[0].style.height || i.forceHelperSize) &&
            s.height(this.currentItem.height()),
          s
        );
      },
      _adjustOffsetFromHelper: function(e) {
        "string" == typeof e && (e = e.split(" ")),
          t.isArray(e) && (e = { left: +e[0], top: +e[1] || 0 }),
          "left" in e && (this.offset.click.left = e.left + this.margins.left),
          "right" in e &&
            (this.offset.click.left =
              this.helperProportions.width - e.right + this.margins.left),
          "top" in e && (this.offset.click.top = e.top + this.margins.top),
          "bottom" in e &&
            (this.offset.click.top =
              this.helperProportions.height - e.bottom + this.margins.top);
      },
      _getParentOffset: function() {
        this.offsetParent = this.helper.offsetParent();
        var e = this.offsetParent.offset();
        return (
          "absolute" === this.cssPosition &&
            this.scrollParent[0] !== this.document[0] &&
            t.contains(this.scrollParent[0], this.offsetParent[0]) &&
            ((e.left += this.scrollParent.scrollLeft()),
            (e.top += this.scrollParent.scrollTop())),
          (this.offsetParent[0] === this.document[0].body ||
            (this.offsetParent[0].tagName &&
              "html" === this.offsetParent[0].tagName.toLowerCase() &&
              t.ui.ie)) &&
            (e = { top: 0, left: 0 }),
          {
            top:
              e.top +
              (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
            left:
              e.left +
              (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
          }
        );
      },
      _getRelativeOffset: function() {
        if ("relative" === this.cssPosition) {
          var t = this.currentItem.position();
          return {
            top:
              t.top -
              (parseInt(this.helper.css("top"), 10) || 0) +
              this.scrollParent.scrollTop(),
            left:
              t.left -
              (parseInt(this.helper.css("left"), 10) || 0) +
              this.scrollParent.scrollLeft()
          };
        }
        return { top: 0, left: 0 };
      },
      _cacheMargins: function() {
        this.margins = {
          left: parseInt(this.currentItem.css("marginLeft"), 10) || 0,
          top: parseInt(this.currentItem.css("marginTop"), 10) || 0
        };
      },
      _cacheHelperProportions: function() {
        this.helperProportions = {
          width: this.helper.outerWidth(),
          height: this.helper.outerHeight()
        };
      },
      _setContainment: function() {
        var e,
          i,
          s,
          n = this.options;
        "parent" === n.containment &&
          (n.containment = this.helper[0].parentNode),
          ("document" === n.containment || "window" === n.containment) &&
            (this.containment = [
              0 - this.offset.relative.left - this.offset.parent.left,
              0 - this.offset.relative.top - this.offset.parent.top,
              "document" === n.containment
                ? this.document.width()
                : this.window.width() -
                  this.helperProportions.width -
                  this.margins.left,
              ("document" === n.containment
                ? this.document.height() ||
                  document.body.parentNode.scrollHeight
                : this.window.height() ||
                  this.document[0].body.parentNode.scrollHeight) -
                this.helperProportions.height -
                this.margins.top
            ]),
          /^(document|window|parent)$/.test(n.containment) ||
            ((e = t(n.containment)[0]),
            (i = t(n.containment).offset()),
            (s = "hidden" !== t(e).css("overflow")),
            (this.containment = [
              i.left +
                (parseInt(t(e).css("borderLeftWidth"), 10) || 0) +
                (parseInt(t(e).css("paddingLeft"), 10) || 0) -
                this.margins.left,
              i.top +
                (parseInt(t(e).css("borderTopWidth"), 10) || 0) +
                (parseInt(t(e).css("paddingTop"), 10) || 0) -
                this.margins.top,
              i.left +
                (s ? Math.max(e.scrollWidth, e.offsetWidth) : e.offsetWidth) -
                (parseInt(t(e).css("borderLeftWidth"), 10) || 0) -
                (parseInt(t(e).css("paddingRight"), 10) || 0) -
                this.helperProportions.width -
                this.margins.left,
              i.top +
                (s
                  ? Math.max(e.scrollHeight, e.offsetHeight)
                  : e.offsetHeight) -
                (parseInt(t(e).css("borderTopWidth"), 10) || 0) -
                (parseInt(t(e).css("paddingBottom"), 10) || 0) -
                this.helperProportions.height -
                this.margins.top
            ]));
      },
      _convertPositionTo: function(e, i) {
        i || (i = this.position);
        var s = "absolute" === e ? 1 : -1,
          n =
            "absolute" !== this.cssPosition ||
            (this.scrollParent[0] !== this.document[0] &&
              t.contains(this.scrollParent[0], this.offsetParent[0]))
              ? this.scrollParent
              : this.offsetParent,
          o = /(html|body)/i.test(n[0].tagName);
        return {
          top:
            i.top +
            this.offset.relative.top * s +
            this.offset.parent.top * s -
            ("fixed" === this.cssPosition
              ? -this.scrollParent.scrollTop()
              : o
              ? 0
              : n.scrollTop()) *
              s,
          left:
            i.left +
            this.offset.relative.left * s +
            this.offset.parent.left * s -
            ("fixed" === this.cssPosition
              ? -this.scrollParent.scrollLeft()
              : o
              ? 0
              : n.scrollLeft()) *
              s
        };
      },
      _generatePosition: function(e) {
        var i,
          s,
          n = this.options,
          o = e.pageX,
          a = e.pageY,
          r =
            "absolute" !== this.cssPosition ||
            (this.scrollParent[0] !== this.document[0] &&
              t.contains(this.scrollParent[0], this.offsetParent[0]))
              ? this.scrollParent
              : this.offsetParent,
          h = /(html|body)/i.test(r[0].tagName);
        return (
          "relative" !== this.cssPosition ||
            (this.scrollParent[0] !== this.document[0] &&
              this.scrollParent[0] !== this.offsetParent[0]) ||
            (this.offset.relative = this._getRelativeOffset()),
          this.originalPosition &&
            (this.containment &&
              (e.pageX - this.offset.click.left < this.containment[0] &&
                (o = this.containment[0] + this.offset.click.left),
              e.pageY - this.offset.click.top < this.containment[1] &&
                (a = this.containment[1] + this.offset.click.top),
              e.pageX - this.offset.click.left > this.containment[2] &&
                (o = this.containment[2] + this.offset.click.left),
              e.pageY - this.offset.click.top > this.containment[3] &&
                (a = this.containment[3] + this.offset.click.top)),
            n.grid &&
              ((i =
                this.originalPageY +
                Math.round((a - this.originalPageY) / n.grid[1]) * n.grid[1]),
              (a = this.containment
                ? i - this.offset.click.top >= this.containment[1] &&
                  i - this.offset.click.top <= this.containment[3]
                  ? i
                  : i - this.offset.click.top >= this.containment[1]
                  ? i - n.grid[1]
                  : i + n.grid[1]
                : i),
              (s =
                this.originalPageX +
                Math.round((o - this.originalPageX) / n.grid[0]) * n.grid[0]),
              (o = this.containment
                ? s - this.offset.click.left >= this.containment[0] &&
                  s - this.offset.click.left <= this.containment[2]
                  ? s
                  : s - this.offset.click.left >= this.containment[0]
                  ? s - n.grid[0]
                  : s + n.grid[0]
                : s))),
          {
            top:
              a -
              this.offset.click.top -
              this.offset.relative.top -
              this.offset.parent.top +
              ("fixed" === this.cssPosition
                ? -this.scrollParent.scrollTop()
                : h
                ? 0
                : r.scrollTop()),
            left:
              o -
              this.offset.click.left -
              this.offset.relative.left -
              this.offset.parent.left +
              ("fixed" === this.cssPosition
                ? -this.scrollParent.scrollLeft()
                : h
                ? 0
                : r.scrollLeft())
          }
        );
      },
      _rearrange: function(t, e, i, s) {
        i
          ? i[0].appendChild(this.placeholder[0])
          : e.item[0].parentNode.insertBefore(
              this.placeholder[0],
              "down" === this.direction ? e.item[0] : e.item[0].nextSibling
            ),
          (this.counter = this.counter ? ++this.counter : 1);
        var n = this.counter;
        this._delay(function() {
          n === this.counter && this.refreshPositions(!s);
        });
      },
      _clear: function(t, e) {
        function i(t, e, i) {
          return function(s) {
            i._trigger(t, s, e._uiHash(e));
          };
        }
        this.reverting = !1;
        var s,
          n = [];
        if (
          (!this._noFinalSort &&
            this.currentItem.parent().length &&
            this.placeholder.before(this.currentItem),
          (this._noFinalSort = null),
          this.helper[0] === this.currentItem[0])
        ) {
          for (s in this._storedCSS)
            ("auto" === this._storedCSS[s] ||
              "static" === this._storedCSS[s]) &&
              (this._storedCSS[s] = "");
          this.currentItem.css(this._storedCSS),
            this._removeClass(this.currentItem, "ui-sortable-helper");
        } else this.currentItem.show();
        for (
          this.fromOutside &&
            !e &&
            n.push(function(t) {
              this._trigger("receive", t, this._uiHash(this.fromOutside));
            }),
            (!this.fromOutside &&
              this.domPosition.prev ===
                this.currentItem.prev().not(".ui-sortable-helper")[0] &&
              this.domPosition.parent === this.currentItem.parent()[0]) ||
              e ||
              n.push(function(t) {
                this._trigger("update", t, this._uiHash());
              }),
            this !== this.currentContainer &&
              (e ||
                (n.push(function(t) {
                  this._trigger("remove", t, this._uiHash());
                }),
                n.push(
                  function(t) {
                    return function(e) {
                      t._trigger("receive", e, this._uiHash(this));
                    };
                  }.call(this, this.currentContainer)
                ),
                n.push(
                  function(t) {
                    return function(e) {
                      t._trigger("update", e, this._uiHash(this));
                    };
                  }.call(this, this.currentContainer)
                ))),
            s = this.containers.length - 1;
          s >= 0;
          s--
        )
          e || n.push(i("deactivate", this, this.containers[s])),
            this.containers[s].containerCache.over &&
              (n.push(i("out", this, this.containers[s])),
              (this.containers[s].containerCache.over = 0));
        if (
          (this.storedCursor &&
            (this.document.find("body").css("cursor", this.storedCursor),
            this.storedStylesheet.remove()),
          this._storedOpacity &&
            this.helper.css("opacity", this._storedOpacity),
          this._storedZIndex &&
            this.helper.css(
              "zIndex",
              "auto" === this._storedZIndex ? "" : this._storedZIndex
            ),
          (this.dragging = !1),
          e || this._trigger("beforeStop", t, this._uiHash()),
          this.placeholder[0].parentNode.removeChild(this.placeholder[0]),
          this.cancelHelperRemoval ||
            (this.helper[0] !== this.currentItem[0] && this.helper.remove(),
            (this.helper = null)),
          !e)
        ) {
          for (s = 0; n.length > s; s++) n[s].call(this, t);
          this._trigger("stop", t, this._uiHash());
        }
        return (this.fromOutside = !1), !this.cancelHelperRemoval;
      },
      _trigger: function() {
        t.Widget.prototype._trigger.apply(this, arguments) === !1 &&
          this.cancel();
      },
      _uiHash: function(e) {
        var i = e || this;
        return {
          helper: i.helper,
          placeholder: i.placeholder || t([]),
          position: i.position,
          originalPosition: i.originalPosition,
          offset: i.positionAbs,
          item: i.currentItem,
          sender: e ? e.element : null
        };
      }
    });
});
/*
 * jquery.ui.multiselect 组件：详情参见：jquery-ui.multiselect.js
 */
(function(a) {
  a.widget("ui.multiselect", {
    _init: function() {
      this.element.hide();
      this.id = this.element.attr("id");
      this.container = a(
        '<div class="ui-multiselect ui-helper-clearfix ui-widget"></div>'
      ).insertAfter(this.element);
      this.count = 0;
      this.selectedContainer = a('<div class="selected"></div>').appendTo(
        this.container
      );
      this.availableContainer = a('<div class="available"></div>').appendTo(
        this.container
      );
      this.selectedActions = a(
        '<div class="actions ui-widget-header ui-helper-clearfix"><span class="count">0 ' +
          a.ui.multiselect.locale.itemsCount +
          '</span><a href="#" class="remove-all">' +
          a.ui.multiselect.locale.removeAll +
          "</a></div>"
      ).appendTo(this.selectedContainer);
      this.availableActions = a(
        '<div class="actions ui-widget-header ui-helper-clearfix"><input type="text" class="search empty ui-widget-content ui-corner-all"/><a href="#" class="add-all">' +
          a.ui.multiselect.locale.addAll +
          "</a></div>"
      ).appendTo(this.availableContainer);
      this.selectedList = a(
        '<ul class="selected connected-list"><li class="ui-helper-hidden-accessible"></li></ul>'
      )
        .bind("selectstart", function() {
          return false;
        })
        .appendTo(this.selectedContainer);
      this.availableList = a(
        '<ul class="available connected-list"><li class="ui-helper-hidden-accessible"></li></ul>'
      )
        .bind("selectstart", function() {
          return false;
        })
        .appendTo(this.availableContainer);
      var b = this;
      this.container.width(this.element.width() + 1);
      this.selectedContainer.width(
        Math.floor(this.element.width() * this.options.dividerLocation)
      );
      this.availableContainer.width(
        Math.floor(this.element.width() * (1 - this.options.dividerLocation))
      );
      this.selectedList.height(
        Math.max(this.element.height() - this.selectedActions.height(), 1)
      );
      this.availableList.height(
        Math.max(this.element.height() - this.availableActions.height(), 1)
      );
      if (!this.options.animated) {
        this.options.show = "show";
        this.options.hide = "hide";
      }
      this._populateLists(this.element.find("option"));
      if (this.options.sortable) {
        a("ul.selected").sortable({
          placeholder: "ui-state-highlight",
          axis: "y",
          update: function(c, d) {
            b.selectedList.find("li").each(function() {
              if (a(this).data("optionLink")) {
                a(this)
                  .data("optionLink")
                  .remove()
                  .appendTo(b.element);
              }
            });
          },
          receive: function(c, d) {
            d.item.data("optionLink").attr("selected", true);
            b.count += 1;
            b._updateCount();
            b.selectedList.children(".ui-draggable").each(function() {
              a(this).removeClass("ui-draggable");
              a(this).data("optionLink", d.item.data("optionLink"));
              a(this).data("idx", d.item.data("idx"));
              b._applyItemState(a(this), true);
            });
            setTimeout(function() {
              d.item.remove();
            }, 1);
          }
        });
      }
      if (this.options.searchable) {
        this._registerSearchEvents(
          this.availableContainer.find("input.search")
        );
      } else {
        a(".search").hide();
      }
      a(".remove-all").click(function() {
        b._populateLists(b.element.find("option").removeAttr("selected"));
        return false;
      });
      a(".add-all").click(function() {
        b._populateLists(b.element.find("option").attr("selected", "selected"));
        return false;
      });
    },
    destroy: function() {
      this.element.show();
      this.container.remove();
      a.widget.prototype.destroy.apply(this, arguments);
    },
    _populateLists: function(c) {
      this.selectedList.children(".ui-element").remove();
      this.availableList.children(".ui-element").remove();
      this.count = 0;
      var d = this;
      var b = a(
        c.map(function(e) {
          var f = d
            ._getOptionNode(this)
            .appendTo(this.selected ? d.selectedList : d.availableList)
            .show();
          if (this.selected) {
            d.count += 1;
          }
          d._applyItemState(f, this.selected);
          f.data("idx", e);
          return f[0];
        })
      );
      this._updateCount();
    },
    _updateCount: function() {
      this.selectedContainer
        .find("span.count")
        .text(this.count + " " + a.ui.multiselect.locale.itemsCount);
    },
    _getOptionNode: function(b) {
      b = a(b);
      var c = a(
        '<li class="ui-state-default ui-element" title="' +
          b.text() +
          '"><span class="ui-icon"/>' +
          b.text() +
          '<a href="#" class="action"><span class="ui-corner-all ui-icon"/></a></li>'
      ).hide();
      c.data("optionLink", b);
      return c;
    },
    _cloneWithData: function(c) {
      var b = c.clone();
      b.data("optionLink", c.data("optionLink"));
      b.data("idx", c.data("idx"));
      return b;
    },
    _setSelected: function(k, e) {
      k.data("optionLink").attr("selected", e);
      if (e) {
        var d = this._cloneWithData(k);
        k[this.options.hide](this.options.animated, function() {
          a(this).remove();
        });
        d.appendTo(this.selectedList)
          .hide()
          [this.options.show](this.options.animated);
        this._applyItemState(d, true);
        return d;
      } else {
        var g = this.availableList.find("li"),
          b = this.options.nodeComparator;
        var h = null,
          f = k.data("idx"),
          j = b(k, a(g[f]));
        if (j) {
          while (f >= 0 && f < g.length) {
            j > 0 ? f++ : f--;
            if (j != b(k, a(g[f]))) {
              h = g[j > 0 ? f : f + 1];
              break;
            }
          }
        } else {
          h = g[f];
        }
        var c = this._cloneWithData(k);
        h ? c.insertBefore(a(h)) : c.appendTo(this.availableList);
        k[this.options.hide](this.options.animated, function() {
          a(this).remove();
        });
        c.hide()[this.options.show](this.options.animated);
        this._applyItemState(c, false);
        return c;
      }
    },
    _applyItemState: function(c, b) {
      if (b) {
        if (this.options.sortable) {
          c.children("span")
            .addClass("ui-icon-arrowthick-2-n-s")
            .removeClass("ui-helper-hidden")
            .addClass("ui-icon");
        } else {
          c.children("span")
            .removeClass("ui-icon-arrowthick-2-n-s")
            .addClass("ui-helper-hidden")
            .removeClass("ui-icon");
        }
        c.find("a.action span")
          .addClass("ui-icon-minus")
          .removeClass("ui-icon-plus");
        this._registerRemoveEvents(c.find("a.action"));
      } else {
        c.children("span")
          .removeClass("ui-icon-arrowthick-2-n-s")
          .addClass("ui-helper-hidden")
          .removeClass("ui-icon");
        c.find("a.action span")
          .addClass("ui-icon-plus")
          .removeClass("ui-icon-minus");
        this._registerAddEvents(c.find("a.action"));
      }
      this._registerHoverEvents(c);
    },
    _filter: function(f) {
      var c = a(this);
      var e = f.children("li"),
        b = e.map(function() {
          return a(this)
            .text()
            .toLowerCase();
        });
      var d = a.trim(c.val().toLowerCase()),
        g = [];
      if (!d) {
        e.show();
      } else {
        e.hide();
        b.each(function(h) {
          if (this.indexOf(d) > -1) {
            g.push(h);
          }
        });
        a.each(g, function() {
          a(e[this]).show();
        });
      }
    },
    _registerHoverEvents: function(b) {
      b.removeClass("ui-state-hover");
      b.mouseover(function() {
        a(this).addClass("ui-state-hover");
      });
      b.mouseout(function() {
        a(this).removeClass("ui-state-hover");
      });
    },
    _registerAddEvents: function(c) {
      var b = this;
      c.click(function() {
        var d = b._setSelected(a(this).parent(), true);
        b.count += 1;
        b._updateCount();
        return false;
      }).each(function() {
        a(this)
          .parent()
          .draggable({
            connectToSortable: "ul.selected",
            helper: function() {
              var d = b._cloneWithData(a(this)).width(a(this).width() - 50);
              d.width(a(this).width());
              return d;
            },
            appendTo: ".ui-multiselect",
            containment: ".ui-multiselect",
            revert: "invalid"
          });
      });
    },
    _registerRemoveEvents: function(c) {
      var b = this;
      c.click(function() {
        b._setSelected(a(this).parent(), false);
        b.count -= 1;
        b._updateCount();
        return false;
      });
    },
    _registerSearchEvents: function(b) {
      var c = this;
      b.focus(function() {
        a(this).addClass("ui-state-active");
      })
        .blur(function() {
          a(this).removeClass("ui-state-active");
        })
        .keypress(function(d) {
          if (d.keyCode == 13) {
            return false;
          }
        })
        .keyup(function() {
          c._filter.apply(this, [c.availableList]);
        });
    }
  });
  a.extend(a.ui.multiselect, {
    defaults: {
      sortable: true,
      searchable: true,
      animated: "fast",
      show: "slideDown",
      hide: "slideUp",
      dividerLocation: 0.6,
      nodeComparator: function(c, b) {
        var e = c.text(),
          d = b.text();
        return e == d ? 0 : e < d ? -1 : 1;
      }
    },
    locale: {
      addAll: "Add all",
      removeAll: "Remove all",
      itemsCount: "items selected"
    }
  });
})(jQuery);
/*
 * jQuery UI Core 1.10.3
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */
(function(b, f) {
  var a = 0,
    e = /^ui-id-\d+$/;
  b.ui = b.ui || {};
  b.extend(b.ui, {
    version: "1.10.3",
    keyCode: {
      BACKSPACE: 8,
      COMMA: 188,
      DELETE: 46,
      DOWN: 40,
      END: 35,
      ENTER: 13,
      ESCAPE: 27,
      HOME: 36,
      LEFT: 37,
      NUMPAD_ADD: 107,
      NUMPAD_DECIMAL: 110,
      NUMPAD_DIVIDE: 111,
      NUMPAD_ENTER: 108,
      NUMPAD_MULTIPLY: 106,
      NUMPAD_SUBTRACT: 109,
      PAGE_DOWN: 34,
      PAGE_UP: 33,
      PERIOD: 190,
      RIGHT: 39,
      SPACE: 32,
      TAB: 9,
      UP: 38
    }
  });
  b.fn.extend({
    focus: (function(g) {
      return function(h, i) {
        return typeof h === "number"
          ? this.each(function() {
              var j = this;
              setTimeout(function() {
                b(j).focus();
                if (i) {
                  i.call(j);
                }
              }, h);
            })
          : g.apply(this, arguments);
      };
    })(b.fn.focus),
    scrollParent: function() {
      var g;
      if (
        (b.ui.ie && /(static|relative)/.test(this.css("position"))) ||
        /absolute/.test(this.css("position"))
      ) {
        g = this.parents()
          .filter(function() {
            return (
              /(relative|absolute|fixed)/.test(b.css(this, "position")) &&
              /(auto|scroll)/.test(
                b.css(this, "overflow") +
                  b.css(this, "overflow-y") +
                  b.css(this, "overflow-x")
              )
            );
          })
          .eq(0);
      } else {
        g = this.parents()
          .filter(function() {
            return /(auto|scroll)/.test(
              b.css(this, "overflow") +
                b.css(this, "overflow-y") +
                b.css(this, "overflow-x")
            );
          })
          .eq(0);
      }
      return /fixed/.test(this.css("position")) || !g.length ? b(document) : g;
    },
    zIndex: function(j) {
      if (j !== f) {
        return this.css("zIndex", j);
      }
      if (this.length) {
        var h = b(this[0]),
          g,
          i;
        while (h.length && h[0] !== document) {
          g = h.css("position");
          if (g === "absolute" || g === "relative" || g === "fixed") {
            i = parseInt(h.css("zIndex"), 10);
            if (!isNaN(i) && i !== 0) {
              return i;
            }
          }
          h = h.parent();
        }
      }
      return 0;
    },
    uniqueId: function() {
      return this.each(function() {
        if (!this.id) {
          this.id = "ui-id-" + ++a;
        }
      });
    },
    removeUniqueId: function() {
      return this.each(function() {
        if (e.test(this.id)) {
          b(this).removeAttr("id");
        }
      });
    }
  });
  function d(i, g) {
    var k,
      j,
      h,
      l = i.nodeName.toLowerCase();
    if ("area" === l) {
      k = i.parentNode;
      j = k.name;
      if (!i.href || !j || k.nodeName.toLowerCase() !== "map") {
        return false;
      }
      h = b("img[usemap=#" + j + "]")[0];
      return !!h && c(h);
    }
    return (
      (/input|select|textarea|button|object/.test(l)
        ? !i.disabled
        : "a" === l
        ? i.href || g
        : g) && c(i)
    );
  }
  function c(g) {
    return (
      b.expr.filters.visible(g) &&
      !b(g)
        .parents()
        .addBack()
        .filter(function() {
          return b.css(this, "visibility") === "hidden";
        }).length
    );
  }
  b.extend(b.expr[":"], {
    data: b.expr.createPseudo
      ? b.expr.createPseudo(function(g) {
          return function(h) {
            return !!b.data(h, g);
          };
        })
      : function(j, h, g) {
          return !!b.data(j, g[3]);
        },
    focusable: function(g) {
      return d(g, !isNaN(b.attr(g, "tabindex")));
    },
    tabbable: function(i) {
      var g = b.attr(i, "tabindex"),
        h = isNaN(g);
      return (h || g >= 0) && d(i, !h);
    }
  });
  if (!b("<a>").outerWidth(1).jquery) {
    b.each(["Width", "Height"], function(j, g) {
      var h = g === "Width" ? ["Left", "Right"] : ["Top", "Bottom"],
        k = g.toLowerCase(),
        m = {
          innerWidth: b.fn.innerWidth,
          innerHeight: b.fn.innerHeight,
          outerWidth: b.fn.outerWidth,
          outerHeight: b.fn.outerHeight
        };
      function l(o, n, i, p) {
        b.each(h, function() {
          n -= parseFloat(b.css(o, "padding" + this)) || 0;
          if (i) {
            n -= parseFloat(b.css(o, "border" + this + "Width")) || 0;
          }
          if (p) {
            n -= parseFloat(b.css(o, "margin" + this)) || 0;
          }
        });
        return n;
      }
      b.fn["inner" + g] = function(i) {
        if (i === f) {
          return m["inner" + g].call(this);
        }
        return this.each(function() {
          b(this).css(k, l(this, i) + "px");
        });
      };
      b.fn["outer" + g] = function(i, n) {
        if (typeof i !== "number") {
          return m["outer" + g].call(this, i);
        }
        return this.each(function() {
          b(this).css(k, l(this, i, true, n) + "px");
        });
      };
    });
  }
  if (!b.fn.addBack) {
    b.fn.addBack = function(g) {
      return this.add(g == null ? this.prevObject : this.prevObject.filter(g));
    };
  }
  if (
    b("<a>")
      .data("a-b", "a")
      .removeData("a-b")
      .data("a-b")
  ) {
    b.fn.removeData = (function(g) {
      return function(h) {
        if (arguments.length) {
          return g.call(this, b.camelCase(h));
        } else {
          return g.call(this);
        }
      };
    })(b.fn.removeData);
  }
  b.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());
  b.support.selectstart = "onselectstart" in document.createElement("div");
  b.fn.extend({
    disableSelection: function() {
      return this.bind(
        (b.support.selectstart ? "selectstart" : "mousedown") +
          ".ui-disableSelection",
        function(g) {
          g.preventDefault();
        }
      );
    },
    enableSelection: function() {
      return this.unbind(".ui-disableSelection");
    }
  });
  b.extend(b.ui, {
    plugin: {
      add: function(h, j, l) {
        var g,
          k = b.ui[h].prototype;
        for (g in l) {
          k.plugins[g] = k.plugins[g] || [];
          k.plugins[g].push([j, l[g]]);
        }
      },
      call: function(g, j, h) {
        var k,
          l = g.plugins[j];
        if (
          !l ||
          !g.element[0].parentNode ||
          g.element[0].parentNode.nodeType === 11
        ) {
          return;
        }
        for (k = 0; k < l.length; k++) {
          if (g.options[l[k][0]]) {
            l[k][1].apply(g.element, h);
          }
        }
      }
    },
    hasScroll: function(j, h) {
      if (b(j).css("overflow") === "hidden") {
        return false;
      }
      var g = h && h === "left" ? "scrollLeft" : "scrollTop",
        i = false;
      if (j[g] > 0) {
        return true;
      }
      j[g] = 1;
      i = j[g] > 0;
      j[g] = 0;
      return i;
    }
  });
})(jQuery);
/*
 * jQuery UI Mouse 1.10.3
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/mouse/
 *
 * Depends:
 *	jquery.ui.widget.js
 */
(function(b, c) {
  var a = false;
  b(document).mouseup(function() {
    a = false;
  });
  b.widget("ui.mouse", {
    version: "1.10.3",
    options: {
      cancel: "input,textarea,button,select,option",
      distance: 1,
      delay: 0
    },
    _mouseInit: function() {
      var d = this;
      this.element
        .bind("mousedown." + this.widgetName, function(e) {
          return d._mouseDown(e);
        })
        .bind("click." + this.widgetName, function(e) {
          if (true === b.data(e.target, d.widgetName + ".preventClickEvent")) {
            b.removeData(e.target, d.widgetName + ".preventClickEvent");
            e.stopImmediatePropagation();
            return false;
          }
        });
      this.started = false;
    },
    _mouseDestroy: function() {
      this.element.unbind("." + this.widgetName);
      if (this._mouseMoveDelegate) {
        b(document)
          .unbind("mousemove." + this.widgetName, this._mouseMoveDelegate)
          .unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
      }
    },
    _mouseDown: function(f) {
      if (a) {
        return;
      }
      this._mouseStarted && this._mouseUp(f);
      this._mouseDownEvent = f;
      var e = this,
        g = f.which === 1,
        d =
          typeof this.options.cancel === "string" && f.target.nodeName
            ? b(f.target).closest(this.options.cancel).length
            : false,
        moveDisabled = $(f.target).closest('th').hasClass('ui-sortable-disabled')
      if (!g || d || moveDisabled || !this._mouseCapture(f)) {
        return true;
      }
      this.mouseDelayMet = !this.options.delay;
      if (!this.mouseDelayMet) {
        this._mouseDelayTimer = setTimeout(function() {
          e.mouseDelayMet = true;
        }, this.options.delay);
      }
      if (this._mouseDistanceMet(f) && this._mouseDelayMet(f)) {
        this._mouseStarted = this._mouseStart(f) !== false;
        if (!this._mouseStarted) {
          f.preventDefault();
          return true;
        }
      }
      if (true === b.data(f.target, this.widgetName + ".preventClickEvent")) {
        b.removeData(f.target, this.widgetName + ".preventClickEvent");
      }
      this._mouseMoveDelegate = function(h) {
        return e._mouseMove(h);
      };
      this._mouseUpDelegate = function(h) {
        return e._mouseUp(h);
      };
      b(document)
        .bind("mousemove." + this.widgetName, this._mouseMoveDelegate)
        .bind("mouseup." + this.widgetName, this._mouseUpDelegate);
      f.preventDefault();
      a = true;
      return true;
    },
    _mouseMove: function(d) {
      if (
        b.ui.ie &&
        (!document.documentMode || document.documentMode < 9) &&
        !d.button
      ) {
        return this._mouseUp(d);
      }
      if (this._mouseStarted) {
        this._mouseDrag(d);
        return d.preventDefault();
      }
      if (this._mouseDistanceMet(d) && this._mouseDelayMet(d)) {
        this._mouseStarted =
          this._mouseStart(this._mouseDownEvent, d) !== false;
        this._mouseStarted ? this._mouseDrag(d) : this._mouseUp(d);
      }
      return !this._mouseStarted;
    },
    _mouseUp: function(d) {
      b(document)
        .unbind("mousemove." + this.widgetName, this._mouseMoveDelegate)
        .unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
      if (this._mouseStarted) {
        this._mouseStarted = false;
        if (d.target === this._mouseDownEvent.target) {
          b.data(d.target, this.widgetName + ".preventClickEvent", true);
        }
        this._mouseStop(d);
      }
      return false;
    },
    _mouseDistanceMet: function(d) {
      return (
        Math.max(
          Math.abs(this._mouseDownEvent.pageX - d.pageX),
          Math.abs(this._mouseDownEvent.pageY - d.pageY)
        ) >= this.options.distance
      );
    },
    _mouseDelayMet: function() {
      return this.mouseDelayMet;
    },
    _mouseStart: function() {},
    _mouseDrag: function() {},
    _mouseStop: function() {},
    _mouseCapture: function() {
      return true;
    }
  });
})(jQuery);
/*
 * jQuery UI Selectable 1.10.3
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/selectable/
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function(a, b) {
  a.widget("ui.selectable", a.ui.mouse, {
    version: "1.10.3",
    options: {
      appendTo: "body",
      autoRefresh: true,
      distance: 0,
      filter: "*",
      tolerance: "touch",
      selected: null,
      selecting: null,
      start: null,
      stop: null,
      unselected: null,
      unselecting: null,
      selectFilter: "*"
    },
    _create: function() {
      var d,
        c = this;
      this.element.addClass("ui-selectable");
      this.dragged = false;
      this.refresh = function() {
        d = a(c.options.filter, c.element[0]);
        d.addClass("ui-selectee");
        d.each(function() {
          var e = a(this),
            f = e.offset();
          a.data(this, "selectable-item", {
            element: this,
            $element: e,
            left: f.left,
            top: f.top,
            right: f.left + e.outerWidth(),
            bottom: f.top + e.outerHeight(),
            startselected: false,
            selected: e.hasClass("ui-selected"),
            selecting: e.hasClass("ui-selecting"),
            unselecting: e.hasClass("ui-unselecting")
          });
        });
      };
      this.refresh();
      this.selectees = d.addClass("ui-selectee");
      this._mouseInit();
      this.helper = a("<div class='ui-selectable-helper'></div>");
    },
    _destroy: function() {
      this.selectees.removeClass("ui-selectee").removeData("selectable-item");
      this.element.removeClass("ui-selectable ui-selectable-disabled");
      this._mouseDestroy();
    },
    _mouseStart: function(e) {
      var d = this,
        c = this.options;
      this.opos = [e.pageX, e.pageY];
      if (this.options.disabled) {
        return;
      }
      this.selectees = a(c.filter, this.element[0]);
      this._trigger("start", e);
      a(c.appendTo).append(this.helper);
      this.helper.css({ left: e.pageX, top: e.pageY, width: 0, height: 0 });
      if (c.autoRefresh) {
        this.refresh();
      }
      this.selectees.filter(".ui-selected").each(function() {
        var f = a.data(this, "selectable-item");
        f.startselected = true;
        if (!e.metaKey && !e.ctrlKey) {
          f.$element.filter(c.selectFilter).removeClass("ui-selected");
          f.selected = false;
          f.$element.addClass("ui-unselecting");
          f.unselecting = true;
          d._trigger("unselecting", e, { unselecting: f.element });
        }
      });
      a(e.target)
        .parents()
        .addBack()
        .each(function() {
          var f,
            g = a.data(this, "selectable-item");
          if (g) {
            f =
              (!e.metaKey && !e.ctrlKey) || !g.$element.hasClass("ui-selected");
            g.$element
              .removeClass(f ? "ui-unselecting" : "ui-selected")
              .addClass(f ? "ui-selecting" : "ui-unselecting");
            g.unselecting = !f;
            g.selecting = f;
            g.selected = f;
            if (f) {
              d._trigger("selecting", e, { selecting: g.element });
            } else {
              d._trigger("unselecting", e, { unselecting: g.element });
            }
            return false;
          }
        });
    },
    _mouseDrag: function(j) {
      this.dragged = true;
      if (this.options.disabled) {
        return;
      }
      var g,
        i = this,
        e = this.options,
        d = this.opos[0],
        h = this.opos[1],
        c = j.pageX,
        f = j.pageY;
      if (d > c) {
        g = c;
        c = d;
        d = g;
      }
      if (h > f) {
        g = f;
        f = h;
        h = g;
      }
      this.helper.css({ left: d, top: h, width: c - d, height: f - h });
      this.selectees.each(function() {
        var k = a.data(this, "selectable-item"),
          l = false;
        if (!k || k.element === i.element[0]) {
          return;
        }
        if (e.tolerance === "touch") {
          l = !(k.left > c || k.right < d || k.top > f || k.bottom < h);
        } else {
          if (e.tolerance === "fit") {
            l = k.left > d && k.right < c && k.top > h && k.bottom < f;
          }
        }
        if (l) {
          if (k.selected) {
            k.$element.removeClass("ui-selected");
            k.selected = false;
          }
          if (k.unselecting) {
            k.$element.removeClass("ui-unselecting");
            k.unselecting = false;
          }
          if (!k.selecting) {
            k.$element.addClass("ui-selecting");
            k.selecting = true;
            i._trigger("selecting", j, { selecting: k.element });
          }
        } else {
          if (k.selecting) {
            if ((j.metaKey || j.ctrlKey) && k.startselected) {
              k.$element.removeClass("ui-selecting");
              k.selecting = false;
              k.$element.addClass("ui-selected");
              k.selected = true;
            } else {
              k.$element.removeClass("ui-selecting");
              k.selecting = false;
              if (k.startselected) {
                k.$element.addClass("ui-unselecting");
                k.unselecting = true;
              }
              i._trigger("unselecting", j, { unselecting: k.element });
            }
          }
          if (k.selected) {
            if (!j.metaKey && !j.ctrlKey && !k.startselected) {
              k.$element.removeClass("ui-selected");
              k.selected = false;
              k.$element.addClass("ui-unselecting");
              k.unselecting = true;
              i._trigger("unselecting", j, { unselecting: k.element });
            }
          }
        }
      });
      return false;
    },
    _mouseStop: function(d) {
      var c = this;
      this.dragged = false;
      this.currentItem = null;
      a(".ui-unselecting", this.element[0]).each(function() {
        var e = a.data(this, "selectable-item");
        e.$element.removeClass("ui-unselecting");
        e.unselecting = false;
        e.startselected = false;
        c.currentItem = e.element;
        c._trigger("unselected", d, { unselected: e.element });
      });
      a(".ui-selecting", this.element[0]).each(function() {
        var e = a.data(this, "selectable-item");
        e.$element.removeClass("ui-selecting").addClass("ui-selected");
        e.selecting = false;
        e.selected = true;
        e.startselected = true;
        c.currentItem = e.element;
        c._trigger("selected", d, { selected: e.element });
      });
      this._trigger("stop", d, this.currentItem);
      this.helper.remove();
      return false;
    }
  });
})(jQuery);
/*
 * jQuery UI Widget 1.10.3
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */
(function(b, e) {
  var a = 0,
    d = Array.prototype.slice,
    c = b.cleanData;
  b.cleanData = function(f) {
    for (var g = 0, h; (h = f[g]) != null; g++) {
      try {
        b(h).triggerHandler("remove");
      } catch (j) {}
    }
    c(f);
  };
  b.widget = function(f, g, n) {
    var k,
      l,
      i,
      m,
      h = {},
      j = f.split(".")[0];
    f = f.split(".")[1];
    k = j + "-" + f;
    if (!n) {
      n = g;
      g = b.Widget;
    }
    b.expr[":"][k.toLowerCase()] = function(o) {
      return !!b.data(o, k);
    };
    b[j] = b[j] || {};
    l = b[j][f];
    i = b[j][f] = function(o, p) {
      if (!this._createWidget) {
        return new i(o, p);
      }
      if (arguments.length) {
        this._createWidget(o, p);
      }
    };
    b.extend(i, l, {
      version: n.version,
      _proto: b.extend({}, n),
      _childConstructors: []
    });
    m = new g();
    m.options = b.widget.extend({}, m.options);
    b.each(n, function(p, o) {
      if (!b.isFunction(o)) {
        h[p] = o;
        return;
      }
      h[p] = (function() {
        var q = function() {
            return g.prototype[p].apply(this, arguments);
          },
          r = function(s) {
            return g.prototype[p].apply(this, s);
          };
        return function() {
          var u = this._super,
            s = this._superApply,
            t;
          this._super = q;
          this._superApply = r;
          t = o.apply(this, arguments);
          this._super = u;
          this._superApply = s;
          return t;
        };
      })();
    });
    i.prototype = b.widget.extend(
      m,
      { widgetEventPrefix: l ? m.widgetEventPrefix : f },
      h,
      { constructor: i, namespace: j, widgetName: f, widgetFullName: k }
    );
    if (l) {
      b.each(l._childConstructors, function(p, q) {
        var o = q.prototype;
        b.widget(o.namespace + "." + o.widgetName, i, q._proto);
      });
      delete l._childConstructors;
    } else {
      g._childConstructors.push(i);
    }
    b.widget.bridge(f, i);
  };
  b.widget.extend = function(k) {
    var g = d.call(arguments, 1),
      j = 0,
      f = g.length,
      h,
      i;
    for (; j < f; j++) {
      for (h in g[j]) {
        i = g[j][h];
        if (g[j].hasOwnProperty(h) && i !== e) {
          if (b.isPlainObject(i)) {
            k[h] = b.isPlainObject(k[h])
              ? b.widget.extend({}, k[h], i)
              : b.widget.extend({}, i);
          } else {
            k[h] = i;
          }
        }
      }
    }
    return k;
  };
  b.widget.bridge = function(g, f) {
    var h = f.prototype.widgetFullName || g;
    b.fn[g] = function(k) {
      var i = typeof k === "string",
        j = d.call(arguments, 1),
        l = this;
      k = !i && j.length ? b.widget.extend.apply(null, [k].concat(j)) : k;
      if (i) {
        this.each(function() {
          var n,
            m = b.data(this, h);
          if (!m) {
            return b.error(
              "cannot call methods on " +
                g +
                " prior to initialization; attempted to call method '" +
                k +
                "'"
            );
          }
          if (!b.isFunction(m[k]) || k.charAt(0) === "_") {
            return b.error(
              "no such method '" + k + "' for " + g + " widget instance"
            );
          }
          n = m[k].apply(m, j);
          if (n !== m && n !== e) {
            l = n && n.jquery ? l.pushStack(n.get()) : n;
            return false;
          }
        });
      } else {
        this.each(function() {
          var m = b.data(this, h);
          if (m) {
            m.option(k || {})._init();
          } else {
            b.data(this, h, new f(k, this));
          }
        });
      }
      return l;
    };
  };
  b.Widget = function() {};
  b.Widget._childConstructors = [];
  b.Widget.prototype = {
    widgetName: "widget",
    widgetEventPrefix: "",
    defaultElement: "<div>",
    options: { disabled: false, create: null },
    _createWidget: function(f, g) {
      g = b(g || this.defaultElement || this)[0];
      this.element = b(g);
      this.uuid = a++;
      this.eventNamespace = "." + this.widgetName + this.uuid;
      this.options = b.widget.extend(
        {},
        this.options,
        this._getCreateOptions(),
        f
      );
      this.bindings = b();
      this.hoverable = b();
      this.focusable = b();
      if (g !== this) {
        b.data(g, this.widgetFullName, this);
        this._on(true, this.element, {
          remove: function(h) {
            if (h.target === g) {
              this.destroy();
            }
          }
        });
        this.document = b(g.style ? g.ownerDocument : g.document || g);
        this.window = b(
          this.document[0].defaultView || this.document[0].parentWindow
        );
      }
      this._create();
      this._trigger("create", null, this._getCreateEventData());
      this._init();
    },
    _getCreateOptions: b.noop,
    _getCreateEventData: b.noop,
    _create: b.noop,
    _init: b.noop,
    destroy: function() {
      this._destroy();
      this.element
        .unbind(this.eventNamespace)
        .removeData(this.widgetName)
        .removeData(this.widgetFullName)
        .removeData(b.camelCase(this.widgetFullName));
      this.widget()
        .unbind(this.eventNamespace)
        .removeAttr("aria-disabled")
        .removeClass(this.widgetFullName + "-disabled ui-state-disabled");
      this.bindings.unbind(this.eventNamespace);
      this.hoverable.removeClass("ui-state-hover");
      this.focusable.removeClass("ui-state-focus");
    },
    _destroy: b.noop,
    widget: function() {
      return this.element;
    },
    option: function(j, k) {
      var f = j,
        l,
        h,
        g;
      if (arguments.length === 0) {
        return b.widget.extend({}, this.options);
      }
      if (typeof j === "string") {
        f = {};
        l = j.split(".");
        j = l.shift();
        if (l.length) {
          h = f[j] = b.widget.extend({}, this.options[j]);
          for (g = 0; g < l.length - 1; g++) {
            h[l[g]] = h[l[g]] || {};
            h = h[l[g]];
          }
          j = l.pop();
          if (k === e) {
            return h[j] === e ? null : h[j];
          }
          h[j] = k;
        } else {
          if (k === e) {
            return this.options[j] === e ? null : this.options[j];
          }
          f[j] = k;
        }
      }
      this._setOptions(f);
      return this;
    },
    _setOptions: function(f) {
      var g;
      for (g in f) {
        this._setOption(g, f[g]);
      }
      return this;
    },
    _setOption: function(f, g) {
      this.options[f] = g;
      if (f === "disabled") {
        this.widget()
          .toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!g)
          .attr("aria-disabled", g);
        this.hoverable.removeClass("ui-state-hover");
        this.focusable.removeClass("ui-state-focus");
      }
      return this;
    },
    enable: function() {
      return this._setOption("disabled", false);
    },
    disable: function() {
      return this._setOption("disabled", true);
    },
    _on: function(i, h, g) {
      var j,
        f = this;
      if (typeof i !== "boolean") {
        g = h;
        h = i;
        i = false;
      }
      if (!g) {
        g = h;
        h = this.element;
        j = this.widget();
      } else {
        h = j = b(h);
        this.bindings = this.bindings.add(h);
      }
      b.each(g, function(p, o) {
        function m() {
          if (
            !i &&
            (f.options.disabled === true ||
              b(this).hasClass("ui-state-disabled"))
          ) {
            return;
          }
          return (typeof o === "string" ? f[o] : o).apply(f, arguments);
        }
        if (typeof o !== "string") {
          m.guid = o.guid = o.guid || m.guid || b.guid++;
        }
        var n = p.match(/^(\w+)\s*(.*)$/),
          l = n[1] + f.eventNamespace,
          k = n[2];
        if (k) {
          j.delegate(k, l, m);
        } else {
          h.bind(l, m);
        }
      });
    },
    _off: function(g, f) {
      f =
        (f || "").split(" ").join(this.eventNamespace + " ") +
        this.eventNamespace;
      g.unbind(f).undelegate(f);
    },
    _delay: function(i, h) {
      function g() {
        return (typeof i === "string" ? f[i] : i).apply(f, arguments);
      }
      var f = this;
      return setTimeout(g, h || 0);
    },
    _hoverable: function(f) {
      this.hoverable = this.hoverable.add(f);
      this._on(f, {
        mouseenter: function(g) {
          b(g.currentTarget).addClass("ui-state-hover");
        },
        mouseleave: function(g) {
          b(g.currentTarget).removeClass("ui-state-hover");
        }
      });
    },
    _focusable: function(f) {
      this.focusable = this.focusable.add(f);
      this._on(f, {
        focusin: function(g) {
          b(g.currentTarget).addClass("ui-state-focus");
        },
        focusout: function(g) {
          b(g.currentTarget).removeClass("ui-state-focus");
        }
      });
    },
    _trigger: function(f, g, h) {
      var k,
        j,
        i = this.options[f];
      h = h || {};
      g = b.Event(g);
      g.type = (f === this.widgetEventPrefix
        ? f
        : this.widgetEventPrefix + f
      ).toLowerCase();
      g.target = this.element[0];
      j = g.originalEvent;
      if (j) {
        for (k in j) {
          if (!(k in g)) {
            g[k] = j[k];
          }
        }
      }
      this.element.trigger(g, h);
      return !(
        (b.isFunction(i) &&
          i.apply(this.element[0], [g].concat(h)) === false) ||
        g.isDefaultPrevented()
      );
    }
  };
  b.each({ show: "fadeIn", hide: "fadeOut" }, function(g, f) {
    b.Widget.prototype["_" + g] = function(j, i, l) {
      if (typeof i === "string") {
        i = { effect: i };
      }
      var k,
        h = !i ? g : i === true || typeof i === "number" ? f : i.effect || f;
      i = i || {};
      if (typeof i === "number") {
        i = { duration: i };
      }
      k = !b.isEmptyObject(i);
      i.complete = l;
      if (i.delay) {
        j.delay(i.delay);
      }
      if (k && b.effects && b.effects.effect[h]) {
        j[g](i);
      } else {
        if (h !== g && j[h]) {
          j[h](i.duration, i.easing, l);
        } else {
          j.queue(function(m) {
            b(this)[g]();
            if (l) {
              l.call(j[0]);
            }
            m();
          });
        }
      }
    };
  });
})(jQuery);
