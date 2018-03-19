// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.Invoice;
import com.bcs.p3s.model.InvoiceDataOnDemand;
import com.bcs.p3s.model.P3SUser;
import com.bcs.p3s.model.P3SUserDataOnDemand;
import com.bcs.p3s.model.Payment;
import com.bcs.p3s.model.PaymentDataOnDemand;
import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Iterator;
import java.util.List;
import java.util.Random;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

privileged aspect PaymentDataOnDemand_Roo_DataOnDemand {
    
    declare @type: PaymentDataOnDemand: @Component;
    
    private Random PaymentDataOnDemand.rnd = new SecureRandom();
    
    private List<Payment> PaymentDataOnDemand.data;
    
    @Autowired
    P3SUserDataOnDemand PaymentDataOnDemand.p3SUserDataOnDemand;
    
    @Autowired
    InvoiceDataOnDemand PaymentDataOnDemand.invoiceDataOnDemand;
    
    public Payment PaymentDataOnDemand.getNewTransientPayment(int index) {
        Payment obj = new Payment();
        setBillingAddressCity(obj, index);
        setBillingAddressState(obj, index);
        setBillingAddressStreet(obj, index);
        setBillingAddressZip(obj, index);
        setFailureReason(obj, index);
        setFxTarget(obj, index);
        setHasFailed(obj, index);
        setInitiatedByUserId(obj, index);
        setIsBillingAddressSame(obj, index);
        setLastUpdatedDate(obj, index);
        setLatestInvoice(obj, index);
        setLatestTransStatus(obj, index);
        setMC_TransRef(obj, index);
        setMC_failCode(obj, index);
        setP3S_TransRef(obj, index);
        setSentToMc(obj, index);
        setTransAmount_USD(obj, index);
        setTransStartDate(obj, index);
        setTransTargetEndDate(obj, index);
        setTransType(obj, index);
        return obj;
    }
    
    public void PaymentDataOnDemand.setBillingAddressCity(Payment obj, int index) {
        String billingAddressCity = "billingAddressCity_" + index;
        obj.setBillingAddressCity(billingAddressCity);
    }
    
    public void PaymentDataOnDemand.setBillingAddressState(Payment obj, int index) {
        String billingAddressState = "billingAddressState_" + index;
        obj.setBillingAddressState(billingAddressState);
    }
    
    public void PaymentDataOnDemand.setBillingAddressStreet(Payment obj, int index) {
        String billingAddressStreet = "billingAddressStreet_" + index;
        obj.setBillingAddressStreet(billingAddressStreet);
    }
    
    public void PaymentDataOnDemand.setBillingAddressZip(Payment obj, int index) {
        String billingAddressZip = "billingAddressZip_" + index;
        obj.setBillingAddressZip(billingAddressZip);
    }
    
    public void PaymentDataOnDemand.setFailureReason(Payment obj, int index) {
        String failureReason = "failureReason_" + index;
        obj.setFailureReason(failureReason);
    }
    
    public void PaymentDataOnDemand.setFxTarget(Payment obj, int index) {
        Date fxTarget = new GregorianCalendar(Calendar.getInstance().get(Calendar.YEAR), Calendar.getInstance().get(Calendar.MONTH), Calendar.getInstance().get(Calendar.DAY_OF_MONTH), Calendar.getInstance().get(Calendar.HOUR_OF_DAY), Calendar.getInstance().get(Calendar.MINUTE), Calendar.getInstance().get(Calendar.SECOND) + new Double(Math.random() * 1000).intValue()).getTime();
        obj.setFxTarget(fxTarget);
    }
    
    public void PaymentDataOnDemand.setHasFailed(Payment obj, int index) {
        Boolean hasFailed = Boolean.TRUE;
        obj.setHasFailed(hasFailed);
    }
    
    public void PaymentDataOnDemand.setInitiatedByUserId(Payment obj, int index) {
        P3SUser initiatedByUserId = p3SUserDataOnDemand.getSpecificP3SUser(index);
        obj.setInitiatedByUserId(initiatedByUserId);
    }
    
    public void PaymentDataOnDemand.setIsBillingAddressSame(Payment obj, int index) {
        Boolean isBillingAddressSame = Boolean.TRUE;
        obj.setIsBillingAddressSame(isBillingAddressSame);
    }
    
    public void PaymentDataOnDemand.setLastUpdatedDate(Payment obj, int index) {
        Date lastUpdatedDate = new GregorianCalendar(Calendar.getInstance().get(Calendar.YEAR), Calendar.getInstance().get(Calendar.MONTH), Calendar.getInstance().get(Calendar.DAY_OF_MONTH), Calendar.getInstance().get(Calendar.HOUR_OF_DAY), Calendar.getInstance().get(Calendar.MINUTE), Calendar.getInstance().get(Calendar.SECOND) + new Double(Math.random() * 1000).intValue()).getTime();
        obj.setLastUpdatedDate(lastUpdatedDate);
    }
    
    public void PaymentDataOnDemand.setLatestInvoice(Payment obj, int index) {
        Invoice latestInvoice = invoiceDataOnDemand.getRandomInvoice();
        obj.setLatestInvoice(latestInvoice);
    }
    
    public void PaymentDataOnDemand.setLatestTransStatus(Payment obj, int index) {
        String latestTransStatus = "latestTransStatus_" + index;
        obj.setLatestTransStatus(latestTransStatus);
    }
    
    public void PaymentDataOnDemand.setMC_TransRef(Payment obj, int index) {
        String MC_TransRef = "MC_TransRef_" + index;
        obj.setMC_TransRef(MC_TransRef);
    }
    
    public void PaymentDataOnDemand.setMC_failCode(Payment obj, int index) {
        String MC_failCode = "MC_failCode_" + index;
        obj.setMC_failCode(MC_failCode);
    }
    
    public void PaymentDataOnDemand.setP3S_TransRef(Payment obj, int index) {
        String P3S_TransRef = "P3S_TransRef_" + index;
        obj.setP3S_TransRef(P3S_TransRef);
    }
    
    public void PaymentDataOnDemand.setSentToMc(Payment obj, int index) {
        Date sentToMc = new GregorianCalendar(Calendar.getInstance().get(Calendar.YEAR), Calendar.getInstance().get(Calendar.MONTH), Calendar.getInstance().get(Calendar.DAY_OF_MONTH), Calendar.getInstance().get(Calendar.HOUR_OF_DAY), Calendar.getInstance().get(Calendar.MINUTE), Calendar.getInstance().get(Calendar.SECOND) + new Double(Math.random() * 1000).intValue()).getTime();
        obj.setSentToMc(sentToMc);
    }
    
    public void PaymentDataOnDemand.setTransAmount_USD(Payment obj, int index) {
        BigDecimal transAmount_USD = BigDecimal.valueOf(index);
        obj.setTransAmount_USD(transAmount_USD);
    }
    
    public void PaymentDataOnDemand.setTransStartDate(Payment obj, int index) {
        Date transStartDate = new GregorianCalendar(Calendar.getInstance().get(Calendar.YEAR), Calendar.getInstance().get(Calendar.MONTH), Calendar.getInstance().get(Calendar.DAY_OF_MONTH), Calendar.getInstance().get(Calendar.HOUR_OF_DAY), Calendar.getInstance().get(Calendar.MINUTE), Calendar.getInstance().get(Calendar.SECOND) + new Double(Math.random() * 1000).intValue()).getTime();
        obj.setTransStartDate(transStartDate);
    }
    
    public void PaymentDataOnDemand.setTransTargetEndDate(Payment obj, int index) {
        Date transTargetEndDate = new GregorianCalendar(Calendar.getInstance().get(Calendar.YEAR), Calendar.getInstance().get(Calendar.MONTH), Calendar.getInstance().get(Calendar.DAY_OF_MONTH), Calendar.getInstance().get(Calendar.HOUR_OF_DAY), Calendar.getInstance().get(Calendar.MINUTE), Calendar.getInstance().get(Calendar.SECOND) + new Double(Math.random() * 1000).intValue()).getTime();
        obj.setTransTargetEndDate(transTargetEndDate);
    }
    
    public void PaymentDataOnDemand.setTransType(Payment obj, int index) {
        String transType = "transType_" + index;
        obj.setTransType(transType);
    }
    
    public Payment PaymentDataOnDemand.getSpecificPayment(int index) {
        init();
        if (index < 0) {
            index = 0;
        }
        if (index > (data.size() - 1)) {
            index = data.size() - 1;
        }
        Payment obj = data.get(index);
        Long id = obj.getId();
        return Payment.findPayment(id);
    }
    
    public Payment PaymentDataOnDemand.getRandomPayment() {
        init();
        Payment obj = data.get(rnd.nextInt(data.size()));
        Long id = obj.getId();
        return Payment.findPayment(id);
    }
    
    public boolean PaymentDataOnDemand.modifyPayment(Payment obj) {
        return false;
    }
    
    public void PaymentDataOnDemand.init() {
        int from = 0;
        int to = 10;
        data = Payment.findPaymentEntries(from, to);
        if (data == null) {
            throw new IllegalStateException("Find entries implementation for 'Payment' illegally returned null");
        }
        if (!data.isEmpty()) {
            return;
        }
        
        data = new ArrayList<Payment>();
        for (int i = 0; i < 10; i++) {
            Payment obj = getNewTransientPayment(i);
            try {
                obj.persist();
            } catch (final ConstraintViolationException e) {
                final StringBuilder msg = new StringBuilder();
                for (Iterator<ConstraintViolation<?>> iter = e.getConstraintViolations().iterator(); iter.hasNext();) {
                    final ConstraintViolation<?> cv = iter.next();
                    msg.append("[").append(cv.getRootBean().getClass().getName()).append(".").append(cv.getPropertyPath()).append(": ").append(cv.getMessage()).append(" (invalid value = ").append(cv.getInvalidValue()).append(")").append("]");
                }
                throw new IllegalStateException(msg.toString(), e);
            }
            obj.flush();
            data.add(obj);
        }
    }
    
}
