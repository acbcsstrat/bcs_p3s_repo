package com.bcs.p3s.scrape.model;

import com.bcs.p3s.enump3s.ThrottleStatusEnum;

public class ResponseHeaderPojo {
	
	private long quotaUsedPerHour;
	
	private long quotaUsedPerWeek;
	
	private ThrottleStatusEnum HighThrottleStatus;
	
	private long accessInterval;
	
	private String systemState;
	
	private String headerData;
	
	private String fullThrottlingData;

	public long getQuotaUsedPerHour() {
		return quotaUsedPerHour;
	}

	public void setQuotaUsedPerHour(long quotaUsedPerHour) {
		this.quotaUsedPerHour = quotaUsedPerHour;
	}

	public long getQuotaUsedPerWeek() {
		return quotaUsedPerWeek;
	}

	public void setQuotaUsedPerWeek(long quotaUsedPerWeek) {
		this.quotaUsedPerWeek = quotaUsedPerWeek;
	}

	public ThrottleStatusEnum getHighThrottleStatus() {
		return HighThrottleStatus;
	}

	public void setHighThrottleStatus(ThrottleStatusEnum highThrottleStatus) {
		HighThrottleStatus = highThrottleStatus;
	}

	public long getAccessInterval() {
		return accessInterval;
	}

	public void setAccessInterval(long accessInterval) {
		this.accessInterval = accessInterval;
	}

	public String getSystemState() {
		return systemState;
	}

	public void setSystemState(String systemState) {
		this.systemState = systemState;
	}

	public String getHeaderData() {
		return headerData;
	}

	public void setHeaderData(String headerData) {
		this.headerData = headerData;
	}

	public String getFullThrottlingData() {
		return fullThrottlingData;
	}

	public void setFullThrottlingData(String fullThrottlingData) {
		this.fullThrottlingData = fullThrottlingData;
	}
	
	

	
}
