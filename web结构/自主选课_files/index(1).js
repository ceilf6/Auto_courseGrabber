(function($) {
    /** options  {id: xxx,api:}
     *  id  是在哪个弹窗底下
     *  key 后端的id 不能重复
     *  
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
        `<div class="dy-explan" style="position:absolute;top:5px;left:10px;">
            <span  class="btn btn-primary btn-sm explan-edit" style="cursor:pointer;"> 修改说明 </span>
            <span  class="btn btn-primary btn-sm explan-look" style="cursor:pointer;"> 查看 </span>
        </div>`;
        function DynamicForm(options,age){
            this.defaultOpt = {
                id: '',
                tabId: '',
            }
            this.allOpt = Object.assign({},this.defaultOpt,options)

            //初始化事件
            this.bindFun()
            this.init();
        }
        DynamicForm.prototype.init = function(){
            var that = this;
            that.formDom = $.dom(formStr)[0];
            $('#'+ that.allOpt.id +' .modal-footer').css('position','relative');
            if(!$('#'+ that.allOpt.id +' .modal-footer .dy-explan').length){
                $('#'+ that.allOpt.id +' .modal-footer').prepend(that.formDom)
            }
        }
        DynamicForm.prototype.bindFun = function(){
            var that = this
            //查看
            $(document).off('click','#'+this.allOpt.id+' .explan-look').on('click','#'+this.allOpt.id+' .explan-look', function(e){
               console.log('查看')
              //  var idVal = $('#gnmkdmKey').val();
              //  if(that.allOpt.tabId){
              //    idVal = idVal + '_' + that.allOpt.tabId
              //  }
              //  if(that.allOpt.id){
              //   idVal = idVal + '_' + that.allOpt.id
              // }
              if(!that.allOpt.key){
                $.alert('请传入唯一标识')
              }
               $.showDialog(_path+"/smxx/smxx_cxCkSmxx.html?id="+that.allOpt.key,'查看',{
                modalName:"ckModal",
                width:"1200px",
                buttons:{
                    cancel : {
                        label : "关 闭",
                        className : "btn-default"
                    }
                }
             });
            })
            //编辑
            $(document).off('click','#'+this.allOpt.id+' .explan-edit').on('click','#'+this.allOpt.id+' .explan-edit', function(e){
                console.log('编辑')
              //   var idVal = $('#gnmkdmKey').val();
              //   if(that.allOpt.tabId){
              //     idVal = idVal + '_' + that.allOpt.tabId
              //   }
              //   if(that.allOpt.id){
              //    idVal = idVal + '_' + that.allOpt.id
              //  }
                if(!that.allOpt.key){
                  $.alert('请传入唯一标识')
                }
                $.showDialog(_path+"/smxx/smxx_cxXgSmxx.html?id="+that.allOpt.key,'修改说明',$.extend(true,{},modifyConfig,{
                  modalName:"xgModal",
                  width:"1200px",
                  buttons:{
                      success : {
                          label : "确定",
                          className : "btn-primary",
                          callback : function() {
                              var data = returnData();
                              var param = {
                                id: that.allOpt.key,
                                smxx: data
                              }
                              $.ajax({
                                type: "POST",
                                url : _path+'/smxx/smxx_cxBcSmxx.html',
                                async: true,
                                datatype: "json",
                                data : param,
                                success: function(data){
                                    if(data == "操作成功"){
                                          $.success(data, function() {
                                            $.closeModal("xgModal");
                                        });
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
        }
        //改变参数
        DynamicForm.prototype.changeOpt = function(data){
            var that = this;
            that.allOpt = Object.assign({},that.allOpt,data)
        }
        $.explan = DynamicForm;
    }(jQuery))
    