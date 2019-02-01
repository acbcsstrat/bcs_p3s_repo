package com.bcs.p3s.controller.rest;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bcs.p3s.display.form1200.ExtensionStateUI;
import com.bcs.p3s.display.form1200.Form1200SavedData;
import com.bcs.p3s.display.form1200.GenerateForm1200DataIn;
import com.bcs.p3s.display.form1200.GenerateForm1200Extractor;
import com.bcs.p3s.display.form1200.PageDescriptionEnum;
import com.bcs.p3s.display.form1200.PageDescriptionUI;
import com.bcs.p3s.display.form1200.StartForm1200Api21UI;
import com.bcs.p3s.display.form1200.ValidationStateUI;
import com.bcs.p3s.engine.DummyForm1200Engine;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.scrape.model.Form1200Record;
import com.bcs.p3s.service.Form1200Service;
import com.bcs.p3s.service.ServiceAuthorisationTools;
import com.bcs.p3s.session.PostLoginSessionBean;
import com.bcs.p3s.util.config.P3SPropertyException;
import com.bcs.p3s.util.config.P3SPropertyNames;
import com.bcs.p3s.util.config.P3SPropertyReader;
import com.bcs.p3s.util.lang.P3SRuntimeException;
import com.bcs.p3s.util.lang.Universal;

/**
 * Note :- A controller to have the rest methods for Portfolio page. Could be
 * merged with PatentRestController in future
 * 
 * @author MerinP
 *
 */

@RestController
@Configuration
@ComponentScan("com.bcs.p3s")
public class Form1200RestController extends Universal {

	@Autowired
	Form1200Service form1200Service;

	@Autowired
	HttpSession session;

	protected String PREFIX = this.getClass().getName() + " : ";

	// Implements API section 2.1 - Start Form1200 data entry
	// i.e. when user CHOOSES to start the Form1200 questionairre
	@RequestMapping(value = "/rest-start-form1200/{id}", method = RequestMethod.GET)
	public ResponseEntity<StartForm1200Api21UI> startForm1200(@PathVariable("id") long id) {

		log().debug(PREFIX + "/rest-start-form1200/" + id + " startForm1200()");

		detectAnyRogueDoubleSubmit(id);

		StartForm1200Api21UI startForm1200Api21UI = null;
		try {
			startForm1200Api21UI = form1200Service.getForm1200QuestionData(id);
		} catch (Exception e) {
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			log().error("startForm1200 Stacktrace was: " + errors.toString());
		}

		if (startForm1200Api21UI == null) {
			log().debug(PREFIX + "/rest-start-form1200/ completed UNsuccessfully");
			return new ResponseEntity<StartForm1200Api21UI>(HttpStatus.NOT_FOUND); // =404 //You many decide to return
																					// HttpStatus.NO_CONTENT
		} else {
			log().debug(PREFIX + "/rest-start-form1200/ completed successfully");
			return new ResponseEntity<StartForm1200Api21UI>(startForm1200Api21UI, HttpStatus.OK);
		}

	}

	// this is TMP for invoking from tmpGenF1200.html - in absence of FE code
	// hence params are simple form params - no the onjects that the FE will send
	@RequestMapping(value = "/rest-form1200-tmpGenF1200/", method = RequestMethod.POST)
	public ResponseEntity<Form1200SavedData> generateForm1200tmpGenF1200(@RequestParam("Patent_ID") long patentId,
			@RequestParam("clientRef") String clientRef, @RequestParam("totalClaims") long totalClaims,
			@RequestParam(value = "isYear3RenewalPaying", required = false) boolean isYear3RenewalPaying,
			@RequestParam("totalPages") long totalPages
			// , @RequestParam("") Object extensionStatesUI
			// , @RequestParam("") Object validationStatesUI
			// , @RequestParam("") Object pageDescriptionUI

			// accept 2+6 strings
			, @RequestParam("extsnStatesCSV") String extsnStatesCSV,
			@RequestParam("validStatesCSV") String validStatesCSV, @RequestParam("descStart") String descStart,
			@RequestParam("descEnd") String descEnd, @RequestParam("claimsStart") String claimsStart,
			@RequestParam("claimsEnd") String claimsEnd, @RequestParam("drgsStart") String drgsStart,
			@RequestParam("drgsEnd") String drgsEnd) {
		// Note isYear3RenewalPaying is marked optional NOT because the question is
		// conditional, but because HTML form doesn't send unchecked checkboxes

		log().debug(PREFIX + "/rest-form1200-tmpGenF1200/ generateForm1200tmpGenF1200() invoked");

		log().debug("str 1 is " + patentId);
		log().debug("str 2 is " + clientRef);
		log().debug("str 3 is " + totalClaims);
		log().debug("str 4 is " + isYear3RenewalPaying);
		log().debug("str 5 is " + totalPages);
		log().debug("extsnStatesCSV is " + extsnStatesCSV);
		log().debug("validStatesCSV is " + validStatesCSV);
		log().debug("desc <> is " + descStart + ", " + descEnd);
		log().debug("clms <> is " + claimsStart + ", " + claimsEnd);
		log().debug("drgs <> is " + drgsStart + ", " + drgsEnd);

		log().debug(CLASSNAME + "/rest-patents/ generateForm1200() invoked. ");

		Form1200SavedData form1200SavedData = null;
		LinkedHashMap<String, Object> obby = new LinkedHashMap<String, Object>();
		try {
			// do stuff

			List<ExtensionStateUI> extensionStatesUI = null;
			List<ValidationStateUI> validationStatesUI = null;
			List<PageDescriptionUI> pageDescriptionUI = new ArrayList<PageDescriptionUI>();

			DummyForm1200Engine dummy = new DummyForm1200Engine();
			extensionStatesUI = dummy.listStrStates2ExtnsStates(dummy.csStings2ist(extsnStatesCSV));
			validationStatesUI = dummy.listStrStates2ValidStates(dummy.csStings2ist(validStatesCSV));

			PageDescriptionUI aPageDescriptionUI = null;
			aPageDescriptionUI = new PageDescriptionUI(PageDescriptionEnum.Description, descStart, descEnd);
			pageDescriptionUI.add(aPageDescriptionUI);
			aPageDescriptionUI = new PageDescriptionUI(PageDescriptionEnum.Claims, claimsStart, claimsEnd);
			pageDescriptionUI.add(aPageDescriptionUI);
			aPageDescriptionUI = new PageDescriptionUI(PageDescriptionEnum.Drawings, drgsStart, drgsEnd);
			pageDescriptionUI.add(aPageDescriptionUI);

			// whoami
			PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
			P3SUser me = pLoginSession.getUser();

			// EoW 181026 - got to here

			// // make the service call - with many params
			// form1200SavedData = form1200Service.saveNewForm1200details(
			// patentId, clientRef, totalClaims, isYear3RenewalPaying, totalPages,
			// extensionStatesUI, validationStatesUI, pageDescriptionUI, me);
			// thats cheating - do it properly

			obby.put("Patent_ID", patentId);
			obby.put("clientRef", clientRef);
			obby.put("totalClaims", totalClaims);
			obby.put("isYear3RenewalPaying", isYear3RenewalPaying);
			obby.put("totalPages", totalPages);
			obby.put("extensionStatesUI", extensionStatesUI);
			obby.put("validationStatesUI", validationStatesUI);
			// obby.put("pageDescriptionUI", pageDescriptionUI);
			obby.put("pageDescriptionsUI", pageDescriptionUI);

			log().debug(PREFIX + "/rest-form1200-tmpGenF1200/ generateForm1200tmpGenF1200() returning ... ooby");
		} catch (Exception e) {
			logErrorAndContinue(CLASSNAME + "/rest-patents/ generateForm1200() suffered exception", e);
			return new ResponseEntity<Form1200SavedData>(form1200SavedData, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		// return new ResponseEntity<Form1200SavedData>(form1200SavedData,
		// HttpStatus.OK);

		// Now call the REAL controller
		return generateForm1200(obby);
	}

	// Implements API section 2.2 - Generate & Save FORM1200
	// i.e. when user has completed entering the f1200 quetions
	@RequestMapping(value = "/rest-form1200/", method = RequestMethod.POST)
	public ResponseEntity<Form1200SavedData> generateForm1200(@RequestBody Object obby) {

		log().debug(PREFIX + "/form1200/ generateForm1200() invoked");

		// Read 'strict/tolerant' param from property file
		boolean strictAPI = true;
		try {
			P3SPropertyReader reader = new P3SPropertyReader();
			String strTolerant = reader.getGenericProperty(P3SPropertyNames.TOLERATE_FE_DATA_MISMATCH);
			if ("true".equalsIgnoreCase(strTolerant))
				strictAPI = false;
		} catch (P3SPropertyException e) {
			fail(PREFIX + "generateForm1200() property read failed : TOLERATE_FE_DATA_MISMATCH", e);
		}

		Form1200SavedData form1200SavedData = null; // forwardlooking rename? - GenerateForm1200DataOut

		try {

			GenerateForm1200Extractor extractor = new GenerateForm1200Extractor();
			GenerateForm1200DataIn generateForm1200DataIn = extractor.extractGenerateForm1200DataIn(obby, strictAPI);

			log().debug("   ********  NullWatch  *********  mid : PageDescriptionsUI==null is  "
					+ (generateForm1200DataIn.getPageDescriptionsUI() == null));


			// whoami
			PostLoginSessionBean pLoginSession = (PostLoginSessionBean) session.getAttribute("postSession");
			P3SUser me = pLoginSession.getUser();

			// make the service call - with many params

			//try {  // 190201 - if sillyData, did below swallow 'another swallow for FE'. Why. FE WANTs a 500 if fail, so fix. acTidy 
				// form1200SavedData = form1200Service.saveNewForm1200details(
				// patentId, clientRef, totalClaims, isYear3RenewalPaying, totalPages,
				// extensionStatesUI, validationStatesUI, pageDescriptionUI, me);

				form1200SavedData = form1200Service.saveNewForm1200details(generateForm1200DataIn, me);

			//} catch (Exception e) {
			//	// another swallow for FE
			//	log().error("SWALLOWED exception whilst PROCESSING the data entered");
			//	log().error("exception was ", e);
			//}

			log().debug(CLASSNAME + "/rest-patents/ generateForm1200()   returning ...");
		} catch (Exception e) {
			logErrorAndContinue(CLASSNAME + "/rest-patents/ generateForm1200() suffered exception", e);
			return new ResponseEntity<Form1200SavedData>(form1200SavedData, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<Form1200SavedData>(form1200SavedData, HttpStatus.OK);
	}

	// this is TMP for DELETING an epct - until FE provides a control for this
	@RequestMapping(value = "/rest-form1200-tmpDeleteF1200/{patent_id}", method = RequestMethod.GET)
	public ResponseEntity<Object> tmpDeleteTmpForm1200(@PathVariable("patent_id") long patent_id) {

		log().debug(
				PREFIX + "/rest-form1200-tmpDeleteF1200/" + patent_id + " [patentId] tmpDeleteTmpForm1200()  invoked");
		return deleteForm1200(patent_id);
	}

	// Implements API v2.1 section 2.3 - Delete FORM1200 application
	@RequestMapping(value = "/rest-form1200/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Object> deleteForm1200(@PathVariable("id") long id) {

		String err = PREFIX + "/form1200/" + id + " DELETE deleteForm1200(patentId=" + id + ") : ";
		log().debug(err + "invoked");

		try {
			form1200Service.deleteCurrentForm1200Data(id);
		} catch (Exception e) {

			// 190110 mitigate FE behaviour. FE offers this button even when not deleteable
			// - causing an undesirable stackdump in logs (Such should only happen for
			// genuine problems - not user mis-operation)
			// Tmp fix is a try-catch here specifically to catch and suppress this error
			// This (hopefully) temporary change made in both :
			// ServiceAuthorisationTools/checkEpctisDeletable and
			// Form1200ServiceImpl/deleteCurrentForm1200Data
			// Summary: Avoid stackdump in logs. But DO indicate fail to FE, such that FE
			// can advise the user
			if ((e instanceof P3SRuntimeException)
					&& (ServiceAuthorisationTools.DELETE_WORKAROUND_MSG.equals(e.getMessage()))) {

				log().warn(
						"Tmp workaround to avoid log stackdump when FE offers delete button for undeletable epct PDF");
				return new ResponseEntity<Object>(HttpStatus.INTERNAL_SERVER_ERROR); // Alternatives: NO_CONTENT,
																						// NOT_FOUND, BAD_REQUEST.
																						// METHOD_FAILURE

			} else {
				logErrorAndContinue(err + "", e);
				return new ResponseEntity<Object>(HttpStatus.INTERNAL_SERVER_ERROR); // Alternatives: NO_CONTENT,
																						// NOT_FOUND, BAD_REQUEST.
																						// METHOD_FAILURE
			}
		}

		log().debug(err + "completed.");
		return new ResponseEntity<Object>(HttpStatus.OK);
	}

	// Implements API v2.1 section 2.5 - Reject FORM1200 application
	@RequestMapping(value = "/rest-reject-form1200/{patent_id},{fail_reason}", method = RequestMethod.GET)
	public ResponseEntity<Form1200Record> rejectForm1200(@PathVariable long patent_id,
			@PathVariable String fail_reason) {
		// Usage: User is entering question answers, and has entered 1 of the 3
		// Rejectable answers.
		// Immediately update Patent, and possibly Epct, records as appropriate.
		// Removes risk: Existing Epct. User has told us is not valid. If we don't
		// immediately persist this, we are at risk of .

		String err = PREFIX + "/rest-reject-form1200/" + patent_id + ", " + fail_reason
				+ "  REJECT rejectForm1200() : ";
		log().debug(err + "invoked");

		try {
			form1200Service.rejectCurrentForm1200(patent_id, fail_reason);
		} catch (Exception e) {
			logErrorAndContinue(err + "", e);
			return new ResponseEntity<Form1200Record>(HttpStatus.INTERNAL_SERVER_ERROR); // Alternatives: NO_CONTENT,
																							// NOT_FOUND, BAD_REQUEST.
																							// METHOD_FAILURE
		}

		log().debug(err + "completed.");
		return new ResponseEntity<Form1200Record>(HttpStatus.OK);
	}

	protected void fut(String msg) { // acTodo z2.1
		log().error("So this IS AS FAR AS WE ARE GETTING ");
		log().error("************************************************************************************************");
	}

	protected void tellOb(Object o) {
		log().info("");
		log().info("(ob==null) = " + (o == null));
		log().info("o.getClass().getName() = " + o.getClass().getName());
		if (o instanceof String)
			log().info("    isString, so val is: " + (String) o);
		log().info("");
	}

	protected String caaastString(Object o) {
		String ret = "unset";
		if (o instanceof String) {
			try {
				ret = (String) o;
			} catch (Exception e) {
				log().error("caaastString suffered excepion. SWALLOWING");
				log().error("exception was", e);
				ret = "Cast FAILED";
			}
		} else {
			ret = "It WASN'T A STRING !!!";
			log().error("It WASN'T A STRING !!!");
		}
		return ret;
	}

	protected Integer caaastInteger(Object o) {
		Integer ret = new Integer("-1");
		if (o instanceof Integer) {
			try {
				ret = (Integer) o;
			} catch (Exception e) {
				log().error("caaastInteger suffered excepion. SWALLOWING");
				log().error("exception was", e);
				ret = new Integer("-2");
			}
		} else {
			ret = new Integer("-3");
			log().error("It WASN'T An Integer !!!");
		}
		return ret;
	}

	protected Boolean caaastBoolean(Object o) {
		Boolean ret = false;
		if (o instanceof Boolean) {
			try {
				ret = (Boolean) o;
			} catch (Exception e) {
				log().error("caaastBoolean suffered excepion. SWALLOWING");
				log().error("exception was", e);
				ret = false;
			}
		} else {
			ret = true;
			log().error("It WASN'T A Boolean !!! ...,");
		}
		return ret;
	}

	// Start of detectAnyRogueDoubleSubmit
	// Dec2018 - seems FE submits valid request on /rest-start-form1200/{id} - then
	// almost immediatly sunmits an invalid
	// DETECT if happens, * log
	protected void detectAnyRogueDoubleSubmit(long id) {
		long timelast = laststart;
		long timenow = (new Date()).getTime();
		laststart = timenow;
		long diff = timenow - timelast;
		String msg = "detectAnyRogueDoubleSubmit requests " + (diff / 1000)
				+ " seconds apart for /rest-start-form1200/";
		if (diff < 30000)
			log().warn(msg);
		else
			log().debug(msg);
	}

	protected static long laststart = 0;
	// End of detectAnyRogueDoubleSubmit
}
