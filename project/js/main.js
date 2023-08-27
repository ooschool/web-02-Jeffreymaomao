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
	console.log("The post information is:");
	console.log(body);
	console.log("Notice that the function of post has not finished yet!\nSo this request won't post anyting to the database.");
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
	const isHome = ((page === struct.id)||(!page)) && (!subpage); 
	if(isHome){
		loadHome(struct);
	}else if(page){
		loadPage(struct, page);
	}else if(subpage){
		loadSubPage(struct, subpage)
	}
	loadSideBar(struct, page, subpage);
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

