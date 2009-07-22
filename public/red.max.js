/* This work is licensed under a BSD License.
 * http://www.opensource.org/licenses/bsd-license.php
 * Copyright 2008 David Stone & Josh Russell. All rights reserved.
 *
 * Thank to:
 * Remy Sharp - http://remysharp.com
 * Premasagar Rose - http://premasagar.com
 */
 
(function () {
    var addEvent = (function () {
        return document.body.addEventListener ? function (e, ev, fn) {
            e.addEventListener(ev, fn, false);
        } : document.body.attachEvent ? function (e, ev, fn) {
            e.attachEvent("on" + ev, fn);
        } : function (fn) {
            var o = window.onload;
        	if (typeof window.onload != 'function') {
        		window.onload = fn;
        	} else {
        		if (typeof func == 'function') {
        			window.onload = function () { o(); fn(); };
        		}
        	}
        };
    })();
    
    addEvent(window, 'load', function () {
        // all the node types we're interested in
        var nodes = 'strong,em,p,h1,h2,h3,h4,h5,h6,li,div,blockquote,cite,dt,label,legend,q,sub,sup,td,td,body'.split(',');

        // configure the red link
        var redlink = document.createElement('a');
        redlink.style.cursor = 'pointer';
        redlink.style.color = '#c00';
        redlink.style.fontWeight = 'bold';
        redlink.style.textDecoration = 'none';
        redlink.style.fontStyle = 'normal';
        redlink.href = 'http://www.joinred.com?entry=redyoursite&referrer='+window.location.hostname;
        redlink.appendChild(t('(red)'));

        function t(s) {
            return document.createTextNode(s);
        }

        var red = /(\(red\)|red)/ig, 
            i = nodes.length, 
            j = 0, k = 0, l = 0, 
            source = '', 
            parts = [], 
            el = null, frag = null;

        while (i--) {
            el = document.getElementsByTagName(nodes[i]);
            j = el.length;
            while (j--) {
                k = el[j].childNodes.length;
                while (k--) {
                    if (el[j].childNodes[k].nodeName == '#text' && red.test(el[j].childNodes[k].nodeValue)) {
                        source = el[j].childNodes[k].nodeValue;

                        // we need markers to handle IE not including the split token
                        if (/^(\(red\)|red)/i.test(source)) {
                            source = '__MARKER__' + source;
                        }

                        if (/(\(red\)|red)$/i.test(source)) {
                            source = source + '__MARKER__';
                        }

                        parts = source.split(/(\(red\)|red)/i);
                        frag = document.createDocumentFragment();
                        l = 0;

                        for (l = 0; l < parts.length; l++) {
                            if (red.test(parts[l])) {
                                continue; // For Safari + FF because IE sucks :-(
                            }
                            if (parts[l] != '__MARKER__') {
                                frag.appendChild(t(parts[l]));

                                if (l != parts.length - 1) {
                                    frag.appendChild(redlink.cloneNode(true));
                                }
                            } else if (l == 0 && parts[l] == '__MARKER__'){
                                frag.appendChild(redlink.cloneNode(true));
                            }
                        }

                        el[j].replaceChild(frag, el[j].childNodes[k]);
                    }                
                }
            }
        } 
    });
})();