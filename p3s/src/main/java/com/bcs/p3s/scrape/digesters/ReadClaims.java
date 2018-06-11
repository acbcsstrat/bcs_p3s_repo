package com.bcs.p3s.scrape.digesters;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;

import com.bcs.p3s.scrape.model.Form1200Record;
import com.bcs.p3s.scrape.model.Record;

public class ReadClaims extends DigesterElements{
	
	private String temp;
	private Form1200Record form1200;
	private String[] claims;
	
	private Boolean isClaimsText = false;
	
	
	public ReadClaims(Form1200Record form1200) {
		super();
		
		this.form1200 = form1200;
		
	}

	private String claimsTxt;


	/*
	* When the parser encounters plain text (not XML elements),
	* it calls(this method, which accumulates them in a string buffer
	*/
	public void characters(char[] buffer, int start, int length) {
		//temp = new String(buffer, start, length);
		if(temp == null)
			temp = new String(buffer, start, length);
		else
			temp = temp + new String(buffer, start, length);
	}


	/*
	* Every time the parser encounters the beginning of a new element,
	* it calls this method, which resets the string buffer
	*/ 
	public void startElement(String uri, String localName,
	    String qName, Attributes attributes) throws SAXException {
		temp = "";
		if (qName.equalsIgnoreCase("claim-text")) {
			isClaimsText = true;
	    //acct.setType(attributes.getValue("type"));
		}
		
	}

	/*
	* When the parser encounters the end of an element, it calls this method
	*/
	public void endElement(String uri, String localName, String qName)
	    throws SAXException {
	
		if(isClaimsText){
	
			if(qName.equals("claim-text")){
				claimsTxt = temp;
				claims = claimsTxt.split("\\d+\\.");
			}
		}
		
		form1200.setAllClaims(claims);
		
	}

}
