(function () {
	var holderID = '#adminRemoveComment';
	var messageClass = '.message';
	var removeThreadClass = 'removeThisThread';
	var removeCommentClass = 'removeThisComment';

	var $currentComment = $([]); //create an empty jquery object

	function hideHolder() {
		$(holderID).hide();
	}

	function showHolder($opener, $holder) {
		//move the holder
		var position = $opener.offset();
		$holder.css({
			top: position.top,
			left: position.left
		});

		//show the holder
		$holder.show();
	}

	function initForm($opener, $holder) {
		var $form = $holder.find('form');
		var isRemoveThread = $opener.hasClass(removeThreadClass);

		$('body').append($holder.remove());

		$holder.find('form').on('submit', doSubmit);

		$holder.find('a.close').on('click', doClose);

		//clearRadios($form);

		$form.attr('action', $opener.attr('href'));

		if (isRemoveThread) {
			$holder.find('.' + removeCommentClass).hide();
			$holder.find('.' + removeThreadClass).show();
		} else {
			$holder.find('.' + removeCommentClass).show();
			$holder.find('.' + removeThreadClass).hide();
		}

		$form.show();
	}

	function validateForm($form) {
		//simple validation. one radio button must be checked
		return $form.find('input:radio[name=reason]:checked').val();
	}

	function showMessage(message) {
		$(holderID).find(messageClass).html(
			message
		).show();
	}

	function hideMessage() {
		$(holderID).find(messageClass).hide();
	}

	function clearRadios($form) {
		$form.find('input:radio[name=reason]:checked').prop('checked', false);
	}

	function deleteSuccess(json) {
		if (json.redirect) {
			location.href = json.redirect;
		} else {
			hideHolder();
			$currentComment.hide();
		}
	}

	function deleteError(message, tryAgain) {
		var $holder = $(holderID);
		var $messageHolder = $holder.find(messageClass);
		var $form = $holder.find('form');

		$messageHolder.html(message).show();

		if (tryAgain) {
			clearRadios($form);
			$form.show();
		} else {
			$form.hide();
		}
	}

	function getCurrentComment($clickedButton) {
		if ($("div.post").length > 0)
			return $clickedButton.parents('div.post').parents('li');
		else
			return $clickedButton.parents("td.remove").parents("tr");
	}

	function doSubmit() {
		var $form = $(this);

		if (!validateForm($form)) {
			showMessage('You must select a reason')
			return false;
		} else {
			//form is valid, show removing message, hide the form, do ajax submit
			showMessage('Removing...');
			$form.hide();

			$.ajax({
				type: 'POST',
				url: $form.attr('action'),
				data: $form.serialize(),
				success: function (json) {
					if (json.success) {
						deleteSuccess(json);
					} else {
						deleteError(json.message, json.tryAgain);
					}
				},
				error: function () {
					deleteError('An unknown error has happened', true);
				},
				dataType: 'json',
				timeout: 5000
			});

			return false;
		}
	}

	function doClose() {
		hideHolder();

		return false;
	}

	//Attach events
	//click 'remove' button
	$.lald('a.remove', 'click', function (event) {
		var $this = $(this);
		var $holder = $(holderID);

		initForm($this, $holder);
		hideMessage();
		showHolder($this, $holder);

		$currentComment = getCurrentComment($this);

		return false;
	});

})();