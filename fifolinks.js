var highestId = 0;

$(function() {
    $('#save_link').click(function() {
        addLink($('#new_url').val(), $('#new_title').val());

        return false;
      });

    if (window.openDatabase) {
      db = window.openDatabase("fifolinks", "0.1");

      db.transaction(function(tx) {
          monthAgo = new Date((new Date()).getTime() - 2629743830).getTime();
          tx.executeSql("DELETE FROM links WHERE (timestamp < ? AND read = ?)", [monthAgo, true], null, handleError);
          tx.executeSql("SELECT * FROM links WHERE read = ? ORDER BY timestamp ASC", [false], loadLinks, handleError);
          tx.executeSql("SELECT * FROM links WHERE read = ? ORDER BY timestamp DESC LIMIT 50", [true], loadLinks, handleError);
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
      '<a href="' + item.url + '" ' + (item.read == 'true' ? 'class="primary read">' : 'class="primary">') +
      '<div class="label">' + item.label + '</div>' +
      '<div class="url">' + item.url + '</div>' +
      '</a>' +
      '<div class="date">updated ' + (new Date(item.timestamp)).toLocaleString() + '</div>' +
      '<div class="actions">' +
      '<a href="#" class="swap">' + (item.read == 'true' ? 'Mark unread' : 'Mark read') + '</a>' +
      '<span class="separator">|</span>' +
      '<a href="#" class="delete">Delete</a>' +
      '</div>' +
      '<div style="clear:both;"></div>' +
      '</li>'
  );

  el.find('#link_' + item.id + ' a.primary').click(linkClick);
  el.find('#link_' + item.id + ' a.swap').click(swapClick);
  el.find('#link_' + item.id + ' a.delete').click(deleteClick);
}

function isLinkRead(el) {
  return $(el).parents('ul').hasClass('read');
}

function linkClick() {
  var linkId = $(this).parents('li').attr('id');
  var sqlId = linkId.replace('link_','');

  if (!isLinkRead($(this))) {
    swapLink(linkId);
    markLink(sqlId,true);
  }
}

function swapClick() {
  var linkId = $(this).parents('li').attr('id');
  var sqlId = linkId.replace('link_','');

  read = isLinkRead($(this));

  swapLink(linkId);
  markLink(sqlId,!read);

  return false;
}

function deleteClick() {
  var linkId = $(this).parents('li').attr('id');
  var sqlId = linkId.replace('link_','');

  db.transaction(function(tx) {
      tx.executeSql("DELETE FROM links WHERE id = ?",
        [sqlId], null, handleError
      );
    });

  $('#'+linkId).remove();

  return false;
}

function swapLink(id) {
  var newParentType = "read";

  var el = $('#' + id);

  if (el.parents('ul').hasClass("read")) {
    newParentType = "unread";
  }

  // Move the link
  if (newParentType == "unread") {
    el.slideUp(200,function(){
        $('#' +newParentType+ '_links').append(el)
        cleanupReadLinks(el,newParentType);
      }).slideDown(200);
  } else {
    el.slideUp(200,function(){
        $('#' +newParentType+ '_links').prepend(el)
        cleanupReadLinks(el,newParentType);
      }).slideDown(200);
  }
}

function cleanupReadLinks(el, newParentType) {
  var link = el.find('a.primary');
  link.removeClass('read');
  if (newParentType == 'read') link.addClass('read');

  // Change the button text
  $('ul.unread a.swap').html('Mark read');
  $('ul.read a.swap').html('Mark unread');
}

function markLink(id,read) {
  db.transaction(function(tx) {
      tx.executeSql("UPDATE links SET read = ?, timestamp = ? WHERE id = ?",
        [read, (new Date()).getTime(), id],
        null, handleError
      );
    });
}

function handleError(tx, err) {
  // No such table
  if (err.code == 1 && err.message == "no such table: links") {
    tx.executeSql("CREATE TABLE links (id REAL UNIQUE, label TEXT, url TEXT UNIQUE, read BOOLEAN, timestamp REAL)", [], null, handleError);
  } else if (err.code == 1 && err.message == "table links already exists") {
    // Do nothing
  } else {
    $('#error').html("SQL ERROR[" +err.code+ "]: " + err.message).show();
  }
}
