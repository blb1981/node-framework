import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './styles.scss'

import Hello from './components/Hello'

const el = document.getElementById('hello')
const footer = document.querySelector('footer')

if (el) {
  createRoot(el).render(<Hello name={'Brandon'} />)
}

if (footer) {
  createRoot(footer).render(<div>heyyyyy, this is a react component</div>)
}

console.log('hello!!!!!!')
