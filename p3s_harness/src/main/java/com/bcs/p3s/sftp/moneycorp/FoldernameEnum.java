package com.bcs.p3s.sftp.moneycorp;

import com.bcs.p3s.enump3s.P3SAbstractEnum;

public class FoldernameEnum extends P3SAbstractEnum {

    public static final String RATES = "Rates";
    public static final String ORDERS = "Orders";
    public static final String TRANSACTIONSTATUS = "TransactionStatus"; 
    public static final String RECONCILIATION  = "Reconciliation";
    


    // Constructor - Which verifies the value provided
    public FoldernameEnum(String folder)  
    {
                if (folder==null) fail("FoldernameEnum constructor passed null");

                String sofar = null;
                if (folder.equalsIgnoreCase(FoldernameEnum.RATES)) sofar = FoldernameEnum.RATES; 
                if (folder.equalsIgnoreCase(FoldernameEnum.ORDERS)) sofar = FoldernameEnum.ORDERS; 
                if (folder.equalsIgnoreCase(FoldernameEnum.TRANSACTIONSTATUS)) sofar = FoldernameEnum.TRANSACTIONSTATUS; 
                if (folder.equalsIgnoreCase(FoldernameEnum.RECONCILIATION)) sofar = FoldernameEnum.RECONCILIATION; 
                

                if (sofar != null) {
                	this.value = sofar;
                } else {
                	fail("FoldernameEnum constructor passed invalid foldername : "+folder);
                }
    }

}
