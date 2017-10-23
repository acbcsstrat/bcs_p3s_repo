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

@Component("preSession")
@Scope(value = "session" , proxyMode = ScopedProxyMode.TARGET_CLASS)
public class PreLoginSessionBean {
	

	private Business business;

	public Business getBusiness() {
		return business;
	}

	public void setBusiness(Business business) {
		this.business = business;
	}


}
