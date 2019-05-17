//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

var fixedMenu=false;

  $(document).ready(function() {
         $('#header_placeholder').load("header.html", Shop_refreshBasket);	  
    }); 

function Common_menuClicked()
{
	$("#mobile-submenu").toggle();
	$("#mobile-submenu .toHide").hide();
}

function Common_showBackground()
{
	$('#background_img').css('opacity','0.2');	
}

function Common_checkSubMenu(menu)
{
	allMenu = $("#mobile-submenu .toHide");
	prevState = menu.nextElementSibling.style.display;
	for(var counter=0; counter<allMenu.length; counter++)
	{
		allMenu[counter].style.display = "none";
		menu.firstElementChild.innerHTML= "arrow_drop_down";
	}	

	if(prevState=="none" || prevState=="")
	{
		menu.nextElementSibling.style.display="block";
		menu.firstElementChild.innerHTML= "arrow_drop_up";
	}
}

function Common_getUrlParam(param){
	let url = window.location.href;
	pos = url.search(param);
	if(pos>=0)
	{
		return url.substring(param.length+pos, url.length);
	}
	else return null;
	
}

function Common_changeLanguage(lang){
	let pathname = window.location.href;
	
	if(pathname.search('/hu/')>=0 && lang==='en')
	{
		window.location.href = pathname.replace('/hu','/en');
	}
	else if(pathname.search('/en/')>=0 && lang==='hu')
	{
		window.location.href = pathname.replace('/en','/hu');
	}
}



$(window).scroll(function(){ 
 /*if(!Common_isElementInView('#menu_navigation')&& fixedMenu==false){
	 $('#overall_menu').css({position:'fixed', top: '0', width:'100%'});	 
	 fixedMenu=true;
 }
 else if(Common_isElementInView('#header_main') && fixedMenu==true){ 
	 $('#overall_menu').css({position:'relative'});
	 fixedMenu=false;
 }*/

});

//This function will search for the item id in the product xml file and return the tag
function Common_getItemById(library, pathname)
{
	 path='//item';
		let nodes = library.evaluate(path, library, null, XPathResult.ANY_TYPE, null);
		let tags =  nodes.iterateNext();
		while (tags)
		{
			if(pathname.search(tags.id)>=0){
				return tags;
			}
			tags = nodes.iterateNext();
		}
		
	return null;
}

function Common_getItemInner(library,path){
	let nodes = library.evaluate(path, library, null, XPathResult.ANY_TYPE, null);
	let tags =  nodes.iterateNext();
	if(tags==null)
		return null;
	return tags.innerHTML;
}

function Common_isElementInView(elem)
{
    var elementTop = $(elem).offset().top;
	var elementBottom = elementTop + $(elem).outerHeight();
	var viewportTop = $(window).scrollTop();
	var viewportBottom = viewportTop + $(window).height();
	
	return elementBottom > viewportTop && elementTop < viewportBottom;	
}






