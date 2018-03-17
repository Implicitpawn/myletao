$(function(){
    $(window).ajaxStart(
        function(){
            NProgress.start()
        }
    );
    $(window).ajaxStop(
        function(){
            NProgress.done()
        }
    );
    // checkUser();
    $('.menu_toggle').on('click',function(){
        $('.asider_left').toggle();
        $('.asider_right').toggleClass('se_nume')
    })
    $('.login_out').on('click',function(){
        var html = '<div class="modal fade" tabindex="-1" role="dialog" id="mymodals">'+
                        '<div class="modal-dialog" role="document">'+
                            '<div class="modal-content">'+
                                '<div class="modal-header">'+
                                    '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
                                    '<h4 class="modal-title">温馨提示</h4>'+
                                '</div>'+
                                '<div class="modal-body">'+
                                    '<p class="text-danger"><span class="glyphicon glyphicon-info-sign"></span>您确定退出后台系统吗？</p>'+
                                '</div>'+
                                '<div class="modal-footer">'+
                                    '<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>'+
                                    '<button type="button" class="btn btn-primary">确定</button>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
        console.log(html)
        $('body').append(html);
        $('#mymodals').modal('show');
        $('#mymodals .btn-primary').on('click',function(){
            console.log(123)
            $.ajax({
                url:'/employee/employeeLogout',
                type:'get',
                dataType:'json',
                success:function(data){
                    if (data.success) {
                        location.href = '../myadmin/login.html';
                        // $('#mymodal').modal('show');
                    }
                }
            })
        })
    })
    $('.category_now').on('click',function(){
        $('.asider_category').slideToggle().parent().addClass('now');
        $('.asider_category').parent().siblings().removeClass('now');
        console.log(123)
    })
})
window.checkUser = function(callback){
    $.ajax({
        url:'/employee/checkRootLogin',
        type:'get',
        dataType:'json',
        success:function(data){
            if (data.success) {
                callback && callback(data)
            }else{
                location.href = '../myadmin/login.html';
                return false;
            }
        }
    })
    // $.ajax({
    //     url:options.url,
    //     type:options.type||'get',
    //     data:options.data||'',
    //     dataType:options.dataType||'json',
    //     success:function(data){
    //         if (data && data.error==400) {
    //             location.href = '../myadmin/login.html';
    //             return false;
    //         }else{
    //             options.success&&options.success(data)
    //         }
    //     }
    // })
}