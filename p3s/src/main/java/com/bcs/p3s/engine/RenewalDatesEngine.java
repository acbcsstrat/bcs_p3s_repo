package com.bcs.p3s.engine;

import java.util.Calendar;
import java.util.Date;

import com.bcs.p3s.display.RenewalDates;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.util.date.DateUtil;

public class RenewalDatesEngine {
	
	public RenewalDates getRenewalDates(Patent patent){
			
			RenewalDates allDates = new RenewalDates();
			
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
				
		        int month = calendar.get(Calendar.MONTH);
		        int year = calendar.get(Calendar.YEAR);
		        int yearNow = Calendar.getInstance().get(Calendar.YEAR);
		        int day = calendar.get(Calendar.DAY_OF_MONTH);
		        
		        monthEndFilingDate.set(year, month, day , 23,59);
		        Calendar nextRenewalDate = Calendar.getInstance();
		        nextRenewalDate.set(yearNow, month, day , 23,59);  
		        System.out.println("Anniversary Date is "+ nextRenewalDate.getTime());
		        Calendar actualCurrentRenewalDate = new DateUtil().getLastDayOfMonth(nextRenewalDate.getTime());
		        System.out.println("Calculated renewal due for this year"+ actualCurrentRenewalDate.getTime());
		        
		        /**
		         * STEP 1.3 :-Get the boundary dates for the above filing due date - 3 months prior and 6 months after
		         */
		        Calendar renewalStart = Calendar.getInstance();
		        renewalStart.setTime(actualCurrentRenewalDate.getTime());
		        renewalStart.add(Calendar.MONTH, -3);
		        renewalStart.setTime(new DateUtil().getMidnight(renewalStart.getTime()));
		        
		        Calendar renewalEnd = Calendar.getInstance();
		        renewalEnd.setTime(actualCurrentRenewalDate.getTime());
		        System.out.println("Actual Due Date again" +actualCurrentRenewalDate.getTime());
		        renewalEnd.add(Calendar.MONTH, 6);
		        /** P3S WIndow close date is 2 days before the actual closing date **/
		        renewalEnd.add(Calendar.DATE, -2);
		        
		        System.out.println("Calculated Window for this year are " + renewalStart.getTime() +" and " + renewalEnd.getTime());
		        
		        
		        Calendar tempRenYearStart = Calendar.getInstance();
		        tempRenYearStart.setTime(actualCurrentRenewalDate.getTime());
		        tempRenYearStart.add(Calendar.MONTH, -6);    //due date - 6 months or renewalStart -6
		        tempRenYearStart.setTime(new DateUtil().getMidnight(renewalStart.getTime()));
				
		      /**
		       * STEP 1.4 :- Get the current renewal year
		       */
		       
				/** STEP 1.4.1 - GET THE YEARS BETWEEN (Calculated renewal due for this year) AND (last day of month of filing patent) **/
		        int yearsBetween = new DateUtil().getYearsBetweenDates(new DateUtil().getTodaysDate(), monthEndFilingDate.getTime());
		        int renewalYear = yearsBetween + 1;
		        
		        /** STEP 1.4.2 - CHECK THE POSITION OF TODAYS DATE IN RNEWAL WINDOW  
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
		        
		        Date todays = new DateUtil().getTodaysDate();
		        if(todays.before(renewalStart.getTime())){
		        	renewalYear = renewalYear-1;
		        	
		        	//SET THE CURRENT TO DATES TO NEXT WINDOW DATES
		        	
		        	allDates.setNextRenewalDueDate(actualCurrentRenewalDate.getTime());
		        	allDates.setNextWindowOpenDate(renewalStart.getTime());
		        	allDates.setNexttWindowCloseDate(renewalEnd.getTime());
		        	
		        	//Calculating Previous year details in the same way
		            
		            Calendar prevRenewalDate = Calendar.getInstance();
		    	    prevRenewalDate.set(yearNow-1, month, day , 23,59);  
		    	    System.out.println("Renewal date 1 year before " + prevRenewalDate.getTime());
		    	    Calendar actualPrevRenewalDate = new DateUtil().getLastDayOfMonth(prevRenewalDate.getTime());
		    	    System.out.println("This year renewal due "+ actualPrevRenewalDate.getTime());
		    	    
		    	    renewalStart = Calendar.getInstance();
		    	    renewalStart.setTime(actualPrevRenewalDate.getTime());
		    	    renewalStart.add(Calendar.MONTH, -3);
		    	    renewalStart.setTime(new DateUtil().getMidnight(renewalStart.getTime()));
		    	    
		    	    renewalEnd = Calendar.getInstance();
		    	    renewalEnd.setTime(actualPrevRenewalDate.getTime());
		    	    System.out.println("Actual Due Date again" +actualPrevRenewalDate.getTime());
		    	    renewalEnd.add(Calendar.MONTH, 6);
		    	    
		    	    /** P3S WIndow close date is 2 days before the actual closing date **/
		            renewalEnd.add(Calendar.DATE, -2);
		    	    System.out.println("Doldrums for previous year are " + renewalStart.getTime() +" and " + renewalEnd.getTime());
		    	    
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
		    	    otherRenewalDate.set(yearNow+1, month, day , 23,59);  
		    	    System.out.println("Renewal date 1 year before " + otherRenewalDate.getTime());
		    	    Calendar actualPrevRenewalDate = new DateUtil().getLastDayOfMonth(otherRenewalDate.getTime());
		    	    System.out.println("This year renewal due "+ actualPrevRenewalDate.getTime());
		    	    
		    	    renewalStart = Calendar.getInstance();
		    	    renewalStart.setTime(actualPrevRenewalDate.getTime());
		    	    renewalStart.add(Calendar.MONTH, -3);
		    	    renewalStart.setTime(new DateUtil().getMidnight(renewalStart.getTime()));
		    	    
		    	    renewalEnd = Calendar.getInstance();
		    	    renewalEnd.setTime(actualPrevRenewalDate.getTime());
		    	    System.out.println("Actual Due Date again" +actualPrevRenewalDate.getTime());
		    	    renewalEnd.add(Calendar.MONTH, 6);
		    	    
		    	    /** P3S WIndow close date is 2 days before the actual closing date **/
		            renewalEnd.add(Calendar.DATE, -2);
		    	    System.out.println("Doldrums for previous year are " + renewalStart.getTime() +" and " + renewalEnd.getTime());
		    	    
		    	    allDates.setNextRenewalDueDate(actualCurrentRenewalDate.getTime());
		        	allDates.setNextWindowOpenDate(renewalStart.getTime());
		        	allDates.setNexttWindowCloseDate(renewalEnd.getTime());
		        }
		        
		        allDates.setRenewalYear(renewalYear);
			
			
			return allDates;
	}

}
