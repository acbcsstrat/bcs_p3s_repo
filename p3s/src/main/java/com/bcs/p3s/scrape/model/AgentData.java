package com.bcs.p3s.scrape.model;

import java.util.List;

public class AgentData {
	
	private String changeDate;
	private String changeGazetteNumber;
	
	private List<Agent> listAgents;
	
	public AgentData() {
		super();
	}
	

	public AgentData(String changeDate, String changeGazetteNumber, List<Agent> listAgents) {
		super();
		this.changeDate = changeDate;
		this.changeGazetteNumber = changeGazetteNumber;
		this.listAgents = listAgents;
	}


	public String getChangeDate() {
		return changeDate;
	}

	public void setChangeDate(String changeDate) {
		this.changeDate = changeDate;
	}
	

	public String getChangeGazetteNumber() {
		return changeGazetteNumber;
	}


	public void setChangeGazetteNumber(String changeGazetteNumber) {
		this.changeGazetteNumber = changeGazetteNumber;
	}


	public List<Agent> getListAgents() {
		return listAgents;
	}

	public void setListAgents(List<Agent> listAgents) {
		this.listAgents = listAgents;
	}
	
	

}
