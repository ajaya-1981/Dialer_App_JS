var span = document.getElementsByClassName('close')[0];
let output = document.querySelector('.output');
var IsModalOpen = false;
function toggelCallBtn(toggle) {
	// $('#btnCall').prop('disabled', toggle);
	// document.getElementById('btnCall').disabled = toggle;
}

$(document).ready(function () {
	$('#output').on('input change', function () {
		if (typeof deltapath !== 'undefined') {
			if ($(this).val() != '') {
				toggelCallBtn(false);
			} else {
				toggelCallBtn(true);
			}
		}
	});
});

function openModal(caller) {
	var modal = document.getElementById('myModal');
	document.getElementById('callerID').innerHTML = caller;
	modal.style.display = 'block';
}

// close pop upfor Notification
function closeModal(modalId) {
	var modal = document.getElementById(modalId);
	modal.style.display = 'none';
	// clearInterval(countdownTimer);
}

//Open callingModal
function openCallingModal(recipient) {
	var modal = document.getElementById('callingModal');
	document.getElementById('callingName').innerHTML = recipient;
	modal.style.display = 'block';
	// document.getElementById('btnPause').style.visibility = 'hidden';
	// document.getElementById('btnEndCall').style.visibility = 'hidden';
	// countdown = setInterval('timer()', 1000);
}
