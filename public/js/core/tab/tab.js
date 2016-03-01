/*	
 * @Author			舒兵 2015-02-13
 * @Update			2015-02-13
 * @Name			tab.js
 * @Description		tab切换
 * @demo			js-header, js-control, js-body, js-content为固定的；hide为不可见
 * <div id="tab">
		<div class="js-header">
			<ul>
				<li class="js-control" data-control="a">
					ad
				</li>
				<li class="js-control" data-control="b">
					asd
				</li>
				<li class="js-control" data-control="c">
					asd
				</li>
			</ul>
		</div>
		<div class="js-body">
			<div class="js-content hide" id="a">
				asdasd
			</div>
			<div class="js-content hide" id="b">
				asdasdasd
			</div>
			<div class="js-content hide" id="c">
				asdasdasdad
			</div>
		</div>
	</div>
 */
define(function(require, exports, module){
	'use strict';
	var selfDefault = {
		headerClass : '.js-header',
		bodyClass : '.js-body',
		sub : '.js-control',
		content : '.js-content',
		active : 0,
		callback : null
	};
	//tab方法定义
	module.exports = function(selector, options) {
		var self = $(selector),
			selfHeader,
			selfBody,
			selfOptions,
			sub,
			curSub,
			content,
			curContent,
			curId;
		//初始化
		selfOptions = $.extend(true, selfDefault, options);
		//tab容器
		selfHeader = $(selfOptions.headerClass, self);
		//content容器
		selfBody = $(selfOptions.bodyClass, self);
		//tab控制器
		sub = $(selfDefault.sub, selfHeader);
		//content控制器
		content = $(selfDefault.content, selfBody);
		//默认显示
		curSub = sub.eq(selfDefault.active);
		curId = curSub.attr('data-control');
		curContent = $('#' + curId);
		curSub.addClass('current');
		curContent.removeClass('hide');
		sub.on('click',function(){
			curSub = $(this);
			curId = curSub.attr('data-control');
			curContent = $('#' + curId);
			sub.removeClass('current');
			curSub.addClass('current');
			content.addClass('hide');
			curContent.removeClass('hide');
		})
	};
})
