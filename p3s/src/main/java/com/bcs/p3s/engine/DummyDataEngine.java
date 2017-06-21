package com.bcs.p3s.engine;

import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.model.Patent;

/**
 * ALL dummy / Hardcoded data is generated here
 * Why? - This way can ensure, in days/weeks to come, that we have eradicated all dummy Data from the code.
 * 
 * @author andyc
 *
 */
public class DummyDataEngine {

	public final String WITHHELD = "NOT PROVIDED";
	
	
	public DummyDataEngine() {
		System.out.println("                     Reminder: Still using DummyDataEngine");
	}
	
	public void populateExtendedPatentFieldsWithDummyData(PatentUI patentUI, Patent patent) {
		//System.out.println("                     DummyDataEngine:populateExtendedPatentFieldsWithDummyData() invoked");
		
		// Those inherited fields NOT required - identify as such
		// by setting safe (where possible) but obviously Dummy, values

		// Now the additional fields
		patentUI.setCurrentRenewalCost(new BigDecimal("1.11"));
		patentUI.setCostBandEndDate(nowPlusNdays(2));
		patentUI.setRenewalCostNextStage(new BigDecimal("1111111.11"));
		patentUI.setRenewalDueDate(dummyFilingDateToThisyearRenewDueDate(patentUI.getFilingDate()));

	}
	
	
	
    // Reminder: Dummy* as this method doesn't make sense for live use.	
	public Date dummyFilingDateToThisyearRenewDueDate(Date fd) {
		Calendar c = Calendar.getInstance();
		int thisyear = c.get(Calendar.YEAR);
		c.setTime(fd);
		c.set(Calendar.YEAR, thisyear);
		//System.out.println("                     MID MID DummyDataEngine:filingDateToFutureRenewDueDate("+fd.toString()+") returns "+c.getTime().toString());
		Date result = this.lastDayofGivenMonth(c);
		//System.out.println("                     DummyDataEngine:dummyFilingDateToThisyearRenewDueDate("+fd.toString()+") returns "+result.toString());
		return result;
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
	
}
