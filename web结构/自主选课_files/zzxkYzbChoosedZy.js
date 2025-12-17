//# sourceURL=zzxkYzbChoosedZy.js 
var isWebApp = isPc();
var timer = null;
jQuery(function($){
	$.ajaxSetup({async:false});
	$.post(_path+"/xsxk/zzxkyzb_cxZzxkYzbChoosedDisplay.html",{
		"jg_id":jQuery("#jg_id_1").val(),"zyh_id":jQuery("#zyh_id").val(),"njdm_id":jQuery("#njdm_id").val(),
		"zyfx_id":$("#zyfx_id").val(),"bh_id":$("#bh_id").val(),"xz":$("#xz").val(),"ccdm":$("#ccdm").val(),"xqh_id":$("#xqh_id").val(),
		"xkxnm":jQuery("#xkxnm").val(),"xkxqm":jQuery("#xkxqm").val(),"xkly":jQuery("#xkly").val()
	},function(data){
		var currentZy = 0;
		if(data!=null && data.length>0){
			var s_html = [];
			var rightKklxpx = null;
			var rightKchId = null;
			var rightJxbId = null;
			var rightQz= null;
			var rightJxbmc = null;
			var rightSxbj = null;
			var t_jxbmc = null;
			var jxdd = null;
			var sksj = null;
			var kssj = null;
			var isktk = null;
			for(var i=0; i<data.length; i++){
				var modelA = data[i];
				var modelB = null;
				if(i<data.length-1){
					modelB = data[i+1];
				}
				if(modelA.jxbzb!=null){
					$("#jxbzb").val(modelA.jxbzb);
				}
				rightKklxpx = modelA.kklxpx;
				if(rightKchId!=modelA.t_kch_id){
					currentZy = 0;
					rightKchId = modelA.t_kch_id;
					s_html.push("<div id='right_"+rightKchId+"' class='outer_xkxx_list'>");
					s_html.push("<h6>");
					if(modelA.cxbj=="1"){//重修
						s_html.push("<font color='red'>【"+$.i18n.get("msg_cx")+"】</font>");
					}
					if(modelA.xxkbj=="1"){//有先行课
						s_html.push("<font color='red'>【"+$.i18n.get("msg_yxxk")+"】</font>");
					}
					if(modelA.jdlx!="1"){
						s_html.push("("+modelA.kch+")");
					}
					s_html.push(modelA.kcmc+" - <i id='r-xf-"+rightKchId+"'>"+modelA.xf+"</i> "+$.i18n.get("msg_xf"));
					/*if($("#zzxkxsrwxfkg").val()=="1"){
						s_html.push("(课程学分)");	
					}*/
					s_html.push("<span class='pull-right'></span></h6>");
					s_html.push("<table class='right_table_head'><thead>");
					if($("#xxdm").val()=="10280"){
						s_html.push("<td class='h_num' style='display:none'>");
					}else{
						s_html.push("<td class='h_num'>");
					}
					if(modelA.qz!=null && modelA.qz!=0){
						var qzmc="";
						if($("#xxdm").val()=="13422"){
							qzmc=$.i18n.get("msg_xkb");
						}else if($("#xxdm").val()=="12772"){
							qzmc=$.i18n.get("msg_jf");
						}else{
							qzmc=$.i18n.get("msg_qz");
						}
						s_html.push(qzmc);//权重
					}else{
						s_html.push($.i18n.get("msg_zy"));//志愿
					}
					s_html.push("</td>");
					s_html.push("<td class='arraw-px'>"+$.i18n.get("msg_px")+"</td>");//排序
					s_html.push("<td class='h_sxbj'>"+$.i18n.get("msg_xsf")+"</td>");//选上否
					s_html.push("<td class='h_jxb'>"+$.i18n.get("msg_jxbmc")+"</td>");//教学班
					s_html.push("<td class='h_teacher'>"+$.i18n.get("msg_jshzc")+"</td>");//教师/职称
					s_html.push("<td class='h_time'>"+$.i18n.get("msg_sksj")+"</td>");//上课时间
					if($("#sfxsjxdd").val()=="1"){
						s_html.push("<td class='h_addr'>"+$.i18n.get("msg_jxdd")+"</td>");//教学地点
					}
					if($("#sfxskssj").val()=="1"){
						s_html.push("<td class='h_jxb'>"+$.i18n.get("msg_kssj")+"</td>");//考试时间
					}
					s_html.push("<td  class='h_zixf'>"+$.i18n.get("msg_zxf")+"</td>");//自选否
					s_html.push("<td class='h_cz'>"+$.i18n.get("msg_cz")+"</td>");//操作
					s_html.push("</thead></table>");
					s_html.push("<ul id='right_ul_"+rightKchId+"' class='list-group' data-kklxdm='"+modelA.kklxdm+"'>");
					s_html.push("<input type='hidden' name='right_kchid' value='"+rightKchId+"'/>");
					s_html.push("<input type='hidden' id='right_xf_"+rightKchId+"' name='right_xf' value='"+modelA.xf+"'/>");
					s_html.push("<input type='hidden' name='right_jdlx' value='"+modelA.jdlx+"'/>");
					s_html.push("<input type='hidden' name='right_kklxpx' value='"+rightKklxpx+"'/>");
					s_html.push("<input type='hidden' name='right_ddkzbj' value='"+modelA.ddkzbj+"'/>");
					s_html.push("<input type='hidden' name='right_cxbj' value='"+modelA.cxbj+"'/>");
				}
				
				if(rightJxbId != modelA.jxb_id){
					currentZy = parseInt(currentZy)+1;
					rightJxbId = modelA.jxb_id;
					rightJxbmc = modelA.jxbmc;
					t_jxbmc = rightJxbmc.length>3 ? rightJxbmc.substring(0,3)+"…":rightJxbmc;
					var jsxmString = null;
					var jszcString = null;
					var jsxmzcString = null;
					var jsxmzcFull = null; 
					if($.defined(modelA.jsxx)){
						var jsxxArray = modelA.jsxx.split(";");
						for(var m=0; m<jsxxArray.length; m++){
							var tmpArray = jsxxArray[m].split("/");
							if(m==0){
								jsxmString = $.defined(tmpArray[1])?tmpArray[1]:"--";
								jszcString = $.defined(tmpArray[2])?tmpArray[2]:"--";
							}else{
								jsxmString = jsxmString + "、" +($.defined(tmpArray[1])?tmpArray[1]:"--");
								jszcString = jszcString + "、" +($.defined(tmpArray[2])?tmpArray[2]:"--");
							}
						}
					}else{
						jsxmString = "--";
						jszcString = "--";
					}

					if($("#xkjsxxxsfs").val()=="2"){
						jsxmzcFull = jsxmString;
						jsxmString = jsxmString.length>5 ? jsxmString.substring(0,5)+"…":jsxmString;
						jszcString = "";
						jsxmzcString = jsxmzcFull.length>5 ? jsxmzcFull.substring(0,5)+"…":jsxmzcFull;
					}else{
						jsxmzcFull = jsxmString + "(" + jszcString + ")";
						jsxmString = jsxmString.length>5 ? jsxmString.substring(0,5)+"…":jsxmString;
						jszcString = jszcString.length>5 ? jszcString.substring(0,5)+"…":jszcString;
						jsxmzcString = jsxmzcFull.length>5 ? jsxmzcFull.substring(0,5)+"…":jsxmzcFull;
					}
					jxdd = modelA.jxdd==null || modelA.jxdd=="" ? "--" : modelA.jxdd; 
					sksj = modelA.sksj==null || modelA.sksj=="" ? "--" : modelA.sksj;
					if($("#sfxskssj").val()=="1"){
						kssj = modelA.kssj==null || modelA.sksj=="" ? "--" : modelA.kssj;
					}

					var zcxkbj = "1";
					if(modelA.zckz=="1" && modelA.bdzcbj!="2" && modelA.bdzcbj!="3"){
						zcxkbj = "0";
					}
					var isktk = "0";
					var sfxkbj = modelA.sfxkbj;
					if($("#xxdm").val()=="10511"){
						sfxkbj = "1";
					}
					if((modelA.sfktk=="1" || modelA.zntgpk=="1") && parseInt(modelA.yxzrs)>parseInt(modelA.tktjrs) && modelA.isInxksj=="1" && sfxkbj=="1" && zcxkbj=="1"){
						isktk = "1";
					}
					s_html.push("<li id='right_"+rightJxbId+"' class='list-group-item'>");
					s_html.push("<div class='item' style='cursor: pointer;'>");
					s_html.push("<table width='100%'><tr>");
					if($("#xxdm").val()=="10280"){
						s_html.push("<td style='display:none'><p class='num'>");
					}else{
						s_html.push("<td><p class='num'>");
					}
					if(modelA.qz!=null && modelA.qz!=0){
						s_html.push("<a href='javascript:void(0)' class='qz-block' data-jxb_id='"+rightJxbId+"' data-do_jxb_id='"+modelA.do_jxb_id+"'>"+modelA.qz+"</a>");
					}else{
						s_html.push(currentZy);
					}
					s_html.push("</p></td>");
					s_html.push("<td class='arraw-px'><a class='fa fa-arrow-up padding-lr10' href='javascript:void(0);'></a><br><a class='fa fa-arrow-down padding-lr10' href='javascript:void(0);'></a></td>");
					s_html.push("<td><p class='sxbj'>");
					if(modelA.sxbj=="1"){
						s_html.push("<font color='blue'>"+$.i18n.get("msg_yxs")+"</font>");//已选上
					}else{
						s_html.push("<font color='red'><i>"+$.i18n.get("msg_dsx")+"</i></font>");//待筛选
					}
					s_html.push("</p></td>");
					if(parseInt(modelA.jxbzls)>1){
						s_html.push("<td><p class='jxb popover-demo' title='"+rightJxbmc+"'><span class='right_jxbmc'>"+t_jxbmc+"</span></p></td>");
					}else{
						s_html.push("<td><p class='jxb popover-demo' title='"+rightJxbmc+"'>"+t_jxbmc+"</p></td>");
					}
					
					s_html.push("<td><p class='teachers' title='"+jsxmzcFull+"'><span>"+jsxmString+"</span>"+jszcString+"</p></td>");
					s_html.push("<td><p class='time'>"+sksj+"</p></td>");
					if($("#sfxsjxdd").val()=="1"){
						s_html.push("<td><p class='addr'>"+jxdd+"</p></td>");
					}
					if($("#sfxskssj").val()=="1"){
						s_html.push("<td><p class='kssj'>"+kssj+"</p></td>");
					}
					s_html.push("<td nowrap><p class='zixf'>");
					if(modelA.zixf=="1"){
						s_html.push($.i18n.get("msg_zxs"));//自选上
					}else{
						s_html.push($.i18n.get("msg_xttz"));//系统调整
					}
					s_html.push("</p></td>");
					s_html.push("<td><p class='but'>");
					if(isktk=="1"){
						s_html.push("<button class='btn btn-danger btn-sm' onclick=cancelCourseZzxk('rightpage','"+modelA.jxb_id+"','"+modelA.do_jxb_id+"','"+modelA.kch_id+"','"+modelA.jxbzls+"','"+modelA.xkkz_id+"') type='button'>"+$.i18n.get("msg_tx")+"</button>");
					}else{
						s_html.push("<span style='font-size:15px;color:#428BCA;'><b>"+$.i18n.get("txt-yx")+"</b></span>");
					}
					s_html.push("</p></td>");
					s_html.push("</tr>");
					s_html.push("</table>");
					s_html.push("</div>");
					s_html.push("<input type='hidden' name='right_sub_kchid' value='"+modelA.kch_id+"'/>");
					s_html.push("<input type='hidden' name='right_jxb_id' value='"+rightJxbId+"'>");
					s_html.push("<input type='hidden' name='right_qz' value='"+modelA.qz+"'>");
					s_html.push("<input type='hidden' name='right_jxbxf' value='"+modelA.jxbxf+"'>");
					s_html.push("<input type='hidden' name='right_do_jxb_id' value='"+modelA.do_jxb_id+"'>");
					s_html.push("<input type='hidden' name='right_xkkz_id' value='"+modelA.xkkz_id+"'>");
					s_html.push("<input type='hidden' name='right_jxbzls' value='"+modelA.jxbzls+"'/>");
					s_html.push("<input type='hidden' name='right_kklxdm' value='"+modelA.kklxdm+"'/>");
					s_html.push("</li>");
				}
				
				if(modelB==null || modelB.t_kch_id!=modelA.t_kch_id){
					s_html.push("</ul></div>");
					$(".right_div").append(s_html.join(""));
					s_html = [];
				}
			}
			if($("#xxdm").val()=="10295"){
				var bkklxyxxf=0;
				var kklxdm=$("#kklxdm").val();
				$(".right_div .list-group").each(function(idx,itm){
					if($(itm).data("kklxdm")==kklxdm){
						bkklxyxxf = bkklxyxxf+$(itm).find("input[name='right_xf']").val()*1;
					}
				});
				$("#bxqbkkklxyxxf").text(bkklxyxxf);
			}
			
			if($("#zzxkxsrwxfkg").val()=="1"/* || $("#xkxfqzfs").val()=="1"*/){
				var yxxf_jxb=0;
				$(".outer_xkxx_list").each(function(idx,itm){
					var jxbxf = 0;
					var kch_id = $(itm).find("input[name='right_kchid']").val();
					$(itm).find("input[name='right_jxbxf']").each(function(i,t){
						if(i==0){
							jxbxf = $(t).val();
						}else if(jxbxf*1<($(t).val())*1){
							jxbxf = $(t).val();
						}
					});
					$("#r-xf-"+kch_id).text(jxbxf);
					if($(itm).find("input[name='right_ddkzbj']").val()=="0"){
						yxxf_jxb=yxxf_jxb*1+jxbxf*1;
					}
				});
				$("#yxxfs_jxb").text(yxxf_jxb);
			}
			
			if($("#xkxfqzfs").val()=="1"){
				$(".outer_xkxx_list").each(function(idx,itm){
					var jxbxf = 0;
					var kch_id = $(itm).find("input[name='right_kchid']").val();
					$(itm).find("input[name='right_jxbxf']").each(function(i,t){
						if(i==0){
							jxbxf = $(t).val();
						}else if(jxbxf*1<($(t).val())*1){
							jxbxf = $(t).val();
						}
					});
					$("#r-xf-"+kch_id).text(jxbxf);
				});
			}
			
			//识别终端确定是否显示排志愿的箭头
			if(isWebApp){
				$(".arraw-px").css("display","none");
			}else{
			    $(".arraw-px").css("display","");
			}
		}
	},'json');
	$.ajaxSetup({async:true});
	
	
	if($("#zzxkwylksqxkyxkg").val()=="1"){
		$("#xkyxArea").show();
		var XkyxGrid = $.extend(true,{},BaseJqGrid,{  
			resizeHandle:"#xkyxArea",
			pager:null,
			rowNum:1000,
			multiselect:false,//不显示复选框
			//autowidth: false,
			shrinkToFit: true,
		    //height:"300px",
		    postData:{xkxnm:$("#xkxnm").val(),xkxqm:$("#xkxqm").val()},
		    url: _path + '/xsxk/zzxkyzb_cxXkyixList.html', //这是Action的请求地址  
		    colModel:[
				{label:'key',name:'key',index:'key',key:true,hidden:true},
				{label:'xkxnm',name:'xkxnm',index:'xkxnm',hidden:true},
				{label:'xkxqm',name:'xkxqm',index:'xkxqm',hidden:true},
				{label:'kch_id',name:'kch_id',index:'kch_id',hidden:true},
				{label:$.i18n.jwglxt["kklx"],name:'kklxmc',index:'kklxmc',align:'center',width:'60px'},//'类型'
				{label:$.i18n.jwglxt["kcmc"],name:'kcmc',index:'kcmc',align:'center',width:'100px',},
				{label:$.i18n.jwglxt["xf"],name:'xf',index:'xf',align:'center',width:'40px',isnumber:true},//'学分'
				{label:$.i18n.jwglxt["sqtjsj"],name:'xksj',index:'xksj',align:'center',width:'140px'},
				{label:$.i18n.get("msg_cz"),name:'cz', width:'70px',index:'cz',align:'center',formatter:function(cellvalue, options, rowObject){//'操作'
					var html = [];
				 	html.push("<div class='an align-center'>");
				 	html.push("<button id='btn-tb-r-"+rowObject.jxb_id+"' class='btn btn-danger btn-sm' onclick=tuibao('"+rowObject.key+"','"+rowObject.xkxnm+"','"+rowObject.xkxqm+"','"+rowObject.kch_id+"','tuib') type='button'>"+$.i18n.get("msg_tb")+"</button>");//退课
				 	html.push("</div>");
					return html.join("");
		      	}}//'申请时间'
			],gridComplete: function() {
				
			},
			sortname: 'xksj', //首次加载要进行排序的字段 
		 	sortorder: 'asc'
		});
		
		$('#choosedXkyxGrid').loadJqGrid(XkyxGrid);
	}

	if($("#xkwkxkcqjtsqkg").val()=="1"){
		$("#jtbmArea").show();
		var jtbmGrid = $.extend(true,{},BaseJqGrid,{
			resizeHandle:"#jtbmArea",
			pager:null,
			rowNum:99999,
			multiselect:false,//不显示复选框
			shrinkToFit: true,
			postData:{xnm:$("#xkxnm").val(),xqm:$("#xkxqm").val(),jxxmlbdm:"1055"},
			url: _path + '/jxrwbmgl/jxrwxmbm_cxSingleJxrwxmbmList.html', //这是Action的请求地址
			colModel:[
				{label:'xsbmxq_id',name:'xsbmxq_id',index:'xsbmxq_id',hidden:true,key:true},
				{label:'kch_id',name:'kch_id',index:'kch_id',hidden:true},
				{label:'jxb_id',name:'jxb_id',index:'jxb_id',hidden:true},
				{label:$.i18n.get("msg_cz"),name:'cz', width:'80px',index:'cz',align:'center',sortable: false,formatter:function(cellvalue, options, rowObject){//'操作'
						var html = [];
						if (rowObject.shjg === '1' || rowObject.shjg === '4') {
							html.push("<div class='an align-center'>");
							html.push("<button class='btn btn-danger btn-sm' onclick=shanchu('"+rowObject.xsbmxq_id+"') type='button'>"+"退间听"+"</button>");
							html.push("</div>");
						}
						return html.join("");
					}},
				{
					label: "审核状态",
					width: 80,
					name: 'shjg',
					align: 'center',
					sortable: false,
					index: 'shjg',
					formatter: function (cellvalue, options, rowObject) {//审核状态
						switch (cellvalue) {
							case "0":
								return "保存";
							case "1":
								return "待审核";
							case "2":
								return "<span style='color:blue'>" + "审核中" + "</span>";
							case "3":
								return "<span style='color:green'>" + "已通过" + "</span>";
							case "4":
								return "被退回";
							case "5":
								return "<span style='color:red'>" + "终止" + "</span>";
							default :
								return "";
						}
					}
				},
				{
					label: "流程跟踪",
					name: 'lcgz',
					index: 'lcgz',
					width: 80,
					align: 'center',
					sortable: false,
					formatter: function (cellvalue, options, rowObject) {//流程跟踪
						return "<a class='clj' href='javascript:void(0);' onclick='ckWorkFlow(\"" + rowObject["xsbmxq_id"] + "\")'>" + "流程跟踪" + "</a>";
					}
				},
				{label:$.i18n.jwglxt["kcmc"],name:'kcmc',index:'kcmc',align:'center',width:'100px',formatter:function(cellvalue, options, rowObject){//'课程名称'
						return "<a href='javascript:void(0)' onclick=showCourseInfo('"+rowObject.kch_id+"')>["+cellvalue+"]</a>";
					}},
				{label:$.i18n.get("msg_jxbmc"),name:'jxbmc',index:'jxbmc',align:'center',width:'120px'},//'教学班名称'
				{label:"教师姓名",name:'jsxm',index:'jsxm',align:'center',width:'60px'},//'教师姓名'
				{label:$.i18n.get("msg_xf"),name:'xf',index:'xf',align:'center',width:'40px',isnumber:true},//'学分'
				{label:"报名时间",name:'bmsj',index:'bmsj',align:'center',width:'140px'}//'报名时间'
			],gridComplete: function() {

			},
			sortname: 'bmsj', //首次加载要进行排序的字段
			sortorder: 'asc'
		});

		$('#choosedJtbmGrid').loadJqGrid(jtbmGrid);
	}
	
	/***浮动框数据加载（开始）***/
	//浮动框中已选中课程数
	yxzkc = $("input[name='right_kchid']").length;
	$("#yxkcs").text(yxzkc);
	//小课表
	//$("#myCourseTableZzxk").load(_path+"/kbcx/xskbcx_cxXskbSimpleIndex.html");
	

	$(".outer_xkxx_list").each(function(index,item){
		if($(item).find("ul li").length>1){
			$(item).find(".pull-right").text($.i18n.get("msg_sbtdpzy"));//鼠标拖动排志愿
		}
	});
	
	//子课程标记的显示
	var jxb_ids = [];
	$(".list-group-item").each(function(index,item){
		var jxbzls = $(item).find("input[name='right_jxbzls']").val();
		if(parseInt(jxbzls)>1){
			jxb_ids.push($(item).find("input[name='right_jxb_id']").val());
		}
	});
	var tmp_html="";
	if(jxb_ids.length>0){
		getZjxbByIds(jxb_ids.join(","));
	}
	
	
	
	//浮动框的宽度及动作设定
	if($("#xxdm").val()=="10005"){
		if($(window).width() > 800){
			$(".outer").animate({width:"800px"},1000);
			$(".outer_left .btn-lg").addClass("glyphicon-arrow-right icon-arrow-right");
		}else{
			$(".outer").animate({width:$(window).width()},1000);
			$(".outer_left .btn-lg").addClass("glyphicon-arrow-right icon-arrow-right");
		}
	}else{
		$(".outer").animate({width:"40px"},1000);
	}
	
	$(".outer_left").unbind("click").click(function(event) {	
		//阻止继续冒泡
		event.stopPropagation();
		if($(".outer").css("width")	==	"40px"){
			if($(window).width() > 800){
				$(".outer").animate({width:"800px"},500);
				$(".outer_left .btn-lg").addClass("glyphicon-arrow-right icon-arrow-right");
			}else{
				$(".outer").animate({width:$(window).width()},500);
				$(".outer_left .btn-lg").addClass("glyphicon-arrow-right icon-arrow-right");
			}
		}else{
			$(".outer").animate({width:"40px"},500);
			$(".outer_left .btn-lg").removeClass("glyphicon-arrow-right icon-arrow-right");
			$(".popover").remove();		//关闭右侧的话关闭掉弹出的内容
		}
	});
	
	//点击三个小图标弹出
	$(".popover-demo").popover({selector: '[data-toggle="popover"]',container: "body",trigger: 'hover'});
	
	//点击页面其他地方右侧内容隐藏
	$(document).unbind("click").click(function (event) {
		try {
			if (!event || $(event.target).size() == 0) {
				return;
			}
			var drag = $(".outer"),
				dragel = $(".outer")[0],
				target = event.target;
			if (dragel !== target && !$.contains(dragel, target)) {
				$(".outer").animate({width:"40px"},500);
				$("#wrapper").mCustomScrollbar("update");
				$(".outer_left .glyphicon").removeClass("glyphicon-arrow-right");
			}
		} catch (e) {
		}
	});
	
	$(document).off("mousedown",'button.btn-tk').on("mousedown",'button.btn-tk',function(event){
		event.stopPropagation();
	}).off("click",'button.btn-tk').on("click",'button.btn-tk',function(event){
		event.stopPropagation();
	}).off("click",".fa-arrow-up").on("click",".fa-arrow-up",function(event){
		event.stopPropagation();
		var curLiObj = $(this).parent().parent().parent().parent().parent().parent();
		var preLiObj = curLiObj.prev();
		if($.founded(preLiObj.html()) && preLiObj.html()!=""){
			preLiObj.before(curLiObj.clone(true));
			curLiObj.remove();
			saveOrder();
			myDragsort();
		}
	}).off("click",".fa-arrow-down").on("click",".fa-arrow-down",function(event){
		event.stopPropagation();
		var curLiObj = $(this).parent().parent().parent().parent().parent().parent();
		var nextLiObj = curLiObj.next();
		if($.founded(nextLiObj.html()) && nextLiObj.html()!=""){
			nextLiObj.after(curLiObj.clone(true));
			curLiObj.remove();
			saveOrder();
			myDragsort();
		}
	}).off("click",".qz-block").on("click",".qz-block",function(event){
		var jxb_id = $(this).data("jxb_id");
		var do_jxb_id = $(this).data("do_jxb_id");
		var syqz = $("#qzz").val();
		var qz =  $(this).text();
		var zQz = 0;
		$("input[name='right_qz']").each(function(index,item){
			var t_jxb_id = $(this).parent().find("input[name='right_jxb_id']").val();
			if(jxb_id!=t_jxb_id){
				zQz = parseInt(zQz) + parseInt($(item).val());
			}
		});
		syqz = syqz*1 - zQz;
		$.post(_path+"/xsxk/zzxkyzb_xkJcXgqzqxZzxkYzb.html",{
			jxb_id:do_jxb_id,xnm:$("#xkxnm").val(),xqm:$("#xkxqm").val(),xkkz_id:$("#xkkz_id").val()
		},function(data){
			if(data=="2"){
				$.alert($.i18n.get("msg_bzxksjbkxgqz"));//不在选课时间内，不可修改权重！
				return false;
			}else if(data=="3"){
				$.alert($.i18n.get("msg_xysjxbbkxgqz"));//已选上的教学班不可修改权重！
				return false;
			}else if(data=="4"){
				$.alert($.i18n.get("msg_bsblxkjxbbkxgqz"));//不是本轮选的教学班不可修改权重！
				return false;
			}else if(data=="5"){
				$.alert("(JS-3)"+$.i18n.get("msg_jgfffw"));//警告：你正在非法访问！
				return false;
			}else if(data=="6"){
				$.alert("(JS-12)"+$.i18n.get("msg_fwcs"));//访问超时！您可以尝试刷新页面后，再访问！
				return false;
			}else if(data=="1"){
				var ckmc = "";
				if($("#xxdm").val()=="13422"){
					ckmc = $.i18n.get("msg_xkbfp");
				}else if($("#xxdm").val()=="12772"){
					ckmc = $.i18n.get("msg_jftz");
				}else{
					ckmc = $.i18n.get("msg_txqz");
				}
				jQuery.showDialog(_path +'/xsxk/zzxkyzb_xkZzxkYzbQztx.html?jxb_id='+do_jxb_id+'&syqz='+syqz+'&qz='+qz,ckmc,{
					width:"350px",
					modalName:"addModal",
					buttons:{
						success : {
							label : $.i18n.jwglxt["sure"],//确 定
							className : "btn-primary",
							callback : function() {
								if($("#ajaxForm").isValid()){
									var qz = jQuery("#qz").val();
									$.ajaxSetup({async:false});
									$.post(_path+"/xsxk/zzxkyzb_xkBcQzZzxkYzb.html",{
										jxb_id:do_jxb_id,qz:qz
									},function(data){
										if(data=="1"){
											$("#right_"+jxb_id).find(".qz-block").text(qz);
											$("#right_"+jxb_id).find("input[name='right_qz']").val(qz);
										}else if(data=="2"){
											$.error("(JS-4)"+$.i18n.get("msg_jgfffw"));//警告：您正在非法访问！
											return false;
										}else if(data=="3"){
											$.error("(JS-11)"+$.i18n.get("msg_fwcs"));//访问超时！您可以尝试刷新页面后，再访问！
											return false;
										}else if(data=="4"){
											$.error($.i18n.jwglxt["nopermission"]);//无操作权限！
											return false;
										}else{
											$.error($.i18n.get("msg_wzyclxgly"));//出现未知异常，请与管理员联系！
											return false;
										}
									},'json');
									$.ajaxSetup({async:true});
								}else{
									return false;
								}
							}
						},
						cancel : {
								label : $.i18n.get("msg_cancel"),//取 消
								className : "btn-default",
								callback : function() {}
							}
						}
				});
			}else{
				$.error($.i18n.get("msg_wzyclxgly"));//出现未知异常，请与管理员联系！
				return false;
			}
		},'json');
		
	});
	
	
	var times_1 = 0;
	var interval_1 = window.setInterval(function(){
		if(times_1 >= 10){
			window.clearInterval(interval_1);
		}
		if($.fn.dragsort){
			myDragsort();
			window.clearInterval(interval_1);
		}
		times_1 += 1;
	}, 1000);
	
	var times_2 = 0;
	var interval_2 = window.setInterval(function(){
		if(times_2 >= 10){
			window.clearInterval(interval_2);
		}
		if($.fn.mCustomScrollbar){
			//滚动条
			$(".outer_right_wrapper").mCustomScrollbar({
				axis:"yx",
				scrollbarPosition:"outside",
			});
			window.clearInterval(interval_2);
		}
		times_2 += 1;
	}, 1000);
	
	/*if($("#cxkctskg").val()=="1"){
		$.ajaxSetup({async:false});
		$.post(_path+"/xsxk/zzxkyzb_cxXscxkcCount.html",{},
			function(data){
				if(data>0){
					$.alert("你有课程成绩未及格，请注意参加重修！");
				}
			},'json');
		$.ajaxSetup({async:true});
	}*/
	$.post(_path+"/xsxk/zzxkyzb_cxXsXktsxx.html",{
		"xkxnm":$("#xkxnm").val(),
		"xkxqm":$("#xkxqm").val(),
		"kklxdm":$("#firstKklxdm").val(),
		"njdm_id":$("#njdm_id").val(),
		"zyh_id":$("#zyh_id").val(),
		"bh_id":$("#bh_id").val(),
		"zyfx_id":$("#zyfx_id").val()
	},function(data){
		if(data!="1"){
			var tmp = data.split("!split!");
			$.alert(tmp[1],function(){
				/*if($("#xxdm").val()=="10878"){
					$.post(_path+"/xsxk/zzxkyzb_cxZjXsXktsxxQr.html",{
						"xkxnm":$("#xkxnm").val(),"xkxqm":$("#xkxqm").val(),"tslx":tmp[0]
					},function(data){
						if(data=="0"){
							$.error("出现未知异常！");
						}
					},'json');
				}*/
			});
		}
	},'json');

	initCxtj($('#firstKklxdm').val());
	/*setTimeout("initCxtj($('#firstKklxdm').val())",1000);*/
});

function getZjxbByIds(jxb_ids){
	$.ajaxSetup({async:false});
	$.post(_path+"/xsxk/zzxkyzb_cxZkcZzxkYzb.html",{
		jxb_ids:jxb_ids,xkkz_id:$("#xkkz_id").val(),bklx_id:$("#bklx_id").val(),kklxdm:$("#kklxdm").val(),
		xklc:$("#xklc").val(),rlkz:$("#rlkz").val(),zyh_id:$("#zyh_id").val(),njdm_id:$("#njdm_id").val()
	},function(data){
			if(data!=null && data!="0"){
				var tmp_html = "";
				for(var i=0; i<data.length; i++){
					var current_fjxb_id = data[i].fjxb_id;
					var s_jsxm = null;
					var s_jszc = null;
				 	var jsxxArray = data[i].jsxx.split(";");
					for(var e=0; e<jsxxArray.length; e++){
						var tmpArray = jsxxArray[e].split("/");
						var jgh_id = tmpArray[0];
						var c_jsxm = tmpArray[1];
						var c_jszc = tmpArray[2];
						if(e==0){
							s_jsxm = c_jsxm;
							if($("#xkjsxxxsfs").val()=="2"){
								s_jszc = "";
							}else{
								s_jszc = c_jszc;
							}
						}else{
							s_jsxm = s_jsxm + "、" +c_jsxm;
							if($("#xkjsxxxsfs").val()=="2"){
								s_jszc = "";
							}else{
								s_jszc = s_jszc + "、" +c_jszc;
							}
						}
					}
					var next_fjxb_id = "";
					if(i<data.length-1){
						next_fjxb_id = data[i+1].fjxb_id;
					}

					if(data[i].xsdm=="02"){
						img = "ico_tjxk1";
					}else if(data[i].xsdm=="03"){
						img = "ico_tjxk2";
					}else if(data[i].xsdm=="04"){
						img = "ico_tjxk3";
					}else{
						img = "ico_tjxk1";
					}
					tmp_html = tmp_html + "<a href='javascript:void(0)' class='ico_tjxk "+img+"' title='";
					if($("#xkjsxxxsfs").val()=="2"){
						tmp_html = tmp_html + $.i18n.prop("msg_xskcls", [data[i].xsmc])+s_jsxm;
					}else{
						tmp_html = tmp_html + $.i18n.prop("msg_xskcls", [data[i].xsmc])+s_jsxm+"("+s_jszc+")";
					}
					tmp_html = tmp_html + "' data-container='body' data-toggle='popover' data-placement='auto' ";
					if($("#sfxsjxdd").val()=="1"){
						tmp_html = tmp_html + "data-content='"+$.i18n.get("msg_sksjdd")+"："+data[i].sksj+" / "+data[i].jxdd+"'";
					}else{
						tmp_html = tmp_html + "data-content='"+$.i18n.get("msg_sksj")+"："+data[i].sksj+"'";
					}
					tmp_html = tmp_html + "><input type='hidden' name='zkc_jxb_id' value='"+data[i].do_jxb_id+"'/></a>";
					
					if(current_fjxb_id!=next_fjxb_id){
						if($("#right_"+$.convertID(current_fjxb_id)).find(".right_jxbmc").length==0){
							var t_jxbmc = $("#right_"+$.convertID(current_fjxb_id)).find(".jxb").text();
							$("#right_"+$.convertID(current_fjxb_id)).find(".jxb").html("<span class='right_jxbmc'>"+t_jxbmc+"</span>"+tmp_html);
						}else{
							$("#right_"+$.convertID(current_fjxb_id)).find(".right_jxbmc").after(tmp_html);
						}
						tmp_html = "";
					}
				}
			}
		},'json');
	$.ajaxSetup({async:true});
}

function saveOrder() {
	var zypxs = [];
	var jxb_ids = [];
	$(".list-group").each(function(index,item){
		$(item).find("li").each(function(index1,item1){
			if((index1+1)!=parseInt($(item1).find(".num").text()) && $(item1).find("input[name='right_qz']").val()=="0"){
				zypxs.push(index1+1);
				jxb_ids.push($(item1).find("input[name='right_jxb_id']").val());
			}
		});
	});
	$.ajaxSetup({async:false});
	$.post(_path+"/xsxk/zzxkyzb_xkBcZypxZzxkYzb.html",
		{zypxs:zypxs.join(","),jxb_ids:jxb_ids.join(",")},
		function(data){
			setTimeout(function(){
				if(data=="success"){
					reSort();
				}else if(data=="no-permission"){
					$.alert($.i18n.jwglxt["nopermission"]);//无操作权限！
				}else{
					$.alert($.i18n.get("msg_pzysb"));//排志愿失败！
				}
			},1); 
		},'json');
	$.ajaxSetup({async:true});
}

function reSort(){
	$(".list-group").each(function(index,item){
		$(item).find("li").each(function(index1,item1){
			if((index1+1)!=parseInt($(item1).find(".num").text()) && $(item1).find("input[name='right_qz']").val()=="0"){
				$(item1).find(".num").text(index1+1);
			}
		});
	});
}

function chooseCourseZzxk(jxb_id,do_jxb_id,kch_id,jxbzls){
	$("#btn-xk-"+$.convertID(jxb_id)).attr("disabled","true");
	var trObj = $("#tr_"+$.convertID(jxb_id));
	var zdzys = $("#zdzys").val();
	var sfqzxk  = $("#sfqzxk").val();
	var xkzgmc = $("#xkzgmc").val();//其他选课规则设置中设置的最高选课门次
	var bxqzgxkmc = $("#bxqzgxkmc").val();//基本选课规则设置中设置的最高选课门次
	var xkzgxf = $("#xkzgxf").val();//其他选课规则设置中设置的最高选课学分
	var bxqzgxkxf = $("#bxqzgxkxf").val();//基本选课规则设置中设置的最高选课学分
	var lnzgxkxf = $("#lnzgxkxf").val();//基本选课规则设置中设置的历学期最高选课学分
	var lnzgxkmc = $("#lnzgxkmc").val();//基本选课规则设置中设置的历学期最高选课学分
	var lnzkcs = $("#lnzkcs").val();//历学期总课程数
	var lnzxfs = $("#lnzxfs").val();//历学期总学分数
	/*var zkcs = $("#zkcs").val();
	var zxfs = $("#zxfs").val();*/
	var tableObj = trObj.parent();
	var syqz = $("#qzz").val();
	var zQz = 0;
	var dqkcxf = 0;
	$("input[name='right_qz']").each(function(index,item){
		zQz = parseInt(zQz) + parseInt($(item).val());
	});
	syqz = syqz - zQz;
	//选中志愿数
	var xzzys=$("#right_ul_"+kch_id).find("li").size();
	
	if(sfqzxk!="1" && xzzys >= parseInt(zdzys)){
		$.alert($.i18n.prop("msg_ymkzdkxzys", [zdzys]));//"一门课程最多可选"+zdzys+"个志愿！"
		$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
		return false;
	}else if(sfqzxk=="1" && xzzys > 0){
		$.alert($.i18n.get("msg_ymkznxygjxb"));//"一门课程只能选一个教学班！"
		$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
		return false;
	}
	if(xzzys==0){
		/*zkcs = parseInt(zkcs)+1;
		zxfs = parseFloat(zxfs)+parseFloat($("#xf_"+kch_id).text());*/
		if($("#xkxfqzfs").val()=="1"){
			dqkcxf = trObj.find(".jxbxf").text();
		}else{
			dqkcxf = $("#xf_"+kch_id).text();
		}
		lnzkcs = parseInt(lnzkcs)+1;
		lnzxfs = parseFloat(lnzxfs)+parseFloat(dqkcxf);
	}
	if(parseFloat(bxqzgxkxf)>0 || parseFloat(bxqzgxkmc)>0){
		var kklxzxfs = 0;
		var kklxzkcs = 0;
		$("input[name='right_kklxpx']").each(function(index,item){
			if($(item).val()==$("#kklxpx").val()){
				var m_kch_id = $(item).parent().find("input[name='right_kchid']").val();
				var m_kcxf = $("#r-xf-"+m_kch_id).text();
				kklxzxfs = parseFloat(kklxzxfs) + parseFloat(m_kcxf);
				kklxzkcs++;
			}
		});
		var c_kklxzxfs = parseFloat(kklxzxfs)+parseFloat(dqkcxf);
		var c_kklxzkcs = parseInt(kklxzkcs) + 1;
		if(parseFloat(bxqzgxkxf)>0 && parseFloat(bxqzgxkxf)<parseFloat(c_kklxzxfs) && xzzys==0){
			//"本学期本类型课程选课最高学分要求为"+bxqzgxkxf+"，当前本学期本类型课程选课总学分为("+kklxzxfs+"+"+$("#xf_"+kch_id).text()+"="+c_kklxzxfs+")，超出选课最高学分要求，不可选！"
			$.alert($.i18n.prop("msg-ccbxqblxzgxkxfyq", [bxqzgxkxf,kklxzxfs,dqkcxf,c_kklxzxfs]));
			$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
			return false;
		}
		
		if(parseFloat(bxqzgxkmc)>0 && parseInt(c_kklxzkcs)>parseInt(bxqzgxkmc) && xzzys==0){
			//"本学期本类型课程选课最高门次要求为"+bxqzgxkmc+"，不可选！"
			$.alert($.i18n.prop("msg-ccbxqblxzgxkmcyq", [bxqzgxkmc]));
			$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
			return false;
		}
	}

	/*if(parseFloat(xkzgxf)>0 && parseFloat(zxfs)>parseFloat(xkzgxf) && xzzys==0){
		//本学期选课最高学分要求为"+xkzgxf+"，当前选课总学分为("+$("#zxfs").val()+"+"+$("#xf_"+kch_id).text()+"="+zxfs+")，超出选课最高学分要求，不可选！
		$.alert($.i18n.prop("msg-ccbxqzgxkxfyq", [xkzgxf,$("#zxfs").val(),$("#xf_"+kch_id).text(),zxfs]));
		return false;
	}*/
	
	/*if(parseFloat(xkzgmc)>0 && parseInt(zkcs)>parseInt(xkzgmc) && xzzys==0){
		//本学期选课最高门次要求为"+xkzgmc+"，不可选！
		$.alert($.i18n.prop("msg-ccbxqzgxkmcyq", [xkzgmc]));
		return false;
	}*/
	/*if(parseFloat(lnzgxkxf)>0 && parseFloat(lnzxfs)>parseFloat(lnzgxkxf) && xzzys==0){
		//历学期选课最高学分要求为"+lnzgxkxf+"，历学期选课总学分为("+$("#lnzxfs").val()+"+"+$("#xf_"+kch_id).text()+"="+lnzxfs+")，超出选课最高学分要求，不可选！
		$.alert($.i18n.prop("msg-cclxqzgxkxfyq", [lnzgxkxf,$("#lnzxfs").val(),$("#xf_"+kch_id).text(),lnzxfs]));
		return false;
	}*/
	
	/*if(parseInt(lnzgxkmc)>0 && parseInt(lnzkcs)>parseInt(lnzgxkmc) && xzzys==0){
		//历学期选课最高门次要求为"+lnzgxkmc+"，不可选！
		$.alert($.i18n.prop("msg-cclxqzgxkmcyq", [lnzgxkmc]));
		return false;
	}*/
	
	if(sfqzxk == "1" && parseFloat(syqz) <= 0){
		//"已无权重，不可再选！"
		$.alert($.i18n.get("msg_ywqzbkzx"));
		$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
		return false;
	}

	if ($("#xkwkxkcqjtsqkg").val()=="1" && $("#choosedJtbmGrid").getRows().length > 0) {
		var jtJxbArr = $("#choosedJtbmGrid").getRows().map(it => (it['shjg']!='已通过' && it['shjg']!='终止')?it['jxb_id']:"").toString().split(",");
		if (jtJxbArr.contains(jxb_id)) {
			$.alert("您已选间听申请，请查看右方选课信息栏中的间听报名列表，如需选课，请先退间听");
			$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
			return false;
		}
	}
	
	if($("#sfktk").val()!="1"){ //不可退课时，给出提示
		$.confirm($.i18n.get("msg-qdxzmk"),function(isBoolean){//选中之后将不可退，您确定要选这门课吗？
			if(isBoolean){
				$.closeModal("confirmModal");
				checkCourse_2(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,syqz);
			}else{
				$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
			}
		});
	}else{
		checkCourse_2(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,syqz);
	}
}


function checkCourse_2(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,syqz){
	//先行课未修仍继续选前的提示
	var xzzys=$("#right_ul_"+kch_id).find("li").size();
	var xxkbj=$("#xxkbj_"+kch_id).val();
	if($("#xxkbkztskg").val()=="1" && xxkbj=="1" && xzzys==0){
		$.ajaxSetup({async:false});
		$.post(_path+"/xsxk/zzxkyzb_cxXkTitleMsg.html",{
			jxb_ids:do_jxb_id,xkxnm:$("#xkxnm").val(),xkxqm:$("#xkxqm").val(),"bj":"2",
			/*"njdm_id_xs":$("#njdm_id_xs").val(),"zyh_id_xs":$("#zyh_id_xs").val(),	*/
			kch_id:kch_id,"njdm_id":$("#njdm_id").val(),"zyh_id":$("#zyh_id").val(),"kklxdm":$("#kklxdm").val()
		},function(data){
			if(data.flag=="1"){
				checkCourse_5(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,syqz);
			}else if(data.flag=="2"){	
				//需要提示后让学生选择是否继续选课的，都可以写在这里
				$.confirm(data.msg,function(isBoolean){
					if(isBoolean){
						$.closeModal("confirmModal");
						checkCourse_5(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,syqz);
					}else{
						$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
					}
				 });
			}else if(data.flag=="-2"){
				$.alert("(JS-15)"+$.i18n.get("msg_sxwycs"));//请刷新网页重试！
				return false;
			}else if(data.flag=="-1"){
				$.alert("(JS-5)"+$.i18n.get("msg_jgfffw"));//警告：你正在非法访问！
				return false;
			}else{	
				$.error($.i18n.get("msg_wzyclxgly"));//出现未知异常，请与管理员联系
				$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
				return false;
			}
		},'json');
		$.ajaxSetup({async:true});
	}else{
		checkCourse_5(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,syqz);
	}
}



function checkCourse_5(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,syqz){
	//选中志愿数
	var xzzys=$("#right_ul_"+kch_id).find("li").size();
	if($("#xxdm").val()=="12792" && $("#kklxdm").val()=="10" && xzzys==0){
		$.ajaxSetup({async:false});
		$.post(_path+"/xsxk/zzxkyzb_cxXkTitleMsg.html",{
			jxb_ids:do_jxb_id,xkxnm:$("#xkxnm").val(),xkxqm:$("#xkxqm").val(),"bj":"5",
			/*"njdm_id_xs":$("#njdm_id_xs").val(),"zyh_id_xs":$("#zyh_id_xs").val(),	*/
			kch_id:kch_id,"njdm_id":$("#njdm_id").val(),"zyh_id":$("#zyh_id").val(),"kklxdm":$("#kklxdm").val()
		},function(data){
			if(data.flag=="1"){
				checkCourse_7(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,syqz);
			}else if(data.flag=="2"){	
				//需要提示后让学生选择是否继续选课的，都可以写在这里
				$.confirm(data.msg,function(isBoolean){
					if(isBoolean){
						$.closeModal("confirmModal");
						checkCourse_7(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,syqz);
					}else{
						$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
					}
				 });
			}else if(data.flag=="-2"){
				$.alert("(JS-16)"+$.i18n.get("msg_sxwycs"));//请刷新网页重试！
				return false;
			}else if(data.flag=="-1"){
				$.alert("(JS-6)"+$.i18n.get("msg_jgfffw"));//警告：你正在非法访问！
				return false;
			}else{	
				$.error($.i18n.get("msg_wzyclxgly"));//出现未知异常，请与管理员联系
				$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
				return false;
			}
		},'json');
		$.ajaxSetup({async:true});
	}else{
		checkCourse_7(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,syqz);
	}
}

function checkCourse_7(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,syqz){
	//选中志愿数
	var xzzys=$("#right_ul_"+kch_id).find("li").size();
	if(xzzys==0){
		$.ajaxSetup({async:false});
		$.post(_path+"/xsxk/zzxkyzb_cxXkTitleMsg.html",{
			jxb_ids:do_jxb_id,xkxnm:$("#xkxnm").val(),xkxqm:$("#xkxqm").val(),"bj":"7",
			/*"njdm_id_xs":$("#njdm_id_xs").val(),"zyh_id_xs":$("#zyh_id_xs").val(),*/	
			kch_id:kch_id,"njdm_id":$("#njdm_id").val(),"zyh_id":$("#zyh_id").val(),"kklxdm":$("#kklxdm").val()
		},function(data){
			if(data.flag=="1"){
				checkCourse_9(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,syqz);
			}else if(data.flag=="2"){	
				//需要提示后让学生选择是否继续选课的，都可以写在这里
				$.confirm(data.msg,function(isBoolean){
					if(isBoolean){
						$.closeModal("confirmModal");
						checkCourse_9(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,syqz);
					}else{
						$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
					}
				 });
			}else if(data.flag=="3"){
				$.alert(data.msg);//不可选原因
				$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
				return false;	
			}else if(data.flag=="-2"){
				$.alert("(JS-17)"+$.i18n.get("msg_sxwycs"));//请刷新网页重试！
				return false;
			}else if(data.flag=="-1"){
				$.alert("(JS-7)"+$.i18n.get("msg_jgfffw"));//警告：你正在非法访问！
				return false;
			}else{	
				$.error($.i18n.get("msg_wzyclxgly"));//出现未知异常，请与管理员联系
				$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
				return false;
			}
		},'json');
		$.ajaxSetup({async:true});
	}else{
		checkCourse_9(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,syqz);
	}
}

function checkCourse_9(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,syqz){
	//选课排考时间冲突提示开关
	if($("#xkpksjctqrkg").val()=='1'){
		$.ajaxSetup({async:false});
		$.post(_path+"/xsxk/zzxkyzb_cxXkTitleMsg.html",{
			jxb_ids:do_jxb_id,xkxnm:$("#xkxnm").val(),xkxqm:$("#xkxqm").val(),"bj":"9",
			kch_id:kch_id,"njdm_id":$("#njdm_id").val(),"zyh_id":$("#zyh_id").val(),"kklxdm":$("#kklxdm").val()
		},function(data){
			if(data.flag=="1"){
				checkCourse_10(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,syqz);
			}else if(data.flag=="2"){
				//需要提示后让学生选择是否继续选课的，都可以写在这里
				$.confirm(data.msg,function(isBoolean){
					if(isBoolean){
						$.closeModal("confirmModal");
						checkCourse_10(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,syqz);
					}else{
						$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
					}
				});
			}else if(data.flag=="3"){
				$.alert(data.msg);//不可选原因
				$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
				return false;
			}else if(data.flag=="-1"){
				$.alert("(JS-7)"+$.i18n.get("msg_jgfffw"));//警告：你正在非法访问！
				return false;
			}else{
				$.error($.i18n.get("msg_wzyclxgly"));//出现未知异常，请与管理员联系
				$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
				return false;
			}
		},'json');
		$.ajaxSetup({async:true});
	}else{
		checkCourse_10(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,syqz);
	}
}

function checkCourse_10(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,syqz){
	var sfqzxk = $("#sfqzxk").val();
	if(jxbzls == 1 && sfqzxk != "1"){
		if($("#kxqxktskg").val()=="1" && $("#sfkxq").val()=="1" && $("#xqh_id").val()!=trObj.find(".xqh_id").text()){
			//您正在选跨校区的课程，确定要选吗？
			$.confirm($.i18n.get("msg_qdyxkxqkc"),function(isBoolean1){
				if(isBoolean1){
					$.closeModal("confirmModal");
					checkCourse_20(trObj,jxb_id,do_jxb_id,kch_id,jxbzls,'0');////检测冲突
				}else{
					$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
				}
			 });
		}else{
			checkCourse_20(trObj,jxb_id,do_jxb_id,kch_id,jxbzls,'0');////检测冲突
		}
	}else if(jxbzls == 1 && sfqzxk == "1"){
		if($("#kxqxktskg").val()=="1" && $("#sfkxq").val()=="1" && $("#xqh_id").val()!=trObj.find(".xqh_id").text()){
			//您正在选跨校区的课程，确定要选吗？
			$.confirm($.i18n.get("msg_qdyxkxqkc"),function(isBoolean){
				if(isBoolean){
					$.closeModal("confirmModal");
					checkCourse_15(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,syqz);//权重选课
				}else{
					$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
				}
			 });
		}else{
			checkCourse_15(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,syqz);//权重选课
		}
		return false;
	}else if(parseInt(jxbzls)>1){
		if($("#kxqxktskg").val()=="1" && $("#sfkxq").val()=="1" && $("#xqh_id").val()!=trObj.find(".xqh_id").text()){
			//您正在选跨校区的课程，确定要选吗？
			$.confirm($.i18n.get("msg_qdyxkxqkc"),function(isBoolean){
				if(isBoolean){
					$.closeModal("confirmModal");
					openDjxbWin(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,syqz);
				}else{
					$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
				}
			 });
		}else{
			openDjxbWin(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,syqz);
		}
        return false;
	}
}


function checkCourse_15(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,syqz){//权重选课
	var ckmc = "";
	if($("#xxdm").val()=="13422"){
		ckmc = $.i18n.get("msg_xkbfp");
	}else if($("#xxdm").val()=="12772"){
		ckmc = $.i18n.get("msg_jftz");
	}else{
		ckmc = $.i18n.get("msg_txqz");
	}
	 //权重选课且无子教学班
	jQuery.showDialog(_path +'/xsxk/zzxkyzb_xkZzxkYzbQztx.html?jxb_id='+do_jxb_id+'&jxbzls='+jxbzls+'&syqz='+syqz,ckmc,{
		width:"350px",
		modalName:"addModal",
		buttons:{
			success : {
				label : $.i18n.jwglxt["sure"],
				className : "btn-primary",
				callback : function() {
					if($("#ajaxForm").isValid()){
						var qz = jQuery("#qz").val();
						checkCourse_20(trObj,jxb_id,do_jxb_id,kch_id,jxbzls,qz);//检测冲突
					}else{
						return false;
					}
				}
			},
			cancel : {
					label : $.i18n.jwglxt["cancel"],
					className : "btn-default",
					callback : function() {
						$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
					}
				}
			}
	});
}

function checkCourse_20(trObj,jxb_id,do_jxb_id,kch_id,jxbzls,qz){//检测冲突
	if($("#sfyxsksjct").val()=="1"||$("#tbtkxqxktskg").val()=="1"||$("#xkwkxkcqjtsqkg").val()=="1"){
		$.ajaxSetup({async:false});
		$.post(_path+"/xsxk/zzxkyzb_cxCtKcZyZzxkYzb.html",{
			jxb_ids:do_jxb_id,xkxnm:$("#xkxnm").val(),xkxqm:$("#xkxqm").val(),kch_id:kch_id,"sfyxsksjct":$("#sfyxsksjct").val()
		},function(data){
			if(data.flag=="1"){
				checkCourse_22(trObj,jxb_id,do_jxb_id,kch_id,jxbzls,qz);
			}else if(data.flag=="2"){	
				//当前教学班与教学班？？上课时间冲突，确定要选吗？
				$.confirm($.i18n.prop("msg_yqtjxbct", [data.msg]),function(isBoolean){
					if(isBoolean){
						$.closeModal("confirmModal");
						checkCourse_22(trObj,jxb_id,do_jxb_id,kch_id,jxbzls,qz);
					}else{
						$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
					}
				 });
			}else if(data.flag=="3"){	
				//当前教学班与其他已选教学班存在同半天跨校区上课情况，确定要选吗？
				$.confirm($.i18n.prop("msg_tbtkxqts"),function(isBoolean){
					if(isBoolean){
						$.closeModal("confirmModal");
						checkCourse_22(trObj,jxb_id,do_jxb_id,kch_id,jxbzls,qz);
					}else{
						$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
					}
				 });
			}else if(data.flag=="4"){	
				//当前教学班与教学班？？上课时间冲突且与其他已选教学班存在同半天跨校区上课情况，确定要选吗？
				$.confirm($.i18n.prop("msg_jxbctqtbtkxq", [data.msg]),function(isBoolean){
					if(isBoolean){
						$.closeModal("confirmModal");
						checkCourse_22(trObj,jxb_id,do_jxb_id,kch_id,jxbzls,qz);
					}else{
						$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
					}
				 });
			}else if(data.flag=="5"){
				jtsq($("#xkxnm").val(),$("#xkxqm").val(),jxb_id,kch_id);
			}else{
				$.error($.i18n.get("msg_wzyclxgly"));//出现未知异常，请与管理员联系
				$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
				return false;
			}
		},'json');
		$.ajaxSetup({async:true});
	}else{
		checkCourse_22(trObj,jxb_id,do_jxb_id,kch_id,jxbzls,qz);
	}
}

function checkCourse_22(trObj,jxb_id,do_jxb_id,kch_id,jxbzls,qz){
	var jcxx_arr = [];
	if($("#xksdxjckg").val()=="1" && $("#xkydjc").val()=="1"){
		$.ajaxSetup({async: false});
		$.post(_path + "/xsxk/zzxkyzb_cxCheckJckg.html", {
			"jxb_id": jxb_id, "xkkz_id" : $("#xkkz_id").val()
		}, function (data) {
			if (data=='1') {
				$.showDialog(_path + "/xsxk/zzxkyzb_cxXsxzjcView.html", "选择教材",{
					width:"900px",
					modalName:"xzjcModal",
					data:{"jxb_id":jxb_id, "xkkz_id":$("#xkkz_id").val()},
					buttons: {
						success : {
							label : "确 定",
							className : "btn-primary",
							callback : function() {
								var len = $("#xsxxGrid").getDataIDs().length;
								$("#xxxx_ul li").each(function(index,item){
									var rwkcjcxxz_id = $(item).find(".rwkcjcxxz_id").text();
									jcxx_arr.push(rwkcjcxxz_id);
								});
								$.closeModal("xzjcModal");
								saveCourse(trObj,jxb_id,do_jxb_id,kch_id,jxbzls,qz,jcxx_arr);
							}
						},
						cancel : {
							label : $.i18n.jwglxt["cancel"],
							className : "btn-default",
							callback : function() {
								$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
							}
						}
					}
				});
			} else {
				saveCourse(trObj,jxb_id,do_jxb_id,kch_id,jxbzls,qz,jcxx_arr);
			}
		}, 'json');
		$.ajaxSetup({async: true});
	} else {
		saveCourse(trObj,jxb_id,do_jxb_id,kch_id,jxbzls,qz,jcxx_arr);
	}
}

function openDjxbWin(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,syqz){
	var zcongbj = trObj.find(".zcongbj").text();
	//$.showDialog(_path +'/xsxk/zzxkyzb_xkZyZzxkYzbZjxb.html?jxb_id='+jxb_id+'&do_jxb_id='+do_jxb_id+'&jxbzls='+jxbzls+'&rlkz='+$("#rlkz").val()+'&fxbj='+$("#fxbj_"+kch_id).val()+'&cxbj='+$("#cxbj_"+kch_id).val()+'&rlzlkz='+$("#rlzlkz").val()+'&cdrlkz='+$("#cdrlkz").val()+'&rwlx='+$("#rwlx").val()+'&zcongbj='+zcongbj+'&syqz='+syqz,$.i18n.get("msg_xzkc"),{
	$.showDialog(_path +'/xsxk/zzxkyzb_xkZyZzxkYzbZjxb.html',$.i18n.get("msg_xzkc"),{
		width:"850px",
		modalName:"addModal",
		data:{
			"jxb_id":jxb_id,"do_jxb_id":do_jxb_id,"jxbzls":jxbzls,"rwlx":$("#rwlx").val(),"zcongbj":zcongbj,"syqz":syqz,
			"rlkz":$("#rlkz").val(),"fxbj":$("#fxbj_"+kch_id).val(),"cxbj":$("#cxbj_"+kch_id).val(),"rlzlkz":$("#rlzlkz").val(),"cdrlkz":$("#cdrlkz").val()
		},
		buttons:{
			success : {
				label : $.i18n.jwglxt["sure"],
				className : "btn-primary",
				callback : function() {
					if($("#ajaxForm").isValid()){
						var jxb_arr = [];
						$("input[name='select_do_jxb']").each(function(index,item){//根据select_jxb隐藏域的值是否为空来判定各类教学班是否全部选定
							jxb_arr.push($(this).val());
						});
						checkCourse_25(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,jxb_arr.join(","));//检测父子教学班选课冲突
					}
					return false;
				}
			},
			cancel : {
				label : $.i18n.jwglxt["cancel"],
				className : "btn-default",
				callback : function() {
					$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
				}
			}
		}
	});
}

function checkCourse_25(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,jxb_arr){//检测父子教学班选课冲突
	if($("#sfyxsksjct").val()=="1"||$("#tbtkxqxktskg").val()=="1"||$("#xkwkxkcqjtsqkg").val()=="1"){
		$.ajaxSetup({async:false});
		$.post(_path+"/xsxk/zzxkyzb_cxCtKcZyZzxkYzb.html",{
			jxb_ids:jxb_arr,xkxnm:$("#xkxnm").val(),xkxqm:$("#xkxqm").val(),kch_id:kch_id,"sfyxsksjct":$("#sfyxsksjct").val()
		},function(data){
			if(data.flag=="1"){
				checkCourse_27(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,jxb_arr);
			}else if(data.flag=="2"){	
				//当前教学班与教学班？？上课时间冲突，确定要选吗？
				$.confirm($.i18n.prop("msg_yqtjxbct", [data.msg]),function(isBoolean){
					if(isBoolean){
						$.closeModal("confirmModal");
						checkCourse_27(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,jxb_arr);
					}else{
						$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
					}
				 });
			}else if(data.flag=="3"){	
				//当前教学班与其他已选教学班存在同半天跨校区上课情况，确定要选吗？
				$.confirm($.i18n.prop("msg_tbtkxqts"),function(isBoolean){
					if(isBoolean){
						$.closeModal("confirmModal");
						checkCourse_27(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,jxb_arr);
					}else{
						$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
					}
				 });
			}else if(data.flag=="4"){	
				//当前教学班与教学班？？上课时间冲突且与其他已选教学班存在同半天跨校区上课情况，确定要选吗？
				$.confirm($.i18n.prop("msg_jxbctqtbtkxq", [data.msg]),function(isBoolean){
					if(isBoolean){
						$.closeModal("confirmModal");
						checkCourse_27(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,jxb_arr);
					}else{
						$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
					}
				 });
			}else if(data.flag=="5"){
				jtsq($("#xkxnm").val(),$("#xkxqm").val(),jxb_id,kch_id);
			}else{
				$.error($.i18n.get("msg_wzyclxgly"));//出现未知异常，请与管理员联系
				return false;
			}
		},'json');
		$.ajaxSetup({async:true});
	}else{
		checkCourse_27(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,jxb_arr);
	}
}

function checkCourse_27(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,jxb_arr){
	var jcxx_arr = [];
	if($("#xksdxjckg").val()=="1"){
		$.ajaxSetup({async: false});
		$.post(_path + "/xsxk/zzxkyzb_cxCheckJckg.html", {
			"jxb_id": jxb_id, "xkkz_id" : $("#xkkz_id").val()
		}, function (data) {
			if (data=='1') {
				$.showDialog(_path + "/xsxk/zzxkyzb_cxXsxzjcView.html", "选择教材",{
					width:"900px",
					modalName:"xzjcModal",
					data:{"jxb_id":jxb_id, "xkkz_id":$("#xkkz_id").val()},
					buttons: {
						success : {
							label : "确 定",
							className : "btn-primary",
							callback : function() {
								var len = $("#xsxxGrid").getDataIDs().length;
								$("#xxxx_ul li").each(function(index,item){
									var rwkcjcxxz_id = $(item).find(".rwkcjcxxz_id").text();
									jcxx_arr.push(rwkcjcxxz_id);
								});
								$.closeModal("xzjcModal");
								saveDjxbCourseBc(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,jxb_arr,jcxx_arr);
							}
						},
						cancel : {
							label : $.i18n.jwglxt["cancel"],
							className : "btn-default",
							callback : function() {
								$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
							}
						}
					}
				});
			} else {
				saveDjxbCourseBc(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,jxb_arr,jcxx_arr);
			}
		}, 'json');
		$.ajaxSetup({async: true});
	} else {
		saveDjxbCourseBc(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,jxb_arr,jcxx_arr);
	}
}

function saveDjxbCourseBc(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,jxb_arr,jcxx_arr){
	var tmp_html = "<ul>";
	$("input[name='current_xsdm']").each(function(index,item){
		var current_xsdm = $(item).val();
		var xsmc = $("#xsmc_"+current_xsdm).val();
		var jxb_id = $("#select_jxb_"+current_xsdm).val();
		var do_jxb_id = $("#select_do_jxb_"+current_xsdm).val();
		var subTrObj = $("#sub_tr_"+$.convertID(jxb_id));
		var jsxm = "";
		var jszc = "";
		jsxm = subTrObj.find(".jsxm").text();
		if($("#xkjsxxxsfs").val()=="2"){
			jszc = "";
		}else{
			jszc = subTrObj.find(".jszc").text();
		}
		var sksj = subTrObj.find(".sksj").text();
		var jxdd = subTrObj.find(".jxdd").text();
		tmp_html = tmp_html +				
						"<li>"+
						"<span class='jxb_id_1'>"+jxb_id+"</span>"+
						"<span class='do_jxb_id_1'>"+do_jxb_id+"</span>"+
						"<span class='xsdm_1'>"+current_xsdm+"</span>"+
						"<span class='xsmc_1'>"+xsmc+"</span>";
		tmp_html = tmp_html + 
						"<span class='jsxm_1'>"+jsxm+"</span>"+
						"<span class='jszc_1'>"+jszc+"</span>";
		tmp_html = tmp_html + "<span class='sksj_1'>"+sksj+"</span>";
		if($("#sfxsjxdd").val()=="1"){
			tmp_html = tmp_html + "<span class='jxdd_1'>"+jxdd+"</span>";
		}
		tmp_html = tmp_html + "</li>";
	});
	tmp_html = tmp_html + "</ul>";

	var rlkz = $("#rlkz").val();
	var cdrlkz = $("#cdrlkz").val();
	var rlzlkz = $("#rlzlkz").val();
	var sxrlkzlx = $("#sxrlkzlx").val();
	var rwlx = $("#rwlx").val();
	var xxkbj = $("#xxkbj_"+kch_id).val();
	var qz = $("#qz").val();
	var sxbj = "0";
	if(rlkz=="1" || cdrlkz=="1" || rlzlkz=="1"){
		sxbj = "1";
	}else{
		sxbj = "0";
	}
	$.ajaxSetup({async:false});
	$.post(_path+"/xsxk/zzxkyzbjk_xkBcZyZzxkYzb.html",{
		kcmc:$("#kcmc_"+kch_id).text(),kch_id:kch_id,jxb_ids:jxb_arr,rwlx:rwlx,
		rlkz:rlkz,cdrlkz:cdrlkz,rlzlkz:rlzlkz,sxbj:sxbj,xxkbj:xxkbj,cxbj:$("#cxbj_"+kch_id).val(),
		xkkz_id:$("#xkkz_id").val(),kklxdm:$("#kklxdm").val(),/*"njdm_id_xs":$("#njdm_id_xs").val(),"zyh_id_xs":$("#zyh_id_xs").val(),*/	
		njdm_id:$("#njdm_id").val(),zyh_id:$("#zyh_id").val(),xklc:$("#xklc").val(),xkxnm:$("#xkxnm").val(),
		xkxqm:$("#xkxqm").val(),qz:$("#qz").val(),"jcxx_id":jcxx_arr.join(',')
	},function(data){
		setTimeout(function(){
			if(data!=null){
				var flag = data.flag;
				if(flag=="1" || flag=="3"){
					$("#xkczbj").val("1");//减少课表的刷新频率
					var jxbrs = trObj.find(".rsxx .jxbrs").text();//教学班人数信息
					var blyxrs = trObj.find(".wdrsxx").find(".blyxrs").text();//本轮已选人数
					var jxbrl = trObj.find(".rsxx .jxbrl").text();//教学班人数信息
					trObj.find(".jxbrs").text(parseInt(jxbrs)+1);//已选中人数+1
					trObj.find(".wdrsxx").text(parseInt(blyxrs)+1);//已选中人数+1
					setRlxxAddZzxk(trObj,parseInt(jxbrs)+1,jxbrl);//检测是否为已满状态
					$("#tr_"+$.convertID(jxb_id)).find(".zjxbxx").html(tmp_html);
					refreshDataAddZzxk(trObj,jxb_id,do_jxb_id,kch_id,jxbzls,sxbj,qz);
					$.closeModal("addModal");
					if (flag=="3") {
						$.success($.i18n.get("msg_mfxfydsx"));//选课成功，免费学分已达上限！
					}
					if($("#zzxkwylksqxkyxkg").val()=="1"){
						var key = $("#xkxnm").val()+$("#xkxqm").val()+$("#xh_id").val()+kch_id;
						if($("#choosedXkyxGrid").find("#"+key).length>0){
							tuibao(key,$("#xkxnm").val(),$("#xkxqm").val(),kch_id,"xktb");
						}
					}
				}else if(flag=="6"){
					//该教学班已选中，刷新页面可见！
					$.alert($.i18n.get("msg_jxbyxzsxymkj"));
					$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
					return false;
				}else if(data.flag=="-1"){//容量超出，重新修改页面上的选课人数信息
					$("#xkczbj").val("1");//减少课表的刷新频率
					var jxbrl = trObj.find(".rsxx .jxbrl").text();//教学班人数信息
					var m_fzjxb = data.msg.split(",")[0];
					var m_jxb_id = data.msg.split(",")[1];
					var m_yxzrs = data.msg.split(",")[2];
					var m_blyxrs = data.msg.split(",")[3];
					var subTrObj;
					if(m_fzjxb=="0"){
						subTrObj = trObj;
					}else{
						subTrObj = $("#sub_tr_"+$.convertID(m_jxb_id));
					}
					subTrObj.find(".rsxx .jxbrs").text(m_yxzrs);
					subTrObj.find(".wdrsxx .blyxrs").text(m_blyxrs);
					setRlxxAddZzxk(trObj,m_yxzrs,jxbrl);//检测是否为已满状态
					//该教学班已无余量，不可选！;
					$.alert($.i18n.get("msg_ywylbkx"));
					$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");

					if($("#zzxkwylksqxkyxkg").val()=="1"){
						shengqing(kch_id,jxb_id);
					}else{
						//该教学班已无余量，不可选！
						$.alert($.i18n.get("msg_ywylbkx"));
					}
					
					return false;
				}else{
					$("#xkczbj").val("1");//减少课表的刷新频率
					if(data.msg!=null && data.msg!=""){
						$.alert(data.msg);
						//$.alert($.i18n.get(data.msg)=="0"?$.i18n.get("msg_xksb"):$.i18n.get(data.msg));
					}
					$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
					return false;
				}
			}
			$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
		},1); 
	},'json');
	$.ajaxSetup({async:true});
}

function saveCourse(trObj,jxb_id,do_jxb_id,kch_id,jxbzls,qz,jcxx_arr){
	var kcmc = $("#kcmc_"+kch_id).text();
	var rlkz = $("#rlkz").val();
	var cdrlkz = $("#cdrlkz").val();
	var rlzlkz = $("#rlzlkz").val();
	var sxrlkzlx = $("#sxrlkzlx").val();
	var rwlx = $("#rwlx").val();
	var xxkbj = $("#xxkbj_"+kch_id).val();
	var sxbj = "0";
	if(rlkz=="1" || cdrlkz=="1" || rlzlkz=="1"){
		sxbj = "1";
	}else{
		sxbj = "0";
	}
	$.ajaxSetup({async:false});
	$.post(_path+"/xsxk/zzxkyzbjk_xkBcZyZzxkYzb.html",{
		jxb_ids:do_jxb_id,kch_id:kch_id,kcmc:kcmc,rwlx:rwlx,rlkz:rlkz,cdrlkz:cdrlkz,rlzlkz:rlzlkz,sxbj:sxbj,xxkbj:xxkbj,qz:qz,
		cxbj:$("#cxbj_"+kch_id).val(),xkkz_id:$("#xkkz_id").val(),njdm_id:$("#njdm_id").val(),zyh_id:$("#zyh_id").val(),
		/*"njdm_id_xs":$("#njdm_id_xs").val(),"zyh_id_xs":$("#zyh_id_xs").val(),	*/
		kklxdm:$("#kklxdm").val(),xklc:$("#xklc").val(),xkxnm:$("#xkxnm").val(),xkxqm:$("#xkxqm").val(),"jcxx_id":jcxx_arr.join(',')
	},function(data){
		setTimeout(function(){
			if(data!=null){
				var flag = data.flag;
				if(flag=="1" || flag=="6" || flag=="3"){
					$("#xkczbj").val("1");//减少课表的刷新频率
					var rsxx = trObj.find(".rsxx .jxbrs").text();//教学班人数信息
					var blyxrs = trObj.find(".wdrsxx").find(".blyxrs").text();//本轮已选人数
					var jxbrl = trObj.find(".rsxx .jxbrl").text();//教学班人数信息
					trObj.find(".rsxx .jxbrs").text(parseInt(rsxx)+1);//将余量+1
					trObj.find(".wdrsxx .blyxrs").text(parseInt(blyxrs)+1);//将余量+1
					setRlxxAddZzxk(trObj,parseInt(rsxx)+1,jxbrl);//检测是否为已满状态
					refreshDataAddZzxk(trObj,jxb_id,do_jxb_id,kch_id,jxbzls,sxbj,qz);
					if (flag=="3") {
						$.success($.i18n.get("msg_mfxfydsx"));//选课成功，免费学分已达上限！
					}
					if($("#zzxkwylksqxkyxkg").val()=="1"){
						var key = $("#xkxnm").val()+$("#xkxqm").val()+$("#xh_id").val()+kch_id;
						if($("#choosedXkyxGrid").find("#"+key).length>0){
							tuibao(key,$("#xkxnm").val(),$("#xkxqm").val(),kch_id,"xktb");
						}
					}
				}else if(data.flag=="-1"){//容量超出，重新修改页面上的选课人数信息
					var jxbrl = trObj.find(".rsxx .jxbrl").text();//教学班人数信息
					var m_yxzrs = data.msg.split(",")[2];
					var m_blyxrs = data.msg.split(",")[3];
					trObj.find(".rsxx .jxbrs").text(m_yxzrs);
					trObj.find(".wdrsxx .blyxrs").text(m_blyxrs);
					/*trObj.find(".rlsfsxbj").text("1");*/
					setRlxxAddZzxk(trObj,m_yxzrs,jxbrl);//检测是否为已满状态
					if($("#zzxkwylksqxkyxkg").val()=="1"){
						shengqing(kch_id,jxb_id);
					}else{
						//该教学班已无余量，不可选！
						$.alert($.i18n.get("msg_ywylbkx"));
					}
					$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
					return false;
				}else if(data.flag=="2"){//上课时间冲突且可查看冲突
					var msg = data.msg;
					$.showDialog(_path+'/xkgl/common_cxSbTitle.html',$.i18n.get("msg_sbts"),$.extend(true,{},viewConfig,{//'失败提示'
						width: "300px",
						modalName:"sbtsModal",
						data:{"msg":msg/*,"xkxnm":$("#xkxnm").val(),"xkxqm":$("#xkxqm").val(),"jxb_ids":jxb_arr*/},
						buttons:{
							cancel : {
								label : $.i18n.jwglxt["ck"],
								className : "btn-default",
								callback : function() {
									$.showDialog(_path+'/xkgl/common_cxCtjxbListPage.html',$.i18n.get("msg_ctjxb"),$.extend(true,{},viewConfig,{//'冲突教学班'
										width: "800px",
										data:{"xnm":$("#xkxnm").val(),"xqm":$("#xkxqm").val(),"kch_id":kch_id,"jxb_ids":do_jxb_id}
									}));
									return false;
								}
							},
							success : {
								label : $.i18n.jwglxt["sure"],
								className : "btn-primary",
								callback : function() {
									$.closeModal("sbtsModal");
									return false;
								}
							}
						}
					}));
				}else{//检测不通过且未成功选课时，需要将页面显示的占位信息去掉
					if(data.msg!=null && data.msg!=""){
						$.alert(data.msg);
					}
					$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
					return false;
				}
			}
			$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
		},1); 
	},'json');
	$.ajaxSetup({async:true});
}

function refreshDataAddZzxk(trObj,jxb_id,do_jxb_id,kch_id,jxbzls,sxbj,qz){
	var zdzys = $("#zdzys").val();
	var sfktk = $("#sfktk").val();
	var tktjrs = $("#tktjrs").val();
	var rlkz = $("#rlkz").val();
	var cdrlkz = $("#cdrlkz").val();
	var rlzlkz = $("#rlzlkz").val();
	var xkkz_id = $("#xkkz_id").val();
	var yxkcs = $("#yxkcs").text();//已选课程数
	var yxxfs = 0;
	if($("#yxxfs").length>0){
		yxxfs = $("#yxxfs").text();//已选学分数
	}
	var yxxfs_jxb = 0;
	if($("#zzxkxsrwxfkg").val()=="1" || $("#xkxfqzfs").val()=="1"){
		yxxfs_jxb=$("#yxxfs_jxb").text();//已选学分数按教学班统计
	}
	//var tykpzykg = $("#tykpzykg").val();//体育课多志愿开关
	var jdlx = $("#jdlx").val();//体育课多志愿开关
	var jxbrs = trObj.find(".jxbrs").text();//已选中人数
	var kcxzzt = $("#kcxzzt_"+kch_id).val(); //课程选中状态
	var cxbj = $("#cxbj_"+kch_id).val();
	var jxbxf = trObj.find(".jxbxf").text();
	var jxbzb = trObj.find(".jxbzb").text();
	var kklxdm = trObj.find(".kklxdm").text();
	var kcmc = $("#kcmc_"+kch_id).text();
	var kcxx = kcmc.split("-");
	var kcxf = kcxx[kcxx.length-1].replace("学分","");
	var t_kch_id = kch_id;
	var ddkzbj = "0";
	//$("#xkczbj").val("1");
	trObj.find("input[name='hidsfxz']").val("1");//将教学班对应的是否选中状态置为1
	if(sfktk=="1" && parseInt(tktjrs)<parseInt(jxbrs)){
		trObj.find(".an").html("<button type='button' class='btn btn-danger btn-sm' onclick=cancelCourseZzxk('leftpage','"+jxb_id+"','"+do_jxb_id+"','"+kch_id+"','"+jxbzls+"','"+xkkz_id+"')>"+$.i18n.get("msg_tx")+"</button>");//退选
	}else{
		trObj.find(".an").html("<span style='font-size:15px;color:#428BCA;'><b>"+$.i18n.get("txt-yx")+"</b></span>");//已选
	}
	//更新教材预定状态
	if($("#xksdxjckg").val()=="2" && sfktk=="1"){
		if($("#xkydjc").val()=="1"){
			trObj.find(".jc").html("<button id='jc-"+jxb_id+"' type='button' class='btn btn-danger btn-sm' onclick=orderBook('"+jxb_id+"','0')>"+$.i18n.get("msg_td")+"</button>");
		}else{
			trObj.find(".jc").html("<button id='jc-"+jxb_id+"' type='button' class='btn btn-primary btn-sm' onclick=orderBook('"+jxb_id+"','1')>"+$.i18n.get("msg_yd")+"</button>");
		}
	}
	//if(tykpzykg=="1" && kklxdm=="05" && cxbj=="0"){
	if(jdlx=="1" && cxbj=="0"){
		if($("#xkxfqzfs").val()=="1"){
			kcmc = $("#kklxmc").val()+"- <i id='r-xf-"+t_kch_id+"'>"+jxbxf+"</i> 学分";//体育课
		}else{
			kcmc = $("#kklxmc").val()+"- <i id='r-xf-"+t_kch_id+"'>"+kcxf+"</i> 学分";//体育课
		}
		t_kch_id = "kklx_"+kklxdm;
	}else{
		if($("#xkxfqzfs").val()=="1"){
			kcmc = kcxx[0]+"- <i id='r-xf-"+t_kch_id+"'>"+jxbxf+"</i> 学分";
		}else{
			kcmc = kcxx[0]+"- <i id='r-xf-"+t_kch_id+"'>"+kcxf+"</i> 学分";
		}
	}
	if($("#ddkzbj").val()=="1" || (cxbj=="1" && $("#cxddkzbj").val()=="1")){//单独控制时，该学分不计入已选学分
		ddkzbj = "1";
	}
	var len = $("#right_ul_"+t_kch_id).find("li").length;
	var add_html = [];
	var zypx = 0;
	if(len==0){
		var zkcs= $("#zkcs").val();
		var zxfs= $("#zxfs").val();
		var lnzkcs= $("#lnzkcs").val();
		var lnzxfs= $("#lnzxfs").val();
		var dqxf = $("#xf_"+kch_id).text(); 
		$("#zkcs").val(parseInt(zkcs)+1);
		$("#lnzkcs").val(parseInt(lnzkcs)+1);
		$("#lnzxfs").val(parseFloat(lnzxfs)+parseFloat(dqxf));
		if($("#xxdm").val()=="10295"){
			var bxqbkklxyxxf=$("#bxqbkkklxyxxf").text();
			$("#bxqbkkklxyxxf").text(parseFloat(bxqbkklxyxxf)+parseFloat(dqxf));
		}
		
		var xxkbj = $("#xxkbj_"+kch_id).val();
		if(xxkbj=="1"){
			kcmc = "<font color='red'>【"+$.i18n.get("msg_yxxk")+"】</font>"+kcmc;
		}
		if(cxbj=="1"){
			kcmc = "<font color='red'>【"+$.i18n.get("msg_cx")+"】</font>"+kcmc;
		}
		if(ddkzbj=="0"){//单独控制时，该学分不计入已选学分
			$("#zxfs").val(parseFloat(zxfs)+parseFloat(dqxf));
		}
		add_html.push("<div class='outer_xkxx_list' id='right_"+t_kch_id+"'><h6>" + kcmc);
		if(parseInt(zdzys)>1){
			add_html.push("<span class='pull-right'></span>");
		}
		add_html.push("</h6>");
		add_html.push("<table class='right_table_head'><thead>");
		if($("#xxdm").val()=="10280"){
			add_html.push("<td class='h_num' style='display:none'>");
		}else{
			add_html.push("<td class='h_num'>");
		}
		if(qz=="0"){
			add_html.push($.i18n.get("msg_zy"));//志愿
		}else{
			var qzmc="";
			if($("#xxdm").val()=="13422"){
				qzmc=$.i18n.get("msg_xkb");
			}else if($("#xxdm").val()=="12772"){
				qzmc=$.i18n.get("msg_jf");
			}else{
				qzmc=$.i18n.get("msg_qz");
			}
			add_html.push(qzmc);//权重
		}
		add_html.push("</td><td class='arraw-px'");
		if(isWebApp){
			add_html.push("style='display:none'");
		}
		add_html.push(">"+$.i18n.get("msg_px")+"</td><td class='h_sxbj'>"+$.i18n.get("msg_xsf")+"</td><td class='h_jxb'>"+$.i18n.get("msg_jxbmc")+"</td>");
		add_html.push("<td class='h_teacher'>"+$.i18n.get("msg_jshzc")+"</td>");
		add_html.push("<td class='h_time'>"+$.i18n.get("msg_sksj")+"</td>");
		if($("#sfxsjxdd").val()=="1"){
			add_html.push("<td class='h_addr'>"+$.i18n.get("msg_jxdd")+"</td>");
		}
		if($("#sfxskssj").val()=="1"){
			add_html.push("<td class='h_kssj'>"+$.i18n.get("msg_kssj")+"</td>");
		}
		add_html.push("<td class='h_zixf'>"+$.i18n.get("msg_zxf")+"</td><td class='h_cz'>"+$.i18n.get("msg_cz")+"</td></thead></table>");
		add_html.push("<ul class='list-group' id='right_ul_"+t_kch_id+"' data-kklxdm='"+kklxdm+"'>");
		add_html.push("<input type='hidden' name='right_kchid' value='"+t_kch_id+"'/>");
		add_html.push("<input type='hidden' id='right_xf_"+t_kch_id+"' name='right_xf' value='"+dqxf+"'/>");
		add_html.push("<input type='hidden' name='right_jdlx' value='"+$("#jdlx").val()+"'/>");
		add_html.push("<input type='hidden' name='right_kklxpx' value='"+$("#kklxpx").val()+"'/>");
		add_html.push("<input type='hidden' name='right_ddkzbj' value='"+ddkzbj+"'/>");
		add_html.push("<input type='hidden' name='right_cxbj' value='"+cxbj+"'/>");
		$("#yxkcs").text(parseInt(yxkcs)+1);
		
		if($("#yxxfs").length>0){
			if(ddkzbj=="0"){//单独控制时，该学分不计入已选学分
				$("#yxxfs").text(parseFloat(yxxfs)+parseFloat(dqxf));
			}
		}
		if($("#zzxkxsrwxfkg").val()=="1" || $("#xkxfqzfs").val()=="1"){
			if(ddkzbj=="0"){//单独控制时，该学分不计入已选学分
				$("#yxxfs_jxb").text(parseFloat(yxxfs_jxb)+parseFloat(jxbxf));
			}
		}
	}else{
		if($("#zzxkxsrwxfkg").val()=="1" || $("#xkxfqzfs").val()=="1"){
			var addxf = 0;
			var maxjxbxf = 0;
			$("#right_ul_"+t_kch_id).find("input[name='right_jxbxf']").each(function(i,t){
				if(i==0){
					maxjxbxf=$(t).val();
				}else if(maxjxbxf*1<($(t).val())*1){
					maxjxbxf==$(t).val();
				}
			});
			if(jxbxf*1>maxjxbxf*1){
				$("#r-xf-"+t_kch_id).text(jxbxf);
				addxf = jxbxf*1-maxjxbxf*1;
			}
			if(ddkzbj=="0"){//单独控制时，该学分不计入已选学分
				$("#yxxfs_jxb").text(parseFloat(yxxfs_jxb)+parseFloat(addxf));
			}
		}
	}
	$("#kcxzzt_"+kch_id).val("1");
	$("#zt_txt_"+kch_id).html($.i18n.get("msg_zt")+"：<b>"+$.i18n.get("txt-yx")+"</b>");
	$("#kcxzzt_"+kch_id).parent().attr("style","background-color:#C1FFC1;");
	var jsxm = "";
	var jszc = "";
	jsxm = trObj.find(".jsxm").text();
	if($("#xkjsxxxsfs").val()=="2"){
		jszc = "";
	}else{
		jszc = trObj.find(".jszc").text();
	}
	var sksj = trObj.find(".sksj").html();
	var jxdd = "";
	if($("#sfxsjxdd").val()=="1"){
		jxdd = trObj.find(".jxdd").html();
	}
	var kssj = null;
	if($("#sfxskssj").val()=="1"){
		kssj = trObj.find(".kssj").html();
	}
	var jxbmc = trObj.find(".jxbmc").text();
	//var t_jxb_id = jxb_id.replace("(","").replace(")","");
	zypx = len+1;
	
	add_html.push("<li class='list-group-item' id='right_"+jxb_id+"'>");
	add_html.push("<div class='item'><table width='100%'><tr>");
	if($("#xxdm").val()=="10280"){
		add_html.push("<td><p class='num' style='display:none'>");
	}else{
		add_html.push("<td><p class='num'>");
	}
	if(qz=="0"){
		add_html.push(zypx);
	}else{
		add_html.push("<a href='javascript:void(0)' class='qz-block' data-jxb_id='"+jxb_id+"' data-do_jxb_id='"+do_jxb_id+"'>"+qz+"</a>");
	}
	add_html.push("</p></td>");
	add_html.push("<td class='arraw-px' ");
	if(isWebApp){
		add_html.push("style='display:none'");
	}
	add_html.push("><a class='fa fa-arrow-up padding-lr10' href='javascript:void(0);'></a><br><a class='fa fa-arrow-down padding-lr10' href='javascript:void(0);'></a></td>");
	if(sxbj=="1"){
		add_html.push("<td><p class='sxbj'><font color='blue'>"+$.i18n.get("msg_yxs")+"</font></p></td>");
	}else{
		add_html.push("<td><p class='sxbj'><font color='red'><i>"+$.i18n.get("msg_dsx")+"</i></font></p></td>");
	}
	var t_jxbmc = jxbmc.length>3 ? jxbmc.substring(0,3)+"…" : jxbmc;
	add_html.push("<td><p class='jxb popover-demo' title='"+jxbmc+"'>");
	if(jxbzls>1){
		add_html.push("<span class='right_jxbmc'>"+t_jxbmc+"</span>");
		var currentTdObj = $("#tr_"+$.convertID(jxb_id)).find(".zjxbxx");
		$(currentTdObj).find("li").each(function(index,item){
			var s_do_jxb_id = $(item).find(".do_jxb_id_1").text();
			var s_xsdm = $(item).find(".xsdm_1").text();
			var s_xsmc = $(item).find(".xsmc_1").text();
			var s_jsxm="";
			var s_jszc="";
			var s_jxdd="";
			s_jsxm = $(item).find(".jsxm_1").text();
			if($("#xkjsxxxsfs").val()=="2"){
				s_jszc = "";
			}else{
				s_jszc = $(item).find(".jszc_1").text();
			}
			var s_sksj = $(item).find(".sksj_1").text();
			if($("#sfxsjxdd").val()=="1"){
				s_jxdd = $(item).find(".jxdd_1").text();
			}
			var img = "";
			if(s_xsdm=="02"){
				img = "ico_tjxk1";
			}else if(s_xsdm=="03"){
				img = "ico_tjxk2";
			}else if(s_xsdm=="04"){
				img = "ico_tjxk3";
			}else{
				img = "ico_tjxk1";
			}
			add_html.push("<a href='javascript:void(0)' class='ico_tjxk "+img+"' title='");
			if($("#xkjsxxxsfs").val()=="2"){
				add_html.push($.i18n.prop("msg_xskcls",[s_xsmc])+"："+s_jsxm);
			}else{
				add_html.push($.i18n.prop("msg_xskcls",[s_xsmc])+"："+s_jsxm+"("+s_jszc+")");
			}
			add_html.push("' data-container='body' data-toggle='popover' data-placement='auto' ");
			if($("#sfxsjxdd").val()=="1"){
				add_html.push("data-content='"+$.i18n.get("msg_sksjdd")+"："+s_sksj+" / "+s_jxdd+"'");
			}else{
				add_html.push("data-content='"+$.i18n.get("msg_sksj")+"："+s_sksj+"'");
			}
			add_html.push("><input type='hidden' name='zkc_jxb_id' value='"+s_do_jxb_id+"'/></a>");
			

		});
	}else{
		add_html.push(t_jxbmc);
	}
	add_html.push("</p></td>");
	var jsxmzc = "";
	var t_jszc = "";
	var t_jsxm = jsxm.length>5?jsxm.substring(0,5)+"…":jsxm;
	if($("#xkjsxxxsfs").val()=="2"){
		var jsxmzc = jsxm;
		var t_jszc = "";
		add_html.push("<td><p class='teachers' title='"+jsxmzc+"'>"+"<span>"+t_jsxm+"</span></p></td>");
	}else{
		var jsxmzc = jsxm+"("+jszc+")";
		var t_jszc = jszc.length>5?jszc.substring(0,5)+"…":jszc;
		add_html.push("<td><p class='teachers' title='"+jsxmzc+"'>"+"<span>"+t_jsxm+"</span>"+t_jszc+"</p></td>");
	}
	add_html.push("<td><p class='time'>"+sksj+"</p></td>");
	if($("#sfxsjxdd").val()=="1"){
		add_html.push("<td><p class='addr'>"+jxdd+"</p></td>");
	}
	if($("#sfxskssj").val()=="1"){
		add_html.push("<td><p class='kssj'>"+kssj+"</p></td>");
	}
	add_html.push("<td><p class='zixf'>"+$.i18n.get("msg_zxs")+"</p></td>");
	add_html.push("<td><p class='but'>");
	if(sfktk=="1" && parseInt(tktjrs)<parseInt(jxbrs)){
		add_html.push("<button type='button' class='btn btn-danger btn-sm' onclick=cancelCourseZzxk('rightpage','"+jxb_id+"','"+do_jxb_id+"','"+kch_id+"','"+jxbzls+"','"+xkkz_id+"')>"+$.i18n.get("msg_tx")+"</button>");//退选
	}else{
		add_html.push("<span style='font-size:15px;color:#428BCA;'><b>"+$.i18n.get("txt-yx")+"</b></span>");
	}
	add_html.push("</p></td></tr></table></div>");
	add_html.push("<input type='hidden' name='right_sub_kchid' value='"+kch_id+"'/>");
	add_html.push("<input type='hidden' name='right_jxb_id' value='"+jxb_id+"'/>"); 
	add_html.push("<input type='hidden' name='right_qz' value='"+qz+"'/>"); 
	add_html.push("<input type='hidden' name='right_jxbxf' value='"+jxbxf+"'/>"); 
	add_html.push("<input type='hidden' name='right_do_jxb_id' value='"+do_jxb_id+"'>");
	add_html.push("<input type='hidden' name='right_xkkz_id' value='"+xkkz_id+"'>");
	add_html.push("<input type='hidden' name='right_jxbzls' value='"+jxbzls+"'/>");
	add_html.push("<input type='hidden' name='right_kklxdm' value='"+kklxdm+"'/>");
	add_html.push("</li>");
		
	if(len==0){
		add_html.push("</ul></div>");
	}
	if(len==0){//该课程结点不存在
		var beforeLastSelectKcJd = "0";	//选中教学班对应课程前面最近一个被选中的课程
		var afterFirstSelectKcJd = "0";	//选中教学班对应课程后面最近一个被选中的课程
		$("input[name='right_kchid']").each(function(index,item){
			var currentKchid = $(item).val();
			if(currentKchid < kch_id){
				beforeLastSelectKcJd = currentKchid;
			}
			if(currentKchid > kch_id && afterFirstSelectKcJd == 0){
				afterFirstSelectKcJd = currentKchid;
			}
		});
		if(beforeLastSelectKcJd != 0){//表示前面有被选中的课程，可以在此课程后添加新的课程结点
			$("#right_" + beforeLastSelectKcJd).after(add_html.join(""));
		}else if(afterFirstSelectKcJd != 0){//由于学分结点存在，故一定存在课程，如果该课程不在当前被选中课程的前面，就一定在当前被选中课程的后面
			$("#right_" + afterFirstSelectKcJd).before(add_html.join(""));
		}else{
			$(".right_div").html(add_html.join(""));
		}

	}else{//课程下已有被选中的教学班，由于此时有志愿排序的需要，故此时只需要将该记录放在课程下教学班的最后面即可
		$("#right_ul_"+t_kch_id).append(add_html.join(""));
		$("#right_"+t_kch_id).find(".pull-right").text($.i18n.get("msg_sbtdpzy"));
	}
	
	if($.defined(jxbzb) && $("#jxbzb").val()=="" && $("#jxbzbkg").val()=="1"){
		$("#jxbzb").val(jxbzb);
		$("button[name='query']").trigger("click");
	}
	
	if($.fn.dragsort){
		myDragsort();
	}
	$(".popover-demo").popover({selector: '[data-toggle="popover"]',container: "body",trigger: 'hover'});
	
	if($("#xxdm").val()=="10289"){
		getZjxbByIds(jxb_id);
	}
	
}



function cancelCourseZzxk(wz,jxb_id,do_jxb_id,kch_id,jxbzls,xkkz_id){
	if($("#confirmModal").size() > 0 ){
		return;
	}
	if($("#tkzgcs_jb").val()*1>0 || $("#tkzgcs_qt").val()*1>0){
		$.ajaxSetup({async:false});
		$.post(_path+"/xsxk/zzxkyzb_cxTkTitleMsg.html",
			{xkkz_id:xkkz_id,jxb_id:do_jxb_id,bj:"10"},
			function(data){
				if(data.flag=="-1"){
					$.alert("(JS-10)"+$.i18n.get("msg_fwcs"));//校验不通过，您可以刷新本网页后重试！
				}else if(data.flag=="2"){
					$.alert(data.msg);
				}else if(data.flag=="1"){
					$.confirm(data.msg,function(isBoolean){//......，您确定要退掉该课程吗？
						if(isBoolean){
							$.closeModal("confirmModal");
							tuikeCheck_30(wz,jxb_id,do_jxb_id,kch_id,jxbzls,xkkz_id);
						}
					 });
				}else if(data.flag=="3"){
					tuikeCheck_30(wz,jxb_id,do_jxb_id,kch_id,jxbzls,xkkz_id);
				}else{
					$.alert($.i18n.get("msg_tksbcxwzyc"));//退课失败！出现未知异常！
				}
				return false;
			},'json');
		$.ajaxSetup({async:true});
	}else{
		tuikeCheck_30(wz,jxb_id,do_jxb_id,kch_id,jxbzls,xkkz_id);
	}
}


function tuikeCheck_30(wz,jxb_id,do_jxb_id,kch_id,jxbzls,xkkz_id){
	var isContinue = "1";
	var isExist = "1";
	var trObj = $("#tr_"+$.convertID(jxb_id));
	var tkdxyzms = $.defined($("#tkdxyzms").val())?$("#tkdxyzms").val():"0";
	if(parseInt(tkdxyzms)>0){
		$.ajaxSetup({async:false});
		$.post(_path+"/xsxk/zzxkyzb_xkJcInXksjZzxkYzb.html",
			{xkkz_id:xkkz_id,jxb_id:do_jxb_id,xnm:$("#xkxnm").val(),xqm:$("#xkxqm").val()},
			function(data){
				if(data=="0"){
					isExist = "0";//该课程之前在其他页面已退掉
					refreshDataDelZzxk(trObj,jxb_id,do_jxb_id,kch_id,jxbzls,wz);
				}else if(data!="1"){
					$.alert(data);
					//isContinue = "0";
					return false;
				}else{
					if($("#sjhm").val()=="w"){
						$.alert($.i18n.get("msg_dxyzwsjhm"));//退课需要短信验证，我们未找到您的手机号码，如有疑问，请与相关管理人员联系！
						return false;
					}
					 //退选验证
					jQuery.showDialog(_path +'/xkgl/common_cxXsxkDxyz.html?jxb_id='+jxb_id+'&sjhm='+$("#sjhm").val(),$.i18n.get("msg_txyz"),{
						width:"350px",
						modalName:"addModal",
						buttons:{
							success : {
								label : $.i18n.jwglxt["sure"],
								className : "btn-primary",
								callback : function() {
									if($("#ajaxForm").isValid()){
										$.ajaxSetup({async:false});
										$.post(_path+"/xkgl/common_cxCheckXsxkYzm.html",{jxb_id:$("#jxb_id_dxyz").val(),"dxyzm":$("#yzm").val()},function(data){
											if(data=="2"){
												$("#err-hint").text($.i18n.get("msg_dxyzmcw"));//短信验证码错误！
											}else if(data=="3"){
												$("#err-hint").text($.i18n.get("msg_dxyzmsx"));//短信验证码失效！
											}else{
												delCourse(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,wz);
												$.closeModal("addModal");
											}
										},'json');
										$.ajaxSetup({async:true});
									}
									return false;
								}
							},
							cancel : {
									label : $.i18n.jwglxt["cancel"],
									className : "btn-default",
									callback : function() {}
							}
						}
					});
					return false;
				}
			},'json');
		$.ajaxSetup({async:true});
	}else{
		$.confirm($.i18n.get("msg_qdytdkc"),function(isBoolean){//您确定要退掉该课程吗？
			if(isBoolean){
				delCourse(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,wz);
			}
		 });
	}
}




function delCourse(trObj,kch_id,jxb_id,do_jxb_id,jxbzls,wz){
	var jxb_ids = [];
	jxb_ids.push(do_jxb_id);
	if(jxbzls>1){
		$("#right_"+$.convertID(jxb_id)).find("a.ico_tjxk").each(function(index,item){
			jxb_ids.push($(item).find("input[name='zkc_jxb_id']").val());
		});
	}
	$.ajaxSetup({async:false});
	$.post(_path+"/xsxk/zzxkyzb_tuikBcZzxkYzb.html",
		{kch_id:kch_id,jxb_ids:jxb_ids.join(","),xkxnm:$("#xkxnm").val(),xkxqm:$("#xkxqm").val(),txbsfrl:$("#txbsfrl").val()},
		function(data){
			setTimeout(function(){
				if(data=="1"){
					refreshDataDelZzxk(trObj,jxb_id,do_jxb_id,kch_id,jxbzls,wz);
				}else if(data=="2"){
					$.alert($.i18n.get("msg_tksbfwqm"));//退课失败！服务器繁忙！
				}else if(data=="3"){
					$.alert($.i18n.get("msg_tksbcxwzyc"));//退课失败！出现未知异常！
				}else if(data=="4"){
					$.alert("(JS-8)"+$.i18n.get("msg_jgfffw"));//警告：你正在非法访问！
				}else if(data=="5"){
					$.alert("(JS-13)"+$.i18n.get("msg_fwcs"));//校验不通过，您可以刷新本网页后重试！
				}else{
					$.alert(data);
				}
			},1); 
		},'json');
	$.ajaxSetup({async:true});
}


function refreshDataDelZzxk(trObj,jxb_id,do_jxb_id,kch_id,jxbzls,wz){
	var txbsfrl = $("#txbsfrl").val();
	var txbsfrl_1 = $("#txbsfrl_1").val();
	var rlmsbsfrlkg = $("#rlmsbsfrlkg").val();
	var sfkxk = $("#sfkxk").val();
	var jzxkf = $("#jzxkf").val();
	var rwlx = $("#rwlx").val();
	var rlkz = $("#rlkz").val();
	var cdrlkz = $("#cdrlkz").val();
	var rlzlkz = $("#rlzlkz").val();
	var yxkcs = $("#yxkcs").text();//已选课程数
	var yxxfs = 0;
	if($("#yxxfs").length>0){
		yxxfs = $("#yxxfs").text();//已选学分数
	}
	var yxxfs_jxb=0;
	if($("#zzxkxsrwxfkg").val()=="1" || $("#xkxfqzfs").val()=="1"){
		yxxfs_jxb=$("#yxxfs_jxb").text();
	}
	var jdlx="0";
	//var tykpzykg = $("#tykpzykg").val();//体育课多志愿开关
	if(wz=="rightpage"){
		jdlx=$("#right_"+$.convertID(jxb_id)).find("input[name='right_jdlx']").val();
	}else{
		jdlx=$("#jdlx").val();
	}
	var kcxzzt = $("#kcxzzt_"+kch_id).val(); //课程选中状态
	var kklxdm = $("#right_"+$.convertID(jxb_id)).find("input[name='right_kklxdm']").val();
	var cxbj = $("#right_"+$.convertID(jxb_id)).parent().find("input[name='right_cxbj']").val();
	var t_kch_id = kch_id;
	//if(tykpzykg=="1" && kklxdm=="05" && cxbj=="0"){
	if(jdlx=="1" && cxbj=="0"){
		t_kch_id = "kklx_"+kklxdm;
	}
	var ddkzbj = $("#right_ul_"+t_kch_id).find("input[name='right_ddkzbj']").val();
	var dqxf = $("#right_xf_"+t_kch_id).val();
	$("#xkczbj").val("1");
	var jxbrs = trObj.find(".rsxx .jxbrs").text();
	var blyxrs = trObj.find(".wdrsxx").find(".blyxrs").text();//本轮已选人数
	var jxbrl = trObj.find(".rsxx .jxbrl").text();
	/*var rlsfsxbj = trObj.find(".rlsfsxbj").text();*/
	var jxbxf = $("#right_"+$.convertID(jxb_id)).find("input[name='right_jxbxf']").val();
	if(txbsfrl_1 == '0'/* || (txbsfrl_1=="1" && rlsfsxbj=="0")*/){
		trObj.find(".rsxx .jxbrs").text(parseInt(jxbrs)-1);
		if(blyxrs==0){
			var blzyl = trObj.find(".wdrsxx .blzyl").text();
			trObj.find(".wdrsxx .blzyl").text(parseInt(blzyl)+1);
		}else{
			trObj.find(".wdrsxx .blyxrs").text(parseInt(blyxrs)-1);
		}
		setRlxxSubtractZzxk(trObj,parseInt(jxbrs)-1,jxbrl);//检测是否为已满状态
	}
	
	trObj.find("input[name='hidsfxz']").val("0");//将教学班对应的是否选中状态置为0
	if(/*sfkxk=="1" && */jzxkf=="0"){
		trObj.find(".an").html("<button id='btn-xk-"+jxb_id+"' type='button' class='btn btn-primary btn-sm' onclick=chooseCourseZzxk('"+jxb_id+"','"+do_jxb_id+"','"+kch_id+"','"+jxbzls+"')>"+$.i18n.get("msg_xk")+"</button>");//选课
	}else{
		trObj.find(".an").html("<span style='font-size:15px;color:red;'><b>"+$.i18n.get("msg_jx")+"</b></span>");//禁选
	}
	//更新教材预定状态
	if($("#xksdxjckg").val()=="2" && sfkxk=="1"){
		trObj.find(".jc").html("<button id='jc-"+jxb_id+"' disabled type='button' class='btn btn-primary btn-sm' onclick=orderBook('"+jxb_id+"','1')>"+$.i18n.get("msg_yd")+"</button>");
	}
	//var t_jxb_id = jxb_id.replace("(","").replace(")","");
	$("#right_"+$.convertID(jxb_id)).remove();//移除浮动框中的对应教学班
	
	if($("#right_ul_"+t_kch_id).find("li").length==0){//如果指定课程不存在被选中的教学班
		var zkcs= $("#zkcs").val();
		var zxfs= $("#zxfs").val();
		var lnzkcs= $("#lnzkcs").val();
		var lnzxfs= $("#lnzxfs").val();
		$("#zkcs").val(parseInt(zkcs)-1);//将总课程数减一
		if(ddkzbj=="0"){
			$("#zxfs").val(parseFloat(zxfs)-parseFloat(dqxf));//总学分数在原有基础上减去当前课程的学分
		}
		$("#lnzkcs").val(parseInt(lnzkcs)-1);//将总课程数减一
		$("#lnzxfs").val(parseFloat(lnzxfs)-parseFloat(dqxf));//总学分数在原有基础上减去当前课程的学分

		if($("#xxdm").val()=="10295"){
			var bxqbkklxyxxf=$("#bxqbkkklxyxxf").text();
			$("#bxqbkkklxyxxf").text(parseFloat(bxqbkklxyxxf)-parseFloat(dqxf));
		}
		/*$("#kcxzzt_"+kch_id).val("0");//将课程的选中状态置为0
		$("#zt_txt_"+kch_id).html("状态：未选");
		if(cxbj=="1"){
			$("#kcxzzt_"+kch_id).parent().attr("style","background-color:#fff7b2;");
		}else{
			$("#kcxzzt_"+kch_id).parent().attr("style","background-color:#d9edf7;");
		}*/
		$("#yxkcs").text(parseInt(yxkcs)-1);//将已选课信息减一
		if(ddkzbj=="0"){
			if($("#yxxfs").length>0){
				$("#yxxfs").text(parseFloat(yxxfs)-parseFloat(dqxf));//将已选课信息减一
			}
			$("#yxxfs_jxb").text(parseFloat(yxxfs_jxb)-parseFloat(jxbxf));//将已选课信息减一
		}
		$("#right_"+t_kch_id).remove();//浮动框中课程结点移除
	}else {
		if($("#right_ul_"+t_kch_id).find("li").length==1){
			$("#right_"+t_kch_id).find(".pull-right").text("");
		}
		if($("#zzxkxsrwxfkg").val()=="1" || $("#xkxfqzfs").val()=="1"){
			var delxf = 0;
			var maxjxbxf = 0;
			$("#right_ul_"+t_kch_id).find("input[name='right_jxbxf']").each(function(i,t){
				if(i==0){
					maxjxbxf=$(t).val();
				}else if(maxjxbxf*1<($(t).val())*1){
					maxjxbxf==$(t).val();
				}
			});
			if(jxbxf*1>maxjxbxf*1){
				$("#r-xf-"+kch_id).text(maxjxbxf);
				delxf = jxbxf*1-maxjxbxf*1;
			}
			$("#yxxfs_jxb").text(parseFloat(yxxfs_jxb)-parseFloat(delxf));
		}
	}
	
	var exists = 0;
	$(".right_div").find("input[name='right_sub_kchid']").each(function(index,item){
		if($(this).val()==kch_id){
			exists = 1;
			return false;
		}
	});
	if(exists==0){
		$("#kcxzzt_"+kch_id).val("0");//将课程的选中状态置为0
		$("#zt_txt_"+kch_id).html($.i18n.get("msg_zt")+"："+$.i18n.get("txt-wx"));
		if(cxbj=="1"){
			$("#kcxzzt_"+kch_id).parent().attr("style","background-color:#fff7b2;");
		}else{
			$("#kcxzzt_"+kch_id).parent().attr("style","background-color:#d9edf7;");
		}
	}
	
	if($(".right_div").find(".outer_xkxx_list").length==0 && $("#jxbzbkg").val()=="1"){
		$("#jxbzb").val("");
		$("button[name='query']").trigger("click");
	}
	
	if(parseInt(jxbzls)>1){
		trObj.find(".zjxbxx").html("");
	}
	saveOrder();
	if(wz=="rightpage"){
		reLoadKb();
	}
	if($("#ctTabGrid").length>0){
		$("#ctTabGrid").trigger("reloadGrid");
	}
}

function reLoadKb(){
	if($("#xkczbj").val()=="1"){
		$("#myCourseTableZzxk").load(_path+"/kbcx/xskbcx_cxXskbBestSimpleIndex.html");
		$("#xkczbj").val("0");
	}
}

function rebackJxbrsZzxk(){
	var rwlx = $("#rwlx").val();
	var rlkz = $("#rlkz").val();
	var cdrlkz = $("#cdrlkz").val();
	var rlzlkz = $("#rlzlkz").val();
	var jxb_id = $("#select_jxb_00").val();
	var rwlx = $("#rwlx").val();
	var trObj = $("#tr_"+$.convertID(jxb_id));
	var jxbrs = trObj.find(".rsxx .jxbrs").text();
	var blyxrs = trObj.find(".wdrsxx .blyxrs").text();//本轮已选人数
	var jxbrl = trObj.find(".rsxx .jxbrl").text();
	jxbrs = parseInt(jxbrs)-1;
	trObj.find(".rsxx .jxbrs").text(jxbrs);
	if(blyxrs==0){
		var blzyl = trObj.find(".wdrsxx .blzyl").text();
		trObj.find(".wdrsxx .blzyl").text(parseInt(blzyl)+1);
	}else{
		trObj.find(".wdrsxx .blyxrs").text(parseInt(blyxrs)-1);
	}
	setRlxxSubtractZzxk(trObj,jxbrs,jxbrl);//检测是否为已满状态
}

function myDragsort(){
	$(".list-group").each(function(){
		$(this).dragsort("destroy");
		$(this).dragsort({
			dragSelector: "li", 
			dragBetween: false, 
			dragEnd: saveOrder, 
			placeHolderTemplate: "<li class='list-group-item'><div></div></li>",
			scrollSpeed: 5
		});
	});	
}

//客户端类型识别(是否是PC机)
function isPc(){
	var isPc = true;
	var sUserAgent= navigator.userAgent.toLowerCase(); 
	var bIsIpad= sUserAgent.match(/ipad/i) == "ipad"; 
	var bIsIphoneOs= sUserAgent.match(/iphone os/i) == "iphone os"; 
	var bIsMidp= sUserAgent.match(/midp/i) == "midp"; 
	var bIsUc7= sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4"; 
	var bIsUc= sUserAgent.match(/ucweb/i) == "ucweb"; 
	var bIsAndroid= sUserAgent.match(/android/i) == "android"; 
	var bIsCE= sUserAgent.match(/windows ce/i) == "windows ce";
	var bIsWM= sUserAgent.match(/windows mobile/i) == "windows mobile"; 
	if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) { 
		isPc = false; 
	}
	return isPc;
}

$("#btn_wdxyqk").click(function(){
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
});

function orderBook(jxb_id,sfydjc){
	var trObj = $("#tr_"+$.convertID(jxb_id));
	trObj.find(".jc").attr("disabled","true");
	if (sfydjc == '0') {	//退订
		$.ajaxSetup({async: false});
		$.post(_path + "/xsxk/zzxkyzb_cxSfmgcjc.html", {
			"jxb_id": jxb_id, sfydjc:sfydjc,xkxnm:$("#xkxnm").val(),xkxqm:$("#xkxqm").val()
		}, function (data) {
			if (data == '1') {
				$.alert($.i18n.get("msg_mgcjctx"));//马工程教材无法退订！
				trObj.find(".jc").removeAttr("disabled");
			} else {
				if($("#xxdm").val()=="10349") {	//绍兴文理学院
					//退订原因
					jQuery.showDialog(_path +'/xsxk/zzxkyzb_cxJctdyyView.html?',$.i18n.get("msg_tdyy"),{
						width:"600px",
						modalName:"addModal",
						buttons:{
							success : {
								label : $.i18n.jwglxt["sure"],
								className : "btn-primary",
								callback : function() {
									if($("#ajaxForm").isValid()){
										var tdyy = $("#tdyy_sz").val();
										$.closeModal("addModal");
										doOrderBook(jxb_id,sfydjc,tdyy);
									}
									return false;
								}
							},
							cancel : {
								label : $.i18n.jwglxt["cancel"],
								className : "btn-default",
								callback : function() {
									trObj.find(".jc").removeAttr("disabled");
								}
							}
						}
					});
				} else {
					doOrderBook(jxb_id,sfydjc,'');
				}
				return false;
			}
		}, 'json');
		$.ajaxSetup({async: true});
	} else {
		if($("#xxdm").val()=="10619"){	//西南科技大学
			$.ajaxSetup({async: false});
			$.post(_path + "/xsxk/zzxkyzb_cxSfydgjc.html", {
				"jxb_id": jxb_id, "bh_id":$("#bh_id").val()
			}, function (data) {
				if ($.founded(data) && data=='1') {
					$.confirm("你已选购过该教材，是否继续？",function(isBoolean){	//你已选购过
						if(isBoolean){
							doOrderBook(jxb_id,sfydjc,'');
						} else {
							trObj.find(".jc").removeAttr("disabled");
						}
					});
				} else {
					doOrderBook(jxb_id,sfydjc,'');
				}
			}, 'json');
			$.ajaxSetup({async: true});
		}else{
			doOrderBook(jxb_id,sfydjc,'');
		}
	}
}

function doOrderBook(jxb_id,sfydjc,tdyy){
	var trObj = $("#tr_"+$.convertID(jxb_id));
	$.ajaxSetup({async: false});
	$.post(_path + "/xsxk/zzxkyzb_cxUpdateJcydbj.html", {
		"jxb_id": jxb_id, sfydjc:sfydjc, tdyy : tdyy, xkxnm:$("#xkxnm").val(),xkxqm:$("#xkxqm").val()
	}, function (data) {
		if ($.founded(data) && data.flag=='1') {
			//刷新预定状态
			if (sfydjc=='1') {
				trObj.find(".jc").html("<button id='jc-"+jxb_id+"' type='button' class='btn btn-danger btn-sm' onclick=orderBook('"+jxb_id+"','0')>"+$.i18n.get("msg_td")+"</button>");
			} else {
				trObj.find(".jc").html("<button id='jc-" + jxb_id + "' type='button' class='btn btn-primary btn-sm' onclick=orderBook('" + jxb_id + "','1')>" + $.i18n.get("msg_yd") + "</button>");
			}
		} else if ($.founded(data) && data.flag=='0') {
			$.alert(data.msg);
			trObj.find(".jc").removeAttr("disabled");
		} else {
			$.error($.i18n.get("msg_wzyclxgly"));//出现未知异常，请与管理员联系！
			trObj.find(".jc").removeAttr("disabled");
		}
	}, 'json');
	$.ajaxSetup({async: true});
}

function shengqing(kch_id,jxb_id){
	var key = $("#xkxnm").val()+$("#xkxqm").val()+$("#xh_id").val()+kch_id;
	if($("#choosedXkyxGrid").find("#"+key).length>0){
		$.alert($.i18n.get("msg_rlmyjryxmd"));//容量已满，不可选！且你已申请加入“意向名单”，如果条件允许，学校将新开班！
	}else{
		$.confirm($.i18n.get("msg_qdjryxmd"),function(isBoolean){//容量已满，不可选！如果仍想选此课，可申请加入 “意向名单”，如果条件允许，学校将新开班，是否加入？
			if(isBoolean){
				$.ajaxSetup({async: false});
				$.post(_path + "/xsxk/zzxkyzb_xkBcZzxkyix.html", {
					xkxnm:$("#xkxnm").val(),xkxqm:$("#xkxqm").val(),"kch_id":kch_id,"jxb_id":jxb_id,"kklxdm":$("#kklxdm").val()
				}, function (data) {
					if(data=="1"){
						$.success($.i18n.get("msg_sqcgkck"),function(){//申请成功，可在右边的“选课信息”中查看！
	    	                //refershGrid("choosedXkyxGrid");
							var kcmc = $("#kcmc_"+kch_id).text().split("-")[0].trim();
							var xf = $("#xf_"+kch_id).text();
							var now = new Date();
							var year = now.getFullYear(); // 获取当前年份
							var month = now.getMonth() + 1; // 获取当前月份（注意：月份从0开始，所以要加1）
							month = month<10?"0"+month:month+"";
							var day = now.getDate(); // 获取当前日期
							day = day<10?"0"+day:day+"";
							var hours = now.getHours(); // 获取当前小时
							hours = hours<10?"0"+hours:hours+"";
							var minutes = now.getMinutes(); // 获取当前分钟
							minutes = minutes<10?"0"+minutes:minutes+"";
							var seconds = now.getSeconds(); // 获取当前秒数
							seconds = seconds<10?"0"+seconds:seconds+"";
							var xksj=year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
							$("#choosedXkyxGrid").jqGrid('addRowData',key,{
								key:key,
								xkxnm:$("#xkxnm").val(),
								xkxqm:$("#xkxqm").val(),
								kch_id:kch_id,
								kklxmc:$("#kklxmc").val(),
								kcmc:kcmc,
								xf:xf,
								xksj:xksj		
							},"last");
						});
					}else{
						$.error($.i18n.get("msg_wzyclxgly"));//出现未知异常，请与管理员联系！
					}
				}, 'json');
				$.ajaxSetup({async: true});
			}
		});
	}
}

function tuibao(key,xkxnm,xkxqm,kch_id,czlx){
	$.ajaxSetup({async:false});
	$.post(_path+"/xsxk/zzxkyzb_tuikBcXkyix.html",{
		xkxnm:xkxnm,xkxqm:xkxqm,kch_id:kch_id
	},function(data){
		if(data=="1"){
			if(czlx=="xktb"){
				$("#choosedXkyxGrid").delRowData(key);
			}else{
	            $.success($.i18n.jwglxt["czcg"],function(){
	            	$("#choosedXkyxGrid").delRowData(key);
	            });
			}
		}else if(data=="4"){
			$.error($.i18n.jwglxt["nopermission"]);//无操作权限！
			return false;
		}else{
			$.error($.i18n.get("msg_wzyclxgly"));//出现未知异常，请与管理员联系！
			return false;
		}
	},'json');
	$.ajaxSetup({async:true});
}

function jtsq(xnm,xqm,jxb_id,kch_id) {//间听申请
	$.post(_path+"/jxrwbmgl/jxrwxmbm_cxJxxmbmCheckCount.html",{"xnm":xnm,"xqm":xqm,"jxb_id":jxb_id,"jxxmlbdm":"1055"},
		function(data){
			if(data=="0"){
				$.error($.i18n.jwglxt["cxwzyc"]);//"出现未知异常！"
				return;
			}else if($.founded(data)){
				$.alert(data);
				return;
			}else{
				$.showDialog(_path+"/cxbm/cxbm_cxCtjxbListPage.html", "提示", $.extend(true,{},addConfig,{//"间听申请"
					modalName:"bmModal",
					width: $("#yhgnPage").innerWidth() * 0.7 +"px",
					data:{"xnm":xnm,"xqm":xqm,"jxb_id":jxb_id},
					buttons:{
						success:{
							label:"确认",
							callback : function() {
								var ctMap = {
									"xnm"	:	$("#xnm_ct").val(),
									"xqm"	:	$("#xqm_ct").val(),
									"jxxmlbdm"	:	"1055",
									"bmqkbList[0].kch_id"	:	$("#kch_id_ct").val(),
									"bmqkbList[0].jxb_id"	:	$("#jxb_id_ct").val(),
									"ctjxb_id"	:	$("#ctTabGrid").getRows().map(it => it['jxb_id']).toString()
								}
								jQuery.ajaxSetup({async:false});
								jQuery.post(_path + '/jxrwbmgl/jxrwxmbm_zjJxrwxmbm.html', ctMap, function (responseText) {
									if (responseText.indexOf("成功") > -1) {
										$.success("报名成功！", function () {//报名成功！
											var xsbmxq_id = responseText.replace("成功","");
											var kcmc = $("#kcmc_"+kch_id).text().split("-")[0].split(")")[1].trim();
											var jxbmc = $("#tr_"+jxb_id).find(".jxbmc").text();
											var jsxm = $("#tr_"+jxb_id).find(".jsxmzc").find("a").text();
											var xf = $("#xf_"+kch_id).text();
											var now = new Date();
											var year = now.getFullYear(); // 获取当前年份
											var month = now.getMonth() + 1; // 获取当前月份（注意：月份从0开始，所以要加1）
											month = month<10?"0"+month:month+"";
											var day = now.getDate(); // 获取当前日期
											day = day<10?"0"+day:day+"";
											var hours = now.getHours(); // 获取当前小时
											hours = hours<10?"0"+hours:hours+"";
											var minutes = now.getMinutes(); // 获取当前分钟
											minutes = minutes<10?"0"+minutes:minutes+"";
											var seconds = now.getSeconds(); // 获取当前秒数
											seconds = seconds<10?"0"+seconds:seconds+"";
											var bmsj=year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
											$("#choosedJtbmGrid").jqGrid('addRowData',xsbmxq_id,{
												xsbmxq_id:xsbmxq_id,
												kch_id:kch_id,
												jxb_id:jxb_id,
												shjg:"1",
												kcmc:kcmc,
												jxbmc:jxbmc,
												jsxm:jsxm,
												xf:xf,
												bmsj:bmsj
											},"last");
											$.closeModal("bmModal");
										});
									} else if (responseText.indexOf("失败") > -1) {
										$.error("报名失败！", function () {//报名失败！
										});
									} else {
										$.alert(responseText, function () {
										});
									}
								}, 'json');
								jQuery.ajaxSetup({async:true});
								return false;
							}
						}
					}
				}));
			}
		},'json');
	$("#btn-xk-"+$.convertID(jxb_id)).removeAttr("disabled");
}

function shanchu(xsbmxq_id) {
	$.confirm("确定退间听吗?", function (result) {
		if (result) {
			$.ajaxSetup({async: false});
			$.getJSON(_path + '/jxrwbmgl/jxrwxmbm_scJxrwxmbm.html?gnmkdm=N2511', {"xsbmxq_id": xsbmxq_id}, function (data) {
				if (data.indexOf("成功") > -1) {
					$.success("退间听成功！", function () {
						$("#choosedJtbmGrid").delRowData(xsbmxq_id);
					});
				} else if (data.indexOf("失败") > -1) {
					$.error("退间听失败！", function () {
					});
				} else {
					$.alert(data, function () {
					});
				}
			});
			$.ajaxSetup({async: true});
		}
	});
}