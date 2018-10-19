// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.P3SFeeSole;
import com.bcs.p3s.model.P3SFeeSoleDataOnDemand;
import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Random;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import org.springframework.stereotype.Component;

privileged aspect P3SFeeSoleDataOnDemand_Roo_DataOnDemand {
    
    declare @type: P3SFeeSoleDataOnDemand: @Component;
    
    private Random P3SFeeSoleDataOnDemand.rnd = new SecureRandom();
    
    private List<P3SFeeSole> P3SFeeSoleDataOnDemand.data;
    
    public P3SFeeSole P3SFeeSoleDataOnDemand.getNewTransientP3SFeeSole(int index) {
        P3SFeeSole obj = new P3SFeeSole();
        setExpressFee_Percent(obj, index);
        setLatePayPenalty_USD(obj, index);
        setProcessingFee_USD(obj, index);
        setUrgentFee_Percent(obj, index);
        return obj;
    }
    
    public void P3SFeeSoleDataOnDemand.setExpressFee_Percent(P3SFeeSole obj, int index) {
        BigDecimal expressFee_Percent = BigDecimal.valueOf(index);
        obj.setExpressFee_Percent(expressFee_Percent);
    }
    
    public void P3SFeeSoleDataOnDemand.setLatePayPenalty_USD(P3SFeeSole obj, int index) {
        BigDecimal latePayPenalty_USD = BigDecimal.valueOf(index);
        obj.setLatePayPenalty_USD(latePayPenalty_USD);
    }
    
    public void P3SFeeSoleDataOnDemand.setProcessingFee_USD(P3SFeeSole obj, int index) {
        BigDecimal processingFee_USD = BigDecimal.valueOf(index);
        obj.setProcessingFee_USD(processingFee_USD);
    }
    
    public void P3SFeeSoleDataOnDemand.setUrgentFee_Percent(P3SFeeSole obj, int index) {
        BigDecimal urgentFee_Percent = BigDecimal.valueOf(index);
        obj.setUrgentFee_Percent(urgentFee_Percent);
    }
    
    public P3SFeeSole P3SFeeSoleDataOnDemand.getSpecificP3SFeeSole(int index) {
        init();
        if (index < 0) {
            index = 0;
        }
        if (index > (data.size() - 1)) {
            index = data.size() - 1;
        }
        P3SFeeSole obj = data.get(index);
        Long id = obj.getId();
        return P3SFeeSole.findP3SFeeSole(id);
    }
    
    public P3SFeeSole P3SFeeSoleDataOnDemand.getRandomP3SFeeSole() {
        init();
        P3SFeeSole obj = data.get(rnd.nextInt(data.size()));
        Long id = obj.getId();
        return P3SFeeSole.findP3SFeeSole(id);
    }
    
    public boolean P3SFeeSoleDataOnDemand.modifyP3SFeeSole(P3SFeeSole obj) {
        return false;
    }
    
    public void P3SFeeSoleDataOnDemand.init() {
        int from = 0;
        int to = 10;
        data = P3SFeeSole.findP3SFeeSoleEntries(from, to);
        if (data == null) {
            throw new IllegalStateException("Find entries implementation for 'P3SFeeSole' illegally returned null");
        }
        if (!data.isEmpty()) {
            return;
        }
        
        data = new ArrayList<P3SFeeSole>();
        for (int i = 0; i < 10; i++) {
            P3SFeeSole obj = getNewTransientP3SFeeSole(i);
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