var d = document;
var href = document.location.href;

var sav = d.createElement('div');
sav.setAttribute('id','fifo_save');
sav.setAttribute('style','position:absolute;top:30px;left:30px;background-color:rgba(180,210,180,0.85);padding:20px 50px;font-size:16pt;border:2px solid #444;z-index:99999;');
sav.innerHTML = "Saving...";
d.body.appendChild(sav);

if (/google\.com\/reader/.test(href)) {
  var nodes = d.getElementById('current-entry').childNodes;
  for (var i=0; i<nodes.length; i++) {
    if (/collapsed/.test(nodes[i].className)) {
      nodes = nodes[i].childNodes;
      console.log("Found the first node");
      break;
    }
  }
  for (var i=0; i<nodes.length; i++) {
    if (/entry-main/.test(nodes[i].className)) {
      nodes = nodes[i].childNodes;
      console.log("Found the second node");
      break;
    }
  }
  for (var i=0; i<nodes.length; i++) {
    if (/entry-original/.test(nodes[i].className)) {
      console.log("Found the URL");
      var url = nodes[i].href;
    } else if (/entry-secondary/.test(nodes[i].className)) {
      console.log("Found the subnode");
      var subnodes = nodes[i].childNodes;
      for (var j=0; j<subnodes.length; j++) {
        if (/entry-title/.test(subnodes[j].className)) {
          console.log("Found the label");
          var label = subnodes[j].innerHTML;
          break;
        }
      }
    }
  }
} else {
  var url = href;
  var label = d.title;
}

console.log(url)
console.log(label)

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
        url,
        label,
        false,
        (new Date()).getTime()
        ], null, null);
    });
}

sav.innerHTML = "Saved!";

setTimeout(function(){sav.parentNode.removeChild(sav)},1000);
