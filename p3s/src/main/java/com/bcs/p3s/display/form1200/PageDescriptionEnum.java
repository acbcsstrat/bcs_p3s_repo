package com.bcs.p3s.display.form1200;

public enum PageDescriptionEnum {

	Description, 
	Claims, 
	Drawings; 

	
	public static PageDescriptionEnum getPageDescriptionEnum(String value) {
		//PageDescriptionEnum pageDescriptionEnum = PageDescriptionEnum.valueOf(value);
		//return pageDescriptionEnum; - make threadsafe
		return PageDescriptionEnum.valueOf(value);
	}
	
}
