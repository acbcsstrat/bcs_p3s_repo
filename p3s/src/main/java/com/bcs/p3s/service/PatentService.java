package com.bcs.p3s.service;

import java.util.List;

import com.bcs.p3s.display.NotificationUI;
import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.display.UserProfileUI;
import com.bcs.p3s.model.Notification;
import com.bcs.p3s.model.Patent;



public interface PatentService {
	
	//List<Patent> listAllPatentsForMyBusiness(); // Possibly unused externally
	public List<PatentUI> listAllPatentUIsForMyBusiness(); 
	
	/**
	 * Searches EPO for a patent matching the offered Application Number (no wildcards, no checkdigit)
	 * @param patentApplicationNumber
	 * @return Either a PatentUI or NULL if no match 
	 */
	public PatentUI searchEpoForPatent(String patentApplicationNumber);

	
	/**
	 * The JSON file for PatentUI (i.e. the *UI) needs ALL the notifications - and, for each, whether it is on or off.
	 * patent.notifications just holds those that are ON.
	 * 
	 * Approach used below: Get ALL into SortSet. Replace those that are ON.
	 * Sorted by display order
	 * @param notifications
	 */
	public List<NotificationUI> createNotificationUIs(List<Notification> notifications);

	
	
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
