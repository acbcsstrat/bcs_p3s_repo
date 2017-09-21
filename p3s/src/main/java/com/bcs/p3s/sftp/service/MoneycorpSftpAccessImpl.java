package com.bcs.p3s.sftp.service;

import java.util.ArrayList;

import com.bcs.p3s.sftp.model.Order;
import com.bcs.p3s.util.lang.Universal;
import com.bcs.p3s.util.sftp.P3sSftp;


public class MoneycorpSftpAccessImpl extends Universal implements MoneycorpSftpAccess {

	protected String PREFIX = this.getClass().getName() + " : "; 
	
	@Override
	public void createOrderFile(Order order){
		// TODO Auto-generated method stub
		String msg = PREFIX + "createOrderFile("+order+")";
		
		P3sSftp sftp = new P3sSftp();
		try{
			
			//csv file variables
			String COMMA_DELIMITER = ",";
				
			//Orders CSV File Header 
			String FILE_HEADER = "PatentPlaceRef,Ccy1,Ccy2,Rate,Ccy1AmountProvided,Ccy1toCcy2AmountRequired,Ccy1toHOLDINGamountRequired,Ccy2AmountRequired,"
					+ "DestinationPatentOffice,Method,ReferenceForDestinationPayment,ValueDate,CreationTimestamp";
			
			ArrayList<String> lines = new ArrayList<String>();
			//Build the order content as like a csv - HAND CRAFTING THE FILE CONTENTS. THE FORMAT SHOULD BE THE SAME EVERYTIME
			String oneLine = "";
			oneLine = order.getP3sTransRef()+ COMMA_DELIMITER + order.getSrcCurrency()+ COMMA_DELIMITER + 
					order.getDestCurrency() + COMMA_DELIMITER + order.getSrc_dest_fxRate() + COMMA_DELIMITER +
					order.getSubTotalUSD() + COMMA_DELIMITER + order.getAmountToEPO_USD() + COMMA_DELIMITER +
					order.getHoldingAmountUSD() + COMMA_DELIMITER +order.getAmountToEPO_USD() + COMMA_DELIMITER +
					order.getDestinationOffice()+COMMA_DELIMITER + order.getPaymentMethod() + COMMA_DELIMITER +
					order.getReference()+ COMMA_DELIMITER +order.getPaymentValueDate() + COMMA_DELIMITER +
					order.getCurrentDatestamp();
			
			lines.add(FILE_HEADER);
			lines.add(oneLine);
			
			if(lines.size() == 2){
				log().debug(" createOrderFile() finished by generating 2 lines of data"); 
				String writefileName = order.getP3sTransRef()+".csv";
				sftp.upload(lines,writefileName);
			}
			else{
				log().fatal(" createOrderFile() finished with error.Method returning without uploading the current file");
				return;
			}
		}
		
		catch(NullPointerException e){
			log().fatal("Exception thrown inside " + msg + e.getStackTrace());
			e.printStackTrace();
		}
		catch(Exception e){
			log().fatal("Exception thrown inside " + msg + e.getStackTrace());
			e.printStackTrace();
		}
		
	}

	
}
