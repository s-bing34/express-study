/*	
 * @Name			box.js
 * @Description		弹出框
 * @Author			舒兵 2015-02-13
 * @Update			2015-02-13
 */
 
define(function(require, exports, module){
	//严格模式
	'use strict';
	var template = '<div class="js-box">' +
				 	'<div class="js-box-t">' +
				 	'<h4 class="js-box-t-title"></h4>' +
				 	'<a href="javascript:;" class="js-box-t-close">关闭</a>' +
			     	'</div>' +
			     	'<div class="js-box-c">' +
				 	'</div>' +
			     	'<div class="js-box-b">' +
			     	'<a href="javascript:;" class="js-box-b-ok">' +
			     	'<span>确定</span>' +
			     	'</a>' + 
			     	'<a href="javascript:;" class="js-box-b-cancel">' +
			     	'<span>取消</span>' + 
			     	'</a>' +
			     	'</div>' +
			     	'</div>',
		selfDefault = {
			boxid: "js-box",
			boxclass:"js-box",
			title: '',
			width: 0,
			height: 0,
			showTitle: true,
			showButton: true,
			showOk: true,
			showCancel: true,
			okBtnName: '确定',
			cancelBtnName: '取消',
			timeout: 0,
			showmask: true,
			mask:{
				bgcolor : '#000000',
				opacity : 0.1,
				zIndex : null
			},
			zIndex: 500,
			remember:false,
			position: 'center',//留待扩展
			clickOut: null,//点击box外调用的function
			onclose: null,
			onopen: null,
			oncancel: null,
			onok: null,
			blur:null,//关闭窗口后的焦点
			focus:null,//打开窗口中默认的焦点
			autoHeight : true,//自动高度(当内容高度大于设定的高度)
			autoPosition : true,//自动修正位置（当scroll resize时）
		};
	module.exports = function(content, options) {
		var $win = $(window),
			$doc = $(document),
			$body = $('body'),
			box = {};
		box = {
			content : content,
			winWidth : null,
			winHeight : null,
			options : $.extend({},selfDefault, options),
			maskopt : $.extend({},selfDefault.mask, options.mask),
			//初始化
			init : function(){
				if(this.options.showmask){
					this.initMask();
				}
				this.initBox();
				this.renderBox();
				this.setContent();
				this._box.appendTo($body);
				this.setPosition();
				if(this.options.onopen){
					this.options.onopen(this);
				}
				this.bind();
			},
			//加载透明背景
			initMask : function(){
				if($('.js-mask')[0]){
					return;
				}
				this._mask = $('<div class="js-mask"></div>');
				if(this.maskopt.zIndex){
					this._mask.css('z-index',this.maskopt.zIndex);
				}else{
					this._mask.css('z-index',this.options.zIndex-10);
				}
				this._mask.css('background-color',this.maskopt.bgcolor);
				this._mask.css('opacity',this.maskopt.opacity);
				this._mask.css(this.getBody());
				this._mask.appendTo($body);
			},
			//加载弹出框
			initBox : function(){
				this._box = $(template).css({
					zIndex : this.options.zIndex
				});
				this._t_title = this._box.find(".js-box-t-title");
				this._t_close = this._box.find(".js-box-t-close");
				this._b_content = this._box.find(".js-box-c");
				this._b_button = this._box.find(".js-box-b");
				this._b_ok = this._box.find(".js-box-b-ok");
				this._b_cancel = this._box.find(".js-box-b-cancel");
				this._box.attr('id',this.options.boxid);
			},
			//渲染box
			renderBox : function(){
				if(this.options.showTitle){
					this._t_title.show();
				}else{
					this._t_title.hide();
				}
				if(this.options.title){
					this._t_title.html(this.options.title);
				}else{
					this._t_title.empty();
				}
				if(this.options.showButton){
					this._b_button.show();
				}else{
					this._b_button.hide();
				}
				if(this.options.showOk){
					this._b_button.find('.js-box-b-ok').show();
				}else{
					this._b_button.find('.js-box-b-ok').hide();
				}
				if(this.options.okBtnName){
					this._b_button.find('.js-box-b-ok').html(this.options.okBtnName);
				}else{
					this._b_button.find('.js-box-b-ok').empty();
				}
				if(this.options.showCancel){
					this._b_button.find('.js-box-b-cancel').show();
				}else{
					this._b_button.find('.js-box-b-cancel').hide();
				}
				if(this.options.cancelBtnName){
					this._b_button.find('.js-box-b-cancel').html(this.options.cancelBtnName);
				}else{
					this._b_button.find('.js-box-b-cancel').empty();
				}
			},
			//填充内容
			setContent : function(){
				if(typeof(this.content) === 'undefined' || content === null){
					return;
				}
				this._b_content.html(this.content);
				if(this.options.width > 0){
					this._box.css('width',this.options.width);
				}else{
					this._box.css('width','auto');
				}
				if(this.options.height > 0){
					this._b_content.css('height',this.options.height);
					this._b_content.css('overflow-y','scroll');
				}
				if(this.options.autoHeight){
					this._b_content.css('height','auto');
				}
			},
			//设置弹出框位置
			setPosition : function(){
				var w = this._box.width(),
					h = this._box.height();
				this._box.css({
					marginTop : ( 0 - h/2 ),
					marginLeft : ( 0 - w/2 )
				});
			},
			//绑定关闭、确定、取消等按钮事件
			bind : function(){
				//关闭事件
				this._t_close.on('click',function(){
					if(box.options.onclose){
						box.options.onclose(box);
					}
					box.remove();
				});
				//取消事件
				this._b_cancel.on('click',function(){
					if(box.options.oncancel){
						box.options.oncancel(box);
					}
					box.remove();
				});
				//确定事件
				this._b_ok.on('click',function(){
					if(box.options.onok){
						box.options.onok(box);
					}
					box.remove();
				});
				//点击弹出框内部事件
				this._box.bind('click',function(){
					box._onbox = true ;
				});
				//点击document事件
				$doc.bind('click',function(event){
					if (event.button !== 0){
						return true;
					}
					if(!box._onbox && box.options.clickOut){
						box.options.clickOut(box);
					}
					box._onbox = false;
				});
				//设置延时自动关闭
				if(this.options.timeout > 0){
					setTimeout(this.remove,this.options.timeout);
				}
				//设置打开后的焦点
				if(this.options.focus){
					$(this.options.focus).focus();
				}
				if(this.options.autoPosition && this._box.height()<$win.height()){
					this._box.css('position','fixed');
				}
			},
			//获取浏览器宽度和高度
			getWin : function(){
				this.winWidth = $win.width();
				this.winHeight = $win.height();
			},
			//获取文档宽度和高度
			getBody : function(){
				return {
					width:$body.width(),
					height:$body.height()
				};
			},
			//移除弹出框
			remove : function(){
				if(this._mask){
					this._mask.remove();
				}
				this._box.remove();
				//设置关闭后的焦点
				if (this.options.blur) {
					$(this.options.blur).focus();
				}
			}
		};
		box.init();
	};
});
