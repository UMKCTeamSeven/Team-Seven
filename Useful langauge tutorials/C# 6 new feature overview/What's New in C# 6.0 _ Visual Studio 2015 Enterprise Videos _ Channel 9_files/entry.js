$(function () {
    $(".admin .status").bind("click", function () {
        $(".admin .content-status").show();
        return false;
    });

    // hide it if they click the close icon
    $(".admin .content-status").find("a.close").click(function () {
        $(this).parent().hide();
        return false;
    });
});

$(function () {
	$('.pullQuoteSource').each(function(){
		$this = $(this);
		$('<div><p>...' + $this.text() + '</p></div>')
			.insertAfter($this.parent())
			.addClass('pullQuote');
	});
});

(function ($){
	var toggleDownloads = function () {
		$('#video-download').toggleClass('active');
	};

	$.lald('#video-download .helpHolder h3', 'click', function () {
		if( $(this).css('cursor') == 'pointer' ){
			toggleDownloads();
		}
	});

	$.lald('#video-download .download', 'click', function () {
		toggleDownloads();
	});

	$.lald('#video-download .download .help a', 'click', function (e) {
		e.stopPropagation();
	});
})(jQuery);