var JQGridBaseEvents = {
	/* 当插入每行时触发。rowid插入当前行的id；rowdata插入行的数据，格式为name: value，name为colModel中的名字*/
	afterInsertRow	: function(rowid,rowdata,row,elem){},
	/* 向服务器端发起请求之前触发此事件但如果datatype是一个function时例外*/
	beforeRequest 	: function(){},
	/*当用户点击当前行在未选择此行时触发。rowid：此行id；e：事件对象。返回值为ture或者false。如果返回true则选择完成，如果返回false则不会选择此行也不会触发其他事件*/
	beforeSelectRow	: function(rowid, e){return true;},
	/* 当表格所有数据都加载完成而且其他的处理也都完成时触发此事件，排序，翻页同样也会触发此事件 */
	gridComplete 	: function(){},
	/*当从服务器返回响应时执行，xhr：XMLHttpRequest 对象*/
	loadComplete 	: function(xhr){},
	/*如果请求服务器失败则调用此方法。xhr：XMLHttpRequest 对象；satus：错误类型，字符串类型；error：exception对象*/
	loadError 		: function(xhr,status,error){},
	/*当点击单元格时触发。rowid：当前行id；iCol：当前单元格索引；cellContent：当前单元格内容；e：event对象*/
	onCellSelect	: function(rowid,iCol,cellcontent,e){},
	/*双击行时触发。rowid：当前行id；iRow：当前行索引位置；iCol：当前单元格位置索引；e:event对象*/
	ondblClickRow	: function(rowid,iRow,iCol,e){},
	/*当点击显示/隐藏表格的那个按钮时触发；gridstate：表格状态，可选值：visible or hidden*/
	onHeaderClick	: function(gridstate){},
	/*点击翻页按钮填充数据之前触发此事件，同样当输入页码跳转页面时也会触发此事件*/
	onPaging		: function(pgButton){
		//文本回车查询
		if("user" == pgButton){
			var table = this;
			var options = this.p;
			if($.founded(options.pager) && $(options.pager).size() > 0 ){
				var pgid = options.pager.substr(1);
				var totalPage = ($.trim($("#sp_1_"+$.jgrid.jqID(pgid)).text())||'0').replace(",", "");
				var currtPage = $.trim($("#pg_"+$.jgrid.jqID(pgid)).find("input[name='showCount']").val());
				// 如果数据不存在，提示信息
				if(!/^[1-9]\d*$/.test(currtPage)){
					$.alert("输入的页码不是一个有效的数字!");
					return 'stop';
				}
				if(/^[1-9]\d*$/.test(totalPage) && parseInt(currtPage) <= parseInt(totalPage)){
				}else{
					$.alert("输入的页码必须小于或等于总页码!");
					return 'stop';
				}
			}
		}
	},
	/*在行上右击鼠标时触发此事件。rowid：当前行id；iRow：当前行位置索引；iCol：当前单元格位置索引；e：event对象*/
	onRightClickRow	: function(rowid,iRow,iCol,e){},
	/*multiselect为ture，且点击头部的checkbox时才会触发此事件。aRowids：所有选中行的id集合，为一个数组。 status：boolean变量说明checkbox的选择状态，true选中false不选中。无论checkbox是否选择，aRowids始终有值*/
	onSelectAll		: function(aRowids,status){},
	/*当选择行时触发此事件。rowid：当前行id；status：选择状态，当multiselect 为true时此参数才可用*/
	onSelectRow		: function(rowid,status){},
	/*当点击排序列但是数据还未进行变化时触发此事件。index：name在colModel中位置索引；iCol：当前单元格位置索引；sortorder：排序状态：desc或者asc*/
	onSortCol		: function(index,iCol,sortorder){},
	/*当开始改变一个列宽度时触发此事件。event：event对象；index：当前列在colModel中位置索引*/
	resizeStart		: function(event, index){},
	/*当列宽度改变之后触发此事件。newwidth：列改变后的宽度；index：当前列在colModel中的位置索引*/
	resizeStop		: function(newwidth, index){},
	/*向服务器发起请求时会把数据进行序列化，用户自定义数据也可以被提交到服务器端*/
	serializeGridData: function(postData){
		//累加当前grid请求次数
		var requestTime = $(this).data("requestTime") || 0;
		$.extend(postData,{
			"time"	: requestTime++
		});
		$(this).data("requestTime",requestTime);
		return postData;
	}
};

var BaseJqGrid = jQuery.extend({},JQGridBaseEvents,{
	
	//-----------------组件数据请求解析参数---------------------------------
	
	/* jqGrid控件通过这个路径请求得到需要显示的数据，具体的返回值可以使XML也可以是Json*/
	url			: "",
	/* 请求参数 ： 此数组内容直接赋值到url上，参数类型：{name1:value1…}或者是返回JSON类型的函数如：requestMap() */
	postData	: {},
	/* 定义是否一次加载所有数据:如果为ture则数据只从服务器端抓取一次，之后所有操作都是在客户端执行，翻页功能会被禁用*/
	loadonce	: false, 
	/*当请求或者排序时请求精度所显示的文字内容*/
	loadtext	: _localeKey =='en_US' ? 'Requesting data':"正在请求数据...",
	/* 从服务器端返回的数据类型，默认xml。可选类型：xml，local，json，jsonnp，script，xmlstring，jsonstring，clientside */
	datatype 	: "json", 
	/* ajax提交方式。POST或者GET，默认GET */
	mtype 		: 'POST',
	/* 加载速度提升5-10倍, 构造一行数据后添加到grid中，如果设为true则是将整个表格的数据都构造完成后再添加到grid中，但treeGrid, subGrid, or afterInsertRow 不能用; */
	gridview	: false,
	/* 用来设定如何解析从Server端发回来的json数据*/
	jsonReader	: {      
		/* json中代表实际模型数据的入口 */
		root		: "items",
		/* json中代表当前页码的数据 */
		page		: "currentPage",
		/* json中代表页码总数的数据 */
		total		: "totalPage",
		/* json中代表数据行总数的数据 */
		records		: "totalResult",  
		/* 如果设为false，则jqGrid在解析json时，会根据name来搜索对应的数据元素（即可以json中元素可以不按顺序）；而所使用的name是来自于colModel中的name设定 */
		repeatitems : false      
	},

	/* 设置jqGrid将要向Server传递的参数名称*/
	prmNames 	: {
		rows 	: "queryModel.showCount",
		page 	: "queryModel.currentPage",
		order 	: "queryModel.sortOrder",
		sort 	: "queryModel.sortName"
	},
	/* 字符串数组，用于指定各列的题头文本，与列的顺序是对应的。*/
	colNames 	: [],
	/*
	 * 最重要的数组之一，用于设定各列的参数：
	 * 格式如：colModel:[{label:'学年',name:'xnmc', index: 'xnmc',align:'center'},...]
	 * 参数解释：
	 *  name ：为Grid中的每个列设置唯一的名称，这是一个必需选项，其中保留字包括subgrid、cb、rn。
		index：设置排序时所使用的索引名称，这个index名称会作为sidx参数（prmNames中设置的）传递到Server。
		label ：当jqGrid的colNames选项数组为空时，为各列指定题头。如果colNames和此项都为空时，则name选项值会成为题头。
		width ：设置列的宽度，目前只能接受以px为单位的数值，默认为150。
		sortable ：设置该列是否可以排序，默认为true。
		search ：设置该列是否可以被列为搜索条件，默认为true。
		resizable ：设置列是否可以变更尺寸，默认为true。
		hidden ：设置此列初始化时是否为隐藏状态，默认为false。
		formatter ：预设类型或用来格式化该列的自定义函数名。常用预设格式有：integer、date、currency、number等（具体参见文档 ）。 
	 */
	colModel	: [],

	//-----------------组件树形Grid参数---------------------------------
	/* 启用或者禁用treegrid模式 */
	treeGrid: false,
	/* 返回数据的读取类型，分为两种：nested 和 adjacency	 */
	treeGridModel: 'adjacency',
	/* 树的图标，默认值：{plus:'ui-icon-triangle-1-e',minus:'ui-icon-triangle-1-s',leaf:'ui-icon-radio-off'} */
	treeIcons:{plus:'ui-icon-triangle-1-e',minus:'ui-icon-triangle-1-s',leaf:'ui-icon-radio-5'},
	/* 扩展表格的colModel且加在colModel定义的后面 */
	treeReader : {
		/*树形grid时数据划分级别的字段名称*/
	    level_field: 'level',
	    /*树形grid时数据中判断父级数据的字段名称*/
	    parent_id_field: 'parent',
	    leaf_field: 'leaf',
	    expanded_field: 'expanded'
	},
	/* 设置点击行时是否会展开/收缩属性表格，而不仅限于点击图标*/
    ExpandColClick: true,
    /* 树形grid时树形结构所在列的名称*/
    ExpandColumn: '',
    
	//-----------------组件分页排序参数---------------------------------
	
	/*定义翻页用的导航栏，必须是有效的html元素。翻页工具栏可以放置在html页面任意位置：这里始终以ID为pager的元素上绑定分页*/
	pager 		: "#pager",
	/*
	 *每页显示记录数;用于设置Grid中一次显示的行数，默认值为15。
	 *正是这个选项将参数rows（prmNames中设置的）通过url选项设置的链接传递到Server。
	 *注意如果Server返回的数据行数超过了rowNum的设定，则Grid也只显示rowNum设定的行数。 
	 */
	rowNum 		: parseInt($("#pageNumber").val()||15),
	/*每页显示的记录数下拉选择框，用于设置Grid可以接受的rowNum值。例如[10,20,30]，当选择时会覆盖rowNum参数传递到后台 */
	rowList 	: [15 ,20, 30, 50, 70, 90, 100, 150, 300, 500, 800, 1000, 1500, 2000, 2500, 5000], 
	/*是否可排序*/
	sortable	: true,
	/*是否可组合排序*/
	multiSort	: false,
	/*默认的排序列。可以是列名称或者是一个数字，此参数会被提交到后台*/
	sortname	: "",
	/* 排序顺序，升序或者降序（asc or desc） */
	sortorder 	: "asc",
	/* 是否进行grid国际化：需要 jquery.i18n插件的支持 */
	i18nable	: false,
	/* 是否一直读取最新的国际化信息，仅当i18nable为true时有效*/
	i18nLastest : false,
	
	//-----------------组件页面展示参数---------------------------------
	
	/* 设置Grid表格的标题，如果未设置，则标题区域不显示*/
	caption 	: null,
	/* 启用或者禁用控制表格显示、隐藏的按钮，只有当caption 属性不为空时起效;默认:false*/
	hidegrid 	: false,
	/* 是否只有当点击显示表格的那个按钮时才会去初始化表格数据;当为ture时，表格不会被显示，只显示表格的标题*/
	hiddengrid	: false,
	/* 当为false时mouse hovering会被禁用*/
	hoverrows	: false,
	/* 是否显示行号;设置成false则不显示；否则反之*/
	rownumbers	: false, 
	/* 显示行数时，该列的宽度，单位px*/
	rownumWidth	: 35,
	/* 定义是否在Pager Bar显示所有记录的总数  */
	viewrecords : true,
	/*设置表格 zebra-striped 值*/
	altRows 	: false, 
	/*用来指定行显示的css，可以编辑自己的css文件，只有当altRows设为 ture时起作用*/
	altclass 	: "ui-priority-secondary", 
	/*当为true时，会在翻页栏之上增加一行*/
	footerrow 	: false,
	/* 总计：当为true时把userData放到底部，用法：如果userData的值与colModel的值相同，那么此列就显示正确的值，如果不等那么此列就为空  */
	userDataOnFooter : false,
	
	//-----------------组件高宽相关参数---------------------------------
	
	/*
	 * 此选项用于根据width计算每列宽度的算法。默认值为true。
	 * 如果shrinkToFit为true且设置了width值，则每列宽度会根据 width成比例缩放；
	 * 如果shrinkToFit为false且设置了width值，则每列的宽度不会成比例缩放，而是保持原有设置，而Grid将会有 水平滚动条。 
	 */
	shrinkToFit	: false,
	/* 自动适应宽度的依赖对象：根据此对象宽度变化调整grid宽度*/
	resizeHandle: null,
	/* Grid的宽度，如果未设置，则宽度应为所有列宽的之和；如果设置了宽度，则每列的宽度将会根据shrinkToFit选项的设置，进行设置*/
	width		: "auto",
	/* 
	 * 设置是否自动调整宽度:默认值为false。如果设为true，则Grid的宽度会根据父容器的宽度自动重算。重算仅发生在Grid初始化的阶段；
	 * 如果当父容器尺寸变化了，同时也需要变化Grid的尺寸的话，则需要在自己的代码中调用setGridWidth方法来完成
	 */
	autowidth 	: true,
	/* Grid的高度，可以接受数字、%值、auto，默认值为150。*/
	height 		: "auto",
	/* Grid的最小高度，该值只有在使用 $(selector).loadJqGrid(options)方式加载的JQGrid组件，参数才有效。*/
	minHeight 	: null,
	/* 设置是否自动调整高度:默认值为false。如果设为true，则Grid的高度会根据父容器的高度自动调整；实际上调用$(selector).setGridHeight("auto");*/
	autoheight	: false,
	
	//-----------------组件多选相关参数---------------------------------
	
	// scroll: true,
	/* 定义是否支持多选*/
	multiselect : true, 
	/* 当multiselect为true时设置multiselect列宽度;单位：px*/
	multiselectWidth: 35,
	/* 只有在multiselect设置为ture时起作用，定义使用那个key来做多选。shiftKey，altKey，ctrlKey */
	multikey	: "",
	/* 只有当multiselect = true.起作用，当multiboxonly 为ture时只有选择checkbox才会起作用  */
	multiboxonly : false,
	
	//-----------------组件回调函数---------------------------------
	
	/* 当表格所有数据都加载完成而且其他的处理也都完成时触发此事件，排序，翻页同样也会触发此事件 */
	gridComplete 	: function(){
		gridCompleteCommon(this);
	},
	/*数据加载完成回调函数*/
	loadComplete: function (xhr) {
		var table = this;
		var selector = "#"+table.id;
		window.doCalcScrollBar && window.doCalcScrollBar() // 重新计算scrollBar
	},
	/*排序回调函数*/
	onSortCol 	: function(index, colindex, sortorder) {
		// 列排序事件
		// alert('onSortCol index=>'+index +" colindex=>"+colindex +"
		// sortorder=>"+sortorder);
	}
});

/**
 * JqGrid表格填充完回调公共方法
 */
function gridCompleteCommon(table){
	var selector = "#"+table.id;
	var mya = jQuery(selector).getDataIDs();

	// 字段名
	window.doSetFixedCol = function(ids, isRight) {
		var left = []
		var right = []
		for(var i = 0; i < ids.length; i++) {
			if(!isRight) {
				setFixedColById(ids[i], i)
			} else {
				setRightFixedColById(ids[i], i)
			}

		}
		function sumLeft(index) {
			var temp = 40
			for(var i = 0; i < index; i++) {
				temp=temp + left[i]+1
			}
			return temp
		}
		function sumRight(index) {
			var temp = 0
			for(var i = 0; i < index; i++) {
				temp=temp + right[i]+1
			}
			return temp
		}
		function setFixedColById(id, i) {
			var headDom = $(selector+'_' + id)
			var domIndex = headDom.index()
			headDom.addClass('ui-sortable-disabled')
			jQuery(selector).closest('.ui-jqgrid').find('tr th:nth-child(' + (domIndex + 1) + ')').addClass('tablehead-second-fixed').css('left', sumLeft(i))
			jQuery(selector + ' tr td:nth-child(' + (domIndex + 1) + ')').addClass('table-second-fixed').css('left', sumLeft(i))
			left.push(jQuery(selector).closest('.ui-jqgrid').find('tr th:nth-child(' + (domIndex + 1) + ')').width())
		}
		function setRightFixedColById(id, i) {
			var headDom = $(selector+'_' + id)
			var domIndex = headDom.index()
			headDom.addClass('ui-sortable-disabled')
			jQuery(selector).closest('.ui-jqgrid').find('tr th:nth-child(' + (domIndex + 1) + ')').addClass('tablehead-last-fixed').css('right', sumRight(i))
			jQuery(selector + ' tr td:nth-child(' + (domIndex + 1) + ')').addClass('table-last-fixed').css('right', sumRight(i))
			right.push(jQuery(selector).closest('.ui-jqgrid').find('tr th:nth-child(' + (domIndex + 1) + ')').width())
		}
	}
	var multiselect = jQuery(selector).jqGrid('getGridParam', 'multiselect');
	if(multiselect) {
		// 如果有选择组件，就把勾选的那一列固定
		$(selector).closest('.ui-jqgrid').find('tr th:first-child').addClass('tablehead-first-fixed')
		$(selector + ' tr td:first-child').addClass('table-first-fixed')
	}

	var colModel = ($(selector).jqGrid('getGridParam','colModel') || []).filter(function(index,value) {
		return !value.hidden && value.name != 'cb'
	});

	var leftArr = [] // 前N个固定的字段
	var rightArr = [] // 后N个固定的字段
	for(var i = 0; i < colModel.length; i++) {
		var colItem = colModel[i]
		if(colItem.sfdjl == '1') {
			leftArr.push(colItem.name)
		} else {
			break;
		}
	}
	var reverseModel = colModel.reverse()
	for(var i = 0; i < reverseModel.length; i++) {
		var colItem = reverseModel[i]
		if(colItem.sfdjl == '1') {
			rightArr.push(colItem.name)
		} else {
			break;
		}
	}

	if(leftArr.length > 0) {
		window.doSetFixedCol(leftArr, false)
	}
	if(rightArr.length > 0) {
		window.doSetFixedCol(rightArr, true)
	}

	//得到显示到界面的id集合

	var currPage = jQuery(selector).getGridParam("page")
	// 页码不是第一页并且该页面数据为空 直接跳转到第一页
	if(currPage > 1 && mya.length == 0) {
		// 查询按钮 triggerClick
		setTimeout(function() {
			jQuery(selector).refershGrid()
		}, 300)
	}
	// 看看表格父元素是否是dialog 如果是，就不需要处理
	window.doCalcScrollBar && window.doCalcScrollBar() // 重新计算scrollBar
	
	//处理表头和表格有横向和竖向滚动条时，横向滚动条拉到最后对不齐问题
    if ($(selector).closest(".ui-jqgrid-bdiv")[0].scrollHeight > $(selector).closest(".ui-jqgrid-bdiv")[0].clientHeight
    	&& $(selector).closest(".ui-jqgrid-bdiv")[0].scrollWidth > $(selector).closest(".ui-jqgrid-bdiv")[0].clientWidth) {
        $($(selector).closest(".ui-jqgrid-bdiv")[0]).prevAll(".ui-jqgrid-hdiv").css("overflow-y","scroll");
    }
}
/**
 * 加载JqGrid表格
 * @param tableID : jqGrid列表id
 * @param pagerId : jqGrid列表pager分页导航id
 * @param obj : jqGrid列表对象,如userGrid
 * @param percent : jqGrid列表宽度显示的百分比,非必填
 * @param width : jqGrid列表宽度减去的宽度,非必填
 */
function loadJqGrid(tableID, pagerId, obj, percent, width) {
	jQuery(tableID).loadJqGrid($.extend(obj||{},{
		"pager" : pagerId
	}));
}

/**
 * 刷新结果集
 * @param tabId
 */
function refershGrid(tabId) {
	//jQuery("#"+tabId).refershGrid();
    jQuery("#"+tabId).trigger("reloadGrid");
}

/**
* 通用查询脚本
* @param tabId
* @param jsonMap
* this.grid&& typeof f==="object"&&b.each(f, function (k, v) { delete $this.p[k];})&&b.extend(true,this.p,f)})
*/
function search(tabId,jsonMap) {
	jQuery("#"+tabId).searchGrid(jsonMap);
}

/**
 * 重置查询条件
 */
function searchReset(){
	
}


/**
 * 获取jqGrid中的选中行
 */
function getChecked() {
	return jQuery("#tabGrid").getKeys();
}

/**
 * 批量操作
 * @param url
 * @param msg
 */
function plcz(url,msg){
	var keys = getChecked();
	if (keys.length == 0){
		$.alert('请选择您要'+msg+'的记录！');
	} else {
		$.confirm('您确定要'+msg+'选择的记录吗？',function(result){
			if(result){
				jQuery.ajaxSetup({async:false});
				jQuery.post(url,{"ids":keys.join(",")},function(responseData,statusText){
					// responseData 可能是 xmlDoc, jsonObj, html, text, 等等...
					// statusText 	描述状态的字符串（可能值："No Transport"、"timeout"、"notmodified"---304 "、"parsererror"、"success"、"error"
					//字符型响应结果
					if($.type(responseData) === "string"){
						if(responseData.indexOf("成功") > -1){
							$.success(responseData,function() {
								if($("#tabGrid").size() > 0){
									refershGrid("tabGrid");
								}
							});
						}else if(responseData.indexOf("失败") > -1){
							$.error(responseData,function() {
								
							});
						} else{
							$.alert(responseData,function() {
								
							});
						}
					}
					//JSON型响应结果
					else if($.isPlainObject(responseData)){
					   if(responseData["status"] == "success"){
							$.success(responseData["message"],function() {
								canClose = true;
							});
						}else if(responseData["status"] == "error"){
							$.error(responseData["message"]);
						}else{
							$.alert(responseData["message"]);
						}
					}
				},'json');
				jQuery.ajaxSetup({async:true});
			}
		});
	}
}


//单元格合并公共调用方法
///
function Merger(gridName, CellName) {
	
    //得到显示到界面的id集合
    var mya = jQuery("#" + $.convertID(gridName)  ).getDataIDs();
    //当前显示多少条
    var length = mya.length;   
    for (var i = 0; i < length; i++) {
        //从上到下获取一条信息
    	var before = jQuery("#" + $.convertID(CellName + "" + mya[i] )).attr("value");
        //定义合并行数
        var rowSpanTaxCount = 1;
        for (j = i + 1; j <= length; j++) {
            //和上边的信息对比 如果值一样就合并行数+1 然后设置rowspan 让当前单元格隐藏
        	 var end = jQuery("#" + $.convertID(CellName + "" + mya[j]  )).attr("value");
        	 if (before == end) {
                rowSpanTaxCount++;
                jQuery("#" + $.convertID(gridName) ).setCell(mya[j], $.convertID(CellName), '', { display: 'none' });
             }else {
                rowSpanTaxCount = 1;
                break;
            }  
            jQuery("#" + $.convertID(CellName + "" + mya[i] ) ).attr("rowspan", rowSpanTaxCount);
        }
        
    }
}


/**
 * 返回指定行的数据
 * 返回的是数组array name:value
 * name为colModel中的名称
 * write by majun at 2012-07-25
 */
function getRowData() {
	return jQuery('#tabGrid').getSelectedRows();
}

/**
 * 返回指定行的数据
 * 返回的是数组array name:value
 * rowId为colModel中的key 值
 * write by majun at 2012-07-30
 */
function getOneRowData(rowId) {
	return jQuery('#tabGrid').getRow(rowId);
}

/**
 * 获取选中行的数据
 * 返回的是数组array name:value
 * write by majun at 2013-04-19
 */
function getSelectRowData(){
	var keys = jQuery("#tabGrid").getKeys();
	if (keys.length != 1) {
		$.alert('请选定一条记录!');
		return "";
	}else{
		return jQuery('#tabGrid').getRow(keys[0]);
	}
}


// 表格过长时 底部固定公共方法
$(document).ready(function () {
	// 处理加载顺序问题 若请求10次还没完成就自动结束（可能是网络极其慢，可能是没有用到表格但是引了资源）
	function initFixedScrollBar() {
		// 直接学校代码判断 不需要使用内置项
		var xxdm = $('#xxdm').val()
		if($('#sfsygdgdt').val() == '1') {
			// 执行了这一行
			// console.log('执行了这一行')
			$('body').append('<div id="lk_scrollbar" style="display: none;height: 18px;padding: 2px;background: #f1f1f1;position: fixed;bottom: 28px;z-index: 99;border-radius: 5px;overflow:hidden;"><div id="lk_handle" style="height: 14px;background: #c1c1c1;position: absolute;cursor: pointer;left: 0;"></div></div>')
			var oParent = $('#lk_scrollbar');
			var oDiv1 = $('#lk_handle');
			var oDiv2 = $('.ui-jqgrid-view');
			var oDiv3 = $('.ui-jqgrid-hdiv');
			var oDiv4 = $('.ui-jqgrid-bdiv');
			var oDiv5 = $('.ui-jqgrid-pager')

			if(oDiv2.length > 0) {
				window.hasInit = 10
			} else {
				window.hasInit = window.hasInit+1
			}

			function doCalcScrollBar() {
				// console.log('执行了计算')
				setScrollbar() // 设置滚动条宽度，onresize事件里面需要再次调用一下 进行重置
				showOrHideBar(eleInView())
			}
			function setScrollbar() {
				if(oDiv5.length > 0) {
					// 有分页的情况下
					oParent.css('bottom', '28px')
				} else {
					oParent.css('bottom', '0')
				}
				if(oDiv2 && oDiv2.length > 0) {
					oParent.css('left', oDiv2.offset().left)
					oParent.css('width', oDiv2.width())
				}
			}

			window.doCalcScrollBar = doCalcScrollBar // 在window上 受外层方法控制
			doCalcScrollBar()

			window.addEventListener('resize', function() {
				// 写个节流？
				setTimeout(function() {
					setScrollbar()
					showOrHideBar(eleInView()) // 触发一下这个事件
				}, 300)
			})

			var kz_lr = document.querySelector('#kz_lr')
			if(kz_lr) {
				kz_lr.addEventListener('click', function() {
					doCalcScrollBar()
				})
			}
			setTimeout(function () {
				reScrollBox()
				if(!oDiv3.next().hasClass('ui-jqgrid-bdiv')) {
					oDiv3.next().remove()
				}
			}, 1000)
			reScrollBox = function () {
				maxW = oDiv3.find('table').width();
				minW = oDiv2.width();
				scale = minW / maxW;
				oDiv1.width(oParent.width() * scale);
			}
			//拖动事件方法
			function moveDownSlide(l) {
				if (l < 0) {
					l = 0;
				} else if (l > oParent.width() - oDiv1.width()) {
					l = oParent.width() - oDiv1.width();
				}
				oDiv1.css('left', l);
				var scale = l / (oParent.width() - oDiv1.width());
				oDiv3.scrollLeft((oDiv3[0].scrollWidth - oDiv2.width()) * scale);
				oDiv4.scrollLeft((oDiv3[0].scrollWidth - oDiv2.width()) * scale);
			}
			//鼠标拖动事件
			oDiv1[0].onmousedown = function (ev) {
				ev = ev || window.event;
				var disX = ev.clientX - oDiv1.position().left;
				document.onmousemove = function (ev) {
					ev = ev || window.event;
					var l = ev.clientX - disX;
					moveDownSlide(l);
				};
				document.onmouseup = function () {
					document.onmousemove = null;
					document.onmouseup = null;
				};
				$(document).bind('selectstart', function (ev) {  // 防止页面内容被选中 IE
					return false;
				});
			};

			function eleInView() {
				var dom = oDiv2[0] // 转成原生的js对象
				var tableDom = oDiv2.find('table')
				var tableWidth = tableDom.width() // 内容的宽度
				var wrapperWidth = oDiv2.width() // 容器的宽度
				if(dom) {
					var DOMRect = dom.getBoundingClientRect()
					var top = DOMRect.top
					var bottom = DOMRect.bottom
					// 判断表格是否在视口内，已知dom的坐标位置
					// 内容比容器更大 四舍五入的误差处理
					// console.log('top < window.innerHeight', top, window.innerHeight)
					// console.log('bottom > window.innerHeight', bottom, window.innerHeight)
					// console.log('tableWidth > wrapperWidth',  tableWidth, wrapperWidth)
					if(top < window.innerHeight && bottom > window.innerHeight && tableWidth > wrapperWidth + 1) {
						return true
					} else {
						return false
					}
				} else {
					return false
				}
			}
			function showOrHideBar(flag) {
				// console.log('展示或隐藏的flag', flag)
				var bodyContainer = $('#bodyContainer')
				if(flag) {
					if(bodyContainer.find('#pg_pager').length > 0) {
						$("#lk_scrollbar").show()
						bodyContainer.find("#pg_pager").css({'position': 'fixed','bottom': 0,'background': '#f9f9f9','width': oDiv2.width()})
					} else {
						$("#lk_scrollbar").hide()
						bodyContainer.find("#pg_pager").css({'position': 'relative','bottom': 0,'background': 'transparent','width': '100%'})
					}
					// $("#pg_pager1").css({'position': 'fixed','bottom': 0,'background': '#f9f9f9','width': oDiv2.width()})
				} else {
					$("#lk_scrollbar").hide()
					bodyContainer.find("#pg_pager").css({'position': 'relative','bottom': 0,'background': 'transparent','width': '100%'})
					// $("#pg_pager1").css({'position': 'relative','bottom': 0,'background': 'transparent','width': '100%'})
				}
			}
			$(window).on('scroll', function (e) {
				showOrHideBar(eleInView())
			})
		}
	}
	window.hasInit = 1
	var interval = setInterval(function() {
		if(window.hasInit > 9) {
			clearInterval(interval)
		} else {
			window.hasInit = 10
			initFixedScrollBar()
		}
	}, 1000)
})
