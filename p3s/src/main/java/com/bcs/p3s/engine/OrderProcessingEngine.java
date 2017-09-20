package com.bcs.p3s.engine;

import java.math.BigDecimal;
import java.util.Calendar;
import java.util.List;

import javax.persistence.TypedQuery;

import com.bcs.p3s.display.FeeUI;
import com.bcs.p3s.enump3s.RenewalColourEnum;
import com.bcs.p3s.model.Fee;
import com.bcs.p3s.model.GlobalVariableSole;
import com.bcs.p3s.model.Payment;
import com.bcs.p3s.model.Renewal;
import com.bcs.p3s.sftp.model.Order;
import com.bcs.p3s.sftp.service.MoneycorpSftpAccessImpl;
import com.bcs.p3s.util.config.P3SPropertyNames;
import com.bcs.p3s.util.date.DateUtil;
import com.bcs.p3s.util.lang.Universal;

/**
 * All processing methods for Orders file should come inside this
 *
 */
public class OrderProcessingEngine extends Universal{

	protected String PREFIX = this.getClass().getName() + " : "; 
	
	public void createOrderCsv(Payment payment){
		
		String msg = PREFIX + "createCsv("+payment+")";
		log().debug(msg +" invoked::::");
		MoneycorpSftpAccessImpl sftpAccess = new MoneycorpSftpAccessImpl();
		
		try{
			
			Order order = populateOrdersFileData(payment);
			if(order == null ){
				log().fatal("populateOrdersFileData("+payment+") returned null ");
				return;
			}
			Boolean isChecksPassed = doChecksums(order);
			if(!isChecksPassed){
				log().fatal(msg + " returning without creating Orders csv as checksum failed");
				return;
			}
			sftpAccess.createOrderFile(order);
		}
		catch(Exception e){
			e.printStackTrace();
			log().fatal(e.getMessage());
		}
		
		
	}
	
	public Order populateOrdersFileData(Payment payment){
		
		String msg = PREFIX + "populateOrdersFileData("+payment+")";
		log().debug(msg +" invoked::::");
		
		Order order = new Order();
		BigDecimal toEpoUSD = new BigDecimal(0.0);
		BigDecimal toHoldingUSD = new BigDecimal(0.0);
		BigDecimal toEpoEUR = new BigDecimal(0.0);
		
		try{
		
			order.setP3sTransRef(payment.getP3S_TransRef());
			order.setSrcCurrency("USD");
			order.setDestCurrency("EUR");
			
			GlobalVariableSole current = GlobalVariableSole.findOnlyGlobalVariableSole();
			order.setSrc_dest_fxRate(current.getCurrent_P3S_rate());
			
			order.setSubTotalUSD(payment.getTransAmount_USD());
			
			toEpoUSD = amountToEPOUSD(payment);
			order.setAmountToEPO_USD(toEpoUSD);
			
			toHoldingUSD = order.getSubTotalUSD().subtract(toEpoUSD);
			order.setHoldingAmountUSD(toHoldingUSD);
			
			toEpoEUR = toEpoUSD.divide(current.getCurrent_P3S_rate());
			order.setAmountToEPO_EUR(toEpoEUR);
			
			order.setDestinationOffice(P3SPropertyNames.Destination_EPO_Office);
			order.setReference(P3SPropertyNames.EPO_Payment_Reference);
			
			order.setPaymentMethod(getPaymentMethod(payment));
			
			order.setPaymentValueDate(new DateUtil().dateForMoneyCorpFiles(payment.getTransTargetEndDate()));
			order.setCurrentDatestamp(new DateUtil().dateForMoneyCorpFiles(Calendar.getInstance().getTime()));
			
			return order;
		}
		catch(Exception e){
			log().error(e.getMessage());
		}
		return order;
	}
	
	protected BigDecimal amountToEPOUSD(Payment payment){
		
		BigDecimal toEPO_USD = new BigDecimal(0.0);
		TypedQuery<Renewal> q = Renewal.findRenewalsByActivePaymentId(payment); 
		List<Renewal> renewals = q.getResultList();
		
		for(Renewal renewal : renewals){
			TypedQuery<Fee> qFees = Fee.findFeesByRenewal(renewal) ;
			if(!(qFees.getResultList().size() == 1)){
				log().fatal("OneToOneRelationship between Fee and Renewal got broken for renewal id "+ renewal.getId());
				return toEPO_USD;
			}
			
			Fee fee= qFees.getSingleResult();
			FeeUI feeUI = new FeeUI(fee);
			toEPO_USD = toEPO_USD.add(feeUI.getRenewalFee_USD().add(feeUI.getExtensionFee_USD()));
		}
		return toEPO_USD;
	}
	
	/**
	 * 
	 * @param payment
	 * @return paymentMethod either SWIFT/SEPA
	 * Assumption :- Payment method will be swift in case the renewal period of any of the renewal included in that payment is AMBER/BLACK  <<<<TBC>>>>>
	 * MP EDITED ON 20/09/2017 - Dan confirmed no SEPA anymore -- so commenting code for checking the condition
	 */
	protected String getPaymentMethod(Payment payment){
		
		String paymentMethod = P3SPropertyNames.Payment_Type_SEPA;
		TypedQuery<Renewal> q = Renewal.findRenewalsByActivePaymentId(payment);
		
		List<Renewal> renewals = q.getResultList();
		/*for(Renewal renewal : renewals){
			if(RenewalColourEnum.AMBER.equals(renewal.getRenewalPeriod()) || RenewalColourEnum.BLACK.equals(renewal.getRenewalPeriod())){    
				paymentMethod = P3SPropertyNames.Payment_Type_SWIFT;
				break;
			}
		}*/
		
		return paymentMethod;
	}
	
	/**
	 * Checksum method to determine whether the calculations made prior to upload csv is correct
	 * @param order
	 * @return isChecksumOk
	 */
	protected boolean doChecksums(Order order){
		
		boolean isChecksumOk = true;
		boolean firstCheck = true;
		boolean secondCheck = true;
		
		BigDecimal checksum1 = new BigDecimal(0.0);
		BigDecimal checksum2 = new BigDecimal(0.0);
		BigDecimal zero = new BigDecimal(0.0);
		checksum1 = order.getAmountToEPO_USD().add(order.getHoldingAmountUSD()).subtract(order.getSubTotalUSD());
		checksum2 = order.getAmountToEPO_USD().divide(order.getSrc_dest_fxRate()).subtract(order.getAmountToEPO_EUR());
		
		if( checksum1.compareTo(zero) == 0  || checksum2.compareTo(zero) == 0 ){
			isChecksumOk = false;
			log().fatal("Order checksum FAILED with checksum1 as "+ checksum1 + " and checksum2 as " + checksum2);
		}
		log().debug("Order checksum PASSED with checksum1 as "+ checksum1 + " and checksum2 as " + checksum2);
		return isChecksumOk;
		
	}
	
}
