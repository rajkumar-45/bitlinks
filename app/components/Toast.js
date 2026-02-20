
const Toast = ({ message, type = 'success' }) => {
    return (
      <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900/90 text-white px-6 py-3 rounded-full shadow-2xl backdrop-blur-md z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          {type === 'success' && (
             <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          )}
          <span className="font-medium text-sm">{message}</span>
      </div>
    )
  }
  
  export default Toast;
