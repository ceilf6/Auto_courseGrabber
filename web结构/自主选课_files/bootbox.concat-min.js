;
(function(a, b) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], b)
    } else {
        if (typeof exports === "object") {
            module.exports = b(require("jquery"))
        } else {
            a.bootbox = b(a.jQuery)
        }
    }
}(this, function init(j, d) {
    var n = {
        dialog: "<div class='bootbox modal sl_mod' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'><div class='modal-dialog'><div class='modal-content'><div class='modal-body'><div class='bootbox-body'></div></div></div></div></div>",
        header: "<div class='modal-header'><h4 class='modal-title'></h4></div>",
        progress: "<div class='modal-progress'><div class='progress' ><div class='progress-bar progress-bar-info progress-bar-striped active' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100'  style='width: 0%;'>0%</div></div></div>",
        footer: "<div class='modal-footer'></div>",
        fixed: "<div class='modal-fixed'></div>",
        fullScreen: "<div class='bootbox-full'><span class='fa fa-square'></span></div>",
        closeButton: '<input type="hidden" name="focusInput"/><button type="button" class="bootbox-close-button btn-sm close bootbox-close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>',
        form: "<form class='bootbox-form'></form>",
        inputs: {
            text: "<input class='bootbox-input bootbox-input-text form-control' autocomplete=off type=text />",
            textarea: "<textarea class='bootbox-input bootbox-input-textarea form-control'></textarea>",
            email: "<input class='bootbox-input bootbox-input-email form-control' autocomplete='off' type='email' />",
            select: "<select class='bootbox-input bootbox-input-select form-control'></select>",
            checkbox: "<div class='checkbox'><label><input class='bootbox-input bootbox-input-checkbox' type='checkbox' /></label></div>",
            date: "<input class='bootbox-input bootbox-input-date form-control' autocomplete=off type='date' />",
            time: "<input class='bootbox-input bootbox-input-time form-control' autocomplete=off type='time' />",
            number: "<input class='bootbox-input bootbox-input-number form-control' autocomplete=off type='number' />",
            password: "<input class='bootbox-input bootbox-input-password form-control' autocomplete='off' type='password' />"
        }
    };
    var g = {
        locale: "en",
        backdrop: true,
        animate: true,
        className: null,
        closeButton: true,
        show: true,
        fullScreen: true,
        progress: false,
        progressID: "bootboxStatus",
        btnlock: false,
        draggable: false,
        container: "body",
        width: "800px",
        height: d,
        max_height: d,
        fixedTarget: null,
        offAtOnce: true,
        offsetHeight: 200,
        offsetWidth: 20,
        beforeRender: j.noop,
        afterRender: j.noop
    };
    var i = {};

    function q(s) {
        var r = a[g.locale];
        return r ? r[s] : a.en[s]
    }

    function e(v, u, s, x) {
        v.stopPropagation();
        v.preventDefault();
        var w = j.extend({}, this, {
            options: s,
            api: window.api,
            content: self || window,
            dialog: u,
            document: u.find(".bootbox-body"),
            close: function() {
                u.modal("hide")
            },
            reload: function() {
                if (j.trim(s.href).length > 0) {
                    var B = u.find(".modal-body");
                    var A = u.find(".modal-dialog");
                    var z = '<h3 class="header smaller lighter grey loading-spinner align-center"  style="min-height: 100px !important;"><i class="icon-spinner icon-spin orange bigger-160"></i><span>&nbsp;&nbsp;\u9875\u9762\u6b63\u5728\u52a0\u8f7d\u4e2d...</span></h3>';
                    B.find(".bootbox-body").empty().html(z);
                    if (s.href.indexOf("?") > -1) {
                        s.href = s.href + "&time=" + (new Date()).getTime()
                    } else {
                        s.href = s.href + "?time=" + (new Date()).getTime()
                    }
                    window.api = {
                        data: s.data || {},
                        opener: s.opener,
                        document: u.find(".bootbox-body")
                    };
                    var y = j.extend(true, {}, s.data || {});
                    delete y.colModel;
                    window.setTimeout(function() {
                        j.ajaxSetup({
                            async: true
                        });
                        B.find(".bootbox-body").empty().load(s.href, y, function() {
                            s.isLoaded = true;
                            u.triggerHandler("loaded.bs.modal")
                        });
                        j.ajaxSetup({
                            async: false
                        })
                    }, 200)
                }
            },
            button: function(z) {
                if (z && z.id) {
                    var y = j.extend(true, {}, z);
                    delete y.id;
                    u.find(".modal-footer").find("button[data-bb-handler='" + z.id + "']").prop(y)
                }
            }
        });
        if (s.btnlock) {
            var t = j(v.target);
            j.when(j.Deferred(function(z) {
                t.button("loading");
                var y = j.isFunction(x) && x.call(j.extend(w, {
                    reset: function() {
                        z.resolve()
                    }
                }), v) === false;
                if (!y) {
                    u.modal("hide")
                }
            }).promise()).always(function() {
                t.button("reset")
            })
        } else {
            var r = j.isFunction(x) && x.call(j.extend(w, {
                reset: function() {}
            }), v) === false;
            if (!r) {
                u.modal("hide")
            }
        }
    }

    function k(u) {
        var r, s = 0;
        for (r in u) {
            s++
        }
        return s
    }

    function l(t, s) {
        var r = 0;
        j.each(t, function(u, v) {
            s(u, v, r++)
        })
    }

    function c(r) {
        var t;
        var s;
        if (typeof r !== "object") {
            throw new Error("Please supply an object of options")
        }
        if (!r.href && !r.message) {
            throw new Error("Please specify a href or message")
        }
        r = j.extend({}, g, r);
        if (!r.buttons) {
            r.buttons = {}
        }
        r.backdrop = r.backdrop ? "static" : false;
        t = r.buttons;
        s = k(t);
        l(t, function(w, v, u) {
            if (j.isFunction(v)) {
                v = t[w] = {
                    callback: v
                }
            }
            if (j.type(v) !== "object") {
                throw new Error("button with key " + w + " must be an object")
            }
            if (!v.label) {
                v.label = w
            }
            if (!v.className) {
                if (s <= 2 && u === s - 1) {
                    v.className = "btn-default"
                } else {
                    v.className = "btn-primary"
                }
            }
        });
        return r
    }

    function h(s, t) {
        var u = s.length;
        var r = {};
        if (u < 1 || u > 4) {
            throw new Error("Invalid argument length")
        }
        if (u === 3 || typeof s[0] === "string") {
            r[t[0]] = s[0];
            r[t[1]] = s[1];
            r[t[2]] = s[2]
        } else {
            if (u === 2 || typeof s[0] === "string") {
                r[t[0]] = s[0];
                r[t[1]] = s[1]
            } else {
                r = s[0]
            }
        }
        return r
    }

    function m(t, r, s) {
        return j.extend(true, {}, t, h(r, s))
    }

    function f(u, v, t, s) {
        var r = {
            className: "bootbox-" + u,
            buttons: p.apply(null, v)
        };
        return o(m(r, s, t), v)
    }

    function p() {
        var v = {};
        for (var t = 0, r = arguments.length; t < r; t++) {
            var u = arguments[t];
            var s = u.toLowerCase();
            var w = u.toUpperCase();
            v[s] = {
                label: q(w)
            }
        }
        return v
    }

    function o(r, t) {
        var s = {};
        l(t, function(u, v) {
            s[v] = true
        });
        l(r.buttons, function(u) {
            if (s[u] === d) {
                throw new Error("button key " + u + " is not allowed (options are " + t.join("\n") + ")")
            }
        });
        return r
    }
    i.alert = function() {
        var r;
        r = f("alert", ["ok"], ["title", "message", "callback"], arguments);
        r.draggable = true;
        r.fullScreen = false;
        if (arguments.length == 4) {
            j.extend(r, arguments[3])
        }
        if (r.callback && !j.isFunction(r.callback)) {
            throw new Error("alert requires callback property to be a function when provided")
        }
        r.buttons.ok.callback = r.onEscape = r.onClose = function() {
            if (j.isFunction(r.callback)) {
                return r.callback.call(this)
            }
            return true
        };
        r.isLoaded = false;
        return i.dialog(r)
    };
    i.confirm = function() {
        var r;
        r = f("confirm", ["confirm", "cancel"], ["title", "message", "callback"], arguments);
        r.draggable = true;
        r.fullScreen = false;
        if (arguments.length == 4) {
            j.extend(true, r, arguments[3])
        }
        r.buttons.cancel.callback = r.onEscape = r.onClose = function() {
            return r.callback.call(this, false)
        };
        r.buttons.confirm.callback = function() {
            return r.callback.call(this, true)
        };
        if (!j.isFunction(r.callback)) {
            throw new Error("confirm requires a callback")
        }
        r.isLoaded = false;
        return i.dialog(r)
    };
    i.prompt = function() {
        var B;
        var u;
        var y;
        var r;
        var z;
        var t;
        var x;
        r = j(n.form);
        u = {
            className: "bootbox-prompt",
            buttons: p("confirm", "cancel"),
            value: "",
            inputType: "text"
        };
        B = o(m(u, arguments, ["title", "callback"]), ["confirm", "cancel"]);
        B.draggable = true;
        B.fullScreen = false;
        if (arguments.length == 3) {
            j.extend(true, B, arguments[2])
        }
        t = (B.show === d) ? true : B.show;
        var w = ["date", "time", "number"];
        var v = document.createElement("input");
        v.setAttribute("type", B.inputType);
        if (w[B.inputType]) {
            B.inputType = v.type
        }
        B.message = r;
        B.buttons.cancel.callback = B.onEscape = B.onClose = function() {
            return B.callback.call(this, null)
        };
        B.buttons.confirm.callback = function() {
            var D;
            switch (B.inputType) {
                case "text":
                case "textarea":
                case "email":
                case "select":
                case "date":
                case "time":
                case "number":
                case "password":
                    D = z.val();
                    break;
                case "checkbox":
                    var C = z.find("input:checked");
                    D = [];
                    l(C, function(E, F) {
                        D.push(j(F).val())
                    });
                    break
            }
            return B.callback.call(this, D)
        };
        B.show = false;
        if (!B.title) {
            throw new Error("prompt requires a title")
        }
        if (!j.isFunction(B.callback)) {
            throw new Error("prompt requires a callback")
        }
        if (!n.inputs[B.inputType]) {
            throw new Error("invalid prompt type")
        }
        z = j(n.inputs[B.inputType]);
        switch (B.inputType) {
            case "text":
            case "textarea":
            case "email":
            case "date":
            case "time":
            case "number":
            case "password":
                z.val(B.value);
                break;
            case "select":
                var s = {};
                x = B.inputOptions || [];
                if (!x.length) {
                    throw new Error("prompt with select requires options")
                }
                l(x, function(C, D) {
                    var E = z;
                    if (D.value === d || D.text === d) {
                        throw new Error("given options in wrong format")
                    }
                    if (D.group) {
                        if (!s[D.group]) {
                            s[D.group] = j("<optgroup/>").attr("label", D.group)
                        }
                        E = s[D.group]
                    }
                    E.append("<option value='" + D.value + "'>" + D.text + "</option>")
                });
                l(s, function(C, D) {
                    z.append(D)
                });
                z.val(B.value);
                break;
            case "checkbox":
                var A = j.isArray(B.value) ? B.value : [B.value];
                x = B.inputOptions || [];
                if (!x.length) {
                    throw new Error("prompt with checkbox requires options")
                }
                if (!x[0].value || !x[0].text) {
                    throw new Error("given options in wrong format")
                }
                z = j("<div/>");
                l(x, function(C, D) {
                    var E = j(n.inputs[B.inputType]);
                    E.find("input").attr("value", D.value);
                    E.find("label").append(D.text);
                    l(A, function(F, G) {
                        if (G === D.value) {
                            E.find("input").prop("checked", true)
                        }
                    });
                    z.append(E)
                });
                break
        }
        if (B.placeholder) {
            z.attr("placeholder", B.placeholder)
        }
        if (B.pattern) {
            z.attr("pattern", B.pattern)
        }
        r.append(z);
        r.on("submit", function(C) {
            C.preventDefault();
            y.find(".btn-primary").click()
        });
        B.isLoaded = false;
        y = i.dialog(B);
        y.off("shown.bs.modal");
        y.on("shown.bs.modal", function() {
            z.focus()
        });
        if (t === true) {
            y.modal("show")
        }
        return y
    };
    i.loadBody = function(s, r, u) {
        if (s && r && j.trim(r.href).length > 0) {
            var w = j(s).find(".modal-body");
            if (w.size() > 0) {
                var v = '<h3 class="header smaller lighter grey loading-spinner align-center"  style="min-height: 100px !important;"><i class="icon-spinner icon-spin orange bigger-160"></i><span>&nbsp;&nbsp;\u9875\u9762\u6b63\u5728\u52a0\u8f7d\u4e2d...</span></h3>';
                w.find(".bootbox-body").html(v);
                if (r.href.indexOf("?") > -1) {
                    r.href = r.href + "&time=" + (new Date()).getTime()
                } else {
                    r.href = r.href + "?time=" + (new Date()).getTime()
                }
                window.api = {
                    data: r.data || {},
                    opener: j("div.bootbox").size() > 0 ? j("div.bootbox").last() : document.body,
                    document: s.find(".bootbox-body")
                };
                var t = j.extend(true, {}, r.data || {});
                delete t.colModel;
                j.ajaxSetup({
                    async: false
                });
                w.find(".bootbox-body").load(r.href, t, function() {
                    r.isLoaded = true;
                    u.resolve()
                });
                j.ajaxSetup({
                    async: true
                })
            }
        }
    };
    i.dialog = function(u) {
        delete g.width;
        u = c(u);
        u.opener = j("div.bootbox").size() > 0 ? j("div.bootbox").last() : document.body;
        u.beforeRender.call(this);
        var H = j(n.dialog);
        var y = H.find(".modal-body");
        var E = H.find(".modal-dialog");
        var C = H.find(".modal-header");
        var A = H.find(".bootbox-body");
        var z = H.find(".modal-footer");

        function I() {
            return (u.className == "bootbox-alert" || u.className == "bootbox-confirm" || u.className == "bootbox-prompt")
        }

        function B() {
            var L = j(window).width();
            var K = j.isFunction(u.width) ? u.width.call(this) : u.width;
            if (K && /.*%$/.test(K)) {
                return {
                    windowWidth: L,
                    realWidth: (L * parseFloat(K)) / 100
                }
            }
            K = parseInt(K);
            if (I()) {
                return {
                    windowWidth: L,
                    realWidth: K
                }
            }
            var M = Math.max(Math.min(K, L), 0);
            if (K >= L) {
                M = L - u.offsetWidth * 2
            } else {
                if (L <= 768) {
                    M = L - u.offsetWidth * 2
                } else {
                    if (K >= 300) {
                        M = K
                    } else {
                        if (L > 1280) {
                            M = L - u.offsetWidth * 4
                        } else {
                            if (L > 768 && L <= 1280) {
                                M = L - u.offsetWidth * 2
                            }
                        }
                    }
                }
            }
            M = Math.max(M, 300);
            return {
                windowWidth: L,
                realWidth: M
            }
        }

        function x() {
            y = H.find(".modal-body");
            E = H.find(".modal-dialog");
            C = H.find(".modal-header");
            A = H.find(".bootbox-body");
            z = H.find(".modal-footer");
            var L = j(window).width();
            var K = j(window).height();
            var P = j.fn.actual ? j("#navbar_container").actual("outerHeight") : j("#navbar_container").outerHeight(true);
            var M = Math.abs(K - P);
            var Q = (j.fn.actual ? E.actual("outerHeight") : E.outerHeight(true)) || E.height();
            var O = (j.fn.actual ? C.actual("outerHeight") : C.outerHeight(true)) || C.height();
            var S = (j.fn.actual ? z.actual("outerHeight") : z.outerHeight(true)) || z.height();
            var N = Q - O - S;
            var R = Math.abs(Math.abs(M - u.offsetHeight) - O - S);
            return {
                windowWidth: L,
                windowHeight: K,
                navbarHeight: P,
                containerHeight: M,
                dialogHeight: Q,
                headerHeight: O,
                contentHeight: N,
                footerHeight: S,
                maxHeight: R,
                top: function() {
                    if (I()) {
                        return (K - Q) / 2
                    }
                    return (M - Q) / 2 + P
                }.call(this)
            }
        }

        function v() {
            var N = x();
            var K = B();
            var M = K.realWidth;
            var O;
            if ((Math.max(N.top, 0) < 50)) {
                O = (Math.max(N.top, 0))
            } else {
                O = (Math.max(N.top, 0) - 50)
            }
            if (u.draggable && j.fn.draggable) {
                E.addClass("modal-dialog-reset");
                var L = (K.windowWidth - E.width()) / 2;
                if (K.windowWidth > 768 || I()) {
                    E.attr({
                        style: "width: " + M + "px;"
                    });
                    E.css({
                        left: L + "px",
                        top: O + "px",
                        width: M + "px"
                    })
                } else {
                    E.css({
                        left: L + "px",
                        top: (N.navbarHeight) + "px",
                        width: M + "px"
                    })
                }
            } else {
                if (K.windowWidth > 768 || I()) {
                    E.attr({
                        style: "width: " + M + "px;"
                    });
                    E.css({
                        top: O + "px",
                        width: M + "px"
                    })
                } else {
                    E.css({
                        top: (N.navbarHeight) + "px",
                        width: M + "px"
                    })
                }
            }
            D()
        }

        function D() {
            setTimeout(function() {
                var K = j(window).height();
                var L;
                var M = H.find(".modal-body").height();
                if (H.hasClass("box-full-screen")) {
                    L = K - 140
                } else {
                    L = K - 200
                }
                if (L > 350 && M > 300) {
                    E.find(".modal-body").css({
                        "max-height": (u.max_height ? u.max_height : L)
                    })
                } else {
                    E.find(".bootbox-body").css({
                        "max-height": "auto",
                    });
                    E.find(".bootbox-body").removeAttr("overflow-x");
                    E.find(".bootbox-body").removeAttr("overflow-y")
                }
                if (parseInt(M) < 300) {
                    H.find(".modal-body").css({
                        "overflow-y": "inherit"
                    })
                } else {
                    H.find(".modal-body").css({
                        "overflow-y": "scroll"
                    })
                }
                if (parseInt(M) < 100) {
                    H.find(".modal-body").css({
                        "overflow-x": "inherit"
                    })
                }
            }, 700)
        }

        j(H).data("options", u);
        var G = u.buttons;
        var t = "";
        var J = {
            onEscape: u.onEscape || j.noop,
            onClose: u.onClose || u.onEscape || j.noop
        };
        l(G, function(L, K) {
            t += "<button id='btn_" + L + "' data-bb-handler='" + L + "' data-loading-text='" + K.label + "' type='button' class='btn btn-sm " + K.className + "'>" + K.label + "</button>";
            J[L] = K.callback
        });
        if (u.animate === true) {
            H.addClass("fade")
        }
        if (u.width) {
            var F = B();
            var r = F.realWidth;
            if (r) {
                H.className = H.className || "bootbox-" + r;
                E.attr({
                    style: "width: " + r + "px;"
                })
            }
        }
        if (u.height) {}
        if (u.max_height) {
            H.find(".modal-body").css("max-height", u.max_height)
        } else {
            D()
        }
        if (u.className) {
            H.addClass(u.className)
        } else {
            H.addClass("bootbox-dialog")
        }
        if (u.title) {
            y.before(n.header)
        }
        if (u.closeButton) {
            var s = j(n.closeButton);
            if (u.title) {
                H.find(".modal-header").prepend(s)
            } else {
                s.css("margin-top", "-10px").prependTo(y)
            }
        }
        if (u.fullScreen) {
            var w = j(n.fullScreen);
            H.find(".modal-header .bootbox-close").after(w);
            H.off("click", ".bootbox-full").on("click", ".bootbox-full", function() {
                if (H.hasClass("box-full-screen")) {
                    H.removeClass("box-full-screen");
                    H.find(".modal-header .fa-minus-square-o").addClass("fa-square").removeClass("fa-minus-square-o")
                } else {
                    H.addClass("box-full-screen");
                    H.find(".modal-header .fa-square").addClass("fa-minus-square-o").removeClass("fa-square")
                }
                j(window).trigger("resize");
                D()
            })
        }
        if (u.modalName) {
            H.attr("name", u.modalName);
            H.attr("id", u.modalName)
        }
        if (u.title) {
            H.find(".modal-title").html(u.title)
        }
        if (t.length) {
            y.after(n.footer);
            H.find(".modal-footer").html(t)
        }
        if (u.progress) {
            y.after(n.progress);
            H.find(".progress-bar").attr("id", u.progressID || "bootboxStatus")
        }
        H.on("loaded.bs.modal", function() {
            if (j.isFunction(u.onLoaded)) {
                u.onLoaded.call(this, H)
            }
        });
        j.when(j.Deferred(function(K) {
            H.data("def", K);
            if (u.message) {
                y.find(".bootbox-body").html(u.message);
                K.resolve()
            } else {
                i.loadBody(H, u, K)
            }
        }).promise()).done(function() {
            D();
            j(H).trigger("loaded.bs.modal")
        });
        H.on("hide.bs.modal", function(K) {
            H.off("resize.bs.modal").off("resized.bs.modal");
            if (j.isFunction(u.onHide)) {
                u.onHide.call(this, K)
            }
        });
        H.on("hidden.bs.modal", function(K) {
            if (K.target === this) {
                H.remove()
            }
            if (j("div.bootbox").size() == 0) {
                j(document.body).removeClass("modal-open")
            }
            if (j.fn.fixed && u.fixedTarget && j(u.fixedTarget).size() == 1) {
                j(u.fixedTarget).fixed("destroy")
            }
            if (j.isFunction(u.onHidden)) {
                u.onHidden.call(this, K)
            }
        });
        H.on("resized.bs.modal", function(K) {
            v();
            if (j.isFunction(u.onResized)) {
                u.onResized.call(this, K)
            }
        });
        H.on("show.bs.modal", function(K) {
            if (u.backdrop) {
                H.next(".modal-backdrop").addClass("bootbox-backdrop")
            }
            if (j.isFunction(u.onShow)) {
                u.onShow.call(this, K)
            }
        });
        H.on("shown.bs.modal", function(N) {
            v();
            var M = j("div.bootbox").size();
            if (M > 1) {
                var K = parseInt(H.css("z-index") || "1050");
                var L = K + ((M - 1) * 100);
                H.css("z-index", L + 100);
                if (u.backdrop != false) {
                    j(document.body).find("div.modal-backdrop").last().css("z-index", L)
                }
            }
            H.find("input[name='focusInput']").focus();
            if (u.draggable && j.fn.draggable) {
                E.draggable({
                    scroll: true,
                    containment: E.closest(".bootbox"),
                    handle: ".modal-header,.modal-footer",
                    start: function(O, Q) {
                        var P = Q.helper.offset().left;
                        Q.helper.addClass("modal-dialog-reset")
                    },
                    drag: function(O, P) {},
                    stop: function(O, P) {
                        if (P.helper.offset().top < 0) {
                            E.css({
                                top: "0"
                            })
                        }
                        D()
                    }
                });
                H.find(".modal-header,.modal-footer").css("cursor", "move")
            }
            u.afterRender.call({
                api: window.api,
                content: self || window,
                document: H.find(".bootbox-body"),
                close: function() {
                    H.modal("hide")
                },
                button: function(P) {
                    if (P && P.id) {
                        var O = j.extend(true, {}, P);
                        delete O.id;
                        H.find(".modal-footer").find("button[data-bb-handler='" + P.id + "']").prop(O)
                    }
                }
            });
            H.removeClass("hide");
            if (j.isFunction(u.onShown)) {
                u.onShown.call(this, N)
            }
            j(window).trigger("resize");
            D()
        });
        H.on("escape.close.bb", function(K) {
            if (J.onEscape) {
                e(K, H, u, J.onEscape)
            }
        });
        H.on("click", ".modal-footer button", function(L) {
            var K = j(this).data("bb-handler");
            e(L, H, u, J[K])
        });
        H.on("click", ".bootbox-close-button", function(K) {
            if (J.onClose) {
                e(K, H, u, J.onClose)
            }
        });
        H.on("keyup", function(K) {
            if (K.which === 27) {
                H.trigger("escape.close.bb")
            }
        });
        j(u.container).append(H);
        j.when(H.data("def")).done(function() {
            var K = x();
            if (I()) {
                E.css({
                    top: Math.max(K.top, 0) + "px",
                })
            }
            H.modal({
                backdrop: u.backdrop,
                keyboard: true,
                replace: true,
                show: false
            });
            H.off("resize.bs.modal");
            if (u.show) {
                H.modal("show")
            }
            j(window).resize(function(L) {
                var M = E.data("def");
                if (M) {
                    return false
                }
                j.when(j.Deferred(function(N) {
                    E.data("def", N);
                    H.triggerHandler("resized.bs.modal", [L]);
                    window.setTimeout(function() {
                        N.resolve()
                    }, 500)
                }).promise()).done(function() {
                    E.removeData("def")
                })
            })
        });
        return H
    };
    i.setDefaults = function() {
        var r = {};
        if (arguments.length === 2) {
            r[arguments[0]] = arguments[1]
        } else {
            r = arguments[0]
        }
        j.extend(g, r)
    };
    var b = function(s) {
        if (s) {
            var r = s.contentWindow;
            try {
                s.src = "about:blank";
                r.document.write("");
                r.document.close();
                r.document.clear()
            } catch (t) {}
            j(s).remove()
        }
    };
    i.hideModal = function(r) {
        j(".bootbox[name=" + r + "]").find("iframe").each(function(s, t) {
            if (typeof b == "function") {
                b(t)
            }
        });
        j(".bootbox[name=" + r + "]").modal("hide")
    };
    i.hideAll = function() {
        j(".bootbox").find("iframe").each(function(r, s) {
            if (typeof b == "function") {
                b(s)
            }
        });
        j(".bootbox").modal("hide")
    };
    var a = {
        br: {
            OK: "OK",
            CANCEL: "Cancelar",
            CONFIRM: "Sim"
        },
        da: {
            OK: "OK",
            CANCEL: "Annuller",
            CONFIRM: "Accepter"
        },
        de: {
            OK: "OK",
            CANCEL: "Abbrechen",
            CONFIRM: "Akzeptieren"
        },
        en: {
            OK: "OK",
            CANCEL: "Cancel",
            CONFIRM: "OK"
        },
        es: {
            OK: "OK",
            CANCEL: "Cancelar",
            CONFIRM: "Aceptar"
        },
        fi: {
            OK: "OK",
            CANCEL: "Peruuta",
            CONFIRM: "OK"
        },
        fr: {
            OK: "OK",
            CANCEL: "Annuler",
            CONFIRM: "D'accord"
        },
        he: {
            OK: "\u05d0\u05d9\u05e9\u05d5\u05e8",
            CANCEL: "\u05d1\u05d9\u05d8\u05d5\u05dc",
            CONFIRM: "\u05d0\u05d9\u05e9\u05d5\u05e8"
        },
        it: {
            OK: "OK",
            CANCEL: "Annulla",
            CONFIRM: "Conferma"
        },
        lt: {
            OK: "Gerai",
            CANCEL: "At\u0161aukti",
            CONFIRM: "Patvirtinti"
        },
        lv: {
            OK: "Labi",
            CANCEL: "Atcelt",
            CONFIRM: "Apstiprin\u0101t"
        },
        nl: {
            OK: "OK",
            CANCEL: "Annuleren",
            CONFIRM: "Accepteren"
        },
        no: {
            OK: "OK",
            CANCEL: "Avbryt",
            CONFIRM: "OK"
        },
        pl: {
            OK: "OK",
            CANCEL: "Anuluj",
            CONFIRM: "Potwierd\u017a"
        },
        ru: {
            OK: "OK",
            CANCEL: "\u041e\u0442\u043c\u0435\u043d\u0430",
            CONFIRM: "\u041f\u0440\u0438\u043c\u0435\u043d\u0438\u0442\u044c"
        },
        sv: {
            OK: "OK",
            CANCEL: "Avbryt",
            CONFIRM: "OK"
        },
        tr: {
            OK: "Tamam",
            CANCEL: "\u0130ptal",
            CONFIRM: "Onayla"
        },
        zh_CN: {
            OK: "\u786e  \u5b9a",
            CANCEL: "\u53d6  \u6d88",
            CONFIRM: "\u786e  \u8ba4"
        },
        zh_TW: {
            OK: "OK",
            CANCEL: "\u53d6\u6d88",
            CONFIRM: "\u78ba\u8a8d"
        }
    };
    i.init = function(r) {
        return init(r || j)
    };
    return i
}));
/*
 * bootbox 默认参数：详情参见：bootbox-setDefaults.js
 */
;
(function(a) {
    bootbox.setDefaults({
        show: true,
        progress: false,
        btnlock: false,
        backdrop: false,
        draggable: false,
        closeButton: true,
        animate: false,
        className: "my-modal"
    })
})(jQuery);
/*
 * bootbox Jquery适配：详情参见：jquery.bootbox.js
 */
;
(function(a) {
    a.extend({
        message: function(e, d, b, c) {
            if (a("#statusModal").size() > 0) {
                return
            }
            b = b || a.noop;
            c = c || {};
            return a.dialog(a.extend(true, {
                title: e || a.i18n.bootbox.titles["prompt"],
                message: d,
                width: c.width || "800px",
                modalName: c.modalName || "msgModal",
                buttons: {
                    cancel: {
                        label: a.i18n.bootbox.buttons["success"],
                        className: "btn-default",
                        callback: function() {
                            if (a.isFunction(b)) {
                                return b.call(this)
                            } else {
                                return true
                            }
                        }
                    }
                }
            }, c || {}))
        },
        alert: function(g, b, d) {
            if (a("#statusModal").size() > 0) {
                return
            }
            if (g && g.indexOf("timeSettingInfo") > 10) {
                d = a.extend(true, {}, {
                    width: "700px",
                    modalName: "timeSettingModal"
                }, d || {});
                if (a("#" + d.modalName).size() > 0) {
                    return
                }
                return a.message(a.i18n.bootbox.messages["open_tip"], g, b, d)
            } else {
                var f = a.getTextLength(g || "");
                var c = Math.ceil(f % 50 / 50) + parseInt(f / 50);
                var e = 300 + (c > 0 ? (c - 1) * 30 : 0);
                d = a.extend(true, {}, {
                    width: e + "px",
                    modalName: "alertModal"
                }, d || {});
                if (a("#" + d.modalName).size() > 0) {
                    return
                }
                return bootbox.alert(a.i18n.bootbox.titles["alert"], '<div class="alert alert-modal"><p>' + g + "</p></div>", function(h) {
                    if (a.isFunction(b)) {
                        return b.call(this, h)
                    } else {
                        return true
                    }
                }, d)
            }
        },
        error: function(g, b, d) {
            if (a("#statusModal").size() > 0) {
                return
            }
            if (g && g.indexOf("timeSettingInfo") > 10) {
                d = a.extend(true, {}, {
                    width: "700px",
                    modalName: "timeSettingModal"
                }, d || {});
                if (a("#" + d.modalName).size() > 0) {
                    return
                }
                return a.message(a.i18n.bootbox.messages["open_tip"], g, b, d)
            } else {
                var f = a.getTextLength(g || "");
                var c = Math.ceil(f % 50 / 50) + parseInt(f / 50);
                var e = 300 + (c > 0 ? (c - 1) * 30 : 0);
                d = a.extend(true, {}, {
                    width: e + "px",
                    modalName: "errorModal"
                }, d || {});
                if (a("#" + d.modalName).size() > 0) {
                    return
                }
                return bootbox.alert(a.i18n.bootbox.titles["error"], '<div class="error error-modal"><p>' + g + "</p></div>", function(h) {
                    if (a.isFunction(b)) {
                        return b.call(this, h)
                    } else {
                        return true
                    }
                }, d)
            }
        },
        success: function(g, b, d) {
            if (a("#statusModal").size() > 0) {
                return
            }
            if (g && g.indexOf("timeSettingInfo") > 10) {
                d = a.extend(true, {}, {
                    width: "700px",
                    modalName: "timeSettingModal"
                }, d || {});
                if (a("#" + d.modalName).size() > 0) {
                    return
                }
                return a.message(a.i18n.bootbox.messages["open_tip"], g, b, d)
            } else {
                var f = a.getTextLength(g || "");
                var c = Math.ceil(f % 50 / 50) + parseInt(f / 50);
                var e = 300 + (c > 0 ? (c - 1) * 30 : 0);
                d = a.extend(true, {}, {
                    width: e + "px",
                    modalName: "successModal"
                }, d || {});
                if (a("#" + d.modalName).size() > 0) {
                    return
                }
                return bootbox.alert(a.i18n.bootbox.titles["success"], '<div class="success success-modal"><p>' + g + "</p></div>", function(h) {
                    if (a.isFunction(b)) {
                        return b.call(this, h)
                    } else {
                        return true
                    }
                }, d)
            }
        },
        confirm: function(g, b, d) {
            if (a("#statusModal").size() > 0) {
                return
            }
            if (g && g.indexOf("timeSettingInfo") > 10) {
                d = a.extend(true, {}, {
                    width: "700px",
                    modalName: "timeSettingModal"
                }, d || {});
                if (a("#" + d.modalName).size() > 0) {
                    return
                }
                return a.message(a.i18n.bootbox.messages["open_tip"], g, b, d)
            } else {
                var f = a.getTextLength(g || "");
                var c = Math.ceil(f % 50 / 50) + parseInt(f / 50);
                var e = 300 + (c > 0 ? (c - 1) * 30 : 0);
                d = a.extend(true, {}, {
                    width: e + "px",
                    modalName: "confirmModal"
                }, d || {});
                if (a("#" + d.modalName).size() > 0) {
                    return
                }
                return bootbox.confirm(a.i18n.bootbox.titles["confirm"], '<div class="alert confirm-modal"><p>' + g + "</p></div>", function(h) {
                    if (a.isFunction(b)) {
                        return b.call(this, h)
                    } else {
                        return true
                    }
                }, d)
            }
        },
        prompt: function(b, c) {
            if (a("#statusModal").size() > 0) {
                return
            }
            c = a.extend(true, {}, {
                width: "300px",
                modalName: "promptModal"
            }, c || {});
            if (a("#" + c.modalName).size() > 0) {
                return
            }
            return bootbox.prompt(a.i18n.bootbox.titles["prompt"], function(d) {
                if (a.isFunction(b)) {
                    return b.call(this, d)
                } else {
                    return true
                }
            }, c)
        },
        showDialog: function(b, d, c) {
            if (a("#statusModal").size() > 0) {
                return
            }
            c = c || {};
            return a.dialog(a.extend({}, c || {}, {
                title: d,
                href: b || "",
                data: c.data || {}
            }))
        },
        dialog: function(b) {
            if (a("#statusModal").size() > 0) {
                return
            }
            var d = {
                title: a.i18n.bootbox.titles["prompt"],
                href: "",
                data: {},
                message: "",
                backdrop: "static",
                keyboard: true,
                offAtOnce: true,
                draggable: true,
                onLoaded: null,
                onClose: null,
                onEscape: null,
                onHide: null,
                onHidden: null,
                onResize: null,
                onResized: null,
                onShow: null,
                onShown: function() {
                    a('[data-toggle*="validation"]').trigger("validation");
                    a('[data-toggle*="fixed"]').trigger("fixed");
                    a('input[type="checkbox"],input[type="radio"]').trigger("iCheck");
                    if (a.fn.tooltip) {
                        a('[data-toggle*="tooltip"]').tooltip({
                            container: "body"
                        })
                    }
                    if (a.fn.fixed && b.fixedTarget && a(b.fixedTarget).size() == 1) {
                        a(b.fixedTarget).fixed({
                            scrollElement: a("#" + b.modalName),
                            container: a("#" + b.modalName).find(".modal-dialog"),
                            z_index: a("#" + b.modalName).css("z-index")
                        })
                    }
                }
            };
            var c = a.extend({}, d, b);
            if (a.founded(c.data["ckUrl"])) {
                c.data["ckUrl"] = encodeURIComponent(c.data["ckUrl"] || "")
            }
            if (a.founded(c.data["shUrl"])) {
                c.data["shUrl"] = encodeURIComponent(c.data["shUrl"] || "")
            }
            return bootbox.dialog(c)
        },
        closeModal: function(b) {
            bootbox.hideModal(b)
        },
        closeAllModal: function() {
            bootbox.hideAll()
        }
    });
    a.fn.reloadDialog = function(b) {
        return this.each(function() {
            var d = a(this),
                c = a(d).data("options");
            if (!c) {
                return
            }
            if (a(d).hasClass("bootbox")) {
                a.when(a.Deferred(function(e) {
                    d.data("def", e);
                    if (c.message) {
                        d.find(".bootbox-body").html(c.message);
                        e.resolve()
                    } else {
                        bootbox.loadBody(d, a.extend(c, b || {}), e)
                    }
                }).promise()).done(function() {
                    a(d).trigger("loaded.bs.modal")
                })
            }
        })
    };
    a.exportDialog = function(b, d, l, m, g, p,t,w) {
        if (a("#statusModal").size() > 0) {
            return
        }
        if (!a.founded(d)) {
            throw new Error("dcclbh \u4e0d\u80fd\u4e3a\u7a7a !")
        }
		if(w == undefined || w == '' || w == null){
			w='';
		}
        if(t == undefined || t == '' || t == null){
            var sfkdc = true;
            jQuery.ajaxSetup({
                async: false
            });
            a.post(_path + "/nImport/import_cxDcWXSQBJ.html",function(g) {
                if ('1' == g){
                    sfkdc = false;
                    // 生成弹框，展示微信二维码，进行扫码认证
                    a.dialog({
                        title: a.i18n.bootbox.titles["scanCode"],
                        href: _path + "/nImport/import_cxWxsqdcView.html",
                        data: {
                            dcclbh: d
                        },
                        width: "500px",
                        modalName: "ewmModal",
                        buttons: {
                            smrz: {
                                label: a.i18n.bootbox.buttons["export"],
                                className: "btn-primary",
                                callback: function() {
                                    //重新进行导出
                                    a.exportDialog(b, d, l, m, g, p,'true');
                                }
                            },
                            cancel: {
                                label: a.i18n.bootbox.buttons["cancel"],
                                className: "btn-default"
                            }
                        }
                    })
                }
                jQuery.ajaxSetup({
                    async: true
                });
            });
            if (!sfkdc){
                return;
            }
        }

        var o = _path + "/zftal/drdc/export_exportInitDcpz.html";
        var j = {
            dcclbh: d
        };
        var m2 = [];
        var ml = 0;
		if (a.founded(g) && a(g).size() > 0) {
			m2 = a(g).jqGrid("getGridParam","colModel")||[];
			ml = m2.length;
		}
		/*把不在排序列表中的列加到m2中*/
		a.each(m||[], function (k, s) {
			var f = false;
			a.each(m2, function (h, t) {
				if(h+1 > ml){
					return false;
				}else if (t.index == s.index) {
					f = true;
					return false;
				}
			});
			if (f == false) {
				m2.push(s);
			}
		});
		if (m2 && m2.length > 0) {
			var k = 0;
			for (var h = 0; h < m2.length; h++) {
				var f = m2[h];
				if (a.trim(f.label).length > 0 && a.trim(f.index).length > 0 
					&& ((typeof f.exportable=="undefined" && f.hidden != true) 
					|| (typeof f.exportable!="undefined" && f.exportable))) {
					j["colConfig[" + k + "].zd"] = f.name;
					j["colConfig[" + k + "].zdmc"] = f.label;
					j["colConfig[" + k + "].xssx"] = k;
                    j["colConfig[" + k + "].sfsz"] = f.isnumber?'1':'0';
					k++
				}	
			}
		}
        jQuery.ajaxSetup({
            async: false
        });
        a.post(o, j);
        jQuery.ajaxSetup({
            async: true
        });
        l = l || {};
        a.each(l,function(key,values){if(typeof values=='undefined'){delete l[key]}});
        l.dcclbh = d;
        if (a.founded(g) && a(g).size() > 0) {
            var sn = a(g).jqGrid("getGridParam", "sortname");
            var e = a(g).jqGrid("getGridParam", "sortorder");
            if (a.defined(sn)) {
				var sortNameReal = '';
				if (m2 && m2.length > 0) {
					var isnumberMap = {};
					for (var k = 0; k < m2.length; k++) {
						isnumberMap[m2[k].name] = m2[k].isnumber ? true: false;
					}
					var sortNames = sn.split(',')
					for (var ji = 0; ji < sortNames.length; ji++) {
						var sortNameCurrTmp = sortNames[ji].split(' ');
						var sortNameCurr = [];
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
						if (ji + 1 < sortNames.length) {
							sortNameReal += ','
						}
					}
				}
                l["queryModel.sortName"] = sortNameReal;
            }
            if (a.defined(e)) {
                l["queryModel.sortOrder"] = e
            }
        }
        var c = a.buildForm("drdcForm", b, l);
        a.dialog({
            title: a.i18n.bootbox.titles["export"],
            href: _path + "/zftal/drdc/export_exportConfig.html",
            data: {
                dcclbh: d,
				mrwjm: w
            },
            width: "900px",
            modalName: "ExportModal",
            buttons: {
                bcdc: {
                    label: a.i18n.bootbox.buttons["export"],
                    className: "btn-primary",
                    callback: function() {
                        var i = this.content.saveConfig(c,m2,p);
                        if (a.defined(i)) {
                            return i
                        } else {
                            return true
                        }
                    }
                },
                cancel: {
                    label: a.i18n.bootbox.buttons["cancel"],
                    className: "btn-default"
                }
            }
        })
    };
    a.showSortDialog = function(d, c, b) {
        if (a("#statusModal").size() > 0) {
            return
        }
        if (!a.founded(d)) {
            throw new Error("\u4e1a\u52a1\u6570\u636eID\u4e0d\u80fd\u4e3a\u7a7a !")
        }
        if (!a.founded(c)) {
            throw new Error("\u529f\u80fd\u6a21\u5757\u4ee3\u7801\u4e0d\u80fd\u4e3a\u7a7a !")
        }
        b = (a.defined(b) && jQuery.isFunction(b)) ? b : a.noop;
        var e = {
            ywsj_id: d,
            gnmkdm: c
        };
        a.dialog({
            title: a.i18n.bootbox.titles["showSort"],
            href: _path + "/xtgl/ywsjPxxx_cxYwsjPxxx.html",
            data: e,
            width: "500px",
            modalName: "sortModal",
            buttons: {
                success: {
                    label: a.i18n.bootbox.buttons["success"],
                    className: "btn-primary",
                    callback: function() {
                        var f = [];
                        a("#sort_table_body").find("tr.sort-item").each(function(h, j) {
                            var g = a(j).data("order");
                            f.push({
                                yxj: (h + 1),
                                pxfs: (a.founded(g) ? g : "asc"),
                                zdmc: a(j).data("sort")
                            });
                            e["list[" + h + "].yxj"] = (h + 1);
                            e["list[" + h + "].pxfs"] = f[h]["pxfs"];
                            e["list[" + h + "].zdmc"] = f[h]["zdmc"]
                        });
                        a.ajaxSetup({
                            async: false
                        });
                        a.post(_path + "/xtgl/ywsjPxxx_cxYwsjPxxxForUpdate.html", e, function(g) {
                            a.closeModal("sortModal");
                            b.call(this, f)
                        });
                        a.ajaxSetup({
                            async: true
                        });
                        return false
                    }
                },
                cancel: {
                    label: a.i18n.bootbox.buttons["cancel"],
                    className: "btn-default"
                }
            }
        })
    };
    a.fullAvatarDialog = function(c, b, d) {
        if (a("#statusModal").size() > 0) {
            return
        }
        b.upload_url = encodeURIComponent(b.upload_url || "");
        b.src_url = encodeURIComponent(b.src_url || "");
        a.dialog({
            title: c || a.i18n.bootbox.titles["fullAvatar"],
            draggable: false,
            href: _path + "/editor/fullAvatar_cxFullAvatarUpload.html",
            data: b || {},
            width: "700px",
            modalName: "FullAvatarUpload",
            onHidden: function() {
                if (a.isFunction(d)) {
                    d.call(this)
                }
            },
            buttons: {
                success: {
                    label: a.i18n.bootbox.buttons["upload"],
                    className: "btn-primary",
                    callback: function() {
                        if (swf_object) {
                            swf_object.call("upload")
                        }
                        return false
                    }
                },
                reelect: {
                    label: a.i18n.bootbox.buttons["choice"],
                    className: "btn-primary",
                    callback: function() {
                        if (swf_object) {
                            swf_object.call("changepanel", "upload")
                        }
                        return false
                    }
                },
                cancel: {
                    label: a.i18n.bootbox.buttons["cancel"],
                    className: "btn-default",
                    callback: function() {}
                }
            }
        })
    };
    a.fullAvatarURLDialog = function(c, d, f, b, e) {
        if (a("#statusModal").size() > 0) {
            return
        }
        if (!a.founded(c)) {
            throw new Error("paramURL \u4e0d\u80fd\u4e3a\u7a7a !")
        }
        a.post(c, f, function(g) {
            a.fullAvatarDialog(d, a.extend({}, b || {}, g || {}), e)
        })
    };
    a.reportDialog = function(b, d) {
        if (a("#statusModal").size() > 0) {
            return
        }
        b = b || {};
        if (!a.founded(b.reportID)) {
            throw new Error("reportID \u4e0d\u80fd\u4e3a\u7a7a !")
        }
        var c = a.extend(true, {}, b, {
            reportID: encodeURIComponent(b.reportID || ""),
            viewType: "dialog",
            searchType: (b.searchType || ""),
            gnmkdm: (b.gnmkdm || a("#gnmkdmKey").val())
        });
        a.dialog({
            title: b.title || a.i18n.bootbox.titles["report"],
            href: _path + "/report/report_cxReportIndex.html",
            data: c,
            width: (b.width || a("#yhgnPage").innerWidth() + "px"),
            modalName: "ReportModal",
            onHidden: function() {
                if (a.isFunction(d)) {
                    d.call(this)
                }
            },
            buttons: {
                cancel: {
                    label: a.i18n.bootbox.buttons["cancel"],
                    className: "btn-default"
                }
            }
        })
    };
    a.batchModifyDialog = function(b, d) {
        if (a("#statusModal").size() > 0) {
            return
        }
        b = b || {};
        var c = a.extend(true, {}, b, {
            gnmkdm: (b.gnmkdm || a("#gnmkdmKey").val())
        });
        if (!a.founded(c.gnmkdm)) {
            throw new Error("gnmkdm \u4e0d\u80fd\u4e3a\u7a7a !")
        }
        if (!a.founded(c.plxgURL)) {
            throw new Error("plxgURL \u4e0d\u80fd\u4e3a\u7a7a[\u8be5\u8def\u5f84\u4e3a\u6700\u7ec8\u6267\u884c\u6279\u91cf\u4fee\u6539\u64cd\u4f5c\u7684\u8bf7\u6c42\u8def\u5f84] !")
        }
        a.dialog(a.extend({}, addConfig, {
            title: b.title || a.i18n.bootbox.titles["batchModify"],
            href: _path + "/xtgl/plxg_cxPlxgSettings.html",
            data: c,
            width: (b.width || "600px"),
            modalName: "ReportModal",
            onHidden: function() {
                if (a.isFunction(d)) {
                    d.call(this)
                }
            }
        }))
    };
    a.fn.clearElements = function() {
        return this.each(function() {
            if (a(this).is("input,select,textarea")) {
                a(this).clearFields();
                a(this).trigger("chosen:updated");
                a(this).trigger("kineditor:sync")
            } else {
                var c = a(this).find("input,select,textarea").filter(function(d) {
                    return !a(this).hasClass("ignore")
                });
                var b = a(c).filter('[data-clear="true"]');
                if (b.size() > 0) {
                    a(b).clearFields();
                    a(b).trigger("chosen:updated");
                    a(b).trigger("kineditor:sync")
                } else {
                    a(c).clearFields();
                    a(c).trigger("chosen:updated");
                    a(c).trigger("kineditor:sync")
                }
            }
        })
    }
})(jQuery);
var viewConfig = {
    width: "500px",
    modalName: "viewModal",
    offAtOnce: true,
    buttons: {
        cancel: {
            label: "\u5173 \u95ed",
            className: "btn-default",
            callback: function() {}
        }
    }
};
var addConfig = {
    width: "900px",
    modalName: "addModal",
    formName: "ajaxForm",
    gridName: "tabGrid",
    offAtOnce: false,
    buttons: {
        success: {
            label: "\u786e \u5b9a",
            className: "btn-primary",
            callback: function() {
                var b = this;
                var a = b.options || {};
                submitForm(a.formName || "ajaxForm", function(c, d) {
                    b.reset();
                    if ($.type(c) === "string") {
                        if (c.indexOf("\u6210\u529f") > -1) {
                            $.success(c, function() {
                                if (a.offAtOnce) {
                                    $.closeModal(a.modalName)
                                }
                                $(b.document).clearElements();
                                var e = $("#" + a.gridName || "tabGrid");
                                if ($(e).size() > 0) {
                                    $(e).reloadGrid()
                                }
                            })
                        } else {
                            if (c.indexOf("\u5931\u8d25") > -1) {
                                $.error(c, function() {})
                            } else {
                                $.alert(c, function() {})
                            }
                        }
                    } else {
                        if ($.isPlainObject(c)) {
                            if (c.status == "success") {
                                $.success(c.message, function() {
                                    if (a.offAtOnce) {
                                        $.closeModal(a.modalName)
                                    }
                                    $(b.document).clearElements();
                                    var e = $("#" + a.gridName || "tabGrid");
                                    if ($(e).size() > 0) {
                                        $(e).reloadGrid()
                                    }
                                })
                            } else {
                                if (c.status == "error") {
                                    $.error(c.message)
                                } else {
                                    $.alert(c.message)
                                }
                            }
                        }
                    }
                });
                return false
            }
        },
        cancel: {
            label: "\u5173 \u95ed",
            className: "btn-default"
        }
    }
};
var modifyConfig = {
    width: "900px",
    modalName: "modifyModal",
    formName: "ajaxForm",
    gridName: "tabGrid",
    offAtOnce: true,
    buttons: {
        success: {
            label: "\u786e \u5b9a",
            className: "btn-primary",
            callback: function() {
                var b = this;
                var a = b.options || {};
                submitForm(a.formName || "ajaxForm", function(c, d) {
                    b.reset();
                    if ($.type(c) === "string") {
                        if (c.indexOf("\u6210\u529f") > -1) {
                            $.success(c, function() {
                                if (a.offAtOnce) {
                                    $.closeModal(a.modalName || "modifyModal")
                                }
                                var e = $("#" + a.gridName || "tabGrid");
                                if ($(e).size() > 0) {
                                    $(e).reloadGrid()
                                }
                            })
                        } else {
                            if (c.indexOf("\u5931\u8d25") > -1) {
                                $.error(c, function() {})
                            } else {
                                $.alert(c, function() {})
                            }
                        }
                    } else {
                        if ($.isPlainObject(c)) {
                            if (c.status == "success") {
                                $.success(c.message, function() {
                                    if (a.offAtOnce) {
                                        $.closeModal(a.modalName || "modifyModal")
                                    }
                                    var e = $("#" + a.gridName || "tabGrid");
                                    if ($(e).size() > 0) {
                                        $(e).reloadGrid()
                                    }
                                })
                            } else {
                                if (c.status == "error") {
                                    $.error(c.message)
                                } else {
                                    $.alert(c.message)
                                }
                            }
                        }
                    }
                });
                return false
            }
        },
        cancel: {
            label: "\u5173 \u95ed",
            className: "btn-default"
        }
    }
};
var shConfig = {
    width: "900px",
    modalName: "shModal",
    fixedTarget: "#fixtop",
    buttons: {}
};