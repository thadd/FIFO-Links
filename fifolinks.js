var highestId = 0;

$(function() {
    $('#save_link').click(function() {
        addLink($('#new_url').val(), $('#new_title').val());

        return false;
      });

    if (window.openDatabase) {

      db = window.openDatabase("fifolinks", "0.1");

      db.transaction(function(tx) {
          tx.executeSql("SELECT * FROM links ORDER BY timestamp DESC", [], loadLinks, handleError);
        });

    } else {
      $('#sorry').show();
    }
  });

function loadLinks(tx, results) {
  for (var i=0; i < results.rows.length; i++) {
    var item = results.rows.item(i);

    if (item.id >= highestId) highestId = item.id + 1;

    if (item.read == "true") {
      addLinkElement($('#read_links'), item);
    } else {
      addLinkElement($('#unread_links'), item);
    }
  }
}

function addLink(url,label) {
  db.transaction(function(tx) {
      tx.executeSql("INSERT INTO links(id,label,url,read,timestamp) VALUES(?,?,?,?,?)",
        [
        highestId++,
        url,
        label,
        false,
        (new Date()).getTime()
        ], null, handleError);

      tx.executeSql("SELECT * FROM links WHERE id = ?", [highestId-1], loadLinks, handleError);
    });
}

function addLinkElement(el,item) {
  el.append(
    '<li id="link_' + item.id + '" class="link">' +
      '<span class="label">' +
      '<a href="' + item.url + '">' + item.label + '</a>' +
      '</span>' +
      '<span class="url">' + item.url + '</span>' +
      '</li>'
  );

  el.find('a').click(function() {
      var linkId = $(this).parents('li').attr('id');
      var sqlId = linkId.replace('link_','');

      var newParentType = "read";
      var newReadType = true;
      if ($(this).parents('ul').hasClass("read")) {
        newParentType = "unread";
        newReadType = false;
      }

      db.transaction(function(tx) {
          tx.executeSql("UPDATE links SET read = ?, timestamp = ? WHERE id = ?",
            [newReadType, (new Date()).getTime(), sqlId],
            loadLinks, handleError
          );

          $('#' +newParentType+ '_links').prepend($('#'+linkId))
        });

      return false;
    });
}

function handleError(tx, err) {
  // No such table
  if (err.code == 1 && err.message == "no such table: links") {
    tx.executeSql("CREATE TABLE links (id REAL UNIQUE, label TEXT, url TEXT, read BOOLEAN, timestamp REAL)", [], null, handleError);
  } else {
    $('#error').html("SQL ERROR[" +err.code+ "]: " + err.message).show('medium');
  }
}
