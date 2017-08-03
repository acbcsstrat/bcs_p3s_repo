package com.bcs.p3s.service;

import java.math.BigDecimal;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

import javax.persistence.TypedQuery;

import org.springframework.stereotype.Service;

import com.bcs.p3s.display.CostAnalysisData;
import com.bcs.p3s.display.FeeUI;
import com.bcs.p3s.display.FxRateCurrentUI;
import com.bcs.p3s.display.FxRateUI;
import com.bcs.p3s.display.NotificationUI;
import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.display.RenewalDates;
import com.bcs.p3s.display.RenewalUI;
import com.bcs.p3s.engine.CostAnalysisDataEngine;
import com.bcs.p3s.engine.DummyDataEngine;
import com.bcs.p3s.enump3s.RenewalColourEnum;
import com.bcs.p3s.enump3s.RenewalStatusEnum;
import com.bcs.p3s.model.ArchivedRate;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.DiscountPercent;
import com.bcs.p3s.model.EpoFee;
import com.bcs.p3s.model.GlobalVariableSole;
import com.bcs.p3s.model.Notification;
import com.bcs.p3s.model.P3SFeeSole;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.model.Renewal;
import com.bcs.p3s.session.PostLoginSessionBean;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.wrap.BasketContents;

@Service("PatentService")
public class PatentServiceImpl extends ServiceAuthorisationTools implements PatentService {

	protected String PREFIX = this.getClass().getName() + " : "; 


	// Start of - the methods which implement the prototypes in the Interface

	public List<PatentUI> listAllPatentUIsForMyBusiness() {

		String err = PREFIX+"listAllPatentUIsForMyBusiness() ";
		checkNoActionRequired(err);

		log().debug(err+" invoked ");
    	
		List<Patent> patents = listAllPatentsForMyBusiness();
		List<PatentUI> patentUIs = new ArrayList<PatentUI>();
		for (Patent patent: patents) {
			PatentUI patentUI = new PatentUI(patent);
			patentUIs.add(patentUI);
		}
		return patentUIs; 
	}



	public PatentUI searchEpoForPatent(String patentApplicationNumber) {

		String err = PREFIX+"searchEpoForPatent("+patentApplicationNumber+") ";
		checkNotNull(patentApplicationNumber, err);

		log().debug(err+" invoked ");
    	
		PatentUI returnedValue = null;
		DummyDataEngine dummy = new DummyDataEngine();
		returnedValue = dummy.createDummyPatentUiForSearchAddPatent(patentApplicationNumber);
		
		return returnedValue;
	}


	
	/**
	 * The JSON file for PatentUI (i.e. the *UI) needs ALL the notifications - and, for each, whether it is on or off.
	 * patent.notifications just holds those that are ON.
	 * 
	 * Approach used below: Get ALL into SortSet. Replace those that are ON.
	 * Sorted by display order
	 * @param notifications
	 */
	public synchronized List<NotificationUI> createNotificationUIs(List<Notification> notifications) {

		String err = PREFIX+"createNotificationUIs() ";
		checkNoActionRequired(err);  // because such data is not sensitive. Is anonymous

		log().debug(err+" invoked ");
		
		List<NotificationUI> allNotificationUIs = new ArrayList<NotificationUI>();
		
		// Assemble ALL notificationUIs (identifiable by ID)
		List<Notification> allNotifications = Notification.findAllNotifications();
		for (Notification anotification : allNotifications) {
			NotificationUI notificationUI = new NotificationUI(anotification);
			allNotificationUIs.add(notificationUI);
		}

		// In below code:
		//  indexOf relies on equals() in NotificationUI
		//  Sorting relies on compareTo() in NotificationUI
		
		
		// Switch ON as appropriate
		for (Notification notification : notifications) { // i.e. each ON notification
			NotificationUI matchTarget = new NotificationUI(notification);

			// find existing match, & switch on
			int imatch = allNotificationUIs.indexOf(matchTarget);
//			if (imatch == -1) fail("NotificationUI handling has failed.");
			if (imatch == -1) {
				Universal universal = new Universal();
				universal.fail("NotificationUI handling has failed.");
			}
			NotificationUI match = allNotificationUIs.get(imatch);
			match.setIsOn(true);
		}

		// Sort of displayOrder (for UI convenience)
		Collections.sort(allNotificationUIs);
		
//		System.out.println("acdebug - *ALL* notificationUIs after processing");
//		for (NotificationUI notificationUI : allNotificationUIs) {
//			System.out.println("          "+notificationUI.getId()+",   "+notificationUI.getIsOn()+",   "+notificationUI.getDisplayOrder()+",    "+notificationUI.getTitle());
//		}
		return allNotificationUIs;
	}

	
	
	public Patent findById(long id) { 

		String err = PREFIX+"findById("+id+") ";
		checkThisIsMyPatent(id, err);

		log().debug(err+" invoked ");
    	
    	Patent patent = null;
    	if(session == null) logInternalError().fatal(err+"has empty session");
    	else {
    		PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
    		Business usersBusiness = pLoginSession.getBusiness();
    		patent = Patent.findPatent(new Long(id));
    		if (patent==null) logInternalError().warn(err+"finds no matching patent. {url rewriting?}");
    		else {
    			if (patent.getBusiness().getId() != usersBusiness.getId()) logM().warn(err+" rqsted by userId"+pLoginSession.getUser().getId()); 
    		}
    	}
    	return patent;
	}


	
	public void  deletePatentById(long id) { 

		String err = PREFIX+"deletePatentById("+id+") ";
		checkThisIsMyPatent(id, err);

		log().debug(err+" invoked ");

    	Patent patent = Patent.findPatent(id);
    	patent.remove(); 
	}

	
	
	// The patentUI parameter MAY be provided as a PatentUI, or more likely a LinkedHashMap, so, here, accept either
	public Patent flexibleUpdatePatent(long id, Object untypedPatentUI) { 

		String err = PREFIX+"flexibleUpdatePatent("+id+") ";

		// Re: check*() safety - Unusually (& Scarily!) do not check*() YET
		// First identify parameter TYPE. THEN check. But ensure safety checks ARE performed

		// Meanwhile: Do what we can, for now
		if (untypedPatentUI instanceof PatentUI) {
			checkUpdatePatent(id, (PatentUI) untypedPatentUI, err);
		} else 
		if (untypedPatentUI instanceof LinkedHashMap) {
			checkThisIsMyPatent(id, err);
			checkNotNull(untypedPatentUI, err);
			// Further check*()s to be performed!
		}
		else failInternalError("flexibleUpdatePatent() passed unexpected objectType = "+untypedPatentUI.getClass().getName());

		
		log().debug(err+" invoked ");
		Patent updatedPatent = findById(id);
		try {
			PatentUI patentUI = null; 
    	
			if (untypedPatentUI instanceof PatentUI) {
				patentUI = (PatentUI) untypedPatentUI;

				updatedPatent.setClientRef(patentUI.getClientRef());
				updatedPatent.setShortTitle(patentUI.getShortTitle());
				updatedPatent.setNotifications(new ArrayList<Notification>());
	    		for (NotificationUI notificationUI : patentUI.getNotificationUIs()) {
	    			if (notificationUI.getIsOn()) {
	    				Long notificationId = notificationUI.getId();
	    				Notification notification = Notification.findNotification(notificationId);
	    				updatedPatent.getNotifications().add(notification);
	    			}
	    		}
			} else { 
				// Retrieve the required data from the LinkedHashMap
				LinkedHashMap data = (LinkedHashMap) untypedPatentUI;
				String clientRef = (String) data.get("clientRef");
				String shortTitle = (String) data.get("shortTitle");
				// Now apply that data
				updatedPatent.setClientRef(clientRef);
				updatedPatent.setShortTitle(shortTitle);
				updatedPatent.setNotifications(flexibleExtractNotifications(data));
			
				// NOW ! - can perform the remaining check*()s - which were: checkIsTrue((patentUI.getId().longValue()==id), err)   &    checkPatentUIhasNotificationUIs(patentUI, err);
				Integer ID = (Integer) data.get("id");
				if (ID.longValue()!=id) 				failInternalError(err+"  [on check id=id]");
				List<Object> allNotificationUIs = (List<Object>) data.get("notificationUIs");
				if (allNotificationUIs.size() < 5 )		failInternalError(err+" [patentUI has only "+allNotificationUIs.size()+" notificationUIs]"); 
			}

			// At long last !
			updatedPatent.merge();
			
    	} 
    	catch (Exception e) {
    		// this catch here as (a) cannot yet PROVE this code *&* (b) cannot trust exception to appear if thrown
    		System.out.println("PatentServiceImpl flexibleUpdatePatent() SUFFERED WATCHDOG WRAPPER EXCEPTION "); // acTidy once exception logging issue fixed
			System.out.println(e.getMessage());
			e.printStackTrace();
			throw new RuntimeException(e);
    	}
    	return updatedPatent;
	}

	
	
	public FxRateCurrentUI getCurrentFxRate() {

		String err = PREFIX+"getCurrentFxRate() ";
		checkNoActionRequired(err);

		log().debug(err+" invoked ");
    	
		// Todays rate
		FxRateUI todaysRate = new FxRateUI(); 
		GlobalVariableSole current = GlobalVariableSole.findOnlyGlobalVariableSole();
		todaysRate.setRate(current.getCurrentRate());
		todaysRate.setRateActiveDate(current.getCurrentRateActiveDate());
		
		// The previous rate
		FxRateUI lastRate = new FxRateUI();
		ArchivedRate previous = ArchivedRate.findLatestArchivedRate();
		lastRate.setRate(previous.getFxRate());
		lastRate.setRateActiveDate(previous.getActiveFromDate());
		
		FxRateCurrentUI fxRateCurrentUI = new FxRateCurrentUI();
		fxRateCurrentUI.setCurrentFXRate(todaysRate);
		fxRateCurrentUI.setLastFXRate(lastRate);
		
    	return fxRateCurrentUI;
	}

	
	
	public List<FxRateUI> getFxRateHistory(String timeperiod) { 

		String err = PREFIX+"getFxRateHistory("+timeperiod+") ";
		checkNoActionRequired(err);

		log().debug(err+" invoked ");
    	
		List<FxRateUI> history = new ArrayList<FxRateUI>();
		int numdays = period2days(timeperiod);
		if (numdays < 1) return history;
		
		
		GlobalVariableSole tmp1 = GlobalVariableSole.findOnlyGlobalVariableSole();
		DummyDataEngine dummy = new DummyDataEngine();
		List<FxRateUI> badData = dummy.makeDummyFxRateHistory(tmp1.getCurrentRate(), tmp1.getCurrentRateActiveDate(), numdays); 
		
		for (FxRateUI r : badData) {
			history.add(r);
		}
		
		
		// Todays rate
		FxRateUI todaysRate = new FxRateUI(); 
		GlobalVariableSole current = GlobalVariableSole.findOnlyGlobalVariableSole();
		BigDecimal formatted = current.getCurrentRate();
    	formatted = formatted.setScale(4, BigDecimal.ROUND_CEILING);
		todaysRate.setRate(formatted);
		todaysRate.setRateActiveDate(current.getCurrentRateActiveDate());
		history.add(todaysRate);

	    System.out.println(err+" returning following rate history:");
	    for (FxRateUI r : history) { System.out.println("   "+r.toString()); }

		return history;
	}

	

	
	

	// End of - the methods which implement the prototypes in the Interface
	

	
	
	
	
	
	
	// Start of - Support methods - NOT exposed through the interface

	// Tidy flexibleUpdatePatent() above by extracting this
	protected List<Notification> flexibleExtractNotifications(LinkedHashMap untypedPatentUI) { 
		List<Notification> result = new ArrayList<Notification>();
		//if patentUI is a LinkedHashMap, notificationUIs will (likely) be too. But check, just in case
		List<Object> allNotificationUIs = (List<Object>) untypedPatentUI.get("notificationUIs");
		for (Object obNotificationUI : allNotificationUIs) {
			if (obNotificationUI instanceof NotificationUI) {
				NotificationUI notificationUI = (NotificationUI) obNotificationUI;
				if (notificationUI.getIsOn()) {
    				Long notificationId = notificationUI.getId();
    				Notification notification = Notification.findNotification(notificationId);
    				result.add(notification);
				}
			}
			else {
				LinkedHashMap obNotification = (LinkedHashMap) obNotificationUI;
				Integer ID = (Integer) obNotification.get("id");
				Boolean ISON = (Boolean) obNotification.get("isOn");
				if (ISON.booleanValue()) {
    				long notificationId = ID.longValue();
    				Notification notification = Notification.findNotification(notificationId);
    				result.add(notification);
				}
			}
		}
    	return result;
	}

	
	
	protected List<Patent> listAllPatentsForMyBusiness() { 

		String err = PREFIX+"listAllPatentsForMyBusiness() ";
		checkNoActionRequired(err);

		log().debug(err+" invoked ");
    	
    /** MP170620 Code changes for implementing session starts **/	
    	List<Patent> patents = null;
    	if(session != null){
    		PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
    	
    	 	
	    	TypedQuery<Patent> tq_patents = Patent.findPatentsByBusiness(pLoginSession.getBusiness());
	    	patents = tq_patents.getResultList();
	    	
	    	System.out.println("PatentServiceImpl : listAllPatentsForMyBusiness() ret Qty "+patents.size());
        
    	}
    	else logInternalError().fatal("PatentServiceImpl : listAllPatentsForMyBusiness() has empty session");
    	
    /** MP170620 Code changes for implementing session ends **/	
    	
    	return patents;
	}

	
	
	protected int period2days(String timeperiod) {
		int numdays = -1;
		if ("week".equalsIgnoreCase(timeperiod)) return 7;
		if ("fortnight".equalsIgnoreCase(timeperiod)) return 14;
		if ("month".equalsIgnoreCase(timeperiod)) return 30;
		if ("quarter".equalsIgnoreCase(timeperiod)) return 91;
		if ("halfyear".equalsIgnoreCase(timeperiod)) return 182;
		if ("year".equalsIgnoreCase(timeperiod)) return 365;
		return numdays; 
	}

	
	// End of - Support methods - NOT exposed through the interface


	
	@Override
	public CostAnalysisData getCostAnalysisData(long id)  {
		// TODO Auto-generated method stub
		CostAnalysisDataEngine costEngines = new CostAnalysisDataEngine();
		CostAnalysisData caData = new CostAnalysisData();
		P3SFeeSole p3sFee = new P3SFeeSole();
		EpoFee epoFee = new EpoFee();
		boolean renewedByP3S = false;   //a boolean value to determine whether current renewal done from our system
		boolean isDiscountedRate = false; //a boolean value to check whether the business has got any discount rates
		//boolean renewalWindowOpened = false;  // a boolean value to determine whether we are still in doldrums
		RenewalDates allDates = new RenewalDates();
		Patent patent = Patent.findPatent(id);
		System.out.println("Got the new patent with filing date as " + patent.getFilingDate());
		
		/** Check whether current business has got any reduced Fees.
		 * 		If so get the discounted rates ( PROCESSING FEE, EXPRESS FEE, URGENT FEE AND LATE PAY PENALTY )
		 * 		Else get the actual P3SFEESOLE entries
		 *  **/
		TypedQuery<DiscountPercent> query  =  DiscountPercent.findDiscountPercentsByBusiness(patent.getBusiness());
		if(query.getResultList().size() > 0){
			isDiscountedRate = true;
			DiscountPercent discountRate = query.getSingleResult();
			p3sFee = costEngines.findDiscountedFees(discountRate);
		}
		else{
			p3sFee = P3SFeeSole.findP3SFeeSole((long) 1);  //passing 1 as P3SSoleFee will be having single entry every time 
		}
		
		//GET THE FX RATE FROM DB
		// Todays rate
		FxRateUI todaysRate = new FxRateUI(); 
		GlobalVariableSole current = GlobalVariableSole.findOnlyGlobalVariableSole();
		BigDecimal fxRate = current.getCurrentRate();
		fxRate = fxRate.setScale(4, BigDecimal.ROUND_CEILING);
		/**
		 * GET THE EPO FEES FOR THE CURRENT RENEWAL YEAR
		 */
		epoFee.setRenewalYear(patent.getRenewalYear());
		epoFee = EpoFee.findEpoFeesByRenewalYear(epoFee);
		//get the renewal year from the Patents DB
		//get the current renewal period from session object -- to be implemented later
		
		
		if(RenewalStatusEnum.RENEWAL_IN_PLACE .equals(patent.getRenewalStatus())){
			/**
			 * 
			 * Calculate the actual renewal due date and window close and open dates -- method call here
			 */
			log().debug("Renewal In Place status for the patent");
			try {
				allDates = costEngines.getRenewalWindowDates(patent);
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			//check whether the renewal has been done from our system
			TypedQuery<Renewal> q  =  Renewal.findRenewalsByPatent(patent);
			if(q.getResultList() == null){
				log().debug("No renewals for this patent being made from our system for the current patent");
				System.out.println("No renewals for this patent being made from our system");
				
				System.out.println("Check whether renewal window still opened for the current renewal year. "
						+ "If "
							+ "so show price for todays rate "
						+ "else "
							+ "Show price for the green period for next year renewal");
			}
			else{ //loop for renewal being made
				
				System.out.println("Total number of renewals being made from our system " + q.getResultList().size());
				System.out.println("Now need to find whether any renewal made for the current renewal year");
				System.out.println("Iterate through the renewals list");
				
				List <Renewal> renewals = q.getResultList();
				for(Renewal renewal : renewals){
					if(renewal.getRenewalYear() == patent.getRenewalYear()){   //renewal being made for the current year from our system
						renewedByP3S = true;
						
						System.out.println("Check whether renewal window still opened for the current renewal year. "
								+ "If "
									+ "so show price for todays rate "
								+ "else "
									+ "Show price for the next year renewal");
						
						if(allDates.isRenewalWindowStillOpened()){
							System.out.println("Renewal window still opened");
							System.out.println("Show price for current phase");
							log().debug("Renewal window still opened. Show price for current phase");
							caData = costEngines.getAllPhasesInfo(allDates);
							caData = costEngines.getAllCosts(caData,p3sFee,epoFee);
							caData.setCurrentcostBand(costEngines.getCurrentPhase(caData));
							caData.setFee(costEngines.getCurrentPhaseCost(caData.getCurrentcostBand(),p3sFee,epoFee,fxRate));
						}
						else{
							System.out.println("Renewal window closed");
							System.out.println("Show price for green period for next renewal year [Green period]");
							caData = costEngines.getNextPhasesInfo(allDates);
							epoFee.setRenewalYear(patent.getRenewalYear()+1); 
							epoFee = EpoFee.findEpoFeesByRenewalYear(epoFee);
							caData = costEngines.getAllCosts(caData,p3sFee,epoFee);
							caData.setCurrentcostBand(RenewalColourEnum.GREEN);
							caData.setFee(costEngines.getCurrentPhaseCost(caData.getCurrentcostBand(),p3sFee,epoFee,fxRate));
						}
					}
						
				}
				
				if(!renewedByP3S){
					System.out.println("Renewal made for the current year but from a different system");
					System.out.println("Check whether renewal window still opened for the current renewal year. "
							+ "If "
								+ "so show price for the green period "
							+ "else "
								+ "Show price for the green period for next year renewal");
					if(allDates.isRenewalWindowStillOpened()){
						System.out.println("Renewal window still opened");
						System.out.println("Show price for green period for this renewal year");
						caData = costEngines.getAllPhasesInfo(allDates);
						caData = costEngines.getAllCosts(caData,p3sFee,epoFee);
						/**
						 * SET THE COLOR AS GREEN
						 */
						caData.setCurrentcostBand(RenewalColourEnum.GREEN);
						caData.setFee(costEngines.getCurrentPhaseCost(caData.getCurrentcostBand(),p3sFee,epoFee,fxRate));
					}
					else{
						System.out.println("Renewal window closed");
						System.out.println("Show price for green period for next renewal year [Green Period]");
						caData = costEngines.getNextPhasesInfo(allDates);
						epoFee.setRenewalYear(patent.getRenewalYear()+1); 
						epoFee = EpoFee.findEpoFeesByRenewalYear(epoFee);
						caData = costEngines.getAllCosts(caData,p3sFee,epoFee);
						caData.setCurrentcostBand(RenewalColourEnum.GREEN);
						caData.setFee(costEngines.getCurrentPhaseCost(caData.getCurrentcostBand(),p3sFee,epoFee,fxRate));
					}
				}
				
			}
				
		}
		
		else if(RenewalStatusEnum.SHOW_PRICE .equals(patent.getRenewalStatus()) || RenewalStatusEnum.IN_PROGRESS .equals(patent.getRenewalStatus())){
			//DISPLAY TODAYS AMOUNT STRAIGHT AWAY
			caData = costEngines.getAllPhasesInfo(allDates);
			caData = costEngines.getAllCosts(caData,p3sFee,epoFee);
			caData.setCurrentcostBand(costEngines.getCurrentPhase(caData));
			caData.setFee(costEngines.getCurrentPhaseCost(caData.getCurrentcostBand(),p3sFee,epoFee,fxRate));
		}
		
		/**
		 * GET THE LINE CHART INFO 
		 * 
		 */
		HashMap<String, FeeUI> lineChart = new HashMap<String, FeeUI>();
		lineChart = costEngines.getLineChartData(caData,p3sFee,epoFee);
		caData.setLineChart(lineChart);
		return caData;
	}



	@Override
	public RenewalUI getRenewalHistory(long id) {
		// TODO Auto-generated method stub
		
		RenewalUI renewalUI = null;
		List<Renewal> renewals = new ArrayList<Renewal>();
		
		String err = "Inside getRenewalHistory(" + id +")";
		if(Long.valueOf(id)==null){
			logM().debug("Invoked getRenewalHistory(id) with id as null");
			return renewalUI;
			
		}
		
		checkThisIsMyPatent(id, err);
			
		Patent patent = Patent.findPatent(id);
		TypedQuery<Renewal> q  =  Renewal.findRenewalsByPatent(patent);
		
		if(q.getResultList() == null){
			log().debug("findRenewalsByPatent(" + patent.getId() + ") returned an empty list");
			return null;
		}
		
		log().debug("findRenewalsByPatent(" + patent.getId() + ") returned list of size [" + q.getResultList().size() + "]" );
		renewals = q.getResultList();
		for(Renewal renewal : renewals){
			renewalUI = new RenewalUI(renewal);
		}
		return renewalUI;
	}

	
	

	

	
	
	// End of - Support methods - NOT exposed through the interface


	


	
	

	
	
	
	
	
	
	
	
	
	
//	public void createNotificationUIs(List<Notification> notifications) {
//
//		// Assemble ALL notificationUIs (identifiable by ID)
//		List<Notification> allNotifications = Notification.findAllNotifications();
//		for (Notification anotification : allNotifications) {
//			NotificationUI notificationUI = new NotificationUI(anotification);
//			allNotificationUIs.add(notificationUI);
//		}
//
//		// In below code:
//		//  indexOf relies on equals() in NotificationUI
//		//  Sorting relies on compareTo() in NotificationUI
//		
//		
//		// Switch ON as appropriate
//		for (Notification notification : notifications) { // i.e. each ON notification
//			NotificationUI matchTarget = new NotificationUI(notification);
//
//			// find existing match, & switch on
//			int imatch = allNotificationUIs.indexOf(matchTarget);
////			if (imatch == -1) fail("NotificationUI handling has failed.");
//			if (imatch == -1) {
//				Universal universal = new Universal();
//				universal.fail("NotificationUI handling has failed.");
//			}
//			NotificationUI match = allNotificationUIs.get(imatch);
//			match.setIsOn(true);
//		}
//
//		// Sort of displayOrder (for UI convenience)
//		Collections.sort(allNotificationUIs);
//		
////		System.out.println("acdebug - *ALL* notificationUIs after processing");
////		for (NotificationUI notificationUI : allNotificationUIs) {
////			System.out.println("          "+notificationUI.getId()+",   "+notificationUI.getIsOn()+",   "+notificationUI.getDisplayOrder()+",    "+notificationUI.getTitle());
////		}
//	}

	
	
	
	
	
	
	
	
//	private static final AtomicLong counter = new AtomicLong();
//	
//	private static List<Patent> patents;
//	
////	static{
////		patents= populateDummyPatents();
////	}
//
//	public List<Patent> findAllPatents() {
//		return patents;
//	}
//	
//	public Patent findById(long id) {
//		for(Patent patent : patents){
//			if(patent.getId() == id){
//				return patent;
//			}
//		}
//		return null;
//	}
//	
//	public Patent findByName(String name) {
//		for(Patent patent : patents){
//			if(patent.getPatentApplicationNumber().equalsIgnoreCase(name)){
//				return patent;
//			}
//		}
//		return null;
//	}
//	
//	public void savePatent(Patent patent) {
//		patent.setId(counter.incrementAndGet());
//		patents.add(patent);
//	}
//
//	public void updatePatent(Patent patent) {
//		int index = patents.indexOf(patent);
//		patents.set(index, patent);
//	}
//
//	public void deletePatentById(long id) {
//		
//		for (Iterator<Patent> iterator = patents.iterator(); iterator.hasNext(); ) {
//		    Patent patent = iterator.next();
//		    if (patent.getId() == id) {
//		        iterator.remove();
//		    }
//		}
//	}
//
//	public boolean isPatentExist(Patent patent) {
//		return findByName(patent.getPatentApplicationNumber())!=null;
//	}
//	
//	public void deleteAllPatents(){
//		patents.clear();
//	}
//
////	private static List<Patent> populateDummyPatents(){
////		List<Patent> patents = new ArrayList<Patent>();
////
////		patents.add(new Patent(counter.incrementAndGet(), "US146432.4", "Hewey"));
////		patents.add(new Patent(counter.incrementAndGet(), "GB444555", "Dewey"));
////		patents.add(new Patent(counter.incrementAndGet(), "WO77665544", "Louie"));
////
////		return patents;
////	}

}
