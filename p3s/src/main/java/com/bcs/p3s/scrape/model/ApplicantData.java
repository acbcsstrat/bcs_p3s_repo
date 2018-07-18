package com.bcs.p3s.scrape.model;

import java.util.List;

public class ApplicantData {
	
	private String changeDate;
	
	private List<Applicants> listApplicants;
	
	public ApplicantData() {
		super();
	}

	public ApplicantData(String changeDate, List<Applicants> listApplicants) {
		super();
		this.changeDate = changeDate;
		this.listApplicants = listApplicants;
	}

	public String getChangeDate() {
		return changeDate;
	}

	public void setChangeDate(String changeDate) {
		this.changeDate = changeDate;
	}

	public List<Applicants> getListApplicants() {
		return listApplicants;
	}

	public void setListApplicants(List<Applicants> listApplicants) {
		this.listApplicants = listApplicants;
	}
	
	

}
