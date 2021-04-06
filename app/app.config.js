//  
//   Pat's workflow process involves a specific file : /webapp/app/app.config.js
//  
//   Pat's process needs that file to exist, but once the FE is delivered for merging with BE, the file is unused.
//  
//   That file causes the BE developer’s Eclipse to report 14 errors. Whilst not affecting P3S operation, these errors could cause real errors to be overlooked.
//  
//   So - once the FE code is delivered to the BE team, it’s desirable that that file is removed, or its errant content removed. Preferably automatically.
//  
//   Attempts to automatically delete the file using maven-antrun-plugin have failed. But file copy (inc. overwrite) using maven-resources-plugin, work.
//  
//   Hence THIS file, stored in /resources, is used to overwrite the errant file in webapp/app
//  
//   The copy is implemented by a plugin in pom.xml. Any operation (inc. ‘refresh’) causes the copy to execute. 
//   So it’s not even necessary to perform clean, build or maven/update to remove the errant file.
//  
//   Andy Chapman
//   11th September 2020
//  
