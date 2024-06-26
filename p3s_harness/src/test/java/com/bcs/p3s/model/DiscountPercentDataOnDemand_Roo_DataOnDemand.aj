// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.Business;
import com.bcs.p3s.model.BusinessDataOnDemand;
import com.bcs.p3s.model.DiscountPercent;
import com.bcs.p3s.model.DiscountPercentDataOnDemand;
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

privileged aspect DiscountPercentDataOnDemand_Roo_DataOnDemand {
    
    declare @type: DiscountPercentDataOnDemand: @Component;
    
    private Random DiscountPercentDataOnDemand.rnd = new SecureRandom();
    
    private List<DiscountPercent> DiscountPercentDataOnDemand.data;
    
    @Autowired
    BusinessDataOnDemand DiscountPercentDataOnDemand.businessDataOnDemand;
    
    public DiscountPercent DiscountPercentDataOnDemand.getNewTransientDiscountPercent(int index) {
        DiscountPercent obj = new DiscountPercent();
        setBusiness(obj, index);
        setExpressFee(obj, index);
        setLatePayPenalty(obj, index);
        setProcessingFee(obj, index);
        setUrgentFee(obj, index);
        return obj;
    }
    
    public void DiscountPercentDataOnDemand.setBusiness(DiscountPercent obj, int index) {
        Business business = businessDataOnDemand.getSpecificBusiness(index);
        obj.setBusiness(business);
    }
    
    public void DiscountPercentDataOnDemand.setExpressFee(DiscountPercent obj, int index) {
        BigDecimal expressFee = BigDecimal.valueOf(index);
        obj.setExpressFee(expressFee);
    }
    
    public void DiscountPercentDataOnDemand.setLatePayPenalty(DiscountPercent obj, int index) {
        BigDecimal latePayPenalty = BigDecimal.valueOf(index);
        obj.setLatePayPenalty(latePayPenalty);
    }
    
    public void DiscountPercentDataOnDemand.setProcessingFee(DiscountPercent obj, int index) {
        BigDecimal processingFee = BigDecimal.valueOf(index);
        obj.setProcessingFee(processingFee);
    }
    
    public void DiscountPercentDataOnDemand.setUrgentFee(DiscountPercent obj, int index) {
        BigDecimal urgentFee = BigDecimal.valueOf(index);
        obj.setUrgentFee(urgentFee);
    }
    
    public DiscountPercent DiscountPercentDataOnDemand.getSpecificDiscountPercent(int index) {
        init();
        if (index < 0) {
            index = 0;
        }
        if (index > (data.size() - 1)) {
            index = data.size() - 1;
        }
        DiscountPercent obj = data.get(index);
        Long id = obj.getId();
        return DiscountPercent.findDiscountPercent(id);
    }
    
    public DiscountPercent DiscountPercentDataOnDemand.getRandomDiscountPercent() {
        init();
        DiscountPercent obj = data.get(rnd.nextInt(data.size()));
        Long id = obj.getId();
        return DiscountPercent.findDiscountPercent(id);
    }
    
    public boolean DiscountPercentDataOnDemand.modifyDiscountPercent(DiscountPercent obj) {
        return false;
    }
    
    public void DiscountPercentDataOnDemand.init() {
        int from = 0;
        int to = 10;
        data = DiscountPercent.findDiscountPercentEntries(from, to);
        if (data == null) {
            throw new IllegalStateException("Find entries implementation for 'DiscountPercent' illegally returned null");
        }
        if (!data.isEmpty()) {
            return;
        }
        
        data = new ArrayList<DiscountPercent>();
        for (int i = 0; i < 10; i++) {
            DiscountPercent obj = getNewTransientDiscountPercent(i);
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
