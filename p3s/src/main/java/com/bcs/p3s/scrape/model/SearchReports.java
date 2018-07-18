package com.bcs.p3s.scrape.model;

/**
 * This class holds the search report details
 * Form1200 via PatentPlace can be done only if a search report being published on EP
 * @author MerinP
 *
 */

public class SearchReports {
	
	private String searchType;
	private String office;
	private String date;
	
	public String getSearchType() {
		return searchType;
	}
	public void setSearchType(String searchType) {
		this.searchType = searchType;
	}
	public String getOffice() {
		return office;
	}
	public void setOffice(String office) {
		this.office = office;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	
	

}
