const DOMPARSER = new DOMParser().parseFromString.bind(new DOMParser());

// the actual URL's of the RSS feed
var feedUrls = [
	"https://hacks.mozilla.org/feed/", 
	"https://webkit.org/feed/"
];

var frag = document.createDocumentFragment();
var hasBegun = true;

feedUrls.forEach((u) => {
	try {
		var url = new URL(u);
	}
	catch (e) {
		console.error('URL invalid: ' + u);
		return;
	}

	// use Yahoo's YQL service to circumvent CORS
	// https://developer.yahoo.com/yql/
	var yql = 'select * from rss where url="' + url + '"';
	var yqlUrl = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(yql);

	// fetch the RSS Feed
	fetch(yqlUrl).then((res) => {
		res.text().then((xmlTxt) => {
			// parse the RSS Feed and display the content
			try {
				let doc = DOMPARSER(xmlTxt, "text/xml");
				let heading = document.createElement('h1');
				heading.textContent = url.hostname;
				frag.appendChild(heading);
				doc.querySelectorAll('item').forEach((item) => {
					let temp = document.importNode(document.querySelector('template').content, true);
					let i = item.querySelector.bind(item);
					let t = temp.querySelector.bind(temp);
					t('h2').textContent = !!i('title') ? i('title').textContent : '-';
					t('a').textContent = t('a').href = !!i('link') ? i('link').textContent : '#';
					t('p').innerHTML = !!i('description') ? i('description').textContent : '-';
					t('h3').textContent = url.hostname;
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
});
