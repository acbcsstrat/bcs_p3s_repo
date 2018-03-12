package com.bcs.p3s.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.bcs.p3s.enump3s.TxnNextStateEnum;
import com.bcs.p3s.model.Payment;
import com.bcs.p3s.sftp.moneycorp.MoneycorpPaymentStatusEnum;
import com.bcs.p3s.sftp.moneycorp.TransactionStatusSftpManager;
import com.bcs.p3s.sftp.moneycorp.model.TransactionStatus;
import com.bcs.p3s.sftp.service.P3sSftpException;

public class EmulateMCService {

	protected String PREFIX = this.getClass().getName() + " : "; 

	public void processHarnessInstruction(String p3sRef, String instruction) throws P3sSftpException {
		
		String err = PREFIX + "processHarnessInstruction("+instruction+")";
		BigDecimal OVERPAY = new BigDecimal("111.11"); 
		BigDecimal ONE_PENNY = new BigDecimal("0.01"); 
		BigDecimal UNEXPECTED_PAYMENT = new BigDecimal("100000.00"); 
		
		String p3sref = p3sRef;
		String mcref = "neverUsed";
		String status = null;
		String usdProvided = "0";
		String createDate = "32nd March 1963";
		String failMsg = "";
		String incomingRef = "";
		boolean txnFailed = false;
		
		TxnNextStateEnum enumInstruction = new TxnNextStateEnum(instruction); 
		String cmd = enumInstruction.toString();

		// Now set/amend values as required
		
		// Retrieve the expected USD value
		Payment txn = Payment.findPaymentsByP3S_TransRef(p3sref).getSingleResult();
		BigDecimal expectedUsd = txn.getTransAmount_USD();
				
		if (cmd.equals(TxnNextStateEnum.AWAITING_FUNDS)) 
		{ 
			status = MoneycorpPaymentStatusEnum.MONEYCORP_AWAITING_FUNDS;
		}
		else if (cmd.equals(TxnNextStateEnum.FUNDS_RECEIVED)
		 || cmd.equals(TxnNextStateEnum.FUNDS_OVERPAID)) 
		{ 
			mcref = "dummyMCref"; 
			status = MoneycorpPaymentStatusEnum.MONEYCORP_FUNDS_RECEIVED;
			if (cmd.equals(TxnNextStateEnum.FUNDS_OVERPAID)) expectedUsd = expectedUsd.add(OVERPAY);
			usdProvided = expectedUsd.toString();
		}
		else if (cmd.equals(TxnNextStateEnum.FUNDS_SENT)) 
		{ 
			status = MoneycorpPaymentStatusEnum.MONEYCORP_FUNDS_SENT;
		}
		else if (cmd.equals(TxnNextStateEnum.EPO_RECEIVED)) 
		{ 
			status = MoneycorpPaymentStatusEnum.MONEYCORP_EPO_RECEIVED;
		}
		else  
		{ 
			txnFailed = true;
			if (cmd.equals(TxnNextStateEnum.NOTRECEIVED)) 
			{ 
				status = MoneycorpPaymentStatusEnum.MONEYCORP_NOTRECEIVED;
			}
			else if (cmd.equals(TxnNextStateEnum.INSUFFICIENT_FUNDS)) 
			{ 
				status = MoneycorpPaymentStatusEnum.MONEYCORP_INSUFFICIENTFUNDS;
				expectedUsd = expectedUsd.subtract(ONE_PENNY);
				usdProvided = expectedUsd.toString();
			}
			else if (cmd.equals(TxnNextStateEnum.UNKNOWN_PAYMENT)) 
			{ 
				p3sref = "";
				status = MoneycorpPaymentStatusEnum.MONEYCORP_UNKNOWNPAYMENT;
				usdProvided = UNEXPECTED_PAYMENT.toString();
			}
			
		}
		
		
		
		// Pojo is populated. Now write the file
		TransactionStatus pojo = new TransactionStatus(); 
		pojo.setPatentPlaceRef(p3sref);
		pojo.setMoneycorpRef(mcref);
		pojo.setStatus(status);
		pojo.setCcy1AmountProvided(usdProvided);
		pojo.setMoneycorpTimestamp(createDate);
		pojo.setFailMessage(failMsg);
		pojo.setIncomingRef(incomingRef);
		pojo.setTransactionHasFailed(txnFailed);
		
		TransactionStatusSftpManager mgr = new TransactionStatusSftpManager();
		mgr.writeTransactionStatusFile(pojo);
		
	}
	
	
}
