;(function($){
	var qb = "全部";/*$.i18n.jwglxt["qb"];*/
	$.bootui = $.bootui || {};
	$.bootui.widget = $.bootui.widget || {};

	$.bootui.widget.tagTree = function(element, options){
		options.beforeRender.call(this,element);	//渲染前的函数回调
		this.initialize.call(this, element, options);
		options.afterRender.call(this,element);	/*渲染后的函数回调*/
	};

	$.bootui.widget.tagTree.prototype = {
		constructor: $.bootui.widget.tagTree,
		/*初始化组件参数*/
		initialize: function(element, options) {
            var self = this;
            this.$element  = $(element);
            this.$element.hide();
            var opts = options;
            var ctn = $('<div class="tagtree"></div>');
            var sng = $('<a class="tagtree-single" tabindex="-1"><span>'+qb+'</span><div class="clear-icon"><b></b></div><div class="down-icon"><b></b></div></a>');
            ctn.append(sng);
            var drop = $('<div class="tagtree-drop"></div>').hide();
            // 搜索框
            var searchhtml = $('<div class="tagtree-search"></div>');
            searchhtml.append($('<input type="text" class="tagtree-sipt" name="tagtree-sipt" placeholder="查询节点">'));
            searchhtml.append($('<div class="tagtree-sbtn"><span class="glyphicon glyphicon-search"></span></div>'));
            drop.append(searchhtml);
            drop.append($('<div class="tagtree-sec"></div>'));
            // 确定取消按钮
            drop.append($('<div class="tagtree-btn"><button type="button" class="cancel">取消</button><button type="button" class="confirm">确定</button></div></div>'));
            if(opts.hidebtn == true) {
            	drop.find('.tagtree-btn').hide();
            } else {

            }
            setTree(opts.data, drop.find('.tagtree-sec'));
            setOpt(opts.data);
            ctn.append(drop);
            drop.find('li:has(ul)').addClass('li-top');
            this.$element.after(ctn);
            if(opts.fold){
                ctn.find(".li-top li").hide();
            }
            // 切换展开收起
            ctn.on('click', '.tagtree-single', function(){
                ctn.toggleClass('open');
                ctn.find('.tagtree-drop').toggle();
                ctn.find('.tagtree-sipt').val('');
                ctn.find('.tagtree-sec li .ssitem').removeClass('ssitem');
                ctn.find('.tagtree-sec>ul>li').show();
            });
            ctn.on('click', '.clear-icon', function(e){
                e.stopPropagation();
                $(element).val('');
                ctn.find('.tagtree-single span').html(qb);
                ctn.find('.tagtree-sipt').val('');
                ctn.find('.tagtree-sec .i-check').removeClass('i-check');
                ctn.find('.tagtree-sec .ssitem').removeClass('ssitem');
                ctn.find('.tagtree-sec li').show();
                ctn.find(".li-top li").hide();
                ctn.find('.tagtree-sec>ul>li').show();
                ctn.find('.tagtree-sec li.li-top > .tgname .left').removeClass('glyphicon-minus-sign');
                ctn.find('.tagtree-sec li.li-top > .tgname .left').addClass('glyphicon-plus-sign');
                ctn.find('.tagtree-sec li > .tgname .right').removeClass('glyphicon-ok');
                $(element).trigger('change');
            });
            // 点击选择
            ctn.on('click','.tagtree-sec .tgname',function (e) {
                if(!opts.multiple) {
                    $(this).parent('li').siblings('li').find('li').hide();
                    ctn.find('.tagtree-sec li.li-top > .tgname .left').removeClass('glyphicon-minus-sign')
                    ctn.find('.tagtree-sec li.li-top > .tgname .left').addClass('glyphicon-plus-sign')
                    $(this).parents('li.li-top').find(' > .tgname .left').removeClass('glyphicon-plus-sign')
                    $(this).parents('li.li-top').find(' > .tgname .left').addClass('glyphicon-minus-sign')
                }
                var children = $(this).parent('li.li-top').find(' > ul > li');
                if (children.is(":visible")) {
                    children.hide();
                    $(this).parent('li.li-top').find(' > .tgname .left').removeClass('glyphicon-minus-sign');
                    $(this).parent('li.li-top').find(' > .tgname .left').addClass('glyphicon-plus-sign');
                } else {
                    children.show();
                    $(this).parent('li.li-top').find(' > .tgname .left').removeClass('glyphicon-plus-sign');
                    $(this).parent('li.li-top').find(' > .tgname .left').addClass('glyphicon-minus-sign');
                }
                if(!opts.multiple) {
                    ctn.find('.tagtree-sec').find('.i-check').removeClass('i-check');
                    ctn.find('.tagtree-sec').find('.right').removeClass('glyphicon-ok');
                }
                if(opts.onlyroot || $(element).attr('data-onlyroot') == 'true'){
                    if(!$(this).parent().hasClass('li-top')){
                        if($(this).hasClass('i-check')){
                            $(this).removeClass('i-check');
                            $(this).find('.right').removeClass('glyphicon-ok');
                        } else {
                            $(this).addClass('i-check');
                            $(this).find('.right').addClass('glyphicon-ok');
                        }
                        opts.check($(this).attr("data-val"));
                        ctn.find('.tagtree-btn .confirm').trigger('click');
                    }
                } else {
                    if($(this).hasClass('i-check')){
                        $(this).removeClass('i-check');
                        $(this).find('.right').removeClass('glyphicon-ok');
                    } else {
                        $(this).addClass('i-check');
                        $(this).find('.right').addClass('glyphicon-ok');
                    }
                    opts.check($(this).attr("data-val"));
                    ctn.find('.tagtree-btn .confirm').trigger('click');
                }
                return false;
            });
            // 查询
            ctn.find('.tagtree-search').on('input', '.tagtree-sipt', function(event) {
                var schcon = $(this).val();
                resetSearch(opts.data);
                ctn.addClass('onsearch');
                search(schcon, opts.data);
                ctn.find('.tagtree-sec').empty();
                setTree(opts.data, ctn.find('.tagtree-sec'));
                ctn.find('li:has(ul)').addClass('li-top');

                ctn.find('.tagtree-sec li.li-top').each(function(i,e){
                    var children = $(e).find(' > ul > li');
                    if(children.find('.ssitem').length > 0){
                        children.show();
                        $(e).find(' > .tgname .left').removeClass('glyphicon-plus-sign');
                        $(e).find(' > .tgname .left').addClass('glyphicon-minus-sign');
                    } else{
                        children.hide();
                        $(e).find(' > .tgname .left').removeClass('glyphicon-minus-sign');
                        $(e).find(' > .tgname .left').addClass('glyphicon-plus-sign');
                    }
                })
                $('.ssitem').each(function(i, e){
                	var hz = $(e).parent().find('.ssitem');
                	if(hz.length == 0) {
                		hz.hide();
                	}
                	$(e).parent().siblings('li').each(function(li, le){
                		if($(le).find('.ssitem').length == 0){
                			$(le).hide();
                		}
                    })
                    if($(e).parents('.li-top').length > 0){
                        $(e).parents('.li-top').siblings('li').each(function(li, le){
                            if($(le).find('.ssitem').length == 0){
                                $(le).hide();
                            }
                        })
                    }
                })
            })
            // 取消确定点击
            ctn.find('.tagtree-btn').on('click', '.cancel', function(event) {
                resetSearch(opts.data);
                ctn.find('.tagtree-sec').empty();
                setTree(opts.data, ctn.find('.tagtree-sec'));
                ctn.find('li:has(ul)').addClass('li-top');
                ctn.find('.tagtree-sec > ul > li li').hide();
                ctn.find('.tagtree-drop').toggle();
                ctn.toggleClass('open');
                opts.cancel();
            }).on('click', '.confirm', function(event) {
                var arr = $(element).tagTreeValues($(element));
                if(arr.length == 0) {
                    // alert('请选择！');
                } else {
                    arr.forEach(function(e, i){
                        $(element).val(e.value);
                        ctn.find('.tagtree-single span:eq(0)').html(e.name);
                        // ctn.find('.tagtree-drop').toggle();
                        // ctn.toggleClass('open');
                        $(element).trigger('change');
                        opts.confirm(e);
                    })
                }

            });
            // ctn.on('mouseleave', function(e){
            // 	ctn.find('.tagtree-drop').toggle();
            //     ctn.removeClass('open');
            // })
            $(document).on('click', function(e){
                var target = e.target || e.srcElement;
                if(!$(target).is('.tagtree, .tagtree *')){
                    ctn.find('.tagtree-drop').hide();
                    ctn.removeClass('open');
                }
            })

            // 完成回调
            opts.done();
            $.fn.tagTreeValues = function(elm){
                var vals = [];
                $(elm).next('.tagtree').find(".i-check").each(function(index, el) {
                    var backval = {
                        name: '',
                        value: ''
                    }
                    backval.name = $(el).find('.name').html();
                    backval.value = $(el).attr('data-val');
                    vals.push(backval);
                });
                return vals;
            }
            //递归生成树
            function setTree(data, that){
                var ul = $('<ul></ul>');
                that.append(ul);
                $.each(data,function(index,value){
                    var li;
                    if(yzlxcd(value)){
                        li = $('<li><div class="tgname" data-val="'+ value.value +'"><span class="left glyphicon glyphicon-plus-sign"></span><span class="name">'+ value.name +'</span><span class="right glyphicon"></span></div></li>');
                    } else {
                        li = $('<li><div class="tgname" data-val="'+ value.value +'"><span class="left glyphicon glyphicon-minus-sign"></span><span class="name">'+ value.name +'</span><span class="right glyphicon"></span></div></li>');
                    }
                    if(value.value == $(element).attr('data-val')) {
                        li.find('.tgname').addClass('i-check');
                        li.find('.right').addClass('glyphicon-ok');
                        sng.find('span').html(value.name);
                    }
                    if(value.ssitem){
                        li.find('.tgname').addClass('ssitem');
                    }
                    ul.append(li);
                    if(yzlxcd(value)){
                        setTree(value.child, li);
                    }
                });
            }
            // 验证数据
            function yzlxcd(data){
                if(data.hasOwnProperty('child') && Object.prototype.toString.call(data.child) === '[object Array]' && data.child.length > 0){
                    return true;
                } else {
                    return false;
                }
            }
            // 添加下拉项
            function setOpt(data){
            	var defoption = $('<option value="">'+qb+'</option>');
            	$(element).append(defoption);
                $.each(data,function(index, value){
                    var option = $('<option value="' + value.value + '">' + value.name + '</option>');
                    if(opts.onlyroot){
                        if(yzlxcd(value)){
                            setOpt(value.child);
                        } else {
                            if(value.value == $(element).attr('data-val')) {
                                option.prop('selected');
                                $(element).val(value.value);
                            }
                            $(element).append(option);
                        }
                    } else {
                        if(value.value == $(element).attr('data-val')) {
                            option.prop('selected');
                            $(element).val(value.value);
                        }
                        $(element).append(option);
                        if(yzlxcd(value)){
                            setOpt(value.child);
                        }
                    }
                });
            }
            // 搜索查询
            function search(searchcon, data){
            	if(searchcon !== ''){
            		for(var i=0; i<data.length; i++){
                        if(data[i].name.indexOf(searchcon) !== -1){
                            data[i].ssitem = true;
                        }
                        if(yzlxcd(data[i])){
                            search(searchcon, data[i].child)
                        }
                    }
            	}
            }
            // 搜索重置
            function resetSearch(data){
                ctn.removeClass('onsearch');
                for(var i=0; i<data.length; i++){
                    if(data[i].ssitem == true){
                        data[i].ssitem = false;
                    }
                    if(yzlxcd(data[i])){
                        resetSearch(data[i].child)
                    }
                }
            }
		},
		destroy : function () {
            $(this.$element).unbind().removeData('widget.tagTree');
            $(this.$element).empty();
            $(this.$element).show();
            $(this.$element).next().remove();
		},
		setDefaults	: function(settings){
			$.extend($.fn.scrolltoTop.defaults, settings );
		},
		getDefaults	: function(settings){
			return $.fn.scrolltoTop.defaults;
		}
	};

	/*
	 * jQuery原型上自定义的方法
	 */
	$.fn.tagTree = function(option){
		//处理后的参数
		var args = $.grep( arguments || [], function(n,i){
			return i >= 1;
		});
		return this.each(function () {
			var $this = $(this), data = $this.data('widget.tagTree');
			if (!data && option == 'destroy') {return;}
            var options = $.extend( true ,{}, $.fn.tagTree.defaults, $this.data(),((typeof option == 'object' && option) ? option : {}));
			if (!data){
				$this.data('widget.tagTree', (data = new $.bootui.widget.tagTree(this, options)));
			}
			if (typeof option == 'string'){
				//调用函数
				data[option].apply(data, [].concat(args || []) );
			}
		});
	};

	$.fn.tagTree.defaults = {
		/*版本号*/
		version:'1.0.0',
		data: [],
		fold: false,
        multiple: false,
        onlyroot: false,
		hidebtn: true,
		check: $.noop,
		done: $.noop,
		confirm: $.noop,
		cancel: $.noop,
        /*组件进行渲染前的回调函数：如重新加载远程数据并合并到本地数据*/
		beforeRender: $.noop,
		/*组件渲染出错后的回调函数*/
		errorRender: $.noop,
		/*组件渲染完成后的回调函数*/
		afterRender: $.noop,
	};

	$.fn.tagTree.Constructor = $.bootui.widget.tagTree;
}(jQuery));
