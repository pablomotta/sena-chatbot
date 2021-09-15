//Clear local storage when new language is selected
////////////////////
function refreshLocalStorage() {
	localStorage.removeItem('bc-sid');
	console.log('local storage refreshed');
}

//Get user location and load chatbot
////////////////////
$.getJSON('https://json.geoiplookup.io/?callback=?', function (data) {
	$('#location').append(`
					<p>
						<b>City:</b> ${data.city}, <b>State:</b> ${data.region},
						<b>Zip Code:</b> ${data.postal_code},
						<b>Country:</b> ${data.country_name}
					</p>
				`);
	localStorage.setItem('country', data.country_code);
	console.log(JSON.stringify(data, null, 2));
	// check for clear local storage
	if (!localStorage.getItem('bc-sid')) {
		console.log('Sena chat refreshed');
	}
	// check for the url pathname
	var urlPath = window.location.pathname;
	// console.log(urlPath);
	function detectLanguage(urlPathname) {
		//split url path into array of items
		var pathItems = urlPathname.split('/');
		// console.log(pathItems);
		var language = '';
		// check for fr, de, es and it cases - en is default
		switch (pathItems[2]) {
			case 'fr':
				return (language = 'fr');
			case 'de':
				return (language = 'de');
			case 'es':
				return (language = 'es');
			case 'it':
				return (language = 'it');
			default:
				return (language = 'en');
		}
	}
	// store site language into variable
	const siteLanguage = detectLanguage(urlPath);
	console.log('site language = ', siteLanguage);

	window.botmindWidget = null;
	function initBotmindChat() {
		if (window.botmindWidget.works && window.botmindWidget.init) {
			window.botmindWidget.init(
				{
					token: 'd04f06fc-bb83-45d8-9b39-4b5443ab4bd9',
					host: 'https://api.widget.botmind.io',
					language: siteLanguage, // insert variable into chatbot initializer
				},
				{
					customData: [
						{
							key: 'user_country',
							value: data.country_code,
						},
						{
							key: 'user_coordinates',
							value: `${data.latitude}, ${data.longitude}`,
						},
					],
				}
			);
		}
	}
	function BCinitialize(i, t) {
		var n;
		i.getElementById(t)
			? initBotmindChat()
			: (((n = i.createElement('script')).id = t),
			  (n.async = !0),
			  (n.src = 'https://widget.botmind.io' + '/public/widget.js'),
			  (n.onload = initBotmindChat),
			  i.head.appendChild(n));
	}
	function BCinitiateCall() {
		BCinitialize(document, 'botmind-webchat-js');
	}
	if (document.readyState === 'loading') {
		window.addEventListener
			? window.addEventListener('load', BCinitiateCall, !1)
			: window.attachEvent('load', BCinitiateCall, !1);
	} else {
		BCinitiateCall();
	}
});

function setAllConsentCookies() {
	botmindWidget.consentCollected();
}
