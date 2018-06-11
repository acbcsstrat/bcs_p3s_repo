package com.bcs.p3s.scrape.model;

public class Inventors {
	
	private String inventorName;
	
	private String inventorAddress1;
	private String inventorAddress2;
	private String country;
	
	
	public Inventors() {
		super();
	}

	public Inventors(String inventorName, String inventorAddress1, String inventorAddress2, String country) {
		super();
		this.inventorName = inventorName;
		this.inventorAddress1 = inventorAddress1;
		this.inventorAddress2 = inventorAddress2;
		this.country = country;
	}
	

	public String getInventorName() {
		return inventorName;
	}

	public void setInventorName(String inventorName) {
		this.inventorName = inventorName;
	}

	public String getInventorAddress1() {
		return inventorAddress1;
	}

	public void setInventorAddress1(String inventorAddress1) {
		this.inventorAddress1 = inventorAddress1;
	}

	public String getInventorAddress2() {
		return inventorAddress2;
	}

	public void setInventorAddress2(String inventorAddress2) {
		this.inventorAddress2 = inventorAddress2;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}
	
	
	

}
