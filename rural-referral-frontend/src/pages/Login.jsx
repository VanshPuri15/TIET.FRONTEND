import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { HeartPulse, Stethoscope, ShieldCheck } from 'lucide-react';
import { login } from '../api/auth';

const Login = () => {
    const [contactNumber, setContactNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await login({ contact: contactNumber, password });
            if (data && data.token) {
                localStorage.setItem('token', data.token);
                navigate('/');
            } else {
                setError('Invalid contact number or password');
            }
            setIsLoading(false);
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex selection:bg-brand-100 selection:text-brand-900 bg-surface-50">
            {/* Left Panel - Healthcare Branding */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 bg-brand-900 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop" alt="Clinical setting" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" />
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
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight font-display">
                            Intelligent <br />
                            Care Routing.
                        </h2>
                        <p className="text-lg text-brand-100 max-w-md font-medium leading-relaxed">
                            Empowering rural health workers with instant, data-driven hospital matches for critical patients.
                        </p>

                        <div className="mt-12 flex gap-6 text-brand-200 text-sm font-semibold tracking-wide">
                            <div className="flex items-center gap-2">
                                <Stethoscope className="w-4 h-4" /> Clinical Precision
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Secure Network
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative bg-white">
                <div className="w-full max-w-[420px]">

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
                        <h2 className="text-3xl font-bold text-surface-900 font-display tracking-tight">Welcome back</h2>
                        <p className="mt-3 text-surface-500 text-base font-medium">
                            Please enter your details to access the network.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
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
                                <Label htmlFor="contactNumber">Staff Contact Number</Label>
                                <Input
                                    id="contactNumber"
                                    type="text"
                                    placeholder="Enter registered number"
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <Label htmlFor="password" className="mb-0">Secure Password</Label>
                                    <a href="#" className="text-sm font-semibold text-brand-600 hover:text-brand-800 transition-colors">
                                        Forgot password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full text-base py-6"
                            isLoading={isLoading}
                        >
                            Sign in to network
                        </Button>
                    </form>

                    <div className="mt-10 text-center text-sm">
                        <span className="text-surface-500">Don't have an account? </span>
                        <Link to="/signup" className="font-bold text-brand-600 hover:text-brand-800 transition-colors">
                            Request access
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
