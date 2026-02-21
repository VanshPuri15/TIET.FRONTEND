import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { HeartPulse, UserPlus, FileCheck, Stethoscope } from 'lucide-react';
import { signup } from '../api/auth';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        clinic: '',
        location: '',
        contact: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (formData.name && formData.contact && formData.password.length >= 6) {
                await signup(formData);
                setIsSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError('Please fill all fields and ensure password is >= 6 chars');
            }
            setIsLoading(false);
        } catch (err) {
            setError('Registration failed. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex selection:bg-brand-100 selection:text-brand-900 bg-surface-50">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 bg-brand-900 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop" alt="Medical Network" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-900/80 to-transparent"></div>
                </div>

                <div className="relative z-10 p-12 h-full flex flex-col pt-16">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-soft">
                            <HeartPulse className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight font-display">
                            Referral Opt
                        </h1>
                    </div>

                    <div className="mt-auto pb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-brand-100 text-xs font-bold uppercase tracking-widest backdrop-blur-md border border-white/10 mb-6">
                            Join the Network
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-8 leading-tight font-display">
                            Modernizing rural <br />patient transfers.
                        </h2>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="mt-1 w-8 h-8 rounded-full bg-brand-800 flex items-center justify-center shrink-0 border border-brand-700">
                                    <UserPlus className="w-4 h-4 text-brand-300" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Create Profile</h3>
                                    <p className="text-sm text-brand-200 mt-1">Register your primary care facility</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="mt-1 w-8 h-8 rounded-full bg-brand-800 flex items-center justify-center shrink-0 border border-brand-700">
                                    <FileCheck className="w-4 h-4 text-brand-300" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Submit Findings</h3>
                                    <p className="text-sm text-brand-200 mt-1">Log critical patient presentations</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="mt-1 w-8 h-8 rounded-full bg-brand-800 flex items-center justify-center shrink-0 border border-brand-700">
                                    <Stethoscope className="w-4 h-4 text-brand-300" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Instant Routing</h3>
                                    <p className="text-sm text-brand-200 mt-1">Algorithm dictates the optimal destination</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative bg-white py-16 overflow-y-auto hide-scrollbar">
                <div className="w-full max-w-[440px]">

                    <div className="mb-10 lg:hidden">
                        <div className="flex items-center gap-2 justify-center">
                            <div className="w-10 h-10 rounded-xl bg-brand-700 flex items-center justify-center text-white shadow-soft shadow-inner-light">
                                <HeartPulse className="w-5 h-5" />
                            </div>
                            <h1 className="text-2xl font-bold text-surface-900 font-display">
                                Referral Opt
                            </h1>
                        </div>
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-surface-900 font-display tracking-tight">Provider Access</h2>
                        <p className="mt-3 text-surface-500 text-base font-medium">
                            Register your clinic to start submitting referrals.
                        </p>
                    </div>

                    {isSuccess ? (
                        <div className="p-8 text-center bg-brand-50 border border-brand-200 rounded-2xl">
                            <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-brand-900 font-display">Application Approved</h3>
                            <p className="text-brand-700 mt-2 font-medium">Redirecting to secure login facility...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSignup} className="space-y-6">
                            {error && (
                                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700 font-medium flex items-start gap-3 shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <div className="space-y-5">
                                <div>
                                    <Label htmlFor="name">Provider Full Name</Label>
                                    <Input
                                        id="name" name="name" type="text"
                                        placeholder="Dr. Jane Smith"
                                        value={formData.name} onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <Label htmlFor="clinic">Primary Facility</Label>
                                        <Input
                                            id="clinic" name="clinic" type="text"
                                            placeholder="Rural CHC"
                                            value={formData.clinic} onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="location">District / Block</Label>
                                        <Input
                                            id="location" name="location" type="text"
                                            placeholder="Sector 4"
                                            value={formData.location} onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="contact">Secure Contact Number</Label>
                                    <Input
                                        id="contact" name="contact" type="tel"
                                        placeholder="+1 (555) 000-0000"
                                        value={formData.contact} onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="password">Access Phrase</Label>
                                    <Input
                                        id="password" name="password" type="password"
                                        placeholder="••••••••"
                                        value={formData.password} onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full text-base py-6"
                                isLoading={isLoading}
                            >
                                Submit Application
                            </Button>
                        </form>
                    )}

                    {!isSuccess && (
                        <div className="mt-10 text-center text-sm">
                            <span className="text-surface-500">Already registered? </span>
                            <Link to="/login" className="font-bold text-brand-600 hover:text-brand-800 transition-colors">
                                Sign in
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Signup;
