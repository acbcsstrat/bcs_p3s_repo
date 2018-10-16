package com.bcs.p3s.service;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import org.springframework.stereotype.Service;

import com.bcs.p3s.display.form1200.StartForm1200Api21UI;
import com.bcs.p3s.engine.DummyForm1200Engine;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.scrape.model.Form1200Record;
import com.bcs.p3s.util.date.DateUtil;
import com.bcs.p3s.util.lang.P3SException;


@Service("Form1200Service")
public class Form1200ServiceImpl extends ServiceAuthorisationTools implements Form1200Service {

	protected String PREFIX = this.getClass().getName() + " : "; 

	@Override
	public StartForm1200Api21UI getForm1200QuestionData(long patentID) {

		String err = PREFIX+"getForm1200QuestionData("+patentID+") ";

		// NOT below yet - fails = as nno link to my business
//		checkForm1200isViable(patentID, err);
		// acTodo - this and ALL OTHER check* methods need review (re not throw exceptions, & how signal back to controller to return error)
		
		
		DummyForm1200Engine dummyEngine = new DummyForm1200Engine();
		StartForm1200Api21UI questionData = dummyEngine.getDummyForm1200QuestionData(patentID);
		
		return questionData;
	}


	@Override
	public void combineEpoPatentDetails(Patent patent, Form1200Record form1200) {
		if (patent==null || form1200==null) { patent=null; return; }
		
		// Use, check or ignore the form1200 fields
		try {
			Date dteDebug = null;
			String strDebug = null;

			checkStrSame(patent.getEP_ApplicationNumber(), form1200.getEP_AppNumber(), "EPappNum");
			// not readily comparable : applicants
			// not used : inventors 
			// not used : agents 
			checkDateStrSame(patent.getInternationalFilingDate(), form1200.getFilingDate(), "filingDate");
			dteDebug = new DateUtil().stringToDate( form1200.getPriorityDate() );
			 patent.setPriorityDate(dteDebug);
			patent.setInternationalFilingLang(form1200.getFilingLang());
			checkStrSame(patent.getEP_PublicationNumber(), form1200.getEP_PublicationNumber(), "EPpubNum");
			patent.setPCT_applicationNumber(form1200.getPCT_AppNumber());
			patent.setPCT_publicationNumber(form1200.getPCT_PublicationNumber());
			dteDebug = new DateUtil().stringToDate(form1200.getPublishedDate());
			 patent.setPCT_publishedDate(dteDebug);
			// not used : publishedLang. Used filingLang
			patent.setInternationalSearchAuthority(form1200.getAnyIsrEpElseFirst());
			strDebug = (form1200.getIpcCodes()==null) ? null : form1200.getIpcCodes().getIpcCodes();
			 checkStrSame(patent.getIpcCodes(), strDebug, "IPCcodes");
			checkStrSame(patent.getTitle(), form1200.getTitle(), "title");
			ArrayList<String> desigStates = form1200.getDesignatedContractingStates();
			 patent.setDesignated_states(arrayListToCommaSeparatedString(desigStates));
			// not used : claimsTxt 
			// not used : allClaims 
			// not used : abstractTxt 
		} catch (ParseException e) { logErrorAndContinue("Confidence check failed",e); }
	}

	
	
	
	
	
	// Start of internal methods
	
	/**
	 * A confidence check. If fails, don't prevent operation, but log
	 * @param str1 A string to check
	 * @param str2 Another string. Should be identical to the above
	 * @param logTitle A title for this specific test. Is logged. maybe null
	 */
	protected void checkStrSame(String str1, String str2, String logTitle) {
		try {
			if ( ! str1.trim().equalsIgnoreCase(str2.trim())) {
				throw new P3SException("str1!=str2");
			}
		} catch (P3SException | NullPointerException e) {
			logErrorAndContinue(CLASSNAME+" : Safety check FAILED. checkStrSame("+str1+", "+str2+", "+logTitle+")", e);
		}
	}
	protected void checkDateStrSame(Date date1, String str2, String logTitle) { // Assume yyyyMMdd
		try {
			DateFormat df = new SimpleDateFormat("yyyyMMdd"); 
			String str1 = df.format(date1);
			checkStrSame(str1, str2, logTitle);
		} catch (NullPointerException e) {
			logErrorAndContinue(CLASSNAME+" : Safety check FAILED. checkStrSame(Date, "+str2+", "+logTitle+")", e);
		}
	}
	protected String arrayListToCommaSeparatedString(ArrayList<String> strings) {
		if (strings==null) return null;
		if (strings.size()==0) return "";
		if (strings.size()==1) return strings.get(0);

		String grow = strings.get(0);
		for (int ii=1; ii<strings.size(); ii++) {
			grow += (","+strings.get(ii));
		}
		return grow;
	}

}
