import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DashboardPage from './pages/DashboardPage';
import ArraysPage from './pages/ArraysPage';
import LinkedListsPage from './pages/LinkedListsPage';
import StacksPage from './pages/StacksPage';
import QueuesPage from "./pages/QueuesPage"
import TreesPage from "./pages/TreesPage"
import GraphsPage from "./pages/GraphsPage"
import HashingPage from "./pages/HashingPage"
import StringsPage from "./pages/StringsPage"
import AlgorithmsPage from "./pages/AlgorithmsPage"

function App() {
  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/arrays" element={<ArraysPage />} />
        <Route path="/linked-lists" element={<LinkedListsPage />} />
        <Route path="/stacks" element={<StacksPage />} />
        <Route path="/queues" element={<QueuesPage />} />
        <Route path="/trees" element={<TreesPage />} />
        <Route path="/graphs" element={<GraphsPage />} />
        <Route path="/hashing" element={<HashingPage />} />
        <Route path="/strings" element={<StringsPage />} />
        <Route path="/algorithms" element={<AlgorithmsPage />} />
      </Routes>
    </div>
  );
}

export default App;