package com.bcs.p3s.engine;

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
	RenewalDates allDates = new RenewalDates();
	
	public RenewalDates getRenewalDates(Patent patent){
		
		try{
			
			String msg = PREFIX + "getRenewalDates(" +patent.getId() +")"; 
			
			log().debug(msg +" invoked for patent  [" + patent.getPatentApplicationNumber() + "]");
			
			
			/** Call to PatentStatusEngine to get the current window dates **/
	
			/**
			 * STEP 1 : Calculate the actual renewal due date [FOR THE CURRENT YEAR - THIS CALCULATED YEAR MAY OR MAY NOT BE THE CURRENT RENEWAL YEAR]
			 */
				
				/** 
				 * STEP 1.1 :- Calculating the next Renewal Due Date - get the last day of the month containing the anniversary of the filing Date
				 * 
				 */
				
				Calendar calendar = Calendar.getInstance();
				calendar.setTime(patent.getFilingDate());
				
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
	        	colourDates = allColourDates.getSingleResult();
	        	if(colourDates == null){
	        		log().debug("No data available for renewal due date " + actualCurrentRenewalDate.getTime() + " in calendar_colour table");
	        		//any other logging
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
		         * DIFFERENT SITUATION :: IF RENEWAL YEAR < 3 OR RENEWAL YEAR > 20
		         */
		        if(renewalYear < 3){
		        	
		        	log().debug("Current renewal year < 3.");
		        	Calendar cal = Calendar.getInstance();
		        	cal.setTime(patent.getFilingDate());
		        	yearNow = cal.get(Calendar.YEAR);
		        	int year3Renewal = yearNow + 2;
		        	Calendar year3RenDue = Calendar.getInstance();
		        	//MP06032018 Changes made to compromise Daylight Saving
		        	//year3RenDue.set(year3Renewal, filing_month, filing_day , 23,59,59);
		        	year3RenDue.set(year3Renewal, filing_month, filing_day , 22,59,59);
		        	
		        	Calendar actualYear3RenDue = new DateUtil().getLastDayOfMonth(year3RenDue.getTime());
		        	
		        	/**
		        	 * Commenting below as getting boundary dates from database table calendar_colour
		        	 */
		        	
		        	/*renewalStart = Calendar.getInstance();
			        renewalStart.setTime(actualYear3RenDue.getTime());
			        renewalStart.add(Calendar.MONTH, -3);
			        renewalStart.setTime(new DateUtil().getMidnight(renewalStart.getTime()));
			        
			        renewalEnd = Calendar.getInstance();
			        renewalEnd.setTime(actualYear3RenDue.getTime());
			        System.out.println("Patent year 3 Renewal Due is " +actualYear3RenDue.getTime());
			        renewalEnd.add(Calendar.MONTH, 6);
			        /** P3S WIndow close date is 2 days before the actual closing date **//*
			        renewalEnd.add(Calendar.DATE, -2);  */
		        	
		        	//NEW CODE STARTS TO GET THE DATES FROM DATABASE TABLE calendar_colour
		        	colourDates = new CalendarColour();
		        	allColourDates = CalendarColour.findCalendarColoursByRenewalDueDate(actualYear3RenDue.getTime());
		        	colourDates = allColourDates.getSingleResult();
		        	
		        	if(colourDates == null){
		        		log().debug("No data available for renewal due date " + actualYear3RenDue.getTime() + " in calendar_colour table");
		        		//any other logging
		        		return null;
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
			        	
			        	//next year's data in case Renewal fee being paid up
			        	Calendar year4RenewalDate = Calendar.getInstance();
			        	yearNow = cal.get(Calendar.YEAR);
			        	int year4Renewal = yearNow + 3;
			        	//MP06032018 Changes made to compromise Daylight Saving
			        	//year4RenewalDate.set(year4Renewal, filing_month, filing_day , 23,59,59);
			        	year4RenewalDate.set(year4Renewal, filing_month, filing_day , 22,59,59);
			        	
			        	Calendar actualYear4RenDue = new DateUtil().getLastDayOfMonth(year4RenewalDate.getTime());
			        	
			        	//NEW CODE STARTS TO GET THE DATES FROM DATABASE TABLE calendar_colour
			        	colourDates = new CalendarColour();
			        	allColourDates = CalendarColour.findCalendarColoursByRenewalDueDate(actualYear4RenDue.getTime());
			        	colourDates = allColourDates.getSingleResult();
			        	if(colourDates == null){
			        		log().debug("No data available for renewal due date " + actualYear3RenDue.getTime() + " in calendar_colour table");
			        		//any other logging
			        		return null;
			        	}
			        	
			        	renewalStart.setTime(colourDates.getGreenStart());
			        	renewalEnd.setTime(colourDates.getBlackAllEnd());
				        
			        	allDates.setNextRenewalDueDate(actualYear3RenDue.getTime());
			        	allDates.setNextWindowOpenDate(renewalStart.getTime());
			        	allDates.setNextWindowCloseDate(renewalEnd.getTime());
			        	
			        	log().debug("CURRENT Renewal Year for patent [" + patent.getPatentApplicationNumber() +"] is " + allDates.getRenewalYear());
				        log().debug("CURRENT renewal due for patent [" + patent.getPatentApplicationNumber() + "] : " + allDates.getCurrentRenewalDueDate());
			    	    log().debug("CURRENT renewal window starts on "+ allDates.getCurrentWindowOpenDate() + " and ends on " + allDates.getCurrentWindowCloseDate());
			    	    
			    		log().debug("NEXT renewal due for patent [" + patent.getPatentApplicationNumber() + "] : " + allDates.getNextRenewalDueDate());
			    		log().debug("NEXT renewal window starts on "+ allDates.getNextWindowOpenDate() + " and ends on " +  allDates.getNextWindowCloseDate());
			    		
			        	
				        System.out.println("Calculated Window for this year are " + renewalStart.getTime() +" and " + renewalEnd.getTime());
				        //allDates.setCurrentColorDates(getAllColorDates(allDates));
		        	}
		        	
		        	else{
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
			        	
			        	log().debug("CURRENT Renewal Year for patent [" + patent.getPatentApplicationNumber() +"] is " + allDates.getRenewalYear());
			    	    
			    		log().debug("NEXT renewal due for patent [" + patent.getPatentApplicationNumber() + "] : " + allDates.getNextRenewalDueDate());
			    		log().debug("NEXT renewal window starts on "+ allDates.getNextWindowOpenDate() + " and ends on " +  allDates.getNextWindowCloseDate());
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
		        	log().debug("Patent is in last years renewal window.");
		        	renewalYear = renewalYear-1;
		        	
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
		    	    
		    	    /*renewalStart = Calendar.getInstance();
		    	    renewalStart.setTime(actualPrevRenewalDate.getTime());
		    	    renewalStart.add(Calendar.MONTH, -3);
		    	    renewalStart.setTime(new DateUtil().getMidnight(renewalStart.getTime()));
		    	    
		    	    renewalEnd = Calendar.getInstance();
		    	    renewalEnd.setTime(actualPrevRenewalDate.getTime());
		    	    System.out.println("Actual Due Date again" +actualPrevRenewalDate.getTime());
		    	    renewalEnd.add(Calendar.MONTH, 6);*/
		    	    
		    	    //NEW CODE STARTS TO GET THE DATES FROM DATABASE TABLE calendar_colour
		        	colourDates = new CalendarColour();
		        	allColourDates = CalendarColour.findCalendarColoursByRenewalDueDate(actualPrevRenewalDate.getTime());
		        	colourDates = allColourDates.getSingleResult();
		        	
		        	if(colourDates == null){
		        		log().debug("No data available for renewal due date " + actualPrevRenewalDate.getTime() + " in calendar_colour table");
		        		//any other logging
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
		    	    
		    	    /*renewalStart = Calendar.getInstance();
		    	    renewalStart.setTime(actualNextRenewalDate.getTime());
		    	    renewalStart.add(Calendar.MONTH, -3);
		    	    renewalStart.setTime(new DateUtil().getMidnight(renewalStart.getTime()));
		    	    
		    	    renewalEnd = Calendar.getInstance();
		    	    renewalEnd.setTime(actualNextRenewalDate.getTime());
		    	    System.out.println("Actual Due Date again" +actualNextRenewalDate.getTime());
		    	    renewalEnd.add(Calendar.MONTH, 6);*/
		    	    
		    	    //NEW CODE STARTS TO GET THE DATES FROM DATABASE TABLE calendar_colour
		        	colourDates = new CalendarColour();
		        	allColourDates = CalendarColour.findCalendarColoursByRenewalDueDate(actualNextRenewalDate.getTime());
		        	colourDates = allColourDates.getSingleResult();
		        	if(colourDates == null){
		        		log().debug("No data available for renewal due date " + actualNextRenewalDate.getTime() + " in calendar_colour table");
		        		//any other logging
		        		return null;
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
			    		
			    		log().debug("This time set next renewal details to same as current dates");
			    		allDates.setNextRenewalDueDate(actualNextRenewalDate.getTime());
				        allDates.setNextWindowOpenDate(actualNextRenewalDate.getTime());
				       	allDates.setNextWindowCloseDate(actualNextRenewalDate.getTime());
		    	    }
		    	    
		        }
		        
		        allDates.setRenewalYear(renewalYear);
		        
		        log().debug("CURRENT Renewal Year for patent [" + patent.getPatentApplicationNumber() +"] is " + allDates.getRenewalYear());
		        log().debug("CURRENT renewal due for patent [" + patent.getPatentApplicationNumber() + "] : " + allDates.getCurrentRenewalDueDate());
	    	    log().debug("CURRENT renewal window starts on "+ allDates.getCurrentWindowOpenDate() + " and ends on " + allDates.getCurrentWindowCloseDate());
	    	    
	    		log().debug("NEXT renewal due for patent [" + patent.getPatentApplicationNumber() + "] : " + allDates.getNextRenewalDueDate());
	    		log().debug("NEXT renewal window starts on "+ allDates.getNextWindowOpenDate() + " and ends on " +  allDates.getNextWindowCloseDate());
	    		
	    		//allDates.setCurrentColorDates(getAllColorDates(allDates));
			
	    		
		}
		catch(Exception e){
			
		}
		
		return allDates;
	}
	

}
