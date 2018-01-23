<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output method="html"/>
    <xsl:template match="/">
        <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <title/>
                <style type="text/css" xml:space="preserve">
					body { 
						font-family: arial;
						font-size: 12px;
						text-align: center;
					}
					table {
						border-collapse: collapse;
						width: 100%;
						border: solid black 1px;
					}
					table th, td {
						border: solid black 1px;
					}
					@media screen {
						body { 
							width: 570px;
						}
					}
					@media print {
						table th {
							font-weight: bold;
						}
					}
				</style>
            </head>
            <body>
            	<table>
	            	<tr>
	            		<td align="left"><img src="pp_icon.png"/></td>
						<td align="right"><h2>PROFORMA INVOICE</h2></td>
	            	</tr>
            	</table>
                
                <table>
                	<xsl:element match="invoice/billToAddress">
						<tr><td><xsl:value-of select="billToName"></xsl:value-of></td></tr>	
						<tr><td><xsl:value-of select="billToName"></xsl:value-of></td></tr>
						<tr><td><xsl:value-of select="billToName"></xsl:value-of></td></tr>
	                </xsl:element>
                </table>
                <table>
                    <tbody>
                        <xsl:for-each select="invoice/patent">
                            <!-- TOTAL Patents <xsl:number value="position()" format="1. "/> <br/> -->
							<tr><td>Application Number <xsl:value-of select="appNum"/></td></tr>
                            <tr><td>Client Ref <xsl:value-of select="clientRef"/></td></tr>
                            <tr><td>Filing Date <xsl:value-of select="filingDate"/></td></tr>
                        </xsl:for-each>
                    </tbody>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>