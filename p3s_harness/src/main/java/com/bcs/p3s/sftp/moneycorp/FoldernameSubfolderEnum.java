package com.bcs.p3s.sftp.moneycorp;

import com.bcs.p3s.enump3s.P3SAbstractEnum;

//Sub-Foldernames that exist in each FoldernameEnum foldeer
public class FoldernameSubfolderEnum extends P3SAbstractEnum {

	public static final String PROCESSED = "processed"; 
	public static final String ERROR = "error"; 


    // Constructor - Which verifies the value provided
    public FoldernameSubfolderEnum(String folder)  
    {
                if (folder==null) fail("FoldernameSubfolderEnum constructor passed null");

                String sofar = null;
                if (folder.equalsIgnoreCase(FoldernameSubfolderEnum.PROCESSED)) sofar = FoldernameSubfolderEnum.PROCESSED; 
                if (folder.equalsIgnoreCase(FoldernameSubfolderEnum.ERROR)) sofar = FoldernameSubfolderEnum.ERROR; 

                if (sofar != null) {
                	this.value = sofar;
                } else {
                	fail("FoldernameSubfolderEnum constructor passed invalid foldername : "+folder);
                }
    }

}
