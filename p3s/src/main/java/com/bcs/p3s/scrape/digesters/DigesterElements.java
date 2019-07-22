package com.bcs.p3s.scrape.digesters;

import java.util.List;

import org.xml.sax.helpers.DefaultHandler;

public class DigesterElements extends DefaultHandler {
	
	private List digesters;

	public List getDigesters() {
		return digesters;
	}

	public void setDigesters(List digesters) {
		this.digesters = digesters;
	}
	

}
