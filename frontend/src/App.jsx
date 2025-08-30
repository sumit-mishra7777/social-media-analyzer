import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Sparkles, Brain, TrendingUp, Copy, Check } from 'lucide-react';

function App() {
  const [extractedText, setExtractedText] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState('');

  const handleCopy = (textToCopy, type) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000); // Reset after 2 seconds
  };

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setExtractedText('');
    setSuggestions('');
    setError('');
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setExtractedText(response.data.text);
      setSuggestions(response.data.suggestions);
    } catch (err) {
      const errorMessage = err.response ? err.response.data.error : 'Network Error or Server is down.';
      setError(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg', '.jpeg'] }
  });

  return (
    <div className="min-h-screen flex flex-col justify-between p-4">
      <main className="flex-grow flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-5xl border border-white/30"
        >
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Social Content Analyzer</h1>
            <p className="text-purple-200 mt-3 text-lg">Unleash your content's potential with AI-powered suggestions.</p>
          </header>

          <motion.div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${isDragActive ? 'border-purple-400 bg-purple-500/20' : 'border-white/40 hover:border-white/80 hover:bg-white/10'}`}
            whileHover={{ scale: 1.02 }}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto text-5xl text-white/90" />
            <p className="mt-4 text-lg text-white font-semibold">Drag & drop your file, or click to select</p>
            <p className="text-purple-200 text-sm mt-1">PDF or Image files supported</p>
          </motion.div>
          
          <AnimatePresence>
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center mt-6">
                <p className="text-lg text-white animate-pulse">Analyzing... please wait</p>
              </motion.div>
            )}
            {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center bg-red-500/80 text-white p-3 rounded-lg mt-6 font-bold text-lg">{error}</motion.p>}
          </AnimatePresence>

          <AnimatePresence>
            {extractedText && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-10 grid md:grid-cols-2 gap-8"
              >
                <div className="bg-white/20 p-6 rounded-xl border border-white/30 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white flex items-center"><FileText className="mr-3" /> Extracted Content</h2>
                    <button onClick={() => handleCopy(extractedText, 'text')} className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                      {copied === 'text' ? <Check className="text-green-400" /> : <Copy className="text-white" />}
                    </button>
                  </div>
                  <p className="flex-grow text-purple-100 whitespace-pre-wrap text-base leading-relaxed">{extractedText}</p>
                </div>
                <div className="bg-white/20 p-6 rounded-xl border border-white/30 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white flex items-center"><Sparkles className="mr-3 text-yellow-300" /> AI Suggestions</h2>
                    <button onClick={() => handleCopy(suggestions, 'suggestions')} className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                       {copied === 'suggestions' ? <Check className="text-green-400" /> : <Copy className="text-white" />}
                    </button>
                  </div>
                  <p className="flex-grow text-purple-100 whitespace-pre-wrap text-base leading-relaxed">{suggestions}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!extractedText && !isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.4 }}}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-16 text-center">
                <h3 className="text-2xl font-semibold text-white mb-8">Simple Steps to Better Content</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/10 p-6 rounded-xl border border-white/20 text-white">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-white/20 mx-auto mb-4">
                      <Upload className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">1. Upload Content</h4>
                    <p className="text-sm text-purple-200">Provide your content in PDF or image format.</p>
                  </div>
                  <div className="bg-white/10 p-6 rounded-xl border border-white/20 text-white">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-white/20 mx-auto mb-4">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">2. AI Analysis</h4>
                    <p className="text-sm text-purple-200">Our smart AI analyzes the text for engagement.</p>
                  </div>
                  <div className="bg-white/10 p-6 rounded-xl border border-white/20 text-white">
                     <div className="flex items-center justify-center h-12 w-12 rounded-full bg-white/20 mx-auto mb-4">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">3. Get Suggestions</h4>
                    <p className="text-sm text-purple-200">Receive actionable tips to boost your post's performance.</p>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-16 text-center bg-white/20 p-8 rounded-2xl border border-white/30">
                 <h3 className="text-2xl font-bold text-white mb-4">Ready to Elevate Your Content?</h3>
                 <p className="text-purple-200 mb-6">Start by uploading your file above and let our AI do the heavy lifting.</p>
                 <button className="bg-white text-purple-700 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-purple-100 transition-all duration-300">
                   <Upload className="inline-block mr-2" />
                   Get Started Now
                 </button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </main>
      
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="text-center p-4 text-purple-200/80 text-sm"
      >
        <p>Built by Sumit Mishra.</p>
      </motion.footer>
    </div>
  );
}

export default App;
