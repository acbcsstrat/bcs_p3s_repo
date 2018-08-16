package com.bcs.p3s.service;

import org.springframework.stereotype.Service;

import com.bcs.p3s.display.form1200.StartForm1200Api21UI;
import com.bcs.p3s.engine.DummyForm1200Engine;


@Service("Form1200Service")
public class Form1200ServiceImpl extends ServiceAuthorisationTools implements Form1200Service {

	protected String PREFIX = this.getClass().getName() + " : "; 

	@Override
	public StartForm1200Api21UI getForm1200QuestionData(long patentID) {

		String err = PREFIX+"getForm1200QuestionData("+patentID+") ";

		// NOT below yet - fails = as nno link to my business
//		checkForm1200isViable(patentID, err);
		// acTodo - this and ALL OTHER check* methods need review (re not throw exceptions, & how signal back to controller to return error)
		
		
		DummyForm1200Engine dummyEngine = new DummyForm1200Engine();
		StartForm1200Api21UI questionData = dummyEngine.getDummyForm1200QuestionData(patentID);
		
		return questionData;
	}

}
