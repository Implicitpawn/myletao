$(function(){
    var second_page = 1;
    var second_size = 4;
    var rander = function(second_page,second_size){
        getSecondCate({
            page:second_page,
            pageSize:second_size
        },function(data){
            $('.table>tbody').html(template('second_tem',data));
            getSecondPage(data.page,Math.ceil(data.total/data.size));
        })
    }
    rander(second_page,second_size);
    var getSecondPage = function(secondpage,total){
        $('#page').bootstrapPaginator({
            bootstrapMajorVersion: 3,//bootstrap版本
            currentPage: secondpage,//当前页码
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
                rander(page,second_size);
            }
        })
    }
    $('.add_btn').click(function(){
        $('#myModal_second').modal('show');
        getFirst();
    })
    $(function () {
        $('[name="pic1"]').fileupload({
            dataType: 'json',
            done: function (e, data) {
                $('[name="brandLogo"]').val(data.result.picAddr);
                $('.file_img').attr('src',data.result.picAddr);
                $('#second_form').data('bootstrapValidator').updateStatus('brandLogo','VALID');
            }
        });
    });
    $('#second_form').bootstrapValidator({
        //清楚默认样式，让隐藏域可以表单序列化
        excluded:[],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
            categoryId:{
                validators:{
                    notEmpty:{
                        message:'请选择品牌分类'
                    }
                }
            },
            brandName:{
                validators:{
                    notEmpty:{
                        message:'请输入品牌名称'
                    }
                }
            },
            brandLogo:{
                validators:{
                    notEmpty:{
                        message:'请上传图片'
                    }
                }
            }
        }
    }).on('success.form.bv',function(e){
        e.preventDefault();
        var $form = $(e.target);
        $.ajax({
            type:'post',
            url:'/category/addSecondCategory',
            data:$form.serialize(),
            dataType:'json',
            success:function(data){
                if (data.success) {
                    console.log(132);
                    $('#myModal_second').modal('hide');
                    second_page =1;
                    rander(second_page,second_size);
                    $('#second_form')[0].reset();
                    $('#second_form').data('bootstrapValidator').resetForm();
                    $('#dropdownMenu1>span:first-child').html('请选择一级分类名称');
                    $('#second_form').find('img').attr('src','images/none.png');
                    $('[type="hidden"]').val('');
                }
            }
        })
    })
})
var getSecondCate = function(parms,callback){
    $.ajax({
        type:'get',
        url:'/category/querySecondCategoryPaging',
        data:parms,
        dataType:'json',
        success:function(data){
            console.log(data)
            callback&&callback(data);
        }
    })
}
var getFirst = function(){
    $.ajax({
        type:'get',
        url:'/category/queryTopCategoryPaging',
        data:{page:1,pageSize:5},
        dataType:'json',
        success:function(data){
            $.ajax({
                type:'get',
                url:'/category/queryTopCategoryPaging',
                data:{page:1,pageSize:data.total},
                dataType:'json',
                success:function(data){
                    $('.dropdown-menu').html(template('getselect',data));
                    $('.dropdown-menu').on('click','a',function(){
                        $('#dropdownMenu1>span:first-child').html($(this).html());
                        $('.hide_select').val($(this).attr('data-ids'));
                        console.log($(this).attr('data-ids'));
                        $('#second_form').data('bootstrapValidator').updateStatus('categoryId','VALID');
                    })
                }
            })
        }
    })
}

