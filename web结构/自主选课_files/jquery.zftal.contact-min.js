/*
 * 业务框架全局Ajax设置：详情参见：jquery.zftal.settings-1.0.0.js
 */
;(function(b) {
    var a = {};
    b.ajaxSetup({
        abortOnRetry: true,
        cache: false,
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        statusCode: {
            400: function() {
                a = {};
                if (b("#statusModal").size() > 0) {
                    return
                }
            },
            401: function() {
                a = {};
                if (b("#statusModal").size() > 0) {
                    return
                }
                b.alert(b.i18n.zftal.statusCode["401"], function() {
                    window.close()
                }, {
                    modalName: "statusModal"
                })
            },
            404: function() {
                a = {};
                if (console && console.error) {
                    console.error(b.i18n.zftal.statusCode["400"])
                }
            },
            408: function() {
                if (b("#statusModal").size() > 0) {
                    return
                }
                b.alert(b.i18n.zftal.statusCode["408"], function() {}, {
                    modalName: "statusModal"
                })
            },
            500: function() {
                if (b("#statusModal").size() > 0) {
                    return
                }
                b.alert(b.i18n.zftal.statusCode["500"], function() {}, {
                    modalName: "statusModal"
                })
            },
            502: function() {
                a = {};
                if (b("#statusModal").size() > 0) {
                    return
                }
                b.alert(b.i18n.zftal.statusCode["502"], function() {}, {
                    modalName: "statusModal"
                })
            },
            503: function() {
                a = {};
                if (b("#statusModal").size() > 0) {
                    return
                }
                b.alert(b.i18n.zftal.statusCode["503"], function() {}, {
                    modalName: "statusModal"
                })
            },
            504: function() {
                a = {};
                if (b("#statusModal").size() > 0) {
                    return
                }
                b.alert(b.i18n.zftal.statusCode["504"], function() {}, {
                    modalName: "statusModal"
                })
            },
            901: function() {
                if (b("#statusModal").size() > 0) {
                    return
                }
                b.alert(b.i18n.zftal.statusCode["901"], function() {
                    document.location.href = _systemPath + "/xtgl/login_slogin.html?language=" + _localeKey + "&login_type=" + b("#login_type").val()
                }, {
                    modalName: "statusModal"
                })
            },
            902: function() {
                a = {};
                if (b("#statusModal").size() > 0) {
                    return
                }
                b.alert(b.i18n.zftal.statusCode["902"], function() {
                    window.close()
                }, {
                    modalName: "statusModal"
                })
            },
            903: function() {
                a = {};
                if (b("#statusModal").size() > 0) {
                    return
                }
                b.alert(b.i18n.zftal.statusCode["903"], function() {
                    window.close()
                }, {
                    modalName: "statusModal"
                })
            },
            904: function() {
                a = {};
                if (b("#statusModal").size() > 0) {
                    return
                }
                b.ajax({
                    type: "POST",
                    url: _path + "/xkgl/common_cxPluginMsg.html",
                    data: {},
                    datatype: "json",
                    success: function(c) {
                        if (c == "0") {
                            b.alert(b.i18n.zftal.statusCode["911"], function() {}, {
                                modalName: "statusModal"
                            });
                        } else if (c != null && c != "") {
                            b.alert(c, function() {}, {
                                modalName: "statusModal"
                            });
                        } else {
                            b.alert(b.i18n.zftal.statusCode["904"], function() {}, {
                                modalName: "statusModal"
                            });
                        }
                    }
                })
            },
            905: function() {
                a = {};
                if (b("#statusModal").size() > 0) {
                    return
                }
                b.alert(b.i18n.zftal.statusCode["905"], function() {}, {
                    modalName: "statusModal"
                })
            },
            906: function() {
                a = {};
                if (b("#statusModal").size() > 0) {
                    return
                }
                b.alert(b.i18n.zftal.statusCode["906"], function() {}, {
                    modalName: "statusModal"
                })
            },
            907: function() {
                a = {};
                if (b("#statusModal").size() > 0) {
                    return
                }
                b.alert(b.i18n.zftal.statusCode["907"], function() {}, {
                    modalName: "statusModal"
                })
            },
            908: function() {
                a = {};
                if (b("#statusModal").size() > 0) {
                    return
                }
                b.alert(b.i18n.zftal.statusCode["908"], function() {}, {
                    modalName: "statusModal"
                })
            },
            909: function() {
                a = {};
                if (b("#statusModal").size() > 0) {
                    return
                }
                b.alert(b.i18n.zftal.statusCode["909"], function() {}, {
                    modalName: "statusModal"
                })
            },
            910: function() {
                a = {};
                if (b("#statusModal").size() > 0) {
                    return
                }
                b.alert(b.i18n.zftal.statusCode["910"], function() {}, {
                    modalName: "statusModal"
                })
            },
            911: function() {
                a = {};
                if (b("#statusModal").size() > 0) {
                    return
                }
                b.alert(b.i18n.zftal.statusCode["911"], function() {}, {
                    modalName: "statusModal"
                })
            }
        }
    });
    b.ajaxPrefilter(function(g, l, i) {
        if (g.abortOnRetry) {
            var k = b.param(l.data || {});
            var h = b.founded(k) ? ((g.url || "") + ((g.url || "").indexOf("?") > -1 ? "&" : "?") + k) : (g.url || "");
            var f = (typeof b.md5 != "undefined") ? b.md5(h) : h;
            var d = a[f];
            if (b.defined(d)) {
                try {
                    if (d.readyState != 4) {
                        i.abort();
                        if (console && console.error) {
                            console.error("\u5df2\u5b58\u5728\u4e0e\u5f53\u524d\u8bf7\u6c42\u8def\u5f84\u548c\u53c2\u6570\u76f8\u540c\u7684\u8bf7\u6c42\u4e14\u672a\u5b8c\u6210!")
                        }
                    } else {
                        a[f] = i
                    }
                } catch (j) {
                    delete a[f];
                    console.error(j)
                }
            } else {
                a[f] = i
            }
        }
    });
    function c(e) {
        if (e.abortOnRetry) {
            var g = b.isPlainObject(e.data) ? b.param(e.data || {}) : "";
            var f = b.founded(g) ? ((e.url || "") + ((e.url || "").indexOf("?") > -1 ? "&" : "?") + g) : (e.url || "");
            var d = (typeof b.md5 != "undefined") ? b.md5(f) : f;
            a[d] = null;
            delete a[d]
        }
    }
    b(document).ajaxSend(function(e, f, d) {
        if (b.matchURL(d.url)) {} else {
            if (b.defined(d.data)) {
                d.url = b.getURL(d.url, d.data)
            } else {
                if (b.defined(d.url)) {
                    d.url = b.getURL(d.url, {})
                }
            }
        }
    }).ajaxError(function(g, i, e) {
        c(e);
        if (i.status == 904 && b("#loading_status").size() > 0) {
            var f = "\u8bf7\u52ff\u9891\u7e41\u5237\u65b0\u6216\u8005\u70b9\u51fb\u83dc\u5355,\u8bf7<label id='times' data-time='" + _refreshInterval + "'>" + _refreshInterval + "</label>\u79d2\u540e\u518d\u64cd\u4f5c!~";
            b("#loading_status").replaceWith('<div class="red " style="font-size: 20px;margin-top: 150px;text-align: center;" role="alert"  id="messageTip">' + f + "</div>");
            var h = parseInt(b("#times").data("time"));
            var d = window.setInterval(function() {
                h -= 1;
                if (h <= 0) {
                    window.clearInterval(d);
                    b("#messageTip").html("\u8bf7\u91cd\u65b0\u5237\u65b0\u9875\u9762\u6216\u8005\u70b9\u51fb\u6309\u94ae!").removeClass("red2").addClass("green")
                }
                b("#times").text(h)
            }, 1000)
        }
    }).ajaxComplete(function(e, f, d) {
        c(d)
    })
}
)(jQuery);
/*
 * 业务框架全局事件处理：详情参见：jquery.zftal.events-1.0.0.js
 */
;(function(a) {
    a(document).off("keydown.data-api").on("keydown.data-api", "*", function(c) {
        var b = a.event.fix(c);
        if (b.keyCode == 8) {
            if (a(this).is("input") || a(this).is("textarea")) {
                if (a(this).prop("readonly") == true || a(this).prop("disabled") == true) {
                    b.preventDefault()
                }
            } else {
                b.preventDefault()
            }
            b.stopPropagation()
        } else {
            if (b.keyCode == 13) {
                if (a(this).is("input") || a(this).is("textarea")) {
                    if (!a(b.target).hasClass("ui-pg-input")) {
                        b.preventDefault()
                    }
                    if (a("form.sl_all_form").size() > 0 && jQuery.contains(a("form.sl_all_form")[0], b.target)) {
                        a("#search_go").trigger("click")
                    }
                }
            } else {
                if (b.keyCode == 27) {
                    b.preventDefault();
                    b.stopPropagation()
                }
            }
        }
    }).off("change", "#localChange").on("change", "#localChange", function() {
        a.ajaxSetup({
            async: false
        });
        a.post(_path + "/xtgl/init_changeLocal.html", {
            language: a(this).val()
        }, function(b) {
            if (1 == parseInt(b)) {
                if (a("#topButton").size() > 0) {
                    a("#topButton").click()
                } else {
                    window.location.reload()
                }
            }
        }, "json");
        a.ajaxSetup({
            async: true
        })
    })
}
)(jQuery);
/*
 * 业务框架级联组件：详情参见：jquery.zftal.concatenation-1.0.0.js
 * 特别说明：现在是用教务自己工程中的jquery.zftal.concatenation-1.0.0.js进行压缩的，所以如果有修改，请在教务自己的jquery.zftal.concatenation-1.0.0.js中进行修改，再进行压缩替换下面的压缩后内容
 */
;(function(e) {
    function f(g) {
        if (e.fn.simpleValidate) {
            e(g).getRealElement().successClass()
        }
    }
    // i, t, w, g, n, o, h, p {i:j, t:k, w:h, g:g, n:n, o:m, h:i, p:l,xb:xb}
    function d({i:j, t:k, w:h, g:g, n:n, o:m, h:i, p:l,xb:xb}) {
        if (e.founded(xb) && e(xb).defined()) {
            j[b(xb, k)] = e(xb).val()
        } else {
            j[b(xb, k)] = null
        }
        if (e.founded(h) && e(h).defined()) {
            j[b(h, k)] = e(h).val()
        } else {
            j[b(h, k)] = null
        }
        if (e.founded(g) && e(g).defined()) {
            j[b(g, k)] = e(g).val()
        } else {
            j[b(g, k)] = null
        }
        if (e.founded(n) && e(n).defined()) {
            j[b(n, k)] = e(n).val()
        } else {
            j[b(n, k)] = null
        }
        if (e.founded(m) && e(m).defined()) {
            j[b(m, k)] = e(m).val()
        } else {
            j[b(m, k)] = null
        }
        if (e.founded(i) && e(i).defined()) {
            j[b(i, k)] = e(i).val()
        } else {
            j[b(i, k)] = null
        }
        if (e.founded(l) && e(l).defined()) {
            j[b(l, k)] = e(l).val()
        } else {
            j[b(l, k)] = null
        }
    }
    function b(h, i) {
        var g = e(h).attr("name");
        return e.founded(i[g]) ? i[g] : g
    }
    function a(g, i) {
        var h = {};
        e.each(g || {}, function(j, k) {
            if (e.founded(j) && e.founded(k) && (!e.isNumeric(j))) {
                h[j] = k
            }
        });
        e.each(["mapper", "selectAttr", "height", "title", "width"], function(k, j) {
            delete h[j]
        });
        return h
    }
    //i, u, w, g, n, o, h, p  {i:l, u:o, w:q, g:j, n:p, o:i, h:m, p:r}
    function c({i:l, u:o, w:q, g:j, n:p, o:i, h:m, p:r,xb:xb}) {
        var h = {};
        if (e.founded(o)) {
            var g = o.mapper || {};
            if (e.founded(xb) && e(xb).defined()) {
                var k = b(xb, g);
                var n = o[k];
                if (e.defined(n)) {
                    delete o[k];
                    o[k] = n
                }
            }
            if (e.founded(q) && e(q).defined()) {
                var k = b(q, g);
                var n = o[k];
                if (e.defined(n)) {
                    delete o[k];
                    o[k] = n
                }
            }
            if (e.founded(j) && e(j).defined()) {
                var k = b(j, g);
                var n = o[k];
                if (e.defined(n)) {
                    delete o[k];
                    o[k] = n
                }
            }
            if (e.founded(p) && e(p).defined()) {
                var k = b(p, g);
                var n = o[k];
                if (e.defined(n)) {
                    delete o[k];
                    o[k] = n
                }
            }
            if (e.founded(i) && e(i).defined()) {
                var k = b(i, g);
                var n = o[k];
                if (e.defined(n)) {
                    delete o[k];
                    o[k] = n
                }
            }
            if (e.founded(m) && e(m).defined()) {
                var k = b(m, g);
                var n = o[k];
                if (e.defined(n)) {
                    delete o[k];
                    o[k] = n
                }
            }
            if (e.founded(r) && e(r).defined()) {
                var k = b(r, g);
                var n = o[k];
                if (e.defined(n)) {
                    delete o[k];
                    o[k] = n
                }
            }
            e.each(o, function(s, t) {
                l[s] = t;
                h[s] = t
            })
        }
        return h
    }
 
    e.extend({
    	
//    	paramMap().mapper = {"jg_id_cx":"jg_id","zyh_id_cx":"zyh_id","bh_id_cx":"bh_id","njdm_id_cx":"njdm_id"};
//		$.bindChangeEvent("#jg_id_cx","","#zyh_id_cx","","","#njdm_id_cx", paramMap(),function(){},"全部",true);
    	
        bindChangeEvent: function(w, g, n, o, h, p, u, j, m, domain) {
			//domain = {showSearch:true, ctnAll:true, ctnInvert:true,ctnOut:true} //搜索框 全选 反选
            var k = this;
            var i = {};
            u = e.defined(u) ? u : {};
            j = (e.defined(j) && e.isFunction(j)) ? j : e.noop;
            m = e.defined(m) ? m : "\u5168\u90e8";
            var t = u.mapper || {};
            var r = c({i, u, w, g, n, o, h, p});
            function v() {
                if (e.founded(g) && e(g).defined() && e(g).is("select")) {
                    d({i, t, w, g, n, o, h, p});
                    var y = [];
                    y.push('<option value="">' + m + "</option>");
                    jQuery.ajaxSetup({
                        async: false
                    });
                    e.getJSON(_path + "/xtgl/comm_cxXxdmList.html", a.call(this, i, t), function(z) {
                        if (e.founded(z)) {
                            e.each(z, function(C, B) {
                                var D = ""
                                  , A = b(g, t);
                                if (e.founded(r[A]) && r[A] == B.jg_id) {
                                    D = ' selected="selected" ';
                                    s()
                                }
                                y.push('<option value="' + B.jg_id + '" ' + D + ">" + B.jgmc + "</option>")
                            })
                        }
                    });
                    e(g).empty().append(y.join("")).trigger("chosen:updated");
                    jQuery.ajaxSetup({
                        async: true
                    })
                }
            }
            function q() {
                if (e.founded(n) && e(n).defined()) {
					console.log('专业号')
                    if (e.founded(o) && e(o).defined() && e(o).is("select")) {
                        e(o).find("option:gt(0)").remove()
                    }
                    if (e.founded(h) && e(h).defined() && e(h).is("select")) {
                        e(h).find("option:gt(0)").remove()
                    }
                    d({i, t, w, g, n, o, h, p});
                    if (e(n).is("select")) {
                        var z = [];
                        z.push('<option value="">' + m + "</option>");
                        jQuery.ajaxSetup({
                            async: false
                        });
                        e.getJSON(_path + "/xtgl/comm_cxZydmList.html", a.call(this, i, t), function(C) {
                            if (e.founded(C)) {
                                e.each(C, function(F, E) {
                                    var G = ""
                                      , D = b(n, t);
                                    if (e.founded(r[D]) && r[D] == E.zyh_id) {
                                        G = ' selected="selected" ';
                                        l();
                                        s()
                                    }
                                    z.push('<option value="' + E.zyh_id + '" ' + G + ">" + E.zymc + "</option>")
                                })
                            }
                        });
                        e(n).empty().append(z.join("")).trigger("chosen:updated");
                        jQuery.ajaxSetup({
                            async: true
                        })
                    } else {
                        if (e(n).is(".multi-select-value")) {
                            var B = e(n).closest(".multi-control");
                            e(n).val("");
                            e(B).find(".show-panel").empty();
                            e(B).find(".chosen-choices").empty();
                            e(B).find(".multi-ctn").empty();
                            e(B).find(".ellipsis").hide();
                            var y;
                            jQuery.ajaxSetup({
                                async: false
                            });
                            e.getJSON(_path + "/xtgl/comm_cxZydmList.html", a.call(this, i, t), function(C) {
                                if (e.founded(C)) {
                                    y = C
                                }
                            });
                            jQuery.ajaxSetup({
                                async: true
                            });
                            var z = "";
                            var A = e(n).attr("id") + "_";
							//搜索框
							if(domain && domain.showSearch){
								z+='<div class="chosen-search"><input type="text" autocomplete="off" name="autocomplete" autofocus></div>'
							}
							//全选
							if(domain && domain.ctnAll){
								z+='<div data-xh="-1" class="ctn-all">'+
								'<input class="default-checkbox primary-checkbox" value="-1" type="checkbox" name="multi-item"  id="'+ A +'-1">'+
								'<label for="' + A + '-1"><i class="glyphicon glyphicon-ok multi-ok"></i>全选</label>'+
								'</div>'
							}
							//反选
							if(domain && domain.ctnInvert){
								z+= '<div data-xh="-2" class="ctn-invert">'+
								'<input class="default-checkbox primary-checkbox" value="-2" type="checkbox" name="multi-item" id="'+ A +'-2">'+
								'<label for="' + A + '-2"><i class="glyphicon glyphicon-ok multi-ok"></i>反选</label>'+
								'</div>'
							}
                            //全不选
                            if(domain && domain.ctnOut){
								z+= '<div data-xh="-3" class="ctn-out">'+
								'<input class="default-checkbox primary-checkbox" value="-3" type="checkbox" name="multi-item" id="'+ A +'-3">'+
								'<label for="' + A + '-3"><i class="glyphicon glyphicon-ok multi-ok"></i>全不选</label>'+
								'</div>'
							}
                            e.each(y || [], function(D, C) {
                                z += '<div data-xh="' + D + '" class="ctb-item">';
                                z += '<input class="default-checkbox primary-checkbox" value="' + C.zyh_id + '" type="checkbox" name="multi-item" id="' + A + D + '">';
                                z += '<label for="' + A + D + '"><i class="glyphicon glyphicon-ok multi-ok"></i>' + C.zymc + "</label>";
                                z += "</div>"
                            });
                            e(B).find(".multi-ctn").html(z)

							if(domain && domain.showSearch && e.getctbTtem){
								//每次重新赋值后需要保存当前所有的下拉值 
								// e.getctbTtem()
							}
                        }
                    }
                }
            }
            function l() {
                if (e.founded(o) && e(o).defined()) {
                    d({i, t, w, g, n, o, h, p});
                    if (e(o).is("select")) {
                        var z = [];
                        z.push('<option value="">' + m + "</option>");
                        jQuery.ajaxSetup({
                            async: false
                        });
                        e.getJSON(_path + "/xtgl/comm_cxZyfxList.html", a.call(this, i, t), function(C) {
                            if (e.founded(C)) {
                                e.each(C, function(F, E) {
                                    var G = ""
                                      , D = b(o, t);
                                    if (e.founded(r[D]) && r[D] == E.zyfx_id) {
                                        G = ' selected="selected" ';
                                        s()
                                    }
                                    z.push('<option value="' + E.zyfx_id + '" ' + G + ">" + E.zyfxmc + "</option>")
                                })
                            }
                        });
                        e(o).empty().append(z.join("")).trigger("chosen:updated");
                        jQuery.ajaxSetup({
                            async: true
                        })
                    } else {
                        if (e(o).is(".multi-select-value")) {
                            var B = e(o).closest(".multi-control");
                            e(o).val("");
                            e(B).find(".show-panel").empty();
                            e(B).find(".chosen-choices").empty();
                            e(B).find(".multi-ctn").empty();
                            e(B).find(".ellipsis").hide();
                            var y;
                            jQuery.ajaxSetup({
                                async: false
                            });
                            e.getJSON(_path + "/xtgl/comm_cxZyfxList.html", a.call(this, i, t), function(C) {
                                if (e.founded(C)) {
                                    y = C
                                }
                            });
                            jQuery.ajaxSetup({
                                async: true
                            });
                            var z = "";
                            var A = e(o).attr("id") + "_";
							//搜索框
							if(domain.showSearch){
								z+='<div class="chosen-search"><input type="text" autocomplete="off" name="autocomplete" autofocus></div>'
							}
							//全选
							if(domain.ctnAll){
								z+='<div data-xh="-1" class="ctn-all">'+
								'<input class="default-checkbox primary-checkbox" value="-1" type="checkbox" name="multi-item"  id="'+ A +'-1">'+
								'<label for="' + A + '-1"><i class="glyphicon glyphicon-ok multi-ok"></i>全选</label>'+
								'</div>'
							}
							//反选
							if(domain && domain.ctnInvert){
								z+= '<div data-xh="-2" class="ctn-invert">'+
								'<input class="default-checkbox primary-checkbox" value="-2" type="checkbox" name="multi-item" id="'+ A +'-2">'+
								'<label for="' + A + '-2"><i class="glyphicon glyphicon-ok multi-ok"></i>反选</label>'+
								'</div>'
							}
                            //全不选
                            if(domain && domain.ctnOut){
								z+= '<div data-xh="-3" class="ctn-out">'+
								'<input class="default-checkbox primary-checkbox" value="-3" type="checkbox" name="multi-item" id="'+ A +'-3">'+
								'<label for="' + A + '-3"><i class="glyphicon glyphicon-ok multi-ok"></i>全不选</label>'+
								'</div>'
							}
                            e.each(y || [], function(D, C) {
                                z += '<div data-xh="' + D + '" class="ctb-item">';
                                z += '<input class="default-checkbox primary-checkbox" value="' + C.zyfx_id + '" type="checkbox" name="multi-item" id="' + A + D + '">';
                                z += '<label for="' + A + D + '"><i class="glyphicon glyphicon-ok multi-ok"></i>' + C.zyfxmc + "</label>";
                                z += "</div>"
                            });
                            e(B).find(".multi-ctn").html(z)
                        }
                    }
                }
            }
            function s() {
                if (e.founded(h) && e(h).defined()) {
                    d({i, t, w, g, n, o, h, p});
                    if (e(h).is("select")) {
                        var z = [];
                        z.push('<option value="">' + m + "</option>");
                        jQuery.ajaxSetup({
                            async: false
                        });
                        e.getJSON(_path + "/xtgl/comm_cxBjdmList.html", a.call(this, i, t), function(C) {
                            if (e.founded(C)) {
                                e.each(C, function(F, E) {
                                    var G = ""
                                      , D = b(h, t);
                                    if (e.founded(r[D]) && r[D] == E.bh_id) {
                                        G = ' selected="selected" '
                                    }
                                    z.push('<option value="' + E.bh_id + '" ' + G + ">" + E.bj + "</option>")
                                })
                            }
                        });
                        e(h).empty().append(z.join("")).trigger("chosen:updated");
                        jQuery.ajaxSetup({
                            async: true
                        })
                    } else {
                        if (e(h).is(".multi-select-value")) {
                            var B = e(h).closest(".multi-control");
                            e(h).val("");
                            e(B).find(".show-panel").empty();
                            e(B).find(".chosen-choices").empty();
                            e(B).find(".multi-ctn").empty();
                            e(B).find(".ellipsis").hide();
                            var y;
                            jQuery.ajaxSetup({
                                async: false
                            });
                            e.getJSON(_path + "/xtgl/comm_cxBjdmList.html", a.call(this, i, t), function(C) {
                                if (e.founded(C)) {
                                    y = C
                                }
                            });
                            jQuery.ajaxSetup({
                                async: true
                            });
                            var z = "";
                            var A = e(h).attr("id") + "_";
							//搜索框
							if(domain.showSearch){
								z+='<div class="chosen-search"><input type="text" autocomplete="off" name="autocomplete" autofocus></div>'
							}
							//全选
							if(domain.ctnAll){
								z+='<div data-xh="-1" class="ctn-all">'+
								'<input class="default-checkbox primary-checkbox" value="-1" type="checkbox" name="multi-item"  id="'+ A +'-1">'+
								'<label for="' + A + '-1"><i class="glyphicon glyphicon-ok multi-ok"></i>全选</label>'+
								'</div>'
							}
							//反选
							if(domain && domain.ctnInvert){
								z+= '<div data-xh="-2" class="ctn-invert">'+
								'<input class="default-checkbox primary-checkbox" value="-2" type="checkbox" name="multi-item" id="'+ A +'-2">'+
								'<label for="' + A + '-2"><i class="glyphicon glyphicon-ok multi-ok"></i>反选</label>'+
								'</div>'
							}
                            //全不选
                            if(domain && domain.ctnOut){
								z+= '<div data-xh="-3" class="ctn-out">'+
								'<input class="default-checkbox primary-checkbox" value="-3" type="checkbox" name="multi-item" id="'+ A +'-3">'+
								'<label for="' + A + '-3"><i class="glyphicon glyphicon-ok multi-ok"></i>全不选</label>'+
								'</div>'
							}
                            e.each(y || [], function(D, C) {
                                z += '<div data-xh="' + D + '" class="ctb-item">';
                                z += '<input class="default-checkbox primary-checkbox" value="' + C.bh_id + '" type="checkbox" name="multi-item" id="' + A + D + '">';
                                z += '<label for="' + A + D + '"><i class="glyphicon glyphicon-ok multi-ok"></i>' + C.bj + "</label>";
                                z += "</div>"
                            });
                            e(B).find(".multi-ctn").html(z)
                        }
                    }
                }
            }
            if (e.founded(p) && e(p).defined()) {
                var x = b(p, t);
                if (e.founded(e(p).val())) {
                    i[x] = e(p).val()
                }
                e(document).off('change',p).on('change',p,function() {
                    if (e.founded(e(this).val())) {
                        i[x] = e(this).val();
                        f(this)
                    } else {
                        i[x] = null
                    }
                    q();
                    l();
                    s();
                    j.call(k, a.call(this, i, t))
                })
            }
            if (e.founded(w) && e(w).defined()) {
                var x = b(w, t);
                if (e.founded(e(w).val())) {
                    i[x] = e(w).val();
                    v();
                    q()
                }
                e(document).off('change',w).on('change',w,function(){
                    if (e.founded(e(this).val())) {
                        i[x] = e(this).val();
                        f(this)
                    } else {
                        i[x] = null
                    }
                    v();
                    q();
                    l();
                    s();
                    j.call(k, a.call(this, i, t))
                })
            }
            if (e.founded(g) && e(g).defined()) {
                var x = b(g, t);
                if (e.founded(e(g).val())) {
                    i[x] = e(g).val();
                    q()
                }
                e(document).off('change',g).on('change',g,function() {
                    if (e.founded(e(this).val())) {
                        i[x] = e(this).val();
                        f(this)
                    } else {
                        i[x] = null
                    }
                })
            }
            if (e.founded(n) && e(n).defined()) {
                var x = b(n, t);
                if (e.founded(e(n).val())) {
                    i[x] = e(n).val();
                    l();
                    s()
                }
                e(document).off('change',n).on('change',n,function() {
                    if (e.founded(e(this).val())) {
                        i[x] = e(this).val();
                        f(this)
                    } else {
                        i[x] = null
                    }
                    l();
                    s();
                    j.call(k, a.call(this, i, t))
                })
            }
            if (e.founded(o) && e(o).defined() && e(o)) {
                var x = b(o, t);
                if (e.founded(e(o).val())) {
                    i[x] = e(o).val()
                }
                e(o).unbind("change").change(function() {
                    if (e.founded(e(this).val())) {
                        i[x] = e(this).val();
                        f(this)
                    } else {
                        i[x] = null
                    }
                    j.call(k, a.call(this, i, t))
                })
            }
            if (e.founded(h) && e(h).defined()) {
                var x = b(h, t);
                if (e.founded(e(h).val())) {
                    i[x] = e(h).val()
                }
                e(h).unbind("change").change(function() {
                    if (e.founded(e(this).val())) {
                        i[x] = e(this).val();
                        f(this)
                    } else {
                        i[x] = null
                    }
                    j.call(k, a.call(this, i, t))
                })
            }
        },
        //有学部调用这个
        xbChangeEvent: function(xb, w, g, n, o, h, p, u, j, m, domain,extraP) {
			//domain = {showSearch:true, ctnAll:true, ctnInvert:true,ctnOut:true} //搜索框 全选 反选 全不选
            var k = this;
            var i = {};
            u = e.defined(u) ? u : {};
            j = (e.defined(j) && e.isFunction(j)) ? j : e.noop;
            m = e.defined(m) ? m : "\u5168\u90e8";
            var t = u.mapper || {};
            var r = c({i, u, w, g, n, o, h, p,xb});

            function getXy() {
                if (e.founded(w) && e(w).defined()) {
                    console.log('学院')
                    var extraParam = extraP?extraP:{dataType:10} 
                    var par = a.call(this, i, t);
                    var newPar = Object.assign({},extraParam,par)
                    d({i, t, w, g, n, o, h, p,xb});
                    if (e(w).is("select")) {
                        var z = [];
                        z.push('<option value="">' + m + "</option>");
                        jQuery.ajaxSetup({
                            async: false
                        });
                      
                        e.getJSON(_path + "/xtgl/list_cxDataList.html", newPar, function(C) {
                            if (e.founded(C)) {
                                e.each(C, function(F, E) {
                                    var G = ""
                                      , D = b(w, t);
                                    if (e.founded(r[D]) && r[D] == E.value) {
                                        G = ' selected="selected" ';
                                        l();
                                        s()
                                    }
                                    z.push('<option value="' + E.value + '" ' + G + ">" + E.name + "</option>")
                                })
                            }
                        });
                        e(w).empty().append(z.join("")).trigger("chosen:updated");
                        jQuery.ajaxSetup({
                            async: true
                        })
                    } else {
                        if (e(w).is(".multi-select-value")) {
                            var B = e(w).closest(".multi-control");
                            e(w).val("");
                            e(B).find(".show-panel").empty();
                            e(B).find(".chosen-choices").empty();
                            e(B).find(".multi-ctn").empty();
                            e(B).find(".ellipsis").hide();
                            var y;
                            jQuery.ajaxSetup({
                                async: false
                            });
                            e.getJSON(_path + "/xtgl/list_cxDataList.html", newPar, function(C) {
                                if (e.founded(C)) {
                                    y = C
                                }
                            });
                            jQuery.ajaxSetup({
                                async: true
                            });
                            var z = "";
                            var A = e(w).attr("id") + "_";
							//搜索框
							if(domain && domain.showSearch){
								z+='<div class="chosen-search"><input type="text" autocomplete="off" name="autocomplete" autofocus></div>'
							}
							//全选
							if(domain && domain.ctnAll){
								z+='<div data-xh="-1" class="ctn-all">'+
								'<input class="default-checkbox primary-checkbox" value="-1" type="checkbox" name="multi-item"  id="'+ A +'-1">'+
								'<label for="' + A + '-1"><i class="glyphicon glyphicon-ok multi-ok"></i>全选</label>'+
								'</div>'
							}
							//反选
							if(domain && domain.ctnInvert){
								z+= '<div data-xh="-2" class="ctn-invert">'+
								'<input class="default-checkbox primary-checkbox" value="-2" type="checkbox" name="multi-item" id="'+ A +'-2">'+
								'<label for="' + A + '-2"><i class="glyphicon glyphicon-ok multi-ok"></i>反选</label>'+
								'</div>'
							}
                            //全不选
                            if(domain && domain.ctnOut){
								z+= '<div data-xh="-3" class="ctn-out">'+
								'<input class="default-checkbox primary-checkbox" value="-3" type="checkbox" name="multi-item" id="'+ A +'-3">'+
								'<label for="' + A + '-3"><i class="glyphicon glyphicon-ok multi-ok"></i>全不选</label>'+
								'</div>'
							}
                            e.each(y || [], function(D, C) {
                                z += '<div data-xh="' + D + '" class="ctb-item">';
                                z += '<input class="default-checkbox primary-checkbox" value="' + C.value + '" type="checkbox" name="multi-item" id="' + A + D + '">';
                                z += '<label for="' + A + D + '"><i class="glyphicon glyphicon-ok multi-ok"></i>' + C.name + "</label>";
                                z += "</div>"
                            });
                            e(B).find(".multi-ctn").html(z)

							if(domain && domain.showSearch && e.getctbTtem){
								//每次重新赋值后需要保存当前所有的下拉值 
								// e.getctbTtem()
							}
                        }
                    }
                }
            }

            function v() {
                if (e.founded(g) && e(g).defined() && e(g).is("select")) {
                    d({i, t, w, g, n, o, h, p,xb});
                    var y = [];
                    y.push('<option value="">' + m + "</option>");
                    jQuery.ajaxSetup({
                        async: false
                    });
                    e.getJSON(_path + "/xtgl/comm_cxXxdmList.html", a.call(this, i, t), function(z) {
                        if (e.founded(z)) {
                            e.each(z, function(C, B) {
                                var D = ""
                                  , A = b(g, t);
                                if (e.founded(r[A]) && r[A] == B.jg_id) {
                                    D = ' selected="selected" ';
                                    s()
                                }
                                y.push('<option value="' + B.jg_id + '" ' + D + ">" + B.jgmc + "</option>")
                            })
                        }
                    });
                    e(g).empty().append(y.join("")).trigger("chosen:updated");
                    jQuery.ajaxSetup({
                        async: true
                    })
                }
            }
            function q() {
                if (e.founded(n) && e(n).defined()) {
					console.log('专业号')
                    if (e.founded(o) && e(o).defined() && e(o).is("select")) {
                        e(o).find("option:gt(0)").remove()
                    }
                    if (e.founded(h) && e(h).defined() && e(h).is("select")) {
                        e(h).find("option:gt(0)").remove()
                    }
                    d({i, t, w, g, n, o, h, p,xb});
                    if (e(n).is("select")) {
                        var z = [];
                        z.push('<option value="">' + m + "</option>");
                        jQuery.ajaxSetup({
                            async: false
                        });
                        e.getJSON(_path + "/xtgl/comm_cxZydmList.html", a.call(this, i, t), function(C) {
                            if (e.founded(C)) {
                                e.each(C, function(F, E) {
                                    var G = ""
                                      , D = b(n, t);
                                    if (e.founded(r[D]) && r[D] == E.zyh_id) {
                                        G = ' selected="selected" ';
                                        l();
                                        s()
                                    }
                                    z.push('<option value="' + E.zyh_id + '" ' + G + ">" + E.zymc + "</option>")
                                })
                            }
                        });
                        e(n).empty().append(z.join("")).trigger("chosen:updated");
                        jQuery.ajaxSetup({
                            async: true
                        })
                    } else {
                        if (e(n).is(".multi-select-value")) {
                            var B = e(n).closest(".multi-control");
                            e(n).val("");
                            e(B).find(".show-panel").empty();
                            e(B).find(".chosen-choices").empty();
                            e(B).find(".multi-ctn").empty();
                            e(B).find(".ellipsis").hide();
                            var y;
                            jQuery.ajaxSetup({
                                async: false
                            });
                            e.getJSON(_path + "/xtgl/comm_cxZydmList.html", a.call(this, i, t), function(C) {
                                if (e.founded(C)) {
                                    y = C
                                }
                            });
                            jQuery.ajaxSetup({
                                async: true
                            });
                            var z = "";
                            var A = e(n).attr("id") + "_";
							//搜索框
							if(domain && domain.showSearch){
								z+='<div class="chosen-search"><input type="text" autocomplete="off" name="autocomplete" autofocus></div>'
							}
							//全选
							if(domain && domain.ctnAll){
								z+='<div data-xh="-1" class="ctn-all">'+
								'<input class="default-checkbox primary-checkbox" value="-1" type="checkbox" name="multi-item"  id="'+ A +'-1">'+
								'<label for="' + A + '-1"><i class="glyphicon glyphicon-ok multi-ok"></i>全选</label>'+
								'</div>'
							}
							//反选
							if(domain && domain.ctnInvert){
								z+= '<div data-xh="-2" class="ctn-invert">'+
								'<input class="default-checkbox primary-checkbox" value="-2" type="checkbox" name="multi-item" id="'+ A +'-2">'+
								'<label for="' + A + '-2"><i class="glyphicon glyphicon-ok multi-ok"></i>反选</label>'+
								'</div>'
							}
                            //全不选
                            if(domain && domain.ctnOut){
								z+= '<div data-xh="-3" class="ctn-out">'+
								'<input class="default-checkbox primary-checkbox" value="-3" type="checkbox" name="multi-item" id="'+ A +'-3">'+
								'<label for="' + A + '-3"><i class="glyphicon glyphicon-ok multi-ok"></i>全不选</label>'+
								'</div>'
							}
                            e.each(y || [], function(D, C) {
                                z += '<div data-xh="' + D + '" class="ctb-item">';
                                z += '<input class="default-checkbox primary-checkbox" value="' + C.zyh_id + '" type="checkbox" name="multi-item" id="' + A + D + '">';
                                z += '<label for="' + A + D + '"><i class="glyphicon glyphicon-ok multi-ok"></i>' + C.zymc + "</label>";
                                z += "</div>"
                            });
                            e(B).find(".multi-ctn").html(z)

							if(domain && domain.showSearch && e.getctbTtem){
								//每次重新赋值后需要保存当前所有的下拉值 
								// e.getctbTtem()
							}
                        }
                    }
                }
            }
            function l() {
                if (e.founded(o) && e(o).defined()) {
                    d({i, t, w, g, n, o, h, p,xb});
                    if (e(o).is("select")) {
                        var z = [];
                        z.push('<option value="">' + m + "</option>");
                        jQuery.ajaxSetup({
                            async: false
                        });
                        e.getJSON(_path + "/xtgl/comm_cxZyfxList.html", a.call(this, i, t), function(C) {
                            if (e.founded(C)) {
                                e.each(C, function(F, E) {
                                    var G = ""
                                      , D = b(o, t);
                                    if (e.founded(r[D]) && r[D] == E.zyfx_id) {
                                        G = ' selected="selected" ';
                                        s()
                                    }
                                    z.push('<option value="' + E.zyfx_id + '" ' + G + ">" + E.zyfxmc + "</option>")
                                })
                            }
                        });
                        e(o).empty().append(z.join("")).trigger("chosen:updated");
                        jQuery.ajaxSetup({
                            async: true
                        })
                    } else {
                        if (e(o).is(".multi-select-value")) {
                            var B = e(o).closest(".multi-control");
                            e(o).val("");
                            e(B).find(".show-panel").empty();
                            e(B).find(".chosen-choices").empty();
                            e(B).find(".multi-ctn").empty();
                            e(B).find(".ellipsis").hide();
                            var y;
                            jQuery.ajaxSetup({
                                async: false
                            });
                            e.getJSON(_path + "/xtgl/comm_cxZyfxList.html", a.call(this, i, t), function(C) {
                                if (e.founded(C)) {
                                    y = C
                                }
                            });
                            jQuery.ajaxSetup({
                                async: true
                            });
                            var z = "";
                            var A = e(o).attr("id") + "_";
							//搜索框
							if(domain.showSearch){
								z+='<div class="chosen-search"><input type="text" autocomplete="off" name="autocomplete" autofocus></div>'
							}
							//全选
							if(domain.ctnAll){
								z+='<div data-xh="-1" class="ctn-all">'+
								'<input class="default-checkbox primary-checkbox" value="-1" type="checkbox" name="multi-item"  id="'+ A +'-1">'+
								'<label for="' + A + '-1"><i class="glyphicon glyphicon-ok multi-ok"></i>全选</label>'+
								'</div>'
							}
							//反选
							if(domain && domain.ctnInvert){
								z+= '<div data-xh="-2" class="ctn-invert">'+
								'<input class="default-checkbox primary-checkbox" value="-2" type="checkbox" name="multi-item" id="'+ A +'-2">'+
								'<label for="' + A + '-2"><i class="glyphicon glyphicon-ok multi-ok"></i>反选</label>'+
								'</div>'
							}
                            //全不选
                            if(domain && domain.ctnOut){
								z+= '<div data-xh="-3" class="ctn-out">'+
								'<input class="default-checkbox primary-checkbox" value="-3" type="checkbox" name="multi-item" id="'+ A +'-3">'+
								'<label for="' + A + '-3"><i class="glyphicon glyphicon-ok multi-ok"></i>全不选</label>'+
								'</div>'
							}
                            e.each(y || [], function(D, C) {
                                z += '<div data-xh="' + D + '" class="ctb-item">';
                                z += '<input class="default-checkbox primary-checkbox" value="' + C.zyfx_id + '" type="checkbox" name="multi-item" id="' + A + D + '">';
                                z += '<label for="' + A + D + '"><i class="glyphicon glyphicon-ok multi-ok"></i>' + C.zyfxmc + "</label>";
                                z += "</div>"
                            });
                            e(B).find(".multi-ctn").html(z)
                        }
                    }
                }
            }
            function s() {
                if (e.founded(h) && e(h).defined()) {
                    d({i, t,w, g, n, o, h, p,xb});
                    if (e(h).is("select")) {
                        var z = [];
                        z.push('<option value="">' + m + "</option>");
                        jQuery.ajaxSetup({
                            async: false
                        });
                        e.getJSON(_path + "/xtgl/comm_cxBjdmList.html", a.call(this, i, t), function(C) {
                            if (e.founded(C)) {
                                e.each(C, function(F, E) {
                                    var G = ""
                                      , D = b(h, t);
                                    if (e.founded(r[D]) && r[D] == E.bh_id) {
                                        G = ' selected="selected" '
                                    }
                                    z.push('<option value="' + E.bh_id + '" ' + G + ">" + E.bj + "</option>")
                                })
                            }
                        });
                        e(h).empty().append(z.join("")).trigger("chosen:updated");
                        jQuery.ajaxSetup({
                            async: true
                        })
                    } else {
                        if (e(h).is(".multi-select-value")) {
                            var B = e(h).closest(".multi-control");
                            e(h).val("");
                            e(B).find(".show-panel").empty();
                            e(B).find(".chosen-choices").empty();
                            e(B).find(".multi-ctn").empty();
                            e(B).find(".ellipsis").hide();
                            var y;
                            jQuery.ajaxSetup({
                                async: false
                            });
                            e.getJSON(_path + "/xtgl/comm_cxBjdmList.html", a.call(this, i, t), function(C) {
                                if (e.founded(C)) {
                                    y = C
                                }
                            });
                            jQuery.ajaxSetup({
                                async: true
                            });
                            var z = "";
                            var A = e(h).attr("id") + "_";
							//搜索框
							if(domain.showSearch){
								z+='<div class="chosen-search"><input type="text" autocomplete="off" name="autocomplete" autofocus></div>'
							}
							//全选
							if(domain.ctnAll){
								z+='<div data-xh="-1" class="ctn-all">'+
								'<input class="default-checkbox primary-checkbox" value="-1" type="checkbox" name="multi-item"  id="'+ A +'-1">'+
								'<label for="' + A + '-1"><i class="glyphicon glyphicon-ok multi-ok"></i>全选</label>'+
								'</div>'
							}
							//反选
							if(domain && domain.ctnInvert){
								z+= '<div data-xh="-2" class="ctn-invert">'+
								'<input class="default-checkbox primary-checkbox" value="-2" type="checkbox" name="multi-item" id="'+ A +'-2">'+
								'<label for="' + A + '-2"><i class="glyphicon glyphicon-ok multi-ok"></i>反选</label>'+
								'</div>'
							}
                            //全不选
                            if(domain && domain.ctnOut){
								z+= '<div data-xh="-3" class="ctn-out">'+
								'<input class="default-checkbox primary-checkbox" value="-3" type="checkbox" name="multi-item" id="'+ A +'-3">'+
								'<label for="' + A + '-3"><i class="glyphicon glyphicon-ok multi-ok"></i>全不选</label>'+
								'</div>'
							}
                            e.each(y || [], function(D, C) {
                                z += '<div data-xh="' + D + '" class="ctb-item">';
                                z += '<input class="default-checkbox primary-checkbox" value="' + C.bh_id + '" type="checkbox" name="multi-item" id="' + A + D + '">';
                                z += '<label for="' + A + D + '"><i class="glyphicon glyphicon-ok multi-ok"></i>' + C.bj + "</label>";
                                z += "</div>"
                            });
                            e(B).find(".multi-ctn").html(z)
                        }
                    }
                }
            }
            if (e.founded(p) && e(p).defined()) {
                var x = b(p, t);
                if (e.founded(e(p).val())) {
                    i[x] = e(p).val()
                }
                e(document).off('change',p).on('change',p,function() {
                    if (e.founded(e(this).val())) {
                        i[x] = e(this).val();
                        f(this)
                    } else {
                        i[x] = null
                    }
                    q();
                    l();
                    s();
                    j.call(k, a.call(this, i, t))
                })
            }
            if (e.founded(xb) && e(xb).defined()) {
                var xbName = b(xb, t);
                if (e.founded(e(xb).val())) {
                    i[xbName] = e(xb).val();
                    getXy();
                    v();
                    q();
                    l();
                    s();
                }
                e(document).off('change',xb).on('change',xb,function(){
                    if (e.founded(e(this).val())) {
                        i[xbName] = e(this).val();
                        f(this)
                    } else {
                        i[xbName] = null
                    }
                    getXy();
                    v();
                    q();
                    l();
                    s();
                    j.call(k, a.call(this, i, t))
                })
            }

            if (e.founded(w) && e(w).defined()) {
                var x = b(w, t);
                if (e.founded(e(w).val())) {
                    i[x] = e(w).val();
                    v();
                    q()
                }
                e(document).off('change',w).on('change',w,function(){
                    if (e.founded(e(this).val())) {
                        i[x] = e(this).val();
                        f(this)
                    } else {
                        i[x] = null
                    }
                    v();
                    q();
                    l();
                    s();
                    j.call(k, a.call(this, i, t))
                })
            }
            if (e.founded(g) && e(g).defined()) {
                var x = b(g, t);
                if (e.founded(e(g).val())) {
                    i[x] = e(g).val();
                    q()
                }
                e(document).off('change',g).on('change',g,function() {
                    if (e.founded(e(this).val())) {
                        i[x] = e(this).val();
                        f(this)
                    } else {
                        i[x] = null
                    }
                })
            }
            if (e.founded(n) && e(n).defined()) {
                var x = b(n, t);
                if (e.founded(e(n).val())) {
                    i[x] = e(n).val();
                    l();
                    s()
                }
                e(document).off('change',n).on('change',n,function() {
                    if (e.founded(e(this).val())) {
                        i[x] = e(this).val();
                        f(this)
                    } else {
                        i[x] = null
                    }
                    l();
                    s();
                    j.call(k, a.call(this, i, t))
                })
            }
            if (e.founded(o) && e(o).defined() && e(o)) {
                var x = b(o, t);
                if (e.founded(e(o).val())) {
                    i[x] = e(o).val()
                }
                e(o).unbind("change").change(function() {
                    if (e.founded(e(this).val())) {
                        i[x] = e(this).val();
                        f(this)
                    } else {
                        i[x] = null
                    }
                    j.call(k, a.call(this, i, t))
                })
            }
            if (e.founded(h) && e(h).defined()) {
                var x = b(h, t);
                if (e.founded(e(h).val())) {
                    i[x] = e(h).val()
                }
                e(h).unbind("change").change(function() {
                    if (e.founded(e(this).val())) {
                        i[x] = e(this).val();
                        f(this)
                    } else {
                        i[x] = null
                    }
                    j.call(k, a.call(this, i, t))
                })
            }

        }
    })
}(jQuery));

/*
 * 业务框架选择弹窗：详情参见：jquery.zftal.selectPanel-1.0.0.js
 */
;(function(a) {
    var b = ["", "\u9009\u62e9\u5b66\u751f", "\u9009\u62e9\u6559\u5e08", "\u9009\u62e9\u5b66\u9662", "\u9009\u62e9\u4e13\u4e1a", "\u9009\u62e9\u73ed\u7ea7", "\u9009\u62e9\u8bfe\u7a0b", "\u9009\u62e9\u5e74\u7ea7", "\u9009\u62e9\u673a\u6784", "\u9009\u62e9\u4e8c\u7ea7\u6559\u5ba4\u573a\u5730\u7c7b\u522b", "\u9009\u62e9\u89d2\u8272", "\u9009\u62e9\u4e13\u4e1a\u65b9\u5411", "\u9009\u62e9\u6559\u5b66\u573a\u5730", "\u9009\u62E9\u5E74\u7EA7\u4E13\u4E1A", "\u9009\u62e9\u7528\u6237", "\u9009\u62e9\u5927\u7c7b", "\u9009\u62E9\u8003\u8BD5\u540D\u79F0", "\u9009\u62E9\u6559\u5B66\u73ED", "\u9009\u62E9\u573A\u5730\u7C7B\u522B", "\u9009\u62E9\u8BA1\u5212\u5185\u8BFE\u7A0B", "\u9009\u62E9\u6821\u533A", "\u9009\u62E9\u8BFE\u7A0B\u7EC4", "\u9009\u62E9\u5E74\u7EA7\u5B66\u9662", "\u9009\u62E9\u5F00\u8BFE\u5B66\u9662"];
    a.extend({
        showSelectDialog: function(d, e, c) {
            var g = {
                title: null,
                mapper: null,
                index: "select",
                checked: [],
                multiselect: true,
                selectAttr: true,
                width: 800,
                height: 500,
                gridType: d || "1"
            };
            c = (a.defined(c) && jQuery.isFunction(c)) ? c : a.noop;
            a.extend(g, e || {});
            var h = e.title || (b[Number(g.gridType)] || "选择");
            var f = a.extend(true, {}, g);
            a.dialog(a.extend({}, g, {
                title: h,
                href: _path + "/grid/grid_cxCommonSelect.html",
                data: f,
                modalName: "selectModal",
                buttons: {
                    success: {
                        label: $.i18n.jwglxt["sure"],
                        className: "btn-primary",
                        callback: function() {
                            return c.call(this, this.content.getResultArr(), this.content.getDeleteArr())
                        }
                    },
                    cancel: {
                        label: $.i18n.jwglxt["cancel"],
                        className: "btn-default"
                    }
                }
            }))
        }
    });
    a.fn.extend({
        loadSelectPanel: function(d, e, c) {
            var f = {
                title: null,
                href: "",
                mapper: null,
                index: "select",
                checked: [],
                multiselect: true,
                selectAttr: true,
                width: 800,
                height: 500,
                gridType: d || "1"
            };
            c = (a.defined(c) && jQuery.isFunction(c)) ? c : a.noop;
            a.extend(f, e || {});
            window.api = {
                data: f || {},
                opener: self
            };
            var g = f.title || (b[Number(f.gridType) - 1] || "");
            a(this).load(_path + "/grid/grid_cxCommonSelect.html", a.extend(f, e || {}, {
                title: g
            }), function() {
                c.call(this, getResultArr(), getDeleteArr())
            })
        }
    })
}(jQuery));
/*
 * 业务框架工作流全局方法：详情参见：jquery.zftal.workflow-1.0.0.js
 */
;(function(a) {
    a.hasWorkFlow = function(c) {
        var b = true;
        jQuery.ajaxSetup({
            async: false
        });
        jQuery.post(_path + "/query/query_cxSpYwdmExist.html", {
            ywdm: c
        }, function(d) {
            b = d
        }, "json");
        jQuery.ajaxSetup({
            async: true
        });
        return b
    }
    ;
    a.hasWorkFlowNode = function(c) {
        var b = true;
        jQuery.ajaxSetup({
            async: false
        });
        jQuery.post(_path + "/query/query_cxSpYwdmExist2.html", {
            ywdm: c
        }, function(d) {
            b = d
        }, "json");
        jQuery.ajaxSetup({
            async: true
        });
        return b
    }
    ;
    a.chooseWorkFlow = function(c, b) {
        a.showDialog(_path + "/sp/spSetting_cxSelectBusiness.html", a.i18n.zftal.workFlow["chooseWorkFlow"], {
            width: "900px",
            modalName: "splModal",
            data: {
                ywdl: c
            },
            buttons: {
                success: {
                    label: a.i18n.bootbox.buttons["success"],
                    className: "btn-primary",
                    callback: function() {
                        if (a.isFunction(b)) {
                            return b.call(this) || false
                        } else {
                            return true
                        }
                    }
                },
                cancel: {
                    label: a.i18n.bootbox.buttons["cancel"],
                    className: "btn-primary"
                }
            }
        })
    }
    ;
    a.viewWorkFlow = function(b) {
        a.showDialog(_path + "/sp/spSetting_cxLcgz.html", a.i18n.zftal.workFlow["viewWorkFlow"], a.extend(true, {}, viewConfig, {
            width: ($("#yhgnPage").innerWidth() - 100) + "px",
            data: {
                id: b
            }
        }))
    }
}
)(jQuery);
/*
 * 业务框架独有全局方法：详情参见：jquery.zftal-1.0.0.js
 */
;(function(a) {
    a.getURL = function(b, c) {
        c = c || {};
        if (jQuery("#gnmkdmKey").size() == 1 && jQuery("#gnmkdmKey").founded()) {
            if (!a.defined(c.gnmkdm) && a.defined(b) && b.indexOf("gnmkdm") == -1) {
                if (b.indexOf("?") > -1) {
                    b = b + "&gnmkdm=" + jQuery("#gnmkdmKey").val()
                } else {
                    b = b + "?gnmkdm=" + jQuery("#gnmkdmKey").val()
                }
            }
        }
        if (jQuery("#sessionUserKey").size() == 1 && jQuery("#sessionUserKey").founded()) {
            if (!a.defined(c.su) && a.defined(b) && b.indexOf("su") == -1) {
                if (b.indexOf("?") > -1) {} else {}
            }
        }
        return b
    }
    ;
    a.openWin = function(b) {
        top.window.open(a.getURL(b))
    }
    ;
    a.showWin = function(d, b, e, c, g) {
        var f = "";
        if (c == null) {
            f = "Status:YES;dialogWidth:" + b + "px;dialogHeight:" + e + "px;help:no;scroll:no"
        } else {
            f = "Status:YES;dialogWidth:" + b + "px;dialogHeight:" + e + "px;help:no;scroll:yes"
        }
        if (g) {
            window.showModalDialog(a.getURL(requestURL), window, f)
        } else {
            window.open(a.getURL(d), "", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,copyhistory=yes,width=" + b + ",height=" + e + ",left=100,top=100,screenX=0,screenY=0")
        }
    }
    ;
    a.clearIframe = function(f) {
        var c = document.getElementById(f)
          , b = c.contentWindow;
        if (c) {
            try {
                c.src = "about:blank";
                try {
                    b.document.write("");
                    b.document.clear()
                } catch (d) {}
                document.body.removeChild(c)
            } catch (d) {}
        }
    }
    ;
    a.fn.resetIndex = function(b) {
        return a(this).each(function() {
            a(this).find("tr.jqgrow").each(function(c, d) {
                a(this).find(":text,select,:hidden,textarea,:checkbox,:radio").each(function() {
                    var e = a(this).attr("name");
                    if (a.founded(e)) {
                        a(this).attr("name", e.replace(/\[\d+\]/, "[" + c + "]"))
                    }
                });
                if (a.isFunction(b)) {
                    b.call($this, c, d)
                }
            })
        })
    }
    ;
    a.fn.resetOrdinal = function(b) {
        return a(this).each(function() {
            var c = this;
            a(c).find("tbody tr.jqgrow").each(function(d, e) {
                a(this).find("td.detail-rownum").text(d + 1);
                if (a.isFunction(b)) {
                    b.call(c, d, e)
                }
            })
        })
    }
    ;
    a.fn.clearTitle = function(b) {
        return a(this).each(function() {
            var d = this;
            var c = jQuery("#" + d.id).jqGrid("getGridParam", "colModel");
            a.each(c || [], function(e, f) {
                if (a.isFunction(f.formatter)) {
                    a(d).find("tr.jqgrow").each(function(g, h) {
                        a(this).find("td[aria-describedby$='_" + f.name + "']").attr("title", "");
                        if (a.isFunction(b)) {
                            b.call(d, g, h)
                        }
                    })
                }
            })
        })
    }
    ;
    a.fn.newTab = function() {
        top.$("#tabs").tabs("builTab", {
            id: a(this).data("addtab"),
            title: a(this).attr("title") ? a(this).attr("title") : a(this).html(),
            content: options.content ? options.content : a(this).attr("content"),
            url: a(this).data("src"),
            ajax: a(this).attr("ajax") ? true : false,
            tablayout: a(this).data("tab-layout"),
            funclayout: a(this).data("blank-layout"),
            data: a(this).data("request") || {}
        })
    }
    ;
    a.closeTab = function(b) {
        top.$("#tabs").tabs("close", b)
    }
    ;
    a.openReport = function(c) {
        if (a("#statusModal").size() > 0) {
            return
        }
        c = c || {};
        var b = c.reportID;
        if (!a.founded(b)) {
            throw new Error("reportID \u4e0d\u80fd\u4e3a\u7a7a !")
        }
        delete c.reportID;
        var d = {};
        a.each(c || {}, function(e, f) {
            d["mapRow.row." + e] = encodeURIComponent(f || "")
        });
        a.buildForm("reportViewForm", _path + "/design/viewReport_cxFineReportViewIndex.html?reportID=" + b + "&_t" + new Date().getTime(), d).submit()
    }
}
)(jQuery);
/*
 * 业务框架功能菜单相关方法：详情参见：jquery.zftal.func-1.0.0.js
 */
function refRightContent(url) {
    jQuery.ajaxSetup({
        cache: true
    });
    if (jQuery("#rightContent").length == 0) {
        window.location.href = url;
        // 若无rightContent的div，直接做跳转
    } else {
        jQuery.get(url, function(html) {
            jQuery("#rightContent").html(html);
        });
        //jQuery("#rightContent").load(url);
    }
}

function onClickMenu(dyym, gnmkdm, options) {
    //重新设置gnmkdm
    jQuery("#gnmkdmKey").val(gnmkdm);
    //计算位置
    var margin_top = (jQuery("#yhgnPage").innerHeight() - 200) / 2;
    margin_top = (margin_top > 0) ? margin_top : 0;
    //加载页面
    //jQuery("#yhgnPage").html('<p id="loading_status" class="text-center header smaller lighter" style="margin-top:'+margin_top+'px;"><i class="icon-spinner icon-spin orange  bigger-500"></i></br> <span class="bigger-160">网页正在载入数据中.请等待....</span></p>');
    jQuery("#yhgnPage").html('<p id="loading_status" class="text-center header smaller lighter" style="margin-top:' + margin_top + 'px;"><i class="icon-spinner icon-spin orange  bigger-500"></i></br> <span class="bigger-160">' + $.i18n.jwglxt["loadingpage"] + '</span></p>');
    //这里的czdmKey=00；在功能描述控制页面：表示所以的页面	
    //启用缓存：这个地方必须使用true，否则在使用load加载的html中的script标签会自动加上随机数导致无法有效利用浏览器缓存 
    jQuery.ajaxSetup({
        cache: true
    });
    var tmpURL = $.defined(dyym) ? ((dyym || "") + ((dyym || "").indexOf("?") > -1 ? "&" : "?") + ("_t=" + jQuery.now())) : (dyym || "");
    jQuery("#yhgnPage").load(_path + tmpURL, $.extend({}, $(document).data() || {}, {
        "gnmkdm": gnmkdm,
        "czdmKey": "00"
    }, options || {}), function(responseText, textStatus, xmlhttprequest) {
        if (textStatus == "success") {
            //隐藏一个当前功能页面的功能模块代码
            jQuery("#gnmkdmKey").remove();
            jQuery("#requestMap").append('<input type="hidden" id="gnmkdmKey" value="' + gnmkdm + '" />');
        }
        //this;在这里this指向的是当前的DOM对象，即$(".ajax.load")[0] 
        //alert(responseText);//请求返回的内容
        //alert(textStatus);//请求状态：success，error
        //alert(XMLHttpRequest);//XMLHttpRequest对象
        //var _allHeight=document.documentElement.clientHeight;
        //$('.sl_all_bg').css('min-height',_allHeight-110);
    }, "html");

    jQuery("#navbar-nav").find("li").removeClass("active");
    jQuery(this).parent("li").addClass("active");
}

//查看审批流
function ckWorkFlow(rowid) {
    jQuery("#tabGrid").resetSelection();
    jQuery("#tabGrid").setSelection(rowid, false);
    jQuery.viewWorkFlow(rowid);
}

function ckWorkFlow2(rowid) {
    jQuery.viewWorkFlow(rowid);
}
//重写Number的toFixed方法，解决四舍五入精度问题
Number.prototype.toFixed = function(d) {
    var s = this + "";
    if (!d) {
        d = 0;
    } else {
        d = parseInt(d);
    }
    if (s.indexOf(".") == -1)
        s += ".";
    s += new Array(d + 1).join("0");
    if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
        var s = "0" + RegExp.$2
          , pm = RegExp.$1
          , a = RegExp.$3.length
          , b = true;
        if (a == d + 2) {
            a = s.match(/\d/g);
            if (parseInt(a[a.length - 1]) > 4) {
                for (var i = a.length - 2; i >= 0; i--) {
                    a[i] = parseInt(a[i]) + 1;
                    if (a[i] == 10) {
                        a[i] = 0;
                        b = i != 1;
                    } else
                        break;
                }
            }
            s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");
        }
        if (b)
            s = s.substr(1);
        return (pm + s).replace(/\.$/, "");
    }
    return this + "";
}
;

;(function($) {

    $.openReport = function(options) {
        if ($("#statusModal").size() > 0) {
            return;
        }
        options = options || {};
        var reportID = options["reportID"];
        if (!$.founded(reportID)) {
            throw new Error("reportID 不能为空 !");
        }
        delete options["reportID"];
        
        var requestMap = {};
        //查询正方报表格式
        $.post(_path+'/combbdy/combbdy_cxBbgsxx.html', {"gsdm":reportID}, function(responseModel){
			if(responseModel&&responseModel.zfgsdm){//调用正方报表
				var zfgsdm = responseModel.zfgsdm;	//正方格式代码
	        	var zfgscs = responseModel.zfgscs;	//正方格式参数
				if(zfgscs){//如果维护了格式参数,需求进行参数过滤
					var gscsArray = zfgscs.split(",");
					//报表系统只接收需要的参数，过滤掉非必要的参数
			        $.each(options || {}, function(key, val) {
			        	for(var i=0;i<gscsArray.length;i++){
			        		if(key==gscsArray[i]){
			        			//拼装查询参数：因为可能有中文，这里需要转码
			        			requestMap[key] = encodeURIComponent(val || "");
			        		}
			        	}
			        });
				}else{
					requestMap = options;
				}
				
				$.zfReport.preview({
					jrCode: zfgsdm,
					data: requestMap
				})
			}else{//调用帆软报表
		        //拼装查询参数：因为可能有中文，这里需要转码
		        $.each(options || {}, function(key, val) {
		            requestMap["mapRow.row." + key] = encodeURIComponent(val || "");
		        });
		        
				//构建form,报表预览
		        $.buildForm("reportViewForm", _path + "/report/report_cxFineReportViewIndex.html?reportID=" + reportID + "&_t" + new Date().getTime(), requestMap).submit();
			}
		},'json');
    }

    var titles = ["", "选择教材版本", "选择出版社", "选择教材类型", "选择教材印次", "选择教材基本信息", "选择供应商", "选择教材性质"];

    $.extend({

        /**进入公共选择页面*
		 * 参数说明：
		 * gridType:"1",  //列表类型：教材版本：1；出版社：2,；类型：3； 印次：4；基本信息：5；供应商：6 ，教材性质：7；
		 * options ： { 
		 * 
		 * 		"title":null,
		 *		"width":  800,
		 *		"height" : 500		
		 *		"cxlx":1,
		 * },
		 * callback:function(){} // 点击确定后的回调函数
		 */
        showJcDialog: function(gridType, options, callbackFunc) {
            //默认setting
            var defaultSettings = {
                "title": null,
                "width": 1280,
                "height": 500,
                "cxlx": 1,
                "gridType": gridType || "1"//列表类型：教材版本：1；出版社：2,；类型：3； 印次：4；基本信息：5；供应商：6；
            };

            callbackFunc = ($.defined(callbackFunc) && jQuery.isFunction(callbackFunc)) ? callbackFunc : $.noop;

            //扩展默认设置
            $.extend(defaultSettings, options || {});
            var title = options.title || (titles[Number(defaultSettings["gridType"])] || "");
            var paramMap = $.extend(true, {}, defaultSettings);

            $.dialog($.extend({}, defaultSettings, {
                "title": title,
                "href": _path + "/jcgl/common_cxCommonJcSelect.html",
                "data": paramMap,
                "modalName": "selectModal",
                "buttons": {
                    success: {
                        label: $.i18n.jwglxt["sure"],
                        className: "btn-primary",
                        callback: function() {
                            return callbackFunc.call(this);
                        }
                    },
                    cancel: {
                        label: $.i18n.jwglxt["cancel"],
                        className: "btn-default"
                    }
                }
            }));
        }
    });

    //序列化表单
    $.fn.serializeObject = function() {
        var obj = new Object();
        $.each(this.serializeArray(), function(index, param) {
            if (!(param.name in obj)) {
                obj[param.name] = param.value;
            }
        });
        return obj;
    }
    ;
}(jQuery));
