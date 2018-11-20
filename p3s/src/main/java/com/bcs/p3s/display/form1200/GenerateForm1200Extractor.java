package com.bcs.p3s.display.form1200;

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
				for (String thisElement : obHashMap.keySet()) {
					verbose("   ... item ... = "+thisElement);
				
					ob = obHashMap.get(thisElement);
					
					switch (thisElement) {
						case "Patent_ID":	generateForm1200DataIn.patentId = castInteger(ob, thisElement);
											break;

						case "clientRef":	generateForm1200DataIn.clientRef = castString(ob, thisElement);
											break;

						case "totalClaims":	generateForm1200DataIn.totalClaims = castInteger(ob, thisElement);
											break;

						case "isYear3RenewalPaying":	
											generateForm1200DataIn.isYear3RenewalPaying = castBoolean(ob, thisElement);
											break;

						case "totalPages":	generateForm1200DataIn.totalPages = castInteger(ob, thisElement);
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
												generateForm1200DataIn.extensionStatesUI = (List<ExtensionStateUI>) ob;
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
											generateForm1200DataIn.validationStatesUI = (List<ValidationStateUI>) ob;
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
											
						case "pageDescriptionUI":	
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
											generateForm1200DataIn.pageDescriptionUI = (List<PageDescriptionUI>) ob;
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
										

						default: 	log().warn(CLASSNAME+".extractGenerateForm1200DataIn()  Switch statement hit default !!!");
						            break;
					}  // end of : switch
				}  // end of for loop
				verbose("End of : Now attempt extract EACH in turn");

			} // end of : IS a LinkedHashMap
		} // end of: Object not null			
		
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
		verbose("castString invoked for "+msg);
		String ret = "unset";
		if (o instanceof String) {
			ret = (String) o;
		} 
		else {
			failed("castString() : Object "+msg+" was NOT of type String. Was : "+((o==null) ? "null" : o.getClass().getName()));
		}
		return ret;
	}
	protected Integer castInteger(Object o, String msg) {
		verbose("castInteger invoked for "+msg);
		Integer ret = new Integer("-1");
		if (o instanceof Integer) {
			ret = (Integer) o;
		} 
		else {
			String sMsg = ""; if (o instanceof String) sMsg="It WAS a String!  val is '"+(String) o+"'";
			failed("castInteger() : Object "+msg+" was NOT of type Integer. Was : "+((o==null) ? "null" : o.getClass().getName())+sMsg);
		}
		return ret;
	}
	protected Boolean castBoolean(Object o, String msg) {
		verbose("castBoolean invoked for "+msg);
		Boolean ret = false;
		if (o instanceof Boolean) {
			ret = (Boolean) o;
		} 
		else {
			String sMsg = ""; if (o instanceof String) sMsg="It WAS a String!  val is '"+(String) o+"'";
			failed("castBoolean() : Object "+msg+" was NOT of type Boolean. Was : "+((o==null) ? "null" : o.getClass().getName())+sMsg);
		}
		return ret;
	}

}
