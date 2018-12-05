package com.bcs.p3s.display;

public class TxnProduct {

	String productType;
	long productId;
	String patentAppNum;
	long patentId;
	String existingStatus;
	String dropdowns;
	long blobId;
	
	
	public TxnProduct(String productType, long productId, String patentAppNum, long patentId, String existingStatus, String dropdowns, long blobId)
	{
		this.productType = productType;
		this.productId = productId;
		this.patentAppNum = patentAppNum;
		this.patentId = patentId;
		this.existingStatus = existingStatus;
		this.dropdowns = dropdowns;
		this.blobId = blobId;
	}



	// Ordinary Getters & Setters
	
	public String getProductType() {
		return productType;
	}


	public void setProductType(String productType) {
		this.productType = productType;
	}


	public long getProductId() {
		return productId;
	}


	public void setProductId(long productId) {
		this.productId = productId;
	}


	public String getPatentAppNum() {
		return patentAppNum;
	}


	public void setPatentAppNum(String patentAppNum) {
		this.patentAppNum = patentAppNum;
	}


	public long getPatentId() {
		return patentId;
	}


	public void setPatentId(long patentId) {
		this.patentId = patentId;
	}


	public String getExistingStatus() {
		return existingStatus;
	}


	public void setExistingStatus(String existingStatus) {
		this.existingStatus = existingStatus;
	}


	public String getDropdowns() {
		return dropdowns;
	}


	public void setDropdowns(String dropdowns) {
		this.dropdowns = dropdowns;
	}


	public long getBlobId() {
		return blobId;
	}


	public void setBlobId(long blobId) {
		this.blobId = blobId;
	}
}
