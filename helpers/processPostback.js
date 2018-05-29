const request = require('request');
const sendTextMessage = require('./sendTextMessage');

module.exports = event => {
	var senderId = event.sender.id;
	var payload = event.postback.payload;

	if (payload === 'Greeting') {
		// Get user's first name from the User Profile API
		// and include it in the greeting
		request(
			{
				url: 'https://graph.facebook.com/v2.6/' + senderId,
				qs: {
					access_token: process.env.PAGE_ACCESS_TOKEN,
					fields: 'first_name'
				},
				method: 'GET'
			},
			function(error, response, body) {
				let greeting = '';
				if (error) {
					console.log("Error getting user's name: " + error);
				} else {
					let bodyObj = JSON.parse(body);
					console.log('BODY OBJECT: ', bodyObj);
					name = bodyObj.first_name;
					greeting = `${name ? name : 'Hi there'}.`;
				}
				let message = `${greeting} My name is Weather Bot. I can tell you current weather status in any city. What city would you like to know about?`;
				sendTextMessage(senderId, { text: message });
			}
		);
	} else if (payload === 'Correct') {
		sendTextMessage(senderId, {
			text:
				"Awesome! What would you like to find out? Enter 'coord', 'wind', 'clouds', 'visibility', 'dt' or 'main' for the various details."
		});
	} else if (payload === 'Incorrect') {
		sendTextMessage(senderId, {
			text: 'Try another name then!'
		});
	}
};
