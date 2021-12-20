//Global Variables
var deltapath;
var count = 0;
var conf;

var countdown;
var upgradeTime = 1;
var seconds = upgradeTime;
// open pop up for Notification

// populating users in a dropdown to select
async function fillCongfiguration() {
	await fetch('./config.json').then((results) =>
		results.json().then((data) => (conf = data.settings))
	);
	// console.log(conf);
	$('#selectConfig').empty();
	$.each(conf, function (i, p) {
		$('#selectConfig').append(
			$('<option></option>').val(p.username).html(p.username)
		);
	});
}

// Onload function
function onload() {
	toggelCallBtn(true);
	fillCongfiguration();
}

// Delta Path Initialize
function deltaPathInit() {
	var filteredConf = conf.filter(function (obj) {
		return obj.username === $('#selectConfig').val();
	});
	deltapath = new Deltapath(
		filteredConf[0].hostname,
		filteredConf[0].username,
		filteredConf[0].password,
		filteredConf[0].protocol,
		filteredConf[0].actionTimeout,
		filteredConf[0].reconnectInterval,
		filteredConf[0].authmode
	);

	// deltapath = new Deltapath(
	// 	'junction.deltapath.com',
	// 	'1801',
	// 	'f3d90bc791a38fd1e4bf555084a91442b83f6c2ecbb2c359f93e6b2940848fb5',
	// 	'https',
	// 	60,
	// 	40,
	// 	'prebind'
	// );
	deltapath.onInitialize = (e) => {
		console.log('onInitialize');
		console.log(e);
	};
	deltapath.onCallUpdate = (e) => {
		console.log('onCallUpdate');
		// openModal('8000');
		if (e.data.length > 0 && e.data[0].calltype == 'Incoming') {
			IsModalOpen = true;
			var callerid = e.data[0].calleridnum;
			console.log(callerid);
			if (IsModalOpen && callerid != deltapath.username) {
				openModal(callerid);
				IsModalOpen = false;
			}
		}
		if (
			e.data.length > 0 &&
			e.data[0].calltype == 'Outgoing' &&
			e.data[0].callstatus == 'answering'
		) {
			document.getElementById('btnPause').style.visibility = 'visible';
			document.getElementById('btnEndCall').style.visibility = 'visible';
			document.getElementById('btnCancelCall').style.visibility = 'hidden';
			document.getElementById('connecting').style.visibility = 'hidden';
			countdown = setInterval('timer()', 1000);
		}
		console.log(e);
	};
	deltapath.onPresenceUpdate = (e) => {
		// console.log('onPresenceUpdate');
		console.log(e);
	};
	deltapath.defaultEventHandler = (e) => {
		// console.log('defaultEventHandler');
		console.log(e);
	};
}
// sign in for specific user
function signIn() {
	deltaPathInit();
	(async () => {
		try {
			while (true) {
				const err = await deltapath.connect();

				if (!err) {
					deltapath.agentLogin();
					console.log('connected with user '.concat(deltapath.username));
					break;
				} else {
					console.log(err);
				}
			}
		} finally {
			// await deltapath.disconnect();
		}
	})();
}

// Event for Audio Call
$(document).ready(function () {
	$('.fa-phone').on('click', function () {
		call();
	});
});

// Call Method
function call() {
	(async () => {
		try {
			let resp,
				body,
				channel = [];
			let dialled = $('#output').val();
			console.log(dialled);
			openCallingModal(dialled);
			console.log('1');
			resp = await deltapath.makeCall(dialled);
			console.log('2');
			countdown = setInterval('timer()', 1000);
			if (!resp.ok) {
				console.log('call not ok');
			} else {
				console.log('call ok');
			}

			//get Call list
			// resp = await deltapath.getCallList();
			// console.log(resp);
			// if (!resp.ok) {
			// 	throw 'not ok';
			// } else {
			// 	console.log('get Call list');
			// }
			// body = await resp.json();
			// console.log(body);
			// Object.values(body.list).forEach((item) => {
			// 	channel.push(item['Channel']);
			// });

			// resp = await deltapath.answerCall(channel[0]);
			// if (!resp.ok) {
			// 	throw 'not ok';
			// } else {
			// 	console.log('answerCall');
			// }
			// resp = await deltapath.holdCall(channel[0]);
			// if (!resp.ok) {
			// 	throw 'not ok';
			// } else {
			// 	console.log('holdCall');
			// }
			// resp = await deltapath.resumeCall(channel[0]);
			// if (!resp.ok) {
			// 	throw 'not ok';
			// } else {
			// 	console.log('resume call');
			// }

			// resp = await deltapath.hangupCall(channel[0]);
			// if (!resp.ok) {
			// 	throw 'not ok';
			// } else {
			// 	console.log('hangup call');
			// }
			// const obj = await deltapath.dispatch(
			// 	JSON.stringify({
			// 		cmd: 'null',
			// 		uuid: deltapath.uuid,
			// 	})
			// );
			// console.log(obj);
		} finally {
			// await deltapath.disconnect();
			// console.log('bye');
		}
	})();
}

// Event for Video Call
$(document).ready(function () {
	$('.fa-video-camera').on('click', function () {
		async () => {
			try {
				console.log('Text for video call');
			} finally {
				// await deltapath.disconnect();
				// console.log('bye');
			}
		};
	});
});

// Digits fill in Text area
$(document).ready(function () {
	var c = $('#output').val();
	$('.digit').on('click', function () {
		var num = $(this).clone().children().remove().end().text();
		if (count < 11) {
			// $('.output').append('<span>' + num.trim() + '</span>');
			$('#output').val($('#output').val() + num.trim());
			count++;
		}
	});
});

// removing last entered digit from Text Area
$(document).ready(function () {
	$('.fa-long-arrow-left').on('click', function () {
		$('#output').val($('#output').val().slice(0, -1));
		count--;
	});
});

// Accept call
async function AcceptCall() {
	// async () => {
	try {
		console.log('accepted');
		let resp,
			body,
			channel = [];
		resp = await deltapath.getCallList();
		console.log(resp);
		if (!resp.ok) {
			throw 'not ok';
		} else {
			console.log('get Call list');
		}
		body = await resp.json();
		console.log(body);
		Object.values(body.list).forEach((item) => {
			channel.push(item['Channel']);
		});
		if (channel.length > 0) {
			resp = await deltapath.answerCall(channel[0]);
			if (!resp.ok) {
				throw 'not ok';
			} else {
				console.log('answerCall');
			}
		}
	} finally {
		// await deltapath.disconnect();
		// console.log('bye');
	}
	// };
}

// Decline Call
function DeclineCall() {
	alert('Rejected');
}

async function btnCancelCall() {
	// async () => {
	try {
		console.log('ended');
		let resp,
			body,
			channel = [];
		resp = await deltapath.getCallList();
		if (!resp.ok) {
			console.log('not ok');
		}
		body = await resp.json();
		Object.values(body.list).forEach((item) => {
			channel.push(item['Channel']);
		});
		resp = await deltapath.hangupCall(channel[0]);
		if (!resp.ok) {
			console.log('not ok');
		} else {
			console.log('call ended');
		}
	} finally {
		// await deltapath.disconnect();
		// console.log('bye');
	}
	// };
}
