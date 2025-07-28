/* Custom JavaScript for Canva's Theme - Pria version 1.4 July 7th 2025 */
var priaStarted = window.priaStarted || false

//
// TODO: 
// 1- Leave the institution_id to an empty string (Digital Twin) so that teachers or administrators can create or select a new or existing instance of Pria (digital twin),
//    or set to a specific instance public id like ('5fd6d7a4-4cc7-4e04-8473-e89aef4e...') which will be used by default when launching Pria, 
//    When value is set to undefined, Pria will not load.
// 2- set the picture PNG/JPG accessible cross domains to change your logo, or leave undefined to keep Pria's default picture
// 3- customize display options or leave the default values.
// See install documentation at https://learning.praxislxp.com/praxis/pria-custom-theme-canvas-install-guide/
//
// Note: as of version 1.2 a new display option noUI is offered to disable the UI completely and interact with Pris programatically through the SDK 
// See Developer documentation at https://learning.praxislxp.com/praxis/pria-js-sdk/

var INSTITUTION_ID="";   // undefined, "", or valid ID "5fd6d7a4-4cc7-4e04-8473-e89aef4e...";
var INSTITUTION_ICON_URL; // undefined for default Pria logo or full url ex: "https://cdn.mydomain.com/assets/picture.png"
var DISPLAY_OPTIONS={
    fullScreen: false,    // True for expanded in full screen
    openOnLoad: false,    // True to open Pria immediately when loaded 
    buttonWidth: '80px',  // Size of the button containing the Pria Logo
    buttonPosition: 'fixed',     // Determine the position of the button (fixed, relative, sticky)
    buttonPositionRight: '20px', // Position of the button relative to the right edge of the screen
    buttonPositionBottom: '20px',// Position of the button relative to the bottom edge of the screen
    buttonNoBounce: true,  // Determine wether the button will not bounce when Pria is closed
    priaContainerId: '',   // Id of the container receiving pria window (default empty uses BODY)
    buttonContainerId: '', // Id of the container receiving the button (default empty uses BODY)
    allowPop: false, // true to show the button and pop Pria out the containing iFrame 
    noUI: false // true to disable the UI. Pria is still accessible through the Javascript SDK
}

window.addEventListener('load', (event) => {

    //
    // Code below determines when to start Pria 
    // By default on all course pages and theme editor for preview
    // Customize as needed
    //

   
    // load on all courses page (default)
    // Ex: https://praxis-ai.instructure.com/courses/106
    onPage(/\/courses\/\d+/, function (isOnPage) {
        if (isOnPage) {
            // Will not load on preview pages
            if (location.href.match(/preview=/)) return 

            // Example on how to use the isInCourses functions to 
            // connect to a specific instance of pria, or enable digital twins 
            // when the INSTITUTION_ID is set to undefined on line 13
            /*
            var coursesForSpecificInstance = [79875, 72856, 55621]
            isInCourses(coursesForSpecificInstance, function (isCourse) {
                if (isCourse) {
                    INSTITUTION_ID='1234-5245-ss-aaa'
                    INSTITUTION_ICON_URL='https://cdn.domain.edu/my/icon.png'
                }
            })
            */

            /*
            var coursesForDigitalTwin = [69875, 62856, 65621]
            isInCourses(coursesForDigitalTwin, function (isCourse) {
                if (isCourse) {
                    INSTITUTION_ID=''
                    INSTITUTION_ICON_URL=undefined
                }
            })
            */

            /*
            var coursesForAccounts = [123, 2345]
            isInAccounts(coursesForAccounts, function (isAccount) {
                if (isAccount) {
                    INSTITUTION_ID=''
                    INSTITUTION_ICON_URL=undefined
                }
            })
            */
            loadPria()

        }
    })

    //
    // Additional loading options 
    //

    // load on theme_editor page
    // Ex: url https://praxis-ai.instructure.com/accounts/1/theme_editor
    onPage(/\/theme_editor/, function (isOnPage) {
        if (isOnPage) {
           loadPria()
        }
    })

    // load for a user role 
    // ex: user, teacher, admin, root_admin, etc.
    hasAnyRole('user', function (hasRole) {
        if (hasRole) {
            // loadPria()
        }
    })

    // load if a student
    isStudent(function (isStudent) {
        if (isStudent) {
            //  loadPria()
        }
    })

    // load for a specific user
    isUser(1, function (isUser) {
        if (isUser) {
            //  loadPria()
        }
    })
    
    // load for specific users
    var userIds=[1,2,3]
    isInUsers(userIds, function (isUser) {
        if (isUser) {
            //  loadPria()
        }
    })

    // load for a specific course
    isCourse(123, function (isCourse) {
        if (isCourse) {
            //  loadPria()
        }
    })

    var courseIds = [1234,2345]
    isInCourses(courseIds, function (isCourse) {
        if (isCourse) {
            //  loadPria()
        }
    })

    // Load with an action on a page using el (a jquery element collection)
    onElementRendered('a[href=#create_ticket]', function (el) {
        //  loadPria()
    })

})

//
// DO NOT MODIFY utility functions below
//
function onPage(regex, fn) {
    location.pathname.match(regex) ? fn(true) : fn(false)
}

function hasAnyRole(/*roles, cb*/) {
    var roles = [].slice.call(arguments, 0);
    var cb = roles.pop();
    for (var i = 0; i < arguments.length; i++) {
        if (ENV.current_user_roles !== null && ENV.current_user_roles.indexOf(arguments[i]) !== -1) {
            return cb(true)
        }
    }
    return cb(false)
}

function isUser(id, cb) {
    var currentUser = Number(ENV?.current_user_id || ENV?.current_user?._id)
    cb( currentUser === Number(id));
}

function isInUsers(ids, cb) {
    var currentUser = Number(ENV?.current_user_id || ENV?.current_user?._id)
    var res = ids.includes(currentUser)
    if (cb) {
        cb(res)
    }
    return res
}

function isCourse(id, cb) {
    let res = (ENV?.current_context?.id && Number(ENV.current_context?.id) === Number(id) && ENV?.current_context?.type==="Course") ||
    (ENV.COURSE_ID && Number(ENV.COURSE_ID) === Number(id))
    if (cb) {
        cb(res)
    }
    return res
}

function isInCourses(ids, cb) {
    let currentCourseId = (ENV?.current_context?.type==="Course" &&  ENV?.current_context?.id ? Number(ENV.current_context?.id) : (ENV?.COURSE_ID ? Number(ENV.COURSE_ID) : 0 ))
    var res = ids.includes(currentCourseId)
    if (cb) {
        cb(res)
    }
    return res
} 

function isAccount(id, cb) {
    let res = (ENV?.current_context?.id && ENV?.current_context?.type==="Course" && ENV.ACCOUNT_ID && Number(ENV.ACCOUNT_ID) === Number(id))
    if (cb) {
        cb(res)
    }
    return res
}

function isInAccounts(ids, cb) {
    let currentAccountId = (ENV?.current_context?.id && ENV?.current_context?.type==="Course" && ENV.ACCOUNT_ID ? Number(ENV.ACCOUNT_ID) : -1 )
    if (currentAccountId<=0) {
        cb(false)
        return false
    }

    var res = ids.includes(currentAccountId)
    if (cb) {
        cb(res)
    }
    return res
}

function isStudent(cb) {
    cb(ENV.current_user_is_student);
}

function onElementRendered(selector, cb, _attempts) {
    var el = $(selector)
    _attempts = ++_attempts || 1
    if (el.length) return cb(el)
    if (_attempts === 60) return
    setTimeout( () => {
        onElementRendered(selector, cb, _attempts);
    }, 250)
}


const loadPria = () => {
    if (priaStarted) return;
    priaStarted = true;
    var currentUser = ENV?.current_user_global_id || ENV?.current_user_id || ENV?.current_user?._id || 1
    
    var email = ENV?.current_user?.email || ENV?.USER_EMAIL || ""
    if (email.length === 0) {
        email =  `${currentUser}@${document.location.host}`
    }

    var isAdmin = ENV.current_user_roles?.indexOf('admin') > -1 || ENV.current_user_roles?.indexOf('teacher') > -1 || ENV.current_user_roles?.indexOf('root_admin') > -1 || ENV.current_user_is_admin || false;
    //console.info("Canvas ENV", ENV)
    var user = {
        email: email,
        profilename: ENV?.current_user?.display_name || "User Name",
        profilepicture: ENV?.current_user?.avatar_image_url || "",
        userid: `${currentUser}`,  /* external id of the user */
        usertype: isAdmin ? 4 : 1, /*1: user, 4: admin*/
        roleid: Number(ENV?.current_context?.id || ENV?.COURSE_ID || ENV?.COURSE?.id || 1),  /* Course ID when present (optional) */
        rolename:  ENV?.current_context?.name || ENV?.COURSE?.long_name || "", /* Course Name (optional)*/
        partnerid: `${ENV.DOMAIN_ROOT_ACCOUNT_ID || ENV.ACCOUNT_ID || 1}`, /* Account ID (optional) */
        partnername: document.location.host, /* Account domain (optional) */
        lticontextid : ENV?.current_context?.url || document.location.href, /* Placement of Pria */
    }

    loadSdkOver('https://pria.praxislxp.com', user, INSTITUTION_ID, INSTITUTION_ICON_URL, DISPLAY_OPTIONS)

}

const loadSdkOver = (u, user, key, icon, options) => {
    const script = document.createElement('script');
    script.src = u + "/pria-sdk.js";
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => {
        if (typeof (window.priasdk) === 'function') {
            window.priasdk(u, user, key, icon, options);
        }
    }
}