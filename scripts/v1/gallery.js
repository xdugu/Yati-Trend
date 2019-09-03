//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

//This class will contain all the properties about an item

function goBackToGallery()
{
	document.getElementById("stage").style.display="none";
}

function displayFullImage(img)
{
	document.getElementById("img_stage").firstElementChild.src= img.src;
	imgCollection = document.getElementById("sub_image").getElementsByClassName("sub_images");
	//setting the opacity of all images. Will change for the current selected image later
	for(var count=0;count<imgCollection.length;count++)
	{
		imgCollection[count].style.opacity="0.5";
	}
	
	img.style.opacity="1";
	
}

function changeImage(direction)
{
	var imgList = document.getElementById("main").getElementsByClassName("gal_img");
	var curImage = document.getElementById("stage_img").src;
	var counter;
	
	for(counter=0;counter<imgList.length;)
	{
		if(imgList[counter].src==curImage)
		{
			break;
		}
		else counter++;
	}
	direction= parseInt(direction,10);
	
	if(direction>0)
	{
		if(counter>=imgList.length-1)
			counter=0; //looping to first image
		else counter++;
		document.getElementById("stage_img").src= imgList[counter].src;
	}
	else
	{
		if(counter==0) //looping to last image
			counter=imgList.length -1;
		else counter--;
		document.getElementById("stage_img").src= imgList[counter].src;
		
	}
}




