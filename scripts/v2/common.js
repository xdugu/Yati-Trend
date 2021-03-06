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
		checkCookie();
		Common_checkNewsletterDisplay();
		if ('serviceWorker' in navigator) {
		  window.addEventListener('load', function() {
			navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
			  // Registration was successful
			  console.log('ServiceWorker registration successful with scope: ', registration.scope);
			}, function(err) {
			  // registration failed :(
			  console.log('ServiceWorker registration failed: ', err);
			});
		  });
		}

    }); 

// Cookie setings
function checkCookie(){
	 
	
	  window.dataLayer = window.dataLayer || [];
	  window['ga-disable-UA-131830139-1'] = true;
	  
	  //checking that we are on live site and not testing
	  let url = window.location.href;
	  inTestSite = url.indexOf('yati-trend');
	 
	 let useCookie = localStorage.getItem("useCookie");
	 if(useCookie == null && inTestSite>=0){
		  Common_changeCookie(true);
		  fbq('init', '780727239050016'); 
		  fbq('track', 'PageView');
	 } 
	 else if (useCookie=="true"){
		 window['ga-disable-UA-131830139-1'] = false;
		 fbq('init', '780727239050016'); 
	     fbq('track', 'PageView');
	 }
		 
	
	  function gtag(){dataLayer.push(arguments);}
	  gtag('js', new Date());
	  gtag('config', 'UA-131830139-1', { 'anonymize_ip': true });

}

function isPathCorrect(){//function to check if path has either /hu or /en to indicate 
//if we are in the website root or have made it to the correct directly
	  let pathname = window.location.href;
	  if(pathname.search("/hu/")>=0 || pathname.search("/en/")>=0)
		  return true;
	  else return false;
	
}

//Sanity to check to make sure we always reflect the right languages. Clled on every page refresh
function Common_checkLang(){
	let shopping=localStorage.getObj("shopping");
	let path = window.location.href;
	if (path.search("/hu/")>0 && shopping.contact.lang!=="hu"){
		shopping.contact.lang="hu";
		localStorage.setObj("shopping",shopping);
	}
	else if(path.search("/en/")>0 && shopping.contact.lang!=="en"){
		shopping.contact.lang="en";
		localStorage.setObj("shopping",shopping);
	}	
}

function Common_menuClicked()
{
	$("#mobile-submenu").toggle();
	$("#mobile-submenu .toHide").hide();
}

function Common_showBackground()
{
	$('#background_img').css('opacity','0.2');	
}

function Common_changeCookie(setting){
	localStorage.setItem("useCookie",setting);
	$('#privacy_placeholder').hide();
	if(setting==true)
		window['ga-disable-UA-131830139-1']=false;
		
	
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


function Common_parseUrlParam(){
	let url = window.location.href;
	let returnParams = {};
	paramPos = url.indexOf('?');
	if(paramPos<0)
		return {};
	url = url.substring(paramPos+1);//don't need the '?' any more
	for(;;){
		paramPos = url.indexOf('=');
		valPos = url.indexOf('&');
		if(paramPos>0 && valPos>0){
			returnParams[url.substring(0,paramPos)] = url.substring(paramPos+1,valPos);
			url = url.substring(valPos+1);
		}
		else if(paramPos>0 && valPos<0){
			returnParams[url.substring(0,paramPos)] = url.substring(paramPos+1);
			url='';
		}
		else if(paramPos<0){
			break;
		}
		
	}
	
	return returnParams;
	
}

function Common_changeLanguage(lang){
	
	let store = localStorage.getObj("shopping");
	let pathname = window.location.href;
	
	if(pathname.search('/hu/')>=0 && lang==='en')
	{
		window.location.href = pathname.replace('/hu','/en');
		store.contact.lang="en";
		localStorage.setObj("shopping",store);
	}
	else if(pathname.search('/en/')>=0 && lang==='hu')
	{
		window.location.href = pathname.replace('/en','/hu');
		store.contact.lang="hu";
		localStorage.setObj("shopping",store);
	}
	else{
		store.contact.lang="hu";
		localStorage.setObj("shopping",store);
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

//this function is called to check if newsletter prompt should be shown
function Common_checkNewsletterDisplay(){
	params = localStorage.getObj("params");
	if(params == null){
		params = {showNewsletterPrompt : true};
		localStorage.setObj("params", params);
	}
	
	if(params.showNewsletterPrompt == true){
		setTimeout(function(){
		$('#newsletter_modal').css({display:"block"});
		}, 7000);
		
	}
	
}

//this function is called to hide the newsletter. A delay function is added
//for when the user signs up so there is a delay to see the result of the sign up
function Common_hideNewsletterPrompt(delay){
	params = localStorage.getObj("params");
	params.showNewsletterPrompt = false;
	localStorage.setObj("params", params);
	setTimeout(function(){
		$('#newsletter_modal').css({display:"none"});
	}, delay);
}

function Common_isElementInView(elem)
{
    var elementTop = $(elem).offset().top;
	var elementBottom = elementTop + $(elem).outerHeight();
	var viewportTop = $(window).scrollTop();
	var viewportBottom = viewportTop + $(window).height();
	
	return elementBottom > viewportTop && elementTop < viewportBottom;	
}

function Common_pad(val){
	return val<10 ? '0'+val : val.toString();
}

function Common_mergeObject(obj,src){

    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;	
}

function Common_getNestedValue(obj, key) {
    return key.split(".").reduce(function(result, key) {
       return result[key] 
    }, obj);
}






