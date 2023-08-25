const user = "Chang Mao Yang";

const postURL = `
https://script.google.com/macros/s/AKfycbxWWArRaUZFLi463aSDbPRHQIn_kN3HX0glmhaeer_Ryjjk9uArrT54_4-jjL10tHL3/exec
`
const getURL  = "https://script.google.com/macros/s/AKfycbwtIWCwboyUx2KCsNNMO57UmnK2dPkASH6vodqjhOn44FGf0yvBmZivv--L2JKAkDRQ-w/exec"

const loadedFile = new Object();

function post(body){
	// fetch(postURL, { 
	// 	"method": "POST",
	// 	"body": JSON.stringify(body)
	// })
	// .then((res) => {return res.text();})
	// .then((result) => {
	// 	const res = JSON.parse(result);
	// 	console.table(res)
	// })
	// .catch((err) => console.log("err", err));
	// console.table(body);
	console.table(body);
}

function get(id=null){
	const fetchURL = id ? getURL + '?id=' + id : getURL;
	if(loadedFile[id]){
		return new Promise((resolve, reject) => {
			resolve(loadedFile[id]);
		});
	}

	return fetch(fetchURL, { "method": "GET"})
		.then((res) => {return res.text();})
		.then((result) => {
			const Drive = JSON.parse(result);

			if(Drive.file){
				loadedFile[Drive.file.id] = Drive.file;
				return Drive.file;
			}

			if(Drive.struct){
				main(Drive.struct);
				window.localStorage.NoteTree = JSON.stringify(Drive);
				console.log("reload");
			}
		})
		.catch((err) => {
			console.log("err", err);
			return null;
		});
}
/* --------------------------------------------- */
function main(struct){
	const urlParams = new URLSearchParams(window.location.search);
	const page = urlParams.get("page");
	const subpage = urlParams.get("subpage");
	const isHome = ((page === struct.id)||(!page))&&(!subpage); 
	if(isHome){
		loadHome(struct);
	}
	if(page){
		loadPage(struct, page);
	}
	if(subpage){
		loadSubPage(struct, subpage)
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
		createLinkButton(page.name, `?page=${page.id}`, linkBtnContainerDiv);
	})

	homeAddButton(linkBtnContainerDiv, struct);
}

function createLinkButton(name, href, linkBtnContainerDiv) {
	const linkBtnA = document.createElement("a");
	const linkTextContainerDiv = document.createElement("div");
	const linkTextH1 = document.createElement("h1");

	linkBtnA.classList.add("link-btn");
	linkTextContainerDiv.classList.add("text-container");
	linkTextH1.classList.add("text");

	linkBtnContainerDiv.appendChild(linkBtnA);
	linkBtnA.appendChild(linkTextContainerDiv);
	linkTextContainerDiv.appendChild(linkTextH1);

	linkBtnA.href = href;
	if(name){
		linkTextH1.textContent = name;
	}
	if(!name&&href=="#adding"){
		const addIcon = document.createElement("div")
		addIcon.classList.add("adding-icon");
		linkBtnA.appendChild(addIcon);
		return {linkBtnA, linkTextContainerDiv, linkTextH1, addIcon}
	}
}

function homeAddButton(buttonContainerDiv, struct){
	const {linkBtnA, linkTextContainerDiv, linkTextH1, addIcon} = createLinkButton(undefined, "#adding", buttonContainerDiv);

	/* --- */
	linkBtnA.addEventListener("click", addFolder);
	function addFolder(e){
		/* --- */
		const urlParams = new URLSearchParams(window.location.search);
		const page = urlParams.get("page");
		const postTime = getCurrentTime();

		if(page==null||page==struct.id){
			/* --- */
			addIcon.style.display = "none";
			linkBtnA.classList.add("adding");

			/* --- */
			const addInput = createAddInputButton();
			linkTextH1.appendChild(addInput);
			addInput.focus();

			/* --- */
			var inputChanged = false;
			addInput.addEventListener("keypress", checkInputChange);
			function checkInputChange(e){
				inputChanged = true;
				if(e.key=="Enter"){
					homeAddPost({"target":[]});
				}
			}

			/* --- */
			window.addEventListener('click', homeAddPost);
			function homeAddPost(event) {
				/* if click outside the adding card => cancel adding */
			    if (![linkBtnA,linkTextContainerDiv,linkTextH1,addInput,addIcon].includes(event.target)) {
			    	linkBtnA.classList.remove("adding");
			    	addInput.remove();
			    	
			    	if(inputChanged&&addInput.value!=""){
			    		const name = addInput.value;
			    		/* ---input content has been changed--- */
						console.log("confirm add");
						linkTextH1.textContent = name;
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
			        window.removeEventListener('click', homeAddPost);
			    }
			}
			linkBtnA.removeEventListener('click', addFolder)
		}
	};
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
        if (page.id === pageLocation) {
            page.children.forEach((title) => {
            	/* add title */
                const titleDiv = createTitle(title);
                cardWrapperContainerDiv.appendChild(titleDiv);

                title.children.forEach((subtitle) => {
                	/* add subtitle */
	                const { subtitleDiv, cardContainer } = createSubtitle(subtitle);
                    subtitle.children.forEach((card) => {
                    	/* add card */
                        createCard(card.name, `?subpage=${card.id}`, cardContainer);
                    });
                    cardAddButton(cardContainer, struct);

	                cardWrapperContainerDiv.appendChild(subtitleDiv);
	                cardWrapperContainerDiv.appendChild(cardContainer);
                });
            });
            // const TitleAddButton = createTitle();
            // cardWrapperContainerDiv.appendChild(TitleAddButton);

            // const SubTitleAddButton = createSubtitle();
            // cardWrapperContainerDiv.appendChild(SubTitleAddButton);
        }
    });
}

function createTitle(title) {
    const titleDiv = document.createElement('div');
    const titleA = document.createElement('a');
    const titleH2 = document.createElement('h2');

    titleDiv.classList.add("text-container", "title");
    titleH2.classList.add("text");

    titleDiv.appendChild(titleA);
    titleA.appendChild(titleH2);

    if(title){
	    titleH2.classList.add("title-anchor-icon");
    	titleDiv.id = title.id;
	    titleA.href = "#" + title.id;
	    titleH2.textContent = title.name;
    }
    else{
    	const addIcon = document.createElement("div");
		addIcon.classList.add("adding-icon");
		titleA.appendChild(addIcon);
		titleH2.textContent = "add new title"
    }
    return titleDiv;
}

function createSubtitle(subtitle) {
    const subtitleDiv = document.createElement('div');
    const subtitleA = document.createElement('a');
    const subtitleH3 = document.createElement('h3');

    subtitleDiv.classList.add("text-container", "sub-title");
    subtitleH3.classList.add("text");

    subtitleDiv.appendChild(subtitleA);
    subtitleA.appendChild(subtitleH3);

    if(subtitle){
    	subtitleDiv.id = subtitle.id;
	    subtitleA.href = "#" + subtitle.id;
	    subtitleH3.textContent = subtitle.name;
	    subtitleH3.classList.add("sub-title-anchor-icon");
    }else{
    	const addIcon = document.createElement("div");
		addIcon.classList.add("adding-icon");
		subtitleA.appendChild(addIcon);
    	subtitleH3.textContent = "add new subtitle";
    	return subtitleDiv;
    }

    const cardContainer = document.createElement('div');
    cardContainer.classList.add("card-container", "row");

    return { subtitleDiv, cardContainer };
}

function createCard(name, href, cardContainer) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add("col-lg-4", "col-md-6","col-sm-12");

    const cardA = document.createElement('a');
    cardA.classList.add("card");
    cardA.href = href;

    const cardImgDiv = document.createElement('div');
    cardImgDiv.classList.add("img-container");

    const cardCaptionH4 = document.createElement('h4');
    cardCaptionH4.classList.add("card-caption", "text");

    const cardImg = document.createElement('img');
    cardImg.classList.add("card-img");

    cardContainer.appendChild(cardDiv);
    cardDiv.appendChild(cardA);
    cardA.appendChild(cardImgDiv);
    cardA.appendChild(cardCaptionH4);
    cardImgDiv.appendChild(cardImg);

    if(name){
	    cardCaptionH4.textContent = name;
	    cardImg.src = "./img/default.png";
    }
    if(!name&&href=="#adding"){
    	const addIcon = document.createElement("div");
		addIcon.classList.add("adding-icon");
		cardA.appendChild(addIcon);
		return {cardDiv, cardA, cardImgDiv, cardCaptionH4, cardImg, addIcon}
    }
}

function cardAddButton(cardContainer, struct){
	const {cardDiv, cardA, cardImgDiv, cardCaptionH4, cardImg, addIcon} = createCard(undefined, "#adding", cardContainer);
	/* --- */
	cardDiv.addEventListener("click", addFolder);
	function addFolder(e){
		const urlParams = new URLSearchParams(window.location.search);
		const page = urlParams.get("page");
		const subtitle = cardDiv.parentNode.previousSibling;
		const postTime = getCurrentTime();

		/* --- */
		const addInput = createAddInputButton();
		cardCaptionH4.appendChild(addInput);
		addInput.focus();

		var inputChanged = false;
		addInput.addEventListener("keypress", checkInputChange);
		function checkInputChange(e){
			inputChanged = true;
			if(e.key=="Enter"){
				cardAddPost({"target":[]});
			}
		}
		
		window.addEventListener('click', cardAddPost);
		function cardAddPost(event){
			addIcon.style.display = "none";
			if(![cardDiv, cardA, cardImgDiv, cardCaptionH4, cardImg, addIcon].includes(event.target)){
				addInput.remove();
				if(inputChanged&&addInput.value!=""){
					const name = addInput.value;
					/* ---input content has been changed--- */
					console.log("confirm add");
					cardAddButton(cardContainer, struct);
				    cardImg.src = "./img/default.png";
					cardCaptionH4.textContent = addInput.value;

					const body = {
			        	"user": user,
						"postTime": postTime,
						"name": name,
						"parent": {
							"id": subtitle.id,
							"name": subtitle.firstChild.textContent,
						},
						"id": sha256(user+postTime)
					}
					post(body);
				}else{
					/* ---input content has NOT been changed--- */
		    		console.log("cancel add");
					addIcon.style.display = "block";
			        cardDiv.classList.remove("adding");
			        cardDiv.addEventListener("click", addFolder);
				}
				window.removeEventListener('click', cardAddPost);
			}
		}
		cardDiv.removeEventListener('click', addFolder);
	}
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
	var isHome = pageLocation === struct.id || !pageLocation; // if page is root or undefined

	const sidebarItems = [];
	sidebarItems.push(
		createSidebarItem(struct, `?page=${struct.id}`, isActive=isHome, expandBtn=false)
	);
	/* page */
	struct.children.forEach((page)=>{
		const active = pageLocation===page.id;
		sidebarItems.push(
			createSidebarItem(page, `?page=${page.id}`, isActive=active, expandBtn=true)
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
		listItemA.href = `?page=${page.id}#${item.id}`

		item.children.forEach(sub=>{
			const subItem = document.createElement('li');
			subItem.classList.add("sidebar-tertiary-item");

			const subItemA = document.createElement('a');
			subItemA.classList.add("text-container");

			listItemSubList.appendChild(subItem);
			subItem.appendChild(subItemA);

			subItemA.textContent = sub.name;
			subItemA.href = `?page=${page.id}#${sub.id}`;
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
function findPreviousElementSiblingWithClass(element, className) {
  let previousSibling = element.previousElementSibling;
  console.log(previousSibling)
  
  while (previousSibling) {
    if (previousSibling.classList.contains(className)) {
      return previousSibling;
    }
    
    previousSibling = previousSibling.previousElementSibling;
  }
  
  return null;
}

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
