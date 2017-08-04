package com.bcs.p3s.engine;

import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;

import com.bcs.p3s.enump3s.RenewalStatusEnum;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.Notification;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.util.date.DateUtil;
import com.bcs.p3s.util.lang.Universal;

/**
 * This Engine holds processing that should be rendered redundant before long.
 *
 * As an Example, processing that will be redundant once working EPO interfaces are implemented
 *
 * @author andyc
 */
public class TemporaryProcessingEngine extends Universal {

	private final boolean SYSO_VERBOSE = false;
	
	/**
	 * Add Patent form would ideally return a PatentUI
	 *  but it doesn't (Yet) as of 3rd July 2017
	 * THIS method does the necessary munging
	 *
	 **/
	public Patent extractPatentFromAddPatentForm(Object obby) {

   		verbose("TemporaryProcessingEngine : extractPatentFromAddPatentForm  invoked");

		Patent patent = new Patent();

		try {

		   	LinkedHashMap<String, Object> newPatentHashMap = (LinkedHashMap<String, Object>) obby; 
		   	Set<String> keys = newPatentHashMap.keySet();

		   	for (String key : keys) {
			   	String displayable = "";
			   	Object tmp = newPatentHashMap.get(key);
			   	if (tmp!=null) { 
			   		verbose(" tmp IS a "+tmp.getClass());
			   		displayable = tmp.toString();
			   	} else verbose(" tmp IS NULL");
		   		verbose("key = "+key+",     value ="+displayable );
		   	}
		   	verbose("Finished the FIRST LOOP ");
		   	verbose(" " );
		   	verbose(" " );

		   	
		   	// Process fileds, one by one
		   	verbose(" pre 2nd loop" );
		   	String value = "nevernever";
		   	LinkedHashMap<String, Object> notificationObjects = new LinkedHashMap<String, Object>();
		   	List<Notification> onNotifications = new ArrayList<Notification>();
		   	
		   	for (String key : keys) {
		   		value = "FAILED";
		   		verbose("processing key = "+key+",     value ="+newPatentHashMap.get(key) );
			   	Object ob = newPatentHashMap.get(key);
			   	if (ob instanceof String) value = (String) ob;
			   	
			   	if ("patentApplicationNumber".equals(key.trim())) patent.setPatentApplicationNumber(value);
			   	if ("title".equals(key.trim())) patent.setTitle(value);
			   	if ("filingDate".equals(key.trim())) {
			   		Date itch = null;
			   		if (ob instanceof Long) {
				   		itch = new Date((Long) ob);
			   		} 
			   		else {
			   			Long when = new Long((String) ob);
			   			itch = new Date(when);
			   		}
				   	verbose("xyz have filing date of "+(new DateUtil()).dateToUSStringWithDayOfWeek(itch));
			   		patent.setFilingDate(itch);
			   	}
	
			   	if ("business".equals(key.trim())) {
				   	verbose(" business mush is "+value);
				   	verbose(" ob is a "+ob.getClass());
			   		LinkedHashMap<String, Object> bob = (LinkedHashMap<String, Object>) ob;
				   	verbose(" bob.get(id) is "+bob.get("id"));
			   		long bid = (Integer) bob.get("id");
				   	verbose(" bid is "+bid);
			   		
				   	Business busy = Business.findBusiness(bid);  
			   		patent.setBusiness(busy);
			   	}
			   	if ("primaryApplicantName".equals(key.trim())) patent.setPrimaryApplicantName(value);
			   	if ("clientRef".equals(key.trim())) {
			   		patent.setClientRef(value);
			   		if (ob==null || "FAILED".equals(value)) patent.setClientRef(null);
			   	}
			   	if ("shortTitle".equals(key.trim())) {
			   		patent.setShortTitle(value);
			   		if (ob==null || "FAILED".equals(value)) patent.setShortTitle(null);
			   	}
			   	if ("patentPublicationNumber".equals(key.trim())) patent.setPatentPublicationNumber(value);
			   	
			   	
			   	if ("renewalYear".equals(key.trim())) {
			   		
			   		
			   		Integer year = 0;
			   		if (ob instanceof Integer) {
			   			year = (Integer) ob;
			   		} 
			   		
				   	
			   		patent.setRenewalYear(year);
			   	}
			   	
			   	if ("epoPatentStatus".equals(key.trim())) patent.setEpoPatentStatus(value);
			   	
			   	if ("renewalStatus".equals(key.trim())) patent.setRenewalStatus(value);
			   	
			   	if ("lastRenewedDateExEpo".equals(key.trim())) {
			   		
			   		Date itch = null;
			   		if (ob instanceof Long) {
				   		itch = new Date((Long) ob);
			   		} 
			   		else {
			   			Long when = new Long((String) ob);
			   			itch = new Date(when);
			   		}
				   	verbose("xyz have last renewd epo date of "+(new DateUtil()).dateToUSStringWithDayOfWeek(itch));
			   		
			   		
			   		patent.setLastRenewedDateExEpo(itch);
			   	}
			   	// & now other tweaks to keep Patent happy
			   	/*patent.setRenewalYear(-1);
			   	patent.setEpoPatentStatus("EMPTY");
			   	//patent.setRenewalStatus(RenewalStatusEnum.ABANDONED);
			   	patent.setRenewalStatus(RenewalStatusEnum.RENEWAL_IN_PLACE);*/
	
		   	
			   	// Now extract and populate the Notifications
			   	if ("notificationUIs".equals(key.trim())) {
				   	verbose(" Found notificationUIs ");
				   	Object nob = newPatentHashMap.get(key); 
	
				   	ArrayList<Object> nobmap = (ArrayList<Object>) nob;
				   	
				   	verbose(" nobmap.size() is "+nobmap.size());
				   	verbose(" PRE notification llop");
				   	for (Object nobkeyOb : nobmap) {
				   		String nobkey = nobkeyOb.toString(); 
					   	verbose("     nobkey AS STRING toString is "+nobkey);
					   	verbose("     nobkeyOb is a "+nobkeyOb.getClass());
	
				   		LinkedHashMap<String, Object> jsonNotificationFields = (LinkedHashMap<String, Object>) nobkeyOb;
					   	
				   		long nid = (Integer) jsonNotificationFields.get("id");
					   	verbose(" nid is "+nid);
	
					   	Object defaultVal = jsonNotificationFields.get("defaultOn");
					   	verbose(" defaultVal is a "+defaultVal.getClass());
					   	verbose(" defaultVal is "+defaultVal.toString());
					   	Boolean onSoFar = (Boolean) defaultVal;
					   	
					   	Object ison = jsonNotificationFields.get("isOn");
					   	verbose(" isOn is a "+ison.getClass());
					   	verbose(" isOn is "+ison.toString());
				   		
					   	// Here's the devious bit
					   	// isOn is usually true or false. But If it is 0, this indicates it's been inverted (at least once - assume once)
					   	if (ison instanceof Integer) {
					   		onSoFar = ! onSoFar ;
					   	}
					 
					   	// & now - if selected - add to the ON list
					   	if (onSoFar) {
					   		Notification onny = Notification.findNotification(nid);
					   		onNotifications.add(onny);
					   	}
				   	}
				   	verbose(" POST notification llop");
				   	
	
				   	patent.setNotifications(onNotifications);
				   	verbose(" ON NOTIFICATIONS follow:");
				   	for (Notification n : patent.getNotifications()) {
					   	verbose(" id="+ n.getId()+",   "+n.getTitle()+",    default="+n.getDefaultOn());
				   	}
			   	}
		   	}
	   		

		} catch (Exception e) {
			verbose("extractPatentFromAddPatentForm SUFFERED WATCHDOG WRAPPER EXCEPTION ");
			verbose(e.getMessage());
			e.printStackTrace();
		}


   		verbose("TemporaryProcessingEngine : extractPatentFromAddPatentForm  completed");

   		return patent;
	}




	
	
	
	private void verbose(String msg) {
		if (SYSO_VERBOSE) System.out.println();
	}

}
