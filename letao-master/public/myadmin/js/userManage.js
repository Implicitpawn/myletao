$(function(){
    checkUser();
    var page =1;
    var pageSize =5;
    var total = null;
    var rand = function(){
        getUser({
            page:page,
            pageSize:pageSize
        },function(data){
            var html = template('tables_tem',data);
            $('.table>tbody').html(html)
            randPage();
        });
    }
    var getUser = function(data,callback){
        $.ajax({
            url:'/user/queryUser',
            type:'get',
            data:data,
            dataType:'json',
            success:function(data){
                console.log(data);
                total = data.total;
                callback && callback(data)
            }
        })
    }
    rand();
    $('.table').off('click','.btn').on('click','.btn',function(){
        var id = $(this).attr('data-id');
        var username = $(this).attr('data-name');
        console.log(id);
        var stutas = $(this).html();
        console.log(stutas);
        $('#mymodal').modal('show');
        $('#mymodal .modal-body>p').html('<span class="glyphicon glyphicon-info-sign"></span>'+'您确定'+stutas+':'+username+'?');
        stutas = stutas=='启用' ?1 :0;
        $('#mymodal').off('click','.btn-primary').on('click','.btn-primary',function(){
            $.ajax({
                url:'/user/updateUser',
                type:'post',
                data:{id:id,isDelete:stutas},
                dataType:'json',
                success:function(data){
                    if (data.success) {
                        console.log(data);
                        rand();
                        $('#mymodal').modal('hide');
                    }
                }
            })
        })            
    })
    var randPage = function(){
        getPageNum(total);
    }
    var getPageNum = function(total,pages){
        total = Math.ceil(total/pageSize);
        $('#page').bootstrapPaginator({
            bootstrapMajorVersion: 3,//bootstrap版本
            currentPage: page,//当前页码
            totalPages: total,//总页数（后台传过来的数据）
            numberOfPages: 3,//一页显示几个按钮
            itemTexts: function (type, page, current) {
                switch (type) {
                    case "first": return "首页";
                    case "prev": return "上一页";
                    case "next": return "下一页";
                    case "last": return "末页";
                    case "page": return page;
                }
            },//改写分页按钮字样
            onPageClicked: function (event, originalEvent, type, page) {
                getUser({
                    page:page,
                    pageSize:pageSize
                },function(data){
                    var html = template('tables_tem',data);
                    $('.table>tbody').html(html)
                });
            }
        });
    }
    
})