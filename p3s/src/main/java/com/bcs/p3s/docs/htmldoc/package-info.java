/**
 * 'htmlDoc' is the name given to the mechanism for providing PDF documents to the customer.
 * 
 * Crafting PDF documents on our server (then storing them) would take too long to develop (at Autumn 2017).
 * 
 * Hence the htmlDoc solution. Create simple HTML pages, with option for user to saveAs PDF (using html2canvas).
 * Note, with is (interim?) solution - we never have the PDF documents & don't store them. 
 * Also, the PDFs created will look different from different browsers/PCs
 */
package com.bcs.p3s.docs.htmldoc;