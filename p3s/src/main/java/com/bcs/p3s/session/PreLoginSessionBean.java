package com.bcs.p3s.session;

import java.util.Enumeration;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionContext;
import javax.servlet.http.HttpSessionEvent;

import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.P3SUser;

@Component("preSession")
@Scope(value = "session" , proxyMode = ScopedProxyMode.TARGET_CLASS)
public class PreLoginSessionBean {
	

	private P3SUser user;
	private Business business;
	
	

	public P3SUser getUser() {
		return user;
	}

	public void setUser(P3SUser user) {
		this.user = user;
	}

	public Business getBusiness() {
		return business;
	}

	public void setBusiness(Business business) {
		this.business = business;
	}


}
