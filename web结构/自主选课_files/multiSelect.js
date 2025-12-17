jQuery(function($){
/*	$('.multi-control').click(function(){
		 $(this).children('.multi-ctn').toggle();
		 $(this).children('.multi-ctn').css('height','200px');
		 $(this).children('.multi-ctn').css('overflow','auto');
		 $('.modal-body').css('overflow-x','inherit');
	});

	$('.multi-ctn').hover(function(event){
		event.stopPropagation();
		var multi_control = $(this).closest(".multi-control");
		$(multi_control).find('.multi-ctn').show();
		$(multi_control).find('.show-panel').hide();
	},function(event){
		event.stopPropagation();
		var multi_control = $(this).closest(".multi-control");
		$(multi_control).find('.multi-ctn').hide();
		var selectedHtml = '';
		$(multi_control).find('.chosen-choices>li').each(function(index,item) {
			var _text = $.trim($(item).find('span').text());
			selectedHtml += '<span class="item">' + _text + '</span>';
		});
		$(multi_control).find('.show-panel').html(selectedHtml);
	});*/
    var ctbItems = '';
	function getctbTtem(){
		ctbItems = $('.multi-ctn .ctb-item')
	}
	getctbTtem();
	$.extend({
		getctbTtem:getctbTtem
	})
	//是否包含中文
	function containsChinese(str) {
	    var regex = /[\u4e00-\u9fff\u3400-\u4DBF]/; // 基本汉字和扩展A区汉字
	    return regex.test(str);
	}
	
	$(document).off('mouseenter','.multi-ctn').on('mouseenter','.multi-ctn', function(event){
		event.stopPropagation();
		var multi_control = $(this).closest(".multi-control");
		$(multi_control).find('.multi-ctn').show();
		$(multi_control).find('.show-panel').hide();
	}).off('mouseleave','.multi-ctn').on('mouseleave','.multi-ctn', function(event){
		event.stopPropagation();
		var multi_control = $(this).closest(".multi-control");
		$(multi_control).find('.multi-ctn').hide();
		var selectedHtml = '';
		$(multi_control).find('.chosen-choices>li').each(function(index,item) {
			var _text = $.trim($(item).find('span').text());
			selectedHtml += '<span class="item">' + _text + '</span>';
		});
		$(multi_control).find('.show-panel').html(selectedHtml);
	}).off('click','.multi-control').on('click','.multi-control', function(){
		 $(this).children('.multi-ctn').toggle();
		 $(this).children('.multi-ctn').css('height','200px');
		 $(this).children('.multi-ctn').css('overflow','auto');
		 $('.modal-body').css('overflow-x','inherit');
	}).off('click','.chosen-search').on('click','.chosen-search', function(event){
		event.stopPropagation();
	}).off('input','.chosen-search').on('input','.chosen-search', function(event){
		var multi_ctn = $(this).closest(".multi-ctn");
		var val = event.target.value;
		var pyVal = '';
		if(val && pinyinPro){
			pyVal = pinyinPro.pinyin(val, {
				pattern: 'first',
				toneType: 'none'
			}).replace(/\s+/g, '')
		}
		// if(val){
		// 	$(multi_ctn).find(".ctb-item").remove();
		// 	console.log(ctbItems,'ctbItems')
		// 	ctbItems.each(function(index,item){
		// 		if($(item).find('label').text().indexOf(val)>-1){
		// 			$(multi_ctn).append($(item));
		// 		}
		// 	})
		// }else{
		// 	$(multi_ctn).append(ctbItems);
		// }
		var li = $(multi_ctn).find(".ctb-item");

		li.each(function(index,item){
			if(val){
				var labelText =$(item).find('label').text();
				var labelPy = '';
				if(pinyinPro){
					labelPy = pinyinPro.pinyin(labelText, {
						pattern: 'first',
						toneType: 'none'
					}).replace(/\s+/g, '')
				}
				if(containsChinese(val)){ //是否包含中文
					if(labelText.indexOf(val)>-1){
						$(item).removeClass('hideBox')
					}else{
						$(item).addClass('hideBox')
					}
				}else{
					if(labelPy.includes(pyVal)){
						$(item).removeClass('hideBox')
					}else{
						$(item).addClass('hideBox')
					}
				}
			}else{
				$(item).removeClass('hideBox')
			}
		})

	}).off('mouseenter','.multi-control').on('mouseenter','.multi-control', function(){
		if($(this).find('.chosen-choices>li').size()>0){
			$(this).find('.show-panel').show();
		}
	}).off('mouseleave','.multi-control').on('mouseleave','.multi-control', function(){
		$(this).find('.show-panel').hide();
	}).off('click','.search-choice-close').on('click','.search-choice-close', function(event){
		event.stopPropagation();
		var $li = $(this).closest('li.search-choice');
		var xh = $($li).data("xh");
		var multi_control = $($li).closest(".multi-control");
		$(multi_control).find('.multi-ctn div').each(function(index,item){
			if($(item).data('xh') == xh ){
				$(item).find('input').attr('checked',false);
				var sfyx = $(item).find("input").val();
				var sfyx_arr = $.founded($(multi_control).find("input.multi-select-value").val())?$(multi_control).find("input.multi-select-value").val().split(","):[];
				for(var i=0; i<sfyx_arr.length; i++) {
					if(sfyx_arr[i] == sfyx) {
						sfyx_arr.splice(i, 1);
						break;
					}
				}
				$(multi_control).find("input.multi-select-value").val(sfyx_arr.toString()).trigger("change");
				return false;
			}
		});
		$($li).remove();
	}).off('change','.multi-control .multi-ctn input').on('change','.multi-control .multi-ctn input', function(event){
		event.stopPropagation();
		var xh = $(this).closest("div").data('xh');
		var sfyx = $(this).val();
		var ctn = $(this).siblings('label').text();
		var multi_control = $(this).closest(".multi-control");
		var multi_ctn = $(this).closest(".multi-ctn");
		var sfyx_arr = $.founded($(multi_control).find("input.multi-select-value").val())?$(multi_control).find("input.multi-select-value").val().split(","):[];
		// console.log($(this).is(':checked'),'====')

		var xhctnList = [];

		//反选去掉勾选
		$(multi_ctn).find('.ctn-invert input').removeAttr('checked');
		//全选去掉勾选
		$(multi_ctn).find('.ctn-all input').removeAttr('checked');
		//全不选去掉勾选
		$(multi_ctn).find('.ctn-out input').removeAttr('checked');


		if($(this).closest("div").hasClass('ctn-all') || $(this).closest("div").hasClass('ctn-invert') || $(this).closest("div").hasClass('ctn-out')){
			// var ctbItems = $(multi_ctn).find('.ctb-item');
			//隐藏的去掉选中
			var notShowBox = $(multi_ctn).find('.hideBox');
			notShowBox.each(function(index,item){
			  $(item).find('input').attr('checked',false)
			})
			//显示的项
			var ctbItems = $(multi_ctn).find('.ctb-item').not('.hideBox');
			sfyx_arr = [];
			xhctnList= [];

			$(this).attr('checked',true);

			if($(this).closest("div").hasClass('ctn-all')){
				//全选
				ctbItems.each(function(index,item){
					let obj = {}
					obj.xh = $(item).data('xh');
					obj.ctn = $(item).find('label').text();
					xhctnList.push(obj);
					$(item).find('input').attr('checked',true)
					sfyx_arr.push($(item).find('input').val());
				})
			}else if($(this).closest("div").hasClass('ctn-invert')){
				//反选
				ctbItems.each(function(index,item){
					let obj = {}
					if($(item).find('input').attr('checked')==undefined){
						obj.xh = $(item).data('xh');
						obj.ctn = $(item).find('label').text();
						xhctnList.push(obj);
						$(item).find('input').attr('checked',true)
						sfyx_arr.push($(item).find('input').val());
					}else{
						$(item).find('input').removeAttr('checked')
					}
				})
			}else{
				//全不选
				ctbItems.each(function(index,item){
					$(item).find('input').removeAttr('checked')
				})
			}
			$(multi_control).find('.chosen-choices').empty();
			let htmlStr = '';
			if(xhctnList && xhctnList.length){
				xhctnList.forEach(function(item,index){
					htmlStr+='<li class="search-choice" data-xh="'+item.xh+'"><span>'+item.ctn+'</span></li>'
				})
			}
			$(multi_control).find('.chosen-choices').append(htmlStr);

		}else{
			console.log('单个')
			if($(this).is(':checked')){
				$(this).attr('checked',true)
				sfyx_arr.push(sfyx);

				$(multi_control).find('.chosen-choices').append('<li class="search-choice" data-xh="'+xh+'"><span>'+ctn+'</span></li>');
			}else{
				$(this).removeAttr('checked')
				for(var i=0; i<sfyx_arr.length; i++) {
					if(sfyx_arr[i] == sfyx) {
						sfyx_arr.splice(i, 1);
						break;
					}
				}
				$(multi_control).find("li[data-xh='"+xh+"']").remove();
			}
		}
		$(multi_control).find("input.multi-select-value").val(sfyx_arr.toString()).trigger("change");


		// if($(this).is(':checked')){
		// 	sfyx_arr.push(sfyx);
		// 	$(multi_control).find("input.multi-select-value").val(sfyx_arr.toString()).trigger("change");
		// 	$(multi_control).find('.chosen-choices').append('<li class="search-choice" data-xh="'+xh+'"><span>'+ctn+'</span></li>');
		// }else{
		// 	for(var i=0; i<sfyx_arr.length; i++) {
		// 		if(sfyx_arr[i] == sfyx) {
		// 			sfyx_arr.splice(i, 1);
		// 			break;
		// 		}
		// 	}
		// 	$(multi_control).find("input.multi-select-value").val(sfyx_arr.toString()).trigger("change");
		// 	$(multi_control).find("li[data-xh='"+xh+"']").remove();
		// }

		//显示内容
		var chosenWidth  = parseInt($(multi_control).find('.chosen-choices').outerWidth());
		$(multi_control).find('.chosen-choices').attr('data-width', chosenWidth);

		if(chosenWidth > $(multi_control).outerWidth()-40 ) {
			$(multi_control).find('.chosen-choices').addClass('expand');
			var len = $(multi_control).find('.chosen-choices .search-choice').length;

			if(len){
				if($(multi_control).find('.ellipsis').size() == 0){
					$(multi_control).append('<span class="ellipsis">...</span>');
				}
			}else{
				$(multi_control).find('.ellipsis').remove();
			}
			$(multi_control).find('.ellipsis').show();
		}else{
			if($(multi_control).find('.ellipsis').size() > 0) {
				$(multi_control).find('.ellipsis').hide();
				$(multi_control).find('.chosen-choices').removeClass('expand');
			}
		}
	});
});