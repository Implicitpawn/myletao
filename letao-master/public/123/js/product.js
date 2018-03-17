
//初始化区域滚动
mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});
mui('.it_warpper').scroll({
    scrollY: true, //是否竖向滚动
    scrollX: false, //是否横向滚动
    startX: 0, //初始化时滚动至x
    startY: 0, //初始化时滚动至y
    indicators: false, //是否显示滚动条
    deceleration:0.0006, //阻尼系数,系数越小滑动越灵敏
    bounce: true//是否启用回弹
});
$(function(){
  var product_id = location_search().id;
  var num = null;
  var pageSize = null;
  var input_value = null;
  var data = {};
  function getProduct(callback){
    setTimeout(function(){
      $.ajax({
        url:'/product/queryProductDetail',
        type:'get',
        data:{id:product_id},
        dataType:'json',
        success:function(date){
          var sizes = date.size.split('-');
          var newsize = [];
          for(var i =sizes[0];i<=sizes[1];i++){
            newsize[i-sizes[0]] = i;
          }
          date.size = newsize;
          console.log(date);
          callback && callback(date);
        }
      })
    },1000)
    
  }
  getProduct(function(date){
    var html = template('product_bb',date);
    $('.mui-scroll-warpper').html(html)
    //获得slider插件对象 初始化轮播图
    var gallery = mui('.mui-slider');
    gallery.slider({
    interval:1000//自动轮播周期，若为0则不自动播放，默认为0；
    });
    num = date.num;
  })
  $('.mui-scroll-warpper').on('touchstart','.product_banner ul li .product_left',function(){
    input_value = $(this).siblings('input').val();
    input_value = parseInt(input_value);
    console.log(input_value)
    if(input_value>0){
      input_value--
      $(this).siblings('input').val(input_value)
    }else{
      input_value=0
    }
    $(this).addClass('touch_active')
  }).on('touchstart','.product_banner ul li .product_right',function(){
    input_value = $(this).siblings('input').val();
    input_value = parseInt(input_value);
    if(input_value<num){
      input_value++
      $(this).siblings('input').val(input_value)
    }else{
      input_value=num
    }
    $(this).addClass('touch_active')
  }).on('tap','.product_banner ul li:nth-child(3) span',function(){
    $(this).addClass('product_active').siblings('span').removeClass('product_active')
    pageSize = $(this).html();
    console.log(pageSize)
  }).on('touchend','.product_banner ul li .product_left',function(){
    $(this).removeClass('touch_active');
  }).on('touchend','.product_banner ul li .product_right',function(){
    $(this).removeClass('touch_active');
  })
  $('.btn_car').on('tap','a',function(){
    // location.href = '/123/index.html?returnUrl='+location.pathname+location.search;
    data.size = pageSize;
    data.productId = product_id;
    data.num = input_value;
    if(!data.size){
      mui.toast('请选择尺码!');
      return false;
    }
    else if(!data.num){
      mui.toast('请选择商品数量!');
      return false;
    }
    console.log(data)
    getAjax(data,function(date){
        mui.confirm('添加购物车成功，是否进入购物车？','温馨提示',['是','否'],function(e){
          if (e.index==0) {
            location.href='/123/cart.html'
          }
        })
        console.log(1)
    })
  })
})
function getAjax(data,callback){
  addCart({
    url:'/cart/addCart',
    data:data,
    type:'post',
    dataType:'json',
    success:function(date){
      callback && callback(date)
    },
    error:function(){
        mui.toast('服务器繁忙！');
    }
  })
}  