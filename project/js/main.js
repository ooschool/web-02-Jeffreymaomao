

function post(){
	fetch("https://script.google.com/macros/s/AKfycbzthlxe3tEoutmoz_azyjR5cQibnnaQcCgt3GBO-CgL3fwb2IMcGT9JZIYIhS30zfZ5yQ/exec", { 
		"method": "POST",
		"body": JSON.stringify({
			"password":1, // 16, 8, 判別身份 , 
			// https://www.md5.cz    -> name+time+... -> md5 -> password
			"b":2, "c":"3"})
	})
	.then((res) => {return res.text();})
	.then((result) => {
		const res = JSON.parse(result);
		console.log(res)
	})
	.catch((err) => console.log("err", err));
}



/* --------------------------------------------- */
function main(struct){
	const urlParams = new URLSearchParams(window.location.search);
	const page = urlParams.get("page");
	const isHome = (page === struct.name)||(!page); 
	if(isHome){
		loadHome(struct);
	}else{
		loadPage(struct, page);
	}
	loadSideBar(struct, page);
}
/* --------------------------------------------- */
function loadHome(struct){
	const content = document.getElementById("content");
	content.innerHTML = "";

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

		linkBtnA.href = `?page=${page.name}`;
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

/* --------------------------------------------- */
function loadPage(struct, pageLocation) {
    const content = document.getElementById("content");
    content.innerHTML = "";

    const cardWrapperDiv = document.createElement("div");
    cardWrapperDiv.classList.add("hero");
    cardWrapperDiv.id = "card-wrapper";

    const cardWrapperContainerDiv = document.createElement("div");
    cardWrapperContainerDiv.classList.add("container");

    content.appendChild(cardWrapperDiv);
    cardWrapperDiv.appendChild(cardWrapperContainerDiv);

    struct.children.forEach((page) => {
        if (page.name === pageLocation) {
            page.children.forEach((title) => {
                const titleDiv = createTitle(title);
                cardWrapperContainerDiv.appendChild(titleDiv);

                title.children.forEach((subtitle) => {
	                const { subtitleDiv, cardContainer } = createSubtitle(subtitle);
                    subtitle.children.forEach((card) => {
                        createCard(card, cardContainer);
                    });
                    // cardAddButton(cardContainer);

	                cardWrapperContainerDiv.appendChild(subtitleDiv);
	                cardWrapperContainerDiv.appendChild(cardContainer);
                });

            });
        }
    });
}

function createTitle(title) {
    const titleDiv = document.createElement('div');
    const titleA = document.createElement('a');
    const titleH2 = document.createElement('h2');

    titleDiv.classList.add("text-container", "title");
    titleH2.classList.add("text", "title-anchor-icon");

    titleDiv.id = title.id;
    titleA.href = "#" + title.id;
    titleH2.textContent = title.name;

    titleDiv.appendChild(titleA);
    titleA.appendChild(titleH2);

    return titleDiv;
}

function createSubtitle(subtitle) {
    const subtitleDiv = document.createElement('div');
    const subtitleA = document.createElement('a');
    const subtitleH3 = document.createElement('h3');
    const cardContainer = document.createElement('div');

    subtitleDiv.classList.add("text-container", "sub-title");
    subtitleH3.classList.add("text", "sub-title-anchor-icon");
    cardContainer.classList.add("card-container", "row");

    subtitleDiv.id = subtitle.id;
    subtitleA.href = "#" + subtitle.id;
    subtitleH3.textContent = subtitle.name;

    subtitleDiv.appendChild(subtitleA);
    subtitleA.appendChild(subtitleH3);

    return { subtitleDiv, cardContainer };
}

function createCard(card, cardContainer) {
    const cardDiv = document.createElement('div');
    const cardA = document.createElement('a');
    const cardImgDiv = document.createElement('div');
    const cardCaptionDiv = document.createElement('div');
    const cardImg = document.createElement('img');

    cardDiv.classList.add("col-lg-4", "col-md-6");
    cardA.classList.add("card");
    cardImgDiv.classList.add("img-container");
    cardCaptionDiv.classList.add("card-caption");
    cardImg.classList.add("card-img");

    cardCaptionDiv.textContent = card.name;
    cardImg.src = "./img/default.png";

    cardContainer.appendChild(cardDiv);
    cardDiv.appendChild(cardA);
    cardA.appendChild(cardImgDiv);
    cardA.appendChild(cardCaptionDiv);
    cardImgDiv.appendChild(cardImg);
}

function cardAddButton(cardContainer){
	const cardDiv = document.createElement('div');
	cardDiv.classList.add("col-lg-4","col-md-6");

	const cardA = document.createElement('a');
	cardA.classList.add("card");

	const adddIcon = document.createElement("div");
	adddIcon.classList.add("adding-icon");

	cardContainer.appendChild(cardDiv);
	cardDiv.appendChild(cardA);
	cardA.appendChild(adddIcon);
}



/* --------------------------------------------- */
/* sidebar */
function loadSideBar(struct, pageLocation){
	const sidebar = document.getElementById("sidebar");
	sidebar.innerHTML = "";

	const sidebarContainerDiv = document.createElement("div");
	sidebarContainerDiv.classList.add("container");

	const sidebarListDiv = document.createElement("div");
	sidebarListDiv.classList.add("sidebar-primary-menu");

	sidebar.appendChild(sidebarContainerDiv);
	sidebarContainerDiv.appendChild(sidebarListDiv);


	/* home */
	var isHome = pageLocation === struct.name || !pageLocation; // if page is root or undefined

	const sidebarItems = [];
	sidebarItems.push(
		createSidebarItem(struct, `?page=${struct.name}`, isActive=isHome, expandBtn=false)
	);
	/* page */
	struct.children.forEach((page)=>{
		const active = pageLocation===page.name;
		sidebarItems.push(
			createSidebarItem(page, `?page=${page.name}`, isActive=active, expandBtn=true)
		);
		sidebarItems.push(
			createNestedList(page)
		);
	})

	sidebarListDiv.append(...sidebarItems);
	/* append primary button DOM element*/
}

function createSidebarItem(obj, href, isActive, expandBtn) {
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

	if(expandBtn){
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
	}else{
		icon.classList.add("main-icon");
	}

	return item;
}

function createNestedList(page) {
	const list = document.createElement('ul');
	list.classList.add('sidebar-secondary-menu');

	page.children.forEach(item => {
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
		listItemA.href = `?page=${page.name}#${item.id}`

		item.children.forEach(sub=>{
			const subItem = document.createElement('li');
			subItem.classList.add("sidebar-tertiary-item");

			const subItemA = document.createElement('a');
			subItemA.classList.add("text-container");

			listItemSubList.appendChild(subItem);
			subItem.appendChild(subItemA);

			subItemA.textContent = sub.name;
			subItemA.href = `?page=${page.name}#${sub.id}`;
		})
	});

	return list;
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


