package com.bcs.p3s.docs.email;

import com.bcs.p3s.docs.email.Populators.EmailTypeEnum;

/**
 * All P3S emails implement this
 */
public interface P3sEmailInterface {

	public String getSubject();
	
	public String getHtmlBody();
	
	public String getTemplateName();
	public EmailTypeEnum getEmailType();
	
}
