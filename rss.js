var frag = document.createDocumentFragment();
var hasBegun = true;

try {
	urlParams = new URLSearchParams(window.location.search);
	if (window.location.href.indexOf('?' + 'url' + '=') != -1) {
		url = urlParams.get('url');
	} else {
		url = "http://allrss.se/dramas/";
	}
	console.log(url)
}
catch (e) {
	console.error('URL invalid');
}

// use https://rss2json.com/ to circumvent CORS
var yqlUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(url);

// fetch the RSS Feed
fetch(yqlUrl).then((res) => {
	res.text().then((jsonTxt) => {
		// parse the RSS Feed and display the content
		try {
			let heading = document.createElement('h1');
			heading.textContent = url.hostname;
			frag.appendChild(heading);
			var t = JSON.parse(jsonTxt);
			t["items"].forEach((item) => {
				let temp = document.importNode(document.querySelector('template').content,true);
				let tempdoc = temp.querySelector.bind(temp);
				tempdoc('h2').textContent = item.title;
				tempdoc('a').textContent = item["enclosure"]['link']
				tempdoc('a').href = (window.location.href.split('?')[0] + '?url=' + item["enclosure"]['link']);
				//tempdoc('img').href = item["description"].split("\"")[1]
				frag.appendChild(temp);
			})
		} catch (e) {
			console.error('Error in parsing the feed');
		}
		if (hasBegun) {
			document.querySelector('output').textContent = ''; 
			hasBegun = false;
		}
		document.querySelector('output').appendChild(frag);
	});
}).catch(() => console.error('Error in fetching the RSS feed'));
