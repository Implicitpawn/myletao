$(function(){
    var product_page = 1;
    var product_size = 3;
    var rander = function(){
        getProduct({
            page:product_page,
            pageSize:product_size
        },function(data){
            $('.table>tbody').html(template('product_tem',data));
            getProduct_page(product_page,Math.ceil(data.total/data.size))
        })
    }
    //初始化页面
    rander();
    //初始化文件上传
    getFiles()
    //初始化模态框
    $('.add_btn').click(function(){
        $('#addModal').modal('show');
    })
    //自定义表单验证规则
    //自定义文件验证
    $.fn.bootstrapValidator.validators.checkPic = {
        validate:function (validate, $field, options) {
            if(result.length !=3) return {valid: false, message: '请上传三张图片'};
            return true;
        }
    }
    //自定义库存验证
    $.fn.bootstrapValidator.validators.checkNum = {
        validate:function(validate,$field,options) {
            var num = $.trim($field.val());
            if (!num) return {valid: false,message:'请输入商品价格'};
            if (!/^[0-9]\d*$/.test(num)) return {valid: false, message: '请输入合法价格'};
            return true;
        }
    }
    //自定义价格验证
    $.fn.bootstrapValidator.validators.checkPrice = {
        validate:function(validate,$field,options) {
            var price = $.trim($field.val());
            if (!price) return {valid: false,message:'请输入商品价格'};
            if (!/^[0-9]\d*$/.test(price)) return {valid: false, message: '请输入合法价格'};
            return true;
        }
    }
    $.fn.bootstrapValidator.validators.checkOldPrice = {
        validate:function(validate,$field,options) {
            var olPprice = $.trim($field.val());
            if (!olPprice) {
                return {valid:false,message:'请输入商品原价格'};
            }
            if (!/^[0-9]\d*$/.test(olPprice)) {
                return {valid:false,message:'请输入合法价格'};
            }
            return true;
        }
    }
    //自定义尺寸验证，目前还不严谨
    $.fn.bootstrapValidator.validators.checkSize = {
        validate:function(validate,$field,options) {
            var sizes = $.trim($field.val());
            if (!sizes) {
                return {valid:false,message:'请输入商品尺寸'};
            }
            if (!/^[0-9]{2}-[0-9]{2}$/.test(sizes)) {
                return {valid:false,message:'请输入合法价格,例如40-50'};
            }
            return true;
        }
    }
    //验证
    $('#product_form').bootstrapValidator({
        //清楚默认样式，让隐藏域可以表单序列化
        excluded: [],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
            proName:{
                validators:{
                    notEmpty:{
                        message:'请输入商品名称'
                    }
                }
            },
            proDesc:{
                validators:{
                    notEmpty:{
                        message:'请描述商品'
                    }
                }
            },
            num:{
                validators:{
                    checkNum:{}
                }
            },
            price:{
                validators:{
                    checkPrice:{}
                }
            },
            oldPrice:{
                validators:{
                    checkOldPrice:{}
                }
            },
            size:{
                validators:{
                    checkSize:{}
                }
            },
            pic:{
                validators:{
                    checkPic:{}
                }
            }
        }
    }).on('success.form.bv',function(e){//成功后进行请求发送相关数据
        e.preventDefault();
        var $product_form= $(e.target);
        var str = '';
        $(result).each(function(index,pd){
            str += '&'+'picAddr'+(index+1)+'='+pd.picAddr+'&'+'picName'+(index+1)+'='+pd.picName;
        })
        //已表单序列化的格式传输数据
        var newdata = $product_form.serialize()+str;
        console.log(newdata)
        $.ajax({
            type:'post',
            url:'/product/addProduct',
            data:newdata,
            dataType:'json',
            success:function(data){
                if (data.success) {
                    $('#addModal').modal('hide');
                    //重新获取页面信息
                    product_page =1;
                    product_size=3;
                    getProduct({
                        page:product_page,
                        pageSize:product_size
                    },function(data){
                        $('.table>tbody').html(template('product_tem',data));
                        getProduct_page(product_page,Math.ceil(data.total/data.size))
                    })
                    $('#product_form')[0].reset();
                    $('#product_form').data('bootstrapValidator').resetForm();
                    $('.files_add').html('');
                    result =[];
                }
            }
        })
    })
})
//获取商品信息
var getProduct = function(parms,callback){
    $.ajax({
        type:'get',
        url:'/product/queryProductDetailList',
        data:parms,
        dataType:'json',
        success:function(data){
            callback&&callback(data)
        }
    })
}
//分页初始化
var getProduct_page = function(nowpage,total){
    $('#page').bootstrapPaginator({
        bootstrapMajorVersion: 3,//bootstrap版本
        currentPage: nowpage,//当前页码
        totalPages: total,//总页数（后台传过来的数据）
        numberOfPages: 3,//一页显示几个按钮
        //自定义样式
        itemTexts: function (type, page, current) {
            switch (type) {
                case "first": return "首页";
                case "prev": return "上一页";
                case "next": return "下一页";
                case "last": return "末页";
                case "page": return page;
            }
        },
        onPageClicked: function(event,originalEvent,type,page){
            product_page = page;
            product_size = 3;
            getProduct({
                page:product_page,
                pageSize:product_size
            },function(data){
                $('.table>tbody').html(template('product_tem',data));
            });
        }
    })
}
var result = [];
//获取文件/文件上传
var getFiles = function(){
    $('[name="pic1"]').fileupload({
        dataType: 'json',
        done: function (e, data) {
            if (result.length<3) {
                $('.files_add').append('<img src='+data.result.picAddr+' height="100">');
                result.push(data.result);
                if (result.length==3) {
                    $('#product_form').data('bootstrapValidator').updateStatus('pic','VALID');
                }
            }
        }
    });
}

//控制商品状态//待续*********
//重新编辑商品//待续*********