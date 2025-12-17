//# sourceURL=zzxkYzb.js
var tabChangeTime=1000000000000;
var tabChangeFlag=0;
//var tabChangeTime=Date.now();
jQuery(function($){
	if($("#xkxfqzfs").val()!="1"){
		$(".l-kc-xf").show();
	}
	if($("#xkgwckg").val()=="1"){
		if($("#but_ancd").length>0){
			if($("#btn_jf").length>0){
				$("#btn_jf").before("<button type='button' class='btn btn-default btn_gwc' href='javascript:void(0);' id='btn_gwc'><i class='bigger-100 glyphicon glyphicon-shopping-cart'></i> "+$.i18n.get("msg_wdgwc")+"</button>");
			}else{
				$("#but_ancd").append("<button type='button' class='btn btn-default btn_gwc' href='javascript:void(0);' id='btn_gwc'><i class='bigger-100 glyphicon glyphicon-shopping-cart'></i> "+$.i18n.get("msg_wdgwc")+"</button>");
			}
		}else{
			var _html = [];
			_html.push("<div class='btn-toolbar' role='toolbar' style='float: right; z-index: 1050;'>");
			_html.push("<div class='btn-group' id='but_ancd'>");
			_html.push("<button type='button' class='btn btn-default btn_gwc' href='javascript:void(0);' id='btn_gwc'><i class='bigger-100 glyphicon glyphicon-shopping-cart'></i> "+$.i18n.get("msg_wdgwc")+"</button>");
			_html.push("</div>");
			_html.push("</div>");
			$("#btn-groups").html(_html.join(""));
		}
	}
	if($("#xxdm").val()=="10448" || $("#xxdm").val()=="10288"){
		if($("#but_ancd").length>0){
			$("#but_ancd").append("<button type='button' class='btn btn-default btn_wdxyqk' href='javascript:void(0);' id='btn_wdxyqk'><i class='bigger-100 glyphicon glyphicon-search'></i> "+$.i18n.get("msg_wdxyqk")+"</button>");
		}else{
			var _html = [];
			_html.push("<div class='btn-toolbar' role='toolbar' style='float: right; z-index: 1050;'>");
			_html.push("<div class='btn-group' id='but_ancd'>");
			_html.push("<button type='button' class='btn btn-default btn_wdxyqk' href='javascript:void(0);' id='btn_wdxyqk'><i class='bigger-100 glyphicon glyphicon-search'></i> "+$.i18n.get("msg_wdxyqk")+"</button>");
			_html.push("</div>");
			_html.push("</div>");
			$("#btn-groups").html(_html.join(""));
		}
	}
	if($("#xxdm").val()=="10651"){
		var _html = [];
		_html.push('<a href="javascript:void(0)" class="xhxmxx">'+$("#xm").val()+'('+$("#xh").val()+')</a>');
		_html.push('<a href="javascript:void(0)" class="cursj">'+$("#currentsj").val()+'</a>');
		$("#navbar_container").find(".navbar-header").after(_html.join(""));

	    function updateTimer() {
	    	var preTime = new Date($("#navbar_container").find(".container").find(".cursj").text());
	    	preTime.setSeconds(preTime.getSeconds()+1);
	        // 计算小时、分钟和秒
	        const year = preTime.getFullYear();
	        const month = String(preTime.getMonth()+1).padStart(2,'0');
	        const date = String(preTime.getDate()).padStart(2,'0');
	        const hours = String(preTime.getHours()).padStart(2,'0');
	        const minutes = String(preTime.getMinutes()).padStart(2,'0');
	        const seconds = String(preTime.getSeconds()).padStart(2,'0');
	        // 格式化时间
	        const formattedTime = year+'-'+month+'-'+date+' '+hours+':'+minutes+':'+seconds;
	        // 更新网页上的计时器显示
	        $("#navbar_container").find(".container").find(".cursj").text(formattedTime);
	    }

	    // 每秒更新一次计时器
	    setInterval(updateTimer, 1000);
	}
	
	$("#topButton").attr("onclick","");
	jQuery("#kklxdm").val(jQuery("#firstKklxdm").val());
	jQuery("#kklxmc").val(jQuery("#firstKklxmc").val());
	jQuery("#xkkz_id").val(jQuery("#firstXkkzId").val());
	jQuery("#njdm_id").val(jQuery("#firstNjdmId").val());
	jQuery("#zyh_id").val(jQuery("#firstZyhId").val());
	//getYinxYixXf(jQuery("#firstXkkzId").val(),jQuery("#firstKklxdm").val());
	if($("#iskxk").val()=="1"){//当前在选课时间内时，才可以加载选课页面
		$("#displayBox").load(_path+"/xsxk/zzxkyzb_cxZzxkYzbDisplay.html",{
			"xkkz_id":$("#xkkz_id").val(),"kklxdm":$("#kklxdm").val(),"xszxzt":$("#xszxzt").val(),"njdm_id":$("#njdm_id").val(),"zyh_id":$("#zyh_id").val(),"kspage":0,"jspage":0
		},function(){
			$("#choosedBox").load(_path+"/xsxk/zzxkyzb_cxZzxkYzbChoosed.html",{},function(){});
		});
	}
	//绑定默认高级查询
	$.extend(true,$.bootui.widget.messages,{
		searchbox:{
			placeholder		:	$.i18n.get("msg_srkcjxbjghcx") //请输入课程号或课程名称查询!
        }
	});

	jQuery("#searchBox").searchBox({
		showSize:6,
		searchFilter:true,
		autoSearch:false,
		onSearchClick:function(paramMap){
			$("#isEnd").val("false");
			$("#endsign").hide(); //隐藏到达最后一页提示
			$("#more").hide(); //隐藏到达最后一页提示
			if($("#iskxk").val()=="1"){//当前在选课时间内时，才可以加载选课页面
				var s_html = [];
				if($("#kklxdm").val()=="xyjsk"){
					s_html.push("<div class='clearfix'></div>");
					s_html.push("<div class='panel panel-info'>");
					s_html.push("<div class='panel-heading'>&nbsp;</div>");
					s_html.push("<div class='panel-body'>");
					//对不起，当前时间不可选课！
					s_html.push("<div class='nodata' style='font-size: 25px;'>【<a href='"+$("#xyjskljdz").val()+"' target='_blank'>请点击此处去选研究生课</a>】</div>");//请点击“选研究生课”页签去选研究生课！
					s_html.push("</div>");
					s_html.push("</div>");
					$("#contentBox").html(s_html.join(""));
				}else if($("#isinxksj").val()=="0" && $("#isInylsj").val()=="0" && $("#xksjxskz").val()=="0"){
					s_html.push("<div class='clearfix'></div>");
					s_html.push("<div class='panel panel-info'>");
					s_html.push("<div class='panel-heading'>&nbsp;</div>");
					s_html.push("<div class='panel-body'>");
					//对不起，当前时间不可选课！
					s_html.push("<div class='nodata'><span>"+$.i18n.get("txt-no-xksj")+"</span></div>");//对不起，当前时间不可选课！
					s_html.push("</div>");
					s_html.push("</div>");
					$("#contentBox").html(s_html.join(""));
				}else if($("#xxdm").val()=="12050" && $("#zckz").val()=="1" && $("#bdzcbj").val()!="2" && $("#bdzcbj").val()!="3"){
					s_html.push("<div class='clearfix'></div>");
					s_html.push("<div class='panel panel-info'>");
					s_html.push("<div class='panel-heading'>&nbsp;</div>");
					s_html.push("<div class='panel-body'>");
					//对不起，当前时间不可选课！
					s_html.push("<div class='nodata'><span>"+$.i18n.get("msg_djljwczc")+"</span></div>");//点击链接通过学生注册系统办理相关事宜。
					s_html.push("</div>");
					s_html.push("</div>");
					$("#contentBox").html(s_html.join(""));
				}else if($("#xxdm").val()=="11121" && ($("#lnzdyhxf").val()>0 || $("#lnzgyhxf").val()>0)){
					$.ajaxSetup({async:false});
					$.post(_path+"/xsxk/zzxkyzb_cxZzxkyzbLnyhxf.html",{"kklxdm":$("#kklxdm").val()},function(data){
						if(($("#lnzdyhxf").val()!="-1" && parseFloat($("#lnzdyhxf").val())>parseFloat(data)) || ($("#lnzgyhxf").val()!="-1" && parseFloat($("#lnzgyhxf").val())<parseFloat(data))){
							s_html.push("<div class='clearfix'></div>");
							s_html.push("<div class='panel panel-info'>");
							s_html.push("<div class='panel-heading'>&nbsp;</div>");
							s_html.push("<div class='panel-body'>");
							//对不起，当前时间不可选课！
							s_html.push("<div class='nodata'><span>"+$.i18n.get("bzyhdxfyqnbkxk")+"</span></div>");//该开课类型的课程已获得学分不在要求范围内，不可选课！
							s_html.push("</div>");
							s_html.push("</div>");
							$("#contentBox").html(s_html.join(""));
						}else{
							$("#kspage").val("0");
							$("#jspage").val("0");
							$("#js_kcrow").val("0");
							$(".tjxk_list").remove();
							loadCoursesByPaged();
						}
					},'json');
					$.ajaxSetup({async:true});
				}/*else if($("#isAlreadBm").val()=="0"){
					s_html.push("<div class='clearfix'></div>");
					s_html.push("<div class='panel panel-info'>");
					s_html.push("<div class='panel-heading'>&nbsp;</div>");
					s_html.push("<div class='panel-body'>");
					s_html.push("<div class='nodata'><span>"+$.i18n.get("txt-no-bmxx")+"</span></div>");//对不起，未找到您的报名信息，不可选此类课程！
					s_html.push("</div>");
					s_html.push("</div>");
					$("#contentBox").html(s_html.join(""));
				}*/
				/*else if($("#isPjAll").val()=="0"){	
					s_html.push("<div class='clearfix'></div>");
					s_html.push("<div class='panel panel-info'>");
					s_html.push("<div class='panel-heading'>&nbsp;</div>");
					s_html.push("<div class='panel-body'>");
					s_html.push("<div class='nodata'><span>"+$.i18n.prop("txt-no-pj", [$("#xkpdpjxnmc").val(), $("#xkpdpjxqmc").val()])+"</span></div>");//对不起，"+$("#xkpdpjxnmc").val()+"学年"+$("#xkpdpjxqmc").val()+"学期评价未完成，不可选此类课程！
					s_html.push("</div>");
					s_html.push("</div>");
					$("#contentBox").html(s_html.join(""));
				}else if($("#isJf").val()=="0"){	
					s_html.push("<div class='clearfix'></div>");
					s_html.push("<div class='panel panel-info'>");
					s_html.push("<div class='panel-heading'>&nbsp;</div>");
					s_html.push("<div class='panel-body'>");
					s_html.push("<div class='nodata'><span>"+$.i18n.prop("txt-no-jf", [$("#xkpdjfxnmc").val(), $("#xkpdjfxqmc").val()])+"</span></div>");//对不起，"+$("#xkpdjfxnmc").val()+"学年"+$("#xkpdjfxqmc").val()+"学期未完成缴费，不可选此类课程！
					s_html.push("</div>");
					s_html.push("</div>");
					$("#contentBox").html(s_html.join(""));
				}else if($("#isZxKxk").val() == '0'){
					s_html.push("<div class='clearfix'></div>");
					s_html.push("<div class='panel panel-info'>");
					s_html.push("<div class='panel-heading'>&nbsp;</div>");
					s_html.push("<div class='panel-body'>");
					s_html.push("<div class='nodata'><span>"+$.i18n.get("txt-no-zaix")+"</span></div>");//对不起，您当前学籍状态为不在校，不可选此类课程！
					s_html.push("</div>");
					s_html.push("</div>");
					$("#contentBox").html(s_html.join(""));
				}*/
				else{
					$("#kspage").val("0");
					$("#jspage").val("0");
					$("#js_kcrow").val("0");
					$(".tjxk_list").remove();
					loadCoursesByPaged();
				}
				
				if($(".condition-retract").find(".up").length>0){
					$(".condition-retract").find(".up").click();
				}
				tabChangeFlag=0;
			}
		},
		model:getConditionCols(),
		afterRender:function(){
			/*setTimeout("initSearchBoxDefaults()",1000);*/
			/*setTimeout("initCxtj($('#firstKklxdm').val())",1000);*/
			if($("#xxdm").val()=="10651"){
				$("div[name='sksjct_list']").find("ul").append("<li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color='red'>"+$.i18n.get("msg_yyczkbctjxb")+"</font></li>");//注：用于查找与自己课表中上课时间冲突（或不冲突）的教学班
			}
			$("button[name='reset']").html('<i class="bigger-110 icon-repeat"></i>'+$.i18n.get("msg_cztj"));
		}
	});
	
	if($("#to_kch").val()!=""){
		$("input[name='searchInput']").val($("#to_kch").val());
		setTimeout("$('#searchBox').trigger('searchResult')",100);
	}

	if ($('#mycos_sjtb_xkkg').val() == '1') {
		$.ajaxSetup({async:true});
		$.post(_path + '/xsxk/zzxkyzb_cxTbXspjzt.html', {}, function (msg, statusText) {}, "json");
	}
	//学生配课确认（上海大学）
	if ($("#xxdm").val()=="10280") {
		$.ajaxSetup({async: false});
		$.post(_path + '/xsxk/zzxkyzb_cxXspkqkqr.html', {"xnm": $("#xkxnm").val(), "xqm": $("#xkxqm").val()}, function(data){
			if(data=="1"){
				/*$.confirm($.i18n.get("msg_pkqrtx"),function(result){	//您有部分课程已经预置，请知晓
					if(result){
						$.post(_path + '/xsxk/zzxkyzb_cxBcxspkqkqr.html', {"xnm": $("#xkxnm").val(), "xqm": $("#xkxqm").val()}, function (data) {});
					}
				});*/
				$.message($.i18n.get("msg_wxtx"),"<div class='bootbox-body'><div class='alert confirm-modal'><p>"+$.i18n.get("msg_pkqrtx")+"</p></div></div><script>$('#msgModal').find('.bootbox-close').remove();</script>",function(){
					$.post(_path + '/xsxk/zzxkyzb_cxBcxspkqkqr.html', {"xnm": $("#xkxnm").val(), "xqm": $("#xkxqm").val()}, function (data) {});
				},{"width":"500px",afterRender : function(){
						$('#msgModal').find('.bootbox-close').remove();
						$('#msgModal').off('keyup');
						$('#msgModal').off('keydown');
						/*$("#btn_cancel").attr("disabled","true");
						$("#btn_cancel").html("我已知晓&nbsp;&nbsp;<span class='badge' id='badge_text'>5</span>");
						var interval_qr = window.setInterval(function(){
							var sj = $("#btn_cancel").find("#badge_text").text();
							var sj = sj*1-1;
							if(sj>=0){
								$("#btn_cancel").find("#badge_text").text(sj);
							}
							if(sj==0){
								$("#btn_cancel").removeAttr("disabled");
								$("#btn_cancel").removeClass("btn-default").addClass("btn-primary");
								window.clearInterval(interval_qr);
							}
						}, 1000);*/
					}
				});
			}
		});
		$.ajaxSetup({async:true});
	}
});

function getConditionCols(){
	var conditions = [];
	if($("#zzxkgjcxkg_tjbj").val()=="1"){
		//conditions.push({"index":"tjbj_list","text":($("#xxdm").val()=="10651"?$.i18n.get("msg_bnjbzykc"):$.i18n.get("msg_tjbj")),showSize:5,options:[{"1":$.i18n.get("msg_shi")}] ,defaults:[{"key":"1","text":$.i18n.get("msg_shi")}]});
		conditions.push({"index":"tjbj_list","text":($("#xxdm").val()=="10651"?$.i18n.get("msg_bnjbzykc"):$.i18n.get("msg_tjbj")),showSize:5,options:[{"1":$.i18n.get("msg_shi")}]});
	}
	/*if($("#zzxkgjcxkg_fatj").val()=="1"){
		conditions.push({"index":"fatj_list","text":($("#xxdm").val()=="10289"?$.i18n.get("msg_fatj"):$.i18n.get("msg_bnjbzykc")),showSize:5,options:[{"1":$.i18n.get("msg_shi")},{"0":$.i18n.get("msg_fou")}]});
	}*/
	if($("#zzxkgjcxkg_kkxy").val()=="1"){//开课学院
		//conditions.push({"index":"kkbm_id_list","text":$.i18n.jwglxt["kkxymc"],url:_path+"/xtgl/comm_cxKkbmList.html?rangeable=false",mapper:{"key":"jg_id","text":"jgmc"},sort:"jgdm",order:"desc",gridType:"3"});
		//conditions.push({"index":"kkbm_id_list","text":$.i18n.jwglxt["kkxymc"],url:_path+"/xtgl/comm_cxKkbmPaged.html?localeKey="+$("#localeKey").val(),mapper:{"key":"jg_id","text":"jgmc"},sort:"jgdm",order:"desc",gridType:3,rangeable:false});
		conditions.push({"index":"kkbm_id_list","text":$.i18n.jwglxt["kkxymc"],url:_path+"/xkgl/common_queryKkbmPaged.html?localeKey="+$("#localeKey").val(),mapper:{"key":"jg_id","text":"jgmc"},sort:"jgxh",order:"asc",gridType:"0"});
	}
	if($("#zzxkgjcxkg_nj").val()=="1"){//年级,defaults:[{"key":$("#njdm_id").val(),"text":$("#njmc").val()}]
		//conditions.push({"index":"njdm_id_list","text":$.i18n.jwglxt["njmc"],url:_path+"/xtgl/comm_cxNjPaged.html",mapper:{"key":"njdm_id","text":"njmc"},showSize:10,sort:"njmc",order:"desc"});
		conditions.push({"index":"njdm_id_list","text":$("#xxdm").val()=="10651"?$.i18n.get("msg_xsnj"):$.i18n.jwglxt["njmc"],url:_path+"/xkgl/common_queryNjPaged.html?njdm_id="+($("#zzxkgjcxkg_tjbj").val()=="1"?$("#njdm_id").val():"w"),mapper:{"key":"njdm_id","text":"njmc"},showSize:10,sort:"njxh",order:"desc",gridType:"7"});
	}
	if($("#zzxkgjcxkg_xy").val()=="1"){//学院
		var jgmc_gjcx = $.i18n.jwglxt["xymc"];
		if($("#xxdm").val()=="10486"){
			jgmc_gjcx = $.i18n.get("msg_jhxy");
		}else if($("#xxdm").val()=="10651"){
			jgmc_gjcx = $.i18n.get("msg_xsxy");
		}
		//conditions.push({"index":"jg_id_list","text":$("#xxdm").val()=="10486"?$.i18n.get("msg_jhxy"):$.i18n.jwglxt["xymc"],url:_path+"/xtgl/comm_cxXydmPaged.html?localeKey="+$("#localeKey").val(),mapper:{"key":"jg_id","text":"jgmc"},sort:"jgdm",order:"asc",gridType:"3"});
		conditions.push({"index":"jg_id_list","text":jgmc_gjcx,url:_path+"/xkgl/common_queryXyPaged.html?localeKey="+$("#localeKey").val()+"&jg_id="+($("#zzxkgjcxkg_tjbj").val()=="1"?$("#jg_id_1").val():"w"),mapper:{"key":"jg_id","text":"jgmc"},sort:"jgxh",order:"asc",gridType:"0"});
	}
	if($("#zzxkgjcxkg_zy").val()=="1"){//专业   ,defaults:[{"key":$("#zyh_id").val(),"text":$("#zymc").val()}]
		//conditions.push({"index":"zyh_id_list","text":$.i18n.jwglxt["zymc"],url:_path+"/xtgl/comm_cxZydmPaged.html?localeKey="+$("#localeKey").val(),mapper:{"key":"zyh_id","text":"zymc"},parent:"jg_id_list",sort:"zyh_id",order:"asc",gridType:"4"});
		conditions.push({"index":"zyh_id_list","text":$("#xxdm").val()=="10651"?$.i18n.get("msg_xszy"):$.i18n.jwglxt["zymc"],url:_path+"/xkgl/common_queryZyPaged.html?localeKey="+$("#localeKey").val()+"&zyh_id="+($("#zzxkgjcxkg_tjbj").val()=="1"?$("#zyh_id").val():"w"),mapper:{"key":"zyh_id","text":"zymc"},parent:"jg_id_list",sort:"zyxh",order:"asc",gridType:"4"});
	}
	if($("#zzxkgjcxkg_zyfx").val()=="1"){//专业方向
		conditions.push({"index":"zyfx_id_list","text":$.i18n.jwglxt["zyfx"],url:_path+"/xsxxxggl/xsxxwh_cxZyfxPaged.html?localeKey="+$("#localeKey").val(),mapper:{"key":"zyfx_id","text":"zyfxmc"},parent:["njdm_id_list","jg_id_list","zyh_id_list"],sort:"zyfx_id",order:"desc",gridType:"11"});
	}
	if($("#zzxkgjcxkg_bj").val()=="1"){//班级 
		conditions.push({"index":"bh_id_list","text":$.i18n.jwglxt["bj"],url:_path+"/xtgl/comm_cxBjdmPaged.html?localeKey="+$("#localeKey").val(),mapper:{"key":"bh_id","text":"bj"},parent:["zyh_id_list","njdm_id_list"],sort:"bh",order:"desc",gridType:5});
	}
	if($("#zzxkgjcxkg_xqu").val()=="1"){//校区
		/*conditions.push({"index":"xq_list","text":$.i18n.jwglxt["xxxq"],url:_path+"/query/query_cxXqList.html?sfky=1",mapper:{"key":"xqh_id","text":"xqmc"},sort:"xqmc",order:"desc",gridType:"20"});*/
		conditions.push({"index":"xq_list","text":$.i18n.jwglxt["xxxq"],url:_path+"/xkgl/common_queryXquListPaged.html",mapper:{"key":"xqh_id","text":"xqmc"},sort:"xqmc",order:"desc",gridType:"-1"});
	}
	if($("#zzxkgjcxkg_yqu").val()=="1"){//园区
		conditions.push({"index":"yq_list","text":$.i18n.get("msg_yuanq"),url:_path+"/xkgl/common_queryYquListPaged.html",mapper:{"key":"mc","text":"mc"},sort:"dm",order:"asc",gridType:"-1"});
	}
	if($("#zzxkgjcxkg_kclb").val()=="1"){//课程类别
		conditions.push({"index":"kclb_id_list","text":$.i18n.get("msg_kclb"),url:_path+"/xkgl/common_queryKclbListPaged.html",mapper:{"key":"kclbdm","text":"kclbmc"},showSize:6,sort:"kclbdm",order:"asc",gridType:"-1"});
	}
	if($("#zzxkgjcxkg_kcxz").val()=="1"){//课程性质
		conditions.push({"index":"kcxzdm_list","text":$.i18n.get("msg_kcxz"),url:_path+"/xkgl/common_queryKcxzPaged.html",mapper:{"key":"dm","text":"mc"},sort:"dm",showSize:6,order:"asc",gridType:"-1"});
	}
	if($("#zzxkgjcxkg_kcgs").val()=="1"){//课程归属 
		var kcgsmc_gjcx = $.i18n.get("msg_kcgs");
		if($("#xxdm").val()=="10486"){
			kcgsmc_gjcx = $.i18n.get("msg_ssly");
		}else if($("#xxdm").val()=="13294"){
			kcgsmc_gjcx = $.i18n.get("msg_2024kcgs");
		}
		conditions.push({"index":"kcgs_list","text":kcgsmc_gjcx,url:_path+"/xkgl/common_queryKcgsPaged.html",mapper:{"key":"kcgsdm","text":"kcgsmc"},showSize:7,sort:"px,kcgsdm",order:"asc",gridType:"-1"});
	}
	if($("#zzxkgjcxkg_kcz").val()=="1"){//课程组
		conditions.push({"index":"kcz_list","text":($("#xxdm").val()=="13294"?$.i18n.get("msg_2015kcz"):$.i18n.jwglxt["kczmc"]),url:_path+"/xkgl/common_queryKczPaged.html",mapper:{"key":"kz_id","text":"kzmc"},sort:"kz_id",showSize:6,order:"asc",gridType:"-1"});
	}
	if($("#zzxkgjcxkg_jxms").val()=="1"){//教学模式
		conditions.push({"index":"jxms_list","text":$.i18n.get("msg_jxms"),url:_path+"/xtgl/comm_cxJcsjList.html?lxdm=0032",mapper:{"key":"dm","text":"mc"},showSize:7});
	}
	if($("#zzxkgjcxkg_skxq").val()=="1"){//上课星期
		conditions.push({"index":"sksj_list","text":$.i18n.get("msg_skxq"),url:_path+"/xtgl/comm_cxJcsjList.html?lxdm=0036",mapper:{"key":"dm","text":"mc"},showSize:7});
	}
	if($("#zzxkgjcxkg_skjc").val()=="1"){//上课节次
		conditions.push({"index":"skjc_list","text":$.i18n.get("msg_skjc"),url:_path+"/xkgl/common_querySkjcList.html",mapper:{"key":"dm","text":"dm"},showSize:15,sort:"dm",order:"asc"});
	}
	if($("#zzxkgjcxkg_xf").val()=="1"){//学分
		conditions.push({"index":"xf_list","text":$.i18n.get("msg_xf"),fixed:true,type:"string",hidden:false});
	}
	if($("#zzxkgjcxkg_jxb").val()=="1"){//教学班
		conditions.push({"index":"jxbmc_list","text":$.i18n.get("msg_jxbmc"),fixed:true,type:"string",hidden:false});
	}
	if($("#zzxkgjcxkg_sfcx").val()=="1"){//是否重修
		conditions.push({"index":"cxbj_list","text":$.i18n.get("msg_sfcx"),showSize:5,options:[{"1":$.i18n.get("msg_shi")},{"0":$.i18n.get("msg_fou")}],hidden:false});
	}
	if($("#zzxkgjcxkg_ywyl").val()=="1"){//有无余量
		conditions.push({"index":"yl_list","text":$.i18n.get("msg_ywyl"),showSize:5,options:[{"1":$.i18n.get("msg_you")},{"0":$.i18n.get("msg_wu")}]});
	}
	if($("#zzxkgjcxkg_sksjct").val()=="1"){//上课时间冲突
		conditions.push({"index":"sksjct_list","text":$.i18n.get("msg_sksjct"),showSize:5,options:[{"1":$.i18n.get("msg_shi")},{"0":$.i18n.get("msg_fou")}]});
	}
	return conditions;
}

/*function getYinxYixXf(xkkz_id,kklxdm,zyh_id){
	if($("#xxdm").val()=="12809"){
		$.post(_path+"/xsxk/zzxkyzb_cxYinxyixxfByKklxdm.html",{"xkkz_id":xkkz_id,"kklxdm":kklxdm,"zyh_id":zyh_id},function(data){
			if(data=="0"){
				$.alert($.i18n.get("msg_wzyclxgly"));
			}else{
				$("#yinxyixxf").html("&nbsp;&nbsp;&nbsp;&nbsp;"+$.i18n.prop("msg-yinxyixxf", [data.yinxxf,data.yixxf,data.zaixxf]));
			}
		},'json');
	}
}*/

function showXfyq(){
	$.showDialog(_path+'/xsxk/zzxkyzb_cxYinxyixxfView.html',$.i18n.get("msg_xfyqjxdqk"),$.extend({},viewConfig,{width: "500px",data: {"kklxdm":$("#kklxdm").val()}}));
}

function showXkgz(){//查看选课规则
	$.showDialog(_path + "/xkgzsz/jbxkgzsz_cxJbxkgzsz.html",$.i18n.get("msg_ckxkgz"),$.extend({},viewConfig,{width: "1000px",data: {"xkkz_id":$("#xkkz_id").val(),"kklxdm":$("#kklxdm").val()}}));
}

function checkXfmc(){
	$.ajaxSetup({async:false});
	$.post(_path+"/xsxk/zzxkyzb_cxCheckZzxkyzbXfmcBynjzy.html",{
		"xnm":$("#xkxnm").val(),"xqm":$("#xkxqm").val(),
		"njdm_id":$("#njdm_id").val(),"zyh_id":$("#zyh_id").val(),"kklxdm":$("#kklxdm").val()
	},function(data){
		if(data=="0"){
			$.alert($.i18n.get("msg_wzyclxgly"));
		}else{ 
			var rst = data.split("~");
			if(rst[0].indexOf("0")>-1){
				$.alert(rst[1]);
			}else{
				$.success(rst[1]);
			}
		}
	},'json');
	$.ajaxSetup({async:true});
}

function showGrkb(){
	window.open("/jwglxt/kbcx/xskbcx_cxXskbcxIndex.html?gnmkdm=N253508&layout=default");
}

function showTskyxxf(){
	$.showDialog(_path+'/xsxk/zzxkyzb_cxTskAkcgstjyxxfmxView.html',$.i18n.get("msg_tskxdqk"),$.extend({},viewConfig,{width: "500px",data: {"kklxdm":$("#kklxdm").val()}}));
}

/*function initCxtj(kklxdm){
	if($("#zzxkgjcxkg_tjbj").val()=="1"){
		if(kklxdm=="01"){
			$("li[index='njdm_id_list_"+$("#njdm_id").val()+"']").find("a").click();
			$("li[index='jg_id_list_"+$("#jg_id_1").val()+"']").find("a").click();
			$("li[index='zyh_id_list_"+$("#zyh_id").val()+"']").find("a").click();
		}else{
			$("a[index='njdm_id_list_"+$("#njdm_id").val()+"']").find("span").click();
			$("a[index='jg_id_list_"+$("#jg_id_1").val()+"']").find("span").click();
			$("a[index='zyh_id_list_"+$("#zyh_id").val()+"']").find("span").click();
		}
	}
}*/

function initCxtj(kklxdm){
	if($("#zzxkgjcxkg_tjbj").val()=="1"){
		if(kklxdm=="01"){
			$("li[index='tjbj_list_1']").find("a").click();
		}else{
			$("a[index='tjbj_list_1']").find("span").click();
		}
	}
}

function queryCourse(a_element,kklxdm,xkkz_id,njdm_id,zyh_id){
	var oldID = $("#nav_tab").find("li.active").find("a").attr("id");
	var newID = $(a_element).attr("id");
	if(oldID==newID){
		return false;
	}
	if(Date.now()-tabChangeTime<1000){
		$.alert($.i18n.get("msg_wphchyq"));//"请勿频繁切换页签！"
		return false;
	}
	if(Date.now()-tabChangeTime<5000 && tabChangeFlag==1){//页签切换需要5秒的时间间隔
		$.alert($.i18n.get("msg_wphchyq"));//"请勿频繁切换页签！"
		return false;
	}else{
		tabChangeTime=Date.now();
		tabChangeFlag=1;
	}
	//getYinxYixXf(xkkz_id,kklxdm,zyh_id);
	$("#nav_tab").find("li").removeClass("active");
	$(a_element).parent().addClass("active");
	$("#kklxdm").val(kklxdm);
	$("#kklxmc").val($("#tab_kklx_"+kklxdm).text());
	$("#xkkz_id").val(xkkz_id);
	$("#njdm_id").val(njdm_id);
	$("#zyh_id").val(zyh_id);
	$("#more").hide(); //隐藏点击查看更多 
	$("#endsign").hide(); //隐藏到达最后一页提示
	initCxtj(kklxdm);
	$("#displayBox").load(_path+"/xsxk/zzxkyzb_cxZzxkYzbDisplay.html",{
		"xkkz_id":$("#xkkz_id").val(),"xszxzt":jQuery("#xszxzt").val(),"kklxdm":$("#kklxdm").val(),"njdm_id":jQuery("#njdm_id").val(),"zyh_id":jQuery("#zyh_id").val(),"kspage":0,"jspage":0
	},function(){
		//if(checkSlct()){
			//$("#searchBox").trigger("searchResult");
		//}
		setTimeout("$('#searchBox').trigger('searchResult')",100);//延迟加载，避免参数未加载完就执行了查询，否则有较小概率出现A页签下显示了B页签的课程
	});
}

function chooseCoursesQuickly(){
	$.ajaxSetup({async:false});
	$.post(_path+"/xsxk/zzxkyzb_xkZzxkyzbQuickly.html",{"xkkz_id":$("#xkkz_id").val()},function(data){
		if(data.flag=="0"){
			$.alert(data.msg);
		}else if(data.flag=="1"){
			//$("#xkczbj").val("1");//减少课表的刷新频率
			$("#choosedBox").load(_path+"/xsxk/zzxkyzb_cxZzxkYzbChoosed.html",{},function(){
				$("#searchBox").trigger("searchResult");
				if($("#xkxfqzfs").val()=="1"){
					var yxxf_jxb=0;
					$(".outer_xkxx_list").each(function(idx,itm){
						var jxbxf = 0;
						if($(itm).find("input[name='right_ddkzbj']").val()=="0"){
							$(itm).find("input[name='right_jxbxf']").each(function(i,t){
								if(i==0){
									jxbxf = $(t).val();
								}else if(jxbxf*1<($(t).val())*1){
									jxbxf = $(t).val();
								}
							});
						}
						yxxf_jxb=yxxf_jxb*1+jxbxf*1;
					});
					$("#yxxfs_jxb").text(yxxf_jxb);
				}else{
					var yxxf = 0;
					$("input[name='right_xf']").each(function(idx,itm){
						if($(itm).parent().find("input[name='right_ddkzbj']").val()=="0"){
							yxxf = yxxf + parseInt($(itm).val());
						}
					});
					$("#yxxfs").text(yxxf);
					
					if($("#zzxkxsrwxfkg").val()=="1"){
						var yxxf_jxb=0;
						$(".outer_xkxx_list").each(function(idx,itm){
							var jxbxf = 0;
							if($(itm).find("input[name='right_ddkzbj']").val()=="0"){
								$(itm).find("input[name='right_jxbxf']").each(function(i,t){
									if(i==0){
										jxbxf = $(t).val();
									}else if(jxbxf*1<($(t).val())*1){
										jxbxf = $(t).val();
									}
								});
							}
							yxxf_jxb=yxxf_jxb*1+jxbxf*1;
						});
						$("#yxxfs_jxb").text(yxxf_jxb);
					}
				}
			});
			$.success($.i18n.get("msg_yjxkywc"));//一键选课已完成！
		}
	},'json');
	$.ajaxSetup({async:true});
}

function checkSlct(){
	if($(".selecteds").text()=="" && $("input[name='searchInput']").val()==""){
		return false;
	}else{
		return true;
	}
}

$("#btn_jf").click(function() {
	$.openWin(_path + "/paycenter/paycenter_cxGrjfIndex.html?gnmkdm=N0185&layout=default");
});

$("#kbcxbtn_zzxk").click(function(){
	var map={xnm:$("#xkxnm").val(),xqm:$("#xkxqm").val()};//'学生课表预览'
	$.showDialog(_path+'/kbcx/xskbcx_cxXskbPopupIndex.html',$.i18n.get("msg_xskbyl"),$.extend({},viewConfig,
		{width: $("#yhgnPage").innerWidth()+"px",data: {'map':map}}
	));
});


//加载某门课程的教学班
function loadJxbxxZzxk(obj){
	var czzt = $(obj).find("input[name='czzt']").val();
	var kch_id = $(obj).find("input[name='kch_id']").val();
	if(czzt=="0"){
		var requestMap = $("#searchBox").searchBox("getConditions");
		$.extend(requestMap,{
			"rwlx":$("#rwlx").val(),"xkly":$("#xkly").val(),"bklx_id":$("#bklx_id").val(),"sfkkjyxdxnxq":$("#sfkkjyxdxnxq").val(),"kzkcgs":$("#kzkcgs").val(),
			"xqh_id":$("#xqh_id").val(),"jg_id":$("#jg_id_1").val(),"zyh_id":$("#zyh_id").val(),"zyfx_id":$("#zyfx_id").val(),"txbsfrl":$("#txbsfrl").val(),
			"njdm_id":$("#njdm_id").val(),"bh_id":$("#bh_id").val(),"xbm":$("#xbm").val(),"xslbdm":$("#xslbdm").val(),"mzm":$("#mzm").val(),"xz":$("#xz").val(),
			"ccdm":$("#ccdm").val(),"xsbj":$("#xsbj").val(),"sfkknj":$("#sfkknj").val(),"gnjkxdnj":$("#gnjkxdnj").val(),"sfkkzy":$("#sfkkzy").val(),"kzybkxy":$("#kzybkxy").val(),
			"sfznkx":$("#sfznkx").val(),"zdkxms":$("#zdkxms").val(),"sfkxq":$("#sfkxq").val(),"sfkcfx":$("#sfkcfx").val(),"bbhzxjxb":$("#bbhzxjxb").val(),
			"kkbk":$("#kkbk").val(),"kkbkdj":$("#kkbkdj").val(),"bklbkcj":$("#bklbkcj").val(),"xkxnm":$("#xkxnm").val(),"xkxqm":$("#xkxqm").val(),"xkxskcgskg":$("#xkxskcgskg").val(),
			/*"njdm_id_xs":$("#njdm_id_xs").val(),"zyh_id_xs":$("#zyh_id_xs").val(),*/"rlkz":$("#rlkz").val(),"cdrlkz":$("#cdrlkz").val(),
			"rlzlkz":$("#rlzlkz").val(),"kklxdm":$("#kklxdm").val(),"kch_id":$(obj).find("input[name='kch_id']").val(),"jxbzcxskg":$("#jxbzcxskg").val(),
			"xklc":$("#xklc").val(),"xkkz_id":$("#xkkz_id").val(),"cxbj":$(obj).find("input[name='cxbj']").val(),"fxbj":$(obj).find("input[name='fxbj']").val()
		});
		$.ajaxSetup({async:false});
		$.post(_path+"/xsxk/zzxkyzbjk_cxJxbWithKchZzxkYzb.html",requestMap,function(data){
			setTimeout(function(){
				if(data!=null){
					if(data=="0"){
						$.alert("(JS-1)"+$.i18n.get("msg_jgfffw"));//警告：你正在非法访问！
						return false;
					}
					showHideJxb(obj);//展开关闭当前课程的教学班列表
					var rwlx = $("#rwlx").val();
					var kklxdm = null;
					for(var i=0; i<data.length; i++){
						var trObj = $("#tr_"+$.convertID(data[i].jxb_id));
						if(i==0){
							kklxdm = trObj.find(".kklxdm").text();
						}
						if(data[i].fxbj=="1" || data[i].bxbj=="1"){
							trObj.css("color","red");
						}
						trObj.find(".jxbrs").text(data[i].yxzrs);
						trObj.find(".jxbrl").text(data[i].jxbrl);
						trObj.find(".jxbzrl").text(data[i].jxbrl);
						trObj.find(".sksj").html(data[i].sksj);
						if($("#sfxsjxdd").val()=="1"){
							trObj.find(".jxdd").html(data[i].jxdd);
						}
						trObj.find(".jxms").text(data[i].jxms);
						trObj.find(".jxbxf").text(data[i].xf);
						if($("#xxdm").val()=="10248"){
							trObj.find(".skfsmc").text(data[i].skfsmc);
						}
						if($("#xkbzsyljkg").val()=="1"){
							if($.defined(data[i].xkbz)){
								trObj.find(".xkbz").html("【<a href='javascript:void(0)' onclick=showXkbz('"+data[i].jxb_id+"')>"+$.i18n.jwglxt["ck"]+"</a>】");//查看
							}else{
								trObj.find(".xkbz").html("<font color='#aaa'>【"+$.i18n.jwglxt["ck"]+"】</font>");//查看
							}
						}else{
							trObj.find(".xkbz").text(data[i].xkbz);
						}
						if($("#sfxskssj").val()=="1"){
							trObj.find(".kssj").text(data[i].kssj);
						}
						/*if($("#xxdm").val()=="10280"){
							trObj.find(".dyidd").text(data[i].dyidd);
							trObj.find(".dyisj").text(data[i].dyisj);
						}*/
						if($("#xxdm").val()=="10005" && $("#kklxdm").val()=="03"){
							//trObj.find(".fxbj").text(data[i].fxbj=="1"?"是":"否");
							trObj.find(".fxbj").text(data[i].fxbj=="1"?$.i18n.jwglxt["yes"]:$.i18n.jwglxt["no"]);
						}
						if($("#txbsfrl").val()=="1" && $("#dsfrlxskg").val()=="1"){
							trObj.find(".dsfrl").text(data[i].dsfrl);
						}
						if($("#txbsfrl").val()=="1" && $("#xksjjfsjxskg").val()=="1"){
							trObj.find(".sjsfsj").text(data[i].sjsfsj);
						}
						trObj.find(".kcgs").text(data[i].kcgsmc);
						trObj.find(".jxbzc").text(data[i].jxbzc);
						trObj.find(".kclb").text(data[i].kclbmc);
						trObj.find(".kcxz").text(data[i].kcxzmc);
						trObj.find(".xqh_id").text(data[i].xqh_id);
						trObj.find(".jxbxf").text(data[i].xf);
						if($("#zzxkxsrwxfkg").val()=="1" || $("#xkxfqzfs").val()=="1"){
							trObj.find(".jxbxf_1").text(data[i].xf);
						}
						trObj.find(".kkxymc").text(data[i].kkxymc);
						trObj.find(".xqumc").text(data[i].xqumc);
						trObj.find(".yqumc").text(data[i].yqmc);
						trObj.find(".do_jxb_id").text(data[i].do_jxb_id);
						if($("#xksdxjckg").val()=="2" && $.founded(data[i].sfydjc) && $.founded(trObj.find('.jc'))){
							trObj.find("#jc-"+data[i].jxb_id).removeAttr("disabled");
							if(data[i].sfydjc == '1'){
								trObj.find(".jc").html("<button id='jc-"+data[i].jxb_id+"' type='button' class='btn btn-danger btn-sm' onclick=orderBook('"+data[i].jxb_id+"','0')>"+$.i18n.get("msg_td")+"</button>");
							}
						}
						if($.defined(data[i].jsxx)){
							var jsxxArray = data[i].jsxx.split(";");
							var jsxmHtml = null;
							var jsxmString = null;
							var jszcString = null;
							for(var m=0; m<jsxxArray.length; m++){
								var tmpArray = jsxxArray[m].split("/");
								if(m==0){
									if($.defined(tmpArray[1]) && tmpArray[1]!="--"){
										jsxmHtml = "<font color='blue'><a href='javascript:void(0);' onclick=showTeacherInfo('"+tmpArray[0]+"','"+kch_id+"')>"+($.defined(tmpArray[1])?tmpArray[1]:"--")+"</a></font>";
									}else{
										jsxmHtml = "--";
									}
									jsxmString = $.defined(tmpArray[1])?tmpArray[1]:"--";
									jszcString = $.defined(tmpArray[2])?tmpArray[2]:"--";
								}else{
									if($.defined(tmpArray[1]) && tmpArray[1]!="--"){
										jsxmHtml = jsxmHtml + "、<font color='blue'><a href='javascript:void(0);' onclick=showTeacherInfo('"+tmpArray[0]+"','"+kch_id+"')>"+($.defined(tmpArray[1])?tmpArray[1]:"--")+"</a></font>";
									}else{
										jsxmHtml = "--";
									}
									jsxmString = jsxmString + "、" +($.defined(tmpArray[1])?tmpArray[1]:"--");
									jszcString = jszcString + "、" +($.defined(tmpArray[2])?tmpArray[2]:"--");
								}
							}
							trObj.find(".jsxm").text(jsxmString);
							if($("#xkjsxxxsfs").val()=="2"){
								trObj.find(".jszc").text("");
								trObj.find(".jsxmzc").html("【"+jsxmHtml+"】");
							}else{
								trObj.find(".jszc").text(jszcString);
								trObj.find(".jsxmzc").html("【"+jsxmHtml+"】<br>"+jszcString);
							}
						}
					}
					var zckz = $("#zckz").val();
					//var bdzcbj = $("#bdzcbj").val();
					var rlkz = $("#rlkz").val();
					var cdrlkz = $("#cdrlkz").val();
					var rlzlkz = $("#rlzlkz").val();
					/*var zcxkbj = "1";
					if(zckz=="1" && bdzcbj!="2" && bdzcbj!="3"){
						zcxkbj = "0";
					}*/
					var kcxzzt = $(obj).find("input[name='kcxzzt']").val();
					var cxbj = $(obj).find("input[name='cxbj']").val();
					var jxb_ids = [];
					$(obj).parent().find("div table tbody").find(".jxb_id").each(function(index,item){
						var m_jxb_id = $(item).text();
						var trObj = $("#tr_"+$.convertID(m_jxb_id));
						var m_jxbzls = trObj.find(".jxbzls").text();
						var m_jxbrs = trObj.find(".jxbrs").text();
						var m_jxbrl = trObj.find(".jxbrl").text();
						var m_do_jxb_id = trObj.find(".do_jxb_id").text();
						setRlxxAddZzxk(trObj,m_jxbrs,m_jxbrl);//设置容量是否已满

						if($("#jzxkf").val()=="0" && $("#isinxksj").val()!="1" && $("#xkgwckg").val()=="1"){
							trObj.find("td.an").html("<button id='btn-xk-"+m_jxb_id+"' type='button' class='btn btn-primary btn-sm' onclick=insertGwcZzxk('"+m_jxb_id+"','"+m_do_jxb_id+"','"+kch_id+"','"+m_jxbzls+"')>"+$.i18n.get("msg_jrgwc")+"</button>");
						}else if($("#jzxkf").val()=="1" || $("#isinxksj").val()!="1" || ($("#xxdm").val()=="10486" && $("#sfkxk").val()!="1")){
							trObj.find("td.an").html("<span class='jinxuan' style='font-size:15px;color:red;'><b>"+$.i18n.get("msg_jx")+"</b></span>");
						}else{
							trObj.find("td.an").html("<button id='btn-xk-"+m_jxb_id+"' type='button' class='btn btn-primary btn-sm' onclick=chooseCourseZzxk('"+m_jxb_id+"','"+m_do_jxb_id+"','"+kch_id+"','"+m_jxbzls+"')>"+$.i18n.get("msg_xk")+"</button>");
						}
						/*if($("#jzxkf").val()=="0" && $("#isinxksj").val()=="1"){
							trObj.find("td.an").html("<button id='btn-xk-"+m_jxb_id+"' type='button' class='btn btn-primary btn-sm' onclick=chooseCourseZzxk('"+m_jxb_id+"','"+m_do_jxb_id+"','"+kch_id+"','"+m_jxbzls+"')>"+$.i18n.get("msg_xk")+"</button>");
						}else if($("#jzxkf").val()=="0" && $("#isinxksj").val()!="1" && $("#xkgwckg").val()=="1"){
							trObj.find("td.an").html("<button id='btn-xk-"+m_jxb_id+"' type='button' class='btn btn-primary btn-sm' onclick=insertGwcZzxk('"+m_jxb_id+"','"+m_do_jxb_id+"','"+kch_id+"','"+m_jxbzls+"')>"+$.i18n.get("msg_jrgwc")+"</button>");
						}else{
							trObj.find("td.an").html("<span class='jinxuan' style='font-size:15px;color:red;'><b>"+$.i18n.get("msg_jx")+"</b></span>");
						}*/
					});
					if(kcxzzt=="1"){//如果有被选中的课程，则遍历浮动框中对应课程下的已选中班级把主页面中的教学班修改为选中状态
						var t_kch_id = kch_id;
						//if($("#jdlx").val()=="1" && kklxdm=="05" && cxbj=="0"){
						if($("#jdlx").val()=="1" && cxbj=="0"){
							t_kch_id = "kklx_"+kklxdm;
						}
						$("#right_ul_"+t_kch_id).find("input[name='right_jxb_id']").each(function(index,item){
							var trObj = $("#tr_"+$.convertID($(item).val()));
							//$("#tr_"+$.convertID($(item).val())).find(".an").html($(item).parent().find(".but").html());
							if($(item).parent().find(".but").find("button").length>0){
								var jxb_id = $(item).val();
								var do_jxb_id = trObj.find(".do_jxb_id").text();
								var m_jxbzls = trObj.find(".jxbzls").text();
								trObj.find(".an").html("<button class='btn btn-danger btn-sm' onclick=cancelCourseZzxk('leftpage','"+jxb_id+"','"+do_jxb_id+"','"+kch_id+"','"+m_jxbzls+"','"+$("#xkkz_id").val()+"') type='button'>"+$.i18n.get("msg_tx")+"</button>");
							}else{
								trObj.find(".an").html("<span style='font-size:15px;color:#428BCA;'><b>"+$.i18n.get("txt-yx")+"</b></span>");
							}
							trObj.find("input[name='hidsfxz']").val("1");
						});
					}
					$(obj).find("input[name='czzt']").val("1");
				}
			},1); 
		},'json');
		$.ajaxSetup({async:true});
	}else{
		showHideJxb(obj);//展开关闭当前课程的教学班列表
	}
}

function showHideJxb(obj){
	if($(obj).find(".expand_close").attr("class").indexOf("expand1")>0){ 
		if($("#xkkczdsqkg").val()=="1"){
			//打开一门课程的教学班列表的同时，关闭其他课程下的教学班列表 
			$(".tjxk_list .panel-heading .expand_close").each(function(index,item){
				if($(item).attr("class").indexOf("close1")>0){
					$(item).removeClass('close1').addClass('expand1');
					$(item).parent().parent().find(".panel-body").slideUp();
				}
			});
		}
		$(obj).children(".expand_close").removeClass('expand1').addClass('close1');
		$(obj).next(".panel-body").slideDown();
	}else{
		$(obj).children(".expand_close").removeClass('close1').addClass('expand1');
		$(obj).next(".panel-body").slideUp();
	}
}

function setRlxxAddZzxk(trObj,jxbrs,jxbrl){
	var cdrlkz = $("#cdrlkz").val();
	var rlkz = $("#rlkz").val();
	var rlzlkz = $("#rlzlkz").val();
	if(1*jxbrs >= 1*jxbrl){
		if($("#xkkzrlsrlmxsfs").val()!="1" && (cdrlkz=="1" || rlkz=="1" || rlzlkz=="1")){
			trObj.find(".full").css("display","");
			if($("#xxdm").val()=="10486"){
				trObj.find(".wdrsxx").css("display","none");
			}else{
				trObj.find(".rsxx").css("display","none");
			}
		}
		if($("#wrljxbbhkg").val()=="1"){
			trObj.addClass("jxb-wyl");
		}
	}
}

function setRlxxSubtractZzxk(trObj,jxbrs,jxbrl){
	var rlkz = $("#rlkz").val();
	var cdrlkz = $("#cdrlkz").val();
	var rlzlkz = $("#rlzlkz").val();
	if($("#xkkzrlsrlmxsfs").val()!="1" && (cdrlkz=="1" || rlkz=="1" || rlzlkz=="1") && 1*jxbrs < 1*jxbrl){
		trObj.find(".full").css("display","none");
		if($("#xxdm").val()=="10486"){
			trObj.find(".wdrsxx").css("display","");
		}else{
			trObj.find(".rsxx").css("display","");
		}
	}
}
/*$(document).off("click",'#btn_wdxyqk').on("click",'#btn_wdxyqk',function(event){
	//event.stopPropagation();
	$.showDialog(_path+'/xsxy/xsxyqk_cxXsxyqkIndex.html?gnmkdm=N105515',$.i18n.get("msg_wdxyqk"),$.extend({},viewConfig,{
		width: ($('#yhgnPage').innerWidth()-200)+'px',
		buttons:{
			cancel : {
				label : $.i18n.jwglxt["cancel"],
				className : "btn-default",
				callback : function() {
					$(".ui-jqdialog").remove();
				}
			}
		}
	}));
})*/

function showTeacherInfo(jgh_id,kch_id){
	if($("#xxdm").val()=="10280" && $("#jsjjgrlj").val()!=""){
		$.openWin($("#jsjjgrlj").val());
	}else if(jgh_id!='--'){
		$("#jgh_id").val(jgh_id);//'教师简介'
		$.showDialog(_path+'/xkgl/common_cxJsxxModel.html',$.i18n.get("msg_jsjj"),$.extend({},viewConfig,
				{width: ($("#yhgnPage").innerWidth()-400)+"px",data: {'jgh_id':jgh_id,'kch_id':kch_id}}
		));
	}else{
		$.alert($.i18n.get("msg_jxbjsdd"));//该教学班教师待定！
		return false;
	}
}

function showCourseInfo(kch_id){
	var event = $.event.get();
	event.stopPropagation();//课程简介
	if($("#xxdm").val()=="10248"){
		$.showDialog(_path + "/kckgl/kcdgwh_ckKcdgxx.html?kch_id=" + kch_id + '&gnmkdm=' + $("#gnmkdmKey").val(), $.i18n.get("msg_kcdg"), $.extend(true, {}, viewConfig, {"width": "1000px"}));
		//$.showDialog(_path + "/xsxk/zzxkyzb_cxKcdgxx.html?kch_id=" + kch_id, $.i18n.get("msg_kcdg"), $.extend(true, {}, viewConfig, {"width": "1000px"}));
	}else{
		$.showDialog(_path+'/xkgl/common_cxKcxxModel.html',$.i18n.get("msg_kcjj"),$.extend({},viewConfig,
				{width: ($("#yhgnPage").innerWidth()-400)+"px",data: {'kch_id':kch_id}}
		));
	}
}

function ckjxbrsxx(kch_id,jxb_id){//教学班人数信息
	var event = $.event.get();
	event.stopPropagation();
	$.showDialog(_path+'/xkgl/common_cxJxbrsmxIndex.html',$.i18n.get("msg_jxbrsmx"),$.extend({},viewConfig,
			{width:"550px",data: {'kch_id':kch_id,'jxb_id':jxb_id,"xnm":$("#xkxnm").val(),"xqm":$("#xkxqm").val()}}
	));
}

function showJcInfo(jxb_id){
	if($.founded(jxb_id)){//教材信息
		$.showDialog(_path+"/xsxk/tjxkyzb_cxJcxxList.html",$.i18n.get("msg_jcxx"),$.extend(true,{},viewConfig,
				{width: ($("#yhgnPage").innerWidth()-100)+"px",data: {'jxb_id':jxb_id}}
		));
	}else{
		return false;
	}
}

function showXkbz(jxb_id){
	if($.founded(jxb_id)){//选课备注
		$.showDialog(_path+"/xsxk/tjxkyzb_cxXkbzMsg.html",$.i18n.get("msg_xkbz"),$.extend(true,{},viewConfig,
				{width: "500px",data: {'jxb_id':jxb_id}}
		));
	}
}

function showTsxxkcxdqk() {
	$.openWin(_path + "/xkcx/tsxxcx_cxTsxxkcjd.html?gnmkdm=N154675&layout=default");
}

//查看上传附件
function xzKcssfa(jxb_id){
    //构建form
    jQuery.buildForm("downForm", _path + "/xkgl/common_cxKcssfaFile.html", {
    	jxb_id: jxb_id
    }).submit();
}

function loadCoursesByPaged(){
	var step = ($.defined($("#xkmcjzxskcs").val()) && $("#xkmcjzxskcs").val()!="")?$("#xkmcjzxskcs").val():10;
	var jspage = $("#jspage").val();
    var globJsPage = $("#globJsPage").val();
    var isEnd = $("#isEnd").val();
    var isSlct = checkSlct();
    if(isEnd=="true"){
		$("#globJsPage").val(jspage);
		$("#more").hide(); //隐藏点击链接
		$("#endsign").show(); //显示到达最后一页提示
	}else if((jspage=="0" || parseInt(globJsPage)<parseInt(jspage)) && isEnd=="false"){
		if(parseInt(jspage)==step && $("#js_kcrow").val()*1 < step*1){//未瀑布加载前已到最后页时，就不需要再次访问数据库
			$("#more").hide(); //隐藏点击链接
			$("#endsign").show(); //显示到达最后一页提示
			$("#isEnd").val("true");
		}else{
			$("#globJsPage").val(jspage);
			$("#endsign").hide(); //隐藏到达最后一页提示
			var requestMap = $("#searchBox").searchBox("getConditions");
			$.extend(requestMap,{
				"rwlx":$("#rwlx").val(),"xklc":$("#xklc").val(),"xkly":$("#xkly").val(),"bklx_id":$("#bklx_id").val(),"sfkkjyxdxnxq":$("#sfkkjyxdxnxq").val(),"kzkcgs":$("#kzkcgs").val(),
				"xqh_id":$("#xqh_id").val(),"jg_id":$("#jg_id_1").val(),"njdm_id_1":$("#njdm_id_1").val(),"zyh_id_1":$("#zyh_id_1").val(),"gnjkxdnj":$("#gnjkxdnj").val(),
				"zyh_id":$("#zyh_id").val(),"zyfx_id":$("#zyfx_id").val(),"njdm_id":$("#njdm_id").val(),"bh_id":$("#bh_id").val(),"bjgkczxbbjwcx":$("#bjgkczxbbjwcx").val(),
				"xbm":$("#xbm").val(),"xslbdm":$("#xslbdm").val(),"mzm":$("#mzm").val(),"xz":$("#xz").val(),"ccdm":$("#ccdm").val(),"xsbj":$("#xsbj").val(),"sfkknj":$("#sfkknj").val(),
				"sfkkzy":$("#sfkkzy").val(),"kzybkxy":$("#kzybkxy").val(),"sfznkx":$("#sfznkx").val(),"zdkxms":$("#zdkxms").val(),"sfkxq":$("#sfkxq").val(),
				/*"njdm_id_xs":$("#njdm_id_xs").val(),"zyh_id_xs":$("#zyh_id_xs").val(),*/"sfkcfx":$("#sfkcfx").val(),"kkbk":$("#kkbk").val(),
				"kkbkdj":$("#kkbkdj").val(),"bklbkcj":$("#bklbkcj").val(),"sfkgbcx":$("#sfkgbcx").val(),"sfrxtgkcxd":$("#sfrxtgkcxd").val(),
				"tykczgxdcs":$("#tykczgxdcs").val(),"xkxnm":$("#xkxnm").val(),"xkxqm":$("#xkxqm").val(),"kklxdm":$("#kklxdm").val(),"bbhzxjxb":$("#bbhzxjxb").val(),
				"xkkz_id":$("#xkkz_id").val(),"rlkz":$("#rlkz").val(),"xkzgbj":$("#xkzgbj").val(),"kspage":parseInt(jspage)+1,"jspage":parseInt(jspage)+parseInt(step)
			});
			if($("#jxbzbkg").val()=="1"){
				$.extend(requestMap,{"jxbzb":$("#jxbzb").val()});
			}
			if($("#jxbzhkg").val()=="1"){
				$.extend(requestMap,{"zh":$("#zh").val()});
			}
			var s_html = [];
			$.ajaxSetup({async:false});
			$.post(_path+"/xsxk/zzxkyzb_cxZzxkYzbPartDisplay.html",requestMap,function(rst){
				if(rst==0){
					$.alert("(JS-2)"+$.i18n.get("msg_jgfffw"));//警告：你正在非法访问！
					return false;
				}
				var data = rst.tmpList;
				var flg = rst.sfxsjc;
				if(data!=null && data.length>0){
					var rwlx = $("#rwlx").val();
					var l_kklxpx = $("#kklxpx").val();
					var l_kchid = "";
					var h_kchid = "";
					var l_jxbid = "";
					var tmp_kcrow = 0;
					var ks_kcrow = 0;
					var js_kcrow = 0;
					var kklxdm = $("#kklxdm").val();
					if(jspage=="0"){
						s_html.push("<div id='hintsdiv'></div>");
						s_html.push("<div class='tjxk_list' style='margin-top:-30px'>");
						var t_html = "";
						if("10"==$("#kklxdm").val() && "10758"==$("#xxdm").val()){
							t_html = "<a href='javascript:void(0);' style='font-size: 16px;' onclick='showTsxxkcxdqk()'>"+$.i18n.get("msg_ckkcxdjd")+"</a>";//查看课程修读进度
						}
						s_html.push("<h4 class='tjxk_title'>" + t_html + "</h4>");
					}
					for(var i=0; i<data.length; i++){
						if(i==0){
							ks_kcrow = data[0].kcrow;
						}
						if(i==data.length-1){
							js_kcrow = data[i].kcrow;
							$("#js_kcrow").val(js_kcrow);
						}
						var mdA = data[i];
						var mdB = null;
						if(i+1<=data.length){
							mdB = data[i+1];
						}
						if(l_kchid != mdA.kch_id){
							l_kchid = mdA.kch_id;
							s_html.push("<div class='panel panel-info'>");
							s_html.push("<div class='panel-heading kc_head' ");
							if(mdA.cxbj=="1"){
								s_html.push(" style='background-color:#fff7b2;' ");
							}
							s_html.push(" onclick='loadJxbxxZzxk(this)'>");
							s_html.push("<h3 class='panel-title'>");
							if($("#xxdm").val()=="12544"){
								s_html.push("<span style='margin-right:-40px;font-weight:bold'><"+mdA.xfjdmc+"></span>");
							}
							if(mdA.sftj=="1"){//是否推荐课
								s_html.push("<span style='margin-right:-40px'><font color='red'>【HOT】</font></span>");
							}
							if(mdA.cxbj=="1"){//重修
								s_html.push("<span style='margin-right:-40px'><font color='red'>【"+$.i18n.get("msg_cx")+"】</font></span>");
							}
							if(mdA.xxkbj=="1"){//有先行课
								s_html.push("<span style='margin-right:-40px'><font color='red'>【"+$.i18n.get("msg_yxxk")+"】</font></span>");
							}
							s_html.push("<span class='kcmc' id='kcmc_"+l_kchid+"'>");
							s_html.push("("+mdA.kch+")<a href='javascript:void(0);' onclick=showCourseInfo('"+mdA.kch_id+"')>"+mdA.kcmc+"</a>");
							s_html.push("<i class='l-kc-xf'> - <i id='xf_"+l_kchid+"'>"+mdA.xf+"</i> "+$.i18n.get("msg_xf")+"</i></span><span>"+$.i18n.get("msg_jxbgs")+"：<font class='jxbgsxx'>0</font></span><span id='zt_txt_"+mdA.kch_id+"'>"+$.i18n.get("msg_zt")+"："+$.i18n.get("txt-wx")+"</span>");
							if($("#xkxskclxkg").val()=='1'){
								s_html.push("<span>"+$.i18n.get("msg_kclx")+"："+(mdA.kclxmc?mdA.kclxmc:'')+"</span>");
							}
							if($("#zzxkgjcxkg_kcz").val()=="1" || $("#kczxskg").val()=="1"){
								var t_kzmc = $.i18n.get("msg_sskcz");
								if($("#xxdm").val()=="13294"){
									t_kzmc = $.i18n.get("msg_2015kcz");
								}
								s_html.push("<span id='kcz_txt_"+mdA.kch_id+"'>"+t_kzmc+":"+mdA.kzmc+"</span>");
							}
							s_html.push("</h3>");
							
							s_html.push("<input type='hidden' name='kch_id' value='"+mdA.kch_id+"'/>");
							s_html.push("<input type='hidden' name='kcxzzt' id='kcxzzt_"+mdA.kch_id+"' value='0'/>");
							s_html.push("<input type='hidden' name='cxbj' id='cxbj_"+mdA.kch_id+"' value='"+mdA.cxbj+"'/>");
							s_html.push("<input type='hidden' name='fxbj' id='fxbj_"+mdA.kch_id+"' value='"+mdA.fxbj+"'/>");
							s_html.push("<input type='hidden' name='xxkbj' id='xxkbj_"+mdA.kch_id+"' value='"+mdA.xxkbj+"'/>");
							s_html.push("<input type='hidden' name='czzt' value='0'/>");
							s_html.push("<a href='javascript:void(0);' class='expand_close expand1'>"+$.i18n.get("msg_zkgb")+"</a>");
							s_html.push("</div>");
						}
						
						if(l_jxbid != mdA.jxb_id){
							l_jxbid = mdA.jxb_id;
							if(mdA.kch_id!=h_kchid){
								h_kchid = mdA.kch_id;
								s_html.push("<div class='panel-body table-responsive'>");
								s_html.push("<table class='table table-hover'>");
								s_html.push("<thead>");
								s_html.push("<tr class='active'>");
								if($("#xkjxbxskcxf").val()=="1"){
									s_html.push("<th nowrap width='5%'>"+$.i18n.get("msg_kc_xf")+"</th>");//课程-学分
								}
								s_html.push("<th nowrap width='5%'>"+$.i18n.get("msg_jxbmc")+"</th>");//教学班
								s_html.push("<th nowrap width='7%'>"+$.i18n.get("msg_skjs")+"</th>");//上课教师
								s_html.push("<th nowrap width='1%'>"+$.i18n.get("msg_sksj")+"</th>");//上课时间
								if($("#sfxsjxdd").val()=="1"){
									s_html.push("<th nowrap>"+$.i18n.get("msg_jxdd")+"</th>");//教学地点
								}
								if($("#zzxkgjcxkg_kkxy").val()=="1"){
									s_html.push("<th width='7%'>"+$.i18n.jwglxt["kkxymc"]+"</th>");//开课学院
								}
								if($("#zzxkgjcxkg_xqu").val()=="1"){
									s_html.push("<th width='5%'>"+$.i18n.jwglxt["xxxq"]+"</th>");//校区
								}
								if($("#zzxkgjcxkg_yqu").val()=="1"){
									s_html.push("<th width='5%'>"+$.i18n.get("msg_yuanq")+"</th>");//园区
								}
								if($("#sfxsxkbz").val()=="1"){
									var xkbz_text = ($("#kklxdm").val()=="06" && $("#xxdm").val()=="10288") ? $.i18n.get("msg_fxmc") : $.i18n.get("msg_xkbz");
									s_html.push("<th width='7%'>"+xkbz_text+"</th>");//选课备注
								}
								if($("#sfxskssj").val()=="1"){ 
									s_html.push("<th width='7%'>"+$.i18n.get("msg_kssj")+"</th>");//考试时间
								}
								/*if($("#xxdm").val()=="10280"){
									s_html.push("<th width='7%'>"+$.i18n.get("msg_dyidd")+"</th>");//答疑地点
									s_html.push("<th width='7%'>"+$.i18n.get("msg_dyisj")+"</th>");//答疑时间
								}*/
								if($("#xkjxbxskcxf").val()=="0"&&($("#zzxkxsrwxfkg").val()=="1" || $("#xkxfqzfs").val()=="1")){ 
									s_html.push("<th width='4%'>"+$.i18n.get("msg_xf")+"</th>");//学分
								}
								if($("#xkxskcgskg").val()=="1"){
									var t_kcgsmc = $.i18n.get("msg_kcgs");
									if($("#xxdm").val()=="10486"){
										t_kcgsmc = $.i18n.get("msg_ssly");
									}else if($("#xxdm").val()=="13294"){
										t_kcgsmc = $.i18n.get("msg_2024kcgs");
									}
									s_html.push("<th nowrap>"+t_kcgsmc+"</th>");//课程归属
								}
								if($("#zzxkgjcxkg_kclb").val()=="1"){
									s_html.push("<th width='7%'>"+$.i18n.get("msg_kclb")+"</th>");//课程类别
								}
								if($("#zzxkgjcxkg_kcxz").val()=="1"){
									s_html.push("<th nowrap>"+$.i18n.get("msg_kcxz")+"</th>");//课程性质
								}
								if($("#lnzgxkxs").val()>0 || $("#bxqzgxkxs").val()>0){
									s_html.push("<th nowrap>"+$.i18n.get("msg_xs")+"</th>");//学时
								}
								if($("#zzxkgjcxkg_jxms").val()=="1"){
									s_html.push("<th>"+$.i18n.get("msg_jxms")+"</th>");//教学模式
								}
								if($("#xxdm").val()=="10248"){
									s_html.push("<th>"+$.i18n.get("msg_skyy")+"</th>");//授课语言
								}
								if($("#jxbzcxskg").val()=="1"){
									s_html.push("<th nowrap>"+$.i18n.get("msg_jxbzc")+"</th>");//教学班组成
								}
								if($("#xxdm").val()=="10005" && $("#kklxdm").val()=="03"){
									s_html.push("<th>"+$.i18n.get("msg_fxbj")+"</th>");//辅修标记
								}
								if($("#xxdm").val()=="10486"){//武汉大学
									s_html.push("<th><a title='"+$.i18n.get("msg_js_rl")+"'>"+$.i18n.get("msg_rl")+"</a>/<a title='"+$.i18n.get("msg_js_yl")+"'>"+$.i18n.get("msg_yl")+"</a>/<a title='"+$.i18n.get("msg_js_blyx")+"'>"+$.i18n.get("msg_blyx")+"</a></th>");//容量/余量/本轮已选$.i18n.get("msg_rlylyx")
								}else{
									s_html.push("<th>"+$.i18n.get("msg_yxrl")+"</th>");//已选/容量
								}
								if($("#txbsfrl").val()=="1" && $("#dsfrlxskg").val()=="1"){
									s_html.push("<th nowrap width='1%'>"+$.i18n.get("msg_dsfrl")+"</th>");//待释放容量
								}
								if($("#txbsfrl").val()=="1" && $("#xksjjfsjxskg").val()=="1"){
									s_html.push("<th nowrap width='1%'>"+$.i18n.get("msg_sjsfsj")+"</th>");//随机释放时间
								}
								if($("#xxdm").val()=="10651"){ 
									s_html.push("<th nowrap>"+$.i18n.get("msg_kcssfa")+"</th>");//课程实施方案
								}
								if($("#xksdxjckg").val()=="2"){
									s_html.push("<th width='7%'>"+$.i18n.get("msg_sfydjc")+"</th>");//是否预定教材
								}
								s_html.push("<th width='6%'>"+$.i18n.get("msg_cz")+"</th>");//操作
								s_html.push("</tr></thead><tbody>");
							}
							s_html.push("<tr class='body_tr' id='tr_"+mdA.jxb_id+"'>");
							s_html.push("<td style='display:none'><div class='jxb_id' id='main_"+mdA.jxb_id+"'>"+mdA.jxb_id+"</div></td>");
							s_html.push("<td style='display:none' class='do_jxb_id' id='do_"+mdA.jxb_id+"'></td>");
							s_html.push("<td class='kch_id' style='display:none'>"+mdA.kch_id+"</td>");
							/*s_html.push("<td class='rlsfsxbj' style='display:none'>"+mdA.rlsfsxbj+"</td>");*/
							s_html.push("<td class='jxbzls' style='display:none'>"+mdA.jxbzls+"</td>");
							s_html.push("<td class='jxbxf' style='display:none'>"+mdA.xf+"</td>");
							s_html.push("<td class='kklxdm' style='display:none'>"+mdA.kklxdm+"</td>");
							s_html.push("<td class='jxbzb' style='display:none'>"+mdA.jxbzb+"</td>");
							s_html.push("<td class='zcongbj' style='display:none'>"+mdA.zcongbj+"</td>");
							s_html.push("<td class='zhiyuan' style='display:none'>0</td>"); 
							s_html.push("<td class='xqh_id' style='display:none'></td>");
							s_html.push("<td class='jsxm' style='display:none'></td>");
							s_html.push("<td class='jszc' style='display:none'></td>");
							s_html.push("<td class='zjxbxx' style='display:none'></td>");

							if($("#xkjxbxskcxf").val()=="1"){
								if($("#xkxfqzfs").val()=="1"){
									s_html.push("<td  class='jxbmc' nowrap>"+mdA.kcmc+"-"+mdA.jxbxf+"学分</td>");
								}else{
									s_html.push("<td  class='jxbmc' nowrap>"+mdA.kcmc+"-"+mdA.xf+"学分</td>");
								}
							}
							if(flg=="1"){
								s_html.push("<td nowrap class='jxbmc'><a href='javascript:void(0);' class='clj showJc' onclick=showJcInfo('"+mdA.jxb_id+"') >"+mdA.jxbmc+"</a></td>");
							}else{
								s_html.push("<td  class='jxbmc' nowrap>"+mdA.jxbmc+"</td>");
							}
							s_html.push("<td class='jsxmzc' nowrap></td>");
							s_html.push("<td class='sksj' style='text-align:left' nowrap></td>");
							if($("#sfxsjxdd").val()=="1"){
								s_html.push("<td class='jxdd' nowrap></td>");
							}
							if($("#zzxkgjcxkg_kkxy").val()=="1"){
								s_html.push("<td class='kkxymc'></td>");//开课学院 
							}
							if($("#zzxkgjcxkg_xqu").val()=="1"){
								s_html.push("<td class='xqumc'></td>");//校区
							}
							if($("#zzxkgjcxkg_yqu").val()=="1"){
								s_html.push("<td class='yqumc'></td>");//园区
							}
							if($("#sfxsxkbz").val()=="1"){
								s_html.push("<td class='xkbz'></td>");
							}
							if($("#sfxskssj").val()=="1"){
								s_html.push("<td class='kssj'></td>");
							}
							/*if($("#xxdm").val()=="10280"){
								s_html.push("<td class='dyidd'></td>");
								s_html.push("<td class='dyisj'></td>");
							}*/
							if($("#zzxkxsrwxfkg").val()=="1" || $("#xkxfqzfs").val()=="1"){
								if($("#xkjxbxskcxf").val()=="1"){
									s_html.push("<td class='jxbxf_1' style='display:none'></td>");
								}else{
									s_html.push("<td class='jxbxf_1'></td>");
								}
							}
							if($("#xkxskcgskg").val()=="1"){
								s_html.push("<td class='kcgs'></td>");
							}
							if($("#zzxkgjcxkg_kclb").val()=="1"){
								s_html.push("<td class='kclb'></td>");
							}
							if($("#zzxkgjcxkg_kcxz").val()=="1"){
								s_html.push("<td class='kcxz'></td>");
							}
							if($("#lnzgxkxs").val()>0 || $("#bxqzgxkxs").val()>0){
								s_html.push("<td class='rwzxs'>"+(mdA.rwzxs?mdA.rwzxs:"--")+"</td>");
							}
							if($("#zzxkgjcxkg_jxms").val()=="1"){
								s_html.push("<td class='jxms'></td>");
							}
							if($("#xxdm").val()=="10248"){
								s_html.push("<td class='skfsmc'></td>");
							}
							if($("#jxbzcxskg").val()=="1"){
								s_html.push("<td class='jxbzc'></td>");
							}
							if($("#xxdm").val()=="10005" && $("#kklxdm").val()=="03"){
								s_html.push("<td class='fxbj'></td>");
							}
							s_html.push("<td class='full' style='display:none'>"+$.i18n.get("msg_ym")+"</td>");//已满
							if($("#xxdm").val()=="10486"){
								s_html.push("<td style='display:none' class='rsxx'>");
								if($("#zzxkxsxkrsmxkg").val()=="1"){
									s_html.push("【<a class='clj' onclick=ckjxbrsxx('" + mdA.kch_id + "','" + mdA.jxb_id + "')><font class='jxbrs'>"+mdA.yxzrs+"</font>/<font class='jxbrl'>0</font></a>】");
								}else{
									s_html.push("<font class='jxbrs'>"+mdA.yxzrs+"</font>/<font class='jxbrl'>0</font>");
								}
								s_html.push("</td>");
								s_html.push("<td class='wdrsxx'><font class='jxbzrl'>0</font>/<font class='blzyl'>"+mdA.blzyl+"</font>/<font class='blyxrs'>"+mdA.blyxrs+"</font></td>");
							}else{
								s_html.push("<td class='rsxx'>");
								if($("#zzxkxsxkrsmxkg").val()=="1"){
									s_html.push("【<a class='clj' onclick=ckjxbrsxx('" + mdA.kch_id + "','" + mdA.jxb_id + "')><font class='jxbrs'>"+mdA.yxzrs+"</font>/<font class='jxbrl'>0</font></a>】");
								}else{
									s_html.push("<font class='jxbrs'>"+mdA.yxzrs+"</font>/<font class='jxbrl'>0</font>");
								}
								s_html.push("</td>");
								s_html.push("<td style='display:none' class='wdrsxx'><font class='jxbzrl'>0</font>/<font class='blzyl'>"+mdA.blzyl+"</font>/<font class='blyxrs'>"+mdA.blyxrs+"</font></td>");
							}
							if($("#txbsfrl").val()=="1" && $("#dsfrlxskg").val()=="1"){
								s_html.push("<td class='dsfrl'></td>");//待释放容量
							}
							if($("#txbsfrl").val()=="1" && $("#xksjjfsjxskg").val()=="1"){
								s_html.push("<td class='sjsfsj'></td>");//随机释放时间
							}
							if($("#xxdm").val()=="10651"){ 
								if($.defined(mdA.fjlj) && mdA.fjlj!=""){
									s_html.push("<td>【<a class='clj' onclick=xzKcssfa('" + mdA.jxb_id + "')>"+$.i18n.jwglxt["wjxz"]+"</a>】</td>");//下载课程实施方案
								}else{
									s_html.push("<td><font color='#aaa'>【"+$.i18n.jwglxt["wjxz"]+"】</font></td>");//下载课程实施方案
								}
							}
							if($("#xksdxjckg").val()=="2"){
								//有教材
								if(mdA.sfydjc && mdA.sfydjc=='1'){
									s_html.push("<td class='jc'><button id='jc-"+mdA.jxb_id+"' disabled type='button' class='btn btn-primary btn-sm' onclick=orderBook('"+mdA.jxb_id+"','1')>"+$.i18n.get("msg_yd")+"</button></td>");
								}else {
									s_html.push("<td>" + $.i18n.get("msg_wjc") + "</td>");
								}
							}
							s_html.push("<td class='an'><button id='btn-xk-"+mdA.jxb_id+"' type='button' class='btn btn-primary btn-sm' onclick=chooseCourseZzxk('"+mdA.jxb_id+"','"+mdA.do_jxb_id+"','"+mdA.kch_id+"','"+mdA.jxbzls+"')>"+$.i18n.get("msg_xk")+"</button></td>");
							s_html.push("<input type='hidden' name='hidsfxz' value='0'/>");
							s_html.push("</tr>");
						}
						if(mdB==null || mdA.kch_id!=mdB.kch_id){
							s_html.push("</tbody></table></div></div>");
						}
					}
					
					if(jspage=="0"){
						s_html.push("<div class='clearfix' id='left_clearfix'></div>");
						s_html.push("</div>");
						$("#contentBox").html(s_html.join(""));
					}else{
						$("#left_clearfix").before($(s_html.join("")));
					}
					
					//将选课列表中的已选课程的选课状态改为“已选”
					$("input[name='right_sub_kchid']").each(function(index,item){
						$("#zt_txt_"+$(item).val()).html($.i18n.get("msg_zt")+"：<b>"+$.i18n.get("txt-yx")+"</b>");
						$("#kcxzzt_"+$(item).val()).val("1");
						$("#kcxzzt_"+$(item).val()).parent().attr("style","background-color:#C1FFC1;");
					});
					
					$(".panel-info").each(function(index,item){
						$(item).find(".jxbgsxx").text($(item).find(".table-responsive").find("table tbody tr").length);
					});
					/*****************绑定课程下教学班展开关闭事件（开始）*********************/
					/*$(".tjxk_list .panel-heading").unbind("click").click(function() {
						if($(this).children(".expand_close").attr("class").indexOf("expand1")>0){ 
							//打开一门课程的教学班列表的同时，关闭其他课程下的教学班列表 
							$(".tjxk_list .panel-heading .expand_close").each(function(index,item){
								if($(item).attr("class").indexOf("close1")>0){
									$(item).removeClass('close1').addClass('expand1');
									$(item).parent().parent().find(".panel-body").slideUp();
								}
							});
							$(this).children(".expand_close").removeClass('expand1').addClass('close1');
							$(this).next(".panel-body").slideDown();
						}
						else
						{
							$(this).children(".expand_close").removeClass('close1').addClass('expand1');
							$(this).next(".panel-body").slideUp();
						}
					});*/

					if(jspage=="0"){
						$(".kc_head").eq(0).click();//加载第一门课程的教学班
						$("#more").show(); //显示点击链接
					}
					$("#jspage").val(parseInt(jspage)+parseInt(step));
					if((parseInt(js_kcrow)-parseInt(ks_kcrow)+1)<step){
						$("#isEnd").val("true");
						$("#endsign").show();
						$("#more").hide();
					}
				}else{
					$("#more").hide(); //关闭查看更多链接
					$("#isEnd").val("true");
					if($(".kc_head").length>0){
						$("#endsign").show();
					}else{
						$("#endsign").hide();
						s_html.push("<div class='clearfix'></div>");
						s_html.push("<div class='panel panel-info'>");
						s_html.push("<div class='panel-heading'>&nbsp;</div>");
						s_html.push("<div class='panel-body'>");
						//无可选课程
						s_html.push("<div class='nodata'><span>"+$.i18n.get("msg_wkxkc")+"</span></div>");
						s_html.push("</div>");
						s_html.push("</div>");
						$("#contentBox").html(s_html.join(""));
					}
				}

				if($("#xkxfqzfs").val()!="1"){
					$(".l-kc-xf").show();
				}
			},'json');
			$.ajaxSetup({async:true});
		}
	}
}