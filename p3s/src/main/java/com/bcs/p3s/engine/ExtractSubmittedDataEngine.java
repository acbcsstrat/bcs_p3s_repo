package com.bcs.p3s.engine;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.Notification;
import com.bcs.p3s.model.NotificationMapping;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.security.SecurityUtil;
import com.bcs.p3s.util.lang.P3SRuntimeException;
import com.bcs.p3s.util.lang.Universal;
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

	protected static String NO_DATA = "NO DATA";
	
	
	public HashMap<String, Object> extractRegistrationForm(Object object){
		
		P3SUser user = new P3SUser();
		
		//LinkedHashMap<String, Object> newPatentHashMap = (LinkedHashMap<String, Object>) object.toString();
		ArrayList<LinkedHashMap<String, String>> newObj = (ArrayList<LinkedHashMap<String, String>>) object;
		HashMap<String, Object> contentMap = new HashMap<String, Object>();
		for(LinkedHashMap<String, String> eachNewObj : newObj){
			
			List<String> mapdata = new ArrayList<String>(eachNewObj.values());
			contentMap.put(mapdata.get(0), mapdata.get(1));
			
		}
		System.out.println(contentMap);
		
	   	return contentMap;
	}

	/**
	 * Extracting business details from contentMap
	 */
	public Business extractBusinessInfo(HashMap<String, Object> data){
		
		Business business = new Business();
		
		Iterator it = data.entrySet().iterator();
	    while (it.hasNext()) {
	    	String strValue = "";
	        Map.Entry pair = (Map.Entry)it.next();
	        Object value = pair.getValue();
	        
	        if(value instanceof String)
	        	strValue = (String) value;
	        
	        if("businessName".equals(pair.getKey()))
	        	business.setBusinessName(strValue);
	       
	        if("phoneNumber".equals(pair.getKey()))
	        	business.setPhoneNumber(strValue);
	        
	        if("timezone".equals(pair.getKey()))
	        	business.setTimezone(strValue);
	        
	        if("street".equals(pair.getKey()))
	        	business.setStreet(strValue);
	        
	        if("city".equals(pair.getKey()))
	        	business.setCity(strValue);
	        
	        if("USstate".equals(pair.getKey()))
	        	business.setUSstate(strValue);
	        
	        if("zip".equals(pair.getKey()))
	        	business.setZip(strValue);
	        
	        if("billingStreet".equals(pair.getKey()))
	        	business.setBillingStreet(strValue);
	        
	        if("billingCity".equals(pair.getKey()))
	        	business.setBillingCity(strValue);
	        
	        if("billingState".equals(pair.getKey()))
	        	business.setBillingState(strValue);
	        
	        if("billingZip".equals(pair.getKey()))
	        	business.setBillingZip(strValue);
	        
	    }
		return business;
		
	}

	
	/**
	 * Extracting user details from contentMap
	 */
	public P3SUser extractUserInfo(HashMap<String, Object> data){
			
		P3SUser user = new P3SUser();
			
			Iterator it = data.entrySet().iterator();
		    while (it.hasNext()) {
		    	String strValue = "";
		        Map.Entry pair = (Map.Entry)it.next();
		        Object value = pair.getValue();
		        
		        if(value instanceof String)
		        	strValue = (String) value;
		        
		        if("firstName".equals(pair.getKey()))
		        	user.setFirstName(strValue);
		       
		        if("lastName".equals(pair.getKey()))
		        	user.setLastName(strValue);
		        
		        if("new_password".equals(pair.getKey()))
		        	user.setPassword(strValue);
		        
		        if("password".equals(pair.getKey()))
		        	user.setPassword(strValue);
		        
		        if("emailAddress".equals(pair.getKey())) {
		        	user.setEmailAddress(strValue);
		        	if (strValue!=null) user.setEmailAddress(strValue.trim());
		        }
		        	
		        if("isEmailNotification".equals(pair.getKey())){
		        	if(value instanceof Boolean){
		        		Boolean boolValue = (Boolean) value;
		        		user.setIsEmailNotification(boolValue);
		        	}
		        }
		        
		    }
		    
		    return user;
	}
	
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

			//for (String key : keys) {
			//   	String displayable = "";
			//   	Object tmp = newPatentHashMap.get(key);
			//   	if (tmp!=null) { 
			//   		displayable = tmp.toString();
			//   	}
			//}
		   	
		   	
		   	// Process fields, one by one
		   	String value = "nevernever";
			//LinkedHashMap<String, Object> notificationObjects = new LinkedHashMap<String, Object>();
			//List<Notification> onNotifications = new ArrayList<Notification>();
		   	
		   	for (String key : keys) {
		   		//MP09022018 1351 Changing to NODATA if in case any of the values from EPO is null
		   		//value = "FAILED";
		   		value = NO_DATA;
			   	Object ob = newPatentHashMap.get(key);
			   	if (ob instanceof String) value = (String) ob;
			   	
			   	if ("patentApplicationNumber".equals(key.trim())) patent.setEP_ApplicationNumber(value);
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
			   		patent.setInternationalFilingDate(itch);
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
			   		if (ob==null || "NO DATA".equals(value)) patent.setClientRef("");
			   	}
			   	if ("shortTitle".equals(key.trim())) {
			   		patent.setShortTitle(value);
			   		if (ob==null || "NO DATA".equals(value)) patent.setShortTitle("");
			   	}
			   	if ("patentPublicationNumber".equals(key.trim())) patent.setEP_PublicationNumber(value);
			   	
			   	
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
			   	/**
			   	 * Added later 02/08/2018 - Renewal Instruction requires full EP Application number with check digit 
			   	 */
			   	if("checkDigit".equals(key.trim())) patent.setCheckDigit(value);
			   	
			   	/** 
			   	 * ADDED AFTER DAN'S MEETING 24/10/2017 - STORING IPC CODES AND REP DETAILS FOR FUTURE REFERENCE
			   	 */
			   	if ("ipcCodes".equals(key.trim())) patent.setIpcCodes(value);
			   	if ("representative".equals(key.trim())) patent.setRepresentative(value);
			   	
			   	// Added for v2.1 - E-PCT / Form1200
			   	
			   	if ("internationalFilingLang".equals(key.trim())) patent.setInternationalFilingLang(value);
			   	if ("pct_applicationNumber".equals(key.trim())) {
			   		if (NO_DATA.equals(value)) value = "";
			   		patent.setPCT_applicationNumber(value);	
			   	}
			   	if ("pct_publicationNumber".equals(key.trim())) {
			   		if (NO_DATA.equals(value)) value = "";
			   		patent.setPCT_publicationNumber(value);
			   	}

			   	
			   	if ("internationalSearchAuthority".equals(key.trim())) patent.setInternationalSearchAuthority(value);
			   	if ("designated_states".equals(key.trim())) patent.setDesignated_states(value);
			   	if ("epctStatus".equals(key.trim())) patent.setEpctStatus(value);
			   	if ("epctNotAvailableReason".equals(key.trim())) {
			   		// This field is not set (conciously) by the user. Set empty until determined otherwise
			   		patent.setEpctNotAvailableReason("");
			   	}
			   	if ("priorityDate".equals(key.trim())) {
			   		Date itch = null;
			   		if (ob instanceof Long) {
				   		itch = new Date((Long) ob);
			   		} 
			   		else if (ob instanceof String) {
			   			Long when = new Long((String) ob);
			   			itch = new Date(when);
			   		}
			   		patent.setPriorityDate(itch);
			   	}
			   	//if ("PCT_publishedDate".equals(key.trim())) {
				if ("pct_publishedDate".equals(key.trim())) {
			   		Date itch = null;
			   		if (ob instanceof Long) {
				   		itch = new Date((Long) ob);
			   		} 
			   		else {
			   			Long when = new Long((String) ob);
			   			itch = new Date(when);
			   		}
			   		patent.setPCT_publishedDate(itch);
			   	}
			   	
		   	}
	   		

		}catch (Exception e) {
			e.printStackTrace();
		}



   		return patent;
	}


	// This method Obsolete from v2.1 (as AddPatent no longer sets the email switches)
//	public List<NotificationMapping> OBSextractNotificationsFromAddPatentForm(Patent patent,Object obby) {  // acTidy
//		
//		List<NotificationMapping> mappings = new ArrayList<NotificationMapping>();
//		
//		
//		try {
//
//		   	LinkedHashMap<String, Object> newPatentHashMap = (LinkedHashMap<String, Object>) obby; 
//		   	Set<String> keys = newPatentHashMap.keySet();
//
//		   	for (String key : keys) {
//			   	String displayable = "";
//			   	Object tmp = newPatentHashMap.get(key);
//			   	if (tmp!=null) { 
//			   		displayable = tmp.toString();
//			   	}
//		   	}
//		   	
//		   	
//		   	// Process fields, one by one
//		   	String value = "nevernever";
//		   	LinkedHashMap<String, Object> notificationObjects = new LinkedHashMap<String, Object>();
//		   	
//		   	
//		   	for (String key : keys) {
//		
//				if ("notificationUIs".equals(key.trim())) {
//				   	Object nob = newPatentHashMap.get(key); 
//		
//				   	ArrayList<Object> nobmap = (ArrayList<Object>) nob;
//				   	
//				   	for (Object nobkeyOb : nobmap) {
//				   		String nobkey = nobkeyOb.toString(); 
//		
//				   		LinkedHashMap<String, Object> jsonNotificationFields = (LinkedHashMap<String, Object>) nobkeyOb;
//					   	
//				   		long nid = (Integer) jsonNotificationFields.get("id");
//		
//					   	Object defaultVal = jsonNotificationFields.get("defaultOn");
//					   	Boolean onSoFar = (Boolean) defaultVal;
//					   	
//					   	Object ison = jsonNotificationFields.get("isOn");
//				   		
//					   	// Here's the devious bit
//					   	// isOn is usually true or false. But If it is 0, this indicates it's been inverted (at least once - assume once)
//					   	if (ison instanceof Integer) {
//					   		onSoFar = ! onSoFar ;
//					   	}
//					   	
//					   	Boolean isOn = (Boolean) ison;
//					   	
//					   	if(!isOn){
//					   		onSoFar = false ;
//					   	}
//					 
//					   	// & now - if selected - add to the ON list
//					   	if (isOn) {
//					   		NotificationMapping eachMapping = new NotificationMapping();
//					   		eachMapping.setNotification_id(nid);
//					   		eachMapping.setPatent_id(patent.getId());
//					   		eachMapping.setUser_id(SecurityUtil.getMyUser().getId());
//					   		mappings.add(eachMapping);
//					   	}
//				   	}
//				   	
//		
//				   	
//				   	
//				}
//		   	}
//		}
//		catch(Exception e){
//			
//		}
//		
//		return mappings;
//	}
	




	/**
	 * @param commaSeparatedListOfIntegerNumbers eg: patent_id[1,2] - this format because UI cannot send an anonymous array
	 * @return List<Long>
	 */  // may be rendered obsolete by the temporary extractBasketRequestPatentIds()
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
			for (Object element : elements){
				if(element instanceof String){
					Long longy = new Long(((String) element).trim());
					result.add(longy);
				}
				if(element instanceof Integer){
					Long longy = new Long(((Integer) element));
					result.add(longy);
				}
			}
			
		}
		System.out.println(err+" completed. "+listOfIds+" has "+result.size()+" items.");
		
		return result;
	}
	// This intended to be a flexible ie temporary variant of commaSeparatedListOfIntegerNumbersStrToListLongs
	public List<Long> extractBasketRequestPatentIds(Object obby) {
		log().debug("Obb is of type "+obby.getClass().getName());
		// expecting List<Integer> but accept List<Long> & LinkedHashMap
		List<Long> listOfLongs = new ArrayList<Long>();
		List<Object> listOfNumbers = null;
		if ( obby instanceof LinkedHashMap<?, ?>) {
			LinkedHashMap<?,?> lhm = (LinkedHashMap<String, Object>) obby;
			Set<String> keys = (Set<String>) lhm.keySet();
			String aKey = null;
			for (String str : keys) { log().info("extractBasketRequestPatentIds SET contains element: "+str); aKey=str; }
			// what name to use
			listOfNumbers = (List<Object>) lhm.get(aKey);

			int kk=-1;
			for (Object obj : listOfNumbers) {
				if ( obj instanceof Integer) {
					kk = (Integer) obj;
					listOfLongs.add((long) kk);
				}
				else if (obj instanceof Long) 
					listOfLongs.add((Long) obj);
				else if (obj instanceof String) {
					Long lngObj = new Long( (String) obj);
					listOfLongs.add(lngObj);
				}
				else log().fatal("extractBasketRequestPatentIds run  got List - dat all {ex Linkedhashmop}" +obj.getClass().getName());
			}

			
		}
		else if ( obby instanceof List<?>) {
			listOfNumbers = (List<Object>) obby;
			int ii=-1;
			for (Object obj : listOfNumbers) {
				if ( obj instanceof Integer) {
					ii = (Integer) obj;
					listOfLongs.add((long) ii);
				}
				else if (obj instanceof Long) 
					listOfLongs.add((Long) obj);
				else log().fatal("extractBasketRequestPatentIds run  got List - dat all ");
			}
		}
		else if ( obby instanceof String) {
			throw new P3SRuntimeException("extractBasketRequestPatentIds cannot handle STRING : "+(String) obby);
		}
		else throw new P3SRuntimeException("extractBasketRequestPatentIds run out of options.");
		
		log().debug("extractBasketRequestPatentIds returning list of size "+listOfLongs.size());
		return listOfLongs;
	}

	/*
	 * Created for development testing of Payments: API suppressLoginMessages
	 */
	public List<Long> commaSeparatedListOfIntegerNumbersStrToListLongs(ArrayList<String> listOfIds) {
		
		List<Long> result = new ArrayList<Long>();
		String err = "ExtractSubmittedDataEngine extractOrderedPatentIdList ";
		
		if(! (listOfIds.isEmpty())){
			for (Object element : listOfIds){
				if(element instanceof String){
					Long longy = new Long(((String) element).trim());
					result.add(longy);
				}
				if(element instanceof Integer){
					Long longy = new Long(((Integer) element));
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
		   	
	   		log().debug("  'flexible' logging. CommitPurchase(assumed). Passed below keys:   thisFrom "+CLASSNAME+":getBasketContentsPreCommitForm()");
		   	for(String key : keys){
		   		log().debug("       thisKey is : "+key);

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

	   				String strZip = "";
		   			if(obValue instanceof String){
		   				strZip = (String) obValue;
		   			}
		   			else if(obValue instanceof Double || obValue instanceof Integer){ // This should be redundant now zip is a String. acTidy
		   				try {
		   					logErrorAndContinue("This code should be redundant now zip is a String. Remove code once proven unused");
		   					strZip = obValue.toString();
		   				} catch (NumberFormatException nfe) { // FE should prevent this. If occurs, survive
		   					logErrorAndContinue("Basket Billing Zipcode held non-numeric value : "+obValue.toString());
		   				}
		   			}
	   				basket.setBillingZip(strZip);

	   				
	   				
//		   			if(obValue instanceof Double || obValue instanceof Integer || obValue instanceof String){
//		   				Long longy ;
//		   				try {
//		   					longy = Long.valueOf(obValue.toString());
//		   				} catch (NumberFormatException nfe) { // FE should prevent this. If occurs, survive
//		   					longy = new Long(0);
//		   					logErrorAndContinue("Basket Billing Zipcode held non-numeric value : "+obValue.toString());
//		   				}
//		   				basket.setBillingZip(longy);
//		   			}

		   		
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

		   	
		   		log().debug("Another 'flexible' - should FE data not be packaged as expected. NOW basket.getBillingStreet() = "+basket.getBillingStreet() );
		   		if (basket.getBillingStreet()==null || isEmpty(basket.getBillingStreet())) {
			   		log().debug("   invoking another workaround - billingAddr dets NOT at top level - hope they are in an object called billingDetails");
			   		if("billingDetails".equals(key.trim())){
				   		log().debug("   so far so good - IS an obj called "+key);
				   		Object subObj = basketObject.get(key);
				   		log().debug("     xx subObj of type "+subObj.getClass().getName());

					   	LinkedHashMap<String, Object> subItems = (LinkedHashMap<String, Object>) subObj; 
				   		List<String> subkeys = new ArrayList<String>(subItems.keySet());

				   		// here - code copied verbatim from above) : nbar key -> xkey & obValue & strValue
		   			   	for(String xkey : subkeys){
		   			   		log().debug("       thisXKey is : "+xkey);

		   			   		Object xobValue = subItems.get(xkey);
		   			   		String xstrValue = null;
		   					if(xobValue instanceof String)
		   			   			xstrValue = (String)xobValue;
		   			   		
		   			   		if("billingStreet".equals(xkey.trim())){
		   		   				basket.setBillingStreet(xstrValue);
		   			   		}
		   			   		
		   			   		if("billingCity".equals(xkey.trim())){
		   		   				basket.setBillingCity(xstrValue);
		   			   		}
		   			   		
		   			   		if("billingState".equals(xkey.trim())){
		   		   				basket.setBillingState(xstrValue);
		   			   		}
		   			   		
		   			   		if("billingZip".equals(xkey.trim())){

		   		   				String strZip = "";
		   			   			if(xobValue instanceof String){
		   			   				strZip = (String) xobValue;
		   			   			}
		   			   			else if(xobValue instanceof Double || xobValue instanceof Integer){ // This should be redundant now zip is a String. acTidy
		   			   				try {
		   			   					logErrorAndContinue("This code should be redundant now zip is a String. Remove code once proven unused");
		   			   					strZip = xobValue.toString();
		   			   				} catch (NumberFormatException nfe) { // FE should prevent this. If occurs, survive
		   			   					logErrorAndContinue("xxBasket Billing Zipcode held non-numeric value : "+xobValue.toString());
		   			   				}
		   			   			}
		   		   				basket.setBillingZip(strZip);
		   			   		}
		   			   	} // End of loop thu SUB-keys
			   		}  // End of: if GROUP key is called billingDetails
		   		} // End of : billingAddr missing - resort to subKey ...

		   	}
		   	
		}
		catch (Exception e) {
			// TODO: handle exception
			//Class Cast Exception mostly
			System.out.println(e.getMessage());
		}
		
		
		return basket;
	}
	
	/**
	 * This method has been created for DELETE :: loginMessages/{ids} :- as FE sending anonymous array of ids
	 * @param ids
	 * @return
	 */
	public List<Long> commaSeparatedListOfStringToListLongs(List<String> ids) {
		
		String msg = "commaSeparatedListOfStringToListLongs(" + ids +")";
		List<Long> longIds = new ArrayList<Long>();
		
		for (String element : ids ) {
			if (notEmpty(element)) {
				try {
					Long longy = new Long(element.trim());
					longIds.add(longy);
				}
				catch (NumberFormatException nfe) {
					// Either malicious or code error. To abort or ignore? Abort safest.
					logInternalError().fatal(msg+"BadElement:"+element);
					throw new P3SRuntimeException(msg+"BadElement:"+element, nfe);
				}
			}
		}
		return longIds;
		
	}
}