;(function($){
	'use strict';
	$.fn.layout3 = function(options){
	//默认参数
		var defaults = {
			lefttop:{
				background: '#c00'
				,el:''
				,tip:'css'
				,maxWin:function(){}
				,minWin:function(){}
			}
			,leftbottom:{
				background: '#5cc'
				,el:''
				,tip:'javascript'
				,maxWin:function(){}
				,minWin:function(){}
			}
			,rightpanel:{
				background: '#a0a'
				,el:''
				,tip:'html'
				,maxWin:function(){}
				,minWin:function(){}
			}
			,foreground: 'red'
			,background: 'yellow'
			,padding:30
			,spliter_width:2
			,hspliter:'col-resize'
			,vspliter:'row-resize'
			,width:'1400px'
			,height:'690px'
			,spliter_border:true
			,showtip:true
			,moving:function(){}
			,moved:function(){}
			,dblclickpanel:function(){}
			
		};
        var opts = $.extend({}, defaults, options);		
		
		var edit_containter, leftContainer, rightContainer, lefttop, leftbottom, rightpanel, _dbmaxpanel;
		
		var clickX, clickY, leftOffset, topOffset, inx = 0, nextW2;
		var hdragging  = false, vdragging=false;
		var doc 	  = document;
		var _h_spliter 	 ;
		var wrapWidth ;
		var spliter_width ;
		var _v_spliter 	  ;		
		
		initUi(this);
		moveReady();
		
		doc.onmousemove = function(e){
			if (hdragging) {//水平方向拖动
				clickX = e.pageX;
				
				if(clickX-leftOffset<150){
					leftContainer.find('.editor_toolbar').hide();
				}else{
					leftContainer.find('.editor_toolbar').show();
				}
				if(clickX>leftOffset+wrapWidth-150){
					rightContainer.find('.editor_toolbar').hide();
				}else{
					rightContainer.find('.editor_toolbar').show();
				}
				
				if(clickX > leftOffset+opts.padding) {//拖动算法
					_h_spliter.eq(inx).css('left', clickX - spliter_width - leftOffset + 'px');//按钮移动
					_h_spliter.eq(inx).prev().width( clickX-leftOffset-spliter_width + 'px');
					nextW2 = clickX-leftOffset;			
				}
					
				if( clickX >= (leftOffset + wrapWidth-opts.padding-spliter_width) ) {//右边
					//第二个按钮右边不出界
					_h_spliter.eq(inx).css('left', wrapWidth -opts.padding + 'px'); //减去按钮的宽度
					//第二个按钮左右容器，右边不出界
					_h_spliter.eq(inx).prev().width( wrapWidth -opts.padding);
				}
				
			}
			
			if(vdragging){//垂直方向拖动
				clickY = e.pageY;
				if(clickY > topOffset+opts.padding) {
					_v_spliter.eq(inx).prev().height( clickY-topOffset-spliter_width + 'px');
					nextW2 = clickY-topOffset;
					_v_spliter.eq(inx).next().height( edit_containter.height() - nextW2+spliter_width + 'px');
					if(opts.moving){
						opts.moving();
					}
				}
					
				if( clickY >= (topOffset + edit_containter.height()-opts.padding) ) {
					_v_spliter.eq(inx).prev().height( edit_containter.height() -opts.padding);
					_v_spliter.eq(inx).next().height(opts.padding);
				}
			}
		};
	
		$(doc).mouseup(function(e) {
			hdragging = false;
			vdragging = false;
			e.cancelBubble = true;
			
			if(opts.moved){
				opts.moved();
			}
		});
		
			
		function initUi(parent){
			spliter_width = opts.spliter_width==''? $(".spliter-h").width():opts.spliter_width;
			
			leftContainer = $("<div>").addClass("l_panel");
			rightContainer = $("<div>").addClass("r_panel");//.css('margin-left', spliter_width);
			_h_spliter = $("<div>").addClass("spliter-h").attr("id", "_h_spliter").css({'cursor':opts.hspliter, 'width':spliter_width});
			lefttop = $("<div data-position='lefttop'>").addClass("s_panel").attr("id","lefttop").css("background",opts.lefttop.background).append(opts.lefttop.el===''?'':$(opts.lefttop.el));
			leftbottom = $("<div data-position='leftbottom'>").addClass("s_panel").attr("id","leftbottom").css("background",opts.leftbottom.background).append(opts.leftbottom.el===''?'':$(opts.leftbottom.el));
			
			rightpanel = $("<div data-position='rightpanel'>").attr("id","rightpanel").css({"background": opts.rightpanel.background, width:'auto', height:'100%'}).append(opts.rightpanel.el===''?'':$(opts.rightpanel.el));
			_v_spliter = $("<div>").addClass("spliter-v spliter-vl").attr("id", "_v_spliter").css({'cursor':opts.vspliter, 'height':spliter_width});
			
			edit_containter = $(parent).css({height: opts.height});			
			lefttop.addClass('selected');
			
			
			parent.append(leftContainer.append(lefttop.append(initToolbar(lefttop, opts.lefttop.tip))).append(_v_spliter).append(leftbottom.append(initToolbar(leftbottom, opts.leftbottom.tip))));
			parent.append(_h_spliter);
			parent.append(rightContainer.append(rightpanel.append(opts.rightpanel.el===''?'':$(opts.rightpanel.el)).append(initToolbar(rightpanel, opts.rightpanel.tip))));
			
			
			$('body').append($("<div id='max-panel' class='max-panel'>"));
			
						
			wrapWidth = edit_containter.width();					
			_v_spliter 	  = edit_containter.find('.spliter-v');	
		
			resetUI();
			
			lefttop.bind('click', function(){
				$('.selected').removeClass('selected');
				$(this).addClass('selected');
			});
			leftbottom.bind('click', function(){
				$('.selected').removeClass('selected');
				$(this).addClass('selected');
			});
			rightpanel.bind('click', function(){
				$('.selected').removeClass('selected');
				$(this).addClass('selected');
			});
			
			lefttop.bind('dblclick', function(){
				inx=0;
				_dbmaxpanel = $(parent).data('maxpanel');
				if(typeof(_dbmaxpanel) == 'undefined'|| _dbmaxpanel=='' ){
					$(parent).data('maxpanel', 'lefttop');
					
					_h_spliter.eq(inx).css('left', wrapWidth -opts.padding + 'px'); //减去按钮的宽度
					//第二个按钮左右容器，右边不出界
					_h_spliter.eq(inx).prev().width( wrapWidth -opts.padding);					
						//第二个按钮左右容器，右边不出界
					_v_spliter.eq(inx).prev().height( edit_containter.height() -opts.padding);
					_v_spliter.eq(inx).next().height(opts.padding);		
					
					rightContainer.find('.editor_toolbar').hide();
					_h_spliter.eq(inx).next('.editor_toolbar').hide();
				}else{
					$(parent).data('maxpanel', '');
					resetUI();					
				}
				if(opts.moving){
					opts.moving();
				}				
			});
			leftbottom.bind('dblclick', function(){
				inx=0;
				_dbmaxpanel = $(parent).data('maxpanel');
				if(typeof(_dbmaxpanel) == 'undefined'|| _dbmaxpanel=='' ){
					$(parent).data('maxpanel', 'leftbottom');
					
					_h_spliter.eq(inx).css('left', wrapWidth -opts.padding + 'px'); //减去按钮的宽度
					//第二个按钮左右容器，右边不出界
					_h_spliter.eq(inx).prev().width( wrapWidth -opts.padding);
					
						//第二个按钮左右容器，右边不出界
					_v_spliter.eq(inx).prev().height(opts.padding);
					_v_spliter.eq(inx).next().height(edit_containter.height()-opts.padding);
					
					rightContainer.find('.editor_toolbar').hide();
					_h_spliter.eq(inx).prev('.editor_toolbar').hide();
				}else{
					$(parent).data('maxpanel', '');
					resetUI();
				}
				if(opts.moving){
					opts.moving();
				}
			});
			rightpanel.bind('dblclick', function(){
				inx=0;
				_dbmaxpanel = $(parent).data('maxpanel');
				if(typeof(_dbmaxpanel) == 'undefined'|| _dbmaxpanel=='' ){
					$(parent).data('maxpanel', 'rightpanel');
					_h_spliter.eq(inx).css('left', opts.padding + 'px'); //减去按钮的宽度
						//第二个按钮左右容器，右边不出界
					_h_spliter.eq(inx).prev().width(opts.padding);
					
						//第二个按钮左右容器，右边不出界
					inx = 1;
					_v_spliter.eq(inx).prev().height( edit_containter.height() -opts.padding);
					_v_spliter.eq(inx).next().height(opts.padding);
					
					leftContainer.find('.editor_toolbar').hide();				
					_v_spliter.eq(inx).next('.editor_toolbar').hide();
				}else{
					$(parent).data('maxpanel', '');
					resetUI();
					
				}
				if(opts.moving){
					opts.moving();
				}
			});
		}
		
		function resetUI(){
			$(".l_panel:eq(0)").width((wrapWidth - spliter_width)/2);
			$(".spliter-h").css('left' ,(wrapWidth-spliter_width)/2);
			$(".s_panel").height((edit_containter.height()-spliter_width)/2);
			$(".editor_toolbar").show();	
		}
		
		function initToolbar(ele, tip){
			if(opts.showtip){
				var tooldiv = $("<div>").addClass('editor_toolbar').append('<span ">'+tip+'</span>').append($('<i class="ion-arrow-expand toolbtn"></i>')
				.on('click', function(){
					var max = $(this).data('max');
					if(typeof(max) == 'undefined'|| max=='false' ){
						$(this).data('max', 'true');
						$(this).removeClass('ion-arrow-expand').addClass('ion-arrow-shrink');
						$(edit_containter).hide();
						$(this).data('height', ele.height()).data('width', ele.width());
						$("#max-panel").html("").append(ele.css({width:'100%', height:'100%'})).show();
						
						if(ele.data('position')=='lefttop'){
							if(opts.lefttop.maxWin){
							opts.lefttop.maxWin();
						}
						}else if(ele.data('position')=='leftbottom'){
							if(opts.leftbottom.maxWin){
							opts.leftbottom.maxWin();
						}
						}else if(ele.data('position')=='rightpanel'){
							if(opts.rightpanel.maxWin){
							opts.rightpanel.maxWin();
						}
						}
						
					}else{
						$(this).data('max', 'false');
						$(this).removeClass('ion-arrow-shrink').addClass('ion-arrow-expand');
						
						if(ele.data('position')=='lefttop'){
							$(_v_spliter).before(ele.height($(this).data('height')));
						}else if(ele.data('position')=='leftbottom'){
							$(_v_spliter).after(ele.height($(this).data('height')));
						}else if(ele.data('position')=='rightpanel'){							
							$(rightContainer).append($(ele));
						}
						$("#max-panel").html('').hide();
						$(edit_containter).show();
						
					}
				}));
				return tooldiv;
			}else{
				return;
			}			
		}
		
		function moveReady(){
			_h_spliter.bind('mousedown',function(){
				hdragging   = true;
				leftOffset = edit_containter.offset().left;
				inx 	   = $(this).index('.spliter-h');
			});
			_v_spliter.bind('mousedown',function(){
				vdragging   = true;
				topOffset = edit_containter.offset().top;
				inx 	   = $(this).index('.spliter-v');
			});
		}
		
		function moving(){
			if(opts.moving){
				opts.moving();
			}	
		}
		
        return this;
    };
	
	
})(jQuery);;(function($){
	'use strict';
	$.fn.layout4 = function(options){
	//默认参数
		var defaults = {
			lefttop:{
				background: '#c00'
				,el:''
				,tip:'css'
				,maxWin:function(){}
				,minWin:function(){}
			}
			,leftbottom:{
				background: '#5cc'
				,el:''
				,tip:'javascript'
				,maxWin:function(){}
				,minWin:function(){}
			}
			,righttop:{
				background: '#a0a'
				,el:''
				,tip:'html'
				,maxWin:function(){}
				,minWin:function(){}
			}
			,rightbottom:{
				background: '#0dd'
				,el:''
				,tip:'view'
				,maxWin:function(){}
				,minWin:function(){}
			}
			,foreground: 'red'
			,background: 'yellow'
			,padding:30
			,spliter_width:4
			,hspliter:'col-resize'
			,vspliter:'row-resize'
			,width:'1400px'
			,height:'690px'
			,spliter_border:true
			,showtip:true
			,moving:function(){}
			,moved:function(){}
			,dblclickpanel:function(){}
			
		};
        var opts = $.extend({}, defaults, options);		
		
		var main_containter, leftpanel, rightpanel, lefttop, leftbottom, righttop, rightbottom, vlspliter, vrspliter, _dbmaxpanel;
		
		var clickX, clickY, leftOffset, topOffset, inx = 0, nextW2;
		var hdragging  = false, vdragging=false;
		var doc 	  = document;
		var _h_spliter 	 ;
		var wrapWidth ;
		var spliter_width ;
		var _v_spliter 	  ;		
		
		initUi(this);
		moveReady();
		
		doc.onmousemove = function(e){
			if (hdragging) {//水平方向拖动
				clickX = e.pageX;
				
				if(clickX-leftOffset<150){
					leftpanel.find('.editor_toolbar').hide();
				}else{
					leftpanel.find('.editor_toolbar').show();
				}
				if(clickX>leftOffset+wrapWidth-150){
					rightpanel.find('.editor_toolbar').hide();
				}else{
					rightpanel.find('.editor_toolbar').show();
				}
				
				if(clickX > leftOffset+opts.padding) {//拖动算法
					_h_spliter.eq(inx).css('left', clickX - spliter_width - leftOffset + 'px');//按钮移动
					_h_spliter.eq(inx).prev().width( clickX-leftOffset-spliter_width + 'px');
					nextW2 = clickX-leftOffset;				
				}
					
				if( clickX >= (leftOffset + wrapWidth-opts.padding-spliter_width) ) {//右边
					//第二个按钮右边不出界
					_h_spliter.eq(inx).css('left', wrapWidth -opts.padding + 'px'); //减去按钮的宽度
					//第二个按钮左右容器，右边不出界
					_h_spliter.eq(inx).prev().width( wrapWidth -opts.padding);
				}
				
			}
			
			if(vdragging){//垂直方向拖动
				clickY = e.pageY;
				if(clickY > topOffset+opts.padding) {
					//_v_spliter.eq(inx).css('left', clickY - spliter_width - topOffset + 'px');//按钮移动
					_v_spliter.eq(inx).prev().height( clickY-topOffset-spliter_width + 'px');
					nextW2 = clickY-topOffset;
					_v_spliter.eq(inx).next().height( main_containter.height() - nextW2+spliter_width + 'px');
					if(opts.moving){
						opts.moving();
					}
				}
					
				if( clickY >= (topOffset + main_containter.height()-opts.padding) ) {
					//第二个按钮右边不出界
					//_v_spliter.eq(inx).css('left', main_containter.height() -opts.padding + 'px'); //减去按钮的宽度
					//第二个按钮左右容器，右边不出界
					_v_spliter.eq(inx).prev().height( main_containter.height() -opts.padding);
					_v_spliter.eq(inx).next().height(opts.padding);
				}
			}
		};
	
		$(doc).mouseup(function(e) {
			hdragging = false;
			vdragging = false;
			e.cancelBubble = true;
			
			if(opts.moved){
				opts.moved();
			}
		});
			
		
		function initUi(parent){			
						
			spliter_width = opts.spliter_width==''? $(".spliter-h").width():opts.spliter_width;
			
			leftpanel = $("<div>").addClass("l_panel");
			rightpanel = $("<div>").addClass("r_panel");//.css('margin-left', spliter_width);
			_h_spliter = $("<div>").addClass("spliter-h").attr("id", "_h_spliter").css({'cursor':opts.hspliter, 'width':spliter_width});
			lefttop = $("<div data-position='lefttop'>").addClass("s_panel").attr("id","lefttop").css("background",opts.lefttop.background).append(opts.lefttop.el===''?'':$(opts.lefttop.el));
			leftbottom = $("<div data-position='leftbottom'>").addClass("s_panel").attr("id","leftbottom").css("background",opts.leftbottom.background).append(opts.leftbottom.el===''?'':$(opts.leftbottom.el));
			righttop = $("<div data-position='righttop'>").addClass("s_panel").attr("id","righttop").css("background", opts.righttop.background).append(opts.righttop.el===''?'':$(opts.righttop.el));
			rightbottom = $("<div data-position='rightbottom'>").addClass("s_panel").attr("id","rightbottom").css("background", opts.rightbottom.background).append(opts.rightbottom.el===''?'':$(opts.rightbottom.el));
			vlspliter = $("<div>").addClass("spliter-v spliter-vl").attr("id", "vlspliter").css({'cursor':opts.vspliter});
			vrspliter = $("<div>").addClass("spliter-v spliter-vr").attr("id", "vrspliter").css({'cursor':opts.vspliter});
			main_containter = $(parent).css({height: opts.height});
			lefttop.addClass('selected');
			
			
			parent.append(leftpanel.append(lefttop.append(initToolbar(lefttop, opts.lefttop.tip))).append(vlspliter).append(leftbottom.append(initToolbar(leftbottom, opts.leftbottom.tip))));
			parent.append(_h_spliter);
			parent.append(rightpanel.append(righttop.append(initToolbar(righttop, opts.righttop.tip))).append(vrspliter).append(rightbottom.append(initToolbar(rightbottom, opts.rightbottom.tip))));
						
			$('body').append($("<div id='max-panel' class='max-panel'>"));
						
			wrapWidth = main_containter.width();		
			_v_spliter 	  = main_containter.find('.spliter-v');	
		
			resetUI();
			
			lefttop.bind('click', function(){
				$('.selected').removeClass('selected');
				$(this).addClass('selected');
			});
			leftbottom.bind('click', function(){
				$('.selected').removeClass('selected');
				$(this).addClass('selected');
			});
			righttop.bind('click', function(){
				$('.selected').removeClass('selected');
				$(this).addClass('selected');
			});
			rightbottom.bind('click', function(){
				$('.selected').removeClass('selected');
				$(this).addClass('selected');
			});
			
			lefttop.bind('dblclick', function(){
				inx=0;
				_dbmaxpanel = $(parent).data('maxpanel');
				if(typeof(_dbmaxpanel) == 'undefined'|| _dbmaxpanel=='' ){
					$(parent).data('maxpanel', 'lefttop');
					_h_spliter.eq(inx).css('left', wrapWidth -opts.padding + 'px'); //减去按钮的宽度
					//第二个按钮左右容器，右边不出界
					_h_spliter.eq(inx).prev().width( wrapWidth -opts.padding);
					
					
						//第二个按钮左右容器，右边不出界
					_v_spliter.eq(inx).prev().height( main_containter.height() -opts.padding);
					_v_spliter.eq(inx).next().height(opts.padding);
					
					rightpanel.find('.editor_toolbar').hide();
					_h_spliter.eq(inx).next('.editor_toolbar').hide();
				}else{
					$(parent).data('maxpanel', '');
					resetUI();					
				}
				if(opts.moving){
					opts.moving();
				}				
			});
			leftbottom.bind('dblclick', function(){
				inx=0;
				_dbmaxpanel = $(parent).data('maxpanel');
				if(typeof(_dbmaxpanel) == 'undefined'|| _dbmaxpanel=='' ){
					$(parent).data('maxpanel', 'leftbottom');
					_h_spliter.eq(inx).css('left', wrapWidth -opts.padding + 'px'); //减去按钮的宽度
					//第二个按钮左右容器，右边不出界
					_h_spliter.eq(inx).prev().width( wrapWidth -opts.padding);
					
						//第二个按钮左右容器，右边不出界
					_v_spliter.eq(inx).prev().height(opts.padding);
					_v_spliter.eq(inx).next().height(main_containter.height()-opts.padding);
					
					rightpanel.find('.editor_toolbar').hide();
					_h_spliter.eq(inx).prev('.editor_toolbar').hide();
				}else{
					$(parent).data('maxpanel', '');
					resetUI();
				}
				if(opts.moving){
					opts.moving();
				}
			});
			righttop.bind('dblclick', function(){
				inx=0;
				_dbmaxpanel = $(parent).data('maxpanel');
				if(typeof(_dbmaxpanel) == 'undefined'|| _dbmaxpanel=='' ){
					$(parent).data('maxpanel', 'righttop');
					_h_spliter.eq(inx).css('left', opts.padding + 'px'); //减去按钮的宽度
						//第二个按钮左右容器，右边不出界
					_h_spliter.eq(inx).prev().width(opts.padding);
					
						//第二个按钮左右容器，右边不出界
					inx = 1;
					_v_spliter.eq(inx).prev().height( main_containter.height() -opts.padding);
					_v_spliter.eq(inx).next().height(opts.padding);
					
					leftpanel.find('.editor_toolbar').hide();				
					_v_spliter.eq(inx).next('.editor_toolbar').hide();
				}else{
					$(parent).data('maxpanel', '');
					resetUI();
					
				}
				if(opts.moving){
					opts.moving();
				}
			});
			rightbottom.bind('dblclick', function(){
				inx=0;
				_dbmaxpanel = $(parent).data('maxpanel');
				if(typeof(_dbmaxpanel) == 'undefined'|| _dbmaxpanel=='' ){
					$(parent).data('maxpanel', 'rightbottom');
					_h_spliter.eq(inx).css('left', opts.padding + 'px'); //减去按钮的宽度
						//第二个按钮左右容器，右边不出界
					_h_spliter.eq(inx).prev().width(opts.padding);
					
						//第二个按钮左右容器，右边不出界
					inx = 1;
					_v_spliter.eq(inx).prev().height(opts.padding);
					_v_spliter.eq(inx).next().height(main_containter.height()-opts.padding);
					
					leftpanel.find('.editor_toolbar').hide();				
					_v_spliter.eq(inx).next('.editor_toolbar').hide();
				}else{
					$(parent).data('maxpanel', '');
					resetUI();
				}
				if(opts.moving){
					opts.moving();
				}
			});
						
		}
		
		function resetUI(){
			$(".l_panel:eq(0)").width((wrapWidth - spliter_width)/2);
			$(".spliter-h").css('left' ,(wrapWidth-spliter_width)/2);
			$(".s_panel").height((main_containter.height()-spliter_width)/2);
			$(".editor_toolbar").show();	
		}
		
		function initToolbar(ele, tip){
			if(opts.showtip){
				var tooldiv = $("<div>").addClass('editor_toolbar').append('<span ">'+tip+'</span>').append($('<i class="ion-arrow-expand toolbtn"></i>')
				.on('click', function(){
					var max = $(this).data('max');
					if(typeof(max) == 'undefined'|| max=='false' ){
						$(this).data('max', 'true');
						$(this).removeClass('ion-arrow-expand').addClass('ion-arrow-shrink');
						$(main_containter).hide();
						$(this).data('height', ele.height());
						$("#max-panel").html("").append(ele.height('100%')).show();
						
						if(ele.data('position')=='lefttop'){
							if(opts.lefttop.maxWin){
							opts.lefttop.maxWin();
						}
						}else if(ele.data('position')=='leftbottom'){
							if(opts.leftbottom.maxWin){
							opts.leftbottom.maxWin();
						}
						}else if(ele.data('position')=='righttop'){
							if(opts.righttop.maxWin){
							opts.righttop.maxWin();
						}
						}else if(ele.data('position')=='rightbottom'){
							if(opts.rightbottom.maxWin){
								opts.rightbottom.maxWin();
							}
						}
						
						
					}else{
						$(this).data('max', 'false');
						$(this).removeClass('ion-arrow-shrink').addClass('ion-arrow-expand');
						
						if(ele.data('position')=='lefttop'){
							$(vlspliter).before(ele.height($(this).data('height')));
						}else if(ele.data('position')=='leftbottom'){
							$(vlspliter).after(ele.height($(this).data('height')));
						}else if(ele.data('position')=='righttop'){
							$(vrspliter).before(ele.height($(this).data('height')));
						}else if(ele.data('position')=='rightbottom'){
							$(vrspliter).after(ele.height($(this).data('height')));
							if(opts.rightbottom.minWin){
								opts.rightbottom.minWin();
							}
						}
						$("#max-panel").html('').hide();
						$(main_containter).show();
						
					}
				}));
				return tooldiv;
			}else{
				return;
			}			
		}
		
		function moveReady(){
			_h_spliter.bind('mousedown',function(){
				hdragging   = true;
				leftOffset = main_containter.offset().left;
				inx 	   = $(this).index('.spliter-h');
			});
			_v_spliter.bind('mousedown',function(){
				vdragging   = true;
				topOffset = main_containter.offset().top;
				inx 	   = $(this).index('.spliter-v');
			});
		}
		
        return this;
    };
	
	
})(jQuery);