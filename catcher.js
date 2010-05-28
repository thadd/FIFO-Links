$.extend({
    getUrlVars: function(){
      var vars = [], hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for(var i = 0; i < hashes.length; i++)
      {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
      }
      return vars;
    },
    getUrlVar: function(name){
      return $.getUrlVars()[name];
    }
  });

$(function() {
    var url = decodeURIComponent($.getUrlVar('url'));
    var label = decodeURIComponent($.getUrlVar('label'));

    if (window.openDatabase) {
      var highestId = 0;
      db = window.openDatabase("fifolinks", "0.1");
      db.transaction(function(tx) {
          tx.executeSql("SELECT * FROM links", [], 
            function(tx,results){
              for (var i=0; i < results.rows.length; i++) {
                var item = results.rows.item(i);
                if (item.id >= highestId) highestId = item.id + 1;
              }
            }, null);
        });

      db.transaction(function(tx) {
          tx.executeSql("INSERT INTO links(id,label,url,read,timestamp) VALUES(?,?,?,?,?)",
            [
            highestId,
            label,
            url,
            false,
            (new Date()).getTime()
            ], null, null);
        });
    }

    ls_sav.innerHTML = "Saved!";

    setTimeout(function(){ls_sav.parentNode.removeChild(ls_sav)},1000);
  });
