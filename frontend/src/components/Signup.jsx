import React from 'react'
import "../App.css"
import { useState } from "react"
import { BASE_URL, MEDIA_URL } from '../../config.jsx'
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext.jsx';

const Signup = () => {
  const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        companyName: "",
        age: "",
        dob: "",
        profilePhoto:""
      })
      const {login}=useAuth()
      const [image, setImage] = useState(null)
      const [imagePreview, setImagePreview] = useState(null)
      const [errors, setErrors] = useState({})
    
      const validateForm = () => {
        const newErrors = {}
    
        if (!formData.name.trim()) {
          newErrors.name = "Name is required"
        }
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.email.trim() || !emailRegex.test(formData.email)) {
          newErrors.email = "Please enter a valid email"
        }
    
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
        if (!passwordRegex.test(formData.password)) {
          newErrors.password = "Password must contain at least 8 characters, one uppercase, one lowercase and one number"
        }
    
        if (!formData.companyName.trim()) {
          newErrors.companyName = "Company name is required"
        }
    
        if (!formData.age || formData.age < 18) {
          newErrors.age = "You must be at least 18 years old"
        }
    
        if (!formData.dob) {
          newErrors.dob = "Date of birth is required"
        }
    
        if (!image) {
          newErrors.image = "Profile image is required"
        }
    
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
      }
    
      const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }))
      }
    
      const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
          if (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg") {
            setImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
              setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
          } else {
            setErrors((prev) => ({
              ...prev,
              image: "Please upload only PNG or JPG images",
            }))
          }
        }
      }

      const uploadImage = async () => {
        const imageData = new FormData();
        imageData.append("file", image);
    
        try {
          const response = await fetch(`${BASE_URL}/auth/upload`, {
            method: "POST",
            body: imageData,
          });
    
          const data = await response.json();
          if (response.ok && data?.imageUrl) {
            // console.log(data.imageUrl);
            return data.imageUrl; // Assuming the response returns { url: "uploaded_image_url" }
          } else {
            throw new Error(data.message || "Image upload failed.");
          }
        } catch (error) {
          setErrors((prev) => ({ ...prev, image: error.message }));
          return null;
        }
      };
    
      const handleSubmit = async(e) => {
        e.preventDefault()
        if (validateForm()) {
          console.log("Form Data:", formData)
          console.log("Image:", image)
          try {
            // const payload = new FormData();
            // payload.append("email", formData.email);
            // payload.append("password", formData.password);
            // payload.append("profileImage", image);
            // payload.append("companyName",formData.companyName)
            // payload.append("dob",formData.dob)
            // payload.append("age",formData.age)
      
            const imageUpload=await uploadImage()
            // console.log(imageUpload);
            if(!imageUpload){
              throw new Error("IMAGE UPLOAD FAILED")
            }
            const payload = {
              email: formData.email,
              password: formData.password,
              companyName: formData.companyName,
              name:formData.name,
              dob: formData.dob,
              age: formData.age,
              profilePhoto:`${MEDIA_URL}${imageUpload}`
            };
            const response = await fetch(`${BASE_URL}/auth/signup`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json", // Important for JSON payloads
              },
              body: JSON.stringify(payload),
            });
      
            const data = await response.json();
      
            console.log(data.content.accessToken);
            console.log(response.ok);
            if (response.ok) {
              // login(data.content.accessToken); // Save token in context & localStorage
              navigate("/login"); // Redirect to dashboard
            } else {
              setErrors(data.message || "Signup failed. Please try again.");
            }
          } catch (err) {
            setErrors("Network error. Please try again later.");
          }
        }
      }
    
      return (
        <div className="app-container">
          <div className="form-container">
            <div className="form-header">
              <h2>Create Account</h2>
              <p>Fill in your details to create a new account</p>
            </div>
    
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                  />
                  {errors.name && <span className="error">{errors.name}</span>}
                </div>
    
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                  />
                  {errors.email && <span className="error">{errors.email}</span>}
                </div>
              </div>
    
              <div className="form-grid">
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} />
                  {errors.password && <span className="error">{errors.password}</span>}
                </div>
    
                <div className="form-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Company Ltd."
                  />
                  {errors.companyName && <span className="error">{errors.companyName}</span>}
                </div>
              </div>
    
              <div className="form-grid">
                <div className="form-group">
                  <label>Age</label>
                  <input type="number" name="age" value={formData.age} onChange={handleInputChange} min="18" />
                  {errors.age && <span className="error">{errors.age}</span>}
                </div>
    
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} />
                  {errors.dob && <span className="error">{errors.dob}</span>}
                </div>
              </div>
    
              <div className="form-group">
                <label>Profile Image</label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleImageChange}
                  className="file-input"
                />
                {errors.image && <span className="error">{errors.image}</span>}
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview || "/placeholder.svg"} alt="Preview" />
                  </div>
                )}
              </div>
    
              <button type="submit" className="submit-button">
                Create Account
              </button>
            </form>
            <p>
        already have an account? <a href="/login">Login</a>
      </p>
          </div>
        </div>
      )
}

export default Signup