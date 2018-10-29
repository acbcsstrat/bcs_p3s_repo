package com.bcs.p3s.service;

import java.util.List;

import javax.servlet.http.HttpSession;

import com.bcs.p3s.display.PatentV2UI;
import com.bcs.p3s.display.form1200.ExtensionStateUI;
import com.bcs.p3s.display.form1200.PageDescriptionUI;
import com.bcs.p3s.display.form1200.StartForm1200Api21UI;
import com.bcs.p3s.display.form1200.ValidationStateUI;
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
	
	
	/**
	 * Convenience method to populate whatever PatentV2UI fields are possible,
	 * for a given PatentV2UI
	 * @param patentV2UI The existing PatentV2UI
	 * @param session Intend this to become redundant post v2.1 (once replace the v1 calc EVERYTHING on login) 
	 */
	public void populatePatentInfo(PatentV2UI patentV2UI, HttpSession session);


	/**
	 * A much simpler variant of populatePatentInfo
	 * This purely calculates Patent epct status values. Used for persistence, not *UI
	 * @param patent
	 */
	public void calcEpctStatuss(Patent patent);

	
	/**
	 * User has entered the Form1200 questions, & chosen to SAVE the E-PCT application, & thus generate the E-PCT review PDF
	 * @param patentId
	 * @param clientRef
	 * @param totalClaims
	 * @param isYear3RenewalPaying
	 * @param totalPages
	 * @param extensionStatesUI
	 * @param validationStatesUI
	 * @param pageDescriptionUI
	 */
	public void saveNewForm1200details(long  patentId, String clientRef, long totalClaims, boolean isYear3RenewalPaying, long totalPages, 
			List<ExtensionStateUI> extensionStatesUI, List<ValidationStateUI> validationStatesUI, List<PageDescriptionUI> pageDescriptionUI);

	
}
