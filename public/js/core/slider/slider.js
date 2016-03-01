/*	
 * @Author			舒兵 2015-02-13
 * @Update			2015-02-13
 * @Name			slider.js
 * @Description		图片切换
*/
define(function(require, exports, module){
	'use strict';
	var selfDefault = {
			auto:			false, 	//　自动播放			
			speed: 			500, 	//　速度; 越小越快
			pause:			4000, 	//　此4000代表自动播放的间隔，单位：毫秒
			showControl: 	true,
			showBtn:		false,
			width :			0, 		//　必须
			hegiht :		0, 		//　必须
			sliderType :	"show",  //  滚动方式，left || up || filter || show
			minWidth : 1000 //页面最小宽度
		};
	module.exports = function(obj, options){
		var $obj = $(obj),
			$control,
			$prev,
			$next,
			len = $("li", $obj).length,
			animation = {},
			curnum = 0,
			prevnum = 0,
			showPics,
			autoPlay;
			
		options = $.extend(selfDefault, options);
		
		animation = {
			init:function(){
				//创建按钮等元素
				if(options.showControl){
					animation.loadControl();
					animation.bindControl();
				}
				if(options.showBtn){
					animation.loadBtn();
					animation.bindBtn();
				}
				animation.bind();
				//定义UL
				animation.setCss();
				//是否开启自动播放
				if(options.auto) { //是否自动播放
					animation.setAutoPlay();
				}
			},
			setCss:function(){
				switch(options.sliderType) {
					case 'up' :
						$("ul", $obj).css("height",options.height * (len));
						break;
					case 'filter' : 	//滤镜效果					
						$("ul li", $obj).css({"display":"none", "position":"absolute"}).eq(0).show();
						break;
					case 'show' : 	//滤镜效果					
						$("ul li", $obj).css({"display":"none", "position":"absolute"}).eq(0).show();
						break;
					case 'left' :
					default	:
						$("ul", $obj).css("width",options.width * (len));
						break;
				}
			},
			setAutoPlay:function(){
				clearInterval(autoPlay);
				if(!options.auto) {
					return;
				}
				autoPlay = setInterval(function() {	
					prevnum = curnum;
					curnum = curnum + 1;
					if(curnum >= len){
						curnum = 0;
					}
					animation.showPics(curnum);
				}, options.pause); 
				window.onblur = function(){
					clearInterval(autoPlay);
				}
				window.onfocus = function(){
					clearInterval(autoPlay);
					animation.setAutoPlay();
				}
			},
			loadControl:function(){
				$control = $('<div class="js-slider-control">');
				for(var i=0; i < len; i++) {
					if(i == 0) {
						$control.append('<span class="current"></span>');
					} else {
						$control.append('<span></span>');
					}
				}
				$obj.append($control);
			},
			loadBtn:function(){
				$prev = $('<a href="javascript:;" class="js-slider-prev"></a>');
				$next = $('<a href="javascript:;" class="js-slider-next"></a>');
				$obj.append($prev);
				$obj.append($next);
			},
			showPics:function(num){
				switch(options.sliderType) {
					case 'up' : //向上滚动
						var nowTop = -num * options.height; 
						$("ul", $obj).stop(true,false).animate({"top":nowTop}, options.speed);
						break;
					case 'filter' : //滤镜效果
						$("li", $obj).eq(prevnum).fadeOut(options.speed).end().eq(num).fadeIn(options.speed);
						break;
					case 'show' : //滤镜效果
						$("li", $obj).eq(prevnum).hide().end().eq(num).show();
						break;
					case 'left' : //向左滚动
					default :
						var nowLeft = -num * options.width; 
						$("ul", $obj).stop(true,false).animate({"left":nowLeft}, options.speed);
						break;
				}
				if (options.showControl){
					$(".js-slider-control span", $obj).removeClass("current").eq(num).addClass('current');
				};
			},
			bind:function(){
				$obj.hover(function(){
					clearInterval(autoPlay);
				},function(){
					animation.setAutoPlay();
				});
				//重置宽度
				if(options.width == '100%') {
					$(window).resize(function () {
						options.width = $obj.width();
						if(options.width < options.minWidth){
							options.width = options.minWidth;
						}
						$obj.width('100%');						
						$("li", $obj).width(options.width);			
						$("ul", $obj).width(options.width*len);
						animation.showPics(curnum);
						animation.setAutoPlay();
					});
					options.width = $obj.width();
					if(options.width < options.minWidth){
						options.width = options.minWidth;
					}
					$('li',$obj).width(options.width);
					$('ul',$obj).width(options.width*len);
				}
			},
			bindControl:function(){
				$(".js-slider-control span", $obj).mouseenter(function() {
					prevnum = curnum;
					curnum = $(this).index();
					animation.showPics(curnum);
				});
			},
			bindBtn:function(){
				//上一页按钮
				$('.js-slider-prev', $obj).click(function() {
					prevnum = curnum;
					curnum = curnum - 1;
					if(curnum < 0){
						curnum = len - 1;
					}
					animation.showPics(curnum);
				});
				//下一页按钮
				$('.js-slider-next', $obj).click(function() {
					prevnum = curnum;
					curnum = curnum + 1;
					if(curnum >=len){
						curnum = 0;
					}
					animation.showPics(curnum);
				});
			}
		}
		animation.init();
	}
})