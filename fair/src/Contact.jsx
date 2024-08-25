import React from 'react'

function Contact() {
  return (
    <>
       <div>
        <h1>Contact Us</h1>

       </div>
    <div>
    <div className="flex space-x-5">
            <p className="text-3xl font-bold  bg-gradient-to-b from-[#ffffff] to-[#3EB0C3] bg-clip-text text-transparent" style={{fontFamily: "'Qwitcher Grypen', cursive"}}>Team Members</p>

            <a href="https://www.linkedin.com/in/nikhil-tiwari-45a18828b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app " target="_blank" rel="noopener noreferrer">
              <div
                className="w-28 h-28 bg-gray-600 rounded-full bg-cover bg-center transform transition-transform duration-300 ease-in-out hover:scale-110"
                style={{ backgroundImage: "url('/nikhil.jpg')" }}
              ></div>
            </a>

            <a href="https://www.linkedin.com/in/mrutyunjay-lodhi-b48171210/" target="_blank" rel="noopener noreferrer">
              <div
                className="w-28 h-28 bg-gray-600 rounded-full bg-cover bg-center transform transition-transform duration-300 ease-in-out hover:scale-110"
                style={{ backgroundImage: "url('/mj.jpg')" }}
              ></div>
            </a>

            <a href="https://www.linkedin.com/in/md-zaid-faizal/" target="_blank" rel="noopener noreferrer">
              <div
                className="w-28 h-28 bg-gray-600 rounded-full bg-cover bg-center transform transition-transform duration-300 ease-in-out hover:scale-110"
                style={{ backgroundImage: "url('zaid.jpg')" }}
              ></div>
            </a>

            <a href="https://www.linkedin.com/in/r-k-shankar-235b99296?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app " target="_blank" rel="noopener noreferrer">
              <div
                className="w-28 h-28 bg-gray-600 rounded-full bg-cover bg-center transform transition-transform duration-300 ease-in-out hover:scale-110"
                style={{ backgroundImage: "url('rk.jpg')" }}
              ></div>
            </a>

            <a href="https://www.linkedin.com/in/rana-prathap-nenavath-bb4971306?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app " target="_blank" rel="noopener noreferrer">
              <div
                className="w-28 h-28 bg-gray-600 rounded-full bg-cover bg-center transform transition-transform duration-300 ease-in-out hover:scale-110"
                style={{ backgroundImage: "url('rana.jpg')" }}
              ></div>
            </a>

          </div>
    </div>
    </>
 
  )
}

export default Contact