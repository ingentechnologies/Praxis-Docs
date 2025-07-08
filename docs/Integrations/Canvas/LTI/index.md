---
sidebar_position: 3
slug: /integrations/canvas/ltiv1-3
title: 'LTI v1.3'
sidebar: integrationsSidebar
---

https://learning.praxislxp.com/praxis/1164-2/


- [Canvas LTI v1.3 Install Guide for](#Canvas_LTI_v13_Install_Guide_for)
- [Generative AI Foundations](#Generative_AI_Foundations)
  - [Introduction](#Introduction)
  - [LTI Tool Setup](#LTI_Tool_Setup)
  - [Installing LXP LTI as an Application](#Installing_LXP_LTI_as_an_Application)
  - [OPTION A: Import Entire Generative AI Foundations Course into a Canvas Module](#OPTION_A_Import_Entire_Generative_AI_Foundations_Course_into_a_Canvas_Module)
  - [OPTION B: Add Individual Generative AI Foundations Activities into Canvas Modules](#OPTION_B_Add_Individual_Generative_AI_Foundations_Activities_into_Canvas_Modules)
  - [Error Handling](#Error_Handling)
  - [Whitelisting](#Whitelisting)
  - [Third Party Cookies](#Third_Party_Cookies)





  Canvas LTI v1.3 Install Guide for

Generative AI Foundations 

## Introduction

This document details the installation steps to setup Praxis LXP into Canvas using the LTI 1.3 Advantage service 

It follows the documentation at 

https://community.canvaslms.com/t5/Admin-Guide/How-do-I-configure-an-LTI-key-for-an-account/ta-p/140


## LTI Tool Setup 

Step 1. Login to Canvas as an Administrator. 

Ex: https://praxis-ai.instructure.com/

Step 2:. On the left toolbar, click Admin then select your account 

Ex: Praxis AI 


Step 3: Select Developer keys from the left menu, 


Step 4: Click on the + Developers Key button, and select LTI Key


Step 5: As of  10/1/2023, Canvas does not support the LTI Advantage protocol, and configuration must be a manual step. Enter the following configuration properties

Key Name	LXP-LTI
Title, Description, Notes	Praxis LXP-LTI
Method	Manual Entry
Owner Email	youremail@yourinstitution.edu
Target Link URI	https://lti.praxislxp.com
Redirect URI	https://lti.praxislxp.com
https://lti.praxislxp.com/resources
https://lti.praxislxp.com/launch
Open ID Connect Initiation URI	https://lti.praxislxp.com/login
JWK Method (select)	Public JWK URL
Public JWK URL	https://lti.praxislxp.com/keys

Step 6:  In the LTI Advantage Services section, toggle all features


Step 7: In the Additional Settings, 


Domain	praxislxp.com
Icon URL	https://lti.praxislxp.com/assets/logo.svg
Text	Praxis LXP
In Custom Fields 	alaiemail=lti-school@praxislxp.com
alaipassword=passwd
alairoleid=1076
alaicohortid=1289
alaiurl=https://learning.praxislxp.com
resourcestype=courses
alaiembed=1
Privacy Level  (select)	Public

:::note
Note: The alaiemail, alaipassword, alairoleid and alaircohortid fields should contain the Value for your institution. 
:::

Note: These values are given to you by Praxis, and unique to your institution. Do not share with anyone.
Step 8: For Placement select Account Navigation, and  Link Selection.

Note: Account Navigation places the LTI Tool in the left navigation bar of the Admin section

Link Selection places the tool in the selection popup when adding an External Activity in a Course Module


Step 9: Under Account Navigation enter

Target Link URI	https://lti.praxislxp.com
Icon URL	https://lti.praxislxp.com/assets/logo.svg
Text	Praxis LXP LTI

Step 10: Under Link Selection, enter the following properties 

Target Link URI	https://lti.praxislxp.com
Icon URL	https://lti.praxislxp.com/assets/logo.svg
Text	Praxis LXP LTI
Select Message type	LtiDeepLinkingRequest
Note: This is important, make sure LtiDeepLinkingRequest is selected, else the Resource selection will not appear when adding a resource to an LTI module.

Step 11: Click the Save  Button 


Step 12: In the Developers key page toggle the State to ON  


Step 13: Click OK to continue and turn the LXP LTI ON


Step 14: Congratulations, your tool is now Active. 


Note: Copy the Client ID of the LTI Tool ex: 243790000000000101 into the clipboard. You will need it for the following steps

Note: Any changes in configuration of the LTI Tool will require the tool state to be turned Off and then back On so that the modification is propagated in Canvas subdomains.
Note: To verify that the tool is properly configured, click on the Praxis LXP LTI Tool in the Admin Left toolbar 


LXP LTI will NOT expose member roles and information through the Member services, nor offer grades directly through this interface. 

For reporting, please use the LXP Composer -> Analytics section instead. (Ferpa compliance) 

When clicking on the blue buttons below, ‘Unauthorized’ message is expected. There is no need to click these buttons. If the page connects, this is enough to show that it’s working. 

## Installing LXP LTI as an Application

Step 15. Login to Canvas as an Administrator. Ex: https://praxis-ai.instructure.com/ user: hugo@praxis-ai.com / pwd

Step 16: On the left toolbar, Click on Admin, then select your Account 


Step 17: Click on Settings, then Apps 


Step 18: Click on App Configurations 


Step 19: Click on the + App button 


Step 20: In the Add App dialog, select By Client ID under the Configuration Type option 


Step 21: Add your LXP LTI Tool instance ID, then click Submit.


Note: The tool instance ID is listed in the Developper Keys page. Paste the value if you have copied the tool ID into the clipboard on step 14

Step 22: Click Install to continue the install process


Step 23: Click Yes, Install Tool to finish the process


Step 24: The LXP LTI tool is now installed and available for your Canvas instance


## OPTION A: Import Entire Generative AI Foundations Course into a Canvas Module

Note: This section details how to add the entire Generative AI Foundations course as an import. 

Step 25A: Login to Canvas as an Administrator. Ex: https://praxis-ai.instructure.com/ user: hugo@praxis-ai.com / pwd 

Step 26B: Import Extract File … 

## OPTION B: Add Individual Generative AI Foundations Activities into Canvas Modules

Note: This section details how to add LTI activities individually to a new or existing Canvas course. 

Step 25B: Login to Canvas as an Administrator. Ex: https://praxis-ai.instructure.com/ user: hugo@praxis-ai.com / pwd

Step 26: Select a Published Course from the Courses menu


Step 27: In the course, select the + button to the right of a module you wish to add Pria


Step 28: In the Item type, select External Tool 


Step 29: Choose Praxis LXP LTI from the list of External Tools


First time access will register your new platform, 



Simply close the pop-up, and click on the Add Item button to retry. This will complete the process ang go to next step

Note: If you receive an error “Unregistered Platform” like below, you need to contact Praxis support group so that your platform can be registered in the Praxis LTI tool 


Note: If you receive an invalid redirect_uri message,

 verify the Redirect URI of your TLI Configuration  


Step 30: Select a, LTI Resource and click on the Submit button


Canvas will confirm the registration


Step 31: Scroll down to edit the assignment and change the Page Name to the name of the module you imported


Ex: 


Step 32: Click Add Item to finish.

 If the module is named Grade, you have to edit and change the display name again.


Update the Title to Pria: Data Science for Machine Learning


Click Update to finish


Step 33: To launch the activity, simply click on the Data Science activity


Note: Repeat the process for each activity you wish to import from the Praxis LXP LTI Tool 

Note: You can import a collection of course from a ZIP assuming that both Praxis LXP and Pria LTI Tools have been installed. For more information in installing Pria using LTI, please contact Praxis Support at  https://praxisai.freshdesk.com/support/home

Error Handling

Connection is not Private in Chrome

If you receive this error 


This error will clear on its own. 

Explanation

If your browser has stored HSTS settings for a domain and you later try to connect over HTTP or a broken HTTPS connection (mis-match hostname, expired certificate, etc) you will receive an error. Unlike other HTTPS errors, HSTS-related errors cannot be bypassed. This is because the browser has received explicit instructions from the browser not to allow anything but a secure connection.

HSTS settings include a “max-age” option, which tells the browser how long to cache and remember the settings before checking again. In order to immediately proceed past the error, you will need to delete your browser’s local HSTS settings for that domain. Instructions on how to do so are below.

These settings need to be cleared in the browser. As a developer, you may run into this error if you are testing an HSTS configuration.

How to Delete HSTS Settings in Chrome

1.Navigate to chrome://net-internals/#hsts

This is Chrome’s UI for managing your browser’s local HSTS settings.

2. First, to confirm the domain’s HSTS settings are recorded by Chrome, type the hostname into the Query Domain section at the bottom of the page. Click Query.If the Query box returns Found with settings information below, the domain’s HSTS settings are saved in your browser.

:::warning
Note that this is a very sensitive search. Only enter the hostname, such as www.example.com or example.com without a protocol or path.
:::

3. Type the same hostname into the Delete domain section and click

Your browser will no longer force an HTTPS connection for that site! You can test if its working properly by refreshing or navigating to the page.

Note that depending on the HSTS settings provided by the site, you may need to specify the proper subdomain. For example, the HSTS settings for staging.yoursite.com may be separate from yoursite.com so you may need to repeat the steps as appropriate.

How to Delete HSTS Settings in Firefox:

We will cover two different methods for deleting HSTS settings in Firefox. The first method should work in most cases – but we also included a manual option if needed.

Close all open tabs in Firefox.
Open the full History window with the keyboard shortcut Ctrl + Shift + H (Cmd + Shift + H on Mac). You must use this window or the sidebar for the below options to be available.
Find the site you want to delete the HSTS settings for – you can search for the site at the upper right if needed.
Right-click the site from the list of items and click Forget About This Site.This should clear the HSTS settings (and other cache data) for that domain.
Restart Firefox and visit the site. You should now be able to visit the site over HTTP/broken HTTPS.If these instructions did not work, you can try the following manual method:
Whitelisting 

In order for the LXP and associated services to run without connectivity issues, the following domains must be Whitelisted by your institution: 

learning.praxislxp.com
lti.praxislxp.com
dcm.toolwire.com
vdi1.toolwire.com
vdi2.toolwire.com
vdi01.east.toolwire.com
Vdi02.east.toolwire.com
For Courses that require Jupiter Notebooks 

prax0xxx.east.toolwire.com (where x is from 001 to 164)


## Third Party Cookies

In order to allow desktop labs to be embedded into the LXP LTI window, the learner needs to allow Third Party cookies for Praxis. To do so: 

Open Chrome settings 


Click on the Privacy and Security menu item on the left, 

expand the Third Party Cookies menu option 


Continue to scroll down to the customized behaviors 


Click the Add button and enter praxislxp.com 

Click the Add button to confirm


Praxislxp.com is now allowed to use third party cookies. 