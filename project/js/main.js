
const postURL = `
https://script.google.com/macros/s/AKfycbxWWArRaUZFLi463aSDbPRHQIn_kN3HX0glmhaeer_Ryjjk9uArrT54_4-jjL10tHL3/exec
`
const getURL  = "https://script.google.com/macros/s/AKfycbwtIWCwboyUx2KCsNNMO57UmnK2dPkASH6vodqjhOn44FGf0yvBmZivv--L2JKAkDRQ-w/exec"

function post(body){
	fetch(postURL, { 
		"method": "POST",
		"body": JSON.stringify(body)
	})
	.then((res) => {return res.text();})
	.then((result) => {
		const res = JSON.parse(result);
		console.table(res)
	})
	.catch((err) => console.log("err", err));
	console.table(body);
}

function get(){
	fetch(getURL, { "method": "GET"})
	.then((res) => {return res.text();})
	.then((result) => {
		const Drive = JSON.parse(result);
		main(Drive.struct);
		console.log("reload");
		window.localStorage.NoteTree = JSON.stringify(Drive);
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

	homeAddButton(linkBtnContainerDiv, struct);
}

function homeAddButton(buttonContainerDiv, struct){
	const {linkBtnA, textContainerDiv, textH1, addIcon} = createLinkButton("#adding");
	buttonContainerDiv.appendChild(linkBtnA);

	/* --- */
	linkBtnA.addEventListener("click", addFolder);
	function addFolder(e){
		/* --- */
		const urlParams = new URLSearchParams(window.location.search);
		const page = urlParams.get("page");
		const postTime = getCurrentTime();

		if(page==null||page==struct.name){
			/* --- */
			addIcon.style.display = "none";
			linkBtnA.classList.add("adding");

			/* --- */
			const addIinput = createAddInputButton();
			textH1.appendChild(addInput);
			addInput.focus();

			var inputChanged = false;
			/* --- */
			addInput.addEventListener("input", checkInputChange);
			function checkInputChange(){
				inputChanged = true;
			}

			/* --- */
			window.addEventListener('click', cancelRequest);
			function cancelRequest(event) {
				/* if click outside the adding card => cancel adding */
			    if (![linkBtnA,textContainerDiv,textH1,addInput,addIcon].includes(event.target)) {
			    	linkBtnA.classList.remove("adding");
			    	addInput.remove();
			    	
			    	if(inputChanged&&addInput.value!=""){
			    		const name = addInput.value;
			    		const user = "Chang Mao Yang";
			    		/* ---input content has been changed--- */
						console.log("confirm add");
						textH1.textContent = name;
						addIcon.remove();
				        homeAddButton(buttonContainerDiv, struct);
				        /* --- */
				        const body = {
				        	"user": user,
							"postTime": postTime,
							"name": name,
							"parent": {
								"name": struct.name,
								"id": struct.id,
							},
							"id": sha256(user+postTime)
						}
				        post(body);
				        /* ---*/
			    	}else{
			    		/* ---input content has NOT been changed--- */
			    		console.log("cancel add");
						addIcon.style.display = "block";
				        linkBtnA.classList.remove("adding");
				        linkBtnA.addEventListener("click", addFolder);
			    	}	
			        window.removeEventListener('click', cancelRequest);
			    }
			}
			linkBtnA.removeEventListener('click', addFolder)
		}
	};
}

function createLinkButton(href) {
    const linkBtnA = document.createElement("a");
    const textContainerDiv = document.createElement("div");
    const textH1 = document.createElement("h1");
    const addIcon = document.createElement("div");

    linkBtnA.classList.add("link-btn");
    textContainerDiv.classList.add("text-container");
    textH1.classList.add("text");
    addIcon.classList.add("adding-icon");

    linkBtnA.appendChild(textContainerDiv);
    textContainerDiv.appendChild(textH1);
    linkBtnA.appendChild(addIcon);

    linkBtnA.href = href;

    return {linkBtnA, textContainerDiv, textH1, addIcon};
}

function createAddInputButton() {
	const addInput = document.createElement("input");
	addInput.classList.add("adding-input");
	addInput.type = "text";
	addInput.placeholder = "new folder";

	return addInput;
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

/* ---------------------------------------------------------------------- */
// tool
function getCurrentTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // 格式為 "YYYY-MM-DD HH:mm:ss"
  const formattedDateTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
  return formattedDateTime;
}
