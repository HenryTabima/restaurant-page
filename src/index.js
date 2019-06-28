import './main.scss'

import Tabs from './components/Tabs'

document.addEventListener('DOMContentLoaded', () => {
  const $appContainer = document.getElementById('content')
  const $tabs = new Tabs({
    innerHTML: `
      <button slot="title" selected>About</button>
      <button slot="title">Menu</button>
      <button slot="title">Contact</button>
      <section slot="content">Welcome to the restaurant</section>
      <section slot="content">The best ingredients for you</section>
      <section slot="content">Keep in touch with us!</section>
    `
  })
  $appContainer.appendChild($tabs)
})
