package com.bcs.p3s.scrape.digesters;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
				System.out.println(claimsTxt);
				form1200.setClaimsTxt(claimsTxt);
				/**
				 * Splitting claims based on 2 regex conditions ;
				 * 	1.number then a dot and space (ie, '2. Here comes the 2nd claim')
				 * 	2.character return(assuming each claims will start on new line 
				 */
				//claims = claimsTxt.split("\\d+\\.\\s+|\\.\\r?\\n");
				//claims = claimsTxt.replace("\n", "").split("\\.\\r\\n|\\d+\\.\\s+");
				claims = claimsTxt.split("\\.\\n|\\.\\r\\n|\\d+\\.\\s+");
				//claims = claimsTxt.split("\\.\\r\\n");
				
				/*List<String> tokens = new ArrayList<String>();

				Pattern tokenPattern = Pattern.compile("\\d+\\.\\s|\\.\\r\\n");
				Matcher matcher = tokenPattern.matcher(claimsTxt);
				while(matcher.find()) {
				    tokens.add(matcher.group());
				}*/
				isClaimsText = false; 
			}
		}
		
		form1200.setAllClaims(claims);
		
	}

}
