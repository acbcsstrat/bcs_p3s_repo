// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.CertificateDataOnDemand;
import com.bcs.p3s.model.Fee;
import com.bcs.p3s.model.FeeDataOnDemand;
import com.bcs.p3s.model.Patent;
import com.bcs.p3s.model.PatentDataOnDemand;
import com.bcs.p3s.model.Payment;
import com.bcs.p3s.model.PaymentDataOnDemand;
import com.bcs.p3s.model.Renewal;
import com.bcs.p3s.model.RenewalDataOnDemand;
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

privileged aspect RenewalDataOnDemand_Roo_DataOnDemand {
    
    declare @type: RenewalDataOnDemand: @Component;
    
    private Random RenewalDataOnDemand.rnd = new SecureRandom();
    
    private List<Renewal> RenewalDataOnDemand.data;
    
    @Autowired
    PaymentDataOnDemand RenewalDataOnDemand.paymentDataOnDemand;
    
    @Autowired
    CertificateDataOnDemand RenewalDataOnDemand.certificateDataOnDemand;
    
    @Autowired
    FeeDataOnDemand RenewalDataOnDemand.feeDataOnDemand;
    
    @Autowired
    PatentDataOnDemand RenewalDataOnDemand.patentDataOnDemand;
    
    public Renewal RenewalDataOnDemand.getNewTransientRenewal(int index) {
        Renewal obj = new Renewal();
        setActivePaymentId(obj, index);
        setFee(obj, index);
        setPatent(obj, index);
        setRenewalAttemptsMade(obj, index);
        setRenewalDueDate(obj, index);
        setRenewalPeriod(obj, index);
        setRenewalStatus(obj, index);
        setRenewalYear(obj, index);
        return obj;
    }
    
    public void RenewalDataOnDemand.setActivePaymentId(Renewal obj, int index) {
        Payment activePaymentId = paymentDataOnDemand.getRandomPayment();
        obj.setActivePaymentId(activePaymentId);
    }
    
    public void RenewalDataOnDemand.setFee(Renewal obj, int index) {
        Fee fee = feeDataOnDemand.getRandomFee();
        obj.setFee(fee);
    }
    
    public void RenewalDataOnDemand.setPatent(Renewal obj, int index) {
        Patent patent = patentDataOnDemand.getRandomPatent();
        obj.setPatent(patent);
    }
    
    public void RenewalDataOnDemand.setRenewalAttemptsMade(Renewal obj, int index) {
        Integer renewalAttemptsMade = new Integer(index);
        obj.setRenewalAttemptsMade(renewalAttemptsMade);
    }
    
    public void RenewalDataOnDemand.setRenewalDueDate(Renewal obj, int index) {
        Date renewalDueDate = new GregorianCalendar(Calendar.getInstance().get(Calendar.YEAR), Calendar.getInstance().get(Calendar.MONTH), Calendar.getInstance().get(Calendar.DAY_OF_MONTH), Calendar.getInstance().get(Calendar.HOUR_OF_DAY), Calendar.getInstance().get(Calendar.MINUTE), Calendar.getInstance().get(Calendar.SECOND) + new Double(Math.random() * 1000).intValue()).getTime();
        obj.setRenewalDueDate(renewalDueDate);
    }
    
    public void RenewalDataOnDemand.setRenewalPeriod(Renewal obj, int index) {
        String renewalPeriod = "renewalPeriod_" + index;
        obj.setRenewalPeriod(renewalPeriod);
    }
    
    public void RenewalDataOnDemand.setRenewalStatus(Renewal obj, int index) {
        String renewalStatus = "renewalStatus_" + index;
        obj.setRenewalStatus(renewalStatus);
    }
    
    public void RenewalDataOnDemand.setRenewalYear(Renewal obj, int index) {
        Integer renewalYear = new Integer(index);
        obj.setRenewalYear(renewalYear);
    }
    
    public Renewal RenewalDataOnDemand.getSpecificRenewal(int index) {
        init();
        if (index < 0) {
            index = 0;
        }
        if (index > (data.size() - 1)) {
            index = data.size() - 1;
        }
        Renewal obj = data.get(index);
        Long id = obj.getId();
        return Renewal.findRenewal(id);
    }
    
    public Renewal RenewalDataOnDemand.getRandomRenewal() {
        init();
        Renewal obj = data.get(rnd.nextInt(data.size()));
        Long id = obj.getId();
        return Renewal.findRenewal(id);
    }
    
    public boolean RenewalDataOnDemand.modifyRenewal(Renewal obj) {
        return false;
    }
    
    public void RenewalDataOnDemand.init() {
        int from = 0;
        int to = 10;
        data = Renewal.findRenewalEntries(from, to);
        if (data == null) {
            throw new IllegalStateException("Find entries implementation for 'Renewal' illegally returned null");
        }
        if (!data.isEmpty()) {
            return;
        }
        
        data = new ArrayList<Renewal>();
        for (int i = 0; i < 10; i++) {
            Renewal obj = getNewTransientRenewal(i);
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