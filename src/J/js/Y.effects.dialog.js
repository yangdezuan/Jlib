coreTool.domReady(function(){
	var ct = coreTool;
	ct.getEId('codeSourceHtml').innerHTML = ct.htmlEncode(ct.deleteBR(ct.getEId('codeSource').innerHTML));
	
	var clickT = 1;		
	ct.addEvent(ct.getEId('js_dialog'), 'click', function(){
		for (var i = 0, classLen = ct.getElementByClassName(document, 'dialog').length; i < classLen ; i++){
			ct.getElementByClassName(document, 'dialog')[i].style.display = (clickT%2) === 0 ? 'block': 'none' ;					
		}
		clickT ++;
	});
	
});