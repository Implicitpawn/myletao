//左列表区域滑动
mui('.lt_cateLeft').scroll({
    indicators:false
});
//左列表区域滑动
var scrollRight = mui('.lt_cateRight').scroll({
    indicators:false
});
$(function(){
    getFirstCategoryData(function(date){
        $('.lt_cateLeft').find('ul').html(template('firstCategory',date));
        getSecondCategoryData({id:date.rows[0].id},function(date){
            $('.lt_cateRight').find('ul').html(template('secondCategory',date));
        })
    })
    $('.lt_cateLeft').on('click','ul li',function(){
        $(this).siblings('li').removeClass('now');
        $(this).addClass('now');
        getSecondCategoryData({id:$(this).attr('data-id')},function(date){
            console.log(date)
            $('.lt_cateRight').find('ul').html(template('secondCategory',date));
            scrollRight.scrollTo(0,0,100);//100毫秒滚动到顶
        })
    })
})
var getFirstCategoryData = function(callback){
    $.ajax({
        url:'/category/queryTopCategory',
        type:'get',
        data:{},
        dataType:'json',
        success:function(date){
            callback&&callback(date);
        }
    })
}
var getSecondCategoryData = function(data,callback){
    $.ajax({
        url:'/category/querySecondCategory',
        type:'get',
        data:data,
        dataType:'json',
        success:function(date){
            callback&&callback(date);
        }
    })
}