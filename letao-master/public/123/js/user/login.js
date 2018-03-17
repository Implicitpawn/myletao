$(function(){
    $('.mui-btn-primary').click(function(){
        var username = $("[name='username']").val();
        var password = $("[name='password']").val();
        var search = location.search;
        if (search.indexOf('?returnUrl=') > -1) {
            search = search.replace('?returnUrl=','');
        }
        console.log(search)
        if (!username) {
            mui.toast('请输入用户名！')
            return false;
        }
        else if (!password){
            mui.toast('请输入密码！')
            return false;
        }
        $.ajax({
            url:'/user/login',
            type:'post',
            data:{
                username:username,
                password:password
            },
            dataType:'json',
            success:function(date){
                console.log(date)
                if (date.success) {
                    if (search) {
                        location.href = search;
                    }else{
                        location.href='/123/user/index.html'
                    }
                    
                }else{
                    mui.toast('用户名或密码错误！')
                }
            }
        })
    })
})