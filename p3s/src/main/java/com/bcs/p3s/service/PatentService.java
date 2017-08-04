package com.bcs.p3s.service;

import java.util.List;

import com.bcs.p3s.display.CostAnalysisData;
import com.bcs.p3s.display.FxRateCurrentUI;
import com.bcs.p3s.display.FxRateUI;
import com.bcs.p3s.display.NotificationUI;
import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.display.RenewalUI;
import com.bcs.p3s.model.Notification;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.session.PostLoginSessionBean;



public interface PatentService {
	
	//List<Patent> listAllPatentsForMyBusiness(); // Possibly unused externally
	public List<PatentUI> listAllPatentUIsForMyBusiness(); 
	
	/**
	 * Searches EPO for a patent matching the offered Application Number (no wildcards, no checkdigit)
	 * @param patentApplicationNumber
	 * @return Either a PatentUI or NULL if no match 
	 */
	public PatentUI searchEpoForPatent(String patentApplicationNumber , PostLoginSessionBean postSession);

	
	/**
	 * The JSON file for PatentUI (i.e. the *UI) needs ALL the notifications - and, for each, whether it is on or off.
	 * patent.notifications just holds those that are ON.
	 * 
	 * Approach used below: Get ALL into SortSet. Replace those that are ON.
	 * Sorted by display order
	 * @param notifications
	 */
	public List<NotificationUI> createNotificationUIs(List<Notification> notifications);


	/**
	 * Find Patent given it's ID
	 * @param id patent id (as long)
	 * @return the patent - or null (if no match, or fail, or malicious)
	 */
	public Patent findById(long id);

	

	/**
	 * Delete a Patent given it's ID
	 * @param id patent id (as long)
	 */
	public void deletePatentById(long id); 


	
	
	/**
	 * Update a Patent given it's ID and the PatentUI
	 * @param id patent id (as long)
	 * @param untypedPatentUI MAY be provided as a PatentUI, or more likely a LinkedHashMap. Either is accepted
	 * @return the updated patent - or null (if no match, or fail, or malicious)
	 */
	public Patent flexibleUpdatePatent(long id, Object untypedPatentUI) ;

	
	/**
	 * Get the current FX Rate
	 * @return a fully populated FxRateCurrentUI containing the current rate (and last rate)
	 */
	public FxRateCurrentUI getCurrentFxRate(); 


	
	/**
	 * Get FX Rate history
	 * @param the timeperiod requested
	 * @return FX Rates for the timeperiod requested
	 */
	public List<FxRateUI> getFxRateHistory(String timeperiod); 


	public CostAnalysisData getCostAnalysisData(long id);
	
	public RenewalUI getRenewalHistory(long id);
	
	public PatentUI populateDataToPatentUI(Patent patent);
	
	public PostLoginSessionBean populateSessionBean();
	
//	Patent findById(long id);
//	
//	Patent findByName(String name);
//	
//	void savePatent(Patent patent);
//	
//	void updatePatent(Patent patent);
//	
//	void deletePatentById(long id);
//
//	List<Patent> findAllPatents(); 
//	
//	void deleteAllPatents();
//	
//	public boolean isPatentExist(Patent patent);
	
}
