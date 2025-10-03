import React from 'react';
import RegisterForm from '../../components/auth/RegisterForm';

const RegisterPage = () => {
    return (
        <div className="container">
            <div className="form-container">
                <h2 className='text-white flex text-center justify-center text-2xl font-bold mt-3'>Create a New Account</h2>
                <RegisterForm />
            </div>
        </div>
    );
};

export default RegisterPage;