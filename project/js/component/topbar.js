import {get} from "../utility/get.js"


function loadTopBar(struct){
	console.log("Here start to load the top bar.");

	// --------------------------------
	const userImageDom = document.getElementById("user-image");
	const userNameDom = document.getElementById("user-name");
	const user = struct.user;

	if(user){
		userNameDom.innerText = user;
	}


	let latestFile = null;
	let latestTime = null;

	struct.children.forEach((file) => {
	    const time = new Date(file.time);
	    if (file.MimeType.includes("image")) {
	        if (!latestTime || time > latestTime) {
	            latestTime = time;
	            latestFile = file;
	        }
	    }
	});

	if (latestFile && userImageDom) {
	    get(user, latestFile.id).then((data) => {
	        const blob = new Blob([new Uint8Array(data.bytes)], { type: data.MimeType });
	        const url = URL.createObjectURL(blob);
	        userImageDom.src = url;
	        userImageDom.onload = function() {
	            URL.revokeObjectURL(url);
	        }
	    });
	}


	// --------------------------------
}

export {loadTopBar};