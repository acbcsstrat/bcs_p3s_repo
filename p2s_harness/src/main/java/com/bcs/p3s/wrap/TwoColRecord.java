package com.bcs.p3s.wrap;

/**
 * A Class (Row?) containing two fields.
 * For use, as required
 */
public class TwoColRecord {

	String field1 = "";
	String field2 = "";

	public TwoColRecord(String field1, String field2) {
		this.field1 = field1;
		this.field2 = field2;
	}
	
	// Regular Getters & Setters 

	public String getField1() {
		return field1;
	}
	public void setField1(String field1) {
		this.field1 = field1;
	}
	public String getField2() {
		return field2;
	}
	public void setField2(String field2) {
		this.field2 = field2;
	}

	
}
