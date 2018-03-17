$(function(){
    function getCartList(callback){
        addCart({
            url:'/cart/queryCart',
            type:'get',
            dataType:'json',
            success:function(date){
                console.log(date);
                callback && callback(date);
            }
        })
    }
    mui.init({
        pullRefresh : {
        container:".it_warpper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {
                // contentover : "释放立即刷新",
                // contentdown : "下拉可以刷新",
                auto: true,//可选,默认false.首次加载自动上拉刷新一次
                callback:function(){
                    $('.mui-pull-top-pocket').css('zIndex','-1')
                    var that = this;/*这个是下拉组件对象  对象当中含有终止下拉操作的方法*/
                    setTimeout(function(){
                        getCartList(function(date){
                            var data = {};
                            data.datas = date;
                            var html = template('cart_template',data);
                            $('.mui-scrolls>ul').html(html);
                        })
                       that.endPulldownToRefresh();
                    },1000)
                    
                }
            }
        }
    })
    
    var num = null;
    $('.mui-scrolls').on('change','ul li a input',function(){
        if ($(this).is(':checked')) {
            var thisnum = $(this).siblings('div').find('p').eq(1).find('span').first().html();
            var shuang = $(this).siblings('div').find('p').eq(1).find('span').last().html();
            thisnum=parseFloat(thisnum.substr(1));
            shuang=parseFloat(shuang.substr(1));
            num += thisnum*shuang;
            console.log(shuang)
        }
        else if(!$(this).is(':checked')){
            var thisnum = $(this).siblings('div').find('p').eq(1).find('span').first().html();
            var shuang = $(this).siblings('div').find('p').eq(1).find('span').last().html();
            shuang=parseFloat(shuang.substr(1));
            thisnum=parseFloat(thisnum.substr(1));
            num -= thisnum*shuang;
        }
        $('.order>span').html('订单总额：￥'+Math.floor(num*100)/100)

    }).on('tap','ul>li>div>a:last-child',function(){
        that =$(this);
        var productId = $(this).attr('data-id');
        mui.confirm('确定删除该商品？','温馨提示',['是','否'],function(e){
            if (e.index==0) {
                addCart({
                    url:'/cart/deleteCart',
                    type:'get',
                    data:{id:productId},
                    dataType:'json',
                    success:function(date){
                        mui.toast('商品移除成功！');
                        $(that).parent().parent().remove()
                    }
                })
            }
        })
    }).on('tap','ul>li>div>a:first-child',function(){
        that = $(this);
        getCartList(function(date){
            var upsize = [];
            var dataupdate = {};
            var newsize = null;
            var newnum = null;
            var id = $(that).siblings('a').attr('data-id')
            for(var i =0; i<date.length; i++){
                for(var key in date[i]){
                    if (date[i][key]==id) {
                        dataupdate = date[i];
                        var size_arr = date[i].productSize.split('-');
                        console.log(size_arr)
                        for(var i =size_arr[0];i<=size_arr[1];i++){
                            upsize[i-size_arr[0]] =i;
                        }
                        dataupdate.sizess = upsize;
                        break;
                    }
                }
            }
            var updatehtml = template('updatecart',dataupdate);
            
            updatehtml = updatehtml.replace(/[\r\n]/g, "");
            mui.confirm(updatehtml,'修改商品',['确定','退出'],function(e){
                if (e.index==0) {
                    addCart({
                        url:'/cart/updateCart',
                        type:'post',
                        data:{id:id,size:newsize,num:newnum},
                        dataType:'json',
                        success:function(date){
                            mui.toast('编辑商品成功！');
                            getCartList(function(date){
                                var data = {};
                                data.datas = date;
                                var html = template('cart_template',data);
                                $('.mui-scrolls>ul').html(html);
                            })
                        }
                    })
                }
            })
            console.log($('.update_size>span'))
            $('.update_size>span').each(function(index,d){
                if($(d).html()==dataupdate.size){
                    $(d).addClass('size_active')
                    console.log(1)
                }
            })
            $('.update_size').on('tap','span',function(){
                $(this).addClass('size_active').siblings('span').removeClass('size_active');
                newsize = $(this).html();
            })
            $('.update_num').on('touchstart','span:first-child',function(){
                newnum = $(this).siblings('.num').html();
                if (newnum>0) {
                    newnum--;
                }else{
                    newnum=0;
                }
                $(this).siblings('.num').html(newnum);
                $(this).addClass('num_active');
            }).on('touchend','span:first-child',function(){
                $(this).removeClass('num_active')
            }).on('touchstart','span:last-child',function(){
                newnum = $(this).siblings('.num').html();
                if (newnum<dataupdate.productNum) {
                    newnum++;
                }else{
                    newnum=dataupdate.productNum;
                }
                $(this).siblings('.num').html(newnum);
                $(this).addClass('num_active');
            }).on('touchend','span:last-child',function(){
                $(this).removeClass('num_active');
            })
        })
    })
})