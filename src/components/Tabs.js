'use strict'

let selected_ = null

class Tabs extends HTMLElement {
  constructor ({ innerHTML }) {
    super()
    this.innerHTML = innerHTML
    let shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.innerHTML = `
    <style>
      :host {
        display: inline-block;
        width: 650px;
        font-family: sans-serif;
        background-color: rgba(255, 255, 255, 0.2);
        contain: content;
      }
      #panels {
        box-shadow: 0 2px 2px rgba(0, 0, 0, .3);
        background: rgba(255, 255, 255, 0.8);
        padding: 16px;
        height: 250px;
        overflow: auto;
      }
      #tabs {
        display: inline-flex;
        -webkit-user-select: none;
        user-select: none;
      }
      #tabs slot {
        display: inline-flex;
      }
      #tabs ::slotted(*) {
        outline: none;
        font: 400 16px/22px sans-serif;
        padding: 16px 8px;
        margin: 0;
        text-align: center;
        width: 100px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        cursor: pointer;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        background: rgba(255, 255, 255, 0.5);
        border: none; /* if the user users a <button> */
      }
      #tabs ::slotted([aria-selected="true"]) {
        font-weight: 600;
        background: rgba(255, 255, 255, 0.8);
        box-shadow: none;
      }
      #tabs ::slotted(:focus) {
        z-index: 1; /* make sure focus ring doesn't get buried */
      }
      #panels ::slotted([aria-hidden="true"]) {
        display: none;
      }
    </style>
    <div id="tabs">
      <slot id="tabsSlot" name="title"></slot>
    </div>
    <div id="panels">
      <slot id="panelsSlot" name="content"></slot>
    </div>
    `
  }

  get selected () {
    return selected_
  }

  set selected (idx) {
    selected_ = idx
    this._selectTab(idx)
    this.setAttribute('selected', idx)
  }

  connectedCallback () {
    this.setAttribute('role', 'tablist')

    const tabsSlot = this.shadowRoot.querySelector('#tabsSlot')
    const panelsSlot = this.shadowRoot.querySelector('#panelsSlot')

    this.tabs = tabsSlot.assignedNodes({ flatten: true })
    this.panels = panelsSlot.assignedNodes({ flatten: true }).filter(el => {
      return el.nodeType === Node.ELEMENT_NODE
    })

    for (let [i, panel] of this.panels.entries()) {
      panel.setAttribute('role', 'tabpanel')
      panel.setAttribute('tabindex', 0)
    }

    this._boundOnTitleClick = this._onTitleClick.bind(this)
    this._boundOnKeyDown = this._onKeyDown.bind(this)

    tabsSlot.addEventListener('click', this._boundOnTitleClick)
    tabsSlot.addEventListener('keydown', this._boundOnKeyDown)

    this.selected = this._findFirstSelectedTab() || 0
  }

  disconnectCallback () {
    const tabsSlot = this.shadowRoot.querySelector('#tabsSlot')
    tabsSlot.removeEventListener('click', this._boundOnTitleClick)
    tabsSlot.removeEventListener('keydown', this._boundOnKeyDown)
  }

  _onTitleClick (e) {
    if (e.target.slot === 'title') {
      this.selected = this.tabs.indexOf(e.target)
      e.target.focus()
    }
  }

  _onKeyDown (e) {
    let idx
    switch (e.code) {
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault()
        idx = this.selected - 1
        idx = idx < 0 ? this.tabs.length - 1 : idx
        this.tab[idx].click()
        break
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        idx = this.selected + 1
        this.tabs[idx % this.tabs.length].click()
        break
      default:
        break
    }
  }

  _findFirstSelectedTab () {
    let selectedIdx
    for (let [i, tab] of this.tabs.entries()) {
      tab.setAttribute('role', 'tab')
      if (tab.hasAttribute('selected')) {
        selectedIdx = i
      }
    }
    return selectedIdx
  }

  _selectTab (idx = null) {
    this.tabs.forEach((tab, i) => {
      let select = i === idx
      tab.setAttribute('tabindex', select ? 0 : -1)
      tab.setAttribute('aria-selected', select)
      this.panels[i].setAttribute('aria-hidden', !select)
    })
  }
}

customElements.define('app-tabs', Tabs)

export default Tabs
