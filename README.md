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

  javascript:(function(){var%20ls_d=document,ls_z=ls_d.createElement('scr'+'ipt'),ls_b=ls_d.body;try{if(!ls_b)throw(0);ls_z.setAttribute('src','http://localhost/~tselden/fifolinks/linksaver.js');ls_b.appendChild(ls_z);}catch(e){alert('Please%20wait%20until%20the%20page%20has%20loaded.');}})()

* You're ready for primetime
