import { PolymerElement } from "@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";

import { clDefaultTemplate } from "cl-polymer-element-helpers/cl-default-template.js";
import { clDefaultStyle } from "cl-polymer-element-helpers/cl-default-style.js";

import { __decorate, query, activeElement } from "cl-polymer-element-helpers/cl-helpers.js";
import { property, computed } from "@polymer/decorators";

import "@polymer/paper-toast/paper-toast.js";
import "cl-polymer-button/cl-polymer-button.js";

import { clKeyboardAccessibilityHelper } from "cl-polymer-element-helpers/cl-keyboard-accessibility-helper.js";

import { dequeueMessage, queueMessageHelper} from "cl-polymer-element-helpers/queue-helper.js";

import "cl-polymer-element-helpers/ct-element-style.js";

const JMb = ["INPUT", "TEXTAREA"];

let clPolymerToastManagerTemplate;
let clPolymerToastManagerTemplateDefault;
let clPolymerToastManagerBase = mixinBehaviors([], PolymerElement);
class clPolymerToastManager extends clPolymerToastManagerBase {
    constructor () {
        super();
        this.listenerToken = void 0;
        this.noAutoFocus = false;
    }

    ready () {
        super.ready();
        let base = this;
        this.listenerToken = this.toastManager.listen(function( event ) {
            "ENQUEUE" === event && base.maybeUpdateActiveToast()
        })
    }
    
    connectedCallback () {
        super.connectedCallback();
        this.addEventListener("iron-overlay-closed", this.onToastClosed.bind(this));
    }

    disconnectedCallback () {
        super.disconnectedCallback();
        this.removeEventListener("iron-overlay-closed", this.onToastClosed.bind(this));
        this.listenerToken && this.toastManager.unlisten(this.listenerToken)
    }

    onToastClosed () {
        this.activeToast = void 0;
        this.maybeUpdateActiveToast()
    }

    onButtonClick ( event ) {
        this.activeToast && this.activeToast.button && (event.stopPropagation(),
        this.activeToast.button.callback(event),
        this.paperToast.close())
    }
    
    onButtonBlur () {
        this.keyboardNavigation.isEnabled() && this.paperToast.close()
    }
    
    maybeUpdateActiveToast () {
        this.activeToast || (this.activeToast = dwb(this.toastManager),
        this.noAutoFocus = JMb.includes(activeElement().tagName),
        this.activeToast && this.paperToast.open())
    }
    
    get hasButton () {
        return this.activeToast ? void 0 !== this.activeToast.button : false
    }

    get buttonLabel () {
        return this.activeToast && this.activeToast.button ? this.activeToast.button.label : void 0
    }

    get text () {
        return this.activeToast ? this.activeToast.text : void 0
    }

    get durationMillis () {
        return this.hasButton && this.keyboardNavigation.isEnabled() ? Infinity : this.activeToast && this.activeToast.durationMillis ? this.activeToast.durationMillis : 5E3
    }

    static get template() {
        if (void 0 === clPolymerToastManagerTemplate || null === clPolymerToastManagerTemplate) {
            let template = document.createElement("template");
            template.innerHTML = `
            <style>
                :host {
                    display: flex;
                    position: fixed;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    flex-direction: row;
                    justify-content: center;
                    align-items: flex-end;
                    pointer-events: none;
                    white-space: nowrap;
                    border-radius: 4px;
                    z-index: 20000;
                }

                #paper-toast {
                    position: static !important;
                    display: flex;
                    align-items: center;
                    height: 48px;
                    margin: 0;
                    padding: 14px 24px;
                    pointer-events: auto;
                }

                #paper-toast > cl-polymer-button {
                    margin-left: 40px;
                    margin-right: -8px;
                }
            </style>
            <paper-toast id="paper-toast" duration="[[durationMillis]]" no-auto-focus="[[noAutoFocus]]" restore-focus-on-close="" text="[[text]]">
                <template is="dom-if" restamp="" if="[[hasButton]]">
                    <cl-polymer-button autofocus="" label="[[buttonLabel]]" track-click="" on-focusout="onButtonBlur" on-tap="onButtonClick"></cl-polymer-button>
                </template>
            </paper-toast>  
            `;
            template.content.insertBefore(clDefaultStyle().content.cloneNode(true), template.content.firstChild);
            let templateContent = template.content;
            let templateInsertBefore = templateContent.insertBefore;
            let defaultTemp;
            if (void 0 === clPolymerToastManagerTemplateDefault || null === clPolymerToastManagerTemplateDefault) {
                defaultTemp = clDefaultTemplate();
                clPolymerToastManagerTemplateDefault = defaultTemp
            }
            defaultTemp = clPolymerToastManagerTemplateDefault;
            templateInsertBefore.call(templateContent, defaultTemp.content.cloneNode(true), template.content.firstChild);

            return clPolymerToastManagerTemplate = template;
        }

        return clPolymerToastManagerTemplate;
    }
}

__decorate(
    [
        property({ type: Object }),
        query("paper-toast")
    ], 
    clPolymerToastManager.prototype, 
    "paperToast", 
    void 0
);

__decorate(
    [
        property({ type: Object })
    ], 
    clPolymerToastManager.prototype, 
    "activeToast", 
    void 0
);

__decorate(
    [
        property({ type: Boolean }),
        computed("activeToast")
    ], 
    clPolymerToastManager.prototype, 
    "hasButton", 
    null
);

__decorate(
    [
        property({ type: String }),
        computed("activeToast")
    ], 
    clPolymerToastManager.prototype, 
    "buttonLabel", 
    null
);

__decorate(
    [
        property({ type: String }),
        computed("activeToast")
    ], 
    clPolymerToastManager.prototype, 
    "text", 
    null
);

__decorate(
    [
        property({ type: Number }),
        computed("activeToast", "hasButton")
    ], 
    clPolymerToastManager.prototype, 
    "durationMillis", 
    null
);

__decorate(
    [
        property({ type: clKeyboardAccessibilityHelper })
    ], 
    clPolymerToastManager.prototype, 
    "keyboardNavigation", 
    void 0
);

__decorate(
    [
        property({ type: queueMessageHelper })
    ], 
    clPolymerToastManager.prototype, 
    "toastManager", 
    void 0
);

window.customElements.define("cl-polymer-toast-manager", clPolymerToastManager);
