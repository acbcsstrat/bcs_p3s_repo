// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.Fee;
import com.bcs.p3s.model.FeeDataOnDemand;
import com.bcs.p3s.model.RenewalDataOnDemand;
import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Random;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

privileged aspect FeeDataOnDemand_Roo_DataOnDemand {
    
    declare @type: FeeDataOnDemand: @Component;
    
    private Random FeeDataOnDemand.rnd = new SecureRandom();
    
    private List<Fee> FeeDataOnDemand.data;
    
    @Autowired
    RenewalDataOnDemand FeeDataOnDemand.renewalDataOnDemand;
    
    public Fee FeeDataOnDemand.getNewTransientFee(int index) {
        Fee obj = new Fee();
        setExpressFee_USD(obj, index);
        setExtensionFee_EUR(obj, index);
        setFxRate(obj, index);
        setLatePayPenalty_USD(obj, index);
        setProcessingFee_USD(obj, index);
        setRenewalFee_EUR(obj, index);
        setSubTotal_USD(obj, index);
        setUrgentFee_USD(obj, index);
        return obj;
    }
    
    public void FeeDataOnDemand.setExpressFee_USD(Fee obj, int index) {
        BigDecimal expressFee_USD = BigDecimal.valueOf(index);
        obj.setExpressFee_USD(expressFee_USD);
    }
    
    public void FeeDataOnDemand.setExtensionFee_EUR(Fee obj, int index) {
        BigDecimal extensionFee_EUR = BigDecimal.valueOf(index);
        obj.setExtensionFee_EUR(extensionFee_EUR);
    }
    
    public void FeeDataOnDemand.setFxRate(Fee obj, int index) {
        BigDecimal fxRate = BigDecimal.valueOf(index);
        if (fxRate.compareTo(new BigDecimal("999999.999999")) == 1) {
            fxRate = new BigDecimal("999999.999999");
        }
        obj.setFxRate(fxRate);
    }
    
    public void FeeDataOnDemand.setLatePayPenalty_USD(Fee obj, int index) {
        BigDecimal latePayPenalty_USD = BigDecimal.valueOf(index);
        obj.setLatePayPenalty_USD(latePayPenalty_USD);
    }
    
    public void FeeDataOnDemand.setProcessingFee_USD(Fee obj, int index) {
        BigDecimal processingFee_USD = BigDecimal.valueOf(index);
        obj.setProcessingFee_USD(processingFee_USD);
    }
    
    public void FeeDataOnDemand.setRenewalFee_EUR(Fee obj, int index) {
        BigDecimal renewalFee_EUR = BigDecimal.valueOf(index);
        obj.setRenewalFee_EUR(renewalFee_EUR);
    }
    
    public void FeeDataOnDemand.setSubTotal_USD(Fee obj, int index) {
        BigDecimal subTotal_USD = BigDecimal.valueOf(index);
        obj.setSubTotal_USD(subTotal_USD);
    }
    
    public void FeeDataOnDemand.setUrgentFee_USD(Fee obj, int index) {
        BigDecimal urgentFee_USD = BigDecimal.valueOf(index);
        obj.setUrgentFee_USD(urgentFee_USD);
    }
    
    public Fee FeeDataOnDemand.getSpecificFee(int index) {
        init();
        if (index < 0) {
            index = 0;
        }
        if (index > (data.size() - 1)) {
            index = data.size() - 1;
        }
        Fee obj = data.get(index);
        Long id = obj.getId();
        return Fee.findFee(id);
    }
    
    public Fee FeeDataOnDemand.getRandomFee() {
        init();
        Fee obj = data.get(rnd.nextInt(data.size()));
        Long id = obj.getId();
        return Fee.findFee(id);
    }
    
    public boolean FeeDataOnDemand.modifyFee(Fee obj) {
        return false;
    }
    
    public void FeeDataOnDemand.init() {
        int from = 0;
        int to = 10;
        data = Fee.findFeeEntries(from, to);
        if (data == null) {
            throw new IllegalStateException("Find entries implementation for 'Fee' illegally returned null");
        }
        if (!data.isEmpty()) {
            return;
        }
        
        data = new ArrayList<Fee>();
        for (int i = 0; i < 10; i++) {
            Fee obj = getNewTransientFee(i);
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
