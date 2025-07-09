
/* Custom JavaScript for the Web - Pria version 1.2 Jan 1st 2025 */

var INSTITUTION_ICON_URL='https://learning.praxislxp.com/praxis/darianne_praxis-ai_com/wp-content/uploads/sites/112/2025/06/prompto.webp'; // Leave empty for Pria's default
var INSTITUTION_ID='01628397-4d42-49d5-ade8-f6ddd014a822'; // Leave empty for digital twin

// TODO: Pass in user identity 

function loadSdkOver(u) {

    var displayOptions = {
        fullScreen: false, // True for expanded in full screen
        openOnLoad: false, // True to open Pria immediately when loaded 
        buttonWidth: '80px', // Size of the button containing the Pria Logo
        buttonPosition: 'fixed', // Determine the position of the button (fixed, relative, sticky)
        buttonPositionRight: '20px', // Position of the button relative to the right edge of the screen
        buttonPositionBottom: '20px', // Position of the button relative to the bottom edge of the screen
        buttonNoBounce: true,  // Determine wether the button will not bounce when Pria is closed
        priaContainerId: '', // Id of the container receiving pria window (default empty uses BODY)
        buttonContainerId: '', // Id of the container receiving the button (default empty uses BODY)
        allowPop: false, // true to show the button and pop Pria out the containing iFrame 
        noUI: false // true to disable the UI. Pria is still accessible through the Javascript SDK
    }

    const pictureUrl = (window?.coPriaIconUrl || INSTITUTION_ICON_URL)
    const publicId = (window?.coPriaInstanceId || INSTITUTION_ID)

    const script = document.createElement('script');

    script.src = u + "/pria-sdk.js";
    script.async = true;
    script.onload = function () {
        if (typeof (window.priasdk) === 'function') {

            // user identity
            let user = typeof (window.authUser) === 'object' ? { ...window.authUser } :
                {
                    email: "user@email.com",
                    profilename: "User Name",
                    profilepicture: "https://cdn.com/images/user_profile.png",
                    userid: 1,   /* User Id */
                    usertype: 1, /* User Type 1: user, 2:mentor 3:reporter 4:admin */
                    roleid: 1,   /* Course Id */
                    rolename: "Course", /* Course Name */
                    partnerid: 1, /* Customer Id (optional) */
                    partnername: "Partner", /* Customer Name (optional) */
                    lticontextid: document.location.href, /* Placement of Pria */
                };

            window.priasdk(u, user, publicId, pictureUrl, displayOptions);
        };
    };
    script.onerror = (err) => {
        console.log("Failed to embed pria", err)
    };

    document.body.appendChild(script);
}
window.addEventListener("DOMContentLoaded", (event) => {
    loadSdkOver('https://pria.praxislxp.com');
});
