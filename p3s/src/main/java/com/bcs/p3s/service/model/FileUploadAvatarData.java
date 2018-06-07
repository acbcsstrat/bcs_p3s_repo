package com.bcs.p3s.service.model;

public class FileUploadAvatarData {
	
	private String filename = null; // almost Obsolete
	private byte[] rawImage = new byte[12582912]; // 12MB
	private byte[] resizedImage = new byte[102400]; // 100k
	private String resultPageUrl = null;
	private String dashboardUrl = null;
	private boolean uploadOk = false;
	

	
	// Standard Getters & Setters

	public String getFilename() {
		return filename;
	}
	public void setFilename(String filename) {
		this.filename = filename;
	}
	public byte[] getRawImage() {
		return rawImage;
	}
	public void setRawImage(byte[] rawImage) {
		this.rawImage = rawImage;
	}
	public byte[] getResizedImage() {
		return resizedImage;
	}
	public void setResizedImage(byte[] resizedImage) {
		this.resizedImage = resizedImage;
	}
	public String getResultPageUrl() {
		return resultPageUrl;
	}
	public void setResultPageUrl(String resultPageUrl) {
		this.resultPageUrl = resultPageUrl;
	}
	public String getDashboardUrl() {
		return dashboardUrl;
	}
	public void setDashboardUrl(String dashboardUrl) {
		this.dashboardUrl = dashboardUrl;
	}
	public boolean isUploadOk() {
		return uploadOk;
	}
	public void setUploadOk(boolean uploadOk) {
		this.uploadOk = uploadOk;
	}

}
