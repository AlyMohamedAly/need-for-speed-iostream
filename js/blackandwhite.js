
$(document).ready(function(e){
	
	
	var audio = {
		sfx:{
			select:	document.getElementById("sfx-select"),
			background: document.getElementById("sfx-background"),
			move:document.getElementById("sfx-move")
		}
	};
		

	function showLoading(){
		$( "#loading" ).fadeIn("slow");
	};
	

	function hideLoading(){
		$( "#loading" ).hide();
	};
	

	function backMainMenu(){
		$( ".sub-menu").hide();
		$( "#credits").hide();	
		$( "#guide").hide();	
		$( "#main-menu" ).fadeIn("slow");
		return false;
	};
	
	
	function loadSubMenu(mainMenu, mainOptions , _value){
		var body = $("body");
		var parentId = config["mainMenu"][_value].id;
		var subOptions = "<ul style='display:none;' data-parent-id='"+parentId+"' class='sub-menu' id='sub-menu-"+parentId+"'>";
		var subMenu = Object.keys(config["mainMenu"][_value].subMenu.options);
		var opt = {};
		$.each(subMenu, function(key,value){
			opt = config["mainMenu"][_value].subMenu.options[value];
			subOptions += "<li data-pos='"+key+"' data-id='"+_value+"' class='sub-menu-opt'>"+opt.title+"";
			if(opt.date != undefined){
				subOptions += " <small>"+opt.date+"</small>";
			}
			
			subOptions += "</li>";
		});
		body.append(subOptions+"<li class='back'>Back</li></ul>")
	};
	
	
	function showMainMenu(){
	
		
		var mainMenu = $("#main-menu");
		var mainOptions = Object.keys(config["mainMenu"]);
		
		$.each(mainOptions,function(key,value){
			
			if(config["mainMenu"][value].subMenu != undefined){
				loadSubMenu(mainMenu, mainOptions , value);
				mainMenu.append("<li data-type='submenu' data-pos='"+key+"' id='"+config["mainMenu"][value].id+"' class='main-menu-opt'>"+config["mainMenu"][value].title+"</li>");
			}else{
				mainMenu.append("<li data-id='"+value+"' data-pos='"+key+"' id='"+config["mainMenu"][value].id+"' class='main-menu-opt'>"+config["mainMenu"][value].title+"</li>");
			}
						
		});
		mainMenu.fadeIn("slow");
	};
	
	var config = {
		timeoutLoadingTime:10,
		mainMenu:{
			startGame:{
				id:"opt-start-game",
				title: "Return to Main Menu",
				callback:function(){
					showLoading();
					window.location.href = "/index.html";

				}
			},

		}
	};
	
	
	$(this).on("mouseenter","#main-menu li",function(){
	  var mainMenuLst = $("#main-menu li");
	  mainMenuLst.removeClass("selected-opt");
	  $(this).addClass("selected-opt");
	  audio.sfx.select.load();
	  audio.sfx.select.play();
	});
	
	
	$(this).on("mouseenter",".sub-menu li",function(){
	  var subMenuLst = $(".sub-menu li");
	  subMenuLst.removeClass("selected-opt");
	  $(this).addClass("selected-opt");
	  audio.sfx.select.load();
	  audio.sfx.select.play();
	})
	
   
	$(this).on("click",".sub-menu li",function(e){
		
		if($(this).hasClass("back")){	
			return backMainMenu();
		}
		
		var dataId = $(this).attr("data-id");
		var dataPos = $(this).attr("data-pos");
		audio.sfx.move.play();
		$(".sub-menu").hide();
		config["mainMenu"][dataId].subMenu.options["opt"+dataPos].callback();
	});
	
	
	$(this).on("click",".main-menu-opt",function(e){
		var type = $(this).attr("data-type");
		var id = $(this).attr("id");
		var dataId = $(this).attr("data-id");
		var mainMenu = $("#main-menu");
		var subMenu = $("#sub-menu-"+id+"");
		audio.sfx.move.play();
		mainMenu.hide();
		if(type == "submenu"){
			subMenu.fadeIn("slow");
		}else{
			config.mainMenu[dataId].callback();
		}

	});
	
	
	$(window).on("load", function(e){
		showLoading();
		setTimeout(function(){
		hideLoading();	
		audio.sfx.background.play();
		showMainMenu();
		},config.timeoutLoadingTime);
	});
	
});