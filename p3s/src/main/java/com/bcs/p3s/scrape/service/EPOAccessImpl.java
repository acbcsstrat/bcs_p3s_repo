package com.bcs.p3s.scrape.service;


import java.text.ParseException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.bcs.p3s.scrape.model.Applicants;
import com.bcs.p3s.scrape.model.Events;
import com.bcs.p3s.scrape.model.Record;
import com.bcs.p3s.util.date.DateUtil;
import com.bcs.p3s.util.lang.P3SRuntimeException;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.util.scrape.OPSReader;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.scrape.digesters.DigesterElements;
import com.bcs.p3s.scrape.digesters.ReadApplicant;
import com.bcs.p3s.scrape.digesters.ReadRenewalInfo;
import com.bcs.p3s.scrape.digesters.RecordDetails;
import com.bcs.p3s.scrape.digesters.Response;

public class EPOAccessImpl  extends Universal implements EPOAccess{
	
	protected String PREFIX = this.getClass().getName() + " : "; 

	@Override
	public Patent populatePatentEPOData(String patentApplicationNumber) { 
		
		String msg = PREFIX + "populatePatentEPOData(" + patentApplicationNumber + ")";
		
		log().debug( msg +" invoked ");
		OPSReader reader = new OPSReader();
		Patent patent = new Patent();
		
		List<DigesterElements> digesters = new ArrayList<DigesterElements>() ;
		try {
			
			
			//Create a "parser factory" for creating SAX parsers
	        SAXParserFactory spfac = SAXParserFactory.newInstance();

	        //Now use the parser factory to create a SAXParser object
	        SAXParser sp = spfac.newSAXParser();
	          
	        Record record = new Record();
	        digesters.add(new RecordDetails(record));
	        digesters.add(new ReadApplicant(record));
	        digesters.add(new ReadRenewalInfo(record));
	           
	        String scrapeData = reader.readEPO(patentApplicationNumber);
	        
	        if(scrapeData == null){
	        	log().debug("No patent Info found for patent appln number " + patentApplicationNumber);
	        	return null;
	        }
	        
	        //SET Application Number from request
	        patent.setPatentApplicationNumber(patentApplicationNumber);
	        
	        Response response = new Response();
	        response.setContent(scrapeData);
	        for(DigesterElements digest: digesters){
	    		
	        	InputSource iss = new InputSource(new java.io.StringReader(response.getContent()));
	        	iss.setEncoding("UTF-8");
	        	sp.parse(iss, digest);
	        }
	        
	        //if((patent.getPatentApplicationNumber().substring(2)).equals(record.getPatentApplicationNumber()))   // this check became redundant
	        patent = populatePatent(patent,record);
	        
	        
	
		} 
		catch(SAXException e){
			
		}
		catch(ParserConfigurationException e){
			
		}
		catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return patent;
		
	}
	
	
	protected Patent populatePatent(Patent patent, Record record) throws ParseException{
		
		if(record == null)
			return patent;
		
		patent.setEpoPatentStatus(record.getEpoPatentStatus());
		patent.setFilingDate(new DateUtil().stringToDate(record.getFilingDate()));
		
		patent.setPatentPublicationNumber(record.getPatentPublicationNumber());
		
		patent.setTitle(record.getTitle());
		findLatestRenewalInfo(record.getEvents(),patent);
		findPrimaryApplicantName(record.getApplicants(),patent);
		
		return patent;
		
	}
	
	
	protected void findLatestRenewalInfo(List<Events> events, Patent patent) throws ParseException{
		
		patent.setLastRenewedYearEpo(0);
		for(Events event : events){
			if(event.getRenewalYear() > patent.getLastRenewedYearEpo()){
				patent.setLastRenewedYearEpo(event.getRenewalYear());
				patent.setLastRenewedDateExEpo(new DateUtil().stringToDate(event.getLastRenewalPayDate()));
			}
		}
		
	}
	
	//Assumption :- first applicant details on the list
	protected void findPrimaryApplicantName(List<Applicants> applicants, Patent patent){
		
		patent.setPrimaryApplicantName(applicants.get(0).getApplicantName());
		
	}
		
	
	
}
