package com.bcs.p3s.scrape.digesters;

import java.util.ArrayList;
import java.util.List;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;

import com.bcs.p3s.scrape.model.Form1200Record;
import com.bcs.p3s.scrape.model.Inventors;

public class ReadInventor extends DigesterElements{
	
	private String temp;
	private Inventors inventors;
	private boolean isInventorsDetails, isCountry;
	private List<Inventors> inventorsList = new ArrayList<Inventors>();
	private Form1200Record form1200;
	
	
	
	public ReadInventor(Form1200Record form1200) {
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
	        if (qName.equalsIgnoreCase("reg:inventors")) {
	     	   if(inventorsList == null)
	     		  inventorsList = new ArrayList<Inventors>();
	               //acct.setType(attributes.getValue("type"));
	     	  isInventorsDetails = true;
	     	   
	        }
	        if("reg:inventor".equals(qName))
	        	inventors = new Inventors();
	        
	        if(qName.equals("reg:addressbook")){
	        	isCountry = true;
	        }
	        
	 }

 
	  /* When the parser encounters the end of an element, it calls this method */
	  
	 public void endElement(String uri, String localName, String qName)
	               throws SAXException {
	
		   if(isInventorsDetails){
			   
			  
		       if(qName.equals("reg:addressbook")){
		    	   inventorsList.add(inventors);
		           isCountry = false;
		       }
		       
		       
		       if(qName.equals("reg:name")){
		    	   inventors.setInventorName(temp);;
		       }
		       else if(qName.equals("reg:address-1")){
		    	   inventors.setInventorAddress1(temp);
		           
		       }
		       else if(qName.equals("reg:address-2")){
		    	   inventors.setInventorAddress2(temp);
		       }
		       
		       else if(qName.equals("reg:country")){
		    	   if(isCountry)
		    		   inventors.setCountry(temp);
		       }
		       
		       if (qName.equalsIgnoreCase("reg:inventors")) {
		    	   isInventorsDetails = false;
		       }
	 
		   }
		   
		   form1200.setInventors(inventorsList);
	 }
		   
		  

 }
