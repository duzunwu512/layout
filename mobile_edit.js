$(function(){
		'use strict';
		$("#editor_wrap").layout3({
			lefttop:{background:'#111',el:'#cssCode',tip:'css',maxWin:function(){editor_css.setSize('100%', '100%');}}
			,leftbottom:{background:'#5cc',el:'#jsCode',tip:'javascript',maxWin:function(){editor_js.setSize('100%', '100%');}}
			,rightpanel:{background:'#a0a',el:'#htmlCode',tip:'html',maxWin:function(){editor_html.setSize('100%', '100%');}}
			,padding:50
			,spliter_width:2
			//,width:'950px'
			,height:'600px'
			,moving:function(w, h){
				editor_css.setSize(w?w:'100%', h?h:'100%');
				editor_js.setSize(w?w:'100%', h?h:'100%');
				editor_html.setSize(w?w:'100%', h?h:'100%');
				}
			,dblclickpanel:function(){
				editor_css.setSize('100%', '100%');
				editor_js.setSize('100%', '100%');
				editor_html.setSize('100%', '100%');
			}
			});		
		
			var editor_js = CodeMirror.fromTextArea(document.getElementById("jsCode"), {
				mode: 'text/javascript',
				selectionPointer: true,
				lineNumbers: true,
				matchBrackets: true,
				indentUnit: 4,
				indentWithTabs: true
				,theme:'eclipse'
				,extraKeys: {
					"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); },
					"F11": function(cm) {
					  cm.setOption("fullScreen", !cm.getOption("fullScreen"));
					},
					"Esc": function(cm) {
					  if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
					}},
				foldGutter: true,
				gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
			});
			var editor_css = CodeMirror.fromTextArea(document.getElementById("cssCode"), {
				mode: 'text/css',
				selectionPointer: true,
				lineNumbers: true,
				matchBrackets: true,
				indentUnit: 4,
				indentWithTabs: true
				,theme:'eclipse'//'dracula'
				,extraKeys: {
					"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); },
					"F11": function(cm) {
					  cm.setOption("fullScreen", !cm.getOption("fullScreen"));
					},
					"Esc": function(cm) {
					  if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
					}
				},
				foldGutter: true,
				gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
			});		
				
			var editor_html = CodeMirror.fromTextArea(document.getElementById("htmlCode"), {
				 mode: "text/html",
				selectionPointer: true,
				lineNumbers: true,
				matchBrackets: true,
				indentUnit: 4,
				indentWithTabs: true
				,theme:'eclipse'//'seti'
				,extraKeys: {
					"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); },
					"F11": function(cm) {
						cm.setOption("fullScreen", !cm.getOption("fullScreen"));
					},
					"Esc": function(cm) {
					  if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
					}
				},
				foldGutter: true,
				gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
				
			});	
			editor_html.setSize('100%', '100%');
  //editor_html.foldCode(CodeMirror.Pos(0, 0));
  
  
		  document.onkeydown = function(){  
				var oEvent = window.event;  
				if (oEvent.keyCode == 66 && oEvent.ctrlKey) {  //这里只能用alt，shift，ctrl等去组合其他键event.altKey、event.ctrlKey、event.shiftKey 属性
					//view_result();
					$("#device-column").toggleClass("hide");
					if(!$("#device-column").hasClass("hide")){
						view_result();
					}
				}else if(oEvent.keyCode == 27){//ESC
					$("#device-column").toggleClass("hide");
				}
			} 
			
			function view_result(){
				 
				var html_text = editor_html.getValue();
				var template = $(".docs-side-menu ul[class!='hide']").data('template');
				template = template.replace(/\\\"/g,'"').replace(/\\\'/g,"'")
				var patternHtml = /<\/content>/im;
				var array_matches_html = patternHtml.exec(template);
				if(array_matches_html) {
					html_text = template.replace('</content>', html_text );
				}
				
				
				var ifr = document.createElement("iframe");
				ifr.setAttribute("frameborder", "0");
				ifr.setAttribute("id", "iframeResult");  
				$(ifr).css({width:'320px', height:'569px', frameBorder:'0'});
				document.getElementById("iwindow").innerHTML = "";
				document.getElementById("iwindow").appendChild(ifr);	
			 
				var ifrw = (ifr.contentWindow) ? ifr.contentWindow : (ifr.contentDocument.document) ? ifr.contentDocument.document : ifr.contentDocument;
				ifrw.document.open();
				ifrw.document.write(html_text);  
				ifrw.document.close(); 	
			}
			
			$(".docs-side-menu li a").on('click', function(){
				editor_html.setValue($(this).data('html').replace(/\\\"/g,'"').replace(/\\\'/g,"'"));
			});
			
			$("#ui_selector_btn li").on('click', function(){
				$("#ui_selector_btn button span:eq(0)").text($(this).text());
				$(".left-menu").hide();
				$("#left-menu-"+$(this).data("ref")).show();
			});
});
