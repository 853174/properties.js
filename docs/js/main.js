var messages = new Map();

/* Locale management */
function addLocale(localeCode){

  if(! messages.has(localeCode)){
    var newLocale = new Map();

    // Add codes if there is other locale
    if(messages.size > 0){
      messages.entries().next().value[1].forEach(function(v,code,m){
        newLocale.set(code,null);
      })
    }

    messages.set(localeCode,newLocale);

    var id = localeCode ? localeCode : "default";
    var name = localeCode ? "Messages_" + localeCode : "Messages";

    $('#messages-container')
      .append('<label for="Messages">' + name + '.properties</label>')
      .append('<div class="textarea" id="' + id + '" contenteditable onkeyup="updateCode(this)" onkeydown="preventEnter(this,event)"></div>');
  }

}

function removeLocale(localeCode){
  messages.delete(localeCode);
}

/* Code management */
function addCode(code){

  var isNew = false;

  messages.forEach(function(localeMap,k,m){
    if(! localeMap.has(code)){
      isNew = true;
      localeMap.set(code,null);
    }
  })

  if(isNew){
    $('#current-code').html(code);
    $('#code-list li').removeClass('emphasis');
    $('#code-list').append('<li class="emphasis" onclick="editCode(this)">' + code + '</li>')
  }
}

function setCode(locale,code,value){
  if(messages.has(locale)){
    messages.get(locale).set(code,value);
  }
}

function getCode(code){
  var locales = new Map();

  messages.forEach(function(langMap,localeCode,m){
    var traduction = langMap.get(code);
    locales.set(localeCode,traduction);
  });

  return locales;
}

function editCode(code,newCode){
  messages.forEach(function(localeMap,k,m){
    if(localeMap.has(code)){
      var value = localeMap.get(code);
      localeMap.delete(code);
      localeMap.set(newCode,value);
    }
  })
}

function removeCode(code){
  messages.forEach(function(localeMap,k,m){
    localeMap.delete(code);
  })
}

/* Change current code */
function editCode(code){
  var currentCode = $(code).text();

  $('#code-list li').removeClass('emphasis');
  $(code).addClass('emphasis');
  $('#current-code').html(currentCode);

  var traductions = getCode(currentCode);
  traductions.forEach(function(v,k){
    var tid = k ? k : 'default';
    $('#' + tid).text(v);
  })
}

/* Update current code */
function updateCode(textarea){
  var localeCode = $(textarea).attr('id') == 'default' ? '' : $(textarea).attr('id');
  var code = $('#current-code').text();
  var value = $(textarea).text();

  setCode(localeCode,code,value);
}

function preventEnter(textarea,e){
    // trap the return key being pressed
    if (e.keyCode === 13) {
      e.preventDefault();
    }

    return true;
}

$(document).ready(function(){

  window.onbeforeunload = function() {
      return true;
  };

  /* Movile behaviour */

  $('#toggle-pane').click(function(){
    $('#toggle-pane').parent()
      .removeClass('col-2')
      .addClass('col-12')
      .addClass('shadow');

    $('#toggle-pane')
      .removeClass('d-block')
      .hide();

    $('#left-pane')
      .removeClass('d-none')
      .attr('showing',true);

    $('#right-pane').addClass("d-none");
  });

  $('#close-left-pane').click(function(){
    if($('#left-pane').attr('showing')){
      $('#toggle-pane').parent()
        .addClass('col-2')
        .removeClass('col-12')
        .removeClass('shadow');

      $('#toggle-pane')
        .addClass('d-block')
        .show();

      $('#left-pane')
        .addClass('d-none')
        .attr('showing',false);

      $('#right-pane').removeClass("d-none");
    }
  })

  /* Initialization */
  addLocale('');

  /* New code insert */
  $('#new-code').on('keypress',function(e){

    if(e.which == 13){
      var newCode = $('#new-code').val();
      $('div[contenteditable]').text('')
      addCode(newCode)
    }else{
      var regex = new RegExp("^[a-zA-Z0-9\.]+$");
      var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
      if(! regex.test(key))
        event.preventDefault();
    }
  })

  /* Add locale */
  $('#addLocale-trigger').click(function(){
    $('#addLocale').css('display','block');
  })

  $('#createNewLocale').click(function(){
    addLocale($('#newLocale').val());
    $('#addLocale').css('display','none');
    $('#newLocale').val('')
  })

  /* Import files */
  $('#import-files').on('change',function(){
    var fileList = this.files
    var numFiles = fileList.length;

    var locales = [];

    for (let i = 0, numFiles = fileList.length; i < numFiles; i++) {
      var locale = fileList[i].name.match(/.*\_(.*)\.properties/);
      if(locale){
        locales.push(locale[1]);
      }else{
        locales.push('');
      }

      addLocale(locales[locales.length - 1]);
    }

    for (let i = 0, numFiles = fileList.length; i < numFiles; i++) {
      var file = fileList[i];
      importFile(file,locales[i]);
    }
  })

})

/* Download properties files */
function download() {

  messages.forEach(function(language,k,m){

    var filename = k == "" ? "Messages.properties" : "Messages_" + k + ".properties";

    var plainText = "";

    language.forEach(function(value,code,m2){
      plainText += code + " = " + value + "\n";
    })

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(plainText));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  })

  window.onbeforeunload = null;

}
