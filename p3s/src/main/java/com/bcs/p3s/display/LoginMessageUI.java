package com.bcs.p3s.display;

import java.util.List;

import com.bcs.p3s.model.LoginMessage;

public class LoginMessageUI {
	
	private List<LoginMessage> systemMessages;
	
	private List<PatentUI> urgentPatents;

	public List<LoginMessage> getSystemMessages() {
		return systemMessages;
	}

	public void setSystemMessages(List<LoginMessage> systemMessages) {
		this.systemMessages = systemMessages;
	}

	public List<PatentUI> getUrgentPatents() {
		return urgentPatents;
	}

	public void setUrgentPatents(List<PatentUI> urgentPatents) {
		this.urgentPatents = urgentPatents;
	}
	

}
