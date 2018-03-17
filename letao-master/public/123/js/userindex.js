$(function(){
    function getUserMag(callback){
        addCart({
            url:'/user/queryUserMessage',
            type:'get',
            dataType:'json',
            success:function(date){
                callback && callback(date);
            }
        })
    }
    function getLoginout(callback){
        addCart({
            url:'/user/logout',
            type:'get',
            dataType:'json',
            success:function(date){
                callback && callback(date);
            },
            error:function(){
                mui.toast('服务器繁忙！')
            }
        })
    }
    getUserMag(function(date){
        $('.mui-table-view>li:nth-child(1)>a>div').find('span').html(date.username).siblings('p').html(date.mobile)
    })
    $('.loginout').on('tap','a',function(){
        getLoginout(function(date){
            if (date.success) {
                mui.confirm('是否确认退出?','温馨提示',['是','否'],function(e){
                    if (e.index==0) {
                        location.href='/123/user/login.html'
                    }
                })
            }
        })
    })
})