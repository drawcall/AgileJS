$.fn.setCursorPosition = function(position) {
	if(this.lengh == 0)
		return this;
	return $(this).setSelection(position, position);
}

$.fn.setSelection = function(selectionStart, selectionEnd) {
	if(this.lengh == 0)
		return this;
	input = this[0];

	if(input.createTextRange) {
		var range = input.createTextRange();
		range.collapse(true);
		range.moveEnd('character', selectionEnd);
		range.moveStart('character', selectionStart);
		range.select();
	} else if(input.setSelectionRange) {
		input.focus();
		input.setSelectionRange(selectionStart, selectionEnd);
	}

	return this;
}

$.fn.focusEnd = function() {
	this.setCursorPosition(this.val().length);
}