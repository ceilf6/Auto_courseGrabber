// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS

/**
 * @license jqGrid  4.6.0 - jQuery Grid
 * Copyright (c) 2008, Tony Tomov, tony@trirand.com
 * Dual licensed under the MIT and GPL licenses
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl-2.0.html
 * Date: 2014-02-20
 */
//jsHint options
/*jshint evil:true, eqeqeq:false, eqnull:true, devel:true */
/*global jQuery */
/*修改过的jqgrid */

(function($) {
    $.jgrid = $.jgrid || {};
    $.extend($.jgrid, {
        version: "4.6.0",
        htmlDecode: function(value) {
            if (value && (value === "&nbsp;" || value === "&#160;" || (value.length === 1 && value.charCodeAt(0) === 160))) {
                return ""
            }
            return !value ? value : String(value).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&")
        },
        htmlEncode: function(value) {
            return !value ? value : String(value).replace(/&/g, "&amp;").replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        },
        format: function(format) {
            var args = $.makeArray(arguments).slice(1);
            if (format == null) {
                format = ""
            }
            return format.replace(/\{(\d+)\}/g, function(m, i) {
                return args[i]
            })
        },
        msie: navigator.appName === "Microsoft Internet Explorer",
        msiever: function() {
            var rv = -1;
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
            if (re.exec(ua) != null) {
                rv = parseFloat(RegExp.$1)
            }
            return rv
        },
        getCellIndex: function(cell) {
            var c = $(cell);
            if (c.is("tr")) {
                return -1
            }
            c = (!c.is("td") && !c.is("th") ? c.closest("td,th") : c)[0];
            if ($.jgrid.msie) {
                return $.inArray(c, c.parentNode.cells)
            }
            return c.cellIndex
        },
        stripHtml: function(v) {
            v = String(v);
            var regexp = /<("[^"]*"|'[^']*'|[^'">])*>/gi;
            if (v) {
                v = v.replace(regexp, "");
                return (v && v !== "&nbsp;" && v !== "&#160;") ? v.replace(/\"/g, "'") : ""
            }
            return v
        },
        stripPref: function(pref, id) {
            var obj = $.type(pref);
            if (obj === "string" || obj === "number") {
                pref = String(pref);
                id = pref !== "" ? String(id).replace(String(pref), "") : id
            }
            return id
        },
        parse: function(jsonString) {
            var js = jsonString;
            if (js.substr(0, 9) === "while(1);") {
                js = js.substr(9)
            }
            if (js.substr(0, 2) === "/*") {
                js = js.substr(2, js.length - 4)
            }
            if (!js) {
                js = "{}"
            }
            return ($.jgrid.useJSON === true && typeof JSON === "object" && typeof JSON.parse === "function") ? JSON.parse(js) : eval("(" + js + ")")
        },
        parseDate: function(format, date, newformat, opts) {
            var token = /\\.|[dDjlNSwzWFmMntLoYyaABgGhHisueIOPTZcrU]/g, timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g, timezoneClip = /[^-+\dA-Z]/g, msDateRegExp = new RegExp("^/Date\\((([-+])?[0-9]+)(([-+])([0-9]{2})([0-9]{2}))?\\)/$"), msMatch = ((typeof date === "string") ? date.match(msDateRegExp) : null), pad = function(value, length) {
                value = String(value);
                length = parseInt(length, 10) || 2;
                while (value.length < length) {
                    value = "0" + value
                }
                return value
            }, ts = {
                m: 1,
                d: 1,
                y: 1970,
                h: 0,
                i: 0,
                s: 0,
                u: 0
            }, timestamp = 0, dM, k, hl, h12to24 = function(ampm, h) {
                if (ampm === 0) {
                    if (h === 12) {
                        h = 0
                    }
                } else {
                    if (h !== 12) {
                        h += 12
                    }
                }
                return h
            };
            if (opts === undefined) {
                opts = $.jgrid.formatter.date
            }
            if (opts.parseRe === undefined) {
                opts.parseRe = /[#%\\\/:_;.,\t\s-]/
            }
            if (opts.masks.hasOwnProperty(format)) {
                format = opts.masks[format]
            }
            if (date && date != null) {
                if (!isNaN(date - 0) && String(format).toLowerCase() === "u") {
                    timestamp = new Date(parseFloat(date) * 1000)
                } else {
                    if (date.constructor === Date) {
                        timestamp = date
                    } else {
                        if (msMatch !== null) {
                            timestamp = new Date(parseInt(msMatch[1], 10));
                            if (msMatch[3]) {
                                var offset = Number(msMatch[5]) * 60 + Number(msMatch[6]);
                                offset *= ((msMatch[4] === "-") ? 1 : -1);
                                offset -= timestamp.getTimezoneOffset();
                                timestamp.setTime(Number(Number(timestamp) + (offset * 60 * 1000)))
                            }
                        } else {
                            var offset = 0;
                            if (opts.srcformat === "ISO8601Long" && date.charAt(date.length - 1) === "Z") {
                                offset -= (new Date()).getTimezoneOffset()
                            }
                            date = String(date).replace(/\T/g, "#").replace(/\t/, "%").split(opts.parseRe);
                            format = format.replace(/\T/g, "#").replace(/\t/, "%").split(opts.parseRe);
                            for (k = 0,
                            hl = format.length; k < hl; k++) {
                                if (format[k] === "M") {
                                    dM = $.inArray(date[k], opts.monthNames);
                                    if (dM !== -1 && dM < 12) {
                                        date[k] = dM + 1;
                                        ts.m = date[k]
                                    }
                                }
                                if (format[k] === "F") {
                                    dM = $.inArray(date[k], opts.monthNames, 12);
                                    if (dM !== -1 && dM > 11) {
                                        date[k] = dM + 1 - 12;
                                        ts.m = date[k]
                                    }
                                }
                                if (format[k] === "a") {
                                    dM = $.inArray(date[k], opts.AmPm);
                                    if (dM !== -1 && dM < 2 && date[k] === opts.AmPm[dM]) {
                                        date[k] = dM;
                                        ts.h = h12to24(date[k], ts.h)
                                    }
                                }
                                if (format[k] === "A") {
                                    dM = $.inArray(date[k], opts.AmPm);
                                    if (dM !== -1 && dM > 1 && date[k] === opts.AmPm[dM]) {
                                        date[k] = dM - 2;
                                        ts.h = h12to24(date[k], ts.h)
                                    }
                                }
                                if (format[k] === "g") {
                                    ts.h = parseInt(date[k], 10)
                                }
                                if (date[k] !== undefined) {
                                    ts[format[k].toLowerCase()] = parseInt(date[k], 10)
                                }
                            }
                            if (ts.f) {
                                ts.m = ts.f
                            }
                            if (ts.m === 0 && ts.y === 0 && ts.d === 0) {
                                return "&#160;"
                            }
                            ts.m = parseInt(ts.m, 10) - 1;
                            var ty = ts.y;
                            if (ty >= 70 && ty <= 99) {
                                ts.y = 1900 + ts.y
                            } else {
                                if (ty >= 0 && ty <= 69) {
                                    ts.y = 2000 + ts.y
                                }
                            }
                            timestamp = new Date(ts.y,ts.m,ts.d,ts.h,ts.i,ts.s,ts.u);
                            if (offset > 0) {
                                timestamp.setTime(Number(Number(timestamp) + (offset * 60 * 1000)))
                            }
                        }
                    }
                }
            } else {
                timestamp = new Date(ts.y,ts.m,ts.d,ts.h,ts.i,ts.s,ts.u)
            }
            if (newformat === undefined) {
                return timestamp
            }
            if (opts.masks.hasOwnProperty(newformat)) {
                newformat = opts.masks[newformat]
            } else {
                if (!newformat) {
                    newformat = "Y-m-d"
                }
            }
            var G = timestamp.getHours()
              , i = timestamp.getMinutes()
              , j = timestamp.getDate()
              , n = timestamp.getMonth() + 1
              , o = timestamp.getTimezoneOffset()
              , s = timestamp.getSeconds()
              , u = timestamp.getMilliseconds()
              , w = timestamp.getDay()
              , Y = timestamp.getFullYear()
              , N = (w + 6) % 7 + 1
              , z = (new Date(Y,n - 1,j) - new Date(Y,0,1)) / 86400000
              , flags = {
                d: pad(j),
                D: opts.dayNames[w],
                j: j,
                l: opts.dayNames[w + 7],
                N: N,
                S: opts.S(j),
                w: w,
                z: z,
                W: N < 5 ? Math.floor((z + N - 1) / 7) + 1 : Math.floor((z + N - 1) / 7) || ((new Date(Y - 1,0,1).getDay() + 6) % 7 < 4 ? 53 : 52),
                F: opts.monthNames[n - 1 + 12],
                m: pad(n),
                M: opts.monthNames[n - 1],
                n: n,
                t: "?",
                L: "?",
                o: "?",
                Y: Y,
                y: String(Y).substring(2),
                a: G < 12 ? opts.AmPm[0] : opts.AmPm[1],
                A: G < 12 ? opts.AmPm[2] : opts.AmPm[3],
                B: "?",
                g: G % 12 || 12,
                G: G,
                h: pad(G % 12 || 12),
                H: pad(G),
                i: pad(i),
                s: pad(s),
                u: u,
                e: "?",
                I: "?",
                O: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                P: "?",
                T: (String(timestamp).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                Z: "?",
                c: "?",
                r: "?",
                U: Math.floor(timestamp / 1000)
            };
            return newformat.replace(token, function($0) {
                return flags.hasOwnProperty($0) ? flags[$0] : $0.substring(1)
            })
        },
        jqID: function(sid) {
            return String(sid).replace(/[!"#$%&'()*+,.\/:; <=>?@\[\\\]\^`{|}~]/g, "\\$&")
        },
        guid: 1,
        uidPref: "jqg",
        randId: function(prefix) {
            return (prefix || $.jgrid.uidPref) + ($.jgrid.guid++)
        },
        getAccessor: function(obj, expr) {
            var ret, p, prm = [], i;
            if (typeof expr === "function") {
                return expr(obj)
            }
            ret = obj[expr];
            if (ret === undefined) {
                try {
                    if (typeof expr === "string") {
                        prm = expr.split(".")
                    }
                    i = prm.length;
                    if (i) {
                        ret = obj;
                        while (ret && i--) {
                            p = prm.shift();
                            ret = ret[p]
                        }
                    }
                } catch (e) {}
            }
            return ret
        },
        getXmlData: function(obj, expr, returnObj) {
            var ret, m = typeof expr === "string" ? expr.match(/^(.*)\[(\w+)\]$/) : null;
            if (typeof expr === "function") {
                return expr(obj)
            }
            if (m && m[2]) {
                return m[1] ? $(m[1], obj).attr(m[2]) : $(obj).attr(m[2])
            }
            ret = $(expr, obj);
            if (returnObj) {
                return ret
            }
            return ret.length > 0 ? $(ret).text() : undefined
        },
        cellWidth: function() {
            var $testDiv = $("<div class='ui-jqgrid' style='left:10000px'><table class='ui-jqgrid-btable' style='width:5px;'><tr class='jqgrow'><td style='width:5px;display:block;'></td></tr></table></div>")
              , testCell = $testDiv.appendTo("body").find("td").width();
            $testDiv.remove();
            return Math.abs(testCell - 5) > 0.1
        },
        cell_width: true,
        ajaxOptions: {},
        from: function(source) {
            var QueryObject = function(d, q) {
                if (typeof d === "string") {
                    d = $.data(d)
                }
                var self = this
                  , _data = d
                  , _usecase = true
                  , _trim = false
                  , _query = q
                  , _stripNum = /[\$,%]/g
                  , _lastCommand = null
                  , _lastField = null
                  , _orDepth = 0
                  , _negate = false
                  , _queuedOperator = ""
                  , _sorting = []
                  , _useProperties = true;
                if (typeof d === "object" && d.push) {
                    if (d.length > 0) {
                        if (typeof d[0] !== "object") {
                            _useProperties = false
                        } else {
                            _useProperties = true
                        }
                    }
                } else {
                    throw "data provides is not an array"
                }
                this._hasData = function() {
                    return _data === null ? false : _data.length === 0 ? false : true
                }
                ;
                this._getStr = function(s) {
                    var phrase = [];
                    if (_trim) {
                        phrase.push("jQuery.trim(")
                    }
                    phrase.push("String(" + s + ")");
                    if (_trim) {
                        phrase.push(")")
                    }
                    if (!_usecase) {
                        phrase.push(".toLowerCase()")
                    }
                    return phrase.join("")
                }
                ;
                this._strComp = function(val) {
                    if (typeof val === "string") {
                        return ".toString()"
                    }
                    return ""
                }
                ;
                this._group = function(f, u) {
                    return ({
                        field: f.toString(),
                        unique: u,
                        items: []
                    })
                }
                ;
                this._toStr = function(phrase) {
                    if (_trim) {
                        phrase = $.trim(phrase)
                    }
                    phrase = phrase.toString().replace(/\\/g, "\\\\").replace(/\"/g, '\\"');
                    return _usecase ? phrase : phrase.toLowerCase()
                }
                ;
                this._funcLoop = function(func) {
                    var results = [];
                    $.each(_data, function(i, v) {
                        results.push(func(v))
                    });
                    return results
                }
                ;
                this._append = function(s) {
                    var i;
                    if (_query === null) {
                        _query = ""
                    } else {
                        _query += _queuedOperator === "" ? " && " : _queuedOperator
                    }
                    for (i = 0; i < _orDepth; i++) {
                        _query += "("
                    }
                    if (_negate) {
                        _query += "!"
                    }
                    _query += "(" + s + ")";
                    _negate = false;
                    _queuedOperator = "";
                    _orDepth = 0
                }
                ;
                this._setCommand = function(f, c) {
                    _lastCommand = f;
                    _lastField = c
                }
                ;
                this._resetNegate = function() {
                    _negate = false
                }
                ;
                this._repeatCommand = function(f, v) {
                    if (_lastCommand === null) {
                        return self
                    }
                    if (f !== null && v !== null) {
                        return _lastCommand(f, v)
                    }
                    if (_lastField === null) {
                        return _lastCommand(f)
                    }
                    if (!_useProperties) {
                        return _lastCommand(f)
                    }
                    return _lastCommand(_lastField, f)
                }
                ;
                this._equals = function(a, b) {
                    return (self._compare(a, b, 1) === 0)
                }
                ;
                this._compare = function(a, b, d) {
                    var toString = Object.prototype.toString;
                    if (d === undefined) {
                        d = 1
                    }
                    if (a === undefined) {
                        a = null
                    }
                    if (b === undefined) {
                        b = null
                    }
                    if (a === null && b === null) {
                        return 0
                    }
                    if (a === null && b !== null) {
                        return 1
                    }
                    if (a !== null && b === null) {
                        return -1
                    }
                    if (toString.call(a) === "[object Date]" && toString.call(b) === "[object Date]") {
                        if (a < b) {
                            return -d
                        }
                        if (a > b) {
                            return d
                        }
                        return 0
                    }
                    if (!_usecase && typeof a !== "number" && typeof b !== "number") {
                        a = String(a);
                        b = String(b)
                    }
                    if (a < b) {
                        return -d
                    }
                    if (a > b) {
                        return d
                    }
                    return 0
                }
                ;
                this._performSort = function() {
                    if (_sorting.length === 0) {
                        return
                    }
                    _data = self._doSort(_data, 0)
                }
                ;
                this._doSort = function(d, q) {
                    var by = _sorting[q].by
                      , dir = _sorting[q].dir
                      , type = _sorting[q].type
                      , dfmt = _sorting[q].datefmt
                      , sfunc = _sorting[q].sfunc;
                    if (q === _sorting.length - 1) {
                        return self._getOrder(d, by, dir, type, dfmt, sfunc)
                    }
                    q++;
                    var values = self._getGroup(d, by, dir, type, dfmt), results = [], i, j, sorted;
                    for (i = 0; i < values.length; i++) {
                        sorted = self._doSort(values[i].items, q);
                        for (j = 0; j < sorted.length; j++) {
                            results.push(sorted[j])
                        }
                    }
                    return results
                }
                ;
                this._getOrder = function(data, by, dir, type, dfmt, sfunc) {
                    var sortData = [], _sortData = [], newDir = dir === "a" ? 1 : -1, i, ab, j, findSortKey;
                    if (type === undefined) {
                        type = "text"
                    }
                    if (type === "float" || type === "number" || type === "currency" || type === "numeric") {
                        findSortKey = function($cell) {
                            var key = parseFloat(String($cell).replace(_stripNum, ""));
                            return isNaN(key) ? 0 : key
                        }
                    } else {
                        if (type === "int" || type === "integer") {
                            findSortKey = function($cell) {
                                return $cell ? parseFloat(String($cell).replace(_stripNum, "")) : 0
                            }
                        } else {
                            if (type === "date" || type === "datetime") {
                                findSortKey = function($cell) {
                                    return $.jgrid.parseDate(dfmt, $cell).getTime()
                                }
                            } else {
                                if ($.isFunction(type)) {
                                    findSortKey = type
                                } else {
                                    findSortKey = function($cell) {
                                        $cell = $cell ? $.trim(String($cell)) : "";
                                        return _usecase ? $cell : $cell.toLowerCase()
                                    }
                                }
                            }
                        }
                    }
                    $.each(data, function(i, v) {
                        ab = by !== "" ? $.jgrid.getAccessor(v, by) : v;
                        if (ab === undefined) {
                            ab = ""
                        }
                        ab = findSortKey(ab, v);
                        _sortData.push({
                            vSort: ab,
                            index: i
                        })
                    });
                    if ($.isFunction(sfunc)) {
                        _sortData.sort(function(a, b) {
                            a = a.vSort;
                            b = b.vSort;
                            return sfunc.call(this, a, b, newDir)
                        })
                    } else {
                        _sortData.sort(function(a, b) {
                            a = a.vSort;
                            b = b.vSort;
                            return self._compare(a, b, newDir)
                        })
                    }
                    j = 0;
                    var nrec = data.length;
                    while (j < nrec) {
                        i = _sortData[j].index;
                        sortData.push(data[i]);
                        j++
                    }
                    return sortData
                }
                ;
                this._getGroup = function(data, by, dir, type, dfmt) {
                    var results = [], group = null, last = null, val;
                    $.each(self._getOrder(data, by, dir, type, dfmt), function(i, v) {
                        val = $.jgrid.getAccessor(v, by);
                        if (val == null) {
                            val = ""
                        }
                        if (!self._equals(last, val)) {
                            last = val;
                            if (group !== null) {
                                results.push(group)
                            }
                            group = self._group(by, val)
                        }
                        group.items.push(v)
                    });
                    if (group !== null) {
                        results.push(group)
                    }
                    return results
                }
                ;
                this.ignoreCase = function() {
                    _usecase = false;
                    return self
                }
                ;
                this.useCase = function() {
                    _usecase = true;
                    return self
                }
                ;
                this.trim = function() {
                    _trim = true;
                    return self
                }
                ;
                this.noTrim = function() {
                    _trim = false;
                    return self
                }
                ;
                this.execute = function() {
                    var match = _query
                      , results = [];
                    if (match === null) {
                        return self
                    }
                    $.each(_data, function() {
                        if (eval(match)) {
                            results.push(this)
                        }
                    });
                    _data = results;
                    return self
                }
                ;
                this.data = function() {
                    return _data
                }
                ;
                this.select = function(f) {
                    self._performSort();
                    if (!self._hasData()) {
                        return []
                    }
                    self.execute();
                    if ($.isFunction(f)) {
                        var results = [];
                        $.each(_data, function(i, v) {
                            results.push(f(v))
                        });
                        return results
                    }
                    return _data
                }
                ;
                this.hasMatch = function() {
                    if (!self._hasData()) {
                        return false
                    }
                    self.execute();
                    return _data.length > 0
                }
                ;
                this.andNot = function(f, v, x) {
                    _negate = !_negate;
                    return self.and(f, v, x)
                }
                ;
                this.orNot = function(f, v, x) {
                    _negate = !_negate;
                    return self.or(f, v, x)
                }
                ;
                this.not = function(f, v, x) {
                    return self.andNot(f, v, x)
                }
                ;
                this.and = function(f, v, x) {
                    _queuedOperator = " && ";
                    if (f === undefined) {
                        return self
                    }
                    return self._repeatCommand(f, v, x)
                }
                ;
                this.or = function(f, v, x) {
                    _queuedOperator = " || ";
                    if (f === undefined) {
                        return self
                    }
                    return self._repeatCommand(f, v, x)
                }
                ;
                this.orBegin = function() {
                    _orDepth++;
                    return self
                }
                ;
                this.orEnd = function() {
                    if (_query !== null) {
                        _query += ")"
                    }
                    return self
                }
                ;
                this.isNot = function(f) {
                    _negate = !_negate;
                    return self.is(f)
                }
                ;
                this.is = function(f) {
                    self._append("this." + f);
                    self._resetNegate();
                    return self
                }
                ;
                this._compareValues = function(func, f, v, how, t) {
                    var fld;
                    if (_useProperties) {
                        fld = "jQuery.jgrid.getAccessor(this,'" + f + "')"
                    } else {
                        fld = "this"
                    }
                    if (v === undefined) {
                        v = null
                    }
                    var val = v
                      , swst = t.stype === undefined ? "text" : t.stype;
                    if (v !== null) {
                        switch (swst) {
                        case "int":
                        case "integer":
                            val = (isNaN(Number(val)) || val === "") ? "0" : val;
                            fld = "parseInt(" + fld + ",10)";
                            val = "parseInt(" + val + ",10)";
                            break;
                        case "float":
                        case "number":
                        case "numeric":
                            val = String(val).replace(_stripNum, "");
                            val = (isNaN(Number(val)) || val === "") ? "0" : val;
                            fld = "parseFloat(" + fld + ")";
                            val = "parseFloat(" + val + ")";
                            break;
                        case "date":
                        case "datetime":
                            val = String($.jgrid.parseDate(t.newfmt || "Y-m-d", val).getTime());
                            fld = 'jQuery.jgrid.parseDate("' + t.srcfmt + '",' + fld + ").getTime()";
                            break;
                        default:
                            fld = self._getStr(fld);
                            val = self._getStr('"' + self._toStr(val) + '"')
                        }
                    }
                    self._append(fld + " " + how + " " + val);
                    self._setCommand(func, f);
                    self._resetNegate();
                    return self
                }
                ;
                this.equals = function(f, v, t) {
                    return self._compareValues(self.equals, f, v, "==", t)
                }
                ;
                this.notEquals = function(f, v, t) {
                    return self._compareValues(self.equals, f, v, "!==", t)
                }
                ;
                this.isNull = function(f, v, t) {
                    return self._compareValues(self.equals, f, null, "===", t)
                }
                ;
                this.greater = function(f, v, t) {
                    return self._compareValues(self.greater, f, v, ">", t)
                }
                ;
                this.less = function(f, v, t) {
                    return self._compareValues(self.less, f, v, "<", t)
                }
                ;
                this.greaterOrEquals = function(f, v, t) {
                    return self._compareValues(self.greaterOrEquals, f, v, ">=", t)
                }
                ;
                this.lessOrEquals = function(f, v, t) {
                    return self._compareValues(self.lessOrEquals, f, v, "<=", t)
                }
                ;
                this.startsWith = function(f, v) {
                    var val = (v == null) ? f : v
                      , length = _trim ? $.trim(val.toString()).length : val.toString().length;
                    if (_useProperties) {
                        self._append(self._getStr("jQuery.jgrid.getAccessor(this,'" + f + "')") + ".substr(0," + length + ") == " + self._getStr('"' + self._toStr(v) + '"'))
                    } else {
                        if (v != null) {
                            length = _trim ? $.trim(v.toString()).length : v.toString().length
                        }
                        self._append(self._getStr("this") + ".substr(0," + length + ") == " + self._getStr('"' + self._toStr(f) + '"'))
                    }
                    self._setCommand(self.startsWith, f);
                    self._resetNegate();
                    return self
                }
                ;
                this.endsWith = function(f, v) {
                    var val = (v == null) ? f : v
                      , length = _trim ? $.trim(val.toString()).length : val.toString().length;
                    if (_useProperties) {
                        self._append(self._getStr("jQuery.jgrid.getAccessor(this,'" + f + "')") + ".substr(" + self._getStr("jQuery.jgrid.getAccessor(this,'" + f + "')") + ".length-" + length + "," + length + ') == "' + self._toStr(v) + '"')
                    } else {
                        self._append(self._getStr("this") + ".substr(" + self._getStr("this") + '.length-"' + self._toStr(f) + '".length,"' + self._toStr(f) + '".length) == "' + self._toStr(f) + '"')
                    }
                    self._setCommand(self.endsWith, f);
                    self._resetNegate();
                    return self
                }
                ;
                this.contains = function(f, v) {
                    if (_useProperties) {
                        self._append(self._getStr("jQuery.jgrid.getAccessor(this,'" + f + "')") + '.indexOf("' + self._toStr(v) + '",0) > -1')
                    } else {
                        self._append(self._getStr("this") + '.indexOf("' + self._toStr(f) + '",0) > -1')
                    }
                    self._setCommand(self.contains, f);
                    self._resetNegate();
                    return self
                }
                ;
                this.groupBy = function(by, dir, type, datefmt) {
                    if (!self._hasData()) {
                        return null
                    }
                    return self._getGroup(_data, by, dir, type, datefmt)
                }
                ;
                this.orderBy = function(by, dir, stype, dfmt, sfunc) {
                    dir = dir == null ? "a" : $.trim(dir.toString().toLowerCase());
                    if (stype == null) {
                        stype = "text"
                    }
                    if (dfmt == null) {
                        dfmt = "Y-m-d"
                    }
                    if (sfunc == null) {
                        sfunc = false
                    }
                    if (dir === "desc" || dir === "descending") {
                        dir = "d"
                    }
                    if (dir === "asc" || dir === "ascending") {
                        dir = "a"
                    }
                    _sorting.push({
                        by: by,
                        dir: dir,
                        type: stype,
                        datefmt: dfmt,
                        sfunc: sfunc
                    });
                    return self
                }
                ;
                return self
            };
            return new QueryObject(source,null)
        },
        getMethod: function(name) {
            return this.getAccessor($.fn.jqGrid, name)
        },
        extend: function(methods) {
            $.extend($.fn.jqGrid, methods);
            if (!this.no_legacy_api) {
                $.fn.extend(methods)
            }
        }
    });
    $.fn.jqGrid = function(pin) {
        if (typeof pin === "string") {
            var fn = $.jgrid.getMethod(pin);
            if (!fn) {
                throw ("jqGrid - No such method: " + pin)
            }
            var args = $.makeArray(arguments).slice(1);
            return fn.apply(this, args)
        }
        return this.each(function() {
            if (this.grid) {
                return
            }
            var p = $.extend(true, {
                url: "",
                height: 150,
                page: 1,
                rowNum: 20,
                rowTotal: null,
                records: 0,
                pager: "",
                pgbuttons: true,
                pginput: true,
                colModel: [],
                rowList: [],
                colNames: [],
                sortorder: "asc",
                sortname: "",
                datatype: "xml",
                mtype: "GET",
                altRows: false,
                selarrrow: [],
                savedRow: [],
                shrinkToFit: true,
                xmlReader: {},
                jsonReader: {},
                subGrid: false,
                subGridModel: [],
                reccount: 0,
                lastpage: 0,
                lastsort: 0,
                selrow: null,
                beforeSelectRow: null,
                onSelectRow: null,
                onSortCol: null,
                ondblClickRow: null,
                onRightClickRow: null,
                onPaging: null,
                onSelectAll: null,
                onInitGrid: null,
                loadComplete: null,
                gridComplete: null,
                loadError: null,
                loadBeforeSend: null,
                afterInsertRow: null,
                beforeRequest: null,
                beforeProcessing: null,
                onHeaderClick: null,
                viewrecords: false,
                loadonce: false,
                multiselect: false,
                multikey: false,
                editurl: null,
                search: false,
                caption: "",
                hidegrid: true,
                hiddengrid: false,
                postData: {},
                userData: {},
                treeGrid: false,
                treeGridModel: "nested",
                treeReader: {},
                treeANode: -1,
                ExpandColumn: null,
                tree_root_level: 0,
                prmNames: {
                    page: "page",
                    rows: "rows",
                    sort: "sidx",
                    order: "sord",
                    search: "_search",
                    nd: "nd",
                    id: "id",
                    oper: "oper",
                    editoper: "edit",
                    addoper: "add",
                    deloper: "del",
                    subgridid: "id",
                    npage: null,
                    totalrows: "totalrows"
                },
                forceFit: false,
                gridstate: "visible",
                cellEdit: false,
                cellsubmit: "remote",
                nv: 0,
                loadui: "enable",
                toolbar: [false, ""],
                scroll: false,
                multiboxonly: false,
                deselectAfterSort: true,
                scrollrows: false,
                autowidth: false,
                scrollOffset: 18,
                cellLayout: 5,
                subGridWidth: 20,
                multiselectWidth: 20,
                gridview: false,
                rownumWidth: 25,
                rownumbers: false,
                pagerpos: "center",
                recordpos: "right",
                footerrow: false,
                userDataOnFooter: false,
                hoverrows: true,
                altclass: "ui-priority-secondary",
                viewsortcols: [false, "vertical", true],
                resizeclass: "",
                autoencode: false,
                remapColumns: [],
                sortableColumnsDone: null,
                ajaxGridOptions: {},
                direction: "ltr",
                toppager: false,
                headertitles: false,
                scrollTimeout: 40,
                data: [],
                _index: {},
                grouping: false,
                groupingView: {
                    groupField: [],
                    groupOrder: [],
                    groupText: [],
                    groupColumnShow: [],
                    groupSummary: [],
                    showSummaryOnHide: false,
                    sortitems: [],
                    sortnames: [],
                    summary: [],
                    summaryval: [],
                    plusicon: "ui-icon-circlesmall-plus",
                    minusicon: "ui-icon-circlesmall-minus",
                    displayField: [],
                    groupSummaryPos: [],
                    formatDisplayField: [],
                    _locgr: false
                },
                ignoreCase: false,
                cmTemplate: {},
                idPrefix: "",
                multiSort: false,
                fixscrollBar: true
            }, $.jgrid.defaults, pin || {});
            var ts = this
              , grid = {
                headers: [],
                cols: [],
                footers: [],
                dragStart: function(i, x, y) {
                    var gridLeftPos = $(this.bDiv).offset().left;
                    this.resizing = {
                        idx: i,
                        startX: x.clientX,
                        sOL: x.clientX - gridLeftPos
                    };
                    this.hDiv.style.cursor = "col-resize";
                    this.curGbox = $("#rs_m" + $.jgrid.jqID(p.id), "#gbox_" + $.jgrid.jqID(p.id));
                    this.curGbox.css({
                        display: "block",
                        left: x.clientX - gridLeftPos,
                        top: y[1],
                        height: y[2]
                    });
                    $(ts).triggerHandler("jqGridResizeStart", [x, i]);
                    if ($.isFunction(p.resizeStart)) {
                        p.resizeStart.call(ts, x, i)
                    }
                    document.onselectstart = function() {
                        return false
                    }
                },
                dragMove: function(x) {
                    if (this.resizing) {
                        var diff = x.clientX - this.resizing.startX, h = this.headers[this.resizing.idx], newWidth = p.direction === "ltr" ? h.width + diff : h.width - diff, hn, nWn;
                        if (newWidth > 33) {
                            this.curGbox.css({
                                left: this.resizing.sOL + diff
                            });
                            if (p.forceFit === true) {
                                hn = this.headers[this.resizing.idx + p.nv];
                                nWn = p.direction === "ltr" ? hn.width - diff : hn.width + diff;
                                if (nWn > 33) {
                                    h.newWidth = newWidth;
                                    hn.newWidth = nWn
                                }
                            } else {
                                this.newWidth = p.direction === "ltr" ? p.tblwidth + diff : p.tblwidth - diff;
                                h.newWidth = newWidth
                            }
                        }
                    }
                },
                dragEnd: function() {
                    this.hDiv.style.cursor = "default";
                    if (this.resizing) {
                        var idx = this.resizing.idx
                          , nw = this.headers[idx].newWidth || this.headers[idx].width;
                        nw = parseInt(nw, 10);
                        this.resizing = false;
                        $("#rs_m" + $.jgrid.jqID(p.id)).css("display", "none");
                        p.colModel[idx].width = nw;
                        this.headers[idx].width = nw;
                        this.headers[idx].el.style.width = nw + "px";
                        this.cols[idx].style.width = nw + "px";
                        if (this.footers.length > 0) {
                            this.footers[idx].style.width = nw + "px"
                        }
                        if (p.forceFit === true) {
                            nw = this.headers[idx + p.nv].newWidth || this.headers[idx + p.nv].width;
                            this.headers[idx + p.nv].width = nw;
                            this.headers[idx + p.nv].el.style.width = nw + "px";
                            this.cols[idx + p.nv].style.width = nw + "px";
                            if (this.footers.length > 0) {
                                this.footers[idx + p.nv].style.width = nw + "px"
                            }
                            p.colModel[idx + p.nv].width = nw
                        } else {
                            p.tblwidth = this.newWidth || p.tblwidth;
                            $("table:first", this.bDiv).css("width", p.tblwidth + "px");
                            $("table:first", this.hDiv).css("width", p.tblwidth + "px");
                            this.hDiv.scrollLeft = this.bDiv.scrollLeft;
                            if (p.footerrow) {
                                $("table:first", this.sDiv).css("width", p.tblwidth + "px");
                                this.sDiv.scrollLeft = this.bDiv.scrollLeft
                            }
                        }
                        $(ts).triggerHandler("jqGridResizeStop", [nw, idx]);
                        if ($.isFunction(p.resizeStop)) {
                            p.resizeStop.call(ts, nw, idx)
                        }
                    }
                    this.curGbox = null;
                    document.onselectstart = function() {
                        return true
                    }
                },
                populateVisible: function() {
                    if (grid.timer) {
                        clearTimeout(grid.timer)
                    }
                    grid.timer = null;
                    var dh = $(grid.bDiv).height();
                    if (!dh) {
                        return
                    }
                    var table = $("table:first", grid.bDiv);
                    var rows, rh;
                    if (table[0].rows.length) {
                        try {
                            rows = table[0].rows[1];
                            rh = rows ? $(rows).outerHeight() || grid.prevRowHeight : grid.prevRowHeight
                        } catch (pv) {
                            rh = grid.prevRowHeight
                        }
                    }
                    if (!rh) {
                        return
                    }
                    grid.prevRowHeight = rh;
                    var rn = p.rowNum;
                    var scrollTop = grid.scrollTop = grid.bDiv.scrollTop;
                    var ttop = Math.round(table.position().top) - scrollTop;
                    var tbot = ttop + table.height();
                    var div = rh * rn;
                    var page, npage, empty;
                    if (tbot < dh && ttop <= 0 && (p.lastpage === undefined || parseInt((tbot + scrollTop + div - 1) / div, 10) <= p.lastpage)) {
                        npage = parseInt((dh - tbot + div - 1) / div, 10);
                        if (tbot >= 0 || npage < 2 || p.scroll === true) {
                            page = Math.round((tbot + scrollTop) / div) + 1;
                            ttop = -1
                        } else {
                            ttop = 1
                        }
                    }
                    if (ttop > 0) {
                        page = parseInt(scrollTop / div, 10) + 1;
                        npage = parseInt((scrollTop + dh) / div, 10) + 2 - page;
                        empty = true
                    }
                    if (npage) {
                        if (p.lastpage && (page > p.lastpage || p.lastpage === 1 || (page === p.page && page === p.lastpage))) {
                            return
                        }
                        if (grid.hDiv.loading) {
                            grid.timer = setTimeout(grid.populateVisible, p.scrollTimeout)
                        } else {
                            p.page = page;
                            if (empty) {
                                grid.selectionPreserver(table[0]);
                                grid.emptyRows.call(table[0], false, false)
                            }
                            grid.populate(npage)
                        }
                    }
                },
                scrollGrid: function(e) {
                    if (p.scroll) {
                        var scrollTop = grid.bDiv.scrollTop;
                        if (grid.scrollTop === undefined) {
                            grid.scrollTop = 0
                        }
                        if (scrollTop !== grid.scrollTop) {
                            grid.scrollTop = scrollTop;
                            if (grid.timer) {
                                clearTimeout(grid.timer)
                            }
                            grid.timer = setTimeout(grid.populateVisible, p.scrollTimeout)
                        }
                    }
                    grid.hDiv.scrollLeft = grid.bDiv.scrollLeft;
                    if (p.footerrow) {
                        grid.sDiv.scrollLeft = grid.bDiv.scrollLeft
                    }
                    if (e) {
                        e.stopPropagation()
                    }
                },
                selectionPreserver: function(ts) {
                    var p = ts.p
                      , sr = p.selrow
                      , sra = p.selarrrow ? $.makeArray(p.selarrrow) : null
                      , left = ts.grid.bDiv.scrollLeft
                      , restoreSelection = function() {
                        var i;
                        p.selrow = null;
                        p.selarrrow = [];
                        if (p.multiselect && sra && sra.length > 0) {
                            for (i = 0; i < sra.length; i++) {
                                if (sra[i] !== sr) {
                                    $(ts).jqGrid("setSelection", sra[i], false, null)
                                }
                            }
                        }
                        if (sr) {
                            $(ts).jqGrid("setSelection", sr, false, null)
                        }
                        ts.grid.bDiv.scrollLeft = left;
                        $(ts).unbind(".selectionPreserver", restoreSelection)
                    };
                    $(ts).bind("jqGridGridComplete.selectionPreserver", restoreSelection)
                }
            };
            if (this.tagName.toUpperCase() !== "TABLE") {
                alert("Element is not a table");
                return
            }
            if (document.documentMode !== undefined) {
                if (document.documentMode <= 5) {
                    alert("Grid can not be used in this ('quirks') mode!");
                    return
                }
            }
            $(this).empty().attr("tabindex", "0");
            this.p = p;
            this.p.useProp = !!$.fn.prop;
            var i, dir;
            if (this.p.colNames.length === 0) {
                for (i = 0; i < this.p.colModel.length; i++) {
                    this.p.colNames[i] = this.p.colModel[i].label || this.p.colModel[i].name
                }
            }
            if (this.p.colNames.length !== this.p.colModel.length) {
                alert($.jgrid.errors.model);
                return
            }
            var gv = $("<div class='ui-jqgrid-view'></div>")
              , isMSIE = $.jgrid.msie;
            ts.p.direction = $.trim(ts.p.direction.toLowerCase());
            if ($.inArray(ts.p.direction, ["ltr", "rtl"]) === -1) {
                ts.p.direction = "ltr"
            }
            dir = ts.p.direction;
            $(gv).insertBefore(this);
            $(this).removeClass("scroll").appendTo(gv);
            var eg = $("<div class='ui-jqgrid ui-widget ui-widget-content ui-corner-all'></div>");
            $(eg).attr({
                id: "gbox_" + this.id,
                dir: dir
            }).insertBefore(gv);
            $(gv).attr("id", "gview_" + this.id).appendTo(eg);
            $("<div class='ui-widget-overlay jqgrid-overlay' id='lui_" + this.id + "'></div>").insertBefore(gv);
            $("<div class='loading ui-state-default ui-state-active' id='load_" + this.id + "'>" + this.p.loadtext + "</div>").insertBefore(gv);
            $(this).attr({
                cellspacing: "0",
                cellpadding: "0",
                border: "0",
                role: "grid",
                "aria-multiselectable": !!this.p.multiselect,
                "aria-labelledby": "gbox_" + this.id
            });
            var sortkeys = ["shiftKey", "altKey", "ctrlKey"]
              , intNum = function(val, defval) {
                val = parseInt(val, 10);
                if (isNaN(val)) {
                    return defval || 0
                }
                return val
            }
              , formatCol = function(pos, rowInd, tv, rawObject, rowId, rdata) {
                var cm = ts.p.colModel[pos], ral = cm.align, result = 'style="', clas = cm.classes, nm = cm.name, celp, acp = [];
                if (ral) {
                    result += "text-align:" + ral + ";"
                }
                if (cm.hidden === true) {
                    result += "display:none;"
                }
                if (rowInd === 0) {
                    result += "width: " + grid.headers[pos].width + "px;"
                } else {
                    if (cm.cellattr && $.isFunction(cm.cellattr)) {
                        celp = cm.cellattr.call(ts, rowId, tv, rawObject, cm, rdata);
                        if (celp && typeof celp === "string") {
                            celp = celp.replace(/style/i, "style").replace(/title/i, "title");
                            if (celp.indexOf("title") > -1) {
                                cm.title = false
                            }
                            if (celp.indexOf("class") > -1) {
                                clas = undefined
                            }
                            acp = celp.replace("-style", "-sti").split(/style/);
                            if (acp.length === 2) {
                                acp[1] = $.trim(acp[1].replace("-sti", "-style").replace("=", ""));
                                if (acp[1].indexOf("'") === 0 || acp[1].indexOf('"') === 0) {
                                    acp[1] = acp[1].substring(1)
                                }
                                result += acp[1].replace(/'/gi, '"')
                            } else {
                                result += '"'
                            }
                        }
                    }
                }
                if (!acp.length) {
                    acp[0] = "";
                    result += '"'
                }
                result += (clas !== undefined ? (' class="' + clas + '"') : "") + ((cm.title && tv) ? (' title="' + $.jgrid.stripHtml(tv) + '"') : "");
                result += ' aria-describedby="' + ts.p.id + "_" + nm + '"';
                return result + acp[0]
            }
              , cellVal = function(val) {
                return val == null || val === "" ? "&#160;" : (ts.p.autoencode ? $.jgrid.htmlEncode(val) : String(val))
            }
              , formatter = function(rowId, cellval, colpos, rwdat, _act) {
                var cm = ts.p.colModel[colpos], v;
                if (cm.formatter !== undefined) {
                    rowId = String(ts.p.idPrefix) !== "" ? $.jgrid.stripPref(ts.p.idPrefix, rowId) : rowId;
                    var opts = {
                        rowId: rowId,
                        colModel: cm,
                        gid: ts.p.id,
                        pos: colpos
                    };
                    if ($.isFunction(cm.formatter)) {
                        v = cm.formatter.call(ts, cellval, opts, rwdat, _act)
                    } else {
                        if ($.fmatter) {
                            v = $.fn.fmatter.call(ts, cm.formatter, cellval, opts, rwdat, _act)
                        } else {
                            v = cellVal(cellval)
                        }
                    }
                } else {
                    v = cellVal(cellval)
                }
                return v
            }
              , addCell = function(rowId, cell, pos, irow, srvr, rdata) {
                var v, prp;
                v = formatter(rowId, cell, pos, srvr, "add");
                prp = formatCol(pos, irow, v, srvr, rowId, rdata);
                return '<td role="gridcell" ' + prp + ">" + v + "</td>"
            }
              , addMulti = function(rowid, pos, irow, checked) {
                var v = '<input role="checkbox" type="checkbox" id="jqg_' + ts.p.id + "_" + rowid + '" class="cbox" name="jqg_' + ts.p.id + "_" + rowid + '"' + (checked ? 'checked="checked"' : "") + "/>"
                  , prp = formatCol(pos, irow, "", null, rowid, true);
                return '<td role="gridcell" ' + prp + ">" + v + "</td>"
            }
              , addRowNum = function(pos, irow, pG, rN) {
                var v = (parseInt(pG, 10) - 1) * parseInt(rN, 10) + 1 + irow
                  , prp = formatCol(pos, irow, v, null, irow, true);
                return '<td role="gridcell" class="ui-state-default jqgrid-rownum" ' + prp + ">" + v + "</td>"
            }
              , reader = function(datatype) {
                var field, f = [], j = 0, i;
                for (i = 0; i < ts.p.colModel.length; i++) {
                    field = ts.p.colModel[i];
                    if (field.name !== "cb" && field.name !== "subgrid" && field.name !== "rn") {
                        f[j] = datatype === "local" ? field.name : ((datatype === "xml" || datatype === "xmlstring") ? field.xmlmap || field.name : field.jsonmap || field.name);
                        if (ts.p.keyIndex !== false && field.key === true) {
                            ts.p.keyName = f[j]
                        }
                        j++
                    }
                }
                return f
            }
              , orderedCols = function(offset) {
                var order = ts.p.remapColumns;
                if (!order || !order.length) {
                    order = $.map(ts.p.colModel, function(v, i) {
                        return i
                    })
                }
                if (offset) {
                    order = $.map(order, function(v) {
                        return v < offset ? null : v - offset
                    })
                }
                return order
            }
              , emptyRows = function(scroll, locdata) {
                var firstrow;
                if (this.p.deepempty) {
                    $(this.rows).slice(1).remove()
                } else {
                    firstrow = this.rows.length > 0 ? this.rows[0] : null;
                    $(this.firstChild).empty().append(firstrow)
                }
                if (scroll && this.p.scroll) {
                    $(this.grid.bDiv.firstChild).css({
                        height: "auto"
                    });
                    $(this.grid.bDiv.firstChild.firstChild).css({
                        height: 0,
                        display: "none"
                    });
                    if (this.grid.bDiv.scrollTop !== 0) {
                        this.grid.bDiv.scrollTop = 0
                    }
                }
                if (locdata === true && this.p.treeGrid) {
                    this.p.data = [];
                    this.p._index = {}
                }
            }
              , refreshIndex = function() {
                var datalen = ts.p.data.length, idname, i, val, ni = ts.p.rownumbers === true ? 1 : 0, gi = ts.p.multiselect === true ? 1 : 0, si = ts.p.subGrid === true ? 1 : 0;
                if (ts.p.keyIndex === false || ts.p.loadonce === true) {
                    idname = ts.p.localReader.id
                } else {
                    idname = ts.p.colModel[ts.p.keyIndex + gi + si + ni].name
                }
                for (i = 0; i < datalen; i++) {
                    val = $.jgrid.getAccessor(ts.p.data[i], idname);
                    if (val === undefined) {
                        val = String(i + 1)
                    }
                    ts.p._index[val] = i
                }
            }
              , constructTr = function(id, hide, altClass, rd, cur, selected) {
                var tabindex = "-1", restAttr = "", attrName, style = hide ? "display:none;" : "", classes = "ui-widget-content jqgrow ui-row-" + ts.p.direction + (altClass ? " " + altClass : "") + (selected ? " ui-state-highlight" : ""), rowAttrObj = $(ts).triggerHandler("jqGridRowAttr", [rd, cur, id]);
                if (typeof rowAttrObj !== "object") {
                    rowAttrObj = $.isFunction(ts.p.rowattr) ? ts.p.rowattr.call(ts, rd, cur, id) : {}
                }
                if (!$.isEmptyObject(rowAttrObj)) {
                    if (rowAttrObj.hasOwnProperty("id")) {
                        id = rowAttrObj.id;
                        delete rowAttrObj.id
                    }
                    if (rowAttrObj.hasOwnProperty("tabindex")) {
                        tabindex = rowAttrObj.tabindex;
                        delete rowAttrObj.tabindex
                    }
                    if (rowAttrObj.hasOwnProperty("style")) {
                        style += rowAttrObj.style;
                        delete rowAttrObj.style
                    }
                    if (rowAttrObj.hasOwnProperty("class")) {
                        classes += " " + rowAttrObj["class"];
                        delete rowAttrObj["class"]
                    }
                    try {
                        delete rowAttrObj.role
                    } catch (ra) {}
                    for (attrName in rowAttrObj) {
                        if (rowAttrObj.hasOwnProperty(attrName)) {
                            restAttr += " " + attrName + "=" + rowAttrObj[attrName]
                        }
                    }
                }
                return '<tr role="row" id="' + id + '" tabindex="' + tabindex + '" class="' + classes + '"' + (style === "" ? "" : ' style="' + style + '"') + restAttr + ">"
            }
              , addXmlData = function(xml, t, rcnt, more, adjust) {
                var startReq = new Date()
                  , locdata = (ts.p.datatype !== "local" && ts.p.loadonce) || ts.p.datatype === "xmlstring"
                  , xmlid = "_id_"
                  , xmlRd = ts.p.xmlReader
                  , frd = ts.p.datatype === "local" ? "local" : "xml";
                if (locdata) {
                    ts.p.data = [];
                    ts.p._index = {};
                    ts.p.localReader.id = xmlid
                }
                ts.p.reccount = 0;
                if ($.isXMLDoc(xml)) {
                    if (ts.p.treeANode === -1 && !ts.p.scroll) {
                        emptyRows.call(ts, false, true);
                        rcnt = 1
                    } else {
                        rcnt = rcnt > 1 ? rcnt : 1
                    }
                } else {
                    return
                }
                var self = $(ts), i, fpos, ir = 0, v, gi = ts.p.multiselect === true ? 1 : 0, si = 0, addSubGridCell, ni = ts.p.rownumbers === true ? 1 : 0, idn, getId, f = [], F, rd = {}, xmlr, rid, rowData = [], cn = (ts.p.altRows === true) ? ts.p.altclass : "", cn1;
                if (ts.p.subGrid === true) {
                    si = 1;
                    addSubGridCell = $.jgrid.getMethod("addSubGridCell")
                }
                if (!xmlRd.repeatitems) {
                    f = reader(frd)
                }
                if (ts.p.keyIndex === false) {
                    idn = $.isFunction(xmlRd.id) ? xmlRd.id.call(ts, xml) : xmlRd.id
                } else {
                    idn = ts.p.keyIndex
                }
                if (f.length > 0 && !isNaN(idn)) {
                    idn = ts.p.keyName
                }
                if (String(idn).indexOf("[") === -1) {
                    if (f.length) {
                        getId = function(trow, k) {
                            return $(idn, trow).text() || k
                        }
                    } else {
                        getId = function(trow, k) {
                            return $(xmlRd.cell, trow).eq(idn).text() || k
                        }
                    }
                } else {
                    getId = function(trow, k) {
                        return trow.getAttribute(idn.replace(/[\[\]]/g, "")) || k
                    }
                }
                ts.p.userData = {};
                ts.p.page = intNum($.jgrid.getXmlData(xml, xmlRd.page), ts.p.page);
                ts.p.lastpage = intNum($.jgrid.getXmlData(xml, xmlRd.total), 1);
                ts.p.records = intNum($.jgrid.getXmlData(xml, xmlRd.records));
                if ($.isFunction(xmlRd.userdata)) {
                    ts.p.userData = xmlRd.userdata.call(ts, xml) || {}
                } else {
                    $.jgrid.getXmlData(xml, xmlRd.userdata, true).each(function() {
                        ts.p.userData[this.getAttribute("name")] = $(this).text()
                    })
                }
                var gxml = $.jgrid.getXmlData(xml, xmlRd.root, true);
                gxml = $.jgrid.getXmlData(gxml, xmlRd.row, true);
                if (!gxml) {
                    gxml = []
                }
                var gl = gxml.length, j = 0, grpdata = [], rn = parseInt(ts.p.rowNum, 10), br = ts.p.scroll ? $.jgrid.randId() : 1, altr;
                if (gl > 0 && ts.p.page <= 0) {
                    ts.p.page = 1
                }
                if (gxml && gl) {
                    if (adjust) {
                        rn *= adjust + 1
                    }
                    var afterInsRow = $.isFunction(ts.p.afterInsertRow), hiderow = false, groupingPrepare;
                    if (ts.p.grouping) {
                        hiderow = ts.p.groupingView.groupCollapse === true;
                        groupingPrepare = $.jgrid.getMethod("groupingPrepare")
                    }
                    while (j < gl) {
                        xmlr = gxml[j];
                        rid = getId(xmlr, br + j);
                        rid = ts.p.idPrefix + rid;
                        altr = rcnt === 0 ? 0 : rcnt + 1;
                        cn1 = (altr + j) % 2 === 1 ? cn : "";
                        var iStartTrTag = rowData.length;
                        rowData.push("");
                        if (ni) {
                            rowData.push(addRowNum(0, j, ts.p.page, ts.p.rowNum))
                        }
                        if (gi) {
                            rowData.push(addMulti(rid, ni, j, false))
                        }
                        if (si) {
                            rowData.push(addSubGridCell.call(self, gi + ni, j + rcnt))
                        }
                        if (xmlRd.repeatitems) {
                            if (!F) {
                                F = orderedCols(gi + si + ni)
                            }
                            var cells = $.jgrid.getXmlData(xmlr, xmlRd.cell, true);
                            $.each(F, function(k) {
                                var cell = cells[this];
                                if (!cell) {
                                    return false
                                }
                                v = cell.textContent || cell.text;
                                rd[ts.p.colModel[k + gi + si + ni].name] = v;
                                rowData.push(addCell(rid, v, k + gi + si + ni, j + rcnt, xmlr, rd))
                            })
                        } else {
                            for (i = 0; i < f.length; i++) {
                                v = $.jgrid.getXmlData(xmlr, f[i]);
                                rd[ts.p.colModel[i + gi + si + ni].name] = v;
                                rowData.push(addCell(rid, v, i + gi + si + ni, j + rcnt, xmlr, rd))
                            }
                        }
                        rowData[iStartTrTag] = constructTr(rid, hiderow, cn1, rd, xmlr, false);
                        rowData.push("</tr>");
                        if (ts.p.grouping) {
                            grpdata.push(rowData);
                            if (!ts.p.groupingView._locgr) {
                                groupingPrepare.call(self, rd, j)
                            }
                            rowData = []
                        }
                        if (locdata || ts.p.treeGrid === true) {
                            rd[xmlid] = $.jgrid.stripPref(ts.p.idPrefix, rid);
                            ts.p.data.push(rd);
                            ts.p._index[rd[xmlid]] = ts.p.data.length - 1
                        }
                        if (ts.p.gridview === false) {
                            $("tbody:first", t).append(rowData.join(""));
                            self.triggerHandler("jqGridAfterInsertRow", [rid, rd, xmlr]);
                            if (afterInsRow) {
                                ts.p.afterInsertRow.call(ts, rid, rd, xmlr)
                            }
                            rowData = []
                        }
                        rd = {};
                        ir++;
                        j++;
                        if (ir === rn) {
                            break
                        }
                    }
                }
                if (ts.p.gridview === true) {
                    fpos = ts.p.treeANode > -1 ? ts.p.treeANode : 0;
                    if (ts.p.grouping) {
                        if (!locdata) {
                            self.jqGrid("groupingRender", grpdata, ts.p.colModel.length, ts.p.page, rn)
                        }
                        grpdata = null
                    } else {
                        if (ts.p.treeGrid === true && fpos > 0) {
                            $(ts.rows[fpos]).after(rowData.join(""))
                        } else {
                            $("tbody:first", t).append(rowData.join(""))
                        }
                    }
                }
                if (ts.p.subGrid === true) {
                    try {
                        self.jqGrid("addSubGrid", gi + ni)
                    } catch (_) {}
                }
                ts.p.totaltime = new Date() - startReq;
                if (ir > 0) {
                    if (ts.p.records === 0) {
                        ts.p.records = gl
                    }
                }
                rowData = null;
                if (ts.p.treeGrid === true) {
                    try {
                        self.jqGrid("setTreeNode", fpos + 1, ir + fpos + 1)
                    } catch (e) {}
                }
                if (!ts.p.treeGrid && !ts.p.scroll) {
                    ts.grid.bDiv.scrollTop = 0
                }
                ts.p.reccount = ir;
                ts.p.treeANode = -1;
                if (ts.p.userDataOnFooter) {
                    self.jqGrid("footerData", "set", ts.p.userData, true)
                }
                if (locdata) {
                    ts.p.records = gl;
                    ts.p.lastpage = Math.ceil(gl / rn)
                }
                if (!more) {
                    ts.updatepager(false, true);
                    ts.setScrollbar();
                }
                if (locdata) {
                    while (ir < gl) {
                        xmlr = gxml[ir];
                        rid = getId(xmlr, ir + br);
                        rid = ts.p.idPrefix + rid;
                        if (xmlRd.repeatitems) {
                            if (!F) {
                                F = orderedCols(gi + si + ni)
                            }
                            var cells2 = $.jgrid.getXmlData(xmlr, xmlRd.cell, true);
                            $.each(F, function(k) {
                                var cell = cells2[this];
                                if (!cell) {
                                    return false
                                }
                                v = cell.textContent || cell.text;
                                rd[ts.p.colModel[k + gi + si + ni].name] = v
                            })
                        } else {
                            for (i = 0; i < f.length; i++) {
                                v = $.jgrid.getXmlData(xmlr, f[i]);
                                rd[ts.p.colModel[i + gi + si + ni].name] = v
                            }
                        }
                        rd[xmlid] = $.jgrid.stripPref(ts.p.idPrefix, rid);
                        if (ts.p.grouping) {
                            groupingPrepare.call(self, rd, ir)
                        }
                        ts.p.data.push(rd);
                        ts.p._index[rd[xmlid]] = ts.p.data.length - 1;
                        rd = {};
                        ir++
                    }
                    if (ts.p.grouping) {
                        ts.p.groupingView._locgr = true;
                        self.jqGrid("groupingRender", grpdata, ts.p.colModel.length, ts.p.page, rn);
                        grpdata = null
                    }
                }
            }
              , addJSONData = function(data, t, rcnt, more, adjust) {
                var startReq = new Date();
                if (data) {
                    if (ts.p.treeANode === -1 && !ts.p.scroll) {
                        emptyRows.call(ts, false, true);
                        rcnt = 1
                    } else {
                        rcnt = rcnt > 1 ? rcnt : 1
                    }
                } else {
                    return
                }
                var dReader, locid = "_id_", frd, locdata = (ts.p.datatype !== "local" && ts.p.loadonce) || ts.p.datatype === "jsonstring";
                if (locdata) {
                    ts.p.data = [];
                    ts.p._index = {};
                    ts.p.localReader.id = locid
                }
                ts.p.reccount = 0;
                if (ts.p.datatype === "local") {
                    dReader = ts.p.localReader;
                    frd = "local"
                } else {
                    dReader = ts.p.jsonReader;
                    frd = "json"
                }
                var self = $(ts), ir = 0, v, i, j, f = [], cur, gi = ts.p.multiselect ? 1 : 0, si = ts.p.subGrid === true ? 1 : 0, addSubGridCell, ni = ts.p.rownumbers === true ? 1 : 0, arrayReader = orderedCols(gi + si + ni), objectReader = reader(frd), rowReader, len, drows, idn, rd = {}, fpos, idr, rowData = [], cn = (ts.p.altRows === true) ? ts.p.altclass : "", cn1;
                ts.p.page = intNum($.jgrid.getAccessor(data, dReader.page), ts.p.page);
                ts.p.lastpage = intNum($.jgrid.getAccessor(data, dReader.total), 1);
                ts.p.records = intNum($.jgrid.getAccessor(data, dReader.records));
                ts.p.userData = $.jgrid.getAccessor(data, dReader.userdata) || {};
                if (si) {
                    addSubGridCell = $.jgrid.getMethod("addSubGridCell")
                }
                if (ts.p.keyIndex === false) {
                    idn = $.isFunction(dReader.id) ? dReader.id.call(ts, data) : dReader.id
                } else {
                    idn = ts.p.keyIndex
                }
                if (!dReader.repeatitems) {
                    f = objectReader;
                    if (f.length > 0 && !isNaN(idn)) {
                        idn = ts.p.keyName
                    }
                }
                drows = $.jgrid.getAccessor(data, dReader.root);
                if (drows == null && $.isArray(data)) {
                    drows = data
                }
                if (!drows) {
                    drows = []
                }
                len = drows.length;
                i = 0;
                if (len > 0 && ts.p.page <= 0) {
                    ts.p.page = 1
                }
                var rn = parseInt(ts.p.rowNum, 10), br = ts.p.scroll ? $.jgrid.randId() : 1, altr, selected = false, selr;
                if (adjust) {
                    rn *= adjust + 1
                }
                if (ts.p.datatype === "local" && !ts.p.deselectAfterSort) {
                    selected = true
                }
                var afterInsRow = $.isFunction(ts.p.afterInsertRow), grpdata = [], hiderow = false, groupingPrepare;
                if (ts.p.grouping) {
                    hiderow = ts.p.groupingView.groupCollapse === true;
                    groupingPrepare = $.jgrid.getMethod("groupingPrepare")
                }
                while (i < len) {
                    cur = drows[i];
                    idr = $.jgrid.getAccessor(cur, idn);
                    if (idr === undefined) {
                        if (typeof idn === "number" && ts.p.colModel[idn + gi + si + ni] != null) {
                            idr = $.jgrid.getAccessor(cur, ts.p.colModel[idn + gi + si + ni].name)
                        }
                        if (idr === undefined) {
                            idr = br + i;
                            if (f.length === 0) {
                                if (dReader.cell) {
                                    var ccur = $.jgrid.getAccessor(cur, dReader.cell) || cur;
                                    idr = ccur != null && ccur[idn] !== undefined ? ccur[idn] : idr;
                                    ccur = null
                                }
                            }
                        }
                    }
                    idr = ts.p.idPrefix + idr;
                    altr = rcnt === 1 ? 0 : rcnt;
                    cn1 = (altr + i) % 2 === 1 ? cn : "";
                    if (selected) {
                        if (ts.p.multiselect) {
                            selr = ($.inArray(idr, ts.p.selarrrow) !== -1)
                        } else {
                            selr = (idr === ts.p.selrow)
                        }
                    }
                    var iStartTrTag = rowData.length;
                    rowData.push("");
                    if (ni) {
                        rowData.push(addRowNum(0, i, ts.p.page, ts.p.rowNum))
                    }
                    if (gi) {
                        rowData.push(addMulti(idr, ni, i, selr))
                    }
                    if (si) {
                        rowData.push(addSubGridCell.call(self, gi + ni, i + rcnt))
                    }
                    rowReader = objectReader;
                    if (dReader.repeatitems) {
                        if (dReader.cell) {
                            cur = $.jgrid.getAccessor(cur, dReader.cell) || cur
                        }
                        if ($.isArray(cur)) {
                            rowReader = arrayReader
                        }
                    }
                    for (j = 0; j < rowReader.length; j++) {
                        v = $.jgrid.getAccessor(cur, rowReader[j]);
                        rd[ts.p.colModel[j + gi + si + ni].name] = v;
                        rowData.push(addCell(idr, v, j + gi + si + ni, i + rcnt, cur, rd))
                    }
                    rowData[iStartTrTag] = constructTr(idr, hiderow, cn1, rd, cur, selr);
                    rowData.push("</tr>");
                    if (ts.p.grouping) {
                        grpdata.push(rowData);
                        if (!ts.p.groupingView._locgr) {
                            groupingPrepare.call(self, rd, i)
                        }
                        rowData = []
                    }
                    if (locdata || ts.p.treeGrid === true) {
                        rd[locid] = $.jgrid.stripPref(ts.p.idPrefix, idr);
                        ts.p.data.push(rd);
                        ts.p._index[rd[locid]] = ts.p.data.length - 1
                    }
                    if (ts.p.gridview === false) {
                        $("#" + $.jgrid.jqID(ts.p.id) + " tbody:first").append(rowData.join(""));
                        self.triggerHandler("jqGridAfterInsertRow", [idr, rd, cur]);
                        if (afterInsRow) {
                            ts.p.afterInsertRow.call(ts, idr, rd, cur)
                        }
                        rowData = []
                    }
                    rd = {};
                    ir++;
                    i++;
                    if (ir === rn) {
                        break
                    }
                }
                if (ts.p.gridview === true) {
                    fpos = ts.p.treeANode > -1 ? ts.p.treeANode : 0;
                    if (ts.p.grouping) {
                        if (!locdata) {
                            self.jqGrid("groupingRender", grpdata, ts.p.colModel.length, ts.p.page, rn);
                            grpdata = null
                        }
                    } else {
                        if (ts.p.treeGrid === true && fpos > 0) {
                            $(ts.rows[fpos]).after(rowData.join(""))
                        } else {
                            $("#" + $.jgrid.jqID(ts.p.id) + " tbody:first").append(rowData.join(""))
                        }
                    }
                }
                if (ts.p.subGrid === true) {
                    try {
                        self.jqGrid("addSubGrid", gi + ni)
                    } catch (_) {}
                }
                ts.p.totaltime = new Date() - startReq;
                if (ir > 0) {
                    if (ts.p.records === 0) {
                        ts.p.records = len
                    }
                }
                rowData = null;
                if (ts.p.treeGrid === true) {
                    try {
                        self.jqGrid("setTreeNode", fpos + 1, ir + fpos + 1)
                    } catch (e) {}
                }
                if (!ts.p.treeGrid && !ts.p.scroll) {
                    ts.grid.bDiv.scrollTop = 0
                }
                ts.p.reccount = ir;
                ts.p.treeANode = -1;
                if (ts.p.userDataOnFooter) {
                    self.jqGrid("footerData", "set", ts.p.userData, true)
                }
                if (locdata) {
                    ts.p.records = len;
                    ts.p.lastpage = Math.ceil(len / rn)
                }
                if (!more) {
                    ts.updatepager(false, true);
                    ts.setScrollbar();
                }
                if (locdata) {
                    while (ir < len && drows[ir]) {
                        cur = drows[ir];
                        idr = $.jgrid.getAccessor(cur, idn);
                        if (idr === undefined) {
                            if (typeof idn === "number" && ts.p.colModel[idn + gi + si + ni] != null) {
                                idr = $.jgrid.getAccessor(cur, ts.p.colModel[idn + gi + si + ni].name)
                            }
                            if (idr === undefined) {
                                idr = br + ir;
                                if (f.length === 0) {
                                    if (dReader.cell) {
                                        var ccur2 = $.jgrid.getAccessor(cur, dReader.cell) || cur;
                                        idr = ccur2 != null && ccur2[idn] !== undefined ? ccur2[idn] : idr;
                                        ccur2 = null
                                    }
                                }
                            }
                        }
                        if (cur) {
                            idr = ts.p.idPrefix + idr;
                            rowReader = objectReader;
                            if (dReader.repeatitems) {
                                if (dReader.cell) {
                                    cur = $.jgrid.getAccessor(cur, dReader.cell) || cur
                                }
                                if ($.isArray(cur)) {
                                    rowReader = arrayReader
                                }
                            }
                            for (j = 0; j < rowReader.length; j++) {
                                rd[ts.p.colModel[j + gi + si + ni].name] = $.jgrid.getAccessor(cur, rowReader[j])
                            }
                            rd[locid] = $.jgrid.stripPref(ts.p.idPrefix, idr);
                            if (ts.p.grouping) {
                                groupingPrepare.call(self, rd, ir)
                            }
                            ts.p.data.push(rd);
                            ts.p._index[rd[locid]] = ts.p.data.length - 1;
                            rd = {}
                        }
                        ir++
                    }
                    if (ts.p.grouping) {
                        ts.p.groupingView._locgr = true;
                        self.jqGrid("groupingRender", grpdata, ts.p.colModel.length, ts.p.page, rn);
                        grpdata = null
                    }
                }
            }
              , addLocalData = function() {
                var st = ts.p.multiSort ? [] : "", sto = [], fndsort = false, cmtypes = {}, grtypes = [], grindexes = [], srcformat, sorttype, newformat;
                if (!$.isArray(ts.p.data)) {
                    return
                }
                var grpview = ts.p.grouping ? ts.p.groupingView : false, lengrp, gin;
                $.each(ts.p.colModel, function() {
                    sorttype = this.sorttype || "text";
                    if (sorttype === "date" || sorttype === "datetime") {
                        if (this.formatter && typeof this.formatter === "string" && this.formatter === "date") {
                            if (this.formatoptions && this.formatoptions.srcformat) {
                                srcformat = this.formatoptions.srcformat
                            } else {
                                srcformat = $.jgrid.formatter.date.srcformat
                            }
                            if (this.formatoptions && this.formatoptions.newformat) {
                                newformat = this.formatoptions.newformat
                            } else {
                                newformat = $.jgrid.formatter.date.newformat
                            }
                        } else {
                            srcformat = newformat = this.datefmt || "Y-m-d"
                        }
                        cmtypes[this.name] = {
                            stype: sorttype,
                            srcfmt: srcformat,
                            newfmt: newformat,
                            sfunc: this.sortfunc || null
                        }
                    } else {
                        cmtypes[this.name] = {
                            stype: sorttype,
                            srcfmt: "",
                            newfmt: "",
                            sfunc: this.sortfunc || null
                        }
                    }
                    if (ts.p.grouping) {
                        for (gin = 0,
                        lengrp = grpview.groupField.length; gin < lengrp; gin++) {
                            if (this.name === grpview.groupField[gin]) {
                                var grindex = this.name;
                                if (this.index) {
                                    grindex = this.index
                                }
                                grtypes[gin] = cmtypes[grindex];
                                grindexes[gin] = grindex
                            }
                        }
                    }
                    if (ts.p.multiSort) {
                        if (this.lso) {
                            st.push(this.name);
                            var tmplso = this.lso.split("-");
                            sto.push(tmplso[tmplso.length - 1])
                        }
                    } else {
                        if (!fndsort && (this.index === ts.p.sortname || this.name === ts.p.sortname)) {
                            st = this.name;
                            fndsort = true
                        }
                    }
                });
                if (ts.p.treeGrid) {
                    $(ts).jqGrid("SortTree", st, ts.p.sortorder, cmtypes[st].stype || "text", cmtypes[st].srcfmt || "");
                    return
                }
                var compareFnMap = {
                    eq: function(queryObj) {
                        return queryObj.equals
                    },
                    ne: function(queryObj) {
                        return queryObj.notEquals
                    },
                    lt: function(queryObj) {
                        return queryObj.less
                    },
                    le: function(queryObj) {
                        return queryObj.lessOrEquals
                    },
                    gt: function(queryObj) {
                        return queryObj.greater
                    },
                    ge: function(queryObj) {
                        return queryObj.greaterOrEquals
                    },
                    cn: function(queryObj) {
                        return queryObj.contains
                    },
                    nc: function(queryObj, op) {
                        return op === "OR" ? queryObj.orNot().contains : queryObj.andNot().contains
                    },
                    bw: function(queryObj) {
                        return queryObj.startsWith
                    },
                    bn: function(queryObj, op) {
                        return op === "OR" ? queryObj.orNot().startsWith : queryObj.andNot().startsWith
                    },
                    en: function(queryObj, op) {
                        return op === "OR" ? queryObj.orNot().endsWith : queryObj.andNot().endsWith
                    },
                    ew: function(queryObj) {
                        return queryObj.endsWith
                    },
                    ni: function(queryObj, op) {
                        return op === "OR" ? queryObj.orNot().equals : queryObj.andNot().equals
                    },
                    "in": function(queryObj) {
                        return queryObj.equals
                    },
                    nu: function(queryObj) {
                        return queryObj.isNull
                    },
                    nn: function(queryObj, op) {
                        return op === "OR" ? queryObj.orNot().isNull : queryObj.andNot().isNull
                    }
                }
                  , query = $.jgrid.from(ts.p.data);
                if (ts.p.ignoreCase) {
                    query = query.ignoreCase()
                }
                function tojLinq(group) {
                    var s = 0, index, gor, ror, opr, rule;
                    if (group.groups != null) {
                        gor = group.groups.length && group.groupOp.toString().toUpperCase() === "OR";
                        if (gor) {
                            query.orBegin()
                        }
                        for (index = 0; index < group.groups.length; index++) {
                            if (s > 0 && gor) {
                                query.or()
                            }
                            try {
                                tojLinq(group.groups[index])
                            } catch (e) {
                                alert(e)
                            }
                            s++
                        }
                        if (gor) {
                            query.orEnd()
                        }
                    }
                    if (group.rules != null) {
                        try {
                            ror = group.rules.length && group.groupOp.toString().toUpperCase() === "OR";
                            if (ror) {
                                query.orBegin()
                            }
                            for (index = 0; index < group.rules.length; index++) {
                                rule = group.rules[index];
                                opr = group.groupOp.toString().toUpperCase();
                                if (compareFnMap[rule.op] && rule.field) {
                                    if (s > 0 && opr && opr === "OR") {
                                        query = query.or()
                                    }
                                    query = compareFnMap[rule.op](query, opr)(rule.field, rule.data, cmtypes[rule.field])
                                }
                                s++
                            }
                            if (ror) {
                                query.orEnd()
                            }
                        } catch (g) {
                            alert(g)
                        }
                    }
                }
                if (ts.p.search === true) {
                    var srules = ts.p.postData.filters;
                    if (srules) {
                        if (typeof srules === "string") {
                            srules = $.jgrid.parse(srules)
                        }
                        tojLinq(srules)
                    } else {
                        try {
                            query = compareFnMap[ts.p.postData.searchOper](query)(ts.p.postData.searchField, ts.p.postData.searchString, cmtypes[ts.p.postData.searchField])
                        } catch (se) {}
                    }
                }
                if (ts.p.grouping) {
                    for (gin = 0; gin < lengrp; gin++) {
                        query.orderBy(grindexes[gin], grpview.groupOrder[gin], grtypes[gin].stype, grtypes[gin].srcfmt)
                    }
                }
                if (ts.p.multiSort) {
                    $.each(st, function(i) {
                        query.orderBy(this, sto[i], cmtypes[this].stype, cmtypes[this].srcfmt, cmtypes[this].sfunc)
                    })
                } else {
                    if (st && ts.p.sortorder && fndsort) {
                        if (ts.p.sortorder.toUpperCase() === "DESC") {
                            query.orderBy(ts.p.sortname, "d", cmtypes[st].stype, cmtypes[st].srcfmt, cmtypes[st].sfunc)
                        } else {
                            query.orderBy(ts.p.sortname, "a", cmtypes[st].stype, cmtypes[st].srcfmt, cmtypes[st].sfunc)
                        }
                    }
                }
                var queryResults = query.select()
                  , recordsperpage = parseInt(ts.p.rowNum, 10)
                  , total = queryResults.length
                  , page = parseInt(ts.p.page, 10)
                  , totalpages = Math.ceil(total / recordsperpage)
                  , retresult = {};
                if ((ts.p.search || ts.p.resetsearch) && ts.p.grouping && ts.p.groupingView._locgr) {
                    ts.p.groupingView.groups = [];
                    var j, grPrepare = $.jgrid.getMethod("groupingPrepare"), key, udc;
                    if (ts.p.footerrow && ts.p.userDataOnFooter) {
                        for (key in ts.p.userData) {
                            if (ts.p.userData.hasOwnProperty(key)) {
                                ts.p.userData[key] = 0
                            }
                        }
                        udc = true
                    }
                    for (j = 0; j < total; j++) {
                        if (udc) {
                            for (key in ts.p.userData) {
                                ts.p.userData[key] += parseFloat(queryResults[j][key] || 0)
                            }
                        }
                        grPrepare.call($(ts), queryResults[j], j, recordsperpage)
                    }
                }
                queryResults = queryResults.slice((page - 1) * recordsperpage, page * recordsperpage);
                query = null;
                cmtypes = null;
                retresult[ts.p.localReader.total] = totalpages;
                retresult[ts.p.localReader.page] = page;
                retresult[ts.p.localReader.records] = total;
                retresult[ts.p.localReader.root] = queryResults;
                retresult[ts.p.localReader.userdata] = ts.p.userData;
                queryResults = null;
                return retresult
            }
              , updatepager = function(rn, dnd) {
                var cp, last, base, from, to, tot, fmt, pgboxes = "", sppg, tspg = ts.p.pager ? "_" + $.jgrid.jqID(ts.p.pager.substr(1)) : "", tspg_t = ts.p.toppager ? "_" + ts.p.toppager.substr(1) : "";
                base = parseInt(ts.p.page, 10) - 1;
                if (base < 0) {
                    base = 0
                }
                base = base * parseInt(ts.p.rowNum, 10);
                to = base + ts.p.reccount;
                if (ts.p.scroll) {
                    var rows = $("tbody:first > tr:gt(0)", ts.grid.bDiv);
                    base = to - rows.length;
                    ts.p.reccount = rows.length;
                    var rh = rows.outerHeight() || ts.grid.prevRowHeight;
                    if (rh) {
                        var top = base * rh;
                        var height = parseInt(ts.p.records, 10) * rh;
                        $(">div:first", ts.grid.bDiv).css({
                            height: height
                        }).children("div:first").css({
                            height: top,
                            display: top ? "" : "none"
                        });
                        if (ts.grid.bDiv.scrollTop == 0 && ts.p.page > 1) {
                            ts.grid.bDiv.scrollTop = ts.p.rowNum * (ts.p.page - 1) * rh
                        }
                    }
                    ts.grid.bDiv.scrollLeft = ts.grid.hDiv.scrollLeft
                }
                pgboxes = ts.p.pager || "";
                pgboxes += ts.p.toppager ? (pgboxes ? "," + ts.p.toppager : ts.p.toppager) : "";
                if (pgboxes) {
                    if ($.jgrid.formatter) {
                        fmt = $.jgrid.formatter.integer || {}
                    } else {
                        fmt = {}
                    }
                    cp = intNum(ts.p.page);
                    last = intNum(ts.p.lastpage);
                    $(".selbox", pgboxes)[this.p.useProp ? "prop" : "attr"]("disabled", false);
                    if (ts.p.pginput === true) {
                        $(".ui-pg-input", pgboxes).val(ts.p.page);
                        sppg = ts.p.toppager ? "#sp_1" + tspg + ",#sp_1" + tspg_t : "#sp_1" + tspg;
                        $(sppg).html($.fmatter ? $.fmatter.util.NumberFormat(ts.p.lastpage, fmt) : ts.p.lastpage)
                    }
                    if (ts.p.viewrecords) {
                        if (ts.p.reccount === 0) {
                            $(".ui-paging-info", pgboxes).html(ts.p.emptyrecords)
                        } else {
                            from = base + 1;
                            tot = ts.p.records;
                            if ($.fmatter) {
                                from = $.fmatter.util.NumberFormat(from, fmt);
                                to = $.fmatter.util.NumberFormat(to, fmt);
                                tot = $.fmatter.util.NumberFormat(tot, fmt)
                            }
                            $(".ui-paging-info", pgboxes).html($.jgrid.format(ts.p.recordtext, from, to, tot))
                        }
                    }
                    if (ts.p.pgbuttons === true) {
                        if (cp <= 0) {
                            cp = last = 0
                        }
                        if (cp === 1 || cp === 0) {
                            $("#first" + tspg + ", #prev" + tspg).addClass("ui-state-disabled").removeClass("ui-state-hover");
                            if (ts.p.toppager) {
                                $("#first_t" + tspg_t + ", #prev_t" + tspg_t).addClass("ui-state-disabled").removeClass("ui-state-hover")
                            }
                        } else {
                            $("#first" + tspg + ", #prev" + tspg).removeClass("ui-state-disabled");
                            if (ts.p.toppager) {
                                $("#first_t" + tspg_t + ", #prev_t" + tspg_t).removeClass("ui-state-disabled")
                            }
                        }
                        if (cp === last || cp === 0) {
                            $("#next" + tspg + ", #last" + tspg).addClass("ui-state-disabled").removeClass("ui-state-hover");
                            if (ts.p.toppager) {
                                $("#next_t" + tspg_t + ", #last_t" + tspg_t).addClass("ui-state-disabled").removeClass("ui-state-hover")
                            }
                        } else {
                            $("#next" + tspg + ", #last" + tspg).removeClass("ui-state-disabled");
                            if (ts.p.toppager) {
                                $("#next_t" + tspg_t + ", #last_t" + tspg_t).removeClass("ui-state-disabled")
                            }
                        }
                    }
                }
                if (rn === true && ts.p.rownumbers === true) {
                    $(">td.jqgrid-rownum", ts.rows).each(function(i) {
                        $(this).html(base + 1 + i)
                    })
                }
                if (dnd && ts.p.jqgdnd) {
                    $(ts).jqGrid("gridDnD", "updateDnD")
                }
                $(ts).triggerHandler("jqGridGridComplete");
                if ($.isFunction(ts.p.gridComplete)) {
                    ts.p.gridComplete.call(ts)
                }
                $(ts).triggerHandler("jqGridAfterGridComplete")
            }
              , beginReq = function() {
                ts.grid.hDiv.loading = true;
                if (ts.p.hiddengrid) {
                    return
                }
                switch (ts.p.loadui) {
                case "disable":
                    break;
                case "enable":
                    $("#load_" + $.jgrid.jqID(ts.p.id)).show();
                    break;
                case "block":
                    $("#lui_" + $.jgrid.jqID(ts.p.id)).show();
                    $("#load_" + $.jgrid.jqID(ts.p.id)).show();
                    break
                }
            }
              , endReq = function() {
                ts.grid.hDiv.loading = false;
                switch (ts.p.loadui) {
                case "disable":
                    break;
                case "enable":
                    $("#load_" + $.jgrid.jqID(ts.p.id)).hide();
                    break;
                case "block":
                    $("#lui_" + $.jgrid.jqID(ts.p.id)).hide();
                    $("#load_" + $.jgrid.jqID(ts.p.id)).hide();
                    break
                }
            }
              , populate = function(npage) {
                if (!ts.grid.hDiv.loading) {
                    var pvis = ts.p.scroll && npage === false, prm = {}, dt, dstr, pN = ts.p.prmNames;
                    if (ts.p.page <= 0) {
                        ts.p.page = Math.min(1, ts.p.lastpage)
                    }
                    if (pN.search !== null) {
                        prm[pN.search] = ts.p.search
                    }
                    if (pN.nd !== null) {
                        prm[pN.nd] = new Date().getTime()
                    }
                    if (pN.rows !== null) {
                        prm[pN.rows] = ts.p.rowNum
                    }
                    if (pN.page !== null) {
                        prm[pN.page] = ts.p.page
                    }
                    if (pN.sort !== null) {
                        prm[pN.sort] = ts.p.sortname
                    }
                    if (pN.order !== null) {
                        prm[pN.order] = ts.p.sortorder
                    }
                    if (ts.p.rowTotal !== null && pN.totalrows !== null) {
                        prm[pN.totalrows] = ts.p.rowTotal
                    }
                    var lcf = $.isFunction(ts.p.loadComplete)
                      , lc = lcf ? ts.p.loadComplete : null;
                    var adjust = 0;
                    npage = npage || 1;
                    if (npage > 1) {
                        if (pN.npage !== null) {
                            prm[pN.npage] = npage;
                            adjust = npage - 1;
                            npage = 1
                        } else {
                            lc = function(req) {
                                ts.p.page++;
                                ts.grid.hDiv.loading = false;
                                if (lcf) {
                                    ts.p.loadComplete.call(ts, req)
                                }
                                populate(npage - 1)
                            }
                        }
                    } else {
                        if (pN.npage !== null) {
                            delete ts.p.postData[pN.npage]
                        }
                    }
                    if (ts.p.grouping) {
                        $(ts).jqGrid("groupingSetup");
                        var grp = ts.p.groupingView, gi, gs = "";
                        for (gi = 0; gi < grp.groupField.length; gi++) {
                            var index = grp.groupField[gi];
                            $.each(ts.p.colModel, function(cmIndex, cmValue) {
                                if (cmValue.name === index && cmValue.index) {
                                    index = cmValue.index
                                }
                            });
                            gs += index + " " + grp.groupOrder[gi] + ", "
                        }
                        prm[pN.sort] = gs + prm[pN.sort]
                    }
                    $.extend(ts.p.postData, prm);
                    var rcnt = !ts.p.scroll ? 1 : ts.rows.length - 1;
                    var bfr = $(ts).triggerHandler("jqGridBeforeRequest");
                    if (bfr === false || bfr === "stop") {
                        return
                    }
                    if ($.isFunction(ts.p.datatype)) {
                        ts.p.datatype.call(ts, ts.p.postData, "load_" + ts.p.id, rcnt, npage, adjust);
                        return
                    }
                    if ($.isFunction(ts.p.beforeRequest)) {
                        bfr = ts.p.beforeRequest.call(ts);
                        if (bfr === undefined) {
                            bfr = true
                        }
                        if (bfr === false) {
                            return
                        }
                    }
                    dt = ts.p.datatype.toLowerCase();
                    switch (dt) {
                    case "json":
                    case "jsonp":
                    case "xml":
                    case "script":
                        // http request
                        var postDataForm = $.isFunction(ts.p.serializeGridData) ? ts.p.serializeGridData.call(ts, ts.p.postData) : ts.p.postData
						if(postDataForm){
                            var sortNameReal = ''
                            var sortNameKey = ''
							if (ts.p.colModel) {
								var isnumberMap = {}
								for (var k = 0; k < ts.p.colModel.length; k++) {
									isnumberMap[ts.p.colModel[k].name] = ts.p.colModel[k].isnumber ? true: false
                                }
                                for (var key in postDataForm) {
                                    if (key.indexOf('queryModel.sortName') !== -1) {
                                        sortNameKey = key
                                    }
                                }
                                if (sortNameKey) {
                                    var sortNames = postDataForm[sortNameKey].split(',')
                                    for (var j = 0; j < sortNames.length; j++) {
                                        var sortNameCurrTmp = sortNames[j].split(' ')
                                        var sortNameCurr = []
                                        for (var n = 0; n < sortNameCurrTmp.length; n++) {
                                            if (sortNameCurrTmp[n] !== '' && sortNameCurrTmp[n] !== ' ') {
                                                sortNameCurr.push(sortNameCurrTmp[n]) 
                                            }
                                        }
                                        if (sortNameCurr.length > 0) {
                                            if (isnumberMap.hasOwnProperty(sortNameCurr[0]) && isnumberMap[sortNameCurr[0]]) {
                                                sortNameReal += 'to_number(' + sortNameCurr[0] + ')'
                                            } else {
                                                sortNameReal += sortNameCurr[0]
                                            }
                                        }
                                        if (sortNameCurr.length > 1) {
                                            for (var i = 1; i < sortNameCurr.length; i++) {
                                                sortNameReal += " " + sortNameCurr[i];
                                            }
                                        }
                                        if (j + 1 < sortNames.length) {
                                            sortNameReal += ','
                                        }
                                    }
                                }
							}
                            sortNameReal += ' '
                            if (sortNameKey) {
                              postDataForm[sortNameKey] = sortNameReal
                            }
						}
						$.ajax($.extend({
                            url: ts.p.url,
                            type: ts.p.mtype,
                            dataType: dt,
                            data: postDataForm,
                            success: function(data, st, xhr) {
                                if ($.isFunction(ts.p.beforeProcessing)) {
                                    if (ts.p.beforeProcessing.call(ts, data, st, xhr) === false) {
                                        endReq();
                                        return
                                    }
                                }
                                if (dt === "xml") {
                                    addXmlData(data, ts.grid.bDiv, rcnt, npage > 1, adjust)
                                } else {
                                    addJSONData(data, ts.grid.bDiv, rcnt, npage > 1, adjust)
                                }
                                $(ts).triggerHandler("jqGridLoadComplete", [data]);
                                if (lc) {
                                    lc.call(ts, data)
                                }
                                $(ts).triggerHandler("jqGridAfterLoadComplete", [data]);
                                if (pvis) {
                                    ts.grid.populateVisible()
                                }
                                if (ts.p.loadonce || ts.p.treeGrid) {
                                    ts.p.datatype = "local"
                                }
                                data = null;
                                if (npage === 1) {
                                    endReq()
                                }
                            },
                            error: function(xhr, st, err) {
                                if ($.isFunction(ts.p.loadError)) {
                                    ts.p.loadError.call(ts, xhr, st, err)
                                }
                                if (npage === 1) {
                                    endReq()
                                }
                                xhr = null
                            },
                            beforeSend: function(xhr, settings) {
                                var gotoreq = true;
                                if ($.isFunction(ts.p.loadBeforeSend)) {
                                    gotoreq = ts.p.loadBeforeSend.call(ts, xhr, settings)
                                }
                                if (gotoreq === undefined) {
                                    gotoreq = true
                                }
                                if (gotoreq === false) {
                                    return false
                                }
                                beginReq()
                            }
                        }, $.jgrid.ajaxOptions, ts.p.ajaxGridOptions));
                        break;
                    case "xmlstring":
                        beginReq();
                        dstr = typeof ts.p.datastr !== "string" ? ts.p.datastr : $.parseXML(ts.p.datastr);
                        addXmlData(dstr, ts.grid.bDiv);
                        $(ts).triggerHandler("jqGridLoadComplete", [dstr]);
                        if (lcf) {
                            ts.p.loadComplete.call(ts, dstr)
                        }
                        $(ts).triggerHandler("jqGridAfterLoadComplete", [dstr]);
                        ts.p.datatype = "local";
                        ts.p.datastr = null;
                        endReq();
                        break;
                    case "jsonstring":
                        beginReq();
                        if (typeof ts.p.datastr === "string") {
                            dstr = $.jgrid.parse(ts.p.datastr)
                        } else {
                            dstr = ts.p.datastr
                        }
                        addJSONData(dstr, ts.grid.bDiv);
                        $(ts).triggerHandler("jqGridLoadComplete", [dstr]);
                        if (lcf) {
                            ts.p.loadComplete.call(ts, dstr)
                        }
                        $(ts).triggerHandler("jqGridAfterLoadComplete", [dstr]);
                        ts.p.datatype = "local";
                        ts.p.datastr = null;
                        endReq();
                        break;
                    case "local":
                    case "clientside":
                        beginReq();
                        ts.p.datatype = "local";
                        var req = addLocalData();
                        addJSONData(req, ts.grid.bDiv, rcnt, npage > 1, adjust);
                        $(ts).triggerHandler("jqGridLoadComplete", [req]);
                        if (lc) {
                            lc.call(ts, req)
                        }
                        $(ts).triggerHandler("jqGridAfterLoadComplete", [req]);
                        if (pvis) {
                            ts.grid.populateVisible()
                        }
                        endReq();
                        break
                    }
                }
            }
            , setHeadCheckBox = function(checked) {
                $("#cb_" + $.jgrid.jqID(ts.p.id), ts.grid.hDiv)[ts.p.useProp ? "prop" : "attr"]("checked", checked);
                var fid = ts.p.frozenColumns ? ts.p.id + "_frozen" : "";
                if (fid) {
                    $("#cb_" + $.jgrid.jqID(ts.p.id), ts.grid.fhDiv)[ts.p.useProp ? "prop" : "attr"]("checked", checked)
                }
            }, setScrollbar = function() {
                if(ts.p.fixscrollBar && ts.p.rowNum > 15){
                    if($("#gbox_" + $.jgrid.jqID(ts.p.id)).find('.grid-fixscrollBar').length == 0) {
                        var scrollbar = $('<div class="grid-fixscrollBar"></div>').hide();
                        var scrollthumb = $('<div class="fixsb-inner"></div>');
                        scrollbar.outerWidth(grid.width);
                        scrollthumb.outerWidth(ts.p.tblwidth);
                        scrollbar.append(scrollthumb);
                        $(grid.bDiv).after(scrollbar);
                        scrollbar.on('scroll', function() {
                            $(grid.bDiv).scrollLeft($(this).scrollLeft());
                        })
                        var btoth = $(grid.bDiv).offset().top + $(grid.bDiv).outerHeight();
                        var htoth = $(grid.hDiv).offset().top + $(grid.hDiv).outerHeight();
                        var wdh = $(window).outerHeight();
                        if(wdh < btoth - 20 && wdh > htoth) {
                            scrollbar.show();
                        }
                        $(window).on('scroll', function() {
                            var hst = $('html').scrollTop();
                            if(wdh + hst < btoth - 20 && hst + wdh > htoth) {
                                scrollbar.show();
                                scrollbar.css({
                                    'left': scrollbar.offset().left,
                                    'position': 'fixed',
                                    'bottom': '0'   
                                });
                            } else {
                                scrollbar.hide();
                            }
                        })
                    }
                }
            }
            , setPager = function(pgid, tp) {
                var sep = "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>", pginp = "", pgl = "<table cellspacing='0' cellpadding='0' border='0' style='table-layout:auto;' class='ui-pg-table'><tbody><tr>", str = "", pgcnt, lft, cent, rgt, twd, tdw, i, clearVals = function(onpaging) {
                    var ret;
                    if ($.isFunction(ts.p.onPaging)) {
                        ret = ts.p.onPaging.call(ts, onpaging)
                    }
                    if (ret === "stop") {
                        return false
                    }
                    ts.p.selrow = null;
                    if (ts.p.multiselect) {
                        ts.p.selarrrow = [];
                        setHeadCheckBox(false)
                    }
                    ts.p.savedRow = [];
                    return true
                };
                pgid = pgid.substr(1);
                tp += "_" + pgid;
                pgcnt = "pg_" + pgid;
                lft = pgid + "_left";
                cent = pgid + "_center";
                rgt = pgid + "_right";
                $("#" + $.jgrid.jqID(pgid)).append("<div id='" + pgcnt + "' class='ui-pager-control' role='group'><table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table' style='width:100%;table-layout:fixed;height:100%;' role='row'><tbody><tr><td id='" + lft + "' align='left'></td><td id='" + cent + "' align='center' style='white-space:pre;'></td><td id='" + rgt + "' align='right'></td></tr></tbody></table></div>").attr("dir", "ltr");
                if (ts.p.rowList.length > 0) {
                    str = "<td dir='" + dir + "'>";
                    str += "<select class='ui-pg-selbox'  name='currentPage' role='listbox'>";
                    for (i = 0; i < ts.p.rowList.length; i++) {
                        str += '<option role="option" value="' + ts.p.rowList[i] + '"' + ((ts.p.rowNum === ts.p.rowList[i]) ? ' selected="selected"' : "") + ">" + ts.p.rowList[i] + "</option>"
                    }
                    str += "</select></td>"
                }
                if (dir === "rtl") {
                    pgl += str
                }
                if (ts.p.pginput === true) {
                    pginp = "<td dir='" + dir + "'>" + $.jgrid.format(ts.p.pgtext || "", "<input class='ui-pg-input' name='showCount' type='text' size='2' maxlength='7' value='0' role='textbox'/>", "<span id='sp_1_" + $.jgrid.jqID(pgid) + "'></span>") + "</td>"
                }
                if (ts.p.pgbuttons === true) {
                    var po = ["first" + tp, "prev" + tp, "next" + tp, "last" + tp];
                    if (dir === "rtl") {
                        po.reverse()
                    }
                    pgl += "<td id='" + po[0] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-first'></span></td>";
                    pgl += "<td id='" + po[1] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-prev'></span></td>";
                    pgl += pginp !== "" ? sep + pginp + sep : "";
                    pgl += "<td id='" + po[2] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-next'></span></td>";
                    pgl += "<td id='" + po[3] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-end'></span></td>"
                } else {
                    if (pginp !== "") {
                        pgl += pginp
                    }
                }
                if (dir === "ltr") {
                    pgl += str
                }
                pgl += "</tr></tbody></table>";
                if (ts.p.viewrecords === true) {
                    $("td#" + pgid + "_" + ts.p.recordpos, "#" + pgcnt).append("<div dir='" + dir + "' style='text-align:" + ts.p.recordpos + "' class='ui-paging-info'></div>")
                }
                $("td#" + pgid + "_" + ts.p.pagerpos, "#" + pgcnt).append(pgl);
                tdw = $(".ui-jqgrid").css("font-size") || "11px";
                $(document.body).append("<div id='testpg' class='ui-jqgrid ui-widget ui-widget-content' style='font-size:" + tdw + ";visibility:hidden;' ></div>");
                twd = $(pgl).clone().appendTo("#testpg").width();
                $("#testpg").remove();
                if (twd > 0) {
                    if (pginp !== "") {
                        twd += 50
                    }
                    $("td#" + pgid + "_" + ts.p.pagerpos, "#" + pgcnt).width(twd)
                }
                ts.p._nvtd = [];
                ts.p._nvtd[0] = twd ? Math.floor((ts.p.width - twd) / 2) : Math.floor(ts.p.width / 3);
                ts.p._nvtd[1] = 0;
                pgl = null;
                $(".ui-pg-selbox", "#" + pgcnt).bind("change", function() {
                    if (!clearVals("records")) {
                        return false
                    }
                    ts.p.page = Math.round(ts.p.rowNum * (ts.p.page - 1) / this.value - 0.5) + 1;
                    ts.p.rowNum = this.value;
                    if (ts.p.pager) {
                        $(".ui-pg-selbox", ts.p.pager).val(this.value)
                    }
                    if (ts.p.toppager) {
                        $(".ui-pg-selbox", ts.p.toppager).val(this.value)
                    }
                    populate();
                    return false
                });
                if (ts.p.pgbuttons === true) {
                    $(".ui-pg-button", "#" + pgcnt).hover(function() {
                        if ($(this).hasClass("ui-state-disabled")) {
                            this.style.cursor = "default"
                        } else {
                            $(this).addClass("ui-state-hover");
                            this.style.cursor = "pointer"
                        }
                    }, function() {
                        if (!$(this).hasClass("ui-state-disabled")) {
                            $(this).removeClass("ui-state-hover");
                            this.style.cursor = "default"
                        }
                    });
                    $("#first" + $.jgrid.jqID(tp) + ", #prev" + $.jgrid.jqID(tp) + ", #next" + $.jgrid.jqID(tp) + ", #last" + $.jgrid.jqID(tp)).click(function() {
                        if ($(this).hasClass("ui-state-disabled")) {
                            return false
                        }
                        var cp = intNum(ts.p.page, 1)
                          , last = intNum(ts.p.lastpage, 1)
                          , selclick = false
                          , fp = true
                          , pp = true
                          , np = true
                          , lp = true;
                        if (last === 0 || last === 1) {
                            fp = false;
                            pp = false;
                            np = false;
                            lp = false
                        } else {
                            if (last > 1 && cp >= 1) {
                                if (cp === 1) {
                                    fp = false;
                                    pp = false
                                } else {
                                    if (cp === last) {
                                        np = false;
                                        lp = false
                                    }
                                }
                            } else {
                                if (last > 1 && cp === 0) {
                                    np = false;
                                    lp = false;
                                    cp = last - 1
                                }
                            }
                        }
                        if (!clearVals(this.id)) {
                            return false
                        }
                        if (this.id === "first" + tp && fp) {
                            ts.p.page = 1;
                            selclick = true
                        }
                        if (this.id === "prev" + tp && pp) {
                            ts.p.page = (cp - 1);
                            selclick = true
                        }
                        if (this.id === "next" + tp && np) {
                            ts.p.page = (cp + 1);
                            selclick = true
                        }
                        if (this.id === "last" + tp && lp) {
                            ts.p.page = last;
                            selclick = true
                        }
                        if (selclick) {
                            populate()
                        }
                        return false
                    })
                }
                if (ts.p.pginput === true) {
                    $("input.ui-pg-input", "#" + pgcnt).keypress(function(e) {
                        var key = e.charCode || e.keyCode || 0;
                        if (key === 13) {
                            if (!clearVals("user")) {
                                return false
                            }
                            $(this).val(intNum($(this).val(), 1));
                            ts.p.page = ($(this).val() > 0) ? $(this).val() : ts.p.page;
                            populate();
                            return false
                        }
                        return this
                    })
                }
            }
              , multiSort = function(iCol, obj) {
                var splas, sort = "", cm = ts.p.colModel, fs = false, ls, selTh = ts.p.frozenColumns ? obj : ts.grid.headers[iCol].el, so = "";
                $("span.ui-grid-ico-sort", selTh).addClass("ui-state-disabled");
                $(selTh).attr("aria-selected", "false");
                if (cm[iCol].lso) {
                    if (cm[iCol].lso === "asc") {
                        cm[iCol].lso += "-desc";
                        so = "desc"
                    } else {
                        if (cm[iCol].lso === "desc") {
                            cm[iCol].lso += "-asc";
                            so = "asc"
                        } else {
                            if (cm[iCol].lso === "asc-desc" || cm[iCol].lso === "desc-asc") {
                                cm[iCol].lso = ""
                            }
                        }
                    }
                } else {
                    cm[iCol].lso = so = cm[iCol].firstsortorder || "asc"
                }
                if (so) {
                    $("span.s-ico", selTh).show();
                    $("span.ui-icon-" + so, selTh).removeClass("ui-state-disabled");
                    $(selTh).attr("aria-selected", "true")
                } else {
                    if (!ts.p.viewsortcols[0]) {
                        $("span.s-ico", selTh).hide()
                    }
                }
                ts.p.sortorder = "";
                $.each(cm, function(i) {
                    if (this.lso && $.founded(cm[i].index || cm[i].name)) {
                        if (i > 0 && fs) {
                            sort += ", "
                        }
                        splas = this.lso.split("-");
                        sort += cm[i].index || cm[i].name;
                        sort += " " + splas[splas.length - 1];
                        fs = true;
                        ts.p.sortorder = splas[splas.length - 1]
                    }
                });
                ls = sort.lastIndexOf(ts.p.sortorder);
                sort = sort.substring(0, ls);
                ts.p.sortname = sort
            }
              , sortData = function(index, idxcol, reload, sor, obj) {
                if (!ts.p.colModel[idxcol].sortable) {
                    return
                }
                if (ts.p.savedRow.length > 0) {
                    return
                }
                if (!reload) {
                    if (ts.p.lastsort === idxcol) {
                        if (ts.p.sortorder === "asc") {
                            ts.p.sortorder = "desc"
                        } else {
                            if (ts.p.sortorder === "desc") {
                                ts.p.sortorder = "asc"
                            }
                        }
                    } else {
                        ts.p.sortorder = ts.p.colModel[idxcol].firstsortorder || "asc"
                    }
                    ts.p.page = 1
                }
                if (ts.p.multiSort) {
                    multiSort(idxcol, obj)
                } else {
                    if (sor) {
                        if (ts.p.lastsort === idxcol && ts.p.sortorder === sor && !reload) {
                            return
                        }
                        ts.p.sortorder = sor
                    }
                    var previousSelectedTh = ts.grid.headers[ts.p.lastsort].el
                      , newSelectedTh = ts.p.frozenColumns ? obj : ts.grid.headers[idxcol].el;
                    $("span.ui-grid-ico-sort", previousSelectedTh).addClass("ui-state-disabled");
                    $(previousSelectedTh).attr("aria-selected", "false");
                    if (ts.p.frozenColumns) {
                        ts.grid.fhDiv.find("span.ui-grid-ico-sort").addClass("ui-state-disabled");
                        ts.grid.fhDiv.find("th").attr("aria-selected", "false")
                    }
                    $("span.ui-icon-" + ts.p.sortorder, newSelectedTh).removeClass("ui-state-disabled");
                    $(newSelectedTh).attr("aria-selected", "true");
                    if (!ts.p.viewsortcols[0]) {
                        if (ts.p.lastsort !== idxcol) {
                            if (ts.p.frozenColumns) {
                                ts.grid.fhDiv.find("span.s-ico").hide()
                            }
                            $("span.s-ico", previousSelectedTh).hide();
                            $("span.s-ico", newSelectedTh).show()
                        }
                    }
                    index = index.substring(5 + ts.p.id.length + 1);
                    ts.p.sortname = ts.p.colModel[idxcol].index || index
                }
                if ($(ts).triggerHandler("jqGridSortCol", [ts.p.sortname, idxcol, ts.p.sortorder]) === "stop") {
                    ts.p.lastsort = idxcol;
                    return
                }
                if ($.isFunction(ts.p.onSortCol)) {
                    if (ts.p.onSortCol.call(ts, ts.p.sortname, idxcol, ts.p.sortorder) === "stop") {
                        ts.p.lastsort = idxcol;
                        return
                    }
                }
                if (ts.p.datatype === "local") {
                    if (ts.p.deselectAfterSort) {
                        $(ts).jqGrid("resetSelection")
                    }
                } else {
                    ts.p.selrow = null;
                    if (ts.p.multiselect) {
                        setHeadCheckBox(false)
                    }
                    ts.p.selarrrow = [];
                    ts.p.savedRow = []
                }
                if (ts.p.scroll) {
                    var sscroll = ts.grid.bDiv.scrollLeft;
                    emptyRows.call(ts, true, false);
                    ts.grid.hDiv.scrollLeft = sscroll
                }
                if (ts.p.subGrid && ts.p.datatype === "local") {
                    $("td.sgexpanded", "#" + $.jgrid.jqID(ts.p.id)).each(function() {
                        $(this).trigger("click")
                    })
                }
                populate();
                ts.p.lastsort = idxcol;
                if (ts.p.sortname !== index && idxcol) {
                    ts.p.lastsort = idxcol
                }
            }
              , setColWidth = function() {
                var initwidth = 0, brd = $.jgrid.cell_width ? 0 : intNum(ts.p.cellLayout, 0), vc = 0, lvc, scw = intNum(ts.p.scrollOffset, 0), cw, hs = false, aw, gw = 0, cr;
                $.each(ts.p.colModel, function() {
                    if (this.hidden === undefined) {
                        this.hidden = false
                    }
                    if (ts.p.grouping && ts.p.autowidth) {
                        var ind = $.inArray(this.name, ts.p.groupingView.groupField);
                        if (ind >= 0 && ts.p.groupingView.groupColumnShow.length > ind) {
                            this.hidden = !ts.p.groupingView.groupColumnShow[ind]
                        }
                    }
                    this.widthOrg = cw = intNum(this.width, 0);
                    if (this.hidden === false) {
                        initwidth += cw + brd;
                        if (this.fixed) {
                            gw += cw + brd
                        } else {
                            vc++
                        }
                    }
                });
                if (isNaN(ts.p.width)) {
                    ts.p.width = initwidth + ((ts.p.shrinkToFit === false && !isNaN(ts.p.height)) ? scw : 0)
                }
                grid.width = ts.p.width;
                ts.p.tblwidth = initwidth;
                if (ts.p.shrinkToFit === false && ts.p.forceFit === true) {
                    ts.p.forceFit = false
                }
                if (ts.p.shrinkToFit === true && vc > 0) {
                    aw = grid.width - brd * vc - gw;
                    if (!isNaN(ts.p.height)) {
                        aw -= scw;
                        hs = true
                    }
                    initwidth = 0;
                    $.each(ts.p.colModel, function(i) {
                        if (this.hidden === false && !this.fixed) {
                            cw = Math.round(aw * this.width / (ts.p.tblwidth - brd * vc - gw));
                            this.width = cw;
                            initwidth += cw;
                            lvc = i
                        }
                    });
                    cr = 0;
                    if (hs) {
                        if (grid.width - gw - (initwidth + brd * vc) !== scw) {
                            cr = grid.width - gw - (initwidth + brd * vc) - scw
                        }
                    } else {
                        if (!hs && Math.abs(grid.width - gw - (initwidth + brd * vc)) !== 1) {
                            cr = grid.width - gw - (initwidth + brd * vc)
                        }
                    }
                    ts.p.colModel[lvc].width += cr;
                    ts.p.tblwidth = initwidth + cr + brd * vc + gw;
                    if (ts.p.tblwidth > ts.p.width) {
                        ts.p.colModel[lvc].width -= (ts.p.tblwidth - parseInt(ts.p.width, 10));
                        ts.p.tblwidth = ts.p.width
                    }
                }
            }
              , nextVisible = function(iCol) {
                var ret = iCol, j = iCol, i;
                for (i = iCol + 1; i < ts.p.colModel.length; i++) {
                    if (ts.p.colModel[i].hidden !== true) {
                        j = i;
                        break
                    }
                }
                return j - ret
            }
              , getOffset = function(iCol) {
                var $th = $(ts.grid.headers[iCol].el)
                  , ret = [$th.position().left + $th.outerWidth()];
                if (ts.p.direction === "rtl") {
                    ret[0] = ts.p.width - ret[0]
                }
                ret[0] -= ts.grid.bDiv.scrollLeft;
                ret.push($(ts.grid.hDiv).position().top);
                ret.push($(ts.grid.bDiv).offset().top - $(ts.grid.hDiv).offset().top + $(ts.grid.bDiv).height());
                return ret
            }
              , getColumnHeaderIndex = function(th) {
                var i, headers = ts.grid.headers, ci = $.jgrid.getCellIndex(th);
                for (i = 0; i < headers.length; i++) {
                    if (th === headers[i].el) {
                        ci = i;
                        break
                    }
                }
                return ci
            };
            this.p.id = this.id;
            if ($.inArray(ts.p.multikey, sortkeys) === -1) {
                ts.p.multikey = false
            }
            ts.p.keyIndex = false;
            ts.p.keyName = false;
            for (i = 0; i < ts.p.colModel.length; i++) {
                ts.p.colModel[i] = $.extend(true, {}, ts.p.cmTemplate, ts.p.colModel[i].template || {}, ts.p.colModel[i]);
                if (ts.p.keyIndex === false && ts.p.colModel[i].key === true) {
                    ts.p.keyIndex = i
                }
            }
            ts.p.sortorder = ts.p.sortorder.toLowerCase();
            $.jgrid.cell_width = $.jgrid.cellWidth();
            if (ts.p.grouping === true) {
                ts.p.scroll = false;
                ts.p.rownumbers = false;
                ts.p.treeGrid = false;
                ts.p.gridview = true
            }
            if (this.p.treeGrid === true) {
                try {
                    $(this).jqGrid("setTreeGrid")
                } catch (_) {}
                if (ts.p.datatype !== "local") {
                    ts.p.localReader = {
                        id: "_id_"
                    }
                }
            }
            if (this.p.subGrid) {
                try {
                    $(ts).jqGrid("setSubGrid")
                } catch (s) {}
            }
            if (this.p.multiselect) {
                this.p.colNames.unshift("<input role='checkbox' id='cb_" + this.p.id + "' class='cbox' type='checkbox' name='checkbox'/>");
                this.p.colModel.unshift({
                    name: "cb",
                    width: $.jgrid.cell_width ? ts.p.multiselectWidth + ts.p.cellLayout : ts.p.multiselectWidth,
                    sortable: false,
                    resizable: false,
                    hidedlg: true,
                    search: false,
                    align: "center",
                    fixed: true
                })
            }
            if (this.p.rownumbers) {
                this.p.colNames.unshift("");
                this.p.colModel.unshift({
                    name: "rn",
                    width: ts.p.rownumWidth,
                    sortable: false,
                    resizable: false,
                    hidedlg: true,
                    search: false,
                    align: "center",
                    fixed: true
                })
            }
            ts.p.xmlReader = $.extend(true, {
                root: "rows",
                row: "row",
                page: "rows>page",
                total: "rows>total",
                records: "rows>records",
                repeatitems: true,
                cell: "cell",
                id: "[id]",
                userdata: "userdata",
                subgrid: {
                    root: "rows",
                    row: "row",
                    repeatitems: true,
                    cell: "cell"
                }
            }, ts.p.xmlReader);
            ts.p.jsonReader = $.extend(true, {
                root: "rows",
                page: "page",
                total: "total",
                records: "records",
                repeatitems: true,
                cell: "cell",
                id: "id",
                userdata: "userdata",
                subgrid: {
                    root: "rows",
                    repeatitems: true,
                    cell: "cell"
                }
            }, ts.p.jsonReader);
            ts.p.localReader = $.extend(true, {
                root: "rows",
                page: "page",
                total: "total",
                records: "records",
                repeatitems: false,
                cell: "cell",
                id: "id",
                userdata: "userdata",
                subgrid: {
                    root: "rows",
                    repeatitems: true,
                    cell: "cell"
                }
            }, ts.p.localReader);
            if (ts.p.scroll) {
                ts.p.pgbuttons = false;
                ts.p.pginput = false;
                ts.p.rowList = []
            }
            if (ts.p.data.length) {
                refreshIndex()
            }
            var thead = "<thead><tr class='ui-jqgrid-labels' role='rowheader'>", tdc, idn, w, res, sort, td, ptr, tbody, imgs, iac = "", idc = "", sortarr = [], sortord = [], sotmp = [];
            if (ts.p.shrinkToFit === true && ts.p.forceFit === true) {
                for (i = ts.p.colModel.length - 1; i >= 0; i--) {
                    if (!ts.p.colModel[i].hidden) {
                        ts.p.colModel[i].resizable = false;
                        break
                    }
                }
            }
            if (ts.p.viewsortcols[1] === "horizontal") {
                iac = " ui-i-asc";
                idc = " ui-i-desc"
            }
            tdc = isMSIE ? "class='ui-th-div-ie'" : "";
            imgs = "<span class='s-ico' style='display:none'><span sort='asc' class='ui-grid-ico-sort ui-icon-asc" + iac + " ui-state-disabled ui-icon ui-icon-triangle-1-n ui-sort-" + dir + "'></span>";
            imgs += "<span sort='desc' class='ui-grid-ico-sort ui-icon-desc" + idc + " ui-state-disabled ui-icon ui-icon-triangle-1-s ui-sort-" + dir + "'></span></span>";
            if (ts.p.multiSort) {
                sortarr = ts.p.sortname.split(",");
                for (i = 0; i < sortarr.length; i++) {
                    sotmp = $.trim(sortarr[i]).split(" ");
                    sortarr[i] = $.trim(sotmp[0]);
                    sortord[i] = sotmp[1] ? $.trim(sotmp[1]) : ts.p.sortorder || "asc"
                }
            }
            for (i = 0; i < this.p.colNames.length; i++) {
                var tooltip = ts.p.headertitles ? (' title="' + $.jgrid.stripHtml(ts.p.colNames[i]) + '"') : "";
                thead += "<th id='" + ts.p.id + "_" + ts.p.colModel[i].name + "' role='columnheader' class='ui-state-default ui-th-column ui-th-" + dir + "'" + tooltip + ">";
                idn = ts.p.colModel[i].index || ts.p.colModel[i].name;
                thead += "<div id='jqgh_" + ts.p.id + "_" + ts.p.colModel[i].name + "' " + tdc + ">" + ts.p.colNames[i];
                if (!ts.p.colModel[i].width) {
                    ts.p.colModel[i].width = 150
                } else {
                    ts.p.colModel[i].width = parseInt(ts.p.colModel[i].width, 10)
                }
                if (typeof ts.p.colModel[i].title !== "boolean") {
                    ts.p.colModel[i].title = true
                }
                ts.p.colModel[i].lso = "";
                if (idn === ts.p.sortname) {
                    ts.p.lastsort = i
                }
                if (ts.p.multiSort) {
                    sotmp = $.inArray(idn, sortarr);
                    if (sotmp !== -1) {
                        ts.p.colModel[i].lso = sortord[sotmp]
                    }
                }
                thead += imgs + "</div></th>"
            }
            thead += "</tr></thead>";
            imgs = null;
            $(this).append(thead);
            $("thead tr:first th", this).hover(function() {
                $(this).addClass("ui-state-hover")
            }, function() {
                $(this).removeClass("ui-state-hover")
            });
            if (this.p.multiselect) {
                var emp = [], chk;
                $("#cb_" + $.jgrid.jqID(ts.p.id), this).bind("click", function() {
                    ts.p.selarrrow = [];
                    var froz = ts.p.frozenColumns === true ? ts.p.id + "_frozen" : "";
                    if (this.checked) {
                        $(ts.rows).each(function(i) {
                            if (i > 0) {
                                if (!$(this).hasClass("ui-subgrid") && !$(this).hasClass("jqgroup") && !$(this).hasClass("ui-state-disabled")) {
                                    $("#jqg_" + $.jgrid.jqID(ts.p.id) + "_" + $.jgrid.jqID(this.id))[ts.p.useProp ? "prop" : "attr"]("checked", true);
                                    $(this).addClass("ui-state-highlight").attr("aria-selected", "true");
                                    ts.p.selarrrow.push(this.id);
                                    ts.p.selrow = this.id;
                                    if (froz) {
                                        $("#jqg_" + $.jgrid.jqID(ts.p.id) + "_" + $.jgrid.jqID(this.id), ts.grid.fbDiv)[ts.p.useProp ? "prop" : "attr"]("checked", true);
                                        $("#" + $.jgrid.jqID(this.id), ts.grid.fbDiv).addClass("ui-state-highlight")
                                    }
                                }
                            }
                        });
                        chk = true;
                        emp = []
                    } else {
                        $(ts.rows).each(function(i) {
                            if (i > 0) {
                                if (!$(this).hasClass("ui-subgrid") && !$(this).hasClass("ui-state-disabled")) {
                                    $("#jqg_" + $.jgrid.jqID(ts.p.id) + "_" + $.jgrid.jqID(this.id))[ts.p.useProp ? "prop" : "attr"]("checked", false);
                                    $(this).removeClass("ui-state-highlight").attr("aria-selected", "false");
                                    emp.push(this.id);
                                    if (froz) {
                                        $("#jqg_" + $.jgrid.jqID(ts.p.id) + "_" + $.jgrid.jqID(this.id), ts.grid.fbDiv)[ts.p.useProp ? "prop" : "attr"]("checked", false);
                                        $("#" + $.jgrid.jqID(this.id), ts.grid.fbDiv).removeClass("ui-state-highlight")
                                    }
                                }
                            }
                        });
                        ts.p.selrow = null;
                        chk = false
                    }
                    $(ts).triggerHandler("jqGridSelectAll", [chk ? ts.p.selarrrow : emp, chk]);
                    if ($.isFunction(ts.p.onSelectAll)) {
						if (ts.p.selarrrow.length == 2 && !ts.p.selarrrow[0] && !ts.p.selarrrow[1]) {
							ts.p.selarrrow = [];
						}
                        ts.p.onSelectAll.call(ts, chk ? ts.p.selarrrow : emp, chk)
                    }
                })
            }
            if (ts.p.autowidth === true) {
                var pw = $(eg).innerWidth();
                ts.p.width = pw > 0 ? pw : "nw"
            }
            setColWidth();
            $(eg).css("width", grid.width + "px").append("<div class='ui-jqgrid-resize-mark' id='rs_m" + ts.p.id + "'>&#160;</div>");
            $(gv).css("width", grid.width + "px");
            thead = $("thead:first", ts).get(0);
            var tfoot = "";
            if (ts.p.footerrow) {
                tfoot += "<table role='grid' style='width:" + ts.p.tblwidth + "px' class='ui-jqgrid-ftable' cellspacing='0' cellpadding='0' border='0'><tbody><tr role='row' class='ui-widget-content footrow footrow-" + dir + "'>"
            }
            var thr = $("tr:first", thead)
              , firstr = "<tr class='jqgfirstrow' role='row' style='height:auto'>";
            ts.p.disableClick = false;
            $("th", thr).each(function(j) {
                w = ts.p.colModel[j].width;
                if (ts.p.colModel[j].resizable === undefined) {
                    ts.p.colModel[j].resizable = true
                }
                if (ts.p.colModel[j].resizable) {
                    res = document.createElement("span");
                    $(res).html("&#160;").addClass("ui-jqgrid-resize ui-jqgrid-resize-" + dir).css("cursor", "col-resize");
                    $(this).addClass(ts.p.resizeclass)
                } else {
                    res = ""
                }
                $(this).css("width", w + "px").prepend(res);
                res = null;
                var hdcol = "";
                if (ts.p.colModel[j].hidden) {
                    $(this).css("display", "none");
                    hdcol = "display:none;"
                }
                firstr += "<td role='gridcell' style='height:0px;width:" + w + "px;" + hdcol + "'></td>";
                grid.headers[j] = {
                    width: w,
                    el: this
                };
                sort = ts.p.colModel[j].sortable;
                if (typeof sort !== "boolean") {
                    ts.p.colModel[j].sortable = true;
                    sort = true
                }
                var nm = ts.p.colModel[j].name;
                if (!(nm === "cb" || nm === "subgrid" || nm === "rn")) {
                    if (ts.p.viewsortcols[2]) {
                        $(">div", this).addClass("ui-jqgrid-sortable")
                    }
                }
                if (sort) {
                    if (ts.p.multiSort) {
                        if (ts.p.viewsortcols[0]) {
                            $("div span.s-ico", this).show();
                            if (ts.p.colModel[j].lso) {
                                $("div span.ui-icon-" + ts.p.colModel[j].lso, this).removeClass("ui-state-disabled")
                            }
                        } else {
                            if (ts.p.colModel[j].lso) {
                                $("div span.s-ico", this).show();
                                $("div span.ui-icon-" + ts.p.colModel[j].lso, this).removeClass("ui-state-disabled")
                            }
                        }
                    } else {
                        if (ts.p.viewsortcols[0]) {
                            $("div span.s-ico", this).show();
                            if (j === ts.p.lastsort) {
                                $("div span.ui-icon-" + ts.p.sortorder, this).removeClass("ui-state-disabled")
                            }
                        } else {
                            if (j === ts.p.lastsort) {
                                $("div span.s-ico", this).show();
                                $("div span.ui-icon-" + ts.p.sortorder, this).removeClass("ui-state-disabled")
                            }
                        }
                    }
                }
                if (ts.p.footerrow) {
                    tfoot += "<td role='gridcell' " + formatCol(j, 0, "", null, "", false) + ">&#160;</td>"
                }
            }).mousedown(function(e) {
                if ($(e.target).closest("th>span.ui-jqgrid-resize").length !== 1) {
                    return
                }
                var ci = getColumnHeaderIndex(this);
                if (ts.p.forceFit === true) {
                    ts.p.nv = nextVisible(ci)
                }
                grid.dragStart(ci, e, getOffset(ci));
                return false
            }).click(function(e) {
                if (ts.p.disableClick) {
                    ts.p.disableClick = false;
                    return false
                }
                var s = "th>div.ui-jqgrid-sortable", r, d;
                if (!ts.p.viewsortcols[2]) {
                    s = "th>div>span>span.ui-grid-ico-sort"
                }
                var t = $(e.target).closest(s);
                if (t.length !== 1) {
                    return
                }
                var ci;
                if (ts.p.frozenColumns) {
                    var tid = $(this)[0].id.substring(ts.p.id.length + 1);
                    $(ts.p.colModel).each(function(i) {
                        if (this.name === tid) {
                            ci = i;
                            return false
                        }
                    })
                } else {
                    ci = getColumnHeaderIndex(this)
                }
                if (!ts.p.viewsortcols[2]) {
                    r = true;
                    d = t.attr("sort")
                }
                if (ci != null) {
                    sortData($("div", this)[0].id, ci, r, d, this)
                }
                return false
            });
            if (ts.p.sortable && $.fn.sortable) {
                try {
                    $(ts).jqGrid("sortableColumns", thr)
                } catch (e) {}
            }
            if (ts.p.footerrow) {
                tfoot += "</tr></tbody></table>"
            }
            firstr += "</tr>";
            tbody = document.createElement("tbody");
            this.appendChild(tbody);
            $(this).addClass("ui-jqgrid-btable").append(firstr);
            firstr = null;
            var hTable = $("<table class='ui-jqgrid-htable' style='width:" + ts.p.tblwidth + "px' role='grid' aria-labelledby='gbox_" + this.id + "' cellspacing='0' cellpadding='0' border='0'></table>").append(thead)
              , hg = (ts.p.caption && ts.p.hiddengrid === true) ? true : false
              , hb = $("<div class='ui-jqgrid-hbox" + (dir === "rtl" ? "-rtl" : "") + "'></div>");
            thead = null;
            grid.hDiv = document.createElement("div");
            $(grid.hDiv).css({
                width: grid.width + "px"
            }).addClass("ui-state-default ui-jqgrid-hdiv").append(hb);
            $(hb).append(hTable);
            hTable = null;
            if (hg) {
                $(grid.hDiv).hide()
            }
            if (ts.p.pager) {
                if (typeof ts.p.pager === "string") {
                    if (ts.p.pager.substr(0, 1) !== "#") {
                        ts.p.pager = "#" + ts.p.pager
                    }
                } else {
                    ts.p.pager = "#" + $(ts.p.pager).attr("id")
                }
                $(ts.p.pager).css({
                    width: grid.width + "px"
                }).addClass("ui-state-default ui-jqgrid-pager ui-corner-bottom").appendTo(eg);
                if (hg) {
                    $(ts.p.pager).hide()
                }
                setPager(ts.p.pager, "")
            }
            if (ts.p.cellEdit === false && ts.p.hoverrows === true) {
                $(ts).bind("mouseover", function(e) {
                    ptr = $(e.target).closest("tr.jqgrow");
                    if ($(ptr).attr("class") !== "ui-subgrid") {
                        $(ptr).addClass("ui-state-hover")
                    }
                }).bind("mouseout", function(e) {
                    ptr = $(e.target).closest("tr.jqgrow");
                    $(ptr).removeClass("ui-state-hover")
                })
            }
            var ri, ci, tdHtml;
            $(ts).before(grid.hDiv).click(function(e) {
                td = e.target;
                ptr = $(td, ts.rows).closest("tr.jqgrow");
                if ($(ptr).length === 0 || ptr[0].className.indexOf("ui-state-disabled") > -1 || ($(td, ts).closest("table.ui-jqgrid-btable").attr("id") || "").replace("_frozen", "") !== ts.id) {
                    return this
                }
                var scb = $(td).hasClass("cbox")
                  , cSel = $(ts).triggerHandler("jqGridBeforeSelectRow", [ptr[0].id, e]);
                cSel = (cSel === false || cSel === "stop") ? false : true;
                if (cSel && $.isFunction(ts.p.beforeSelectRow)) {
                    cSel = ts.p.beforeSelectRow.call(ts, ptr[0].id, e)
                }
                if (td.tagName === "A" || ((td.tagName === "INPUT" || td.tagName === "TEXTAREA" || td.tagName === "OPTION" || td.tagName === "SELECT") && !scb)) {
                    return
                }
                if (cSel === true) {
                    ri = ptr[0].id;
                    ci = $.jgrid.getCellIndex(td);
                    tdHtml = $(td).closest("td,th").html();
                    $(ts).triggerHandler("jqGridCellSelect", [ri, ci, tdHtml, e]);
                    if ($.isFunction(ts.p.onCellSelect)) {
                        ts.p.onCellSelect.call(ts, ri, ci, tdHtml, e)
                    }
                    if (ts.p.cellEdit === true) {
                        if (ts.p.multiselect && scb) {
                            $(ts).jqGrid("setSelection", ri, true, e)
                        } else {
                            ri = ptr[0].rowIndex;
                            try {
                                $(ts).jqGrid("editCell", ri, ci, true)
                            } catch (_) {}
                        }
                    } else {
                        if (!ts.p.multikey) {
                            if (ts.p.multiselect && ts.p.multiboxonly) {
                                if (scb) {
                                    $(ts).jqGrid("setSelection", ri, true, e)
                                } else {
                                    var frz = ts.p.frozenColumns ? ts.p.id + "_frozen" : "";
                                    $(ts.p.selarrrow).each(function(i, n) {
                                        var trid = $(ts).jqGrid("getGridRowById", n);
                                        $(trid).removeClass("ui-state-highlight");
                                        $("#jqg_" + $.jgrid.jqID(ts.p.id) + "_" + $.jgrid.jqID(n))[ts.p.useProp ? "prop" : "attr"]("checked", false);
                                        if (frz) {
                                            $("#" + $.jgrid.jqID(n), "#" + $.jgrid.jqID(frz)).removeClass("ui-state-highlight");
                                            $("#jqg_" + $.jgrid.jqID(ts.p.id) + "_" + $.jgrid.jqID(n), "#" + $.jgrid.jqID(frz))[ts.p.useProp ? "prop" : "attr"]("checked", false)
                                        }
                                    });
                                    ts.p.selarrrow = [];
                                    $(ts).jqGrid("setSelection", ri, true, e)
                                }
                            } else {
                                $(ts).jqGrid("setSelection", ri, true, e)
                            }
                        } else {
                            if (e[ts.p.multikey]) {
                                $(ts).jqGrid("setSelection", ri, true, e)
                            } else {
                                if (ts.p.multiselect && scb) {
                                    scb = $("#jqg_" + $.jgrid.jqID(ts.p.id) + "_" + ri).is(":checked");
                                    $("#jqg_" + $.jgrid.jqID(ts.p.id) + "_" + ri)[ts.p.useProp ? "prop" : "attr"]("checked", scb)
                                }
                            }
                        }
                    }
                }
            }).bind("reloadGrid", function(e, opts) {
                if (ts.p.treeGrid === true) {
                    ts.p.datatype = ts.p.treedatatype
                }
                if (opts && opts.current) {
                    ts.grid.selectionPreserver(ts)
                }
                if (ts.p.datatype === "local") {
                    $(ts).jqGrid("resetSelection");
                    if (ts.p.data.length) {
                        refreshIndex()
                    }
                } else {
                    if (!ts.p.treeGrid) {
                        ts.p.selrow = null;
                        if (ts.p.multiselect) {
                            ts.p.selarrrow = [];
                            setHeadCheckBox(false)
                        }
                        ts.p.savedRow = []
                    }
                }
                if (ts.p.scroll) {
                    emptyRows.call(ts, true, false)
                }
                if (opts && opts.page) {
                    var page = opts.page;
                    if (page > ts.p.lastpage) {
                        page = ts.p.lastpage
                    }
                    if (page < 1) {
                        page = 1
                    }
                    ts.p.page = page;
                    if (ts.grid.prevRowHeight) {
                        ts.grid.bDiv.scrollTop = (page - 1) * ts.grid.prevRowHeight * ts.p.rowNum
                    } else {
                        ts.grid.bDiv.scrollTop = 0
                    }
                }
                if (ts.grid.prevRowHeight && ts.p.scroll) {
                    delete ts.p.lastpage;
                    ts.grid.populateVisible()
                } else {
                    ts.grid.populate()
                }
                if (ts.p._inlinenav === true) {
                    $(ts).jqGrid("showAddEditButtons")
                }
                return false
            }).dblclick(function(e) {
                td = e.target;
                ptr = $(td, ts.rows).closest("tr.jqgrow");
                if ($(ptr).length === 0) {
                    return
                }
                ri = ptr[0].rowIndex;
                ci = $.jgrid.getCellIndex(td);
                $(ts).triggerHandler("jqGridDblClickRow", [$(ptr).attr("id"), ri, ci, e]);
                if ($.isFunction(ts.p.ondblClickRow)) {
                    ts.p.ondblClickRow.call(ts, $(ptr).attr("id"), ri, ci, e)
                }
            }).bind("contextmenu", function(e) {
                td = e.target;
                ptr = $(td, ts.rows).closest("tr.jqgrow");
                if ($(ptr).length === 0) {
                    return
                }
                if (!ts.p.multiselect) {
                    $(ts).jqGrid("setSelection", ptr[0].id, true, e)
                }
                ri = ptr[0].rowIndex;
                ci = $.jgrid.getCellIndex(td);
                $(ts).triggerHandler("jqGridRightClickRow", [$(ptr).attr("id"), ri, ci, e]);
                if ($.isFunction(ts.p.onRightClickRow)) {
                    ts.p.onRightClickRow.call(ts, $(ptr).attr("id"), ri, ci, e)
                }
            });
            grid.bDiv = document.createElement("div");
            if (isMSIE) {
                if (String(ts.p.height).toLowerCase() === "auto") {
                    ts.p.height = "100%"
                }
            }
            $(grid.bDiv).append($('<div style="position:relative;' + (isMSIE && $.jgrid.msiever() < 8 ? "height:0.01%;" : "") + '"></div>').append("<div></div>").append(this)).addClass("ui-jqgrid-bdiv").css({
                height: ts.p.height + (isNaN(ts.p.height) ? "" : "px"),
                width: (grid.width) + "px"
            }).scroll(grid.scrollGrid);
            $("table:first", grid.bDiv).css({
                width: ts.p.tblwidth + "px"
            });
            if (!$.support.tbody) {
                if ($("tbody", this).length === 2) {
                    $("tbody:gt(0)", this).remove()
                }
            }
            if (ts.p.multikey) {
                if ($.jgrid.msie) {
                    $(grid.bDiv).bind("selectstart", function() {
                        return false
                    })
                } else {
                    $(grid.bDiv).bind("mousedown", function() {
                        return false
                    })
                }
            }
            if (hg) {
                $(grid.bDiv).hide()
            }
            grid.cDiv = document.createElement("div");
            var arf = ts.p.hidegrid === true ? $("<a role='link' class='ui-jqgrid-titlebar-close ui-corner-all HeaderButton' />").hover(function() {
                arf.addClass("ui-state-hover")
            }, function() {
                arf.removeClass("ui-state-hover")
            }).append("<span class='ui-icon ui-icon-circle-triangle-n'></span>").css((dir === "rtl" ? "left" : "right"), "0px") : "";
            $(grid.cDiv).append(arf).append("<span class='ui-jqgrid-title'>" + ts.p.caption + "</span>").addClass("ui-jqgrid-titlebar ui-jqgrid-caption" + (dir === "rtl" ? "-rtl" : "") + " ui-widget-header ui-corner-top ui-helper-clearfix");
            $(grid.cDiv).insertBefore(grid.hDiv);
            if (ts.p.toolbar[0]) {
                grid.uDiv = document.createElement("div");
                if (ts.p.toolbar[1] === "top") {
                    $(grid.uDiv).insertBefore(grid.hDiv)
                } else {
                    if (ts.p.toolbar[1] === "bottom") {
                        $(grid.uDiv).insertAfter(grid.hDiv)
                    }
                }
                if (ts.p.toolbar[1] === "both") {
                    grid.ubDiv = document.createElement("div");
                    $(grid.uDiv).addClass("ui-userdata ui-state-default").attr("id", "t_" + this.id).insertBefore(grid.hDiv);
                    $(grid.ubDiv).addClass("ui-userdata ui-state-default").attr("id", "tb_" + this.id).insertAfter(grid.hDiv);
                    if (hg) {
                        $(grid.ubDiv).hide()
                    }
                } else {
                    $(grid.uDiv).width(grid.width).addClass("ui-userdata ui-state-default").attr("id", "t_" + this.id)
                }
                if (hg) {
                    $(grid.uDiv).hide()
                }
            }
            if (ts.p.toppager) {
                ts.p.toppager = $.jgrid.jqID(ts.p.id) + "_toppager";
                grid.topDiv = $("<div id='" + ts.p.toppager + "'></div>")[0];
                ts.p.toppager = "#" + ts.p.toppager;
                $(grid.topDiv).addClass("ui-state-default ui-jqgrid-toppager").width(grid.width).insertBefore(grid.hDiv);
                setPager(ts.p.toppager, "_t")
            }
            if (ts.p.footerrow) {
                grid.sDiv = $("<div class='ui-jqgrid-sdiv'></div>")[0];
                hb = $("<div class='ui-jqgrid-hbox" + (dir === "rtl" ? "-rtl" : "") + "'></div>");
                $(grid.sDiv).append(hb).width(grid.width).insertAfter(grid.hDiv);
                $(hb).append(tfoot);
                grid.footers = $(".ui-jqgrid-ftable", grid.sDiv)[0].rows[0].cells;
                if (ts.p.rownumbers) {
                    grid.footers[0].className = "ui-state-default jqgrid-rownum"
                }
                if (hg) {
                    $(grid.sDiv).hide()
                }
            }
            hb = null;
            if (ts.p.caption) {
                var tdt = ts.p.datatype;
                if (ts.p.hidegrid === true) {
                    $(".ui-jqgrid-titlebar-close", grid.cDiv).click(function(e) {
                        var onHdCl = $.isFunction(ts.p.onHeaderClick), elems = ".ui-jqgrid-bdiv, .ui-jqgrid-hdiv, .ui-jqgrid-pager, .ui-jqgrid-sdiv", counter, self = this;
                        if (ts.p.toolbar[0] === true) {
                            if (ts.p.toolbar[1] === "both") {
                                elems += ", #" + $(grid.ubDiv).attr("id")
                            }
                            elems += ", #" + $(grid.uDiv).attr("id")
                        }
                        counter = $(elems, "#gview_" + $.jgrid.jqID(ts.p.id)).length;
                        if (ts.p.gridstate === "visible") {
                            $(elems, "#gbox_" + $.jgrid.jqID(ts.p.id)).slideUp("fast", function() {
                                counter--;
                                if (counter === 0) {
                                    $("span", self).removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s");
                                    ts.p.gridstate = "hidden";
                                    if ($("#gbox_" + $.jgrid.jqID(ts.p.id)).hasClass("ui-resizable")) {
                                        $(".ui-resizable-handle", "#gbox_" + $.jgrid.jqID(ts.p.id)).hide()
                                    }
                                    $(ts).triggerHandler("jqGridHeaderClick", [ts.p.gridstate, e]);
                                    if (onHdCl) {
                                        if (!hg) {
                                            ts.p.onHeaderClick.call(ts, ts.p.gridstate, e)
                                        }
                                    }
                                }
                            })
                        } else {
                            if (ts.p.gridstate === "hidden") {
                                $(elems, "#gbox_" + $.jgrid.jqID(ts.p.id)).slideDown("fast", function() {
                                    counter--;
                                    if (counter === 0) {
                                        $("span", self).removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n");
                                        if (hg) {
                                            ts.p.datatype = tdt;
                                            populate();
                                            hg = false
                                        }
                                        ts.p.gridstate = "visible";
                                        if ($("#gbox_" + $.jgrid.jqID(ts.p.id)).hasClass("ui-resizable")) {
                                            $(".ui-resizable-handle", "#gbox_" + $.jgrid.jqID(ts.p.id)).show()
                                        }
                                        $(ts).triggerHandler("jqGridHeaderClick", [ts.p.gridstate, e]);
                                        if (onHdCl) {
                                            if (!hg) {
                                                ts.p.onHeaderClick.call(ts, ts.p.gridstate, e)
                                            }
                                        }
                                    }
                                })
                            }
                        }
                        return false
                    });
                    if (hg) {
                        ts.p.datatype = "local";
                        $(".ui-jqgrid-titlebar-close", grid.cDiv).trigger("click")
                    }
                }
            } else {
                $(grid.cDiv).hide()
            }
            $(grid.hDiv).after(grid.bDiv).mousemove(function(e) {
                if (grid.resizing) {
                    grid.dragMove(e);
                    return false
                }
            });
            $(".ui-jqgrid-labels", grid.hDiv).bind("selectstart", function() {
                return false
            });
            $(document).bind("mouseup.jqGrid" + ts.p.id, function() {
                if (grid.resizing) {
                    grid.dragEnd();
                    return false
                }
                return true
            });
            ts.formatCol = formatCol;
            ts.sortData = sortData;
            ts.updatepager = updatepager;
            ts.setScrollbar = setScrollbar;
            ts.refreshIndex = refreshIndex;
            ts.setHeadCheckBox = setHeadCheckBox;
            ts.constructTr = constructTr;
            ts.formatter = function(rowId, cellval, colpos, rwdat, act) {
                return formatter(rowId, cellval, colpos, rwdat, act)
            }
            ;
            $.extend(grid, {
                populate: populate,
                emptyRows: emptyRows,
                beginReq: beginReq,
                endReq: endReq
            });
            this.grid = grid;
            ts.addXmlData = function(d) {
                addXmlData(d, ts.grid.bDiv)
            }
            ;
            ts.addJSONData = function(d) {
                addJSONData(d, ts.grid.bDiv)
            }
            ;
            this.grid.cols = this.rows[0].cells;
            $(ts).triggerHandler("jqGridInitGrid");
            if ($.isFunction(ts.p.onInitGrid)) {
                ts.p.onInitGrid.call(ts)
            }
            populate();
            ts.p.hiddengrid = false
        })
    }
    ;
    $.jgrid.extend({
        getGridParam: function(pName) {
            var $t = this[0];
            if (!$t || !$t.grid) {
                return
            }
            if (!pName) {
                return $t.p
            }
            return $t.p[pName] !== undefined ? $t.p[pName] : null
        },
        setGridParam: function(newParams) {
            return this.each(function() {
                if (this.grid && typeof newParams === "object") {
                    var $this = this;
                    $.each(newParams, function(key, val) {
                        delete $this.p[key]
                    });
                    $.extend(true, this.p, newParams)
                }
            })
        },
        getGridRowById: function(rowid) {
            var row;
            this.each(function() {
                try {
                    var i = this.rows.length;
                    while (i--) {
                        if (rowid.toString() === this.rows[i].id) {
                            row = this.rows[i];
                            break
                        }
                    }
                } catch (e) {
                    row = $(this.grid.bDiv).find("#" + $.jgrid.jqID(rowid))
                }
            });
            return row
        },
        getDataIDs: function() {
            var ids = [], i = 0, len, j = 0;
            this.each(function() {
                len = this.rows.length;
                if (len && len > 0) {
                    while (i < len) {
                        if ($(this.rows[i]).hasClass("jqgrow")) {
                            ids[j] = this.rows[i].id;
                            j++
                        }
                        i++
                    }
                }
            });
            return ids
        },
        setSelection: function(selection, onsr, e) {
            return this.each(function() {
                var $t = this, stat, pt, ner, ia, tpsr, fid;
                if (selection === undefined) {
                    return
                }
                onsr = onsr === false ? false : true;
                pt = $($t).jqGrid("getGridRowById", selection);
                if (!pt || !pt.className || pt.className.indexOf("ui-state-disabled") > -1) {
                    return
                }
                function scrGrid(iR) {
                    var ch = $($t.grid.bDiv)[0].clientHeight
                      , st = $($t.grid.bDiv)[0].scrollTop
                      , rpos = $($t.rows[iR]).position().top
                      , rh = $t.rows[iR].clientHeight;
                    if (rpos + rh >= ch + st) {
                        $($t.grid.bDiv)[0].scrollTop = rpos - (ch + st) + rh + st
                    } else {
                        if (rpos < ch + st) {
                            if (rpos < st) {
                                $($t.grid.bDiv)[0].scrollTop = rpos
                            }
                        }
                    }
                }
                if ($t.p.scrollrows === true) {
                    ner = $($t).jqGrid("getGridRowById", selection).rowIndex;
                    if (ner >= 0) {
                        scrGrid(ner)
                    }
                }
                if ($t.p.frozenColumns === true) {
                    fid = $t.p.id + "_frozen"
                }
                if (!$t.p.multiselect) {
                    if (pt.className !== "ui-subgrid") {
                        if ($t.p.selrow !== pt.id) {
                            $($($t).jqGrid("getGridRowById", $t.p.selrow)).removeClass("ui-state-highlight").attr({
                                "aria-selected": "false",
                                tabindex: "-1"
                            });
                            $(pt).addClass("ui-state-highlight").attr({
                                "aria-selected": "true",
                                tabindex: "0"
                            });
                            if (fid) {
                                $("#" + $.jgrid.jqID($t.p.selrow), "#" + $.jgrid.jqID(fid)).removeClass("ui-state-highlight");
                                $("#" + $.jgrid.jqID(selection), "#" + $.jgrid.jqID(fid)).addClass("ui-state-highlight")
                            }
                            stat = true
                        } else {
                            stat = false
                        }
                        $t.p.selrow = pt.id;
                        if (onsr) {
                            $($t).triggerHandler("jqGridSelectRow", [pt.id, stat, e]);
                            if ($t.p.onSelectRow) {
                                $t.p.onSelectRow.call($t, pt.id, stat, e)
                            }
                        }
                    }
                } else {
                    $t.setHeadCheckBox(false);
                    $t.p.selrow = pt.id;
                    ia = $.inArray($t.p.selrow, $t.p.selarrrow);
                    if (ia === -1) {
                        if (pt.className !== "ui-subgrid") {
                            $(pt).addClass("ui-state-highlight").attr("aria-selected", "true")
                        }
                        stat = true;
                        $t.p.selarrrow.push($t.p.selrow)
                    } else {
                        if (pt.className !== "ui-subgrid") {
                            $(pt).removeClass("ui-state-highlight").attr("aria-selected", "false")
                        }
                        stat = false;
                        $t.p.selarrrow.splice(ia, 1);
                        tpsr = $t.p.selarrrow[0];
                        $t.p.selrow = (tpsr === undefined) ? null : tpsr
                    }
                    $("#jqg_" + $.jgrid.jqID($t.p.id) + "_" + $.jgrid.jqID(pt.id))[$t.p.useProp ? "prop" : "attr"]("checked", stat);
                    if (fid) {
                        if (ia === -1) {
                            $("#" + $.jgrid.jqID(selection), "#" + $.jgrid.jqID(fid)).addClass("ui-state-highlight")
                        } else {
                            $("#" + $.jgrid.jqID(selection), "#" + $.jgrid.jqID(fid)).removeClass("ui-state-highlight")
                        }
                        $("#jqg_" + $.jgrid.jqID($t.p.id) + "_" + $.jgrid.jqID(selection), "#" + $.jgrid.jqID(fid))[$t.p.useProp ? "prop" : "attr"]("checked", stat)
                    }
                    if (onsr) {
                        $($t).triggerHandler("jqGridSelectRow", [pt.id, stat, e]);
                        if ($t.p.onSelectRow) {
                            $t.p.onSelectRow.call($t, pt.id, stat, e)
                        }
                    }
                }
            })
        },
        resetSelection: function(rowid) {
            return this.each(function() {
                var t = this, sr, fid;
                if (t.p.frozenColumns === true) {
                    fid = t.p.id + "_frozen"
                }
                if (rowid !== undefined) {
                    sr = rowid === t.p.selrow ? t.p.selrow : rowid;
                    $("#" + $.jgrid.jqID(t.p.id) + " tbody:first tr#" + $.jgrid.jqID(sr)).removeClass("ui-state-highlight").attr("aria-selected", "false");
                    if (fid) {
                        $("#" + $.jgrid.jqID(sr), "#" + $.jgrid.jqID(fid)).removeClass("ui-state-highlight")
                    }
                    if (t.p.multiselect) {
                        $("#jqg_" + $.jgrid.jqID(t.p.id) + "_" + $.jgrid.jqID(sr), "#" + $.jgrid.jqID(t.p.id))[t.p.useProp ? "prop" : "attr"]("checked", false);
                        if (fid) {
                            $("#jqg_" + $.jgrid.jqID(t.p.id) + "_" + $.jgrid.jqID(sr), "#" + $.jgrid.jqID(fid))[t.p.useProp ? "prop" : "attr"]("checked", false)
                        }
                        t.setHeadCheckBox(false)
                    }
                    sr = null
                } else {
                    if (!t.p.multiselect) {
                        if (t.p.selrow) {
                            $("#" + $.jgrid.jqID(t.p.id) + " tbody:first tr#" + $.jgrid.jqID(t.p.selrow)).removeClass("ui-state-highlight").attr("aria-selected", "false");
                            if (fid) {
                                $("#" + $.jgrid.jqID(t.p.selrow), "#" + $.jgrid.jqID(fid)).removeClass("ui-state-highlight")
                            }
                            t.p.selrow = null
                        }
                    } else {
                        $(t.p.selarrrow).each(function(i, n) {
                            $($(t).jqGrid("getGridRowById", n)).removeClass("ui-state-highlight").attr("aria-selected", "false");
                            $("#jqg_" + $.jgrid.jqID(t.p.id) + "_" + $.jgrid.jqID(n))[t.p.useProp ? "prop" : "attr"]("checked", false);
                            if (fid) {
                                $("#" + $.jgrid.jqID(n), "#" + $.jgrid.jqID(fid)).removeClass("ui-state-highlight");
                                $("#jqg_" + $.jgrid.jqID(t.p.id) + "_" + $.jgrid.jqID(n), "#" + $.jgrid.jqID(fid))[t.p.useProp ? "prop" : "attr"]("checked", false)
                            }
                        });
                        t.setHeadCheckBox(false);
                        t.p.selarrrow = [];
                        t.p.selrow = null
                    }
                }
                if (t.p.cellEdit === true) {
                    if (parseInt(t.p.iCol, 10) >= 0 && parseInt(t.p.iRow, 10) >= 0) {
                        $("td:eq(" + t.p.iCol + ")", t.rows[t.p.iRow]).removeClass("edit-cell ui-state-highlight");
                        $(t.rows[t.p.iRow]).removeClass("selected-row ui-state-hover")
                    }
                }
                t.p.savedRow = []
            })
        },
        getRowData: function(rowid) {
            var res = {}, resall, getall = false, len, j = 0;
            this.each(function() {
                var $t = this, nm, ind;
                if (rowid === undefined) {
                    getall = true;
                    resall = [];
                    len = $t.rows.length
                } else {
                    ind = $($t).jqGrid("getGridRowById", rowid);
                    if (!ind) {
                        return res
                    }
                    len = 2
                }
                while (j < len) {
                    if (getall) {
                        ind = $t.rows[j]
                    }
                    if ($(ind).hasClass("jqgrow")) {
                        $('td[role="gridcell"]', ind).each(function(i) {
                            nm = $t.p.colModel[i].name;
                            if (nm !== "cb" && nm !== "subgrid" && nm !== "rn") {
                                if ($t.p.treeGrid === true && nm === $t.p.ExpandColumn) {
                                    res[nm] = $.jgrid.htmlDecode($("span:first", this).html())
                                } else {
                                    try {
                                        res[nm] = $.unformat.call($t, this, {
                                            rowId: ind.id,
                                            colModel: $t.p.colModel[i]
                                        }, i)
                                    } catch (e) {
                                        res[nm] = $.jgrid.htmlDecode($(this).html())
                                    }
                                }
                            }
                        });
                        if (getall) {
                            resall.push(res);
                            res = {}
                        }
                    }
                    j++
                }
            });
            return resall || res
        },
        delRowData: function(rowid) {
            var success = false, rowInd, ia;
            this.each(function() {
                var $t = this;
                rowInd = $($t).jqGrid("getGridRowById", rowid);
                if (!rowInd) {
                    return false
                }
                $(rowInd).remove();
                $t.p.records--;
                $t.p.reccount--;
                $t.updatepager(true, false);
                $t.setScrollbar();
                success = true;
                if ($t.p.multiselect) {
                    ia = $.inArray(rowid, $t.p.selarrrow);
                    if (ia !== -1) {
                        $t.p.selarrrow.splice(ia, 1)
                    }
                }
                if ($t.p.multiselect && $t.p.selarrrow.length > 0) {
                    $t.p.selrow = $t.p.selarrrow[$t.p.selarrrow.length - 1]
                } else {
                    $t.p.selrow = null
                }
                if ($t.p.datatype === "local") {
                    var id = $.jgrid.stripPref($t.p.idPrefix, rowid)
                      , pos = $t.p._index[id];
                    if (pos !== undefined) {
                        $t.p.data.splice(pos, 1);
                        $t.refreshIndex()
                    }
                }
                if ($t.p.altRows === true && success) {
                    var cn = $t.p.altclass;
                    $($t.rows).each(function(i) {
                        if (i % 2 === 1) {
                            $(this).addClass(cn)
                        } else {
                            $(this).removeClass(cn)
                        }
                    })
                }
            });
            return success
        },
        setRowData: function(rowid, data, cssp) {
            var nm, success = true, title;
            this.each(function() {
                if (!this.grid) {
                    return false
                }
                var t = this, vl, ind, cp = typeof cssp, lcdata = {};
                ind = $(this).jqGrid("getGridRowById", rowid);
                if (!ind) {
                    return false
                }
                if (data) {
                    try {
                        $(this.p.colModel).each(function(i) {
                            nm = this.name;
                            var dval = $.jgrid.getAccessor(data, nm);
                            if (dval !== undefined) {
                                lcdata[nm] = this.formatter && typeof this.formatter === "string" && this.formatter === "date" ? $.unformat.date.call(t, dval, this) : dval;
                                vl = t.formatter(rowid, dval, i, data, "edit");
                                title = this.title ? {
                                    title: $.jgrid.stripHtml(vl)
                                } : {};
                                if (t.p.treeGrid === true && nm === t.p.ExpandColumn) {
                                    $("td[role='gridcell']:eq(" + i + ") > span:first", ind).html(vl).attr(title)
                                } else {
                                    $("td[role='gridcell']:eq(" + i + ")", ind).html(vl).attr(title)
                                }
                            }
                        });
                        if (t.p.datatype === "local") {
                            var id = $.jgrid.stripPref(t.p.idPrefix, rowid), pos = t.p._index[id], key;
                            if (t.p.treeGrid) {
                                for (key in t.p.treeReader) {
                                    if (t.p.treeReader.hasOwnProperty(key)) {
                                        delete lcdata[t.p.treeReader[key]]
                                    }
                                }
                            }
                            if (pos !== undefined) {
                                t.p.data[pos] = $.extend(true, t.p.data[pos], lcdata)
                            }
                            lcdata = null
                        }
                    } catch (e) {
                        success = false
                    }
                }
                if (success) {
                    if (cp === "string") {
                        $(ind).addClass(cssp)
                    } else {
                        if (cssp !== null && cp === "object") {
                            $(ind).css(cssp)
                        }
                    }
                    $(t).triggerHandler("jqGridAfterGridComplete")
                }
            });
            return success
        },
        addRowData: function(rowid, rdata, pos, src) {
            if (!pos) {
                pos = "last"
            }
            var success = false, nm, row, gi, si, ni, sind, i, v, prp = "", aradd, cnm, cn, data, cm, id;
            if (rdata) {
                if ($.isArray(rdata)) {
                    aradd = true;
                    pos = "last";
                    cnm = rowid
                } else {
                    rdata = [rdata];
                    aradd = false
                }
                this.each(function() {
                    var t = this
                      , datalen = rdata.length;
                    ni = t.p.rownumbers === true ? 1 : 0;
                    gi = t.p.multiselect === true ? 1 : 0;
                    si = t.p.subGrid === true ? 1 : 0;
                    $("tr.emptyrow", t.grid.bDiv).remove();
                    if (!aradd) {
                        if (rowid !== undefined) {
                            rowid = String(rowid)
                        } else {
                            rowid = $.jgrid.randId();
                            if (t.p.keyIndex !== false) {
                                cnm = t.p.colModel[t.p.keyIndex + gi + si + ni].name;
                                if (rdata[0][cnm] !== undefined) {
                                    rowid = rdata[0][cnm]
                                }
                            }
                        }
                    }
                    cn = t.p.altclass;
                    var k = 0
                      , cna = ""
                      , lcdata = {}
                      , air = $.isFunction(t.p.afterInsertRow) ? true : false;
                    while (k < datalen) {
                        data = rdata[k];
                        row = [];
                        if (aradd) {
                            try {
                                rowid = data[cnm];
                                if (rowid === undefined) {
                                    rowid = $.jgrid.randId()
                                }
                            } catch (e) {
                                rowid = $.jgrid.randId()
                            }
                            cna = t.p.altRows === true ? (t.rows.length - 1) % 2 === 0 ? cn : "" : ""
                        }
                        id = rowid;
                        rowid = t.p.idPrefix + rowid;
                        if (ni) {
                            prp = t.formatCol(0, 1, "", null, rowid, true);
                            row[row.length] = '<td role="gridcell" class="ui-state-default jqgrid-rownum" ' + prp + ">0</td>"
                        }
                        if (gi) {
                            v = '<input role="checkbox" type="checkbox" id="jqg_' + t.p.id + "_" + rowid + '" class="cbox"/>';
                            prp = t.formatCol(ni, 1, "", null, rowid, true);
                            row[row.length] = '<td role="gridcell" ' + prp + ">" + v + "</td>"
                        }
                        if (si) {
                            row[row.length] = $(t).jqGrid("addSubGridCell", gi + ni, 1)
                        }
                        for (i = gi + si + ni; i < t.p.colModel.length; i++) {
                            cm = t.p.colModel[i];
                            nm = cm.name;
                            lcdata[nm] = data[nm];
                            v = t.formatter(rowid, $.jgrid.getAccessor(data, nm), i, data);
                            prp = t.formatCol(i, 1, v, data, rowid, lcdata);
                            row[row.length] = '<td role="gridcell" ' + prp + ">" + v + "</td>"
                        }
                        row.unshift(t.constructTr(rowid, false, cna, lcdata, data, false));
                        row[row.length] = "</tr>";
                        if (t.rows.length === 0) {
                            $("table:first", t.grid.bDiv).append(row.join(""))
                        } else {
                            switch (pos) {
                            case "last":
                                $(t.rows[t.rows.length - 1]).after(row.join(""));
                                sind = t.rows.length - 1;
                                break;
                            case "first":
                                $(t.rows[0]).after(row.join(""));
                                sind = 1;
                                break;
                            case "after":
                                sind = $(t).jqGrid("getGridRowById", src);
                                if (sind) {
                                    if ($(t.rows[sind.rowIndex + 1]).hasClass("ui-subgrid")) {
                                        $(t.rows[sind.rowIndex + 1]).after(row)
                                    } else {
                                        $(sind).after(row.join(""))
                                    }
                                    sind = sind.rowIndex + 1
                                }
                                break;
                            case "before":
                                sind = $(t).jqGrid("getGridRowById", src);
                                if (sind) {
                                    $(sind).before(row.join(""));
                                    sind = sind.rowIndex - 1
                                }
                                break
                            }
                        }
                        if (t.p.subGrid === true) {
                            $(t).jqGrid("addSubGrid", gi + ni, sind)
                        }
                        t.p.records++;
                        t.p.reccount++;
                        $(t).triggerHandler("jqGridAfterInsertRow", [rowid, data, data]);
                        if (air) {
                            t.p.afterInsertRow.call(t, rowid, data, data)
                        }
                        k++;
                        if (t.p.datatype === "local") {
                            lcdata[t.p.localReader.id] = id;
                            t.p._index[id] = t.p.data.length;
                            t.p.data.push(lcdata);
                            lcdata = {}
                        }
                    }
                    if (t.p.altRows === true && !aradd) {
                        if (pos === "last") {
                            if ((t.rows.length - 1) % 2 === 1) {
                                $(t.rows[t.rows.length - 1]).addClass(cn)
                            }
                        } else {
                            $(t.rows).each(function(i) {
                                if (i % 2 === 1) {
                                    $(this).addClass(cn)
                                } else {
                                    $(this).removeClass(cn)
                                }
                            })
                        }
                    }
                    t.updatepager(true, true);
                    t.setScrollbar();
                    success = true
                })
            }
            return success
        },
        footerData: function(action, data, format) {
            var nm, success = false, res = {}, title;
            function isEmpty(obj) {
                var i;
                for (i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        return false
                    }
                }
                return true
            }
            if (action == undefined) {
                action = "get"
            }
            if (typeof format !== "boolean") {
                format = true
            }
            action = action.toLowerCase();
            this.each(function() {
                var t = this, vl;
                if (!t.grid || !t.p.footerrow) {
                    return false
                }
                if (action === "set") {
                    if (isEmpty(data)) {
                        return false
                    }
                }
                success = true;
                $(this.p.colModel).each(function(i) {
                    nm = this.name;
                    if (action === "set") {
                        if (data[nm] !== undefined) {
                            vl = format ? t.formatter("", data[nm], i, data, "edit") : data[nm];
                            title = this.title ? {
                                title: $.jgrid.stripHtml(vl)
                            } : {};
                            $("tr.footrow td:eq(" + i + ")", t.grid.sDiv).html(vl).attr(title);
                            success = true
                        }
                    } else {
                        if (action === "get") {
                            res[nm] = $("tr.footrow td:eq(" + i + ")", t.grid.sDiv).html()
                        }
                    }
                })
            });
            return action === "get" ? res : success
        },
        showHideCol: function(colname, show) {
            return this.each(function() {
                var $t = this, fndh = false, brd = $.jgrid.cell_width ? 0 : $t.p.cellLayout, cw;
                if (!$t.grid) {
                    return
                }
                if (typeof colname === "string") {
                    colname = [colname]
                }
                show = show !== "none" ? "" : "none";
                var sw = show === "" ? true : false
                  , gh = $t.p.groupHeader && (typeof $t.p.groupHeader === "object" || $.isFunction($t.p.groupHeader));
                if (gh) {
                    $($t).jqGrid("destroyGroupHeader", false)
                }
                $(this.p.colModel).each(function(i) {
                    if ($.inArray(this.name, colname) !== -1 && this.hidden === sw) {
                        if ($t.p.frozenColumns === true && this.frozen === true) {
                            return true
                        }
                        $("tr[role=rowheader]", $t.grid.hDiv).each(function() {
                            $(this.cells[i]).css("display", show)
                        });
                        $($t.rows).each(function() {
                            if (!$(this).hasClass("jqgroup")) {
                                $(this.cells[i]).css("display", show)
                            }
                        });
                        if ($t.p.footerrow) {
                            $("tr.footrow td:eq(" + i + ")", $t.grid.sDiv).css("display", show)
                        }
                        cw = parseInt(this.width, 10);
                        if (show === "none") {
                            $t.p.tblwidth -= cw + brd
                        } else {
                            $t.p.tblwidth += cw + brd
                        }
                        this.hidden = !sw;
                        fndh = true;
                        $($t).triggerHandler("jqGridShowHideCol", [sw, this.name, i])
                    }
                });
                if (fndh === true) {
                    if ($t.p.shrinkToFit === true && !isNaN($t.p.height)) {
                        $t.p.tblwidth += parseInt($t.p.scrollOffset, 10)
                    }
                    $($t).jqGrid("setGridWidth", $t.p.shrinkToFit === true ? $t.p.tblwidth : $t.p.width)
                }
                if (gh) {
                    $($t).jqGrid("setGroupHeaders", $t.p.groupHeader)
                }
            })
        },
        hideCol: function(colname) {
            return this.each(function() {
                $(this).jqGrid("showHideCol", colname, "none")
            })
        },
        showCol: function(colname) {
            return this.each(function() {
                $(this).jqGrid("showHideCol", colname, "")
            })
        },
        remapColumns: function(permutation, updateCells, keepHeader) {
            function resortArray(a) {
                var ac;
                if (a.length) {
                    ac = $.makeArray(a)
                } else {
                    ac = $.extend({}, a)
                }
                $.each(permutation, function(i) {
                    a[i] = ac[this]
                })
            }
            var ts = this.get(0);
            function resortRows(parent, clobj) {
                $(">tr" + (clobj || ""), parent).each(function() {
                    var row = this;
                    var elems = $.makeArray(row.cells);
                    $.each(permutation, function() {
                        var e = elems[this];
                        if (e) {
                            row.appendChild(e)
                        }
                    })
                })
            }
            resortArray(ts.p.colModel);
            resortArray(ts.p.colNames);
            resortArray(ts.grid.headers);
            resortRows($("thead:first", ts.grid.hDiv), keepHeader && ":not(.ui-jqgrid-labels)");
            if (updateCells) {
                resortRows($("#" + $.jgrid.jqID(ts.p.id) + " tbody:first"), ".jqgfirstrow, tr.jqgrow, tr.jqfoot")
            }
            if (ts.p.footerrow) {
                resortRows($("tbody:first", ts.grid.sDiv))
            }
            if (ts.p.remapColumns) {
                if (!ts.p.remapColumns.length) {
                    ts.p.remapColumns = $.makeArray(permutation)
                } else {
                    resortArray(ts.p.remapColumns)
                }
            }
            ts.p.lastsort = $.inArray(ts.p.lastsort, permutation);
            if (ts.p.treeGrid) {
                ts.p.expColInd = $.inArray(ts.p.expColInd, permutation)
            }
            $(ts).triggerHandler("jqGridRemapColumns", [permutation, updateCells, keepHeader])
        },
        setGridWidth: function(nwidth, shrink) {
            return this.each(function() {
                if (!this.grid) {
                    return
                }
                var $t = this, cw, initwidth = 0, brd = $.jgrid.cell_width ? 0 : $t.p.cellLayout, lvc, vc = 0, hs = false, scw = $t.p.scrollOffset, aw, gw = 0, cr;
                if (typeof shrink !== "boolean") {
                    shrink = $t.p.shrinkToFit
                }
                if (isNaN(nwidth)) {
                    return
                }
                nwidth = parseInt(nwidth, 10);
                $t.grid.width = $t.p.width = nwidth;
                $("#gbox_" + $.jgrid.jqID($t.p.id)).css("width", nwidth + "px");
                $("#gview_" + $.jgrid.jqID($t.p.id)).css("width", nwidth + "px");
                $($t.grid.bDiv).css("width", nwidth + "px");
                $($t.grid.hDiv).css("width", nwidth + "px");
                var _htable = $($t.grid.hDiv).find("table");
                var _btable = $($t.grid.bDiv).find("table");
                var _newWidth = $($t.grid.bDiv).width() + 2;
                $($t.grid.bDiv).width(_newWidth);
                $($t.grid.hDiv).width(_newWidth);
                if ($t.p.pager) {
                    $($t.p.pager).css("width", nwidth + "px")
                }
                if ($t.p.toppager) {
                    $($t.p.toppager).css("width", nwidth + "px")
                }
                if ($t.p.toolbar[0] === true) {
                    $($t.grid.uDiv).css("width", nwidth + "px");
                    if ($t.p.toolbar[1] === "both") {
                        $($t.grid.ubDiv).css("width", nwidth + "px")
                    }
                }
                if ($t.p.footerrow) {
                    $($t.grid.sDiv).css("width", nwidth + "px")
                }
                if (shrink === false && $t.p.forceFit === true) {
                    $t.p.forceFit = false
                }
                if (shrink === true) {
                    $.each($t.p.colModel, function() {
                        if (this.hidden === false) {
                            cw = this.widthOrg;
                            initwidth += cw + brd;
                            if (this.fixed) {
                                gw += cw + brd
                            } else {
                                vc++
                            }
                        }
                    });
                    if (vc === 0) {
                        return
                    }
                    $t.p.tblwidth = initwidth;
                    aw = nwidth - brd * vc - gw;
                    if (!isNaN($t.p.height)) {
                        if ($($t.grid.bDiv)[0].clientHeight < $($t.grid.bDiv)[0].scrollHeight || $t.rows.length === 1) {
                            hs = true;
                            aw -= scw
                        }
                    }
                    initwidth = 0;
                    var cle = $t.grid.cols.length > 0;
                    $.each($t.p.colModel, function(i) {
                        if (this.hidden === false && !this.fixed) {
                            cw = this.widthOrg;
                            cw = Math.round(aw * cw / ($t.p.tblwidth - brd * vc - gw));
                            if (cw < 0) {
                                return
                            }
                            this.width = cw;
                            initwidth += cw;
                            $t.grid.headers[i].width = cw;
                            $t.grid.headers[i].el.style.width = cw + "px";
                            if ($t.p.footerrow) {
                                $t.grid.footers[i].style.width = cw + "px"
                            }
                            if (cle) {
                                $t.grid.cols[i].style.width = cw + "px"
                            }
                            lvc = i
                        }
                    });
                    if (!lvc) {
                        return
                    }
                    cr = 0;
                    if (hs) {
                        if (nwidth - gw - (initwidth + brd * vc) !== scw) {
                            cr = nwidth - gw - (initwidth + brd * vc) - scw
                        }
                    } else {
                        if (Math.abs(nwidth - gw - (initwidth + brd * vc)) !== 1) {
                            cr = nwidth - gw - (initwidth + brd * vc)
                        }
                    }
                    $t.p.colModel[lvc].width += cr;
                    $t.p.tblwidth = initwidth + cr + brd * vc + gw;
                    if ($t.p.tblwidth > nwidth) {
                        var delta = $t.p.tblwidth - parseInt(nwidth, 10);
                        $t.p.tblwidth = nwidth;
                        cw = $t.p.colModel[lvc].width = $t.p.colModel[lvc].width - delta
                    } else {
                        cw = $t.p.colModel[lvc].width
                    }
                    $t.grid.headers[lvc].width = cw;
                    $t.grid.headers[lvc].el.style.width = cw + "px";
                    if (cle) {
                        $t.grid.cols[lvc].style.width = cw + "px"
                    }
                    if ($t.p.footerrow) {
                        $t.grid.footers[lvc].style.width = cw + "px"
                    }
                }
                if ($t.p.tblwidth) {
                    $("table:first", $t.grid.bDiv).css("width", $t.p.tblwidth + "px");
                    $("table:first", $t.grid.hDiv).css("width", $t.p.tblwidth + "px");
                    $($t.grid.bDiv).next(".grid-fixscrollBar").find('.fixsb-inner').css("width", $t.p.tblwidth + "px");
                    $t.grid.hDiv.scrollLeft = $t.grid.bDiv.scrollLeft;
                    if ($t.p.footerrow) {
                        $("table:first", $t.grid.sDiv).css("width", $t.p.tblwidth + "px")
                    }
                }
            })
        },
        setGridHeight: function(nh) {
            return this.each(function() {
                var $t = this;
                if (!$t.grid) {
                    return
                }
                var bDiv = $($t.grid.bDiv);
                bDiv.css({
                    height: nh + (isNaN(nh) ? "" : "px")
                });
                if ($t.p.frozenColumns === true) {
                    $("#" + $.jgrid.jqID($t.p.id) + "_frozen").parent().height(bDiv.height() - 16)
                }
                $t.p.height = nh;
                if ($t.p.scroll) {
                    $t.grid.populateVisible()
                }
            })
        },
        setCaption: function(newcap) {
            return this.each(function() {
                this.p.caption = newcap;
                $("span.ui-jqgrid-title, span.ui-jqgrid-title-rtl", this.grid.cDiv).html(newcap);
                $(this.grid.cDiv).show()
            })
        },
        setLabel: function(colname, nData, prop, attrp) {
            return this.each(function() {
                var $t = this
                  , pos = -1;
                if (!$t.grid) {
                    return
                }
                if (colname !== undefined) {
                    $($t.p.colModel).each(function(i) {
                        if (this.name === colname) {
                            pos = i;
                            return false
                        }
                    })
                } else {
                    return
                }
                if (pos >= 0) {
                    var thecol = $("tr.ui-jqgrid-labels th:eq(" + pos + ")", $t.grid.hDiv);
                    if (nData) {
                        var ico = $(".s-ico", thecol);
                        $("[id^=jqgh_]", thecol).empty().html(nData).append(ico);
                        $t.p.colNames[pos] = nData
                    }
                    if (prop) {
                        if (typeof prop === "string") {
                            $(thecol).addClass(prop)
                        } else {
                            $(thecol).css(prop)
                        }
                    }
                    if (typeof attrp === "object") {
                        $(thecol).attr(attrp)
                    }
                }
            })
        },
        setCell: function(rowid, colname, nData, cssp, attrp, forceupd) {
            return this.each(function() {
                var $t = this, pos = -1, v, title;
                if (!$t.grid) {
                    return
                }
                if (isNaN(colname)) {
                    $($t.p.colModel).each(function(i) {
                        if (this.name === colname) {
                            pos = i;
                            return false
                        }
                    })
                } else {
                    pos = parseInt(colname, 10)
                }
                if (pos >= 0) {
                    var ind = $($t).jqGrid("getGridRowById", rowid);
                    if (ind) {
                        var tcell = $("td:eq(" + pos + ")", ind);
                        if (nData !== "" || forceupd === true) {
                            v = $t.formatter(rowid, nData, pos, ind, "edit");
                            title = $t.p.colModel[pos].title ? {
                                title: $.jgrid.stripHtml(v)
                            } : {};
                            if ($t.p.treeGrid && $(".tree-wrap", $(tcell)).length > 0) {
                                $("span", $(tcell)).html(v).attr(title)
                            } else {
                                $(tcell).html(v).attr(title)
                            }
                            if ($t.p.datatype === "local") {
                                var cm = $t.p.colModel[pos], index;
                                nData = cm.formatter && typeof cm.formatter === "string" && cm.formatter === "date" ? $.unformat.date.call($t, nData, cm) : nData;
                                index = $t.p._index[$.jgrid.stripPref($t.p.idPrefix, rowid)];
                                if (index !== undefined) {
                                    $t.p.data[index][cm.name] = nData
                                }
                            }
                        }
                        if (typeof cssp === "string") {
                            $(tcell).addClass(cssp)
                        } else {
                            if (cssp) {
                                $(tcell).css(cssp)
                            }
                        }
                        if (typeof attrp === "object") {
                            $(tcell).attr(attrp)
                        }
                    }
                }
            })
        },
        getCell: function(rowid, col) {
            var ret = false;
            this.each(function() {
                var $t = this
                  , pos = -1;
                if (!$t.grid) {
                    return
                }
                if (isNaN(col)) {
                    $($t.p.colModel).each(function(i) {
                        if (this.name === col) {
                            pos = i;
                            return false
                        }
                    })
                } else {
                    pos = parseInt(col, 10)
                }
                if (pos >= 0) {
                    var ind = $($t).jqGrid("getGridRowById", rowid);
                    if (ind) {
                        try {
                            ret = $.unformat.call($t, $("td:eq(" + pos + ")", ind), {
                                rowId: ind.id,
                                colModel: $t.p.colModel[pos]
                            }, pos)
                        } catch (e) {
                            ret = $.jgrid.htmlDecode($("td:eq(" + pos + ")", ind).html())
                        }
                    }
                }
            });
            return ret
        },
        getCol: function(col, obj, mathopr) {
            var ret = [], val, sum = 0, min, max, v;
            obj = typeof obj !== "boolean" ? false : obj;
            if (mathopr === undefined) {
                mathopr = false
            }
            this.each(function() {
                var $t = this
                  , pos = -1;
                if (!$t.grid) {
                    return
                }
                if (isNaN(col)) {
                    $($t.p.colModel).each(function(i) {
                        if (this.name === col) {
                            pos = i;
                            return false
                        }
                    })
                } else {
                    pos = parseInt(col, 10)
                }
                if (pos >= 0) {
                    var ln = $t.rows.length
                      , i = 0
                      , dlen = 0;
                    if (ln && ln > 0) {
                        while (i < ln) {
                            if ($($t.rows[i]).hasClass("jqgrow")) {
                                try {
                                    val = $.unformat.call($t, $($t.rows[i].cells[pos]), {
                                        rowId: $t.rows[i].id,
                                        colModel: $t.p.colModel[pos]
                                    }, pos)
                                } catch (e) {
                                    val = $.jgrid.htmlDecode($t.rows[i].cells[pos].innerHTML)
                                }
                                if (mathopr) {
                                    v = parseFloat(val);
                                    if (!isNaN(v)) {
                                        sum += v;
                                        if (max === undefined) {
                                            max = min = v
                                        }
                                        min = Math.min(min, v);
                                        max = Math.max(max, v);
                                        dlen++
                                    }
                                } else {
                                    if (obj) {
                                        ret.push({
                                            id: $t.rows[i].id,
                                            value: val
                                        })
                                    } else {
                                        ret.push(val)
                                    }
                                }
                            }
                            i++
                        }
                        if (mathopr) {
                            switch (mathopr.toLowerCase()) {
                            case "sum":
                                ret = sum;
                                break;
                            case "avg":
                                ret = sum / dlen;
                                break;
                            case "count":
                                ret = (ln - 1);
                                break;
                            case "min":
                                ret = min;
                                break;
                            case "max":
                                ret = max;
                                break
                            }
                        }
                    }
                }
            });
            return ret
        },
        clearGridData: function(clearfooter) {
            return this.each(function() {
                var $t = this;
                if (!$t.grid) {
                    return
                }
                if (typeof clearfooter !== "boolean") {
                    clearfooter = false
                }
                if ($t.p.deepempty) {
                    $("#" + $.jgrid.jqID($t.p.id) + " tbody:first tr:gt(0)").remove()
                } else {
                    var trf = $("#" + $.jgrid.jqID($t.p.id) + " tbody:first tr:first")[0];
                    $("#" + $.jgrid.jqID($t.p.id) + " tbody:first").empty().append(trf)
                }
                if ($t.p.footerrow && clearfooter) {
                    $(".ui-jqgrid-ftable td", $t.grid.sDiv).html("&#160;")
                }
                $t.p.selrow = null;
                $t.p.selarrrow = [];
                $t.p.savedRow = [];
                $t.p.records = 0;
                $t.p.page = 1;
                $t.p.lastpage = 0;
                $t.p.reccount = 0;
                $t.p.data = [];
                $t.p._index = {};
                $t.updatepager(true, false);
                $t.setScrollbar();
            })
        },
        getInd: function(rowid, rc) {
            var ret = false, rw;
            this.each(function() {
                rw = $(this).jqGrid("getGridRowById", rowid);
                if (rw) {
                    ret = rc === true ? rw : rw.rowIndex
                }
            });
            return ret
        },
        bindKeys: function(settings) {
            var o = $.extend({
                onEnter: null,
                onSpace: null,
                onLeftKey: null,
                onRightKey: null,
                scrollingRows: true
            }, settings || {});
            return this.each(function() {
                var $t = this;
                if (!$("body").is("[role]")) {
                    $("body").attr("role", "application")
                }
                $t.p.scrollrows = o.scrollingRows;
                $($t).keydown(function(event) {
                    var target = $($t).find("tr[tabindex=0]")[0], id, r, mind, expanded = $t.p.treeReader.expanded_field;
                    if (target) {
                        mind = $t.p._index[$.jgrid.stripPref($t.p.idPrefix, target.id)];
                        if (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
                            if (event.keyCode === 38) {
                                r = target.previousSibling;
                                id = "";
                                if (r) {
                                    if ($(r).is(":hidden")) {
                                        while (r) {
                                            r = r.previousSibling;
                                            if (!$(r).is(":hidden") && $(r).hasClass("jqgrow")) {
                                                id = r.id;
                                                break
                                            }
                                        }
                                    } else {
                                        id = r.id
                                    }
                                }
                                $($t).jqGrid("setSelection", id, true, event);
                                event.preventDefault()
                            }
                            if (event.keyCode === 40) {
                                r = target.nextSibling;
                                id = "";
                                if (r) {
                                    if ($(r).is(":hidden")) {
                                        while (r) {
                                            r = r.nextSibling;
                                            if (!$(r).is(":hidden") && $(r).hasClass("jqgrow")) {
                                                id = r.id;
                                                break
                                            }
                                        }
                                    } else {
                                        id = r.id
                                    }
                                }
                                $($t).jqGrid("setSelection", id, true, event);
                                event.preventDefault()
                            }
                            if (event.keyCode === 37) {
                                if ($t.p.treeGrid && $t.p.data[mind][expanded]) {
                                    $(target).find("div.treeclick").trigger("click")
                                }
                                $($t).triggerHandler("jqGridKeyLeft", [$t.p.selrow]);
                                if ($.isFunction(o.onLeftKey)) {
                                    o.onLeftKey.call($t, $t.p.selrow)
                                }
                            }
                            if (event.keyCode === 39) {
                                if ($t.p.treeGrid && !$t.p.data[mind][expanded]) {
                                    $(target).find("div.treeclick").trigger("click")
                                }
                                $($t).triggerHandler("jqGridKeyRight", [$t.p.selrow]);
                                if ($.isFunction(o.onRightKey)) {
                                    o.onRightKey.call($t, $t.p.selrow)
                                }
                            }
                        } else {
                            if (event.keyCode === 13) {
                                $($t).triggerHandler("jqGridKeyEnter", [$t.p.selrow]);
                                if ($.isFunction(o.onEnter)) {
                                    o.onEnter.call($t, $t.p.selrow)
                                }
                            } else {
                                if (event.keyCode === 32) {
                                    $($t).triggerHandler("jqGridKeySpace", [$t.p.selrow]);
                                    if ($.isFunction(o.onSpace)) {
                                        o.onSpace.call($t, $t.p.selrow)
                                    }
                                }
                            }
                        }
                    }
                })
            })
        },
        unbindKeys: function() {
            return this.each(function() {
                $(this).unbind("keydown")
            })
        },
        getLocalRow: function(rowid) {
            var ret = false, ind;
            this.each(function() {
                if (rowid !== undefined) {
                    ind = this.p._index[$.jgrid.stripPref(this.p.idPrefix, rowid)];
                    if (ind >= 0) {
                        ret = this.p.data[ind]
                    }
                }
            });
            return ret
        }
    })
}
)(jQuery);
(function(b) {
    b.jgrid.extend({
        getColProp: function(i) {
            var a = {}
              , g = this[0];
            if (!g.grid) {
                return false
            }
            var h = g.p.colModel, j;
            for (j = 0; j < h.length; j++) {
                if (h[j].name === i) {
                    a = h[j];
                    break
                }
            }
            return a
        },
        setColProp: function(d, a) {
            return this.each(function() {
                if (this.grid) {
                    if (a) {
                        var c = this.p.colModel, f;
                        for (f = 0; f < c.length; f++) {
                            if (c[f].name === d) {
                                b.extend(true, this.p.colModel[f], a);
                                break
                            }
                        }
                    }
                }
            })
        },
        sortGrid: function(f, a, e) {
            return this.each(function() {
                var c = this, l = -1, d, i = false;
                if (!c.grid) {
                    return
                }
                if (!f) {
                    f = c.p.sortname
                }
                for (d = 0; d < c.p.colModel.length; d++) {
                    if (c.p.colModel[d].index === f || c.p.colModel[d].name === f) {
                        l = d;
                        if (c.p.frozenColumns === true && c.p.colModel[d].frozen === true) {
                            i = c.grid.fhDiv.find("#" + c.p.id + "_" + f)
                        }
                        break
                    }
                }
                if (l !== -1) {
                    var k = c.p.colModel[l].sortable;
                    if (!i) {
                        i = c.grid.headers[l].el
                    }
                    if (typeof k !== "boolean") {
                        k = true
                    }
                    if (typeof a !== "boolean") {
                        a = false
                    }
                    if (k) {
                        c.sortData("jqgh_" + c.p.id + "_" + f, l, a, e, i)
                    }
                }
            })
        },
        clearBeforeUnload: function() {
            return this.each(function() {
                var e = this.grid;
                if (b.isFunction(e.emptyRows)) {
                    e.emptyRows.call(this, true, true)
                }
                b(document).unbind("mouseup.jqGrid" + this.p.id);
                b(e.hDiv).unbind("mousemove");
                b(this).unbind();
                e.dragEnd = null;
                e.dragMove = null;
                e.dragStart = null;
                e.emptyRows = null;
                e.populate = null;
                e.populateVisible = null;
                e.scrollGrid = null;
                e.selectionPreserver = null;
                e.bDiv = null;
                e.cDiv = null;
                e.hDiv = null;
                e.cols = null;
                var f, a = e.headers.length;
                for (f = 0; f < a; f++) {
                    e.headers[f].el = null
                }
                this.formatCol = null;
                this.sortData = null;
                this.updatepager = null;
                this.refreshIndex = null;
                this.setHeadCheckBox = null;
                this.constructTr = null;
                this.formatter = null;
                this.addXmlData = null;
                this.addJSONData = null;
                this.grid = null
            })
        },
        GridDestroy: function() {
            return this.each(function() {
                if (this.grid) {
                    if (this.p.pager) {
                        b(this.p.pager).remove()
                    }
                    try {
                        b(this).jqGrid("clearBeforeUnload");
                        b("#gbox_" + b.jgrid.jqID(this.id)).remove()
                    } catch (a) {}
                }
            })
        },
        GridUnload: function() {
            return this.each(function() {
                if (!this.grid) {
                    return
                }
                var e = {
                    id: b(this).attr("id"),
                    cl: b(this).attr("class")
                };
                if (this.p.pager) {
                    b(this.p.pager).empty().removeClass("ui-state-default ui-jqgrid-pager ui-corner-bottom")
                }
                var a = document.createElement("table");
                b(a).attr({
                    id: e.id
                });
                a.className = e.cl;
                var f = b.jgrid.jqID(this.id);
                b(a).removeClass("ui-jqgrid-btable");
                if (b(this.p.pager).parents("#gbox_" + f).length === 1) {
                    b(a).insertBefore("#gbox_" + f).show();
                    b(this.p.pager).insertBefore("#gbox_" + f)
                } else {
                    b(a).insertBefore("#gbox_" + f).show()
                }
                b(this).jqGrid("clearBeforeUnload");
                b("#gbox_" + f).remove()
            })
        },
        setGridState: function(a) {
            return this.each(function() {
                if (!this.grid) {
                    return
                }
                var d = this;
                if (a === "hidden") {
                    b(".ui-jqgrid-bdiv, .ui-jqgrid-hdiv", "#gview_" + b.jgrid.jqID(d.p.id)).slideUp("fast");
                    if (d.p.pager) {
                        b(d.p.pager).slideUp("fast")
                    }
                    if (d.p.toppager) {
                        b(d.p.toppager).slideUp("fast")
                    }
                    if (d.p.toolbar[0] === true) {
                        if (d.p.toolbar[1] === "both") {
                            b(d.grid.ubDiv).slideUp("fast")
                        }
                        b(d.grid.uDiv).slideUp("fast")
                    }
                    if (d.p.footerrow) {
                        b(".ui-jqgrid-sdiv", "#gbox_" + b.jgrid.jqID(d.p.id)).slideUp("fast")
                    }
                    b(".ui-jqgrid-titlebar-close span", d.grid.cDiv).removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s");
                    d.p.gridstate = "hidden"
                } else {
                    if (a === "visible") {
                        b(".ui-jqgrid-hdiv, .ui-jqgrid-bdiv", "#gview_" + b.jgrid.jqID(d.p.id)).slideDown("fast");
                        if (d.p.pager) {
                            b(d.p.pager).slideDown("fast")
                        }
                        if (d.p.toppager) {
                            b(d.p.toppager).slideDown("fast")
                        }
                        if (d.p.toolbar[0] === true) {
                            if (d.p.toolbar[1] === "both") {
                                b(d.grid.ubDiv).slideDown("fast")
                            }
                            b(d.grid.uDiv).slideDown("fast")
                        }
                        if (d.p.footerrow) {
                            b(".ui-jqgrid-sdiv", "#gbox_" + b.jgrid.jqID(d.p.id)).slideDown("fast")
                        }
                        b(".ui-jqgrid-titlebar-close span", d.grid.cDiv).removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n");
                        d.p.gridstate = "visible"
                    }
                }
            })
        },
        filterToolbar: function(a) {
            a = b.extend({
                autosearch: true,
                searchOnEnter: true,
                beforeSearch: null,
                afterSearch: null,
                beforeClear: null,
                afterClear: null,
                searchurl: "",
                stringResult: false,
                groupOp: "AND",
                defaultSearch: "bw",
                searchOperators: false,
                resetIcon: "x",
                operands: {
                    eq: "==",
                    ne: "!",
                    lt: "<",
                    le: "<=",
                    gt: ">",
                    ge: ">=",
                    bw: "^",
                    bn: "!^",
                    "in": "=",
                    ni: "!=",
                    ew: "|",
                    en: "!@",
                    cn: "~",
                    nc: "!~",
                    nu: "#",
                    nn: "!#"
                }
            }, b.jgrid.search, a || {});
            return this.each(function() {
                var j = this;
                if (this.ftoolbar) {
                    return
                }
                var p = function() {
                    var f = {}, g = 0, x, w, v = {}, i;
                    b.each(j.p.colModel, function() {
                        var r = b("#gs_" + b.jgrid.jqID(this.name), (this.frozen === true && j.p.frozenColumns === true) ? j.grid.fhDiv : j.grid.hDiv);
                        w = this.index || this.name;
                        if (a.searchOperators) {
                            i = r.parent().prev().children("a").attr("soper") || a.defaultSearch
                        } else {
                            i = (this.searchoptions && this.searchoptions.sopt) ? this.searchoptions.sopt[0] : this.stype === "select" ? "eq" : a.defaultSearch
                        }
                        x = this.stype === "custom" && b.isFunction(this.searchoptions.custom_value) && r.length > 0 && r[0].nodeName.toUpperCase() === "SPAN" ? this.searchoptions.custom_value.call(j, r.children(".customelement:first"), "get") : r.val();
                        if (x || i === "nu" || i === "nn") {
                            f[w] = x;
                            v[w] = i;
                            g++
                        } else {
                            try {
                                delete j.p.postData[w]
                            } catch (q) {}
                        }
                    });
                    var c = g > 0 ? true : false;
                    if (a.stringResult === true || j.p.datatype === "local") {
                        var y = '{"groupOp":"' + a.groupOp + '","rules":[';
                        var d = 0;
                        b.each(f, function(r, q) {
                            if (d > 0) {
                                y += ","
                            }
                            y += '{"field":"' + r + '",';
                            y += '"op":"' + v[r] + '",';
                            q += "";
                            y += '"data":"' + q.replace(/\\/g, "\\\\").replace(/\"/g, '\\"') + '"}';
                            d++
                        });
                        y += "]}";
                        b.extend(j.p.postData, {
                            filters: y
                        });
                        b.each(["searchField", "searchString", "searchOper"], function(r, q) {
                            if (j.p.postData.hasOwnProperty(q)) {
                                delete j.p.postData[q]
                            }
                        })
                    } else {
                        b.extend(j.p.postData, f)
                    }
                    var e;
                    if (j.p.searchurl) {
                        e = j.p.url;
                        b(j).jqGrid("setGridParam", {
                            url: j.p.searchurl
                        })
                    }
                    var h = b(j).triggerHandler("jqGridToolbarBeforeSearch") === "stop" ? true : false;
                    if (!h && b.isFunction(a.beforeSearch)) {
                        h = a.beforeSearch.call(j)
                    }
                    if (!h) {
                        b(j).jqGrid("setGridParam", {
                            search: c
                        }).trigger("reloadGrid", [{
                            page: 1
                        }])
                    }
                    if (e) {
                        b(j).jqGrid("setGridParam", {
                            url: e
                        })
                    }
                    b(j).triggerHandler("jqGridToolbarAfterSearch");
                    if (b.isFunction(a.afterSearch)) {
                        a.afterSearch.call(j)
                    }
                }
                  , k = function(t) {
                    var h = {}, i = 0, u;
                    t = (typeof t !== "boolean") ? true : t;
                    b.each(j.p.colModel, function() {
                        var v, s = b("#gs_" + b.jgrid.jqID(this.name), (this.frozen === true && j.p.frozenColumns === true) ? j.grid.fhDiv : j.grid.hDiv);
                        if (this.searchoptions && this.searchoptions.defaultValue !== undefined) {
                            v = this.searchoptions.defaultValue
                        }
                        u = this.index || this.name;
                        switch (this.stype) {
                        case "select":
                            s.find("option").each(function(w) {
                                if (w === 0) {
                                    this.selected = true
                                }
                                if (b(this).val() === v) {
                                    this.selected = true;
                                    return false
                                }
                            });
                            if (v !== undefined) {
                                h[u] = v;
                                i++
                            } else {
                                try {
                                    delete j.p.postData[u]
                                } catch (r) {}
                            }
                            break;
                        case "text":
                            s.val(v || "");
                            if (v !== undefined) {
                                h[u] = v;
                                i++
                            } else {
                                try {
                                    delete j.p.postData[u]
                                } catch (q) {}
                            }
                            break;
                        case "custom":
                            if (b.isFunction(this.searchoptions.custom_value) && s.length > 0 && s[0].nodeName.toUpperCase() === "SPAN") {
                                this.searchoptions.custom_value.call(j, s.children(".customelement:first"), "set", v || "")
                            }
                            break
                        }
                    });
                    var e = i > 0 ? true : false;
                    j.p.resetsearch = true;
                    if (a.stringResult === true || j.p.datatype === "local") {
                        var d = '{"groupOp":"' + a.groupOp + '","rules":[';
                        var f = 0;
                        b.each(h, function(q, r) {
                            if (f > 0) {
                                d += ","
                            }
                            d += '{"field":"' + q + '",';
                            d += '"op":"eq",';
                            r += "";
                            d += '"data":"' + r.replace(/\\/g, "\\\\").replace(/\"/g, '\\"') + '"}';
                            f++
                        });
                        d += "]}";
                        b.extend(j.p.postData, {
                            filters: d
                        });
                        b.each(["searchField", "searchString", "searchOper"], function(q, r) {
                            if (j.p.postData.hasOwnProperty(r)) {
                                delete j.p.postData[r]
                            }
                        })
                    } else {
                        b.extend(j.p.postData, h)
                    }
                    var g;
                    if (j.p.searchurl) {
                        g = j.p.url;
                        b(j).jqGrid("setGridParam", {
                            url: j.p.searchurl
                        })
                    }
                    var c = b(j).triggerHandler("jqGridToolbarBeforeClear") === "stop" ? true : false;
                    if (!c && b.isFunction(a.beforeClear)) {
                        c = a.beforeClear.call(j)
                    }
                    if (!c) {
                        if (t) {
                            b(j).jqGrid("setGridParam", {
                                search: e
                            }).trigger("reloadGrid", [{
                                page: 1
                            }])
                        }
                    }
                    if (g) {
                        b(j).jqGrid("setGridParam", {
                            url: g
                        })
                    }
                    b(j).triggerHandler("jqGridToolbarAfterClear");
                    if (b.isFunction(a.afterClear)) {
                        a.afterClear()
                    }
                }
                  , n = function() {
                    var d = b("tr.ui-search-toolbar", j.grid.hDiv)
                      , c = j.p.frozenColumns === true ? b("tr.ui-search-toolbar", j.grid.fhDiv) : false;
                    if (d.css("display") === "none") {
                        d.show();
                        if (c) {
                            c.show()
                        }
                    } else {
                        d.hide();
                        if (c) {
                            c.hide()
                        }
                    }
                }
                  , l = function(x, y, C) {
                    b("#sopt_menu").remove();
                    y = parseInt(y, 10);
                    C = parseInt(C, 10) + 18;
                    var e = b(".ui-jqgrid-view").css("font-size") || "11px";
                    var D = '<ul id="sopt_menu" class="ui-search-menu" role="menu" tabindex="0" style="font-size:' + e + ";left:" + y + "px;top:" + C + 'px;">', g = b(x).attr("soper"), c, i = [], h;
                    var f = 0
                      , z = b(x).attr("colname")
                      , d = j.p.colModel.length;
                    while (f < d) {
                        if (j.p.colModel[f].name === z) {
                            break
                        }
                        f++
                    }
                    var B = j.p.colModel[f]
                      , A = b.extend({}, B.searchoptions);
                    if (!A.sopt) {
                        A.sopt = [];
                        A.sopt[0] = B.stype === "select" ? "eq" : a.defaultSearch
                    }
                    b.each(a.odata, function() {
                        i.push(this.oper)
                    });
                    for (f = 0; f < A.sopt.length; f++) {
                        h = b.inArray(A.sopt[f], i);
                        if (h !== -1) {
                            c = g === a.odata[h].oper ? "ui-state-highlight" : "";
                            D += '<li class="ui-menu-item ' + c + '" role="presentation"><a class="ui-corner-all g-menu-item" tabindex="0" role="menuitem" value="' + a.odata[h].oper + '" oper="' + a.operands[a.odata[h].oper] + '"><table cellspacing="0" cellpadding="0" border="0"><tr><td width="25px">' + a.operands[a.odata[h].oper] + "</td><td>" + a.odata[h].text + "</td></tr></table></a></li>"
                        }
                    }
                    D += "</ul>";
                    b("body").append(D);
                    b("#sopt_menu").addClass("ui-menu ui-widget ui-widget-content ui-corner-all");
                    b("#sopt_menu > li > a").hover(function() {
                        b(this).addClass("ui-state-hover")
                    }, function() {
                        b(this).removeClass("ui-state-hover")
                    }).click(function(s) {
                        var t = b(this).attr("value")
                          , r = b(this).attr("oper");
                        b(j).triggerHandler("jqGridToolbarSelectOper", [t, r, x]);
                        b("#sopt_menu").hide();
                        b(x).text(r).attr("soper", t);
                        if (a.autosearch === true) {
                            var q = b(x).parent().next().children()[0];
                            if (b(q).val() || t === "nu" || t === "nn") {
                                p()
                            }
                        }
                    })
                };
                var m = b("<tr class='ui-search-toolbar' role='rowheader'></tr>");
                var o;
                b.each(j.p.colModel, function(N) {
                    var T = this, d, V, L, f = "", h = "=", Q, S, X = b("<th role='columnheader' class='ui-state-default ui-th-column ui-th-" + j.p.direction + "'></th>"), P = b("<div style='position:relative;height:100%;padding-right:0.3em;padding-left:0.3em;'></div>"), W = b("<table class='ui-search-table' cellspacing='0'><tr><td class='ui-search-oper'></td><td class='ui-search-input'></td><td class='ui-search-clear'></td></tr></table>");
                    if (this.hidden === true) {
                        b(X).css("display", "none")
                    }
                    this.search = this.search === false ? false : true;
                    if (this.stype === undefined) {
                        this.stype = "text"
                    }
                    d = b.extend({}, this.searchoptions || {});
                    if (this.search) {
                        if (a.searchOperators) {
                            Q = (d.sopt) ? d.sopt[0] : T.stype === "select" ? "eq" : a.defaultSearch;
                            for (S = 0; S < a.odata.length; S++) {
                                if (a.odata[S].oper === Q) {
                                    h = a.operands[Q] || "";
                                    break
                                }
                            }
                            var c = d.searchtitle != null ? d.searchtitle : a.operandTitle;
                            f = "<a title='" + c + "' style='padding-right: 0.5em;' soper='" + Q + "' class='soptclass' colname='" + this.name + "'>" + h + "</a>"
                        }
                        b("td:eq(0)", W).attr("colindex", N).append(f);
                        if (d.clearSearch === undefined) {
                            d.clearSearch = true
                        }
                        if (d.clearSearch) {
                            var R = a.resetTitle || "Clear Search Value";
                            b("td:eq(2)", W).append("<a title='" + R + "' style='padding-right: 0.3em;padding-left: 0.3em;' class='clearsearchclass'>" + a.resetIcon + "</a>")
                        } else {
                            b("td:eq(2)", W).hide()
                        }
                        switch (this.stype) {
                        case "select":
                            V = this.surl || d.dataUrl;
                            if (V) {
                                L = P;
                                b(L).append(W);
                                b.ajax(b.extend({
                                    url: V,
                                    dataType: "html",
                                    success: function(r) {
                                        if (d.buildSelect !== undefined) {
                                            var q = d.buildSelect(r);
                                            if (q) {
                                                b("td:eq(1)", W).append(q)
                                            }
                                        } else {
                                            b("td:eq(1)", W).append(r)
                                        }
                                        if (d.defaultValue !== undefined) {
                                            b("select", L).val(d.defaultValue)
                                        }
                                        b("select", L).attr({
                                            name: T.index || T.name,
                                            id: "gs_" + T.name
                                        });
                                        if (d.attr) {
                                            b("select", L).attr(d.attr)
                                        }
                                        b("select", L).css({
                                            width: "100%"
                                        });
                                        b.jgrid.bindEv.call(j, b("select", L)[0], d);
                                        if (a.autosearch === true) {
                                            b("select", L).change(function() {
                                                p();
                                                return false
                                            })
                                        }
                                        r = null
                                    }
                                }, b.jgrid.ajaxOptions, j.p.ajaxSelectOptions || {}))
                            } else {
                                var Z, J, i;
                                if (T.searchoptions) {
                                    Z = T.searchoptions.value === undefined ? "" : T.searchoptions.value;
                                    J = T.searchoptions.separator === undefined ? ":" : T.searchoptions.separator;
                                    i = T.searchoptions.delimiter === undefined ? ";" : T.searchoptions.delimiter
                                } else {
                                    if (T.editoptions) {
                                        Z = T.editoptions.value === undefined ? "" : T.editoptions.value;
                                        J = T.editoptions.separator === undefined ? ":" : T.editoptions.separator;
                                        i = T.editoptions.delimiter === undefined ? ";" : T.editoptions.delimiter
                                    }
                                }
                                if (Z) {
                                    var M = document.createElement("select");
                                    M.style.width = "100%";
                                    b(M).attr({
                                        name: T.index || T.name,
                                        id: "gs_" + T.name
                                    });
                                    var g, Y, e, U;
                                    if (typeof Z === "string") {
                                        Q = Z.split(i);
                                        for (U = 0; U < Q.length; U++) {
                                            g = Q[U].split(J);
                                            Y = document.createElement("option");
                                            Y.value = g[0];
                                            Y.innerHTML = g[1];
                                            M.appendChild(Y)
                                        }
                                    } else {
                                        if (typeof Z === "object") {
                                            for (e in Z) {
                                                if (Z.hasOwnProperty(e)) {
                                                    Y = document.createElement("option");
                                                    Y.value = e;
                                                    Y.innerHTML = Z[e];
                                                    M.appendChild(Y)
                                                }
                                            }
                                        }
                                    }
                                    if (d.defaultValue !== undefined) {
                                        b(M).val(d.defaultValue)
                                    }
                                    if (d.attr) {
                                        b(M).attr(d.attr)
                                    }
                                    b(P).append(W);
                                    b.jgrid.bindEv.call(j, M, d);
                                    b("td:eq(1)", W).append(M);
                                    if (a.autosearch === true) {
                                        b(M).change(function() {
                                            p();
                                            return false
                                        })
                                    }
                                }
                            }
                            break;
                        case "text":
                            var K = d.defaultValue !== undefined ? d.defaultValue : "";
                            b("td:eq(1)", W).append("<input type='text' style='width:100%;padding:0px;' name='" + (T.index || T.name) + "' id='gs_" + T.name + "' value='" + K + "'/>");
                            b(P).append(W);
                            if (d.attr) {
                                b("input", P).attr(d.attr)
                            }
                            b.jgrid.bindEv.call(j, b("input", P)[0], d);
                            if (a.autosearch === true) {
                                if (a.searchOnEnter) {
                                    b("input", P).keypress(function(r) {
                                        var q = r.charCode || r.keyCode || 0;
                                        if (q === 13) {
                                            p();
                                            return false
                                        }
                                        return this
                                    })
                                } else {
                                    b("input", P).keydown(function(r) {
                                        var q = r.which;
                                        switch (q) {
                                        case 13:
                                            return false;
                                        case 9:
                                        case 16:
                                        case 37:
                                        case 38:
                                        case 39:
                                        case 40:
                                        case 27:
                                            break;
                                        default:
                                            if (o) {
                                                clearTimeout(o)
                                            }
                                            o = setTimeout(function() {
                                                p()
                                            }, 500)
                                        }
                                    })
                                }
                            }
                            break;
                        case "custom":
                            b("td:eq(1)", W).append("<span style='width:95%;padding:0px;' name='" + (T.index || T.name) + "' id='gs_" + T.name + "'/>");
                            b(P).append(W);
                            try {
                                if (b.isFunction(d.custom_element)) {
                                    var aa = d.custom_element.call(j, d.defaultValue !== undefined ? d.defaultValue : "", d);
                                    if (aa) {
                                        aa = b(aa).addClass("customelement");
                                        b(P).find(">span").append(aa)
                                    } else {
                                        throw "e2"
                                    }
                                } else {
                                    throw "e1"
                                }
                            } catch (O) {
                                if (O === "e1") {
                                    b.jgrid.info_dialog(b.jgrid.errors.errcap, "function 'custom_element' " + b.jgrid.edit.msg.nodefined, b.jgrid.edit.bClose)
                                }
                                if (O === "e2") {
                                    b.jgrid.info_dialog(b.jgrid.errors.errcap, "function 'custom_element' " + b.jgrid.edit.msg.novalue, b.jgrid.edit.bClose)
                                } else {
                                    b.jgrid.info_dialog(b.jgrid.errors.errcap, typeof O === "string" ? O : O.message, b.jgrid.edit.bClose)
                                }
                            }
                            break
                        }
                    }
                    b(X).append(P);
                    b(m).append(X);
                    if (!a.searchOperators) {
                        b("td:eq(0)", W).hide()
                    }
                });
                b("table thead", j.grid.hDiv).append(m);
                if (a.searchOperators) {
                    b(".soptclass", m).click(function(d) {
                        var c = b(this).offset()
                          , e = (c.left)
                          , f = (c.top);
                        l(this, e, f);
                        d.stopPropagation()
                    });
                    b("body").on("click", function(c) {
                        if (c.target.className !== "soptclass") {
                            b("#sopt_menu").hide()
                        }
                    })
                }
                b(".clearsearchclass", m).click(function(c) {
                    var g = b(this).parents("tr:first")
                      , d = parseInt(b("td.ui-search-oper", g).attr("colindex"), 10)
                      , f = b.extend({}, j.p.colModel[d].searchoptions || {})
                      , e = f.defaultValue ? f.defaultValue : "";
                    if (j.p.colModel[d].stype === "select") {
                        if (e) {
                            b("td.ui-search-input select", g).val(e)
                        } else {
                            b("td.ui-search-input select", g)[0].selectedIndex = 0
                        }
                    } else {
                        b("td.ui-search-input input", g).val(e)
                    }
                    if (a.autosearch === true) {
                        p()
                    }
                });
                this.ftoolbar = true;
                this.triggerToolbar = p;
                this.clearToolbar = k;
                this.toggleToolbar = n
            })
        },
        destroyFilterToolbar: function() {
            return this.each(function() {
                if (!this.ftoolbar) {
                    return
                }
                this.triggerToolbar = null;
                this.clearToolbar = null;
                this.toggleToolbar = null;
                this.ftoolbar = false;
                b(this.grid.hDiv).find("table thead tr.ui-search-toolbar").remove()
            })
        },
        destroyGroupHeader: function(a) {
            if (a === undefined) {
                a = true
            }
            return this.each(function() {
                var u = this, r, t, w, y, i, x, z = u.grid, q = b("table.ui-jqgrid-htable thead", z.hDiv), l = u.p.colModel, s;
                if (!z) {
                    return
                }
                b(this).unbind(".setGroupHeaders");
                r = b("<tr>", {
                    role: "rowheader"
                }).addClass("ui-jqgrid-labels");
                y = z.headers;
                for (t = 0,
                w = y.length; t < w; t++) {
                    s = l[t].hidden ? "none" : "";
                    i = b(y[t].el).width(y[t].width).css("display", s);
                    try {
                        i.removeAttr("rowSpan")
                    } catch (v) {
                        i.attr("rowSpan", 1)
                    }
                    r.append(i);
                    x = i.children("span.ui-jqgrid-resize");
                    if (x.length > 0) {
                        x[0].style.height = ""
                    }
                    i.children("div")[0].style.top = ""
                }
                b(q).children("tr.ui-jqgrid-labels").remove();
                b(q).prepend(r);
                if (a === true) {
                    b(u).jqGrid("setGridParam", {
                        groupHeader: null
                    })
                }
            })
        },
        setGroupHeaders: function(a) {
            a = b.extend({
                useColSpanStyle: false,
                groupHeaders: []
            }, a || {});
            return this.each(function() {
                this.p.groupHeader = a;
                var X = this, B, F, E = 0, K, M, R, U, S, T, i, J, L, G, N = X.p.colModel, I = N.length, W = X.grid.headers, C = b("table.ui-jqgrid-htable", X.grid.hDiv), V = C.children("thead").children("tr.ui-jqgrid-labels:last").addClass("jqg-second-row-header"), O = C.children("thead"), H, P = C.find(".jqg-first-row-header");
                if (P[0] === undefined) {
                    P = b("<tr>", {
                        role: "row",
                        "aria-hidden": "true"
                    }).addClass("jqg-first-row-header").css("height", "auto")
                } else {
                    P.empty()
                }
                var Q, D = function(c, e) {
                    var d = e.length, f;
                    for (f = 0; f < d; f++) {
                        if (e[f].startColumnName === c) {
                            return f
                        }
                    }
                    return -1
                };
                b(X).prepend(O);
                K = b("<tr>", {
                    role: "rowheader"
                }).addClass("ui-jqgrid-labels jqg-third-row-header");
                for (B = 0; B < I; B++) {
                    R = W[B].el;
                    U = b(R);
                    F = N[B];
                    S = {
                        height: "0px",
                        width: W[B].width + "px",
                        display: (F.hidden ? "none" : "")
                    };
                    b("<th>", {
                        role: "gridcell"
                    }).css(S).addClass("ui-first-th-" + X.p.direction).appendTo(P);
                    R.style.width = "";
                    T = D(F.name, a.groupHeaders);
                    if (T >= 0) {
                        i = a.groupHeaders[T];
                        J = i.numberOfColumns;
                        L = i.titleText;
                        for (G = 0,
                        T = 0; T < J && (B + T < I); T++) {
                            if (!N[B + T].hidden) {
                                G++
                            }
                        }
                        M = b("<th>").attr({
                            role: "columnheader"
                        }).addClass("ui-state-default ui-th-column-header ui-th-" + X.p.direction).css({
                            height: "22px",
                            "border-top": "0 none"
                        }).html(L);
                        if (G > 0) {
                            M.attr("colspan", String(G))
                        }
                        if (X.p.headertitles) {
                            M.attr("title", M.text())
                        }
                        if (G === 0) {
                            M.hide()
                        }
                        U.before(M);
                        K.append(R);
                        E = J - 1
                    } else {
                        if (E === 0) {
                            if (a.useColSpanStyle) {
                                U.attr("rowspan", "2")
                            } else {
                                b("<th>", {
                                    role: "columnheader"
                                }).addClass("ui-state-default ui-th-column-header ui-th-" + X.p.direction).css({
                                    display: F.hidden ? "none" : "",
                                    "border-top": "0 none"
                                }).insertBefore(U);
                                K.append(R)
                            }
                        } else {
                            K.append(R);
                            E--
                        }
                    }
                }
                H = b(X).children("thead");
                H.prepend(P);
                K.insertAfter(V);
                C.append(H);
                if (a.useColSpanStyle) {
                    C.find("span.ui-jqgrid-resize").each(function() {
                        var c = b(this).parent();
                        if (c.is(":visible")) {
                            this.style.cssText = "height: " + c.height() + "px !important; cursor: col-resize;"
                        }
                    });
                    C.find("div.ui-jqgrid-sortable").each(function() {
                        var c = b(this)
                          , d = c.parent();
                        if (d.is(":visible") && d.is(":has(span.ui-jqgrid-resize)")) {
                            c.css("top", (d.height() - c.outerHeight()) / 2 + "px")
                        }
                    })
                }
                Q = H.find("tr.jqg-first-row-header");
                b(X).bind("jqGridResizeStop.setGroupHeaders", function(d, e, c) {
                    Q.find("th").eq(c).width(e)
                })
            })
        },
        setFrozenColumns: function() {
            return this.each(function() {
                if (!this.grid) {
                    return
                }
                var u = this
                  , a = u.p.colModel
                  , t = 0
                  , r = a.length
                  , i = -1
                  , z = false;
                if (u.p.subGrid === true || u.p.treeGrid === true || u.p.cellEdit === true || u.p.sortable || u.p.scroll) {
                    return
                }
                if (u.p.rownumbers) {
                    t++
                }
                if (u.p.multiselect) {
                    t++
                }
                while (t < r) {
                    if (a[t].frozen === true) {
                        z = true;
                        i = t
                    } else {
                        break
                    }
                    t++
                }
                if (i >= 0 && z) {
                    var q = u.p.caption ? b(u.grid.cDiv).outerHeight() : 0
                      , p = b(".ui-jqgrid-htable", "#gview_" + b.jgrid.jqID(u.p.id)).height();
                    if (u.p.toppager) {
                        q = q + b(u.grid.topDiv).outerHeight()
                    }
                    if (u.p.toolbar[0] === true) {
                        if (u.p.toolbar[1] !== "bottom") {
                            q = q + b(u.grid.uDiv).outerHeight()
                        }
                    }
                    u.grid.fhDiv = b('<div style="position:absolute;left:0px;top:' + q + "px;height:" + p + 'px;" class="frozen-div ui-state-default ui-jqgrid-hdiv"></div>');
                    u.grid.fbDiv = b('<div style="position:absolute;left:0px;top:' + (parseInt(q, 10) + parseInt(p, 10) + 1) + 'px;overflow-y:hidden" class="frozen-bdiv ui-jqgrid-bdiv"></div>');
                    b("#gview_" + b.jgrid.jqID(u.p.id)).append(u.grid.fhDiv);
                    var w = b(".ui-jqgrid-htable", "#gview_" + b.jgrid.jqID(u.p.id)).clone(true);
                    if (u.p.groupHeader) {
                        b("tr.jqg-first-row-header, tr.jqg-third-row-header", w).each(function() {
                            b("th:gt(" + i + ")", this).remove()
                        });
                        var y = -1, x = -1, s, v;
                        b("tr.jqg-second-row-header th", w).each(function() {
                            s = parseInt(b(this).attr("colspan"), 10);
                            v = parseInt(b(this).attr("rowspan"), 10);
                            if (v) {
                                y++;
                                x++
                            }
                            if (s) {
                                y = y + s;
                                x++
                            }
                            if (y === i) {
                                return false
                            }
                        });
                        if (y !== i) {
                            x = i
                        }
                        b("tr.jqg-second-row-header", w).each(function() {
                            b("th:gt(" + x + ")", this).remove()
                        })
                    } else {
                        b("tr", w).each(function() {
                            b("th:gt(" + i + ")", this).remove()
                        })
                    }
                    b(w).width(1);
                    b(u.grid.fhDiv).append(w).mousemove(function(c) {
                        if (u.grid.resizing) {
                            u.grid.dragMove(c);
                            return false
                        }
                    });
                    b(u).bind("jqGridResizeStop.setFrozenColumns", function(d, c, f) {
                        var e = b(".ui-jqgrid-htable", u.grid.fhDiv);
                        b("th:eq(" + f + ")", e).width(c);
                        var g = b(".ui-jqgrid-btable", u.grid.fbDiv);
                        b("tr:first td:eq(" + f + ")", g).width(c)
                    });
                    b(u).bind("jqGridSortCol.setFrozenColumns", function(d, g, e) {
                        var c = b("tr.ui-jqgrid-labels:last th:eq(" + u.p.lastsort + ")", u.grid.fhDiv)
                          , f = b("tr.ui-jqgrid-labels:last th:eq(" + e + ")", u.grid.fhDiv);
                        b("span.ui-grid-ico-sort", c).addClass("ui-state-disabled");
                        b(c).attr("aria-selected", "false");
                        b("span.ui-icon-" + u.p.sortorder, f).removeClass("ui-state-disabled");
                        b(f).attr("aria-selected", "true");
                        if (!u.p.viewsortcols[0]) {
                            if (u.p.lastsort !== e) {
                                b("span.s-ico", c).hide();
                                b("span.s-ico", f).show()
                            }
                        }
                    });
                    b("#gview_" + b.jgrid.jqID(u.p.id)).append(u.grid.fbDiv);
                    b(u.grid.bDiv).scroll(function() {
                        b(u.grid.fbDiv).scrollTop(b(this).scrollTop())
                    });
                    if (u.p.hoverrows === true) {
                        b("#" + b.jgrid.jqID(u.p.id)).unbind("mouseover").unbind("mouseout")
                    }
                    b(u).bind("jqGridAfterGridComplete.setFrozenColumns", function() {
                        b("#" + b.jgrid.jqID(u.p.id) + "_frozen").remove();
                        b(u.grid.fbDiv).height(b(u.grid.bDiv).height() - 16);
                        var c = b("#" + b.jgrid.jqID(u.p.id)).clone(true);
                        b("tr[role=row]", c).each(function() {
                            b("td[role=gridcell]:gt(" + i + ")", this).remove()
                        });
                        b(c).width(1).attr("id", u.p.id + "_frozen");
                        b(u.grid.fbDiv).append(c);
                        if (u.p.hoverrows === true) {
                            b("tr.jqgrow", c).hover(function() {
                                b(this).addClass("ui-state-hover");
                                b("#" + b.jgrid.jqID(this.id), "#" + b.jgrid.jqID(u.p.id)).addClass("ui-state-hover")
                            }, function() {
                                b(this).removeClass("ui-state-hover");
                                b("#" + b.jgrid.jqID(this.id), "#" + b.jgrid.jqID(u.p.id)).removeClass("ui-state-hover")
                            });
                            b("tr.jqgrow", "#" + b.jgrid.jqID(u.p.id)).hover(function() {
                                b(this).addClass("ui-state-hover");
                                b("#" + b.jgrid.jqID(this.id), "#" + b.jgrid.jqID(u.p.id) + "_frozen").addClass("ui-state-hover")
                            }, function() {
                                b(this).removeClass("ui-state-hover");
                                b("#" + b.jgrid.jqID(this.id), "#" + b.jgrid.jqID(u.p.id) + "_frozen").removeClass("ui-state-hover")
                            })
                        }
                        c = null
                    });
                    if (!u.grid.hDiv.loading) {
                        b(u).triggerHandler("jqGridAfterGridComplete")
                    }
                    u.p.frozenColumns = true
                }
            })
        },
        destroyFrozenColumns: function() {
            return this.each(function() {
                if (!this.grid) {
                    return
                }
                if (this.p.frozenColumns === true) {
                    var d = this;
                    b(d.grid.fhDiv).remove();
                    b(d.grid.fbDiv).remove();
                    d.grid.fhDiv = null;
                    d.grid.fbDiv = null;
                    b(this).unbind(".setFrozenColumns");
                    if (d.p.hoverrows === true) {
                        var a;
                        b("#" + b.jgrid.jqID(d.p.id)).bind("mouseover", function(c) {
                            a = b(c.target).closest("tr.jqgrow");
                            if (b(a).attr("class") !== "ui-subgrid") {
                                b(a).addClass("ui-state-hover")
                            }
                        }).bind("mouseout", function(c) {
                            a = b(c.target).closest("tr.jqgrow");
                            b(a).removeClass("ui-state-hover")
                        })
                    }
                    this.p.frozenColumns = false
                }
            })
        }
    })
}
)(jQuery);
(function(r) {
    r.fn.jqm = function(a) {
        var b = {
            overlay: 50,
            closeoverlay: true,
            overlayClass: "jqmOverlay",
            closeClass: "jqmClose",
            trigger: ".jqModal",
            ajax: f,
            ajaxText: "",
            target: f,
            modal: f,
            toTop: f,
            onShow: f,
            onHide: f,
            onLoad: f
        };
        return this.each(function() {
            if (this._jqm) {
                return m[this._jqm].c = r.extend({}, m[this._jqm].c, a)
            }
            e++;
            this._jqm = e;
            m[e] = {
                c: r.extend(b, r.jqm.params, a),
                a: f,
                w: r(this).addClass("jqmID" + e),
                s: e
            };
            if (b.trigger) {
                r(this).jqmAddTrigger(b.trigger)
            }
        })
    }
    ;
    r.fn.jqmAddClose = function(a) {
        return n(this, a, "jqmHide")
    }
    ;
    r.fn.jqmAddTrigger = function(a) {
        return n(this, a, "jqmShow")
    }
    ;
    r.fn.jqmShow = function(a) {
        return this.each(function() {
            r.jqm.open(this._jqm, a)
        })
    }
    ;
    r.fn.jqmHide = function(a) {
        return this.each(function() {
            r.jqm.close(this._jqm, a)
        })
    }
    ;
    r.jqm = {
        hash: {},
        open: function(i, j) {
            var c = m[i]
              , b = c.c
              , d = "." + b.closeClass
              , a = (parseInt(c.w.css("z-index")));
            a = (a > 0) ? a : 3000;
            var g = r("<div></div>").css({
                height: "100%",
                width: "100%",
                position: "fixed",
                left: 0,
                top: 0,
                "z-index": a - 1,
                opacity: b.overlay / 100
            });
            if (c.a) {
                return f
            }
            c.t = j;
            c.a = true;
            c.w.css("z-index", a);
            if (b.modal) {
                if (!t[0]) {
                    setTimeout(function() {
                        o("bind")
                    }, 1)
                }
                t.push(i)
            } else {
                if (b.overlay > 0) {
                    if (b.closeoverlay) {
                        c.w.jqmAddClose(g)
                    }
                } else {
                    g = f
                }
            }
            c.o = (g) ? g.addClass(b.overlayClass).prependTo("body") : f;
            if (b.ajax) {
                var h = b.target || c.w
                  , k = b.ajax;
                h = (typeof h == "string") ? r(h, c.w) : r(h);
                k = (k.substr(0, 1) == "@") ? r(j).attr(k.substring(1)) : k;
                h.html(b.ajaxText).load(k, function() {
                    if (b.onLoad) {
                        b.onLoad.call(this, c)
                    }
                    if (d) {
                        c.w.jqmAddClose(r(d, c.w))
                    }
                    p(c)
                })
            } else {
                if (d) {
                    c.w.jqmAddClose(r(d, c.w))
                }
            }
            if (b.toTop && c.o) {
                c.w.before('<span id="jqmP' + c.w[0]._jqm + '"></span>').insertAfter(c.o)
            }
            (b.onShow) ? b.onShow(c) : c.w.show();
            p(c);
            return f
        },
        close: function(a) {
            var b = m[a];
            if (!b.a) {
                return f
            }
            b.a = f;
            if (t[0]) {
                t.pop();
                if (!t[0]) {
                    o("unbind")
                }
            }
            if (b.c.toTop && b.o) {
                r("#jqmP" + b.w[0]._jqm).after(b.w).remove()
            }
            if (b.c.onHide) {
                b.c.onHide(b)
            } else {
                b.w.hide();
                if (b.o) {
                    b.o.remove()
                }
            }
            return f
        },
        params: {}
    };
    var e = 0
      , m = r.jqm.hash
      , t = []
      , f = false
      , p = function(a) {
        q(a)
    }
      , q = function(a) {
        try {
            r(":input:visible", a.w)[0].focus()
        } catch (b) {}
    }
      , o = function(a) {
        r(document)[a]("keypress", s)[a]("keydown", s)[a]("mousedown", s)
    }
      , s = function(c) {
        var b = m[t[t.length - 1]]
          , a = (!r(c.target).parents(".jqmID" + b.s)[0]);
        if (a) {
            r(".jqmID" + b.s).each(function() {
                var g = r(this)
                  , d = g.offset();
                if (d.top <= c.pageY && c.pageY <= d.top + g.height() && d.left <= c.pageX && c.pageX <= d.left + g.width()) {
                    a = false;
                    return false
                }
            });
            q(b)
        }
        return !a
    }
      , n = function(c, b, a) {
        return c.each(function() {
            var d = this._jqm;
            r(b).each(function() {
                if (!this[a]) {
                    this[a] = [];
                    r(this).click(function() {
                        for (var h in {
                            jqmShow: 1,
                            jqmHide: 1
                        }) {
                            for (var g in this[h]) {
                                if (m[this[h][g]]) {
                                    m[this[h][g]].w[h](this)
                                }
                            }
                        }
                        return f
                    })
                }
                this[a].push(d)
            })
        })
    }
}
)(jQuery);
(function(p) {
    p.fn.jqDrag = function(a) {
        return o(this, a, "d")
    }
    ;
    p.fn.jqResize = function(a, b) {
        return o(this, a, "r", b)
    }
    ;
    p.jqDnR = {
        dnr: {},
        e: 0,
        drag: function(a) {
            if (m.k == "d") {
                f.css({
                    left: m.X + a.pageX - m.pX,
                    top: m.Y + a.pageY - m.pY
                })
            } else {
                f.css({
                    width: Math.max(a.pageX - m.pX + m.W, 0),
                    height: Math.max(a.pageY - m.pY + m.H, 0)
                });
                if (r) {
                    i.css({
                        width: Math.max(a.pageX - r.pX + r.W, 0),
                        height: Math.max(a.pageY - r.pY + r.H, 0)
                    })
                }
            }
            return false
        },
        stop: function() {
            p(document).unbind("mousemove", l.drag).unbind("mouseup", l.stop)
        }
    };
    var l = p.jqDnR, m = l.dnr, f = l.e, i, r, o = function(a, b, c, d) {
        return a.each(function() {
            b = (b) ? p(b, a) : a;
            b.bind("mousedown", {
                e: a,
                k: c
            }, function(k) {
                var e = k.data
                  , g = {};
                f = e.e;
                i = d ? p(d) : false;
                if (f.css("position") != "relative") {
                    try {
                        f.position(g)
                    } catch (h) {}
                }
                m = {
                    X: g.left || n("left") || 0,
                    Y: g.top || n("top") || 0,
                    W: n("width") || f[0].scrollWidth || 0,
                    H: n("height") || f[0].scrollHeight || 0,
                    pX: k.pageX,
                    pY: k.pageY,
                    k: e.k
                };
                if (i && e.k != "d") {
                    r = {
                        X: g.left || q("left") || 0,
                        Y: g.top || q("top") || 0,
                        W: i[0].offsetWidth || q("width") || 0,
                        H: i[0].offsetHeight || q("height") || 0,
                        pX: k.pageX,
                        pY: k.pageY,
                        k: e.k
                    }
                } else {
                    r = false
                }
                if (p("input.hasDatepicker", f[0])[0]) {
                    try {
                        p("input.hasDatepicker", f[0]).datepicker("hide")
                    } catch (j) {}
                }
                p(document).mousemove(p.jqDnR.drag).mouseup(p.jqDnR.stop);
                return false
            })
        })
    }, n = function(a) {
        return parseInt(f.css(a), 10) || false
    }, q = function(a) {
        return parseInt(i.css(a), 10) || false
    }
}
)(jQuery);
var xmlJsonClass = {
    xml2json: function(f, i) {
        if (f.nodeType === 9) {
            f = f.documentElement
        }
        var g = this.removeWhite(f);
        var h = this.toObj(g);
        var j = this.toJson(h, f.nodeName, "\t");
        return "{\n" + i + (i ? j.replace(/\t/g, i) : j.replace(/\t|\n/g, "")) + "\n}"
    },
    json2xml: function(i, j) {
        var h = function(a, s, n) {
            var c = "";
            var d, r;
            if (a instanceof Array) {
                if (a.length === 0) {
                    c += n + "<" + s + ">__EMPTY_ARRAY_</" + s + ">\n"
                } else {
                    for (d = 0,
                    r = a.length; d < r; d += 1) {
                        var b = n + h(a[d], s, n + "\t") + "\n";
                        c += b
                    }
                }
            } else {
                if (typeof (a) === "object") {
                    var e = false;
                    c += n + "<" + s;
                    var m;
                    for (m in a) {
                        if (a.hasOwnProperty(m)) {
                            if (m.charAt(0) === "@") {
                                c += " " + m.substr(1) + '="' + a[m].toString() + '"'
                            } else {
                                e = true
                            }
                        }
                    }
                    c += e ? ">" : "/>";
                    if (e) {
                        for (m in a) {
                            if (a.hasOwnProperty(m)) {
                                if (m === "#text") {
                                    c += a[m]
                                } else {
                                    if (m === "#cdata") {
                                        c += "<![CDATA[" + a[m] + "]]>"
                                    } else {
                                        if (m.charAt(0) !== "@") {
                                            c += h(a[m], m, n + "\t")
                                        }
                                    }
                                }
                            }
                        }
                        c += (c.charAt(c.length - 1) === "\n" ? n : "") + "</" + s + ">"
                    }
                } else {
                    if (typeof (a) === "function") {
                        c += n + "<" + s + "><![CDATA[" + a + "]]></" + s + ">"
                    } else {
                        if (a === undefined) {
                            a = ""
                        }
                        if (a.toString() === '""' || a.toString().length === 0) {
                            c += n + "<" + s + ">__EMPTY_STRING_</" + s + ">"
                        } else {
                            c += n + "<" + s + ">" + a.toString() + "</" + s + ">"
                        }
                    }
                }
            }
            return c
        };
        var f = "";
        var g;
        for (g in i) {
            if (i.hasOwnProperty(g)) {
                f += h(i[g], g, "")
            }
        }
        return j ? f.replace(/\t/g, j) : f.replace(/\t|\n/g, "")
    },
    toObj: function(i) {
        var l = {};
        var m = /function/i;
        if (i.nodeType === 1) {
            if (i.attributes.length) {
                var n;
                for (n = 0; n < i.attributes.length; n += 1) {
                    l["@" + i.attributes[n].nodeName] = (i.attributes[n].nodeValue || "").toString()
                }
            }
            if (i.firstChild) {
                var j = 0
                  , o = 0
                  , p = false;
                var k;
                for (k = i.firstChild; k; k = k.nextSibling) {
                    if (k.nodeType === 1) {
                        p = true
                    } else {
                        if (k.nodeType === 3 && k.nodeValue.match(/[^ \f\n\r\t\v]/)) {
                            j += 1
                        } else {
                            if (k.nodeType === 4) {
                                o += 1
                            }
                        }
                    }
                }
                if (p) {
                    if (j < 2 && o < 2) {
                        this.removeWhite(i);
                        for (k = i.firstChild; k; k = k.nextSibling) {
                            if (k.nodeType === 3) {
                                l["#text"] = this.escape(k.nodeValue)
                            } else {
                                if (k.nodeType === 4) {
                                    if (m.test(k.nodeValue)) {
                                        l[k.nodeName] = [l[k.nodeName], k.nodeValue]
                                    } else {
                                        l["#cdata"] = this.escape(k.nodeValue)
                                    }
                                } else {
                                    if (l[k.nodeName]) {
                                        if (l[k.nodeName]instanceof Array) {
                                            l[k.nodeName][l[k.nodeName].length] = this.toObj(k)
                                        } else {
                                            l[k.nodeName] = [l[k.nodeName], this.toObj(k)]
                                        }
                                    } else {
                                        l[k.nodeName] = this.toObj(k)
                                    }
                                }
                            }
                        }
                    } else {
                        if (!i.attributes.length) {
                            l = this.escape(this.innerXml(i))
                        } else {
                            l["#text"] = this.escape(this.innerXml(i))
                        }
                    }
                } else {
                    if (j) {
                        if (!i.attributes.length) {
                            l = this.escape(this.innerXml(i));
                            if (l === "__EMPTY_ARRAY_") {
                                l = "[]"
                            } else {
                                if (l === "__EMPTY_STRING_") {
                                    l = ""
                                }
                            }
                        } else {
                            l["#text"] = this.escape(this.innerXml(i))
                        }
                    } else {
                        if (o) {
                            if (o > 1) {
                                l = this.escape(this.innerXml(i))
                            } else {
                                for (k = i.firstChild; k; k = k.nextSibling) {
                                    if (m.test(i.firstChild.nodeValue)) {
                                        l = i.firstChild.nodeValue;
                                        break
                                    } else {
                                        l["#cdata"] = this.escape(k.nodeValue)
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (!i.attributes.length && !i.firstChild) {
                l = null
            }
        } else {
            if (i.nodeType === 9) {
                l = this.toObj(i.documentElement)
            } else {
                alert("unhandled node type: " + i.nodeType)
            }
        }
        return l
    },
    toJson: function(w, x, u, t) {
        if (t === undefined) {
            t = true
        }
        var i = x ? ('"' + x + '"') : ""
          , s = "\t"
          , r = "\n";
        if (!t) {
            s = "";
            r = ""
        }
        if (w === "[]") {
            i += (x ? ":[]" : "[]")
        } else {
            if (w instanceof Array) {
                var v, n, o = [];
                for (n = 0,
                v = w.length; n < v; n += 1) {
                    o[n] = this.toJson(w[n], "", u + s, t)
                }
                i += (x ? ":[" : "[") + (o.length > 1 ? (r + u + s + o.join("," + r + u + s) + r + u) : o.join("")) + "]"
            } else {
                if (w === null) {
                    i += (x && ":") + "null"
                } else {
                    if (typeof (w) === "object") {
                        var m = [], q;
                        for (q in w) {
                            if (w.hasOwnProperty(q)) {
                                m[m.length] = this.toJson(w[q], q, u + s, t)
                            }
                        }
                        i += (x ? ":{" : "{") + (m.length > 1 ? (r + u + s + m.join("," + r + u + s) + r + u) : m.join("")) + "}"
                    } else {
                        if (typeof (w) === "string") {
                            i += (x && ":") + '"' + w.replace(/\\/g, "\\\\").replace(/\"/g, '\\"') + '"'
                        } else {
                            i += (x && ":") + w.toString()
                        }
                    }
                }
            }
        }
        return i
    },
    innerXml: function(h) {
        var c = "";
        if ("innerHTML"in h) {
            c = h.innerHTML
        } else {
            var f = function(a) {
                var d = "", e;
                if (a.nodeType === 1) {
                    d += "<" + a.nodeName;
                    for (e = 0; e < a.attributes.length; e += 1) {
                        d += " " + a.attributes[e].nodeName + '="' + (a.attributes[e].nodeValue || "").toString() + '"'
                    }
                    if (a.firstChild) {
                        d += ">";
                        for (var b = a.firstChild; b; b = b.nextSibling) {
                            d += f(b)
                        }
                        d += "</" + a.nodeName + ">"
                    } else {
                        d += "/>"
                    }
                } else {
                    if (a.nodeType === 3) {
                        d += a.nodeValue
                    } else {
                        if (a.nodeType === 4) {
                            d += "<![CDATA[" + a.nodeValue + "]]>"
                        }
                    }
                }
                return d
            };
            for (var g = h.firstChild; g; g = g.nextSibling) {
                c += f(g)
            }
        }
        return c
    },
    escape: function(b) {
        return b.replace(/[\\]/g, "\\\\").replace(/[\"]/g, '\\"').replace(/[\n]/g, "\\n").replace(/[\r]/g, "\\r")
    },
    removeWhite: function(d) {
        d.normalize();
        var f;
        for (f = d.firstChild; f; ) {
            if (f.nodeType === 3) {
                if (!f.nodeValue.match(/[^ \f\n\r\t\v]/)) {
                    var e = f.nextSibling;
                    d.removeChild(f);
                    f = e
                } else {
                    f = f.nextSibling
                }
            } else {
                if (f.nodeType === 1) {
                    this.removeWhite(f);
                    f = f.nextSibling
                } else {
                    f = f.nextSibling
                }
            }
        }
        return d
    }
};
(function(b) {
    b.fmatter = {};
    b.extend(b.fmatter, {
        isBoolean: function(a) {
            return typeof a === "boolean"
        },
        isObject: function(a) {
            return (a && (typeof a === "object" || b.isFunction(a))) || false
        },
        isString: function(a) {
            return typeof a === "string"
        },
        isNumber: function(a) {
            return typeof a === "number" && isFinite(a)
        },
        isValue: function(a) {
            return (this.isObject(a) || this.isString(a) || this.isNumber(a) || this.isBoolean(a))
        },
        isEmpty: function(a) {
            if (!this.isString(a) && this.isValue(a)) {
                return false
            }
            if (!this.isValue(a)) {
                return true
            }
            a = b.trim(a).replace(/\&nbsp\;/ig, "").replace(/\&#160\;/ig, "");
            return a === ""
        }
    });
    b.fn.fmatter = function(j, i, k, a, n) {
        var m = i;
        k = b.extend({}, b.jgrid.formatter, k);
        try {
            m = b.fn.fmatter[j].call(this, i, k, a, n)
        } catch (l) {}
        return m
    }
    ;
    b.fmatter.util = {
        NumberFormat: function(v, x) {
            if (!b.fmatter.isNumber(v)) {
                v *= 1
            }
            if (b.fmatter.isNumber(v)) {
                var t = (v < 0);
                var o = String(v);
                var r = x.decimalSeparator || ".";
                var q;
                if (b.fmatter.isNumber(x.decimalPlaces)) {
                    var p = x.decimalPlaces;
                    var u = Math.pow(10, p);
                    o = String(Math.round(v * u) / u);
                    q = o.lastIndexOf(".");
                    if (p > 0) {
                        if (q < 0) {
                            o += r;
                            q = o.length - 1
                        } else {
                            if (r !== ".") {
                                o = o.replace(".", r)
                            }
                        }
                        while ((o.length - 1 - q) < p) {
                            o += "0"
                        }
                    }
                }
                if (x.thousandsSeparator) {
                    var a = x.thousandsSeparator;
                    q = o.lastIndexOf(r);
                    q = (q > -1) ? q : o.length;
                    var i = o.substring(q);
                    var w = -1, s;
                    for (s = q; s > 0; s--) {
                        w++;
                        if ((w % 3 === 0) && (s !== q) && (!t || (s > 1))) {
                            i = a + i
                        }
                        i = o.charAt(s - 1) + i
                    }
                    o = i
                }
                o = (x.prefix) ? x.prefix + o : o;
                o = (x.suffix) ? o + x.suffix : o;
                return o
            }
            return v
        }
    };
    b.fn.fmatter.defaultFormat = function(d, a) {
        return (b.fmatter.isValue(d) && d !== "") ? d : a.defaultValue || "&#160;"
    }
    ;
    b.fn.fmatter.email = function(d, a) {
        if (!b.fmatter.isEmpty(d)) {
            return '<a href="mailto:' + d + '">' + d + "</a>"
        }
        return b.fn.fmatter.defaultFormat(d, a)
    }
    ;
    b.fn.fmatter.checkbox = function(h, j) {
        var g = b.extend({}, j.checkbox), i;
        if (j.colModel !== undefined && j.colModel.formatoptions !== undefined) {
            g = b.extend({}, g, j.colModel.formatoptions)
        }
        if (g.disabled === true) {
            i = 'disabled="disabled"'
        } else {
            i = ""
        }
        if (b.fmatter.isEmpty(h) || h === undefined) {
            h = b.fn.fmatter.defaultFormat(h, g)
        }
        h = String(h);
        h = (h + "").toLowerCase();
        var a = h.search(/(false|f|0|no|n|off|undefined)/i) < 0 ? " checked='checked' " : "";
        return '<input type="checkbox" ' + a + ' value="' + h + '" offval="no" ' + i + "/>"
    }
    ;
    b.fn.fmatter.link = function(g, a) {
        var f = {
            target: a.target
        };
        var h = "";
        if (a.colModel !== undefined && a.colModel.formatoptions !== undefined) {
            f = b.extend({}, f, a.colModel.formatoptions)
        }
        if (f.target) {
            h = "target=" + f.target
        }
        if (!b.fmatter.isEmpty(g)) {
            return "<a " + h + ' href="' + g + '">' + g + "</a>"
        }
        return b.fn.fmatter.defaultFormat(g, a)
    }
    ;
    b.fn.fmatter.showlink = function(i, a) {
        var g = {
            baseLinkUrl: a.baseLinkUrl,
            showAction: a.showAction,
            addParam: a.addParam || "",
            target: a.target,
            idName: a.idName
        }, j = "", h;
        if (a.colModel !== undefined && a.colModel.formatoptions !== undefined) {
            g = b.extend({}, g, a.colModel.formatoptions)
        }
        if (g.target) {
            j = "target=" + g.target
        }
        h = g.baseLinkUrl + g.showAction + "?" + g.idName + "=" + a.rowId + g.addParam;
        if (b.fmatter.isString(i) || b.fmatter.isNumber(i)) {
            return "<a " + j + ' href="' + h + '">' + i + "</a>"
        }
        return b.fn.fmatter.defaultFormat(i, a)
    }
    ;
    b.fn.fmatter.integer = function(f, a) {
        var e = b.extend({}, a.integer);
        if (a.colModel !== undefined && a.colModel.formatoptions !== undefined) {
            e = b.extend({}, e, a.colModel.formatoptions)
        }
        if (b.fmatter.isEmpty(f)) {
            return e.defaultValue
        }
        return b.fmatter.util.NumberFormat(f, e)
    }
    ;
    b.fn.fmatter.number = function(f, a) {
        var e = b.extend({}, a.number);
        if (a.colModel !== undefined && a.colModel.formatoptions !== undefined) {
            e = b.extend({}, e, a.colModel.formatoptions)
        }
        if (b.fmatter.isEmpty(f)) {
            return e.defaultValue
        }
        return b.fmatter.util.NumberFormat(f, e)
    }
    ;
    b.fn.fmatter.currency = function(f, a) {
        var e = b.extend({}, a.currency);
        if (a.colModel !== undefined && a.colModel.formatoptions !== undefined) {
            e = b.extend({}, e, a.colModel.formatoptions)
        }
        if (b.fmatter.isEmpty(f)) {
            return e.defaultValue
        }
        return b.fmatter.util.NumberFormat(f, e)
    }
    ;
    b.fn.fmatter.date = function(h, i, a, j) {
        var g = b.extend({}, i.date);
        if (i.colModel !== undefined && i.colModel.formatoptions !== undefined) {
            g = b.extend({}, g, i.colModel.formatoptions)
        }
        if (!g.reformatAfterEdit && j === "edit") {
            return b.fn.fmatter.defaultFormat(h, i)
        }
        if (!b.fmatter.isEmpty(h)) {
            return b.jgrid.parseDate(g.srcformat, h, g.newformat, g)
        }
        return b.fn.fmatter.defaultFormat(h, i)
    }
    ;
    b.fn.fmatter.select = function(s, x) {
        s = String(s);
        var u = false, q = [], a, v;
        if (x.colModel.formatoptions !== undefined) {
            u = x.colModel.formatoptions.value;
            a = x.colModel.formatoptions.separator === undefined ? ":" : x.colModel.formatoptions.separator;
            v = x.colModel.formatoptions.delimiter === undefined ? ";" : x.colModel.formatoptions.delimiter
        } else {
            if (x.colModel.editoptions !== undefined) {
                u = x.colModel.editoptions.value;
                a = x.colModel.editoptions.separator === undefined ? ":" : x.colModel.editoptions.separator;
                v = x.colModel.editoptions.delimiter === undefined ? ";" : x.colModel.editoptions.delimiter
            }
        }
        if (u) {
            var i = x.colModel.editoptions.multiple === true ? true : false, j = [], p;
            if (i) {
                j = s.split(",");
                j = b.map(j, function(c) {
                    return b.trim(c)
                })
            }
            if (b.fmatter.isString(u)) {
                var w = u.split(v), t = 0, r;
                for (r = 0; r < w.length; r++) {
                    p = w[r].split(a);
                    if (p.length > 2) {
                        p[1] = b.map(p, function(d, c) {
                            if (c > 0) {
                                return d
                            }
                        }).join(a)
                    }
                    if (i) {
                        if (b.inArray(p[0], j) > -1) {
                            q[t] = p[1];
                            t++
                        }
                    } else {
                        if (b.trim(p[0]) === b.trim(s)) {
                            q[0] = p[1];
                            break
                        }
                    }
                }
            } else {
                if (b.fmatter.isObject(u)) {
                    if (i) {
                        q = b.map(j, function(c) {
                            return u[c]
                        })
                    } else {
                        q[0] = u[s] || ""
                    }
                }
            }
        }
        s = q.join(", ");
        return s === "" ? b.fn.fmatter.defaultFormat(s, x) : s
    }
    ;
    b.fn.fmatter.rowactions = function(t) {
        var u = b(this).closest("tr.jqgrow")
          , q = u.attr("id")
          , a = b(this).closest("table.ui-jqgrid-btable").attr("id").replace(/_frozen([^_]*)$/, "$1")
          , p = b("#" + a)
          , x = p[0]
          , z = x.p
          , r = z.colModel[b.jgrid.getCellIndex(this)]
          , o = r.frozen ? b("tr#" + q + " td:eq(" + b.jgrid.getCellIndex(this) + ") > div", p) : b(this).parent()
          , v = {
            extraparam: {}
        }
          , y = function(c, d) {
            if (b.isFunction(v.afterSave)) {
                v.afterSave.call(x, c, d)
            }
            o.find("div.ui-inline-edit,div.ui-inline-del").show();
            o.find("div.ui-inline-save,div.ui-inline-cancel").hide()
        }
          , s = function(c) {
            if (b.isFunction(v.afterRestore)) {
                v.afterRestore.call(x, c)
            }
            o.find("div.ui-inline-edit,div.ui-inline-del").show();
            o.find("div.ui-inline-save,div.ui-inline-cancel").hide()
        };
        if (r.formatoptions !== undefined) {
            v = b.extend(v, r.formatoptions)
        }
        if (z.editOptions !== undefined) {
            v.editOptions = z.editOptions
        }
        if (z.delOptions !== undefined) {
            v.delOptions = z.delOptions
        }
        if (u.hasClass("jqgrid-new-row")) {
            v.extraparam[z.prmNames.oper] = z.prmNames.addoper
        }
        var w = {
            keys: v.keys,
            oneditfunc: v.onEdit,
            successfunc: v.onSuccess,
            url: v.url,
            extraparam: v.extraparam,
            aftersavefunc: y,
            errorfunc: v.onError,
            afterrestorefunc: s,
            restoreAfterError: v.restoreAfterError,
            mtype: v.mtype
        };
        switch (t) {
        case "edit":
            p.jqGrid("editRow", q, w);
            o.find("div.ui-inline-edit,div.ui-inline-del").hide();
            o.find("div.ui-inline-save,div.ui-inline-cancel").show();
            p.triggerHandler("jqGridAfterGridComplete");
            break;
        case "save":
            if (p.jqGrid("saveRow", q, w)) {
                o.find("div.ui-inline-edit,div.ui-inline-del").show();
                o.find("div.ui-inline-save,div.ui-inline-cancel").hide();
                p.triggerHandler("jqGridAfterGridComplete")
            }
            break;
        case "cancel":
            p.jqGrid("restoreRow", q, s);
            o.find("div.ui-inline-edit,div.ui-inline-del").show();
            o.find("div.ui-inline-save,div.ui-inline-cancel").hide();
            p.triggerHandler("jqGridAfterGridComplete");
            break;
        case "del":
            p.jqGrid("delGridRow", q, v.delOptions);
            break;
        case "formedit":
            p.jqGrid("setSelection", q);
            p.jqGrid("editGridRow", q, v.editOptions);
            break
        }
    }
    ;
    b.fn.fmatter.actions = function(j, l) {
        var h = {
            keys: false,
            editbutton: true,
            delbutton: true,
            editformbutton: false
        }, a = l.rowId, i = "", k;
        if (l.colModel.formatoptions !== undefined) {
            h = b.extend(h, l.colModel.formatoptions)
        }
        if (a === undefined || b.fmatter.isEmpty(a)) {
            return ""
        }
        if (h.editformbutton) {
            k = "id='jEditButton_" + a + "' onclick=jQuery.fn.fmatter.rowactions.call(this,'formedit'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
            i += "<div title='" + b.jgrid.nav.edittitle + "' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' " + k + "><span class='ui-icon ui-icon-pencil'></span></div>"
        } else {
            if (h.editbutton) {
                k = "id='jEditButton_" + a + "' onclick=jQuery.fn.fmatter.rowactions.call(this,'edit'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover') ";
                i += "<div title='" + b.jgrid.nav.edittitle + "' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' " + k + "><span class='ui-icon ui-icon-pencil'></span></div>"
            }
        }
        if (h.delbutton) {
            k = "id='jDeleteButton_" + a + "' onclick=jQuery.fn.fmatter.rowactions.call(this,'del'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
            i += "<div title='" + b.jgrid.nav.deltitle + "' style='float:left;margin-left:5px;' class='ui-pg-div ui-inline-del' " + k + "><span class='ui-icon ui-icon-trash'></span></div>"
        }
        k = "id='jSaveButton_" + a + "' onclick=jQuery.fn.fmatter.rowactions.call(this,'save'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
        i += "<div title='" + b.jgrid.edit.bSubmit + "' style='float:left;display:none' class='ui-pg-div ui-inline-save' " + k + "><span class='ui-icon ui-icon-disk'></span></div>";
        k = "id='jCancelButton_" + a + "' onclick=jQuery.fn.fmatter.rowactions.call(this,'cancel'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
        i += "<div title='" + b.jgrid.edit.bCancel + "' style='float:left;display:none;margin-left:5px;' class='ui-pg-div ui-inline-cancel' " + k + "><span class='ui-icon ui-icon-cancel'></span></div>";
        return "<div style='margin-left:8px;'>" + i + "</div>"
    }
    ;
    b.unformat = function(w, o, r, y) {
        var t, v = o.colModel.formatter, u = o.colModel.formatoptions || {}, a, p = /([\.\*\_\'\(\)\{\}\+\?\\])/g, s = o.colModel.unformat || (b.fn.fmatter[v] && b.fn.fmatter[v].unformat);
        if (s !== undefined && b.isFunction(s)) {
            t = s.call(this, b(w).text(), o, w)
        } else {
            if (v !== undefined && b.fmatter.isString(v)) {
                var z = b.jgrid.formatter || {}, q;
                switch (v) {
                case "integer":
                    u = b.extend({}, z.integer, u);
                    a = u.thousandsSeparator.replace(p, "\\$1");
                    q = new RegExp(a,"g");
                    t = b(w).text().replace(q, "");
                    break;
                case "number":
                    u = b.extend({}, z.number, u);
                    a = u.thousandsSeparator.replace(p, "\\$1");
                    q = new RegExp(a,"g");
                    t = b(w).text().replace(q, "").replace(u.decimalSeparator, ".");
                    break;
                case "currency":
                    u = b.extend({}, z.currency, u);
                    a = u.thousandsSeparator.replace(p, "\\$1");
                    q = new RegExp(a,"g");
                    t = b(w).text();
                    if (u.prefix && u.prefix.length) {
                        t = t.substr(u.prefix.length)
                    }
                    if (u.suffix && u.suffix.length) {
                        t = t.substr(0, t.length - u.suffix.length)
                    }
                    t = t.replace(q, "").replace(u.decimalSeparator, ".");
                    break;
                case "checkbox":
                    var x = (o.colModel.editoptions) ? o.colModel.editoptions.value.split(":") : ["Yes", "No"];
                    t = b("input", w).is(":checked") ? x[0] : x[1];
                    break;
                case "select":
                    t = b.unformat.select(w, o, r, y);
                    break;
                case "actions":
                    return "";
                default:
                    t = b(w).text()
                }
            }
        }
        return t !== undefined ? t : y === true ? b(w).text() : b.jgrid.htmlDecode(b(w).html())
    }
    ;
    b.unformat.select = function(z, a, v, C) {
        var w = [];
        var j = b(z).text();
        if (C === true) {
            return j
        }
        var x = b.extend({}, a.colModel.formatoptions !== undefined ? a.colModel.formatoptions : a.colModel.editoptions)
          , F = x.separator === undefined ? ":" : x.separator
          , D = x.delimiter === undefined ? ";" : x.delimiter;
        if (x.value) {
            var B = x.value, i = x.multiple === true ? true : false, t = [], u;
            if (i) {
                t = j.split(",");
                t = b.map(t, function(c) {
                    return b.trim(c)
                })
            }
            if (b.fmatter.isString(B)) {
                var E = B.split(D), A = 0, y;
                for (y = 0; y < E.length; y++) {
                    u = E[y].split(F);
                    if (u.length > 2) {
                        u[1] = b.map(u, function(d, c) {
                            if (c > 0) {
                                return d
                            }
                        }).join(F)
                    }
                    if (i) {
                        if (b.inArray(u[1], t) > -1) {
                            w[A] = u[0];
                            A++
                        }
                    } else {
                        if (b.trim(u[1]) === b.trim(j)) {
                            w[0] = u[0];
                            break
                        }
                    }
                }
            } else {
                if (b.fmatter.isObject(B) || b.isArray(B)) {
                    if (!i) {
                        t[0] = j
                    }
                    w = b.map(t, function(c) {
                        var d;
                        b.each(B, function(f, e) {
                            if (e === c) {
                                d = f;
                                return false
                            }
                        });
                        if (d !== undefined) {
                            return d
                        }
                    })
                }
            }
            return w.join(", ")
        }
        return j || ""
    }
    ;
    b.unformat.date = function(f, a) {
        var e = b.jgrid.formatter.date || {};
        if (a.formatoptions !== undefined) {
            e = b.extend({}, e, a.formatoptions)
        }
        if (!b.fmatter.isEmpty(f)) {
            return b.jgrid.parseDate(e.newformat, f, e.srcformat, e)
        }
        return b.fn.fmatter.defaultFormat(f, a)
    }
}
)(jQuery);
(function(b) {
    b.extend(b.jgrid, {
        showModal: function(a) {
            a.w.show()
        },
        closeModal: function(a) {
            a.w.hide().attr("aria-hidden", "true");
            if (a.o) {
                a.o.remove()
            }
        },
        hideModal: function(a, e) {
            e = b.extend({
                jqm: true,
                gb: ""
            }, e || {});
            if (e.onClose) {
                var h = e.gb && typeof e.gb === "string" && e.gb.substr(0, 6) === "#gbox_" ? e.onClose.call(b("#" + e.gb.substr(6))[0], a) : e.onClose(a);
                if (typeof h === "boolean" && !h) {
                    return
                }
            }
            if (b.fn.jqm && e.jqm === true) {
                b(a).attr("aria-hidden", "true").jqmHide()
            } else {
                if (e.gb !== "") {
                    try {
                        b(".jqgrid-overlay:first", e.gb).hide()
                    } catch (g) {}
                }
                b(a).hide().attr("aria-hidden", "true")
            }
        },
        findPos: function(f) {
            var e = 0
              , a = 0;
            if (f.offsetParent) {
                do {
                    e += f.offsetLeft;
                    a += f.offsetTop
                } while (f = f.offsetParent)
            }
            return [e, a]
        },
        createModal: function(F, y, B, L, e, K, G) {
            B = b.extend(true, {}, b.jgrid.jqModal || {}, B);
            var D = document.createElement("div"), x, C = this;
            G = b.extend({}, G || {});
            x = b(B.gbox).attr("dir") === "rtl" ? true : false;
            D.className = "ui-widget ui-widget-content ui-corner-all ui-jqdialog";
            D.id = F.themodal;
            var p = document.createElement("div");
            p.className = "ui-jqdialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix";
            p.id = F.modalhead;
            b(p).append("<span class='ui-jqdialog-title'>" + B.caption + "</span>");
            var A = b("<a class='ui-jqdialog-titlebar-close ui-corner-all'></a>").hover(function() {
                A.addClass("ui-state-hover")
            }, function() {
                A.removeClass("ui-state-hover")
            }).append("<span class='ui-icon ui-icon-closethick'></span>");
            b(p).append(A);
            if (x) {
                D.dir = "rtl";
                b(".ui-jqdialog-title", p).css("float", "right");
                b(".ui-jqdialog-titlebar-close", p).css("left", 0.3 + "em")
            } else {
                D.dir = "ltr";
                b(".ui-jqdialog-title", p).css("float", "left");
                b(".ui-jqdialog-titlebar-close", p).css("right", 0.3 + "em")
            }
            var a = document.createElement("div");
            b(a).addClass("ui-jqdialog-content ui-widget-content").attr("id", F.modalcontent);
            b(a).append(y);
            D.appendChild(a);
            b(D).prepend(p);
            if (K === true) {
                b("body").append(D)
            } else {
                if (typeof K === "string") {
                    b(K).append(D)
                } else {
                    b(D).insertBefore(L)
                }
            }
            b(D).css(G);
            if (B.jqModal === undefined) {
                B.jqModal = true
            }
            var z = {};
            if (b.fn.jqm && B.jqModal === true) {
                if (B.left === 0 && B.top === 0 && B.overlay) {
                    var J = [];
                    J = b.jgrid.findPos(e);
                    B.left = J[0] + 4;
                    B.top = J[1] + 4
                }
                z.top = B.top + "px";
                z.left = B.left
            } else {
                if (B.left !== 0 || B.top !== 0) {
                    z.left = B.left;
                    z.top = B.top + "px"
                }
            }
            b("a.ui-jqdialog-titlebar-close", p).click(function() {
                var d = b("#" + b.jgrid.jqID(F.themodal)).data("onClose") || B.onClose;
                var c = b("#" + b.jgrid.jqID(F.themodal)).data("gbox") || B.gbox;
                C.hideModal("#" + b.jgrid.jqID(F.themodal), {
                    gb: c,
                    jqm: B.jqModal,
                    onClose: d
                });
                return false
            });
            if (B.width === 0 || !B.width) {
                B.width = 300
            }
            if (B.height === 0 || !B.height) {
                B.height = 200
            }
            if (!B.zIndex) {
                var I = b(L).parents("*[role=dialog]").filter(":first").css("z-index");
                if (I) {
                    B.zIndex = parseInt(I, 10) + 2
                } else {
                    B.zIndex = 950
                }
            }
            var H = 0;
            if (x && z.left && !K) {
                H = b(B.gbox).width() - (!isNaN(B.width) ? parseInt(B.width, 10) : 0) - 8;
                z.left = parseInt(z.left, 10) + parseInt(H, 10)
            }
            if (z.left) {
                z.left += "px"
            }
            b(D).css(b.extend({
                width: isNaN(B.width) ? "auto" : B.width + "px",
                height: isNaN(B.height) ? "auto" : B.height + "px",
                zIndex: B.zIndex,
                overflow: "hidden"
            }, z)).attr({
                tabIndex: "-1",
                role: "dialog",
                "aria-labelledby": F.modalhead,
                "aria-hidden": "true"
            });
            if (B.drag === undefined) {
                B.drag = true
            }
            if (B.resize === undefined) {
                B.resize = true
            }
            if (B.drag) {
                b(p).css("cursor", "move");
                if (b.fn.jqDrag) {
                    b(D).jqDrag(p)
                } else {
                    try {
                        b(D).draggable({
                            handle: b("#" + b.jgrid.jqID(p.id))
                        })
                    } catch (r) {}
                }
            }
            if (B.resize) {
                if (b.fn.jqResize) {
                    b(D).append("<div class='jqResize ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se'></div>");
                    b("#" + b.jgrid.jqID(F.themodal)).jqResize(".jqResize", F.scrollelm ? "#" + b.jgrid.jqID(F.scrollelm) : false)
                } else {
                    try {
                        b(D).resizable({
                            handles: "se, sw",
                            alsoResize: F.scrollelm ? "#" + b.jgrid.jqID(F.scrollelm) : false
                        })
                    } catch (E) {}
                }
            }
            if (B.closeOnEscape === true) {
                b(D).keydown(function(c) {
                    if (c.which == 27) {
                        var d = b("#" + b.jgrid.jqID(F.themodal)).data("onClose") || B.onClose;
                        C.hideModal("#" + b.jgrid.jqID(F.themodal), {
                            gb: B.gbox,
                            jqm: B.jqModal,
                            onClose: d
                        })
                    }
                })
            }
        },
        viewModal: function(a, e) {
            e = b.extend({
                toTop: true,
                overlay: 10,
                modal: false,
                overlayClass: "ui-widget-overlay",
                onShow: b.jgrid.showModal,
                onHide: b.jgrid.closeModal,
                gbox: "",
                jqm: true,
                jqM: true
            }, e || {});
            if (b.fn.jqm && e.jqm === true) {
                if (e.jqM) {
                    b(a).attr("aria-hidden", "false").jqm(e).jqmShow()
                } else {
                    b(a).attr("aria-hidden", "false").jqmShow()
                }
            } else {
                if (e.gbox !== "") {
                    b(".jqgrid-overlay:first", e.gbox).show();
                    b(a).data("gbox", e.gbox)
                }
                b(a).show().attr("aria-hidden", "false");
                try {
                    b(":input:visible", a)[0].focus()
                } catch (f) {}
            }
        },
        info_dialog: function(e, u, A, i) {
            var s = {
                width: 290,
                height: "auto",
                dataheight: "auto",
                drag: true,
                resize: false,
                left: 250,
                top: 170,
                zIndex: 1000,
                jqModal: true,
                modal: false,
                closeOnEscape: true,
                align: "center",
                buttonalign: "center",
                buttons: []
            };
            b.extend(true, s, b.jgrid.jqModal || {}, {
                caption: "<b>" + e + "</b>"
            }, i || {});
            var y = s.jqModal
              , a = this;
            if (b.fn.jqm && !y) {
                y = false
            }
            var w = "", x;
            if (s.buttons.length > 0) {
                for (x = 0; x < s.buttons.length; x++) {
                    if (s.buttons[x].id === undefined) {
                        s.buttons[x].id = "info_button_" + x
                    }
                    w += "<a id='" + s.buttons[x].id + "' class='fm-button ui-state-default ui-corner-all'>" + s.buttons[x].text + "</a>"
                }
            }
            var t = isNaN(s.dataheight) ? s.dataheight : s.dataheight + "px"
              , m = "text-align:" + s.align + ";";
            var B = "<div id='info_id'>";
            B += "<div id='infocnt' style='margin:0px;padding-bottom:1em;width:100%;overflow:auto;position:relative;height:" + t + ";" + m + "'>" + u + "</div>";
            B += A ? "<div class='ui-widget-content ui-helper-clearfix' style='text-align:" + s.buttonalign + ";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px 0 0 0;'><a id='closedialog' class='fm-button ui-state-default ui-corner-all'>" + A + "</a>" + w + "</div>" : w !== "" ? "<div class='ui-widget-content ui-helper-clearfix' style='text-align:" + s.buttonalign + ";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px 0 0 0;'>" + w + "</div>" : "";
            B += "</div>";
            try {
                if (b("#info_dialog").attr("aria-hidden") === "false") {
                    b.jgrid.hideModal("#info_dialog", {
                        jqm: y
                    })
                }
                b("#info_dialog").remove()
            } catch (v) {}
            b.jgrid.createModal({
                themodal: "info_dialog",
                modalhead: "info_head",
                modalcontent: "info_content",
                scrollelm: "infocnt"
            }, B, s, "", "", true);
            if (w) {
                b.each(s.buttons, function(c) {
                    b("#" + b.jgrid.jqID(this.id), "#info_id").bind("click", function() {
                        s.buttons[c].onClick.call(b("#info_dialog"));
                        return false
                    })
                })
            }
            b("#closedialog", "#info_id").click(function() {
                a.hideModal("#info_dialog", {
                    jqm: y,
                    onClose: b("#info_dialog").data("onClose") || s.onClose,
                    gb: b("#info_dialog").data("gbox") || s.gbox
                });
                return false
            });
            b(".fm-button", "#info_dialog").hover(function() {
                b(this).addClass("ui-state-hover")
            }, function() {
                b(this).removeClass("ui-state-hover")
            });
            if (b.isFunction(s.beforeOpen)) {
                s.beforeOpen()
            }
            b.jgrid.viewModal("#info_dialog", {
                onHide: function(c) {
                    c.w.hide().remove();
                    if (c.o) {
                        c.o.remove()
                    }
                },
                modal: s.modal,
                jqm: y
            });
            if (b.isFunction(s.afterOpen)) {
                s.afterOpen()
            }
            try {
                b("#info_dialog").focus()
            } catch (z) {}
        },
        bindEv: function(f, a) {
            var e = this;
            if (b.isFunction(a.dataInit)) {
                a.dataInit.call(e, f, a)
            }
            if (a.dataEvents) {
                b.each(a.dataEvents, function() {
                    if (this.data !== undefined) {
                        b(f).bind(this.type, this.data, this.fn)
                    } else {
                        b(f).bind(this.type, this.fn)
                    }
                })
            }
        },
        createEl: function(U, S, i, O, D) {
            var C = ""
              , H = this;
            function F(f, g, c) {
                var d = ["dataInit", "dataEvents", "dataUrl", "buildSelect", "sopt", "searchhidden", "defaultValue", "attr", "custom_element", "custom_value"];
                if (c !== undefined && b.isArray(c)) {
                    b.merge(d, c)
                }
                b.each(g, function(j, h) {
                    if (b.inArray(j, d) === -1) {
                        b(f).attr(j, h)
                    }
                });
                if (!g.hasOwnProperty("id")) {
                    b(f).attr("id", b.jgrid.randId())
                }
            }
            switch (U) {
            case "textarea":
                C = document.createElement("textarea");
                if (O) {
                    if (!S.cols) {
                        b(C).css({
                            width: "98%"
                        })
                    }
                } else {
                    if (!S.cols) {
                        S.cols = 20
                    }
                }
                if (!S.rows) {
                    S.rows = 2
                }
                if (i === "&nbsp;" || i === "&#160;" || (i.length === 1 && i.charCodeAt(0) === 160)) {
                    i = ""
                }
                C.value = i;
                F(C, S);
                b(C).attr({
                    role: "textbox",
                    multiline: "true"
                });
                break;
            case "checkbox":
                C = document.createElement("input");
                C.type = "checkbox";
                if (!S.value) {
                    var I = (i + "").toLowerCase();
                    if (I.search(/(false|f|0|no|n|off|undefined)/i) < 0 && I !== "") {
                        C.checked = true;
                        C.defaultChecked = true;
                        C.value = i
                    } else {
                        C.value = "on"
                    }
                    b(C).attr("offval", "off")
                } else {
                    var L = S.value.split(":");
                    if (i === L[0]) {
                        C.checked = true;
                        C.defaultChecked = true
                    }
                    C.value = L[0];
                    b(C).attr("offval", L[1])
                }
                F(C, S, ["value"]);
                b(C).attr("role", "checkbox");
                break;
            case "select":
                C = document.createElement("select");
                C.setAttribute("role", "select");
                var V, R = [];
                if (S.multiple === true) {
                    V = true;
                    C.multiple = "multiple";
                    b(C).attr("aria-multiselectable", "true")
                } else {
                    V = false
                }
                if (S.dataUrl !== undefined) {
                    var P = S.name ? String(S.id).substring(0, String(S.id).length - String(S.name).length - 1) : String(S.id)
                      , T = S.postData || D.postData;
                    if (H.p && H.p.idPrefix) {
                        P = b.jgrid.stripPref(H.p.idPrefix, P)
                    }
                    b.ajax(b.extend({
                        url: b.isFunction(S.dataUrl) ? S.dataUrl.call(H, P, i, String(S.name)) : S.dataUrl,
                        type: "GET",
                        dataType: "html",
                        data: b.isFunction(T) ? T.call(H, P, i, String(S.name)) : T,
                        context: {
                            elem: C,
                            options: S,
                            vl: i
                        },
                        success: function(d) {
                            var c = []
                              , f = this.elem
                              , g = this.vl
                              , k = b.extend({}, this.options)
                              , j = k.multiple === true
                              , h = b.isFunction(k.buildSelect) ? k.buildSelect.call(H, d) : d;
                            if (typeof h === "string") {
                                h = b(b.trim(h)).html()
                            }
                            if (h) {
                                b(f).append(h);
                                F(f, k, T ? ["postData"] : undefined);
                                if (k.size === undefined) {
                                    k.size = j ? 3 : 1
                                }
                                if (j) {
                                    c = g.split(",");
                                    c = b.map(c, function(l) {
                                        return b.trim(l)
                                    })
                                } else {
                                    c[0] = b.trim(g)
                                }
                                setTimeout(function() {
                                    b("option", f).each(function(l) {
                                        if (l === 0 && f.multiple) {
                                            this.selected = false
                                        }
                                        b(this).attr("role", "option");
                                        if (b.inArray(b.trim(b(this).text()), c) > -1 || b.inArray(b.trim(b(this).val()), c) > -1) {
                                            this.selected = "selected"
                                        }
                                    })
                                }, 0)
                            }
                        }
                    }, D || {}))
                } else {
                    if (S.value) {
                        var J;
                        if (S.size === undefined) {
                            S.size = V ? 3 : 1
                        }
                        if (V) {
                            R = i.split(",");
                            R = b.map(R, function(c) {
                                return b.trim(c)
                            })
                        }
                        if (typeof S.value === "function") {
                            S.value = S.value()
                        }
                        var G, M, Q, N = S.separator === undefined ? ":" : S.separator, e = S.delimiter === undefined ? ";" : S.delimiter;
                        if (typeof S.value === "string") {
                            G = S.value.split(e);
                            for (J = 0; J < G.length; J++) {
                                M = G[J].split(N);
                                if (M.length > 2) {
                                    M[1] = b.map(M, function(c, d) {
                                        if (d > 0) {
                                            return c
                                        }
                                    }).join(N)
                                }
                                Q = document.createElement("option");
                                Q.setAttribute("role", "option");
                                Q.value = M[0];
                                Q.innerHTML = M[1];
                                C.appendChild(Q);
                                if (!V && (b.trim(M[0]) === b.trim(i) || b.trim(M[1]) === b.trim(i))) {
                                    Q.selected = "selected"
                                }
                                if (V && (b.inArray(b.trim(M[1]), R) > -1 || b.inArray(b.trim(M[0]), R) > -1)) {
                                    Q.selected = "selected"
                                }
                            }
                        } else {
                            if (typeof S.value === "object") {
                                var W = S.value, K;
                                for (K in W) {
                                    if (W.hasOwnProperty(K)) {
                                        Q = document.createElement("option");
                                        Q.setAttribute("role", "option");
                                        Q.value = K;
                                        Q.innerHTML = W[K];
                                        C.appendChild(Q);
                                        if (!V && (b.trim(K) === b.trim(i) || b.trim(W[K]) === b.trim(i))) {
                                            Q.selected = "selected"
                                        }
                                        if (V && (b.inArray(b.trim(W[K]), R) > -1 || b.inArray(b.trim(K), R) > -1)) {
                                            Q.selected = "selected"
                                        }
                                    }
                                }
                            }
                        }
                        F(C, S, ["value"])
                    }
                }
                break;
            case "text":
            case "password":
            case "button":
                var a;
                if (U === "button") {
                    a = "button"
                } else {
                    a = "textbox"
                }
                C = document.createElement("input");
                C.type = U;
                C.value = i;
                F(C, S);
                if (U !== "button") {
                    if (O) {
                        if (!S.size) {
                            b(C).css({
                                width: "98%"
                            })
                        }
                    } else {
                        if (!S.size) {
                            S.size = 20
                        }
                    }
                }
                b(C).attr("role", a);
                break;
            case "image":
            case "file":
                C = document.createElement("input");
                C.type = U;
                F(C, S);
                break;
            case "custom":
                C = document.createElement("span");
                try {
                    if (b.isFunction(S.custom_element)) {
                        var X = S.custom_element.call(H, i, S);
                        if (X) {
                            X = b(X).addClass("customelement").attr({
                                id: S.id,
                                name: S.name
                            });
                            b(C).empty().append(X)
                        } else {
                            throw "e2"
                        }
                    } else {
                        throw "e1"
                    }
                } catch (E) {
                    if (E === "e1") {
                        b.jgrid.info_dialog(b.jgrid.errors.errcap, "function 'custom_element' " + b.jgrid.edit.msg.nodefined, b.jgrid.edit.bClose)
                    }
                    if (E === "e2") {
                        b.jgrid.info_dialog(b.jgrid.errors.errcap, "function 'custom_element' " + b.jgrid.edit.msg.novalue, b.jgrid.edit.bClose)
                    } else {
                        b.jgrid.info_dialog(b.jgrid.errors.errcap, typeof E === "string" ? E : E.message, b.jgrid.edit.bClose)
                    }
                }
                break
            }
            return C
        },
        checkDate: function(j, x) {
            var r = function(c) {
                return (((c % 4 === 0) && (c % 100 !== 0 || (c % 400 === 0))) ? 29 : 28)
            }, v = {}, a;
            j = j.toLowerCase();
            if (j.indexOf("/") !== -1) {
                a = "/"
            } else {
                if (j.indexOf("-") !== -1) {
                    a = "-"
                } else {
                    if (j.indexOf(".") !== -1) {
                        a = "."
                    } else {
                        a = "/"
                    }
                }
            }
            j = j.split(a);
            x = x.split(a);
            if (x.length !== 3) {
                return false
            }
            var u = -1, i, t = -1, w = -1, s;
            for (s = 0; s < j.length; s++) {
                var y = isNaN(x[s]) ? 0 : parseInt(x[s], 10);
                v[j[s]] = y;
                i = j[s];
                if (i.indexOf("y") !== -1) {
                    u = s
                }
                if (i.indexOf("m") !== -1) {
                    w = s
                }
                if (i.indexOf("d") !== -1) {
                    t = s
                }
            }
            if (j[u] === "y" || j[u] === "yyyy") {
                i = 4
            } else {
                if (j[u] === "yy") {
                    i = 2
                } else {
                    i = -1
                }
            }
            var z = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], q;
            if (u === -1) {
                return false
            }
            q = v[j[u]].toString();
            if (i === 2 && q.length === 1) {
                i = 1
            }
            if (q.length !== i || (v[j[u]] === 0 && x[u] !== "00")) {
                return false
            }
            if (w === -1) {
                return false
            }
            q = v[j[w]].toString();
            if (q.length < 1 || v[j[w]] < 1 || v[j[w]] > 12) {
                return false
            }
            if (t === -1) {
                return false
            }
            q = v[j[t]].toString();
            if (q.length < 1 || v[j[t]] < 1 || v[j[t]] > 31 || (v[j[w]] === 2 && v[j[t]] > r(v[j[u]])) || v[j[t]] > z[v[j[w]]]) {
                return false
            }
            return true
        },
        isEmpty: function(a) {
            if (a.match(/^\s+$/) || a === "") {
                return true
            }
            return false
        },
        checkTime: function(e) {
            var f = /^(\d{1,2}):(\d{2})([apAP][Mm])?$/, a;
            if (!b.jgrid.isEmpty(e)) {
                a = e.match(f);
                if (a) {
                    if (a[3]) {
                        if (a[1] < 1 || a[1] > 12) {
                            return false
                        }
                    } else {
                        if (a[1] > 23) {
                            return false
                        }
                    }
                    if (a[2] > 59) {
                        return false
                    }
                } else {
                    return false
                }
            }
            return true
        },
        checkValues: function(A, r, g, w) {
            var x, v, a, z, t, u = this, i = u.p.colModel;
            if (g === undefined) {
                if (typeof r === "string") {
                    for (v = 0,
                    t = i.length; v < t; v++) {
                        if (i[v].name === r) {
                            x = i[v].editrules;
                            r = v;
                            if (i[v].formoptions != null) {
                                a = i[v].formoptions.label
                            }
                            break
                        }
                    }
                } else {
                    if (r >= 0) {
                        x = i[r].editrules
                    }
                }
            } else {
                x = g;
                a = w === undefined ? "_" : w
            }
            if (x) {
                if (!a) {
                    a = u.p.colNames != null ? u.p.colNames[r] : i[r].label
                }
                if (x.required === true) {
                    if (b.jgrid.isEmpty(A)) {
                        return [false, a + ": " + b.jgrid.edit.msg.required, ""]
                    }
                }
                var y = x.required === false ? false : true;
                if (x.number === true) {
                    if (!(y === false && b.jgrid.isEmpty(A))) {
                        if (isNaN(A)) {
                            return [false, a + ": " + b.jgrid.edit.msg.number, ""]
                        }
                    }
                }
                if (x.minValue !== undefined && !isNaN(x.minValue)) {
                    if (parseFloat(A) < parseFloat(x.minValue)) {
                        return [false, a + ": " + b.jgrid.edit.msg.minValue + " " + x.minValue, ""]
                    }
                }
                if (x.maxValue !== undefined && !isNaN(x.maxValue)) {
                    if (parseFloat(A) > parseFloat(x.maxValue)) {
                        return [false, a + ": " + b.jgrid.edit.msg.maxValue + " " + x.maxValue, ""]
                    }
                }
                var B;
                if (x.email === true) {
                    if (!(y === false && b.jgrid.isEmpty(A))) {
                        B = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
                        if (!B.test(A)) {
                            return [false, a + ": " + b.jgrid.edit.msg.email, ""]
                        }
                    }
                }
                if (x.integer === true) {
                    if (!(y === false && b.jgrid.isEmpty(A))) {
                        if (isNaN(A)) {
                            return [false, a + ": " + b.jgrid.edit.msg.integer, ""]
                        }
                        if ((A % 1 !== 0) || (A.indexOf(".") !== -1)) {
                            return [false, a + ": " + b.jgrid.edit.msg.integer, ""]
                        }
                    }
                }
                if (x.date === true) {
                    if (!(y === false && b.jgrid.isEmpty(A))) {
                        if (i[r].formatoptions && i[r].formatoptions.newformat) {
                            z = i[r].formatoptions.newformat;
                            if (b.jgrid.formatter.date.masks.hasOwnProperty(z)) {
                                z = b.jgrid.formatter.date.masks[z]
                            }
                        } else {
                            z = i[r].datefmt || "Y-m-d"
                        }
                        if (!b.jgrid.checkDate(z, A)) {
                            return [false, a + ": " + b.jgrid.edit.msg.date + " - " + z, ""]
                        }
                    }
                }
                if (x.time === true) {
                    if (!(y === false && b.jgrid.isEmpty(A))) {
                        if (!b.jgrid.checkTime(A)) {
                            return [false, a + ": " + b.jgrid.edit.msg.date + " - hh:mm (am/pm)", ""]
                        }
                    }
                }
                if (x.url === true) {
                    if (!(y === false && b.jgrid.isEmpty(A))) {
                        B = /^(((https?)|(ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i;
                        if (!B.test(A)) {
                            return [false, a + ": " + b.jgrid.edit.msg.url, ""]
                        }
                    }
                }
                if (x.custom === true) {
                    if (!(y === false && b.jgrid.isEmpty(A))) {
                        if (b.isFunction(x.custom_func)) {
                            var s = x.custom_func.call(u, A, a, r);
                            return b.isArray(s) ? s : [false, b.jgrid.edit.msg.customarray, ""]
                        }
                        return [false, b.jgrid.edit.msg.customfcheck, ""]
                    }
                }
            }
            return [true, "", ""]
        }
    })
}
)(jQuery);
(function(b) {
    b.fn.jqFilter = function(a) {
        if (typeof a === "string") {
            var g = b.fn.jqFilter[a];
            if (!g) {
                throw ("jqFilter - No such method: " + a)
            }
            var h = b.makeArray(arguments).slice(1);
            return g.apply(this, h)
        }
        var f = b.extend(true, {
            filter: null,
            columns: [],
            onChange: null,
            afterRedraw: null,
            checkValues: null,
            error: false,
            errmsg: "",
            errorcheck: true,
            showQuery: true,
            sopt: null,
            ops: [],
            operands: null,
            numopts: ["eq", "ne", "lt", "le", "gt", "ge", "nu", "nn", "in", "ni"],
            stropts: ["eq", "ne", "bw", "bn", "ew", "en", "cn", "nc", "nu", "nn", "in", "ni"],
            strarr: ["text", "string", "blob"],
            groupOps: [{
                op: "AND",
                text: "AND"
            }, {
                op: "OR",
                text: "OR"
            }],
            groupButton: true,
            ruleButtons: true,
            direction: "ltr"
        }, b.jgrid.filter, a || {});
        return this.each(function() {
            if (this.filter) {
                return
            }
            this.p = f;
            if (this.p.filter === null || this.p.filter === undefined) {
                this.p.filter = {
                    groupOp: this.p.groupOps[0].op,
                    rules: [],
                    groups: []
                }
            }
            var e, n = this.p.columns.length, m, d = /msie/i.test(navigator.userAgent) && !window.opera;
            this.p.initFilter = b.extend(true, {}, this.p.filter);
            if (!n) {
                return
            }
            for (e = 0; e < n; e++) {
                m = this.p.columns[e];
                if (m.stype) {
                    m.inputtype = m.stype
                } else {
                    if (!m.inputtype) {
                        m.inputtype = "text"
                    }
                }
                if (m.sorttype) {
                    m.searchtype = m.sorttype
                } else {
                    if (!m.searchtype) {
                        m.searchtype = "string"
                    }
                }
                if (m.hidden === undefined) {
                    m.hidden = false
                }
                if (!m.label) {
                    m.label = m.name
                }
                if (m.index) {
                    m.name = m.index
                }
                if (!m.hasOwnProperty("searchoptions")) {
                    m.searchoptions = {}
                }
                if (!m.hasOwnProperty("searchrules")) {
                    m.searchrules = {}
                }
            }
            if (this.p.showQuery) {
                b(this).append("<table class='queryresult ui-widget ui-widget-content' style='display:block;max-width:440px;border:0px none;' dir='" + this.p.direction + "'><tbody><tr><td class='query'></td></tr></tbody></table>")
            }
            var c = function() {
                return b("#" + b.jgrid.jqID(f.id))[0] || null
            };
            var i = function(q, k) {
                var j = [true, ""]
                  , l = c();
                if (b.isFunction(k.searchrules)) {
                    j = k.searchrules.call(l, q, k)
                } else {
                    if (b.jgrid && b.jgrid.checkValues) {
                        try {
                            j = b.jgrid.checkValues.call(l, q, -1, k.searchrules, k.label)
                        } catch (r) {}
                    }
                }
                if (j && j.length && j[0] === false) {
                    f.error = !j[0];
                    f.errmsg = j[1]
                }
            };
            this.onchange = function() {
                this.p.error = false;
                this.p.errmsg = "";
                return b.isFunction(this.p.onChange) ? this.p.onChange.call(this, this.p) : false
            }
            ;
            this.reDraw = function() {
                b("table.group:first", this).remove();
                var j = this.createTableForGroup(f.filter, null);
                b(this).append(j);
                if (b.isFunction(this.p.afterRedraw)) {
                    this.p.afterRedraw.call(this, this.p)
                }
            }
            ;
            this.createTableForGroup = function(P, O) {
                var Q = this, k;
                var j = b("<table class='group ui-widget ui-widget-content' style='border:0px none;'><tbody></tbody></table>")
                  , E = "left";
                if (this.p.direction === "rtl") {
                    E = "right";
                    j.attr("dir", "rtl")
                }
                if (O === null) {
                    j.append("<tr class='error' style='display:none;'><th colspan='5' class='ui-state-error' align='" + E + "'></th></tr>")
                }
                var S = b("<tr></tr>");
                j.append(S);
                var R = b("<th colspan='5' align='" + E + "'></th>");
                S.append(R);
                if (this.p.ruleButtons === true) {
                    var H = b("<select class='opsel'></select>");
                    R.append(H);
                    var F = "", G;
                    for (k = 0; k < f.groupOps.length; k++) {
                        G = P.groupOp === Q.p.groupOps[k].op ? " selected='selected'" : "";
                        F += "<option value='" + Q.p.groupOps[k].op + "'" + G + ">" + Q.p.groupOps[k].text + "</option>"
                    }
                    H.append(F).bind("change", function() {
                        P.groupOp = b(H).val();
                        Q.onchange()
                    })
                }
                var J = "<span></span>";
                if (this.p.groupButton) {
                    J = b("<input type='button' value='+ {}' title='Add subgroup' class='add-group'/>");
                    J.bind("click", function() {
                        if (P.groups === undefined) {
                            P.groups = []
                        }
                        P.groups.push({
                            groupOp: f.groupOps[0].op,
                            rules: [],
                            groups: []
                        });
                        Q.reDraw();
                        Q.onchange();
                        return false
                    })
                }
                R.append(J);
                if (this.p.ruleButtons === true) {
                    var L = b("<input type='button' value='+' title='Add rule' class='add-rule ui-add'/>"), N;
                    L.bind("click", function() {
                        if (P.rules === undefined) {
                            P.rules = []
                        }
                        for (k = 0; k < Q.p.columns.length; k++) {
                            var o = (Q.p.columns[k].search === undefined) ? true : Q.p.columns[k].search
                              , p = (Q.p.columns[k].hidden === true)
                              , q = (Q.p.columns[k].searchoptions.searchhidden === true);
                            if ((q && o) || (o && !p)) {
                                N = Q.p.columns[k];
                                break
                            }
                        }
                        var r;
                        if (N.searchoptions.sopt) {
                            r = N.searchoptions.sopt
                        } else {
                            if (Q.p.sopt) {
                                r = Q.p.sopt
                            } else {
                                if (b.inArray(N.searchtype, Q.p.strarr) !== -1) {
                                    r = Q.p.stropts
                                } else {
                                    r = Q.p.numopts
                                }
                            }
                        }
                        P.rules.push({
                            field: N.name,
                            op: r[0],
                            data: ""
                        });
                        Q.reDraw();
                        return false
                    });
                    R.append(L)
                }
                if (O !== null) {
                    var I = b("<input type='button' value='-' title='Delete group' class='delete-group'/>");
                    R.append(I);
                    I.bind("click", function() {
                        for (k = 0; k < O.groups.length; k++) {
                            if (O.groups[k] === P) {
                                O.groups.splice(k, 1);
                                break
                            }
                        }
                        Q.reDraw();
                        Q.onchange();
                        return false
                    })
                }
                if (P.groups !== undefined) {
                    for (k = 0; k < P.groups.length; k++) {
                        var l = b("<tr></tr>");
                        j.append(l);
                        var M = b("<td class='first'></td>");
                        l.append(M);
                        var K = b("<td colspan='4'></td>");
                        K.append(this.createTableForGroup(P.groups[k], P));
                        l.append(K)
                    }
                }
                if (P.groupOp === undefined) {
                    P.groupOp = Q.p.groupOps[0].op
                }
                if (P.rules !== undefined) {
                    for (k = 0; k < P.rules.length; k++) {
                        j.append(this.createTableRowForRule(P.rules[k], P))
                    }
                }
                return j
            }
            ;
            this.createTableRowForRule = function(R, N) {
                var P = this, M = c(), af = b("<tr></tr>"), O, k, ad, L, Z = "", aa;
                af.append("<td class='first'></td>");
                var ab = b("<td class='columns'></td>");
                af.append(ab);
                var l = b("<select></select>"), ac, U = [];
                ab.append(l);
                l.bind("change", function() {
                    R.field = b(l).val();
                    ad = b(this).parents("tr:first");
                    for (O = 0; O < P.p.columns.length; O++) {
                        if (P.p.columns[O].name === R.field) {
                            L = P.p.columns[O];
                            break
                        }
                    }
                    if (!L) {
                        return
                    }
                    L.searchoptions.id = b.jgrid.randId();
                    if (d && L.inputtype === "text") {
                        if (!L.searchoptions.size) {
                            L.searchoptions.size = 10
                        }
                    }
                    var q = b.jgrid.createEl.call(M, L.inputtype, L.searchoptions, "", true, P.p.ajaxSelectOptions || {}, true);
                    b(q).addClass("input-elm");
                    if (L.searchoptions.sopt) {
                        k = L.searchoptions.sopt
                    } else {
                        if (P.p.sopt) {
                            k = P.p.sopt
                        } else {
                            if (b.inArray(L.searchtype, P.p.strarr) !== -1) {
                                k = P.p.stropts
                            } else {
                                k = P.p.numopts
                            }
                        }
                    }
                    var o = ""
                      , r = 0;
                    U = [];
                    b.each(P.p.ops, function() {
                        U.push(this.oper)
                    });
                    for (O = 0; O < k.length; O++) {
                        ac = b.inArray(k[O], U);
                        if (ac !== -1) {
                            if (r === 0) {
                                R.op = P.p.ops[ac].oper
                            }
                            o += "<option value='" + P.p.ops[ac].oper + "'>" + P.p.ops[ac].text + "</option>";
                            r++
                        }
                    }
                    b(".selectopts", ad).empty().append(o);
                    b(".selectopts", ad)[0].selectedIndex = 0;
                    if (b.jgrid.msie && b.jgrid.msiever() < 9) {
                        var p = parseInt(b("select.selectopts", ad)[0].offsetWidth, 10) + 1;
                        b(".selectopts", ad).width(p);
                        b(".selectopts", ad).css("width", "auto")
                    }
                    b(".data", ad).empty().append(q);
                    b.jgrid.bindEv.call(M, q, L.searchoptions);
                    b(".input-elm", ad).bind("change", function(s) {
                        var t = s.target;
                        R.data = t.nodeName.toUpperCase() === "SPAN" && L.searchoptions && b.isFunction(L.searchoptions.custom_value) ? L.searchoptions.custom_value.call(M, b(t).children(".customelement:first"), "get") : t.value;
                        P.onchange()
                    });
                    setTimeout(function() {
                        R.data = b(q).val();
                        P.onchange()
                    }, 0)
                });
                var T = 0;
                for (O = 0; O < P.p.columns.length; O++) {
                    var V = (P.p.columns[O].search === undefined) ? true : P.p.columns[O].search
                      , Q = (P.p.columns[O].hidden === true)
                      , j = (P.p.columns[O].searchoptions.searchhidden === true);
                    if ((j && V) || (V && !Q)) {
                        aa = "";
                        if (R.field === P.p.columns[O].name) {
                            aa = " selected='selected'";
                            T = O
                        }
                        Z += "<option value='" + P.p.columns[O].name + "'" + aa + ">" + P.p.columns[O].label + "</option>"
                    }
                }
                l.append(Z);
                var X = b("<td class='operators'></td>");
                af.append(X);
                L = f.columns[T];
                L.searchoptions.id = b.jgrid.randId();
                if (d && L.inputtype === "text") {
                    if (!L.searchoptions.size) {
                        L.searchoptions.size = 10
                    }
                }
                var ae = b.jgrid.createEl.call(M, L.inputtype, L.searchoptions, R.data, true, P.p.ajaxSelectOptions || {}, true);
                if (R.op === "nu" || R.op === "nn") {
                    b(ae).attr("readonly", "true");
                    b(ae).attr("disabled", "true")
                }
                var ag = b("<select class='selectopts'></select>");
                X.append(ag);
                ag.bind("change", function() {
                    R.op = b(ag).val();
                    ad = b(this).parents("tr:first");
                    var o = b(".input-elm", ad)[0];
                    if (R.op === "nu" || R.op === "nn") {
                        R.data = "";
                        if (o.tagName.toUpperCase() !== "SELECT") {
                            o.value = ""
                        }
                        o.setAttribute("readonly", "true");
                        o.setAttribute("disabled", "true")
                    } else {
                        if (o.tagName.toUpperCase() === "SELECT") {
                            R.data = o.value
                        }
                        o.removeAttribute("readonly");
                        o.removeAttribute("disabled")
                    }
                    P.onchange()
                });
                if (L.searchoptions.sopt) {
                    k = L.searchoptions.sopt
                } else {
                    if (P.p.sopt) {
                        k = P.p.sopt
                    } else {
                        if (b.inArray(L.searchtype, P.p.strarr) !== -1) {
                            k = P.p.stropts
                        } else {
                            k = P.p.numopts
                        }
                    }
                }
                Z = "";
                b.each(P.p.ops, function() {
                    U.push(this.oper)
                });
                for (O = 0; O < k.length; O++) {
                    ac = b.inArray(k[O], U);
                    if (ac !== -1) {
                        aa = R.op === P.p.ops[ac].oper ? " selected='selected'" : "";
                        Z += "<option value='" + P.p.ops[ac].oper + "'" + aa + ">" + P.p.ops[ac].text + "</option>"
                    }
                }
                ag.append(Z);
                var W = b("<td class='data'></td>");
                af.append(W);
                W.append(ae);
                b.jgrid.bindEv.call(M, ae, L.searchoptions);
                b(ae).addClass("input-elm").bind("change", function() {
                    R.data = L.inputtype === "custom" ? L.searchoptions.custom_value.call(M, b(this).children(".customelement:first"), "get") : b(this).val();
                    P.onchange()
                });
                var S = b("<td></td>");
                af.append(S);
                if (this.p.ruleButtons === true) {
                    var Y = b("<input type='button' value='-' title='Delete rule' class='delete-rule ui-del'/>");
                    S.append(Y);
                    Y.bind("click", function() {
                        for (O = 0; O < N.rules.length; O++) {
                            if (N.rules[O] === R) {
                                N.rules.splice(O, 1);
                                break
                            }
                        }
                        P.reDraw();
                        P.onchange();
                        return false
                    })
                }
                return af
            }
            ;
            this.getStringForGroup = function(q) {
                var j = "(", k;
                if (q.groups !== undefined) {
                    for (k = 0; k < q.groups.length; k++) {
                        if (j.length > 1) {
                            j += " " + q.groupOp + " "
                        }
                        try {
                            j += this.getStringForGroup(q.groups[k])
                        } catch (l) {
                            alert(l)
                        }
                    }
                }
                if (q.rules !== undefined) {
                    try {
                        for (k = 0; k < q.rules.length; k++) {
                            if (j.length > 1) {
                                j += " " + q.groupOp + " "
                            }
                            j += this.getStringForRule(q.rules[k])
                        }
                    } catch (r) {
                        alert(r)
                    }
                }
                j += ")";
                if (j === "()") {
                    return ""
                }
                return j
            }
            ;
            this.getStringForRule = function(u) {
                var x = "", k = "", v, y, w, l, j = ["int", "integer", "float", "number", "currency"];
                for (v = 0; v < this.p.ops.length; v++) {
                    if (this.p.ops[v].oper === u.op) {
                        x = this.p.operands.hasOwnProperty(u.op) ? this.p.operands[u.op] : "";
                        k = this.p.ops[v].oper;
                        break
                    }
                }
                for (v = 0; v < this.p.columns.length; v++) {
                    if (this.p.columns[v].name === u.field) {
                        y = this.p.columns[v];
                        break
                    }
                }
                if (y == undefined) {
                    return ""
                }
                l = u.data;
                if (k === "bw" || k === "bn") {
                    l = l + "%"
                }
                if (k === "ew" || k === "en") {
                    l = "%" + l
                }
                if (k === "cn" || k === "nc") {
                    l = "%" + l + "%"
                }
                if (k === "in" || k === "ni") {
                    l = " (" + l + ")"
                }
                if (f.errorcheck) {
                    i(u.data, y)
                }
                if (b.inArray(y.searchtype, j) !== -1 || k === "nn" || k === "nu") {
                    w = u.field + " " + x + " " + l
                } else {
                    w = u.field + " " + x + ' "' + l + '"'
                }
                return w
            }
            ;
            this.resetFilter = function() {
                this.p.filter = b.extend(true, {}, this.p.initFilter);
                this.reDraw();
                this.onchange()
            }
            ;
            this.hideError = function() {
                b("th.ui-state-error", this).html("");
                b("tr.error", this).hide()
            }
            ;
            this.showError = function() {
                b("th.ui-state-error", this).html(this.p.errmsg);
                b("tr.error", this).show()
            }
            ;
            this.toUserFriendlyString = function() {
                return this.getStringForGroup(f.filter)
            }
            ;
            this.toString = function() {
                var j = this;
                function l(r) {
                    if (j.p.errorcheck) {
                        var s, t;
                        for (s = 0; s < j.p.columns.length; s++) {
                            if (j.p.columns[s].name === r.field) {
                                t = j.p.columns[s];
                                break
                            }
                        }
                        if (t) {
                            i(r.data, t)
                        }
                    }
                    return r.op + "(item." + r.field + ",'" + r.data + "')"
                }
                function k(r) {
                    var s = "(", t;
                    if (r.groups !== undefined) {
                        for (t = 0; t < r.groups.length; t++) {
                            if (s.length > 1) {
                                if (r.groupOp === "OR") {
                                    s += " || "
                                } else {
                                    s += " && "
                                }
                            }
                            s += k(r.groups[t])
                        }
                    }
                    if (r.rules !== undefined) {
                        for (t = 0; t < r.rules.length; t++) {
                            if (s.length > 1) {
                                if (r.groupOp === "OR") {
                                    s += " || "
                                } else {
                                    s += " && "
                                }
                            }
                            s += l(r.rules[t])
                        }
                    }
                    s += ")";
                    if (s === "()") {
                        return ""
                    }
                    return s
                }
                return k(this.p.filter)
            }
            ;
            this.reDraw();
            if (this.p.showQuery) {
                this.onchange()
            }
            this.filter = true
        })
    }
    ;
    b.extend(b.fn.jqFilter, {
        toSQLString: function() {
            var a = "";
            this.each(function() {
                a = this.toUserFriendlyString()
            });
            return a
        },
        filterData: function() {
            var a;
            this.each(function() {
                a = this.p.filter
            });
            return a
        },
        getParameter: function(a) {
            if (a !== undefined) {
                if (this.p.hasOwnProperty(a)) {
                    return this.p[a]
                }
            }
            return this.p
        },
        resetFilter: function() {
            return this.each(function() {
                this.resetFilter()
            })
        },
        addFilter: function(a) {
            if (typeof a === "string") {
                a = b.jgrid.parse(a)
            }
            this.each(function() {
                this.p.filter = a;
                this.reDraw();
                this.onchange()
            })
        }
    })
}
)(jQuery);
(function(c) {
    var d = {};
    c.jgrid.extend({
        searchGrid: function(a) {
            a = c.extend(true, {
                recreateFilter: false,
                drag: true,
                sField: "searchField",
                sValue: "searchString",
                sOper: "searchOper",
                sFilter: "filters",
                loadDefaults: true,
                beforeShowSearch: null,
                afterShowSearch: null,
                onInitializeSearch: null,
                afterRedraw: null,
                afterChange: null,
                closeAfterSearch: false,
                closeAfterReset: false,
                closeOnEscape: false,
                searchOnEnter: false,
                multipleSearch: false,
                multipleGroup: false,
                top: 0,
                left: 0,
                jqModal: true,
                modal: false,
                resize: true,
                width: 450,
                height: "auto",
                dataheight: "auto",
                showQuery: false,
                errorcheck: true,
                sopt: null,
                stringResult: undefined,
                onClose: null,
                onSearch: null,
                onReset: null,
                toTop: true,
                overlay: 30,
                columns: [],
                tmplNames: null,
                tmplFilters: null,
                tmplLabel: " Template: ",
                showOnLoad: false,
                layer: null,
                operands: {
                    eq: "=",
                    ne: "<>",
                    lt: "<",
                    le: "<=",
                    gt: ">",
                    ge: ">=",
                    bw: "LIKE",
                    bn: "NOT LIKE",
                    "in": "IN",
                    ni: "NOT IN",
                    ew: "LIKE",
                    en: "NOT LIKE",
                    cn: "LIKE",
                    nc: "NOT LIKE",
                    nu: "IS NULL",
                    nn: "ISNOT NULL"
                }
            }, c.jgrid.search, a || {});
            return this.each(function() {
                var z = this;
                if (!z.grid) {
                    return
                }
                var P = "fbox_" + z.p.id
                  , K = true
                  , G = true
                  , N = {
                    themodal: "searchmod" + P,
                    modalhead: "searchhd" + P,
                    modalcontent: "searchcnt" + P,
                    scrollelm: P
                }
                  , M = z.p.postData[a.sFilter];
                if (typeof M === "string") {
                    M = c.jgrid.parse(M)
                }
                if (a.recreateFilter === true) {
                    c("#" + c.jgrid.jqID(N.themodal)).remove()
                }
                function L(e) {
                    K = c(z).triggerHandler("jqGridFilterBeforeShow", [e]);
                    if (K === undefined) {
                        K = true
                    }
                    if (K && c.isFunction(a.beforeShowSearch)) {
                        K = a.beforeShowSearch.call(z, e)
                    }
                    if (K) {
                        c.jgrid.viewModal("#" + c.jgrid.jqID(N.themodal), {
                            gbox: "#gbox_" + c.jgrid.jqID(P),
                            jqm: a.jqModal,
                            modal: a.modal,
                            overlay: a.overlay,
                            toTop: a.toTop
                        });
                        c(z).triggerHandler("jqGridFilterAfterShow", [e]);
                        if (c.isFunction(a.afterShowSearch)) {
                            a.afterShowSearch.call(z, e)
                        }
                    }
                }
                if (c("#" + c.jgrid.jqID(N.themodal))[0] !== undefined) {
                    L(c("#fbox_" + c.jgrid.jqID(+z.p.id)))
                } else {
                    var y = c("<div><div id='" + P + "' class='searchFilter' style='overflow:auto'></div></div>").insertBefore("#gview_" + c.jgrid.jqID(z.p.id))
                      , A = "left"
                      , J = "";
                    if (z.p.direction === "rtl") {
                        A = "right";
                        J = " style='text-align:left'";
                        y.attr("dir", "rtl")
                    }
                    var O = c.extend([], z.p.colModel), D = "<a id='" + P + "_search' class='fm-button ui-state-default ui-corner-all fm-button-icon-right ui-reset'><span class='ui-icon ui-icon-search'></span>" + a.Find + "</a>", b = "<a id='" + P + "_reset' class='fm-button ui-state-default ui-corner-all fm-button-icon-left ui-search'><span class='ui-icon ui-icon-arrowreturnthick-1-w'></span>" + a.Reset + "</a>", B = "", I = "", F, E = false, x, C = -1;
                    if (a.showQuery) {
                        B = "<a id='" + P + "_query' class='fm-button ui-state-default ui-corner-all fm-button-icon-left'><span class='ui-icon ui-icon-comment'></span>Query</a>"
                    }
                    if (!a.columns.length) {
                        c.each(O, function(i, h) {
                            if (!h.label) {
                                h.label = z.p.colNames[i]
                            }
                            if (!E) {
                                var f = (h.search === undefined) ? true : h.search
                                  , e = (h.hidden === true)
                                  , g = (h.searchoptions && h.searchoptions.searchhidden === true);
                                if ((g && f) || (f && !e)) {
                                    E = true;
                                    F = h.index || h.name;
                                    C = i
                                }
                            }
                        })
                    } else {
                        O = a.columns;
                        C = 0;
                        F = O[0].index || O[0].name
                    }
                    if ((!M && F) || a.multipleSearch === false) {
                        var H = "eq";
                        if (C >= 0 && O[C].searchoptions && O[C].searchoptions.sopt) {
                            H = O[C].searchoptions.sopt[0]
                        } else {
                            if (a.sopt && a.sopt.length) {
                                H = a.sopt[0]
                            }
                        }
                        M = {
                            groupOp: "AND",
                            rules: [{
                                field: F,
                                op: H,
                                data: ""
                            }]
                        }
                    }
                    E = false;
                    if (a.tmplNames && a.tmplNames.length) {
                        E = true;
                        I = a.tmplLabel;
                        I += "<select class='ui-template'>";
                        I += "<option value='default'>Default</option>";
                        c.each(a.tmplNames, function(e, f) {
                            I += "<option value='" + e + "'>" + f + "</option>"
                        });
                        I += "</select>"
                    }
                    x = "<table class='EditTable' style='border:0px none;margin-top:5px' id='" + P + "_2'><tbody><tr><td colspan='2'><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr><td class='EditButton' style='text-align:" + A + "'>" + b + I + "</td><td class='EditButton' " + J + ">" + B + D + "</td></tr></tbody></table>";
                    P = c.jgrid.jqID(P);
                    c("#" + P).jqFilter({
                        columns: O,
                        filter: a.loadDefaults ? M : null,
                        showQuery: a.showQuery,
                        errorcheck: a.errorcheck,
                        sopt: a.sopt,
                        groupButton: a.multipleGroup,
                        ruleButtons: a.multipleSearch,
                        afterRedraw: a.afterRedraw,
                        ops: a.odata,
                        operands: a.operands,
                        ajaxSelectOptions: z.p.ajaxSelectOptions,
                        groupOps: a.groupOps,
                        onChange: function() {
                            if (this.p.showQuery) {
                                c(".query", this).html(this.toUserFriendlyString())
                            }
                            if (c.isFunction(a.afterChange)) {
                                a.afterChange.call(z, c("#" + P), a)
                            }
                        },
                        direction: z.p.direction,
                        id: z.p.id
                    });
                    y.append(x);
                    if (E && a.tmplFilters && a.tmplFilters.length) {
                        c(".ui-template", y).bind("change", function() {
                            var e = c(this).val();
                            if (e === "default") {
                                c("#" + P).jqFilter("addFilter", M)
                            } else {
                                c("#" + P).jqFilter("addFilter", a.tmplFilters[parseInt(e, 10)])
                            }
                            return false
                        })
                    }
                    if (a.multipleGroup === true) {
                        a.multipleSearch = true
                    }
                    c(z).triggerHandler("jqGridFilterInitialize", [c("#" + P)]);
                    if (c.isFunction(a.onInitializeSearch)) {
                        a.onInitializeSearch.call(z, c("#" + P))
                    }
                    a.gbox = "#gbox_" + P;
                    if (a.layer) {
                        c.jgrid.createModal(N, y, a, "#gview_" + c.jgrid.jqID(z.p.id), c("#gbox_" + c.jgrid.jqID(z.p.id))[0], "#" + c.jgrid.jqID(a.layer), {
                            position: "relative"
                        })
                    } else {
                        c.jgrid.createModal(N, y, a, "#gview_" + c.jgrid.jqID(z.p.id), c("#gbox_" + c.jgrid.jqID(z.p.id))[0])
                    }
                    if (a.searchOnEnter || a.closeOnEscape) {
                        c("#" + c.jgrid.jqID(N.themodal)).keydown(function(f) {
                            var e = c(f.target);
                            if (a.searchOnEnter && f.which === 13 && !e.hasClass("add-group") && !e.hasClass("add-rule") && !e.hasClass("delete-group") && !e.hasClass("delete-rule") && (!e.hasClass("fm-button") || !e.is("[id$=_query]"))) {
                                c("#" + P + "_search").click();
                                return false
                            }
                            if (a.closeOnEscape && f.which === 27) {
                                c("#" + c.jgrid.jqID(N.modalhead)).find(".ui-jqdialog-titlebar-close").click();
                                return false
                            }
                        })
                    }
                    if (B) {
                        c("#" + P + "_query").bind("click", function() {
                            c(".queryresult", y).toggle();
                            return false
                        })
                    }
                    if (a.stringResult === undefined) {
                        a.stringResult = a.multipleSearch
                    }
                    c("#" + P + "_search").bind("click", function() {
                        var f = c("#" + P), j = {}, e, h;
                        f.find(".input-elm:focus").change();
                        h = f.jqFilter("filterData");
                        if (a.errorcheck) {
                            f[0].hideError();
                            if (!a.showQuery) {
                                f.jqFilter("toSQLString")
                            }
                            if (f[0].p.error) {
                                f[0].showError();
                                return false
                            }
                        }
                        if (a.stringResult) {
                            try {
                                e = xmlJsonClass.toJson(h, "", "", false)
                            } catch (g) {
                                try {
                                    e = JSON.stringify(h)
                                } catch (i) {}
                            }
                            if (typeof e === "string") {
                                j[a.sFilter] = e;
                                c.each([a.sField, a.sValue, a.sOper], function() {
                                    j[this] = ""
                                })
                            }
                        } else {
                            if (a.multipleSearch) {
                                j[a.sFilter] = h;
                                c.each([a.sField, a.sValue, a.sOper], function() {
                                    j[this] = ""
                                })
                            } else {
                                j[a.sField] = h.rules[0].field;
                                j[a.sValue] = h.rules[0].data;
                                j[a.sOper] = h.rules[0].op;
                                j[a.sFilter] = ""
                            }
                        }
                        z.p.search = true;
                        c.extend(z.p.postData, j);
                        G = c(z).triggerHandler("jqGridFilterSearch");
                        if (G === undefined) {
                            G = true
                        }
                        if (G && c.isFunction(a.onSearch)) {
                            G = a.onSearch.call(z, z.p.filters)
                        }
                        if (G !== false) {
                            c(z).trigger("reloadGrid", [{
                                page: 1
                            }])
                        }
                        if (a.closeAfterSearch) {
                            c.jgrid.hideModal("#" + c.jgrid.jqID(N.themodal), {
                                gb: "#gbox_" + c.jgrid.jqID(z.p.id),
                                jqm: a.jqModal,
                                onClose: a.onClose
                            })
                        }
                        return false
                    });
                    c("#" + P + "_reset").bind("click", function() {
                        var e = {}
                          , f = c("#" + P);
                        z.p.search = false;
                        z.p.resetsearch = true;
                        if (a.multipleSearch === false) {
                            e[a.sField] = e[a.sValue] = e[a.sOper] = ""
                        } else {
                            e[a.sFilter] = ""
                        }
                        f[0].resetFilter();
                        if (E) {
                            c(".ui-template", y).val("default")
                        }
                        c.extend(z.p.postData, e);
                        G = c(z).triggerHandler("jqGridFilterReset");
                        if (G === undefined) {
                            G = true
                        }
                        if (G && c.isFunction(a.onReset)) {
                            G = a.onReset.call(z)
                        }
                        if (G !== false) {
                            c(z).trigger("reloadGrid", [{
                                page: 1
                            }])
                        }
                        if (a.closeAfterReset) {
                            c.jgrid.hideModal("#" + c.jgrid.jqID(N.themodal), {
                                gb: "#gbox_" + c.jgrid.jqID(z.p.id),
                                jqm: a.jqModal,
                                onClose: a.onClose
                            })
                        }
                        return false
                    });
                    L(c("#" + P));
                    c(".fm-button:not(.ui-state-disabled)", y).hover(function() {
                        c(this).addClass("ui-state-hover")
                    }, function() {
                        c(this).removeClass("ui-state-hover")
                    })
                }
            })
        },
        editGridRow: function(b, a) {
            a = c.extend(true, {
                top: 0,
                left: 0,
                width: 300,
                datawidth: "auto",
                height: "auto",
                dataheight: "auto",
                modal: false,
                overlay: 30,
                drag: true,
                resize: true,
                url: null,
                mtype: "POST",
                clearAfterAdd: true,
                closeAfterEdit: false,
                reloadAfterSubmit: true,
                onInitializeForm: null,
                beforeInitData: null,
                beforeShowForm: null,
                afterShowForm: null,
                beforeSubmit: null,
                afterSubmit: null,
                onclickSubmit: null,
                afterComplete: null,
                onclickPgButtons: null,
                afterclickPgButtons: null,
                editData: {},
                recreateForm: false,
                jqModal: true,
                closeOnEscape: false,
                addedrow: "first",
                topinfo: "",
                bottominfo: "",
                saveicon: [],
                closeicon: [],
                savekey: [false, 13],
                navkeys: [false, 38, 40],
                checkOnSubmit: false,
                checkOnUpdate: false,
                _savedData: {},
                processing: false,
                onClose: null,
                ajaxEditOptions: {},
                serializeEditData: null,
                viewPagerButtons: true,
                overlayClass: "ui-widget-overlay"
            }, c.jgrid.edit, a || {});
            d[c(this)[0].p.id] = a;
            return this.each(function() {
                var aQ = this;
                if (!aQ.grid || !b) {
                    return
                }
                var at = aQ.p.id, aw = "FrmGrid_" + at, ab = "TblGrid_" + at, az = "#" + c.jgrid.jqID(ab), aL = {
                    themodal: "editmod" + at,
                    modalhead: "edithd" + at,
                    modalcontent: "editcnt" + at,
                    scrollelm: aw
                }, ar = c.isFunction(d[aQ.p.id].beforeShowForm) ? d[aQ.p.id].beforeShowForm : false, aj = c.isFunction(d[aQ.p.id].afterShowForm) ? d[aQ.p.id].afterShowForm : false, ak = c.isFunction(d[aQ.p.id].beforeInitData) ? d[aQ.p.id].beforeInitData : false, aF = c.isFunction(d[aQ.p.id].onInitializeForm) ? d[aQ.p.id].onInitializeForm : false, Y = true, ao = 1, aD = 0, aq, au, ap;
                aw = c.jgrid.jqID(aw);
                if (b === "new") {
                    b = "_empty";
                    ap = "add";
                    a.caption = d[aQ.p.id].addCaption
                } else {
                    a.caption = d[aQ.p.id].editCaption;
                    ap = "edit"
                }
                if (!a.recreateForm) {
                    if (c(aQ).data("formProp")) {
                        c.extend(d[c(this)[0].p.id], c(aQ).data("formProp"))
                    }
                }
                var aI = true;
                if (a.checkOnUpdate && a.jqModal && !a.modal) {
                    aI = false
                }
                function Z() {
                    c(az + " > tbody > tr > td > .FormElement").each(function() {
                        var e = c(".customelement", this);
                        if (e.length) {
                            var g = e[0]
                              , i = c(g).attr("name");
                            c.each(aQ.p.colModel, function() {
                                if (this.name === i && this.editoptions && c.isFunction(this.editoptions.custom_value)) {
                                    try {
                                        aq[i] = this.editoptions.custom_value.call(aQ, c("#" + c.jgrid.jqID(i), az), "get");
                                        if (aq[i] === undefined) {
                                            throw "e1"
                                        }
                                    } catch (j) {
                                        if (j === "e1") {
                                            c.jgrid.info_dialog(c.jgrid.errors.errcap, "function 'custom_value' " + c.jgrid.edit.msg.novalue, c.jgrid.edit.bClose)
                                        } else {
                                            c.jgrid.info_dialog(c.jgrid.errors.errcap, j.message, c.jgrid.edit.bClose)
                                        }
                                    }
                                    return true
                                }
                            })
                        } else {
                            switch (c(this).get(0).type) {
                            case "checkbox":
                                if (c(this).is(":checked")) {
                                    aq[this.name] = c(this).val()
                                } else {
                                    var h = c(this).attr("offval");
                                    aq[this.name] = h
                                }
                                break;
                            case "select-one":
                                aq[this.name] = c("option:selected", this).val();
                                break;
                            case "select-multiple":
                                aq[this.name] = c(this).val();
                                if (aq[this.name]) {
                                    aq[this.name] = aq[this.name].join(",")
                                } else {
                                    aq[this.name] = ""
                                }
                                var f = [];
                                c("option:selected", this).each(function(k, j) {
                                    f[k] = c(j).text()
                                });
                                break;
                            case "password":
                            case "text":
                            case "textarea":
                            case "button":
                                aq[this.name] = c(this).val();
                                break
                            }
                            if (aQ.p.autoencode) {
                                aq[this.name] = c.jgrid.htmlEncode(aq[this.name])
                            }
                        }
                    });
                    return true
                }
                function aB(f, p, s, u) {
                    var i, o, g, t = 0, q, j, h, m = [], e = false, n = "<td class='CaptionTD'>&#160;</td><td class='DataTD'>&#160;</td>", k = "", r;
                    for (r = 1; r <= u; r++) {
                        k += n
                    }
                    if (f !== "_empty") {
                        e = c(p).jqGrid("getInd", f)
                    }
                    c(p.p.colModel).each(function(x) {
                        i = this.name;
                        if (this.editrules && this.editrules.edithidden === true) {
                            o = false
                        } else {
                            o = this.hidden === true ? true : false
                        }
                        j = o ? "style='display:none'" : "";
                        if (i !== "cb" && i !== "subgrid" && this.editable === true && i !== "rn") {
                            if (e === false) {
                                q = ""
                            } else {
                                if (i === p.p.ExpandColumn && p.p.treeGrid === true) {
                                    q = c("td[role='gridcell']:eq(" + x + ")", p.rows[e]).text()
                                } else {
                                    try {
                                        q = c.unformat.call(p, c("td[role='gridcell']:eq(" + x + ")", p.rows[e]), {
                                            rowId: f,
                                            colModel: this
                                        }, x)
                                    } catch (z) {
                                        q = (this.edittype && this.edittype === "textarea") ? c("td[role='gridcell']:eq(" + x + ")", p.rows[e]).text() : c("td[role='gridcell']:eq(" + x + ")", p.rows[e]).html()
                                    }
                                    if (!q || q === "&nbsp;" || q === "&#160;" || (q.length === 1 && q.charCodeAt(0) === 160)) {
                                        q = ""
                                    }
                                }
                            }
                            var y = c.extend({}, this.editoptions || {}, {
                                id: i,
                                name: i
                            })
                              , A = c.extend({}, {
                                elmprefix: "",
                                elmsuffix: "",
                                rowabove: false,
                                rowcontent: ""
                            }, this.formoptions || {})
                              , w = parseInt(A.rowpos, 10) || t + 1
                              , B = parseInt((parseInt(A.colpos, 10) || 1) * 2, 10);
                            if (f === "_empty" && y.defaultValue) {
                                q = c.isFunction(y.defaultValue) ? y.defaultValue.call(aQ) : y.defaultValue
                            }
                            if (!this.edittype) {
                                this.edittype = "text"
                            }
                            if (aQ.p.autoencode) {
                                q = c.jgrid.htmlDecode(q)
                            }
                            h = c.jgrid.createEl.call(aQ, this.edittype, y, q, false, c.extend({}, c.jgrid.ajaxOptions, p.p.ajaxSelectOptions || {}));
                            if (d[aQ.p.id].checkOnSubmit || d[aQ.p.id].checkOnUpdate) {
                                d[aQ.p.id]._savedData[i] = q
                            }
                            c(h).addClass("FormElement");
                            if (c.inArray(this.edittype, ["text", "textarea", "password", "select"]) > -1) {
                                c(h).addClass("ui-widget-content ui-corner-all")
                            }
                            g = c(s).find("tr[rowpos=" + w + "]");
                            if (A.rowabove) {
                                var v = c("<tr><td class='contentinfo' colspan='" + (u * 2) + "'>" + A.rowcontent + "</td></tr>");
                                c(s).append(v);
                                v[0].rp = w
                            }
                            if (g.length === 0) {
                                g = c("<tr " + j + " rowpos='" + w + "'></tr>").addClass("FormData").attr("id", "tr_" + i);
                                c(g).append(k);
                                c(s).append(g);
                                g[0].rp = w
                            }
                            c("td:eq(" + (B - 2) + ")", g[0]).html(A.label === undefined ? p.p.colNames[x] : A.label);
                            c("td:eq(" + (B - 1) + ")", g[0]).append(A.elmprefix).append(h).append(A.elmsuffix);
                            if (this.edittype === "custom" && c.isFunction(y.custom_value)) {
                                y.custom_value.call(aQ, c("#" + i, "#" + aw), "set", q)
                            }
                            c.jgrid.bindEv.call(aQ, h, y);
                            m[t] = x;
                            t++
                        }
                    });
                    if (t > 0) {
                        var l = c("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='" + (u * 2 - 1) + "' class='DataTD'><input class='FormElement' id='id_g' type='text' name='" + p.p.id + "_id' value='" + f + "'/></td></tr>");
                        l[0].rp = t + 999;
                        c(s).append(l);
                        if (d[aQ.p.id].checkOnSubmit || d[aQ.p.id].checkOnUpdate) {
                            d[aQ.p.id]._savedData[p.p.id + "_id"] = f
                        }
                    }
                    return m
                }
                function aE(h, m, e) {
                    var i, p = 0, l, n, g, o, k;
                    if (d[aQ.p.id].checkOnSubmit || d[aQ.p.id].checkOnUpdate) {
                        d[aQ.p.id]._savedData = {};
                        d[aQ.p.id]._savedData[m.p.id + "_id"] = h
                    }
                    var j = m.p.colModel;
                    if (h === "_empty") {
                        c(j).each(function() {
                            i = this.name;
                            g = c.extend({}, this.editoptions || {});
                            n = c("#" + c.jgrid.jqID(i), "#" + e);
                            if (n && n.length && n[0] !== null) {
                                o = "";
                                if (this.edittype === "custom" && c.isFunction(g.custom_value)) {
                                    g.custom_value.call(aQ, c("#" + i, "#" + e), "set", o)
                                } else {
                                    if (g.defaultValue) {
                                        o = c.isFunction(g.defaultValue) ? g.defaultValue.call(aQ) : g.defaultValue;
                                        if (n[0].type === "checkbox") {
                                            k = o.toLowerCase();
                                            if (k.search(/(false|f|0|no|n|off|undefined)/i) < 0 && k !== "") {
                                                n[0].checked = true;
                                                n[0].defaultChecked = true;
                                                n[0].value = o
                                            } else {
                                                n[0].checked = false;
                                                n[0].defaultChecked = false
                                            }
                                        } else {
                                            n.val(o)
                                        }
                                    } else {
                                        if (n[0].type === "checkbox") {
                                            n[0].checked = false;
                                            n[0].defaultChecked = false;
                                            o = c(n).attr("offval")
                                        } else {
                                            if (n[0].type && n[0].type.substr(0, 6) === "select") {
                                                n[0].selectedIndex = 0
                                            } else {
                                                n.val(o)
                                            }
                                        }
                                    }
                                }
                                if (d[aQ.p.id].checkOnSubmit === true || d[aQ.p.id].checkOnUpdate) {
                                    d[aQ.p.id]._savedData[i] = o
                                }
                            }
                        });
                        c("#id_g", "#" + e).val(h);
                        return
                    }
                    var f = c(m).jqGrid("getInd", h, true);
                    if (!f) {
                        return
                    }
                    c('td[role="gridcell"]', f).each(function(r) {
                        i = j[r].name;
                        if (i !== "cb" && i !== "subgrid" && i !== "rn" && j[r].editable === true) {
                            if (i === m.p.ExpandColumn && m.p.treeGrid === true) {
                                l = c(this).text()
                            } else {
                                try {
                                    l = c.unformat.call(m, c(this), {
                                        rowId: h,
                                        colModel: j[r]
                                    }, r)
                                } catch (s) {
                                    l = j[r].edittype === "textarea" ? c(this).text() : c(this).html()
                                }
                            }
                            if (aQ.p.autoencode) {
                                l = c.jgrid.htmlDecode(l)
                            }
                            if (d[aQ.p.id].checkOnSubmit === true || d[aQ.p.id].checkOnUpdate) {
                                d[aQ.p.id]._savedData[i] = l
                            }
                            i = c.jgrid.jqID(i);
                            switch (j[r].edittype) {
                            case "password":
                            case "text":
                            case "button":
                            case "image":
                            case "textarea":
                                if (l === "&nbsp;" || l === "&#160;" || (l.length === 1 && l.charCodeAt(0) === 160)) {
                                    l = ""
                                }
                                c("#" + i, "#" + e).val(l);
                                break;
                            case "select":
                                var t = l.split(",");
                                t = c.map(t, function(v) {
                                    return c.trim(v)
                                });
                                c("#" + i + " option", "#" + e).each(function() {
                                    if (!j[r].editoptions.multiple && (c.trim(l) === c.trim(c(this).text()) || t[0] === c.trim(c(this).text()) || t[0] === c.trim(c(this).val()))) {
                                        this.selected = true
                                    } else {
                                        if (j[r].editoptions.multiple) {
                                            if (c.inArray(c.trim(c(this).text()), t) > -1 || c.inArray(c.trim(c(this).val()), t) > -1) {
                                                this.selected = true
                                            } else {
                                                this.selected = false
                                            }
                                        } else {
                                            this.selected = false
                                        }
                                    }
                                });
                                break;
                            case "checkbox":
                                l = String(l);
                                if (j[r].editoptions && j[r].editoptions.value) {
                                    var u = j[r].editoptions.value.split(":");
                                    if (u[0] === l) {
                                        c("#" + i, "#" + e)[aQ.p.useProp ? "prop" : "attr"]({
                                            checked: true,
                                            defaultChecked: true
                                        })
                                    } else {
                                        c("#" + i, "#" + e)[aQ.p.useProp ? "prop" : "attr"]({
                                            checked: false,
                                            defaultChecked: false
                                        })
                                    }
                                } else {
                                    l = l.toLowerCase();
                                    if (l.search(/(false|f|0|no|n|off|undefined)/i) < 0 && l !== "") {
                                        c("#" + i, "#" + e)[aQ.p.useProp ? "prop" : "attr"]("checked", true);
                                        c("#" + i, "#" + e)[aQ.p.useProp ? "prop" : "attr"]("defaultChecked", true)
                                    } else {
                                        c("#" + i, "#" + e)[aQ.p.useProp ? "prop" : "attr"]("checked", false);
                                        c("#" + i, "#" + e)[aQ.p.useProp ? "prop" : "attr"]("defaultChecked", false)
                                    }
                                }
                                break;
                            case "custom":
                                try {
                                    if (j[r].editoptions && c.isFunction(j[r].editoptions.custom_value)) {
                                        j[r].editoptions.custom_value.call(aQ, c("#" + i, "#" + e), "set", l)
                                    } else {
                                        throw "e1"
                                    }
                                } catch (q) {
                                    if (q === "e1") {
                                        c.jgrid.info_dialog(c.jgrid.errors.errcap, "function 'custom_value' " + c.jgrid.edit.msg.nodefined, c.jgrid.edit.bClose)
                                    } else {
                                        c.jgrid.info_dialog(c.jgrid.errors.errcap, q.message, c.jgrid.edit.bClose)
                                    }
                                }
                                break
                            }
                            p++
                        }
                    });
                    if (p > 0) {
                        c("#id_g", az).val(h)
                    }
                }
                function ad() {
                    c.each(aQ.p.colModel, function(f, e) {
                        if (e.editoptions && e.editoptions.NullIfEmpty === true) {
                            if (aq.hasOwnProperty(e.name) && aq[e.name] === "") {
                                aq[e.name] = "null"
                            }
                        }
                    })
                }
                function aK() {
                    var l, m = [true, "", ""], h = {}, q = aQ.p.prmNames, n, e, i, p, r;
                    var o = c(aQ).triggerHandler("jqGridAddEditBeforeCheckValues", [c("#" + aw), ap]);
                    if (o && typeof o === "object") {
                        aq = o
                    }
                    if (c.isFunction(d[aQ.p.id].beforeCheckValues)) {
                        o = d[aQ.p.id].beforeCheckValues.call(aQ, aq, c("#" + aw), ap);
                        if (o && typeof o === "object") {
                            aq = o
                        }
                    }
                    for (i in aq) {
                        if (aq.hasOwnProperty(i)) {
                            m = c.jgrid.checkValues.call(aQ, aq[i], i);
                            if (m[0] === false) {
                                break
                            }
                        }
                    }
                    ad();
                    if (m[0]) {
                        h = c(aQ).triggerHandler("jqGridAddEditClickSubmit", [d[aQ.p.id], aq, ap]);
                        if (h === undefined && c.isFunction(d[aQ.p.id].onclickSubmit)) {
                            h = d[aQ.p.id].onclickSubmit.call(aQ, d[aQ.p.id], aq, ap) || {}
                        }
                        m = c(aQ).triggerHandler("jqGridAddEditBeforeSubmit", [aq, c("#" + aw), ap]);
                        if (m === undefined) {
                            m = [true, "", ""]
                        }
                        if (m[0] && c.isFunction(d[aQ.p.id].beforeSubmit)) {
                            m = d[aQ.p.id].beforeSubmit.call(aQ, aq, c("#" + aw), ap)
                        }
                    }
                    if (m[0] && !d[aQ.p.id].processing) {
                        d[aQ.p.id].processing = true;
                        c("#sData", az + "_2").addClass("ui-state-active");
                        e = q.oper;
                        n = q.id;
                        aq[e] = (c.trim(aq[aQ.p.id + "_id"]) === "_empty") ? q.addoper : q.editoper;
                        if (aq[e] !== q.addoper) {
                            aq[n] = aq[aQ.p.id + "_id"]
                        } else {
                            if (aq[n] === undefined) {
                                aq[n] = aq[aQ.p.id + "_id"]
                            }
                        }
                        delete aq[aQ.p.id + "_id"];
                        aq = c.extend(aq, d[aQ.p.id].editData, h);
                        if (aQ.p.treeGrid === true) {
                            if (aq[e] === q.addoper) {
                                p = c(aQ).jqGrid("getGridParam", "selrow");
                                var g = aQ.p.treeGridModel === "adjacency" ? aQ.p.treeReader.parent_id_field : "parent_id";
                                aq[g] = p
                            }
                            for (r in aQ.p.treeReader) {
                                if (aQ.p.treeReader.hasOwnProperty(r)) {
                                    var j = aQ.p.treeReader[r];
                                    if (aq.hasOwnProperty(j)) {
                                        if (aq[e] === q.addoper && r === "parent_id_field") {
                                            continue
                                        }
                                        delete aq[j]
                                    }
                                }
                            }
                        }
                        aq[n] = c.jgrid.stripPref(aQ.p.idPrefix, aq[n]);
                        var f = c.extend({
                            url: d[aQ.p.id].url || c(aQ).jqGrid("getGridParam", "editurl"),
                            type: d[aQ.p.id].mtype,
                            data: c.isFunction(d[aQ.p.id].serializeEditData) ? d[aQ.p.id].serializeEditData.call(aQ, aq) : aq,
                            complete: function(t, v) {
                                var u;
                                aq[n] = aQ.p.idPrefix + aq[n];
                                if (t.status >= 300 && t.status !== 304) {
                                    m[0] = false;
                                    m[1] = c(aQ).triggerHandler("jqGridAddEditErrorTextFormat", [t, ap]);
                                    if (c.isFunction(d[aQ.p.id].errorTextFormat)) {
                                        m[1] = d[aQ.p.id].errorTextFormat.call(aQ, t, ap)
                                    } else {
                                        m[1] = v + " Status: '" + t.statusText + "'. Error code: " + t.status
                                    }
                                } else {
                                    m = c(aQ).triggerHandler("jqGridAddEditAfterSubmit", [t, aq, ap]);
                                    if (m === undefined) {
                                        m = [true, "", ""]
                                    }
                                    if (m[0] && c.isFunction(d[aQ.p.id].afterSubmit)) {
                                        m = d[aQ.p.id].afterSubmit.call(aQ, t, aq, ap)
                                    }
                                }
                                if (m[0] === false) {
                                    c("#FormError>td", az).html(m[1]);
                                    c("#FormError", az).show()
                                } else {
                                    if (aQ.p.autoencode) {
                                        c.each(aq, function(w, x) {
                                            aq[w] = c.jgrid.htmlDecode(x)
                                        })
                                    }
                                    if (aq[e] === q.addoper) {
                                        if (!m[2]) {
                                            m[2] = c.jgrid.randId()
                                        }
                                        aq[n] = m[2];
                                        if (d[aQ.p.id].reloadAfterSubmit) {
                                            c(aQ).trigger("reloadGrid")
                                        } else {
                                            if (aQ.p.treeGrid === true) {
                                                c(aQ).jqGrid("addChildNode", m[2], p, aq)
                                            } else {
                                                c(aQ).jqGrid("addRowData", m[2], aq, a.addedrow)
                                            }
                                        }
                                        if (d[aQ.p.id].closeAfterAdd) {
                                            if (aQ.p.treeGrid !== true) {
                                                c(aQ).jqGrid("setSelection", m[2])
                                            }
                                            c.jgrid.hideModal("#" + c.jgrid.jqID(aL.themodal), {
                                                gb: "#gbox_" + c.jgrid.jqID(at),
                                                jqm: a.jqModal,
                                                onClose: d[aQ.p.id].onClose
                                            })
                                        } else {
                                            if (d[aQ.p.id].clearAfterAdd) {
                                                aE("_empty", aQ, aw)
                                            }
                                        }
                                    } else {
                                        if (d[aQ.p.id].reloadAfterSubmit) {
                                            c(aQ).trigger("reloadGrid");
                                            if (!d[aQ.p.id].closeAfterEdit) {
                                                setTimeout(function() {
                                                    c(aQ).jqGrid("setSelection", aq[n])
                                                }, 1000)
                                            }
                                        } else {
                                            if (aQ.p.treeGrid === true) {
                                                c(aQ).jqGrid("setTreeRow", aq[n], aq)
                                            } else {
                                                c(aQ).jqGrid("setRowData", aq[n], aq)
                                            }
                                        }
                                        if (d[aQ.p.id].closeAfterEdit) {
                                            c.jgrid.hideModal("#" + c.jgrid.jqID(aL.themodal), {
                                                gb: "#gbox_" + c.jgrid.jqID(at),
                                                jqm: a.jqModal,
                                                onClose: d[aQ.p.id].onClose
                                            })
                                        }
                                    }
                                    if (c.isFunction(d[aQ.p.id].afterComplete)) {
                                        l = t;
                                        setTimeout(function() {
                                            c(aQ).triggerHandler("jqGridAddEditAfterComplete", [l, aq, c("#" + aw), ap]);
                                            d[aQ.p.id].afterComplete.call(aQ, l, aq, c("#" + aw), ap);
                                            l = null
                                        }, 500)
                                    }
                                    if (d[aQ.p.id].checkOnSubmit || d[aQ.p.id].checkOnUpdate) {
                                        c("#" + aw).data("disabled", false);
                                        if (d[aQ.p.id]._savedData[aQ.p.id + "_id"] !== "_empty") {
                                            for (u in d[aQ.p.id]._savedData) {
                                                if (d[aQ.p.id]._savedData.hasOwnProperty(u) && aq[u]) {
                                                    d[aQ.p.id]._savedData[u] = aq[u]
                                                }
                                            }
                                        }
                                    }
                                }
                                d[aQ.p.id].processing = false;
                                c("#sData", az + "_2").removeClass("ui-state-active");
                                try {
                                    c(":input:visible", "#" + aw)[0].focus()
                                } catch (s) {}
                            }
                        }, c.jgrid.ajaxOptions, d[aQ.p.id].ajaxEditOptions);
                        if (!f.url && !d[aQ.p.id].useDataProxy) {
                            if (c.isFunction(aQ.p.dataProxy)) {
                                d[aQ.p.id].useDataProxy = true
                            } else {
                                m[0] = false;
                                m[1] += " " + c.jgrid.errors.nourl
                            }
                        }
                        if (m[0]) {
                            if (d[aQ.p.id].useDataProxy) {
                                var k = aQ.p.dataProxy.call(aQ, f, "set_" + aQ.p.id);
                                if (k === undefined) {
                                    k = [true, ""]
                                }
                                if (k[0] === false) {
                                    m[0] = false;
                                    m[1] = k[1] || "Error deleting the selected row!"
                                } else {
                                    if (f.data.oper === q.addoper && d[aQ.p.id].closeAfterAdd) {
                                        c.jgrid.hideModal("#" + c.jgrid.jqID(aL.themodal), {
                                            gb: "#gbox_" + c.jgrid.jqID(at),
                                            jqm: a.jqModal,
                                            onClose: d[aQ.p.id].onClose
                                        })
                                    }
                                    if (f.data.oper === q.editoper && d[aQ.p.id].closeAfterEdit) {
                                        c.jgrid.hideModal("#" + c.jgrid.jqID(aL.themodal), {
                                            gb: "#gbox_" + c.jgrid.jqID(at),
                                            jqm: a.jqModal,
                                            onClose: d[aQ.p.id].onClose
                                        })
                                    }
                                }
                            } else {
                                c.ajax(f)
                            }
                        }
                    }
                    if (m[0] === false) {
                        c("#FormError>td", az).html(m[1]);
                        c("#FormError", az).show()
                    }
                }
                function am(f, h) {
                    var g = false, e;
                    for (e in f) {
                        if (f.hasOwnProperty(e) && f[e] != h[e]) {
                            g = true;
                            break
                        }
                    }
                    return g
                }
                function aN() {
                    var e = true;
                    c("#FormError", az).hide();
                    if (d[aQ.p.id].checkOnUpdate) {
                        aq = {};
                        Z();
                        au = am(aq, d[aQ.p.id]._savedData);
                        if (au) {
                            c("#" + aw).data("disabled", true);
                            c(".confirm", "#" + aL.themodal).show();
                            e = false
                        }
                    }
                    return e
                }
                function aa() {
                    var e;
                    if (b !== "_empty" && aQ.p.savedRow !== undefined && aQ.p.savedRow.length > 0 && c.isFunction(c.fn.jqGrid.restoreRow)) {
                        for (e = 0; e < aQ.p.savedRow.length; e++) {
                            if (aQ.p.savedRow[e].id == b) {
                                c(aQ).jqGrid("restoreRow", b);
                                break
                            }
                        }
                    }
                }
                function an(f, g) {
                    var e = g[1].length - 1;
                    if (f === 0) {
                        c("#pData", az + "_2").addClass("ui-state-disabled")
                    } else {
                        if (g[1][f - 1] !== undefined && c("#" + c.jgrid.jqID(g[1][f - 1])).hasClass("ui-state-disabled")) {
                            c("#pData", az + "_2").addClass("ui-state-disabled")
                        } else {
                            c("#pData", az + "_2").removeClass("ui-state-disabled")
                        }
                    }
                    if (f === e) {
                        c("#nData", az + "_2").addClass("ui-state-disabled")
                    } else {
                        if (g[1][f + 1] !== undefined && c("#" + c.jgrid.jqID(g[1][f + 1])).hasClass("ui-state-disabled")) {
                            c("#nData", az + "_2").addClass("ui-state-disabled")
                        } else {
                            c("#nData", az + "_2").removeClass("ui-state-disabled")
                        }
                    }
                }
                function X() {
                    var f = c(aQ).jqGrid("getDataIDs")
                      , g = c("#id_g", az).val()
                      , e = c.inArray(g, f);
                    return [e, f]
                }
                var aC = isNaN(d[c(this)[0].p.id].dataheight) ? d[c(this)[0].p.id].dataheight : d[c(this)[0].p.id].dataheight + "px"
                  , aO = isNaN(d[c(this)[0].p.id].datawidth) ? d[c(this)[0].p.id].datawidth : d[c(this)[0].p.id].datawidth + "px"
                  , ae = c("<form name='FormPost' id='" + aw + "' class='FormGrid' onSubmit='return false;' style='width:" + aO + ";overflow:auto;position:relative;height:" + aC + ";'></form>").data("disabled", false)
                  , av = c("<table id='" + ab + "' class='EditTable' cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>");
                Y = c(aQ).triggerHandler("jqGridAddEditBeforeInitData", [c("#" + aw), ap]);
                if (Y === undefined) {
                    Y = true
                }
                if (Y && ak) {
                    Y = ak.call(aQ, c("#" + aw), ap)
                }
                if (Y === false) {
                    return
                }
                aa();
                c(aQ.p.colModel).each(function() {
                    var e = this.formoptions;
                    ao = Math.max(ao, e ? e.colpos || 0 : 0);
                    aD = Math.max(aD, e ? e.rowpos || 0 : 0)
                });
                c(ae).append(av);
                var al = c("<tr id='FormError' style='display:none'><td class='ui-state-error' colspan='" + (ao * 2) + "'></td></tr>");
                al[0].rp = 0;
                c(av).append(al);
                al = c("<tr style='display:none' class='tinfo'><td class='topinfo' colspan='" + (ao * 2) + "'>" + d[aQ.p.id].topinfo + "</td></tr>");
                al[0].rp = 0;
                c(av).append(al);
                var aP = aQ.p.direction === "rtl" ? true : false
                  , af = aP ? "nData" : "pData"
                  , ac = aP ? "pData" : "nData";
                aB(b, aQ, av, ao);
                var aJ = "<a id='" + af + "' class='fm-button ui-state-default ui-corner-left'><span class='ui-icon ui-icon-triangle-1-w'></span></a>"
                  , aH = "<a id='" + ac + "' class='fm-button ui-state-default ui-corner-right'><span class='ui-icon ui-icon-triangle-1-e'></span></a>"
                  , aM = "<a id='sData' class='fm-button ui-state-default ui-corner-all'>" + a.bSubmit + "</a>"
                  , aA = "<a id='cData' class='fm-button ui-state-default ui-corner-all'>" + a.bCancel + "</a>";
                var ah = "<table border='0' cellspacing='0' cellpadding='0' class='EditTable' id='" + ab + "_2'><tbody><tr><td colspan='2'><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr id='Act_Buttons'><td class='navButton'>" + (aP ? aH + aJ : aJ + aH) + "</td><td class='EditButton'>" + aM + aA + "</td></tr>";
                ah += "<tr style='display:none' class='binfo'><td class='bottominfo' colspan='2'>" + d[aQ.p.id].bottominfo + "</td></tr>";
                ah += "</tbody></table>";
                if (aD > 0) {
                    var ax = [];
                    c.each(c(av)[0].rows, function(f, e) {
                        ax[f] = e
                    });
                    ax.sort(function(e, f) {
                        if (e.rp > f.rp) {
                            return 1
                        }
                        if (e.rp < f.rp) {
                            return -1
                        }
                        return 0
                    });
                    c.each(ax, function(f, e) {
                        c("tbody", av).append(e)
                    })
                }
                a.gbox = "#gbox_" + c.jgrid.jqID(at);
                var aG = false;
                if (a.closeOnEscape === true) {
                    a.closeOnEscape = false;
                    aG = true
                }
                var ai = c("<div></div>").append(ae).append(ah);
                c.jgrid.createModal(aL, ai, d[c(this)[0].p.id], "#gview_" + c.jgrid.jqID(aQ.p.id), c("#gbox_" + c.jgrid.jqID(aQ.p.id))[0]);
                if (aP) {
                    c("#pData, #nData", az + "_2").css("float", "right");
                    c(".EditButton", az + "_2").css("text-align", "left")
                }
                if (d[aQ.p.id].topinfo) {
                    c(".tinfo", az).show()
                }
                if (d[aQ.p.id].bottominfo) {
                    c(".binfo", az + "_2").show()
                }
                ai = null;
                ah = null;
                c("#" + c.jgrid.jqID(aL.themodal)).keydown(function(f) {
                    var e = f.target;
                    if (c("#" + aw).data("disabled") === true) {
                        return false
                    }
                    if (d[aQ.p.id].savekey[0] === true && f.which === d[aQ.p.id].savekey[1]) {
                        if (e.tagName !== "TEXTAREA") {
                            c("#sData", az + "_2").trigger("click");
                            return false
                        }
                    }
                    if (f.which === 27) {
                        if (!aN()) {
                            return false
                        }
                        if (aG) {
                            c.jgrid.hideModal("#" + c.jgrid.jqID(aL.themodal), {
                                gb: a.gbox,
                                jqm: a.jqModal,
                                onClose: d[aQ.p.id].onClose
                            })
                        }
                        return false
                    }
                    if (d[aQ.p.id].navkeys[0] === true) {
                        if (c("#id_g", az).val() === "_empty") {
                            return true
                        }
                        if (f.which === d[aQ.p.id].navkeys[1]) {
                            c("#pData", az + "_2").trigger("click");
                            return false
                        }
                        if (f.which === d[aQ.p.id].navkeys[2]) {
                            c("#nData", az + "_2").trigger("click");
                            return false
                        }
                    }
                });
                if (a.checkOnUpdate) {
                    c("a.ui-jqdialog-titlebar-close span", "#" + c.jgrid.jqID(aL.themodal)).removeClass("jqmClose");
                    c("a.ui-jqdialog-titlebar-close", "#" + c.jgrid.jqID(aL.themodal)).unbind("click").click(function() {
                        if (!aN()) {
                            return false
                        }
                        c.jgrid.hideModal("#" + c.jgrid.jqID(aL.themodal), {
                            gb: "#gbox_" + c.jgrid.jqID(at),
                            jqm: a.jqModal,
                            onClose: d[aQ.p.id].onClose
                        });
                        return false
                    })
                }
                a.saveicon = c.extend([true, "left", "ui-icon-disk"], a.saveicon);
                a.closeicon = c.extend([true, "left", "ui-icon-close"], a.closeicon);
                if (a.saveicon[0] === true) {
                    c("#sData", az + "_2").addClass(a.saveicon[1] === "right" ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " + a.saveicon[2] + "'></span>")
                }
                if (a.closeicon[0] === true) {
                    c("#cData", az + "_2").addClass(a.closeicon[1] === "right" ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " + a.closeicon[2] + "'></span>")
                }
                if (d[aQ.p.id].checkOnSubmit || d[aQ.p.id].checkOnUpdate) {
                    aM = "<a id='sNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>" + a.bYes + "</a>";
                    aH = "<a id='nNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>" + a.bNo + "</a>";
                    aA = "<a id='cNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>" + a.bExit + "</a>";
                    var ay = a.zIndex || 999;
                    ay++;
                    c("<div class='" + a.overlayClass + " jqgrid-overlay confirm' style='z-index:" + ay + ";display:none;'>&#160;</div><div class='confirm ui-widget-content ui-jqconfirm' style='z-index:" + (ay + 1) + "'>" + a.saveData + "<br/><br/>" + aM + aH + aA + "</div>").insertAfter("#" + aw);
                    c("#sNew", "#" + c.jgrid.jqID(aL.themodal)).click(function() {
                        aK();
                        c("#" + aw).data("disabled", false);
                        c(".confirm", "#" + c.jgrid.jqID(aL.themodal)).hide();
                        return false
                    });
                    c("#nNew", "#" + c.jgrid.jqID(aL.themodal)).click(function() {
                        c(".confirm", "#" + c.jgrid.jqID(aL.themodal)).hide();
                        c("#" + aw).data("disabled", false);
                        setTimeout(function() {
                            c(":input:visible", "#" + aw)[0].focus()
                        }, 0);
                        return false
                    });
                    c("#cNew", "#" + c.jgrid.jqID(aL.themodal)).click(function() {
                        c(".confirm", "#" + c.jgrid.jqID(aL.themodal)).hide();
                        c("#" + aw).data("disabled", false);
                        c.jgrid.hideModal("#" + c.jgrid.jqID(aL.themodal), {
                            gb: "#gbox_" + c.jgrid.jqID(at),
                            jqm: a.jqModal,
                            onClose: d[aQ.p.id].onClose
                        });
                        return false
                    })
                }
                c(aQ).triggerHandler("jqGridAddEditInitializeForm", [c("#" + aw), ap]);
                if (aF) {
                    aF.call(aQ, c("#" + aw), ap)
                }
                if (b === "_empty" || !d[aQ.p.id].viewPagerButtons) {
                    c("#pData,#nData", az + "_2").hide()
                } else {
                    c("#pData,#nData", az + "_2").show()
                }
                c(aQ).triggerHandler("jqGridAddEditBeforeShowForm", [c("#" + aw), ap]);
                if (ar) {
                    ar.call(aQ, c("#" + aw), ap)
                }
                c("#" + c.jgrid.jqID(aL.themodal)).data("onClose", d[aQ.p.id].onClose);
                c.jgrid.viewModal("#" + c.jgrid.jqID(aL.themodal), {
                    gbox: "#gbox_" + c.jgrid.jqID(at),
                    jqm: a.jqModal,
                    overlay: a.overlay,
                    modal: a.modal,
                    overlayClass: a.overlayClass,
                    onHide: function(e) {
                        c(aQ).data("formProp", {
                            top: parseFloat(c(e.w).css("top")),
                            left: parseFloat(c(e.w).css("left")),
                            width: c(e.w).width(),
                            height: c(e.w).height(),
                            dataheight: c("#" + aw).height(),
                            datawidth: c("#" + aw).width()
                        });
                        e.w.remove();
                        if (e.o) {
                            e.o.remove()
                        }
                    }
                });
                if (!aI) {
                    c("." + c.jgrid.jqID(a.overlayClass)).click(function() {
                        if (!aN()) {
                            return false
                        }
                        c.jgrid.hideModal("#" + c.jgrid.jqID(aL.themodal), {
                            gb: "#gbox_" + c.jgrid.jqID(at),
                            jqm: a.jqModal,
                            onClose: d[aQ.p.id].onClose
                        });
                        return false
                    })
                }
                c(".fm-button", "#" + c.jgrid.jqID(aL.themodal)).hover(function() {
                    c(this).addClass("ui-state-hover")
                }, function() {
                    c(this).removeClass("ui-state-hover")
                });
                c("#sData", az + "_2").click(function() {
                    aq = {};
                    c("#FormError", az).hide();
                    Z();
                    if (aq[aQ.p.id + "_id"] === "_empty") {
                        aK()
                    } else {
                        if (a.checkOnSubmit === true) {
                            au = am(aq, d[aQ.p.id]._savedData);
                            if (au) {
                                c("#" + aw).data("disabled", true);
                                c(".confirm", "#" + c.jgrid.jqID(aL.themodal)).show()
                            } else {
                                aK()
                            }
                        } else {
                            aK()
                        }
                    }
                    return false
                });
                c("#cData", az + "_2").click(function() {
                    if (!aN()) {
                        return false
                    }
                    c.jgrid.hideModal("#" + c.jgrid.jqID(aL.themodal), {
                        gb: "#gbox_" + c.jgrid.jqID(at),
                        jqm: a.jqModal,
                        onClose: d[aQ.p.id].onClose
                    });
                    return false
                });
                c("#nData", az + "_2").click(function() {
                    if (!aN()) {
                        return false
                    }
                    c("#FormError", az).hide();
                    var e = X();
                    e[0] = parseInt(e[0], 10);
                    if (e[0] !== -1 && e[1][e[0] + 1]) {
                        c(aQ).triggerHandler("jqGridAddEditClickPgButtons", ["next", c("#" + aw), e[1][e[0]]]);
                        var f;
                        if (c.isFunction(a.onclickPgButtons)) {
                            f = a.onclickPgButtons.call(aQ, "next", c("#" + aw), e[1][e[0]]);
                            if (f !== undefined && f === false) {
                                return false
                            }
                        }
                        if (c("#" + c.jgrid.jqID(e[1][e[0] + 1])).hasClass("ui-state-disabled")) {
                            return false
                        }
                        aE(e[1][e[0] + 1], aQ, aw);
                        c(aQ).jqGrid("setSelection", e[1][e[0] + 1]);
                        c(aQ).triggerHandler("jqGridAddEditAfterClickPgButtons", ["next", c("#" + aw), e[1][e[0]]]);
                        if (c.isFunction(a.afterclickPgButtons)) {
                            a.afterclickPgButtons.call(aQ, "next", c("#" + aw), e[1][e[0] + 1])
                        }
                        an(e[0] + 1, e)
                    }
                    return false
                });
                c("#pData", az + "_2").click(function() {
                    if (!aN()) {
                        return false
                    }
                    c("#FormError", az).hide();
                    var e = X();
                    if (e[0] !== -1 && e[1][e[0] - 1]) {
                        c(aQ).triggerHandler("jqGridAddEditClickPgButtons", ["prev", c("#" + aw), e[1][e[0]]]);
                        var f;
                        if (c.isFunction(a.onclickPgButtons)) {
                            f = a.onclickPgButtons.call(aQ, "prev", c("#" + aw), e[1][e[0]]);
                            if (f !== undefined && f === false) {
                                return false
                            }
                        }
                        if (c("#" + c.jgrid.jqID(e[1][e[0] - 1])).hasClass("ui-state-disabled")) {
                            return false
                        }
                        aE(e[1][e[0] - 1], aQ, aw);
                        c(aQ).jqGrid("setSelection", e[1][e[0] - 1]);
                        c(aQ).triggerHandler("jqGridAddEditAfterClickPgButtons", ["prev", c("#" + aw), e[1][e[0]]]);
                        if (c.isFunction(a.afterclickPgButtons)) {
                            a.afterclickPgButtons.call(aQ, "prev", c("#" + aw), e[1][e[0] - 1])
                        }
                        an(e[0] - 1, e)
                    }
                    return false
                });
                c(aQ).triggerHandler("jqGridAddEditAfterShowForm", [c("#" + aw), ap]);
                if (aj) {
                    aj.call(aQ, c("#" + aw), ap)
                }
                var ag = X();
                an(ag[0], ag)
            })
        },
        viewGridRow: function(b, a) {
            a = c.extend(true, {
                top: 0,
                left: 0,
                width: 0,
                datawidth: "auto",
                height: "auto",
                dataheight: "auto",
                modal: false,
                overlay: 30,
                drag: true,
                resize: true,
                jqModal: true,
                closeOnEscape: false,
                labelswidth: "30%",
                closeicon: [],
                navkeys: [false, 38, 40],
                onClose: null,
                beforeShowForm: null,
                beforeInitData: null,
                viewPagerButtons: true,
                recreateForm: false
            }, c.jgrid.view, a || {});
            d[c(this)[0].p.id] = a;
            return this.each(function() {
                var I = this;
                if (!I.grid || !b) {
                    return
                }
                var S = I.p.id
                  , U = "ViewGrid_" + c.jgrid.jqID(S)
                  , O = "ViewTbl_" + c.jgrid.jqID(S)
                  , M = "ViewGrid_" + S
                  , Z = "ViewTbl_" + S
                  , ae = {
                    themodal: "viewmod" + S,
                    modalhead: "viewhd" + S,
                    modalcontent: "viewcnt" + S,
                    scrollelm: U
                }
                  , V = c.isFunction(d[I.p.id].beforeInitData) ? d[I.p.id].beforeInitData : false
                  , ab = true
                  , ag = 1
                  , ah = 0;
                if (!a.recreateForm) {
                    if (c(I).data("viewProp")) {
                        c.extend(d[c(this)[0].p.id], c(I).data("viewProp"))
                    }
                }
                function ad() {
                    if (d[I.p.id].closeOnEscape === true || d[I.p.id].navkeys[0] === true) {
                        setTimeout(function() {
                            c(".ui-jqdialog-titlebar-close", "#" + c.jgrid.jqID(ae.modalhead)).focus()
                        }, 0)
                    }
                }
                function Y(r, l, n, f) {
                    var v, s, k, h = 0, z, y, A = [], m = false, g, q = "<td class='CaptionTD form-view-label ui-widget-content' width='" + a.labelswidth + "'>&#160;</td><td class='DataTD form-view-data ui-helper-reset ui-widget-content'>&#160;</td>", o = "", u = "<td class='CaptionTD form-view-label ui-widget-content'>&#160;</td><td class='DataTD form-view-data ui-widget-content'>&#160;</td>", p = ["integer", "number", "currency"], i = 0, j = 0, t, w, e;
                    for (g = 1; g <= f; g++) {
                        o += g === 1 ? q : u
                    }
                    c(l.p.colModel).each(function() {
                        if (this.editrules && this.editrules.edithidden === true) {
                            s = false
                        } else {
                            s = this.hidden === true ? true : false
                        }
                        if (!s && this.align === "right") {
                            if (this.formatter && c.inArray(this.formatter, p) !== -1) {
                                i = Math.max(i, parseInt(this.width, 10))
                            } else {
                                j = Math.max(j, parseInt(this.width, 10))
                            }
                        }
                    });
                    t = i !== 0 ? i : j !== 0 ? j : 0;
                    m = c(l).jqGrid("getInd", r);
                    c(l.p.colModel).each(function(F) {
                        v = this.name;
                        w = false;
                        if (this.editrules && this.editrules.edithidden === true) {
                            s = false
                        } else {
                            s = this.hidden === true ? true : false
                        }
                        y = s ? "style='display:none'" : "";
                        e = (typeof this.viewable !== "boolean") ? true : this.viewable;
                        if (v !== "cb" && v !== "subgrid" && v !== "rn" && e) {
                            if (m === false) {
                                z = ""
                            } else {
                                if (v === l.p.ExpandColumn && l.p.treeGrid === true) {
                                    z = c("td:eq(" + F + ")", l.rows[m]).text()
                                } else {
                                    z = c("td:eq(" + F + ")", l.rows[m]).html()
                                }
                            }
                            w = this.align === "right" && t !== 0 ? true : false;
                            var B = c.extend({}, {
                                rowabove: false,
                                rowcontent: ""
                            }, this.formoptions || {})
                              , E = parseInt(B.rowpos, 10) || h + 1
                              , C = parseInt((parseInt(B.colpos, 10) || 1) * 2, 10);
                            if (B.rowabove) {
                                var D = c("<tr><td class='contentinfo' colspan='" + (f * 2) + "'>" + B.rowcontent + "</td></tr>");
                                c(n).append(D);
                                D[0].rp = E
                            }
                            k = c(n).find("tr[rowpos=" + E + "]");
                            if (k.length === 0) {
                                k = c("<tr " + y + " rowpos='" + E + "'></tr>").addClass("FormData").attr("id", "trv_" + v);
                                c(k).append(o);
                                c(n).append(k);
                                k[0].rp = E
                            }
                            c("td:eq(" + (C - 2) + ")", k[0]).html("<b>" + (B.label === undefined ? l.p.colNames[F] : B.label) + "</b>");
                            c("td:eq(" + (C - 1) + ")", k[0]).append("<span>" + z + "</span>").attr("id", "v_" + v);
                            if (w) {
                                c("td:eq(" + (C - 1) + ") span", k[0]).css({
                                    "text-align": "right",
                                    width: t + "px"
                                })
                            }
                            A[h] = F;
                            h++
                        }
                    });
                    if (h > 0) {
                        var x = c("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='" + (f * 2 - 1) + "' class='DataTD'><input class='FormElement' id='id_g' type='text' name='id' value='" + r + "'/></td></tr>");
                        x[0].rp = h + 99;
                        c(n).append(x)
                    }
                    return A
                }
                function aa(f, k) {
                    var i, j, g = 0, h, e;
                    e = c(k).jqGrid("getInd", f, true);
                    if (!e) {
                        return
                    }
                    c("td", e).each(function(l) {
                        i = k.p.colModel[l].name;
                        if (k.p.colModel[l].editrules && k.p.colModel[l].editrules.edithidden === true) {
                            j = false
                        } else {
                            j = k.p.colModel[l].hidden === true ? true : false
                        }
                        if (i !== "cb" && i !== "subgrid" && i !== "rn") {
                            if (i === k.p.ExpandColumn && k.p.treeGrid === true) {
                                h = c(this).text()
                            } else {
                                h = c(this).html()
                            }
                            i = c.jgrid.jqID("v_" + i);
                            c("#" + i + " span", "#" + O).html(h);
                            if (j) {
                                c("#" + i, "#" + O).parents("tr:first").hide()
                            }
                            g++
                        }
                    });
                    if (g > 0) {
                        c("#id_g", "#" + O).val(f)
                    }
                }
                function W(f, g) {
                    var e = g[1].length - 1;
                    if (f === 0) {
                        c("#pData", "#" + O + "_2").addClass("ui-state-disabled")
                    } else {
                        if (g[1][f - 1] !== undefined && c("#" + c.jgrid.jqID(g[1][f - 1])).hasClass("ui-state-disabled")) {
                            c("#pData", O + "_2").addClass("ui-state-disabled")
                        } else {
                            c("#pData", "#" + O + "_2").removeClass("ui-state-disabled")
                        }
                    }
                    if (f === e) {
                        c("#nData", "#" + O + "_2").addClass("ui-state-disabled")
                    } else {
                        if (g[1][f + 1] !== undefined && c("#" + c.jgrid.jqID(g[1][f + 1])).hasClass("ui-state-disabled")) {
                            c("#nData", O + "_2").addClass("ui-state-disabled")
                        } else {
                            c("#nData", "#" + O + "_2").removeClass("ui-state-disabled")
                        }
                    }
                }
                function af() {
                    var f = c(I).jqGrid("getDataIDs")
                      , g = c("#id_g", "#" + O).val()
                      , e = c.inArray(g, f);
                    return [e, f]
                }
                var X = isNaN(d[c(this)[0].p.id].dataheight) ? d[c(this)[0].p.id].dataheight : d[c(this)[0].p.id].dataheight + "px"
                  , Q = isNaN(d[c(this)[0].p.id].datawidth) ? d[c(this)[0].p.id].datawidth : d[c(this)[0].p.id].datawidth + "px"
                  , P = c("<form name='FormPost' id='" + M + "' class='FormGrid' style='width:" + Q + ";overflow:auto;position:relative;height:" + X + ";'></form>")
                  , ac = c("<table id='" + Z + "' class='EditTable' cellspacing='1' cellpadding='2' border='0' style='table-layout:fixed'><tbody></tbody></table>");
                if (V) {
                    ab = V.call(I, c("#" + U));
                    if (ab === undefined) {
                        ab = true
                    }
                }
                if (ab === false) {
                    return
                }
                c(I.p.colModel).each(function() {
                    var e = this.formoptions;
                    ag = Math.max(ag, e ? e.colpos || 0 : 0);
                    ah = Math.max(ah, e ? e.rowpos || 0 : 0)
                });
                c(P).append(ac);
                Y(b, I, ac, ag);
                var H = I.p.direction === "rtl" ? true : false
                  , L = H ? "nData" : "pData"
                  , ai = H ? "pData" : "nData"
                  , K = "<a id='" + L + "' class='fm-button ui-state-default ui-corner-left'><span class='ui-icon ui-icon-triangle-1-w'></span></a>"
                  , J = "<a id='" + ai + "' class='fm-button ui-state-default ui-corner-right'><span class='ui-icon ui-icon-triangle-1-e'></span></a>"
                  , N = "<a id='cData' class='fm-button ui-state-default ui-corner-all'>" + a.bClose + "</a>";
                if (ah > 0) {
                    var aj = [];
                    c.each(c(ac)[0].rows, function(f, e) {
                        aj[f] = e
                    });
                    aj.sort(function(e, f) {
                        if (e.rp > f.rp) {
                            return 1
                        }
                        if (e.rp < f.rp) {
                            return -1
                        }
                        return 0
                    });
                    c.each(aj, function(f, e) {
                        c("tbody", ac).append(e)
                    })
                }
                a.gbox = "#gbox_" + c.jgrid.jqID(S);
                var R = c("<div></div>").append(P).append("<table border='0' class='EditTable' id='" + O + "_2'><tbody><tr id='Act_Buttons'><td class='navButton' width='" + a.labelswidth + "'>" + (H ? J + K : K + J) + "</td><td class='EditButton'>" + N + "</td></tr></tbody></table>");
                c.jgrid.createModal(ae, R, a, "#gview_" + c.jgrid.jqID(I.p.id), c("#gview_" + c.jgrid.jqID(I.p.id))[0]);
                if (H) {
                    c("#pData, #nData", "#" + O + "_2").css("float", "right");
                    c(".EditButton", "#" + O + "_2").css("text-align", "left")
                }
                if (!a.viewPagerButtons) {
                    c("#pData, #nData", "#" + O + "_2").hide()
                }
                R = null;
                c("#" + ae.themodal).keydown(function(e) {
                    if (e.which === 27) {
                        if (d[I.p.id].closeOnEscape) {
                            c.jgrid.hideModal("#" + c.jgrid.jqID(ae.themodal), {
                                gb: a.gbox,
                                jqm: a.jqModal,
                                onClose: a.onClose
                            })
                        }
                        return false
                    }
                    if (a.navkeys[0] === true) {
                        if (e.which === a.navkeys[1]) {
                            c("#pData", "#" + O + "_2").trigger("click");
                            return false
                        }
                        if (e.which === a.navkeys[2]) {
                            c("#nData", "#" + O + "_2").trigger("click");
                            return false
                        }
                    }
                });
                a.closeicon = c.extend([true, "left", "ui-icon-close"], a.closeicon);
                if (a.closeicon[0] === true) {
                    c("#cData", "#" + O + "_2").addClass(a.closeicon[1] === "right" ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " + a.closeicon[2] + "'></span>")
                }
                if (c.isFunction(a.beforeShowForm)) {
                    a.beforeShowForm.call(I, c("#" + U))
                }
                c.jgrid.viewModal("#" + c.jgrid.jqID(ae.themodal), {
                    gbox: "#gbox_" + c.jgrid.jqID(S),
                    jqm: a.jqModal,
                    overlay: a.overlay,
                    modal: a.modal,
                    onHide: function(e) {
                        c(I).data("viewProp", {
                            top: parseFloat(c(e.w).css("top")),
                            left: parseFloat(c(e.w).css("left")),
                            width: c(e.w).width(),
                            height: c(e.w).height(),
                            dataheight: c("#" + U).height(),
                            datawidth: c("#" + U).width()
                        });
                        e.w.remove();
                        if (e.o) {
                            e.o.remove()
                        }
                    }
                });
                c(".fm-button:not(.ui-state-disabled)", "#" + O + "_2").hover(function() {
                    c(this).addClass("ui-state-hover")
                }, function() {
                    c(this).removeClass("ui-state-hover")
                });
                ad();
                c("#cData", "#" + O + "_2").click(function() {
                    c.jgrid.hideModal("#" + c.jgrid.jqID(ae.themodal), {
                        gb: "#gbox_" + c.jgrid.jqID(S),
                        jqm: a.jqModal,
                        onClose: a.onClose
                    });
                    return false
                });
                c("#nData", "#" + O + "_2").click(function() {
                    c("#FormError", "#" + O).hide();
                    var e = af();
                    e[0] = parseInt(e[0], 10);
                    if (e[0] !== -1 && e[1][e[0] + 1]) {
                        if (c.isFunction(a.onclickPgButtons)) {
                            a.onclickPgButtons.call(I, "next", c("#" + U), e[1][e[0]])
                        }
                        aa(e[1][e[0] + 1], I);
                        c(I).jqGrid("setSelection", e[1][e[0] + 1]);
                        if (c.isFunction(a.afterclickPgButtons)) {
                            a.afterclickPgButtons.call(I, "next", c("#" + U), e[1][e[0] + 1])
                        }
                        W(e[0] + 1, e)
                    }
                    ad();
                    return false
                });
                c("#pData", "#" + O + "_2").click(function() {
                    c("#FormError", "#" + O).hide();
                    var e = af();
                    if (e[0] !== -1 && e[1][e[0] - 1]) {
                        if (c.isFunction(a.onclickPgButtons)) {
                            a.onclickPgButtons.call(I, "prev", c("#" + U), e[1][e[0]])
                        }
                        aa(e[1][e[0] - 1], I);
                        c(I).jqGrid("setSelection", e[1][e[0] - 1]);
                        if (c.isFunction(a.afterclickPgButtons)) {
                            a.afterclickPgButtons.call(I, "prev", c("#" + U), e[1][e[0] - 1])
                        }
                        W(e[0] - 1, e)
                    }
                    ad();
                    return false
                });
                var T = af();
                W(T[0], T)
            })
        },
        delGridRow: function(b, a) {
            a = c.extend(true, {
                top: 0,
                left: 0,
                width: 240,
                height: "auto",
                dataheight: "auto",
                modal: false,
                overlay: 30,
                drag: true,
                resize: true,
                url: "",
                mtype: "POST",
                reloadAfterSubmit: true,
                beforeShowForm: null,
                beforeInitData: null,
                afterShowForm: null,
                beforeSubmit: null,
                onclickSubmit: null,
                afterSubmit: null,
                jqModal: true,
                closeOnEscape: false,
                delData: {},
                delicon: [],
                cancelicon: [],
                onClose: null,
                ajaxDelOptions: {},
                processing: false,
                serializeDelData: null,
                useDataProxy: false
            }, c.jgrid.del, a || {});
            d[c(this)[0].p.id] = a;
            return this.each(function() {
                var B = this;
                if (!B.grid) {
                    return
                }
                if (!b) {
                    return
                }
                var x = c.isFunction(d[B.p.id].beforeShowForm), K = c.isFunction(d[B.p.id].afterShowForm), z = c.isFunction(d[B.p.id].beforeInitData) ? d[B.p.id].beforeInitData : false, J = B.p.id, H = {}, L = true, N = "DelTbl_" + c.jgrid.jqID(J), C, E, I, G, P = "DelTbl_" + J, O = {
                    themodal: "delmod" + J,
                    modalhead: "delhd" + J,
                    modalcontent: "delcnt" + J,
                    scrollelm: N
                };
                if (c.isArray(b)) {
                    b = b.join()
                }
                if (c("#" + c.jgrid.jqID(O.themodal))[0] !== undefined) {
                    if (z) {
                        L = z.call(B, c("#" + N));
                        if (L === undefined) {
                            L = true
                        }
                    }
                    if (L === false) {
                        return
                    }
                    c("#DelData>td", "#" + N).text(b);
                    c("#DelError", "#" + N).hide();
                    if (d[B.p.id].processing === true) {
                        d[B.p.id].processing = false;
                        c("#dData", "#" + N).removeClass("ui-state-active")
                    }
                    if (x) {
                        d[B.p.id].beforeShowForm.call(B, c("#" + N))
                    }
                    c.jgrid.viewModal("#" + c.jgrid.jqID(O.themodal), {
                        gbox: "#gbox_" + c.jgrid.jqID(J),
                        jqm: d[B.p.id].jqModal,
                        jqM: false,
                        overlay: d[B.p.id].overlay,
                        modal: d[B.p.id].modal
                    });
                    if (K) {
                        d[B.p.id].afterShowForm.call(B, c("#" + N))
                    }
                } else {
                    var A = isNaN(d[B.p.id].dataheight) ? d[B.p.id].dataheight : d[B.p.id].dataheight + "px"
                      , F = isNaN(a.datawidth) ? a.datawidth : a.datawidth + "px"
                      , M = "<div id='" + P + "' class='formdata' style='width:" + F + ";overflow:auto;position:relative;height:" + A + ";'>";
                    M += "<table class='DelTable'><tbody>";
                    M += "<tr id='DelError' style='display:none'><td class='ui-state-error'></td></tr>";
                    M += "<tr id='DelData' style='display:none'><td >" + b + "</td></tr>";
                    M += '<tr><td class="delmsg" style="white-space:pre;">' + d[B.p.id].msg + "</td></tr><tr><td >&#160;</td></tr>";
                    M += "</tbody></table></div>";
                    var D = "<a id='dData' class='fm-button ui-state-default ui-corner-all'>" + a.bSubmit + "</a>"
                      , y = "<a id='eData' class='fm-button ui-state-default ui-corner-all'>" + a.bCancel + "</a>";
                    M += "<table cellspacing='0' cellpadding='0' border='0' class='EditTable' id='" + N + "_2'><tbody><tr><td><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr><td class='DelButton EditButton'>" + D + "&#160;" + y + "</td></tr></tbody></table>";
                    a.gbox = "#gbox_" + c.jgrid.jqID(J);
                    c.jgrid.createModal(O, M, a, "#gview_" + c.jgrid.jqID(B.p.id), c("#gview_" + c.jgrid.jqID(B.p.id))[0]);
                    if (z) {
                        L = z.call(B, c("#" + N));
                        if (L === undefined) {
                            L = true
                        }
                    }
                    if (L === false) {
                        return
                    }
                    c(".fm-button", "#" + N + "_2").hover(function() {
                        c(this).addClass("ui-state-hover")
                    }, function() {
                        c(this).removeClass("ui-state-hover")
                    });
                    a.delicon = c.extend([true, "left", "ui-icon-scissors"], d[B.p.id].delicon);
                    a.cancelicon = c.extend([true, "left", "ui-icon-cancel"], d[B.p.id].cancelicon);
                    if (a.delicon[0] === true) {
                        c("#dData", "#" + N + "_2").addClass(a.delicon[1] === "right" ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " + a.delicon[2] + "'></span>")
                    }
                    if (a.cancelicon[0] === true) {
                        c("#eData", "#" + N + "_2").addClass(a.cancelicon[1] === "right" ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " + a.cancelicon[2] + "'></span>")
                    }
                    c("#dData", "#" + N + "_2").click(function() {
                        var g = [true, ""], i, f = c("#DelData>td", "#" + N).text();
                        H = {};
                        if (c.isFunction(d[B.p.id].onclickSubmit)) {
                            H = d[B.p.id].onclickSubmit.call(B, d[B.p.id], f) || {}
                        }
                        if (c.isFunction(d[B.p.id].beforeSubmit)) {
                            g = d[B.p.id].beforeSubmit.call(B, f)
                        }
                        if (g[0] && !d[B.p.id].processing) {
                            d[B.p.id].processing = true;
                            I = B.p.prmNames;
                            C = c.extend({}, d[B.p.id].delData, H);
                            G = I.oper;
                            C[G] = I.deloper;
                            E = I.id;
                            f = String(f).split(",");
                            if (!f.length) {
                                return false
                            }
                            for (i in f) {
                                if (f.hasOwnProperty(i)) {
                                    f[i] = c.jgrid.stripPref(B.p.idPrefix, f[i])
                                }
                            }
                            C[E] = f.join();
                            c(this).addClass("ui-state-active");
                            var e = c.extend({
                                url: d[B.p.id].url || c(B).jqGrid("getGridParam", "editurl"),
                                type: d[B.p.id].mtype,
                                data: c.isFunction(d[B.p.id].serializeDelData) ? d[B.p.id].serializeDelData.call(B, C) : C,
                                complete: function(k, m) {
                                    var l;
                                    if (k.status >= 300 && k.status !== 304) {
                                        g[0] = false;
                                        if (c.isFunction(d[B.p.id].errorTextFormat)) {
                                            g[1] = d[B.p.id].errorTextFormat.call(B, k)
                                        } else {
                                            g[1] = m + " Status: '" + k.statusText + "'. Error code: " + k.status
                                        }
                                    } else {
                                        if (c.isFunction(d[B.p.id].afterSubmit)) {
                                            g = d[B.p.id].afterSubmit.call(B, k, C)
                                        }
                                    }
                                    if (g[0] === false) {
                                        c("#DelError>td", "#" + N).html(g[1]);
                                        c("#DelError", "#" + N).show()
                                    } else {
                                        if (d[B.p.id].reloadAfterSubmit && B.p.datatype !== "local") {
                                            c(B).trigger("reloadGrid")
                                        } else {
                                            if (B.p.treeGrid === true) {
                                                try {
                                                    c(B).jqGrid("delTreeNode", B.p.idPrefix + f[0])
                                                } catch (j) {}
                                            } else {
                                                for (l = 0; l < f.length; l++) {
                                                    c(B).jqGrid("delRowData", B.p.idPrefix + f[l])
                                                }
                                            }
                                            B.p.selrow = null;
                                            B.p.selarrrow = []
                                        }
                                        if (c.isFunction(d[B.p.id].afterComplete)) {
                                            setTimeout(function() {
                                                d[B.p.id].afterComplete.call(B, k, f)
                                            }, 500)
                                        }
                                    }
                                    d[B.p.id].processing = false;
                                    c("#dData", "#" + N + "_2").removeClass("ui-state-active");
                                    if (g[0]) {
                                        c.jgrid.hideModal("#" + c.jgrid.jqID(O.themodal), {
                                            gb: "#gbox_" + c.jgrid.jqID(J),
                                            jqm: a.jqModal,
                                            onClose: d[B.p.id].onClose
                                        })
                                    }
                                }
                            }, c.jgrid.ajaxOptions, d[B.p.id].ajaxDelOptions);
                            if (!e.url && !d[B.p.id].useDataProxy) {
                                if (c.isFunction(B.p.dataProxy)) {
                                    d[B.p.id].useDataProxy = true
                                } else {
                                    g[0] = false;
                                    g[1] += " " + c.jgrid.errors.nourl
                                }
                            }
                            if (g[0]) {
                                if (d[B.p.id].useDataProxy) {
                                    var h = B.p.dataProxy.call(B, e, "del_" + B.p.id);
                                    if (h === undefined) {
                                        h = [true, ""]
                                    }
                                    if (h[0] === false) {
                                        g[0] = false;
                                        g[1] = h[1] || "Error deleting the selected row!"
                                    } else {
                                        c.jgrid.hideModal("#" + c.jgrid.jqID(O.themodal), {
                                            gb: "#gbox_" + c.jgrid.jqID(J),
                                            jqm: a.jqModal,
                                            onClose: d[B.p.id].onClose
                                        })
                                    }
                                } else {
                                    c.ajax(e)
                                }
                            }
                        }
                        if (g[0] === false) {
                            c("#DelError>td", "#" + N).html(g[1]);
                            c("#DelError", "#" + N).show()
                        }
                        return false
                    });
                    c("#eData", "#" + N + "_2").click(function() {
                        c.jgrid.hideModal("#" + c.jgrid.jqID(O.themodal), {
                            gb: "#gbox_" + c.jgrid.jqID(J),
                            jqm: d[B.p.id].jqModal,
                            onClose: d[B.p.id].onClose
                        });
                        return false
                    });
                    if (x) {
                        d[B.p.id].beforeShowForm.call(B, c("#" + N))
                    }
                    c.jgrid.viewModal("#" + c.jgrid.jqID(O.themodal), {
                        gbox: "#gbox_" + c.jgrid.jqID(J),
                        jqm: d[B.p.id].jqModal,
                        overlay: d[B.p.id].overlay,
                        modal: d[B.p.id].modal
                    });
                    if (K) {
                        d[B.p.id].afterShowForm.call(B, c("#" + N))
                    }
                }
                if (d[B.p.id].closeOnEscape === true) {
                    setTimeout(function() {
                        c(".ui-jqdialog-titlebar-close", "#" + c.jgrid.jqID(O.modalhead)).focus()
                    }, 0)
                }
            })
        },
        navGrid: function(k, b, l, j, m, n, a) {
            b = c.extend({
                edit: true,
                editicon: "ui-icon-pencil",
                add: true,
                addicon: "ui-icon-plus",
                del: true,
                delicon: "ui-icon-trash",
                search: true,
                searchicon: "ui-icon-search",
                refresh: true,
                refreshicon: "ui-icon-refresh",
                refreshstate: "firstpage",
                view: false,
                viewicon: "ui-icon-document",
                position: "left",
                closeOnEscape: true,
                beforeRefresh: null,
                afterRefresh: null,
                cloneToTop: false,
                alertwidth: 200,
                alertheight: "auto",
                alerttop: null,
                alertleft: null,
                alertzIndex: null
            }, c.jgrid.nav, b || {});
            return this.each(function() {
                if (this.nav) {
                    return
                }
                var z = {
                    themodal: "alertmod_" + this.p.id,
                    modalhead: "alerthd_" + this.p.id,
                    modalcontent: "alertcnt_" + this.p.id
                }, w = this, g, y;
                if (!w.grid || typeof k !== "string") {
                    return
                }
                if (c("#" + z.themodal)[0] === undefined) {
                    if (!b.alerttop && !b.alertleft) {
                        if (window.innerWidth !== undefined) {
                            b.alertleft = window.innerWidth;
                            b.alerttop = window.innerHeight
                        } else {
                            if (document.documentElement !== undefined && document.documentElement.clientWidth !== undefined && document.documentElement.clientWidth !== 0) {
                                b.alertleft = document.documentElement.clientWidth;
                                b.alerttop = document.documentElement.clientHeight
                            } else {
                                b.alertleft = 1024;
                                b.alerttop = 768
                            }
                        }
                        b.alertleft = b.alertleft / 2 - parseInt(b.alertwidth, 10) / 2;
                        b.alerttop = b.alerttop / 2 - 25
                    }
                    c.jgrid.createModal(z, "<div>" + b.alerttext + "</div><span tabindex='0'><span tabindex='-1' id='jqg_alrt'></span></span>", {
                        gbox: "#gbox_" + c.jgrid.jqID(w.p.id),
                        jqModal: true,
                        drag: true,
                        resize: true,
                        caption: b.alertcap,
                        top: b.alerttop,
                        left: b.alertleft,
                        width: b.alertwidth,
                        height: b.alertheight,
                        closeOnEscape: b.closeOnEscape,
                        zIndex: b.alertzIndex
                    }, "#gview_" + c.jgrid.jqID(w.p.id), c("#gbox_" + c.jgrid.jqID(w.p.id))[0], true)
                }
                var f = 1, i, h = function() {
                    if (!c(this).hasClass("ui-state-disabled")) {
                        c(this).addClass("ui-state-hover")
                    }
                }, e = function() {
                    c(this).removeClass("ui-state-hover")
                };
                if (b.cloneToTop && w.p.toppager) {
                    f = 2
                }
                for (i = 0; i < f; i++) {
                    var D, B = c("<table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table navtable' style='float:left;table-layout:auto;'><tbody><tr></tr></tbody></table>"), A = "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>", x, C;
                    if (i === 0) {
                        x = k;
                        C = w.p.id;
                        if (x === w.p.toppager) {
                            C += "_top";
                            f = 1
                        }
                    } else {
                        x = w.p.toppager;
                        C = w.p.id + "_top"
                    }
                    if (w.p.direction === "rtl") {
                        c(B).attr("dir", "rtl").css("float", "right")
                    }
                    if (b.add) {
                        j = j || {};
                        D = c("<td class='ui-pg-button ui-corner-all'></td>");
                        c(D).append("<div class='ui-pg-div'><span class='ui-icon " + b.addicon + "'></span>" + b.addtext + "</div>");
                        c("tr", B).append(D);
                        c(D, B).attr({
                            title: b.addtitle || "",
                            id: j.id || "add_" + C
                        }).click(function() {
                            if (!c(this).hasClass("ui-state-disabled")) {
                                if (c.isFunction(b.addfunc)) {
                                    b.addfunc.call(w)
                                } else {
                                    c(w).jqGrid("editGridRow", "new", j)
                                }
                            }
                            return false
                        }).hover(h, e);
                        D = null
                    }
                    if (b.edit) {
                        D = c("<td class='ui-pg-button ui-corner-all'></td>");
                        l = l || {};
                        c(D).append("<div class='ui-pg-div'><span class='ui-icon " + b.editicon + "'></span>" + b.edittext + "</div>");
                        c("tr", B).append(D);
                        c(D, B).attr({
                            title: b.edittitle || "",
                            id: l.id || "edit_" + C
                        }).click(function() {
                            if (!c(this).hasClass("ui-state-disabled")) {
                                var o = w.p.selrow;
                                if (o) {
                                    if (c.isFunction(b.editfunc)) {
                                        b.editfunc.call(w, o)
                                    } else {
                                        c(w).jqGrid("editGridRow", o, l)
                                    }
                                } else {
                                    c.jgrid.viewModal("#" + z.themodal, {
                                        gbox: "#gbox_" + c.jgrid.jqID(w.p.id),
                                        jqm: true
                                    });
                                    c("#jqg_alrt").focus()
                                }
                            }
                            return false
                        }).hover(h, e);
                        D = null
                    }
                    if (b.view) {
                        D = c("<td class='ui-pg-button ui-corner-all'></td>");
                        a = a || {};
                        c(D).append("<div class='ui-pg-div'><span class='ui-icon " + b.viewicon + "'></span>" + b.viewtext + "</div>");
                        c("tr", B).append(D);
                        c(D, B).attr({
                            title: b.viewtitle || "",
                            id: a.id || "view_" + C
                        }).click(function() {
                            if (!c(this).hasClass("ui-state-disabled")) {
                                var o = w.p.selrow;
                                if (o) {
                                    if (c.isFunction(b.viewfunc)) {
                                        b.viewfunc.call(w, o)
                                    } else {
                                        c(w).jqGrid("viewGridRow", o, a)
                                    }
                                } else {
                                    c.jgrid.viewModal("#" + z.themodal, {
                                        gbox: "#gbox_" + c.jgrid.jqID(w.p.id),
                                        jqm: true
                                    });
                                    c("#jqg_alrt").focus()
                                }
                            }
                            return false
                        }).hover(h, e);
                        D = null
                    }
                    if (b.del) {
                        D = c("<td class='ui-pg-button ui-corner-all'></td>");
                        m = m || {};
                        c(D).append("<div class='ui-pg-div'><span class='ui-icon " + b.delicon + "'></span>" + b.deltext + "</div>");
                        c("tr", B).append(D);
                        c(D, B).attr({
                            title: b.deltitle || "",
                            id: m.id || "del_" + C
                        }).click(function() {
                            if (!c(this).hasClass("ui-state-disabled")) {
                                var o;
                                if (w.p.multiselect) {
                                    o = w.p.selarrrow;
                                    if (o.length === 0) {
                                        o = null
                                    }
                                } else {
                                    o = w.p.selrow
                                }
                                if (o) {
                                    if (c.isFunction(b.delfunc)) {
                                        b.delfunc.call(w, o)
                                    } else {
                                        c(w).jqGrid("delGridRow", o, m)
                                    }
                                } else {
                                    c.jgrid.viewModal("#" + z.themodal, {
                                        gbox: "#gbox_" + c.jgrid.jqID(w.p.id),
                                        jqm: true
                                    });
                                    c("#jqg_alrt").focus()
                                }
                            }
                            return false
                        }).hover(h, e);
                        D = null
                    }
                    if (b.add || b.edit || b.del || b.view) {
                        c("tr", B).append(A)
                    }
                    if (b.search) {
                        D = c("<td class='ui-pg-button ui-corner-all'></td>");
                        n = n || {};
                        c(D).append("<div class='ui-pg-div'><span class='ui-icon " + b.searchicon + "'></span>" + b.searchtext + "</div>");
                        c("tr", B).append(D);
                        c(D, B).attr({
                            title: b.searchtitle || "",
                            id: n.id || "search_" + C
                        }).click(function() {
                            if (!c(this).hasClass("ui-state-disabled")) {
                                if (c.isFunction(b.searchfunc)) {
                                    b.searchfunc.call(w, n)
                                } else {
                                    c(w).jqGrid("searchGrid", n)
                                }
                            }
                            return false
                        }).hover(h, e);
                        if (n.showOnLoad && n.showOnLoad === true) {
                            c(D, B).click()
                        }
                        D = null
                    }
                    if (b.refresh) {
                        D = c("<td class='ui-pg-button ui-corner-all'></td>");
                        c(D).append("<div class='ui-pg-div'><span class='ui-icon " + b.refreshicon + "'></span>" + b.refreshtext + "</div>");
                        c("tr", B).append(D);
                        c(D, B).attr({
                            title: b.refreshtitle || "",
                            id: "refresh_" + C
                        }).click(function() {
                            if (!c(this).hasClass("ui-state-disabled")) {
                                if (c.isFunction(b.beforeRefresh)) {
                                    b.beforeRefresh.call(w)
                                }
                                w.p.search = false;
                                w.p.resetsearch = true;
                                try {
                                    var o = w.p.id;
                                    w.p.postData.filters = "";
                                    try {
                                        c("#fbox_" + c.jgrid.jqID(o)).jqFilter("resetFilter")
                                    } catch (p) {}
                                    if (c.isFunction(w.clearToolbar)) {
                                        w.clearToolbar.call(w, false)
                                    }
                                } catch (q) {}
                                switch (b.refreshstate) {
                                case "firstpage":
                                    c(w).trigger("reloadGrid", [{
                                        page: 1
                                    }]);
                                    break;
                                case "current":
                                    c(w).trigger("reloadGrid", [{
                                        current: true
                                    }]);
                                    break
                                }
                                if (c.isFunction(b.afterRefresh)) {
                                    b.afterRefresh.call(w)
                                }
                            }
                            return false
                        }).hover(h, e);
                        D = null
                    }
                    y = c(".ui-jqgrid").css("font-size") || "11px";
                    c("body").append("<div id='testpg2' class='ui-jqgrid ui-widget ui-widget-content' style='font-size:" + y + ";visibility:hidden;' ></div>");
                    g = c(B).clone().appendTo("#testpg2").width();
                    c("#testpg2").remove();
                    c(x + "_" + b.position, x).append(B);
                    if (w.p._nvtd) {
                        if (g > w.p._nvtd[0]) {
                            c(x + "_" + b.position, x).width(g);
                            w.p._nvtd[0] = g
                        }
                        w.p._nvtd[1] = g
                    }
                    y = null;
                    g = null;
                    B = null;
                    this.nav = true
                }
            })
        },
        navButtonAdd: function(b, a) {
            a = c.extend({
                caption: "newButton",
                title: "",
                buttonicon: "ui-icon-newwin",
                onClickButton: null,
                position: "last",
                cursor: "pointer"
            }, a || {});
            return this.each(function() {
                if (!this.grid) {
                    return
                }
                if (typeof b === "string" && b.indexOf("#") !== 0) {
                    b = "#" + c.jgrid.jqID(b)
                }
                var j = c(".navtable", b)[0]
                  , h = this;
                if (j) {
                    if (a.id && c("#" + c.jgrid.jqID(a.id), j)[0] !== undefined) {
                        return
                    }
                    var i = c("<td></td>");
                    if (a.buttonicon.toString().toUpperCase() === "NONE") {
                        c(i).addClass("ui-pg-button ui-corner-all").append("<div class='ui-pg-div'>" + a.caption + "</div>")
                    } else {
                        c(i).addClass("ui-pg-button ui-corner-all").append("<div class='ui-pg-div'><span class='ui-icon " + a.buttonicon + "'></span>" + a.caption + "</div>")
                    }
                    if (a.id) {
                        c(i).attr("id", a.id)
                    }
                    if (a.position === "first") {
                        if (j.rows[0].cells.length === 0) {
                            c("tr", j).append(i)
                        } else {
                            c("tr td:eq(0)", j).before(i)
                        }
                    } else {
                        c("tr", j).append(i)
                    }
                    c(i, j).attr("title", a.title || "").click(function(e) {
                        if (!c(this).hasClass("ui-state-disabled")) {
                            if (c.isFunction(a.onClickButton)) {
                                a.onClickButton.call(h, e)
                            }
                        }
                        return false
                    }).hover(function() {
                        if (!c(this).hasClass("ui-state-disabled")) {
                            c(this).addClass("ui-state-hover")
                        }
                    }, function() {
                        c(this).removeClass("ui-state-hover")
                    })
                }
            })
        },
        navSeparatorAdd: function(b, a) {
            a = c.extend({
                sepclass: "ui-separator",
                sepcontent: "",
                position: "last"
            }, a || {});
            return this.each(function() {
                if (!this.grid) {
                    return
                }
                if (typeof b === "string" && b.indexOf("#") !== 0) {
                    b = "#" + c.jgrid.jqID(b)
                }
                var g = c(".navtable", b)[0];
                if (g) {
                    var h = "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='" + a.sepclass + "'></span>" + a.sepcontent + "</td>";
                    if (a.position === "first") {
                        if (g.rows[0].cells.length === 0) {
                            c("tr", g).append(h)
                        } else {
                            c("tr td:eq(0)", g).before(h)
                        }
                    } else {
                        c("tr", g).append(h)
                    }
                }
            })
        },
        GridToForm: function(b, a) {
            return this.each(function() {
                var h = this, j;
                if (!h.grid) {
                    return
                }
                var i = c(h).jqGrid("getRowData", b);
                if (i) {
                    for (j in i) {
                        if (i.hasOwnProperty(j)) {
                            if (c("[name=" + c.jgrid.jqID(j) + "]", a).is("input:radio") || c("[name=" + c.jgrid.jqID(j) + "]", a).is("input:checkbox")) {
                                c("[name=" + c.jgrid.jqID(j) + "]", a).each(function() {
                                    if (c(this).val() == i[j]) {
                                        c(this)[h.p.useProp ? "prop" : "attr"]("checked", true)
                                    } else {
                                        c(this)[h.p.useProp ? "prop" : "attr"]("checked", false)
                                    }
                                })
                            } else {
                                c("[name=" + c.jgrid.jqID(j) + "]", a).val(i[j])
                            }
                        }
                    }
                }
            })
        },
        FormToGrid: function(g, b, a, h) {
            return this.each(function() {
                var e = this;
                if (!e.grid) {
                    return
                }
                if (!a) {
                    a = "set"
                }
                if (!h) {
                    h = "first"
                }
                var j = c(b).serializeArray();
                var f = {};
                c.each(j, function(l, i) {
                    f[i.name] = i.value
                });
                if (a === "add") {
                    c(e).jqGrid("addRowData", g, f, h)
                } else {
                    if (a === "set") {
                        c(e).jqGrid("setRowData", g, f)
                    }
                }
            })
        }
    })
}
)(jQuery);
(function(b) {
    b.jgrid.inlineEdit = b.jgrid.inlineEdit || {};
    b.jgrid.extend({
        editRow: function(u, a, m, r, v, q, s, p, o) {
            var t = {}
              , n = b.makeArray(arguments).slice(1);
            if (b.type(n[0]) === "object") {
                t = n[0]
            } else {
                if (a !== undefined) {
                    t.keys = a
                }
                if (b.isFunction(m)) {
                    t.oneditfunc = m
                }
                if (b.isFunction(r)) {
                    t.successfunc = r
                }
                if (v !== undefined) {
                    t.url = v
                }
                if (q !== undefined) {
                    t.extraparam = q
                }
                if (b.isFunction(s)) {
                    t.aftersavefunc = s
                }
                if (b.isFunction(p)) {
                    t.errorfunc = p
                }
                if (b.isFunction(o)) {
                    t.afterrestorefunc = o
                }
            }
            t = b.extend(true, {
                keys: false,
                oneditfunc: null,
                successfunc: null,
                url: null,
                extraparam: {},
                aftersavefunc: null,
                errorfunc: null,
                afterrestorefunc: null,
                restoreAfterError: true,
                mtype: "POST"
            }, b.jgrid.inlineEdit, t);
            return this.each(function() {
                var e = this, i, d, g, f = 0, j = null, k = {}, h, l, c;
                if (!e.grid) {
                    return
                }
                h = b(e).jqGrid("getInd", u, true);
                if (h === false) {
                    return
                }
                c = b.isFunction(t.beforeEditRow) ? t.beforeEditRow.call(e, t, u) : undefined;
                if (c === undefined) {
                    c = true
                }
                if (!c) {
                    return
                }
                g = b(h).attr("editable") || "0";
                if (g === "0" && !b(h).hasClass("not-editable-row")) {
                    l = e.p.colModel;
                    b('td[role="gridcell"]', h).each(function(E) {
                        i = l[E].name;
                        var F = e.p.treeGrid === true && i === e.p.ExpandColumn;
                        if (F) {
                            d = b("span:first", this).html()
                        } else {
                            try {
                                d = b.unformat.call(e, this, {
                                    rowId: u,
                                    colModel: l[E]
                                }, E)
                            } catch (D) {
                                d = (l[E].edittype && l[E].edittype === "textarea") ? b(this).text() : b(this).html()
                            }
                        }
                        if (i !== "cb" && i !== "subgrid" && i !== "rn") {
                            if (e.p.autoencode) {
                                d = b.jgrid.htmlDecode(d)
                            }
                            k[i] = d;
                            if (l[E].editable === true) {
                                if (j === null) {
                                    j = E
                                }
                                if (F) {
                                    b("span:first", this).html("")
                                } else {
                                    b(this).html("")
                                }
                                var C = b.extend({}, l[E].editoptions || {}, {
                                    id: u + "_" + i,
                                    name: i
                                });
                                if (!l[E].edittype) {
                                    l[E].edittype = "text"
                                }
                                if (d === "&nbsp;" || d === "&#160;" || (d.length === 1 && d.charCodeAt(0) === 160)) {
                                    d = ""
                                }
                                var B = b.jgrid.createEl.call(e, l[E].edittype, C, d, true, b.extend({}, b.jgrid.ajaxOptions, e.p.ajaxSelectOptions || {}));
                                b(B).addClass("editable");
                                if (F) {
                                    b("span:first", this).append(B)
                                } else {
                                    b(this).append(B)
                                }
                                b.jgrid.bindEv.call(e, B, C);
                                if (l[E].edittype === "select" && l[E].editoptions !== undefined && l[E].editoptions.multiple === true && l[E].editoptions.dataUrl === undefined && b.jgrid.msie) {
                                    b(B).width(b(B).width())
                                }
                                f++
                            }
                        }
                    });
                    if (f > 0) {
                        k.id = u;
                        e.p.savedRow.push(k);
                        b(h).attr("editable", "1");
                        setTimeout(function() {
                            b("td:eq(" + j + ") input", h).focus()
                        }, 0);
                        if (t.keys === true) {
                            b(h).bind("keydown", function(A) {
                                if (A.keyCode === 27) {
                                    b(e).jqGrid("restoreRow", u, t.afterrestorefunc);
                                    if (e.p._inlinenav) {
                                        try {
                                            b(e).jqGrid("showAddEditButtons")
                                        } catch (C) {}
                                    }
                                    return false
                                }
                                if (A.keyCode === 13) {
                                    var B = A.target;
                                    if (B.tagName === "TEXTAREA") {
                                        return true
                                    }
                                    if (b(e).jqGrid("saveRow", u, t)) {
                                        if (e.p._inlinenav) {
                                            try {
                                                b(e).jqGrid("showAddEditButtons")
                                            } catch (D) {}
                                        }
                                    }
                                    return false
                                }
                            })
                        }
                        b(e).triggerHandler("jqGridInlineEditRow", [u, t]);
                        if (b.isFunction(t.oneditfunc)) {
                            t.oneditfunc.call(e, u)
                        }
                    }
                }
            })
        },
        saveRow: function(ab, ae, ag, af, R, U, ak) {
            var ai = b.makeArray(arguments).slice(1)
              , V = {};
            if (b.type(ai[0]) === "object") {
                V = ai[0]
            } else {
                if (b.isFunction(ae)) {
                    V.successfunc = ae
                }
                if (ag !== undefined) {
                    V.url = ag
                }
                if (af !== undefined) {
                    V.extraparam = af
                }
                if (b.isFunction(R)) {
                    V.aftersavefunc = R
                }
                if (b.isFunction(U)) {
                    V.errorfunc = U
                }
                if (b.isFunction(ak)) {
                    V.afterrestorefunc = ak
                }
            }
            V = b.extend(true, {
                successfunc: null,
                url: null,
                extraparam: {},
                aftersavefunc: null,
                errorfunc: null,
                afterrestorefunc: null,
                restoreAfterError: true,
                mtype: "POST"
            }, b.jgrid.inlineEdit, V);
            var X = false;
            var L = this[0], aj, e = {}, W = {}, Z = {}, T, ac, ah, o;
            if (!L.grid) {
                return X
            }
            o = b(L).jqGrid("getInd", ab, true);
            if (o === false) {
                return X
            }
            var P = b.isFunction(V.beforeSaveRow) ? V.beforeSaveRow.call(L, V, ab) : undefined;
            if (P === undefined) {
                P = true
            }
            if (!P) {
                return
            }
            T = b(o).attr("editable");
            V.url = V.url || L.p.editurl;
            if (T === "1") {
                var O;
                b('td[role="gridcell"]', o).each(function(g) {
                    O = L.p.colModel[g];
                    aj = O.name;
                    if (aj !== "cb" && aj !== "subgrid" && O.editable === true && aj !== "rn" && !b(this).hasClass("not-editable-cell")) {
                        switch (O.edittype) {
                        case "checkbox":
                            var d = ["Yes", "No"];
                            if (O.editoptions) {
                                d = O.editoptions.value.split(":")
                            }
                            e[aj] = b("input", this).is(":checked") ? d[0] : d[1];
                            break;
                        case "text":
                        case "password":
                        case "textarea":
                        case "button":
                            e[aj] = b("input, textarea", this).val();
                            break;
                        case "select":
                            if (!O.editoptions.multiple) {
                                e[aj] = b("select option:selected", this).val();
                                W[aj] = b("select option:selected", this).text()
                            } else {
                                var c = b("select", this)
                                  , f = [];
                                e[aj] = b(c).val();
                                if (e[aj]) {
                                    e[aj] = e[aj].join(",")
                                } else {
                                    e[aj] = ""
                                }
                                b("select option:selected", this).each(function(l, j) {
                                    f[l] = b(j).text()
                                });
                                W[aj] = f.join(",")
                            }
                            if (O.formatter && O.formatter === "select") {
                                W = {}
                            }
                            break;
                        case "custom":
                            try {
                                if (O.editoptions && b.isFunction(O.editoptions.custom_value)) {
                                    e[aj] = O.editoptions.custom_value.call(L, b(".customelement", this), "get");
                                    if (e[aj] === undefined) {
                                        throw "e2"
                                    }
                                } else {
                                    throw "e1"
                                }
                            } catch (h) {
                                if (h === "e1") {
                                    b.jgrid.info_dialog(b.jgrid.errors.errcap, "function 'custom_value' " + b.jgrid.edit.msg.nodefined, b.jgrid.edit.bClose)
                                }
                                if (h === "e2") {
                                    b.jgrid.info_dialog(b.jgrid.errors.errcap, "function 'custom_value' " + b.jgrid.edit.msg.novalue, b.jgrid.edit.bClose)
                                } else {
                                    b.jgrid.info_dialog(b.jgrid.errors.errcap, h.message, b.jgrid.edit.bClose)
                                }
                            }
                            break
                        }
                        ah = b.jgrid.checkValues.call(L, e[aj], g);
                        if (ah[0] === false) {
                            return false
                        }
                        if (L.p.autoencode) {
                            e[aj] = b.jgrid.htmlEncode(e[aj])
                        }
                        if (V.url !== "clientArray" && O.editoptions && O.editoptions.NullIfEmpty === true) {
                            if (e[aj] === "") {
                                Z[aj] = "null"
                            }
                        }
                    }
                });
                if (ah[0] === false) {
                    try {
                        var al = b(L).jqGrid("getGridRowById", ab)
                          , S = b.jgrid.findPos(al);
                        b.jgrid.info_dialog(b.jgrid.errors.errcap, ah[1], b.jgrid.edit.bClose, {
                            left: S[0],
                            top: S[1] + b(al).outerHeight()
                        })
                    } catch (k) {
                        alert(ah[1])
                    }
                    return X
                }
                var a, N = L.p.prmNames, Y = ab;
                if (L.p.keyIndex === false) {
                    a = N.id
                } else {
                    a = L.p.colModel[L.p.keyIndex + (L.p.rownumbers === true ? 1 : 0) + (L.p.multiselect === true ? 1 : 0) + (L.p.subGrid === true ? 1 : 0)].name
                }
                if (e) {
                    e[N.oper] = N.editoper;
                    if (e[a] === undefined || e[a] === "") {
                        e[a] = ab
                    } else {
                        if (o.id !== L.p.idPrefix + e[a]) {
                            var i = b.jgrid.stripPref(L.p.idPrefix, ab);
                            if (L.p._index[i] !== undefined) {
                                L.p._index[e[a]] = L.p._index[i];
                                delete L.p._index[i]
                            }
                            ab = L.p.idPrefix + e[a];
                            b(o).attr("id", ab);
                            if (L.p.selrow === Y) {
                                L.p.selrow = ab
                            }
                            if (b.isArray(L.p.selarrrow)) {
                                var M = b.inArray(Y, L.p.selarrrow);
                                if (M >= 0) {
                                    L.p.selarrrow[M] = ab
                                }
                            }
                            if (L.p.multiselect) {
                                var ad = "jqg_" + L.p.id + "_" + ab;
                                b("input.cbox", o).attr("id", ad).attr("name", ad)
                            }
                        }
                    }
                    if (L.p.inlineData === undefined) {
                        L.p.inlineData = {}
                    }
                    e = b.extend({}, e, L.p.inlineData, V.extraparam)
                }
                if (V.url === "clientArray") {
                    e = b.extend({}, e, W);
                    if (L.p.autoencode) {
                        b.each(e, function(c, d) {
                            e[c] = b.jgrid.htmlDecode(d)
                        })
                    }
                    var Q, aa = b(L).jqGrid("setRowData", ab, e);
                    b(o).attr("editable", "0");
                    for (Q = 0; Q < L.p.savedRow.length; Q++) {
                        if (String(L.p.savedRow[Q].id) === String(Y)) {
                            ac = Q;
                            break
                        }
                    }
                    if (ac >= 0) {
                        L.p.savedRow.splice(ac, 1)
                    }
                    b(L).triggerHandler("jqGridInlineAfterSaveRow", [ab, aa, e, V]);
                    if (b.isFunction(V.aftersavefunc)) {
                        V.aftersavefunc.call(L, ab, aa, V)
                    }
                    X = true;
                    b(o).removeClass("jqgrid-new-row").unbind("keydown")
                } else {
                    b("#lui_" + b.jgrid.jqID(L.p.id)).show();
                    Z = b.extend({}, e, Z);
                    Z[a] = b.jgrid.stripPref(L.p.idPrefix, Z[a]);
                    b.ajax(b.extend({
                        url: V.url,
                        data: b.isFunction(L.p.serializeRowData) ? L.p.serializeRowData.call(L, Z) : Z,
                        type: V.mtype,
                        async: false,
                        complete: function(g, c) {
                            b("#lui_" + b.jgrid.jqID(L.p.id)).hide();
                            if (c === "success") {
                                var d = true, h, f;
                                h = b(L).triggerHandler("jqGridInlineSuccessSaveRow", [g, ab, V]);
                                if (!b.isArray(h)) {
                                    h = [true, e]
                                }
                                if (h[0] && b.isFunction(V.successfunc)) {
                                    h = V.successfunc.call(L, g)
                                }
                                if (b.isArray(h)) {
                                    d = h[0];
                                    e = h[1] || e
                                } else {
                                    d = h
                                }
                                if (d === true) {
                                    if (L.p.autoencode) {
                                        b.each(e, function(l, j) {
                                            e[l] = b.jgrid.htmlDecode(j)
                                        })
                                    }
                                    e = b.extend({}, e, W);
                                    b(L).jqGrid("setRowData", ab, e);
                                    b(o).attr("editable", "0");
                                    for (f = 0; f < L.p.savedRow.length; f++) {
                                        if (String(L.p.savedRow[f].id) === String(ab)) {
                                            ac = f;
                                            break
                                        }
                                    }
                                    if (ac >= 0) {
                                        L.p.savedRow.splice(ac, 1)
                                    }
                                    b(L).triggerHandler("jqGridInlineAfterSaveRow", [ab, g, e, V]);
                                    if (b.isFunction(V.aftersavefunc)) {
                                        V.aftersavefunc.call(L, ab, g)
                                    }
                                    X = true;
                                    b(o).removeClass("jqgrid-new-row").unbind("keydown")
                                } else {
                                    b(L).triggerHandler("jqGridInlineErrorSaveRow", [ab, g, c, null, V]);
                                    if (b.isFunction(V.errorfunc)) {
                                        V.errorfunc.call(L, ab, g, c, null)
                                    }
                                    if (V.restoreAfterError === true) {
                                        b(L).jqGrid("restoreRow", ab, V.afterrestorefunc)
                                    }
                                }
                            }
                        },
                        error: function(d, g, c) {
                            b("#lui_" + b.jgrid.jqID(L.p.id)).hide();
                            b(L).triggerHandler("jqGridInlineErrorSaveRow", [ab, d, g, c, V]);
                            if (b.isFunction(V.errorfunc)) {
                                V.errorfunc.call(L, ab, d, g, c)
                            } else {
                                var f = d.responseText || d.statusText;
                                try {
                                    b.jgrid.info_dialog(b.jgrid.errors.errcap, '<div class="ui-state-error">' + f + "</div>", b.jgrid.edit.bClose, {
                                        buttonalign: "right"
                                    })
                                } catch (h) {
                                    alert(f)
                                }
                            }
                            if (V.restoreAfterError === true) {
                                b(L).jqGrid("restoreRow", ab, V.afterrestorefunc)
                            }
                        }
                    }, b.jgrid.ajaxOptions, L.p.ajaxRowOptions || {}))
                }
            }
            return X
        },
        restoreRow: function(g, a) {
            var h = b.makeArray(arguments).slice(1)
              , f = {};
            if (b.type(h[0]) === "object") {
                f = h[0]
            } else {
                if (b.isFunction(a)) {
                    f.afterrestorefunc = a
                }
            }
            f = b.extend(true, {}, b.jgrid.inlineEdit, f);
            return this.each(function() {
                var c = this, p = -1, n, d = {}, o;
                if (!c.grid) {
                    return
                }
                n = b(c).jqGrid("getInd", g, true);
                if (n === false) {
                    return
                }
                var e = b.isFunction(f.beforeCancelRow) ? f.beforeCancelRow.call(c, f, sr) : undefined;
                if (e === undefined) {
                    e = true
                }
                if (!e) {
                    return
                }
                for (o = 0; o < c.p.savedRow.length; o++) {
                    if (String(c.p.savedRow[o].id) === String(g)) {
                        p = o;
                        break
                    }
                }
                if (p >= 0) {
                    if (b.isFunction(b.fn.datepicker)) {
                        try {
                            b("input.hasDatepicker", "#" + b.jgrid.jqID(n.id)).datepicker("hide")
                        } catch (k) {}
                    }
                    b.each(c.p.colModel, function() {
                        if (this.editable === true && c.p.savedRow[p].hasOwnProperty(this.name)) {
                            d[this.name] = c.p.savedRow[p][this.name]
                        }
                    });
                    b(c).jqGrid("setRowData", g, d);
                    b(n).attr("editable", "0").unbind("keydown");
                    c.p.savedRow.splice(p, 1);
                    if (b("#" + b.jgrid.jqID(g), "#" + b.jgrid.jqID(c.p.id)).hasClass("jqgrid-new-row")) {
                        setTimeout(function() {
                            b(c).jqGrid("delRowData", g);
                            b(c).jqGrid("showAddEditButtons")
                        }, 0)
                    }
                }
                b(c).triggerHandler("jqGridInlineAfterRestoreRow", [g]);
                if (b.isFunction(f.afterrestorefunc)) {
                    f.afterrestorefunc.call(c, g)
                }
            })
        },
        addRow: function(a) {
            a = b.extend(true, {
                rowID: null,
                initdata: {},
                position: "first",
                useDefValues: true,
                useFormatter: false,
                addRowParams: {
                    extraparam: {}
                }
            }, a || {});
            return this.each(function() {
                if (!this.grid) {
                    return
                }
                var g = this;
                var j = b.isFunction(a.beforeAddRow) ? a.beforeAddRow.call(g, a.addRowParams) : undefined;
                if (j === undefined) {
                    j = true
                }
                if (!j) {
                    return
                }
                a.rowID = b.isFunction(a.rowID) ? a.rowID.call(g, a) : ((a.rowID != null) ? a.rowID : b.jgrid.randId());
                if (a.useDefValues === true) {
                    b(g.p.colModel).each(function() {
                        if (this.editoptions && this.editoptions.defaultValue) {
                            var c = this.editoptions.defaultValue
                              , d = b.isFunction(c) ? c.call(g) : c;
                            a.initdata[this.name] = d
                        }
                    })
                }
                b(g).jqGrid("addRowData", a.rowID, a.initdata, a.position);
                a.rowID = g.p.idPrefix + a.rowID;
                b("#" + b.jgrid.jqID(a.rowID), "#" + b.jgrid.jqID(g.p.id)).addClass("jqgrid-new-row");
                if (a.useFormatter) {
                    b("#" + b.jgrid.jqID(a.rowID) + " .ui-inline-edit", "#" + b.jgrid.jqID(g.p.id)).click()
                } else {
                    var i = g.p.prmNames
                      , h = i.oper;
                    a.addRowParams.extraparam[h] = i.addoper;
                    b(g).jqGrid("editRow", a.rowID, a.addRowParams);
                    b(g).jqGrid("setSelection", a.rowID)
                }
            })
        },
        inlineNav: function(a, d) {
            d = b.extend(true, {
                edit: true,
                editicon: "ui-icon-pencil",
                add: true,
                addicon: "ui-icon-plus",
                save: true,
                saveicon: "ui-icon-disk",
                cancel: true,
                cancelicon: "ui-icon-cancel",
                addParams: {
                    addRowParams: {
                        extraparam: {}
                    }
                },
                editParams: {},
                restoreAfterSelect: true
            }, b.jgrid.nav, d || {});
            return this.each(function() {
                if (!this.grid) {
                    return
                }
                var c = this, o, l = b.jgrid.jqID(c.p.id);
                c.p._inlinenav = true;
                if (d.addParams.useFormatter === true) {
                    var p = c.p.colModel, m;
                    for (m = 0; m < p.length; m++) {
                        if (p[m].formatter && p[m].formatter === "actions") {
                            if (p[m].formatoptions) {
                                var i = {
                                    keys: false,
                                    onEdit: null,
                                    onSuccess: null,
                                    afterSave: null,
                                    onError: null,
                                    afterRestore: null,
                                    extraparam: {},
                                    url: null
                                }
                                  , n = b.extend(i, p[m].formatoptions);
                                d.addParams.addRowParams = {
                                    keys: n.keys,
                                    oneditfunc: n.onEdit,
                                    successfunc: n.onSuccess,
                                    url: n.url,
                                    extraparam: n.extraparam,
                                    aftersavefunc: n.afterSave,
                                    errorfunc: n.onError,
                                    afterrestorefunc: n.afterRestore
                                }
                            }
                            break
                        }
                    }
                }
                if (d.add) {
                    b(c).jqGrid("navButtonAdd", a, {
                        caption: d.addtext,
                        title: d.addtitle,
                        buttonicon: d.addicon,
                        id: c.p.id + "_iladd",
                        onClickButton: function() {
                            b(c).jqGrid("addRow", d.addParams);
                            if (!d.addParams.useFormatter) {
                                b("#" + l + "_ilsave").removeClass("ui-state-disabled");
                                b("#" + l + "_ilcancel").removeClass("ui-state-disabled");
                                b("#" + l + "_iladd").addClass("ui-state-disabled");
                                b("#" + l + "_iledit").addClass("ui-state-disabled")
                            }
                        }
                    })
                }
                if (d.edit) {
                    b(c).jqGrid("navButtonAdd", a, {
                        caption: d.edittext,
                        title: d.edittitle,
                        buttonicon: d.editicon,
                        id: c.p.id + "_iledit",
                        onClickButton: function() {
                            var e = b(c).jqGrid("getGridParam", "selrow");
                            if (e) {
                                b(c).jqGrid("editRow", e, d.editParams);
                                b("#" + l + "_ilsave").removeClass("ui-state-disabled");
                                b("#" + l + "_ilcancel").removeClass("ui-state-disabled");
                                b("#" + l + "_iladd").addClass("ui-state-disabled");
                                b("#" + l + "_iledit").addClass("ui-state-disabled")
                            } else {
                                b.jgrid.viewModal("#alertmod", {
                                    gbox: "#gbox_" + l,
                                    jqm: true
                                });
                                b("#jqg_alrt").focus()
                            }
                        }
                    })
                }
                if (d.save) {
                    b(c).jqGrid("navButtonAdd", a, {
                        caption: d.savetext || "",
                        title: d.savetitle || "Save row",
                        buttonicon: d.saveicon,
                        id: c.p.id + "_ilsave",
                        onClickButton: function() {
                            var f = c.p.savedRow[0].id;
                            if (f) {
                                var g = c.p.prmNames
                                  , h = g.oper
                                  , e = d.editParams;
                                if (b("#" + b.jgrid.jqID(f), "#" + l).hasClass("jqgrid-new-row")) {
                                    d.addParams.addRowParams.extraparam[h] = g.addoper;
                                    e = d.addParams.addRowParams
                                } else {
                                    if (!d.editParams.extraparam) {
                                        d.editParams.extraparam = {}
                                    }
                                    d.editParams.extraparam[h] = g.editoper
                                }
                                if (b(c).jqGrid("saveRow", f, e)) {
                                    b(c).jqGrid("showAddEditButtons")
                                }
                            } else {
                                b.jgrid.viewModal("#alertmod", {
                                    gbox: "#gbox_" + l,
                                    jqm: true
                                });
                                b("#jqg_alrt").focus()
                            }
                        }
                    });
                    b("#" + l + "_ilsave").addClass("ui-state-disabled")
                }
                if (d.cancel) {
                    b(c).jqGrid("navButtonAdd", a, {
                        caption: d.canceltext || "",
                        title: d.canceltitle || "Cancel row editing",
                        buttonicon: d.cancelicon,
                        id: c.p.id + "_ilcancel",
                        onClickButton: function() {
                            var e = c.p.savedRow[0].id
                              , f = d.editParams;
                            if (e) {
                                if (b("#" + b.jgrid.jqID(e), "#" + l).hasClass("jqgrid-new-row")) {
                                    f = d.addParams.addRowParams
                                }
                                b(c).jqGrid("restoreRow", e, f);
                                b(c).jqGrid("showAddEditButtons")
                            } else {
                                b.jgrid.viewModal("#alertmod", {
                                    gbox: "#gbox_" + l,
                                    jqm: true
                                });
                                b("#jqg_alrt").focus()
                            }
                        }
                    });
                    b("#" + l + "_ilcancel").addClass("ui-state-disabled")
                }
                if (d.restoreAfterSelect === true) {
                    if (b.isFunction(c.p.beforeSelectRow)) {
                        o = c.p.beforeSelectRow
                    } else {
                        o = false
                    }
                    c.p.beforeSelectRow = function(e, f) {
                        var g = true;
                        if (c.p.savedRow.length > 0 && c.p._inlinenav === true && (e !== c.p.selrow && c.p.selrow !== null)) {
                            if (c.p.selrow === d.addParams.rowID) {
                                b(c).jqGrid("delRowData", c.p.selrow)
                            } else {
                                b(c).jqGrid("restoreRow", c.p.selrow, d.editParams)
                            }
                            b(c).jqGrid("showAddEditButtons")
                        }
                        if (o) {
                            g = o.call(c, e, f)
                        }
                        return g
                    }
                }
            })
        },
        showAddEditButtons: function() {
            return this.each(function() {
                if (!this.grid) {
                    return
                }
                var a = b.jgrid.jqID(this.p.id);
                b("#" + a + "_ilsave").addClass("ui-state-disabled");
                b("#" + a + "_ilcancel").addClass("ui-state-disabled");
                b("#" + a + "_iladd").removeClass("ui-state-disabled");
                b("#" + a + "_iledit").removeClass("ui-state-disabled")
            })
        }
    })
}
)(jQuery);
(function(b) {
    b.jgrid.extend({
        editCell: function(e, f, a) {
            return this.each(function() {
                var p = this, c, o, r, n;
                if (!p.grid || p.p.cellEdit !== true) {
                    return
                }
                f = parseInt(f, 10);
                p.p.selrow = p.rows[e].id;
                if (!p.p.knv) {
                    b(p).jqGrid("GridNav")
                }
                if (p.p.savedRow.length > 0) {
                    if (a === true) {
                        if (e == p.p.iRow && f == p.p.iCol) {
                            return
                        }
                    }
                    b(p).jqGrid("saveCell", p.p.savedRow[0].id, p.p.savedRow[0].ic)
                } else {
                    window.setTimeout(function() {
                        b("#" + b.jgrid.jqID(p.p.knv)).attr("tabindex", "-1").focus()
                    }, 0)
                }
                n = p.p.colModel[f];
                c = n.name;
                if (c === "subgrid" || c === "cb" || c === "rn") {
                    return
                }
                r = b("td:eq(" + f + ")", p.rows[e]);
                if (n.editable === true && a === true && !r.hasClass("not-editable-cell")) {
                    if (parseInt(p.p.iCol, 10) >= 0 && parseInt(p.p.iRow, 10) >= 0) {
                        b("td:eq(" + p.p.iCol + ")", p.rows[p.p.iRow]).removeClass("edit-cell ui-state-highlight");
                        b(p.rows[p.p.iRow]).removeClass("selected-row ui-state-hover")
                    }
                    b(r).addClass("edit-cell ui-state-highlight");
                    b(p.rows[e]).addClass("selected-row ui-state-hover");
                    try {
                        o = b.unformat.call(p, r, {
                            rowId: p.rows[e].id,
                            colModel: n
                        }, f)
                    } catch (d) {
                        o = (n.edittype && n.edittype === "textarea") ? b(r).text() : b(r).html()
                    }
                    if (p.p.autoencode) {
                        o = b.jgrid.htmlDecode(o)
                    }
                    if (!n.edittype) {
                        n.edittype = "text"
                    }
                    p.p.savedRow.push({
                        id: e,
                        ic: f,
                        name: c,
                        v: o
                    });
                    if (o === "&nbsp;" || o === "&#160;" || (o.length === 1 && o.charCodeAt(0) === 160)) {
                        o = ""
                    }
                    if (b.isFunction(p.p.formatCell)) {
                        var q = p.p.formatCell.call(p, p.rows[e].id, c, o, e, f);
                        if (q !== undefined) {
                            o = q
                        }
                    }
                    b(p).triggerHandler("jqGridBeforeEditCell", [p.rows[e].id, c, o, e, f]);
                    if (b.isFunction(p.p.beforeEditCell)) {
                        p.p.beforeEditCell.call(p, p.rows[e].id, c, o, e, f)
                    }
                    var s = b.extend({}, n.editoptions || {}, {
                        id: e + "_" + c,
                        name: c
                    });
                    var t = b.jgrid.createEl.call(p, n.edittype, s, o, true, b.extend({}, b.jgrid.ajaxOptions, p.p.ajaxSelectOptions || {}));
                    b(r).html("").append(t).attr("tabindex", "0");
                    b.jgrid.bindEv.call(p, t, s);
                    window.setTimeout(function() {
                        b(t).focus()
                    }, 0);
                    b("input, select, textarea", r).bind("keydown", function(g) {
                        if (g.keyCode === 27) {
                            if (b("input.hasDatepicker", r).length > 0) {
                                if (b(".ui-datepicker").is(":hidden")) {
                                    b(p).jqGrid("restoreCell", e, f)
                                } else {
                                    b("input.hasDatepicker", r).datepicker("hide")
                                }
                            } else {
                                b(p).jqGrid("restoreCell", e, f)
                            }
                        }
                        if (g.keyCode === 13) {
                            b(p).jqGrid("saveCell", e, f);
                            return false
                        }
                        if (g.keyCode === 9) {
                            if (!p.grid.hDiv.loading) {
                                if (g.shiftKey) {
                                    b(p).jqGrid("prevCell", e, f)
                                } else {
                                    b(p).jqGrid("nextCell", e, f)
                                }
                            } else {
                                return false
                            }
                        }
                        g.stopPropagation()
                    });
                    b(p).triggerHandler("jqGridAfterEditCell", [p.rows[e].id, c, o, e, f]);
                    if (b.isFunction(p.p.afterEditCell)) {
                        p.p.afterEditCell.call(p, p.rows[e].id, c, o, e, f)
                    }
                } else {
                    if (parseInt(p.p.iCol, 10) >= 0 && parseInt(p.p.iRow, 10) >= 0) {
                        b("td:eq(" + p.p.iCol + ")", p.rows[p.p.iRow]).removeClass("edit-cell ui-state-highlight");
                        b(p.rows[p.p.iRow]).removeClass("selected-row ui-state-hover")
                    }
                    r.addClass("edit-cell ui-state-highlight");
                    b(p.rows[e]).addClass("selected-row ui-state-hover");
                    o = r.html().replace(/\&#160\;/ig, "");
                    b(p).triggerHandler("jqGridSelectCell", [p.rows[e].id, c, o, e, f]);
                    if (b.isFunction(p.p.onSelectCell)) {
                        p.p.onSelectCell.call(p, p.rows[e].id, c, o, e, f)
                    }
                }
                p.p.iCol = f;
                p.p.iRow = e
            })
        },
        saveCell: function(d, a) {
            return this.each(function() {
                var z = this, M;
                if (!z.grid || z.p.cellEdit !== true) {
                    return
                }
                if (z.p.savedRow.length >= 1) {
                    M = 0
                } else {
                    M = null
                }
                if (M !== null) {
                    var E = b("td:eq(" + a + ")", z.rows[d]), G, P, K = z.p.colModel[a], O = K.name, L = b.jgrid.jqID(O);
                    switch (K.edittype) {
                    case "select":
                        if (!K.editoptions.multiple) {
                            G = b("#" + d + "_" + L + " option:selected", z.rows[d]).val();
                            P = b("#" + d + "_" + L + " option:selected", z.rows[d]).text()
                        } else {
                            var A = b("#" + d + "_" + L, z.rows[d])
                              , B = [];
                            G = b(A).val();
                            if (G) {
                                G.join(",")
                            } else {
                                G = ""
                            }
                            b("option:selected", A).each(function(g, f) {
                                B[g] = b(f).text()
                            });
                            P = B.join(",")
                        }
                        if (K.formatter) {
                            P = G
                        }
                        break;
                    case "checkbox":
                        var D = ["Yes", "No"];
                        if (K.editoptions) {
                            D = K.editoptions.value.split(":")
                        }
                        G = b("#" + d + "_" + L, z.rows[d]).is(":checked") ? D[0] : D[1];
                        P = G;
                        break;
                    case "password":
                    case "text":
                    case "textarea":
                    case "button":
                        G = b("#" + d + "_" + L, z.rows[d]).val();
                        P = G;
                        break;
                    case "custom":
                        try {
                            if (K.editoptions && b.isFunction(K.editoptions.custom_value)) {
                                G = K.editoptions.custom_value.call(z, b(".customelement", E), "get");
                                if (G === undefined) {
                                    throw "e2"
                                } else {
                                    P = G
                                }
                            } else {
                                throw "e1"
                            }
                        } catch (v) {
                            if (v === "e1") {
                                b.jgrid.info_dialog(b.jgrid.errors.errcap, "function 'custom_value' " + b.jgrid.edit.msg.nodefined, b.jgrid.edit.bClose)
                            }
                            if (v === "e2") {
                                b.jgrid.info_dialog(b.jgrid.errors.errcap, "function 'custom_value' " + b.jgrid.edit.msg.novalue, b.jgrid.edit.bClose)
                            } else {
                                b.jgrid.info_dialog(b.jgrid.errors.errcap, v.message, b.jgrid.edit.bClose)
                            }
                        }
                        break
                    }
                    if (P !== z.p.savedRow[M].v) {
                        var c = b(z).triggerHandler("jqGridBeforeSaveCell", [z.rows[d].id, O, G, d, a]);
                        if (c) {
                            G = c;
                            P = c
                        }
                        if (b.isFunction(z.p.beforeSaveCell)) {
                            var C = z.p.beforeSaveCell.call(z, z.rows[d].id, O, G, d, a);
                            if (C) {
                                G = C;
                                P = C
                            }
                        }
                        var N = b.jgrid.checkValues.call(z, G, a);
                        if (N[0] === true) {
                            var I = b(z).triggerHandler("jqGridBeforeSubmitCell", [z.rows[d].id, O, G, d, a]) || {};
                            if (b.isFunction(z.p.beforeSubmitCell)) {
                                I = z.p.beforeSubmitCell.call(z, z.rows[d].id, O, G, d, a);
                                if (!I) {
                                    I = {}
                                }
                            }
                            if (b("input.hasDatepicker", E).length > 0) {
                                b("input.hasDatepicker", E).datepicker("hide")
                            }
                            if (z.p.cellsubmit === "remote") {
                                if (z.p.cellurl) {
                                    var e = {};
                                    if (z.p.autoencode) {
                                        G = b.jgrid.htmlEncode(G)
                                    }
                                    e[O] = G;
                                    var F, H, J;
                                    J = z.p.prmNames;
                                    F = J.id;
                                    H = J.oper;
                                    e[F] = b.jgrid.stripPref(z.p.idPrefix, z.rows[d].id);
                                    e[H] = J.editoper;
                                    e = b.extend(I, e);
                                    b("#lui_" + b.jgrid.jqID(z.p.id)).show();
                                    z.grid.hDiv.loading = true;
                                    b.ajax(b.extend({
                                        url: z.p.cellurl,
                                        data: b.isFunction(z.p.serializeCellData) ? z.p.serializeCellData.call(z, e) : e,
                                        type: "POST",
                                        complete: function(g, h) {
                                            b("#lui_" + z.p.id).hide();
                                            z.grid.hDiv.loading = false;
                                            if (h === "success") {
                                                var f = b(z).triggerHandler("jqGridAfterSubmitCell", [z, g, e.id, O, G, d, a]) || [true, ""];
                                                if (f[0] === true && b.isFunction(z.p.afterSubmitCell)) {
                                                    f = z.p.afterSubmitCell.call(z, g, e.id, O, G, d, a)
                                                }
                                                if (f[0] === true) {
                                                    b(E).empty();
                                                    b(z).jqGrid("setCell", z.rows[d].id, a, P, false, false, true);
                                                    b(E).addClass("dirty-cell");
                                                    b(z.rows[d]).addClass("edited");
                                                    b(z).triggerHandler("jqGridAfterSaveCell", [z.rows[d].id, O, G, d, a]);
                                                    if (b.isFunction(z.p.afterSaveCell)) {
                                                        z.p.afterSaveCell.call(z, z.rows[d].id, O, G, d, a)
                                                    }
                                                    z.p.savedRow.splice(0, 1)
                                                } else {
                                                    b.jgrid.info_dialog(b.jgrid.errors.errcap, f[1], b.jgrid.edit.bClose);
                                                    b(z).jqGrid("restoreCell", d, a)
                                                }
                                            }
                                        },
                                        error: function(g, f, h) {
                                            b("#lui_" + b.jgrid.jqID(z.p.id)).hide();
                                            z.grid.hDiv.loading = false;
                                            b(z).triggerHandler("jqGridErrorCell", [g, f, h]);
                                            if (b.isFunction(z.p.errorCell)) {
                                                z.p.errorCell.call(z, g, f, h);
                                                b(z).jqGrid("restoreCell", d, a)
                                            } else {
                                                b.jgrid.info_dialog(b.jgrid.errors.errcap, g.status + " : " + g.statusText + "<br/>" + f, b.jgrid.edit.bClose);
                                                b(z).jqGrid("restoreCell", d, a)
                                            }
                                        }
                                    }, b.jgrid.ajaxOptions, z.p.ajaxCellOptions || {}))
                                } else {
                                    try {
                                        b.jgrid.info_dialog(b.jgrid.errors.errcap, b.jgrid.errors.nourl, b.jgrid.edit.bClose);
                                        b(z).jqGrid("restoreCell", d, a)
                                    } catch (v) {}
                                }
                            }
                            if (z.p.cellsubmit === "clientArray") {
                                b(E).empty();
                                b(z).jqGrid("setCell", z.rows[d].id, a, P, false, false, true);
                                b(E).addClass("dirty-cell");
                                b(z.rows[d]).addClass("edited");
                                b(z).triggerHandler("jqGridAfterSaveCell", [z.rows[d].id, O, G, d, a]);
                                if (b.isFunction(z.p.afterSaveCell)) {
                                    z.p.afterSaveCell.call(z, z.rows[d].id, O, G, d, a)
                                }
                                z.p.savedRow.splice(0, 1)
                            }
                        } else {
                            try {
                                window.setTimeout(function() {
                                    b.jgrid.info_dialog(b.jgrid.errors.errcap, G + " " + N[1], b.jgrid.edit.bClose)
                                }, 100);
                                b(z).jqGrid("restoreCell", d, a)
                            } catch (v) {}
                        }
                    } else {
                        b(z).jqGrid("restoreCell", d, a)
                    }
                }
                window.setTimeout(function() {
                    b("#" + b.jgrid.jqID(z.p.knv)).attr("tabindex", "-1").focus()
                }, 0)
            })
        },
        restoreCell: function(d, a) {
            return this.each(function() {
                var c = this, j;
                if (!c.grid || c.p.cellEdit !== true) {
                    return
                }
                if (c.p.savedRow.length >= 1) {
                    j = 0
                } else {
                    j = null
                }
                if (j !== null) {
                    var e = b("td:eq(" + a + ")", c.rows[d]);
                    if (b.isFunction(b.fn.datepicker)) {
                        try {
                            b("input.hasDatepicker", e).datepicker("hide")
                        } catch (i) {}
                    }
                    b(e).empty().attr("tabindex", "-1");
                    b(c).jqGrid("setCell", c.rows[d].id, a, c.p.savedRow[j].v, false, false, true);
                    b(c).triggerHandler("jqGridAfterRestoreCell", [c.rows[d].id, c.p.savedRow[j].v, d, a]);
                    if (b.isFunction(c.p.afterRestoreCell)) {
                        c.p.afterRestoreCell.call(c, c.rows[d].id, c.p.savedRow[j].v, d, a)
                    }
                    c.p.savedRow.splice(0, 1)
                }
                window.setTimeout(function() {
                    b("#" + c.p.knv).attr("tabindex", "-1").focus()
                }, 0)
            })
        },
        nextCell: function(d, a) {
            return this.each(function() {
                var c = this, g = false, h;
                if (!c.grid || c.p.cellEdit !== true) {
                    return
                }
                for (h = a + 1; h < c.p.colModel.length; h++) {
                    if (c.p.colModel[h].editable === true) {
                        g = h;
                        break
                    }
                }
                if (g !== false) {
                    b(c).jqGrid("editCell", d, g, true)
                } else {
                    if (c.p.savedRow.length > 0) {
                        b(c).jqGrid("saveCell", d, a)
                    }
                }
            })
        },
        prevCell: function(d, a) {
            return this.each(function() {
                var c = this, g = false, h;
                if (!c.grid || c.p.cellEdit !== true) {
                    return
                }
                for (h = a - 1; h >= 0; h--) {
                    if (c.p.colModel[h].editable === true) {
                        g = h;
                        break
                    }
                }
                if (g !== false) {
                    b(c).jqGrid("editCell", d, g, true)
                } else {
                    if (c.p.savedRow.length > 0) {
                        b(c).jqGrid("saveCell", d, a)
                    }
                }
            })
        },
        GridNav: function() {
            return this.each(function() {
                var h = this;
                if (!h.grid || h.p.cellEdit !== true) {
                    return
                }
                h.p.knv = h.p.id + "_kn";
                var i = b("<div style='position:fixed;top:0px;width:1px;height:1px;' tabindex='0'><div tabindex='-1' style='width:1px;height:1px;' id='" + h.p.knv + "'></div></div>"), k, l;
                function j(e, g, f) {
                    if (f.substr(0, 1) === "v") {
                        var x = b(h.grid.bDiv)[0].clientHeight
                          , d = b(h.grid.bDiv)[0].scrollTop
                          , c = h.rows[e].offsetTop + h.rows[e].clientHeight
                          , t = h.rows[e].offsetTop;
                        if (f === "vd") {
                            if (c >= x) {
                                b(h.grid.bDiv)[0].scrollTop = b(h.grid.bDiv)[0].scrollTop + h.rows[e].clientHeight
                            }
                        }
                        if (f === "vu") {
                            if (t < d) {
                                b(h.grid.bDiv)[0].scrollTop = b(h.grid.bDiv)[0].scrollTop - h.rows[e].clientHeight
                            }
                        }
                    }
                    if (f === "h") {
                        var u = b(h.grid.bDiv)[0].clientWidth
                          , v = b(h.grid.bDiv)[0].scrollLeft
                          , w = h.rows[e].cells[g].offsetLeft + h.rows[e].cells[g].clientWidth
                          , s = h.rows[e].cells[g].offsetLeft;
                        if (w >= u + parseInt(v, 10)) {
                            b(h.grid.bDiv)[0].scrollLeft = b(h.grid.bDiv)[0].scrollLeft + h.rows[e].cells[g].clientWidth
                        } else {
                            if (s < v) {
                                b(h.grid.bDiv)[0].scrollLeft = b(h.grid.bDiv)[0].scrollLeft - h.rows[e].cells[g].clientWidth
                            }
                        }
                    }
                }
                function a(c, f) {
                    var d, e;
                    if (f === "lft") {
                        d = c + 1;
                        for (e = c; e >= 0; e--) {
                            if (h.p.colModel[e].hidden !== true) {
                                d = e;
                                break
                            }
                        }
                    }
                    if (f === "rgt") {
                        d = c - 1;
                        for (e = c; e < h.p.colModel.length; e++) {
                            if (h.p.colModel[e].hidden !== true) {
                                d = e;
                                break
                            }
                        }
                    }
                    return d
                }
                b(i).insertBefore(h.grid.cDiv);
                b("#" + h.p.knv).focus().keydown(function(c) {
                    l = c.keyCode;
                    if (h.p.direction === "rtl") {
                        if (l === 37) {
                            l = 39
                        } else {
                            if (l === 39) {
                                l = 37
                            }
                        }
                    }
                    switch (l) {
                    case 38:
                        if (h.p.iRow - 1 > 0) {
                            j(h.p.iRow - 1, h.p.iCol, "vu");
                            b(h).jqGrid("editCell", h.p.iRow - 1, h.p.iCol, false)
                        }
                        break;
                    case 40:
                        if (h.p.iRow + 1 <= h.rows.length - 1) {
                            j(h.p.iRow + 1, h.p.iCol, "vd");
                            b(h).jqGrid("editCell", h.p.iRow + 1, h.p.iCol, false)
                        }
                        break;
                    case 37:
                        if (h.p.iCol - 1 >= 0) {
                            k = a(h.p.iCol - 1, "lft");
                            j(h.p.iRow, k, "h");
                            b(h).jqGrid("editCell", h.p.iRow, k, false)
                        }
                        break;
                    case 39:
                        if (h.p.iCol + 1 <= h.p.colModel.length - 1) {
                            k = a(h.p.iCol + 1, "rgt");
                            j(h.p.iRow, k, "h");
                            b(h).jqGrid("editCell", h.p.iRow, k, false)
                        }
                        break;
                    case 13:
                        if (parseInt(h.p.iCol, 10) >= 0 && parseInt(h.p.iRow, 10) >= 0) {
                            b(h).jqGrid("editCell", h.p.iRow, h.p.iCol, true)
                        }
                        break;
                    default:
                        return true
                    }
                    return false
                })
            })
        },
        getChangedCells: function(d) {
            var a = [];
            if (!d) {
                d = "all"
            }
            this.each(function() {
                var c = this, f;
                if (!c.grid || c.p.cellEdit !== true) {
                    return
                }
                b(c.rows).each(function(h) {
                    var e = {};
                    if (b(this).hasClass("edited")) {
                        b("td", this).each(function(i) {
                            f = c.p.colModel[i].name;
                            if (f !== "cb" && f !== "subgrid") {
                                if (d === "dirty") {
                                    if (b(this).hasClass("dirty-cell")) {
                                        try {
                                            e[f] = b.unformat.call(c, this, {
                                                rowId: c.rows[h].id,
                                                colModel: c.p.colModel[i]
                                            }, i)
                                        } catch (g) {
                                            e[f] = b.jgrid.htmlDecode(b(this).html())
                                        }
                                    }
                                } else {
                                    try {
                                        e[f] = b.unformat.call(c, this, {
                                            rowId: c.rows[h].id,
                                            colModel: c.p.colModel[i]
                                        }, i)
                                    } catch (g) {
                                        e[f] = b.jgrid.htmlDecode(b(this).html())
                                    }
                                }
                            }
                        });
                        e.id = this.id;
                        a.push(e)
                    }
                })
            });
            return a
        }
    })
}
)(jQuery);
(function(b) {
    b.jgrid.extend({
        setSubGrid: function() {
            return this.each(function() {
                var f = this, a, g, h = {
                    plusicon: "ui-icon-plus",
                    minusicon: "ui-icon-minus",
                    openicon: "ui-icon-carat-1-sw",
                    expandOnLoad: false,
                    delayOnLoad: 50,
                    selectOnExpand: false,
                    selectOnCollapse: false,
                    reloadOnExpand: true
                };
                f.p.subGridOptions = b.extend(h, f.p.subGridOptions || {});
                f.p.colNames.unshift("");
                f.p.colModel.unshift({
                    name: "subgrid",
                    width: b.jgrid.cell_width ? f.p.subGridWidth + f.p.cellLayout : f.p.subGridWidth,
                    sortable: false,
                    resizable: false,
                    hidedlg: true,
                    search: false,
                    fixed: true
                });
                a = f.p.subGridModel;
                if (a[0]) {
                    a[0].align = b.extend([], a[0].align || []);
                    for (g = 0; g < a[0].name.length; g++) {
                        a[0].align[g] = a[0].align[g] || "left"
                    }
                }
            })
        },
        addSubGridCell: function(g, h) {
            var i = "", a, j;
            this.each(function() {
                i = this.formatCol(g, h);
                j = this.p.id;
                a = this.p.subGridOptions.plusicon
            });
            return '<td role="gridcell" aria-describedby="' + j + '_subgrid" class="ui-sgcollapsed sgcollapsed" ' + i + "><a style='cursor:pointer;'><span class='ui-icon " + a + "'></span></a></td>"
        },
        addSubGrid: function(d, a) {
            return this.each(function() {
                var s = this;
                if (!s.grid) {
                    return
                }
                var z = function(h, f, e) {
                    var g = b("<td align='" + s.p.subGridModel[0].align[e] + "'></td>").html(f);
                    b(h).append(g)
                };
                var A = function(k, m) {
                    var e, g, h, f = b("<table cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"), l = b("<tr></tr>");
                    for (g = 0; g < s.p.subGridModel[0].name.length; g++) {
                        e = b("<th class='ui-state-default ui-th-subgrid ui-th-column ui-th-" + s.p.direction + "'></th>");
                        b(e).html(s.p.subGridModel[0].name[g]);
                        b(e).width(s.p.subGridModel[0].width[g]);
                        b(l).append(e)
                    }
                    b(f).append(l);
                    if (k) {
                        h = s.p.xmlReader.subgrid;
                        b(h.root + " " + h.row, k).each(function() {
                            l = b("<tr class='ui-widget-content ui-subtblcell'></tr>");
                            if (h.repeatitems === true) {
                                b(h.cell, this).each(function(o) {
                                    z(l, b(this).text() || "&#160;", o)
                                })
                            } else {
                                var n = s.p.subGridModel[0].mapping || s.p.subGridModel[0].name;
                                if (n) {
                                    for (g = 0; g < n.length; g++) {
                                        z(l, b(n[g], this).text() || "&#160;", g)
                                    }
                                }
                            }
                            b(f).append(l)
                        })
                    }
                    var j = b("table:first", s.grid.bDiv).attr("id") + "_";
                    b("#" + b.jgrid.jqID(j + m)).append(f);
                    s.grid.hDiv.loading = false;
                    b("#load_" + b.jgrid.jqID(s.p.id)).hide();
                    return false
                };
                var y = function(k, n) {
                    var h, f, m, j, e, o, p = b("<table cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"), q = b("<tr></tr>");
                    for (m = 0; m < s.p.subGridModel[0].name.length; m++) {
                        h = b("<th class='ui-state-default ui-th-subgrid ui-th-column ui-th-" + s.p.direction + "'></th>");
                        b(h).html(s.p.subGridModel[0].name[m]);
                        b(h).width(s.p.subGridModel[0].width[m]);
                        b(q).append(h)
                    }
                    b(p).append(q);
                    if (k) {
                        e = s.p.jsonReader.subgrid;
                        f = b.jgrid.getAccessor(k, e.root);
                        if (f !== undefined) {
                            for (m = 0; m < f.length; m++) {
                                j = f[m];
                                q = b("<tr class='ui-widget-content ui-subtblcell'></tr>");
                                if (e.repeatitems === true) {
                                    if (e.cell) {
                                        j = j[e.cell]
                                    }
                                    for (o = 0; o < j.length; o++) {
                                        z(q, j[o] || "&#160;", o)
                                    }
                                } else {
                                    var l = s.p.subGridModel[0].mapping || s.p.subGridModel[0].name;
                                    if (l.length) {
                                        for (o = 0; o < l.length; o++) {
                                            z(q, j[l[o]] || "&#160;", o)
                                        }
                                    }
                                }
                                b(p).append(q)
                            }
                        }
                    }
                    var g = b("table:first", s.grid.bDiv).attr("id") + "_";
                    b("#" + b.jgrid.jqID(g + n)).append(p);
                    s.grid.hDiv.loading = false;
                    b("#load_" + b.jgrid.jqID(s.p.id)).hide();
                    return false
                };
                var r = function(f) {
                    var j, e, g, h;
                    j = b(f).attr("id");
                    e = {
                        nd_: (new Date().getTime())
                    };
                    e[s.p.prmNames.subgridid] = j;
                    if (!s.p.subGridModel[0]) {
                        return false
                    }
                    if (s.p.subGridModel[0].params) {
                        for (h = 0; h < s.p.subGridModel[0].params.length; h++) {
                            for (g = 0; g < s.p.colModel.length; g++) {
                                if (s.p.colModel[g].name === s.p.subGridModel[0].params[h]) {
                                    e[s.p.colModel[g].name] = b("td:eq(" + g + ")", f).text().replace(/\&#160\;/ig, "")
                                }
                            }
                        }
                    }
                    if (!s.grid.hDiv.loading) {
                        s.grid.hDiv.loading = true;
                        b("#load_" + b.jgrid.jqID(s.p.id)).show();
                        if (!s.p.subgridtype) {
                            s.p.subgridtype = s.p.datatype
                        }
                        if (b.isFunction(s.p.subgridtype)) {
                            s.p.subgridtype.call(s, e)
                        } else {
                            s.p.subgridtype = s.p.subgridtype.toLowerCase()
                        }
                        switch (s.p.subgridtype) {
                        case "xml":
                        case "json":
                            b.ajax(b.extend({
                                type: s.p.mtype,
                                url: s.p.subGridUrl,
                                dataType: s.p.subgridtype,
                                data: b.isFunction(s.p.serializeSubGridData) ? s.p.serializeSubGridData.call(s, e) : e,
                                complete: function(k) {
                                    if (s.p.subgridtype === "xml") {
                                        A(k.responseXML, j)
                                    } else {
                                        y(b.jgrid.parse(k.responseText), j)
                                    }
                                    k = null
                                }
                            }, b.jgrid.ajaxOptions, s.p.ajaxSubgridOptions || {}));
                            break
                        }
                    }
                    return false
                };
                var i, c, w, u = 0, x, B;
                b.each(s.p.colModel, function() {
                    if (this.hidden === true || this.name === "rn" || this.name === "cb") {
                        u++
                    }
                });
                var t = s.rows.length
                  , v = 1;
                if (a !== undefined && a > 0) {
                    v = a;
                    t = a + 1
                }
                while (v < t) {
                    if (b(s.rows[v]).hasClass("jqgrow")) {
                        b(s.rows[v].cells[d]).bind("click", function() {
                            var e = b(this).parent("tr")[0];
                            B = e.nextSibling;
                            if (b(this).hasClass("sgcollapsed")) {
                                c = s.p.id;
                                i = e.id;
                                if (s.p.subGridOptions.reloadOnExpand === true || (s.p.subGridOptions.reloadOnExpand === false && !b(B).hasClass("ui-subgrid"))) {
                                    w = d >= 1 ? "<td colspan='" + d + "'>&#160;</td>" : "";
                                    x = b(s).triggerHandler("jqGridSubGridBeforeExpand", [c + "_" + i, i]);
                                    x = (x === false || x === "stop") ? false : true;
                                    if (x && b.isFunction(s.p.subGridBeforeExpand)) {
                                        x = s.p.subGridBeforeExpand.call(s, c + "_" + i, i)
                                    }
                                    if (x === false) {
                                        return false
                                    }
                                    b(e).after("<tr role='row' class='ui-subgrid'>" + w + "<td class='ui-widget-content subgrid-cell'><span class='ui-icon " + s.p.subGridOptions.openicon + "'></span></td><td colspan='" + parseInt(s.p.colNames.length - 1 - u, 10) + "' class='ui-widget-content subgrid-data'><div id=" + c + "_" + i + " class='tablediv'></div></td></tr>");
                                    b(s).triggerHandler("jqGridSubGridRowExpanded", [c + "_" + i, i]);
                                    if (b.isFunction(s.p.subGridRowExpanded)) {
                                        s.p.subGridRowExpanded.call(s, c + "_" + i, i)
                                    } else {
                                        r(e)
                                    }
                                } else {
                                    b(B).show()
                                }
                                b(this).html("<a style='cursor:pointer;'><span class='ui-icon " + s.p.subGridOptions.minusicon + "'></span></a>").removeClass("sgcollapsed").addClass("sgexpanded");
                                if (s.p.subGridOptions.selectOnExpand) {
                                    b(s).jqGrid("setSelection", i)
                                }
                            } else {
                                if (b(this).hasClass("sgexpanded")) {
                                    x = b(s).triggerHandler("jqGridSubGridRowColapsed", [c + "_" + i, i]);
                                    x = (x === false || x === "stop") ? false : true;
                                    i = e.id;
                                    if (x && b.isFunction(s.p.subGridRowColapsed)) {
                                        x = s.p.subGridRowColapsed.call(s, c + "_" + i, i)
                                    }
                                    if (x === false) {
                                        return false
                                    }
                                    if (s.p.subGridOptions.reloadOnExpand === true) {
                                        b(B).remove(".ui-subgrid")
                                    } else {
                                        if (b(B).hasClass("ui-subgrid")) {
                                            b(B).hide()
                                        }
                                    }
                                    b(this).html("<a style='cursor:pointer;'><span class='ui-icon " + s.p.subGridOptions.plusicon + "'></span></a>").removeClass("sgexpanded").addClass("sgcollapsed");
                                    if (s.p.subGridOptions.selectOnCollapse) {
                                        b(s).jqGrid("setSelection", i)
                                    }
                                }
                            }
                            return false
                        })
                    }
                    v++
                }
                if (s.p.subGridOptions.expandOnLoad === true) {
                    b(s.rows).filter(".jqgrow").each(function(e, f) {
                        b(f.cells[0]).click()
                    })
                }
                s.subGridXml = function(f, e) {
                    A(f, e)
                }
                ;
                s.subGridJson = function(f, e) {
                    y(f, e)
                }
            })
        },
        expandSubGridRow: function(a) {
            return this.each(function() {
                var f = this;
                if (!f.grid && !a) {
                    return
                }
                if (f.p.subGrid === true) {
                    var h = b(this).jqGrid("getInd", a, true);
                    if (h) {
                        var g = b("td.sgcollapsed", h)[0];
                        if (g) {
                            b(g).trigger("click")
                        }
                    }
                }
            })
        },
        collapseSubGridRow: function(a) {
            return this.each(function() {
                var f = this;
                if (!f.grid && !a) {
                    return
                }
                if (f.p.subGrid === true) {
                    var h = b(this).jqGrid("getInd", a, true);
                    if (h) {
                        var g = b("td.sgexpanded", h)[0];
                        if (g) {
                            b(g).trigger("click")
                        }
                    }
                }
            })
        },
        toggleSubGridRow: function(a) {
            return this.each(function() {
                var f = this;
                if (!f.grid && !a) {
                    return
                }
                if (f.p.subGrid === true) {
                    var h = b(this).jqGrid("getInd", a, true);
                    if (h) {
                        var g = b("td.sgcollapsed", h)[0];
                        if (g) {
                            b(g).trigger("click")
                        } else {
                            g = b("td.sgexpanded", h)[0];
                            if (g) {
                                b(g).trigger("click")
                            }
                        }
                    }
                }
            })
        }
    })
}
)(jQuery);
(function(b) {
    b.jgrid.extend({
        setTreeNode: function(d, a) {
            return this.each(function() {
                var B = this;
                if (!B.grid || !B.p.treeGrid) {
                    return
                }
                var H = B.p.expColInd, F = B.p.treeReader.expanded_field, y = B.p.treeReader.leaf_field, N = B.p.treeReader.level_field, z = B.p.treeReader.icon_field, D = B.p.treeReader.loaded, w, G, M, J, E, c, x, I;
                while (d < a) {
                    var K = b.jgrid.stripPref(B.p.idPrefix, B.rows[d].id), L = B.p._index[K], A;
                    x = B.p.data[L];
                    if (B.p.treeGridModel === "nested") {
                        if (!x[y]) {
                            w = parseInt(x[B.p.treeReader.left_field], 10);
                            G = parseInt(x[B.p.treeReader.right_field], 10);
                            x[y] = (G === w + 1) ? "true" : "false";
                            B.rows[d].cells[B.p._treeleafpos].innerHTML = x[y]
                        }
                    }
                    M = parseInt(x[N], 10);
                    if (B.p.tree_root_level === 0) {
                        J = M + 1;
                        E = M
                    } else {
                        J = M;
                        E = M - 1
                    }
                    c = "<div class='tree-wrap tree-wrap-" + B.p.direction + "' style='width:" + (J * 18) + "px;'>";
                    c += "<div style='" + (B.p.direction === "rtl" ? "right:" : "left:") + (E * 18) + "px;' class='ui-icon ";
                    if (x[D] !== undefined) {
                        if (x[D] === "true" || x[D] === true) {
                            x[D] = true
                        } else {
                            x[D] = false
                        }
                    }
                    if (x[y] === "true" || x[y] === true) {
                        c += ((x[z] !== undefined && x[z] !== "") ? x[z] : B.p.treeIcons.leaf) + " tree-leaf treeclick";
                        x[y] = true;
                        I = "leaf"
                    } else {
                        x[y] = false;
                        I = ""
                    }
                    x[F] = ((x[F] === "true" || x[F] === true) ? true : false) && (x[D] || x[D] === undefined);
                    if (x[F] === false) {
                        c += ((x[y] === true) ? "'" : B.p.treeIcons.plus + " tree-plus treeclick'")
                    } else {
                        c += ((x[y] === true) ? "'" : B.p.treeIcons.minus + " tree-minus treeclick'")
                    }
                    c += "></div></div>";
                    b(B.rows[d].cells[H]).wrapInner("<span class='cell-wrapper" + I + "'></span>").prepend(c);
                    if (M !== parseInt(B.p.tree_root_level, 10)) {
                        var C = b(B).jqGrid("getNodeParent", x);
                        A = C && C.hasOwnProperty(F) ? C[F] : true;
                        if (!A) {
                            b(B.rows[d]).css("display", "none")
                        }
                    }
                    b(B.rows[d].cells[H]).find("div.treeclick").bind("click", function(e) {
                        var f = e.target || e.srcElement
                          , g = b.jgrid.stripPref(B.p.idPrefix, b(f, B.rows).closest("tr.jqgrow")[0].id)
                          , h = B.p._index[g];
                        if (!B.p.data[h][y]) {
                            if (B.p.data[h][F]) {
                                b(B).jqGrid("collapseRow", B.p.data[h]);
                                b(B).jqGrid("collapseNode", B.p.data[h])
                            } else {
                                b(B).jqGrid("expandRow", B.p.data[h]);
                                b(B).jqGrid("expandNode", B.p.data[h])
                            }
                        }
                        return false
                    });
                    if (B.p.ExpandColClick === true) {
                        b(B.rows[d].cells[H]).find("span.cell-wrapper").css("cursor", "pointer").bind("click", function(e) {
                            var f = e.target || e.srcElement
                              , g = b.jgrid.stripPref(B.p.idPrefix, b(f, B.rows).closest("tr.jqgrow")[0].id)
                              , h = B.p._index[g];
                            if (!B.p.data[h][y]) {
                                if (B.p.data[h][F]) {
                                    b(B).jqGrid("collapseRow", B.p.data[h]);
                                    b(B).jqGrid("collapseNode", B.p.data[h])
                                } else {
                                    b(B).jqGrid("expandRow", B.p.data[h]);
                                    b(B).jqGrid("expandNode", B.p.data[h])
                                }
                            }
                            b(B).jqGrid("setSelection", g);
                            return false
                        })
                    }
                    d++
                }
            })
        },
        setTreeGrid: function() {
            return this.each(function() {
                var i = this, m = 0, o, k = false, p, n, l, a = [];
                if (!i.p.treeGrid) {
                    return
                }
                if (!i.p.treedatatype) {
                    b.extend(i.p, {
                        treedatatype: i.p.datatype
                    })
                }
                i.p.subGrid = false;
                i.p.altRows = false;
                i.p.pgbuttons = false;
                i.p.pginput = false;
                i.p.gridview = true;
                if (i.p.rowTotal === null) {
                    i.p.rowNum = 10000
                }
                i.p.multiselect = false;
                i.p.rowList = [];
                i.p.expColInd = 0;
                o = "ui-icon-triangle-1-" + (i.p.direction === "rtl" ? "w" : "e");
                i.p.treeIcons = b.extend({
                    plus: o,
                    minus: "ui-icon-triangle-1-s",
                    leaf: "ui-icon-radio-off"
                }, i.p.treeIcons || {});
                if (i.p.treeGridModel === "nested") {
                    i.p.treeReader = b.extend({
                        level_field: "level",
                        left_field: "lft",
                        right_field: "rgt",
                        leaf_field: "isLeaf",
                        expanded_field: "expanded",
                        loaded: "loaded",
                        icon_field: "icon"
                    }, i.p.treeReader)
                } else {
                    if (i.p.treeGridModel === "adjacency") {
                        i.p.treeReader = b.extend({
                            level_field: "level",
                            parent_id_field: "parent",
                            leaf_field: "isLeaf",
                            expanded_field: "expanded",
                            loaded: "loaded",
                            icon_field: "icon"
                        }, i.p.treeReader)
                    }
                }
                for (n in i.p.colModel) {
                    if (i.p.colModel.hasOwnProperty(n)) {
                        p = i.p.colModel[n].name;
                        if (p === i.p.ExpandColumn && !k) {
                            k = true;
                            i.p.expColInd = m
                        }
                        m++;
                        for (l in i.p.treeReader) {
                            if (i.p.treeReader.hasOwnProperty(l) && i.p.treeReader[l] === p) {
                                a.push(p)
                            }
                        }
                    }
                }
                b.each(i.p.treeReader, function(d, c) {
                    if (c && b.inArray(c, a) === -1) {
                        if (d === "leaf_field") {
                            i.p._treeleafpos = m
                        }
                        m++;
                        i.p.colNames.push(c);
                        i.p.colModel.push({
                            name: c,
                            width: 1,
                            hidden: true,
                            sortable: false,
                            resizable: false,
                            hidedlg: true,
                            editable: true,
                            search: false
                        })
                    }
                })
            })
        },
        expandRow: function(a) {
            this.each(function() {
                var f = this;
                if (!f.grid || !f.p.treeGrid) {
                    return
                }
                var g = b(f).jqGrid("getNodeChildren", a)
                  , h = f.p.treeReader.expanded_field;
                b(g).each(function() {
                    var c = f.p.idPrefix + b.jgrid.getAccessor(this, f.p.localReader.id);
                    b(b(f).jqGrid("getGridRowById", c)).css("display", "");
                    if (this[h]) {
                        b(f).jqGrid("expandRow", this)
                    }
                })
            })
        },
        collapseRow: function(a) {
            this.each(function() {
                var f = this;
                if (!f.grid || !f.p.treeGrid) {
                    return
                }
                var g = b(f).jqGrid("getNodeChildren", a)
                  , h = f.p.treeReader.expanded_field;
                b(g).each(function() {
                    var c = f.p.idPrefix + b.jgrid.getAccessor(this, f.p.localReader.id);
                    b(b(f).jqGrid("getGridRowById", c)).css("display", "none");
                    if (this[h]) {
                        b(f).jqGrid("collapseRow", this)
                    }
                })
            })
        },
        getRootNodes: function() {
            var a = [];
            this.each(function() {
                var f = this;
                if (!f.grid || !f.p.treeGrid) {
                    return
                }
                switch (f.p.treeGridModel) {
                case "nested":
                    var g = f.p.treeReader.level_field;
                    b(f.p.data).each(function() {
                        if (parseInt(this[g], 10) === parseInt(f.p.tree_root_level, 10)) {
                            a.push(this)
                        }
                    });
                    break;
                case "adjacency":
                    var h = f.p.treeReader.parent_id_field;
                    b(f.p.data).each(function() {
                        if (this[h] === null || String(this[h]).toLowerCase() === "null") {
                            a.push(this)
                        }
                    });
                    break
                }
            });
            return a
        },
        getNodeDepth: function(d) {
            var a = null;
            this.each(function() {
                if (!this.grid || !this.p.treeGrid) {
                    return
                }
                var c = this;
                switch (c.p.treeGridModel) {
                case "nested":
                    var f = c.p.treeReader.level_field;
                    a = parseInt(d[f], 10) - parseInt(c.p.tree_root_level, 10);
                    break;
                case "adjacency":
                    a = b(c).jqGrid("getNodeAncestors", d).length;
                    break
                }
            });
            return a
        },
        getNodeParent: function(d) {
            var a = null;
            this.each(function() {
                var q = this;
                if (!q.grid || !q.p.treeGrid) {
                    return
                }
                switch (q.p.treeGridModel) {
                case "nested":
                    var r = q.p.treeReader.left_field
                      , c = q.p.treeReader.right_field
                      , p = q.p.treeReader.level_field
                      , m = parseInt(d[r], 10)
                      , n = parseInt(d[c], 10)
                      , t = parseInt(d[p], 10);
                    b(this.p.data).each(function() {
                        if (parseInt(this[p], 10) === t - 1 && parseInt(this[r], 10) < m && parseInt(this[c], 10) > n) {
                            a = this;
                            return false
                        }
                    });
                    break;
                case "adjacency":
                    var o = q.p.treeReader.parent_id_field
                      , s = q.p.localReader.id;
                    b(this.p.data).each(function() {
                        if (this[s] === b.jgrid.stripPref(q.p.idPrefix, d[o])) {
                            a = this;
                            return false
                        }
                    });
                    break
                }
            });
            return a
        },
        getNodeChildren: function(d) {
            var a = [];
            this.each(function() {
                var q = this;
                if (!q.grid || !q.p.treeGrid) {
                    return
                }
                switch (q.p.treeGridModel) {
                case "nested":
                    var r = q.p.treeReader.left_field
                      , c = q.p.treeReader.right_field
                      , p = q.p.treeReader.level_field
                      , m = parseInt(d[r], 10)
                      , n = parseInt(d[c], 10)
                      , t = parseInt(d[p], 10);
                    b(this.p.data).each(function() {
                        if (parseInt(this[p], 10) === t + 1 && parseInt(this[r], 10) > m && parseInt(this[c], 10) < n) {
                            a.push(this)
                        }
                    });
                    break;
                case "adjacency":
                    var o = q.p.treeReader.parent_id_field
                      , s = q.p.localReader.id;
                    b(this.p.data).each(function() {
                        if (this[o] == b.jgrid.stripPref(q.p.idPrefix, d[s])) {
                            a.push(this)
                        }
                    });
                    break
                }
            });
            return a
        },
        getFullTreeNode: function(d) {
            var a = [];
            this.each(function() {
                var s = this, r;
                if (!s.grid || !s.p.treeGrid) {
                    return
                }
                switch (s.p.treeGridModel) {
                case "nested":
                    var t = s.p.treeReader.left_field
                      , c = s.p.treeReader.right_field
                      , q = s.p.treeReader.level_field
                      , n = parseInt(d[t], 10)
                      , o = parseInt(d[c], 10)
                      , v = parseInt(d[q], 10);
                    b(this.p.data).each(function() {
                        if (parseInt(this[q], 10) >= v && parseInt(this[t], 10) >= n && parseInt(this[t], 10) <= o) {
                            a.push(this)
                        }
                    });
                    break;
                case "adjacency":
                    if (d) {
                        a.push(d);
                        var p = s.p.treeReader.parent_id_field
                          , u = s.p.localReader.id;
                        b(this.p.data).each(function(e) {
                            r = a.length;
                            for (e = 0; e < r; e++) {
                                if (b.jgrid.stripPref(s.p.idPrefix, a[e][u]) === this[p]) {
                                    a.push(this);
                                    break
                                }
                            }
                        })
                    }
                    break
                }
            });
            return a
        },
        getNodeAncestors: function(d) {
            var a = [];
            this.each(function() {
                if (!this.grid || !this.p.treeGrid) {
                    return
                }
                var c = b(this).jqGrid("getNodeParent", d);
                while (c) {
                    a.push(c);
                    c = b(this).jqGrid("getNodeParent", c)
                }
            });
            return a
        },
        isVisibleNode: function(d) {
            var a = true;
            this.each(function() {
                var c = this;
                if (!c.grid || !c.p.treeGrid) {
                    return
                }
                var g = b(c).jqGrid("getNodeAncestors", d)
                  , h = c.p.treeReader.expanded_field;
                b(g).each(function() {
                    a = a && this[h];
                    if (!a) {
                        return false
                    }
                })
            });
            return a
        },
        isNodeLoaded: function(d) {
            var a;
            this.each(function() {
                var c = this;
                if (!c.grid || !c.p.treeGrid) {
                    return
                }
                var h = c.p.treeReader.leaf_field
                  , g = c.p.treeReader.loaded;
                if (d !== undefined) {
                    if (d[g] !== undefined) {
                        a = d[g]
                    } else {
                        if (d[h] || b(c).jqGrid("getNodeChildren", d).length > 0) {
                            a = true
                        } else {
                            a = false
                        }
                    }
                } else {
                    a = false
                }
            });
            return a
        },
        expandNode: function(a) {
            return this.each(function() {
                if (!this.grid || !this.p.treeGrid) {
                    return
                }
                var o = this.p.treeReader.expanded_field
                  , n = this.p.treeReader.parent_id_field
                  , q = this.p.treeReader.loaded
                  , t = this.p.treeReader.level_field
                  , l = this.p.treeReader.left_field
                  , m = this.p.treeReader.right_field;
                if (!a[o]) {
                    var s = b.jgrid.getAccessor(a, this.p.localReader.id);
                    var r = b("#" + this.p.idPrefix + b.jgrid.jqID(s), this.grid.bDiv)[0];
                    var p = this.p._index[s];
                    if (b(this).jqGrid("isNodeLoaded", this.p.data[p])) {
                        a[o] = true;
                        b("div.treeclick", r).removeClass(this.p.treeIcons.plus + " tree-plus").addClass(this.p.treeIcons.minus + " tree-minus")
                    } else {
                        if (!this.grid.hDiv.loading) {
                            a[o] = true;
                            b("div.treeclick", r).removeClass(this.p.treeIcons.plus + " tree-plus").addClass(this.p.treeIcons.minus + " tree-minus");
                            this.p.treeANode = r.rowIndex;
                            this.p.datatype = this.p.treedatatype;
                            if (this.p.treeGridModel === "nested") {
                                b(this).jqGrid("setGridParam", {
                                    postData: {
                                        nodeid: s,
                                        n_left: a[l],
                                        n_right: a[m],
                                        n_level: a[t]
                                    }
                                })
                            } else {
                                b(this).jqGrid("setGridParam", {
                                    postData: {
                                        nodeid: s,
                                        parentid: a[n],
                                        n_level: a[t]
                                    }
                                })
                            }
                            b(this).trigger("reloadGrid");
                            a[q] = true;
                            if (this.p.treeGridModel === "nested") {
                                b(this).jqGrid("setGridParam", {
                                    postData: {
                                        nodeid: "",
                                        n_left: "",
                                        n_right: "",
                                        n_level: ""
                                    }
                                })
                            } else {
                                b(this).jqGrid("setGridParam", {
                                    postData: {
                                        nodeid: "",
                                        parentid: "",
                                        n_level: ""
                                    }
                                })
                            }
                        }
                    }
                }
            })
        },
        collapseNode: function(a) {
            return this.each(function() {
                if (!this.grid || !this.p.treeGrid) {
                    return
                }
                var g = this.p.treeReader.expanded_field;
                if (a[g]) {
                    a[g] = false;
                    var f = b.jgrid.getAccessor(a, this.p.localReader.id);
                    var h = b("#" + this.p.idPrefix + b.jgrid.jqID(f), this.grid.bDiv)[0];
                    b("div.treeclick", h).removeClass(this.p.treeIcons.minus + " tree-minus").addClass(this.p.treeIcons.plus + " tree-plus")
                }
            })
        },
        SortTree: function(f, h, a, g) {
            return this.each(function() {
                if (!this.grid || !this.p.treeGrid) {
                    return
                }
                var e, q, c, i = [], r = this, d, o, p = b(this).jqGrid("getRootNodes");
                d = b.jgrid.from(p);
                d.orderBy(f, h, a, g);
                o = d.select();
                for (e = 0,
                q = o.length; e < q; e++) {
                    c = o[e];
                    i.push(c);
                    b(this).jqGrid("collectChildrenSortTree", i, c, f, h, a, g)
                }
                b.each(i, function(j) {
                    var k = b.jgrid.getAccessor(this, r.p.localReader.id);
                    b("#" + b.jgrid.jqID(r.p.id) + " tbody tr:eq(" + j + ")").after(b("tr#" + b.jgrid.jqID(k), r.grid.bDiv))
                });
                d = null;
                o = null;
                i = null
            })
        },
        collectChildrenSortTree: function(a, i, h, k, l, j) {
            return this.each(function() {
                if (!this.grid || !this.p.treeGrid) {
                    return
                }
                var e, g, o, d, c, f;
                d = b(this).jqGrid("getNodeChildren", i);
                c = b.jgrid.from(d);
                c.orderBy(h, k, l, j);
                f = c.select();
                for (e = 0,
                g = f.length; e < g; e++) {
                    o = f[e];
                    a.push(o);
                    b(this).jqGrid("collectChildrenSortTree", a, o, h, k, l, j)
                }
            })
        },
        setTreeRow: function(a, f) {
            var e = false;
            this.each(function() {
                var c = this;
                if (!c.grid || !c.p.treeGrid) {
                    return
                }
                e = b(c).jqGrid("setRowData", a, f)
            });
            return e
        },
        delTreeNode: function(a) {
            return this.each(function() {
                var s = this, i = s.p.localReader.id, r, t = s.p.treeReader.left_field, o = s.p.treeReader.right_field, w, v, q, p;
                if (!s.grid || !s.p.treeGrid) {
                    return
                }
                var x = s.p._index[a];
                if (x !== undefined) {
                    w = parseInt(s.p.data[x][o], 10);
                    v = w - parseInt(s.p.data[x][t], 10) + 1;
                    var u = b(s).jqGrid("getFullTreeNode", s.p.data[x]);
                    if (u.length > 0) {
                        for (r = 0; r < u.length; r++) {
                            b(s).jqGrid("delRowData", u[r][i])
                        }
                    }
                    if (s.p.treeGridModel === "nested") {
                        q = b.jgrid.from(s.p.data).greater(t, w, {
                            stype: "integer"
                        }).select();
                        if (q.length) {
                            for (p in q) {
                                if (q.hasOwnProperty(p)) {
                                    q[p][t] = parseInt(q[p][t], 10) - v
                                }
                            }
                        }
                        q = b.jgrid.from(s.p.data).greater(o, w, {
                            stype: "integer"
                        }).select();
                        if (q.length) {
                            for (p in q) {
                                if (q.hasOwnProperty(p)) {
                                    q[p][o] = parseInt(q[p][o], 10) - v
                                }
                            }
                        }
                    }
                }
            })
        },
        addChildNode: function(W, Q, a, T) {
            var H = this[0];
            if (a) {
                var P = H.p.treeReader.expanded_field, E = H.p.treeReader.leaf_field, ab = H.p.treeReader.level_field, V = H.p.treeReader.parent_id_field, Z = H.p.treeReader.left_field, D = H.p.treeReader.right_field, O = H.p.treeReader.loaded, aa, i, U, R, K, I, M = 0, S = Q, F, G;
                if (T === undefined) {
                    T = false
                }
                if (W === undefined || W === null) {
                    K = H.p.data.length - 1;
                    if (K >= 0) {
                        while (K >= 0) {
                            M = Math.max(M, parseInt(H.p.data[K][H.p.localReader.id], 10));
                            K--
                        }
                    }
                    W = M + 1
                }
                var J = b(H).jqGrid("getInd", Q);
                F = false;
                if (Q === undefined || Q === null || Q === "") {
                    Q = null;
                    S = null;
                    aa = "last";
                    R = H.p.tree_root_level;
                    K = H.p.data.length + 1
                } else {
                    aa = "after";
                    i = H.p._index[Q];
                    U = H.p.data[i];
                    Q = U[H.p.localReader.id];
                    R = parseInt(U[ab], 10) + 1;
                    var Y = b(H).jqGrid("getFullTreeNode", U);
                    if (Y.length) {
                        K = Y[Y.length - 1][H.p.localReader.id];
                        S = K;
                        K = b(H).jqGrid("getInd", S) + 1
                    } else {
                        K = b(H).jqGrid("getInd", Q) + 1
                    }
                    if (U[E]) {
                        F = true;
                        U[P] = true;
                        b(H.rows[J]).find("span.cell-wrapperleaf").removeClass("cell-wrapperleaf").addClass("cell-wrapper").end().find("div.tree-leaf").removeClass(H.p.treeIcons.leaf + " tree-leaf").addClass(H.p.treeIcons.minus + " tree-minus");
                        H.p.data[i][E] = false;
                        U[O] = true
                    }
                }
                I = K + 1;
                if (a[P] === undefined) {
                    a[P] = false
                }
                if (a[O] === undefined) {
                    a[O] = false
                }
                a[ab] = R;
                if (a[E] === undefined) {
                    a[E] = true
                }
                if (H.p.treeGridModel === "adjacency") {
                    a[V] = Q
                }
                if (H.p.treeGridModel === "nested") {
                    var X, L, N;
                    if (Q !== null) {
                        G = parseInt(U[D], 10);
                        X = b.jgrid.from(H.p.data);
                        X = X.greaterOrEquals(D, G, {
                            stype: "integer"
                        });
                        L = X.select();
                        if (L.length) {
                            for (N in L) {
                                if (L.hasOwnProperty(N)) {
                                    L[N][Z] = L[N][Z] > G ? parseInt(L[N][Z], 10) + 2 : L[N][Z];
                                    L[N][D] = L[N][D] >= G ? parseInt(L[N][D], 10) + 2 : L[N][D]
                                }
                            }
                        }
                        a[Z] = G;
                        a[D] = G + 1
                    } else {
                        G = parseInt(b(H).jqGrid("getCol", D, false, "max"), 10);
                        L = b.jgrid.from(H.p.data).greater(Z, G, {
                            stype: "integer"
                        }).select();
                        if (L.length) {
                            for (N in L) {
                                if (L.hasOwnProperty(N)) {
                                    L[N][Z] = parseInt(L[N][Z], 10) + 2
                                }
                            }
                        }
                        L = b.jgrid.from(H.p.data).greater(D, G, {
                            stype: "integer"
                        }).select();
                        if (L.length) {
                            for (N in L) {
                                if (L.hasOwnProperty(N)) {
                                    L[N][D] = parseInt(L[N][D], 10) + 2
                                }
                            }
                        }
                        a[Z] = G + 1;
                        a[D] = G + 2
                    }
                }
                if (Q === null || b(H).jqGrid("isNodeLoaded", U) || F) {
                    b(H).jqGrid("addRowData", W, a, aa, S);
                    b(H).jqGrid("setTreeNode", K, I)
                }
                if (U && !U[P] && T) {
                    b(H.rows[J]).find("div.treeclick").click()
                }
            }
        }
    })
}
)(jQuery);
(function(b) {
    b.extend(b.jgrid, {
        template: function(f) {
            var h = b.makeArray(arguments).slice(1), a, g = h.length;
            if (f == null) {
                f = ""
            }
            return f.replace(/\{([\w\-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g, function(i, c) {
                if (!isNaN(parseInt(c, 10))) {
                    return h[parseInt(c, 10)]
                }
                for (a = 0; a < g; a++) {
                    if (b.isArray(h[a])) {
                        var d = h[a]
                          , e = d.length;
                        while (e--) {
                            if (c === d[e].nm) {
                                return d[e].v
                            }
                        }
                    }
                }
            })
        }
    });
    b.jgrid.extend({
        groupingSetup: function() {
            return this.each(function() {
                var h = this, j, k, i, l = h.p.colModel, a = h.p.groupingView;
                if (a !== null && ((typeof a === "object") || b.isFunction(a))) {
                    if (!a.groupField.length) {
                        h.p.grouping = false
                    } else {
                        if (a.visibiltyOnNextGrouping === undefined) {
                            a.visibiltyOnNextGrouping = []
                        }
                        a.lastvalues = [];
                        if (!a._locgr) {
                            a.groups = []
                        }
                        a.counters = [];
                        for (j = 0; j < a.groupField.length; j++) {
                            if (!a.groupOrder[j]) {
                                a.groupOrder[j] = "asc"
                            }
                            if (!a.groupText[j]) {
                                a.groupText[j] = "{0}"
                            }
                            if (typeof a.groupColumnShow[j] !== "boolean") {
                                a.groupColumnShow[j] = true
                            }
                            if (typeof a.groupSummary[j] !== "boolean") {
                                a.groupSummary[j] = false
                            }
                            if (!a.groupSummaryPos[j]) {
                                a.groupSummaryPos[j] = "footer"
                            }
                            if (a.groupColumnShow[j] === true) {
                                a.visibiltyOnNextGrouping[j] = true;
                                b(h).jqGrid("showCol", a.groupField[j])
                            } else {
                                a.visibiltyOnNextGrouping[j] = b("#" + b.jgrid.jqID(h.p.id + "_" + a.groupField[j])).is(":visible");
                                b(h).jqGrid("hideCol", a.groupField[j])
                            }
                        }
                        a.summary = [];
                        if (a.hideFirstGroupCol) {
                            a.formatDisplayField[0] = function(c) {
                                return c
                            }
                        }
                        for (k = 0,
                        i = l.length; k < i; k++) {
                            if (a.hideFirstGroupCol) {
                                if (!l[k].hidden && a.groupField[0] === l[k].name) {
                                    l[k].formatter = function() {
                                        return ""
                                    }
                                }
                            }
                            if (l[k].summaryType) {
                                if (l[k].summaryDivider) {
                                    a.summary.push({
                                        nm: l[k].name,
                                        st: l[k].summaryType,
                                        v: "",
                                        sd: l[k].summaryDivider,
                                        vd: "",
                                        sr: l[k].summaryRound,
                                        srt: l[k].summaryRoundType || "round"
                                    })
                                } else {
                                    a.summary.push({
                                        nm: l[k].name,
                                        st: l[k].summaryType,
                                        v: "",
                                        sr: l[k].summaryRound,
                                        srt: l[k].summaryRoundType || "round"
                                    })
                                }
                            }
                        }
                    }
                } else {
                    h.p.grouping = false
                }
            })
        },
        groupingPrepare: function(a, d) {
            this.each(function() {
                var i = this.p.groupingView, s = this, r, n = i.groupField.length, c, o, p, q, t = 0;
                for (r = 0; r < n; r++) {
                    c = i.groupField[r];
                    p = i.displayField[r];
                    o = a[c];
                    q = p == null ? null : a[p];
                    if (q == null) {
                        q = o
                    }
                    if (o !== undefined) {
                        if (d === 0) {
                            i.groups.push({
                                idx: r,
                                dataIndex: c,
                                value: o,
                                displayValue: q,
                                startRow: d,
                                cnt: 1,
                                summary: []
                            });
                            i.lastvalues[r] = o;
                            i.counters[r] = {
                                cnt: 1,
                                pos: i.groups.length - 1,
                                summary: b.extend(true, [], i.summary)
                            };
                            b.each(i.counters[r].summary, function() {
                                if (b.isFunction(this.st)) {
                                    this.v = this.st.call(s, this.v, this.nm, a)
                                } else {
                                    this.v = b(s).jqGrid("groupingCalculations.handler", this.st, this.v, this.nm, this.sr, this.srt, a);
                                    if (this.st.toLowerCase() === "avg" && this.sd) {
                                        this.vd = b(s).jqGrid("groupingCalculations.handler", this.st, this.vd, this.sd, this.sr, this.srt, a)
                                    }
                                }
                            });
                            i.groups[i.counters[r].pos].summary = i.counters[r].summary
                        } else {
                            if (typeof o !== "object" && (b.isArray(i.isInTheSameGroup) && b.isFunction(i.isInTheSameGroup[r]) ? !i.isInTheSameGroup[r].call(s, i.lastvalues[r], o, r, i) : i.lastvalues[r] !== o)) {
                                i.groups.push({
                                    idx: r,
                                    dataIndex: c,
                                    value: o,
                                    displayValue: q,
                                    startRow: d,
                                    cnt: 1,
                                    summary: []
                                });
                                i.lastvalues[r] = o;
                                t = 1;
                                i.counters[r] = {
                                    cnt: 1,
                                    pos: i.groups.length - 1,
                                    summary: b.extend(true, [], i.summary)
                                };
                                b.each(i.counters[r].summary, function() {
                                    if (b.isFunction(this.st)) {
                                        this.v = this.st.call(s, this.v, this.nm, a)
                                    } else {
                                        this.v = b(s).jqGrid("groupingCalculations.handler", this.st, this.v, this.nm, this.sr, this.srt, a);
                                        if (this.st.toLowerCase() === "avg" && this.sd) {
                                            this.vd = b(s).jqGrid("groupingCalculations.handler", this.st, this.vd, this.sd, this.sr, this.srt, a)
                                        }
                                    }
                                });
                                i.groups[i.counters[r].pos].summary = i.counters[r].summary
                            } else {
                                if (t === 1) {
                                    i.groups.push({
                                        idx: r,
                                        dataIndex: c,
                                        value: o,
                                        displayValue: q,
                                        startRow: d,
                                        cnt: 1,
                                        summary: []
                                    });
                                    i.lastvalues[r] = o;
                                    i.counters[r] = {
                                        cnt: 1,
                                        pos: i.groups.length - 1,
                                        summary: b.extend(true, [], i.summary)
                                    };
                                    b.each(i.counters[r].summary, function() {
                                        if (b.isFunction(this.st)) {
                                            this.v = this.st.call(s, this.v, this.nm, a)
                                        } else {
                                            this.v = b(s).jqGrid("groupingCalculations.handler", this.st, this.v, this.nm, this.sr, this.srt, a);
                                            if (this.st.toLowerCase() === "avg" && this.sd) {
                                                this.vd = b(s).jqGrid("groupingCalculations.handler", this.st, this.vd, this.sd, this.sr, this.srt, a)
                                            }
                                        }
                                    });
                                    i.groups[i.counters[r].pos].summary = i.counters[r].summary
                                } else {
                                    i.counters[r].cnt += 1;
                                    i.groups[i.counters[r].pos].cnt = i.counters[r].cnt;
                                    b.each(i.counters[r].summary, function() {
                                        if (b.isFunction(this.st)) {
                                            this.v = this.st.call(s, this.v, this.nm, a)
                                        } else {
                                            this.v = b(s).jqGrid("groupingCalculations.handler", this.st, this.v, this.nm, this.sr, this.srt, a);
                                            if (this.st.toLowerCase() === "avg" && this.sd) {
                                                this.vd = b(s).jqGrid("groupingCalculations.handler", this.st, this.vd, this.sd, this.sr, this.srt, a)
                                            }
                                        }
                                    });
                                    i.groups[i.counters[r].pos].summary = i.counters[r].summary
                                }
                            }
                        }
                    }
                }
            });
            return this
        },
        groupingToggle: function(a) {
            this.each(function() {
                var w = this
                  , G = w.p.groupingView
                  , r = a.split("_")
                  , H = parseInt(r[r.length - 2], 10);
                r.splice(r.length - 2, 2);
                var I = r.join("_"), L = G.minusicon, v = G.plusicon, x = b("#" + b.jgrid.jqID(a)), D = x.length ? x[0].nextSibling : null, F = b("#" + b.jgrid.jqID(a) + " span.tree-wrap-" + w.p.direction), y = function(d) {
                    var c = b.map(d.split(" "), function(e) {
                        if (e.substring(0, I.length + 1) === I + "_") {
                            return parseInt(e.substring(I.length + 1), 10)
                        }
                    });
                    return c.length > 0 ? c[0] : undefined
                }, A, E, K = false, C = w.p.frozenColumns ? w.p.id + "_frozen" : false, B = C ? b("#" + b.jgrid.jqID(a), "#" + b.jgrid.jqID(C)) : false, z = (B && B.length) ? B[0].nextSibling : null;
                if (F.hasClass(L)) {
                    if (G.showSummaryOnHide) {
                        if (D) {
                            while (D) {
                                if (b(D).hasClass("jqfoot")) {
                                    var J = parseInt(b(D).attr("jqfootlevel"), 10);
                                    if (J <= H) {
                                        break
                                    }
                                }
                                b(D).hide();
                                D = D.nextSibling;
                                if (C) {
                                    b(z).hide();
                                    z = z.nextSibling
                                }
                            }
                        }
                    } else {
                        if (D) {
                            while (D) {
                                A = y(D.className);
                                if (A !== undefined && A <= H) {
                                    break
                                }
                                b(D).hide();
                                D = D.nextSibling;
                                if (C) {
                                    b(z).hide();
                                    z = z.nextSibling
                                }
                            }
                        }
                    }
                    F.removeClass(L).addClass(v);
                    K = true
                } else {
                    if (D) {
                        E = undefined;
                        while (D) {
                            A = y(D.className);
                            if (E === undefined) {
                                E = A === undefined
                            }
                            if (A !== undefined) {
                                if (A <= H) {
                                    break
                                }
                                if (A === H + 1) {
                                    b(D).show().find(">td>span.tree-wrap-" + w.p.direction).removeClass(L).addClass(v);
                                    if (C) {
                                        b(z).show().find(">td>span.tree-wrap-" + w.p.direction).removeClass(L).addClass(v)
                                    }
                                }
                            } else {
                                if (E) {
                                    b(D).show();
                                    if (C) {
                                        b(z).show()
                                    }
                                }
                            }
                            D = D.nextSibling;
                            if (C) {
                                z = z.nextSibling
                            }
                        }
                    }
                    F.removeClass(v).addClass(L)
                }
                b(w).triggerHandler("jqGridGroupingClickGroup", [a, K]);
                if (b.isFunction(w.p.onClickGroup)) {
                    w.p.onClickGroup.call(w, a, K)
                }
            });
            return false
        },
        groupingRender: function(g, f, h, a) {
            return this.each(function() {
                var z = this, c = z.p.groupingView, v = "", u = "", t, d, x = c.groupCollapse ? c.plusicon : c.minusicon, C, w = [], y = c.groupField.length;
                x += " tree-wrap-" + z.p.direction;
                b.each(z.p.colModel, function(k, i) {
                    var j;
                    for (j = 0; j < y; j++) {
                        if (c.groupField[j] === i.name) {
                            w[j] = k;
                            break
                        }
                    }
                });
                var A = 0;
                function D(j, i, m) {
                    var l = false, k;
                    if (i === 0) {
                        l = m[j]
                    } else {
                        var n = m[j].idx;
                        if (n === 0) {
                            l = m[j]
                        } else {
                            for (k = j; k >= 0; k--) {
                                if (m[k].idx === n - i) {
                                    l = m[k];
                                    break
                                }
                            }
                        }
                    }
                    return l
                }
                function B(q, l, i, n) {
                    var p = D(q, l, i), k = z.p.colModel, m, j = p.cnt, o = "", r;
                    for (r = n; r < f; r++) {
                        var s = "<td " + z.formatCol(r, 1, "") + ">&#160;</td>"
                          , F = "{0}";
                        b.each(p.summary, function() {
                            if (this.nm === k[r].name) {
                                if (k[r].summaryTpl) {
                                    F = k[r].summaryTpl
                                }
                                if (typeof this.st === "string" && this.st.toLowerCase() === "avg") {
                                    if (this.sd && this.vd) {
                                        this.v = (this.v / this.vd)
                                    } else {
                                        if (this.v && j > 0) {
                                            this.v = (this.v / j)
                                        }
                                    }
                                }
                                try {
                                    this.groupCount = p.cnt;
                                    this.groupIndex = p.dataIndex;
                                    this.groupValue = p.value;
                                    m = z.formatter("", this.v, r, this)
                                } catch (E) {
                                    m = this.v
                                }
                                s = "<td " + z.formatCol(r, 1, "") + ">" + b.jgrid.format(F, m) + "</td>";
                                return false
                            }
                        });
                        o += s
                    }
                    return o
                }
                var e = b.makeArray(c.groupSummary);
                e.reverse();
                b.each(c.groups, function(n, q) {
                    if (c._locgr) {
                        if (!(q.startRow + q.cnt > (h - 1) * a && q.startRow < h * a)) {
                            return true
                        }
                    }
                    A++;
                    d = z.p.id + "ghead_" + q.idx;
                    t = d + "_" + n;
                    u = "<span style='cursor:pointer;' class='ui-icon " + x + "' onclick=\"jQuery('#" + b.jgrid.jqID(z.p.id) + "').jqGrid('groupingToggle','" + t + "');return false;\"></span>";
                    try {
                        if (b.isArray(c.formatDisplayField) && b.isFunction(c.formatDisplayField[q.idx])) {
                            q.displayValue = c.formatDisplayField[q.idx].call(z, q.displayValue, q.value, z.p.colModel[w[q.idx]], q.idx, c);
                            C = q.displayValue
                        } else {
                            C = z.formatter(t, q.displayValue, w[q.idx], q.value)
                        }
                    } catch (F) {
                        C = q.displayValue
                    }
                    if (c.groupSummaryPos[q.idx] === "header") {
                        v += '<tr id="' + t + '"' + (c.groupCollapse && q.idx > 0 ? ' style="display:none;" ' : " ") + 'role="row" class= "ui-widget-content jqgroup ui-row-' + z.p.direction + " " + d + '"><td style="padding-left:' + (q.idx * 12) + 'px;">' + u + b.jgrid.template(c.groupText[q.idx], C, q.cnt, q.summary) + "</td>";
                        v += B(n, q.idx - 1, c.groups, 1);
                        v += "</tr>"
                    } else {
                        v += '<tr id="' + t + '"' + (c.groupCollapse && q.idx > 0 ? ' style="display:none;" ' : " ") + 'role="row" class= "ui-widget-content jqgroup ui-row-' + z.p.direction + " " + d + '"><td style="padding-left:' + (q.idx * 12) + 'px;" colspan="' + f + '">' + u + b.jgrid.template(c.groupText[q.idx], C, q.cnt, q.summary) + "</td></tr>"
                    }
                    var l = y - 1 === q.idx;
                    if (l) {
                        var k = c.groups[n + 1], s, i, o = 0, r = q.startRow, p = k !== undefined ? c.groups[n + 1].startRow : g.length;
                        if (c._locgr) {
                            o = (h - 1) * a;
                            if (o > q.startRow) {
                                r = o
                            }
                        }
                        for (s = r; s < p; s++) {
                            if (!g[s - o]) {
                                break
                            }
                            v += g[s - o].join("")
                        }
                        if (c.groupSummaryPos[q.idx] !== "header") {
                            var m;
                            if (k !== undefined) {
                                for (m = 0; m < c.groupField.length; m++) {
                                    if (k.dataIndex === c.groupField[m]) {
                                        break
                                    }
                                }
                                A = c.groupField.length - m
                            }
                            for (i = 0; i < A; i++) {
                                if (!e[i]) {
                                    continue
                                }
                                var j = "";
                                if (c.groupCollapse && !c.showSummaryOnHide) {
                                    j = ' style="display:none;"'
                                }
                                v += "<tr" + j + ' jqfootlevel="' + (q.idx - i) + '" role="row" class="ui-widget-content jqfoot ui-row-' + z.p.direction + '">';
                                v += B(n, i, c.groups, 0);
                                v += "</tr>"
                            }
                            A = m
                        }
                    }
                });
                b("#" + b.jgrid.jqID(z.p.id) + " tbody:first").append(v);
                v = null
            })
        },
        groupingGroupBy: function(d, a) {
            return this.each(function() {
                var c = this;
                if (typeof d === "string") {
                    d = [d]
                }
                var h = c.p.groupingView;
                c.p.grouping = true;
                if (h.visibiltyOnNextGrouping === undefined) {
                    h.visibiltyOnNextGrouping = []
                }
                var g;
                for (g = 0; g < h.groupField.length; g++) {
                    if (!h.groupColumnShow[g] && h.visibiltyOnNextGrouping[g]) {
                        b(c).jqGrid("showCol", h.groupField[g])
                    }
                }
                for (g = 0; g < d.length; g++) {
                    h.visibiltyOnNextGrouping[g] = b("#" + b.jgrid.jqID(c.p.id) + "_" + b.jgrid.jqID(d[g])).is(":visible")
                }
                c.p.groupingView = b.extend(c.p.groupingView, a || {});
                h.groupField = d;
                b(c).trigger("reloadGrid")
            })
        },
        groupingRemove: function(a) {
            return this.each(function() {
                var f = this;
                if (a === undefined) {
                    a = true
                }
                f.p.grouping = false;
                if (a === true) {
                    var h = f.p.groupingView, g;
                    for (g = 0; g < h.groupField.length; g++) {
                        if (!h.groupColumnShow[g] && h.visibiltyOnNextGrouping[g]) {
                            b(f).jqGrid("showCol", h.groupField)
                        }
                    }
                    b("tr.jqgroup, tr.jqfoot", "#" + b.jgrid.jqID(f.p.id) + " tbody:first").remove();
                    b("tr.jqgrow:hidden", "#" + b.jgrid.jqID(f.p.id) + " tbody:first").show()
                } else {
                    b(f).trigger("reloadGrid")
                }
            })
        },
        groupingCalculations: {
            handler: function(n, k, m, a, l, r) {
                var q = {
                    sum: function() {
                        return parseFloat(k || 0) + parseFloat((r[m] || 0))
                    },
                    min: function() {
                        if (k === "") {
                            return parseFloat(r[m] || 0)
                        }
                        return Math.min(parseFloat(k), parseFloat(r[m] || 0))
                    },
                    max: function() {
                        if (k === "") {
                            return parseFloat(r[m] || 0)
                        }
                        return Math.max(parseFloat(k), parseFloat(r[m] || 0))
                    },
                    count: function() {
                        if (k === "") {
                            k = 0
                        }
                        if (r.hasOwnProperty(m)) {
                            return k + 1
                        }
                        return 0
                    },
                    avg: function() {
                        return q.sum()
                    }
                };
                if (!q[n]) {
                    throw ("jqGrid Grouping No such method: " + n)
                }
                var o = q[n]();
                if (a != null) {
                    if (l === "fixed") {
                        o = o.toFixed(a)
                    } else {
                        var p = Math.pow(10, a);
                        o = Math.round(o * p) / p
                    }
                }
                return o
            }
        }
    })
}
)(jQuery);
(function(b) {
    b.jgrid.extend({
        jqGridImport: function(a) {
            a = b.extend({
                imptype: "xml",
                impstring: "",
                impurl: "",
                mtype: "GET",
                impData: {},
                xmlGrid: {
                    config: "roots>grid",
                    data: "roots>rows"
                },
                jsonGrid: {
                    config: "grid",
                    data: "data"
                },
                ajaxOptions: {}
            }, a || {});
            return this.each(function() {
                var g = this;
                var j = function(p, c) {
                    var q = b(c.xmlGrid.config, p)[0];
                    var d = b(c.xmlGrid.data, p)[0], r, f, o;
                    if (xmlJsonClass.xml2json && b.jgrid.parse) {
                        r = xmlJsonClass.xml2json(q, " ");
                        r = b.jgrid.parse(r);
                        for (o in r) {
                            if (r.hasOwnProperty(o)) {
                                f = r[o]
                            }
                        }
                        if (d) {
                            var e = r.grid.datatype;
                            r.grid.datatype = "xmlstring";
                            r.grid.datastr = p;
                            b(g).jqGrid(f).jqGrid("setGridParam", {
                                datatype: e
                            })
                        } else {
                            b(g).jqGrid(f)
                        }
                        r = null;
                        f = null
                    } else {
                        alert("xml2json or parse are not present")
                    }
                };
                var h = function(n, d) {
                    if (n && typeof n === "string") {
                        var p = false;
                        if (b.jgrid.useJSON) {
                            b.jgrid.useJSON = false;
                            p = true
                        }
                        var o = b.jgrid.parse(n);
                        if (p) {
                            b.jgrid.useJSON = true
                        }
                        var c = o[d.jsonGrid.config];
                        var f = o[d.jsonGrid.data];
                        if (f) {
                            var e = c.datatype;
                            c.datatype = "jsonstring";
                            c.datastr = f;
                            b(g).jqGrid(c).jqGrid("setGridParam", {
                                datatype: e
                            })
                        } else {
                            b(g).jqGrid(c)
                        }
                    }
                };
                switch (a.imptype) {
                case "xml":
                    b.ajax(b.extend({
                        url: a.impurl,
                        type: a.mtype,
                        data: a.impData,
                        dataType: "xml",
                        complete: function(d, c) {
                            if (c === "success") {
                                j(d.responseXML, a);
                                b(g).triggerHandler("jqGridImportComplete", [d, a]);
                                if (b.isFunction(a.importComplete)) {
                                    a.importComplete(d)
                                }
                            }
                            d = null
                        }
                    }, a.ajaxOptions));
                    break;
                case "xmlstring":
                    if (a.impstring && typeof a.impstring === "string") {
                        var i = b.parseXML(a.impstring);
                        if (i) {
                            j(i, a);
                            b(g).triggerHandler("jqGridImportComplete", [i, a]);
                            if (b.isFunction(a.importComplete)) {
                                a.importComplete(i)
                            }
                            a.impstring = null
                        }
                        i = null
                    }
                    break;
                case "json":
                    b.ajax(b.extend({
                        url: a.impurl,
                        type: a.mtype,
                        data: a.impData,
                        dataType: "json",
                        complete: function(c) {
                            try {
                                h(c.responseText, a);
                                b(g).triggerHandler("jqGridImportComplete", [c, a]);
                                if (b.isFunction(a.importComplete)) {
                                    a.importComplete(c)
                                }
                            } catch (d) {}
                            c = null
                        }
                    }, a.ajaxOptions));
                    break;
                case "jsonstring":
                    if (a.impstring && typeof a.impstring === "string") {
                        h(a.impstring, a);
                        b(g).triggerHandler("jqGridImportComplete", [a.impstring, a]);
                        if (b.isFunction(a.importComplete)) {
                            a.importComplete(a.impstring)
                        }
                        a.impstring = null
                    }
                    break
                }
            })
        },
        jqGridExport: function(d) {
            d = b.extend({
                exptype: "xmlstring",
                root: "grid",
                ident: "\t"
            }, d || {});
            var a = null;
            this.each(function() {
                if (!this.grid) {
                    return
                }
                var f, c = b.extend(true, {}, b(this).jqGrid("getGridParam"));
                if (c.rownumbers) {
                    c.colNames.splice(0, 1);
                    c.colModel.splice(0, 1)
                }
                if (c.multiselect) {
                    c.colNames.splice(0, 1);
                    c.colModel.splice(0, 1)
                }
                if (c.subGrid) {
                    c.colNames.splice(0, 1);
                    c.colModel.splice(0, 1)
                }
                c.knv = null;
                if (c.treeGrid) {
                    for (f in c.treeReader) {
                        if (c.treeReader.hasOwnProperty(f)) {
                            c.colNames.splice(c.colNames.length - 1);
                            c.colModel.splice(c.colModel.length - 1)
                        }
                    }
                }
                switch (d.exptype) {
                case "xmlstring":
                    a = "<" + d.root + ">" + xmlJsonClass.json2xml(c, d.ident) + "</" + d.root + ">";
                    break;
                case "jsonstring":
                    a = "{" + xmlJsonClass.toJson(c, d.root, d.ident, false) + "}";
                    if (c.postData.filters !== undefined) {
                        a = a.replace(/filters":"/, 'filters":');
                        a = a.replace(/}]}"/, "}]}")
                    }
                    break
                }
            });
            return a
        },
        excelExport: function(a) {
            a = b.extend({
                exptype: "remote",
                url: null,
                oper: "oper",
                tag: "excel",
                exportOptions: {}
            }, a || {});
            return this.each(function() {
                if (!this.grid) {
                    return
                }
                var h;
                if (a.exptype === "remote") {
                    var g = b.extend({}, this.p.postData);
                    g[a.oper] = a.tag;
                    var f = jQuery.param(g);
                    if (a.url.indexOf("?") !== -1) {
                        h = a.url + "&" + f
                    } else {
                        h = a.url + "?" + f
                    }
                    window.location = h
                }
            })
        }
    })
}
)(jQuery);
(function($) {
    if ($.jgrid.msie && $.jgrid.msiever() === 8) {
        $.expr[":"].hidden = function(elem) {
            return elem.offsetWidth === 0 || elem.offsetHeight === 0 || elem.style.display === "none"
        }
    }
    $.jgrid._multiselect = false;
    if ($.ui) {
        if ($.ui.multiselect) {
            if ($.ui.multiselect.prototype._setSelected) {
                var setSelected = $.ui.multiselect.prototype._setSelected;
                $.ui.multiselect.prototype._setSelected = function(item, selected) {
                    var ret = setSelected.call(this, item, selected);
                    if (selected && this.selectedList) {
                        var elt = this.element;
                        this.selectedList.find("li").each(function() {
                            if ($(this).data("optionLink")) {
                                $(this).data("optionLink").remove().appendTo(elt)
                            }
                        })
                    }
                    return ret
                }
            }
            if ($.ui.multiselect.prototype.destroy) {
                $.ui.multiselect.prototype.destroy = function() {
                    this.element.show();
                    this.container.remove();
                    if ($.Widget === undefined) {
                        $.widget.prototype.destroy.apply(this, arguments)
                    } else {
                        $.Widget.prototype.destroy.apply(this, arguments)
                    }
                }
            }
            $.jgrid._multiselect = true
        }
    }
    $.jgrid.extend({
        sortableColumns: function(tblrow) {
            return this.each(function() {
                var ts = this
                  , tid = $.jgrid.jqID(ts.p.id);
                function start() {
                    ts.p.disableClick = true
                }
                var sortable_opts = {
                    tolerance: "pointer",
                    axis: "x",
                    scrollSensitivity: "1",
                    items: ">th:not(:has(#jqgh_" + tid + "_cb,#jqgh_" + tid + "_rn,#jqgh_" + tid + "_subgrid),:hidden)",
                    placeholder: {
                        element: function(item) {
                            var el = $(document.createElement(item[0].nodeName)).addClass(item[0].className + " ui-sortable-placeholder ui-state-highlight").removeClass("ui-sortable-helper")[0];
                            return el
                        },
                        update: function(self, p) {
                            p.height(self.currentItem.innerHeight() - parseInt(self.currentItem.css("paddingTop") || 0, 10) - parseInt(self.currentItem.css("paddingBottom") || 0, 10));
                            p.width(self.currentItem.innerWidth() - parseInt(self.currentItem.css("paddingLeft") || 0, 10) - parseInt(self.currentItem.css("paddingRight") || 0, 10))
                        }
                    },
                    update: function(event, ui) {
                        var p = $(ui.item).parent()
                          , th = $(">th", p)
                          , colModel = ts.p.colModel
                          , cmMap = {}
                          , tid = ts.p.id + "_";
                        $.each(colModel, function(i) {
                            cmMap[this.name] = i
                        });
                        var permutation = [];
                        th.each(function() {
                            var id = $(">div", this).get(0).id.replace(/^jqgh_/, "").replace(tid, "");
                            if (cmMap.hasOwnProperty(id)) {
                                permutation.push(cmMap[id])
                            }
                        });
                        $(ts).jqGrid("remapColumns", permutation, true, true);
                        if ($.isFunction(ts.p.sortable.update)) {
                            ts.p.sortable.update(permutation)
                        }
                        if ($.isFunction(ts.p.sortableColumnsDone)) {
                            ts.p.sortableColumnsDone.call(ts)
                        }
                        setTimeout(function() {
                            ts.p.disableClick = false
                        }, 50)
                    }
                };
                if (ts.p.sortable.options) {
                    $.extend(sortable_opts, ts.p.sortable.options)
                } else {
                    if ($.isFunction(ts.p.sortable)) {
                        ts.p.sortable = {
                            update: ts.p.sortable
                        }
                    }
                }
                if (sortable_opts.start) {
                    var s = sortable_opts.start;
                    sortable_opts.start = function(e, ui) {
                        start();
                        s.call(this, e, ui)
                    }
                } else {
                    sortable_opts.start = start
                }
                if (ts.p.sortable.exclude) {
                    sortable_opts.items += ":not(" + ts.p.sortable.exclude + ")"
                }
                tblrow.sortable(sortable_opts).data("sortable").floating = true
            })
        },
        columnChooser: function(opts) {
            var self = this;
            if ($("#colchooser_" + $.jgrid.jqID(self[0].p.id)).length) {
                return
            }
            var selector = $('<div id="colchooser_' + self[0].p.id + '" style="position:relative;overflow:hidden"><div><select multiple="multiple"></select></div></div>');
            var select = $("select", selector);
            function insert(perm, i, v) {
                if (i >= 0) {
                    var a = perm.slice();
                    var b = a.splice(i, Math.max(perm.length - i, i));
                    if (i > perm.length) {
                        i = perm.length
                    }
                    a[i] = v;
                    return a.concat(b)
                }
            }
            opts = $.extend({
                width: 420,
                height: 240,
                classname: null,
                done: function(perm) {
                    if (perm) {
                        self.jqGrid("remapColumns", perm, true)
                    }
                },
                msel: "multiselect",
                dlog: "dialog",
                dialog_opts: {
                    minWidth: 470
                },
                dlog_opts: function(opts) {
                    var buttons = {};
                    buttons[opts.bSubmit] = function() {
                        opts.apply_perm();
                        opts.cleanup(false)
                    }
                    ;
                    buttons[opts.bCancel] = function() {
                        opts.cleanup(true)
                    }
                    ;
                    return $.extend(true, {
                        buttons: buttons,
                        close: function() {
                            opts.cleanup(true)
                        },
                        modal: opts.modal || false,
                        resizable: opts.resizable || true,
                        width: opts.width + 20
                    }, opts.dialog_opts || {})
                },
                apply_perm: function() {
                    $("option", select).each(function() {
                        if (this.selected) {
                            self.jqGrid("showCol", colModel[this.value].name)
                        } else {
                            self.jqGrid("hideCol", colModel[this.value].name)
                        }
                    });
                    var perm = [];
                    $("option:selected", select).each(function() {
                        perm.push(parseInt(this.value, 10))
                    });
                    $.each(perm, function() {
                        delete colMap[colModel[parseInt(this, 10)].name]
                    });
                    $.each(colMap, function() {
                        var ti = parseInt(this, 10);
                        perm = insert(perm, ti, ti)
                    });
                    if (opts.done) {
                        opts.done.call(self, perm)
                    }
                },
                cleanup: function(calldone) {
                    call(opts.dlog, selector, "destroy");
                    call(opts.msel, select, "destroy");
                    selector.remove();
                    if (calldone && opts.done) {
                        opts.done.call(self)
                    }
                },
                msel_opts: {}
            }, $.jgrid.col, opts || {});
            if ($.ui) {
                if ($.ui.multiselect) {
                    if (opts.msel === "multiselect") {
                        if (!$.jgrid._multiselect) {
                            alert("Multiselect plugin loaded after jqGrid. Please load the plugin before the jqGrid!");
                            return
                        }
                        opts.msel_opts = $.extend($.ui.multiselect.defaults, opts.msel_opts)
                    }
                }
            }
            if (opts.caption) {
                selector.attr("title", opts.caption)
            }
            if (opts.classname) {
                selector.addClass(opts.classname);
                select.addClass(opts.classname)
            }
            if (opts.width) {
                $(">div", selector).css({
                    width: opts.width,
                    margin: "0 auto"
                });
                select.css("width", opts.width)
            }
            if (opts.height) {
                $(">div", selector).css("height", opts.height);
                select.css("height", opts.height - 10)
            }
            var colModel = self.jqGrid("getGridParam", "colModel");
            var colNames = self.jqGrid("getGridParam", "colNames");
            var colMap = {}
              , fixedCols = [];
            select.empty();
            $.each(colModel, function(i) {
                colMap[this.name] = i;
                if (this.hidedlg) {
                    if (!this.hidden) {
                        fixedCols.push(i)
                    }
                    return
                }
                select.append("<option value='" + i + "' " + (this.hidden ? "" : "selected='selected'") + ">" + $.jgrid.stripHtml(colNames[i]) + "</option>")
            });
            function call(fn, obj) {
                if (!fn) {
                    return
                }
                if (typeof fn === "string") {
                    if ($.fn[fn]) {
                        $.fn[fn].apply(obj, $.makeArray(arguments).slice(2))
                    }
                } else {
                    if ($.isFunction(fn)) {
                        fn.apply(obj, $.makeArray(arguments).slice(2))
                    }
                }
            }
            var dopts = $.isFunction(opts.dlog_opts) ? opts.dlog_opts.call(self, opts) : opts.dlog_opts;
            call(opts.dlog, selector, dopts);
            var mopts = $.isFunction(opts.msel_opts) ? opts.msel_opts.call(self, opts) : opts.msel_opts;
            call(opts.msel, select, mopts)
        },
        sortableRows: function(opts) {
            return this.each(function() {
                var $t = this;
                if (!$t.grid) {
                    return
                }
                if ($t.p.treeGrid) {
                    return
                }
                if ($.fn.sortable) {
                    opts = $.extend({
                        cursor: "move",
                        axis: "y",
                        items: ".jqgrow"
                    }, opts || {});
                    if (opts.start && $.isFunction(opts.start)) {
                        opts._start_ = opts.start;
                        delete opts.start
                    } else {
                        opts._start_ = false
                    }
                    if (opts.update && $.isFunction(opts.update)) {
                        opts._update_ = opts.update;
                        delete opts.update
                    } else {
                        opts._update_ = false
                    }
                    opts.start = function(ev, ui) {
                        $(ui.item).css("border-width", "0");
                        $("td", ui.item).each(function(i) {
                            this.style.width = $t.grid.cols[i].style.width
                        });
                        if ($t.p.subGrid) {
                            var subgid = $(ui.item).attr("id");
                            try {
                                $($t).jqGrid("collapseSubGridRow", subgid)
                            } catch (e) {}
                        }
                        if (opts._start_) {
                            opts._start_.apply(this, [ev, ui])
                        }
                    }
                    ;
                    opts.update = function(ev, ui) {
                        $(ui.item).css("border-width", "");
                        if ($t.p.rownumbers === true) {
                            $("td.jqgrid-rownum", $t.rows).each(function(i) {
                                $(this).html(i + 1 + (parseInt($t.p.page, 10) - 1) * parseInt($t.p.rowNum, 10))
                            })
                        }
                        if (opts._update_) {
                            opts._update_.apply(this, [ev, ui])
                        }
                    }
                    ;
                    $("tbody:first", $t).sortable(opts);
                    $("tbody:first", $t).disableSelection()
                }
            })
        },
        gridDnD: function(opts) {
            return this.each(function() {
                var $t = this, i, cn;
                if (!$t.grid) {
                    return
                }
                if ($t.p.treeGrid) {
                    return
                }
                if (!$t.p.draggable) {
                    return
                }
                if (!$.fn.draggable || !$.fn.droppable) {
                    return
                }
                function updateDnD() {
                    var datadnd = $.data($t, "dnd");
                    $("tr.jqgrow:not(.ui-draggable)", $t).draggable($.isFunction(datadnd.drag) ? datadnd.drag.call($($t), datadnd) : datadnd.drag)
                }
                var appender = "<table id='jqgrid_dnd' class='ui-jqgrid-dnd'></table>";
                if ($("#jqgrid_dnd")[0] === undefined) {
                    $("body").append(appender)
                }
                if (typeof opts === "string" && opts === "updateDnD" && $t.p.jqgdnd === true) {
                    updateDnD();
                    return
                }
                opts = $.extend({
                    drag: function(opts) {
                        return $.extend({
                            start: function(ev, ui) {
                                var i, subgid;
                                if ($t.p.subGrid) {
                                    subgid = $(ui.helper).attr("id");
                                    try {
                                        $($t).jqGrid("collapseSubGridRow", subgid)
                                    } catch (e) {}
                                }
                                for (i = 0; i < $.data($t, "dnd").connectWith.length; i++) {
                                    if ($($.data($t, "dnd").connectWith[i]).jqGrid("getGridParam", "reccount") === 0) {
                                        $($.data($t, "dnd").connectWith[i]).jqGrid("addRowData", "jqg_empty_row", {})
                                    }
                                }
                                ui.helper.addClass("ui-state-highlight");
                                $("td", ui.helper).each(function(i) {
                                    this.style.width = $t.grid.headers[i].width + "px"
                                });
                                if (opts.onstart && $.isFunction(opts.onstart)) {
                                    opts.onstart.call($($t), ev, ui)
                                }
                            },
                            stop: function(ev, ui) {
                                var i, ids;
                                if (ui.helper.dropped && !opts.dragcopy) {
                                    ids = $(ui.helper).attr("id");
                                    if (ids === undefined) {
                                        ids = $(this).attr("id")
                                    }
                                    $($t).jqGrid("delRowData", ids)
                                }
                                for (i = 0; i < $.data($t, "dnd").connectWith.length; i++) {
                                    $($.data($t, "dnd").connectWith[i]).jqGrid("delRowData", "jqg_empty_row")
                                }
                                if (opts.onstop && $.isFunction(opts.onstop)) {
                                    opts.onstop.call($($t), ev, ui)
                                }
                            }
                        }, opts.drag_opts || {})
                    },
                    drop: function(opts) {
                        return $.extend({
                            accept: function(d) {
                                if (!$(d).hasClass("jqgrow")) {
                                    return d
                                }
                                var tid = $(d).closest("table.ui-jqgrid-btable");
                                if (tid.length > 0 && $.data(tid[0], "dnd") !== undefined) {
                                    var cn = $.data(tid[0], "dnd").connectWith;
                                    return $.inArray("#" + $.jgrid.jqID(this.id), cn) !== -1 ? true : false
                                }
                                return false
                            },
                            drop: function(ev, ui) {
                                if (!$(ui.draggable).hasClass("jqgrow")) {
                                    return
                                }
                                var accept = $(ui.draggable).attr("id");
                                var getdata = ui.draggable.parent().parent().jqGrid("getRowData", accept);
                                if (!opts.dropbyname) {
                                    var j = 0, tmpdata = {}, nm, key;
                                    var dropmodel = $("#" + $.jgrid.jqID(this.id)).jqGrid("getGridParam", "colModel");
                                    try {
                                        for (key in getdata) {
                                            if (getdata.hasOwnProperty(key)) {
                                                nm = dropmodel[j].name;
                                                if (!(nm === "cb" || nm === "rn" || nm === "subgrid")) {
                                                    if (getdata.hasOwnProperty(key) && dropmodel[j]) {
                                                        tmpdata[nm] = getdata[key]
                                                    }
                                                }
                                                j++
                                            }
                                        }
                                        getdata = tmpdata
                                    } catch (e) {}
                                }
                                ui.helper.dropped = true;
                                if (opts.beforedrop && $.isFunction(opts.beforedrop)) {
                                    var datatoinsert = opts.beforedrop.call(this, ev, ui, getdata, $("#" + $.jgrid.jqID($t.p.id)), $(this));
                                    if (datatoinsert !== undefined && datatoinsert !== null && typeof datatoinsert === "object") {
                                        getdata = datatoinsert
                                    }
                                }
                                if (ui.helper.dropped) {
                                    var grid;
                                    if (opts.autoid) {
                                        if ($.isFunction(opts.autoid)) {
                                            grid = opts.autoid.call(this, getdata)
                                        } else {
                                            grid = Math.ceil(Math.random() * 1000);
                                            grid = opts.autoidprefix + grid
                                        }
                                    }
                                    $("#" + $.jgrid.jqID(this.id)).jqGrid("addRowData", grid, getdata, opts.droppos)
                                }
                                if (opts.ondrop && $.isFunction(opts.ondrop)) {
                                    opts.ondrop.call(this, ev, ui, getdata)
                                }
                            }
                        }, opts.drop_opts || {})
                    },
                    onstart: null,
                    onstop: null,
                    beforedrop: null,
                    ondrop: null,
                    drop_opts: {
                        activeClass: "ui-state-active",
                        hoverClass: "ui-state-hover"
                    },
                    drag_opts: {
                        revert: "invalid",
                        helper: "clone",
                        cursor: "move",
                        appendTo: "#jqgrid_dnd",
                        zIndex: 5000
                    },
                    dragcopy: false,
                    dropbyname: false,
                    droppos: "first",
                    autoid: true,
                    autoidprefix: "dnd_"
                }, opts || {});
                if (!opts.connectWith) {
                    return
                }
                opts.connectWith = opts.connectWith.split(",");
                opts.connectWith = $.map(opts.connectWith, function(n) {
                    return $.trim(n)
                });
                $.data($t, "dnd", opts);
                if ($t.p.reccount !== 0 && !$t.p.jqgdnd) {
                    updateDnD()
                }
                $t.p.jqgdnd = true;
                for (i = 0; i < opts.connectWith.length; i++) {
                    cn = opts.connectWith[i];
                    $(cn).droppable($.isFunction(opts.drop) ? opts.drop.call($($t), opts) : opts.drop)
                }
            })
        },
        gridResize: function(opts) {
            return this.each(function() {
                var $t = this
                  , gID = $.jgrid.jqID($t.p.id);
                if (!$t.grid || !$.fn.resizable) {
                    return
                }
                opts = $.extend({}, opts || {});
                if (opts.alsoResize) {
                    opts._alsoResize_ = opts.alsoResize;
                    delete opts.alsoResize
                } else {
                    opts._alsoResize_ = false
                }
                if (opts.stop && $.isFunction(opts.stop)) {
                    opts._stop_ = opts.stop;
                    delete opts.stop
                } else {
                    opts._stop_ = false
                }
                opts.stop = function(ev, ui) {
                    $($t).jqGrid("setGridParam", {
                        height: $("#gview_" + gID + " .ui-jqgrid-bdiv").height()
                    });
                    $($t).jqGrid("setGridWidth", ui.size.width, opts.shrinkToFit);
                    if (opts._stop_) {
                        opts._stop_.call($t, ev, ui)
                    }
                }
                ;
                if (opts._alsoResize_) {
                    var optstest = "{'#gview_" + gID + " .ui-jqgrid-bdiv':true,'" + opts._alsoResize_ + "':true}";
                    opts.alsoResize = eval("(" + optstest + ")")
                } else {
                    opts.alsoResize = $(".ui-jqgrid-bdiv", "#gview_" + gID)
                }
                delete opts._alsoResize_;
                $("#gbox_" + gID).resizable(opts)
            })
        }
    })
}
)(jQuery);
function tableToGrid(d, c) {
    jQuery(d).each(function() {
        if (this.grid) {
            return
        }
        jQuery(this).width("99%");
        var p = jQuery(this).width();
        var a = jQuery("tr td:first-child input[type=checkbox]:first", jQuery(this));
        var u = jQuery("tr td:first-child input[type=radio]:first", jQuery(this));
        var y = a.length > 0;
        var v = !y && u.length > 0;
        var t = y || v;
        var r = [];
        var b = [];
        jQuery("th", jQuery(this)).each(function() {
            if (r.length === 0 && t) {
                r.push({
                    name: "__selection__",
                    index: "__selection__",
                    width: 0,
                    hidden: true
                });
                b.push("__selection__")
            } else {
                r.push({
                    name: jQuery(this).attr("id") || jQuery.trim(jQuery.jgrid.stripHtml(jQuery(this).html())).split(" ").join("_"),
                    index: jQuery(this).attr("id") || jQuery.trim(jQuery.jgrid.stripHtml(jQuery(this).html())).split(" ").join("_"),
                    width: jQuery(this).width() || 150
                });
                b.push(jQuery(this).html())
            }
        });
        var w = [];
        var x = [];
        var q = [];
        jQuery("tbody > tr", jQuery(this)).each(function() {
            var e = {};
            var f = 0;
            jQuery("td", jQuery(this)).each(function() {
                if (f === 0 && t) {
                    var h = jQuery("input", jQuery(this));
                    var g = h.attr("value");
                    x.push(g || w.length);
                    if (h.is(":checked")) {
                        q.push(g)
                    }
                    e[r[f].name] = h.attr("value")
                } else {
                    e[r[f].name] = jQuery(this).html()
                }
                f++
            });
            if (f > 0) {
                w.push(e)
            }
        });
        jQuery(this).empty();
        jQuery(this).addClass("scroll");
        jQuery(this).jqGrid(jQuery.extend({
            datatype: "local",
            width: p,
            colNames: b,
            colModel: r,
            multiselect: y
        }, c || {}));
        var s;
        for (s = 0; s < w.length; s++) {
            var z = null;
            if (x.length > 0) {
                z = x[s];
                if (z && z.replace) {
                    z = encodeURIComponent(z).replace(/[.\-%]/g, "_")
                }
            }
            if (z === null) {
                z = s + 1
            }
            jQuery(this).jqGrid("addRowData", z, w[s])
        }
        for (s = 0; s < q.length; s++) {
            jQuery(this).jqGrid("setSelection", q[s])
        }
    })
}
(function(c) {
    function d(i, j) {
        var k, a, l = [], b;
        if (!this || typeof i !== "function" || (i instanceof RegExp)) {
            throw new TypeError()
        }
        b = this.length;
        for (k = 0; k < b; k++) {
            if (this.hasOwnProperty(k)) {
                a = this[k];
                if (i.call(j, a, k, this)) {
                    l.push(a);
                    break
                }
            }
        }
        return l
    }
    c.assocArraySize = function(a) {
        var b = 0, f;
        for (f in a) {
            if (a.hasOwnProperty(f)) {
                b++
            }
        }
        return b
    }
    ;
    c.jgrid.extend({
        pivotSetup: function(m, a) {
            var o = []
              , l = []
              , b = []
              , n = []
              , r = {
                grouping: true,
                groupingView: {
                    groupField: [],
                    groupSummary: [],
                    groupSummaryPos: []
                }
            }
              , p = []
              , q = c.extend({
                rowTotals: false,
                rowTotalsText: "Total",
                colTotals: false,
                groupSummary: true,
                groupSummaryPos: "header",
                frozenStaticCols: false
            }, a || {});
            this.each(function() {
                var ad, ai, T, e = m.length, af, k, ac, g, ab, R = 0;
                function ah(t, u, v) {
                    var s;
                    s = d.call(t, u, v);
                    return s.length > 0 ? s[0] : null
                }
                function ae(s, u) {
                    var v = 0, w = true, t;
                    for (t in s) {
                        if (s[t] != this[v]) {
                            w = false;
                            break
                        }
                        v++;
                        if (v >= this.length) {
                            break
                        }
                    }
                    if (w) {
                        ai = u
                    }
                    return w
                }
                function V(s, w, t, u) {
                    var v;
                    switch (s) {
                    case "sum":
                        v = parseFloat(w || 0) + parseFloat((u[t] || 0));
                        break;
                    case "count":
                        if (w === "" || w == null) {
                            w = 0
                        }
                        if (u.hasOwnProperty(t)) {
                            v = w + 1
                        } else {
                            v = 0
                        }
                        break;
                    case "min":
                        if (w === "" || w == null) {
                            v = parseFloat(u[t] || 0)
                        } else {
                            v = Math.min(parseFloat(w), parseFloat(u[t] || 0))
                        }
                        break;
                    case "max":
                        if (w === "" || w == null) {
                            v = parseFloat(u[t] || 0)
                        } else {
                            v = Math.max(parseFloat(w), parseFloat(u[t] || 0))
                        }
                        break
                    }
                    return v
                }
                function f(t, B, v, D) {
                    var C = B.length, z, w, A, u;
                    if (c.isArray(v)) {
                        u = v.length
                    } else {
                        u = 1
                    }
                    n = [];
                    n.root = 0;
                    for (A = 0; A < u; A++) {
                        var x = [], s;
                        for (z = 0; z < C; z++) {
                            if (v == null) {
                                w = c.trim(B[z].member) + "_" + B[z].aggregator;
                                s = w
                            } else {
                                s = v[A].replace(/\s+/g, "");
                                try {
                                    w = (C === 1 ? s : s + "_" + B[z].aggregator + "_" + z)
                                } catch (y) {}
                            }
                            D[w] = x[w] = V(B[z].aggregator, D[w], B[z].member, t)
                        }
                        n[s] = x
                    }
                    return D
                }
                if (q.rowTotals && q.yDimension.length > 0) {
                    var Z = q.yDimension[0].dataName;
                    q.yDimension.splice(0, 0, {
                        dataName: Z
                    });
                    q.yDimension[0].converter = function() {
                        return "_r_Totals"
                    }
                }
                af = c.isArray(q.xDimension) ? q.xDimension.length : 0;
                k = q.yDimension.length;
                ac = c.isArray(q.aggregates) ? q.aggregates.length : 0;
                if (af === 0 || ac === 0) {
                    throw ("xDimension or aggregates optiona are not set!")
                }
                var j;
                for (T = 0; T < af; T++) {
                    j = {
                        name: q.xDimension[T].dataName,
                        frozen: q.frozenStaticCols
                    };
                    j = c.extend(true, j, q.xDimension[T]);
                    o.push(j)
                }
                var X = af - 1
                  , S = {};
                while (R < e) {
                    ad = m[R];
                    var aa = [];
                    var i = [];
                    g = {};
                    T = 0;
                    do {
                        aa[T] = c.trim(ad[q.xDimension[T].dataName]);
                        g[q.xDimension[T].dataName] = aa[T];
                        T++
                    } while (T < af);var U = 0;
                    ai = -1;
                    ab = ah(l, ae, aa);
                    if (!ab) {
                        U = 0;
                        if (k >= 1) {
                            for (U = 0; U < k; U++) {
                                i[U] = c.trim(ad[q.yDimension[U].dataName]);
                                if (q.yDimension[U].converter && c.isFunction(q.yDimension[U].converter)) {
                                    i[U] = q.yDimension[U].converter.call(this, i[U], aa, i)
                                }
                            }
                            g = f(ad, q.aggregates, i, g)
                        } else {
                            if (k === 0) {
                                g = f(ad, q.aggregates, null, g)
                            }
                        }
                        l.push(g)
                    } else {
                        if (ai >= 0) {
                            U = 0;
                            if (k >= 1) {
                                for (U = 0; U < k; U++) {
                                    i[U] = c.trim(ad[q.yDimension[U].dataName]);
                                    if (q.yDimension[U].converter && c.isFunction(q.yDimension[U].converter)) {
                                        i[U] = q.yDimension[U].converter.call(this, i[U], aa, i)
                                    }
                                }
                                ab = f(ad, q.aggregates, i, ab)
                            } else {
                                if (k === 0) {
                                    ab = f(ad, q.aggregates, null, ab)
                                }
                            }
                            l[ai] = ab
                        }
                    }
                    var ak = 0, ag = null, aj = null, al;
                    for (al in n) {
                        if (ak === 0) {
                            if (!S.children || S.children === undefined) {
                                S = {
                                    text: al,
                                    level: 0,
                                    children: []
                                }
                            }
                            ag = S.children
                        } else {
                            aj = null;
                            for (T = 0; T < ag.length; T++) {
                                if (ag[T].text === al) {
                                    aj = ag[T];
                                    break
                                }
                            }
                            if (aj) {
                                ag = aj.children
                            } else {
                                ag.push({
                                    children: [],
                                    text: al,
                                    level: ak,
                                    fields: n[al]
                                });
                                ag = ag[ag.length - 1].children
                            }
                        }
                        ak++
                    }
                    R++
                }
                var am = []
                  , ao = o.length
                  , W = ao;
                if (k > 0) {
                    p[k - 1] = {
                        useColSpanStyle: false,
                        groupHeaders: []
                    }
                }
                function h(v) {
                    var y, w, t, x, A;
                    for (t in v) {
                        if (v.hasOwnProperty(t)) {
                            if (typeof v[t] !== "object") {
                                if (t === "level") {
                                    if (am[v.level] === undefined) {
                                        am[v.level] = "";
                                        if (v.level > 0 && v.text !== "_r_Totals") {
                                            p[v.level - 1] = {
                                                useColSpanStyle: false,
                                                groupHeaders: []
                                            }
                                        }
                                    }
                                    if (am[v.level] !== v.text && v.children.length && v.text !== "_r_Totals") {
                                        if (v.level > 0) {
                                            p[v.level - 1].groupHeaders.push({
                                                titleText: v.text
                                            });
                                            var s = p[v.level - 1].groupHeaders.length
                                              , z = s === 1 ? W : ao + (s - 1) * ac;
                                            p[v.level - 1].groupHeaders[s - 1].startColumnName = o[z].name;
                                            p[v.level - 1].groupHeaders[s - 1].numberOfColumns = o.length - z;
                                            ao = o.length
                                        }
                                    }
                                    am[v.level] = v.text
                                }
                                if (v.level === k && t === "level" && k > 0) {
                                    if (ac > 1) {
                                        var u = 1;
                                        for (y in v.fields) {
                                            if (u === 1) {
                                                p[k - 1].groupHeaders.push({
                                                    startColumnName: y,
                                                    numberOfColumns: 1,
                                                    titleText: v.text
                                                })
                                            }
                                            u++
                                        }
                                        p[k - 1].groupHeaders[p[k - 1].groupHeaders.length - 1].numberOfColumns = u - 1
                                    } else {
                                        p.splice(k - 1, 1)
                                    }
                                }
                            }
                            if (v[t] != null && typeof v[t] === "object") {
                                h(v[t])
                            }
                            if (t === "level") {
                                if (v.level > 0) {
                                    w = 0;
                                    for (y in v.fields) {
                                        A = {};
                                        for (x in q.aggregates[w]) {
                                            if (q.aggregates[w].hasOwnProperty(x)) {
                                                switch (x) {
                                                case "member":
                                                case "label":
                                                case "aggregator":
                                                    break;
                                                default:
                                                    A[x] = q.aggregates[w][x]
                                                }
                                            }
                                        }
                                        if (ac > 1) {
                                            A.name = y;
                                            A.label = q.aggregates[w].label || y
                                        } else {
                                            A.name = v.text;
                                            A.label = v.text === "_r_Totals" ? q.rowTotalsText : v.text
                                        }
                                        o.push(A);
                                        w++
                                    }
                                }
                            }
                        }
                    }
                }
                h(S, 0);
                var an;
                if (q.colTotals) {
                    var Y = l.length;
                    while (Y--) {
                        for (T = af; T < o.length; T++) {
                            an = o[T].name;
                            if (!b[an]) {
                                b[an] = parseFloat(l[Y][an] || 0)
                            } else {
                                b[an] += parseFloat(l[Y][an] || 0)
                            }
                        }
                    }
                }
                if (X > 0) {
                    for (T = 0; T < X; T++) {
                        r.groupingView.groupField[T] = o[T].name;
                        r.groupingView.groupSummary[T] = q.groupSummary;
                        r.groupingView.groupSummaryPos[T] = q.groupSummaryPos
                    }
                } else {
                    r.grouping = false
                }
                r.sortname = o[X].name;
                r.groupingView.hideFirstGroupCol = true
            });
            return {
                colModel: o,
                rows: l,
                groupOptions: r,
                groupHeaders: p,
                summary: b
            }
        },
        jqPivot: function(a, g, h, b) {
            return this.each(function() {
                var e = this;
                function f(t) {
                    var q = jQuery(e).jqGrid("pivotSetup", t, g), s = c.assocArraySize(q.summary) > 0 ? true : false, i = c.jgrid.from(q.rows), p;
                    for (p = 0; p < q.groupOptions.groupingView.groupField.length; p++) {
                        i.orderBy(q.groupOptions.groupingView.groupField[p], "a", "text", "")
                    }
                    jQuery(e).jqGrid(c.extend({
                        datastr: c.extend(i.select(), s ? {
                            userdata: q.summary
                        } : {}),
                        datatype: "jsonstring",
                        footerrow: s,
                        userDataOnFooter: s,
                        colModel: q.colModel,
                        viewrecords: true,
                        sortname: g.xDimension[0].dataName
                    }, h || {}, q.groupOptions));
                    var r = q.groupHeaders;
                    if (r.length) {
                        for (p = 0; p < r.length; p++) {
                            if (r[p] && r[p].groupHeaders.length) {
                                jQuery(e).jqGrid("setGroupHeaders", r[p])
                            }
                        }
                    }
                    if (g.frozenStaticCols) {
                        jQuery(e).jqGrid("setFrozenColumns")
                    }
                }
                if (typeof a === "string") {
                    c.ajax(c.extend({
                        url: a,
                        dataType: "json",
                        success: function(j) {
                            f(c.jgrid.getAccessor(j, b && b.reader ? b.reader : "rows"))
                        }
                    }, b || {}))
                } else {
                    f(a)
                }
            })
        }
    })
}
)(jQuery);
