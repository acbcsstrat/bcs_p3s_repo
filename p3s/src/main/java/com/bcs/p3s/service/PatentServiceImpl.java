package com.bcs.p3s.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

import javax.persistence.TypedQuery;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.display.UserProfileUI;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.security.SecurityUtil;

@Service("PatentService")
public class PatentServiceImpl implements PatentService {

	// (Likely) Only used internally (below) -could be protected
	public List<Patent> listAllPatentsForMyBusiness() { 
    	System.out.println("PatentServiceImpl : listAllPatentsForMyBusiness() invoked ");

    	Business myBusiness = SecurityUtil.getMyBusiness();
        TypedQuery<Patent> tq_patents = Patent.findPatentsByBusiness(myBusiness);
    	List<Patent> patents = tq_patents.getResultList();
    	
    	System.out.println("PatentServiceImpl : listAllPatentsForMyBusiness() ret Qty "+patents.size());
        return patents;
	}

	
	public List<PatentUI> listAllPatentUIsForMyBusiness() {
		List<Patent> patents = listAllPatentsForMyBusiness();
		List<PatentUI> patentUIs = new ArrayList<PatentUI>();
		for (Patent patent: patents) {
			PatentUI patentUI = new PatentUI(patent);
			patentUIs.add(patentUI);
		}
		return patentUIs; 
	}
	

	
	
	
//	private static final AtomicLong counter = new AtomicLong();
//	
//	private static List<Patent> patents;
//	
////	static{
////		patents= populateDummyPatents();
////	}
//
//	public List<Patent> findAllPatents() {
//		return patents;
//	}
//	
//	public Patent findById(long id) {
//		for(Patent patent : patents){
//			if(patent.getId() == id){
//				return patent;
//			}
//		}
//		return null;
//	}
//	
//	public Patent findByName(String name) {
//		for(Patent patent : patents){
//			if(patent.getPatentApplicationNumber().equalsIgnoreCase(name)){
//				return patent;
//			}
//		}
//		return null;
//	}
//	
//	public void savePatent(Patent patent) {
//		patent.setId(counter.incrementAndGet());
//		patents.add(patent);
//	}
//
//	public void updatePatent(Patent patent) {
//		int index = patents.indexOf(patent);
//		patents.set(index, patent);
//	}
//
//	public void deletePatentById(long id) {
//		
//		for (Iterator<Patent> iterator = patents.iterator(); iterator.hasNext(); ) {
//		    Patent patent = iterator.next();
//		    if (patent.getId() == id) {
//		        iterator.remove();
//		    }
//		}
//	}
//
//	public boolean isPatentExist(Patent patent) {
//		return findByName(patent.getPatentApplicationNumber())!=null;
//	}
//	
//	public void deleteAllPatents(){
//		patents.clear();
//	}
//
////	private static List<Patent> populateDummyPatents(){
////		List<Patent> patents = new ArrayList<Patent>();
////
////		patents.add(new Patent(counter.incrementAndGet(), "US146432.4", "Hewey"));
////		patents.add(new Patent(counter.incrementAndGet(), "GB444555", "Dewey"));
////		patents.add(new Patent(counter.incrementAndGet(), "WO77665544", "Louie"));
////
////		return patents;
////	}

}
