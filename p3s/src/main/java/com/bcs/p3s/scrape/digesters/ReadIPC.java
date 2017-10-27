package com.bcs.p3s.scrape.digesters;


import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;

import com.bcs.p3s.scrape.model.IPClassification;
import com.bcs.p3s.scrape.model.Record;



public class ReadIPC extends DigesterElements{
	
	private String temp;
	private IPClassification ipc;
	private Record record;
	
	private Boolean isIpcCodes = false;
	
	public Record getRecord() {
		return record;
	}

	
	public ReadIPC(Record record) {
		super();
		
		this.record = record;
		
	}


	public void setRecord(Record record) {
		this.record = record;
	}

	private List<IPClassification> ipcList;

    

	/*
	* When the parser encounters plain text (not XML elements),
	* it calls(this method, which accumulates them in a string buffer
	*/
	public void characters(char[] buffer, int start, int length) {
		temp = new String(buffer, start, length);
	}


	/*
	* Every time the parser encounters the beginning of a new element,
	* it calls this method, which resets the string buffer
	*/ 
	public void startElement(String uri, String localName,
	    String qName, Attributes attributes) throws SAXException {
		temp = "";
		if (qName.equalsIgnoreCase("reg:classifications-ipcr")) {
			if(ipcList == null){
				ipcList = new ArrayList<IPClassification>();
			}
			isIpcCodes = true;
	    //acct.setType(attributes.getValue("type"));
		}
		else if(qName.equalsIgnoreCase("reg:text")){
			ipc = new IPClassification();              
		}
	
		
	
	}

	/*
	* When the parser encounters the end of an element, it calls this method
	*/
	public void endElement(String uri, String localName, String qName)
	    throws SAXException {
	
		if(isIpcCodes){
	
			if(qName.equals("reg:classification-ipcr")){
			 ipcList.add(ipc);
			}
			if(qName.equals("reg:text")){
				ipc.setIpcCodes(temp);
			}
		
			if (qName.equalsIgnoreCase("reg:classifications-ipcr")) {
				isIpcCodes = false;
		    }
		}
		
		record.setIpcCodes(ipcList);
		
	}

}


