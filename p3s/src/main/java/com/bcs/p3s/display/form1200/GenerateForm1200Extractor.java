package com.bcs.p3s.display.form1200;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.session.PostLoginSessionBean;
import com.bcs.p3s.util.lang.P3SRuntimeException;
import com.bcs.p3s.util.lang.Universal;

public class GenerateForm1200Extractor extends Universal {

	protected boolean tolerant = false;
	
	
	/**
	 * 
	 * @param ob
	 * @param strictAPI if true, will 
	 *   (a) inhibit format-mismatch exceptions within this method
	 *   (b) log more debugging of what is received
	 *  Collectively, this aids matching FE data to BE. Once resolved, set false. 
	 * @return
	 */
	public GenerateForm1200DataIn extractGenerateForm1200DataIn(Object obby, boolean strictAPI) {

		this.tolerant = ! strictAPI;
		GenerateForm1200DataIn generateForm1200DataIn = new GenerateForm1200DataIn();
		
		if (obby==null || ! strictAPI) log().debug("in extractGenerateForm1200DataIn : (obby==null) = "+(obby==null));

		// Declare the items to be received
//		long  patentId = 0;
//		String clientRef = null; 
//		long totalClaims = 0;
//		boolean isYear3RenewalPaying = false; 
//		long totalPages = 0;
//		List<ExtensionStateUI> extensionStatesUI = null; 
//		List<ValidationStateUI> validationStatesUI = null;
//		List<PageDescriptionUI> pageDescriptionUI = null;

		if (obby==null) { failed("Onject provided isNull"); return null; }
		else {
			verbose("object is of type  "+obby.getClass().getName());
			verbose("{hoping for : LinkedHashMap<String, Object>)}");

			if ( ! (obby instanceof LinkedHashMap<?,?>)) { failed("AINT a LinkedHashMap<String, Object>"); return null; } 
			else {
				verbose("Attempting cast to LinkedHashMap<String, Object>");
				LinkedHashMap<String, Object> obHashMap = (LinkedHashMap<String, Object>) obby;

				verbose("Start of : LIST all elements - then attempt extract");
				verbose("LIST of *keyS* follows : ");
				for (String str : obHashMap.keySet()) {
					verbose("     ...                             Got a Key. Name is : "+str);
				}
				verbose("End of : LIST all elements - then attempt extract");


				verbose("  ...  \n\n\n\n ...");
				verbose("Start of : Now attempt extract EACH in turn");
				Object ob;
				Integer backstopPatentId = -1;
				for (String thisElement : obHashMap.keySet()) {
					verbose("   ... item ... = "+thisElement);
				
					ob = obHashMap.get(thisElement);
					
					switch (thisElement) {
						//case "Patent_ID":	generateForm1200DataIn.patentId = castInteger(ob, thisElement);
						case "id":			generateForm1200DataIn.patentId = castInteger(ob, thisElement);
											break;
						case "Patent_ID":	// Patent_ID Shouldn't be needed, but is
											if (ob instanceof Integer) backstopPatentId = castInteger(ob, thisElement); 
											if (ob instanceof Long) backstopPatentId = ((Long) ob).intValue(); 
											break;
											
						case "EP_ApplicationNumber":	
											// IGNORE. use 'id' (=patentId)
											break;

						case "clientRef":	generateForm1200DataIn.clientRef = castString(ob, thisElement);
											break;

						case "totalClaims":	if (ob instanceof Integer) generateForm1200DataIn.totalClaims = castInteger(ob, thisElement);
											if (ob instanceof Long) generateForm1200DataIn.totalClaims = ((Long) ob).intValue();
											break;

						case "isYear3RenewalPaying":	
											generateForm1200DataIn.isYear3RenewalPaying = castBoolean(ob, thisElement);
											break;

						case "totalPages":	if (ob instanceof Integer) generateForm1200DataIn.totalPages = castInteger(ob, thisElement);
											if (ob instanceof Long) generateForm1200DataIn.totalPages = ((Long) ob).intValue();
											break;

						case "extensionStatesUI":	
									try {
											if (ob instanceof List<?>) { // ALL this needs tidy once proven
												// hooray
												verbose("thisElement IS a List. But of what type?");
												List<Object> oblist = (List<Object>) ob;
												verbose("list size is "+oblist.size());
												if (oblist.size()==0) verbose("List size is zero - cannot examine Type");
												else {
													Object obListElement = oblist.get(0);
													log().debug("The 1st element in the "+thisElement+"list is of type "+obListElement.getClass().getName());
												}
												List<ExtensionStateUI> extensionStateUIs = new ArrayList<ExtensionStateUI>();
												LinkedHashMap<String,Object> tmp = null;
												for (Object obItem : oblist) {
													ExtensionStateUI esUi = new ExtensionStateUI();
													if (obItem instanceof LinkedHashMap<?,?>) {
														tmp = (LinkedHashMap<String,Object>) obItem;
														esUi.extractStateUI(tmp);
														extensionStateUIs.add(esUi);
													}
													else if (obItem instanceof ExtensionStateUI) {
														esUi = (ExtensionStateUI) obItem;
														extensionStateUIs.add(esUi);
													}
												}
												//generateForm1200DataIn.extensionStatesUI = (List<ExtensionStateUI>) ob; //fails later
												generateForm1200DataIn.extensionStatesUI = extensionStateUIs;
											} else {
												log().debug("Is NOT a List. so more reporting, but NOT attempt populate ...........................");
												if (ob instanceof String) { 
													log().debug(thisElement+"  *IS*  a string. & its value is: "+(String) ob);
												}
												else if ( (ob instanceof LinkedHashMap<?,?>) ) {
													log().debug(thisElement+"  *IS*  a LinkedHashMap<?,?>. what would the keys be?");
													LinkedHashMap<String,Object> arhggg = ( LinkedHashMap<String,Object>) ob;
													//Set<String> oKey = arhggg.keySet();
													for (String ooKey : arhggg.keySet()) {
														log().debug("    this particular key is : "+ ooKey);
													}
												}
											}
											log().debug(" finished processing "+thisElement+".  Where data was saved depends on what happened ....");
											break;
									} catch (Exception e) {
										String eMsg = "Suffered exception whilst processing "+thisElement+". e.Msg="+e.getMessage()+"     eType+"+e.getClass().getName();
										if (tolerant) verbose(eMsg);
										else throw new P3SRuntimeException(eMsg, e);
									}

						case "validationStatesUI":	
									try {
										if (ob instanceof List<?>) { // ALL this needs tidy once proven
											// hooray
											verbose("thisElement IS a List. But of what type?");
											List<Object> oblist = (List<Object>) ob;
											verbose("list size is "+oblist.size());
											if (oblist.size()==0) verbose("List size is zero - cannot examine Type");
											else {
												Object obListElement = oblist.get(0);
												log().debug("The 1st element in the "+thisElement+"list is of type "+obListElement.getClass().getName());
											}
											List<ValidationStateUI> validationStateUIs = new ArrayList<ValidationStateUI>();
											LinkedHashMap<String,Object> tmp = null;
											for (Object obItem : oblist) {
												ValidationStateUI vsUi = new ValidationStateUI();
												if (obItem instanceof LinkedHashMap<?,?>) {
													tmp = (LinkedHashMap<String,Object>) obItem;
													vsUi.extractStateUI(tmp);
													validationStateUIs.add(vsUi);
												}
												else if (obItem instanceof ValidationStateUI) {
													vsUi = (ValidationStateUI) obItem;
													validationStateUIs.add(vsUi);
												}
											}
											//generateForm1200DataIn.validationStatesUI = (List<ValidationStateUI>) ob; /fails later
											generateForm1200DataIn.validationStatesUI = validationStateUIs;
										} else {
											log().debug("Is NOT a List. so more reporting, but NOT attempt populate ...........................");
											if (ob instanceof String) { 
												log().debug(thisElement+"  *IS*  a string. & its value is: "+(String) ob);
											}
											else if ( (ob instanceof LinkedHashMap<?,?>) ) {
												log().debug(thisElement+"  *IS*  a LinkedHashMap<?,?>. what would the keys be?");
												LinkedHashMap<String,Object> arhggg = ( LinkedHashMap<String,Object>) ob;
												//Set<String> oKey = arhggg.keySet();
												for (String ooKey : arhggg.keySet()) {
													log().debug("    this particular key is : "+ ooKey);
												}
											}
										}
										log().debug(" finished processing "+thisElement+".  Where data was saved depends on what happened ....");
										break;
									} catch (Exception e) {
										String eMsg = "Suffered exception whilst processing "+thisElement+". e.Msg="+e.getMessage()+"     eType+"+e.getClass().getName();
										if (tolerant) verbose(eMsg);
										else throw new P3SRuntimeException(eMsg, e);
									}
											
						case "pageDescriptionsUI":	
									try {
										if (ob instanceof List<?>) { // ALL this needs tidy once proven
											// hooray
											verbose("thisElement IS a List. But of what type?");
											List<Object> oblist = (List<Object>) ob;
											verbose("list size is "+oblist.size());
											if (oblist.size()==0) verbose("List size is zero - cannot examine Type");
											else {
												Object obListElement = oblist.get(0);
												log().debug("The 1st element in the "+thisElement+"list is of type "+obListElement.getClass().getName());
											}
	
											List<PageDescriptionUI> pageDescriptionUIs = new ArrayList<PageDescriptionUI>();
											LinkedHashMap<String,Object> tmp = null;
											for (Object obItem : oblist) {
												if (obItem instanceof LinkedHashMap<?,?>) {
													tmp = (LinkedHashMap<String,Object>) obItem;
													PageDescriptionUI pdui = PageDescriptionTool.extractPageDescriptionUI( tmp ); 
													pageDescriptionUIs.add(pdui);
												}
												else if (obItem instanceof PageDescriptionUI) {
													PageDescriptionUI pdui = (PageDescriptionUI) obItem;
													pageDescriptionUIs.add(pdui);
												}
											}
											//generateForm1200DataIn.pageDescriptionUI = (List<PageDescriptionUI>) ob;
											generateForm1200DataIn.setPageDescriptionsUI(pageDescriptionUIs);
											log().debug("   ********  NullWatch  *********  atVERYSetPoint : set to  "+ (pageDescriptionUIs==null) );
										} else {
											log().debug("Is NOT a List. so more reporting, but NOT attempt populate ...........................");
											if (ob instanceof String) { 
												log().debug(thisElement+"  *IS*  a string. & its value is: "+(String) ob);
											}
											else if ( (ob instanceof LinkedHashMap<?,?>) ) {
												log().debug(thisElement+"  *IS*  a LinkedHashMap<?,?>. what would the keys be?");
												LinkedHashMap<String,Object> arhggg = ( LinkedHashMap<String,Object>) ob;
												//Set<String> oKey = arhggg.keySet();
												for (String ooKey : arhggg.keySet()) {
													log().debug("    this particular key is : "+ ooKey);
												}
											}
										}
										log().debug(" finished processing "+thisElement+".  Where data was saved depends on what happened ....");

										log().debug("   ********  NullWatch  *********  atSetPoint : PageDescriptionsUI==null is  "+(generateForm1200DataIn.getPageDescriptionsUI()==null) );

										break;
									} catch (Exception e) {
										String eMsg = "Suffered exception whilst processing "+thisElement+". e.Msg="+e.getMessage()+"     eType+"+e.getClass().getName();
										if (tolerant) verbose(eMsg);
										else throw new P3SRuntimeException(eMsg, e);
									}
										

						case "form1200PdfUrl":	// No reason why form1200PdfUrl should be sent, but has been seen. IGNORE
											log().debug("Been sent unwanted form1200PdfUrl field. Ignoring. Value is : "+thisElement+" .. "+(thisElement instanceof String));
											break;

						default: 	log().warn(CLASSNAME+".extractGenerateForm1200DataIn()  Switch statement hit default !!!   Not recognised param '"+thisElement+"'");
						            break;
					}  // end of : switch
				}  // end of for loop
				verbose("End of : Now attempt extract EACH in turn");

				if (generateForm1200DataIn.getPatentId()==0) generateForm1200DataIn.setPatentId(backstopPatentId);  // Safety check
				if (generateForm1200DataIn.getPatentId()<1) log().error("Gonna fail : PatentId = "+generateForm1200DataIn.getPatentId()+"  from extractGenerateForm1200DataIn()");
				
			} // end of : IS a LinkedHashMap
		} // end of: Object not null			
		
		log().debug("   ********  NullWatch  *********  late set : PageDescriptionsUI==null is  "+(generateForm1200DataIn.getPageDescriptionsUI()==null) );

		return generateForm1200DataIn;
	}
	


	
	

	// Reporting methods

	protected void verbose(String msg) {
		if (tolerant) log().debug(msg);
	}
	protected void failed(String msg) {
		if (tolerant) log().error(msg);
		else throw new P3SRuntimeException(msg);
	}
	
	protected String castString(Object o, String msg) {
		String ret = "unset";
		if (o instanceof String) {
			ret = (String) o;
		} 
		else {
			verbose("castString invoked for "+msg);
			failed("castString() : Object "+msg+" was NOT of type String. Was : "+((o==null) ? "null" : o.getClass().getName()));
		}
		verbose("castString invoked for "+msg+"     Result was '"+ret+"'");
		return ret;
	}
	protected Integer castInteger(Object o, String msg) {
		Integer ret = new Integer("-1");
		if (o instanceof Integer) {
			ret = (Integer) o;
		} 
		else {
			verbose("castInteger invoked for "+msg);
			String sMsg = ""; if (o instanceof String) sMsg="It WAS a String!  val is '"+(String) o+"'";
			failed("castInteger() : Object "+msg+" was NOT of type Integer. Was : "+((o==null) ? "null" : o.getClass().getName())+sMsg);
		}
		verbose("castInteger invoked for "+msg+"     Result was '"+ret+"'");
		return ret;
	}
	protected Boolean castBoolean(Object o, String msg) {
		Boolean ret = false;
		if (o instanceof Boolean) {
			ret = (Boolean) o;
		} 
		else {
			verbose("castBoolean invoked for "+msg);
			String sMsg = ""; if (o instanceof String) sMsg="It WAS a String!  val is '"+(String) o+"'";
			failed("castBoolean() : Object "+msg+" was NOT of type Boolean. Was : "+((o==null) ? "null" : o.getClass().getName())+sMsg);
		}
		verbose("castBoolean invoked for "+msg+"     Result was '"+ret+"'");
		return ret;
	}

}
