/*	
 * @Author			舒兵 2015-02-13
 * @Update			2015-02-13
 * @Name			marquee.js
 * @Description		跑马灯
*/
define(function(require, exports, module){
	'use strict';
	var selfDefault = {
			auto:			true, 	//　自动播放			
			speed: 			500, 	//　速度; 越小越快
			pause:			600, 	//　pause<speed
			showCrumb:		false,	//	是否出现面包屑导航
			crumb:			'.js-marquee-crumb',	//  面包屑选择器
			showBtn:		false,	//	是否显示按钮
			prev: 			'.js-marquee-prev',		
			next:			'.js-marquee-next',
			num:			1,		//	显示数量
			change:			false,	//	点击是否变向
			width :			0, 		//　必须
			hegiht :		0, 		//　必须
			sliderType :	'left', //  滚动方向，left || up 
			callback: null
		};
	module.exports = function(obj, options){
		var $obj = $(obj),
			$ul = $obj.find('ul'),
			len = $ul.find('li').length,
			$crumb,
			$prev,
			$next,
			maxlen,
			curnum = 0,
			autoPlay,
			liwidth,
			liheight,
			start,
			animation = {
				
			};
		
		options = $.extend(selfDefault, options);
		liwidth = options.width;
		liheight = options.height;
		animation = {
			ready: true,
			init:function(){
				//重设场景
				this.elementInit();
				this.positionInit();
				//是否开启自动播放
				if(options.auto) { //是否自动播放
					this.setAutoPlay();
				}
				this.bind();
			},
			elementInit:function(){
				//克隆
				var felement = [],
					lelement = [];
				//前几个li
				for(var i=0;i<options.num;i++){
					felement.push($ul.find('li').eq(i));
				}
				//后几个li
				for(i=len;i>len-options.num;i--){
					lelement.push($ul.find('li').eq(i-1));
				}
				for(i=0;i<options.num;i++){
					$ul.append(felement[i].clone());
					$ul.prepend(lelement[i].clone());
				}
				maxlen = $ul.find('li').length;
				if(options.sliderType=='left'){
					$ul.width(maxlen*liwidth);
				}
				if(options.showCrumb){
					$crumb = $(options.crumb);
				}
			},
			positionInit:function(){
				if(options.sliderType=='left'){
					start = - liwidth*options.num - liwidth*curnum;
				}else{
					start = - liheight*options.num - liheight*curnum;
				}
				switch(options.sliderType) {
					case 'up' : //向上滚动
						$ul.css('top',start);
						break;
					default :
						//默认向左滚动
						$ul.css('left',start);
						break;
				}
			},
			setAutoPlay:function(){
				clearInterval(autoPlay);
				if(!options.auto) {
					return;
				}
				autoPlay = setInterval(function() {	
					curnum = curnum + 1;
					animation.showPics(curnum);
				}, options.pause); 
				window.onblur = function(){
					clearInterval(autoPlay);
				};
				window.onfocus = function(){
					clearInterval(autoPlay);
					animation.setAutoPlay();
				};
			},
			showPics:function(num){
				this.ready = false;
				switch(options.sliderType) {
					case 'up' : //向上滚动
						var nowTop = - liheight*options.num - num*liheight;
						$ul.stop(true,false).animate({'top':nowTop}, options.speed, function(){
							if(num==len){
								curnum = 0;
								animation.positionInit();
							}else if(num == -options.num){
								curnum = len-1;
								animation.positionInit();
							}
							animation.ready = true;
							if(options.callback){
								options.callback(curnum);
							}
						});
						break;
					default :
						//默认向左滚动
						var nowLeft = - liwidth*options.num - num*liwidth;
						$ul.stop(true,false).animate({'left':nowLeft}, options.speed, function(){
							if(num==len){
								curnum = 0;
								animation.positionInit();
							}else if(num == -options.num){
								curnum = len-1;
								animation.positionInit();
							}
							animation.ready = true;
							if(options.callback){
								options.callback(curnum);
							}
						});
						break;
				}
				if(options.showCrumb){
					$('span', $crumb).removeClass('current').eq(num).addClass('current');
				}
			},
			bind:function(){
				if(options.showBtn){
					$prev = $(options.prev);
					$next = $(options.next);
					$prev.on('click',function(){
						if(!animation.ready){
							return;
						}
						curnum = curnum - 1 ;
						animation.showPics(curnum);
					});
					$next.on('click',function(){ 
						if(!animation.ready){
							return;
						}
						curnum = curnum + 1 ;
						animation.showPics(curnum);
					});
					$prev.on('mouseover',function(){
						clearInterval(autoPlay);
					});
					$next.on('mouseover',function(){
						clearInterval(autoPlay);
					});
					$prev.on('mouseleave',function(){
						clearInterval(autoPlay);
						animation.setAutoPlay();
					});
					$next.on('mouseleave',function(){
						clearInterval(autoPlay);
						animation.setAutoPlay();
					});
				}
				$obj.on('mouseover',function(){
					clearInterval(autoPlay);
				});
				$obj.on('mouseleave',function(){
					clearInterval(autoPlay);
					animation.setAutoPlay();
				});
			}
		};
		animation.init();
	};
});