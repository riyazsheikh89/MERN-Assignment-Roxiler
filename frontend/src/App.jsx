import Dashboard from "./components/Dashboard"

function App() {

  return (
    <div className="main-container flex flex-col p-6">
      <div className="text-3xl font-bold text-center py-6">
        Transaction Dashboard
      </div>
      <Dashboard />
    </div>
  )
}

export default App
