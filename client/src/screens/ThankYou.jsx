function ThankYou({ handlePageChange }) {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <a
              href="/"
              className="font-poppins text-2xl font-bold text-[#2d3748]"
            >
              TalentMatch
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-48 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="bg-white rounded-lg shadow-lg p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full mx-auto flex items-center justify-center">
              <i className="fas fa-check text-4xl text-green-500"></i>
            </div>
          </div>
          <h1 className="font-poppins text-3xl font-bold text-[#2d3748] mb-4">
            Application Submitted Successfully!
          </h1>
          <p className="font-poppins text-lg text-[#4a5568] mb-8">
            Thank you for submitting your video application. Our team will
            review your submission and get back to you soon.
          </p>
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="font-poppins text-xl font-semibold text-[#2d3748] mb-4">
                What's Next?
              </h2>
              <ul className="space-y-4 text-left">
                <li className="flex items-center">
                  <i className="fas fa-envelope text-[#4a90e2] mr-3"></i>
                  <span className="font-poppins">
                    You'll receive a confirmation email shortly
                  </span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-clock text-[#4a90e2] mr-3"></i>
                  <span className="font-poppins">
                    Application review typically takes 2-3 business days
                  </span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-video text-[#4a90e2] mr-3"></i>
                  <span className="font-poppins">
                    Your video will be processed and optimized by our AI system
                  </span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handlePageChange("home")}
                className="font-poppins px-8 py-3 bg-[#4a90e2] text-white rounded-lg hover:bg-[#357abd]"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white mt-12 py-8 px-4 border-t">
          <p className="font-poppins text-sm text-gray-600 text-right">
            © 2025 TalentMatch. All rights reserved.
          </p>
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* <div className="flex gap-6">
            <a
              href="/privacy"
              className="font-poppins text-sm text-[#4a90e2] hover:text-[#357abd]"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="font-poppins text-sm text-[#4a90e2] hover:text-[#357abd]"
            >
              Terms of Service
            </a>
            <a
              href="/support"
              className="font-poppins text-sm text-[#4a90e2] hover:text-[#357abd]"
            >
              Contact Support
            </a>
          </div> */}
        </div>
      </footer>
    </div>
  );
}

export default ThankYou;
