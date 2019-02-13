package com.bcs.p3s.scrape.digesters;


import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;

import com.bcs.p3s.scrape.model.ApplicationData;
import com.bcs.p3s.scrape.model.Form1200Record;
import com.bcs.p3s.scrape.model.PublicationData;


public class Form1200Details extends DigesterElements{
	
	private String temp;
	private Form1200Record form1200;
	private boolean isEnglishTitle = false;
	private boolean isApplicationData = false;
	private Boolean isPublicationData = false;
	private boolean isPriorityData = false;
	private boolean isDesignatedStates = false;
	PublicationData publication;
	private Set<PublicationData> publicationList;
	ApplicationData application;
	private Set<ApplicationData> applicationList;
	private ArrayList<String> designatedStates = new ArrayList<String>();
	private boolean fix190212isAppNum = false;
	
	
	
	
	public Form1200Details(Form1200Record form1200) {
		super();
		this.form1200 = form1200;
	}
	
	public void characters(char[] buffer, int start, int length) {

		boolean usual = true;
		if (fix190212isAppNum) {
			usual = false;
			String thisFragment = new String(buffer, start, length);
			int len = thisFragment.length();
			if ( (len!=8) && ( (temp.length()+len)==8) ) {
				temp = temp.concat(thisFragment);
				form1200.setFix190212triggered(true);
			}
			else {
				temp = thisFragment;
			}
		}
		
		if (usual) {
			temp = new String(buffer, start, length);
		}
	}


 
	 /* Every time the parser encounters the beginning of a new element,
	  * it calls this method, which resets the string buffer */
	   
	 public void startElement(String uri, String localName,
               String qName, Attributes attributes) throws SAXException {
        temp = "";
       
        if("reg:invention-title".equals(qName)){
     	   if("en".equals(attributes.getValue("lang"))){
     		   isEnglishTitle = true;
     	   }
     		   
        }
        
        /*if("reg:search-report-information".equals(qName))
        	form1200.setSearchReportPublishedOn(attributes.getValue("office"));*/
        
        if("reg:application-reference".equals(qName)){
     	   isApplicationData = true;
     	   application = new ApplicationData();
     	   if(applicationList == null)
     		   applicationList = new HashSet<ApplicationData>();
     	   
        }
        if( isApplicationData && ("reg:doc-number".equals(qName)) ) {
        	fix190212isAppNum = true;
        }

        
        
        
        if("reg:publication-reference".equals(qName)){
     	   isPublicationData = true;
     	   publication = new PublicationData();
     	   if(publicationList == null)
     		   publicationList = new HashSet<PublicationData>();
        }
        
        if(isPublicationData && "reg:document-id".equals(qName)){
        	form1200.setPublishedLang(attributes.getValue("lang"));
        }
        
        if("reg:priority-claims".equals(qName)){
        	isPriorityData = true;
        }
        
        if("reg:designation-of-states".equals(qName)){
        	isDesignatedStates = true;
        }
        
	 }

 
  /* When the parser encounters the end of an element, it calls this method */
  
	 public void endElement(String uri, String localName, String qName)
	               throws SAXException {
	 		
		fix190212isAppNum = false;

	 	if (qName.equalsIgnoreCase("reg:bibliographic-data")) {
	 		System.out.println("Closing biblio data");
	 		
	 	}
	 	
	 	if("reg:language-of-filing".equals(qName))
	 		form1200.setFilingLang(temp);
	 	
	 	if(isEnglishTitle){
	 		form1200.setTitle(temp);
	 		isEnglishTitle = false;
	 	}
	 	
	 	if(isPublicationData){
    		if("reg:publication-reference".equals(qName)){
         	   isPublicationData = false;
         	   publicationList.add(publication);
         	   if("EP".equals(publication.getCountryCode())){
         	   form1200.setEP_PublicationNumber(publication.getCountryCode().concat(publication.getPublicationNumber()));
         	   }
         	  if("WO".equals(publication.getCountryCode())){
            	   form1200.setPCT_PublicationNumber(publication.getCountryCode().concat(publication.getPublicationNumber()));
         	  }
         	   //record.addPublication(publication);
            }
	    	if("reg:country".equals(qName)){
	    		publication.setCountryCode(temp);
	    	}
	    	if("reg:doc-number".equals(qName)){
	    		publication.setPublicationNumber(temp);	 
	    	}
	    	if("reg:date".equals(qName)){
				publication.setPublishedDate(temp);
				form1200.setPublishedDate(publication.getPublishedDate());
			}
	    	
	    }
	 	
		if(isApplicationData){
			if("reg:application-reference".equals(qName)){
				isApplicationData = false;
				applicationList.add(application);
				//record.addApplication(application);
				if("EP".equals(application.getCountryCode())){
					form1200.setEP_AppNumber(application.getCountryCode().concat(application.getApplicationNumber()));
				}
				if("WO".equals(application.getCountryCode())){
					form1200.setPCT_AppNumber(application.getCountryCode().concat(application.getApplicationNumber()));
				}
			}
			if("reg:country".equals(qName)){
				application.setCountryCode(temp);
			}
			if("reg:date".equals(qName)){
				application.setFilingDate(temp);
				form1200.setFilingDate(application.getFilingDate());
			}
			if("reg:doc-number".equals(qName)){
				application.setApplicationNumber(temp);
			}
		}
		
		if(isPriorityData){
			if("reg:date".equals(qName))
				form1200.setPriorityDate(temp);
			else if("reg:priority-claim".equals(qName))
				isPriorityData = false;
		}
		
		if(isDesignatedStates){
			if("reg:designation-of-states".equals(qName)){
				isDesignatedStates = false;
				form1200.setDesignatedContractingStates(designatedStates);
			}
			
			if("reg:country".equals(qName) && (!("EP".equals(temp))))
				designatedStates.add(temp);
			
		}
			 	
	}

	//	 Explanation of fix190212 : On that date, discovered that 'Add Patent' of EP18184535 failed, because the above characters() method
	//	 returned only <i>part</i> of the 18184535. Specifically, 1818453. The Next call (which overwrote 'temp') was 5, causing a subsequent 
	//	 error in the self-check checkStrSame(EP18184535, EP5, EPappNum).
	//	 Crude workaround: For that field only, allow datas to be concatenated. See what we learn goign forward.
	 
}
