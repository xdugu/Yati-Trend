//This script is mainly called by the "Shopping" pages like Shop, basket and order confirmation

//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

order={ items:[], 
		subTotal:0, 
		delivery:0,
		total:0,
		contact:{firstName:"",lastName:"",email:"",address1:"",address2:"",city:"",country:"default",number:"",postCode:"", countryCode:""}
	
};


//Called when customer wants to add an item into the basket
function Shop_addToBasket(id, size, quantity)
{
		let myOrder=localStorage.getObj("order");
		let myBasket = myOrder.items;
		
		idMatched=false;
		if(myBasket.length<=0)
			myBasket.push({"id":id+size,"size":size,"quantity":quantity,"price":0,thumbnail:""});
		else
		{ 
			myBasket.forEach(function(item, index, array) {
			if(item.id==id+size)
			{
				item.quantity+=quantity;
				idMatched=true;
			}
		});
			if(idMatched==false)//if we currently don't have the id of the item
				 myBasket.push({"id":id+size,"size":size,"quantity":quantity,"price":0,thumbnail:""});
		}
		//Shop_fillItemData();
		//myOrder = Shop_updateTotal(myOrder);
		localStorage.setObj("order",myOrder);
		Shop_refreshBasket();	
		return myOrder;

	
}

//To ensure continuity of user experience, this function is called on every page to update the items in the Basket
function Shop_refreshBasket()
{
	let myOrder=localStorage.getObj("order");
	if(myOrder==null)
	{
		myOrder=order;
		localStorage.setObj("order",myOrder);

	}
	
	let myBasket= myOrder.items;
	let totalQuantity=0;
	for(let i=0; i<myBasket.length; i++)
	{
		totalQuantity+=myBasket[i].quantity;		
	}	
	
	if (totalQuantity>0)
	{
		$(".basket-num").html(totalQuantity);
	}
	else
		$(".basket-num").html('');
	Shop_fillItemData();
}


//Called to increment or decrement the quanity of an item in the shopping basket
function Shop_changeQuantity(id,changeBy)
{
	let myOrder=localStorage.getObj("order");
	let myBasket=myOrder.items;
	
	for(let i=0; i<myBasket.length; i++)
	{
		if(id == myBasket[i].id)
		{
			myBasket[i].quantity +=changeBy;
			if(myBasket[i].quantity<=0)
				myBasket[i].quantity=1;
		}		
	}	
	myOrder = Shop_updateTotal(myOrder);
	localStorage.setObj("order",myOrder);
	Shop_refreshBasket();
	return myOrder;
}

function Shop_removeItem(id)
{
	let myOrder=localStorage.getObj("order");
	let myBasket=myOrder.items;
	
	for(let i=0; i<myBasket.length; i++)
	{
		if(id == myBasket[i].id)
		{
			myBasket.splice(i,1);
		}		
	}
	
	myOrder = Shop_updateTotal(myOrder);
	localStorage.setObj("order",myOrder);
	Shop_refreshBasket();
	return myOrder;
}

//called after customer has paid for items, then we clear the local storage
function Shop_finishedShopping()
{
	localStorage.removeItem("order");
}

//This function is called to update the data in the item. It calls the products.xml file
function Shop_fillItemData()
{
	
	$.get('/res/products.xml','text').done(function (library){
		let myOrder=localStorage.getObj("order");
		let myBasket=myOrder.items;
		for(let i=0;i<myBasket.length;i++)
		{
			let tag = Common_getItemById(library, myBasket[i].id);
			/*myBasket[i].name = tag.getElementsByTagName('description')[0].getElementsByTagName('en')[0].innerHTML;
			myBasket[i].price = parseFloat(tag.getElementsByTagName('price')[0].getElementsByTagName('huf')[0].innerHTML, 10);
			myBasket[i].thumbnail = tag.getElementsByTagName('image')[0].innerHTML + "/img_1.jpg"; */
			let specificItem = Common_getItemInner(library,"//item[@id='"+ tag.id +"']/description/en");

			if( window.location.href.search('/en/')>0)
			{
				myBasket[i].name = specificItem;
			}
			else myBasket[i].name = Common_getItemInner(library,"//item[@id='"+tag.id+"']/description/hu");
			
			myBasket[i].price = parseFloat(Common_getItemInner(library,"//item[@id='"+ tag.id+"']/price/huf"),10);
			
			myBasket[i].thumbnail = Common_getItemInner(library,"//item[@id='"+ tag.id +"']/image")+ "/img_1.jpg";
			}
			localStorage.setObj("order", Shop_updateTotal(myOrder));
			
		
	});
	
}

function Shop_updateContact(contact){
	let myOrder=localStorage.getObj("order");
	myOrder.contact=contact;
	myOrder = Shop_updateTotal(myOrder);
	localStorage.setObj("order",myOrder);
	return myOrder;
}
//
function Shop_updateTotal(myOrder)
{
	let myBasket=myOrder.items;
	
	switch(myOrder.contact.country)
	{
		case 'Hungary':
			myOrder.delivery=1600;
			break;
		case 'UK':
			myOrder.delivery=7000;
			break;
		default:
			myOrder.delivery=6000;					
	}
	
	myOrder.subTotal=0;
	for(let i=0; i<myBasket.length;i++)
	{
			myOrder.subTotal+= myBasket[i].price * myBasket[i].quantity;
	}
	
	myOrder.total=myOrder.delivery + myOrder.subTotal;
	
	return myOrder;
	
}

	






