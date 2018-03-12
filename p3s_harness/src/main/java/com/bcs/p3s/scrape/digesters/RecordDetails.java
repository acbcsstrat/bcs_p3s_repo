package com.bcs.p3s.scrape.digesters;

import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

import javax.xml.parsers.ParserConfigurationException;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import com.bcs.p3s.scrape.model.ApplicationData;
import com.bcs.p3s.scrape.model.PublicationData;
import com.bcs.p3s.scrape.model.Record;


public class RecordDetails extends DigesterElements{
	
	
	private String temp;
	private Record record;
	
	private Boolean isEnglishTitle = false;
	private Boolean isApplicationData = false;
	private Boolean isPublicationData = false;
	PublicationData publication;
	private Set<PublicationData> publicationList;
	ApplicationData application;
	private Set<ApplicationData> applicationList;
	
	 
	/*
     * When the parser encounters plain text (not XML elements),
     * it calls(this method, which accumulates them in a string buffer  */
     
    public RecordDetails(Record record) {
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
          
           if (qName.equalsIgnoreCase("reg:bibliographic-data")) {
        	  
        	   record.setEpoPatentStatus(attributes.getValue("status"));   
        	   
           }
           
           if("reg:invention-title".equals(qName)){
        	   if("en".equals(attributes.getValue("lang"))){
        		   isEnglishTitle = true;
        	   }
        		   
           }
           
           if("reg:application-reference".equals(qName)){
        	   isApplicationData = true;
        	   application = new ApplicationData();
        	   if(applicationList == null)
        		   applicationList = new HashSet<ApplicationData>();
        	   
           }
           if("reg:publication-reference".equals(qName)){
        	   isPublicationData = true;
        	   publication = new PublicationData();
        	   if(publicationList == null)
        		   publicationList = new HashSet<PublicationData>();
           }
           
           
    }

    
     /* When the parser encounters the end of an element, it calls this method */
     
    public void endElement(String uri, String localName, String qName)
                  throws SAXException {
    		
    	if (qName.equalsIgnoreCase("reg:bibliographic-data")) {
    		System.out.println("Closing biblio data");
    		
    	}
    	
    	if(isEnglishTitle){
    		record.setTitle(temp);
    		isEnglishTitle = false;
    	}
    	
    	
    	if(isPublicationData){
    		if("reg:publication-reference".equals(qName)){
         	   isPublicationData = false;
         	   publicationList.add(publication);
         	   if("EP".equals(publication.getCountryCode())){
         		   record.setPatentPublicationNumber(publication.getCountryCode().concat(publication.getPublicationNumber()));
         	   }
         	   //record.addPublication(publication);
            }
	    	if("reg:country".equals(qName)){
	    		publication.setCountryCode(temp);
	    	}
	    	if("reg:doc-number".equals(qName)){
	    		publication.setPublicationNumber(temp);	 
	    	}
	    	
	    }
    	
    	if(isApplicationData){
    		if("reg:application-reference".equals(qName)){
         	   isApplicationData = false;
         	   applicationList.add(application);
         	   //record.addApplication(application);
         	  if("EP".equals(application.getCountryCode())){
        		   record.setPatentApplicationNumber(application.getCountryCode().concat(application.getApplicationNumber()));
        	   }
            }
	    	if("reg:country".equals(qName)){
	    		application.setCountryCode(temp);
	    	}
	    	if("reg:date".equals(qName)){
	    		application.setFilingDate(temp);
	    		record.setFilingDate(application.getFilingDate());
	    	}
	    	if("reg:doc-number".equals(qName)){
	    		application.setApplicationNumber(temp);
	    	}
	    }
    	
    	
 	}
    
    public void readList() {
    	System.out.println("###### Record Details ######");
    	System.out.println("----------------------------");
    	//System.out.println("Document Number::" + record.getDocNumber() +"\n");
    	//System.out.println("Status:::::::::::" + record.getStatus() +"\n");
    }
    

}
