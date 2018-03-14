package com.bcs.p3s.engine;

import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.persistence.TypedQuery;

import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.enump3s.RenewalColourEnum;
import com.bcs.p3s.enump3s.RenewalStatusEnum;
import com.bcs.p3s.model.CalendarDate;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.wrap.BankTransferPreCommitDetails;

/**
 * This engine performs all calculations relating to timing of payments.
 * It calculates 
 * 	1. the PayBy date( the Date that we are telling the customer to Pay By) ***getBothPayDates(BankTransferPreCommitDetails preCommitDetails)**** and 
 * 	2. the Settlement Date( the Date we are telling MC to expect the payment)  
 * 
 */
public class PaymentTimingEngine extends Universal{

	protected String PREFIX = this.getClass().getName() + " : "; 
	protected final String[] urgent_colours = {RenewalColourEnum.AMBER,RenewalColourEnum.BLACK};
	
	public BankTransferPreCommitDetails getBothPayDates(BankTransferPreCommitDetails preCommitDetails) { 
		
		String msg = "getPayByDateForUser(List<PatentUI> patentUIs)";
		log().debug(msg + " invoked for getting transaction target end date");
		boolean urgentRenewalPresent = false;
		boolean isAnyPatentInToo_Late = false;
		
		if(preCommitDetails == null){
			log().debug(msg + " invoked with BankTransferPreCommitDetails as null");
			log().error("Null parameter passed for BankTransferPreCommitDetails. So "+ msg + " returning null");
			return null;
		}
		
		List<PatentUI> patentUIs = preCommitDetails.getOrderedPatentUIs();
		
		if(patentUIs == null){
			log().debug(msg + " invoked with ordered patents object null");
			log().error("Null parameter passed for List<PatentUI>. So "+ msg + " returning Date as null");
			return null;
		}
		
		
		/** PRECHECK. ANY PATENT WITH TOO_LATE STATUS PRESENT IN TRANSACTION **/
		isAnyPatentInToo_Late = isAnyPatentInToo_Late(patentUIs);
		if(isAnyPatentInToo_Late){
			log().debug("Urgent patent present. So aborting further processing.");
			log().error("Urgent patent present. So aborting further processing.");
			return null;
		}
				
		Date targetDate = new Date();
		Date targetDateFx = new Date();
		
		Calendar today = Calendar.getInstance();
		
		urgentRenewalPresent = isAnyUrgentPatent(patentUIs);
		TypedQuery<CalendarDate> cDates = CalendarDate.findCalendarDatesByToday(today.getTime());
		CalendarDate cDate = cDates.getSingleResult();
		if(cDate == null){
			log().debug("DB query returned NO RESULTS for todays date " + today.getTime());
			log().error("DB query returned NO RESULTS for todays date " + today.getTime());
			return null;
		} 
		if(urgentRenewalPresent){
			targetDate = cDate.getColourEndPayBy();
			targetDateFx = cDate.getColourEndSettlement();
		}
		else{
			targetDate = cDate.getOtherPayBy();
			targetDateFx = cDate.getOtherSettlement();
		}
		
		if(!(targetDate == null || targetDateFx == null)){
			log().debug("Setting transaction end dates as : To User as **"+ targetDate +"** and To MoneyCorp as **" + targetDateFx +"**");
			preCommitDetails.setTransTargetEndDate(targetDate);
			preCommitDetails.setFxTarget(targetDateFx);
		}
		else{
			log().debug("Target dates obtained are null from DB.Return null from " + msg );
			log().error("Target dates obtained are null from DB.Return null from " + msg );
			return null;
		}
		
		return preCommitDetails;
	}
	
	protected boolean isAnyUrgentPatent(List<PatentUI> patentUIs){
		
		String msg = "isAnyUrgentPatent(List<PatentUI> patentUIs)";
		log().debug(msg +" invoked for determining any patent with urgent renewal[AMBER/BLACK/LAST DAYS OF GREEN/BLUE]");
		boolean urgentRenewal = false;
		
		//check any patents in LAST MONTH OF GREEN/RED/AMBER/LAST MONTH OF BLUE/BLACK
		for(PatentUI patentUI : patentUIs){
			
			/**
			 * Test 1. Check whether any patent is in RED/AMBER/BALCK 
			 */
			if(stringContainsItemFromList(patentUI.getCostBandColour(),urgent_colours)){  //RED/AMBER/BLACK
				urgentRenewal = true;
				log().debug("URGENT PATENT PRESENT IN THE TRANSACTION");
				log().debug("CostBand Colour is "+ patentUI.getCostBandColour() + " for patent[" + patentUI.getId() +"] and current Renewal Colour as " + patentUI.getCostBandColour() );
				break;
			}
			
			/**
			 * Test 2. Check whether any patent having renewal due date or 6 MONTH extension end date  is less than a month 
			 */
			Calendar today = Calendar.getInstance();
			Calendar renewalDue = Calendar.getInstance();
			renewalDue.setTime(patentUI.getRenewalDueDate());
			int renewalDueMonth = renewalDue.get(Calendar.MONTH);
			int renewalExtnMonth = renewalDueMonth+6;
			int currentMonth = today.get(Calendar.MONTH);
			
			if(currentMonth == renewalDueMonth ||  currentMonth == renewalExtnMonth){
				urgentRenewal = true;
				log().debug("URGENT PATENT PRESENT IN THE TRANSACTION");
				log().debug(" "+ patentUI.getCostBandColour() + " for patent[" + patentUI.getId() +"] and current Renewal Colour as " + patentUI.getCostBandColour() );
				break;
			}
				
		}
		
		if(!urgentRenewal)
			log().debug("NO URGENT PATENT PRESENT IN THE TRANSACTION");
		
		
		return urgentRenewal;
	}
	
	/**
	 * 
	 * @param patentUIs
	 * @return true if any patent in Red Cost band colour/ Last 5 days of Black ie, CHECK FOR renewal_status as TOO_LATE included in transaction
	 */
	protected boolean isAnyPatentInToo_Late(List<PatentUI> patentUIs){
		
		boolean isAnyPatentInToo_Late = false;
		String msg = PREFIX + "isAnyPatentInToo_Late(List<PatentUI> patentUIs)";
		log().debug(msg +" invoked for generic check : ANY PATENT WITH COLOUR RED/LAST 5 DAYS OF BLACK");
		for(PatentUI patentUI : patentUIs){
			if(RenewalStatusEnum.TOO_LATE.equals(patentUI.getRenewalStatus())){
				isAnyPatentInToo_Late = true;
				log().debug("PATENT HAVING STATUS AS **TOO_LATE** PRESENT IN THE TRANSACTION");
				log().debug(" "+ patentUI.getCostBandColour() + " for patent[" + patentUI.getId() +"] and current Renewal Status as " + patentUI.getRenewalStatus() );
				break;
			}
		}
		
		if(!isAnyPatentInToo_Late)
			log().debug("NO PATENT WITH STATUS AS **TOO_LATE** FOUND IN THE TRANSACTION.CHECK COMPLETED");
		
		return isAnyPatentInToo_Late;
	}
	
	protected static boolean stringContainsItemFromList(String inputStr, String[] items) {
	    return Arrays.stream(items).parallel().anyMatch(inputStr::contains);
	}
	
}
