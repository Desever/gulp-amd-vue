/**
 * 定义所有引用的js模块
 */
require.config({
    paths : {
    	"houmeCount":"../home/homeCount"
    }
})
/**
 * 引入首页模块
 */
if($("#home").length>0){
	require(["houmeCount"],function(houmeCount){
	    console.log(houmeCount)
	})
}
