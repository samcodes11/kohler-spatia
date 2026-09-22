import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Lock, Mail, User, ShieldCheck } from 'lucide-react';

export const AuthModal: React.FC = () => {
const { isAuthModalOpen, closeAuthModal, login, signup, loginWithGoogle, authIntent } = useAuth();
const [username, setUsername] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [mode, setMode] = useState<'signin' | 'signup'>('signin');
const [validationError, setValidationError] = useState<string | null>(null);

if (!isAuthModalOpen) return null;

const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
setValidationError(null);

const cleanEmail = email.trim();
if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
setValidationError('Please enter a valid architectural email address.');
return;
}

if (!password || password.length < 6) {
setValidationError('Password must be at least 6 characters.');
return;
}

if (mode === 'signup') {
const cleanUsername = username.trim();
if (!cleanUsername || cleanUsername.length < 3) {
setValidationError('Username must be at least 3 characters.');
return;
}
signup(cleanUsername, cleanEmail, password);
} else {
login(cleanEmail, password);
}
};

const handleModeSwitch = (newMode: 'signin' | 'signup') => {
setMode(newMode);
setValidationError(null);
};

const getIntentMessage = () => {
switch (authIntent) {
case 'wishlist':
return 'Sign in to save fixtures to your private design wishlist and receive finish availability alerts.';
case 'cart':
return 'Sign in to manage your project cart, lock in trade pricing, and order curated sample finishes.';
case 'save':
return 'Sign in to store your 3D spatial models, contractor briefs, and custom room layouts across devices.';
default:
return 'Access your personal spatial dashboard, saved renovation blueprints, and AI design consultations.';
}
};

return (
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fade-in">
<div className="relative w-full max-w-md bg-porcelain border border-stone/30 shadow-luxury rounded-sm overflow-hidden p-8">
{/* Close Button */}
<button 
onClick={closeAuthModal}
className="absolute top-4 right-4 p-1.5 text-stone hover:text-ink transition-colors"
aria-label="Close"
>
<X size={20} />
</button>

{/* Wordmark Header */}
<div className="mb-6 text-center">
        <div className="inline-flex items-baseline gap-1.5 justify-center">
          <span className="text-2xl font-bold tracking-widest text-ink uppercase font-sans">Spatia</span>
        </div>
<p className="text-sm uppercase tracking-brand font-mono font-bold text-stone mt-1">Spatial Identity & Access</p>
</div>

{/* Intent Callout Banner */}
<div className="mb-6 p-3.5 bg-porcelain-warm border-l-2 border-accent text-sm text-ink font-medium leading-relaxed flex items-start gap-2.5">
<ShieldCheck size={18} className="text-accent shrink-0 mt-0.5" />
<span>{getIntentMessage()}</span>
</div>

{/* Social Google Login */}
<button
type="button"
onClick={loginWithGoogle}
className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-stone/40 bg-white hover:bg-porcelain-warm transition-all duration-200 text-base font-bold text-ink shadow-sm mb-5 group"
>
<svg className="w-5 h-5" viewBox="0 0 24 24">
<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
</svg>
<span className="group-hover:text-ink">Continue with Google (Demo 1-Click)</span>
</button>

<div className="relative flex items-center justify-center mb-5">
<div className="border-t border-stone/30 w-full"></div>
<span className="bg-porcelain px-3 text-xs font-mono uppercase font-bold text-stone tracking-wider">or email access</span>
<div className="border-t border-stone/30 w-full"></div>
</div>

{/* Validation Error Alert */}
{validationError && (
<div className="mb-4 p-3 bg-red-50 border border-red-200 text-sm font-mono font-bold text-red-700 rounded-sm animate-fade-in">
{validationError}
</div>
)}

{/* Email Password Form */}
<form onSubmit={handleSubmit} className="space-y-4">
{mode === 'signup' && (
<div>
<label className="block text-sm font-mono uppercase font-bold tracking-wider text-ink mb-1.5">
Username <span className="text-accent">*</span>
</label>
<div className="relative">
<User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
<input
type="text"
required
value={username}
onChange={e => setUsername(e.target.value)}
placeholder="e.g. vikram_architect"
className="w-full pl-10 pr-3 py-2.5 text-base font-medium text-ink bg-white border border-stone/40 focus:border-accent focus:outline-none transition-colors"
/>
</div>
</div>
)}

<div>
<label className="block text-sm font-mono uppercase font-bold tracking-wider text-ink mb-1.5">
Email Address <span className="text-accent">*</span>
</label>
<div className="relative">
<Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
<input
type="email"
required
value={email}
onChange={e => setEmail(e.target.value)}
placeholder="architect@domain.com"
className="w-full pl-10 pr-3 py-2.5 text-base font-medium text-ink bg-white border border-stone/40 focus:border-accent focus:outline-none transition-colors"
/>
</div>
</div>

<div>
<label className="block text-sm font-mono uppercase font-bold tracking-wider text-ink mb-1.5">
Password <span className="text-accent">*</span>
</label>
<div className="relative">
<Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
<input
type="password"
required
value={password}
onChange={e => setPassword(e.target.value)}
placeholder="••••••••"
className="w-full pl-10 pr-3 py-2.5 text-base font-medium text-ink bg-white border border-stone/40 focus:border-accent focus:outline-none transition-colors"
/>
</div>
</div>

<button
type="submit"
className="w-full py-3.5 px-4 bg-ink hover:bg-ink-muted text-white font-bold text-sm tracking-widest uppercase font-mono transition-all duration-200 shadow-md mt-2"
>
{mode === 'signin' ? 'Log In' : 'Create Account'}
</button>
</form>

{/* Toggle Mode */}
<div className="mt-5 text-center text-sm text-stone-dark font-medium">
{mode === 'signin' ? (
<span>
Don't have an architectural account?{' '}
<button 
type="button" 
onClick={() => handleModeSwitch('signup')} 
className="text-ink font-bold underline underline-offset-4 hover:text-accent font-mono uppercase text-xs"
>
Sign up
</button>
</span>
) : (
<span>
Already registered?{' '}
<button 
type="button" 
onClick={() => handleModeSwitch('signin')} 
className="text-ink font-bold underline underline-offset-4 hover:text-accent font-mono uppercase text-xs"
>
Log in
</button>
</span>
)}
</div>
</div>
</div>
);
};
