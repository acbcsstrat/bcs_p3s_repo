package com.bcs.p3s.scrape.digesters;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;

import com.bcs.p3s.scrape.model.Events;
import com.bcs.p3s.scrape.model.Record;


public class ReadRenewalInfo extends DigesterElements{
	
	private Events events;
	private String temp;
	private List<Events> eventsList = new ArrayList<Events>();
	private Record record;
	private Boolean isEventDetails = false;
	private Boolean isProcedureDescription = false;
	private Boolean isYear = false;
	
	public ReadRenewalInfo(Record record) {
		super();
		this.record = record;
	}
	
	/*
     * When the parser encounters plain text (not XML elements),
     * it calls(this method, which accumulates them in a string buffer */
     
    public void characters(char[] buffer, int start, int length) {
           temp = new String(buffer, start, length);
    }
   

    public void startElement(String uri, String localName,
            String qName, Attributes attributes) throws SAXException {
     temp = "";
     
	     if (qName.equalsIgnoreCase("reg:procedural-step")) {
	  	   if(eventsList == null)
	  		 eventsList = new ArrayList<Events>();
	            //acct.setType(attributes.getValue("type"));
	  	   	 isEventDetails = true;
	  	     events = new Events();
	     }
	     
	     if("reg:procedural-step-text".equals(qName)){
	    	 if("STEP_DESCRIPTION".equals(attributes.getValue("step-text-type"))){
	    		 isProcedureDescription = true;
	    	 }
	    	 if("YEAR".equals(attributes.getValue("step-text-type"))){
	    		 isYear = true;
	    	 }
		}
     
    }
    
    public void endElement(String uri, String localName, String qName)
            throws SAXException {
    	
    	if(isEventDetails){
    		
    		if (qName.equalsIgnoreCase("reg:procedural-step")) {
    			isEventDetails = false;
    			if("RFEE".equals(events.getCode())){
	    			eventsList.add(events);
	    			
    			}
 	        }
    		if ("reg:procedural-step-code".equals(qName)){
    			events.setCode(temp);
    		}
    		else if(isProcedureDescription){
    			events.setProcDescription(temp);
    			isProcedureDescription = false;
    		}
    		else if(isYear){
    			events.setRenewalYear(Integer.parseInt(temp));
    			isYear = false;
    		}
    		else if("reg:date".equals(qName)){
    			events.setLastRenewalPayDate(temp);
    		}
    		
    		
    	}
    	record.setEvents(eventsList);;
    	
    }

}
