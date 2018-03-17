$(function(){
    $('#login').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
            username:{
                validators:{
                    notEmpty:{
                        message:'用户名不能为空'
                    },
                    callback:{
                        message:'用户名存在'
                    }
                }
            },
            password:{
                validators:{
                    notEmpty:{
                        message:'密码不能为空'
                    },
                    callback:{
                        message:'密码错误！'
                    },
                    stringLength: {  
                        min: 6,  
                        max: 18,  
                        message: '请输入6-18位字母或数字！'  
                    }
                }
            }
        }
    }).on('success.form.bv', function(e){
        e.preventDefault();
        var values = $(e.target);
        console.log(values.serialize())
        $.ajax({
            url:'/employee/employeeLogin',
            type:'post',
            data:values.serialize(),
            dataType:'json',
            success:function(data){
                if (data.success) {
                    location.href = '../myadmin/index.html';
                }else{
                    values.data('bootstrapValidator').disableSubmitButtons(false);
                    if (data.error==1000) {
                        values.data('bootstrapValidator').updateStatus('username','INVALID','callback');
                    }
                    else if (data.error==1001) {
                        values.data('bootstrapValidator').updateStatus('password','INVALID','callback');
                    }
                }
            }
        })
    });
    $('[type="reset"]').on('click',function(){
        $('#login').data('bootstrapValidator').resetForm();
    });
})