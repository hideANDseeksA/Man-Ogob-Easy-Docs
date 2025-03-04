import React from 'react'
import TermsSection from './TermSection';

const TermsAndCondition = ({ isOpen, onClose, onAccept }) => {
    if (!isOpen) return null;

    const handleDecline = () => {
        onAccept(false); // Uncheck the checkbox
        onClose(); // Close modal
    };

    const handleAccept = () => {
        onAccept(true); // Check the checkbox
        onClose(); // Close modal
    };

    return (
        <div className='w-screen h-full bg-white z-50  fixed inset-0 flex flex-col items-center justify-center pt-2'>

            <div className='w-[80%] h-[90vh] flex-col md:pb-20 pb-36'>
                <div className='h-20 flex-col items-center  text-white bg-[#376a63] rounded-[5px] p-5'>
                    <h1 className='text-[22px] font-semibold' >Terms and Condition</h1>
                    <p className='text-[16px] text-black'>Last updated: March 3rd, 2025</p>
                </div>

                <div className='flex bg-white h-full justify-center'>
                    <div className='w-[30%] h-full p-5 md:p-10 hidden md:block '>
                        <h3 className='text-[18px] font-semibold'>Contents</h3>

                        <ul className='flex-col space-y-3 mt-2 text-[16px] font-semibold'>
                            <li>Introduction</li>
                            <li>1. Acceptance of Terms</li>
                            <li>2. Purpose of the Service</li>
                            <li>3. User Registration</li>
                            <li>4. Data Collection and Privacy</li>
                            <li>5. User Responsibilities</li>
                            <li>6. Barangay Officials Role</li>
                            <li>7. Intellectual Property</li>
                            <li>8. Disclaimer of Warranties</li>
                            <li>9. Limitation of Liability</li>
                            <li>10. Termination</li>
                            <li>11. Governing Law</li>
                            <li>12. Contact Us</li>




                        </ul>
                    </div>
                    <div className='md:w-[70%] h-full p-2 md:p-10 overflow-y-auto w-[100%]'>

                        <TermsSection
                            title='Introduction'
                            content='Welcome to EasyDocs ("we," "our," "us"). These Terms and Conditions ("Terms") govern your use of the EasyDocs website and services (the "Service"). The Service is designed to assist barangay residents in simplifying administrative processes, such as issuing 
                            barangay certifications and other related documents. By accessing or using the EasyDocs, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use the Service.'
                        />
                        <TermsSection
                            title='1. Acceptance of Terms'
                            content='By using the Service, you confirm that you are at least 18 years old or the age of majority in your jurisdiction, and you have the legal capacity to enter into these Terms. If you are using the Service on behalf of a barangay or organization, you represent that you have the authority to bind that entity to these Terms.'
                        />
                        <TermsSection
                            title='2. Purpose of the Service'
                            content='EasyDocs is designed to streamline administrative processes for barangays, including but not limited to:
•	Issuing barangay certifications.
•	Facilitating communication between barangay officials and residents.
'
                        />
                        <TermsSection
                            title='3. User Registration'
                            content='To use the Service, you must register for an account and provide accurate and complete personal information, including but not limited to:
•	Contact information
•	 You are required to register with the barangay administration to get your Resident ID.
You agree to keep your account information up to date and notify us immediately of any unauthorized use of your account.
'
                        />
                        <TermsSection
                            title='4. Data Collection and Privacy'
                            content='Your use of the Service is subject to our Privacy Policy, which explains how we collect, use, and protect your personal information. By using the Service, you agree to the terms of our Privacy Policy. We collect personal information solely for the purpose of providing the Service and complying with barangay requirements.'
                        />
                        <TermsSection
                            title='5. User Responsibilities'
                            content='You agree to:
•	Provide accurate and truthful information during registration and when requesting documents.
•	Use the Service only for lawful purposes and in compliance with these Terms.
•	Not misuse the Service by submitting false information, impersonating others, or engaging in fraudulent activities.
'
                        />
                        <TermsSection
                            title='6. Barangay Officials Role'
                            content='Barangay officials using the Service are responsible for:
•	Verifying the accuracy of information provided by users.
•	Issuing requested documents in a timely manner.
•	Maintaining the confidentiality of user data.
'
                        />
                        <TermsSection
                            title='7. Intellectual Property'
                            content='All content, features, and functionality on the Service, including but not limited to text, graphics, logos, and software, are the property of EasyDocs or its licensors and are protected by intellectual property laws. You may not use, reproduce, or distribute any content from the Service without our prior written permission.'
                        />
                        <TermsSection
                            title='8. Disclaimer of Warranties'
                            content='The Service is provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not guarantee that the Service will be error-free, secure, or uninterrupted. EasyDocs is not responsible for the accuracy or legitimacy of documents issued by barangay officials through the Service.'
                        />
                        <TermsSection
                            title='9. Limitation of Liability'
                            content='To the fullest extent permitted by law, EasyDocs shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the Service, including but not limited to delays in document processing or errors in issued documents.'
                        />
                        <TermsSection
                            title='10. Termination'
                            content='We reserve the right to terminate or suspend your access to the Service at any time, without notice, for any reason, including but not limited to a violation of these Terms or fraudulent activity.'
                        />
                        <TermsSection
                            title='11. Governing Law'
                            content='These Terms shall be governed by and construed in accordance with the laws of the Republic of the Philippines, without regard to its conflict of law principles.'
                        />
                        <TermsSection
                            title='12. Contact Us'
                            content='If you have any questions about these Terms or the Service, please contact us at:
Email: easydocs@gmail.com
Address: idk this one 
Phone: 09090909014
'
                        />
                    </div>

                </div>
                <div className='w-[80%] md:w-[70%]  justify-center fixed bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-10'>
        <button 
        onClick={handleDecline}
        className='px-6 py-2 bg-white border border-black rounded-[5px] hover:bg-gray-100'>
          Decline
        </button>
        <button
        onClick={handleAccept}
        className='px-6 py-2 bg-[#376a63] text-white rounded-[5px] hover:bg-[#2a524d]'>
          Accept
        </button>
      </div>
            </div>

        </div>
    )
}

export default TermsAndCondition
