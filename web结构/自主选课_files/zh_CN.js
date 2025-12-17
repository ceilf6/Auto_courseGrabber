;(function($){

	/** Map holding bundle keys (if mode: 'bootbox') */
	$.i18n = $.i18n || {};
	$.i18n.bootbox = $.i18n.bootbox || {};
	
	$.extend($.i18n.bootbox,{
		//按钮名称
		"buttons" 		: {
			"success"	: "确 定",
			"cancel"	: "关 闭",
			"export"	: "导出",
			"upload"	: "上 传",
			"choice"	: "选 择"
		},
		//弹窗标题
		"titles" 		: {
			"success"		: "成功提示",
			"alert"			: "警告提示",
			"error"			: "错误提示",
			"confirm" 		: "确认提示",
			"prompt"		: "信息提示",
			"export"		: "自定义导出",
			"report"		: "报表预览",
			"batchModify"	: "批量修改数据",
			"fullAvatar"	: "富头像上传",
			"showSort"		: "排序优先级设置",
			"scanCode"		: "扫码认证",
			"emailVerify"	: "邮箱认证"
		},
		//提示信息
		"messages" 		: {
			"open_tip"	: "功能时间开放提示"
		}
	});
	
	/**
	 * 设置bootbox内置的国际化方言
	 */
	bootbox.setDefaults({
		locale: "zh_CN"
	});
	
	/**
	 * 覆盖查看功能默认初始化参数 
	 */
	$.extend(true,viewConfig||{},{
		buttons		: {
			cancel : {
				label : $.i18n.bootbox["buttons"]["cancel"]
			}
		}
	});
	
	/**
	 * 覆盖新增功能默认初始化参数 
	 */
	$.extend(true,addConfig||{},{
		buttons		: {
			success : {
				label : $.i18n.bootbox["buttons"]["success"]
			},
			cancel : {
				label : $.i18n.bootbox["buttons"]["cancel"]
			}
		}
	});
	
	/**
	 * 覆盖修改功能默认初始化参数 
	 */
	$.extend(true,modifyConfig||{},{
		buttons		: {
			success : {
				label : $.i18n.bootbox["buttons"]["success"]
			},
			cancel : {
				label : $.i18n.bootbox["buttons"]["cancel"]
			}
		}
	});

}(jQuery));