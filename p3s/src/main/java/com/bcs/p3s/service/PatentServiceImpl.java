package com.bcs.p3s.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

import javax.persistence.TypedQuery;
import javax.servlet.ServletException;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.bcs.p3s.display.NotificationUI;
import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.display.UserProfileUI;
import com.bcs.p3s.engine.DummyDataEngine;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.Notification;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.security.SecurityUtil;
import com.bcs.p3s.session.PostLoginSessionBean;
import com.bcs.p3s.util.lang.Universal;

@Service("PatentService")
public class PatentServiceImpl extends ServiceAuthorisationTools implements PatentService {

	protected String PREFIX = this.getClass().getName() + " : "; 

	
	// (Likely) Only used internally (below) -could be protected
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

	

// formerly
	//	public void  deletePatentById(long id) { 
//    	authReminder();
//    	//String err = PREFIX+"PatentServiceImpl : deletePatentById("+id+") ";
//    	String err = PREFIX+"deletePatentById("+id+") ";
//    	System.out.println(err+"invoked ");
//    	
//    	Patent patent = null;
//    	if(session == null) logInternalError().fatal(err+"has empty session");
//    	else {
//    		PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
//    		Business usersBusiness = pLoginSession.getBusiness();
//    		patent = Patent.findPatent(new Long(id));
//    		if (patent==null) logInternalError().warn(err+"finds no matching patent. {url rewriting?}");
//    		else {
//    			patent.remove(); 
//    		}
//    	}
//	}
	public void  deletePatentById(long id) { 

		String err = PREFIX+"deletePatentById("+id+") ";
		checkThisIsMyPatent(id, err);

		log().debug(err+" invoked ");

    	Patent patent = Patent.findPatent(id);
    	patent.remove(); 
	}

	

	public Patent updatePatent(long id, PatentUI patentUI) { 

		String err = PREFIX+"updatePatent("+id+") ";
		checkUpdatePatent(id, patentUI, err); 
		
		log().debug(err+" invoked ");
    	
    	Patent updatedPatent = null;
    	try {

    		// coz have dun Auth (Not yet written!!), can TRUST notNull, not malicious, etc ... - acTidy

    		Patent patent = findById(id);
    		patent.setClientRef(patentUI.getClientRef());
    		patent.setShortTitle(patentUI.getShortTitle());
    		patent.setNotifications(new ArrayList<Notification>());
    		for (NotificationUI notificationUI : patentUI.getNotificationUIs()) {
    			if (notificationUI.getIsOn()) {
    				Long notificationId = notificationUI.getId();
    				Notification notification = Notification.findNotification(notificationId);
    				patent.getNotifications().add(notification);
    			}
    		}
    		
    		patent.merge();
    	} 
    	catch (Exception e) {
    		// this catch here as (a) cannot yet PROVE this code *&* (b) cannot trust exception to appear if thrown
    		System.out.println("PatentServiceImpl updatePatent() SUFFERED WATCHDOG WRAPPER EXCEPTION "); // acTidy once exception logging issue fixed
			System.out.println(e.getMessage());
			e.printStackTrace();
			throw new RuntimeException(e);
    	}
    	return updatedPatent;
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
