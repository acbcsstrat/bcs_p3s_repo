package com.bcs.p3s.service;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;
import java.util.TreeMap;

import javax.persistence.TypedQuery;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.stereotype.Service;

import com.bcs.p3s.display.CostAnalysisData;
import com.bcs.p3s.display.Form1200FeeUI;
import com.bcs.p3s.display.FxRateCurrentUI;
import com.bcs.p3s.display.FxRateUI;
import com.bcs.p3s.display.NotificationUI;
import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.display.PatentV2UI;
import com.bcs.p3s.display.RenewalDates;
import com.bcs.p3s.display.RenewalFeeUI;
import com.bcs.p3s.display.RenewalUI;
import com.bcs.p3s.display.form1200.CostAnalysisDataForm1200;
import com.bcs.p3s.engine.CostAnalysisDataEngine;
import com.bcs.p3s.engine.EpctEngine;
import com.bcs.p3s.engine.PatentStatusEngine;
import com.bcs.p3s.engine.PostLoginDataEngine;
import com.bcs.p3s.enump3s.RenewalColourEnum;
import com.bcs.p3s.enump3s.RenewalStatusEnum;
import com.bcs.p3s.model.ArchivedRate;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.Form1200Fee;
import com.bcs.p3s.model.RenewalFee;
import com.bcs.p3s.model.GlobalVariableSole;
import com.bcs.p3s.model.Notification;
import com.bcs.p3s.model.NotificationMapping;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.model.Renewal;
import com.bcs.p3s.scrape.model.Form1200Record;
import com.bcs.p3s.scrape.service.EPOAccess;
import com.bcs.p3s.scrape.service.EPOAccessImpl;
import com.bcs.p3s.security.SecurityUtil;
import com.bcs.p3s.session.PostLoginSessionBean;
import com.bcs.p3s.util.date.DateUtil;
import com.bcs.p3s.util.lang.P3SRuntimeException;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.wrap.CombinedFee;
import com.bcs.p3s.wrap.PatentExtendedData;

@Service("PatentService")
public class PatentServiceImpl extends ServiceAuthorisationTools implements PatentService {

	/*
	 * @Autowired HttpSession session;
	 */

	protected String PREFIX = this.getClass().getName() + " : ";

	public PatentServiceImpl(HttpSession session) {
		super();
		this.session = session;
	}

	public Patent persistPatent(Patent patent) {

		String msg = PREFIX + "persistPatent(" + patent + ") ";
		log().debug("invoked " + msg);
		Patent newPatent = null;
		if (!(patent == null))
			newPatent = patent.persist();
		return newPatent;
	}

	// Start of - the methods which implement the prototypes in the Interface

	public List<PatentUI> listAllPatentUIsForMyBusiness() {

		String err = PREFIX + "listAllPatentUIsForMyBusiness() ";
		checkNoActionRequired(err);

		log().debug(err + " invoked ");

		List<Patent> patents = listAllPatentsForMyBusiness();
		List<PatentUI> patentUIs = new ArrayList<PatentUI>();
		for (Patent patent : patents) {
			// PatentUI patentUI = new PatentUI(patent);
			PatentUI patentUI = populateDataToPatentUI(patent);
			patentUIs.add(patentUI);
		}
		return patentUIs;
	}

	public PatentUI searchEpoForPatent(String patentApplicationNumber, PostLoginSessionBean postSession) {

		String err = PREFIX + "searchEpoForPatent(" + patentApplicationNumber + ") ";
		PatentUI patentUI = null;

		log().debug(err + " invoked ");

		checkNotNull(patentApplicationNumber, err);
		// checkEPNumberFormat(patentApplicationNumber, err);

		// patentApplicationNumber =
		// validateAndFormatApplicationNumber(patentApplicationNumber); - this method
		// being called as part of PRECHECK1

		// checking whether patent being added for the business - this method being
		// called as part of PRECHECK2
		/*
		 * TypedQuery<Patent> patents =
		 * Patent.findPatentsByBusiness(postSession.getBusiness()); for(Patent patent :
		 * patents.getResultList()){
		 * if(patentApplicationNumber.equals(patent.getPatentApplicationNumber())){
		 * log().debug("Duplicate for the patent for the business. Patent Number[" +
		 * patentApplicationNumber + "] already exist for the business. " +
		 * "		Patent id[" +patent.getId() +"] and application number[" +
		 * patent.getPatentApplicationNumber() +"]" ); return patentUI; } }
		 */

		Patent patent = new Patent();

		/**
		 * Call to EPOAccess service class for retrieving EPO data **
		 * 
		 */
		EPOAccess epo = new EPOAccessImpl();
		patent = epo.readEPORegisterForRenewals(patentApplicationNumber);

		if (patent == null) {
			return patentUI;
		}
		patent.setBusiness(postSession.getBusiness());

		/**
		 * CALL TO PatentStatusEngine PROCESSING ENGINE CALCULATES THE RENEWAL YEAR AND
		 * RENEWAL STATUS FOR THE NEWLY ADDED PATENT
		 *//*
			 * PatentStatus renewalInfo = new PatentStatus(); renewalInfo = new
			 * PatentStatusEngine().getRenewalInfo(patent);
			 * 
			 * 
			 * patent.setRenewalStatus(renewalInfo.getCurrentRenewalStatus());
			 * patent.setRenewalYear(renewalInfo.getActiveRenewalYear());
			 */

		// Create default notifications
		/*
		 * patent.setNotifications(new ArrayList<Notification>()); List<Notification>
		 * allNotifications = Notification.findAllNotifications(); for (Notification
		 * anotification : allNotifications) { if (anotification.getDefaultOn())
		 * patent.getNotifications().add(anotification); }
		 */

		/**
		 * CALL TO Cost Calculation Engine
		 * 
		 */
		PatentExtendedData extendedData = new PatentExtendedData();
		extendedData = new PatentStatusEngine().getExtendedDataForNewPatent(patent);

		patent.setRenewalYear(extendedData.getActiveRenewalYear());
		patent.setRenewalStatus(extendedData.getCurrentRenewalStatus());

		if (postSession.getExtendedPatentUI() == null) {
			List<PatentExtendedData> firstData = new ArrayList<PatentExtendedData>();
			firstData.add(extendedData);
			postSession.setExtendedPatentUI(firstData);
		} else {

			List<PatentExtendedData> allData = postSession.getExtendedPatentUI();
			allData.add(extendedData);
			postSession.setExtendedPatentUI(allData);
		}
		session.setAttribute("postSession", postSession);

		// PatentPlace v2.1 - Now scrape EPO data for Form1200 data, & add to patent
		Form1200Record form1200 = epo.readEPORegisterForForm1200(patentApplicationNumber);
		if (form1200 == null)
			return null;
		combinePatentDetails(patent, form1200);

		patentUI = populateDataToPatentUI(patent);
		return patentUI;
	}

	/**
	 * The JSON file for PatentUI (i.e. the *UI) needs ALL the notifications - and,
	 * for each, whether it is on or off. patent.notifications just holds those that
	 * are ON.
	 * 
	 * Approach used below: Get ALL into SortSet. Replace those that are ON. Sorted
	 * by display order
	 * 
	 * @param notifications
	 */
	public synchronized List<NotificationUI> createNotificationUIs(List<Notification> notifications) {

		String err = PREFIX + "createNotificationUIs() ";
		checkNoActionRequired(err); // because such data is not sensitive. Is anonymous

		log().debug(err + " invoked ");

		List<NotificationUI> allNotificationUIs = new ArrayList<NotificationUI>();

		// Assemble ALL notificationUIs (identifiable by ID)
		List<Notification> allNotifications = Notification.findAllNotifications();
		for (Notification anotification : allNotifications) {
			NotificationUI notificationUI = new NotificationUI(anotification);
			allNotificationUIs.add(notificationUI);
		}

		// In below code:
		// indexOf relies on equals() in NotificationUI
		// Sorting relies on compareTo() in NotificationUI

		// Switch ON as appropriate
		for (Notification notification : notifications) { // i.e. each ON notification
			NotificationUI matchTarget = new NotificationUI(notification);

			// find existing match, & switch on
			int imatch = allNotificationUIs.indexOf(matchTarget);
			// if (imatch == -1) fail("NotificationUI handling has failed.");
			if (imatch == -1) {
				Universal universal = new Universal();
				universal.fail("NotificationUI handling has failed.");
			}
			NotificationUI match = allNotificationUIs.get(imatch);
			match.setIsOn(true);
		}

		// Sort of displayOrder (for UI convenience)
		Collections.sort(allNotificationUIs);

		// System.out.println("acdebug - *ALL* notificationUIs after processing");
		// for (NotificationUI notificationUI : allNotificationUIs) {
		// System.out.println(" "+notificationUI.getId()+",
		// "+notificationUI.getIsOn()+", "+notificationUI.getDisplayOrder()+",
		// "+notificationUI.getTitle());
		// }
		return allNotificationUIs;
	}

	public Patent findById(long id) {

		String err = PREFIX + "findById(" + id + ") ";
		checkThisIsMyPatent(id, err);

		log().debug(err + " invoked ");

		Patent patent = null;
		if (session == null)
			logInternalError().fatal(err + "has empty session");
		else {
			PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
			Business usersBusiness = pLoginSession.getBusiness();
			patent = Patent.findPatent(new Long(id));
			if (patent == null)
				logInternalError().warn(err + "finds no matching patent. {url rewriting?}");
			else {
				if (patent.getBusiness().getId() != usersBusiness.getId())
					logM().warn(err + " rqsted by userId" + pLoginSession.getUser().getId());
			}
		}
		return patent;
	}

	public void deletePatentById(long id) {

		String err = PREFIX + "deletePatentById(" + id + ") ";
		checkThisIsMyPatent(id, err);

		log().debug(err + " invoked ");

		try {
			Patent patent = Patent.findPatent(id);

			/**
			 * Added later 06/02/2018 Prevent user from deleting a patent when there is any
			 * COMPLETED Renewal being made via P3S. So all the below code corresponding to
			 * cascade delete become redundant. Commenting lines below
			 */
			// cascade delete not working .So manually deleting all the foreign references
			// to this patent
			/*
			 * TypedQuery<Renewal> q = Renewal.findRenewalsByPatent(patent); List<Renewal>
			 * renewals = q.getResultList();
			 * log().debug("Cascade deleting all the foreign key references for patent");
			 * 
			 * for(Renewal renewal : renewals){ List<Renewal> rens =
			 * renewal.getActivePaymentId().getRenewals(); for(Renewal ren : rens){ if(ren
			 * .equals(renewal)){ rens.remove(ren); break; } }
			 * renewal.getActivePaymentId().setRenewals(rens); renewal.remove(); }
			 */

			/**
			 * SEPARATELY DELETE ALL THE MAPPINGS FOR THAT PATENT
			 */
			NotificationMapping.deleteAllMappingsForPatent(patent.getId());

			/**
			 * FINALLY ITS SAFE TO DELETE THE PATENT
			 */
			patent.remove();

		} catch (JpaSystemException e) {
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Stacktrace was: " + errors.toString());

		} catch (Exception e) {
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("Stacktrace was: " + errors.toString());

		}
	}

	// The patentUI parameter MAY be provided as a PatentUI, or more likely a
	// LinkedHashMap, so, here, accept either
	// v2.1 : No longer receives notificationUIs parameter 
	public Patent flexibleUpdatePatent(long id, Object untypedPatentUI) {

		String err = PREFIX + "flexibleUpdatePatent(" + id + ") ";

		// Re: check*() safety - Unusually (& Scarily!) do not check*() YET
		// First identify parameter TYPE. THEN check. But ensure safety checks ARE
		// performed

		// Meanwhile: Do what we can, for now
		if (untypedPatentUI instanceof PatentUI) {
			checkUpdatePatent(id, (PatentUI) untypedPatentUI, err);
		} else if (untypedPatentUI instanceof LinkedHashMap) {
			checkThisIsMyPatent(id, err);
			checkNotNull(untypedPatentUI, err);
			// Further check*()s to be performed!
		} else
			failInternalError(
					"flexibleUpdatePatent() passed unexpected objectType = " + untypedPatentUI.getClass().getName());

		log().debug(err + " invoked. param untypedPatentUI is of type "+untypedPatentUI.getClass().getName());
		Patent updatedPatent = findById(id);

		try {
			PatentUI patentUI = null;

			if (untypedPatentUI instanceof PatentUI) {
				patentUI = (PatentUI) untypedPatentUI;

				updatedPatent.setClientRef(patentUI.getClientRef());
				updatedPatent.setShortTitle(patentUI.getShortTitle());
			} else {
				// Retrieve the required data from the LinkedHashMap
				LinkedHashMap<?, ?> data = (LinkedHashMap<?, ?>) untypedPatentUI;
				String clientRef = (String) data.get("clientRef");
				String shortTitle = (String) data.get("shortTitle");
				// Now apply that data
				updatedPatent.setClientRef(clientRef);
				updatedPatent.setShortTitle(shortTitle);

				// NOW ! - can perform the remaining check - which was:
				// checkIsTrue((patentUI.getId().longValue()==id), err) &
				Integer ID = (Integer) data.get("id");
				if (ID.longValue() != id)
					failInternalError(err + "  [on check id=id]");
			}

			updatedPatent.merge();

		} catch (Exception e) {
			// this catch here as (a) cannot yet PROVE this code *&* (b) cannot trust
			// exception to appear if thrown
			System.out.println("PatentServiceImpl flexibleUpdatePatent() SUFFERED WATCHDOG WRAPPER EXCEPTION "); // acTidy
																													// once
																													// exception
																													// logging
																													// issue
																													// fixed
			System.out.println(e.getMessage());
			e.printStackTrace();
			throw new P3SRuntimeException("flexibleUpdatePatent("+id+") failed.",e);
		}
		return updatedPatent;
	}

	// much of below is cautious debug, awaiting discovery of what entity types the
	// FE provides (LinkedHashMap etc..)
	public void srvUpdateTypedNotifications(long patentId, Object objListNotificationUIs, String productType) {

		String err = PREFIX + "srvUpdateTypedNotifications(" + patentId + ",obj,"+productType+") ";
		log().debug(err + " invoked ");

		checkThisIsMyPatent(patentId, err);
		checkNotNull(objListNotificationUIs, err);
		checkNotNull(productType, err);

		if (objListNotificationUIs == null)
			fail("objListNotificationUIs is null");
		else
			log().debug("objListNotificationUIs is of type: " + objListNotificationUIs.getClass().getName()+" : from "+err);

		if (!(objListNotificationUIs instanceof List))  // is ArrayList. Would be LinkedHashMap if >1 payload
			fail(err + " passed unexpected objectType = "
					+ objListNotificationUIs.getClass().getName());
		else {

			//log().debug(CLASSNAME + "srvUpdateRenewalNotifications has determined top object IS ArrayList");
			//log().debug(CLASSNAME + "srvUpdateRenewalNotifications : NOW LIST ALL KEYS"); // acDebug
			//Set<Object> ppp = data.keySet();
			//for (Object ooo : ppp) {
			//	String sss = "NotString";
			//	if (ooo instanceof String)
			//		sss = (String) ooo;
			//	else
			//		sss = "NotString: is: " + ooo.getClass().getName();
			//	log().debug(CLASSNAME + "srvUpdateRenewalNotifications : Key:  " + sss);
			//}
			//log().debug(CLASSNAME
			//		+ "srvUpdateRenewalNotifications : That was all the keys. Hope was one callewd 'notificationUIs'");
			//
			//Object obb = data.get("notificationUIs");
			//List<NotificationUI> newNotificationUIs = extractNotificationUIs(obb);
			//log().warn("NEED THIS: notificationUIs.size() = " + newNotificationUIs.size()
			//		+ "    nEEDED : If OnOnly, we must NOT assert 5+ items");
			//// if (notificationUIs.size() < 5 ) failInternalError(err+" [only
			//// "+notificationUIs.size()+" notificationUIs provided. Should be 5+]");
			//// unless we only get the ON ones ....
			//
			//// Assemble all existing mappings and all new-mappings specified. From these,
			//// cancel overlaps, and prepare mappingsToDelete & mappingsToCreate
			//// Remember: NotificationMapping only exist for ON notifications

			List<Object> arrObj = (List<Object>) objListNotificationUIs;
			List<NotificationUI> newNotificationUIs = new ArrayList<NotificationUI>();
			for (Object ooo : arrObj) {
				if (ooo instanceof NotificationUI && ((NotificationUI)  ooo).getIsOn() ) newNotificationUIs.add( (NotificationUI) ooo );
				else if (ooo instanceof LinkedHashMap) { tryExtractOnNotificationUI(ooo, newNotificationUIs); }
				else fail("Given a List, but not List<NotificationUI>. 1st item is "+ooo.getClass().getName()+"    : from "+err);
			}
			
			
			
			P3SUser me = SecurityUtil.getMyUser();

			// Can now perform a further check on the data submitted. Data consistency.
			checkNotificationsAreValidSet(newNotificationUIs, productType, err);
			
			
			
			List<NotificationMapping> existingMappings = NotificationMapping.findAllOnNotificationMappings(patentId, me.getId());
			// & already got: List<NotificationUI> newNotificationUIs

			List<Long> existingNotificationIdsForProductType = new ArrayList<Long>();
			for (NotificationMapping mapping : existingMappings) {
				Notification notification = Notification.findNotification(mapping.getNotification_id()); 
				if (notification.getProductType().equals(productType))
					existingNotificationIdsForProductType.add(mapping.getNotification_id());
			}

			List<NotificationMapping> notificationMappingsToCreate = new ArrayList<NotificationMapping>();
			for (NotificationUI nui : newNotificationUIs) {
				Long thisLong = nui.getId();
				NotificationMapping nnm = new NotificationMapping(patentId, me.getId(), thisLong);
				if (existingNotificationIdsForProductType.contains(thisLong)) {
					// already got it, so remove from delete list
					existingNotificationIdsForProductType.remove(thisLong);
				} else {
					// Is new, so add to create list
					notificationMappingsToCreate.add(nnm);
				}
			}

			// Now make the db changes
			//NotificationMapping.deleteNotificationMappings(existingNotificationIdsForProductType);
			NotificationMapping.deleteNotificationMappingsByNotification(existingNotificationIdsForProductType, patentId, me.getId());
			NotificationMapping.addMappings(notificationMappingsToCreate);
		}
	}
	protected void tryExtractOnNotificationUI(Object ooo, List<NotificationUI> newNotificationUIs) {
		String err = CLASSNAME+" :tryExtractOnNotificationUI()  : ";
		// This is development - being 'flexible' - acTidy once we know what to expect
		// Firstly - list whatever content ooo has
		log().debug("  The elements within the LinkedHashfollow: ");
		LinkedHashMap<?, ?> data = (LinkedHashMap<?, ?>) ooo;
		Set<Object> obKeys = (Set<Object>) data.keySet();
		for (Object obKey : obKeys) { 
			if (obKey instanceof String) { 
				String str = (String) obKey;
				log().debug("    The TITLE of this key is "+str);
				Object val = data.get(str);  // for notificationName, val is null, causing NPE
				if (val==null) log().warn("val (for key "+str+"); is NULL !!");
				else {
					log().debug("    key("+str+") has value of type "+val.getClass().getName());
					if (val instanceof String) log().debug("    key("+str+") has Str value of "+ (String) val);
					if (val instanceof Integer) log().debug("    key("+str+") has Int value of "+ (Integer) val);
					if (val instanceof Long) log().debug("    key("+str+") has Lng value of "+ (Long) val);
					if (val instanceof Double) log().debug("    key("+str+") has Dbl value of "+ (Double) val);
					if (val instanceof Boolean) log().debug("    key("+str+") has Bln value of "+ (Boolean) val);
					if (val instanceof Number) log().debug("    key("+str+") has Num value of "+ (Number) val);
				}
			} else log().error("      Even the TITLE of this key isnt a string. Its a "+obKey.getClass().getName());
		}

		// Now attempt extract the data. Avoid Crash if fails - acTodo z2.1
		boolean backstopIsOnReceived = false;
		try {
			NotificationUI notificationUI = new NotificationUI(new Notification());
			Set<String> strKeys = (Set<String>) data.keySet(); 
			Object ob = null;
			for (String thisElement : strKeys) {
				log().debug("   ... processing item ... = "+thisElement);
				ob = data.get(thisElement);
				
				try {
				switch (thisElement) {
					case "title":	String strTitle = (String) ob;
									log().debug("             setting title to "+strTitle);
									notificationUI.setTitle(strTitle);
									break;
	
					case "isOn":	Boolean blIsOn = (Boolean) ob;
									log().debug("             setting isOn to "+blIsOn);
									notificationUI.setIsOn(blIsOn);
									backstopIsOnReceived = true;
									break;	

					case "id":		Long lngId = intLongObj2long(ob);
									log().debug("             setting id to "+lngId);
									notificationUI.setId(lngId);
									break;

					case "notificationName":	String strNotificationName = (String) ob;
									log().debug("             setting notificationName to "+strNotificationName);
									notificationUI.setNotificationName(strNotificationName);
									break;

					case "productType":	String strProductType = (String) ob;
									log().debug("             setting productType to "+strProductType);
									notificationUI.setProductType(strProductType);
									break;
					
					default:		log().warn("Hit Default with key="+thisElement+"     from "+err);

				}
				} catch (Exception e) { logErrorAndContinue("Crash whilst casting/extracting notification data : from "+err, e); }
			}

			// Tmp dev check
			if (!backstopIsOnReceived) notificationUI.setIsOn(true); // so we get SOMETHING
			log().debug("Just assemebled from FE a NotificationUI. Is "+notificationUI.toString());
			

			if (notificationUI.getIsOn()) { 
				newNotificationUIs.add( notificationUI ); 
			}
		} catch (Exception e) { logErrorAndContinue("Crash whilst casting/extracting notification data (Compiler says unreachable): from "+err, e); }
	}
	protected long intLongObj2long(Object ob) {
		long result = 0;
		if (ob instanceof Long) result = (Long) ob;
		else if (ob instanceof Integer) {
			int intOb = (Integer) ob;
			result = intOb;
		}
		else if (ob instanceof String) {
			result = Long.valueOf((String) ob);
		}
		else {
			log().error("intLongObj2long() given incompatible :  (ob==null)="+(ob==null)+"   from "+CLASSNAME);
			log().error("intLongObj2long() & ob was of type "+ob.getClass().getName());
		}
		return result;
	}
	
	
	

	public FxRateCurrentUI getCurrentFxRate() {

		String err = PREFIX + "getCurrentFxRate() ";
		checkNoActionRequired(err);

		log().debug(err + " invoked ");

		// Todays rate
		FxRateUI todaysRate = new FxRateUI();
		GlobalVariableSole current = GlobalVariableSole.findOnlyGlobalVariableSole();
		todaysRate.setRate(current.getCurrent_P3S_rate());
		todaysRate.setRateActiveDate(current.getCurrentRateActiveDate());

		// The previous rate
		FxRateUI lastRate = new FxRateUI();
		ArchivedRate previous = ArchivedRate.findLatestArchivedRate();
		lastRate.setRate(previous.getFxRate_P3s());
		// To convert archived date to active date, substract one day (isGoodEnuf)
		final long ONEDAY = 24 * 3600 * 1000;
		lastRate.setRateActiveDate(new Date((previous.getArchivedDate()).getTime() - ONEDAY));

		FxRateCurrentUI fxRateCurrentUI = new FxRateCurrentUI();
		fxRateCurrentUI.setCurrentFXRate(todaysRate);
		fxRateCurrentUI.setLastFXRate(lastRate);

		return fxRateCurrentUI;
	}

	public List<FxRateUI> getFxRateHistory(String timeperiod) {

		String err = PREFIX + "getFxRateHistory(" + timeperiod + ") ";
		checkNoActionRequired(err);

		// List<ArchivedRate> archivedRateForPeriod = new ArrayList<ArchivedRate>();

		log().debug(err + " invoked ");

		List<FxRateUI> history = new ArrayList<FxRateUI>();
		int numdays = period2days(timeperiod);
		if (numdays < 1)
			return history;

		GlobalVariableSole tmp1 = GlobalVariableSole.findOnlyGlobalVariableSole();
		/*
		 * DummyDataEngine dummy = new DummyDataEngine(); List<FxRateUI> badData =
		 * dummy.makeDummyFxRateHistory(tmp1.getCurrent_P3S_rate(),
		 * tmp1.getCurrentRateActiveDate(), numdays);
		 */

		// Todays rate
		FxRateUI todaysRate = new FxRateUI();
		GlobalVariableSole current = GlobalVariableSole.findOnlyGlobalVariableSole();
		BigDecimal formatted = current.getCurrent_P3S_rate();
		// formatted = formatted.setScale(4, BigDecimal.ROUND_HALF_UP);
		todaysRate.setRate(formatted);
		todaysRate.setRateActiveDate(current.getCurrentRateActiveDate());
		history.add(todaysRate);

		List<ArchivedRate> archivedRateList = ArchivedRate.findAllArchivedRates();
		Collections.reverse(archivedRateList);

		for (ArchivedRate eachDay : archivedRateList) {
			if (history.size() >= numdays) {
				log().debug(err + " returning fx rate history with size " + history.size());

				return history;
				// break;
			}
			FxRateUI rateUI = new FxRateUI();
			rateUI.setRate(eachDay.getFxRate_P3s());
			rateUI.setRateActiveDate(new DateUtil().addDays(eachDay.getArchivedDate(), -1));
			// archivedRateForPeriod.add(eachDay);
			history.add(rateUI);
		}

		log().debug(err + " returning fx rate history with size " + history.size());

		return history;

	}

	
	@Override
	public CostAnalysisData getCostAnalysisData(long id) {

		String msg = PREFIX + "getCostAnalysisData(" + id + ") ";
		log().debug(msg + " invoked for patent id " + id);
		CostAnalysisDataEngine costEngines = new CostAnalysisDataEngine();
		CostAnalysisData caData = new CostAnalysisData();

		boolean renewedByP3S = false; // a boolean value to determine whether current renewal done from our system

		RenewalDates allDates = new RenewalDates();
		Patent patent = Patent.findPatent(id);
		System.out.println("Got the new patent with filing date as " + patent.getInternationalFilingDate());
		log().debug("Queried database for patent id " + id + " and got hte filing date as "
				+ patent.getInternationalFilingDate());

		/**
		 * Checking whether patent year > 20
		 */
		if (patent.getRenewalYear() > 20) {
			caData.setCurrentcostBand(RenewalColourEnum.GREY);
			// caData.setGreenStartDate(allDates.getNextWindowOpenDate());
			return caData;
		}

		/**
		 * Check whether current business has got any reduced Fees. If so get the
		 * discounted rates ( PROCESSING FEE, EXPRESS FEE, URGENT FEE AND LATE PAY
		 * PENALTY ) Else get the actual P3SFEESOLE entries
		 **/
		CombinedFee combinedFee = costEngines.getFeeObj(patent);

		try {
			allDates = costEngines.getRenewalWindowDates(patent);
		} catch (ParseException e) {

			e.printStackTrace();
		}

		if (allDates == null) {

			log().debug("CostAnalysisDataEngine getRenewalWindowDates(patent) for renewal status "
					+ patent.getRenewalStatus() + " returned null");
			log().fatal("CostAnalysisDataEngine getRenewalWindowDates(patent) for renewal status "
					+ patent.getRenewalStatus() + " returned null");
			return null;
		}

		/**
		 * Commenting below code as FE displays only the next renewal open date when the
		 * status is RENEWAL IN PLACE
		 */
		/*
		 * if(RenewalStatusEnum.RENEWAL_IN_PLACE
		 * .equalsIgnoreCase(patent.getRenewalStatus())){
		 *//**
			 * 
			 * Calculate the actual renewal due date and window close and open dates --
			 * method call here
			 */
		/* acTodo z2.1 huge cleanup here once proven ...
		 * log().debug("Renewal In Place status for the patent");
		 * 
		 * //check whether the renewal has been done from our system TypedQuery<Renewal>
		 * q = Renewal.findRenewalsByPatent(patent); if(q.getResultList() == null){
		 * log().
		 * debug("No renewals for this patent being made from our system for the current patent"
		 * );
		 * System.out.println("No renewals for this patent being made from our system");
		 * 
		 * System.out.
		 * println("Check whether renewal window still opened for the current renewal year. "
		 * + "If " + "so show price for todays rate " + "else " +
		 * "Show price for the green period for next year renewal"); } else{ //loop for
		 * renewal being made
		 * 
		 * System.out.println("Total number of renewals being made from our system " +
		 * q.getResultList().size()); System.out.
		 * println("Now need to find whether any renewal made for the current renewal year"
		 * ); System.out.println("Iterate through the renewals list");
		 * 
		 * List <Renewal> renewals = q.getResultList(); for(Renewal renewal : renewals){
		 * if(renewal.getRenewalYear() == patent.getRenewalYear()){ //renewal being made
		 * for the current year from our system renewedByP3S = true;
		 * 
		 * System.out.
		 * println("Check whether renewal window still opened for the current renewal year. "
		 * + "If " + "so show price for todays rate " + "else " +
		 * "Show price for the next year renewal");
		 * 
		 * if(allDates.isRenewalWindowStillOpened()){
		 * System.out.println("Renewal window still opened");
		 * System.out.println("Show price for current phase");
		 * log().debug("Renewal window still opened. Show price for current phase");
		 * caData = costEngines.getAllPhasesInfo(allDates); caData =
		 * costEngines.getAllCosts(caData,combinedFee.getP3sFee(),combinedFee.getEpoFee(
		 * ),combinedFee.getFxRate());
		 * caData.setCurrentcostBand(costEngines.getCurrentPhase(caData));
		 * //caData.setFee(costEngines.getCurrentPhaseCost(caData.getCurrentcostBand(),
		 * combinedFee.getP3sFee(),combinedFee.getEpoFee(),combinedFee.getFxRate()));
		 * Fee fee =
		 * costEngines.getCurrentPhaseCost(caData.getCurrentcostBand(),combinedFee.
		 * getP3sFee(),combinedFee.getEpoFee(),combinedFee.getFxRate());
		 * caData.setFee(new FeeUI(fee)); } else{
		 * System.out.println("Renewal window closed"); System.out.
		 * println("Show price for green period for next renewal year [Green period]");
		 * caData = costEngines.getNextPhasesInfo(allDates);
		 * combinedFee.getEpoFee().setRenewalYear(patent.getRenewalYear()+1);
		 * combinedFee.setEpoFee(EpoFee.findEpoFeesByRenewalYear(combinedFee.getEpoFee()
		 * )); caData =
		 * costEngines.getAllCosts(caData,combinedFee.getP3sFee(),combinedFee.getEpoFee(
		 * ),combinedFee.getFxRate());
		 * caData.setCurrentcostBand(RenewalColourEnum.GREEN);
		 * //caData.setFee(costEngines.getCurrentPhaseCost(caData.getCurrentcostBand(),
		 * combinedFee.getP3sFee(),combinedFee.getEpoFee(),combinedFee.getFxRate()));
		 * Fee fee =
		 * costEngines.getCurrentPhaseCost(caData.getCurrentcostBand(),combinedFee.
		 * getP3sFee(),combinedFee.getEpoFee(),combinedFee.getFxRate());
		 * caData.setFee(new FeeUI(fee)); } }
		 * 
		 * }
		 * 
		 * if(!renewedByP3S){ System.out.
		 * println("Renewal made for the current year but from a different system");
		 * System.out.
		 * println("Check whether renewal window still opened for the current renewal year. "
		 * + "If " + "so show price for the green period " + "else " +
		 * "Show price for the green period for next year renewal");
		 * if(allDates.isRenewalWindowStillOpened()){
		 * System.out.println("Renewal window still opened");
		 * System.out.println("Show price for green period for this renewal year");
		 * caData = costEngines.getAllPhasesInfo(allDates); caData =
		 * costEngines.getAllCosts(caData,combinedFee.getP3sFee(),combinedFee.getEpoFee(
		 * ),combinedFee.getFxRate());
		 *//**
			 * SET THE COLOR AS GREEN
			 *//*
				 * caData.setCurrentcostBand(RenewalColourEnum.GREEN);
				 * //caData.setFee(costEngines.getCurrentPhaseCost(caData.getCurrentcostBand(),
				 * combinedFee.getP3sFee(),combinedFee.getEpoFee(),combinedFee.getFxRate()));
				 * Fee fee =
				 * costEngines.getCurrentPhaseCost(caData.getCurrentcostBand(),combinedFee.
				 * getP3sFee(),combinedFee.getEpoFee(),combinedFee.getFxRate());
				 * caData.setFee(new FeeUI(fee)); } else{
				 * System.out.println("Renewal window closed"); System.out.
				 * println("Show price for green period for next renewal year [Green Period]");
				 * caData = costEngines.getNextPhasesInfo(allDates);
				 * combinedFee.getEpoFee().setRenewalYear(patent.getRenewalYear()+1);
				 * combinedFee.setEpoFee(EpoFee.findEpoFeesByRenewalYear(combinedFee.getEpoFee()
				 * )); caData =
				 * costEngines.getAllCosts(caData,combinedFee.getP3sFee(),combinedFee.getEpoFee(
				 * ),combinedFee.getFxRate());
				 * caData.setCurrentcostBand(RenewalColourEnum.GREEN);
				 * //caData.setFee(costEngines.getCurrentPhaseCost(caData.getCurrentcostBand(),
				 * combinedFee.getP3sFee(),combinedFee.getEpoFee(),combinedFee.getFxRate()));
				 * Fee fee =
				 * costEngines.getCurrentPhaseCost(caData.getCurrentcostBand(),combinedFee.
				 * getP3sFee(),combinedFee.getEpoFee(),combinedFee.getFxRate());
				 * caData.setFee(new FeeUI(fee)); } }
				 * 
				 * }
				 * 
				 * }
				 */

		if (RenewalStatusEnum.RENEWAL_IN_PLACE.equalsIgnoreCase(patent.getRenewalStatus())) {
			log().debug("Renewal in place for the current RENEWAL YEAR");
			// only sending the next Renewal Year window open date
			caData = costEngines.getNextPhasesInfo(allDates);
		} else if (RenewalStatusEnum.SHOW_PRICE.equalsIgnoreCase(patent.getRenewalStatus())
				|| RenewalStatusEnum.PAYMENT_IN_PROGRESS.equalsIgnoreCase(patent.getRenewalStatus())
				|| RenewalStatusEnum.EPO_INSTRUCTED.equalsIgnoreCase(patent.getRenewalStatus())) {
			// DISPLAY TODAYS AMOUNT STRAIGHT AWAY
			caData = costEngines.getAllPhasesInfo(allDates);
			caData = costEngines.getAllCosts(caData, combinedFee.getP3sFee(), combinedFee.getEpoRenewalFee(),
					combinedFee.getFxRate());
			caData.setCurrentcostBand(costEngines.getCurrentPhase(caData));
			// caData.setFee(costEngines.getCurrentPhaseCost(caData.getCurrentcostBand(),combinedFee.getP3sFee(),combinedFee.getEpoFee(),combinedFee.getFxRate()));
			RenewalFee fee = costEngines.getCurrentPhaseCost(caData.getCurrentcostBand(), combinedFee.getP3sFee(),
					combinedFee.getEpoRenewalFee(), combinedFee.getFxRate());
			caData.setRenewalFee(new RenewalFeeUI(fee));
		}

		else if (RenewalStatusEnum.TOO_LATE.equalsIgnoreCase(patent.getRenewalStatus())) {
			caData = costEngines.getAllPhasesInfo(allDates);
			caData = costEngines.getAllCosts(caData, combinedFee.getP3sFee(), combinedFee.getEpoRenewalFee(),
					combinedFee.getFxRate());
			// caData.setCurrentcostBand(RenewalColourEnum.GREEN);
			caData.setCurrentcostBand(costEngines.getCurrentPhase(caData));
			// caData.setFee(costEngines.getCurrentPhaseCost(caData.getCurrentcostBand(),combinedFee.getP3sFee(),combinedFee.getEpoFee(),combinedFee.getFxRate()));
			RenewalFee fee = costEngines.getCurrentPhaseCost(caData.getCurrentcostBand(), combinedFee.getP3sFee(),
					combinedFee.getEpoRenewalFee(), combinedFee.getFxRate());
			caData.setRenewalFee(new RenewalFeeUI(fee));
		}

		// ELSE THE STATUS WILL BE LIKE NO_RENEWAL_NEEDED :- DISABLE CA BUTTON ON THESE
		// CASES
		// MP 31102017 - WE ARE NOT DISBALING CA - BUT WE ARE DISPLYING THE VERY NEXT
		// RENEWAL WINDOW OPEN TIME
		// NO GRAPHS AND NOT LINE CHARTS
		// BELOW SCENARIO CAN BE FOR PATENT EXPIRED OR NEAR-EXPIRED (20 years) or
		// GRANTED
		else if (RenewalStatusEnum.NO_RENEWAL_NEEDED.equalsIgnoreCase(patent.getRenewalStatus())
				|| RenewalStatusEnum.WAY_TOO_LATE.equalsIgnoreCase(patent.getRenewalStatus())) {
			caData.setCurrentcostBand(RenewalColourEnum.GREY);
			caData.setGreenStartDate(allDates.getNextWindowOpenDate());
			log().debug("190606b monitor: CurrentcostBand="+caData.getCurrentcostBand() +" & GreenStartDate="+caData.getGreenStartDate()+"   in PatentServiceImpl getCostAnalysisData("+id+")");
			return caData;
		}
		/**
		 * GET THE LINE CHART INFO - NOW GETTING LAST 6 WEEKS INCLUDING TODAYS RATE
		 * HISTORY
		 * 
		 */
		TreeMap<Date, RenewalFeeUI> lineChart = new TreeMap<Date, RenewalFeeUI>();
		// List<FxRateUI> history = getFxRateHistory("week");
		lineChart = costEngines.getLineChartData(caData, combinedFee.getP3sFee(), combinedFee.getEpoRenewalFee());
		caData.setLineChart(lineChart);

		// add currentOfficialFeeEUR & currentOfficialFeeUSD. 
		RenewalFeeUI renewalFeeUI = caData.getRenewalFee();
		if (renewalFeeUI != null) {
			log().info("patSerImpl 892 - renewalFeeUI is NOT Null. So: PlanA. (PatentId="+id+")");
			log().debug("Got Renewal currentOfficialFeeEUR/USD of E"+renewalFeeUI.getCurrentOfficialFeeEUR()
					+", $"+renewalFeeUI.getCurrentOfficialFeeUSD()+"   from "+msg);
			caData.setCurrentOfficialFeeEUR(renewalFeeUI.getCurrentOfficialFeeEUR());
			caData.setCurrentOfficialFeeUSD(renewalFeeUI.getCurrentOfficialFeeUSD());
		}
		else {
			log().info("patSerImpl 892 - renewalFeeUI IS Null. So try extract officiALEurUsd from caData: PlanB. (PatentId="+id+")");
			// Plan A relied on RenewalFeeUI - which is null. So now have caData.currentOfficialFeeEUR / USD
			// caData.getCurrentOfficialFeeEUR() should already be populated.

			GlobalVariableSole glob = GlobalVariableSole.findOnlyGlobalVariableSole();
			BigDecimal fxRate = glob.getCurrent_P3S_rate();
			
			BigDecimal intoUsd = caData.getCurrentOfficialFeeEUR().multiply(fxRate);
			caData.setCurrentOfficialFeeUSD(intoUsd.setScale(2, RoundingMode.HALF_UP));
		}
		log().info("patSerImpl AFTER 892 (PatentId="+id+")    Got RENEWAL currentOfficialFeeEUR/USD of E"+caData.getCurrentOfficialFeeEUR()
		+", $"+caData.getCurrentOfficialFeeUSD()+"   from "+msg);
		
		//		if (renewalFeeUI==null) log().error("HE LL patSerImpl 889 *IS* null (PatentId="+id); 
		
		log().debug("190606a monitor: CurrentcostBand="+caData.getCurrentcostBand() +" & GreenStartDate="+caData.getGreenStartDate()+"   in PatentServiceImpl getCostAnalysisData("+id+")");
		return caData;
	}


	
	@Override
	public CostAnalysisDataForm1200 getCostAnalysisDataForm1200(long id, HttpSession session) {

		// Non optimal, quickest development, as pressure + whole structures-requirement have big review soon(hope). Nov2018
		
		String msg = PREFIX + "CostAnalysisDataForm1200(" + id + ") ";
		log().debug(msg + " invoked for patent id " + id);

		CostAnalysisDataForm1200 caData = new CostAnalysisDataForm1200();

		// Start by copying what getPatentInfo does - & see what that gives us
		PatentV2UI patentV2UI = null;
		Patent patent = Patent.findPatent(id);
		PostLoginSessionBean postSession = (PostLoginSessionBean) session.getAttribute("postSession");
		patentV2UI = new PatentV2UI(patent, postSession.getExtendedPatentUI());

		Form1200ServiceImpl form1200ServiceImpl = new Form1200ServiceImpl(session);
		caData = form1200ServiceImpl.populatePatentInfoPlusCostAnalysis(caData, patentV2UI, session);

		Form1200FeeUI form1200FeeUI = patentV2UI.getForm1200FeeUI();
		//form1200FeeUI = ensureForm1200FeeUInotNull(form1200FeeUI, patentV2UI, session);
		caData.setForm1200FeeUI(form1200FeeUI);
		
		CostAnalysisDataEngine costEngine = new CostAnalysisDataEngine();
		BigDecimal feeNow = form1200FeeUI.getSubTotalUSD();
		if (feeNow==null) feeNow = BigDecimal.ZERO; // hopefully never needed
		
		TreeMap<Date,BigDecimal> form12006weekChartData = costEngine.get7weekLineChartDataForForm1200(feeNow);
		caData.setLineChart( form12006weekChartData );

		// add currentOfficialFeeEUR & currentOfficialFeeUSD. No action required, but log
		log().debug("Got Epct currentOfficialFeeEUR/USD of E"+form1200FeeUI.getCurrentOfficialFeeEUR()
				+", $"+form1200FeeUI.getCurrentOfficialFeeUSD()+"   from "+msg);
		
		return caData;
	}
	///**
	// * Update - likely this was never needed - F1200 code passed a renewal patent!
	// * 11/06/2019 Found valid request to /rest-form1200-cost-analysis/nn  causes NPE in existing code due to form1200FeeUI being null.
	// * Unclear how this ever worked. Puzzling, no NPEs (detected) with current FE - only if manually make this valid API call.
	// * Decision now - make safe with this method. NotNice, but is only tmp until big rewrite.
	// */
	//protected Form1200FeeUI ensureForm1200FeeUInotNull(Form1200FeeUI form1200FeeUI, PatentV2UI patentV2UI, HttpSession session) {
	//	if (patentV2UI==null || session==null) 
	//			fail("ensureForm1200FeeUInotNull("+(patentV2UI==null)+(session==null)+") given null - in PatentServiceImpl");
	//
	//	Form1200FeeUI newForm1200FeeUI = form1200FeeUI;
	//	if (newForm1200FeeUI==null) {
	//		Form1200ServiceImpl form1200ServiceImpl = new Form1200ServiceImpl(session);
	//		EpctEngine epctEngine = form1200ServiceImpl.populatePatentInfo(patentV2UI, session);
	//		if (epctEngine==null) fail("ensureForm1200FeeUInotNull failed to create an EpctEngine ");
	//		Form1200Fee form1200Fee = epctEngine.getFee(); 
	//		if (form1200Fee==null) fail("ensureForm1200FeeUInotNull failed to create a Form1200Fee ");
	//		newForm1200FeeUI = new Form1200FeeUI(form1200Fee);
	//	}
	//	return newForm1200FeeUI;
	//}
	
	

	@Override
	public List<RenewalUI> getRenewalHistory(long id) {
		// TODO Auto-generated method stub

		RenewalUI renewalUI = null;
		List<RenewalUI> completedRenewals = new ArrayList<RenewalUI>();
		List<Renewal> renewals = new ArrayList<Renewal>();

		String err = "Inside getRenewalHistory(" + id + ")";
		if (Long.valueOf(id) == null) {
			logM().debug("Invoked getRenewalHistory(id) with id as null");
			return completedRenewals;

		}

		checkThisIsMyPatent(id, err);

		Patent patent = Patent.findPatent(id);
		TypedQuery<Renewal> q = Renewal.findRenewalsByPatent(patent);

		if (q.getResultList() == null) {
			log().debug("findRenewalsByPatent(" + patent.getId() + ") returned an empty list");
			return null;
		}

		PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
		List<PatentExtendedData> extendedDatas = pLoginSession.getExtendedPatentUI();

		log().debug("findRenewalsByPatent(" + patent.getId() + ") returned list of size [" + q.getResultList().size()
				+ "]");
		renewals = q.getResultList();
		for (Renewal renewal : renewals) {
			renewalUI = new RenewalUI(renewal, extendedDatas);
			if (renewalUI.isRenewedSuccessfully())
				completedRenewals.add(renewalUI);
		}
		return completedRenewals;
	}

	/**
	 * This method called to fetch extended patent data from
	 */
	@Override
	public PatentUI populateDataToPatentUI(Patent patent) {

		String err = PREFIX + "populateDataToPatentUI(patent) ";
		boolean patentFound = false;

		PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
		List<PatentExtendedData> extendedDatas = pLoginSession.getExtendedPatentUI();

		PatentUI patentUI = new PatentUI(patent, extendedDatas);

		for (PatentExtendedData extendedData : extendedDatas) {
			if (extendedData.getPatentId() == null) {
				patentUI.setRenewalDueDate(extendedData.getRenewalDueDate());
				patentUI.setCurrentRenewalCostUSD(extendedData.getCurrentRenewalCost());
				patentUI.setCostBandEndDate(extendedData.getCostBandEndDate());
				patentUI.setRenewalCostNextStageUSD(extendedData.getRenewalCostNextStage());
				return patentUI;
			}

			else if (extendedData.getPatentId().equals(patentUI.getId())) {
				patentFound = true;
				patentUI.setRenewalDueDate(extendedData.getRenewalDueDate());
				patentUI.setCurrentRenewalCostUSD(extendedData.getCurrentRenewalCost());
				patentUI.setCostBandEndDate(extendedData.getCostBandEndDate());
				patentUI.setRenewalCostNextStageUSD(extendedData.getRenewalCostNextStage());
				return patentUI;
			}
		}

		return patentUI;
	}

	
	// End of - the methods which implement the prototypes in the Interface

	
	
	
	// Start of - Support methods - NOT exposed through the interface

	/**
	 * Data sent from FE via Json will usually appear as a LinkedHashMap This
	 * attempts to extract List<NotificationUI> from an element of such
	 * 
	 * @param objects
	 * @return
	 */
	protected List<NotificationUI> extractNotificationUIs(Object objects) {

		List<NotificationUI> result = new ArrayList<NotificationUI>();
		log().debug(CLASSNAME + "extractNotificationUIs invoked  (objects==null)=" + (objects == null));
		log().debug(CLASSNAME + "extractNotificationUIs Hope param is List<Object> - it is : "
				+ objects.getClass().getName());
		List<Object> objectList = (List<Object>) objects;
		log().debug(CLASSNAME + "extractNotificationUIs as List<Object>.  Size = " + objectList.size());
		if (objectList.size()>0) {
		log().debug(CLASSNAME + "extractNotificationUIs.  object type [objectList.get(0).getClass().getName()] = "
				+ objectList.get(0).getClass().getName());
		}
		log().debug(CLASSNAME + "extractNotificationUIs RELIES on that type being NotificationUI");

		NotificationUI aNotificationUI = null;
		for (Object anObject : objectList) {
			aNotificationUI = (NotificationUI) anObject;
			result.add(aNotificationUI);
		}
		return result;
	}

	protected List<Patent> listAllPatentsForMyBusiness() {

		String err = PREFIX + "listAllPatentsForMyBusiness() ";
		checkNoActionRequired(err);

		log().debug(err + " invoked ");

		/** MP170620 Code changes for implementing session starts **/
		List<Patent> patents = null;
		if (session != null) {
			PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");

			TypedQuery<Patent> tq_patents = Patent.findPatentsByBusiness(pLoginSession.getBusiness());
			patents = tq_patents.getResultList();

			System.out.println("PatentServiceImpl : listAllPatentsForMyBusiness() ret Qty " + patents.size());

		} else
			logInternalError().fatal("PatentServiceImpl : listAllPatentsForMyBusiness() has empty session");

		/** MP170620 Code changes for implementing session ends **/

		return patents;
	}

	protected int period2days(String timeperiod) {
		int numdays = -1;
		// week means 8 days and month means 35 days inorder to support FE's logic of
		// fetching data - MP changed on 23/01/2018
		// if ("week".equalsIgnoreCase(timeperiod)) return 7;
		if ("week".equalsIgnoreCase(timeperiod))
			return 8;
		if ("fortnight".equalsIgnoreCase(timeperiod))
			return 14;
		// if ("month".equalsIgnoreCase(timeperiod)) return 30;
		if ("month".equalsIgnoreCase(timeperiod))
			return 35;
		if ("quarter".equalsIgnoreCase(timeperiod))
			return 91;
		if ("halfyear".equalsIgnoreCase(timeperiod))
			return 182;
		if ("year".equalsIgnoreCase(timeperiod))
			return 365;
		return numdays;
	}

	// End of - Support methods - NOT exposed through the interface


	
	@Override
	public List<PatentUI> persistAndCalculateFee(Patent patent) {

		PostLoginDataEngine moreData = new PostLoginDataEngine();
		PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");

		pLoginSession = moreData.getExtendedPatentData(pLoginSession);

		List<Patent> patents = listAllPatentsForMyBusiness();
		List<PatentUI> patentUIs = new ArrayList<PatentUI>();
		for (Patent eachPatent : patents) {
			// PatentUI patentUI = new PatentUI(patent);
			PatentUI patentUI = populateDataToPatentUI(patent);
			patentUIs.add(patentUI);
		}
		return patentUIs;

	}

	/**
	 * Formatting patentApplicationNumber Checking for EP in front Checking for
	 * check digit Checking for white spaces Returning string in a definite format
	 * "EP<8 numeric digits>"
	 * 
	 * This formatted string being stored in the DB
	 */
	@Override
	public String validateAndFormatApplicationNumber(String patentApplicationNumber) {

		String msg = PREFIX + " validateAndFormatApplicationNumber(" + patentApplicationNumber + ") ";
		int length = patentApplicationNumber.length();
		int newlength = patentApplicationNumber.length();
		boolean isFormatted = false;

		log().debug(msg + " invoked ");
		// truncating check digit from the EP number
		if (patentApplicationNumber.contains(".")) {
			int index = patentApplicationNumber.indexOf(".");
			patentApplicationNumber = patentApplicationNumber.substring(0, index);
			isFormatted = true;
			log().debug("Truncated Application Number without check digit " + patentApplicationNumber);

		}

		// checking for EP in front; if not append EP
		if (!(patentApplicationNumber.startsWith("EP"))) {
			patentApplicationNumber = "EP" + patentApplicationNumber;
			isFormatted = true;
			log().debug("Appended 'EP' to user entered application number  " + patentApplicationNumber);
		}

		// checking for space in between; if found delete all white spaces
		if (StringUtils.containsWhitespace(patentApplicationNumber)) {
			patentApplicationNumber = StringUtils.deleteWhitespace(patentApplicationNumber);
			isFormatted = true;
		}

		newlength = patentApplicationNumber.length();

		if (!(newlength == 10)) {
			String error = "Invalid length for patent Application Number";
			log().debug("EP number entered/formatted is invalid [" + patentApplicationNumber + "] :: " + error + " : "
					+ length);
			logM().fatal("EP number entered/formatted is invalid [" + patentApplicationNumber + "] :: " + error + " : "
					+ length);
			return null;
		}

		if (!(isFormatted) && newlength == 10) {
			log().debug("No formatting required as Application Number format is correct");
		}

		log().debug("Application Number Format check completed. Returning " + patentApplicationNumber);
		return patentApplicationNumber;
	}

	@Override
	public boolean isPatentFoundForBusiness(String patentApplicationNumber, PostLoginSessionBean postSession) {
		String msg = PREFIX + " isPatentFoundForBusiness(" + patentApplicationNumber + ") ";
		boolean isFound = false;
		log().debug(msg + " invoked ");
		TypedQuery<Patent> patents = Patent.findPatentsByBusiness(postSession.getBusiness());
		for (Patent patent : patents.getResultList()) {
			if (patentApplicationNumber.equals(patent.getEP_ApplicationNumber())) {
				log().debug("Duplicate for the patent for the business. Patent Number[" + patentApplicationNumber
						+ "] already exist for the business. " + "		Patent id[" + patent.getId()
						+ "] and application number[" + patent.getEP_ApplicationNumber() + "]");
				isFound = true;
			}
		}

		if (!isFound) {
			log().debug("Not duplicate patent for business.");
		}

		log().debug("Is Duplicate patent check completed. Returning isFound = " + isFound);
		return isFound;
	}

	@Override
	public String truncateAndStoreCheckDigit(String patentApplicationNumber) {
		String checkDigit = null;
		int len = patentApplicationNumber.length();
		int index = patentApplicationNumber.indexOf(".");
		if (len == index || index == -1) {
			log().error("EP Application Numbered entered without a check digit");
			return checkDigit;
		}
		checkDigit = patentApplicationNumber.substring(index + 1, len);
		log().debug("Check digit from EP Application Number[" + patentApplicationNumber + "] is " + checkDigit);
		return checkDigit;
	}

	// new for v2.1
	public PatentV2UI getPatentInfo(long id, HttpSession session) { // session needed temporarily, whilst reuse existing
																	// v1 calculations

		String err = PREFIX + "getPatentInfo(" + id + ") ";
		checkThisIsMyPatent(id, err);
		log().debug(err + " invoked ");
		PatentV2UI patentV2UI = null;

		try {
			Patent patent = Patent.findPatent(id);
			PostLoginSessionBean postSession = (PostLoginSessionBean) session.getAttribute("postSession");
			patentV2UI = new PatentV2UI(patent, postSession.getExtendedPatentUI());

			Form1200ServiceImpl form1200ServiceImpl = new Form1200ServiceImpl(session);
			form1200ServiceImpl.populatePatentInfo(patentV2UI, session);

		} catch (Exception e) {
			logErrorAndContinue("Service caught unexpected failure : " + PREFIX + ":getPatentInfo(" + id + ")", e);
		}
		return patentV2UI;
	}

	// Start of internal methods

	protected void combinePatentDetails(Patent patent, Form1200Record form1200) {
		Form1200Service form1200ServiceImpl = new Form1200ServiceImpl(null);
		form1200ServiceImpl.combineEpoPatentDetails(patent, form1200);
	}

}
