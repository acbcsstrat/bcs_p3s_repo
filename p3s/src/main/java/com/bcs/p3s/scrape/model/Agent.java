package com.bcs.p3s.scrape.model;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToOne;

import org.springframework.roo.addon.javabean.RooJavaBean;
import org.springframework.roo.addon.jpa.activerecord.RooJpaActiveRecord;
import org.springframework.roo.addon.tostring.RooToString;
import org.springframework.transaction.annotation.Transactional;


public class Agent {
	
    private String name;
    
    private String address1;
	private String address2;
	private String address3;
	private String address4;
	private String country;
	
    private String chngGazetteNum;
      
    
	public Agent() {
       }

       
       
       public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		
		public String getChngGazetteNum() {
			return chngGazetteNum;
		}

		public void setChngGazetteNum(String chngGazetteNum) {
			this.chngGazetteNum = chngGazetteNum;
		}

       public String getAddress1() {
			return address1;
		}

		public void setAddress1(String address1) {
			this.address1 = address1;
		}

		public String getAddress2() {
			return address2;
		}

		public void setAddress2(String address2) {
			this.address2 = address2;
		}

		public String getAddress3() {
			return address3;
		}

		public void setAddress3(String address3) {
			this.address3 = address3;
		}

		public String getAddress4() {
			return address4;
		}

		public void setAddress4(String address4) {
			this.address4 = address4;
		}

		public String getCountry() {
			return country;
		}

		public void setCountry(String country) {
			this.country = country;
		}



	public String toString() {
              StringBuffer sb = new StringBuffer();
              sb.append("Account Details - ");
              sb.append("Name:" + getName());
              sb.append(", ");
              sb.append("Address:" + getAddress1() + "," +  getAddress2() + "," +  getAddress3() + "," +  getAddress4() + "," +  getCountry() );
              sb.append(".");
              
              return sb.toString();
       }
       
       
}
