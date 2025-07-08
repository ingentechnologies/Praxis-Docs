---
sidebar_position: 2
slug: /integrations/canvas/theme
title: 'Theme'
sidebar: integrationsSidebar
---


### Setup
https://learning.praxislxp.com/praxis/pria-custom-theme-canvas-install-guide/

### Links

- [Pria Custom Theme](#Pria_Custom_Theme)
  - [Introduction](#Introduction)
  - [Add Pria to your Theme](#Add_Pria_to_your_Theme)
    - [Edit your Theme](#Edit_your_Theme)
    - [Download the SDK](#Download_the_SDK)
    - [Customize Pria’s Instance](#Customize_Prias_Instance)
    - [Customize Pria’s icon](#Customize_Prias_icon)
    - [Display Options](#Display_Options)
    - [Customize when to load Pria](#Customize_when_to_load_Pria)
  - [Load Pria for certain courses](#Load_Pria_for_certain_courses)
    - [hasAnyRole() function](#hasAnyRole_function)
    - [isUser() function](#isUser_function)
    - [isInUsers() Function](#isInUsers_Function)
    - [isStudent() function](#isStudent_function)
    - [isCourse() function](#isCourse_function)
    - [isInCourses() Function](#isInCourses_Function)
    - [onElementRendered() function](#onElementRendered_function)
    - [The ENV variable](#The_ENV_variable)
  - [Install Pria’s SDK into Theme](#Install_Prias_SDK_into_Theme)
  - [Teacher Onboarding](#Teacher_Onboarding)
    - [Create your Digital Twin](#Create_your_Digital_Twin)
  - [More Personalisation Options](#More_Personalisation_Options)
  - [Whitelisting](#Whitelisting)
  - [Subaccounts](#Subaccounts)




  Pria Custom Theme 

Canvas Install Guide 

Rev 1.4 June 2024

Introduction

This document details the installation steps to set up Pria into Canvas using the Canvas Theme Editor . When installed in the Theme, Pria becomes embedded into Canva’s pages.


Add Pria to your Theme

To add Pria globally to a Canvas account, inject a segment of Javascript code in the Theme used by the account or sub-account of your choice.

We are following the instructions similar to those  posted at https://community.canvaslms.com/t5/Admin-Guide/How-do-I-upload-custom-JavaScript-and-CSS-files-to-an-account/ta-p/253

Edit your Theme

To do so:

Step A. Login to Canvas as an Administrator. 

Ex: https://praxis-ai.instructure.com/ user: hugo@praxis-ai.com / pwd

Step B: On the left toolbar, click Admin then select your account 

Ex: Praxis AI 


Step C: Select Themes on the left menu


Step D: Click on the current Theme to open the Theme Editor. 


Click to the Upload tab on the left


Download the SDK

Step E: Download the pria-sdk-canvas.js code at https://pria.praxislxp.com/pria-sdk-canvas.js onto your computer, and save the file as pria-sdk-canvas.js 


Note: You may save this file into a Google Drive, and edit your customizations on an ongoing basis. 

Note: Keep track of the version of the file and your own modification to ensure that you are using the latest and greatest.

Note: When you select this file to inject in your theme, Canvas uploads a copy into its own CDN therefore, you need to reload the files into Canvas after you make a change.

Customize Pria’s Instance

Step F: In this step, you will customize the Javascript SDK you downloaded to specify what instance of Pria to use. 

Edit the file pria-sdk-canvas.js from your download 


If you prefer to disable Pria by default set the INSTITUTION_ID to undefined

var INSTITUTION_ID;
If you prefer using the “Teacher Onboarding” process, leave the institution_id field blank (e.g. “”) like this:

var INSTITUTION_ID = “”;
In this modality, Teacher or Administrator alike will select an existing instance or create a new instance at runtime.

If prefer to assign everyone to the same instance of Pria (for the sub-account), then set the value of the INSTITUTION_ID to the instance public ID given to you by Praxis , ex: 5fd6d7a4-4cc7-4e04-8473-e89aef4e…

`var INSTITUTION_ID = “5fd6d7a4-4cc7-4e04-8473-e89aef4e…”;`
Note: The value of the INSTITUTION_ID field is unique to your instance of Pria. Keep this ID confidential.

Customize Pria’s icon


You can change the icon of the button that will appear on the screen with the following variable:


If you like to keep using Pria’s icon, leave the INSTITUTION_ICON_URL as undefined

var INSTITUTION_ICON_URL;
If you want to change the icon, set the value of the icon URL to a new location, like the example below:

`var INSTITUTION_ICON_URL = “https://pria.praxislxp.com/logo192.png”;`
Note: We recommend using a square image, no larger than 192 x 192 pixels, that also supports transparency (like PNG format) 

Note: This image should be placed on a Content Delivery Network that allows access across origin or domains (CORS Policy)

Display Options

You can customize the position, size and container of Pria’s button as well as the main window with the following Javascript DISPLAY_OPTIONS variable:


The options are as below:

fullScreen	true | false (default)	Determine whether Pria should be displayed in Fullscreen. 
openOnLoad	true | false (default)	Determine whether Pria should be opened immediately when loaded, or should remain closed until the user clicks the Pria button
buttonWidth	CSS width value, or  ‘80px’ (default)	Determine the size of the Pria Button. See examples ow width at https://developer.mozilla.org/en-US/docs/Web/CSS/width
buttonPosition	CSS position value or ‘fixed’ (default)	Determine the position of the button, by definition fixed, but can be relative, or absolute depending on how you wish to insert the button in your web page
buttonPositionBottom	CSS bottom value or ‘20px’	Determine the position of the button relative to the bottom edge of the screen. This value is useful when the position of the button is set to ‘fixed’ or ‘absolute’, else it has no effects. See examples at https://developer.mozilla.org/en-US/docs/Web/CSS/bottom
Example: to place the icon on the top of the screen use for example
buttonPositionBottom: ‘calc(100% – 120px)’
buttonPositionRight	CSS right value or ‘20px’	Determine the position of the button relative to the right edge of the screen. This value is useful when the position of the button is set to ‘fixed’ or ‘absolute’, else it has no effects. See examples at https://developer.mozilla.org/en-US/docs/Web/CSS/right
Example: to place the icon on the top of the screen use for example
buttonPositionRight: ‘calc(100% – 120px)’
buttonNoBounce	true (default) | false	Determines if the button bounces when placed on the screen. Default: No bounces
priaContainerId	ID of the parent element, or ‘’ (BODY TAG by default)	Determine what element will be the parent of Pria UI iFrame. Empty by default appends Pria to the BODY element of the page
buttonContainerId	ID of the parent element, or ‘’ (BODY TAG by default)	Determine what element will be the parent of the Pria Button. Empty by default appends the button to the BODY element of the page
allowPop	True/False (Default)	Determine if the button that pops pria into a new Tab is available. Because of new security constraints where third party cookies are now sandbox, this functionality s no longer available, and the option is considered deprecated.
Customize when to load Pria

The Javascript SDK loads Pria with the loadPria() function.


Note: the loadPria() function will not load Pria twice if it happens to be called more than once.

In the SDK, the loadPria() function is placed when the student or teacher is on a course page. 

This determination is done using a regular expression with the function onPage() like below:


Note: In Canvas, course pages have URLS that match this structure https://my-univertivt.canvas.edu/courses/106/… and this is what we rely on to determine to loadPria() so it loads only for courses. 

In the SDK, we also loade Pria in the Theme Editor so that we can preview Pria after we edit the custom theme. This is not required


The page URL match uses Regular Expressions

Load Pria for certain courses

It is common that administrator want to load Pria only for certain courses, while it stays disabled for all the others.

In this case, set the default INSTITUTION_PUBLIC_ID to undefined on line 13.


On line 41, inside the block that determines that we are in a course page, add the following code:

```
var coursesForSpecificInstance = [79875, 72856, 55621]
isInCourses(coursesForSpecificInstance, function (isCourse) {
if (isCourse) {
INSTITUTION_ID=’1234-5245-ss-aaa’
INSTITUTION_ICON_URL=’https://cdn.domain.edu/my/icon.png’
}
})
```
The code will look like this:


This code means that if the current course is either 79875, 72856, or 55621, then we set the INSTITUTION_ID to a specific instance, and customize the icon to our own URL

Similarly, you may choose to enable the digital twin (let teacher crete their own twins) for a specific set of courses. To do so, simply set the INSTITUION_ID to empty string like this:

```
var coursesForDigitalTwin = [69875, 62856, 65621]
isInCourses(coursesForDigitalTwin, function (isCourse) {
if (isCourse) {
INSTITUTION_ID=”
INSTITUTION_ICON_URL=undefined
}
})
```

The code looks like:


You can create javascript code that select a specific instance or Pria for each teacher courses for example:


The Javascript SDK has a lot of additional useful functions you can. Let’s take a look at those.

HASANYROLE() FUNCTION

The function hasAnyRole() determines if the current user has the specified role (ex:user, teacher, admin,root_admin) 


ISUSER() FUNCTION

The function isUser() determines if the current user is the one specified by id (ex: 1)


ISINUSERS() FUNCTION

The isInUsers() function determines if the current user is in the array of specific user ids


ISSTUDENT() FUNCTION

The function isStudent() determines if the current user is a student 


ISCOURSE() FUNCTION

The function isCourse() determines the current page is in a specific course (ex: id 123) 


ISINCOURSES() FUNCTION

The function isInCourses() determines if the current course is in an array of specific courses,


ONELEMENTRENDERED() FUNCTION

The onElementRendered() function is triggered when an element is fully displayed in the page. You can use this function handler to attach an event to a link or a button on a page that will load Pria on click.

Example below is an anchor referenced by ID create_ticket


THE ENV VARIABLE

In Canvas, a Javascript object called ENV is available to any pages rendered in the Application. When injected as a Theme, Pria has access to the variable and uses it to determine who is the current user, or what course is he/she launching.

To review the properties made available by the ENV variable, open a course page in Canvas, and launch the Developer Mode (F12 on Windows – developer tools on Mac) then in the Console window, type ENV then press the ENTER key.

Here is an example of such variable:


Pria makes use of the current_user property.


current_user_roles property: 


and current_context property:


Install Pria’s SDK into Theme

Once you have customized your SDK Javascript file and added the logic to load Pria when the proper conditions are met, you are ready to add it to your current Theme 

Step G: In the Theme Editor, Upload Tab, under the JavaScript File section, click on the Select button  


Step H: Select the pria-sdk-canvas.js that you just customized from your download folder, then click OK


Step I: The theme Editor will download the Javascript onto Canvas content delivery network so it becomes available to the theme. 

Click  on the Preview Your Changes button 


Step J:  Verify that Pria is running properly in Preview mode 

1- The Pria Icon should appear at the bottom of the screen in preview mode


2- The Pria UI should open and connect upon click on the icon 


Step K: If Pria appears properly in Preview mode, click the Save to apply the changes in the Theme and return to the Theme selector. 

The Pria Icon should display properly


Step L: Congratulations, Pria is now installed in your theme. 

To verify, login using a standard User account, and navigate to the section of Canvas where you are loading Pria, example below in a course


Teacher Onboarding

This process happens IF you decide to leave the INSTITUTION_ID field as an empty string (by default) in the SDK file inserted in the theme. The teacher (or any administrator) is then expected to Create an instance of Pria (a.k.a. digital twin), or connect to an existing one for every course the teacher wants Pria in. 

When inserted as a theme, Pria is injected in the bottom right corner of a course page.


Create your Digital Twin

The onboarding wizard starts when the Teacher clicks on Pria’s ison to expand for the first time
This wizard allows for the creation of an instance of Pria, dedicated to the teacher.

Click the + Digital Tein button to create a personalized instance of Pria. 


In the New Digital Twin dialog, enter 
a name for your twin, ex: Bob, 
a picture URL that is accessible on the internet (without CORS issues), and 
a picture to use for the ui background
An A.I. prompt that personalizes your character (more information is available in the Faculty Guide )
Click Let’s GO to finish the creation of your new instance.

You are now in your digital twin instance: 

Congratulations, you just created your very first digital twin. 
Note: Anytime you or your students will click on Pria in this page, you will access this instance directly. 

When you place Pria in another course, it is considered a new placement. You will have to go through this wizard again and create a different instance or reuse one of your existing instances like the example below

Selecting an existing instance will associate this placement to the instance. This can not be changed later, unless you remove the placement URL from the list of configured URLs for this instance. 

More Personalisation Options

More information on Admin functions is available in the Faculty Guide to your Digital Twin at 

https://learning.praxislxp.com/praxis/faculty-guide-to-your-digital-twin-2/#GPT_and_Personalization

Once connected to your instance, click on the GPT and Personalization Tab. This page is where you can update any personalizations for your digital twin. 


Note: Follow the instructions in the Admin Guide to setup integration to your Canvas instance and allow Pria to search your course content.

Note: If you are using Kaltura, this is a good time to configure the integration as well. Contact your IT Administrator

Note: Anytime you make a change to the instance, don’t forget to click the Update button to save your changes.

Whitelisting 

In order for Pria and associated services to run without connectivity issues,  the following domains must be Whitelisted by your institution: 

pria.praxislxp.com
prialti.praxislxp.com
Subaccounts 

Canvas allows administrators to set up themes for sub accounts. Use this technique to enable Pria in a Theme for specific user population/courses. 


It is best practice to add Pria only to sub accounts, because scripts are added from Parent to Child domains.