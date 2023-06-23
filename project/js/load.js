
const cardWrapper = document.querySelector("#card-wrapper .container")
/**
 * if need to reverse the order
 * 
 * > Object.keys(json[pageName]).reverse().forEach()
 * > Object.keys(json[pageName][title]).reverse().forEach()
 * > Object.keys(json[pageName][title][subtitle]).reverse().forEach()
 * 
 * */
function loadCard(JSONpath,pageName){
	fetch(JSONpath)
	.then((response) => response.json())
	.then((json) => {
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


	});
}
