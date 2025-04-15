import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

const CertificateOfNstp = ({ title, content }) => {
    const apiUrl = import.meta.env.VITE_API_REQUEST;
    const headerName = import.meta.env.VITE_HEADER_URL;
    const apiKey = import.meta.env.VITE_API_KEY;
    const [isOpen, setIsOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selected, setSelected] = useState(location.pathname);
    const user = location.state?.user || JSON.parse(localStorage.getItem("userData"));
    const [formData, setFormData] = useState({
        fullName: "",
        program: "",
        schoolyear: "",
        serialnumber: "",
        school: "",
        purpose:""

    });
    const resetForm=()=>{
        setFormData({
            fullName: "",
            program: "",
            schoolyear: "",
            serialnumber: "",
            school: "",
            purpose:""
        })
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        const isValid = form.checkValidity();

        if (!isValid) {
            Swal.fire({
                icon: "error",
                title: "Incomplete Form",
                text: "Please fill out all required fields before submitting.",
                confirmButtonText: "OK",
                confirmButtonColor: "#d33",
            });
            return;
        }
           if (!navigator.onLine) {
              Swal.fire({
                icon: 'error',
                title: 'No Internet',
                text: 'You are currently offline. Please check your connection.',
                toast: true,
                timer: 3000,
                position: 'top-end',
                showConfirmButton: false,
              });
              return;
            }

        // Show confirmation dialog before submitting
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to submit this request?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, submit it!",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#d33",
            background: "#fff",
            customClass: {
                popup: "p-6 rounded-lg shadow-lg",
                title: "text-lg font-bold text-gray-900", // Larger text size
                htmlContainer: "text-base text-gray-700", // Adjusted text size
                confirmButton: "bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded",
                cancelButton: "bg-red-500 hover:bg-red-600 text-white  py-2 px-4 rounded",
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "<span class='text-xl font-semibold'>Submitting request...</span>",
                    width: window.innerWidth < 768 ? "80vw" : "400px",
                    background: "#f0f0f0",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                    customClass: {
                        popup: "p-6 rounded-lg shadow-lg",
                        title: "text-xl font-semibold text-gray-900", // Increased text size for "Submitting request..."
                    },
                });

                try {
                    const response = await axios.post(apiUrl, {
                        resident_id: user.resident_id,
                        email: user.email,
                        certificate_type: "Certification of NSTP",
                        status: "Pending",
                        certificate_details: {
                            template: "nstp",
                            fullName: formData.fullName,
                            schoolyear: formData.schoolyear,
                            program: formData.program,
                            serialnumber: formData.serialnumber,
                            school: formData.school,
                            purpose:formData.purpose
                        },
                    }, {
                        headers: {

                           [headerName]:apiKey
                        }
                    });

                    Swal.fire({
                        icon: "success",
                        title: "<span class='text-xl font-bold'>✅ Request Submitted!</span>",
                        text: "Your request has been successfully sent. We will process it soon.",
                        background: "#E6FFFA",
                        color: "#065F46",
                        width: window.innerWidth < 768 ? "75vw" : "400px",
                        confirmButtonText: "OK",
                        customClass: {
                            popup: "p-6 rounded-lg shadow-lg overflow-hidden", // Prevent scrolling
                            title: "text-xl font-bold text-green-800",
                            htmlContainer: "text-lg text-gray-700", // Increased text size
                            confirmButton: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded",
                        },
                    });
                    resetForm();
                    setIsFormOpen(false);
                } catch (error) {
                    console.error("Error submitting request:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Submission Failed",
                        text: "There was an error submitting your request. Please try again later.",
                        confirmButtonText: "OK",
                        confirmButtonColor: "#d33",
                    });
                }
            }
        });
    };

    return (
        <div className="p-4 border rounded-lg w-[75%] mx-auto mt-10">
            {/* Toggle Dropdown */}
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-medium">{title}</span>
                {isOpen ? <FaChevronUp className="text-xl" /> : <FaChevronDown className="text-xl" />}
            </div>

            {/* Dropdown Content (Animated) */}
            <motion.div
                initial={{ maxHeight: 0, opacity: 0, padding: 0, marginTop: 0 }}
                animate={
                    isOpen
                        ? { maxHeight: 500, opacity: 1, padding: "12px", marginTop: "12px" }
                        : { maxHeight: 0, opacity: 0, padding: 0, marginTop: 0 }
                }
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className={`overflow-hidden bg-white rounded-lg ${!isOpen ? "hidden" : "block"} p-4`}
            >
                <p className="text-gray-700">{content}</p>

                {/* Buttons */}
                <div className="mt-4 flex gap-3">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                        onClick={() => setIsFormOpen(true)}
                    >
                        Request
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </button>
                </div>
            </motion.div>

            {/* Request Form (Modal) */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md"
                    >
                        <h2 className="text-xl font-bold mb-4">Request Certificate Of Nstp</h2>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium">Enter your full name.</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={(e) => {
                                        setFormData({ ...formData, fullName: e.target.value.toUpperCase() });
                                    }}
                                    required
                                />
                            </div>


                            <div>
                                <label className="block text-sm font-medium">School Year</label>
                                <input
                                    type="text"
                                    name="schoolyear"
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter school year (e.g., 2023-2024)"
                                    value={formData.schoolyear}
                                    onChange={(e) => {
                                        // Regex to ensure input follows the format "YYYY-YYYY"
                                        const value = e.target.value.replace(
                                            /[^0-9]/g, // Remove non-numeric characters
                                            ''
                                        ).slice(0, 8); // Limit to 8 characters (YYYYYYYY)

                                        // Add the dash if 4 characters are entered
                                        const formattedValue =
                                            value.length >= 5 ? `${value.slice(0, 4)}-${value.slice(4)}` : value;

                                        setFormData({ ...formData, schoolyear: formattedValue });
                                    }}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Nstp Program</label>
                                <select
                                    name="program"
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.program}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select NSTP program</option>
                                    <option value="Reserve Officers' Training Corps">Reserve Officers' Training Corps(ROTC)</option>
                                    <option value="Literacy Training Service">Literacy Training Service (LTS)</option>
                                    <option value="Civic Welfare Training Service (CWTS)">Civic Welfare Training Service (CWTS)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Nstp Control No.</label>
                                <input
                                    type="text"
                                    name="serialnumber"
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your Nstp Serial No."
                                    value={formData.serialnumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Purpose</label>
                                <input
                                    type="text"
                                    name="purpose"
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your purpose"
                                    value={formData.purpose}
                                    onChange={(e) => {
                                        let { name, value } = e.target;

                                        // Capitalize the first letter after a space
                                        value = value
                                            .toLowerCase()
                                            .replace(/\b\w/g, (char) => char.toUpperCase());

                                        setFormData({ ...formData, [name]: value });
                                    }}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">School</label>
                                <input
                                    type="text"
                                    name="school"
                                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your School"
                                    value={formData.school}
                                    onChange={(e) => {
                                        let { name, value } = e.target;

                                        // Capitalize the first letter after a space
                                        value = value
                                            .toLowerCase()
                                            .replace(/\b\w/g, (char) => char.toUpperCase());

                                        setFormData({ ...formData, [name]: value });
                                    }}
                                    required
                                />
                            </div>


                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                                    onClick={() => setIsFormOpen(false)}
                                >
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                                >
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default CertificateOfNstp;

