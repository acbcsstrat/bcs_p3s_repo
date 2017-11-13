package com.bcs.p3s.controller.web;


import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.docs.email.EmailDevTest;
import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.security.SecurityUtil;
import com.bcs.p3s.service.PatentService;
import com.bcs.p3s.util.config.BuildinfoPropertyReader;
import com.bcs.p3s.util.env.Hostname;
import com.bcs.p3s.util.lang.Universal;



@Controller
public class MiscController extends Universal {

		@Autowired
		PatentService patentService;  //Service which will do all data retrieval/manipulation work


		@RequestMapping(value="/whoami", method = RequestMethod.GET, produces = "text/html")
	    public String whoami(Model uiModel) {
			System.out.println("whoami in MiscController invoked");

            P3SUser me = SecurityUtil.getMyUser();
            Business myBuisness = SecurityUtil.getMyBusiness();
        	List<PatentUI> patentUIs = patentService.listAllPatentUIsForMyBusiness();

        	BuildinfoPropertyReader buildinfoPropertyReader = new BuildinfoPropertyReader();
        	String buildTimestamp = buildinfoPropertyReader.getBuildTimestamp();
        	String dbname = buildinfoPropertyReader.whichDB();
    		String hostname = Hostname.getHostname();

        	
            uiModel.addAttribute("me", me);
            uiModel.addAttribute("myBusiness", myBuisness);
            uiModel.addAttribute("patents", patentUIs);
            uiModel.addAttribute("numpatents", patentUIs.size() );
            uiModel.addAttribute("buildtimestamp", buildTimestamp );
            uiModel.addAttribute("dbname", dbname );
            uiModel.addAttribute("hostname", hostname );
            
            
            return "whoami";
	    }

		
		
		@RequestMapping(value="/acgenerateemail", method = RequestMethod.POST, produces = "text/html")
	    public String acgenerateemail(Model uiModel, String emailchoice) {
			log().debug("acgenerateemail in MiscController invoked  : param = "+emailchoice);

			int code = Integer.parseInt(emailchoice);
			EmailDevTest tester = new EmailDevTest();
			tester.testByCode(code);
			
            return "index";
	    }
	    

	
}
