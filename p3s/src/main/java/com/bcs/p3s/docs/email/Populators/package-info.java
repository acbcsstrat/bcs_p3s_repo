/**
 * Each populator is responsible for a TYPE of email (e.g register), though conceivably some types which have significant 
 * variation in email structure and/or content (like reminder emails) may have more than 1 populator - each focusing 
 * on a GROUPing of emails with similar characteristics.
 *
 * i.e. Whilst there MAY be a 1:1 relationship between a populator & a template, this is flexible
 *
 * Populators populate a P3sEmailData object, then use this data to create a P3sEmail
 * 
 * Populators know which EmailTemplate values they are responsible for, and how to create each
 * 
 * Upon creation, the populators:
 * - Validate that they have been given the data they need
 * - Populate the P3sEmailData
 * So by the time the client is able to call generateEmail(), it's all ready
 * 
 */
package com.bcs.p3s.docs.email.Populators;