/*
 * @discretion	: 基于jquery.jqGrid组件的插件.
 * @author    	: wandalong
 * @email     	: hnxyhcwdl1003@163.com
 */
;(function ($) {

    $.loadColModel = function (options) {
        /*在这里远程加载相应角色的当前grid的列信息；进行组合合并*/
        if ($.founded(options.remoteURL)) {
            $.ajax({
                datatype: "json",
                type: "POST",
                url: options.remoteURL,
                data: options.remoteParams || {},
                async: false,
                timeout: 6E4,
                contentType: "application/x-www-form-urlencoded;charset=UTF-8",
                success: function (data) {
                    /* 判断相同index的进行合并  最后进行结果排序 */
                    if ($.founded(data.list)) {
						var colModels = [];
						//循环本地数据，将不需要隐藏的列添加到变量中，方便后面比较
						var localData = [];
						$.each(options.colModel, function (index, item) {
							if($.trim(item.index).length>0&&$.trim(item.name).length>0&&!item.hidden){
								var row = {
									"index":item.index,
									"name":item.name,
									"label":$("<div>"+(item.label||"")+"</div>").text(),
									"align":item.align||"center",
									"hidden":(item.hidden==true?true:false),
									"width":item.width||""
								};
								localData.push(row);
							}
						});
						/*对在排序列表中的列进行排序*/
						$.each(data.list, function (index, colRow) {
							$.each(options.colModel, function (index, colModel) {
								if (colRow.index == colModel.index) {
									colModels.push($.extend(true, {}, colModel, colRow));
									return false;
								}
							});
						});
						/*把不在排序列表中的列加到colModels中*/
						$.each(options.colModel, function (index, colModel) {
							var isSet = false;
							$.each(data.list, function (index, colRow) {
								if (colRow.index == colModel.index) {
									isSet = true;
									return false;
								}
							});
							if (isSet == false) {
								colModels.push(colModel);
							}
						});
						options.initialization = true;
						delete options.colModel;
						options.colModel = colModels;
						if(!$.founded(options.localData)){
							options.localData = localData;//记录本地显示列，只记录第一次的
						}
					} else {
                        options.initialization = false;
                    }
                    options.sfszdgr = data.sfszdgr||"0";
                    if($("#sessionUserKey").val()=="admin"||options.sfszdgr=="1"){
                    	//admin用户统一设置，或允许设置到个人
	                    options.sortableColumnsDone = function(){//拖动列显示顺序的响应事件
	                        setColumnsFun(options.selector.substring(1),options.remoteParams);
	                    };
	                    /*当列宽度改变之后触发此事件。newwidth：列改变后的宽度；index：当前列在colModel中的位置索引*/
	                    options.resizeStop = function(newwidth,index){
	                        setColumnsFun(options.selector.substring(1),options.remoteParams,newwidth,index);
	                    };
                    }
                }
            });
        }
    };

    //拖动列显示顺序和宽度
    function setColumnsFun(gridId,remoteParams,newwidth,currentIndex){
        var requestMap = $.extend(true, {}, remoteParams);
        var index_list = 0;
        $("#gbox_"+gridId).find("table.ui-jqgrid-htable").find("div.ui-jqgrid-sortable:visible").each(function(index,item){
/*          //每次都刷新所有，因为拖动某列时，坐标定位有问题
 			if($.founded(currentIndex)&&currentIndex!=index){
            	return true;
            }*/
        	var column_index = item.id.replace("jqgh_"+gridId+"_","");
            var width = (parseInt($(item).parent().width())+1)+"px";
            requestMap["list["+index_list+"].zd_index"] = column_index;
            requestMap["list["+index_list+"].zd_number"] = index;
            requestMap["list["+index_list+"].width"] = width;
            index_list++;
        });
        //刷新初始列值信息
        jQuery.post(_path +'/xtgl/zdpz_cxSetColumn.html',requestMap,function(data){
        	window.setFixedCol && window.setFixedCol() // 宽度变化后 重新计算一下浮动宽度
        });
    }

    $.bootui = $.bootui || {};
    $.bootui.widget = $.bootui.widget || {};

    /*====================== JQGridWrap CLASS DEFINITION ====================== */

    $.bootui.widget.JQGrid = function (element, options) {
        options.beforeRender.call(this, element);	//渲染前的函数回调
        try {
            var pageR = options.pager;//得到真正的pageId节点
            if (typeof options.pager === "string") {
                if (options.pager.substr(0, 1) !== "#") {
                    pageR = "#" + options.pager
                }
            } else {
                pageR = "#" + $(options.pager).attr("id")
            }
            options.pageR = pageR
            this.initialize.call(this, element, options);
            this.bindFun.call(this, element, options)
        } catch (e) {
            options.errorRender.call(this, e);
        }
        options.afterRender.call(this, element);	/*渲染后的函数回调*/
    };

    $.bootui.widget.JQGrid.prototype = {
        constructor: $.bootui.widget.JQGrid,
        /*初始化组件参数*/
        initialize: function (element, options) {
            console.log(options,'options=')

            //加载远程设置数据
            $.loadColModel(options);
            /*加载jqGrid*/
            //$(options.selector).loadJqGrid(options);
            options = jQuery(options.selector).getJqGridOptions(options, options.pager);
            jQuery(options.selector).jqGrid(options).navGrid(options.pager || "#no_pager", {
                edit: false,
                editicon: 'icon-pencil blue',
                add: false,
                addicon: 'icon-plus-sign purple',
                del: false,
                delicon: 'icon-trash red',
                search: false,
                searchicon: 'icon-search orange',
                refresh: false,
                refreshicon: 'icon-refresh green',
                view: false,
                viewicon: 'icon-zoom-in grey'
            }, {}, {}, {}, {
                multipleSearch: true
            });
            /*添加按钮*/
            if (options.customColumn) {
                var buttonOptions = {
                    pager: options.pager,
                    id: "colChoice",/*string类型，按钮id*/
                    caption: " ", /*按钮名称，可以为空，string类型 */
                    buttonicon: "glyphicon glyphicon-cog", /*按钮的图标，string类型，必须为UI theme图标 */
                    position: "first", /*first或者last，按钮位置 */
                    title: "设置显示列", /*string类型，按钮的提示信息*/
                    cursor: "pointer"/*string类型，光标类型，默认为pointer */
                };
                $.extend(buttonOptions, {
                    onClickButton: function () {
                        var paramMap = {
                            "initialization": options.initialization || false,
                            "colModel": options.colModel || [],
                            "localData": options.localData || [],
                            "params": options.remoteParams || {}
                        };
                        options.onSettingClick.call(element, paramMap, function () {
                            //加载远程设置数据
                            $.loadColModel(options);
                            $.extend(options, {
                                postData: $.isFunction(options.remoteMap) ? options.remoteMap.call(this) : {},
                                page: 1
                            })
                            $(options.selector).reloadJqGrid(options);
                            if($("#sessionUserKey").val()=="admin"||options.sfszdgr=="1"){
                            	//admin用户统一设置，或允许设置到个人
                            	$(options.selector).setButton(buttonOptions);
                            }
                        });
                    }
                });
                if($("#sessionUserKey").val()=="admin"||options.sfszdgr=="1"){
                	//admin用户统一设置，或允许设置到个人
                	$(options.selector).setButton(buttonOptions);
                }
            }
            if (!options.initialization && options.showTips) {
                var tipHtml = '<div class="alert alert-success alert-dismissible ui-jqgrid-tips" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                    '<strong>提示：</strong> 当前功能可自定义字段显示顺序等,参见列表左下角第一个按钮!' +
                    '</div>';

                $("#gbox_" + options.selector.substring(1)).before(tipHtml);
            }
            //添加已选中几条的提示
            if(options.multiselect && options.showChoose && !$(options.pageR).find('#selectedCount').length){
                var choseHtml = '<div style="display: inline-block;margin-right: 35px;"><span>已选中</span><span id="selectedCount" style="margin:0 10px;" class="red">0</span><span>条</span></div>'
                $(options.pageR).find(options.pageR+'_right .ui-paging-info').css({display: 'inline-block'}).before(choseHtml)
            }
        },
        bindFun: function(element, options){
             var id = jQuery(options.selector).attr('id');
             if(options.multiselect && options.showChoose){
                 //点框
                jQuery('#gview_'+ id).off('change').on('change','tr input[type="checkbox"]:first-of-type',function(){
                    if($(this).closest('.ui-jqgrid-hdiv').length>0){
                        // console.log('全选')
                    }
                    var allChecked = jQuery(options.selector+ ' tr input[type="checkbox"]:first-of-type:checked')
                    $(options.pageR).find('#selectedCount').text(allChecked.length)
                })
                //点数据
                jQuery('#gview_'+ id).off('click').on('click','tr',function(){
                    setTimeout(function(){//带上 如果点击td里的内容
                         var allChecked = jQuery(options.selector+ ' tr input[type="checkbox"]:first-of-type:checked')
                         $(options.pageR).find('#selectedCount').text(allChecked.length)
                    },500)
                })
                //数据变化时 不能置为0 可能是标题拖动
                if ($('#gview_'+id).length > 0) {
                    var targetNode = document.getElementById('gview_'+id);
                    var config = { childList: true, subtree: true };
                    var callback = function (mutationsList) {
                        //  console.log('监听')
                        var allChecked = jQuery(options.selector+ ' tr input[type="checkbox"]:first-of-type:checked')
                        $(options.pageR).find('#selectedCount').text(allChecked.length)

                    };
                    var observer = new MutationObserver(callback);
                    observer.observe(targetNode, config);
                    // observer.disconnect();
                }
             }

        },
        setDefaults: function (settings) {
            $.extend($.fn.JQGrid.defaults, settings);
        }
    }

    /* JQGrid PLUGIN DEFINITION  */

    $.fn.jqGridWrap = function (option) {
        var selector = $(this).selector;
        //处理后的参数
        var args = $.grep(arguments || [], function (n, i) {
            return i >= 1;
        });
        return this.each(function () {
            var $this = $(this), data = $this.data('bootui.jqgrid');
            var options = $.extend({}, $.fn.jqGridWrap.defaults, $this.data(), ((typeof option == 'object' && option) ? option : {}), {"selector": selector});
            if (!data) {
                $this.data('bootui.jqgrid', (data = new $.bootui.widget.JQGrid(this, options)));
            }
            if (typeof option == 'string') {
                //调用函数
                data[option].apply(data, [].concat(args || []));
            }
        });
    };

    $.fn.jqGridWrap.defaults = $.extend({}, BaseJqGrid || {}, {
        /*版本号*/
        /*组件进行渲染前的回调函数：如重新加载远程数据并合并到本地数据*/
        beforeRender: $.noop,
        /*组件渲染出错后的回调函数*/
        errorRender: $.noop,
        /*组件渲染完成后的回调函数*/
        afterRender: $.noop,
        /*字段配置信息请求参数*/
        remoteURL: _path + "/xtgl/zdpz_cxZdpzList.html",	/*服务端数据请求地址*/
        remoteParams: {},	/*服务端数据请求参数*/
        remoteMap: $.noop,/*回调函数重新查询grid时候的数据*/
        /*是否启用自定义列*/
        customColumn: true,
        showTips: false,
        tips: "当前功能可自定义字段显示顺序等,参见列表左下角第一个按钮!",
        /*===================设置按钮被点击时的回调函数================*/
        onSettingClick: function (paramMap, callbackFunc) {
            $.showDialog(_path + "/xtgl/zdpz_cxZdpz.html", "设置列信息(在列表上拖拽进行排序和宽度设置)", {
                "width": "960px",
                "data": paramMap,
                "modalName": "zdpzModal",
                "buttons": {
                    success: {
                        label: "确  定",
                        className: "btn-primary",
                        callback: function () {
                            var $this = this;
                            /*获得选择数据*/
                            var result = $this.content.saveZdpz(function () {
                                callbackFunc.call($this);
                                $this.close();
                            });
                            return false;
                        }
                    },
                  /*  submit: {
    					label : "一键调整列宽",
    					//className : "btn-primary",
    					callback : function() {debugger;
    						var $this = this;
                            获得选择数据
                            var result = $this.content.tzZdpz(function () {
                                callbackFunc.call($this);
                                $this.close();
                            });
                            return false;
    					}
    				},*/
                    cancel: {
                        label: "关 闭",
                        className: "btn-default"
                    }
                }
            });
        }
    });

    $.fn.jqGridWrap.Constructor = $.bootui.widget.JQGrid;


}(jQuery));