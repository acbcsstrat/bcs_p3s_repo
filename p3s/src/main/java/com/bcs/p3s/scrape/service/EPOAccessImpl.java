package com.bcs.p3s.scrape.service;


import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.bcs.p3s.scrape.model.Agent;
import com.bcs.p3s.scrape.model.AgentData;
import com.bcs.p3s.scrape.model.ApplicantData;
import com.bcs.p3s.scrape.model.Applicants;
import com.bcs.p3s.scrape.model.Claims;
import com.bcs.p3s.scrape.model.Events;
import com.bcs.p3s.scrape.model.Form1200Record;
import com.bcs.p3s.scrape.model.IPClassification;
import com.bcs.p3s.scrape.model.Record;
import com.bcs.p3s.scrape.model.SearchReports;
import com.bcs.p3s.util.config.P3SPropertyException;
import com.bcs.p3s.util.config.P3SPropertyNames;
import com.bcs.p3s.util.config.P3SPropertyReader;
import com.bcs.p3s.util.date.DateUtil;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.util.scrape.OPSReader;
import com.bcs.p3s.enump3s.EPOSearchTypeEnum;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.scrape.digesters.DigesterElements;
import com.bcs.p3s.scrape.digesters.Form1200Details;
import com.bcs.p3s.scrape.digesters.ReadAbstract;
import com.bcs.p3s.scrape.digesters.ReadAgent;
import com.bcs.p3s.scrape.digesters.ReadApplicant;
import com.bcs.p3s.scrape.digesters.ReadClaims;
import com.bcs.p3s.scrape.digesters.ReadIPC;
import com.bcs.p3s.scrape.digesters.ReadInventor;
import com.bcs.p3s.scrape.digesters.ReadRenewalInfo;
import com.bcs.p3s.scrape.digesters.ReadSearchReports;
import com.bcs.p3s.scrape.digesters.RecordDetails;
import com.bcs.p3s.scrape.digesters.Response;



public class EPOAccessImpl  extends Universal implements EPOAccess{
	
	protected String PREFIX = CLASSNAME + " : "; 
	private final String ADDRESS_DELIMITER = ",";

	@Override
	public Patent readEPORegisterForRenewals(String patentApplicationNumber) { 
		
		String msg = PREFIX + "readEPORegisterForRenewals(" + patentApplicationNumber + ")";
		
		log().debug( msg +" invoked ");
		OPSReader reader = new OPSReader();
		Patent patent = new Patent();
		
		
		List<DigesterElements> digesters = new ArrayList<DigesterElements>();
		try {
			
			String search_url = generateURL(patentApplicationNumber, EPOSearchTypeEnum.REGISTER_RETRIEVAL_RENEWAL);
			
			//Create a "parser factory" for creating SAX parsers
	        SAXParserFactory spfac = SAXParserFactory.newInstance();

	        //Now use the parser factory to create a SAXParser object
	        SAXParser sp = spfac.newSAXParser();
	          
	        Record record = new Record();
	        
	        digesters.add(new RecordDetails(record));
	        digesters.add(new ReadApplicant(record));
	        digesters.add(new ReadRenewalInfo(record));
	        digesters.add(new ReadAgent(record));
	        digesters.add(new ReadIPC(record));
	        
	        String scrapeData = reader.readEPO(search_url);
	        
	        if(scrapeData == null){
	        	log().warn("Search to EPO with application number[" +patentApplicationNumber +"] resulted in NO DATA");
	        	return null;
	        }
	        
	        //SET Application Number from request
	        patent.setEP_ApplicationNumber(patentApplicationNumber);
	        
	        Response response = new Response();
	        response.setContent(scrapeData);
	        
	        log().debug("EPO Response to "+msg+" is : " + response.getContent());
	        for(DigesterElements digest: digesters){
	    		
	        	InputSource iss = new InputSource(new java.io.StringReader(response.getContent()));
	        	iss.setEncoding("UTF-8");
	        	sp.parse(iss, digest);
	        }
	        
	        //if((patent.getPatentApplicationNumber().substring(2)).equals(record.getPatentApplicationNumber()))   // this check became redundant
	        patent = populatePatent(patent,record);
	        
	        
	
		} 
		catch(SAXException e){
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Exception in " + msg );
			log().error("Stacktrace was: "+errors.toString());
		}
		catch(ParserConfigurationException e){
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Exception in " + msg );
			log().error("Stacktrace was: "+errors.toString());
		}
		catch (FileNotFoundException e) {
			log().debug("No data found for application number " + patentApplicationNumber);
			return null;
		}
		catch (Exception e) {
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Exception in " + msg );
			log().error("Stacktrace was: "+errors.toString());
		}
		return patent;
		
	}
	
	

	//------------ Below are the scraping methods for FORM1200 -----------
	@Override
	//Note :- Claims retrievals service requires PATENT PUBLICATION NUMBER
	public Claims readEPOForClaims(String patentPublicationNumber){
		
		Claims claims = new Claims();
		
		String msg = PREFIX + "readEPOForClaims(" + patentPublicationNumber + ")";
		
		log().debug( msg +" invoked ");
		OPSReader reader = new OPSReader();
		
		List<DigesterElements> digesters = new ArrayList<DigesterElements>();
		try {
			
			String search_url = generateURL(patentPublicationNumber, EPOSearchTypeEnum.PUBLISHED_DATA_CLAIMS);
			//Create a "parser factory" for creating SAX parsers
	        SAXParserFactory spfac = SAXParserFactory.newInstance();

	        //Now use the parser factory to create a SAXParser object
	        SAXParser sp = spfac.newSAXParser();
	          
	        Form1200Record form1200 = new Form1200Record();
	        digesters.add(new ReadClaims(form1200));
	        
	           
	        String scrapeData = reader.readEPO(search_url);
	        
	        if(scrapeData == null){
	        	log().debug("Search for Claims with publication number[" +patentPublicationNumber +"] resulted in NO DATA");
	        	log().fatal("Search fro Claims with publication number[" +patentPublicationNumber +"] resulted in NO DATA");
	        	return null;
	        }
	        
	        Response response = new Response();
	        response.setContent(scrapeData);
	        
	        System.out.println("Response : " + response.getContent());
	        for(DigesterElements digest: digesters){
	    		
	        	InputSource iss = new InputSource(new java.io.StringReader(response.getContent()));
	        	iss.setEncoding("UTF-8");
	        	sp.parse(iss, digest);
	        }
	        
	        claims.setAllClaims(form1200.getAllClaims());
	        claims.setClaimsTxt(form1200.getClaimsTxt());
	        claims = populateClaims(claims);
	       
		}
		catch(Exception e){
			
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Stacktrace was: "+errors.toString());
		}
		
		 return claims;
	}


	@Override
	public Form1200Record readEPORegisterForForm1200(String patentApplicationNumber){
		
		String msg = PREFIX + "readEPORegisterForForm1200(" + patentApplicationNumber + ")";
		
		log().debug( msg +" invoked ");
		OPSReader reader = new OPSReader();
		Form1200Record form1200 = new Form1200Record();
		
		
		List<DigesterElements> digesters = new ArrayList<DigesterElements>();
		try {
			
			String search_url = generateURL(patentApplicationNumber, EPOSearchTypeEnum.REGISTER_RETRIEVAL_FORM1200);
			//Create a "parser factory" for creating SAX parsers
	        SAXParserFactory spfac = SAXParserFactory.newInstance();

	        //Now use the parser factory to create a SAXParser object
	        SAXParser sp = spfac.newSAXParser();
	          
	        Record record = new Record();
	        digesters.add(new Form1200Details(form1200));
	        digesters.add(new ReadApplicant(record));
	        digesters.add(new ReadAgent(record));
	        digesters.add(new ReadIPC(record));
	        digesters.add(new ReadInventor(form1200));
	        digesters.add(new ReadClaims(form1200));
	        digesters.add(new ReadSearchReports(form1200));
	           
	        String scrapeData = reader.readEPO(search_url);
	        
	        if(scrapeData == null){
	        	log().debug("Search to EPO with application number[" +patentApplicationNumber +"] resulted in NO DATA");
	        	log().fatal("Search to EPO with application number[" +patentApplicationNumber +"] resulted in NO DATA");
	        	return null;
	        }
	        
	        //SET Application Number from request
	        //patent.setPatentApplicationNumber(patentApplicationNumber);
	        
	        Response response = new Response();
	        response.setContent(scrapeData);
	        
	        log().debug("EPO Response to "+msg+" is : " + response.getContent());
	        for(DigesterElements digest: digesters){
	    		
	        	InputSource iss = new InputSource(new java.io.StringReader(response.getContent()));
	        	iss.setEncoding("UTF-8");
	        	sp.parse(iss, digest);
	        }
	        
	        //if((patent.getPatentApplicationNumber().substring(2)).equals(record.getPatentApplicationNumber()))   // this check became redundant
	        //patent = populatePatent(patent,record);
	        populateForm1200(form1200,record);
	        return form1200;
	
		} 
		catch(SAXException e){
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Exception in " + msg );
			log().error("Stacktrace was: "+errors.toString());
		}
		catch(ParserConfigurationException e){
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Exception in " + msg );
			log().error("Stacktrace was: "+errors.toString());
		}
		catch (FileNotFoundException e) {
			log().debug("No data found for application number " + patentApplicationNumber);
			return null;
		}
		catch (Exception e) {
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Exception in " + msg );
			log().error("Stacktrace was: "+errors.toString());
		}
		return form1200;
		
	}
	
	@Override
	public String readEPOForAbstract(String patentPublicationNumber) {
		
		String msg = PREFIX + "readEPOForAbstract(" + patentPublicationNumber + ")";
		String abstractTxt = null;
		
		log().debug( msg +" invoked ");
		OPSReader reader = new OPSReader();
		Form1200Record form1200 = new Form1200Record();
		
		List<DigesterElements> digesters = new ArrayList<DigesterElements>();
		try {
			
			String search_url = generateURL(patentPublicationNumber, EPOSearchTypeEnum.PUBLISHED_DATA_ABSTRACT);
			//Create a "parser factory" for creating SAX parsers
	        SAXParserFactory spfac = SAXParserFactory.newInstance();

	        //Now use the parser factory to create a SAXParser object
	        SAXParser sp = spfac.newSAXParser();
	          
	        digesters.add(new ReadAbstract(form1200));
	        
	           
	        String scrapeData = reader.readEPO(search_url);
	        
	        if(scrapeData == null){
	        	log().debug("Search for Abstract with publication number[" +patentPublicationNumber +"] resulted in NO DATA");
	        	log().fatal("Search for Abstract with publication number[" +patentPublicationNumber +"] resulted in NO DATA");
	        	return null;
	        }
	        
	        Response response = new Response();
	        response.setContent(scrapeData);
	        
	        System.out.println("Response : " + response.getContent());
	        for(DigesterElements digest: digesters){
	    		
	        	InputSource iss = new InputSource(new java.io.StringReader(response.getContent()));
	        	iss.setEncoding("UTF-8");
	        	sp.parse(iss, digest);
	        }
	        
	       
		}
		catch(Exception e){
			
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Stacktrace was: "+errors.toString());
		}
		
		 return form1200.getAbstractTxt();
		 
	}
	
	protected Patent populatePatent(Patent patent, Record record) throws ParseException{
		
		if(record == null)
			return patent;
		
		patent.setEpoPatentStatus(record.getEpoPatentStatus());
		patent.setInternationalFilingDate(new DateUtil().stringToDate(record.getFilingDate()));
		
		patent.setEP_PublicationNumber(record.getPatentPublicationNumber());
		
		patent.setTitle(record.getTitle());
		findLatestRenewalInfo(record.getEvents(),patent);
		//findPrimaryApplicantName(record.getApplicants(),patent);
		patent.setPrimaryApplicantName(findRecentApplicantsInfo(record.getApplicantsData()).getListApplicants().get(0).getApplicantName());
		patent.setIpcCodes(findLatestIPCCodes(record.getIpcCodes()).getIpcCodes());
		patent.setRepresentative(formatAgentDetails(findRecentAgentsInfo(record.getAgentData()).getListAgents().get(0)));
		/*if(!(record.getRepresentativesList().size() == 0)){
			if(record.getRepresentativesList().size() > 1)
				findRecentRepresentativeInfo(record.getRepresentativesList(),patent);
			else
				patent.setRepresentative(formatAgentDetails(record.getRepresentativesList().get(0)));
		}*/
			
		return patent;
		
	}
	
	
	protected void findLatestRenewalInfo(List<Events> events, Patent patent) {
		
		patent.setLastRenewedYearEpo(0);
		for(Events event : events){
			if(event.getRenewalYear() > patent.getLastRenewedYearEpo()){
				patent.setLastRenewedYearEpo(event.getRenewalYear());
				try {
					patent.setLastRenewedDateExEpo(new DateUtil().stringToDate(event.getLastRenewalPayDate()));
				} catch (ParseException e) {
					StringWriter errors = new StringWriter();
					e.printStackTrace(new PrintWriter(errors));
					log().error("Exception in findLatestRenewalInfo() " );
					log().error("Stacktrace was: "+errors.toString());
				}
			}
		}
		
	}
	
	//Assumption :- first applicant details on the list
	protected void findPrimaryApplicantName(List<Applicants> applicants, Patent patent){
		
		//patent.setPrimaryApplicantName(applicants.get(0).getApplicantName());
		
	}
	
	/*protected void findRecentRepresentativeInfo(List<Agent> agents, Patent patent){
		String repDetails = "";
		boolean isGood = true;
		Agent recentAgent = new Agent();
		
		try {
			
			for(Agent agent : agents){
				if(agent.getChangeDate() == null)
					isGood = false;
			}
			
			if(isGood){
				Date latestDate = new DateUtil().stringToDate(agents.get(0).getChangeDate());
				recentAgent = agents.get(0);
				for(Agent agent : agents){
					Date date = new DateUtil().stringToDate(agent.getChangeDate());
					if(date.after(latestDate)){
						latestDate = date;
						recentAgent = agent;
						//repDetails = formatAgentDetails(agent);
					}
				}
				repDetails = formatAgentDetails(recentAgent);
				patent.setRepresentative(repDetails);
			}
			
			else{
				patent.setRepresentative(formatAgentDetails(agents.get(0)));
			}
			
		} 
		
		catch (ParseException e) {
			e.printStackTrace();
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Exception in findRecentRepresentativeInfo() "  );
			log().error("Stacktrace was: "+errors.toString());
		}
	}*/
	
	
	
	protected String formatAgentDetails(Agent acct){
    	
    	String repDetails = "";
    	
    	if(acct == null)
    		return null;
    	
    	if(acct.getAddress3() == null){
    		repDetails = acct.getName().concat(ADDRESS_DELIMITER).concat(acct.getAddress1()).concat(ADDRESS_DELIMITER).concat(acct.getAddress2()).
        			concat(ADDRESS_DELIMITER).concat(acct.getCountry());
    	}
    	
    	else if(acct.getAddress4() == null){
    		repDetails = acct.getName().concat(ADDRESS_DELIMITER).concat(acct.getAddress1()).concat(ADDRESS_DELIMITER).concat(acct.getAddress2()).
        			concat(ADDRESS_DELIMITER).concat(acct.getAddress3()).concat(ADDRESS_DELIMITER).concat(acct.getCountry());
    	}
    	
    	else{
	    	repDetails = acct.getName().concat(ADDRESS_DELIMITER).concat(acct.getAddress1()).concat(ADDRESS_DELIMITER).concat(acct.getAddress2()).
	    			concat(ADDRESS_DELIMITER).concat(acct.getAddress3()).concat(ADDRESS_DELIMITER).concat(acct.getAddress4()).concat(ADDRESS_DELIMITER).
	    			concat(acct.getCountry());
    	}
    	
    	return repDetails;
    }


	//@Override
	protected String generateURL(String patentNumber, String searchType) throws P3SPropertyException {
		
		/*
		 * Note: patentNumber can be either application number or publication number
		 * For claims retrieval service we need Patent Publication Number
		 */
		P3SPropertyReader reader = new P3SPropertyReader();
		
		String url = "";
		String base_url = null;
		String type = null;
		String format = null;
		String result = null;
		String delimiter = "/";
		
		String msg = PREFIX + "generateURL(" + patentNumber +" , " +  searchType + ")";
			
		log().debug(msg +" invoked ");
			
		if(EPOSearchTypeEnum.REGISTER_RETRIEVAL_RENEWAL.equals(searchType)){
			base_url = reader.getGenericProperty(P3SPropertyNames.REGISTER_BASE_URL); 
			type = reader.getGenericProperty(P3SPropertyNames.EPO_SCRAPE_TYPE_APPLICATION); 
			format = reader.getGenericProperty(P3SPropertyNames.EPO_SCRAPE_FORMAT_EPODOC); 
			result = reader.getGenericProperty(P3SPropertyNames.EPO_SCRAPE_RESULT_BIBLIO_PROCEDURAL); 
				
			url = base_url.concat(type).concat(delimiter).concat(format).concat(delimiter).concat(patentNumber).concat(delimiter).concat(result);
		}
		
		else if(EPOSearchTypeEnum.PUBLISHED_DATA_CLAIMS.equals(searchType)){
			
			base_url = reader.getGenericProperty(P3SPropertyNames.PUBLISHED_DATA_BASE_URL); 
			type = reader.getGenericProperty(P3SPropertyNames.EPO_SCRAPE_TYPE_PUBLICATION); 
			format = reader.getGenericProperty(P3SPropertyNames.EPO_SCRAPE_FORMAT_EPODOC); 
			result = reader.getGenericProperty(P3SPropertyNames.EPO_SCRAPE_RESULT_CLAIMS); 
			
			url = base_url.concat(type).concat(delimiter).concat(format).concat(delimiter).concat(patentNumber).concat(delimiter).concat(result);
		}
		
		else if(EPOSearchTypeEnum.REGISTER_RETRIEVAL_FORM1200.equals(searchType)){
			
			base_url = reader.getGenericProperty(P3SPropertyNames.REGISTER_BASE_URL); 
			type = reader.getGenericProperty(P3SPropertyNames.EPO_SCRAPE_TYPE_APPLICATION); 
			format = reader.getGenericProperty(P3SPropertyNames.EPO_SCRAPE_FORMAT_EPODOC); 
			result = reader.getGenericProperty(P3SPropertyNames.EPO_SCRAPE_RESULT_BIBLIO); // This is the only difference from REGISTER_RETRIEVAL_RENEWAL
				
			url = base_url.concat(type).concat(delimiter).concat(format).concat(delimiter).concat(patentNumber).concat(delimiter).concat(result);
		}
		else if(EPOSearchTypeEnum.PUBLISHED_DATA_ABSTRACT.equals(searchType)){
			
			base_url = reader.getGenericProperty(P3SPropertyNames.PUBLISHED_DATA_BASE_URL); 
			type = reader.getGenericProperty(P3SPropertyNames.EPO_SCRAPE_TYPE_PUBLICATION); 
			format = reader.getGenericProperty(P3SPropertyNames.EPO_SCRAPE_FORMAT_EPODOC); 
			result = reader.getGenericProperty(P3SPropertyNames.EPO_SCRAPE_RESULT_ABSTRACT); 
				
			url = base_url.concat(type).concat(delimiter).concat(format).concat(delimiter).concat(patentNumber).concat(delimiter).concat(result);
		}
			
		log().debug(msg +" returning EPO search URL as " + url);
		return url;
	}
	
	
	protected Form1200Record populateForm1200(Form1200Record form1200, Record record)
	{
		
		form1200.setApplicants(findRecentApplicantsInfo(record.getApplicantsData()));
		form1200.setIpcCodes(findLatestIPCCodes(record.getIpcCodes()));
		form1200.setAgents(findRecentAgentsInfo(record.getAgentData()));
		//form1200.setPublicationNumber(record.getPatentPublicationNumber());
		//form1200.setPublishedDate(record.get);

        // ac 181015 1737 got to here
		
		
		return form1200;
	}
	
	protected Claims populateClaims(Claims claims){
		
		String msg = PREFIX + "populateClaims(claims)";
		log().debug(msg +" invoked");
		log().debug("Obtained claims list having size of "+ claims.getAllClaims().length);
		
		String temp[] = claims.getAllClaims();
		if(temp[0].contains("CLAIMS")){
			log().debug("First index value of claims list is "+ temp[0] +" and so it can be removed");
			List<String> list = new ArrayList<String>(Arrays.asList(temp));
			list.remove(0);
			list.removeAll(Collections.singleton(""));
			temp = list.toArray(new String[0]);
			claims.setAllClaims(temp);
		}
		else{
			log().debug("No change required for claims list");
		}
		
		log().debug(msg +" returning claims list having size " + claims.getAllClaims().length); 
		return claims;
	}
	
	protected ApplicantData findRecentApplicantsInfo(List<ApplicantData> allApplicants){
		String msg = "findRecentApplicantsInfo() from the list of ApplicantData";
		log().debug(msg +" invoked");
		ApplicantData recentApplicantsData = new ApplicantData();
		
		try {
			
			if(allApplicants.size() == 1){
				recentApplicantsData = allApplicants.get(0);
				return recentApplicantsData;
			}
			
			for(ApplicantData eachAppList : allApplicants){
				if(eachAppList.getChangeDate() == null){
					log().info("Applicant List is having null value for change date. So setting 0th index from the list as the recent Applicant Data");
					recentApplicantsData = allApplicants.get(0);
					return recentApplicantsData;
				}
			}
			
			
			Date latestDate = new DateUtil().stringToDate(allApplicants.get(0).getChangeDate());
			recentApplicantsData = allApplicants.get(0);
			for(ApplicantData eachAppList : allApplicants){
				Date date = new DateUtil().stringToDate(eachAppList.getChangeDate());
				if(date.after(latestDate)){
					latestDate = date;
					recentApplicantsData = eachAppList;
						//repDetails = formatAgentDetails(agent);
				}
			}
			
		} 
		
		catch (ParseException e) {
			e.printStackTrace();
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Exception in findRecentApplicantsInfo() "  );
			log().error("Stacktrace was: "+errors.toString());
		}
		return recentApplicantsData;
	}

	protected AgentData findRecentAgentsInfo(List<AgentData> allAgents){
		String msg = "findRecentAgentsInfo() from the list of AgentData";
		log().debug(msg +" invoked");
		AgentData recentAgentsData = new AgentData();
		
		try {
			
			if(allAgents.size() == 1){
				recentAgentsData = allAgents.get(0);
				return recentAgentsData;
			}
			
			for(AgentData eachAgentList : allAgents){
				if(eachAgentList.getChangeDate() == null){
					log().info("Agent List is having null value for change date. So setting 0th index from the list as the recent Agent Data");
					recentAgentsData = allAgents.get(0);
					return recentAgentsData;
				}
			}
			
			
			Date latestDate = new DateUtil().stringToDate(allAgents.get(0).getChangeDate());
			recentAgentsData = allAgents.get(0);
			for(AgentData eachAgentList : allAgents){
				Date date = new DateUtil().stringToDate(eachAgentList.getChangeDate());
				if(date.after(latestDate)){
					latestDate = date;
					recentAgentsData = eachAgentList;
						//repDetails = formatAgentDetails(agent);
				}
			}
			
		} 
		
		catch (ParseException e) {
			e.printStackTrace();
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Exception in findRecentAgentsInfo() "  );
			log().error("Stacktrace was: "+errors.toString());
		}
		return recentAgentsData;
	}
	
	protected IPClassification findLatestIPCCodes(List<IPClassification> ipcCodes){
		String msg = "findLatestIPCCodes() from the list of IPC";
		log().debug(msg +" invoked");
		IPClassification latestCodes = new IPClassification();
		
		try {
			
			if(ipcCodes.size() == 1){
				latestCodes = ipcCodes.get(0);
				return latestCodes;
			}
			
			for(IPClassification eachIPC : ipcCodes){
				if(eachIPC.getChangeDate() == null){
					log().info("IPC Code List is having null value for change date. So setting 0th index from the list as the latest ipc Code");
					latestCodes = ipcCodes.get(0);
					return latestCodes;
				}
			}
			
			
			Date latestDate = new DateUtil().stringToDate(ipcCodes.get(0).getChangeDate());
			latestCodes = ipcCodes.get(0);
			for(IPClassification eachIPC : ipcCodes){
				Date date = new DateUtil().stringToDate(eachIPC.getChangeDate());
				if(date.after(latestDate)){
					latestDate = date;
					latestCodes = eachIPC;
						//repDetails = formatAgentDetails(agent);
				}
			}
			
		} 
		
		catch (ParseException e) {
			e.printStackTrace();
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Exception in findLatestIPCCodes() "  );
			log().error("Stacktrace was: "+errors.toString());
		}
		return latestCodes;
	}
	
}
