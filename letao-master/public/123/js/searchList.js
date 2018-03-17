$(function(){
    var key = $.trim(location_search().key) || '';
    console.log(location_search().key);
    var page = 1;
    var i =1;
    var pageSize = 10;
    var count = null;
    var size = null;
    $('.it_search>form>input').val(key);
    $('.it_search').on('tap','form a',function(){
        var key = $('.it_search>form>input').val();
        setLocalStorage(key);
        getProduct({
            proName:key,
            page:page,
            pageSize:pageSize 
        },function(date){
            setTimeout(function(){
                var html = template('search_list',date)
                $('.it_product').html(html);
            },2000)
        })
        location.href="/123/searchList.html?key="+key;
    })
    $('.it_order').on('tap','a',function(){
        if($(this).hasClass('order_active')){
            if($(this).find('span').hasClass('fa-angle-down')){
                $(this).find('span').removeClass('fa-angle-down').addClass('fa-angle-up');
            }else{
                $(this).find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
            }
        }else {
            $(this).addClass('order_active').siblings('a').removeClass('order_active');
            $(this).siblings('a').find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
        }
        var keys = $(this).attr('data-type');
        var value = $(this).find('span').hasClass('fa-angle-down') ?1 :2;
        if(keys){
            if(keys=='price'){
                console.log(keys,value)
                getProduct({
                    proName:key,
                    page:page,
                    pageSize:pageSize,
                    price:value
                },function(date){
                    var html = template('search_list',date)
                    $('.it_product').html(html);
                })
            }
           else if(keys=='num'){
                console.log(keys,value)
                getProduct({
                    proName:key,
                    page:page,
                    pageSize:pageSize,
                    num:value
                },function(date){
                    var html = template('search_list',date)
                    $('.it_product').html(html);
                })
            }
            
        }
    })
    $('.it_product').on('tap','a button',function(){
        var id = $(this).attr('data-id');
        location.href= '/123/product.html?id='+id;
    })
    mui.init({
        pullRefresh : {
          container:".it_warpper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
          down : {
            // style:'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
            // color:'#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
            // height:'50px',//可选,默认50px.下拉刷新控件的高度,
            // range:'100px', //可选 默认100px,控件可下拉拖拽的范围
            // offset:'0px', //可选 默认0px,下拉刷新控件的起始位置
            auto: false,//可选,默认false.首次加载自动上拉刷新一次
            // callback :pullfresh-function //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            callback :function(){
                /*注意：下拉操作完成之后 业务 */
                /*模拟一次向后台发送请求 响应之后的时间消耗*/
                var that = this;/*这个是下拉组件对象  对象当中含有终止下拉操作的方法*/
                /*当前页码*/
                /*开发真实的业务*/
                /*下拉效果隐藏*/
                // page++ 
                i =1;
                pageSize = 10;
                setTimeout(function(){
                    getProduct({
                        proName:key,
                        page:page,
                        pageSize:pageSize 
                    },function(date){
                        var html = template('search_list',date)
                        $('.it_product').html(html);
                    })
                    that.endPulldownToRefresh();
                },1000)
            }
          },
          up:{
            contentnomore:'到底啦',
            callback :function(){
                var that = this;/*这个是下拉组件对象  对象当中含有终止下拉操作的方法*/
                if(count>=10 && count==size){
                    i++;
                    pageSize = i*10;
                    setTimeout(function(){
                        that.endPullupToRefresh();
                    },1000)
                }
                setTimeout(function(){
                    getProduct({
                        proName:key,
                        page:page,
                        pageSize:pageSize 
                    },function(date){
                        var html = template('search_list',date)
                        $('.it_product').html(html);
                    })
                },1000)
                if(count<size){
                    that.endPullupToRefresh(true);
                }
                }
            }
         }
    })
    function getProduct(parms,callback){
      $.ajax({
        url:'/product/queryProduct',
        type:'get',
        data:parms,
        dataType:'json',
        success:function(date){
            console.log(date)
            //获取数据条数，和后台每次获取数据的条数
            count = date.data.length;
            size = date.size;
            callback && callback(date)
        }
      })  
    }
    getProduct({
            proName:key,
            page:page,
            pageSize:pageSize 
        },function(date){
            setTimeout(function(){
                var html = template('search_list',date)
                 $('.it_product').html(html);
        },2000)
    })
})