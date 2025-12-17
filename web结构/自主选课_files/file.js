
//得到附件的可用num
function getFileNum(){
	var maxNum = 0;
	jQuery("input[type='file'][name^='fileList']").each(function(){
		var curNum = jQuery(this).attr("id").split("-")[1];
		if(curNum>maxNum) maxNum = curNum;
	});
	return ++maxNum;
}

//文件下载
function downFile(fjlj,fjmc){
	//构建form
	jQuery.buildForm("downForm",_path+"/xtgl/file_cxDownFile.html",{fjsclj: fjlj,fjm:fjmc}).submit();
}

//文件下载（APP端）
function downMobileFile(fjlj,fjmc){
	fjmc = fjmc ? encodeURIComponent(encodeURIComponent(fjmc)) : '';
	var elemIF = document.createElement("iframe");
	elemIF.src = _path + '/jxbpjgl/tkpjMobile_cxDownFj.html?fjsclj=' + fjlj + '&fjm=' + fjmc;
	elemIF.style.display = "none";

	document.body.appendChild(elemIF);
}

//下载文件
jQuery(document).off("click","a.jwglxt-downFile").on("click","a.jwglxt-downFile",function(){
	downFile(jQuery(this).data("fjsclj"),jQuery(this).data("fjm")||'');
});

//文件预览
function viewFile(fjlj){
	jQuery.post(_path+"/xtgl/file_cxViewFile.html", {fjsclj: fjlj}, function (data) {	
		if(data.indexOf("success")!=-1){
			window.open(data.split("#success")[0]);
		}else{
			$.alert(data);
		}
    }, 'json');
}

function viewFilePro(fjlj){
	jQuery.post(_path+"/xtgl/file_cxViewFileWord.html", {fjsclj: fjlj}, function (data) {	
		if(data.indexOf("success")!=-1){
			window.open(data.split("#success")[0]);
		}else{
			$.alert(data);
		}
    }, 'json');
}

//预览文件
jQuery(document).off("click","a.jwglxt-viewFile").on("click","a.jwglxt-viewFile",function(){
	viewFile(jQuery(this).attr("data"));
});