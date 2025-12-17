var byForms;
var oldForms;
(function($) {
    /** 不管模式2,3 都会把原先class为by_form(必须)的清空
     * options  {id: xxx,api:'',searchBtn：searchBtn}
     *  id  表单需要绑定到哪个节点下
     * api 表单需要请求的接口
     * searchBtn 模式2点击查询接受的数据方法
     * searchFun  模式3点击查询接受的数据方法 也是原来点击查询的方法（外层class有变化 业务js里的取值最好不要加父元素的类）
     * 必填还未弄好
     * mode 1 原来的 2：表单取接口的 3：表单取页面上的
     * finallyFun dom表单渲染好后执行的方法 比如：级联
      */
      //创建 DOM

      $.dom = function(str) {
        if (typeof(str) !== 'string') {
          if ((str instanceof Array) || (str[0] && str.length)) {
            return [].slice.call(str);
          } else {
            return [str];
          }
        }
        if (!$.__create_dom_div__) {
          $.__create_dom_div__ = document.createElement('div');
        }
        $.__create_dom_div__.innerHTML = str;
        return [].slice.call($.__create_dom_div__.childNodes);
      };
        var formStr =
        `<div class="side-box">
            <form action="" method="post" class="form-dynamic form-horizontal sl_all_form" role="form" id="subForm" name="form" data-toggle="validation">
            <div class="row row-content"></div>
            </form>
            <div class="row sl_aff_btn" id="searchBot">
                <div class="col-sm-12 opt-box">
                    <div class="extra-box"></div>
                    <div class="right-box">
                        <div class="opt-zk"></div>
                        <button type="button" class="btn btn-primary btn-sm" id="dyn_search_go"> 查 询 </button>
                        <div class="dyBtn" id="dyBtn" style="text-align: right;cursor: pointer;position:relative;">
                        <i class="glyphicon glyphicon-cog" style="color: #a7a7a7"></i><span class="ic-spt">自定义查询条件</span>
                        </div>
                    </div>

                </div>
            </div>
            <div id='wztj' class="wztjBox">

            </div>
        </div>`;
        function DynamicForm(options,age){
            this.defaultOpt = {
                colSmNum: '4',
                xshs: '2',
                maxShowNum: 0,
                api:_path+'/zdytj/zdytj_cxYhcxtjpzList.html?gnmkdm='+$('#gnmkdmKey').val(),
                mode: '2',//默认模式2自定义 取cxtjList  3：页面 取pzmxList
            }
            this.allOpt = Object.assign({},this.defaultOpt,options)
            this.list = [
                // {lx:'1',sfbt:'1',zwmc:'王一博',tjtjz:'1',id:'wyb',tjList:[{key:'1',value:'哈哈哈哈'},{key:'2',value:'嘻嘻嘻嘻'},{key:'3',value:'哇哇哇哇'}]},
                // {lx:'2',sfbt:'1',zwmc:'黄景瑜',id:'hjy',tsy:'请输入',tjtjz:''},
                // {lx:'3',sfbt:'1',zwmc:'张彬彬',id:'zbb',tjtjz:'2',tjList:[{key:'1',value:'1'},{key:'2',value:'2'},{key:'3',value:'3'}]},
                // {lx:'4',sfbt:'1',zwmc:'薛之谦',id:'xzq',tjtjz:'2',tjList:[{key:'1',value:'1'},{key:'2',value:'2'},{key:'3',value:'3'}]},
                // {lx:'5',sfbt:'1',zwmc:'王安宇',id:'way',tjtjz:'2',search:false,allSearch:true,fanSearch:true,tjList:[{key:'1',value:'1'},{key:'2',value:'2'},{key:'3',value:'3'}]},

            ];
            this.syList =[
                {value: '=',key:'等于'},
                {value: '!=',key:'不等于'},
                {value: 'like',key:'包含'},
                {value: 'not like',key:'不包含'},
                {value: 'in',key:'属于'},
                {value: 'not in',key:'不属于'},
                {value: 'is null',key:'为空'},
                {value: 'is not null',key:'不为空'},
                {value: '=',key:'等于'},
                {value: '>=',key:">="},
                {value: '<=',key:'<='},
            ];
            this.byFormsDom = null;
            this.byBtnExtraDom = null;
            this.bxspzmxList = [];
            //初始化请求
            if(this.allOpt.api){
                this.getList()
            }
            //初始化事件
            this.bindFun()
        }
        DynamicForm.prototype.getNewHtml=function(){
          var html = [];
              var time = new Date().getTime();
              html.push("<div class='col-sm-6 col-md-4'><div class='form-group'>");
              html.push("<div class='col-sm-4'>");
              html.push("<select id='mxl");
              html.push(time + "' " + "name='mxl' class='form-control chosen-select'>");
              html.push($("#mxl1").html().replace('selected="selected"', ''));
              html.push("</select>")
              html.push("<SCRIPT type='text/javascript'>");
              html.push("jQuery('#mxl" + time + "')");
              html.push(".trigger('chosen');</SCRIPT>");
              html.push("</div>");

              html.push("<div class='col-sm-3'>")
              html.push("<select id='ysf");
              html.push(time + "' " + "name='ysf' class='form-control chosen-select'>");
              html.push("<option value='='>等于</option>");
              html.push("<option value='!='>不等于</option>");
              html.push("<option value='like'>包含</option>");
              html.push("<option value='not like'>不包含</option>");
              html.push("<option value='in'>属于</option>");
              html.push("<option value='not in'>不属于</option>");
              html.push("<option value='is null'>为空</option>");
              html.push("<option value='is not null'>不为空</option>");
              html.push("<option value='>='>&gt;=</option>");
              html.push("<option value='<='>&lt;=</option>");
              html.push("</select>");
              html.push("<SCRIPT type='text/javascript'>");
              html.push("jQuery('#ysf" + time + "')");
              html.push(".trigger('chosen');</SCRIPT>");
              html.push("</div>");

              html.push("<div class='col-sm-4' id='bdsDiv" + time + "'><input type='text'  name='bds' id='bds" + time + "'  placeholder='请输入表达式' class='form-control'></div>");
              html.push("<div class='col-sm-1'><span class='glyphicon glyphicon-remove-sign wztjan'></span></div>");

              html.push("</div></div>");

              $(".wztjBox").append(html.join(""));
        }
        DynamicForm.prototype.bindFun = function(){
            var that = this
            $(document).off('click','#dyn_search_go').on('click','#dyn_search_go', function(event){
                // if(!$(`${that.allOpt.id} form`).valid()){
                //      console.log('校验')
                //     return
                // }
                if(that.allOpt.mode == '2'){
                    var map = {};
                    $(`${that.allOpt.id} .form-dynamic .form-group`).each(function(index,item){
                        //下拉选
                        var selectItem = $(item).find('.xlx').find('select');
                        if(selectItem.length){
                            var id = selectItem.attr("name");
                            map[id]= selectItem.val();
                        }
                        //输入框
                        var inputItem = $(item).find('.srk').find('input[type="text"]');
                        if(inputItem.length){
                            var id = inputItem.attr("name");
                            map[id] = inputItem.val();
                        }
                        //单选
                        var RadioItem = $(item).find('.dxk').find('input[type="radio"]')
                        // console.log(RadioItem,RadioItem.length,'radio')
                        if(RadioItem.length){
                            var vals = []; //只能是一个数据
                            var id = ''
                            RadioItem.each(function(indexp,itemp){
                                id = $(itemp).attr("name");
                                if($(itemp).attr('checked')==undefined){
                                }else{
                                 vals.push($(itemp).val())
                                }
                            })
                            map[id] = vals.join(",");
                            // console.log(vals,'单选vals==')
                        }
                        //复选框
                        var checkboxs = $(item).find('.fxk').find('input[type="checkbox"]');
                        if(checkboxs.length){
                            var vals = []; //多个
                            var id = ''
                            checkboxs.each(function(indexp,itemp){
                                id = $(itemp).attr("name");
                                if($(itemp).attr('checked')==undefined){
                                }else{
                                 vals.push($(itemp).val())
                                }
                            })
                            map[id] = vals.join(",");
                            // console.log(vals,'多选vals==')
                        }
                        // 下拉复选框
                        var multiItem = $(item).find('.multi-select-value');
                        if(multiItem.length){
                            var id = multiItem.attr('name');
                            var val = multiItem.val();
                            map[id] = val;
                        }
                    })
                    //更多查询
                    var cxList = []
                    $(`${that.allOpt.id} .wztjBox .form-group`).each(function(index,item){
                          //下拉选
                          var str = ""
                          var mxlVal = $(item).find('select[name="mxl"]').val();
                          if(mxlVal){
                              var ysfVal = $(item).find('select[name="ysf"]').val();
                              console.log(ysfVal,'ysfVal=')
                              if(ysfVal){
                                  var bdsDivVal = $(item).find('input[name="bds"]').val();
                                  console.log(bdsDivVal,'bdsDivVal=')
                                  if(!bdsDivVal){
                                      str = mxlVal + " " + ysfVal + " "
                                  }else{
                                      if(ysfVal=='like' || ysfVal=='not like'){
                                          str = mxlVal + " " + ysfVal +" "+ "'%"+ bdsDivVal +"%'"
                                      }else if(ysfVal=='in' || ysfVal=='not in'){
                                          str = mxlVal + " " + ysfVal +" "+"('"+''+bdsDivVal+"')"
                                      }else{
                                          str = mxlVal + " " + ysfVal +" "+ "'"+bdsDivVal +"'"
                                      }

                                  }
                              }
                          }
                          if(str){
                              cxList.push(str)
                          }
                    })
                    map['queryModel.dynamicCondition'] = cxList.join(' and ')
                    console.log(map,'map==')
                    that.allOpt.searchBtn(map)
                }else{
                    that.allOpt.searchFun()
                }
            })
            $(document).off('click','.openClose').on('click','.openClose', function(event){
                var openItem = $(this).find('.openBtn');
                var isOpen = false;
                if(openItem.length){
                    //当前为收起 需要展开
                    openItem.removeClass('openBtn').addClass('closeBtn');
                    isOpen=true;
                    openItem.find('.txt').text('收起');
                    openItem.find('img').addClass('sq')
                }else{
                    //当前为展开 需要收起
                    $(this).find('label').removeClass('closeBtn').addClass('openBtn');
                    isOpen=false;
                    $(this).find('.txt').text('展开');
                    $(this).find('img').removeClass('sq')
                }
               var groups =  $(`${that.allOpt.id} .row-content>div`)
               groups.each(function(index,item){
                   if(isOpen){
                       $(item).removeClass('hiddenBox')
                   }else{
                       if(index+1>that.allOpt.maxShowNum){
                         $(item).addClass('hiddenBox')
                       }
                   }
               })
            })
            $(document).off('click','#dyBtn').on('click','#dyBtn', function(event){
            byForms = $(`${that.allOpt.id} .form-dynamic .row`).clone(true); //(第二版 取新版页面上的form)
            oldForms = that.byFormsDom //弹层里需要 最开始jsp里的form
              $.showDialog(_path+"/zdytj/zdytj_cxYhcxtjpzView.html",'自定义查询条件',$.extend(true,{},modifyConfig,{
                  modalName:"dyModal",
                  width:"1200px",
                  buttons:{
                      success : {
                          label : "确定",
                          className : "btn-primary",
                          callback : function() {
                              var param = {
                                  xshs: $('#dyModal .dy-box .selectBox').val(),
                                  mhtjs: '4',
                                  gnmkdm: $("#gnmkdmKey").val(),
                              }

                              var num = 0;
                              var wpzLi = $('#dyModal .dy-box #unselectUl').find('li')
                              wpzLi.each(function(index,item){
                                  param['modelList['+num+'].zd'] = $(item).find('input').val();
                                  param['modelList['+num+'].xssx'] = String(num+1);
                                  param['modelList['+num+'].zt'] = '0';
                                  num=num+1;
                              })

                               var ypzLi = $('#dyModal .dy-box #selectUl').find('li')
                               ypzLi.each(function(indexp,itemp){
                                  param['modelList['+num+'].zd'] = $(itemp).find('input').val();
                                  param['modelList['+num+'].xssx'] = String(num+1);
                                  param['modelList['+num+'].zt'] = '1';
                                  num=num+1;
                              })

                              // console.log(param,'param=')
                              // return
                              $.ajax({
                                  type: "POST",
                                  url : _path+'/zdytj/zdytj_bcYhcxtjpzjmx.html?gnmkdm='+$("#gnmkdmKey").val(),
                                  async: true,
                                  datatype: "json",
                                  data : param,
                                  success: function(data){
                                      if(data){
                                          if(data.code=='1'){
                                              $.success(data.message, function() {
                                                  window.location.reload();
                                                  $.closeModal("dyModal");
                                              });
                                          }else{
                                              $.error(data.message);
                                          }
                                      }else{
                                          $.error('操作失败');
                                      }
                                  }
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
            })
            $(document).on('change', '#wztj select[name="ysf"]', function () {
                console.log($(this).val(),'666')
              if ($(this).val().indexOf("null") > -1) {
                  $(this).parent().next().find('input').attr("disabled", "disabled");
                  $(this).parent().next().find('input').val("");
              } else {
                  $(this).parent().next().find('input').removeAttr("disabled");
              }
            });
            $(document).on('click', '.wztjBox .glyphicon-plus-sign', function () {
              that.getNewHtml()
            });
            $(document).on('click', '.wztjBox .glyphicon-remove-sign', function () {
              $(this).parent().parent().parent().remove();
            });
        }
        DynamicForm.prototype.getDom = function(){
            var htmlStr = '',that = this;
            // console.log(that.allOpt,'allOpt===')
             //更多查询
             var zStr = ``
             if(this.allOpt.columns){
                 this.allOpt.columns.forEach(function(item,index){
                   zStr = zStr+`<option value=${item.name}>${item.label}</option>`
                 })
             }
             //   var syStr = ``; //有空格的字符串有问题
             //   if(that.syList && that.syList.length){
             //     that.syList.forEach(function(item,index){
             //         // syStr=syStr+'<option value='+item.value+'>'+item.key+'</option>'
             //         syStr=syStr+`<option value=${item.value}${index==0?' selected':''}>${item.key}</option>`
             //     })
             //   }
             var syStrHtml = [];
             syStrHtml.push("<option value='='>等于</option>");
             syStrHtml.push("<option value='!='>不等于</option>");
             syStrHtml.push("<option value='like'>包含</option>");
             syStrHtml.push("<option value='not like'>不包含</option>");
             syStrHtml.push("<option value='in'>属于</option>");
             syStrHtml.push("<option value='not in'>不属于</option>");
             syStrHtml.push("<option value='is null'>为空</option>");
             syStrHtml.push("<option value='is not null'>不为空</option>");
             syStrHtml.push("<option value='>='>&gt;=</option>");
             syStrHtml.push("<option value='<='>&lt;=</option>");
             var wztjStr =
                 `
                 <div class="col-sm-6 col-md-4">
                 <div class="form-group">
                     <div class="col-sm-4">
                         <select class="form-control chosen-select" id='mxl1' name='mxl'>
                         <option value="" selected>全部</option>${zStr}
                         </select>
                         <script type="text/javascript">
                             jQuery('#mxl1').trigger("chosen");
                         </script>
                     </div>
                     <div class="col-sm-3">
                         <select id="ysf1" name="ysf" class="form-control chosen-select">
                         ${syStrHtml.join("")}
                         </select>
                         <script type="text/javascript">
                             jQuery('#ysf1').trigger("chosen");
                         </script>
                     </div>
                     <div class="col-sm-4" id="bdsDiv">
                         <input type="text" id="bds1" name="bds" placeholder="请输入表达式" class="form-control">
                     </div>
                     <div class="col-sm-1">
                         <span class="glyphicon glyphicon-plus-sign add-sign wztjan"></span>
                     </div>
                 </div>
                 </div>
             `

            // 复制再清空原来的表单
            $(".by_form select:not([data-toggle='tagTree'])").chosen('destroy');//非树形解绑 否则下拉失效
            $(".by_form select[data-toggle='tagTree']").tagTree('destroy');//树形解绑 否则下拉失效
            that.byFormsDom = $('.by_form .sl_all_form .row').clone(true);
            that.byBtnExtraDom = $('.by_form .sl_aff_btn .extra').clone(true);//查询左侧dom
            var idVal = $('.by_form form').attr('id');
            var nameVal = $('.by_form form').attr('name');
            $('.by_form').remove();
            if(idVal){
                $(that.allOpt.id).find('form').attr('id',idVal)
            }
            if(nameVal){
                $(that.allOpt.id).find('form').attr('name',nameVal)
            }
             //操作
             var openStr = ''
            //  that.formDom = $.dom(formStr)[0];
             that.formDom =  $(that.allOpt.id).find('.side-box')[0]
             that.bods = that.formDom.querySelector('.row-content');
             //操作
             that.opts = that.formDom.querySelector('.opt-zk');
            //更多查询
            that.wztjs = that.formDom.querySelector('.wztjBox');
            if(that.allOpt.mode =='2'){//模式3不可以 因为要修改外层的方法 如果需要的话 这边去掉判断 searchFun传个参
                $(that.wztjs).empty().append(wztjStr);
            }

            $(that.allOpt.id).find('.side-box .extra-box').empty().append(that.byBtnExtraDom);


             //模式3 注：如果在页面上的且都不在未配置已配置的list里 需要展示
            var allList = [];//页面上所有的name值 )
            that.byFormsDom.find('.form-group').each(function(index,item){
                var direct = $(item).children('div');
                var nameDom = '',name = '';
                if($(direct).find('.multi-select-value').length){ //多选的name存在类名为multi-select-value上
                    name = $(direct).find('.multi-select-value').attr('name')
                }else{
                    nameDom = $(direct.find('[name]').not('input[type="hidden"]')[0]); //获取子div下的第一个除了input不为hidden 且带name的标签
                    name = nameDom.attr('name');
                }
                allList.push(name)
            })
            var ypzList = that.list.map(item=>item.name);//已配置的name值

            function getDifference(arr1, arr2, arr3) {
                return arr1.map(function(item) {
                    let dt = arr2.indexOf(item) == -1 && arr3.indexOf(item) == -1;
                    if(dt){
                        return item
                    }
                    return null
                });
            }
            var czList = getDifference(allList,ypzList,that.bxspzmxList) //三个数组的差值 表示在页面上的且都不在未配置已配置的list
            var newCz = [],newCzList = []
            czList = czList.forEach(function(item){
                if(item){
                    newCzList.push(item)
                    newCz.push({name: item})
                }
            })
            czList = newCzList;
            var allNameList = that.list.concat(newCz);
            //console.log( allNameList,'allNameList=')
            if(that.list && that.list.length){
                if(this.allOpt.maxShowNum && that.list && that.list.length>Number(this.allOpt.maxShowNum)){
                    openStr =
                    `
                    <div class="openClose">
                        <label for="" class="openBtn"><span class="txt">展开</span><span class="img-box"><img src="${_systemPath}/images/zk.png"/></span></label>
                    </div>
                    `
                }
                $(that.opts).empty().append(openStr);
                if(that.allOpt.mode =='2'){
                    //模式2 取cxtjList  生成字符串后面塞
                    that.list.forEach(function(item,index){
                        //下拉框
                        if(item.lx =='1'){
                            var aStr = '';
                            if(item.tjList && item.tjList.length){
                                item.tjList.forEach(function(dep,inp){
                                    // var obt = '<option value='+dep.key+' '+dep.key==dep.tjtjz?'selected':''+'>'+dep.value+'</option>'
                                    var obt = `<option value=${dep.key} ${dep.key==item.tjtjz?'selected':''}>${dep.value}</option>`
                                    aStr=aStr+obt;
                                })
                            }
                            var xlkStr =
                            `<div class="col-sm-6 col-md-${that.allOpt.colSmNum}${that.allOpt.maxShowNum && index+1>that.allOpt.maxShowNum?' hiddenBox':''}">
                                    <div class="form-group">
                                        <label for="" class="col-sm-4  control-label">${item.sfbt==1?'<span class="red">*</span>':''}${item.zwmc}</label>
                                        <div class="col-sm-8 xlx">
                                            <input type="hidden" name="hid_select" value='${item.tjtjz}'/>
                                            <select class="form-control chosen-select" id='${item.id}' name='${item.name}' ${item.sfbt==1?'validate="{required:true}"':''}>
                                                <option value="">全部</option>${aStr}
                                            </select>
                                            <SCRIPT type="text/javascript">
                                            jQuery('#${item.id}').trigger("chosen")
                                            </SCRIPT>
                                        </div>
                                    </div>
                                </div>`
                            htmlStr = htmlStr+xlkStr;
                        }
                    //输入框
                        if(item.lx =='2'){
                            var srkStr =
                            `<div class="col-sm-6 col-md-${that.allOpt.colSmNum}${that.allOpt.maxShowNum && index+1>that.allOpt.maxShowNum?' hiddenBox':''}">
                                <div class="form-group">
                                    <label for="" class="col-sm-4 control-label">${item.sfbt==1?'<span class="red">*</span>':''}${item.zwmc}</label>
                                    <div class="col-sm-8 srk">
                                        <input type="hidden" name="hid_input" value='${item.tjtjz}' />
                                        <input type="text" id='${item.id}' name='${item.name}' class="form-control" placeholder='${item.tsy?item.tsy: '请输入'}' ${item.sfbt=='1'? 'validate="{required:true}"': ''} />
                                    </div>
                                </div>
                            </div>`
                            htmlStr = htmlStr+srkStr;
                        }
                        //单选框
                        if(item.lx =='3'){
                            var cStr = '';
                            if(item.tjList && item.tjList.length){
                                if(item.tjtjz){
                                    item.tjList.forEach(function(dep,inp){
                                        var obt = `<label class="radio-inline"><input type="radio" id='${item.id}' name='${item.name}' value='${dep.key}' ${item.tjtjz==dep.key?'checked="checked"':''} />${dep.value}</label>`
                                        cStr=cStr+obt;
                                    })
                                }else{
                                    item.tjList.forEach(function(dep,inp){
                                        var obt = `<label class="radio-inline"><input type="radio" id='${item.id}' name='${item.name}' value='${dep.key}' ${inp==0?'checked="checked"':''} />${dep.value}</label>`
                                        cStr=cStr+obt;
                                    })
                                }
                            }
                            var dxkStr = `<div class="col-sm-6 col-md-${that.allOpt.colSmNum}${that.allOpt.maxShowNum && index+1>that.allOpt.maxShowNum?' hiddenBox':''}">
                                <div class="form-group">
                                    <label for="" class="col-sm-4 control-label">${item.sfbt==1?'<span class="red">*</span>':''}${item.zwmc}</label>
                                    <div class="col-sm-8 dxk">
                                        <input type="hidden" name="hid_radio" value='${item.tjtjz}' />${cStr}
                                    </div>
                                </div>
                            </div>`
                            htmlStr = htmlStr+dxkStr;
                        }
                        //复选框
                        if(item.lx == '4'){
                            var dStr = '';
                            if(item.tjList && item.tjList.length){
                                item.tjList.forEach(function(dep,inp){
                                    var obt = `<label class="checkbox-inline"><input type="checkbox" id='${item.id}' name='${item.name}' value=${dep.key} ${item.sfbt=='1'? 'validate="{required:true}"': ''} />${dep.value}</label>`
                                    dStr=dStr+obt;
                                })
                            }
                            var fxkStr =
                            `<div class="col-sm-6 col-md-${that.allOpt.colSmNum}${that.allOpt.maxShowNum && index+1>that.allOpt.maxShowNum?' hiddenBox':''}">
                                    <div class="form-group">
                                        <label for="" class="col-sm-4 control-label">${item.sfbt==1?'<span class="red">*</span>':''}${item.zwmc}</label>
                                        <div class="col-sm-8 fxk">
                                            <input type="hidden" name="hid_checkbox" value='${item.tjtjz}' />
                                            ${dStr}
                                        </div>
                                    </div>
                                </div>`
                            htmlStr = htmlStr+fxkStr;
                        }
                        //下拉复选框
                        if(item.lx=='5'){
                        var eStr = '';
                        if(item.tjList && item.tjList.length){
                            item.tjList.forEach(function(obj,inp){
                                var obt = `
                                    <div data-xh="${inp}" class="ctb-item">
                                        <input class="default-checkbox primary-checkbox" value="${obj.key}" id="fx_${obj.key}"
                                                type="checkbox" name="multi-item">
                                        <label for="fx_${obj.key}"><i class="glyphicon glyphicon-ok multi-ok"></i>${obj.value}</label>
                                    </div>`
                                eStr=eStr+obt;
                            })
                        }
                        //搜索
                        var searchStr =
                        `<div class="chosen-search">
                            <input type="text" autocomplete="off" name="autocomplete" autofocus>
                        </div>`;
                        //全选
                        var allStr =
                        `<div data-xh="-1" class="ctn-all">
                                <input class="default-checkbox primary-checkbox" value="-1"
                                        type="checkbox" name="multi-item" id="bh_id_-1">
                                <label for="bh_id_-1"><i
                                        class="glyphicon glyphicon-ok multi-ok"></i>全选
                                </label>
                            </div>`
                            //反选
                            var fanStr =
                            `<div data-xh="-2" class="ctn-invert">
                                <input class="default-checkbox primary-checkbox" value="-2"
                                        type="checkbox" name="multi-item" id="bh_id_-2">
                                <label for="bh_id_-2"><i
                                        class="glyphicon glyphicon-ok multi-ok"></i>反选
                                </label>
                            </div>`
                        var xlfxkStr =
                        `<div class="col-sm-6 col-md-${that.allOpt.colSmNum}${that.allOpt.maxShowNum && index+1>that.allOpt.maxShowNum?' hiddenBox':''}">
                                <div class="form-group">
                                <label for="" class="col-sm-4 control-label">${item.sfbt==1?'<span class="red">*</span>':''}${item.zwmc}</label>
                                    <div class="col-sm-8">
                                        <input type="hidden" name="hid_multiple_checkbox" value='${item.tjtjz}'/>
                                        <div class="form-control multi-control">
                                            <input type="hidden" class="multi-select-value" id='${item.name}' name='${item.name}' />
                                            <span class="arrow"></span>
                                            <div class="show-panel"></div>
                                            <ul class="chosen-choices"'></ul>
                                            <div class="multi-ctn">
                                                ${item.search?searchStr:''}
                                                ${item.allSearch?allStr:''}
                                                ${item.fanSearch?fanStr:''}
                                                ${eStr}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`
                            htmlStr = htmlStr+xlfxkStr;
                        }
                    })
                }
                if(that.allOpt.mode =='3'){
                    console.log('3****')
                    //模式3 取pzmxList和原先模板 先塞外层再append(注意 如果在页面上的且都不在未配置已配置的list里 需要展示)
                    // $(that.allOpt.id).empty().append(that.formDom);
                    allNameList.forEach(function(item,index){
                        var dt = $(that.byFormsDom).clone(true).find('[name='+item.name+']');
                        var st= '';
                        if(dt.length){
                            st =  dt.parents('.form-group')[0];
                            var ylId = $(st).parent().attr('id') || '' //原来存在col-sm-6 col-md-3上的id

                            var comStr = `
                            <div id="${ylId}" class="${index}-it col-sm-6 col-md-${that.allOpt.colSmNum}${that.allOpt.maxShowNum && index+1>that.allOpt.maxShowNum?' hiddenBox':''}">${st.outerHTML}</div>
                            `
                            $('.side-box .sl_all_form .row-content').append(comStr);
                            setTimeout(function(){
                                // $('select[data-toggle="tagTree"]').empty();
                                $('.side-box .sl_all_form .row-content .tagtree').remove()
                            })
                            // console.log(st,st.outerHTML,'st==')
                            // $(`.side-box .sl_all_form .row-content .${index}-it`).html(st.outerHTML)
                        } else{
                            console.log(item.name,'不存在的name')
                        }
                        var findInd = allList.findIndex(itemp=>itemp==item.name);
                        if(findInd>-1){
                            allList.splice(findInd,1);
                        }
                    })
                }
            }else{
                console.log('33****')
                //保持原状 取原先模板  先塞外层再append
                var groups = $(that.byFormsDom).find('.form-group').clone(true);
                if(that.allOpt.maxShowNum && groups && groups.length>Number(that.allOpt.maxShowNum)){
                    openStr =
                    `
                    <div class="openClose">
                        <label for="" class="openBtn"><span class="txt">展开</span><span class="img-box"><img src="${_systemPath}/images/zk.png"/></span></label>
                    </div>
                    `
                }
                $(that.opts).empty().append(openStr);
                // $(that.allOpt.id).empty().append(that.formDom);
                groups.each(function(index,item){
                    var ylId = $(item).parent().attr('id') || '' //原来存在col-sm-6 col-md-3上的id
                    var comStr = `
                    <div id="${ylId}" class="${index}-it col-sm-6 col-md-${that.allOpt.colSmNum}${that.allOpt.maxShowNum && index+1>that.allOpt.maxShowNum?' hiddenBox':''}">${$(item)[0].outerHTML}</div>
                    `
                    $('.side-box .sl_all_form .row-content').append(comStr);
//                    $(`.side-box .sl_all_form .row-content .${index}-it`).html($(item))
                })
            }
            //表单项
            if(that.allOpt.mode =='2'){
                console.log('2****')
                $(that.bods).empty().append(htmlStr);
                // $(that.allOpt.id).empty().append(that.formDom)
            }
            setTimeout(function(){
                $(".side-box .sl_all_form select:not([data-toggle='tagTree'])").trigger("chosen");
                $('.side-box .sl_all_form select[data-toggle="tagTree"]').trigger("tagTree");
            })

            $('#dyn_search_go').attr('mode',that.allOpt.mode)

            if(that.allOpt.finallyFun){
                that.allOpt.finallyFun()
            }
        }
        //请求获取list
        DynamicForm.prototype.getList = function(){
            var that =this;
            that.byFormsDom = null;
            that.bxspzmxList = [];
            $(that.allOpt.id).empty().append(formStr);//不提前加的话 校验会失效
            $.ajax({
                type: "GET",
                url : that.allOpt.api,
                data: {},
                success: function(data){
                    // var data = a;
                    if(data){
                        if(data.yhcxtjpz){
                            that.allOpt.xshs = data.yhcxtjpz.xshs? data.yhcxtjpz.xshs:'2'//显示行数
                            if(data.yhcxtjpz.mhtjs){
                              that.allOpt.colSmNum = 12 / Number(data.yhcxtjpz.mhtjs)//每行条件数
                            }else{
                              that.allOpt.colSmNum = '4'
                            }
                            if(data.yhcxtjpz.xshs && data.yhcxtjpz.mhtjs){
                                that.allOpt.maxShowNum =  Number(data.yhcxtjpz.xshs) * Number(data.yhcxtjpz.mhtjs)
                            }else{
                              that.allOpt.maxShowNum = 0
                            }
                        }else{
                            that.allOpt.xshs = '2';
                            that.allOpt.colSmNum = '4';
                            that.allOpt.maxShowNum = 0
                        }
                        if(that.allOpt.mode =='2'){
                            that.list = data.cxtjList?data.cxtjList:[];
                        }else if(that.allOpt.mode =='3'){
                            that.list = data.pzmxList?data.pzmxList:[];
                            var bxs = data.bxspzmxList?data.bxspzmxList:[];
                            that.bxspzmxList = bxs.map(item=>item.name);//已配置的name值

                        }
                    } else{
                        that.allOpt.xshs = '2';
                        that.allOpt.colSmNum = '4';
                        that.allOpt.maxShowNum = 0
                        that.list = [];
                    }
                    that.getDom();
                }
            });
        }
        //改变参数
        DynamicForm.prototype.changeOpt = function(data){
            var that = this;
            that.allOpt = Object.assign({},that.allOpt,data)
            if(data.api){
                console.log(data.api,'api')
                //请求
                that.getList()
            }
        }
        $.DynamicForm = DynamicForm;
    }(jQuery))
