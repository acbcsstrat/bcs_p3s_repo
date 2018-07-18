package com.bcs.p3s.scrape.digesters;

import java.util.ArrayList;
import java.util.List;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;

import com.bcs.p3s.scrape.model.Form1200Record;
import com.bcs.p3s.scrape.model.SearchReports;

public class ReadSearchReports extends DigesterElements{
	
	private String temp;
	private Form1200Record form1200;
	private List<SearchReports> allSearchReports;
	private SearchReports searchReport;
	
	private Boolean isSearchReports = false;
	
	
	public ReadSearchReports(Form1200Record form1200) {
		super();
		
		this.form1200 = form1200;
		
	}


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
		if (qName.equalsIgnoreCase("reg:search-report-information")) {
			isSearchReports = true;
			searchReport = new SearchReports();
			searchReport.setOffice(attributes.getValue("office"));
			searchReport.setSearchType(attributes.getValue("search-type"));
			if(allSearchReports == null)
				allSearchReports = new ArrayList<SearchReports>();
		}
		
	}

	/*
	* When the parser encounters the end of an element, it calls this method
	*/
	public void endElement(String uri, String localName, String qName)
	    throws SAXException {
	
		if(isSearchReports){
	
			if(qName.equals("reg:search-report-information")){
				isSearchReports = false;
				allSearchReports.add(searchReport);
			}
			if(qName.equals("reg:date"))
				searchReport.setDate(temp);
		}
		
		form1200.setAllSearchReports(allSearchReports);
		
	}


}
