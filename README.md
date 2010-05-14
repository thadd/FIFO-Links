FIFO Links
==========

Overview
--------

This project aims to provide a simple "read later" bookmarking capability that uses HTML5
client-side database storage to save the links.

Installation
------------

* Install all the files on a server somewhere
* Install the bookmarklet (replace the URL with the location of your server):

  javascript:(function(){var d=document,z=d.createElement('scr'+'ipt'),b=d.body;try{if(!b)throw(0);z.setAttribute('src','http://localhost/linksaver.js');b.appendChild(z);}catch(e){alert('Please wait until the page has loaded.');}})()

* You're ready for primetime
