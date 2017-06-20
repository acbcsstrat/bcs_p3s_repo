package com.bcs.p3s.controller.rest;

import java.util.List;

import javax.persistence.TypedQuery;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import com.bcs.p3s.display.PatentUI;
import com.bcs.p3s.display.UserProfileUI;
import com.bcs.p3s.model.Business;
//import com.bcs.p3s.controller.web.User;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.security.SecurityUtil;
import com.bcs.p3s.service.PatentService;
import com.bcs.p3s.util.config.EnvironmentSpecificProperties;
import com.bcs.p3s.util.config.PropertyReader;
import com.bcs.p3s.util.lang.Universal;
 
@RestController
public class UserProfileRestController extends Universal {
 
    @Autowired
    PatentService patentService;  //Service which will do all data retrieval/manipulation work
 
    
    //------------------- Retrieve All Patents (For this Business) --------------------------------------------------
     
    @RequestMapping(value = "/rest-user/", method = RequestMethod.GET)
    public ResponseEntity<UserProfileUI> getUserProfileUI() {
    	System.out.println("UserProfileRestController : /rest-user/ (get UserProfile) invoked ");

    	UserProfileUI userProfileUI = patentService.getUserProfileUI();

        return new ResponseEntity<UserProfileUI>(userProfileUI, HttpStatus.OK);
    }
 
 
    
    //-------------------Retrieve Single User OBSOLETE - see below --------------------------------------------------------
     
    // Tmp fix - in case Patrick invoke Merin's initial API  - ie /rest-user/{user-id} 
    @RequestMapping(value = "/rest-user/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserProfileUI> obsoletegetUserProfileUI_OBS(@PathVariable("id") long id) {
    	System.out.println("UserProfileRestController : OBSOLETE /rest-user/{"+id+"}  (get UserProfile) invoked. Redirecting ... ");
        return getUserProfileUI();
    }
 
// originally - & followign THE PATTERN
    //    @RequestMapping(value = "/rest-patent/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<Patent> getPatent(@PathVariable("id") long id) {
//        System.out.println("Fetching Patent with id " + id);
//        Patent patent = patentService.findById(id);
//        if (patent == null) {
//            System.out.println("Patent with id " + id + " not found");
//            return new ResponseEntity<Patent>(HttpStatus.NOT_FOUND);
//        }
//        return new ResponseEntity<Patent>(patent, HttpStatus.OK);
//    }
 
     
     
//    //-------------------Create a Patent--------------------------------------------------------
//     
//
//    @RequestMapping(value = "/rest-patent/", method = RequestMethod.POST)
//    public ResponseEntity<Void> createPatent(@RequestBody Patent patent,    UriComponentsBuilder ucBuilder) {
//        System.out.println("rest Creating Patent " + patent.getPatentApplicationNumber() + " :: "+ patent.getClientRef());
// 
//        if (patentService.isPatentExist(patent)) {
//            System.out.println("A Patent with name " + patent.getPatentApplicationNumber() + " already exist");
//            return new ResponseEntity<Void>(HttpStatus.CONFLICT);
//        }
// 
//        patentService.savePatent(patent);
// 
//        HttpHeaders headers = new HttpHeaders();
//        headers.setLocation(ucBuilder.path("/patent/{id}").buildAndExpand(patent.getId()).toUri());
//        return new ResponseEntity<Void>(headers, HttpStatus.CREATED);
//    }
// 
//    
//     
//    //------------------- Update a Patent --------------------------------------------------------
//     
//    @RequestMapping(value = "/rest-patent/{id}", method = RequestMethod.PUT)
//    public ResponseEntity<Patent> updatePatent(@PathVariable("id") long id, @RequestBody Patent patent) {
//        System.out.println("Updating Patent " + id);
//         
//        Patent currentPatent = patentService.findById(id);
//         
//        if (currentPatent==null) {
//            System.out.println("Patent with id " + id + " not found");
//            return new ResponseEntity<Patent>(HttpStatus.NOT_FOUND);
//        }
// 
//        currentPatent.setPatentApplicationNumber(patent.getPatentApplicationNumber());
//        currentPatent.setClientRef(patent.getClientRef());
//         
//        patentService.updatePatent(currentPatent);
//        return new ResponseEntity<Patent>(currentPatent, HttpStatus.OK);
//    }
// 
//    
//    
//    //------------------- Delete a Patent --------------------------------------------------------
//     
//    @RequestMapping(value = "/rest-patent/{id}", method = RequestMethod.DELETE)
//    public ResponseEntity<Patent> deletePatent(@PathVariable("id") long id) {
//        System.out.println("Fetching & Deleting Patent with id " + id);
// 
//        Patent patent = patentService.findById(id);
//        if (patent == null) {
//            System.out.println("Unable to delete. Patent with id " + id + " not found");
//            return new ResponseEntity<Patent>(HttpStatus.NOT_FOUND);
//        }
// 
//        patentService.deletePatentById(id);
//        return new ResponseEntity<Patent>(HttpStatus.NO_CONTENT);
//    }
// 
//     
//    
//    //------------------- Delete All Patents --------------------------------------------------------
//     
//    @RequestMapping(value = "/rest-patent/", method = RequestMethod.DELETE)
//    public ResponseEntity<Patent> deleteAllPatents() {
//        System.out.println("Deleting All Patents");
// 
//        patentService.deleteAllPatents();
//        return new ResponseEntity<Patent>(HttpStatus.NO_CONTENT);
//    }
 
}