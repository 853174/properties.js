var langCode;

function importFile(file,locale){

  var fileUrl = window.URL.createObjectURL(file);

  $.i18n.properties({
    name: fileUrl,
    external: true,
    mode: 'map',
    callback: function(){
      $.map($.i18n.map,function(value,code){
        addCode(code);
        setCode(locale,code,value);
      })
    }
  })
}

function loadResources(locale){
  $.i18n.properties({
	    name:'Messages',
	    path:'docs/resources/',
	    mode:'both',
	    language:locale,
      debug: false,
	    callback: function() {
	    	var messagesArray = $.makeArray($.i18n.map)
	    	$.map($.i18n.map, function(msg,key){
	    		key = escapeDots(key)
	    		$('msg-code[value='+key+']').html(msg)
	    	})

	    	$('msg-code').each(function(index){
	    		if($(this).html() === ''){
	    			$(this).html('No value for key <b>' + $(this).attr('value') + '</b> in language <b>' + locale + '</b>' )
	    		}
          stepOfLoading(index,$('msg-code').length);
	    	})

        finishLoading();
	    }
	});
}

function escapeDots(key){
	return key.replace(/\./g,"\\.")
}
