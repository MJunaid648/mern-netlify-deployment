import { useRef, useState } from "react";
import { fetchPresignedUrl, uploadToS3 } from "../utils/utils";
import Loader from "../components/Loader";

const Home = ({ handlePageChange }) => {
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [videoSource, setVideoSource] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const videoRef = useRef(null);
  const liveStreamRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [videoBlob, setVideoBlob] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    jobTitle: "",
    experience: "",
    industry: "",
  });

  const startRecording = async () => {
    setVideoSource(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      liveStreamRef.current = stream;

      // Display live preview
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data); // Push data to ref array
          // console.log("Chunk added:", e.data);
        }
      };

      recorder.onstop = async () => {
        if (recordedChunksRef.current.length > 0) {
          const blob = new Blob(recordedChunksRef.current, {
            type: "video/webm",
          });
          setVideoBlob(blob);

          const videoUrl = URL.createObjectURL(blob);
          setVideoSource(videoUrl);
          recordedChunksRef.current = []; // Clear chunks in ref after creating video

          // Example: Uploading the video blob using a pre-signed URL
        } else {
          console.warn("No recorded chunks available.");
        }

        // Stop live preview
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      };
      setMediaRecorder(recorder);
      recorder.start(200); // Collect data every 200ms
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert(
        "Could not access camera and microphone. Please check permissions."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      if (liveStreamRef.current) {
        liveStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      setIsRecording(false);
    }
  };
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoSource(URL.createObjectURL(file));
    }
  };
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const videoObjectKey = `${formData.email}/${formData.fullName}_video.webm`;
      const presignedVideoUrl = await fetchPresignedUrl(videoObjectKey);

      const resumeObjectKey = `${formData.email}/${formData.fullName}_resume.pdf`;
      const presignedResumeUrl = await fetchPresignedUrl(resumeObjectKey);

      await uploadToS3(presignedVideoUrl, videoBlob, "video/webm");
      await uploadToS3(presignedResumeUrl, resumeFile, "application/pdf");
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setLoading(false);
    handlePageChange("thankyou");
  };
  
  const questions = [
    "Tell us about your professional background and key achievements",
    "What are your core technical skills and how have you applied them?",
    "Describe a challenging project you led and its outcome",
    "How do you handle difficult workplace situations?",
    "What are your career goals and aspirations?",
    "Why should companies consider you for their team?",
  ];

  return (
    <>
      {loading && <Loader />}
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

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full opacity-50"></div>
            <h1 className="font-poppins text-3xl font-bold text-[#2d3748] mb-4 relative">
              Video Submission Portal
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fas fa-video text-blue-500"></i>
              </div>
            </h1>
            <div className="space-y-4 text-[#4a5568]">
              <p className="font-poppins">
                Welcome to the TalentMatch video submission portal! This is your
                chance to stand out to potential employers.
              </p>
              <ul className="list-none pl-5 space-y-4">
                <li className="flex items-center">
                  <i className="fas fa-clock text-[#4a90e2] mr-3"></i>
                  Please prepare a video that is 8-10 minutes in length
                </li>
                <li className="flex items-center">
                  <i className="fas fa-list-check text-[#4a90e2] mr-3"></i>
                  Address all questions listed below in your submission
                </li>
                <li className="flex items-center">
                  <i className="fas fa-user-tie text-[#4a90e2] mr-3"></i>
                  Wear professional attire and ensure good lighting
                </li>
                <li className="flex items-center">
                  <i className="fas fa-volume-off text-[#4a90e2] mr-3"></i>
                  Find a quiet space with minimal background noise
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <h2 className="font-poppins text-2xl font-bold text-[#2d3748] mb-6">
              Questions to Address in Your Video
            </h2>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                    {index + 1}
                  </div>
                  <p className="font-poppins pt-1">{question}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="font-poppins text-2xl font-bold text-[#2d3748] mb-6 flex items-center">
              <i className="fas fa-camera text-[#4a90e2] mr-3"></i>
              Video Submission
            </h2>
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-50"></div>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4 relative z-10">
                  {videoSource ? (
                    <video
                      src={videoSource}
                      controls
                      className="w-full h-full border rounded-md"
                    />
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        className="w-full h-full border rounded-md"
                        autoPlay
                        muted
                      />
                      {/* <p className="text-red-600 mt-[5px] text-sm">
                    Please upload an introductory video
                  </p> */}
                    </>
                  )}
                </div>

                <div className="flex gap-4 justify-center relative z-10">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`px-6 py-2 rounded-lg font-poppins flex items-center ${
                      isRecording
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-[#4a90e2] hover:bg-[#357abd] text-white"
                    }`}
                  >
                    <i
                      className={`fas ${
                        isRecording ? "fa-stop" : "fa-video"
                      } mr-2`}
                    ></i>
                    {isRecording ? "Stop Recording" : "Start Recording"}
                  </button>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg cursor-pointer font-poppins flex items-center"
                  >
                    <i className="fas fa-upload mr-2"></i>
                    Upload Video
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="font-poppins text-2xl font-bold text-[#2d3748] mb-6">
              Resume Upload
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer block">
                <i className="fas fa-file-upload text-4xl text-[#4a90e2] mb-4"></i>
                <p className="font-poppins mb-2">
                  Drop your resume here or click to upload
                </p>
                <p className="text-sm text-gray-500">
                  Accepted formats: PDF, DOC, DOCX
                </p>
              </label>
              {resumeFile && (
                <div className="mt-4 text-left bg-gray-50 p-4 rounded-lg">
                  <p className="font-poppins">
                    <i className="fas fa-file-alt text-[#4a90e2] mr-2"></i>
                    {resumeFile.name}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="font-poppins text-2xl font-bold text-[#2d3748] mb-6">
              Basic Information
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div>
                <label className="block font-poppins text-sm font-medium text-[#2d3748] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-poppins text-sm font-medium text-[#2d3748] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-poppins text-sm font-medium text-[#2d3748] mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-poppins text-sm font-medium text-[#2d3748] mb-2">
                  Current/Most Recent Job Title
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, jobTitle: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-poppins text-sm font-medium text-[#2d3748] mb-2">
                  Years of Experience
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select experience</option>
                  <option value="0-2">0-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>
              <div>
                <label className="block font-poppins text-sm font-medium text-[#2d3748] mb-2">
                  Industry
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData({ ...formData, industry: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select industry</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={!videoSource || !resumeFile}
                className={`w-full py-3 rounded-lg font-poppins text-white ${
                  videoSource && resumeFile
                    ? "bg-[#4a90e2] hover:bg-[#357abd]"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Submit Application
              </button>
            </form>
          </div>
        </main>

        <footer className="bg-white mt-12 py-8 border-t">
          <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-poppins text-sm text-gray-600">
              © 2025 TalentMatch. All rights reserved.
            </div>
            <div className="flex gap-6">
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
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
