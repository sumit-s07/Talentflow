import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchJobs } from '../api/JobsApi/JobsApi'; 
import { fetchCandidates } from '../api/candidatesApi/candidateApi';


const HomePage: React.FC = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCandidates: 0,
    loading: true
  });
  const navigate = useNavigate();

  const handleJobsClick = () => {
    navigate('/jobs/jobsList');
  };

  useEffect(() => {
    const loadStats = async () => {
      setStats(prev => ({ ...prev, loading: true }));
      try {
        const [jobsResponse, candidatesResponse] = await Promise.all([
          fetchJobs({ page: 1, pageSize: 1 }),
          fetchCandidates({ page: 1, pageSize: 1 })
        ]);
        
        setStats({
          totalJobs: jobsResponse.totalCount,
          totalCandidates: candidatesResponse.totalCount,
          loading: false
        });
      } catch (error) {
        console.error("Failed to load homepage stats:", error);
        setStats({ totalJobs: 0, totalCandidates: 0, loading: false });
      }
    };

    loadStats();
  }, []);

  const GlobalStyles = () => (
    <style>{`
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
    `}</style>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br bg-neutral-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white relative overflow-hidden transition-colors duration-300">
      <GlobalStyles />

      <nav className="relative z-20 max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            TalentFlow
          </div>
          <div className="flex items-center space-x-4">
            
           
          </div>
        </div>
      </nav>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-200 dark:bg-pink-800 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6">
       
        <section className="text-center pt-20 pb-32 relative">
          <h1 className="text-6xl lg:text-7xl font-extrabold leading-tight mb-8">
            Swift{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              recruitment
            </span>{' '}
            for<br />
            current pace of work
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            An all-encompassing remote hiring solution to help modern businesses grow with Virtual Assistants.
          </p>
          <button
            onClick={handleJobsClick}
            className="inline-flex items-center justify-center px-12 py-4 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            Get Started
          </button>

          <div className="absolute top-0 left-0 hidden lg:block animate-float">
            <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center space-x-4 w-72 backdrop-blur-sm">
              <div className="relative">
                <img src="https://i.pravatar.cc/50?img=68" alt="Profile" className="w-12 h-12 rounded-full" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-800 dark:text-gray-100">Alex Jordan</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">Contractor</p>
              </div>
            </div>
          </div>

          <div className="absolute top-10 right-0 hidden lg:block animate-float" style={{ animationDelay: '1s' }}>
            <div className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
              <img src="https://i.pravatar.cc/30?img=47" alt="Profile" className="w-6 h-6 rounded-full border border-white" />
              <div className="text-sm text-left">
                <p className="font-medium">Mark Grotzki</p>
                <p className="text-xs opacity-90">Recruiter</p>
              </div>
            </div>
          </div>
          
          <div className="absolute top-32 right-8 hidden lg:block animate-float" style={{ animationDelay: '2s' }}>
            <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-80 backdrop-blur-sm text-left">
              <div className="flex items-center space-x-3 mb-3">
                <img src="https://i.pravatar.cc/35?img=35" alt="Profile" className="w-8 h-8 rounded-full" />
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">Natalie Monet</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">11:50 AM</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">"Hey, we've got a hot referral for your sales team!"</p>
            </div>
          </div>

          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block animate-float" style={{ animationDelay: '3s' }}>
            <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 flex items-center space-x-6 backdrop-blur-sm">
              <img src="https://i.pravatar.cc/60?img=47" alt="Profile" className="w-16 h-16 rounded-full border-4 border-blue-100 dark:border-blue-800" />
              <div className="text-left">
                <p className="text-xl font-bold text-gray-800 dark:text-gray-100">Olivia Wouters</p>
                <p className="text-gray-600 dark:text-gray-300 mb-3">Product Designer</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">Full Time</span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">Senior Level</span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">Montreal</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-2 text-lg">Total Job Postings</p>
              {stats.loading ? (
                <div className="animate-pulse h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-24 mx-auto"></div>
              ) : (
                <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stats.totalJobs.toLocaleString()}
                </p>
              )}
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-2 text-lg">Total Applicants</p>
              {stats.loading ? (
                <div className="animate-pulse h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-32 mx-auto"></div>
              ) : (
                <p className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {stats.totalCandidates.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </section>

       
        <section className="grid md:grid-cols-3 gap-8 py-20">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-lg text-center transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-4">Create & Edit</h4>
            <p className="text-gray-600 dark:text-gray-300">Easily create new job postings and edit existing ones with our intuitive interface.</p>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-lg text-center transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
              </svg>
            </div>
            <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-4">Organize & Filter</h4>
            <p className="text-gray-600 dark:text-gray-300">Sort, filter, and organize job listings by status, tags, and other criteria.</p>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-lg text-center transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-4">Track Performance</h4>
            <p className="text-gray-600 dark:text-gray-300">Monitor job posting performance and application rates across all positions.</p>
          </div>
        </section>
      </main>
      
      <footer className="relative z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} TalentFlow. Streamlining your hiring process.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;