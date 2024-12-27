import './App.css';
import TaskLists from './components/taskLists';
function App() {
  return (
    <div className="App">
       <h1 className='flex justify-center items-center text-2xl
       font-bold tracking-wider text-indigo-800 mt-40'>
       Management Tasks
      </h1>
      <TaskLists />
    </div>
  );
}

export default App;
