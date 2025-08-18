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
            let launchPria = true
            let coursesForLTI=[105, 215]
            isInCourses(coursesForLTI, function (isCourse) {
                if (isCourse) {
                    launchPria=false
                }
            })
            
            if (launchPria){
                loadPria()
            }
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



/* Enhanced JavaScript for Canvas Theme - Pria version 1.3 - 20250507 */

window.priaEnhancedCanvas = window.priaEnhancedCanvas || {};
window.priaEnhancedCanvas.pageIsPreview = location.href.match(/preview=/);

// set these to true to enable the features in Canvas
window.priaEnhancedCanvas.enablePriaButtons = true; // Enable buttons activations on pages
window.priaEnhancedCanvas.enablePageEditorButtons = true; // Enable buttons in the Canvas page editor
window.priaEnhancedCanvas.enableQuizEditorButtons = true; // Enable buttons in the Canvas quiz editor
window.priaEnhancedCanvas.enableAssignmentEditorButtons = true; // Enable buttons in the Canvas assignment editor
window.priaEnhancedCanvas.enableExplainWithAIPopup = true; // Enable the Explain with AI popup
window.priaEnhancedCanvas.enableExplainWithAIName = true; // If true, the explain pop up with explain with the AI's name
window.priaEnhancedCanvas.explainWithAIButtonText = "Explain with"; // Text for the Explain with AI button. If enableExplainWithAIName, it will be used to prefix the AI's name

// This class has helper functions for Pria functionality.
const PriaHandler = (() => {
    let waitForPriaTimer;
    const methodsToRun = [];
    let priaReady = false;

    const waitForPria = () => {
        const pria = window['pria'];
        if (!pria) {
            return;
        } else {
            clearInterval(waitForPriaTimer);
            setTimeout(() => {
                console.log("Pria is ready.");
                priaReady = true;
                runMethods();
            }, 500);
        }
    };

    const priaButtonHtml = `<button aria-label="Pria" title="Pria" id="pria-insert-button" type="button" tabindex="-1" class="tox-tbtn" aria-disabled="false">
    <span class="tox-icon tox-tbtn__icon-wrap">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"/></svg>
        </svg>
    </span>
</button>`;

    const addOrRunMethod = (method) => {
        if (typeof method === 'function') {
            if (priaReady) {
                method();
            } else {
                methodsToRun.push(method);
            }
        }
    };

    const attributeEncode = (text) => {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        };
        return text.replace(/[&<>"'`=\/]/g, function (char) {
            return map[char];
        });
    };

    const attributeDecode = (text) => {
        const map = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#39;': "'",
            '&#x2F;': '/',
            '&#x60;': '`',
            '&#x3D;': '='
        };
        return text.replace(/(&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;|&#x60;|&#x3D;)/g, function (entity) {
            return map[entity];
        });
    };

    const runMethods = () => {
        methodsToRun.forEach(method => method());
        methodsToRun.length = 0;
    };

    const bindButtonEvents = (selector, event, handler) => {
        const buttons = document.querySelectorAll(selector);
        buttons.forEach(button => {
            button.addEventListener(event, handler);
        });
    };

    const sendMessage = (messageObj) => {
        let message;

        if (typeof (messageObj.message) === "function") {
            message = messageObj.message()
        }
        else {
            message = messageObj.message
        }

        const request = {
            command: 'post',
            inputs: [message]
        };

        if (typeof (messageObj.assistantId) !== "undefined" && messageObj.assistantId != null && messageObj.assistantId != "") {
            request.assistantId = messageObj.assistantId;
        }

        if (typeof (messageObj.selectedCourse) !== "undefined" && messageObj.selectedCourse != null) {
            request.selectedCourse = messageObj.selectedCourse;
        }

        const pria = window['pria']

        if (pria) {
            pria.send(request)
            if (messageObj.showPria) {
                document.getElementById("pria_button").click()
            }
        }
        else {
            console.log('Warning, can not send message! Pria not loaded')
        }
    };

    const waitForElement = (elementId, callBack) => {
        let timerCount = 0;
        const checkElement = () => {
            const element = document.getElementById(elementId);
            timerCount++;
            if (element) {
                callBack(elementId, element);
            } else {
                if (timerCount > 800) {
                    return;
                }
                setTimeout(checkElement, 30);
            }
        };
        checkElement();
    };

    const getElementByDataId = (dataId) => {
        const iframe = document.getElementById(`${dataId}_ifr`)
        if (!iframe) {
            console.log(`parent Iframe "${dataId}_ifr" not found `)
            return
        }
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

        const elements = iframeDocument.querySelectorAll(`[data-id="${dataId}"]`);

        if (elements.length === 0) {
            console.log(`No elements found with data-id "${dataId}"`);
            return null;
        }

        if (elements.length === 1) {
            return elements[0].innerHTML;
        } else {
            console.log("Warning, found multiple ements of the same data-id")
            return elements[0].innerHTML;
        }
    };

    const getAllAnswers = (limit) => {
        let userSubmissions = []
        for (let i = 0; i < limit; i++) {
            userSubmissions.push({
                questionIndex: (i + 1),
                answer: getElementByDataId(`question_input_${i}`)
            })
        }
        return userSubmissions
    };

    const getMessageForAnswers = () => {
        const answers = getAllAnswers()
        console.log("Answers:", answers)
        const ret = `Save my answers to user memory <details><summary>Answers</summary><code>${JSON.stringify(answers)}</code></details> to personalize my experience.`
        return ret
    };

    const getMessageForAnswers2 = (answers) => {
        const ret = `Save my answers to user memory <details><summary>Answers</summary><code>${JSON.stringify(answers)}</code></details> to personalize my experience.`
        return ret
    };

    const getAllAnswers2 = () => {
        const iframes = document.querySelectorAll('iframe[id^="question_input_"]');

        let userSubmissions = [];

        for (let i = 0; i < iframes.length; i++) {
            const iframe = iframes[i];

            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

            const elements = iframeDocument.querySelectorAll('[data-id]');

            elements.forEach(element => {

                const dataId = element.getAttribute('data-id');

                if (dataId === `question_input_${i}`) {

                    userSubmissions.push({
                        questionIndex: (i + 1),
                        answer: element.innerHTML
                    });
                }
            });
        }

        return userSubmissions;
    };

    const createAndShowModal = (modalHtml, onOkClick) => {
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modal = document.getElementById("pria-modal");
        const closeButton = document.querySelector(".close-button");
        const okButton = document.getElementById("ok-button");
        const cancelButton = document.getElementById("cancel-button");

        modal.style.display = "block";

        const closeModal = () => {
            modal.style.display = "none";
            modal.remove();
        };

        closeButton.addEventListener("click", closeModal);
        cancelButton.addEventListener("click", closeModal);
        okButton.addEventListener("click", () => {
            onOkClick();
            closeModal();
        });

        window.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    };

    const getValuesFromPriaAttribute = (selectedNode) => {
        let existingValues = {};
        const dataCustom = selectedNode.getAttribute('data-custom');
        const idx = dataCustom.indexOf(':');
        let dataParts = [];
        if (idx === -1) {
            dataParts = [dataCustom];
        } else {
            dataParts = [dataCustom.substring(0, idx), dataCustom.substring(idx + 1)];
        }

        if (dataParts.length == 2) {
            if (dataParts[0] === 'pria') {
                const decodedData = atob(dataParts[1]);
                existingValues = JSON.parse(decodedData);
                existingValues.className = selectedNode.className;
                existingValues.textContent = selectedNode.textContent;
            }
            else if (dataParts[0] === 'praxis') {
                const decodedData = dataParts[1];
                existingValues = JSON.parse(decodedData);
                existingValues.className = selectedNode.className;
                existingValues.textContent = selectedNode.textContent;
            }
        }
        return existingValues;
    };

    const addPriaButton = (toolbarTitle, isLinkNodeName, getModalHtml, onOkClick) => {
        if (typeof tinymce !== "undefined") {
            if (document.getElementById("pria-insert-button")) {
                return;
            }

            const rce = document.getElementsByClassName("tox-tinymce")[0];
            const toolbarGroups = rce.getElementsByClassName("tox-toolbar__group");
            let toolbar;
            for (let i = 0; i < toolbarGroups.length; i++) {
                if (toolbarGroups[i].getAttribute('title') === toolbarTitle) {
                    toolbar = toolbarGroups[i];
                    break;
                }
            }

            if (toolbar) {
                const buttonHtml = PriaHandler.priaButtonHtml;
                const button = document.createRange().createContextualFragment(buttonHtml);
                toolbar.appendChild(button);

                document.getElementById("pria-insert-button").addEventListener("click", function () {
                    const courseId = window.location.pathname.match(/\/courses\/(\d+)/)[1];
                    const selectedNode = tinymce.activeEditor.selection.getNode();
                    let existingValues = {};
                    let isLink = false;

                    if (selectedNode.nodeName === isLinkNodeName && selectedNode.hasAttribute('data-custom')) {
                        isLink = true;
                        existingValues = getValuesFromPriaAttribute(selectedNode);
                    }

                    const modalHtml = getModalHtml(existingValues, courseId);

                    createAndShowModal(modalHtml, () => {
                        onOkClick(selectedNode, isLink, courseId);
                    });
                });
            }
        }
    };

    const getAssistants = async () => {
        const pria = window['pria'];

        if (pria) {

            return new Promise((resolve, reject) => {
                const priaAssistantResponse = (response) => {

                    if (response?.response
                        && response.type === "pria-response"
                        && response.response.command === "assistants.list"
                        && response.response.isError === false) {

                        pria.unsubscribe(priaAssistantResponse);

                        let assistants = response.response.content;

                        if (assistants.length > 0) {

                            for (var i = 0; i < assistants.length; i++) {
                                assistants[i].name = assistants[i].name.trim();
                            }

                            assistants.sort((a, b) => {
                                if (a.name < b.name) return -1;
                                if (a.name > b.name) return 1;
                                return 0;
                            });

                            assistants.unshift({ _id: '', name: 'No Assistant' });
                        }

                        resolve(assistants);
                    }
                };

                pria.subscribe(priaAssistantResponse);

                const request = {
                    command: "assistants.list",
                };

                try {
                    pria.send(request);
                } catch (error) {
                    pria.unsubscribe(priaAssistantResponse);
                    console.error("Error sending request to Pria:", error);
                    reject(error);
                }
            });
        } else {
            console.warn("Pria is not available.");
            return Promise.reject("Pria is not available.");
        }
    };

    window.addEventListener('load', (event) => {
        waitForElement("pria_frame", () => {
            const pria_frame = document.getElementById("pria_frame");
            pria_frame.addEventListener("load", () => {
                waitForPriaTimer = setInterval(waitForPria, 1000);
            });
        });
    });

    return {
        addOrRunMethod,
        bindButtonEvents,
        attributeEncode,
        attributeDecode,
        sendMessage,
        getElementByDataId,
        getAllAnswers,
        getMessageForAnswers,
        waitForElement,
        getAllAnswers2,
        priaButtonHtml,
        getMessageForAnswers2,
        createAndShowModal,
        addPriaButton,
        getAssistants,
        getValuesFromPriaAttribute
    };
})();

window.priaEnhancedCanvas.getAssistantHtml = (assistants, existingValues) => {

    let instanceIdHtml = "";

    if (assistants.length > 0) {

        // generate select html for modal
        let selectHtml = "";
        assistants.forEach(assistant => {
            if (existingValues.assistantId && existingValues.assistantId === assistant._id) {
                selectHtml += `<option value="${assistant._id}" selected>${assistant.name}</option>`;
            }
            else
                selectHtml += `<option value="${assistant._id}">${assistant.name}</option>`;
        });

        // wrap select html in a select tag
        selectHtml = `<select id="pria-instance-id" name="pria-instance-id" style="display: block;">${selectHtml}</select>`;

        instanceIdHtml = `<div>
    <label for="pria-instance-id" style="font-weight: bold;">Assistant:</label>
</div>
<div>
    ${selectHtml}
</div>`;
    }
    else {
        instanceIdHtml = `<div>
    <label for="pria-instance-id" style="font-weight: bold;">Assistant Id:</label>
</div>
<div>
    <input type="text" id="pria-instance-id" name="pria-instance-id" value="${existingValues.assistantId || ''}">
</div>`;
    }

    return instanceIdHtml
};

if (!window.priaEnhancedCanvas.pageIsPreview) {

    if (window.priaEnhancedCanvas.enablePriaButtons) {

        // This method attaches Pria functionality to on-page button elements.
        PriaHandler.addOrRunMethod(() => {
            PriaHandler.bindButtonEvents('[data-custom^="praxis:"]', 'click', (event) => {
                const button = event.target;
                const priaMessage = PriaHandler.getValuesFromPriaAttribute(button);
                PriaHandler.sendMessage(priaMessage);
            });
            PriaHandler.bindButtonEvents('[data-custom^="pria:"]', 'click', (event) => {
                const button = event.target;
                const priaMessage = PriaHandler.getValuesFromPriaAttribute(button);
                PriaHandler.sendMessage(priaMessage);
            });
        });
    }

    if (window.priaEnhancedCanvas.enablePageEditorButtons) {

        // Attach the Pria button to the page editor.
        (function () {
            PriaHandler.addOrRunMethod(() => {
                PriaHandler.waitForElement("wiki_page_body_ifr", () => {

                    (async () => {
                        let assistants = [];

                        try {
                            assistants = await PriaHandler.getAssistants();
                        } catch (error) {
                            console.error("Failed to get assistants:", error);
                        }

                        PriaHandler.addPriaButton('Miscellaneous', 'A', (existingValues, courseId) => {

                            let modalHtml = "";
                            let instanceIdHtml = window.priaEnhancedCanvas.getAssistantHtml(assistants, existingValues);

                            modalHtml = `<div id="pria-modal" class="modal pria-edit-modal">
    <div class="pria-edit-modal-content">
        <span class="close-button">&times;</span>
        <h2>Assistant Helper Button</h2>
        <div>
            <label for="pria-buttontext" style="font-weight: bold;">Button Text:</label>
        </div>
        <div>
            <input type="text" id="pria-buttontext" name="pria-buttontext" value="${existingValues.textContent || ''}">
        </div>
        <div>
            <label for="pria-buttonstyle" style="font-weight: bold;">Button Style:</label>
        </div>
        <div>
            <input type="text" id="pria-buttonstyle" name="pria-buttonstyle" value="${existingValues.className || 'btn btn-primary'}">
        </div>
${instanceIdHtml}
        <div>
            <label for="pria-message" style="font-weight: bold;">Message:</label>
        </div>
        <div>
            <input type="text" id="pria-message" name="pria-message" value="${existingValues.message || ''}">
        </div>
        <div>
            <label for="pria-courseid" style="font-weight: bold;">Converation Id:</label>
        </div>
        <div>
            <input type="text" id="pria-courseid" name="pria-courseid" value="${existingValues.selectedCourse?.course_id || courseId}">
        </div>
        <div style="font-size: 11px; display: block;">
            The Conversation ID is used to associate the message with a conversation. Use -1 to always start a new conversation.
        </div>
        <div>
            <label for="pria-coursename" style="font-weight: bold;">Conversation Name:</label>
        </div>
        <div>
            <input type="text" id="pria-coursename" name="pria-coursename" value="${existingValues.selectedCourse?.course_name || ''}">
        </div>
        <div>
            <label for="pria-show" style="font-weight: bold;">Show Assistant:</label>
        </div>
        <div>
            <input type="checkbox" id="pria-show" name="pria-show" ${existingValues.showPria ? 'checked' : ''}>
        </div>
        <div>
            <button id="ok-button" class="btn btn-primary">OK</button>
            <button id="cancel-button" class="btn btn-secondary">Cancel</button>
        </div>
    </div>
</div>`;

                            //console.log(modalHtml);
                            return modalHtml;
                        }, (selectedNode, isLink, courseId) => {
                            const priaCourseId = document.getElementById("pria-courseid").value;
                            const priaCourseName = document.getElementById("pria-coursename").value;
                            const priaInstanceId = document.getElementById("pria-instance-id").value;
                            const priaMessage = document.getElementById("pria-message").value;
                            const priaShow = document.getElementById("pria-show").checked;
                            const priaButtonText = document.getElementById("pria-buttontext").value;
                            const priaButtonStyle = document.getElementById("pria-buttonstyle").value;

                            var obj = {
                                "message": priaMessage,
                                "assistantId": priaInstanceId,
                                "showPria": priaShow
                            };

                            if (priaCourseId != null && priaCourseId != "") {
                                obj.selectedCourse = {
                                    "course_id": priaCourseId,
                                    "course_name": priaCourseName
                                };
                            }

                            let data = JSON.stringify(obj);
                            let encodedData = PriaHandler.attributeEncode(data);
                            let priaButtonText2 = PriaHandler.attributeEncode(priaButtonText);

                            const linkButtonHtml = `<a href="#" title="${priaButtonText2}" data-custom="praxis:${encodedData}" class="${priaButtonStyle}">${priaButtonText}</a>`;

                            if (isLink) {
                                tinymce.activeEditor.selection.select(selectedNode);
                                tinymce.activeEditor.selection.setContent(linkButtonHtml);
                            } else {
                                tinymce.activeEditor.insertContent(linkButtonHtml);
                            }
                        });
                    })();
                });
            });
        })();
    }

    if (window.priaEnhancedCanvas.enablePageEditorButtons) {

        // quiz editor buttons
        (function () {
            PriaHandler.addOrRunMethod(() => {
                PriaHandler.waitForElement("quiz_description_statusbar", () => {

                    (async () => {
                        let assistants = [];

                        try {
                            assistants = await PriaHandler.getAssistants();
                        } catch (error) {
                            console.error("Failed to get assistants:", error);
                        }

                        PriaHandler.addPriaButton('Miscellaneous', 'DIV', (existingValues, courseId) => {

                            let modalHtml = "";
                            let instanceIdHtml = window.priaEnhancedCanvas.getAssistantHtml(assistants, existingValues);

                            modalHtml = `<div id="pria-modal" class="modal pria-edit-modal">
    <div class="pria-edit-modal-content">
        <span class="close-button">&times;</span>
        <h2>Submit Quiz to Praxis</h2>
${instanceIdHtml}
        <div>
            <label for="pria-courseid" style="font-weight: bold;">Converation Id:</label>
        </div>
        <div>
            <input type="text" id="pria-courseid" name="pria-courseid" value="${existingValues.selectedCourse?.course_id || courseId}">
        </div>
        <div style="font-size: 11px; display: block;">
            The Conversation ID is used to associate the message with a conversation. Use -1 to always start a new conversation.
        </div>
        <div>
            <label for="pria-coursename" style="font-weight: bold;">Conversation Name:</label>
        </div>
        <div>
            <input type="text" id="pria-coursename" name="pria-coursename" value="${existingValues.selectedCourse?.course_name || ''}">
        </div>
        <div>
            <button id="ok-button" class="btn btn-primary">OK</button>
            <button id="cancel-button" class="btn btn-secondary">Cancel</button>
        </div>
    </div>
</div>`;
                            return modalHtml;
                        }, (selectedNode, isLink, courseId) => {
                            const priaCourseId = document.getElementById("pria-courseid").value;
                            const priaCourseName = document.getElementById("pria-coursename").value;
                            const priaInstanceId = document.getElementById("pria-instance-id").value;

                            var obj = {
                                "assistantId": priaInstanceId
                            };

                            if (priaCourseId != null && priaCourseId != "") {
                                obj.selectedCourse = {
                                    "course_id": priaCourseId,
                                    "course_name": priaCourseName
                                };
                            }

                            let data = JSON.stringify(obj);
                            let encodedData = PriaHandler.attributeEncode(data);

                            const linkButtonHtml = `<div class="pria-display-none submit-quiz-to-pria" data-custom="praxis:${encodedData}" style="border: dotted grey 1px;">Submit Quiz Results to Praxis</div>`;

                            if (isLink) {
                                tinymce.activeEditor.selection.select(selectedNode);
                                tinymce.activeEditor.selection.setContent(linkButtonHtml);
                            } else {
                                tinymce.activeEditor.insertContent(linkButtonHtml);
                            }
                        });
                    })();
                });
            });
        })();

        // submitting quiz results to Pria
        PriaHandler.addOrRunMethod(() => {

            const elements = document.querySelectorAll('.submit-quiz-to-pria');

            if (elements && elements.length > 0) {

                const submitInfo = elements[0];
                const submitQuizButton = document.getElementById('submit_quiz_button');

                if (submitQuizButton) {

                    let trigger = false;

                    submitQuizButton.addEventListener('click', (event) => {

                        if (!trigger) {
                            trigger = true;

                            event.stopImmediatePropagation();
                            event.preventDefault();

                            var answers = PriaHandler.getAllAnswers2();
                            var message = PriaHandler.getMessageForAnswers2(answers);

                            let priaMessage = PriaHandler.getValuesFromPriaAttribute(submitInfo);
                            if (priaMessage) {
                                priaMessage.message = message;
                                priaMessage.showPria = false;
                                PriaHandler.sendMessage(priaMessage);
                            }

                            event.target.click();
                        }
                        else {
                            trigger = false;
                        }
                    });
                }
            }
        });
    }

    if (window.priaEnhancedCanvas.enableAssignmentEditorButtons) {
        // assignment editor buttons
        (function () {
            PriaHandler.addOrRunMethod(() => {
                PriaHandler.waitForElement("assignment_description_statusbar", () => {
                    (async () => {
                        let assistants = [];

                        try {
                            assistants = await PriaHandler.getAssistants();
                        } catch (error) {
                            console.error("Failed to get assistants:", error);
                        }

                        PriaHandler.addPriaButton('Miscellaneous', 'DIV', (existingValues, courseId) => {

                            let modalHtml = "";
                            let instanceIdHtml = window.priaEnhancedCanvas.getAssistantHtml(assistants, existingValues);

                            modalHtml = `<div id="pria-modal" class="modal pria-edit-modal">
    <div class="pria-edit-modal-content">
        <span class="close-button">&times;</span>
        <h2>Submit Assignment to Praxis</h2>
${instanceIdHtml}
        <div>
            <label for="pria-message" style="font-weight: bold;">Message:</label>
        </div>
        <div>
            <input type="text" id="pria-message" name="pria-message" value="${existingValues.message || ''}">
        </div>
        <div>
            <label for="pria-courseid" style="font-weight: bold;">Converation Id:</label>
        </div>
        <div>
            <input type="text" id="pria-courseid" name="pria-courseid" value="${existingValues.selectedCourse?.course_id || courseId}">
        </div>
        <div style="font-size: 11px; display: block;">
            The Conversation ID is used to associate the message with a conversation. Use -1 to always start a new conversation.
        </div>
        <div>
            <label for="pria-coursename" style="font-weight: bold;">Conversation Name:</label>
        </div>
        <div>
            <input type="text" id="pria-coursename" name="pria-coursename" value="${existingValues.selectedCourse?.course_name || ''}">
        </div>
        <div>
            <button id="ok-button" class="btn btn-primary">OK</button>
            <button id="cancel-button" class="btn btn-secondary">Cancel</button>
        </div>
    </div>
</div>`;
                            return modalHtml;
                        }, (selectedNode, isLink, courseId) => {
                            const priaCourseId = document.getElementById("pria-courseid").value;
                            const priaCourseName = document.getElementById("pria-coursename").value;
                            const priaInstanceId = document.getElementById("pria-instance-id").value;
                            const priaMessage = document.getElementById("pria-message").value;

                            var obj = {
                                "assistantId": priaInstanceId,
                                "message": priaMessage
                            };

                            if (priaCourseId != null && priaCourseId != "") {
                                obj.selectedCourse = {
                                    "course_id": priaCourseId,
                                    "course_name": priaCourseName
                                };
                            }

                            let data = JSON.stringify(obj);
                            let encodedData = PriaHandler.attributeEncode(data);

                            const linkButtonHtml = `<div class="pria-display-none submit-assignment-to-pria" data-custom="praxis:${encodedData}" style="border: dotted grey 1px;">Submit Assignment to Praxis</div>`;

                            if (isLink) {
                                tinymce.activeEditor.selection.select(selectedNode);
                                tinymce.activeEditor.selection.setContent(linkButtonHtml);
                            } else {
                                tinymce.activeEditor.insertContent(linkButtonHtml);
                            }
                        });
                    })();
                });
            });
        })();

        // submitting assignment to Pria
        PriaHandler.addOrRunMethod(() => {

            const elements = document.querySelectorAll('.submit-assignment-to-pria');

            if (elements && elements.length > 0) {

                const submitInfo = elements[0];
                const submitFileButton = document.getElementById('submit_file_button');

                if (submitFileButton) {

                    let trigger = false;

                    submitFileButton.addEventListener('click', (event) => {

                        if (!trigger) {
                            trigger = true;

                            event.stopImmediatePropagation();
                            event.preventDefault();

                            let priaMessage = PriaHandler.getValuesFromPriaAttribute(submitInfo);

                            if (priaMessage) {
                                priaMessage.showPria = false;
                                PriaHandler.sendMessage(priaMessage);
                            }

                            event.target.click();
                        }
                        else {
                            trigger = false;
                        }
                    });
                }
            }
        });
    }

    if (window.priaEnhancedCanvas.enableExplainWithAIPopup) {
        // explanation functionality
        const PriaDynamicExplanationHandler = (() => {
            let highlightBox = null;
            let assistantId = '';
            let buttonText = "Explain";

            const createHighlightBox = () => {
                highlightBox = document.createElement('div');
                highlightBox.style.position = 'absolute';
                highlightBox.style.backgroundColor = '#333';
                highlightBox.style.color = '#fff';
                highlightBox.style.border = '1px solid #444';
                highlightBox.style.padding = '5px';
                highlightBox.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
                highlightBox.style.zIndex = '1000';
                highlightBox.style.display = 'none';
                highlightBox.style.borderRadius = '5px';

                const triangle = document.createElement('div');
                triangle.style.position = 'absolute';
                triangle.style.left = '-10px';
                triangle.style.top = '10px';
                triangle.style.width = '0';
                triangle.style.height = '0';
                triangle.style.borderTop = '10px solid transparent';
                triangle.style.borderBottom = '10px solid transparent';
                triangle.style.borderRight = '10px solid #333';

                const explainButton = document.createElement('button');
                explainButton.innerText = buttonText;
                explainButton.style.backgroundColor = '#444';
                explainButton.style.color = '#fff';
                explainButton.style.border = 'none';
                explainButton.style.padding = '5px 10px';
                explainButton.style.cursor = 'pointer';
                explainButton.style.borderRadius = '3px';

                explainButton.addEventListener('click', () => {
                    let selectedText = window.getSelection().toString();
                    const range = window.getSelection().getRangeAt(0);
                    let surroundingText = getSurroundingText(range, 150);

                    selectedText = selectedText.trim();
                    surroundingText = surroundingText.trim();

                    surroundingText = surroundingText.replace(/^\W+|\W+$/g, '');

                    let priaMessage = {
                        showPria: true
                    };

                    priaMessage.assistantId = null;

                    if (assistantId != null && assistantId != "") {
                        priaMessage.assistantId = assistantId;
                    }

                    const compareSelectedText = selectedText.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                    const compareSurroundingText = surroundingText.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

                    if (compareSelectedText == compareSurroundingText) {
                        priaMessage.message = `Please explain what "${selectedText}" means. If you have access to the contents of the current page, use that for context.`;
                    }
                    else {
                        priaMessage.message = `Please explain what "${selectedText}" means in this context: "${surroundingText}". If you have access to the contents of the current page, also use that for context.`;
                    }

                    PriaHandler.sendMessage(priaMessage);

                    window.getSelection().removeAllRanges();
                    highlightBox.style.display = 'none';
                });

                highlightBox.appendChild(triangle);
                highlightBox.appendChild(explainButton);
                document.body.appendChild(highlightBox);
            };

            const showHighlightBox = (event) => {
                setTimeout(() => {
                    const selectedText = window.getSelection().toString();
                    if (selectedText && !isTextInInputField()) {
                        highlightBox.style.left = `${event.pageX + 10}px`;
                        highlightBox.style.top = `${event.pageY - 10}px`;
                        highlightBox.style.display = 'block';
                    } else {
                        highlightBox.style.display = 'none';
                    }
                }, 100);
            };

            const isTextInInputField = () => {
                const activeElement = document.activeElement;
                const selection = window.getSelection();
                if (selection.rangeCount === 0) return false;
                const range = selection.getRangeAt(0);
                const commonAncestor = range.commonAncestorContainer;

                return activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable || commonAncestor.isContentEditable);
            };

            const getSurroundingText = (range, charCount) => {
                const startContainer = range.startContainer;
                const endContainer = range.endContainer;
                const startOffset = range.startOffset;
                const endOffset = range.endOffset;

                const getTextFromNode = (node, offset, charCount, direction) => {
                    let text = '';
                    let currentNode = node;
                    let currentOffset = offset;

                    while (text.length < charCount && currentNode) {
                        if (currentNode.nodeType === Node.TEXT_NODE) {
                            let nodeText = currentNode.textContent;
                            if (direction === 'left') {
                                let start = Math.max(0, currentOffset - charCount);
                                let end = currentOffset;
                                let subText = nodeText.substring(start, end);
                                let lastSpaceIndex = subText.lastIndexOf(' ');
                                if (lastSpaceIndex !== -1 && lastSpaceIndex !== subText.length - 1) {
                                    subText = subText.substring(0, lastSpaceIndex + 1);
                                }
                                text = subText + text;
                            } else {
                                let start = currentOffset;
                                let end = Math.min(nodeText.length, currentOffset + charCount);
                                let subText = nodeText.substring(start, end);
                                let firstSpaceIndex = subText.indexOf(' ');
                                if (firstSpaceIndex !== -1 && firstSpaceIndex !== 0) {
                                    subText = subText.substring(0, firstSpaceIndex);
                                }
                                text += subText;
                            }
                        }
                        currentNode = direction === 'left' ? currentNode.previousSibling : currentNode.nextSibling;
                        currentOffset = direction === 'left' ? (currentNode ? currentNode.textContent.length : 0) : 0;
                    }

                    return text;
                };

                const startText = getTextFromNode(startContainer, startOffset, charCount, 'left');
                const endText = getTextFromNode(endContainer, endOffset, charCount, 'right');

                return startText + window.getSelection().toString() + endText;
            };

            const init = (aId, bText) => {

                if (aId != null && aId != "") {
                    assistantId = aId;
                }

                if (bText != null && bText != "") {
                    buttonText = bText;
                }

                createHighlightBox();

                document.addEventListener('mouseup', showHighlightBox);
            };

            return {
                init
            };
        })();

        PriaHandler.addOrRunMethod(() => {

            let explainText = window.priaEnhancedCanvas.explainWithAIButtonText;

            if (window.priaEnhancedCanvas.enableExplainWithAIName) {

                const pria = window['pria'];
                var aiName = pria?.priaObj?.branding?.ainame;

                if (typeof (aiName) !== "undefined" && aiName && aiName !== "") {
                    explainText = `${window.priaEnhancedCanvas.explainWithAIButtonText.trim()} ${aiName}`;
                }
            }

            PriaDynamicExplanationHandler.init("", explainText);
        });
    }
}