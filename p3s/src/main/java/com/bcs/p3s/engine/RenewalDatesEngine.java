package com.bcs.p3s.engine;

import java.io.PrintWriter;
import java.io.StringWriter;

/**
 * This engine calculates current Patent Year and respective start and end dates of Renewal Window
 * Also Calculates the next Patent Year Renewal window start and end dates
 * POJO used is RenewalDates
 */

import java.util.Calendar;
import java.util.Date;

import javax.persistence.TypedQuery;

import com.bcs.p3s.display.RenewalDates;
import com.bcs.p3s.model.CalendarColour;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.util.date.DateUtil;
import com.bcs.p3s.util.lang.Universal;

public class RenewalDatesEngine extends Universal{
	
	protected String PREFIX = this.getClass().getName() + " : "; 
	
	public RenewalDates getRenewalDates(Patent patent){
		
		RenewalDates allDates = new RenewalDates();
		try{
			
			String msg = PREFIX + "getRenewalDates(" +patent.getId() +")"; 
			
			log().debug(msg +" invoked for patent  [" + patent.getEP_ApplicationNumber() + "]");
			
			
			/** Call to PatentStatusEngine to get the current window dates **/
	
			/**
			 * STEP 1 : Calculate the actual renewal due date [FOR THE CURRENT YEAR - THIS CALCULATED YEAR MAY OR MAY NOT BE THE CURRENT RENEWAL YEAR]
			 */
				
				/** 
				 * STEP 1.1 :- Calculating current year's Renewal Due Date - get the last day of the month containing the anniversary of the filing Date
				 * 
				 */
				
				Calendar calendar = Calendar.getInstance();
				calendar.setTime(patent.getInternationalFilingDate());
				
				Calendar monthEndFilingDate = Calendar.getInstance();
				
		        /**
		         * STEP 1.2 :- generate the date for this year with the last day of month of filing patent
		         * 
		         */
				
		        int filing_month = calendar.get(Calendar.MONTH);
		        int filing_year = calendar.get(Calendar.YEAR);
		        int yearNow = Calendar.getInstance().get(Calendar.YEAR);
		        int filing_day = calendar.get(Calendar.DAY_OF_MONTH);
		        
		        //MP06032018 Changes made to compromise Daylight Saving
		        //monthEndFilingDate.set(filing_year, filing_month, filing_day , 23,59,59);
		        monthEndFilingDate.set(filing_year, filing_month, filing_day , 22,59,59);
		        Calendar nextRenewalDate = Calendar.getInstance();
		        //MP06032018 Changes made to compromise Daylight Saving
		        //nextRenewalDate.set(yearNow, filing_month, filing_day , 23,59,59);  
		        nextRenewalDate.set(yearNow, filing_month, filing_day , 22,59,59);  
		        Calendar actualCurrentRenewalDate = new DateUtil().getLastDayOfMonth(nextRenewalDate.getTime());
		        log().debug("Calculated renewal due for this year"+ actualCurrentRenewalDate.getTime());
		        
		        /**
		         * STEP 1.3 :-Get the boundary dates for the above filing due date - 3 months prior and 6 months after
		         */
		        
		        /**
	        	 * Commenting below as getting boundary dates from database table calendar_colour
	        	 */
//		        Calendar renewalStart = Calendar.getInstance();
//		        renewalStart.setTime(actualCurrentRenewalDate.getTime());
//		        renewalStart.add(Calendar.MONTH, -3);
//		        renewalStart.setTime(new DateUtil().getMidnight(renewalStart.getTime()));
//		        
//		        Calendar renewalEnd = Calendar.getInstance();
//		        renewalEnd.setTime(actualCurrentRenewalDate.getTime());
//		        System.out.println("Actual Due Date again" +actualCurrentRenewalDate.getTime());
//		        renewalEnd.add(Calendar.MONTH, 6);
//		        /** P3S WIndow close date is 2 days before the actual closing date **/
//		        renewalEnd.add(Calendar.DATE, -2);
		        
		        
		      //NEW CODE STARTS TO GET THE DATES FROM DATABASE TABLE calendar_colour
		        Calendar renewalStart = Calendar.getInstance();
		        Calendar renewalEnd = Calendar.getInstance();
	        	CalendarColour colourDates = new CalendarColour();
	        	TypedQuery<CalendarColour> allColourDates = CalendarColour.findCalendarColoursByRenewalDueDate(actualCurrentRenewalDate.getTime());
	        	if(allColourDates.getResultList().size() == 0){
	        		log().debug("No data available for renewal due date " + actualCurrentRenewalDate.getTime() + " in calendar_colour table A");
	        		logInternalError().debug("No data available for renewal due date " + actualCurrentRenewalDate.getTime() + " in calendar_colour table B");
	        		return null;
	        		
	        	}
	        	colourDates = allColourDates.getSingleResult();
	        	//colourDates = new CalendarColourJDBC().findCalendarColoursByRenewalDueDate(actualCurrentRenewalDate.getTime());
	        	if(colourDates == null){
	        		log().debug("No data available for renewal due date " + actualCurrentRenewalDate.getTime() + " in calendar_colour table C");
	        		logInternalError().debug("No data available for renewal due date " + actualCurrentRenewalDate.getTime() + " in calendar_colour table D");
	        		return null;
	        	}
	        	renewalStart.setTime(colourDates.getGreenStart());
	        	renewalEnd.setTime(colourDates.getBlackAllEnd());
		        log().debug("Calculated Window for this year are " + renewalStart.getTime() +" and " + renewalEnd.getTime());
		        /*Calendar tempRenYearStart = Calendar.getInstance();
		        tempRenYearStart.setTime(actualCurrentRenewalDate.getTime());
		        tempRenYearStart.add(Calendar.MONTH, -6);    //due date - 6 months or renewalStart -6
		        tempRenYearStart.setTime(new DateUtil().getMidnight(renewalStart.getTime()));*/
				
		      /**
		       * STEP 1.4 :- Get the current renewal year
		       */
		       
				/** STEP 1.4.1 - GET THE YEARS BETWEEN (Calculated renewal due for this year) AND (last day of month of filing patent) **/
		        /**
		         * If not overnight process, get the renewal year from database
		         */
		        
		        int yearsBetween = new DateUtil().getYearsBetweenDates(new DateUtil().getTodaysDate(), monthEndFilingDate.getTime());
		        int renewalYear = yearsBetween + 1;
		        
		        Date todays = new DateUtil().getTodaysDate();
		        
		        /**
		         * DIFFERENT SITUATION :: IF RENEWAL YEAR < 3 
		         */
		        if(renewalYear < 3){
		        	
		        	log().debug("Current renewal year < 3.");
		        	Calendar cal = Calendar.getInstance();
		        	cal.setTime(patent.getInternationalFilingDate());
		        	yearNow = cal.get(Calendar.YEAR);
		        	int year3Renewal = yearNow + 2;
		        	Calendar year3RenDue = Calendar.getInstance();
		        	//MP06032018 Changes made to compromise Daylight Saving
		        	//year3RenDue.set(year3Renewal, filing_month, filing_day , 23,59,59);
		        	year3RenDue.set(year3Renewal, filing_month, filing_day , 22,59,59);
		        	
		        	Calendar actualYear3RenDue = new DateUtil().getLastDayOfMonth(year3RenDue.getTime());
		        	
		        	log().debug("Year 3 Renewal due date will be " + actualYear3RenDue.getTime());
		        	colourDates = new CalendarColour();
		        	allColourDates = CalendarColour.findCalendarColoursByRenewalDueDate(actualYear3RenDue.getTime());
		        	if(allColourDates.getResultList().size() == 0) {
		        		// CalendarColour doesn't go this far into the future. Not an issue unless date is within 3 months. Hence:
		        		long daysInFuture = (actualYear3RenDue.getTimeInMillis() - Calendar.getInstance().getTimeInMillis()) / (1000*60*60*24);
		        		if (daysInFuture>93) {
			        		log().debug("No CalendarColour data for renewal due date " + actualYear3RenDue.getTime() 
			        			+ " but is ok. Is way over 3months in future W ");
		        		}
		        		else {
			        		log().debug("No data available for renewal due date " + actualYear3RenDue.getTime() + " in calendar_colour table E ");
			        		logInternalError().debug("No data available for renewal due date " + actualYear3RenDue.getTime() + " in calendar_colour table F ");
		        		}
		        		allDates.setRenewalYear(renewalYear);
		        		allDates.setCurrentRenewalDueDate(actualYear3RenDue.getTime());
		        		return allDates;
		        		
		        		
		        	}
		        	colourDates = allColourDates.getSingleResult();
		        	//colourDates = new CalendarColourJDBC().findCalendarColoursByRenewalDueDate(actualCurrentRenewalDate.getTime());
		        	
		        	if(colourDates == null){
		        		log().debug("No data available for renewal due date " + actualYear3RenDue.getTime() + " in calendar_colour table G");
		        		logInternalError().debug("No data available for renewal due date " + actualYear3RenDue.getTime() + " in calendar_colour table H");
		        		allDates.setRenewalYear(renewalYear);
		        		allDates.setCurrentRenewalDueDate(actualYear3RenDue.getTime());
		        		return allDates;
		        	}
		        	renewalStart.setTime(colourDates.getGreenStart());
		        	renewalEnd.setTime(colourDates.getBlackAllEnd());
			        
		        	log().debug("Patent year 3 starts on " + actualYear3RenDue.getTime() + " and window opens on " + renewalStart.getTime());
		        	
		        	
		        	if(todays.after(renewalStart.getTime()) || todays.equals(renewalStart.getTime())){
		        		log().debug("Renewal window opened for PATENT YEAR 3");
		        		renewalYear = 3;
		        		allDates.setRenewalWindowOpened(true);
		        		allDates.setCurrentRenewalDueDate(actualYear3RenDue.getTime());
			        	allDates.setCurrentWindowOpenDate(renewalStart.getTime());
			        	allDates.setCurrentWindowCloseDate(renewalEnd.getTime());
			        	
			        	allDates.setRenewalYear(renewalYear);
			        	
			        	renewalStart.setTime(colourDates.getGreenStart());
			        	renewalEnd.setTime(colourDates.getBlackAllEnd());
				        
			        	allDates.setNextRenewalDueDate(actualYear3RenDue.getTime());
			        	allDates.setNextWindowOpenDate(renewalStart.getTime());
			        	allDates.setNextWindowCloseDate(renewalEnd.getTime());
			        	
			        	log().debug("CURRENT Renewal Year for patent [" + patent.getEP_ApplicationNumber() +"] is " + allDates.getRenewalYear());
				        log().debug("CURRENT renewal due for patent [" + patent.getEP_ApplicationNumber() + "] : " + allDates.getCurrentRenewalDueDate());
			    	    log().debug("CURRENT renewal window starts on "+ allDates.getCurrentWindowOpenDate() + " and ends on " + allDates.getCurrentWindowCloseDate());
			    	    
			    		//log().debug("NEXT renewal due for patent [" + patent.getPatentApplicationNumber() + "] : " + allDates.getNextRenewalDueDate());
			        	
				        //allDates.setCurrentColorDates(getAllColorDates(allDates));
		        	}
		        	
		        	else{
		        		log().debug("Renewal window not yet opened for PATENT YEAR 3");
		        		allDates.setRenewalWindowOpened(false);
		        		allDates.setRenewalYear(renewalYear);
		        		log().debug("Renewal year is less than 3. So renewal window remain closed until PATENT YEAR 3" );
		        		
		        		/**
		        		 * In this case we can set the current and next Due Date as same. As no Renewal due date before that
		        		 */
		        		allDates.setCurrentRenewalDueDate(actualYear3RenDue.getTime());
			    		allDates.setCurrentWindowOpenDate(renewalStart.getTime());
			    		allDates.setCurrentWindowCloseDate(renewalEnd.getTime());
			    		
		        		allDates.setNextRenewalDueDate(actualYear3RenDue.getTime());
			        	allDates.setNextWindowOpenDate(renewalStart.getTime());
			        	allDates.setNextWindowCloseDate(renewalEnd.getTime());
			        	
			        	log().debug("CURRENT Renewal Year for patent [" + patent.getEP_ApplicationNumber() +"] is " + allDates.getRenewalYear());
			    	    
			    		//log().debug("NEXT renewal due for patent [" + patent.getPatentApplicationNumber() + "] : " + allDates.getNextRenewalDueDate());
			    		//log().debug("NEXT renewal window starts on "+ allDates.getNextWindowOpenDate() + " and ends on " +  allDates.getNextWindowCloseDate());
		        	}
		        	
		    		return allDates;
		        	
		        }
		        
		        
		        /** STEP 1.4.2 - CHECK THE POSITION OF TODAYS DATE IN RENEWAL WINDOW  
		         * 					
		         * 				1. If todays date before tempRenYearStart, we are still in last years window
		         * 						renewal year = renewal year - 1
		         * 						Calculate window open and close for last year as set to allDates
		         * 
		         * 				2. If todays date after tempRenYearStart, we are in current years window
		         * 						renewal year = renewal year
		         * 						
		         * **/
		        
		     /************************************************************************************************************************************************/   
		        /*** NOTE : ASSUMING RENEWAL YEAR STARTS ON RENEWAL WINDOW START DATE AND ENDS ON THE DAY WHEN THE RENEWAL WINDOW FOR NEXT YEAR OPENS  **/
		     /************************************************************************************************************************************************/
		        
		        if(todays.before(renewalStart.getTime())){
		        	log().debug("Patent is in last year's renewal window.");
		        	
		        	renewalYear = renewalYear-1;
		        	if(renewalYear < 3){
		        		log().debug("Patent will be in Year 3 Renewal on " + actualCurrentRenewalDate.getTime());
		        		log().debug("Renewal window not yet opened for PATENT YEAR 3");
		        		allDates.setRenewalWindowOpened(false);
		        		allDates.setRenewalYear(renewalYear);
		        		log().debug("Renewal year is less than 3. So renewal window remain closed until PATENT YEAR 3" );
		        		
		        		/**
		        		 * In this case we can set the current and next Due Date as same. As no Renewal due date before that
		        		 */
		        		allDates.setCurrentRenewalDueDate(actualCurrentRenewalDate.getTime());
			    		allDates.setCurrentWindowOpenDate(renewalStart.getTime());
			    		allDates.setCurrentWindowCloseDate(renewalEnd.getTime());
			    		
		        		allDates.setNextRenewalDueDate(actualCurrentRenewalDate.getTime());
			        	allDates.setNextWindowOpenDate(renewalStart.getTime());
			        	allDates.setNextWindowCloseDate(renewalEnd.getTime());
			        	
			        	log().debug("CURRENT Renewal Year for patent [" + patent.getEP_ApplicationNumber() +"] is " + allDates.getRenewalYear());
			        	
			        	return allDates;
		        	}
		        	
		        	//SET THE CURRENT TO DATES TO NEXT WINDOW DATES
		        	
		        	allDates.setNextRenewalDueDate(actualCurrentRenewalDate.getTime());
		        	allDates.setNextWindowOpenDate(renewalStart.getTime());
		        	allDates.setNextWindowCloseDate(renewalEnd.getTime());
		        	
		        	//Calculating Previous year details in the same way
		            
		            Calendar prevRenewalDate = Calendar.getInstance();
		            //MP06032018 Changes made to compromise Daylight Saving
		    	    //prevRenewalDate.set(yearNow-1, filing_month, filing_day , 23,59,59);  
		    	    prevRenewalDate.set(yearNow-1, filing_month, filing_day , 22,59,59);  
		    	    
		    	    Calendar actualPrevRenewalDate = new DateUtil().getLastDayOfMonth(prevRenewalDate.getTime());
		    	    
		    	    log().debug("Renewal Due for last year :: " + actualPrevRenewalDate.getTime());
		    	    
		        	colourDates = new CalendarColour();
		        	allColourDates = CalendarColour.findCalendarColoursByRenewalDueDate(actualPrevRenewalDate.getTime());
		        	if(allColourDates.getResultList().size() == 0){
		        		log().debug("No data available for renewal due date " + actualPrevRenewalDate.getTime() + " in calendar_colour table I");
		        		logInternalError().debug("No data available for renewal due date " + actualPrevRenewalDate.getTime() + " in calendar_colour table J");
		        		//allDates.setRenewalYear(renewalYear);
		        		return null;
		        		
		        	}
		        	colourDates = allColourDates.getSingleResult();
		    	   // colourDates = new CalendarColourJDBC().findCalendarColoursByRenewalDueDate(actualCurrentRenewalDate.getTime());
		        	
		        	if(colourDates == null){
		        		log().debug("No data available for renewal due date " + actualPrevRenewalDate.getTime() + " in calendar_colour table K");
		        		logInternalError().debug("No data available for renewal due date " + actualPrevRenewalDate.getTime() + " in calendar_colour table L");
		        		return null;
		        	}
		        	
		        	renewalStart.setTime(colourDates.getGreenStart());
		        	renewalEnd.setTime(colourDates.getBlackAllEnd());
		        	
		    	    
		    	    /** P3S WIndow close date is 2 days before the actual closing date **/  
		        	//below not needed anymore. Logic changed 27/11/2017
		            //renewalEnd.add(Calendar.DATE, -2);
		    	    
		    	    allDates.setCurrentRenewalDueDate(actualPrevRenewalDate.getTime());
		    		allDates.setCurrentWindowOpenDate(renewalStart.getTime());
		    		allDates.setCurrentWindowCloseDate(renewalEnd.getTime());
		    		
		        }
		        
		        else{
		        	
		        	log().debug("Patent is in current year's renewal window");
		        	allDates.setCurrentRenewalDueDate(actualCurrentRenewalDate.getTime());
		    		allDates.setCurrentWindowOpenDate(renewalStart.getTime());
		    		allDates.setCurrentWindowCloseDate(renewalEnd.getTime());
		    		
		    		//Calculating next years date as above
		    		
		    		Calendar otherRenewalDate = Calendar.getInstance();
		    		//MP06032018 Changes made to compromise Daylight Saving
		    	    //otherRenewalDate.set(yearNow+1, filing_month, filing_day , 23,59,59);  
		    		otherRenewalDate.set(yearNow+1, filing_month, filing_day , 22,59,59);  
		    	    System.out.println("Renewal date 1 year after " + otherRenewalDate.getTime());
		    	    Calendar actualNextRenewalDate = new DateUtil().getLastDayOfMonth(otherRenewalDate.getTime());
		    	    System.out.println("Next year renewal due "+ actualNextRenewalDate.getTime());
		    	    
		    	    
		    	    
		    	    log().debug("Next year's renewal due is "+ actualNextRenewalDate.getTime());
		    	    //NEW CODE STARTS TO GET THE DATES FROM DATABASE TABLE calendar_colour
		        	colourDates = new CalendarColour();
		        	allColourDates = CalendarColour.findCalendarColoursByRenewalDueDate(actualNextRenewalDate.getTime());
		        	if(allColourDates.getResultList().size() == 0){
		        		log().debug("No data available for renewal due date " + actualNextRenewalDate.getTime() + " in calendar_colour table M");
		        		logInternalError().debug("No data available for renewal due date " + actualNextRenewalDate.getTime() + " in calendar_colour table N");
		        		allDates.setRenewalYear(renewalYear);
		        		log().debug("Patent is in Year "+ allDates.getRenewalYear() +" renewal period");
		        		return allDates;
		        		
		        	}
		        	colourDates = allColourDates.getSingleResult();
		        	
		        	//colourDates = new CalendarColourJDBC().findCalendarColoursByRenewalDueDate(actualCurrentRenewalDate.getTime());
		        	if(colourDates == null){
		        		log().debug("No data available for renewal due date " + actualNextRenewalDate.getTime() + " in calendar_colour table O");
		        		logInternalError().debug("No data available for renewal due date " + actualNextRenewalDate.getTime() + " in calendar_colour table P");
		        		allDates.setRenewalYear(renewalYear);
		        		log().debug("Patent is in Year "+ allDates.getRenewalYear() +" renewal period");
		        		return allDates;
		        	}
		        	
		        	renewalStart.setTime(colourDates.getGreenStart());
		        	renewalEnd.setTime(colourDates.getBlackAllEnd());
		    	    
		    	    /** P3S WIndow close date is 2 days before the actual closing date **/
		        	//below not needed anymore. Logic changed 27/11/2017
		            //renewalEnd.add(Calendar.DATE, -2);
		    	    System.out.println("Doldrums for previous year are " + renewalStart.getTime() +" and " + renewalEnd.getTime());
		    	    
		    	    allDates.setNextRenewalDueDate(actualNextRenewalDate.getTime());
		        	allDates.setNextWindowOpenDate(renewalStart.getTime());
		        	allDates.setNextWindowCloseDate(renewalEnd.getTime());
		        	
		    	    if(todays.after(renewalStart.getTime()) || todays.equals(renewalStart.getTime())){
		    	    	
		    	    	yearNow = yearNow + 1;
		    	    	log().debug("Renewal window being OPENED for next year " + yearNow + ".So increment renewalyear to plus 1");
		    	    	renewalYear = renewalYear + 1;
		    	    	allDates.setCurrentRenewalDueDate(actualNextRenewalDate.getTime());
			    		allDates.setCurrentWindowOpenDate(renewalStart.getTime());
			    		allDates.setCurrentWindowCloseDate(renewalEnd.getTime());
			    		
		    	    }
		    	    
		        }
		        
		        allDates.setRenewalYear(renewalYear);
		        log().debug("Patent is in Year "+ allDates.getRenewalYear() +" renewal period");
		        
		        log().debug("CURRENT Renewal Year for patent [" + patent.getEP_ApplicationNumber() +"] is " + allDates.getRenewalYear());
		        log().debug("CURRENT renewal due for patent [" + patent.getEP_ApplicationNumber() + "] : " + allDates.getCurrentRenewalDueDate());
	    	    log().debug("CURRENT renewal window starts on "+ allDates.getCurrentWindowOpenDate() + " and ends on " + allDates.getCurrentWindowCloseDate());
	    	    
	    		log().debug("NEXT renewal due for patent [" + patent.getEP_ApplicationNumber() + "] : " + allDates.getNextRenewalDueDate());
	    		log().debug("NEXT renewal window starts on "+ allDates.getNextWindowOpenDate() + " and ends on " +  allDates.getNextWindowCloseDate());
	    		
	    		//allDates.setCurrentColorDates(getAllColorDates(allDates));
			
	    		
		}
		catch(Exception e){
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Stacktrace was: "+errors.toString());
		}
		
		return allDates;
	}
	

}
