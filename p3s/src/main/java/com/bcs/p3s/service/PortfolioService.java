package com.bcs.p3s.service;

import java.util.List;

import javax.servlet.http.HttpSession;

import com.bcs.p3s.display.PortfolioUI;
import com.bcs.p3s.engine.ServiceManager;
import com.bcs.p3s.model.Patent;

public interface PortfolioService {
	
	public List<PortfolioUI> listAllPortfolioUIsForMyBusiness();
	
	public PortfolioUI createPortfolioUIforPatent(Patent patent, ServiceManager serviceManager, HttpSession session); 

}
