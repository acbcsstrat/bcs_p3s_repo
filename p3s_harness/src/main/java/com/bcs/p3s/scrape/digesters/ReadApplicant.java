package com.bcs.p3s.scrape.digesters;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import com.bcs.p3s.scrape.model.Applicants;
import com.bcs.p3s.scrape.model.Record;



public class ReadApplicant extends DigesterElements{
	
	private String temp;
	private Applicants applicants;
	private boolean isApplicantsDetails, isCountry;
	private List<Applicants> applicantsList = new ArrayList<Applicants>();
	private Record record;
	
	
	
	public ReadApplicant(Record record) {
		super();
		this.record = record;
	}



	public void characters(char[] buffer, int start, int length) {
        temp = new String(buffer, start, length);
        
 }


 
  /* Every time the parser encounters the beginning of a new element,
  * it calls this method, which resets the string buffer */
   
 public void startElement(String uri, String localName,
               String qName, Attributes attributes) throws SAXException {
        temp = "";
        if (qName.equalsIgnoreCase("reg:applicants")) {
     	   if(applicantsList == null)
     		  applicantsList = new ArrayList<Applicants>();
               //acct.setType(attributes.getValue("type"));
     	  isApplicantsDetails = true;
     	 applicants = new Applicants();
     	   
      }
        if(qName.equals("reg:addressbook")){
        	isCountry = true;
        }
        
 }

 
  /* When the parser encounters the end of an element, it calls this method */
  
 public void endElement(String uri, String localName, String qName)
               throws SAXException {

	   if(isApplicantsDetails){
		   
		  
	       if(qName.equals("reg:addressbook")){
	           applicantsList.add(applicants);
	           isCountry = false;
	       }
	       
	       
	       if(qName.equals("reg:name")){
	           applicants.setApplicantName(temp);
	       }
	       else if(qName.equals("reg:address-1")){
	    	   applicants.setApplicantAddress1(temp);
	           
	       }
	       else if(qName.equals("reg:address-2")){
	    	   applicants.setApplicantAddress2(temp);
	       }
	       
	       else if(qName.equals("reg:country")){
	    	   if(isCountry)
	    		   applicants.setCountry(temp);
	       }
	       
	       if (qName.equalsIgnoreCase("reg:applicants")) {
	    	   isApplicantsDetails = false;
	       }
 
	   }
	   
	   record.setApplicants(applicantsList);
	   
	  

 }

}
