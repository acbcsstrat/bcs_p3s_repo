package com.bcs.p3s.engine;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;
import java.util.StringTokenizer;

import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.Notification;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.util.date.DateUtil;
import com.bcs.p3s.util.lang.P3SRuntimeException;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.wrap.BankTransferPostCommitDetails;
import com.bcs.p3s.wrap.BankTransferPreCommitDetails;
import com.bcs.p3s.wrap.InBasket;

/**
 * The Front-End may POST or PUT data back to the back-end
 * Where necessary, this engine provides support in extracting required data.
 * 
 *  This MIGHT include processing data which arrives in an unpredictable form: e.g. LinkedHashMap OR the requested object
 * @author andyc
 *
 */
public class ExtractSubmittedDataEngine extends Universal {
	
	/**
	 * 
	 * @param obby
	 * @return
	 */
	
	public Patent extractPatentFromAddPatentForm(Object obby) {


		Patent patent = new Patent();

		try {

		   	LinkedHashMap<String, Object> newPatentHashMap = (LinkedHashMap<String, Object>) obby; 
		   	Set<String> keys = newPatentHashMap.keySet();

		   	for (String key : keys) {
			   	String displayable = "";
			   	Object tmp = newPatentHashMap.get(key);
			   	if (tmp!=null) { 
			   		displayable = tmp.toString();
			   	}
		   	}
		   	
		   	
		   	// Process fields, one by one
		   	String value = "nevernever";
		   	LinkedHashMap<String, Object> notificationObjects = new LinkedHashMap<String, Object>();
		   	List<Notification> onNotifications = new ArrayList<Notification>();
		   	
		   	for (String key : keys) {
		   		value = "FAILED";
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
			   		patent.setFilingDate(itch);
			   	}
	
			   	if ("business".equals(key.trim())) {
			   		LinkedHashMap<String, Object> bob = (LinkedHashMap<String, Object>) ob;
			   		long bid = (Integer) bob.get("id");
			   		
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
			   	
			   	if ("lastRenewedYearEpo".equals(key.trim())) {
			   		
			   		
			   		Integer year = 0;
			   		if (ob instanceof Integer) {
			   			year = (Integer) ob;
			   		} 
			   		
				   	
			   		patent.setLastRenewedYearEpo(year);
			   	}
			   	
			   	if ("epoPatentStatus".equals(key.trim())) patent.setEpoPatentStatus(value);
			   	
			   	if ("renewalStatus".equals(key.trim())) patent.setRenewalStatus(value);
			   	
			   	if ("lastRenewedDateExEpo".equals(key.trim())) {
			   		
			   		Date itch = null;
			   		if(ob == null)
			   			patent.setLastRenewedDateExEpo(null);
			   		else if (ob instanceof Long) {
				   		itch = new Date((Long) ob);
			   		} 
			   		else {
			   			Long when = new Long((String) ob);
			   			itch = new Date(when);
			   		}
			   		
			   		patent.setLastRenewedDateExEpo(itch);
			   	}
			   	// & now other tweaks to keep Patent happy
			   	/*patent.setRenewalYear(-1);
			   	patent.setEpoPatentStatus("EMPTY");
			   	//patent.setRenewalStatus(RenewalStatusEnum.ABANDONED);
			   	patent.setRenewalStatus(RenewalStatusEnum.RENEWAL_IN_PLACE);*/
	
		   	
			   	// Now extract and populate the Notifications
			   	if ("notificationUIs".equals(key.trim())) {
				   	Object nob = newPatentHashMap.get(key); 
	
				   	ArrayList<Object> nobmap = (ArrayList<Object>) nob;
				   	
				   	for (Object nobkeyOb : nobmap) {
				   		String nobkey = nobkeyOb.toString(); 
	
				   		LinkedHashMap<String, Object> jsonNotificationFields = (LinkedHashMap<String, Object>) nobkeyOb;
					   	
				   		long nid = (Integer) jsonNotificationFields.get("id");
	
					   	Object defaultVal = jsonNotificationFields.get("defaultOn");
					   	Boolean onSoFar = (Boolean) defaultVal;
					   	
					   	Object ison = jsonNotificationFields.get("isOn");
				   		
					   	// Here's the devious bit
					   	// isOn is usually true or false. But If it is 0, this indicates it's been inverted (at least once - assume once)
					   	if (ison instanceof Integer) {
					   		onSoFar = ! onSoFar ;
					   	}
					   	
					   	Boolean isOn = (Boolean) ison;
					   	
					   	/*if(!isOn){
					   		onSoFar = false ;
					   	}*/
					 
					   	// & now - if selected - add to the ON list
					   	if (isOn) {
					   		Notification onny = Notification.findNotification(nid);
					   		onNotifications.add(onny);
					   	}
				   	}
				   	
	
				   	patent.setNotifications(onNotifications);
				   	for (Notification n : patent.getNotifications()) {
				   	}
			   	}
		   	}
	   		

		}catch (Exception e) {
			e.printStackTrace();
		}



   		return patent;
	}




	/**
	 * Created for development testing, but may be of use later for production use.
	 * @param commaSeparatedListOfIntegerNumbers eg: patent_id[1,2] - this format because UI cannot send an anonymous array
	 * @return List<Long>
	 */
	public List<Long> commaSeparatedListOfIntegerNumbersStrToListLongs(LinkedHashMap<String, Object> listOfIds) {
		// Created for development testing of Payments: API action 4.1, 4.2, 4.3.
		
		List<Long> result = new ArrayList<Long>();
		String err = "ExtractSubmittedDataEngine extractOrderedPatentIdList ";
		List<String> keys = new ArrayList<String>(listOfIds.keySet());
		/*if (commaSeparatedListOfIntegerNumbers==null) {
			err += " given invalid : "+commaSeparatedListOfIntegerNumbers;
			log().fatal(err);
			throw new P3SRuntimeException(err);
		}*/
		
		if(keys.size() != 1)
			return null;
		
		ArrayList<String> elements =  (ArrayList<String>) listOfIds.get(keys.get(0));
		/*System.out.println("   Next Element follows : ");
		for (String element : elements ) {
			System.out.println("   This element is : "+element);
			if (notEmpty(element)) {
				try {
					Long longy = new Long(element.trim());
					result.add(longy);
				}
				catch (NumberFormatException nfe) {
					// Either malicious or code error. To abort or ignore? Abort safest.
					logInternalError().fatal(err+"BadElement:"+element);
					throw new P3SRuntimeException(err+"BadElement:"+element, nfe);
				}
			}
		}*/
		
		if(! (elements.isEmpty())){
			for (String element : elements){
				if(element instanceof String){
					Long longy = new Long(element.trim());
					result.add(longy);
				}
			}
			
		}
		System.out.println(err+" completed. "+listOfIds+" has "+result.size()+" items.");
		
		return result;
	}

	
	public InBasket getBasketContentsFromCheckOutForm(Object obby){
		
		InBasket basket = new InBasket();
		
		try {

		   	LinkedHashMap<String, Object> basketObject = (LinkedHashMap<String, Object>) obby; 
		   	List<String> keys = new ArrayList<String>(basketObject.keySet());
		   	
		   	for(String key : keys){
		   		
		   		Object obValue = basketObject.get(key);
		   		String strValue = null;
				if(obValue instanceof String)
		   			strValue = (String)obValue;
		   		
		   		if("totalCostUSD".equals(key.trim())){
		   			if(obValue instanceof Double ){
		   				basket.setExpectedCost(BigDecimal.valueOf((Double) obValue));
		   			}
		   			else if (obValue instanceof Integer)
		   				basket.setExpectedCost(BigDecimal.valueOf((Integer) obValue));
		   		}
		   		
		   		
		   		
		   		if ("patent_ids".equals(key.trim())) {
		   			
		   			//LinkedHashMap<String, Object> listOfIds = (LinkedHashMap<String, Object>) obValue;
		   			if(! (obValue instanceof ArrayList<?>))
		   				throw new P3SRuntimeException("PaymentRestController : /rest-prepare-banktransfer/ getBasketContentsFromCheckOutForm() NOT passed Arraylist of patentids");
		   			ArrayList<Integer> elements =  (ArrayList<Integer>) obValue;
		   			
		   			/*List<Long> orderedPatentIds = new ArrayList<Long>();
		   			List<LinkedHashMap<String, Object>> patentsInBasket = (List<LinkedHashMap<String, Object>>) obValue;
		   			
		   			for(LinkedHashMap<String, Object> onePatentItem : patentsInBasket){
		   				Set<String> patentKeys = onePatentItem.keySet();
		   				for(String patentKey : patentKeys){
		   					Object onePatentItemValue = onePatentItem.get(patentKey);
		   					//saving only ID this time
			   				if("id".equals(patentKey.trim())){
			   					orderedPatentIds.add( Long.valueOf(((Integer) onePatentItemValue).longValue()));;
			   				}
		   				}
		   				
		   			}*/
		   			List<Long> orderedPatentIds = new ArrayList<Long>();
		   			if(! (elements.isEmpty())){
		   				//for (String element : elements){ this time passed as Integer
		   				for(Integer element : elements){
		   					if(element instanceof Integer){
		   						Long longy = new Long(element);
		   						orderedPatentIds.add(longy);
		   					}
		   				}
		   				
		   			}
		   			basket.setPatentIds(orderedPatentIds);;
			   	}
		   	}
		   	
		}
		catch (Exception e) {
			// TODO: handle exception
			//Class Cast Exception mostly
			System.out.println(e.getMessage());
		}
		
		return basket;
	}

	
	public InBasket getBasketContentsPreCommitForm(Object obby){
		
		InBasket basket = new InBasket();
		
		try {

		   	LinkedHashMap<String, Object> basketObject = (LinkedHashMap<String, Object>) obby; 
		   	List<String> keys = new ArrayList<String>(basketObject.keySet());
		   	
		   	for(String key : keys){
		   		
		   		Object obValue = basketObject.get(key);
		   		String strValue = null;
				if(obValue instanceof String)
		   			strValue = (String)obValue;
		   		
		   		if("totalCostUSD".equals(key.trim())){
		   			if(obValue instanceof Double ){
		   				basket.setExpectedCost(BigDecimal.valueOf((Double) obValue));
		   			}
		   			else if(obValue instanceof Integer){
		   				basket.setExpectedCost(BigDecimal.valueOf((Integer) obValue));
		   			}
		   		}

		   		if("billingStreet".equals(key.trim())){
	   				basket.setBillingStreet(strValue);
		   		}
		   		
		   		if("billingCity".equals(key.trim())){
	   				basket.setBillingCity(strValue);
		   		}
		   		
		   		if("billingState".equals(key.trim())){
	   				basket.setBillingState(strValue);
		   		}
		   		
		   		if("billingZip".equals(key.trim())){
		   			if(obValue instanceof Double || obValue instanceof Integer || obValue instanceof String){
		   				Long longy = Long.valueOf(obValue.toString());
		   				basket.setBillingZip(longy);
		   			}
		   		}
	   		
		   		if ("patent_ids".equals(key.trim())) {
		   			
		   			if(! (obValue instanceof ArrayList<?>))
		   				throw new P3SRuntimeException("PaymentRestController : /rest-prepare-banktransfer/ getBasketContentsFromCheckOutForm() NOT passed Arraylist of patentids");
		   			ArrayList<Integer> elements =  (ArrayList<Integer>) obValue;
		   			
		   			List<Long> orderedPatentIds = new ArrayList<Long>();
		   			if(! (elements.isEmpty())){
		   				for(Integer element : elements){
		   					if(element instanceof Integer){
		   						Long longy = new Long(element);
		   						orderedPatentIds.add(longy);
		   					}
		   				}
		   				
		   			}
		   			basket.setPatentIds(orderedPatentIds);;
			   	}
		   	}
		   	
		}
		catch (Exception e) {
			// TODO: handle exception
			//Class Cast Exception mostly
			System.out.println(e.getMessage());
		}
		
		
		return basket;
	}
}