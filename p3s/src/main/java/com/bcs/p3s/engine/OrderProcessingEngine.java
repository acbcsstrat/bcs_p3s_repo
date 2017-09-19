package com.bcs.p3s.engine;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.log;

import java.math.BigDecimal;
import java.util.List;

import javax.persistence.TypedQuery;

import com.bcs.p3s.display.FeeUI;
import com.bcs.p3s.display.FxRateUI;
import com.bcs.p3s.model.Fee;
import com.bcs.p3s.model.GlobalVariableSole;
import com.bcs.p3s.model.Payment;
import com.bcs.p3s.model.Renewal;
import com.bcs.p3s.sftpmodel.Order;
import com.bcs.p3s.util.lang.Universal;

/**
 * All processing methods for Orders file should come inside this
 *
 */
public class OrderProcessingEngine extends Universal{

	
	public Order populateOrdersFileData(Payment payment){
		
		Order order = new Order();
		BigDecimal toEpo = new BigDecimal(0.0);
		
		try{
		
			order.setSrcCurrency("USD");
			order.setDestCurrency("EUR");
			
			FxRateUI todaysRate = new FxRateUI(); 
			GlobalVariableSole current = GlobalVariableSole.findOnlyGlobalVariableSole();
			order.setSrc_dest_fxRate(current.getCurrent_P3S_rate());
			
			order.setSubTotalUSD(payment.getTransAmount_USD());
			
			toEpo = amountToEPO(payment);
			order.setDestCurrencyAmount(toEpo);
			
			return order;
		}
		catch(Exception e){
			
		}
		return order;
	}
	
	protected BigDecimal amountToEPO(Payment payment){
		
		BigDecimal toEPO = new BigDecimal(0.0);
		TypedQuery<Renewal> q = Renewal.findRenewalsByActivePaymentId(payment); 
		List<Renewal> renewals = q.getResultList();
		
		for(Renewal renewal : renewals){
			TypedQuery<Fee> qFees = Fee.findFeesByRenewal(renewal) ;
			if(!(qFees.getResultList().size() == 1)){
				log().fatal("OneToOneRelationship between Fee and Renewal got broken for renewsl id "+ renewal.getId());
				return toEPO;
			}
			
			Fee fee= qFees.getSingleResult();
			FeeUI feeUI = new FeeUI(fee);
			toEPO = toEPO.add(feeUI.getRenewalFee_USD().add(feeUI.getExtensionFee_USD()));
		}
		return toEPO;
	}
	
}
