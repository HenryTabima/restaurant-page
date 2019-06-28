import './main.scss'

import Tabs from './components/Tabs'
import aboutTabData from './data/AboutTab'
import menuTabData from './data/MenuTab'
import contactTabData from './data/ContactTab'

document.addEventListener('DOMContentLoaded', () => {
  const $appContainer = document.getElementById('content')
  const $tabs = new Tabs({
    tabsData: [aboutTabData, menuTabData, contactTabData]
  })
  $appContainer.appendChild($tabs)
})
