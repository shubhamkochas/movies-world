import { useState } from 'react'
import Card from './Components/Card';


function App() {

  return (
    <>
    <div>
      <Card title="Avatar" rating={5} isCool={true} />
      <Card title="Star War" />
      <Card title="Dhurandar" />
    </div>
    </>
  )
}

export default App
