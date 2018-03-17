$(function(){
    $('.add_btn').click(function(){
        $('#myModal_first').modal('show')
    })
    var first_page = 1;
    var first_pageSize = 3;
    getFirstcategory({
        page:first_page,
        pageSize:first_pageSize
    },function(data){
        $('.table>tbody').html(template('first_tem',data));
        gerPage_first(data.page,Math.ceil(data.total/data.size));
    })
    //表单验证************
    $('#first_form').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
            categoryName:{
                validators:{
                    notEmpty:{
                        message:'请输入一级分类名称'
                    }
                }
            }
        }
    }).on('success.form.bv', function(e){
        console.log(123)
        e.preventDefault();
        var $first_form = $(e.target);
        $.ajax({
            type:'post',
            url:'/category/addTopCategory',
            data:$first_form.serialize(),
            dataType:'json',
            success:function(data){
                if (data.success) {
                    $('#myModal_first').modal('hide');
                    first_page =1;
                    getFirstcategory({
                        page:first_page,
                        pageSize:first_pageSize
                    },function(data){
                        $('.table>tbody').html(template('first_tem',data));
                        gerPage_first(data.page,Math.ceil(data.total/data.size));
                        //表单样式重置**********
                        $('#first_form').data('bootstrapValidator').resetForm();
                        $('#first_form').find('input').val('');
                    })
                }
            }
        })
    })
})
//查询一级分类
var getFirstcategory = function(prams,callback){
    $.ajax({
        type:'get',
        url:'/category/queryTopCategoryPaging',
        data:prams,
        dataType:'json',
        success:function(data){
            console.log(data);
            callback && callback(data);
        }
    })
}
//分页***********
var gerPage_first = function(first_page,total){
    var first_pageSize = 3;
    $('#page').bootstrapPaginator({
        bootstrapMajorVersion: 3,//bootstrap版本
        currentPage: first_page,//当前页码
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
        },//改写分页按钮字
        onPageClicked: function (event, originalEvent, type, page) {
            getFirstcategory({
                page:page,
                pageSize:first_pageSize
            },function(data){
                $('.table>tbody').html(template('first_tem',data));
            });
        }
    })
}