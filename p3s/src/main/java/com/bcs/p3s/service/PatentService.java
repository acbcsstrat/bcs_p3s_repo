package com.bcs.p3s.service;

import java.util.List;

import javax.servlet.http.HttpSession;

import com.bcs.p3s.display.CostAnalysisData;
import com.bcs.p3s.display.FxRateCurrentUI;
import com.bcs.p3s.display.FxRateUI;
import com.bcs.p3s.display.NotificationUI;
import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.display.PatentV2UI;
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
	 * Persist the newly added patent and calculated the related fees for the same
	 */
	public List<PatentUI> persistAndCalculateFee(Patent patent);
	
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
	 * Persist the patent details 
	 * @param patent
	 */
	public Patent persistPatent(Patent patent);

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
	 * For a Patent, replace existing Notifications of specified type with the specified Notifications
	 * @param id
	 * @param objListNotificationUIs
	 * @param productType see NotificationProductTypeEnum
	 */
	public void srvUpdateTypedNotifications(long id, Object objListNotificationUIs, String productType);

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
	
	public List<RenewalUI> getRenewalHistory(long id);
	
	public PatentUI populateDataToPatentUI(Patent patent);
	
	//public PostLoginSessionBean populateSessionBean();
	
	public String validateAndFormatApplicationNumber(String patentApplicationNumber);
	
	public boolean isPatentFoundForBusiness(String patentApplicationNumber, PostLoginSessionBean postSession);
	
	public String truncateAndStoreCheckDigit(String patentApplicationNumber);
	
	public PatentV2UI getPatentInfo(long id, HttpSession session);   // new for v2.1

		
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
