/**
 * if need to reverse the order
 * 
 * > Object.keys(json[pageName]).reverse().forEach()
 * 
 * > Object.keys(json[pageName][title]).reverse().forEach()
 * 
 * > Object.keys(json[pageName][title][subtitle]).reverse().forEach()
 * 
 * */

function loadSideBar(json,pageName){
	var isHome = false;
	/* in home page */
	if(Object.keys(json).indexOf(pageName)==-1){	
		isHome = true;
	}
	const sidebar = document.querySelector("#sidebar .container .sidebar-primary-menu");
	/* Home */
	const primaryA = document.createElement('a');
	const primaryIconContainerDiv = document.createElement('div');
	const primaryIconDiv = document.createElement('div');
	const primaryTextContainerDiv = document.createElement('div');
	const primaryTextDiv = document.createElement('div');

	primaryA.classList.add("sidebar-primary-item");
	primaryIconContainerDiv.classList.add("icon-container");
	primaryTextContainerDiv.classList.add("text-container");
	primaryIconDiv.classList.add("icon","main-icon")
	primaryTextDiv.classList.add("text");

	primaryTextDiv.textContent = "main";
	if(isHome){
		primaryA.href = "./index.html";
		primaryA.classList.add("active");
	}else{
		primaryA.href = "../index.html";
	}
	

	sidebar.appendChild(primaryA);
	primaryA.appendChild(primaryIconContainerDiv);
	primaryA.appendChild(primaryTextContainerDiv);
	primaryIconContainerDiv.appendChild(primaryIconDiv);
	primaryTextContainerDiv.appendChild(primaryTextDiv);

	Object.keys(json).forEach((page)=>{
		const primaryA = document.createElement('a');
		const primaryIconContainerDiv = document.createElement('div');
		const primaryIconDiv = document.createElement('div');
		const primaryTextContainerDiv = document.createElement('div');
		const primaryTextDiv = document.createElement('div');
		const primaryExpandContainerDiv = document.createElement('div');
		const primaryExpandDiv = document.createElement('div');
		const primaryList = document.createElement('ul');

		primaryA.classList.add("sidebar-primary-item");
		primaryIconContainerDiv.classList.add("icon-container");
		primaryTextContainerDiv.classList.add("text-container");
		primaryIconDiv.classList.add("icon", page+"-icon");
		primaryTextDiv.classList.add("text");
		primaryExpandContainerDiv.classList.add("btn-container");
		primaryExpandDiv.classList.add("icon","collapsed-icon");
		primaryList.classList.add("sidebar-secondary-menu");

		if(pageName === page){primaryA.classList.add("active");}

		primaryTextDiv.textContent = page;
		if(isHome){
			primaryA.href = "./pages/"+page+".html";
		}else{
			primaryA.href = "./"+page+".html";
		}

		sidebar.appendChild(primaryA);
		sidebar.appendChild(primaryList);
		primaryA.appendChild(primaryIconContainerDiv);
		primaryA.appendChild(primaryTextContainerDiv);
		primaryA.appendChild(primaryExpandContainerDiv);
		primaryIconContainerDiv.appendChild(primaryIconDiv);
		primaryTextContainerDiv.appendChild(primaryTextDiv);
		primaryExpandContainerDiv.appendChild(primaryExpandDiv);

		Object.keys(json[page]).forEach((title)=>{
			
			const secondaryItem = document.createElement('li');
			const secondaryA = document.createElement('a');
			const secondaryList = document.createElement('ul');

			secondaryItem.classList.add("sidebar-secondary-item");
			secondaryA.classList.add("text-container");
			secondaryList.classList.add("sidebar-tertiary-menu");
			
			secondaryA.textContent = title;
			if(isHome){
				secondaryA.href = "./pages/" + page + ".html#" + title;
			}else{
				secondaryA.href = "./" + page + ".html#" + title;
			}

			primaryList.appendChild(secondaryItem);
			primaryList.appendChild(secondaryList);
			secondaryItem.appendChild(secondaryA);

			Object.keys(json[page][title]).forEach((subtitle)=>{
				const tertiaryItem = document.createElement('li');
				const tertiaryA = document.createElement('a');

				tertiaryItem.classList.add("sidebar-tertiary-item");
				tertiaryA.classList.add("text-container");
				
				tertiaryA.textContent = subtitle;
				tertiaryA.href = "#!";
				if(isHome){
					tertiaryA.href = "./pages/" + page + ".html#" + title + subtitle;
				}else{
					tertiaryA.href = "./" + page + ".html#" + title + subtitle;
				}

				secondaryList.appendChild(tertiaryItem);
				tertiaryItem.appendChild(tertiaryA);

			})
		})
	})
}

function loadCard(json,pageName){
	const cardWrapper = document.querySelector("#card-wrapper .container");
	Object.keys(json[pageName]).forEach((title)=>{
		/* -- start title  ---------------------------------------- */
		const titleDiv = document.createElement('div');
		const titleA = document.createElement('a');
		const titleH2 = document.createElement('h2');

		titleDiv.classList.add("text-container","title");
		titleH2.classList.add("text","title-anchor-icon")

		titleDiv.id = title;		/* Notice: need symbols -> underscore */
		titleA.href = "#"+title;	/* Notice: need symbols -> underscore */
		titleH2.textContent = title;

		cardWrapper.appendChild(titleDiv);
		titleDiv.appendChild(titleA);
		titleA.appendChild(titleH2);

		Object.keys(json[pageName][title]).forEach((subtitle)=>{
			/* -- start subtitle  --------------------------------- */
			const subtitleDiv = document.createElement('div');
			const subtitleA = document.createElement('a');
			const subtitleH3 = document.createElement('h3');
			const cardContainer = document.createElement('div');

			subtitleDiv.classList.add("text-container","sub-title");
			subtitleH3.classList.add("text","sub-title-anchor-icon")
			cardContainer.classList.add("card-container","row");

			subtitleDiv.id = title + subtitle; 		/* Notice: need symbols -> underscore */
			subtitleA.href = "#"+ title + subtitle; 	/* Notice: need symbols -> underscore */
			subtitleH3.textContent = subtitle;

			cardWrapper.appendChild(subtitleDiv);
			subtitleDiv.appendChild(subtitleA);
			subtitleA.appendChild(subtitleH3);
			cardWrapper.appendChild(cardContainer);

			json[pageName][title][subtitle].forEach((card)=>{
				/* -- start card -----------------------------------*/
				const cardDiv = document.createElement('div');
				const cardA = document.createElement('a');
				const cardImgDiv = document.createElement('div');
				const cardCaptionDiv = document.createElement('div');
				const cardImg = document.createElement('img');

				cardDiv.classList.add("col-lg-4","col-md-6");
				cardA.classList.add("card");
				cardImgDiv.classList.add("img-container");
				cardCaptionDiv.classList.add("card-caption");
				cardImg.classList.add("card-img");

				cardCaptionDiv.textContent = card["title"];

				if(card["image"]==""||card["image"]){
					cardImg.src = "../img/default.png"
				}else{
					cardImg.src = card["image"];
				}

				if(card["link"]==""||card["link"]){
					cardA.href = "#!"
				}else{
					cardA.href = card["link"];
				}

				cardContainer.appendChild(cardDiv);
				cardDiv.appendChild(cardA);
				cardA.appendChild(cardImgDiv);
				cardA.appendChild(cardCaptionDiv);
				cardImgDiv.appendChild(cardImg);


				/* -- end card -------------------------------------*/
			})
			/* -- end subtitle  ----------------------------------- */
		})
		/* -- end title  ------------------------------------------ */
	})
}
