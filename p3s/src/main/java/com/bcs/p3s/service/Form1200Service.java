package com.bcs.p3s.service;

import com.bcs.p3s.display.form1200.StartForm1200Api21UI;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.scrape.model.Form1200Record;

public interface Form1200Service {

	public StartForm1200Api21UI getForm1200QuestionData(long patentID);

	/**
	 * EPO scrape(s) have yielded data for this patent in two objects.
	 * Combine that data into the former
	 * @param patent A Patent instance
	 * @param form1200 A Form1200Record instance
	 */
	public void combineEpoPatentDetails(Patent patent, Form1200Record form1200);

}
