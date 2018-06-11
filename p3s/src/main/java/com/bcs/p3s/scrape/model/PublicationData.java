package com.bcs.p3s.scrape.model;
 

public class PublicationData {
	
	private String countryCode;
	private String publicationNumber;
	private String publishedDate;
	private String publishedLang;
	
	
	public PublicationData() {
		super();
	}

	public PublicationData(String countryCode, String publicationNumber, String publishedDate, String publishedLang) {
		super();
		this.countryCode = countryCode;
		this.publicationNumber = publicationNumber;
		this.publishedDate = publishedDate;
		this.publishedLang = publishedLang;
	}

	public String getCountryCode() {
		return countryCode;
	}

	public void setCountryCode(String countryCode) {
		this.countryCode = countryCode;
	}

	public String getPublicationNumber() {
		return publicationNumber;
	}

	public void setPublicationNumber(String publicationNumber) {
		this.publicationNumber = publicationNumber;
	}

	public String getPublishedDate() {
		return publishedDate;
	}

	public void setPublishedDate(String publishedDate) {
		this.publishedDate = publishedDate;
	}

	public String getPublishedLang() {
		return publishedLang;
	}

	public void setPublishedLang(String publishedLang) {
		this.publishedLang = publishedLang;
	}
	

}
