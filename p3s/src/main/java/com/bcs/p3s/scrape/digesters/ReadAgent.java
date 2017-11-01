package com.bcs.p3s.scrape.digesters;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.security.taglibs.authz.AccessControlListTag;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import com.bcs.p3s.scrape.model.Agent;
import com.bcs.p3s.scrape.model.Record;



public class ReadAgent extends DigesterElements{
	
	private Agent acct;
    
    private String temp;
    private List<Agent> accList = new ArrayList<Agent>();
    private Boolean isCurrentAgentDetails = false;
    private Record record;
	
    
    
	public ReadAgent(Record record) {
		super();
		this.record = record;
	}



	/*
     * When the parser encounters plain text (not XML elements),
     * it calls(this method, which accumulates them in a string buffer */
     
    public void characters(char[] buffer, int start, int length) {
           temp = new String(buffer, start, length);
    }
   

    
     /* Every time the parser encounters the beginning of a new element,
     * it calls this method, which resets the string buffer */
      
    public void startElement(String uri, String localName,
                  String qName, Attributes attributes) throws SAXException {
           temp = "";
           if (qName.equalsIgnoreCase("reg:agents")) {
        	   if(accList == null)
        		   accList = new ArrayList<Agent>();
        	  // if("N/P".equals(attributes.getValue("change-gazette-num"))){
        	acct = new Agent();
	        isCurrentAgentDetails = true;
	        acct.setChngGazetteNum(attributes.getValue("change-gazette-num"));
	        acct.setChangeDate(attributes.getValue("change-date"));
        	//   }
        	  
         }
           
           
           
    }

    
     /* When the parser encounters the end of an element, it calls this method */
     
    public void endElement(String uri, String localName, String qName)
                  throws SAXException {

 	   if(isCurrentAgentDetails){
 		   
 		  
	       if(qName.equals("reg:name")){
	           acct.setName(temp);
	       }
	       else if(qName.equals("reg:address-1")){
	    	   
	    	   acct.setAddress1(temp);
	       }
	       else if(qName.equals("reg:address-2")){
	    	   acct.setAddress2(temp);
	       }
	       else if(qName.equals("reg:address-3")){
	    	   acct.setAddress3(temp);
	       }
	       else if(qName.equals("reg:address-4")){
	    	   acct.setAddress4(temp);
	       }
	       else if(qName.equals("reg:country")){
	    	   acct.setCountry(temp);
	       }
	       
	       if (qName.equalsIgnoreCase("reg:agents")) {
	    	   isCurrentAgentDetails = false;
	    	   //record.setRepresentativeDetails(formatAgentDetails(acct));
	    	   accList.add(acct);
	    	   
	       }
    
 	   }
 	  
 	  record.setRepresentativesList(accList);

    }
    
    

}
