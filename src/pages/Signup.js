import React from "react";
import signupImg from "../assets/Images/signup.webp"
import Template from "../components/core/auth/template"

const Signup = ({setIsLoggedIn}) => {
    return(
        <div>
            <Template
            title="Join the millions learning to code with StudyNotion for free"
            desc1="Build skills for today, tomorrow, and beyond."
            desc2="Education to future-proof your career."
            image={signupImg}
            formtype="signup"
            setIsLoggedIn={setIsLoggedIn}
            />
        </div>
    )
}

export default Signup