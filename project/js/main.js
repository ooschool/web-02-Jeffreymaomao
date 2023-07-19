function main(struct){
	loadHome(struct);
	loadSideBar(struct);
}

function loadHome(struct){
	const content = document.getElementById("content");

	/* button list*/
	const linkWrapperDiv = document.createElement("div");
	const linkWrapperContainerDiv = document.createElement("div");
	const linkBtnContainerDiv = document.createElement("div");

	content.appendChild(linkWrapperDiv);
	linkWrapperDiv.appendChild(linkWrapperContainerDiv);
	linkWrapperContainerDiv.appendChild(linkBtnContainerDiv);

	linkWrapperDiv.classList.add("hero");
	linkWrapperDiv.id = "link-wrapper";
	linkWrapperContainerDiv.classList.add("container");
	linkBtnContainerDiv.classList.add("link-btn-container");

	struct.children.forEach((page)=>{
		const linkBtnA = document.createElement("a");
		const linkTextContainerDiv = document.createElement("div");
		const linkTextH1 = document.createElement("h1");

		linkBtnA.classList.add("link-btn");
		linkTextContainerDiv.classList.add("text-container");
		linkTextH1.classList.add("text");

		linkBtnContainerDiv.appendChild(linkBtnA);
		linkBtnA.appendChild(linkTextContainerDiv);
		linkTextContainerDiv.appendChild(linkTextH1);

		linkBtnA.href = "#!";
		linkTextH1.textContent = page.name;
	})

	homeAddButton(linkBtnContainerDiv);
}

function homeAddButton(buttonContainer){
	const linkBtnA = document.createElement("a");
	linkBtnA.classList.add("link-btn");

	const adddIcon= document.createElement("div");
	adddIcon.classList.add("adding-icon");

	buttonContainer.appendChild(linkBtnA);
	linkBtnA.appendChild(adddIcon);

	linkBtnA.href = "#!";
}

/* sidebar */
function loadSideBar(struct){
	const sidebar = document.getElementById("sidebar");

	const sidebarContainerDiv = document.createElement("div");
	const sidebarListDiv = document.createElement("div");

	sidebarContainerDiv.classList.add("container");
	sidebarListDiv.classList.add("sidebar-primary-menu");

	sidebar.appendChild(sidebarContainerDiv);
	sidebarContainerDiv.appendChild(sidebarListDiv);

	/* Home */
	const sidebarItems = [];
	sidebarItems.push(
		createSidebarItem(struct, "#!", isActive=true, isHome=true)
	);

	struct.children.forEach((page)=>{
		sidebarItems.push(
			createSidebarItem(page, "#!", isActive=false, isHome=false)
		);
		sidebarItems.push(
			createNestedList(page)
		);
	})

	sidebarListDiv.append(...sidebarItems);

	/* append primary button DOM element*/
}

function createSidebarItem(obj, href, isActive, isHome) {
	const item = document.createElement('a');
	item.classList.add('sidebar-primary-item');
	item.href = href;
	if (isActive) {
		item.classList.add('active');
	}

	const iconContainer = document.createElement('div');
	iconContainer.classList.add('icon-container');

	const icon = document.createElement('div');
	icon.classList.add('icon');

	const textContainer = document.createElement('div');
	textContainer.classList.add('text-container');

	const textDiv = document.createElement('div');
	textDiv.classList.add('text');
	textDiv.textContent = obj.name;

	item.appendChild(iconContainer);
	item.appendChild(textContainer);
	iconContainer.appendChild(icon);
	textContainer.appendChild(textDiv);

	if(isHome){
		icon.classList.add("main-icon");
	}else{
		icon.classList.add(`${obj.name}-icon`);

		/* expand icon */
		const expandContainer = document.createElement('div');
		expandContainer.classList.add("btn-container");

		const expand = document.createElement('div');
		expand.classList.add("icon","collapsed-icon");

		item.appendChild(expandContainer);
		expandContainer.appendChild(expand);

		/* Event Listener */
		sideBarEventListener(expandContainer);
	}

	return item;
}

function sideBarEventListener(button){
	button.addEventListener("click",(e)=>{
		e.preventDefault();
		button.querySelector(".icon").classList.toggle("expanded-icon");
		button.querySelector(".icon").classList.toggle("collapsed-icon");
		const menu = button.parentElement.nextElementSibling;
		if(menu){
			if (menu.style.maxHeight) {
		    	menu.style.maxHeight = null;
		    } else {
		    	menu.style.maxHeight = menu.scrollHeight + "px";
		    } 
		}
	})
}

function createNestedList(obj) {
	const list = document.createElement('ul');
	list.classList.add('sidebar-secondary-menu');

	obj.children.forEach(item => {
		const listItem = document.createElement('li');
		listItem.classList.add('sidebar-secondary-item');

		const listItemA = document.createElement('a');
		listItemA.classList.add("text-container");

		const listItemSubList = document.createElement('ul');
		listItemSubList.classList.add("sidebar-tertiary-menu");

		list.appendChild(listItem);
		listItem.appendChild(listItemA);
		list.appendChild(listItemSubList);


		listItemA.textContent = item.name;
		listItemA.href = "#!";

		item.children.forEach(sub=>{
			const subItem = document.createElement('li');
			subItem.classList.add("sidebar-tertiary-item");

			const subItemA = document.createElement('a');
			subItemA.classList.add("text-container");

			listItemSubList.appendChild(subItem);
			subItem.appendChild(subItemA);

			subItemA.textContent = sub.name;
			subItemA.href = "#!"	
		})
	});

	return list;
}


