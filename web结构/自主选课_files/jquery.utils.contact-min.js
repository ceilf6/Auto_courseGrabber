/*
 * 基础工具：详情参见：jquery.utils.commons-1.0.0.js
 */
;(function(b) {
    b.isHTMLElement = function(e) {
        return ((typeof HTMLElement === "object") ? function() {
            return e instanceof HTMLElement
        }
        : function() {
            return e && typeof e === "object" && e.nodeType === 1 && typeof e.nodeName === "string"
        }
        ).call(this)
    }
    ;
    b.fn.isHTMLElement = function() {
        return b.isHTMLElement(this[0])
    }
    ;
    var a = b.fn.is
      , d = b.fn.filter;
    function c(e) {
        e = b(e);
        if (e.isHTMLElement()) {
            return !!(e.width() || e.height()) && e.css("display") !== "none"
        }
        return true
    }
    b.fn.is = function(e) {
        if (e === ":visible") {
            return c(this)
        }
        if (e === ":hidden") {
            return !c(this)
        }
        return a.call(this, e)
    }
    ;
    b.fn.filter = function(e) {
        if (e === ":visible") {
            return b([].filter.call(this, function(f) {
                return c(f)
            }))
        }
        if (e === ":hidden") {
            return b([].filter.call(this, function(f) {
                return !c(f)
            }))
        }
        return d.call(this, e)
    }
    ;
    b.extend({
        encode: function(e) {
            return encodeURIComponent(encodeURIComponent(e))
        },
        defined: function(e) {
            return (typeof e != "undefined" && e != "undefined" && e != null && e != "null")
        },
        founded: function(e) {
            if (b.defined(e)) {
                if (typeof e == "boolean") {
                    return e
                } else {
                    if (typeof e == "string") {
                        return b.trim(e).length > 0
                    } else {
                        if (jQuery.isArray(e)) {
                            return jQuery.merge([], e).length > 0
                        } else {
                            if (b.isPlainObject(e)) {
                                return !b.isEmptyObject(e)
                            } else {
                                return true
                            }
                        }
                    }
                }
            } else {
                return false
            }
        },
        buildForm: function(i, g, e, h) {
            var f = b("#" + (i || "drdcForm"));
            if (b(f).size() > 0 && b(f).is("form")) {
                f = b(f).empty()
            } else {
                f = jQuery("<form/>");
                b(f).css("display", "none").appendTo("body")
            }
            b(f).attr({
                id: (i || "drdcForm"),
                action: g,
                method: "post",
                enctype: "application/x-www-form-urlencoded; charset=UTF-8",
                target: h || "_blank"
            });
            b(f).append(b.buildHiddens({
                gnmkdmKey: jQuery("#gnmkdmKey").val(),
                sessionUserKey: jQuery("#sessionUserKey").val()
            }, true));
            b(f).append(b.buildHiddens(e || {}, true));
            return b(f)
        },
        buildHiddens: function(f, e) {
            var g = [];
            b.each(f || {}, function(h, i) {
                if (b.isPlainObject(i) && true == e) {
                    g.push(b.buildHiddens(i))
                } else {
                    if (b.isArray(i)) {
                        b.each(i, function(j, k) {
                            g.push('<input type="hidden" name="' + h + "[" + j + ']" value="' + k + '">')
                        })
                    } else {
                        if (b.isFunction(i)) {} else {
                            g.push('<input type="hidden" name="' + h + '" value="' + i + '">')
                        }
                    }
                }
            });
            return g.join("")
        },
        cloneObj: function(e) {
            return b.extend(true, {}, e || {})
        },
        mergeObj: function() {
            var e = {};
            b.each(arguments, function(f, g) {
                b.extend(true, e, g || {})
            });
            return e
        },
        getTextLength: function(g) {
            var f = g.length;
            for (var e = 0; e < g.length; e += 1) {
                if (g.charCodeAt(e) > 127) {
                    f += 1
                }
            }
            return f
        },
        toBoolean: function(e) {
            if (b.defined(e)) {
                if (b.type(e) == "boolean") {
                    return e
                } else {
                    if (b.type(e) == "string") {
                        e = b.trim(e).toLowerCase();
                        if ("yes" == e || "true" == e || "1" == e) {
                            return true
                        } else {
                            if ("no" == e || "false" == e || "0" == e) {
                                return false
                            } else {
                                return Boolean(e)
                            }
                        }
                    } else {
                        return Boolean(e)
                    }
                }
            } else {
                return false
            }
        },
        toTime: function(i) {
            if (/^([0-1][0-9]|2[0-3])[:]([0-5]{1}[0-9]{1})[:]([0-5]{1}[0-9]{1})?$/mg.test(i)) {
                var e = RegExp.$1
                  , f = RegExp.$2 ? RegExp.$2 : 0
                  , g = RegExp.$3 ? RegExp.$3 : 0;
                var h = new Date();
                h.setHours(e, f, g, 0);
                return h
            } else {
                return null
            }
        },
        convertID: function(e) {
            return e.replace(/(:|\(|\)|\{|\}|\-|\.|\#|\@|\$|\%|\^|\&|\*|\!)/g, "\\$1")
        },
        getUID: function(e) {
            e = e || "UID_";
            do {
                e += ((Math.random() * 1000000) + new Date().getTime())
            } while (document.getElementById(e));
            return (e + "").replace(".", "")
        },
        matchURL: function(e) {
            var f = b.trim(e || "").toLowerCase();
            return typeof e == "string" && f.length > 0 && /(?:\S+\.(?:js|css|properties)(?:\?ver=\S+)?)/.test(f)
        },
        matchJS: function(e) {
            var f = b.trim(e || "").toLowerCase();
            return typeof e == "string" && f.length > 0 && /(?:\S+\.js(?:\?ver=\S+)?)/.test(f)
        },
        matchCss: function(e) {
            var f = b.trim(e || "").toLowerCase();
            return typeof e == "string" && f.length > 0 && /(?:\S+\.css(?:\?ver=\S+)?)/.test(f)
        }
    });
    b.extend(Array.prototype, {
        indexOf: function(f, g) {
            var g = g || 0;
            for (var e = 0; e < this.length; ++e) {
                if (this[e] === f) {
                    return e
                }
            }
            return -1
        },
        remove: function(f, e) {
            var g = [].concat(this);
            if (b.isNumeric(f)) {
                g.splice(f, 1)
            } else {
                b.each(this, function(h, j) {
                    if (j[e] == f) {
                        g.splice(h, 1);
                        return false
                    }
                })
            }
            return g
        }
    });
    b.fn.getUID = function(e) {
        var f = b(this).attr("id");
        if (!b.founded(f)) {
            f = e || "UID_";
            do {
                f += ~~((Math.random() * 1000000) + new Date().getTime())
            } while (document.getElementById(f))
        }
        return f
    }
    ;
    b.fn.killFocus = function() {
        return b(this).each(function() {
            this.onmousedown = function() {
                this.blur();
                this.hideFocus = true;
                this.style.outline = "none"
            }
            ;
            this.onmouseout = this.onmouseup = function() {
                this.blur();
                this.hideFocus = false;
                this.style.outline = null
            }
        })
    }
    ;
    b.fn.extend({
        defined: function() {
            return b(this).size() != 0
        },
        founded: function() {
            var e = b(this).is("select") ? b(this).getSelected().val() : b(this).val();
            return b(this).defined() && b.founded(e)
        },
        disabled: function() {
            return b(this).filter(":input").each(function() {
                b(this).prop("disabled", true).addClass("disabled").data("disabled", true)
            })
        },
        isDisabled: function() {
            return !b(this).isEnabled()
        },
        enabled: function() {
            return b(this).filter(":input").each(function() {
                b(this).prop("disabled", false).removeClass("disabled").removeData("disabled")
            })
        },
        isEnabled: function() {
            return (b(this).prop("disabled") == false && !b(this).hasClass("disabled") && !b(this).data("disabled") === true)
        },
        attrs: function() {
            var g = b(this)[0].attributes;
            var f = {};
            for (var h = 0; h < g.length; h += 1) {
                var e = g[h];
                if (e.specified) {
                    f[e.name] = e.value
                }
            }
            return f
        },
        disableContextMenu: function() {
            b(this).each(function(e, f) {
                b(f).bind("contextmenu", function() {
                    return false
                })
            })
        },
        getWidget: function() {
            if (!b.metadata) {
                return {}
            } else {
                return b(this).metadata({
                    single: "widget"
                })
            }
        },
        getValueLength: function() {
            return b.getTextLength(b(this).val())
        },
        getTextLength: function(e) {
            b.getTextLength(b(this).text())
        },
        getVisualWidth: function(e) {
            b("#visualLength_ruler").remove();
            b(document.body).append('<span id="visualLength_ruler">test</span>');
            var g = b("#visualLength_ruler");
            b(g).css({
                visibility: "hidden",
                "white-space": "nowrap",
                "font-size": e || "14px"
            });
            if (b(this).is(":radio") || b(this).is(":checkbox")) {
                var f = b(this)[0].nextSibling.nodeValue;
                g.text(this);
                return b(this).outerWidth() + g[0].offsetWidth
            } else {
                return b(this).outerWidth()
            }
        },
        encode: function() {
            return encodeURIComponent(encodeURIComponent(b(this).val()))
        },
        removeOption: function(e) {
            if (b(this).is("select")) {
                if (typeof e == "string") {
                    b(this).find("option").each(function(f, g) {
                        if (b(g).val() == e) {
                            b(g).remove()
                        }
                    })
                } else {
                    if (typeof e == "number") {
                        b(this).find("option").eq(e).remove()
                    }
                }
            }
        },
        buildOptions: function(g, h, e) {
            if (b(this).is("select")) {
                var f = [];
                if (h && h == true) {
                    f.push('<option value="">--\u8bf7\u9009\u62e9--</option>')
                }
                b.each(g || [], function(k, j) {
                    var l = "";
                    if (b.founded(e) && e == j.value) {
                        l = ' selected="selected" '
                    }
                    f.push("<option ");
                    b(j).each(function(m, i) {
                        if (m != "value") {
                            f.push(m + '="' + i + '"')
                        }
                    });
                    f.push(' value="' + j.value + '" ' + l + ">" + j.text + "</option>")
                });
                b(this).append(f.join(""))
            }
        },
        setSelected: function(e) {
            return this.each(function() {
                if (b(this).is("select")) {
                    if (typeof e == "string") {
                        b(this).find("option").each(function(f, g) {
                            if (b(g).val() == e) {
                                b(g).prop("selected", true)
                            }
                        })
                    } else {
                        if (typeof e == "number") {
                            b(this)[0].selectedIndex = e
                        }
                    }
                }
            })
        },
        getSelected: function() {
            if (b(this).is("select")) {
                return b(this).find("option:selected")
            }
        },
        getSelectedList: function() {
            var g = this;
            var f = b(this).getSelected();
            if (b(f).size() > 1) {
                var e = new Array();
                b(f).each(function(h, j) {
                    e.push(b.extend({}, b(g).attrs(), b(j).attrs(), {
                        key: b(j).val(),
                        value: b(j).val(),
                        text: b(j).text()
                    }))
                });
                return e
            } else {
                return b.extend({}, b(this).attrs(), b(f[0]).attrs(), {
                    key: b(f[0]).val(),
                    value: b(f[0]).val(),
                    text: b(f[0]).text()
                })
            }
        },
        setChecked: function(e) {
            return this.each(function() {
                if (b(this).is("input") && b(this).is(function() {
                    var f = b.trim(b(this).attr("type"));
                    return (f === "radio" || f === "checkbox")
                })) {
                    if (typeof e == "string") {
                        b(this).each(function(g, f) {
                            if (b(f).val() == e) {
                                b(f)[0].checked = true
                            }
                        })
                    } else {
                        if (typeof e == "number") {
                            b(this).get(e).checked = true
                        }
                    }
                }
            })
        },
        getChecked: function() {
            if (b(this).is(":radio") || b(this).is(":checkbox")) {
                var f = b(this).filter(":checked");
                if (b(f).size() > 1) {
                    var e = new Array();
                    b(f).each(function(g, h) {
                        e.push(b(h))
                    });
                    return e
                } else {
                    return b(f[0])
                }
            }
        },
        getCheckedList: function() {
            var g = this;
            if (b(this).is(":radio") || b(this).is(":checkbox")) {
                var f = b(g).filter(":checked");
                if (b(f).size() > 1) {
                    var e = new Array();
                    b(f).each(function(h, j) {
                        e.push(b.extend({}, b(g).attrs(), b(j).attrs(), {
                            key: b(j).val(),
                            value: b(j).val(),
                            text: b(j)[0].nextSibling.nodeValue
                        }))
                    });
                    return e
                } else {
                    return b.extend({}, b(g).attrs(), b(f[0]).attrs(), {
                        key: b(f[0]).val(),
                        value: b(f[0]).val(),
                        text: b(f[0])[0].nextSibling.nodeValue
                    })
                }
            }
        },
        getPosition: function() {
            var f = this
              , g = this[0];
            var e = g.tagName == "BODY";
            return b.extend({}, (typeof g.getBoundingClientRect == "function") ? g.getBoundingClientRect() : null, {
                scroll: e ? document.documentElement.scrollTop || document.body.scrollTop : f.scrollTop(),
                width: e ? b(window).width() : f.outerWidth(),
                height: e ? b(window).height() : f.outerHeight()
            }, e ? {
                top: 0,
                left: 0
            } : f.offset())
        },
        getElementID: function() {
            return b.convertID(b.trim(b(this).attr("id")))
        }
    });
    b.fn.getRealElement = function() {
        var f = this;
        if (b.defined(b(this).data("chosen"))) {
            var e = "#" + b(this).getElementID() + "_chosen";
            if (b(e).size() > 0) {
                f = b(e)
            }
        } else {
            if (b(this).parent().hasClass("input-group-tooltips")) {
                f = b(this).parent()
            } else {
                if (b(this).is(":radio") || b(this).is(":checkbox")) {
                    f = b("input[name='" + b(this).attr("name") + "']").last()
                }
            }
        }
        return b(f)
    }
    ;
    b.fn.loadIframe = function(e, g) {
        var h = {
            progress: b.noop,
            complete: b.noop
        };
        var f = b(this[0]);
        if (!b(f).is("iframe")) {
            throw new Error(" Current Element is not an iframe ! ")
        } else {
            return b.when(b.Deferred(function(i) {
                var n = b.trim(e).toLowerCase();
                if (typeof e == "string" && n.length > 0) {
                    try {
                        var q = b.extend(true, {}, h, b(f).data(), ((typeof g == "object" && g) ? g : {}));
                        var l = function() {
                            f.onload = f.onreadystatechange = f.onerror = null
                        };
                        var m = function() {
                            if ((!this.readyState) || (/loaded|complete/.test(this.readyState))) {
                                if (b.isFunction(q.complete)) {
                                    q.complete.call(this)
                                }
                                l();
                                i.resolve()
                            }
                        };
                        var o = function() {
                            l();
                            if (q.ignore && q.ignore != true) {
                                i.reject()
                            }
                        };
                        var k = window.setInterval(function() {
                            if (f) {
                                if ((!f.readyState) || (/loaded|complete/.test(f.readyState))) {
                                    window.clearInterval(k)
                                } else {
                                    if (b.isFunction(q.progress)) {
                                        q.progress.call(f)
                                    }
                                }
                            } else {
                                window.clearInterval(k)
                            }
                        }, 100);
                        if (f.attachEvent) {
                            f.attachEvent("onload", function() {
                                alert("Local iframe is now loaded.");
                                if (j) {
                                    return
                                }
                                m.call(this);
                                j = true
                            });
                            f.attachEvent("onerror", function() {
                                o.call(this)
                            })
                        } else {
                            var j = false;
                            f.onload = f.onreadystatechange = function() {
                                alert("Local iframe is now loaded.");
                                if (j) {
                                    return
                                }
                                m.call(this);
                                j = true
                            }
                            ;
                            f.onerror = function() {
                                o.call(this)
                            }
                        }
                        f.src = e
                    } catch (p) {
                        throw new Error(p)
                    }
                } else {
                    i.resolve()
                }
            }))
        }
    }
    ;
    b.fn.serializeJSON = function(f) {
        var e = {};
        b(this).find("input[type!='button'][type!='file'][name!='multi-item'],select,textarea").each(function(k, j) {
            var l = b(this).attr("name"), h;
            if (!e[l]) {
                if (b(this).is("select")) {
                    h = b(this).find("option:selected").val()
                } else {
                    if (b(this).is(":radio")) {
                        var g = b("input[name='" + l + "']").filter(":checked");
                        h = b(g[0]).val()
                    } else {
                        if (b(this).is(":checkbox")) {
                            var g = b("input[name='" + l + "']").filter(":checked");
                            if (b(g).size() > 1) {
                                h = new Array();
                                b(g).each(function(n, o) {
                                    h.push(b(o).val())
                                })
                            } else {
                                h = b(g[0]).val()
                            }
                        } else {
                            h = b(this).val()
                        }
                    }
                }
                if (h) {
                    if (b.isArray(h)) {
                        var m = [];
                        b.each(h || [], function(n, o) {
                            m.push((f != false ? encodeURIComponent(o) : o))
                        });
                        e[l].push(m.join(","))
                    } else {
                        e[l] = f != false ? encodeURIComponent(h) : h
                    }
                } else {
                    e[l] = ""
                }
            }
        });
        return e
    }
}
)(jQuery);
/*
 * 资源加载工具：详情参见：jquery.utils.resources.js
 */
;(function(b) {
    var c = {
        media: "all",
        charset: "utf-8",
        ignore: true,
        cache: true,
        cacheURL: true,
        async: false,
        progress: b.noop,
        complete: b.noop
    };
    b.extend(Array.prototype, {
        contains: function(f, h) {
            var g = false
              , h = h || 0;
            for (var e = h; e < this.length; e++) {
                if (f == this[e]) {
                    g = true;
                    break
                }
            }
            return g
        }
    });
    b.extend({
        matchURL: function(e) {
            var f = b.trim(e || "").toLowerCase();
            return typeof e == "string" && f.length > 0 && /(?:\S+\.(?:js|css|properties)(?:\?ver=\S+)?)/.test(f)
        },
        matchJS: function(e) {
            var f = b.trim(e || "").toLowerCase();
            return typeof e == "string" && f.length > 0 && /(?:\S+\.js(?:\?ver=\S+)?)/.test(f)
        },
        matchCss: function(e) {
            var f = b.trim(e || "").toLowerCase();
            return typeof e == "string" && f.length > 0 && /(?:\S+\.css(?:\?ver=\S+)?)/.test(f)
        }
    });
    function a(e, f) {
        if (e.attachEvent) {
            e.attachEvent("onload", f)
        } else {
            setTimeout(function() {
                d(e, f)
            }, 0)
        }
    }
    function d(g, h) {
        if (h.isCalled) {
            return
        }
        var e = false;
        if (/webkit/i.test(navigator.userAgent)) {
            if (g.sheet) {
                e = true
            }
        } else {
            if (g.sheet) {
                try {
                    if (g.sheet.cssRules) {
                        e = true
                    }
                } catch (f) {
                    if (f.code === 1000) {
                        e = true
                    }
                }
            }
        }
        if (e) {
            setTimeout(function() {
                h()
            }, 1)
        } else {
            setTimeout(function() {
                d(g, h)
            }, 1)
        }
    }
    b.fn.include = function(e, f) {
        var g = b(this[0]);
        var h = b.data(g, "cacheURL") || [];
        return b.when(b.Deferred(function(m) {
            if (b.matchURL(e)) {
                if (h.contains(e)) {
                    m.resolve()
                } else {
                    try {
                        var j = b.extend(true, {}, c, b(g).data(), ((typeof f == "object" && f) ? f : {}), {
                            dataType: "text",
                            url: e
                        });
                        var k = function(o) {
                            do {
                                o += ~~(Math.random() * 1000000)
                            } while (document.getElementById(o));
                            return o
                        };
                        b.ajaxSetup({
                            async: j.async,
                            cache: j.cache
                        });
                        if (b.matchJS(e)) {
                            var i = document.createElement("script");
                            i.language = "javascript";
                            i.type = "text/javascript";
                            i.id = k("script");
                            b.ajax(b.extend(true, j, {
                                success: function(p) {
                                    try {
                                        i.appendChild(document.createTextNode(p))
                                    } catch (o) {
                                        i.text = p
                                    }
                                    m.resolve()
                                },
                                error: function() {
                                    document.removeChild(i);
                                    if (j.ignore && j.ignore != true) {
                                        m.reject()
                                    }
                                }
                            }));
                            g[0].appendChild(i)
                        } else {
                            if (b.matchCss(e)) {
                                var l = document.createElement("style");
                                l.id = k("css");
                                l.media = j.media || "all";
                                b.ajax(b.extend(true, j, {
                                    success: function(o) {
                                        if (l.styleSheet) {
                                            l.styleSheet.cssText = o
                                        } else {
                                            l.appendChild(document.createTextNode(o))
                                        }
                                        m.resolve()
                                    },
                                    error: function() {
                                        document.removeChild(l);
                                        if (j.ignore && j.ignore != true) {
                                            m.reject()
                                        }
                                    }
                                }));
                                g[0].appendChild(l)
                            }
                        }
                        b.ajaxSetup({
                            async: true,
                            cache: true
                        });
                        if (j.cacheURL == true) {
                            h.push(e);
                            b.data(g, "cacheURL", h)
                        }
                    } catch (n) {
                        m.reject();
                        throw new Error(n)
                    }
                }
            } else {
                m.resolve()
            }
        }).promise())
    }
    ;
    b.fn.includes = function(h, e) {
        var g = b(this);
        h = b.grep(b.makeArray(h || []), function(j, k) {
            return b.matchURL(j)
        }, false);
        function f(l, k, j) {
            return b.when(b.Deferred(function(i) {
                k[j].call(g, i, h[j])
            }).promise()).always(function() {
                if (j < k.length) {
                    f(l, k, j + 1)
                } else {
                    l.resolve()
                }
            })
        }
        return b.when(b.Deferred(function(l) {
            try {
                var k = [];
                for (var j = 0; j < h.length; j++) {
                    k[j] = function(i, n) {
                        console.log("url:" + n);
                        b(g).include(n, e).fail(function() {
                            if (e.ignore && e.ignore != true) {
                                i.reject()
                            }
                        }).always(function() {
                            i.resolve()
                        })
                    }
                }
                f(l, k, 0)
            } catch (m) {
                l.reject()
            }
        }).promise())
    }
    ;
    b.fn.loadResource = function(e, f) {
        var g = b(this[0]);
        var h = b.data(g, "cacheURL") || [];
        return b.when(b.Deferred(function(j) {
            if (b.matchURL(e)) {
                if (h.contains(e)) {
                    j.resolve()
                } else {
                    try {
                        var s = b.extend(true, {}, c, b(g).data(), ((typeof f == "object" && f) ? f : {}));
                        var p = function(t) {
                            do {
                                t += ~~(Math.random() * 1000000)
                            } while (document.getElementById(t));
                            return t
                        };
                        if (b.matchJS(e)) {
                            if (s.async == false) {
                                b.ajaxSetup({
                                    async: s.async,
                                    cache: s.cache
                                });
                                b.getScript(e).done(function() {
                                    if (b.isFunction(s.complete)) {
                                        s.complete.call(this)
                                    }
                                    j.resolve();
                                    if (s.cacheURL == true) {
                                        h.push(e);
                                        b.data(g, "cacheURL", h)
                                    }
                                }).fail(function() {
                                    if (s.ignore && s.ignore != true) {
                                        j.reject()
                                    }
                                });
                                b.ajaxSetup({
                                    async: true,
                                    cache: true
                                })
                            } else {
                                var r = document.createElement("script");
                                r.setAttribute("id", p("script"));
                                r.setAttribute("type", "text/javascript");
                                r.setAttribute("media", s.media || "all");
                                r.setAttribute("charset", s.charset || "utf-8");
                                r.setAttribute("src", e);
                                if (s.async == true) {
                                    r.setAttribute("async", true);
                                    r.setAttribute("defer", true)
                                } else {
                                    r.setAttribute("async", false)
                                }
                                g[0].appendChild(r);
                                var l = function() {
                                    r.onload = r.onreadystatechange = r.onerror = null;
                                    if (g[0] && r.parentNode) {
                                        g[0].removeChild(r);
                                        r = null
                                    }
                                };
                                var m = function(t) {
                                    if ((!this.readyState) || (/loaded|complete/.test(this.readyState))) {
                                        if (b.isFunction(s.complete)) {
                                            s.complete.call(this)
                                        }
                                        l();
                                        j.resolve();
                                        if (s.cacheURL == true) {
                                            h.push(e);
                                            b.data(g, "cacheURL", h)
                                        }
                                    }
                                };
                                var n = function() {
                                    l();
                                    if (s.ignore && s.ignore != true) {
                                        j.reject()
                                    }
                                };
                                var k = window.setInterval(function() {
                                    if (r) {
                                        if ((!r.readyState) || (/loaded|complete/.test(r.readyState))) {
                                            window.clearInterval(k)
                                        } else {
                                            if (b.isFunction(s.progress)) {
                                                s.progress.call(r)
                                            }
                                        }
                                    } else {
                                        window.clearInterval(k)
                                    }
                                }, 100);
                                var i = false;
                                r.onload = r.onreadystatechange = function() {
                                    if (i) {
                                        return
                                    }
                                    m.call(this);
                                    i = true
                                }
                                ;
                                r.onerror = function() {
                                    n.call(this)
                                }
                            }
                        } else {
                            if (b.matchCss(e)) {
                                var q = window.document.createElement("link");
                                q.setAttribute("id", p("css"));
                                q.setAttribute("type", "text/css");
                                q.setAttribute("rel", "stylesheet");
                                q.setAttribute("media", s.media || "all");
                                q.setAttribute("charset", s.charset || "utf-8");
                                q.setAttribute("href", e);
                                g[0].appendChild(q);
                                a(q, function() {
                                    j.resolve();
                                    if (s.cacheURL == true) {
                                        h.push(e);
                                        b.data(g, "cacheURL", h)
                                    }
                                })
                            }
                        }
                    } catch (o) {
                        j.reject();
                        throw new Error(o)
                    }
                }
            } else {
                j.resolve()
            }
        }).promise())
    }
    ;
    b.fn.loadResources = function(h, e) {
        var g = b(this);
        h = b.grep(b.makeArray(h || []), function(j, k) {
            return typeof j == "string" && b.trim(j).length > 0 && /(?:\S+\.(?:js|css)(?:\?ver=\S+)?)/.test(b.trim(j).toLowerCase())
        }, false);
        function f(k, l, j) {
            return b.when(b.Deferred(function(i) {
                if (typeof l[j] != "undefined") {
                    l[j].call(g, i, h[j])
                } else {
                    i.resolve()
                }
            }).promise()).always(function() {
                if (j < l.length) {
                    f(k, l, j + 1)
                } else {
                    k.resolve()
                }
            })
        }
        return b.when(b.Deferred(function(k) {
            try {
                var m = [];
                for (var j = 0; j < h.length; j++) {
                    m[j] = function(i, n) {
                        console.log("url:" + n);
                        b(g).loadResource(n, e).fail(function() {
                            if (e.ignore && e.ignore != true) {
                                i.reject()
                            }
                        }).always(function() {
                            i.resolve()
                        })
                    }
                }
                f(k, m, 0)
            } catch (l) {
                k.reject()
            }
        }).promise())
    }
}(jQuery));
/*
 * 元素尺寸相关工具：详情参见：jquery.utils.dimension-1.0.0.js
 */
;(function(a) {
    a.viewWidth = function() {
        var b = 0
          , c = document;
        if (c.documentElement && c.documentElement.clientWidth) {
            b = c.documentElement.clientWidth
        } else {
            if (c.body && c.body.clientWidth) {
                b = c.body.clientWidth
            }
        }
        return b
    }
    ;
    a.viewHeight = function() {
        var b = 0
          , c = document;
        if (document.compatMode != "CSS1Compat") {
            b = c.body.clientHeight
        } else {
            if (c.documentElement && c.documentElement.clientHeight) {
                b = c.documentElement.clientHeight
            } else {
                if (c.body && c.body.clientHeight) {
                    b = c.body.clientHeight
                }
            }
        }
        return b
    }
    ;
    a.canvasHeight = function() {
        var c = document
          , b = 0;
        b = Math.max(Math.max(c.body.scrollHeight, c.documentElement.scrollHeight), Math.max(c.body.offsetHeight, c.documentElement.offsetHeight), Math.max(c.body.clientHeight, c.documentElement.clientHeight));
        if (a.browser.msie && a.browser.version > 6 && c.body.scrollHeight < a.viewHeight()) {
            b = c.body.clientHeight
        }
        if (a.browser.msie && document.compatMode == "CSS1Compat" && c.body.scrollHeight < a.viewHeight()) {
            if (a.browser.version > 7 && a.browser.version < 9) {} else {
                if (a.browser.version > 6 && a.browser.version < 8) {}
            }
            b = c.documentElement.clientHeight
        }
        return b
    }
    ;
    a.canvasWidth = function() {
        var c = document
          , b = c.body.scrollWidth;
        if (document.compatMode == "CSS1Compat") {
            b = c.documentElement.scrollWidth
        } else {
            if (a.browser.msie && a.browser.version <= 6 && c.body.scrollWidth > a.viewWidth()) {
                b = Math.max(Math.max(c.body.scrollWidth, c.documentElement.scrollWidth), Math.max(c.body.offsetWidth, c.documentElement.offsetWidth), Math.max(c.body.clientWidth, c.documentElement.clientWidth))
            }
        }
        return b
    }
    ;
    a.scrollLeft = function() {
        if (document.compatMode != "CSS1Compat" || (a.browser.msie && a.browser.version <= 6)) {
            return Math.max(a("body").scrollLeft(), document.documentElement.scrollLeft)
        } else {
            return a("body").scrollLeft()
        }
    }
    ;
    a.scrollTop = function() {
        if (document.compatMode != "CSS1Compat" || (a.browser.msie && a.browser.version <= 6)) {
            return Math.max(a("body").scrollTop(), document.documentElement.scrollTop)
        } else {
            return a("body").scrollTop()
        }
    }
    ;
    a.extend({
        clientWidth: function() {
            var c = a(window).width();
            var d = a.browser;
            var b = "";
            if (d.msie || d.mozilla) {
                c = document.documentElement.clientWidth
            }
            if (d.safari) {
                b = "Apple Safari " + d.version
            }
            if (d.opera) {
                c = document.body.clientWidth
            }
            if (document.compatMode == "BackCompat") {
                c = document.body.clientWidth
            } else {
                c = document.documentElement.clientWidth
            }
            return c
        },
        clientHeight: function() {
            var c = window.screen.availHeight;
            var d = a.browser;
            var b = "";
            if (d.msie || d.mozilla) {
                c = document.documentElement.clientHeight
            }
            if (d.safari) {
                b = "Apple Safari " + d.version
            }
            if (d.opera) {
                c = document.body.clientHeight
            }
            if (document.compatMode == "BackCompat") {
                c = document.body.clientHeight
            } else {
                if (document.compatMode == "CSS1Compat") {
                    c = document.documentElement.clientHeight
                }
            }
            return c
        },
        windowWidth: function() {
            var b = a(window).width();
            if (self.innerHeight) {
                b = self.innerWidth;
                if (document.documentElement.clientWidth) {
                    b = document.documentElement.clientWidth
                }
            } else {
                if (document.documentElement && document.documentElement.clientHeight) {
                    b = document.documentElement.clientWidth
                } else {
                    if (document.body) {
                        b = document.body.clientWidth
                    }
                }
            }
            return b
        },
        windowHeight: function() {
            var b = a(window).height();
            if (self.innerHeight) {
                b = self.innerHeight
            } else {
                if (document.documentElement && document.documentElement.clientHeight) {
                    b = document.documentElement.clientHeight
                } else {
                    if (document.body) {
                        b = document.body.clientHeight
                    }
                }
            }
            return b
        }
    });
    a.fn.getHeight = function() {
        var d = a(this)
          , b = "auto";
        if (d.is(":visible")) {
            b = d.height()
        } else {
            var c = {
                position: d.css("position"),
                visibility: d.css("visibility"),
                display: d.css("display")
            };
            b = d.css({
                position: "absolute",
                visibility: "hidden",
                display: "block"
            }).height();
            d.css(c)
        }
        return b
    }
    ;
    a.fn.getSize = function() {
        var e = a(this);
        if (e.css("display") !== "none") {
            return {
                width: e.width(),
                height: e.height()
            }
        }
        var d = {
            position: e.css("position"),
            visibility: e.css("visibility"),
            display: e.css("display")
        }
          , c = {
            display: "block",
            position: "absolute",
            visibility: "hidden"
        };
        e.css(c);
        var f = e.width()
          , b = e.height();
        e.css(d);
        return {
            width: f,
            height: b
        }
    }
    ;
    a.getPageSize = function() {
        var c, b;
        if (window.innerHeight && window.scrollMaxY) {
            c = window.innerWidth + window.scrollMaxX;
            b = window.innerHeight + window.scrollMaxY
        } else {
            if (document.body.scrollHeight > document.body.offsetHeight) {
                c = document.body.scrollWidth;
                b = document.body.scrollHeight
            } else {
                c = document.body.offsetWidth;
                b = document.body.offsetHeight
            }
        }
        var d = a(window).getDimension();
        if (b < d.height) {
            pageHeight = d.height
        } else {
            pageHeight = b
        }
        if (c < d.width) {
            pageWidth = c
        } else {
            pageWidth = d.width
        }
        return {
            width: pageWidth,
            height: pageHeight
        }
    }
    ;
    a.getClientSize = function() {
        return {
            width: function() {
                var c = a(window).width();
                var d = a.browser;
                var b = "";
                if (d.msie || d.mozilla) {
                    c = document.documentElement.clientWidth
                }
                if (d.safari) {
                    b = "Apple Safari " + d.version
                }
                if (d.opera) {
                    c = document.body.clientWidth
                }
                if (document.compatMode == "BackCompat") {
                    c = document.body.clientWidth
                } else {
                    c = document.documentElement.clientWidth
                }
                return c
            }
            .call(this),
            height: function() {
                var b = a(window).height();
                if (self.innerHeight) {
                    b = self.innerHeight
                } else {
                    if (document.documentElement && document.documentElement.clientHeight) {
                        b = document.documentElement.clientHeight
                    } else {
                        if (document.body) {
                            b = document.body.clientHeight
                        }
                    }
                }
                return b
            }
            .call(this)
        }
    }
    ;
    a.fn.getDimension = function() {
        var c = a(this);
        var b = this[0].tagName ? this[0].tagName.toLocaleLowerCase() == "body" : false;
        var d = a.isWindow(this);
        return {
            width: function() {
                if (d) {
                    return a(window).width()
                } else {
                    if (b) {
                        return a(document).width()
                    } else {
                        return Math.max(c.width(), c.innerWidth())
                    }
                }
            }
            .call(this),
            height: function() {
                if (d) {
                    return a(window).height()
                } else {
                    if (b) {
                        return a(document).height()
                    } else {
                        return Math.max(c.height(), c.innerHeight())
                    }
                }
            }
            .call(this)
        }
    }
    ;
    a.fn.getPosition = function() {
        var d = a(this);
        var c = a(this)[0].tagName ? a(this)[0].tagName.toLocaleLowerCase() == "body" : false;
        var e = a.isWindow(this);
        var b = a.extend(true, {}, {
            scrollTop: c ? a(document).scrollTop() : d.scrollTop(),
            scrollLeft: c ? a(document).scrollLeft() : d.scrollLeft()
        }, (e ? {
            left: 0,
            top: 0
        } : d.offset()));
        var f = d.getDimension();
        return a.extend({}, b, {
            width: f.width,
            height: f.height,
            pageX: b.left + b.scrollLeft,
            pageY: b.top + b.scrollTop,
            border: e ? 0 : (d.outerWidth() - d.innerWidth()),
            padding: e ? 0 : (d.innerWidth() - d.width()),
            margin: e ? 0 : (d.outerWidth(true) - d.outerWidth())
        }, c ? {
            top: 0,
            left: 0
        } : d.offset())
    }
    ;
    a.fn.getBoundingRect = function() {
        var b = this;
        var d = a.isWindow(this);
        var c = d ? 0 : (a(b).outerWidth() - a(b).innerWidth());
        var f = d ? 0 : (a(b).innerWidth() - a(b).width());
        var e = d ? 0 : function() {
            try {
                return (a(b).outerWidth(true) - a(b).outerWidth())
            } catch (g) {
                return 0
            }
        }
        .call(this);
        return {
            border: c,
            "border-left": d ? 0 : function() {
                try {
                    var g = a.trim((a(b).css("border-left") || "").replace(/\!important/ig, "").replace("px", ""));
                    return a.isNumeric(g) ? parseInt(g) : c
                } catch (h) {
                    return c
                }
            }
            .call(this),
            "border-top": d ? 0 : function() {
                try {
                    var g = a.trim((a(b).css("border-top") || "").replace(/\!important/ig, "").replace("px", ""));
                    return a.isNumeric(g) ? parseInt(g) : c
                } catch (h) {
                    return c
                }
            }
            .call(this),
            "border-right": d ? 0 : function() {
                try {
                    var g = a.trim((a(b).css("border-right") || "").replace(/\!important/ig, "").replace("px", ""));
                    return a.isNumeric(g) ? parseInt(g) : c
                } catch (h) {
                    return c
                }
            }
            .call(this),
            "border-bottom": d ? 0 : function() {
                try {
                    var g = a.trim((a(b).css("border-bottom") || "").replace(/\!important/ig, "").replace("px", ""));
                    return a.isNumeric(g) ? parseInt(g) : c
                } catch (h) {
                    return c
                }
            }
            .call(this),
            padding: f,
            "padding-left": d ? 0 : function() {
                try {
                    var g = a.trim((a(b).css("padding-left") || "").replace(/\!important/ig, "").replace("px", ""));
                    return a.isNumeric(g) ? parseInt(g) : f
                } catch (h) {
                    return f
                }
            }
            .call(this),
            "padding-top": d ? 0 : function() {
                try {
                    var g = a.trim((a(b).css("padding-top") || "").replace(/\!important/ig, "").replace("px", ""));
                    return a.isNumeric(g) ? parseInt(g) : f
                } catch (h) {
                    return f
                }
            }
            .call(this),
            "padding-right": d ? 0 : function() {
                try {
                    var g = a.trim((a(b).css("padding-right") || "").replace(/\!important/ig, "").replace("px", ""));
                    return a.isNumeric(g) ? parseInt(g) : f
                } catch (h) {
                    return f
                }
            }
            .call(this),
            "padding-bottom": d ? 0 : function() {
                try {
                    var g = a.trim((a(b).css("padding-bottom") || "").replace(/\!important/ig, "").replace("px", ""));
                    return a.isNumeric(g) ? parseInt(g) : f
                } catch (h) {
                    return f
                }
            }
            .call(this),
            margin: e,
            "margin-left": d ? 0 : function() {
                try {
                    var g = a.trim((a(b).css("margin-left") || "").replace(/\!important/ig, "").replace("px", ""));
                    return a.isNumeric(g) ? parseInt(g) : e
                } catch (h) {
                    return e
                }
            }
            .call(this),
            "margin-top": d ? 0 : function() {
                try {
                    var g = a.trim((a(b).css("margin-top") || "").replace(/\!important/ig, "").replace("px", ""));
                    return a.isNumeric(g) ? parseInt(g) : e
                } catch (h) {
                    return e
                }
            }
            .call(this),
            "margin-right": d ? 0 : function() {
                try {
                    var g = a.trim((a(b).css("margin-right") || "").replace(/\!important/ig, "").replace("px", ""));
                    return a.isNumeric(g) ? parseInt(g) : e
                } catch (h) {
                    return e
                }
            }
            .call(this),
            "margin-bottom": d ? 0 : function() {
                try {
                    var g = a.trim((a(b).css("margin-bottom") || "").replace(/\!important/ig, "").replace("px", ""));
                    return a.isNumeric(g) ? parseInt(g) : e
                } catch (h) {
                    return e
                }
            }
            .call(this)
        }
    }
}
)(jQuery);
/*
 * 字符格式化工具：详情参见：jquery.utils.format-1.0.0.js
 */
;(function(a) {
    a.replacement = function(f) {
        var e;
        if (typeof (f) == "string") {
            e = 0;
            while ((e = f.indexOf("\\", e)) != -1) {
                if (f.charAt(e + 1) == "t") {
                    f = f.substring(0, e) + "\t" + f.substring((e++) + 2)
                } else {
                    if (f.charAt(e + 1) == "r") {
                        f = f.substring(0, e) + "\r" + f.substring((e++) + 2)
                    } else {
                        if (f.charAt(e + 1) == "n") {
                            f = f.substring(0, e) + "\n" + f.substring((e++) + 2)
                        } else {
                            if (f.charAt(e + 1) == "f") {
                                f = f.substring(0, e) + "\f" + f.substring((e++) + 2)
                            } else {
                                if (f.charAt(e + 1) == "\\") {
                                    f = f.substring(0, e) + "\\" + f.substring((e++) + 2)
                                } else {
                                    f = f.substring(0, e) + f.substring(e + 1)
                                }
                            }
                        }
                    }
                }
            }
            var b = [], d, c;
            e = 0;
            while (e < f.length) {
                if (f.charAt(e) == "'") {
                    if (e == f.length - 1) {
                        f = f.substring(0, e)
                    } else {
                        if (f.charAt(e + 1) == "'") {
                            f = f.substring(0, e) + f.substring(++e)
                        } else {
                            d = e + 2;
                            while ((d = f.indexOf("'", d)) != -1) {
                                if (d == f.length - 1 || f.charAt(d + 1) != "'") {
                                    f = f.substring(0, e) + f.substring(e + 1, d) + f.substring(d + 1);
                                    e = d - 1;
                                    break
                                } else {
                                    f = f.substring(0, d) + f.substring(++d)
                                }
                            }
                            if (d == -1) {
                                f = f.substring(0, e) + f.substring(e + 1)
                            }
                        }
                    }
                } else {
                    e++
                }
            }
        }
        return f
    }
    ;
    a.format = function(c, d) {
        c = a.replacement(c);
        if (arguments.length == 1) {
            return function() {
                var e = a.makeArray(arguments);
                e.unshift(c);
                return a.format.apply(this, e)
            }
        }
        if (arguments.length > 2 && d.constructor != Array) {
            d = a.makeArray(arguments).slice(1)
        }
        if (!isNaN(c) && Number.prototype.format) {
            return Number(c).format(d)
        } else {
            if (a.type(c) === "date" && Date.prototype.format) {
                return c.format(d)
            } else {
                if (a.type(c) === "string") {
                    if (String.prototype.format) {
                        return new String(c).format(d)
                    } else {
                        if (a.isArray(d)) {
                            return c.replace(/\{([^}]*)\}/mg, function(f, e) {
                                return f = d[e]
                            })
                        } else {
                            if (a.isPlainObject(d)) {
                                return c.replace(/\$\{([^}]*)\}/mg, function(f, e) {
                                    return f = d[e.trim()]
                                })
                            } else {
                                if (a.type(d) === "string") {
                                    if (String.prototype.toDate) {
                                        var b = c.toDate();
                                        if (b != null && Date.prototype.format) {
                                            return b.format(d)
                                        }
                                    } else {
                                        a.each(a.makeArray(d), function(e, f) {
                                            c = c.replace(new RegExp("\\{" + e + "\\}","mg"), f)
                                        })
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return c
    }
}(jQuery));
/*
 * 文件对象相关工具：详情参见：jquery.utils.file-1.0.0.js
 */
;(function(a) {
    var b = {
        regex: /^([1-9]\d*|[1-9]\d*.\d*|0.\d*[1-9]\d*)(B|KB|MB|GB|TB|PB|EB|ZB|YB|BB)$/,
        powers: {
            B: 1,
            KB: 1024,
            MB: 1024 * 1024,
            GB: 1024 * 1024 * 1024,
            TB: 1024 * 1024 * 1024 * 1024
        }
    };
    a.capacity = function(f, g) {
        if (!a.founded(f)) {
            return 0
        }
        f = a.trim(f.toString());
        if (!a.founded(g)) {
            f = f.toUpperCase();
            var d = b.regex.exec(f);
            if (d && d[2]) {
                var e = parseFloat(d[1]);
                var h = b.powers[d[2]] || 1;
                return e * h
            } else {
                return f
            }
        } else {
            if (a.isNumeric(f)) {
                f = parseFloat(f);
                if (f < 1024) {
                    return f + "B"
                } else {
                    var c = b.powers[g.toUpperCase()];
                    return (Math.round(f * 100 / c) / 100).toString() + g.toUpperCase()
                }
            }
        }
        return 0
    }
    ;
    a.fileMatch = function(d, e, f) {
        var h = f && a.trim(f).length > 0 ? a.trim(f) : "";
        var c = h.split("/");
        h = c[c.length - 1].toLowerCase();
        e = (e || "").toLowerCase();
        if (a.type(d) === "regexp") {
            if (d.test(e) || d.test(h)) {
                return true
            }
            return false
        } else {
            if (!a.isArray(d)) {
                return a.fileMatch(a.makeArray(d), e, f)
            }
            var g = false;
            a.each(d, function(j, l) {
                if (a.type(l) === "regexp") {
                    g = a.fileMatch(l, e, f)
                } else {
                    if (a.type(l) === "string" && a.trim(l).length > 0) {
                        var k = l.split(";");
                        a.each(k, function(m, i) {
                            i = a.trim(i || "");
                            if (i.length > 0 && i.indexOf(".") > -1) {
                                if (i == "*.*") {
                                    g = true
                                } else {
                                    if (i.indexOf(".") != 0) {
                                        i = i.replace(".", "\\.")
                                    }
                                    var o = "";
                                    if (i.indexOf("*") == 0) {
                                        i = i.substring(1);
                                        if (i.indexOf(".") != 0) {
                                            o += "."
                                        }
                                    }
                                    if (i.lastIndexOf("*") == (i.length - 1)) {
                                        i = i.substring(0, (i.length - 1))
                                    }
                                    o += i + "$";
                                    var n = new RegExp(o,"g");
                                    if (n.test(e) || n.test(h)) {
                                        g = true
                                    }
                                }
                            }
                            if (g) {
                                return false
                            }
                        })
                    }
                }
                if (g) {
                    return false
                }
            });
            return g
        }
    }
    ;
    a.fn.extend({
        elementBlur: function() {
            if (self.frameElement.tagName == "IFRAME") {
                var c = self.document.getElementById("focusDiv");
                if (!c) {
                    a('<div id="focusDiv" style="width: 1px; height: 1px;"></div>').appendTo(self.document.body);
                    c = self.document.getElementById("focusDiv")
                }
                a(c).focus()
            } else {
                this.blur()
            }
        },
        getFiles: function() {
            if (a(this[0]).is(":file")) {
                var c = this[0].files;
                if (!c) {
                    c = function() {
                        if (a.browser.msie === true) {
                            try {
                                var f = new ActiveXObject("Scripting.FileSystemObject");
                                var d = null;
                                if (a.browser.version <= 6) {
                                    d = f.GetFile(this.value)
                                } else {
                                    if (a.browser.version >= 7) {
                                        this.select();
                                        a(this).elementBlur();
                                        d = f.GetFile(document.selection.createRange().text)
                                    }
                                }
                            } catch (g) {
                                alert("\u8bf7\u4fee\u6539IE\u6d4f\u89c8\u5668ActiveX\u5b89\u5168\u8bbe\u7f6e\u4e3a\u542f\u7528~\uff01")
                            }
                            return [d]
                        }
                    }
                    .call(this[0])
                }
                return c
            }
            return []
        },
        getFileCount: function() {
            return a(this).getFiles().length
        },
        getFileSize: function() {
            if (a(this[0]).is(":file")) {
                var d = a(this).getFiles();
                if (d.length > 0) {
                    if (d.length > 1) {
                        var c = [];
                        a.each(this.files || [], function(h, g) {
                            try {
                                c.push(d.item(h).fileSize)
                            } catch (j) {
                                c.push(g.size)
                            }
                        });
                        return c.join(";")
                    } else {
                        try {
                            return d.item(0).fileSize
                        } catch (f) {
                            return d[0].size
                        }
                    }
                }
            }
            return 0
        },
        getFileName: function(c) {
            if (a(this[0]).is(":file")) {
                var f = a(this).getFiles();
                if (f.length > 0) {
                    if (f.length > 1) {
                        var d = [];
                        a.each(this.files || [], function(j, h) {
                            try {
                                d.push(f.item(j).fileName)
                            } catch (k) {
                                d.push(h.name)
                            }
                        });
                        return d.join(";")
                    } else {
                        try {
                            return f.item(0).fileName
                        } catch (g) {
                            return f[0].name
                        }
                    }
                }
            }
            return 0
        },
        getFileFullPath: function() {
            var d = "";
            if (a(this[0]).is(":file")) {
                var f = this[0].files;
                if (!f) {
                    if (a.browser.msie) {
                        if (a.browser.version <= 6) {
                            d = this[0].value
                        } else {
                            if (a.browser.version >= 7) {
                                this.select();
                                a(this).elementBlur();
                                d = document.selection.createRange().text
                            }
                        }
                    } else {
                        d = this[0].value
                    }
                } else {
                    var h = [];
                    for (var c = 0; c < f.length; c++) {
                        try {
                            d = f.item(c).getAsDataURL()
                        } catch (g) {
                            d = window.URL.createObjectURL(f[c])
                        }
                        h.push(d)
                    }
                    d = h.join(";")
                }
            }
            return d
        },
        getFilePath: function() {
            var c = "";
            if (a(this[0]).is(":file")) {
                var d = a(this).getFiles();
                var e = [];
                a.each(d || [], function(g, f) {
                    try {
                        c = (f.path || d.item(g).getAsDataURL())
                    } catch (h) {
                        c = window.URL.createObjectURL(f)
                    }
                    e.push(c)
                });
                c = e.join(";")
            }
            return c
        },
        getFileSuffix: function() {
            var e = a(this).getFilePath();
            if (a.founded(e)) {
                var d = e.split(";");
                var c = [];
                a.each(d || [], function(f, g) {
                    c.push(g.substr(g.lastIndexOf(".")).toLowerCase())
                });
                return c.join(";")
            } else {
                return null
            }
        },
        isSuffix: function(f) {
            if (a(this[0]).is(":file")) {
                var e = a(this).getFileSuffix();
                if (a.founded(e) && a.founded(f)) {
                    var c = e.split(";");
                    var d = false;
                    a.each(c || [], function(g, h) {
                        d = a.fileMatch(f, h, h);
                        return d
                    });
                    return d
                } else {
                    return false
                }
            } else {
                return false
            }
        },
        clearFile: function() {
            var f = a(this[0]);
            if (a(f).is(":file")) {
                var d = a(f).clone(true, true).val("");
                try {
                    this.select();
                    document.execCommand("delete")
                } catch (c) {
                    f.after(d);
                    f.remove()
                }
            }
        },
        getAsBinary: function(d) {
            if (a(this[0]).is(":file")) {
                try {
                    return this[0].files.item(d || 0).getAsBinary()
                } catch (f) {
                    if (typeof FileReader != "undefined") {
                        var c = new FileReader();
                        c.readAsBinaryString(this[0].files[d || 0]);
                        c.onload = function(h) {
                            var g = this.result
                        }
                    }
                }
            }
            return null
        },
        getAsDataURL: function(d) {
            if (a(this[0]).is(":file")) {
                try {
                    return this[0].files.item(d || 0).getAsDataURL()
                } catch (f) {
                    if (typeof FileReader != "undefined") {
                        var c = new FileReader();
                        c.readAsDataURL(this[0].files[d || 0]);
                        c.onload = function(h) {
                            var g = this.result
                        }
                    }
                }
            }
            return null
        },
        getAsText: function(d, f) {
            if (a(this[0]).is(":file")) {
                try {
                    return this[0].files.item(d || 0).getAsText(f || "utf-8")
                } catch (g) {
                    if (typeof FileReader != "undefined") {
                        var c = new FileReader();
                        c.readAsDataURL(this[0].files[d || 0], f || "utf-8");
                        c.onload = function(i) {
                            var h = this.result
                        }
                    }
                }
            }
            return null
        }
    })
}
)(jQuery);
/*
 * Md5加密工具：详情参见：jquery.md5.js
 */
;(function(e) {
    var m = function(p, o) {
        return (p << o) | (p >>> (32 - o))
    };
    var a = function(s, p) {
        var u, o, r, t, q;
        r = (s & 2147483648);
        t = (p & 2147483648);
        u = (s & 1073741824);
        o = (p & 1073741824);
        q = (s & 1073741823) + (p & 1073741823);
        if (u & o) {
            return (q ^ 2147483648 ^ r ^ t)
        }
        if (u | o) {
            if (q & 1073741824) {
                return (q ^ 3221225472 ^ r ^ t)
            } else {
                return (q ^ 1073741824 ^ r ^ t)
            }
        } else {
            return (q ^ r ^ t)
        }
    };
    var n = function(o, q, p) {
        return (o & q) | ((~o) & p)
    };
    var l = function(o, q, p) {
        return (o & p) | (q & (~p))
    };
    var j = function(o, q, p) {
        return (o ^ q ^ p)
    };
    var i = function(o, q, p) {
        return (q ^ (o | (~p)))
    };
    var g = function(q, p, v, u, o, r, t) {
        q = a(q, a(a(n(p, v, u), o), t));
        return a(m(q, r), p)
    };
    var c = function(q, p, v, u, o, r, t) {
        q = a(q, a(a(l(p, v, u), o), t));
        return a(m(q, r), p)
    };
    var h = function(q, p, v, u, o, r, t) {
        q = a(q, a(a(j(p, v, u), o), t));
        return a(m(q, r), p)
    };
    var d = function(q, p, v, u, o, r, t) {
        q = a(q, a(a(i(p, v, u), o), t));
        return a(m(q, r), p)
    };
    var f = function(r) {
        var v;
        var q = r.length;
        var p = q + 8;
        var u = (p - (p % 64)) / 64;
        var t = (u + 1) * 16;
        var w = Array(t - 1);
        var o = 0;
        var s = 0;
        while (s < q) {
            v = (s - (s % 4)) / 4;
            o = (s % 4) * 8;
            w[v] = (w[v] | (r.charCodeAt(s) << o));
            s++
        }
        v = (s - (s % 4)) / 4;
        o = (s % 4) * 8;
        w[v] = w[v] | (128 << o);
        w[t - 2] = q << 3;
        w[t - 1] = q >>> 29;
        return w
    };
    var b = function(r) {
        var q = "", o = "", s, p;
        for (p = 0; p <= 3; p++) {
            s = (r >>> (p * 8)) & 255;
            o = "0" + s.toString(16);
            q = q + o.substr(o.length - 2, 2)
        }
        return q
    };
    var k = function(p) {
        p = p.replace(/\x0d\x0a/g, "\x0a");
        var o = "";
        for (var r = 0; r < p.length; r++) {
            var q = p.charCodeAt(r);
            if (q < 128) {
                o += String.fromCharCode(q)
            } else {
                if ((q > 127) && (q < 2048)) {
                    o += String.fromCharCode((q >> 6) | 192);
                    o += String.fromCharCode((q & 63) | 128)
                } else {
                    o += String.fromCharCode((q >> 12) | 224);
                    o += String.fromCharCode(((q >> 6) & 63) | 128);
                    o += String.fromCharCode((q & 63) | 128)
                }
            }
        }
        return o
    };
    e.extend({
        md5: function(o) {
            var v = Array();
            var G, H, p, u, F, Q, P, N, K;
            var D = 7
              , B = 12
              , z = 17
              , w = 22;
            var O = 5
              , L = 9
              , J = 14
              , I = 20;
            var t = 4
              , s = 11
              , r = 16
              , q = 23;
            var E = 6
              , C = 10
              , A = 15
              , y = 21;
            o = k(o);
            v = f(o);
            Q = 1732584193;
            P = 4023233417;
            N = 2562383102;
            K = 271733878;
            for (G = 0; G < v.length; G += 16) {
                H = Q;
                p = P;
                u = N;
                F = K;
                Q = g(Q, P, N, K, v[G + 0], D, 3614090360);
                K = g(K, Q, P, N, v[G + 1], B, 3905402710);
                N = g(N, K, Q, P, v[G + 2], z, 606105819);
                P = g(P, N, K, Q, v[G + 3], w, 3250441966);
                Q = g(Q, P, N, K, v[G + 4], D, 4118548399);
                K = g(K, Q, P, N, v[G + 5], B, 1200080426);
                N = g(N, K, Q, P, v[G + 6], z, 2821735955);
                P = g(P, N, K, Q, v[G + 7], w, 4249261313);
                Q = g(Q, P, N, K, v[G + 8], D, 1770035416);
                K = g(K, Q, P, N, v[G + 9], B, 2336552879);
                N = g(N, K, Q, P, v[G + 10], z, 4294925233);
                P = g(P, N, K, Q, v[G + 11], w, 2304563134);
                Q = g(Q, P, N, K, v[G + 12], D, 1804603682);
                K = g(K, Q, P, N, v[G + 13], B, 4254626195);
                N = g(N, K, Q, P, v[G + 14], z, 2792965006);
                P = g(P, N, K, Q, v[G + 15], w, 1236535329);
                Q = c(Q, P, N, K, v[G + 1], O, 4129170786);
                K = c(K, Q, P, N, v[G + 6], L, 3225465664);
                N = c(N, K, Q, P, v[G + 11], J, 643717713);
                P = c(P, N, K, Q, v[G + 0], I, 3921069994);
                Q = c(Q, P, N, K, v[G + 5], O, 3593408605);
                K = c(K, Q, P, N, v[G + 10], L, 38016083);
                N = c(N, K, Q, P, v[G + 15], J, 3634488961);
                P = c(P, N, K, Q, v[G + 4], I, 3889429448);
                Q = c(Q, P, N, K, v[G + 9], O, 568446438);
                K = c(K, Q, P, N, v[G + 14], L, 3275163606);
                N = c(N, K, Q, P, v[G + 3], J, 4107603335);
                P = c(P, N, K, Q, v[G + 8], I, 1163531501);
                Q = c(Q, P, N, K, v[G + 13], O, 2850285829);
                K = c(K, Q, P, N, v[G + 2], L, 4243563512);
                N = c(N, K, Q, P, v[G + 7], J, 1735328473);
                P = c(P, N, K, Q, v[G + 12], I, 2368359562);
                Q = h(Q, P, N, K, v[G + 5], t, 4294588738);
                K = h(K, Q, P, N, v[G + 8], s, 2272392833);
                N = h(N, K, Q, P, v[G + 11], r, 1839030562);
                P = h(P, N, K, Q, v[G + 14], q, 4259657740);
                Q = h(Q, P, N, K, v[G + 1], t, 2763975236);
                K = h(K, Q, P, N, v[G + 4], s, 1272893353);
                N = h(N, K, Q, P, v[G + 7], r, 4139469664);
                P = h(P, N, K, Q, v[G + 10], q, 3200236656);
                Q = h(Q, P, N, K, v[G + 13], t, 681279174);
                K = h(K, Q, P, N, v[G + 0], s, 3936430074);
                N = h(N, K, Q, P, v[G + 3], r, 3572445317);
                P = h(P, N, K, Q, v[G + 6], q, 76029189);
                Q = h(Q, P, N, K, v[G + 9], t, 3654602809);
                K = h(K, Q, P, N, v[G + 12], s, 3873151461);
                N = h(N, K, Q, P, v[G + 15], r, 530742520);
                P = h(P, N, K, Q, v[G + 2], q, 3299628645);
                Q = d(Q, P, N, K, v[G + 0], E, 4096336452);
                K = d(K, Q, P, N, v[G + 7], C, 1126891415);
                N = d(N, K, Q, P, v[G + 14], A, 2878612391);
                P = d(P, N, K, Q, v[G + 5], y, 4237533241);
                Q = d(Q, P, N, K, v[G + 12], E, 1700485571);
                K = d(K, Q, P, N, v[G + 3], C, 2399980690);
                N = d(N, K, Q, P, v[G + 10], A, 4293915773);
                P = d(P, N, K, Q, v[G + 1], y, 2240044497);
                Q = d(Q, P, N, K, v[G + 8], E, 1873313359);
                K = d(K, Q, P, N, v[G + 15], C, 4264355552);
                N = d(N, K, Q, P, v[G + 6], A, 2734768916);
                P = d(P, N, K, Q, v[G + 13], y, 1309151649);
                Q = d(Q, P, N, K, v[G + 4], E, 4149444226);
                K = d(K, Q, P, N, v[G + 11], C, 3174756917);
                N = d(N, K, Q, P, v[G + 2], A, 718787259);
                P = d(P, N, K, Q, v[G + 9], y, 3951481745);
                Q = a(Q, H);
                P = a(P, p);
                N = a(N, u);
                K = a(K, F)
            }
            var M = b(Q) + b(P) + b(N) + b(K);
            return M.toLowerCase()
        }
    })
}
)(jQuery);
