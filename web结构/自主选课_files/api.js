;(function(jQuery) {

    //自定义查询中绑定自定义消息推送按钮，本来写在fc.js中，南工大，不加载fc.js,因此写在这里
    setTimeout(function(){
        $("body").on('click','#btn_zdyxxts', function (e){
            //按条件查询上课情况
            if ($('#gnmkdmKey').val() == 'N219904'){

                //数S{teacher}、S{section}、S{place}、S{subect}分别为任课教师姓名、上课节次、上课地点、课程名称，新增参数 ${sx}事项，${time}时间，${xnmc}学年,${xqmc}学期
                var ids=$(".ui-jqgrid-btable").getKeys();
                if (ids.length ==0){
                    $.alert("至少选择一条数据。");
                    return false;
                }
                var datas=[];
                $.each(ids,function(index,item){
                    var row = $(".ui-jqgrid-btable").jqGrid('getRowData', item);
                    var data={'yhm':row["jgh"]
                        ,'teacher':row["xm"]
                        ,'section':row["skjc"]
                        ,'place':row["cdmc"]
                        ,'subect':row["kcmc"]
                        ,'time':row["sksj"]
                        ,'xnmc':row["xn"]
                        ,'xqmc':row["xq"]
                    };
                    datas.push(data);
                });

                var title='消息推送';
                var viewData='<div class="col-md-12 col-sm-12">			<div class="form-group">			<label for="" class="col-sm-2 control-label" for="xxts_sx">			' +
                    '事项			</label>			<div class="col-sm-8"><input type="text" id="xxts_sx" name="xxts_sx" class="form-control" validate="{required:true,stringMaxLength:100}" />' +
                    '		</div>			</div>			</div>' +
                    '<div class="col-md-12 col-sm-12">			<div class="form-group">			<label for="" class="col-sm-2 control-label" for="xxts_sksj">			' +
                    '上课时间			</label>			<div class="col-sm-8"><input type="text" id="xxts_sksj" name="xxts_sksj"  class="form-control Wdate"  readonly="readonly"  placeholder="点击选择时间" onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd\'});" />' +
                    '		</div>			</div>			</div>';
                window.viewData = viewData;

                $.showDialog(_path +'/commonShow/show_customView.html','消息推送',$.extend(true,{},addConfig,{
                    width:"800px",
                    modalName:"szModal",
                    data:{'title':title,'viewData':viewData},
                    buttons:{
                        success : {
                            label : "确定推送",
                            className : "btn-primary",
                            callback : function() {


                                $("#progressbar").data("finished", false);
                                // jQuery.ajaxSetup({async:false});
                                jQuery.post(_path +'/commonShow/show_xxtzZdy.html', { 'sx':$('#xxts_sx').val(),'sksj':$('#xxts_sksj').val(),'data': JSON.stringify(datas)}, function (data) {
                                    if (data.indexOf("成功") > -1) {
                                        $.success(data, function () {

                                        });
                                    } else if (data.indexOf("失败") > -1) {
                                        $.error(data, function () {
                                        });
                                    } else {
                                        $.alert(data, function () {
                                        });
                                    }
                                    $("#progressbar").closest(".progress").hide();
                                    // $("#progressbar").css("width", "0%").text("0%").attr("aria-valuenow", 0).removeClass(cssArr.join(" "));
                                    $("#progressbar").css("width", "0%").text("0%").attr("aria-valuenow", 0);
                                }, 'json', {
                                    //显示提交进度的状态条元素
                                    progressElement: "#progressbar",
                                    //进度处理完成后进度归零延时时间；单位毫秒，默认2000
                                    progressDelay: 2000,
                                    //定时请求处理进度Ajax执行周期；单位毫秒，默认400
                                    progressPeriod: 400,
                                    //进度回调请求URL【该路径为通用路径，必须传参数key= 指定的值 】
                                    progressURL: _path + "/xtgl/progress_cxProgressStatus.html?key=xxtzZdy_message_processed"
                                });

                                return false;

                            }
                        },
                        cancel : {
                            label : "关 闭",
                            className : "btn-default"
                        }
                    }
                }));
            }
            return false;
        });
    },1000);



    jQuery.zfReport = {};
    const zfReport = jQuery.zfReport;

    let url = '';
    let uid = '';
    let token = '';
    let timestamp = '';

    zfReport.refresh = function() {
        return jQuery.ajax({
            url: _path + '/zf_report/refresh.html',
            type: 'GET',
            dataType: 'json',
            async: false,
            success: function (data) {
                url = data.url;
                uid = data.uid;
                token = data.token;
                timestamp = data.timestamp;
            }
        });
    }

    zfReport.previewOld = function(options) {
        zfReport.refresh();
        const uri = '/integration/jr-runtime/';
        const jrCode = options.jrCode;

        let currentUrl = url + uri + jrCode + '?_uid_=' + uid + '&_timestamp_=' + timestamp + '&_token_=' + token;

        const data = options.data;
        for (let key in data) {
            currentUrl += '&' + key + '=' + data[key];
        }
        const link = $('<a></a>').attr('target', '_blank').attr('href', currentUrl).css('display', 'none');
        $('body').append(link);
        link[0].click();
        link.remove();
    }

    zfReport.preview = function(options) {
        zfReport.refresh();

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${_path}/zf_report/enc.html`, false);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        let data = {};
        xhr.onload = function () {
            if (xhr.status === 200) {
                data = JSON.parse(xhr.responseText);
            }
        };

        const urlSearchParams = new URLSearchParams();
        for (let key in options.data) {
            urlSearchParams.append(key, options.data[key]);
        }
        xhr.send(urlSearchParams);

        const uri = '/integration/jr/';
        const jrCode = options.jrCode;

        let currentUrl = url + uri + jrCode;

        const $iframe = $(`<iframe style="display: none"></iframe>`);
        const $form = $(`
            <form action="${currentUrl}" method="post" target="_blank">
                <input type="hidden" name="_uid_" value="${uid}" />
                <input type="hidden" name="_timestamp_" value="${timestamp}" />
                <input type="hidden" name="_token_" value="${token}" />
            </form>
        `);

        for (let key in data) {
            $form.append(`<input type="hidden" name="${key}" value="${data[key]}" />`);
        }
        $iframe.append($form);

        $iframe.appendTo("body");
        $form.submit().remove();
        $iframe.remove();
    }

    zfReport.download = function(options) {
        zfReport.refresh();
        const uri = '/raw/integration/jr-export/';
        const jrCode = options.jrCode;
        const type = options.type;
        const data = options.data;
        const password = options.password;

        let currentUrl = url + uri + jrCode + '?_uid_=' + uid + '&_timestamp_=' + timestamp + '&_token_=' + token + '&_export_type_=' + type;

        if (password != null) {
            currentUrl = currentUrl + '&_password_=' + password
        }

        for (let key in data) {
            currentUrl += '&' + key + '=' + data[key];
        }
        const link = $('<a></a>').attr('target', '_blank').attr('href', currentUrl).css('display', 'none');
        $('body').append(link);
        link[0].click();
        link.remove();
    }
})($);