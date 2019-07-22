package com.bcs.p3s.display.form1200;

import java.util.LinkedHashMap;
import java.util.List;

import com.bcs.p3s.util.lang.P3SRuntimeException;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.util.log.BcsLogger;

/**
 * A Util class for PageDescription*
 */
public class PageDescriptionTool extends Universal {

	/**
	 * Must be a list of 3 pageDescriptionUIs, 1 of each type
	 * @param pageDescriptionUIs
	 * @return true if ok
	 */
	public boolean confGot1ofEach(List<PageDescriptionUI> pageDescriptionUIs) {

		if ( (pageDescriptionUIs==null)	|| (pageDescriptionUIs.size() != 3) ) return false;

		boolean gotDescr = false;
		boolean gotClaim = false;
		boolean gotDrwgs = false;
		for (PageDescriptionUI typ : pageDescriptionUIs) {
			if (PageDescriptionEnum.Description == typ.getType()) gotDescr = true;
			if (PageDescriptionEnum.Claims == typ.getType())      gotClaim = true;
			if (PageDescriptionEnum.Drawings == typ.getType())    gotDrwgs = true;
		}
		
		return gotDescr && gotClaim && gotDrwgs; 
	}
	
	/**
	 * Given the list of three, extract the one required
	 * @param list
	 * @param requiredType
	 * @return
	 */
	public PageDescriptionUI getPageDescriptionUIofType(List<PageDescriptionUI> list, PageDescriptionEnum requiredType) {
		if (list==null) return null;
		for (PageDescriptionUI item : list) {
			if (item.getType().equals(requiredType)) return item;
		}
		throw new P3SRuntimeException(" No match found for rqd = "+requiredType);
	}
	
	public static PageDescriptionUI extractPageDescriptionUI(LinkedHashMap<String, Object> asMap) {

		BcsLogger bcsLogger = new BcsLogger();
		Object obStart = asMap.get("typeStart");
		Object obEnd = asMap.get("typeEnd");
		Object obType = asMap.get("type");
		bcsLogger.log().debug("PageDescriptionTool extractPageDescriptionUI NullChecks = "+(obStart==null)+", "+(obEnd==null)+", "+(obType==null)); 
		bcsLogger.log().debug("PageDescriptionTool extractPageDescriptionUI ClassType checks follow:"); 
		bcsLogger.log().debug("                  "+obStart.getClass().getName()); 
		bcsLogger.log().debug("                  "+obEnd.getClass().getName()); 
		bcsLogger.log().debug("                  "+obType.getClass().getName()); 
		
		//	String typeStart = (String) asMap.get("typeStart");
		//	String typeEnd =   (String) asMap.get("typeEnd");
		//	String rawType =      (String) asMap.get("type");

		String typeStart = castIntegerThenString( asMap.get("typeStart") );
		String typeEnd =   castIntegerThenString( asMap.get("typeEnd") );
		String rawType =   castIntegerThenString( asMap.get("type") );
		bcsLogger.log().debug("PageDescriptionUI extractPageDescriptionUI MIDWAY params are:"+typeStart+", "+typeEnd+", "+rawType);
		
		PageDescriptionEnum pde = PageDescriptionEnum.getPageDescriptionEnum(rawType);
		PageDescriptionUI pdui = new PageDescriptionUI(pde, typeStart, typeEnd); 

		bcsLogger.log().debug("PageDescriptionUI params are:"+rawType+"=="+pde.toString()+", "+typeStart+", "+typeEnd);

		return pdui;
	}
	
	
	protected static String castIntegerThenString(Object o) {
		String str = "unset";
		if (o instanceof Integer) {
			str = ((Integer) o).toString();
		} 
		else if (o instanceof String) {
			str = (String) o;
		} 
		else {
			BcsLogger bcsLogger = new BcsLogger();
			bcsLogger.log().debug("PageDescriptionTool : castIntegerThenString() fails as Class is "+o.getClass().getName());
		}
		return str;
	}

}
