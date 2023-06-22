const SidebarExpandBTN = document.querySelectorAll(".sidebar .btn-container");
for(var i=0;i<SidebarExpandBTN.length;i++){
	const btn = SidebarExpandBTN[i];
	btn.addEventListener("click",(e)=>{
		e.preventDefault();
		btn.querySelector(".icon").classList.toggle("expanded-icon");
		btn.querySelector(".icon").classList.toggle("collapsed-icon");
		const menu = btn.parentElement.nextElementSibling;
		
		if (menu.style.maxHeight) {
	    	menu.style.maxHeight = null;
	    } else {
	    	menu.style.maxHeight = menu.scrollHeight + "px";
	    } 
	})
}