package com.bcs.p3s.session;

import java.util.List;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.wrap.PatentExtendedData;
import org.springframework.context.annotation.ScopedProxyMode;

@Component("postSession")
@Scope(value = "session" , proxyMode = ScopedProxyMode.TARGET_CLASS)
public class PostLoginSessionBean {
	
	private P3SUser user;
	private Business business;
	
	private List<PatentExtendedData> extendedPatentUI;
	
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
	public List<PatentExtendedData> getExtendedPatentUI() {
		return extendedPatentUI;
	}
	public void setExtendedPatentUI(List<PatentExtendedData> extendedPatentUI) {
		this.extendedPatentUI = extendedPatentUI;
	}
	
	
}
