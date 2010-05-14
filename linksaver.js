var ls_d = document;
var ls_href = document.location.href;

var ls_sav = ls_d.createElement('div');
ls_sav.setAttribute('id','fifo_save');
ls_sav.setAttribute('style','text-align:center;width:150px;position:absolute;top:30px;left:30px;background-color:rgba(180,210,180,0.85);padding:20px 50px;font-size:16pt;border:2px solid #444;z-index:99999;');
ls_sav.innerHTML = "Saving...";
ls_d.body.appendChild(ls_sav);

if (/google\.com\/reader/.test(ls_href)) {
  var ls_nodes = ls_d.getElementById('current-entry').childNodes;
  for (var ls_i=0; ls_i<ls_nodes.length; ls_i++) {
    if (/collapsed/.test(ls_nodes[ls_i].className)) {
      ls_nodes = ls_nodes[ls_i].childNodes;
      console.log("Found the first node");
      break;
    }
  }
  for (var ls_i=0; ls_i<ls_nodes.length; ls_i++) {
    if (/entry-main/.test(ls_nodes[ls_i].className)) {
      ls_nodes = ls_nodes[ls_i].childNodes;
      console.log("Found the second node");
      break;
    }
  }
  for (var ls_i=0; ls_i<ls_nodes.length; ls_i++) {
    if (/entry-original/.test(ls_nodes[ls_i].className)) {
      console.log("Found the URL");
      var ls_url = ls_nodes[ls_i].href;
    } else if (/entry-secondary/.test(ls_nodes[ls_i].className)) {
      console.log("Found the subnode");
      var ls_subnodes = ls_nodes[ls_i].childNodes;
      for (var ls_j=0; ls_j<ls_subnodes.length; ls_j++) {
        if (/entry-title/.test(ls_subnodes[ls_j].className)) {
          console.log("Found the label");
          var ls_label = ls_subnodes[ls_j].innerHTML;
          break;
        }
      }
    }
  }
} else {
  var ls_url = ls_href;
  var ls_label = ls_d.title;
}

try{
ls_frame = ls_d.createElement('iframe')
ls_frame.setAttribute('style','width:0px; height:0px; border: 0px');
ls_frame.setAttribute('src','http://fifolinks.com/catcher.html?url='+encodeURIComponent(ls_url)+'&label='+encodeURIComponent(ls_label));
ls_d.body.appendChild(ls_frame);
setTimeout(function(){ls_frame.parentNode.removeChild(ls_frame)},10000);
} catch(err) {}


ls_sav.innerHTML = "Saved!";

setTimeout(function(){ls_sav.parentNode.removeChild(ls_sav)},1000);
