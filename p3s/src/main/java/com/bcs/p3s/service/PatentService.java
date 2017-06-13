package com.bcs.p3s.service;

import java.util.List;

import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.display.UserProfileUI;
import com.bcs.p3s.model.Patent;



public interface PatentService {
	
	List<Patent> listAllPatentsForMyBusiness(); // Possibly unused externally
	List<PatentUI> listAllPatentUIsForMyBusiness(); 
	
	UserProfileUI getUserProfileUI();

	
	
	
//	Patent findById(long id);
//	
//	Patent findByName(String name);
//	
//	void savePatent(Patent patent);
//	
//	void updatePatent(Patent patent);
//	
//	void deletePatentById(long id);
//
//	List<Patent> findAllPatents(); 
//	
//	void deleteAllPatents();
//	
//	public boolean isPatentExist(Patent patent);
	
}
