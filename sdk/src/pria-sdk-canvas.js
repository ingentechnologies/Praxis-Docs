/* Enhanced Pria SDK with Canvas Tools - Version 1.4 - 20250812 */

// Auto-load CSS - check for local file first, fallback to CDN
(function loadPriaCSS() {
  // Check if CSS is already loaded
  if (
    document.querySelector('link[href*="pria-sdk-canvas-tools.css"]') ||
    document.querySelector('style[data-pria-css]')
  ) {
    return;
  }

  const cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';
  cssLink.type = 'text/css';

  // Try local CSS first
  const localCSSPath = './pria-sdk-canvas-tools.css';
  cssLink.href = localCSSPath;

  // Fallback to CDN if local file fails to load
  cssLink.onerror = function () {
    console.log('Local Pria CSS not found, loading from CDN...');
    cssLink.href = 'https://cdn.praxis.ai/sdk/pria-sdk-canvas-tools.css';
    cssLink.onerror = function () {
      console.warn(
        'Failed to load Pria CSS from CDN, injecting inline styles...'
      );
      injectInlineCSS();
    };
  };

  document.head.appendChild(cssLink);

  function injectInlineCSS() {
    const style = document.createElement('style');
    style.setAttribute('data-pria-css', 'true');
    style.textContent = `
/* Enhanced CSS for Canvas Theme - Pria version 1.3 - 20250507 */
.pria-display-none {
    display: none;
}

.pria-edit-modal {
    display: none;
    position: fixed;
    z-index: 99999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
}

.pria-edit-modal-content {
    z-index: 999999;
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 500px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
}

.pria-edit-modal-content .close-button {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.pria-edit-modal-content div {
    display: inline;
}

.pria-edit-modal-content div:last-of-type {
    display: block;
    margin-top: 20px;
}

.pria-edit-modal-content input:not([type=checkbox]) {
    width: 95%;
    padding: 8px 10px;
    height: auto;
}

.pria-edit-modal-content input[type=checkbox] {
    margin-top: 0;
}
        `;
    document.head.appendChild(style);
  }
})();

// Initialize Pria Enhanced Canvas
window.priaEnhancedCanvas = window.priaEnhancedCanvas || {};
window.priaEnhancedCanvas.pageIsPreview = location.href.match(/preview=/);

// Configuration flags
window.priaEnhancedCanvas.enablePriaButtons = true; // Enable buttons activations on pages
window.priaEnhancedCanvas.enablePageEditorButtons = true; // Enable buttons in the Canvas page editor
window.priaEnhancedCanvas.enableQuizEditorButtons = true; // Enable buttons in the Canvas quiz editor
window.priaEnhancedCanvas.enableAssignmentEditorButtons = true; // Enable buttons in the Canvas assignment editor
window.priaEnhancedCanvas.enableExplainWithAIPopup = true; // Enable the Explain with AI popup
window.priaEnhancedCanvas.enableExplainWithAIName = true; // If true, the explain pop up with explain with the AI's name
window.priaEnhancedCanvas.explainWithAIButtonText = 'Explain with'; // Text for the Explain with AI button

// Core Pria SDK functionality
const PriaSDK = (() => {
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
        console.log('Pria is ready.');
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
      '=': '&#x3D;',
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
      '&#x3D;': '=',
    };
    return text.replace(
      /(&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;|&#x60;|&#x3D;)/g,
      function (entity) {
        return map[entity];
      }
    );
  };

  const runMethods = () => {
    methodsToRun.forEach((method) => method());
    methodsToRun.length = 0;
  };

  const bindButtonEvents = (selector, event, handler) => {
    const buttons = document.querySelectorAll(selector);
    buttons.forEach((button) => {
      button.addEventListener(event, handler);
    });
  };

  const sendMessage = (messageObj) => {
    let message;

    if (typeof messageObj.message === 'function') {
      message = messageObj.message();
    } else {
      message = messageObj.message;
    }

    const request = {
      command: 'post',
      inputs: [message],
    };

    if (
      typeof messageObj.assistantId !== 'undefined' &&
      messageObj.assistantId != null &&
      messageObj.assistantId != ''
    ) {
      request.assistantId = messageObj.assistantId;
    }

    if (
      typeof messageObj.selectedCourse !== 'undefined' &&
      messageObj.selectedCourse != null
    ) {
      request.selectedCourse = messageObj.selectedCourse;
    }

    const pria = window['pria'];

    if (pria) {
      pria.send(request);
      if (messageObj.showPria) {
        document.getElementById('pria_button').click();
      }
    } else {
      console.log('Warning, can not send message! Pria not loaded');
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
    const iframe = document.getElementById(`${dataId}_ifr`);
    if (!iframe) {
      console.log(`parent Iframe "${dataId}_ifr" not found `);
      return;
    }
    const iframeDocument =
      iframe.contentDocument || iframe.contentWindow.document;

    const elements = iframeDocument.querySelectorAll(`[data-id="${dataId}"]`);

    if (elements.length === 0) {
      console.log(`No elements found with data-id "${dataId}"`);
      return null;
    }

    if (elements.length === 1) {
      return elements[0].innerHTML;
    } else {
      console.log('Warning, found multiple ements of the same data-id');
      return elements[0].innerHTML;
    }
  };

  const getAllAnswers = (limit) => {
    let userSubmissions = [];
    for (let i = 0; i < limit; i++) {
      userSubmissions.push({
        questionIndex: i + 1,
        answer: getElementByDataId(`question_input_${i}`),
      });
    }
    return userSubmissions;
  };

  const getMessageForAnswers = () => {
    const answers = getAllAnswers();
    console.log('Answers:', answers);
    const ret = `Save my answers to user memory <details><summary>Answers</summary><code>${JSON.stringify(
      answers
    )}</code></details> to personalize my experience.`;
    return ret;
  };

  const getMessageForAnswers2 = (answers) => {
    const ret = `Save my answers to user memory <details><summary>Answers</summary><code>${JSON.stringify(
      answers
    )}</code></details> to personalize my experience.`;
    return ret;
  };

  const getAllAnswers2 = () => {
    const iframes = document.querySelectorAll('iframe[id^="question_input_"]');

    let userSubmissions = [];

    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i];

      const iframeDocument =
        iframe.contentDocument || iframe.contentWindow.document;

      const elements = iframeDocument.querySelectorAll('[data-id]');

      elements.forEach((element) => {
        const dataId = element.getAttribute('data-id');

        if (dataId === `question_input_${i}`) {
          userSubmissions.push({
            questionIndex: i + 1,
            answer: element.innerHTML,
          });
        }
      });
    }

    return userSubmissions;
  };

  const createAndShowModal = (modalHtml, onOkClick) => {
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.getElementById('pria-modal');
    const closeButton = document.querySelector('.close-button');
    const okButton = document.getElementById('ok-button');
    const cancelButton = document.getElementById('cancel-button');

    modal.style.display = 'block';

    const closeModal = () => {
      modal.style.display = 'none';
      modal.remove();
    };

    closeButton.addEventListener('click', closeModal);
    cancelButton.addEventListener('click', closeModal);
    okButton.addEventListener('click', () => {
      onOkClick();
      closeModal();
    });

    window.addEventListener('click', (event) => {
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
      } else if (dataParts[0] === 'praxis') {
        const decodedData = dataParts[1];
        existingValues = JSON.parse(decodedData);
        existingValues.className = selectedNode.className;
        existingValues.textContent = selectedNode.textContent;
      }
    }
    return existingValues;
  };

  const addPriaButton = (
    toolbarTitle,
    isLinkNodeName,
    getModalHtml,
    onOkClick
  ) => {
    if (typeof tinymce !== 'undefined') {
      if (document.getElementById('pria-insert-button')) {
        return;
      }

      const rce = document.getElementsByClassName('tox-tinymce')[0];
      const toolbarGroups = rce.getElementsByClassName('tox-toolbar__group');
      let toolbar;
      for (let i = 0; i < toolbarGroups.length; i++) {
        if (toolbarGroups[i].getAttribute('title') === toolbarTitle) {
          toolbar = toolbarGroups[i];
          break;
        }
      }

      if (toolbar) {
        const buttonHtml = priaButtonHtml;
        const button = document
          .createRange()
          .createContextualFragment(buttonHtml);
        toolbar.appendChild(button);

        document
          .getElementById('pria-insert-button')
          .addEventListener('click', function () {
            const courseId =
              window.location.pathname.match(/\/courses\/(\d+)/)[1];
            const selectedNode = tinymce.activeEditor.selection.getNode();
            let existingValues = {};
            let isLink = false;

            if (
              selectedNode.nodeName === isLinkNodeName &&
              selectedNode.hasAttribute('data-custom')
            ) {
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
          if (
            response?.response &&
            response.type === 'pria-response' &&
            response.response.command === 'assistants.list' &&
            response.response.isError === false
          ) {
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
          command: 'assistants.list',
        };

        try {
          pria.send(request);
        } catch (error) {
          pria.unsubscribe(priaAssistantResponse);
          console.error('Error sending request to Pria:', error);
          reject(error);
        }
      });
    } else {
      console.warn('Pria is not available.');
      return Promise.reject('Pria is not available.');
    }
  };

  // Initialize when page loads
  window.addEventListener('load', (event) => {
    waitForElement('pria_frame', () => {
      const pria_frame = document.getElementById('pria_frame');
      pria_frame.addEventListener('load', () => {
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
    getValuesFromPriaAttribute,
  };
})();

// Conditional alias for backward compatibility - only if PriaHandler doesn't exist
if (
  typeof window.PriaHandler === 'undefined' &&
  typeof PriaHandler === 'undefined'
) {
  const PriaHandler = PriaSDK;
  // Also expose it globally if needed
  window.PriaHandler = PriaSDK;
} else {
  console.warn(
    'PriaHandler already exists, skipping alias creation. Using PriaSDK instead.'
  );
}

// Helper function for generating assistant HTML
window.priaEnhancedCanvas.getAssistantHtml = (assistants, existingValues) => {
  let instanceIdHtml = '';

  if (assistants.length > 0) {
    // generate select html for modal
    let selectHtml = '';
    assistants.forEach((assistant) => {
      if (
        existingValues.assistantId &&
        existingValues.assistantId === assistant._id
      ) {
        selectHtml += `<option value="${assistant._id}" selected>${assistant.name}</option>`;
      } else
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
  } else {
    instanceIdHtml = `<div>
    <label for="pria-instance-id" style="font-weight: bold;">Assistant Id:</label>
</div>
<div>
    <input type="text" id="pria-instance-id" name="pria-instance-id" value="${
      existingValues.assistantId || ''
    }">
</div>`;
  }

  return instanceIdHtml;
};

// Canvas Tools Integration (only if not in preview mode)
if (!window.priaEnhancedCanvas.pageIsPreview) {
  if (window.priaEnhancedCanvas.enablePriaButtons) {
    // This method attaches Pria functionality to on-page button elements.
    PriaSDK.addOrRunMethod(() => {
      PriaSDK.bindButtonEvents('[data-custom^="praxis:"]', 'click', (event) => {
        const button = event.target;
        const priaMessage = PriaSDK.getValuesFromPriaAttribute(button);
        PriaSDK.sendMessage(priaMessage);
      });
      PriaSDK.bindButtonEvents('[data-custom^="pria:"]', 'click', (event) => {
        const button = event.target;
        const priaMessage = PriaSDK.getValuesFromPriaAttribute(button);
        PriaSDK.sendMessage(priaMessage);
      });
    });
  }

  if (window.priaEnhancedCanvas.enablePageEditorButtons) {
    // Attach the Pria button to the page editor.
    (function () {
      PriaSDK.addOrRunMethod(() => {
        PriaSDK.waitForElement('wiki_page_body_ifr', () => {
          (async () => {
            let assistants = [];

            try {
              assistants = await PriaSDK.getAssistants();
            } catch (error) {
              console.error('Failed to get assistants:', error);
            }

            PriaSDK.addPriaButton(
              'Miscellaneous',
              'A',
              (existingValues, courseId) => {
                let modalHtml = '';
                let instanceIdHtml = window.priaEnhancedCanvas.getAssistantHtml(
                  assistants,
                  existingValues
                );

                modalHtml = `<div id="pria-modal" class="modal pria-edit-modal">
    <div class="pria-edit-modal-content">
        <span class="close-button">&times;</span>
        <h2>Assistant Helper Button</h2>
        <div>
            <label for="pria-buttontext" style="font-weight: bold;">Button Text:</label>
        </div>
        <div>
            <input type="text" id="pria-buttontext" name="pria-buttontext" value="${
              existingValues.textContent || ''
            }">
        </div>
        <div>
            <label for="pria-buttonstyle" style="font-weight: bold;">Button Style:</label>
        </div>
        <div>
            <input type="text" id="pria-buttonstyle" name="pria-buttonstyle" value="${
              existingValues.className || 'btn btn-primary'
            }">
        </div>
${instanceIdHtml}
        <div>
            <label for="pria-message" style="font-weight: bold;">Message:</label>
        </div>
        <div>
            <input type="text" id="pria-message" name="pria-message" value="${
              existingValues.message || ''
            }">
        </div>
        <div>
            <label for="pria-courseid" style="font-weight: bold;">Converation Id:</label>
        </div>
        <div>
            <input type="text" id="pria-courseid" name="pria-courseid" value="${
              existingValues.selectedCourse?.course_id || courseId
            }">
        </div>
        <div style="font-size: 11px; display: block;">
            The Conversation ID is used to associate the message with a conversation. Use -1 to always start a new conversation.
        </div>
        <div>
            <label for="pria-coursename" style="font-weight: bold;">Conversation Name:</label>
        </div>
        <div>
            <input type="text" id="pria-coursename" name="pria-coursename" value="${
              existingValues.selectedCourse?.course_name || ''
            }">
        </div>
        <div>
            <label for="pria-show" style="font-weight: bold;">Show Assistant:</label>
        </div>
        <div>
            <input type="checkbox" id="pria-show" name="pria-show" ${
              existingValues.showPria ? 'checked' : ''
            }>
        </div>
        <div>
            <button id="ok-button" class="btn btn-primary">OK</button>
            <button id="cancel-button" class="btn btn-secondary">Cancel</button>
        </div>
    </div>
</div>`;

                return modalHtml;
              },
              (selectedNode, isLink, courseId) => {
                const priaCourseId =
                  document.getElementById('pria-courseid').value;
                const priaCourseName =
                  document.getElementById('pria-coursename').value;
                const priaInstanceId =
                  document.getElementById('pria-instance-id').value;
                const priaMessage =
                  document.getElementById('pria-message').value;
                const priaShow = document.getElementById('pria-show').checked;
                const priaButtonText =
                  document.getElementById('pria-buttontext').value;
                const priaButtonStyle =
                  document.getElementById('pria-buttonstyle').value;

                var obj = {
                  message: priaMessage,
                  assistantId: priaInstanceId,
                  showPria: priaShow,
                };

                if (priaCourseId != null && priaCourseId != '') {
                  obj.selectedCourse = {
                    course_id: priaCourseId,
                    course_name: priaCourseName,
                  };
                }

                let data = JSON.stringify(obj);
                let encodedData = PriaSDK.attributeEncode(data);
                let priaButtonText2 = PriaSDK.attributeEncode(priaButtonText);

                const linkButtonHtml = `<a href="#" title="${priaButtonText2}" data-custom="praxis:${encodedData}" class="${priaButtonStyle}">${priaButtonText}</a>`;

                if (isLink) {
                  tinymce.activeEditor.selection.select(selectedNode);
                  tinymce.activeEditor.selection.setContent(linkButtonHtml);
                } else {
                  tinymce.activeEditor.insertContent(linkButtonHtml);
                }
              }
            );
          })();
        });
      });
    })();
  }

  if (window.priaEnhancedCanvas.enableQuizEditorButtons) {
    // quiz editor buttons
    (function () {
      PriaSDK.addOrRunMethod(() => {
        PriaSDK.waitForElement('quiz_description_statusbar', () => {
          (async () => {
            let assistants = [];

            try {
              assistants = await PriaSDK.getAssistants();
            } catch (error) {
              console.error('Failed to get assistants:', error);
            }

            PriaSDK.addPriaButton(
              'Miscellaneous',
              'DIV',
              (existingValues, courseId) => {
                let modalHtml = '';
                let instanceIdHtml = window.priaEnhancedCanvas.getAssistantHtml(
                  assistants,
                  existingValues
                );

                modalHtml = `<div id="pria-modal" class="modal pria-edit-modal">
    <div class="pria-edit-modal-content">
        <span class="close-button">&times;</span>
        <h2>Submit Quiz to Praxis</h2>
${instanceIdHtml}
        <div>
            <label for="pria-courseid" style="font-weight: bold;">Converation Id:</label>
        </div>
        <div>
            <input type="text" id="pria-courseid" name="pria-courseid" value="${
              existingValues.selectedCourse?.course_id || courseId
            }">
        </div>
        <div style="font-size: 11px; display: block;">
            The Conversation ID is used to associate the message with a conversation. Use -1 to always start a new conversation.
        </div>
        <div>
            <label for="pria-coursename" style="font-weight: bold;">Conversation Name:</label>
        </div>
        <div>
            <input type="text" id="pria-coursename" name="pria-coursename" value="${
              existingValues.selectedCourse?.course_name || ''
            }">
        </div>
        <div>
            <button id="ok-button" class="btn btn-primary">OK</button>
            <button id="cancel-button" class="btn btn-secondary">Cancel</button>
        </div>
    </div>
</div>`;
                return modalHtml;
              },
              (selectedNode, isLink, courseId) => {
                const priaCourseId =
                  document.getElementById('pria-courseid').value;
                const priaCourseName =
                  document.getElementById('pria-coursename').value;
                const priaInstanceId =
                  document.getElementById('pria-instance-id').value;

                var obj = {
                  assistantId: priaInstanceId,
                };

                if (priaCourseId != null && priaCourseId != '') {
                  obj.selectedCourse = {
                    course_id: priaCourseId,
                    course_name: priaCourseName,
                  };
                }

                let data = JSON.stringify(obj);
                let encodedData = PriaSDK.attributeEncode(data);

                const linkButtonHtml = `<div class="pria-display-none submit-quiz-to-pria" data-custom="praxis:${encodedData}" style="border: dotted grey 1px;">Submit Quiz Results to Praxis</div>`;

                if (isLink) {
                  tinymce.activeEditor.selection.select(selectedNode);
                  tinymce.activeEditor.selection.setContent(linkButtonHtml);
                } else {
                  tinymce.activeEditor.insertContent(linkButtonHtml);
                }
              }
            );
          })();
        });
      });
    })();

    // submitting quiz results to Pria
    PriaSDK.addOrRunMethod(() => {
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

              var answers = PriaSDK.getAllAnswers2();
              var message = PriaSDK.getMessageForAnswers2(answers);

              let priaMessage = PriaSDK.getValuesFromPriaAttribute(submitInfo);
              if (priaMessage) {
                priaMessage.message = message;
                priaMessage.showPria = false;
                PriaSDK.sendMessage(priaMessage);
              }

              event.target.click();
            } else {
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
      PriaSDK.addOrRunMethod(() => {
        PriaSDK.waitForElement('assignment_description_statusbar', () => {
          (async () => {
            let assistants = [];

            try {
              assistants = await PriaSDK.getAssistants();
            } catch (error) {
              console.error('Failed to get assistants:', error);
            }

            PriaSDK.addPriaButton(
              'Miscellaneous',
              'DIV',
              (existingValues, courseId) => {
                let modalHtml = '';
                let instanceIdHtml = window.priaEnhancedCanvas.getAssistantHtml(
                  assistants,
                  existingValues
                );

                modalHtml = `<div id="pria-modal" class="modal pria-edit-modal">
    <div class="pria-edit-modal-content">
        <span class="close-button">&times;</span>
        <h2>Submit Assignment to Praxis</h2>
${instanceIdHtml}
        <div>
            <label for="pria-message" style="font-weight: bold;">Message:</label>
        </div>
        <div>
            <input type="text" id="pria-message" name="pria-message" value="${
              existingValues.message || ''
            }">
        </div>
        <div>
            <label for="pria-courseid" style="font-weight: bold;">Converation Id:</label>
        </div>
        <div>
            <input type="text" id="pria-courseid" name="pria-courseid" value="${
              existingValues.selectedCourse?.course_id || courseId
            }">
        </div>
        <div style="font-size: 11px; display: block;">
            The Conversation ID is used to associate the message with a conversation. Use -1 to always start a new conversation.
        </div>
        <div>
            <label for="pria-coursename" style="font-weight: bold;">Conversation Name:</label>
        </div>
        <div>
            <input type="text" id="pria-coursename" name="pria-coursename" value="${
              existingValues.selectedCourse?.course_name || ''
            }">
        </div>
        <div>
            <button id="ok-button" class="btn btn-primary">OK</button>
            <button id="cancel-button" class="btn btn-secondary">Cancel</button>
        </div>
    </div>
</div>`;
                return modalHtml;
              },
              (selectedNode, isLink, courseId) => {
                const priaCourseId =
                  document.getElementById('pria-courseid').value;
                const priaCourseName =
                  document.getElementById('pria-coursename').value;
                const priaInstanceId =
                  document.getElementById('pria-instance-id').value;
                const priaMessage =
                  document.getElementById('pria-message').value;

                var obj = {
                  assistantId: priaInstanceId,
                  message: priaMessage,
                };

                if (priaCourseId != null && priaCourseId != '') {
                  obj.selectedCourse = {
                    course_id: priaCourseId,
                    course_name: priaCourseName,
                  };
                }

                let data = JSON.stringify(obj);
                let encodedData = PriaSDK.attributeEncode(data);

                const linkButtonHtml = `<div class="pria-display-none submit-assignment-to-pria" data-custom="praxis:${encodedData}" style="border: dotted grey 1px;">Submit Assignment to Praxis</div>`;

                if (isLink) {
                  tinymce.activeEditor.selection.select(selectedNode);
                  tinymce.activeEditor.selection.setContent(linkButtonHtml);
                } else {
                  tinymce.activeEditor.insertContent(linkButtonHtml);
                }
              }
            );
          })();
        });
      });
    })();

    // submitting assignment to Pria
    PriaSDK.addOrRunMethod(() => {
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

              let priaMessage = PriaSDK.getValuesFromPriaAttribute(submitInfo);

              if (priaMessage) {
                priaMessage.showPria = false;
                PriaSDK.sendMessage(priaMessage);
              }

              event.target.click();
            } else {
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
      let buttonText = 'Explain';

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
            showPria: true,
          };

          priaMessage.assistantId = null;

          if (assistantId != null && assistantId != '') {
            priaMessage.assistantId = assistantId;
          }

          const compareSelectedText = selectedText
            .replace(/[^a-zA-Z0-9]/g, '')
            .toLowerCase();
          const compareSurroundingText = surroundingText
            .replace(/[^a-zA-Z0-9]/g, '')
            .toLowerCase();

          if (compareSelectedText == compareSurroundingText) {
            priaMessage.message = `Please explain what "${selectedText}" means. If you have access to the contents of the current page, use that for context.`;
          } else {
            priaMessage.message = `Please explain what "${selectedText}" means in this context: "${surroundingText}". If you have access to the contents of the current page, also use that for context.`;
          }

          PriaSDK.sendMessage(priaMessage);

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

        return (
          activeElement &&
          (activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.isContentEditable ||
            commonAncestor.isContentEditable)
        );
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
                if (
                  lastSpaceIndex !== -1 &&
                  lastSpaceIndex !== subText.length - 1
                ) {
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
            currentNode =
              direction === 'left'
                ? currentNode.previousSibling
                : currentNode.nextSibling;
            currentOffset =
              direction === 'left'
                ? currentNode
                  ? currentNode.textContent.length
                  : 0
                : 0;
          }

          return text;
        };

        const startText = getTextFromNode(
          startContainer,
          startOffset,
          charCount,
          'left'
        );
        const endText = getTextFromNode(
          endContainer,
          endOffset,
          charCount,
          'right'
        );

        return startText + window.getSelection().toString() + endText;
      };

      const init = (aId, bText) => {
        if (aId != null && aId != '') {
          assistantId = aId;
        }

        if (bText != null && bText != '') {
          buttonText = bText;
        }

        createHighlightBox();

        document.addEventListener('mouseup', showHighlightBox);
      };

      return {
        init,
      };
    })();

    PriaSDK.addOrRunMethod(() => {
      let explainText = window.priaEnhancedCanvas.explainWithAIButtonText;

      if (window.priaEnhancedCanvas.enableExplainWithAIName) {
        const pria = window['pria'];
        var aiName = pria?.priaObj?.branding?.ainame;

        if (typeof aiName !== 'undefined' && aiName && aiName !== '') {
          explainText = `${window.priaEnhancedCanvas.explainWithAIButtonText.trim()} ${aiName}`;
        }
      }

      PriaDynamicExplanationHandler.init('', explainText);
    });
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PriaSDK;
}

// Also expose PriaSDK globally for direct access
window.PriaSDK = PriaSDK;
