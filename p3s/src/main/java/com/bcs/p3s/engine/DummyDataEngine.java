package com.bcs.p3s.engine;

import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Random;

import com.bcs.p3s.display.FxRateUI;
import com.bcs.p3s.util.lang.Universal;

/**
 * ALL dummy / Hardcoded data is generated here
 * Why? - This way can ensure, in days/weeks to come, that we have eradicated all dummy Data from the code.
 * 
 * @author andyc
 *
 */
public class DummyDataEngine extends Universal {

	

	public final String WITHHELD = "NOT PROVIDED";
	
	
	public DummyDataEngine() {
		System.out.println("                     Reminder: Still using DummyDataEngine");
	}
	
	/*public void populateExtendedPatentFieldsWithDummyData(PatentUI patentUI, Patent patent) {

		log().debug("DummyDataEngine populateExtendedPatentFieldsWithDummyData() invoked");

		//System.out.println("                     DummyDataEngine:populateExtendedPatentFieldsWithDummyData() invoked");
		
		// Those inherited fields NOT required - identify as such
		// by setting safe (where possible) but obviously Dummy, values

		// Now the additional fields
		patentUI.setCurrentRenewalCostUSD(new BigDecimal("1.11"));
		patentUI.setCostBandEndDate(nowPlusNdays(2));
		patentUI.setRenewalCostNextStageUSD(new BigDecimal("1111111.11"));
		patentUI.setRenewalDueDate(dummyFilingDateToThisyearRenewDueDate(patentUI.getFilingDate()));

	}*/
	

	public List<FxRateUI> makeDummyFxRateHistory(BigDecimal seedRate, Date endsBefore, int numdays) { 
		// Ends before is Todays timestamp. So generated list should stop 1 day before this
		
		final long DAY = 24 * 60 * 60 * 1000;
		
		log().debug("DummyDataEngine makeDummyFxRateHistory() invoked");

		List<FxRateUI> history = new ArrayList<FxRateUI>();

		// Generate dummy history
		BigDecimal inc = new BigDecimal(0.01); 
		BigDecimal gik = seedRate;
		BigDecimal formatted = null;
		long disTime = endsBefore.getTime();

		for (int ii = 1 ; ii <= numdays ; ii++) {

	    	gik = gik.add(inc);
	    	formatted = gik;
	    	formatted = formatted.setScale(4, BigDecimal.ROUND_CEILING);
	    	//System.out.println("formatted loop = "+formatted.toString());
	    	
	    	disTime -= DAY;
	    	Date dDay = new Date(disTime);
	    	FxRateUI dis = new FxRateUI(formatted, dDay);
	    	history.add(dis);
	    }

	    
	    // Now reverse the list order, to make it oldest-first
	    List<FxRateUI> shallowCopy = history.subList(0, history.size());
	    Collections.reverse(shallowCopy);
		
		return shallowCopy;
	}

	


	
//	public String gimmeAnyInvoiceUrl() {
//		return "hardcodedpdffolder/invoices/dummyInvoiceNumber1.pdf";
//	}
	
	public String gimmeEmptyPostPayWarningMessage() {
		return "Nut'n gone wrong yet ...";
	}
	

	

	public Date lastDayofGivenMonth(Calendar c) {
		c.set(Calendar.DAY_OF_MONTH, c.getActualMaximum(Calendar.DAY_OF_MONTH));    
		return c.getTime();
	}

//	public Date OBS_lastDayofThisMonth() {
//		Calendar c = Calendar.getInstance();    
//		c.set(Calendar.DAY_OF_MONTH, Calendar.getInstance().getActualMaximum(Calendar.DAY_OF_MONTH));    
//		return c.getTime();
//	}

	public Date nowPlusNdays(int n) {
		Calendar c = Calendar.getInstance();    
		c.add(Calendar.DATE, n);

		DateFormat dateFormat= new SimpleDateFormat("dd/MM/yyyy");
		System.out.println("                     DummyDataEngine:nowPlusNdays("+n+") returns "+dateFormat.format(c.getTime()));
		return c.getTime();
	}
	

	protected int random0to99() {
		Random rn = new Random();
		int randomNum = rn.nextInt(99);
		System.out.println("                     DummyDataEngine:random0to99(ac) returns "+randomNum);
		return randomNum;
	}
	
	

	/**
	 * Seems cannot have a DOT in a url?
	 * leasways, split, extracting on colon, turns 808.08 into 808.
	 * Workaround. replace dot with carat. This replaces any carats with dots 
	 */
	String caratToDotConvertor(String raw) {
		return raw.replace('^','.');
	}






//Start of TEMPORARY code - expect to be redundant after development complete 

	
	
public List<Long> gimmeTwoLongs() {
	List<Long> result = new ArrayList<Long>();
	result.add(new Long(1));
	result.add(new Long(2));
	return result;
}

public Date add48hours(Date start) {
	Calendar calendar = Calendar.getInstance();
	calendar.setTime(start);
	calendar.add(Calendar.HOUR, 48);
	return calendar.getTime();
}

	
//End of TEMPORARY code - expect to be redundant after development complete 


}
