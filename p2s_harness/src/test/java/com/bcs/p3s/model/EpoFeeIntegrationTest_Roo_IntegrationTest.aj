// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.EpoFeeDataOnDemand;
import com.bcs.p3s.model.EpoFeeIntegrationTest;
import com.bcs.p3s.model.EpoRenewalFee;
import java.util.Iterator;
import java.util.List;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

privileged aspect EpoFeeIntegrationTest_Roo_IntegrationTest {
    
    declare @type: EpoFeeIntegrationTest: @RunWith(SpringJUnit4ClassRunner.class);
    
    declare @type: EpoFeeIntegrationTest: @ContextConfiguration(locations = "classpath*:/META-INF/spring/applicationContext*.xml");
    
    declare @type: EpoFeeIntegrationTest: @Transactional;
    
    @Autowired
    EpoFeeDataOnDemand EpoFeeIntegrationTest.dod;
    
    @Test
    public void EpoFeeIntegrationTest.testCountEpoRenewalFees() {
        Assert.assertNotNull("Data on demand for 'EpoRenewalFee' failed to initialize correctly", dod.getRandomEpoRenewalFee());
        long count = EpoRenewalFee.countEpoRenewalFees();
        Assert.assertTrue("Counter for 'EpoRenewalFee' incorrectly reported there were no entries", count > 0);
    }
    
    @Test
    public void EpoFeeIntegrationTest.testFindEpoRenewalFee() {
        EpoRenewalFee obj = dod.getRandomEpoRenewalFee();
        Assert.assertNotNull("Data on demand for 'EpoRenewalFee' failed to initialize correctly", obj);
        Long id = obj.getId();
        Assert.assertNotNull("Data on demand for 'EpoRenewalFee' failed to provide an identifier", id);
        obj = EpoRenewalFee.findEpoRenewalFee(id);
        Assert.assertNotNull("Find method for 'EpoRenewalFee' illegally returned null for id '" + id + "'", obj);
        Assert.assertEquals("Find method for 'EpoRenewalFee' returned the incorrect identifier", id, obj.getId());
    }
    
    @Test
    public void EpoFeeIntegrationTest.testFindAllEpoRenewalFees() {
        Assert.assertNotNull("Data on demand for 'EpoRenewalFee' failed to initialize correctly", dod.getRandomEpoRenewalFee());
        long count = EpoRenewalFee.countEpoRenewalFees();
        Assert.assertTrue("Too expensive to perform a find all test for 'EpoRenewalFee', as there are " + count + " entries; set the findAllMaximum to exceed this value or set findAll=false on the integration test annotation to disable the test", count < 250);
        List<EpoRenewalFee> result = EpoRenewalFee.findAllEpoRenewalFees();
        Assert.assertNotNull("Find all method for 'EpoRenewalFee' illegally returned null", result);
        Assert.assertTrue("Find all method for 'EpoRenewalFee' failed to return any data", result.size() > 0);
    }
    
    @Test
    public void EpoFeeIntegrationTest.testFindEpoRenewalFeeEntries() {
        Assert.assertNotNull("Data on demand for 'EpoRenewalFee' failed to initialize correctly", dod.getRandomEpoRenewalFee());
        long count = EpoRenewalFee.countEpoRenewalFees();
        if (count > 20) count = 20;
        int firstResult = 0;
        int maxResults = (int) count;
        List<EpoRenewalFee> result = EpoRenewalFee.findEpoRenewalFeeEntries(firstResult, maxResults);
        Assert.assertNotNull("Find entries method for 'EpoRenewalFee' illegally returned null", result);
        Assert.assertEquals("Find entries method for 'EpoRenewalFee' returned an incorrect number of entries", count, result.size());
    }
    
    @Test
    public void EpoFeeIntegrationTest.testFlush() {
        EpoRenewalFee obj = dod.getRandomEpoRenewalFee();
        Assert.assertNotNull("Data on demand for 'EpoRenewalFee' failed to initialize correctly", obj);
        Long id = obj.getId();
        Assert.assertNotNull("Data on demand for 'EpoRenewalFee' failed to provide an identifier", id);
        obj = EpoRenewalFee.findEpoRenewalFee(id);
        Assert.assertNotNull("Find method for 'EpoRenewalFee' illegally returned null for id '" + id + "'", obj);
        boolean modified =  dod.modifyEpoRenewalFee(obj);
        Integer currentVersion = obj.getVersion();
        obj.flush();
        Assert.assertTrue("Version for 'EpoRenewalFee' failed to increment on flush directive", (currentVersion != null && obj.getVersion() > currentVersion) || !modified);
    }
    
    @Test
    public void EpoFeeIntegrationTest.testMergeUpdate() {
        EpoRenewalFee obj = dod.getRandomEpoRenewalFee();
        Assert.assertNotNull("Data on demand for 'EpoRenewalFee' failed to initialize correctly", obj);
        Long id = obj.getId();
        Assert.assertNotNull("Data on demand for 'EpoRenewalFee' failed to provide an identifier", id);
        obj = EpoRenewalFee.findEpoRenewalFee(id);
        boolean modified =  dod.modifyEpoRenewalFee(obj);
        Integer currentVersion = obj.getVersion();
        EpoRenewalFee merged = obj.merge();
        obj.flush();
        Assert.assertEquals("Identifier of merged object not the same as identifier of original object", merged.getId(), id);
        Assert.assertTrue("Version for 'EpoRenewalFee' failed to increment on merge and flush directive", (currentVersion != null && obj.getVersion() > currentVersion) || !modified);
    }
    
    @Test
    public void EpoFeeIntegrationTest.testPersist() {
        Assert.assertNotNull("Data on demand for 'EpoRenewalFee' failed to initialize correctly", dod.getRandomEpoRenewalFee());
        EpoRenewalFee obj = dod.getNewTransientEpoRenewalFee(Integer.MAX_VALUE);
        Assert.assertNotNull("Data on demand for 'EpoRenewalFee' failed to provide a new transient entity", obj);
        Assert.assertNull("Expected 'EpoRenewalFee' identifier to be null", obj.getId());
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
        Assert.assertNotNull("Expected 'EpoRenewalFee' identifier to no longer be null", obj.getId());
    }
    
    @Test
    public void EpoFeeIntegrationTest.testRemove() {
        EpoRenewalFee obj = dod.getRandomEpoRenewalFee();
        Assert.assertNotNull("Data on demand for 'EpoRenewalFee' failed to initialize correctly", obj);
        Long id = obj.getId();
        Assert.assertNotNull("Data on demand for 'EpoRenewalFee' failed to provide an identifier", id);
        obj = EpoRenewalFee.findEpoRenewalFee(id);
        obj.remove();
        obj.flush();
        Assert.assertNull("Failed to remove 'EpoRenewalFee' with identifier '" + id + "'", EpoRenewalFee.findEpoRenewalFee(id));
    }
    
}
