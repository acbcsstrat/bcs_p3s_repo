package com.bcs.p3s.display.form1200;

import com.bcs.p3s.util.lang.P3SRuntimeException;

public class PageDescriptionUI {

	/**
	 * Holds 'first' and 'last' pagenumbers of a particular section.
	 * Numbers are checked to be valid ints prior to accepting
	 */
	protected PageDescriptionEnum	type;
	protected String typeStart;
	protected String typeEnd;

	
	
	public PageDescriptionUI(PageDescriptionEnum typ, String start, String end) {
		setType(typ);
		setTypeStart(start);
		setTypeEnd(end);	
		checkSane();
	}
	
	
	
	
	
	// methods
	public int checkInt(String num) {
		int ii = new Integer(num); // Throws NumberFormatException if invalid number
		return ii;
	}
	public void checkSane() {
		// Check end page is >= start page, & both >0
		int start =  checkInt(typeStart);
		int end   =  checkInt(typeEnd);
		if (start<0 || end<start) throw new P3SRuntimeException("PageDescriptionUI passed invalid page-number-pair : "+start+", "+end);
	}
	
	
	
	public int numberOfPages() {
		int numPages = checkInt(typeEnd) - checkInt(typeStart) + 1;
		return numPages;
	}
	
	
	
	// Ordinary getters & setters
	public PageDescriptionEnum getType() {
		return type;
	}
	public String getTypeStart() {
		return typeStart;
	}
	public String getTypeEnd() {
		return typeEnd;
	}
	public void setType(PageDescriptionEnum type) {
		this.type = type;
	}
	public void setTypeStart(String typeStart) {
		checkInt(typeStart);
		this.typeStart = typeStart;
	}
	public void setTypeEnd(String typeEnd) {
		checkInt(typeEnd);
		this.typeEnd = typeEnd;
	}
}
