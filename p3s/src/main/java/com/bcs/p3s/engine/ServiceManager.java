package com.bcs.p3s.engine;

import java.util.ArrayList;
import java.util.List;

import com.bcs.p3s.display.Service;
import com.bcs.p3s.model.Patent;

/**
 * See com.bcs.p3s.display.Service
 *
 */
public class ServiceManager {

    public static final String TYPE_FORM1200				= "Form1200"; 
    public static final String TYPE_RENEWAL					= "Renewal";

    
    public List<Service> getServicesForPatent(Patent patent) {
    	List<Service> services = new ArrayList<Service>();
    	if (patent==null) return services;
    	
		Service service = new Service();
    	if (StageManager.isInFiling(patent.getEpoPatentStatus())) {
    		// Unconditionally return a Form1200 Status
    		
    		// dummy details - for now
    		DummyForm1200Engine dummy = new DummyForm1200Engine();
    		service = dummy.dummyF1200Service_variant1();
    		
    		
    		services.add(service);
    	}
    	else if (StageManager.isInProsecution(patent.getEpoPatentStatus())) {
    		// If we can sell a renewal
    		
    		// dummy details - for now
    		DummyForm1200Engine dummy = new DummyForm1200Engine();
    		service = dummy.dummyF1200Service_variant1();
    		
    		
    		services.add(service);
    	}
    	
    	
    	
    	return services;
    }
    
    
}
