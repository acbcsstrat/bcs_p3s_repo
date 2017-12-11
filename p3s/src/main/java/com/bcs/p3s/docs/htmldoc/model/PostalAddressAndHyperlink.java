package com.bcs.p3s.docs.htmldoc.model;

public class PostalAddressAndHyperlink {

	protected String personName;	// Not shown for PatentPlace
	protected String organisation;
	protected String addressStreet;
	protected String addressCity;
	protected String addressUsaState;
	protected String zipcode;
	protected String country;	// Only used if not USA
	protected String hyperlink;
	

	
	PostalAddressAndHyperlink(String personName, String organisation, String addressStreet, String addressCity
				, String addressUsaState, String zipcode, String hyperlink) 
	{
		this.personName = personName;
		this.organisation = organisation;
		this.addressStreet = addressStreet;
		this.addressCity = addressCity;
		this.addressUsaState = addressUsaState;
		this.zipcode = zipcode;
		this.hyperlink = hyperlink;
	}
	
	
	// Default constructor is for PatentPlace details
	PostalAddressAndHyperlink() {
		this.personName = null;
		this.organisation = "Patent Place";
		this.addressStreet = "25 Meer Street";
		this.addressCity = "Stratford-upon-Avon";
		this.addressUsaState = "Warwickshire";
		this.zipcode = "CV36 6QB";
		this.country = "United Kingdom";
		this.hyperlink = getOurUrl();
	}
	
	
	
	// Getters
	public String getPersonName() {
		return personName;
	}
	public String getOrganisation() {
		return organisation;
	}
	public String getAddressStreet() {
		return addressStreet;
	}
	public String getAddressCity() {
		return addressCity;
	}
	public String getAddressUsaState() {
		return addressUsaState;
	}
	public String getZipcode() {
		return zipcode;
	}
	public String getCountry() {
		return country;
	}
	public String getHyperlink() {
		return hyperlink;
	}

	
	
	

	protected String getOurUrl() {
		return "DummyTODO"; // acToDo - from property file
	}
}
