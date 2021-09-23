//Clear local storage when new language is selected
////////////////////
function refreshLocalStorage() {
	localStorage.removeItem('bc-sid');
	console.log('local storage refreshed');
}

//Get user location and load chatbot
////////////////////

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
// new
fetch('https://json.geoiplookup.io')
	.then((r) => {
		return r.json();
	})
	.then((res) => {
		console.log(JSON.stringify(res, null, 4));
		$('#location').append(`
					<p>
						<b>City:</b> ${res.city},<br> <b>State:</b> ${res.region},<br>
						<b>Zip Code:</b> ${res.postal_code},<br>
						<b>Country:</b> ${res.country_name},<br>
						<b>Country Code:</b> ${res.country_code.toLowerCase()}
					</p>
				`);
		countryCode = res.country_code.toLowerCase();
		localStorage.setItem('country', countryCode);
		console.log('Country code: ', countryCode);

		window.botmindWidget = null;

		function initBotmindChat() {
			if (window.botmindWidget.works && window.botmindWidget.init) {
				window.botmindWidget.init(
					{
						token: 'd04f06fc-bb83-45d8-9b39-4b5443ab4bd9',
						host: 'https://api.widget.botmind.io',
						language: siteLanguage,
					},
					{
						customData: [
							{
								key: 'country_code',
								value: countryCode,
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
	})
	.catch((err) => {
		console.log(err.message);
	});

function setAllConsentCookies() {
	botmindWidget.consentCollected();
}
