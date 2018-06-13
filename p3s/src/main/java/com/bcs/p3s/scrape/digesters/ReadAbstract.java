package com.bcs.p3s.scrape.digesters;

import java.util.ArrayList;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;

import com.bcs.p3s.scrape.model.Form1200Record;
import com.bcs.p3s.scrape.model.Inventors;

public class ReadAbstract extends DigesterElements{
	
	private Form1200Record form1200;
	private String abstractTxt;
	private String temp;
	private boolean isAbstractTxtInEnglish = false;

	public ReadAbstract(Form1200Record form1200) {
		super();
		this.form1200 = form1200;
	}
	
	
	public void characters(char[] buffer, int start, int length) {
        temp = new String(buffer, start, length);
        
	}


 
	  /* Every time the parser encounters the beginning of a new element,
	  * it calls this method, which resets the string buffer */
	   
	 public void startElement(String uri, String localName,
	               String qName, Attributes attributes) throws SAXException {
	        temp = "";
	        if (qName.equalsIgnoreCase("abstract")) {
	        	if("en".equals(attributes.getValue("lang"))){
	        		isAbstractTxtInEnglish = true;
	        	}
	        }
	        
	 }

 
	  /* When the parser encounters the end of an element, it calls this method */
	  
	 public void endElement(String uri, String localName, String qName)
	               throws SAXException {
		 
		 if(isAbstractTxtInEnglish){
			 form1200.setAbstractTxt(temp);
			 isAbstractTxtInEnglish = false;
		 }
	
	 }
		   

}
