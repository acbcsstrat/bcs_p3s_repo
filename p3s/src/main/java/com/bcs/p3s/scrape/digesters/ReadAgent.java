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
import com.bcs.p3s.scrape.model.AgentData;
import com.bcs.p3s.scrape.model.Record;



public class ReadAgent extends DigesterElements{
	
	private Agent agent = new Agent();
	private AgentData agentData = new AgentData();
    
    private String temp;
    private List<Agent> agentList = new ArrayList<Agent>();
    private List<AgentData> allAgentsList = new ArrayList<AgentData>();
    private Boolean isAgentDetails = false;
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
        	   if(allAgentsList == null)
        		   allAgentsList = new ArrayList<AgentData>();
        	  // if("N/P".equals(attributes.getValue("change-gazette-num"))){
        	   agentList = new ArrayList<Agent>();
        	   isAgentDetails = true;
        	   agentData = new AgentData();
        	   agentData.setChangeGazetteNumber(attributes.getValue("change-gazette-num"));
        	   agentData.setChangeDate(attributes.getValue("change-date"));
        	//   }
        	  
           }
           
           if(qName.equalsIgnoreCase("reg:agent")){
        	   agent = new Agent();
           }
    }

    
     /* When the parser encounters the end of an element, it calls this method */
     
    public void endElement(String uri, String localName, String qName)
                  throws SAXException {

 	   if(isAgentDetails){
 		   
 		  
	       if(qName.equals("reg:name")){
	    	   agent.setName(temp);
	       }
	       else if(qName.equals("reg:address-1")){
	    	   
	    	   agent.setAddress1(temp);
	       }
	       else if(qName.equals("reg:address-2")){
	    	   agent.setAddress2(temp);
	       }
	       else if(qName.equals("reg:address-3")){
	    	   agent.setAddress3(temp);
	       }
	       else if(qName.equals("reg:address-4")){
	    	   agent.setAddress4(temp);
	       }
	       else if(qName.equals("reg:country")){
	    	   agent.setCountry(temp);
	       }
	       
	       if(qName.equalsIgnoreCase("reg:agent")){
	    	   agentList.add(agent);
	       }
	       
	       if (qName.equalsIgnoreCase("reg:agents")) {
	    	   isAgentDetails = false;
	    	   //record.setRepresentativeDetails(formatAgentDetails(acct));
	    	   agentData.setListAgents(agentList);
	    	   allAgentsList.add(agentData);
	    	   
	       }
    
 	   }
 	  
 	  record.setAgentData(allAgentsList);

    }
    
    

}
