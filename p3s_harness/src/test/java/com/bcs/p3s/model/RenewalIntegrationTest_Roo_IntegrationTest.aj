// WARNING: DO NOT EDIT THIS FILE. THIS FILE IS MANAGED BY SPRING ROO.
// You may push code into the target .java compilation unit if you wish to edit any member(s).

package com.bcs.p3s.model;

import com.bcs.p3s.model.Renewal;
import com.bcs.p3s.model.RenewalDataOnDemand;
import com.bcs.p3s.model.RenewalIntegrationTest;
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

privileged aspect RenewalIntegrationTest_Roo_IntegrationTest {
    
    declare @type: RenewalIntegrationTest: @RunWith(SpringJUnit4ClassRunner.class);
    
    declare @type: RenewalIntegrationTest: @ContextConfiguration(locations = "classpath*:/META-INF/spring/applicationContext*.xml");
    
    declare @type: RenewalIntegrationTest: @Transactional;
    
    @Autowired
    RenewalDataOnDemand RenewalIntegrationTest.dod;
    
    @Test
    public void RenewalIntegrationTest.testCountRenewals() {
        Assert.assertNotNull("Data on demand for 'Renewal' failed to initialize correctly", dod.getRandomRenewal());
        long count = Renewal.countRenewals();
        Assert.assertTrue("Counter for 'Renewal' incorrectly reported there were no entries", count > 0);
    }
    
    @Test
    public void RenewalIntegrationTest.testFindRenewal() {
        Renewal obj = dod.getRandomRenewal();
        Assert.assertNotNull("Data on demand for 'Renewal' failed to initialize correctly", obj);
        Long id = obj.getId();
        Assert.assertNotNull("Data on demand for 'Renewal' failed to provide an identifier", id);
        obj = Renewal.findRenewal(id);
        Assert.assertNotNull("Find method for 'Renewal' illegally returned null for id '" + id + "'", obj);
        Assert.assertEquals("Find method for 'Renewal' returned the incorrect identifier", id, obj.getId());
    }
    
    @Test
    public void RenewalIntegrationTest.testFindAllRenewals() {
        Assert.assertNotNull("Data on demand for 'Renewal' failed to initialize correctly", dod.getRandomRenewal());
        long count = Renewal.countRenewals();
        Assert.assertTrue("Too expensive to perform a find all test for 'Renewal', as there are " + count + " entries; set the findAllMaximum to exceed this value or set findAll=false on the integration test annotation to disable the test", count < 250);
        List<Renewal> result = Renewal.findAllRenewals();
        Assert.assertNotNull("Find all method for 'Renewal' illegally returned null", result);
        Assert.assertTrue("Find all method for 'Renewal' failed to return any data", result.size() > 0);
    }
    
    @Test
    public void RenewalIntegrationTest.testFindRenewalEntries() {
        Assert.assertNotNull("Data on demand for 'Renewal' failed to initialize correctly", dod.getRandomRenewal());
        long count = Renewal.countRenewals();
        if (count > 20) count = 20;
        int firstResult = 0;
        int maxResults = (int) count;
        List<Renewal> result = Renewal.findRenewalEntries(firstResult, maxResults);
        Assert.assertNotNull("Find entries method for 'Renewal' illegally returned null", result);
        Assert.assertEquals("Find entries method for 'Renewal' returned an incorrect number of entries", count, result.size());
    }
    
    @Test
    public void RenewalIntegrationTest.testFlush() {
        Renewal obj = dod.getRandomRenewal();
        Assert.assertNotNull("Data on demand for 'Renewal' failed to initialize correctly", obj);
        Long id = obj.getId();
        Assert.assertNotNull("Data on demand for 'Renewal' failed to provide an identifier", id);
        obj = Renewal.findRenewal(id);
        Assert.assertNotNull("Find method for 'Renewal' illegally returned null for id '" + id + "'", obj);
        boolean modified =  dod.modifyRenewal(obj);
        Integer currentVersion = obj.getVersion();
        obj.flush();
        Assert.assertTrue("Version for 'Renewal' failed to increment on flush directive", (currentVersion != null && obj.getVersion() > currentVersion) || !modified);
    }
    
    @Test
    public void RenewalIntegrationTest.testMergeUpdate() {
        Renewal obj = dod.getRandomRenewal();
        Assert.assertNotNull("Data on demand for 'Renewal' failed to initialize correctly", obj);
        Long id = obj.getId();
        Assert.assertNotNull("Data on demand for 'Renewal' failed to provide an identifier", id);
        obj = Renewal.findRenewal(id);
        boolean modified =  dod.modifyRenewal(obj);
        Integer currentVersion = obj.getVersion();
        Renewal merged = obj.merge();
        obj.flush();
        Assert.assertEquals("Identifier of merged object not the same as identifier of original object", merged.getId(), id);
        Assert.assertTrue("Version for 'Renewal' failed to increment on merge and flush directive", (currentVersion != null && obj.getVersion() > currentVersion) || !modified);
    }
    
    @Test
    public void RenewalIntegrationTest.testPersist() {
        Assert.assertNotNull("Data on demand for 'Renewal' failed to initialize correctly", dod.getRandomRenewal());
        Renewal obj = dod.getNewTransientRenewal(Integer.MAX_VALUE);
        Assert.assertNotNull("Data on demand for 'Renewal' failed to provide a new transient entity", obj);
        Assert.assertNull("Expected 'Renewal' identifier to be null", obj.getId());
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
        Assert.assertNotNull("Expected 'Renewal' identifier to no longer be null", obj.getId());
    }
    
    @Test
    public void RenewalIntegrationTest.testRemove() {
        Renewal obj = dod.getRandomRenewal();
        Assert.assertNotNull("Data on demand for 'Renewal' failed to initialize correctly", obj);
        Long id = obj.getId();
        Assert.assertNotNull("Data on demand for 'Renewal' failed to provide an identifier", id);
        obj = Renewal.findRenewal(id);
        obj.remove();
        obj.flush();
        Assert.assertNull("Failed to remove 'Renewal' with identifier '" + id + "'", Renewal.findRenewal(id));
    }
    
}