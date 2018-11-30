package com.bcs.p3s.display.form1200;

import java.util.LinkedHashMap;
import java.util.List;

import com.bcs.p3s.util.lang.P3SRuntimeException;

/**
 * A Util class for PageDescription*
 */
public class PageDescriptionTool {

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
		String typeStart = (String) asMap.get("typeStart");
		String typeEnd =   (String) asMap.get("typeEnd");
		String rawType =      (String) asMap.get("type");
		PageDescriptionEnum pde = PageDescriptionEnum.getPageDescriptionEnum(rawType);
		PageDescriptionUI pdui = new PageDescriptionUI(pde, typeStart, typeEnd); 
		return pdui;
	}
	
}