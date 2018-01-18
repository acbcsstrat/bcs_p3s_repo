/**
 * 
 */
package com.bcs.p3s.service;

import java.util.List;

import com.bcs.p3s.display.LoginMessageUI;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.session.PostLoginSessionBean;

/**
 * @author MerinP
 *
 */
public interface MiscService {

	public LoginMessageUI findAllLoginMessagesForUser(PostLoginSessionBean pLoginBean);
	
	public void suppressLoginMessages(List<Long> id, P3SUser user);

}
