/*
 * 参考之前的业务框架级联组件：详情参见：jquery.zftal.concatenation-1.0.0.js
 */
;(function(e) {
    function clearStyle(element){
		if($.fn.simpleValidate){
			$(element).getRealElement().successClass();
		}
	}
	function clearNull(map,mapper,id){
		if($.founded(id) && $(id).defined()){
			map[getKey(id,mapper)] = $(id).val();
		}else{
			map[getKey(id,mapper)] = null;
		}
	};
	//根据id找到对应的name
	function getKey(element,mapper){
		var name = $(element).attr("name");
		return $.founded(mapper[name])?mapper[name]:name;
	}
	
	function funcFilter(mapObj,mapper){
		var newMap = {};
		$.each(mapObj||{}, function(key, val){
			if($.founded(key)&&$.founded(val)&&(!$.isNumeric(key))){
				newMap[key] = val;
			}
		});
		/*delete not need params*/
		$.each(["mapper","selectAttr","height","title","width"], function(i, key){
			delete newMap[key];
		});
		return newMap;
	};
	
	function initDefaultMap(map,params,list){
		var newMap = {};
        console.log(params,'initDefaultMap')
		if($.founded(params)){
			var mapper = params.mapper||{};
            if(list && list.length){
                list.forEach(function(id,index){
                    if($.founded(id)&&$(id).defined()){
                        //取得此ID名称对应的属性值
                        var name = getKey(id,mapper);
                        var val = params[name];
                        //判断值存在
                        if($.defined(val)){
                            delete params[name];
                            params[name] = val;
                        }
                    }
                })
            }
			$.each(params,function(key,val){
				map[key] = val;
				newMap[key] = val;
			});
		}
		return newMap;
	};
    e.extend({
        //适用于 a_id改变时引起b_id的改变
        //a_id        必填      学部的id  注意这里是对应的id
        //b_id        必填      学院的id
        //params      必填      {name:val}
        //b_pzObj     非必填    如果下拉需要改变接口需传
        //c_pzObj     非必填    同b_pzObj
        //func        非必填    当外部需要当前 有change时间的节点值时传
        // headerValue非必填    value为空时name要展示的文字 默认是全部
        // dom        非必填	domain = {showSearch:true, ctnAll:true, ctnInvert:true,ctnOut:true} //搜索框 全选 反选 全不选
        //extraP      非必填    需要传给接口额外的参数 
        //mapper      非必填    如果id的元素绑定的name需要重写 写这里  比如：id是sy_id_cx,默认name是sy_id,但需要sy_id_new{sy_id：'sy_id_new'}

        //适用于 a_id改变时引起b_id的请求
        bindXb:function({a_id,b_id,b_pzObj,params,func,headerValue,dom,extraP}){
			var $this = this;
			var dataMap = {}; //{name: val}
            var B_pzObj = b_pzObj?b_pzObj:{
                url: _path + "/xtgl/list_cxDataList.html",
                value: 'value',
                name: 'name'
            }
			params 		= $.defined(params)?params:{};//{name:val}
			func 		= ($.defined(func)&& $.isFunction(func)) ?func:$.noop; 
			headerValue = $.defined(headerValue)?headerValue:"全部";
            var domain = dom?dom:false;
            var extraParam = extraP?extraP:{}
			var mapper = params.mapper||{};
			//初始化默认参数
			var defaultMap = initDefaultMap(dataMap,params,[a_id,b_id]);//{name: val}
            
           
            function getXyList() {
                if (e.founded(b_id) && e(b_id).defined()) {
                    clearNull(dataMap,mapper,b_id);
                    // console.log(dataMap,'====')
                    var par = funcFilter.call(this,dataMap,mapper);
                    var newPar = Object.assign({},extraParam,par)
                    if (e(b_id).is("select")) {
                        var html = [];
                        html.push('<option value="">' + headerValue + "</option>");
                        jQuery.ajaxSetup({
                            async: false
                        });
                        e.getJSON(B_pzObj.url, newPar, function(data) {
                            if (e.founded(data)) {
                                e.each(data, function(F, E) {
                                    var selectedStr = "", name = getKey(b_id, mapper);
                                    // E.xy_id是接口里返回的value值
                                    if (e.founded(defaultMap[name]) && defaultMap[name] == E[B_pzObj.value]) {
                                        selectedStr = ' selected="selected" ';
                                    }
                                    html.push('<option value="' + E[B_pzObj.value] + '" ' + selectedStr + ">" + E[B_pzObj.name] + "</option>")
                                })
                            }
                        });
                        e(b_id).empty().append(html.join("")).trigger("chosen:updated");
                        jQuery.ajaxSetup({
                            async: true
                        })
                    } else {
                        if (e(b_id).is(".multi-select-value")) {
                            var multiControl = e(b_id).closest(".multi-control");
                            e(b_id).val("");
                            e(multiControl).find(".show-panel").empty();
                            e(multiControl).find(".chosen-choices").empty();
                            e(multiControl).find(".multi-ctn").empty();
                            e(multiControl).find(".ellipsis").hide();
                            var res;
                            jQuery.ajaxSetup({
                                async: false
                            });
                            e.getJSON(B_pzObj.url, newPar, function(data) {
                                if (e.founded(data)) {
                                    res = data
                                }
                            });
                            jQuery.ajaxSetup({
                                async: true
                            });
                            var html = "";
                            var newId = e(b_id).attr("id") + "_";
							//搜索框
							if(domain && domain.showSearch){
								html+='<div class="chosen-search"><input type="text" autocomplete="off" name="autocomplete" autofocus></div>'
							}
							//全选
							if(domain && domain.ctnAll){
								html+='<div data-xh="-1" class="ctn-all">'+
								'<input class="default-checkbox primary-checkbox" value="-1" type="checkbox" name="multi-item"  id="'+ newId +'-1">'+
								'<label for="' + newId + '-1"><i class="glyphicon glyphicon-ok multi-ok"></i>全选</label>'+
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
                            e.each(res || [], function(index, ite) {
                                html += '<div data-xh="' + index + '" class="ctb-item">';
                                html += '<input class="default-checkbox primary-checkbox" value="' + ite[B_pzObj.value] + '" type="checkbox" name="multi-item" id="' + newId + index + '">';
                                html += '<label for="' + newId + index + '"><i class="glyphicon glyphicon-ok multi-ok"></i>' + ite[B_pzObj.name] + "</label>";
                                html += "</div>"
                            });
                            e(multiControl).find(".multi-ctn").html(html)

							if(domain && domain.showSearch && e.getctbTtem){
								//每次重新赋值后需要保存当前所有的下拉值 
								// e.getctbTtem()
							}
                        }
                    }
                    e(b_id).trigger('change')
                }
            }

            if (e.founded(a_id) && e(a_id).defined()) {
                var name = getKey(a_id, mapper);
                if (e.founded(e(a_id).val())) {
                    dataMap[name] = e(a_id).val()
                }
                e(document).off('change',a_id).on('change',a_id,function() {
                    //学部改变
                    if (e.founded(e(this).val())) {
                        dataMap[name] = e(this).val();
                        clearStyle(this)
                    } else {
                        dataMap[name] = null
                    }
                    // dataMap[]
                    getXyList();
                    //
                    func.call($this,funcFilter.call(this,dataMap));
                })
            }
        },
        //适用于 a_id改变时引起b_id,c_id的请求，b_id改变时引起c_id的请求
        bindSy:function({a_id,b_id,c_id,b_pzObj,c_pzObj,params,func,headerValue,dom,extraP}){
            console.log("test");
			var $this = this;
			var dataMap = {}; //{name: val}用于保存接口参数
			params 		= $.defined(params)?params:{};
			func 		= ($.defined(func)&& $.isFunction(func)) ?func:$.noop;
			headerValue = $.defined(headerValue)?headerValue:"全部";
            var domain = dom?dom:false;
            var extraParam = extraP?extraP:{}
			var mapper = params.mapper||{};
			//初始化默认参数 用于如果符合默认值给选中状态
			var defaultMap = initDefaultMap(dataMap,params,[a_id,b_id,c_id]); //{name: val}
            var B_pzObj = b_pzObj?b_pzObj:{
                url: _path + "/query/query_cxSqxxList.html",value:'sq_id',name: 'sqmcxx'
            }
            var C_pzObj = c_pzObj?c_pzObj: {
                url: _path + "/query/query_cxSybxxList.html",
                value:'syb_id',name: 'sybmc'
            }
            //社区
            function getSqList() {
                if (e.founded(b_id) && e(b_id).defined()) {
                    clearNull(dataMap,mapper,b_id);
                    console.log(dataMap,'====')
                    if (e(b_id).is("select")) {
                        var html = [];
                        html.push('<option value="">' + headerValue + "</option>");
                        jQuery.ajaxSetup({
                            async: false
                        });
                        var par = funcFilter.call(this, dataMap,mapper);
                        var newPar = Object.assign({},extraParam,par)
                        // console.log(newPar,'newPar=')
                        e.getJSON(B_pzObj.url, newPar, function(data) {
                            if (e.founded(data)) {
                                e.each(data, function(F, E) {
                                    var selectedStr = "", name = getKey(b_id, mapper);
                                    // E.xy_id是接口里返回的value值
                                    if (e.founded(defaultMap[name]) && defaultMap[name] == E[B_pzObj.value]) {  //此sq_id是接口返回
                                        selectedStr = ' selected="selected" ';
                                    }
                                    html.push('<option value="' + E[B_pzObj.value] + '" ' + selectedStr + ">" + E[B_pzObj.name] + "</option>")
                                })
                            }
                        });
                        e(b_id).empty().append(html.join("")).trigger("chosen:updated");
                        jQuery.ajaxSetup({
                            async: true
                        })
                    } else {
                        if (e(b_id).is(".multi-select-value")) {
                            var multiControl = e(b_id).closest(".multi-control");
                            e(b_id).val("");
                            e(multiControl).find(".show-panel").empty();
                            e(multiControl).find(".chosen-choices").empty();
                            e(multiControl).find(".multi-ctn").empty();
                            e(multiControl).find(".ellipsis").hide();
                            var res;
                            jQuery.ajaxSetup({
                                async: false
                            });
                            e.getJSON(B_pzObj.url, funcFilter.call(this,dataMap,mapper), function(data) {
                                if (e.founded(data)) {
                                    res = data
                                }
                            });
                            jQuery.ajaxSetup({
                                async: true
                            });
                            var html = "";
                            var newId = e(b_id).attr("id") + "_";
							//搜索框
							if(domain && domain.showSearch){
								html+='<div class="chosen-search"><input type="text" autocomplete="off" name="autocomplete" autofocus></div>'
							}
							//全选
							if(domain && domain.ctnAll){
								html+='<div data-xh="-1" class="ctn-all">'+
								'<input class="default-checkbox primary-checkbox" value="-1" type="checkbox" name="multi-item"  id="'+ newId +'-1">'+
								'<label for="' + newId + '-1"><i class="glyphicon glyphicon-ok multi-ok"></i>全选</label>'+
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
                            e.each(res || [], function(index, ite) {
                                html += '<div data-xh="' + index + '" class="ctb-item">';
                                html += '<input class="default-checkbox primary-checkbox" value="' + ite[B_pzObj.value] + '" type="checkbox" name="multi-item" id="' + newId + index + '">';
                                html += '<label for="' + newId + index + '"><i class="glyphicon glyphicon-ok multi-ok"></i>' + ite[B_pzObj.name] + "</label>";
                                html += "</div>"
                            });
                            e(multiControl).find(".multi-ctn").html(html)

							if(domain && domain.showSearch && e.getctbTtem){
								//每次重新赋值后需要保存当前所有的下拉值 
								// e.getctbTtem()
							}
                        }
                    }
                }
            }

            //书院班
            function getSybList() {
                if (e.founded(c_id) && e(c_id).defined()) {
                    clearNull(dataMap,mapper,c_id);
                    if (e(c_id).is("select")) {
                        var html = [];
                        html.push('<option value="">' + headerValue + "</option>");
                        jQuery.ajaxSetup({
                            async: false
                        });
                        var par = funcFilter.call(this, dataMap,mapper);
                        var newPar = Object.assign({},extraParam,par)
                        e.getJSON(C_pzObj.url, newPar, function(data) {
                            if (e.founded(data)) {
                                e.each(data, function(F, E) {
                                    var selectedStr = "", name = getKey(c_id, mapper);
                                    if (e.founded(defaultMap[name]) && defaultMap[name] == E[C_pzObj.value]) {
                                        selectedStr = ' selected="selected" ';
                                    }
                                    html.push('<option value="' + E[C_pzObj.value] + '" ' + selectedStr + ">" + E[C_pzObj.name] + "</option>")
                                })
                            }
                        });
                        e(c_id).empty().append(html.join("")).trigger("chosen:updated");
                        jQuery.ajaxSetup({
                            async: true
                        })
                    } else {
                        if (e(c_id).is(".multi-select-value")) {
                            var multiControl = e(c_id).closest(".multi-control");
                            e(c_id).val("");
                            e(multiControl).find(".show-panel").empty();
                            e(multiControl).find(".chosen-choices").empty();
                            e(multiControl).find(".multi-ctn").empty();
                            e(multiControl).find(".ellipsis").hide();
                            var res;
                            jQuery.ajaxSetup({
                                async: false
                            });
                            e.getJSON(C_pzObj.url, funcFilter.call(this,dataMap,mapper), function(data) {
                                if (e.founded(data)) {
                                    res = data
                                }
                            });
                            jQuery.ajaxSetup({
                                async: true
                            });
                            var html = "";
                            var newId = e(c_id).attr("id") + "_";
							//搜索框
							if(domain && domain.showSearch){
								html+='<div class="chosen-search"><input type="text" autocomplete="off" name="autocomplete" autofocus></div>'
							}
							//全选
							if(domain && domain.ctnAll){
								html+='<div data-xh="-1" class="ctn-all">'+
								'<input class="default-checkbox primary-checkbox" value="-1" type="checkbox" name="multi-item"  id="'+ newId +'-1">'+
								'<label for="' + newId + '-1"><i class="glyphicon glyphicon-ok multi-ok"></i>全选</label>'+
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
                            e.each(res || [], function(index, ite) {
                                html += '<div data-xh="' + index + '" class="ctb-item">';
                                html += '<input class="default-checkbox primary-checkbox" value="' + ite[C_pzObj.value] + '" type="checkbox" name="multi-item" id="' + newId + index + '">';
                                html += '<label for="' + newId + index + '"><i class="glyphicon glyphicon-ok multi-ok"></i>' + ite[C_pzObj.name] + "</label>";
                                html += "</div>"
                            });
                            e(multiControl).find(".multi-ctn").html(html)

							if(domain && domain.showSearch && e.getctbTtem){
								//每次重新赋值后需要保存当前所有的下拉值 
								// e.getctbTtem()
							}
                        }
                    }
                }
            }
            if (e.founded(a_id) && e(a_id).defined()) {
                var nameA = getKey(a_id, mapper);
                var nameB = getKey(b_id, mapper);
                var nameC = getKey(c_id, mapper);
                if (e.founded(e(a_id).val())) {
                    dataMap[nameA] = e(a_id).val()
                }
                e(document).off('change',a_id).on('change',a_id,function() {
                    //a_id改变
                    if (e.founded(e(this).val())) {
                        dataMap[nameA] = e(this).val();
                        clearStyle(this)
                    } else {
                        dataMap[nameA] = null
                    }
                    dataMap[nameB] = '';
                    dataMap[nameC] = '';
                    getSqList();
                    getSybList()
                    func.call($this,funcFilter.call(this,dataMap));
                })
            }

            if (e.founded(b_id) && e(b_id).defined()) {
                var name_B = getKey(b_id, mapper);
                var name_C = getKey(c_id, mapper);
                if (e.founded(e(b_id).val())) {
                    dataMap[name_B] = e(b_id).val()
                }
                e(document).off('change',b_id).on('change',b_id,function() {
                    //b_id改变
                    if (e.founded(e(this).val())) {
                        dataMap[name_B] = e(this).val();
                        clearStyle(this)
                    } else {
                        dataMap[name_B] = null
                    }
                    dataMap[name_C] = '';
                    getSybList();
                    func.call($this,funcFilter.call(this,dataMap));
                })
            }

        },
       
    })
}(jQuery));


