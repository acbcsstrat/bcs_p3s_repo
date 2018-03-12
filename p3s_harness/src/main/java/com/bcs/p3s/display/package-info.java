/**
 * Whilst entities in the 'model' package are intended mostly for mapping to database records,
 * the equivalent entities here are intended for passing to/from the (Angular) UI
 * 
 * Objects here might typically extend model classes
 * 
 * For example: PatentUI will have much in common with Patent, but may also have extra, UI influenced) data
 * Hence the generic *UI class naming.
 * 
 * 
 * Within such classes some getters may also have a *UI name.
 * These are used where the UI requires a entity different to the raw, original entity.
 * e.g. for Dates, whilst the UI has access to the 'original' 'Date', so would get a date/time in milliseconds,  
 * the *UI getter provides a String containing a formatted date - far easier for the front end. 
 * 
 * 
 * Usage: 
 *   The general intention is that the constructor for such a *UI class will automatically populated 
 *   the extended 'fields'.
 *   However, sometime this will not be possible, which is why each class-level javadoc has a section 
 *   titled
 *     ITEMS HEREIN NEEDING EXTERNAL SETTING (i.e. cannot be (reliably) set by this class): 
 *   This is a warning to the client, that after constructing such a *UI class, the fields 
 *   listed in this section will still need setting (If required). 
 *   For NPE avoidance, WHEN REQUIRED, even if not set, such fields will be set to a Non-Null value. 
 * 
 * @author andyc
 *
 */
package com.bcs.p3s.display;

